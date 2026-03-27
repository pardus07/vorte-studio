import CustomCursor from "@/components/site/CustomCursor";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen cursor-none bg-bg font-[family-name:var(--font-dm-sans)] text-text md:cursor-none">
      <CustomCursor />
      {children}
    </div>
  );
}
