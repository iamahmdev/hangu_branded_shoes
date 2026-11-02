import Layout from "../src/components/Layout";
import Reviews from "../src/components/Reviews";

export default function ReviewsPage() {
  return (
    <Layout title="Customer Reviews — Hangu Branded Shoes">
      <div className="pg wrap pt-32 pb-16">
        <Reviews />
      </div>
    </Layout>
  );
}
