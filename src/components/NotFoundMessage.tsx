import Button from "@/components/ui/Button";

// The 404 message shared by src/app/not-found.tsx (unknown URLs; adds the site chrome) and
// src/app/(site)/not-found.tsx (notFound() inside a public page, where the (site) layout
// already provides the chrome). The <title> and texts match the default Next.js 404 this site
// used before. Only Tailwind classes the site already uses, so it adds no CSS.
export default function NotFoundMessage() {
  return (
    <>
      <title>404: This page could not be found.</title>
      <section className="section-container flex flex-col items-center justify-center py-32 text-center">
        <h1 className="font-heading text-6xl text-navy mb-4">404</h1>
        <h2 className="text-lg md:text-xl text-gray mb-10">
          This page could not be found.
        </h2>
        <Button href="/">Back to homepage</Button>
      </section>
    </>
  );
}
