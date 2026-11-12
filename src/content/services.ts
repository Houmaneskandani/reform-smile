import type { ServicesContent } from "./schema";
import data from "@content/services.json";

/** Text for the services, in display order (the ids are fixed in rules.ts). Edited in content/services.json. */
export const services = data as ServicesContent;
