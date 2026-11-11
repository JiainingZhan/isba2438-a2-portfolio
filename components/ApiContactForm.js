"use client";

import { useState } from "react";
import FieldError from "@/components/FieldError";

const EMPTY_FORM = { name: "", email: "", message: "" };

export default function ApiContactForm() {
  const [values, setValues] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState(null);
  const [pending, setPending] = useState(false);

  function handleChange(field) {
    return (event) => {
      setValues((prev) => ({ ...prev, [field]: event.target.value }));
    };
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setPending(true);
    setErrors({});
    setAlert(null);

    let response;
    let payload;
    try {
      response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      payload = await response.json();
    } catch {
      setPending(false);
      setAlert({ kind: "failed" });
      return;
    }

    if (response.status === 201) {
      setValues(EMPTY_FORM);
      setAlert({ kind: "success", message: payload.message });
    } else if (response.status === 400) {
      setAlert({ kind: "error", message: payload.message });
      setErrors(payload.errors ?? {});
    } else {
      setAlert({ kind: "failed" });
    }

    setPending(false);
  }

  return (
    <div>
      {alert?.kind === "success" && (
        <div className="alert alert-success" role="status">
          <strong>✓ Message sent.</strong> {alert.message}
        </div>
      )}
      {alert?.kind === "error" && (
        <div className="alert alert-error" role="alert">
          <strong>✗ Not sent.</strong> {alert.message}
        </div>
      )}
      {alert?.kind === "failed" && (
        <div className="alert alert-error" role="alert">
          <strong>✗ Sending failed.</strong> Please try again. This is not a form problem — the
          server could not process your message.
        </div>
      )}

      <form onSubmit={handleSubmit} className="contact-form" noValidate>
        <div className="field">
          <label htmlFor="api-name">Name</label>
          <input
            id="api-name"
            name="name"
            type="text"
            value={values.name}
            onChange={handleChange("name")}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "api-name-error" : undefined}
          />
          <FieldError id="api-name-error" text={errors.name} />
        </div>

        <div className="field">
          <label htmlFor="api-email">Email</label>
          <input
            id="api-email"
            name="email"
            type="email"
            value={values.email}
            onChange={handleChange("email")}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "api-email-error" : undefined}
          />
          <FieldError id="api-email-error" text={errors.email} />
        </div>

        <div className="field">
          <label htmlFor="api-message">Message</label>
          <textarea
            id="api-message"
            name="message"
            rows={5}
            value={values.message}
            onChange={handleChange("message")}
            aria-invalid={Boolean(errors.message)}
            aria-describedby={errors.message ? "api-message-error" : undefined}
          />
          <FieldError id="api-message-error" text={errors.message} />
        </div>

        <button type="submit" className="button" disabled={pending}>
          {pending ? "Sending..." : "Send message"}
        </button>
      </form>
    </div>
  );
}
