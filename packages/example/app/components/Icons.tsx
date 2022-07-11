import { forwardRef } from "react";

export function iconOf(path: string) {
  return forwardRef<SVGSVGElement, JSX.IntrinsicElements["svg"]>(
    (props, ref) => {
      return (
        <svg
          preserveAspectRatio="xMidYMid meet"
          viewBox="0 0 24 24"
          fill="currentColor"
          ref={ref}
          {...props}
        >
          <path d={path} />
        </svg>
      );
    }
  );
}
