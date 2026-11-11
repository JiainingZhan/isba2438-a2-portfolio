export default function FieldError({ id, text }) {
  if (!text) return null;
  return (
    <p id={id} className="field-error">
      {text}
    </p>
  );
}
