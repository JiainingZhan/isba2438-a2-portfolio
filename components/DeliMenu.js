"use client";

import { useEffect, useState } from "react";
import MenuItemCard from "@/components/MenuItemCard";

function MenuGroup({ title, items }) {
  if (items.length === 0) return null;
  return (
    <div>
      <h2>{title}</h2>
      <div className="card-list">
        {items.map((item) => (
          <MenuItemCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}

export default function DeliMenu() {
  const [items, setItems] = useState(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/menu")
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
      })
      .then((payload) => {
        if (!cancelled) setItems(payload.items);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (failed) {
    return <p className="field-error">Could not load the menu. Please try again later.</p>;
  }
  if (items === null) {
    return <p>Loading today's menu...</p>;
  }

  const available = items.filter((item) => item.availableToday);
  if (available.length === 0) {
    return <p>Nothing is available today — please check back tomorrow.</p>;
  }

  const sausage = available.filter((item) => item.category === "sausage");
  const smoked = available.filter((item) => item.category === "smoked");

  return (
    <div>
      <MenuGroup title="Sausages" items={sausage} />
      <MenuGroup title="Smoked specials" items={smoked} />
    </div>
  );
}
