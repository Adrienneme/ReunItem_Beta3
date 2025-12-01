from app.core import supabase, ACCESS_TOKEN_EXPIRE_MINUTES
from app.schemas import UserSchemas
from app.utils import Security
from fastapi import HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer
from datetime import timedelta
from jwt.exceptions import InvalidTokenError
from app.models.audit_logs import log_action


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


class UserModels:

    @staticmethod
    def create_user(user: UserSchemas.UserCreate, actor_id: str | None = None):
        is_admin = False
        SYSTEM_USER_ID = "00000000-0000-0000-0000-000000000000"
        if actor_id:
            admin_check = supabase.table("user").select("role").eq("user_id", actor_id).execute()
            if admin_check.data and admin_check.data[0]["role"] == "admin":
                is_admin = True
            else:
                actor_id = SYSTEM_USER_ID
        else:
            actor_id = SYSTEM_USER_ID

        existing_user = supabase.table("user").select("*").eq("email", user.email).execute()
        print("CHECKING EMAIL", user.email, existing_user.data)
        if existing_user.data:
            raise HTTPException(status_code=400, detail="Email already registered")

        user_data = user.model_dump()
        user_data["password_hash"] = Security.hash_password(user_data["password_hash"])
        user_data["active_status"] = False

        if is_admin:
            user_data["role"] = user.role.value
        else:
            user_data["role"] = "user"

        response = supabase.table("user").insert(user_data).execute()
        if not response.data:
            log_action(actor_id, "CREATE_USER", "ERR", "Failed to create user", "user")
            raise HTTPException(status_code=500, detail="Failed to create user")

        created_user = response.data[0]
        created_user.pop("password_hash", None)

        log_action(actor_id, "CREATE_USER", "OK", f"Created user {created_user['user_id']}", "user")

        return UserSchemas.User(**created_user)
    
    @staticmethod
    def update_user(target_user_id: str, updates: dict, actor_id: str):
        existing = supabase.table("user").select("*").eq("user_id", target_user_id).execute()
        if not existing.data:
            raise HTTPException(status_code=404, detail="User not found")
        
        if existing.data[0].get("active_status") is True:
            log_action(actor_id, "UPDATE_USER", "ERR", f"Attempted to update active user {target_user_id}", "user")
            raise HTTPException(status_code=400, detail="Cannot update an active user. Ask them to log out first.")

        response = supabase.table("user").update(updates).eq("user_id", target_user_id).execute()
        if not response.data:
            log_action(actor_id, "UPDATE_USER", "ERR", f"Failed to update user {target_user_id}", "user")
            raise HTTPException(status_code=500, detail="Failed to update user")

        updated_user = response.data[0]
        updated_user.pop("password_hash", None)

        log_action(actor_id, "UPDATE_USER", "OK", f"Updated user {target_user_id}","user")

        return UserSchemas.User(**updated_user)
    
    @staticmethod
    def delete_user(target_user_id: str, actor_id: str):
        if actor_id == target_user_id:
            raise HTTPException(status_code=400, detail="Admins cannot delete themselves")

        existing_user = supabase.table("user").select("*").eq("user_id", target_user_id).execute()
        if not existing_user.data:
            raise HTTPException(status_code=404, detail="User not found")
        
        if existing_user.data[0].get("active_status") is True:
            log_action(actor_id, "DELETE_USER", "ERR", f"Attempted to delete active user {target_user_id}", "user")
            raise HTTPException(status_code=400, detail="Cannot delete an active user. Ask them to log out first.")

        delete_res = supabase.table("user").update({"delete_user": True, 
                                                    "email": None, 
                                                    "first_name": "N/A", 
                                                    "last_name": "N/A"}).eq("user_id", target_user_id).execute()
        if not delete_res.data:
            log_action(actor_id, "DELETE_USER", "ERR", f"Failed to delete user {target_user_id}", "user")
            raise HTTPException(status_code=500, detail="Failed to delete user")

        log_action(actor_id,"DELETE_USER", "OK", f"Deleted user {target_user_id}","user")

        return {"message": "User deleted successfully"}


    @staticmethod
    def login_user(user: UserSchemas.UserLogin):
        response = supabase.table("user").select("*").eq("email", user.email).execute()
        if not response.data:
            try:
                log_action("SYSTEM", "LOGIN_USER", "ERR", "Login failed (email not registered)", "user")
            except Exception as e:
                print("LOG ERROR:", e)
                
            raise HTTPException(status_code=401, detail="User not registered")

        user_data = response.data[0]

        if not Security.verify_password(user.password, user_data["password_hash"]):
            log_action(user_data["user_id"], "LOGIN_USER", "ERR", "Incorrect password", "user")
            raise HTTPException(status_code=401, detail="Incorrect password")

 
        supabase.table("user").update({"active_status": True}).eq("user_id", user_data["user_id"]).execute()

        del user_data["password_hash"]

        token = Security.create_user_token(
            data={"sub": str(user_data["email"])},
            expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        )

        log_action(user_data["user_id"], "LOGIN_USER", "OK", "User logged in Successfully", "user")

        return UserSchemas.LoginResponse(
            access_token=token,
            token_type="bearer",
            user=user_data
        )

    @staticmethod
    def logout_user(current_user: UserSchemas.User):
        supabase.table("user").update({"active_status": False}).eq("user_id", current_user.user_id).execute()

        log_action(str(current_user.user_id), "LOGOUT_USER", "OK", "User logged out Successfully", "user")

        return {"message": "Logged out successfully"}

    @staticmethod
    def get_current_active_user(token: str = Depends(oauth2_scheme)) -> UserSchemas.User:
        try:
            payload = Security.verify_user_token(token)
            email: str = payload.get("sub")
            if email is None:
                raise HTTPException(status_code=401, detail="Could not validate credentials")
        except InvalidTokenError:
            raise HTTPException(status_code=401, detail="Could not validate credentials")

        response = supabase.table("user").select("*").eq("email", email).execute()
        if not response.data:
            raise HTTPException(status_code=401, detail="User not found")

        user_data = response.data[0]
        user_data.pop("password_hash", None)

        return UserSchemas.User(**user_data)

    @staticmethod
    def get_user(user_id: str):
        response = supabase.table("user").select("*").eq("user_id", user_id).execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="User not found")

        user_data = response.data[0]
        user_data.pop("password_hash", None)

        return UserSchemas.User(**user_data)

    @staticmethod
    def get_all_users():
        response = supabase.table("user").select("*").execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="No users found")

        cleaned_users = []
        for user in response.data:
            user.pop("password_hash", None)
            cleaned_users.append(UserSchemas.User(**user))

        return cleaned_users
