import { z } from "zod";
import heroData from "../../content/hero.json";
import capabilitiesData from "../../content/capabilities.json";
import caseStudiesData from "../../content/case-studies.json";
import {
  HeroContentSchema,
  CapabilitiesFileSchema,
  CaseStudiesFileSchema,
  formatContentError,
} from "./content-schemas";

export type HeroContent = z.infer<typeof HeroContentSchema>;
export type Capability = z.infer<typeof CapabilitiesFileSchema>["items"][number];
export type CaseStudy = z.infer<typeof CaseStudiesFileSchema>["items"][number];

function parse<T>(schema: z.ZodType<T>, data: unknown, file: string): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new Error(formatContentError(file, result.error));
  }
  return result.data;
}

// Validated once at module load -- a typo'd edit to any of these files
// (including writes from the dev-mode inline editor) fails the build with a
// field-level error instead of silently rendering a broken section.
const hero = parse(HeroContentSchema, heroData, "content/hero.json");
const capabilities = parse(
  CapabilitiesFileSchema,
  capabilitiesData,
  "content/capabilities.json"
);
const caseStudies = parse(
  CaseStudiesFileSchema,
  caseStudiesData,
  "content/case-studies.json"
);

export function getHero(): HeroContent {
  return hero;
}

export function getCapabilities(): Capability[] {
  return capabilities.items;
}

export function getCaseStudies(): CaseStudy[] {
  return caseStudies.items;
}
