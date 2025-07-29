import SectionWrapper from "@/components/layout/section-wrapper";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
     <SectionWrapper>
      {children}
     </SectionWrapper>
    </>
  );
}
