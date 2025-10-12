import React from "react";
import Button from "@mui/joy/Button";

export default function ButtonUI({
  variant,
  color = "primary",
  children,
  loading = false,
  onClick,
  disabled= false
}) {
  return (
      <Button
        variant={variant}
        color={color}
        loading={loading}
        loadingIndicator="Loading..."
        onClick={onClick}
        disabled={disabled}
      >
        {children}
      </Button>
  );
}

// 🔹 VARIANTS (appearance)
// ------------------------------
// "solid"     → default filled button (strong emphasis)
// "soft"      → lighter background, subtle emphasis
// "outlined"  → border only, transparent background
// "plain"     → no border or background, minimal look

// 🔹 COLORS (theme context)
// ------------------------------
// "primary"   → main theme color (default blue/green)
// "neutral"   → gray tone, for secondary actions
// "danger"    → red tone, for destructive actions (delete, remove)
// "info"      → blue tone, for informational actions
// "success"   → green tone, for success or confirm actions
// "warning"   → yellow/orange tone, for caution actions
// "context"   → inherits color from parent container (Sheet/Card)


// 🔹 OTHER USEFUL PROPS
// ------------------------------
// loading          → shows spinner/loading state
// loadingIndicator → custom text or icon while loading
// disabled         → disables button interaction
// fullWidth        → stretches button to container width
// onClick          → click handler
// variant          → choose from the above variants
// color            → choose from the above colors
// size             → "sm" | "md" | "lg"
