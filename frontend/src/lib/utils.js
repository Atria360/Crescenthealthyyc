import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Off-site links (e.g. booking systems) open in a new tab.
export function externalLinkProps(href) {
  return /^https?:\/\//.test(href || "")
    ? { target: "_blank", rel: "noopener noreferrer" }
    : {};
}
