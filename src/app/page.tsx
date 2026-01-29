export default function Home() {
  return (
    <main className="container" style={{ paddingTop: '4rem', textAlign: 'center' }}>
      <h1 className="animate-fade-in" style={{ fontSize: '3.5rem', marginBottom: '1.5rem' }}>
        Capture Memories in <span style={{ color: 'var(--primary)' }}>Style</span>
      </h1>
      <p className="animate-fade-in" style={{ fontSize: '1.25rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
        Create premium photobooks with our intuitive drag-and-drop editor.
        Start designing your masterpiece today.
      </p>

      <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
        <a href="/login" className="btn btn-primary" style={{ marginRight: '1rem' }}>
          Get Started
        </a>
        <a href="/login" className="btn btn-outline">
          Log In
        </a>
      </div>
    </main>
  );
}
