"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { submitContact } from "@/app/contact-me-server-form/actions";
import FieldError from "@/components/FieldError";

const initialState = {
  id: 0,
  status: "idle",
  message: "",
  errors: {},
  values: { name: "", email: "", message: "" },
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="button" disabled={pending}>
      {pending ? "Sending..." : "Send message"}
    </button>
  );
}

export default function ContactForm() {
  const [state, formAction] = useActionState(submitContact, initialState);
  const { errors, values } = state;

  return (
    <div>
      {state.status === "success" && (
        <div className="alert alert-success" role="status">
          <strong>✓ Message sent.</strong> {state.message}
        </div>
      )}
      {state.status === "error" && (
        <div className="alert alert-error" role="alert">
          <strong>✗ Not sent.</strong> {state.message}
        </div>
      )}

      {/* noValidate: let the server do the validation so its error messages show. */}
      <form action={formAction} className="contact-form" noValidate key={state.id}>
        <div className="field">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            name="name"
            type="text"
            defaultValue={values.name}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "name-error" : undefined}
          />
          <FieldError id="name-error" text={errors.name} />
        </div>

        <div className="field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            defaultValue={values.email}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "email-error" : undefined}
          />
          <FieldError id="email-error" text={errors.email} />
        </div>

        <div className="field">
          <label htmlFor="message">Message</label>
          <textarea
            id="message"
            name="message"
            rows={5}
            defaultValue={values.message}
            aria-invalid={Boolean(errors.message)}
            aria-describedby={errors.message ? "message-error" : undefined}
          />
          <FieldError id="message-error" text={errors.message} />
        </div>

        <SubmitButton />
      </form>
    </div>
  );
}
