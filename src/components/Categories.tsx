import Link from "next/link";

interface Category {
  name: string;
  tag: string;
  img: string;
  subtitle: string;
}

const CATEGORIES: Category[] = [
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
    <div className="cats grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {CATEGORIES.map((c) => (
        <Link key={c.name} href="/shop" className="cat glass group relative overflow-hidden rounded-3xl block">
          <img src={"/images/" + c.img} alt={c.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
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
