import HeroVideoDialog from "@/components/magicui/hero-video-dialog";

export default function ProjectVideo() {
  return (
    <div className="relative">
      <HeroVideoDialog
        className="dark:hidden block"
        animationStyle="top-in-bottom-out"
        videoSrc="https://www.youtube.com/embed/dQw4w9WgXcQ?si=ukzqHVWjTndaFbjK"
        thumbnailSrc="im.png"
        thumbnailAlt="Pitch Deck"
      />
      <HeroVideoDialog
        className="hidden dark:block"
        animationStyle="top-in-bottom-out"
        videoSrc="https://www.youtube.com/embed/dQw4w9WgXcQ?si=ukzqHVWjTndaFbjK"
        thumbnailSrc="im.png"
        thumbnailAlt="Pitch Deck"
      />
    </div>
  );
}
