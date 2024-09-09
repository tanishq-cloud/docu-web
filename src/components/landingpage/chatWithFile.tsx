import React from "react";
import Image from "next/image";


export function ChatWithFile() {
  return (
    <div className="relative flex flex-col justify-center items-center w-full h-auto">


      {/* Content Container */}
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-center w-full max-w-7xl p-8 space-y-8 md:space-y-0 md:space-x-8">
        {/* Text Section */}
        <div className="flex flex-col items-center text-center">
          <h2 className="bg-clip-text text-transparent bg-gradient-to-b from-neutral-900 to-neutral-700 dark:from-neutral-600 dark:to-white text-2xl md:text-4xl lg:text-6xl font-sans py-4 md:py-8 relative z-20 font-bold tracking-tight">
            Chat with Your Files:<br /> Turning Text into Talk!
          </h2>
          <p className="max-w-xl text-sm md:text-lg text-neutral-700 dark:text-neutral-400">
            Ever wished your documents could talk back? Our software not only extracts text from non-machine-readable files but also builds a knowledge hub so you can chat with your data. It’s like having a conversation with your paperwork! 📄💬
          </p>
        </div>
        {/* Image */}
        <div className="flex-shrink-0">
        <img
  src="/chatwithyourfile.png"
  alt="Chat with Files"
 
  style={{
    objectFit: 'cover',
    objectPosition: 'center',
    height: '500',
    width: '500'
  }}
  className="md:h-[500px] md:w-[500px]"
/>


       
        </div>
        
      </div>
    </div>
  );
}
