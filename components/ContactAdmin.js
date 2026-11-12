"use client";

import { useEffect, useState } from "react";
import FieldError from "@/components/FieldError";

const EMPTY_FORM = { name: "", email: "", message: "" };

export default function ContactAdmin() {
  const [contacts, setContacts] = useState(null);
  const [listFailed, setListFailed] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [notice, setNotice] = useState(null);
  const [actionFailed, setActionFailed] = useState(false);
  const [pending, setPending] = useState(false);

  async function loadContacts() {
    try {
      const response = await fetch("/api/contact");
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const payload = await response.json();
      setContacts(payload.contacts);
      setListFailed(false);
    } catch {
      setListFailed(true);
    }
  }

  useEffect(() => {
    loadContacts();
  }, []);

  function updateField(field) {
    return (event) => {
      setForm((prev) => ({ ...prev, [field]: event.target.value }));
    };
  }

  function startEdit(contact) {
    setEditingId(contact.id);
    setErrors({});
    setNotice(null);
    setActionFailed(false);
    setForm({ name: contact.name, email: contact.email, message: contact.message });
  }

  function cancelEdit() {
    setEditingId(null);
    setErrors({});
    setForm(EMPTY_FORM);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setPending(true);
    setErrors({});
    setNotice(null);
    setActionFailed(false);

    try {
      const response = await fetch(`/api/contact/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const result = await response.json().catch(() => null);

      if (response.ok && result?.contact) {
        setNotice(`Updated the submission from "${result.contact.name}".`);
        cancelEdit();
        await loadContacts();
      } else if (response.status === 400) {
        setErrors(result?.errors ?? {});
      } else {
        setActionFailed(true);
      }
    } catch {
      setActionFailed(true);
    }

    setPending(false);
  }

  async function deleteContact(contact) {
    if (!window.confirm(`Delete the submission from "${contact.name}"? This cannot be undone.`)) {
      return;
    }
    setNotice(null);
    setActionFailed(false);
    try {
      const response = await fetch(`/api/contact/${contact.id}`, { method: "DELETE" });
      if (response.ok) {
        setNotice(`Deleted the submission from "${contact.name}".`);
        if (editingId === contact.id) cancelEdit();
        await loadContacts();
      } else {
        setActionFailed(true);
      }
    } catch {
      setActionFailed(true);
    }
  }

  if (listFailed) {
    return (
      <p className="field-error">Could not load contact submissions. Please try again later.</p>
    );
  }
  if (contacts === null) {
    return <p>Loading submissions...</p>;
  }

  return (
    <div>
      {notice && (
        <div className="alert alert-success" role="status">
          {notice}
        </div>
      )}
      {actionFailed && (
        <div className="alert alert-error" role="alert">
          The last action failed. Please try again.
        </div>
      )}

      <div className="card-list">
        {contacts.map((contact) => (
          <article key={contact.id} className="card">
            <h2>{contact.name}</h2>
            <p className="subheading">
              #{contact.id} · {new Date(contact.submittedAt).toLocaleString()} · {contact.email}
            </p>
            <p>{contact.message}</p>
            <div className="button-row">
              <button type="button" className="button" onClick={() => startEdit(contact)}>
                Edit
              </button>
              <button
                type="button"
                className="button button-outline"
                onClick={() => deleteContact(contact)}
              >
                Delete
              </button>
            </div>
          </article>
        ))}
      </div>

      {editingId !== null && (
        <div>
          <h2>Edit submission #{editingId}</h2>
          <form onSubmit={handleSubmit} className="contact-form" noValidate>
            <div className="field">
              <label htmlFor="contact-name">Name</label>
              <input
                id="contact-name"
                name="name"
                type="text"
                value={form.name}
                onChange={updateField("name")}
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? "contact-name-error" : undefined}
              />
              <FieldError id="contact-name-error" text={errors.name} />
            </div>

            <div className="field">
              <label htmlFor="contact-email">Email</label>
              <input
                id="contact-email"
                name="email"
                type="email"
                value={form.email}
                onChange={updateField("email")}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? "contact-email-error" : undefined}
              />
              <FieldError id="contact-email-error" text={errors.email} />
            </div>

            <div className="field">
              <label htmlFor="contact-message">Message</label>
              <textarea
                id="contact-message"
                name="message"
                rows={4}
                value={form.message}
                onChange={updateField("message")}
                aria-invalid={Boolean(errors.message)}
                aria-describedby={errors.message ? "contact-message-error" : undefined}
              />
              <FieldError id="contact-message-error" text={errors.message} />
            </div>

            <div className="button-row">
              <button type="submit" className="button" disabled={pending}>
                {pending ? "Saving..." : "Save changes"}
              </button>
              <button type="button" className="button button-outline" onClick={cancelEdit}>
                Cancel edit
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
