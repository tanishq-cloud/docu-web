import React from "react";
import { Compare } from "@/components/ui/compare";
import { BackgroundLines } from "../ui/backgroud-lines";

export function CompareText() {
  return (
    <div className="relative flex flex-col justify-center items-center w-full h-auto">
      {/* Background Lines */}
      <BackgroundLines className="absolute inset-0 w-full h-full opacity-50 z-0" />

      {/* Content Container */}
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-center w-full max-w-7xl p-8 space-y-8 md:space-y-0 md:space-x-8">
        
        {/* Compare Component */}
        <div className="flex-shrink-0">
          <Compare
            firstImage="before.png"
            secondImage="after.png"
            firstImageClassName="object-cover object-left-top"
            secondImageClassname="object-cover object-left-top"
            className="h-[250px] w-[200px] md:h-[500px] md:w-[500px]"
            slideMode="hover"
          />
        </div>
        
        {/* Text Section */}
        <div className="flex flex-col items-center text-center">
          <h2 className="bg-clip-text text-transparent bg-gradient-to-b from-neutral-900 to-neutral-700 dark:from-neutral-600 dark:to-white text-2xl md:text-4xl lg:text-6xl font-sans py-4 md:py-8 relative z-20 font-bold tracking-tight">
            From Images,<br /> to Scripts.
          </h2>
          <p className="max-w-xl text-sm md:text-lg text-neutral-700 dark:text-neutral-400">
            Say goodbye to squinting at blurry scans! Our software magically transforms non-machine-readable files into crisp, clear text. 
            It's like having a wizard in your computer! 🧙‍♂️✨
          </p>
        </div>
      </div>
    </div>
  );
}