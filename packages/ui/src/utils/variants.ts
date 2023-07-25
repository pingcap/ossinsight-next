export function getVariantClasses (target: string, variants: (string | undefined)[]) {
  return variants.filter(Boolean).map(variant => `${target}-${variant}`);
}
