/**
 * Recharts emits noisy `defaultProps` deprecation warnings under React 18.3.
 * They originate inside the library and are not actionable from here, so we
 * filter just those messages and leave every other console error intact.
 */
const SUPPRESSED = [
  "Support for defaultProps will be removed from function components",
  "Support for defaultProps will be removed from memo components",
];

let patched = false;

export default function hideRechartsConsoleError(): void {
  if (patched || typeof window === "undefined") return;
  patched = true;

  const original = console.error;
  console.error = (...args: unknown[]) => {
    const first = args[0];
    if (
      typeof first === "string" &&
      SUPPRESSED.some((message) => first.includes(message))
    ) {
      return;
    }
    original(...args);
  };
}

export { hideRechartsConsoleError };
