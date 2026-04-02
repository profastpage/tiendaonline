export default function MinimalPage() {
  return (
    <div style={{ background: '#0a0a0a', color: 'white', padding: '2rem' }}>
      <h1 style={{ color: '#10b981' }}>¡Hola Mundo!</h1>
      <p>Si puedes leer esto, React está funcionando.</p>
      <p>Hora: {new Date().toLocaleTimeString()}</p>
    </div>
  );
}
