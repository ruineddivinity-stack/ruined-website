// Product slugs to flag with a "New" badge — update as needed when a
// product is no longer a new arrival.
const NEW_ARRIVAL_SLUGS = new Set([
  "after-hours-plus",
  "revive-plus",
  "blueprint-plus",
  "illuminate-plus",
  "restoration-plus",
]);

export function isNewArrival(slug: string): boolean {
  return NEW_ARRIVAL_SLUGS.has(slug);
}
