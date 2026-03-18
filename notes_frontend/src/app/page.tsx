import Link from "next/link";

/**
 * PUBLIC_INTERFACE
 * Home is a simple landing page.
 */
export default function Home() {
  return (
    <main className="nm-container">
      <div
        className="nm-card"
        style={{
          marginTop: 72,
          padding: 22,
          background:
            "linear-gradient(135deg, rgba(59,130,246,0.10), rgba(249,250,251,1))",
        }}
      >
        <div className="nm-vstack" style={{ gap: 10 }}>
          <div className="nm-title" style={{ fontSize: 28 }}>
            NoteMaster
          </div>
          <div className="nm-subtitle" style={{ maxWidth: 720 }}>
            A light, modern notes app with fast search, tags, pinning and
            favorites.
          </div>

          <div className="nm-hstack" style={{ marginTop: 10, flexWrap: "wrap" }}>
            <Link className="nm-btn nm-btn-primary" href="/login">
              Sign in
            </Link>
            <Link className="nm-btn" href="/register">
              Create account
            </Link>
            <Link className="nm-btn" href="/app">
              Go to app
            </Link>
          </div>

          <div className="nm-subtitle" style={{ marginTop: 8 }}>
            Tip: use the search bar to filter by title, content, or tag.
          </div>
        </div>
      </div>
    </main>
  );
}
