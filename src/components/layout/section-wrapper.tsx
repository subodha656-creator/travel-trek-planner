export default function SectionWrapper({children}: {children: React.ReactNode}) {
  return (
    <>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 rounded-2xl">
        {children}
      </section>
    </>
  );
}
