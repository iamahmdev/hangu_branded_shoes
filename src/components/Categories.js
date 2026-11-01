import Link from "next/link";

const CATEGORIES = [
  {
    name: "Performance Sneakers",
    tag: "🔥 Trending",
    img: "p2.jpg",
    subtitle: "High-Traction & Athletic Cushion",
  },
  {
    name: "Everyday Comfort",
    tag: "☁️ Air Cushion",
    img: "p3.jpg",
    subtitle: "Ergonomic All-Day Slip-Ons",
  },
  {
    name: "Executive Formal",
    tag: "👔 Hand Burnished",
    img: "p4.jpg",
    subtitle: "Italian Derby & Office Wear",
  },
  {
    name: "Smart Driving Loafers",
    tag: "✨ Luxury Casual",
    img: "p6.jpg",
    subtitle: "Supple Leather & Flexible Soles",
  },
];

export default function Categories() {
  return (
    <div className="cats">
      {CATEGORIES.map((c) => (
        <Link key={c.name} href="/shop" className="cat glass">
          <img src={"/images/" + c.img} alt={c.name} />
          <div className="cat-overlay">
            <span className="cat-badge">{c.tag}</span>
            <div className="cat-text">
              <h3>{c.name}</h3>
              <p>{c.subtitle}</p>
              <span className="cat-explore-btn">Explore Collection →</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
