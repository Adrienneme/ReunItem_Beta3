import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createItem, generateDescription } from "../api/items";
import { useQueryClient, useMutation } from "@tanstack/react-query";

export default function useCreate(defaultType = "found") {
  const navigate = useNavigate();
  
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    item_name: "",
    description: "",
    photo: null,
    pickup_location: "",
    item_type: defaultType,
    status: "Pending Approval",
  });

  const [loading, setLoading] = useState(false);

  const [buttonLoading, setButtonLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageSelect = (file) => {
    setFormData((prev) => ({ ...prev, photo: file }));
  };

  const handlePickupChange = (val) => {
    setFormData((prev) => ({ ...prev, pickup_location: val }));
  };

  const handleGenerate = async () => {
    if (!formData.photo) {
      alert("No photo found!");
      return;
    }

    setLoading(true);
    try {
      const response = await generateDescription(formData.photo);
      setFormData((prev) => ({ ...prev, description: response.description }));
    } catch (error) {
      const errMsg = error.response?.data?.detail || "Failed to generate description.";
      alert(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const mutation = useMutation({
    mutationFn: createItem,
    onMutate: () => setButtonLoading(true),
    onSuccess: () => {
      queryClient.invalidateQueries(["lost_items"]);
      queryClient.invalidateQueries(["found_items"]);
      alert("Entry Submitted!");
      navigate("/user/home");
    },
    onError: (error) => {
      const errMsg = error.response?.data?.detail || "Failed to submit entry.";
      alert(errMsg);
    },
    onSettled: () => setButtonLoading(false),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setButtonLoading(true);

    if (defaultType == "found") {
      if (!formData.item_name || !formData.description || !formData.pickup_location || !formData.photo) {
        alert("Please fill all input fields!");
        setButtonLoading(false);
        return;
      }
    } else {
      if (!formData.item_name || !formData.description) {
        alert("Please fill item name and description!");
        setButtonLoading(false);
        return;
      }
    }

    mutation.mutate(formData);

  };

  return {
    formData,
    setFormData,
    loading,
    buttonLoading,
    handleChange,
    handleImageSelect,
    handlePickupChange,
    handleGenerate,
    handleSubmit,
  };
}
