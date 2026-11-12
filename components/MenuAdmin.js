"use client";

import { useEffect, useState } from "react";
import FieldError from "@/components/FieldError";
import StatusAlert from "@/components/StatusAlert";
import { formatMoney } from "@/lib/format";

const EMPTY_FORM = {
  name: "",
  category: "sausage",
  unit: "lb",
  price: "",
  stock: "",
  availableToday: false,
};

export default function MenuAdmin() {
  const [items, setItems] = useState(null);
  const [listFailed, setListFailed] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [errors, setErrors] = useState({});
  const [notice, setNotice] = useState(null);
  const [actionFailed, setActionFailed] = useState(false);
  const [pending, setPending] = useState(false);

  async function loadItems() {
    try {
      const response = await fetch("/api/menu");
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const payload = await response.json();
      setItems(payload.items);
      setListFailed(false);
    } catch {
      setListFailed(true);
    }
  }

  useEffect(() => {
    loadItems();
  }, []);

  function updateField(field) {
    return (event) => {
      const value = event.target.type === "checkbox" ? event.target.checked : event.target.value;
      setForm((prev) => ({ ...prev, [field]: value }));
    };
  }

  function startEdit(item) {
    setEditingId(item.id);
    setErrors({});
    setNotice(null);
    setActionFailed(false);
    setForm({
      name: item.name,
      category: item.category,
      unit: item.unit,
      price: String(item.price),
      stock: String(item.stock),
      availableToday: item.availableToday,
    });
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

    const payload = {
      name: form.name,
      category: form.category,
      unit: form.unit,
      price: Number(form.price),
      stock: Number(form.stock),
      availableToday: form.availableToday,
    };

    try {
      const response = await fetch(editingId ? `/api/menu/${editingId}` : "/api/menu", {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json().catch(() => null);

      if (response.ok && result?.item) {
        setNotice(
          editingId
            ? `Updated "${result.item.name}".`
            : `Added "${result.item.name}" (id ${result.item.id}).`
        );
        cancelEdit();
        await loadItems();
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

  async function toggleAvailability(item) {
    setNotice(null);
    setActionFailed(false);
    try {
      const response = await fetch(`/api/menu/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ availableToday: !item.availableToday }),
      });
      if (response.ok) {
        setNotice(
          `"${item.name}" is now ${item.availableToday ? "sold out for today" : "available today"}.`
        );
        await loadItems();
      } else {
        setActionFailed(true);
      }
    } catch {
      setActionFailed(true);
    }
  }

  async function deleteItem(item) {
    if (!window.confirm(`Delete "${item.name}"? This cannot be undone.`)) return;
    setNotice(null);
    setActionFailed(false);
    try {
      const response = await fetch(`/api/menu/${item.id}`, { method: "DELETE" });
      if (response.ok) {
        setNotice(`Deleted "${item.name}".`);
        if (editingId === item.id) cancelEdit();
        await loadItems();
      } else {
        setActionFailed(true);
      }
    } catch {
      setActionFailed(true);
    }
  }

  if (listFailed) {
    return <p className="field-error">Could not load the menu. Please try again later.</p>;
  }
  if (items === null) {
    return <p>Loading menu...</p>;
  }

  return (
    <div>
      <StatusAlert type="success" text={notice} />
      <StatusAlert
        type="error"
        text={actionFailed ? "The last action failed. Please try again." : null}
      />

      <table className="menu-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Today</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.category}</td>
              <td>
                {formatMoney(item.price)} / {item.unit}
              </td>
              <td>
                {item.stock} {item.unit}
              </td>
              <td>
                <span className={item.availableToday ? "menu-available" : "menu-soldout"}>
                  {item.availableToday ? "Available" : "Sold out"}
                </span>
              </td>
              <td>
                <button type="button" className="button" onClick={() => toggleAvailability(item)}>
                  {item.availableToday ? "Mark sold out" : "Mark available"}
                </button>{" "}
                <button type="button" className="button" onClick={() => startEdit(item)}>
                  Edit
                </button>{" "}
                <button
                  type="button"
                  className="button button-outline"
                  onClick={() => deleteItem(item)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>{editingId ? `Edit item #${editingId}` : "Add new item"}</h2>
      <form onSubmit={handleSubmit} className="contact-form" noValidate>
        <div className="field">
          <label htmlFor="menu-name">Name</label>
          <input
            id="menu-name"
            name="name"
            type="text"
            value={form.name}
            onChange={updateField("name")}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "menu-name-error" : undefined}
          />
          <FieldError id="menu-name-error" text={errors.name} />
        </div>

        <div className="field">
          <label htmlFor="menu-category">Category</label>
          <select id="menu-category" value={form.category} onChange={updateField("category")}>
            <option value="sausage">sausage</option>
            <option value="smoked">smoked</option>
          </select>
          <FieldError id="menu-category-error" text={errors.category} />
        </div>

        <div className="field">
          <label htmlFor="menu-unit">Unit</label>
          <select id="menu-unit" value={form.unit} onChange={updateField("unit")}>
            <option value="lb">lb</option>
            <option value="ea">ea</option>
          </select>
          <FieldError id="menu-unit-error" text={errors.unit} />
        </div>

        <div className="field">
          <label htmlFor="menu-price">Price (per unit)</label>
          <input
            id="menu-price"
            name="price"
            type="number"
            min="0"
            step="0.01"
            value={form.price}
            onChange={updateField("price")}
            aria-invalid={Boolean(errors.price)}
            aria-describedby={errors.price ? "menu-price-error" : undefined}
          />
          <FieldError id="menu-price-error" text={errors.price} />
        </div>

        <div className="field">
          <label htmlFor="menu-stock">Stock</label>
          <input
            id="menu-stock"
            name="stock"
            type="number"
            min="0"
            value={form.stock}
            onChange={updateField("stock")}
            aria-invalid={Boolean(errors.stock)}
            aria-describedby={errors.stock ? "menu-stock-error" : undefined}
          />
          <FieldError id="menu-stock-error" text={errors.stock} />
        </div>

        <div className="field">
          <label htmlFor="menu-available">
            <input
              id="menu-available"
              type="checkbox"
              checked={form.availableToday}
              onChange={updateField("availableToday")}
            />{" "}
            Available today
          </label>
        </div>

        <div className="button-row">
          <button type="submit" className="button" disabled={pending}>
            {pending ? "Saving..." : editingId ? "Save changes" : "Add item"}
          </button>
          {editingId && (
            <button type="button" className="button button-outline" onClick={cancelEdit}>
              Cancel edit
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
