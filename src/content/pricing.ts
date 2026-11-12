import type { Pricing } from "./schema";
import data from "@content/pricing.json";

/** Prices and the homepage limited-time offer. Edited in content/pricing.json. */
export const pricing = data as Pricing;
