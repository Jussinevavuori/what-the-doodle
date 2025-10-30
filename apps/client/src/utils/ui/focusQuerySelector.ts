export function focusQuerySelector(selector: string): void {
  const element = document.querySelector<HTMLElement>(selector);
  if (element instanceof HTMLElement) {
    element.focus();
  } else {
    console.warn(`No element found for selector: ${selector}`);
  }
}
