export default function AdminLoading() {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center gap-1.5">
          <div
            className="h-2.5 w-2.5 animate-bounce rounded-full [animation-delay:-0.3s]"
            style={{ background: "#f97316" }}
          />
          <div
            className="h-2.5 w-2.5 animate-bounce rounded-full [animation-delay:-0.15s]"
            style={{ background: "#f97316" }}
          />
          <div
            className="h-2.5 w-2.5 animate-bounce rounded-full"
            style={{ background: "#f97316" }}
          />
        </div>
        <p className="text-sm text-admin-muted">Yükleniyor...</p>
      </div>
    </div>
  );
}
