// Shared status banner for the admin pages.

export default function StatusAlert({ type = "error", text }) {
  if (!text) return null;
  const isSuccess = type === "success";
  return (
    <div
      className={`alert ${isSuccess ? "alert-success" : "alert-error"}`}
      role={isSuccess ? "status" : "alert"}
    >
      {text}
    </div>
  );
}
