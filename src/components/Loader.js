import { useEffect, useState } from "react";
export default function Loader() {
  const [h, setH] = useState(false);
  useEffect(() => { const t = setTimeout(() => setH(true), 1400); return () => clearTimeout(t); }, []);
  return (
    <div className={"loader" + (h ? " hide" : "")}>
      <b>
        <span className="logo-main">HANGU</span>
        <span className="logo-sub">BRANDED SHOES</span>
      </b>
    </div>
  );
}
