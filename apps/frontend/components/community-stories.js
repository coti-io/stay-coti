"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { fetchStories } from "../lib/datocms";
import StoryModal from "./story-modal";
import { Button } from "./ui/button";
import { useMenuSections } from "@/hooks/useMenuSections";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react"; // Add to imports

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const renderStoriesCarouselDesktop = (props) => {
  const {
    stories = [],
    handleClickStoryModal,
    selectedStory,
    setSelectedStory,
  } = props;

  const chunkArray = (arr, size) => {
    const chunks = Array.from(
      { length: Math.ceil(arr.length / size) },
      (_, i) => arr.slice(i * size, i * size + size)
    );

    const lastChunk = chunks[chunks.length - 1];
    if (lastChunk && lastChunk.length < size) {
      const placeholdersNeeded = size - lastChunk.length;
      const placeholders = Array(placeholdersNeeded).fill({
        isPlaceholder: true,
        avatar: { url: "/images/placeholder-image-1.png" },
        name: "",
        sapo: "",
      });
      chunks[chunks.length - 1] = [...lastChunk, ...placeholders];
    }

    return chunks;
  };

  const storiesChunked = chunkArray(stories, 4);

  const handleClickStory = (story) => {
    setSelectedStory(story);
  };

  return (
    <>
      {storiesChunked.map((story, index) => (
        <SwiperSlide key={index}>
          <div className="w-full flex lg:flex-row min-[320px]:flex-col lg:h-[510px] min-[320px]:h-full gap-6">
            {story.map((subItem, subIndexItem) => (
              <div
                key={subIndexItem}
                className={`${
                  subIndexItem !== selectedStory
                    ? "lg:w-[40%] min-[320px]:w-full min-[320px]:aspect-square lg:aspect-[2/5] "
                    : "w-full aspect-square"
                } ${
                  subItem.isPlaceholder ? "invisible" : ""
                } transition-all duration-150 w-full aspect-square
                        bg-transparent overflow-hidden 
                        hover:opacity-90 flex flex-col md:gap-6 lg:gap-0`}
                onClick={() =>
                  !subItem.isPlaceholder && handleClickStory(subIndexItem)
                }
              >
                <div
                  className={`relative w-full rounded-[10px] ${
                    subIndexItem === selectedStory
                      ? "md:h-[90%] min-[320px]:h-[80%]"
                      : "h-full"
                  }`}
                >
                  {/* <div className={`absolute rounded-[10px] w-full h-full z-50 ${subItem.isPlaceholder ? '!backdrop-blur-none !bg-black/10' : ''}`}></div> */}
                  <Image
                    src={subItem.avatar.url}
                    alt={subItem.name}
                    fill
                    className="object-cover overflow-hidden rounded-[10px] !relative"
                  />
                </div>
                {subIndexItem === selectedStory && (
                  <div className="flex justify-between items-end md:h-[10%] min-[320px]:h-[20%]">
                    <div className="max-h-40 text-left opacity-100 transition-all duration-300 transform">
                      <h3 className="text-xl font-bold text-black">
                        {subItem.name}
                      </h3>
                      <p className="text-sm text-black">{subItem.sapo}</p>
                    </div>
                    <Button
                      className="cursor-pointer bg-black text-white hover:bg-black-300 border-none"
                      variant="sm"
                      onClick={() => handleClickStoryModal(subItem)}
                    >{`${subItem.name}'s story`}</Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </SwiperSlide>
      ))}
    </>
  );
};

const renderStoriesCarouselMobile = (props) => {
  const { stories = [], handleClickStoryModal } = props;

  const handleClickStory = (story) => {
    setSelectedStory(story);
  };

  return (
    <>
      {stories.map((story, index) => (
        <SwiperSlide key={index}>
          <div className="w-full flex lg:flex-row min-[320px]:flex-col lg:h-[510px] min-[320px]::h-full gap-4">
            <div
              className={`lg:w-[40%] min-[320px]:w-full min-[320px]:aspect-auto lg:aspect-[2/5] transition-all duration-150 w-full
                        bg-transparent overflow-hidden 
                        hover:opacity-90 flex flex-col gap-4`}
              onClick={() => handleClickStory(index)}
            >
              <div
                className={`relative w-full rounded-[10px] md:h-[90%] min-[320px]:h-[69%]`}
              >
                <Image
                  src={story.avatar.url}
                  alt={story.name}
                  fill
                  className="object-cover overflow-hidden rounded-[10px] !relative"
                />
              </div>
              <div className="flex md:gap-0 min-[320px]:gap-3 md:flex-row min-[320px]:flex-col justify-between min-[320px]:items-start md:items-center items-end h-[15%]">
                <div className="max-h-40 text-left opacity-100 transition-all duration-300 transform">
                  <h3 className="text-xl font-bold text-black">{story.name}</h3>
                  <p className="text-sm text-black">{story.sapo}</p>
                </div>
                <Button
                  className="cursor-pointer bg-black text-white hover:bg-black-300 border-none"
                  variant="sm"
                  onClick={() => handleClickStoryModal(story)}
                >{`${story.name}'s story`}</Button>
              </div>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </>
  );
};

export default function CommunityStories() {
  const sliderRef = useRef(null);
  const [stories, setStories] = useState([]);
  const [selectedStory, setSelectedStory] = useState(0);
  const [selectedStoryModal, setSelectedStoryModal] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const { data: menuData } = useMenuSections();
  const storiesSection = menuData?.data?.allMenuSections?.find(
    (section) => section.sectionId === "Stories"
  );

  const handleClickStory = (story) => {
    setSelectedStory(story);
  };

  const handleClickStoryModal = (story) => {
    setSelectedStoryModal(story);
  };

  useEffect(() => {
    async function loadStories() {
      try {
        const { stories: storiesData } = await fetchStories();
        setStories(storiesData);
      } catch (error) {
        console.error("Error fetching stories:", error);
      }
    }

    loadStories();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024); // 1024px is the breakpoint for desktop
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <section className="px-4" id="Stories">
      <section className="relative px-4 w-full py-20">
        <div className="mx-auto max-w-7xl">
          <div className="relative text-black bg-transparent">
            <div className="relative z-10 mx-auto text-center">
              <h1 className="mb-2 text-3xl md:text-4xl font-bold tracking-tight leading-tight text-black">
                {storiesSection ? (
                  storiesSection?.sectionName || ""
                ) : (
                  <div className="flex flex-col justify-center items-center">
                    <div className="h-7 bg-gray-300 animate-pulse rounded-lg mb-3 w-[50%]"></div>
                    <div className="h-7 bg-gray-300 animate-pulse rounded-lg mb-3 w-[70%]"></div>
                  </div>
                )}
              </h1>

              <div className=" text-black max-w-[70%] mx-auto text-center mb-12">
                <p
                  dangerouslySetInnerHTML={{
                    __html: storiesSection?.sectionDescription || "",
                  }}
                ></p>
              </div>

              <Swiper
                modules={[Navigation, Pagination]}
                spaceBetween={10}
                centeredSlides={true}
                navigation={{
                  nextEl: ".custom-swiper-button-next",
                  prevEl: ".custom-swiper-button-prev",
                }}
                breakpoints={{
                  320: {
                    slidesPerView: 1,
                  },
                  768: {
                    slidesPerView: 1,
                  },
                  1024: {
                    slidesPerView: 1,
                  },
                }}
                className="w-full"
                onSwiper={(swiper) => (sliderRef.current = swiper)}
              >
                {isMobile
                  ? renderStoriesCarouselMobile({
                      stories,
                      handleClickStoryModal,
                    })
                  : renderStoriesCarouselDesktop({
                      stories,
                      handleClickStoryModal,
                      selectedStory,
                      setSelectedStory,
                    })}
              </Swiper>
              <div
                className="custom-swiper-button custom-swiper-button-prev rounded-xl lg:-left-14 min-[320px]:-left-4"
                onClick={() => setSelectedStory(0)}
              >
                <ChevronLeft className="w-6 h-6 text-white" />
              </div>
              <div
                className="custom-swiper-button custom-swiper-button-next rounded-xl lg:-right-14 min-[320px]:-right-4"
                onClick={() => setSelectedStory(0)}
              >
                <ChevronRight className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <StoryModal
        story={selectedStoryModal}
        onClose={() => setSelectedStoryModal(null)}
      />
    </section>
  );
}
