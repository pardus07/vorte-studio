export default function SiteLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg">
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center gap-1.5">
          <div
            className="h-2.5 w-2.5 animate-bounce rounded-full [animation-delay:-0.3s]"
            style={{ background: "#FF4500" }}
          />
          <div
            className="h-2.5 w-2.5 animate-bounce rounded-full [animation-delay:-0.15s]"
            style={{ background: "#FF4500" }}
          />
          <div
            className="h-2.5 w-2.5 animate-bounce rounded-full"
            style={{ background: "#FF4500" }}
          />
        </div>
        <p className="text-sm text-muted">Yükleniyor...</p>
      </div>
    </div>
  );
}
