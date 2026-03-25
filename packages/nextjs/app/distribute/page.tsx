import Link from "next/link";
import DistributeForm from "./DistributeForm";

const colors = {
  coffeeDark: "#2C1A0E",
  coffeeCream: "#F5ECD7",
  coffeeParchment: "#EDE0C4",
};

export default function DistributePage() {
  return (
    <main style={{ background: "#E8F0E8", minHeight: "100vh", fontFamily: "sans-serif", padding: 28 }}>
      <div style={{ maxWidth: 980, margin: "0 auto" }}>
        <h1 style={{ fontSize: 28, fontWeight: 500, color: colors.coffeeDark, marginBottom: 18 }}>Distribute Batch</h1>

        <div
          style={{
            background: colors.coffeeCream,
            padding: 28,
            borderRadius: 12,
            boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
            border: `1px solid ${colors.coffeeParchment}`,
          }}
        >
          <DistributeForm />
        </div>

        <div style={{ marginTop: 18 }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <div
              style={{
                display: "inline-block",
                padding: "8px 12px",
                borderRadius: 8,
                border: `1px solid ${colors.coffeeParchment}`,
                color: colors.coffeeDark,
              }}
            >
              Back to Main
            </div>
          </Link>
        </div>
      </div>
    </main>
  );
}
