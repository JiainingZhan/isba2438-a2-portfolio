export default function MenuItemCard({ item }) {
  return (
    <article className="card">
      <h3>{item.name}</h3>
      <p className="menu-price">
        ${Number(item.price).toFixed(2)} / {item.unit}
      </p>
      <p className="subheading">
        In stock: {item.stock} {item.unit}
      </p>
    </article>
  );
}
