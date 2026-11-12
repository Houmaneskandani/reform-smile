import type { Practice } from "./schema";
import data from "@content/practice.json";

/** Phone, email, address, hours, social links, header tagline and footer blurb. Edited in content/practice.json. */
export const practice = data as Practice;
