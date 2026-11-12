import type { Testimonial, TestimonialsContent } from "./schema";
import data from "@content/testimonials.json";

/**
 * May the website show this review? Samples yes (the pages mark them as samples); a real
 * review only once the patient's written permission is on file. A new review added in the
 * editor starts with both boxes unticked, so it stays hidden until one of them is ticked.
 */
export function isPublishable(review: Testimonial): boolean {
  return review.isSample || review.permissionOnFile;
}

/**
 * Patient reviews for the homepage and the consultation page. Edited in
 * content/testimonials.json. Reviews the website may not show are already left out here, so
 * no page can show them by mistake (the build lists them as warnings: src/content/validate.ts).
 */
export const testimonials: TestimonialsContent = {
  items: (data as TestimonialsContent).items.filter(isPublishable),
};
