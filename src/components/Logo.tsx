import Image from "next/image";
import React from "react";

function Logo() {
  return (
    <div className="flex items-center gap-2 md:gap-3 text-md md:text-lg font-bold tracking-wide text-primary select-none">
      <Image
        src="/favicon.ico"
        alt="logo"
        width={32}
        height={32}
        className="rounded-md h-5 w-5 md:h-6 md:w-6 object-cover ring-2 ring-primary/30 dark:ring-primary/40 shadow-md shadow-primary/30"
      />
      <span>IntelliPrompt</span>
    </div>
  );
}

export default Logo;
