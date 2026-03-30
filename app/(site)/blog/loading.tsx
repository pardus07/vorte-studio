export default function BlogLoading() {
  return (
    <section className="px-6 pb-24 pt-32 md:px-12">
      <div className="mx-auto max-w-5xl">
        {/* Başlık skeleton */}
        <div className="h-10 w-32 animate-pulse rounded-lg bg-bg3" />
        <div className="mt-4 h-5 w-80 animate-pulse rounded bg-bg3" />
        <div className="mt-6 h-px w-16 bg-accent" />
      </div>

      {/* Kart skeleton'ları */}
      <div className="mx-auto mt-16 max-w-5xl">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="overflow-hidden rounded-2xl border border-border bg-bg2"
            >
              <div className="aspect-[16/10] w-full animate-pulse bg-bg3" />
              <div className="p-5">
                <div className="mb-3 flex gap-1.5">
                  <div className="h-5 w-16 animate-pulse rounded-full bg-bg3" />
                  <div className="h-5 w-20 animate-pulse rounded-full bg-bg3" />
                </div>
                <div className="h-6 w-3/4 animate-pulse rounded bg-bg3" />
                <div className="mt-2 space-y-2">
                  <div className="h-4 w-full animate-pulse rounded bg-bg3" />
                  <div className="h-4 w-2/3 animate-pulse rounded bg-bg3" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
