import NotFoundMessage from "@/components/NotFoundMessage";

// 404 for notFound() inside a public page. Without this file Next.js would use the root
// src/app/not-found.tsx here too, and that one includes the site chrome, so the page would
// show a second header and footer inside the (site) layout. Unknown URLs still use the root one.
export default function SiteNotFound() {
  return <NotFoundMessage />;
}
