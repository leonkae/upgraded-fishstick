"use client";

import { PropsWithChildren } from "react";

const SameLineInputs = ({ children }: PropsWithChildren) => {
  return (
    <div className="sm:flex sm:space-x-4 space-y-6 sm:space-y-0">
      {children}
    </div>
  );
};

export { SameLineInputs };
