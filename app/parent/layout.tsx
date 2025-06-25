// app/parent/layout.tsx
export default function ParentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      {/* Shared navbar for parents */}
      {children}
    </div>
  );
}
