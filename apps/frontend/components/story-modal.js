"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";

export default function StoryModal({ story, onClose }) {
  if (!story) return;

  const [isExpanded, setIsExpanded] = useState(false);
  
  const getYouTubeEmbedUrl = (url) => {
    if (!url) return '';
    
    // Handle YouTube shorts
    if (url.includes('youtube.com/shorts/')) {
      const videoId = url.split('shorts/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    
    return url;
  };

  const videoUrl = getYouTubeEmbedUrl(story?.video);
  const isYouTube = videoUrl?.includes("youtube");

  useEffect(() => {
    // Remove any existing TikTok embed scripts
    const existingScript = document.querySelector(
      'script[src="https://www.tiktok.com/embed.js"]'
    );
    if (existingScript) {
      existingScript.remove();
    }

    // Create and append new TikTok embed script
    if (videoUrl && !isYouTube) {
      const script = document.createElement("script");
      script.src = "https://www.tiktok.com/embed.js";
      script.async = true;
      document.body.appendChild(script);

      return () => {
        script.remove();
      };
    }
  }, [videoUrl, isYouTube, story]);

  if (!story) return null;

  return (
    <div className="flex fixed inset-0 z-50 justify-center items-center p-5 px-4 bg-black/30 backdrop-blur-sm bg-opacity-75">
      <div className="overflow-auto relative p-8 w-full max-w-5xl md:h-fit min-[320px]:h-full bg-white">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 z-50 p-2 text-black hover:opacity-75"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="flex justify-start md:flex-row min-[320px]:flex-col gap-5">
          <div className="flex relative justify-center h-full md:w-fit min-[320px]:w-full">
            {isYouTube ? (
              <iframe
                src={videoUrl}
                className="w-[315px] h-[560px]"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={story.video.title || story.name}
              />
            ) : videoUrl ? (
              <>
                <blockquote
                  className="tiktok-embed"
                  cite={videoUrl}
                  data-video-id={videoUrl.split("/").pop()}
                  style={{ maxWidth: "605px", minWidth: "325px", margin: "0" }}
                >
                  <section>
                    <a target="_blank" href={videoUrl}>
                      {story.name}
                    </a>
                  </section>
                </blockquote>
                <script async src="https://www.tiktok.com/embed.js"></script>
              </>
            ) : (
              <img
                src={story?.avatar?.url}
                alt={story?.name}
                fill
                className="object-cover md:w-3/4 min-[320px]:w-full"
              />
            )}
          </div>

          <div className="md:px-8 min-[320px]:px-0 w-full text-black">
            <h2 className="mb-4 text-3xl font-bold">{story.name}</h2>
            <p className="mb-4 text-lg">{story.sapo}</p>
            <div
              className={`relative tracking-normal ${
                isExpanded
                  ? "md:h-[450px] min-[320px]:h-[400px] overflow-y-auto"
                  : "md:h-[450px] min-[320px]:h-[200px] min-[320px]:overflow-hidden md:overflow-auto"
              }`}
            >
              <p
                dangerouslySetInnerHTML={{ __html: story.description }}
                className="pr-2 leading-relaxed whitespace-pre-line"
              ></p>
              {!isExpanded && (
                <div className="md:hidden min-[320px]:block absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent" />
              )}
            </div>
            <div className="w-full flex justify-center items-center my-4">
              <Button
                onClick={() => setIsExpanded(!isExpanded)}
                className="bg-black text-white hover:bg-black-300 border-none md:hidden min-[320px]:block"
                variant="sm"
              >
                {isExpanded ? "Show Less" : "View More"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
