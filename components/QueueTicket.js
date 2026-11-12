"use client";

import { useEffect, useState } from "react";
import { loadTicket, saveTicket, clearTicket, nextQueueNumber } from "@/lib/ticketStorage";
import { formatMoney, formatDateTime } from "@/lib/format";

function isValidQuantity(quantity, unit) {
  if (!Number.isFinite(quantity) || quantity <= 0) return false;
  if (unit === "ea") return Number.isInteger(quantity);
  return Math.round(quantity * 100) % 25 === 0;
}

export default function QueueTicket({ items }) {
  const [ticket, setTicket] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [checked, setChecked] = useState({});
  const [quantities, setQuantities] = useState({});

  // Read the saved ticket once on mount so it survives a page refresh.
  useEffect(() => {
    setTicket(loadTicket());
    setLoaded(true);
  }, []);

  const itemById = new Map(items.map((item) => [item.id, item]));

  function toggleChecked(id) {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function setQuantity(id, value) {
    setQuantities((prev) => ({ ...prev, [id]: value }));
  }

  const selected = items
    .filter((item) => checked[item.id])
    .map((item) => {
      const quantity = Number(quantities[item.id]);
      return { item, quantity, valid: isValidQuantity(quantity, item.unit) };
    });

  const estimate = selected
    .filter(({ valid }) => valid)
    .reduce((sum, { item, quantity }) => sum + item.price * quantity, 0);

  const hasValidSelection = selected.some(({ valid }) => valid);

  function handleTakeNumber() {
    const usable = selected.filter(({ valid }) => valid);
    if (usable.length === 0) return;
    const newTicket = {
      queueNumber: nextQueueNumber(),
      createdAt: new Date().toISOString(),
      items: usable.map(({ item, quantity }) => ({ id: item.id, quantity })),
    };
    if (saveTicket(newTicket)) {
      setTicket(newTicket);
      setChecked({});
      setQuantities({});
    }
  }

  function handleCancel() {
    clearTicket();
    setTicket(null);
  }

  return (
    <div className="card">
      <h2>Queue ticket</h2>

      {loaded && !ticket && <p>No saved ticket</p>}

      {ticket && (
        <div>
          <p>
            <strong>Your number: {ticket.queueNumber}</strong>
            <span className="subheading"> · taken {formatDateTime(ticket.createdAt)}</span>
          </p>
          <ul>
            {ticket.items.map((entry) => {
              const currentItem = itemById.get(entry.id);
              return (
                <li key={entry.id}>
                  {currentItem ? (
                    <>
                      {currentItem.name} — {entry.quantity} {currentItem.unit} —{" "}
                      {formatMoney(currentItem.price * entry.quantity)}
                    </>
                  ) : (
                    <>
                      Item #{entry.id} ({entry.quantity}) —{" "}
                      <span className="menu-soldout">no longer available</span>
                    </>
                  )}
                </li>
              );
            })}
          </ul>
          <p>
            <strong>
              Estimated total:{" "}
              {formatMoney(
                ticket.items.reduce(
                  (sum, entry) =>
                    sum + (itemById.get(entry.id) ? itemById.get(entry.id).price * entry.quantity : 0),
                  0
                )
              )}
            </strong>
          </p>
          <button type="button" className="button button-outline" onClick={handleCancel}>
            Cancel ticket
          </button>
        </div>
      )}

      {!ticket && (
        <>
          <h3>Pick your items</h3>
          <p className="subheading">Simulated weight, final price is set at the scale.</p>

          <ul>
            {items.map((item) => {
              const quantity = Number(quantities[item.id]);
              const quantityHint =
                checked[item.id] && quantities[item.id] !== undefined && quantities[item.id] !== ""
                  ? !isValidQuantity(quantity, item.unit)
                  : false;
              return (
                <li key={item.id}>
                  <label>
                    <input
                      type="checkbox"
                      checked={Boolean(checked[item.id])}
                      onChange={() => toggleChecked(item.id)}
                    />{" "}
                    {item.name} — {formatMoney(item.price)} / {item.unit}
                  </label>{" "}
                  <input
                    type="number"
                    min={item.unit === "lb" ? 0.25 : 1}
                    step={item.unit === "lb" ? 0.25 : 1}
                    value={quantities[item.id] ?? ""}
                    onChange={(event) => setQuantity(item.id, event.target.value)}
                    aria-label={`Quantity for ${item.name}`}
                  />{" "}
                  {item.unit}
                  {quantityHint && (
                    <span className="field-error">
                      {item.unit === "lb" ? " Use a multiple of 0.25." : " Use a whole number."}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>

          <p>
            <strong>Estimated total: {formatMoney(estimate)}</strong>
          </p>
          <button
            type="button"
            className="button"
            onClick={handleTakeNumber}
            disabled={!hasValidSelection}
          >
            Take a number
          </button>
        </>
      )}
    </div>
  );
}
