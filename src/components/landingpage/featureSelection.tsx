import { cn } from "@/lib/utils";
import {
  IconFileTypePdf,
  IconCloud,
  IconCurrencyDollar,
  IconEaseInOut,
  IconHeart,
  IconHelp,
  IconRouteAltLeft,
  IconTerminal2,
} from "@tabler/icons-react";
//IconFileTextSpark
//IconCloudUp
//IconFileAnalytics
//IconPhoto
//IconFileTypeDocx
export function FeaturesSection() {
  const features = [
    {
        title: "Comprehensive Document Management",
        description:
          "DocuSpace provides a robust document management system where users can upload and store various file types, including images, PDFs, DOCX, and PPTs containing text.",
        icon: <IconTerminal2 />,
    },
    {
        title: "Text Extraction and Conversion",
        description:
          "Effortlessly convert non-machine readable text into machine-readable text. DocuSpace helps in extracting text from your files, making it ready for further analysis.",
        icon: <IconTerminal2 />,
    },
    {
        title: "Build Your Knowledge Base",
        description:
          "Users can build their own knowledge base from their uploaded files. Extract text from non-machine readable files or get summaries to enhance your data repository.",
        icon: <IconTerminal2 />,
    },
    {
        title: "Optimized for Large Language Models",
        description:
          "Analyze and utilize extracted text for large language models (LLMs). DocuSpace ensures your data is optimized for advanced AI applications.",
        icon: <IconTerminal2 />,
    },
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4  relative z-10 py-10 max-w-7xl mx-auto">
      {features.map((feature, index) => (
        <Feature key={feature.title} {...feature} index={index} />
      ))}
    </div>
  );
}

const Feature = ({
  title,
  description,
  icon,
  index,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  index: number;
}) => {
  return (
    <div
      className={cn(
        "flex flex-col lg:border-r  py-10 relative group/feature dark:border-neutral-800",
        (index === 0 || index === 4) && "lg:border-l dark:border-neutral-800",
        index < 4 && "lg:border-b dark:border-neutral-800"
      )}
    >
      {index < 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-t from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none" />
      )}
      {index >= 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-b from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none" />
      )}
      <div className="mb-4 relative z-10 px-10 text-neutral-600 dark:text-neutral-400">
        {icon}
      </div>
      <div className="text-lg font-bold mb-2 relative z-10 px-10">
        <div className="absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-neutral-300 dark:bg-neutral-700 group-hover/feature:bg-blue-500 transition-all duration-200 origin-center" />
        <span className="group-hover/feature:translate-x-2 transition duration-200 inline-block text-neutral-800 dark:text-neutral-100">
          {title}
        </span>
      </div>
      <p className="text-sm text-neutral-600 dark:text-neutral-300 max-w-xs relative z-10 px-10">
        {description}
      </p>
    </div>
  );
};
