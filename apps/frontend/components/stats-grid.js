"use client";

import { useState, useEffect, useCallback } from "react";
import { useScrollHandler, throttle } from "@/utils/scroll-utils";
import { Users, Building2, Plane } from "lucide-react";
import dayjs from "dayjs";
import { fetchCotiEvents, fetchEvents } from "../lib/datocms";
import Image from "next/image";
import { useMenuSections } from "@/hooks/useMenuSections";
import Link from "next/link";
import { Button } from "./ui/button";

const EVENTS_DATA_DEFAULTS = [
  {
    id: 1,
    title: "No events at the moment. Please check back later!",
    description: "",
    avatar: {
      url: "/images/event-2.png",
    },
    startDateTime: null,
    registerUrl: "",
  },
  {
    id: 2,
    title: "No events at the moment. Please check back later!",
    description: "",
    avatar: {
      url: "/images/event-1.png",
    },
    startDateTime: null,
    registerUrl: "",
  },
  {
    id: 3,
    title: "No events at the moment. Please check back later!",
    description: "",
    avatar: {
      url: "/images/events/hackathon.jpg",
    },
    startDateTime: null,
    registerUrl: "",
  },
  {
    id: 4,
    title: "No events at the moment. Please check back later!",
    description: "",
    avatar: {
      url: "/images/events/asia-meetup.jpg",
    },
    startDateTime: null,
    registerUrl: "",
  },
  {
    id: 5,
    title: "No events at the moment. Please check back later!",
    description: "",
    avatar: {
      url: "/images/events/enterprise-forum.jpg",
    },
    startDateTime: null,
    registerUrl: "",
  },
  {
    id: 6,
    title: "No events at the moment. Please check back later!",
    description: "",
    avatar: {
      url: "/images/events/dev-conf.jpg",
    },
    startDateTime: null,
    registerUrl: "",
  },
];

export default function StatsGrid() {
  const [events, setEvents] = useState([]);
  const [specialEvents, setSpecialEvents] = useState([]);
  const [specialFirstEvents, setSpecialFirstEvents] = useState(null);
  const [specialSecondEvents, setSpecialSecondEvents] = useState(null);
  const [count, setCount] = useState(375987);
  const [isVisible, setIsVisible] = useState(false);
  const [cotiEventData, setCotiEventData] = useState(null);
  const [listCotiEventData, setListCotiEventData] = useState(null);
  const [countCotiEvents, setCountCotiEvents] = useState(0);
  const [visibleItems, setVisibleItems] = useState(5);
  const [isLoading, setIsLoading] = useState(true);

  const { data: menuData } = useMenuSections();
  const eventsSection = menuData?.data?.allMenuSections?.find(
    (section) => section.sectionId === "Events"
  );

  const handleScroll = useCallback(() => {
    const element = document.getElementById("stats-section");
    if (!element) return;

    const rect = element.getBoundingClientRect();
    const isInView = rect.top <= window.innerHeight && rect.bottom >= 0;
    setIsVisible(isInView);
  }, []);

  // Use throttled scroll handler for animations
  useScrollHandler(handleScroll, 32); // 32ms throttle for smoother animations

  useEffect(() => {
    if (!isVisible) return;

    const incrementTimer = setInterval(() => {
      const increment = Math.floor(Math.random() * 5) + 1;
      setCount((prevCount) => prevCount + increment);
    }, 2000);

    return () => clearInterval(incrementTimer);
  }, [isVisible]);

  useEffect(() => {
    async function loadEvents() {
      setIsLoading(true);
      try {
        const {
          events: eventData,
          specialEvents,
          specialFirstEvent,
          specialSecondEvent,
        } = await fetchEvents(6);
        let finalEvents = [];

        if (eventData && eventData.length > 0) {
          if (eventData.length < 4) {
            finalEvents = [
              ...eventData,
              ...EVENTS_DATA_DEFAULTS.slice(eventData.length),
            ];
          } else {
            finalEvents = eventData;
          }
        } else {
          finalEvents = EVENTS_DATA_DEFAULTS;
        }
        setEvents(finalEvents);
        setSpecialEvents(specialEvents);
        setSpecialFirstEvents(specialFirstEvent[0]);
        setSpecialSecondEvents(specialSecondEvent[0]);
      } catch (error) {
        console.error("Error loading events:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadEvents();
  }, []);

  const bgColors = [
    "bg-emerald-100",
    "bg-purple-100",
    "bg-orange-100",
    "bg-yellow-100",
    "bg-blue-100",
    "bg-pink-100",
  ];

  useEffect(() => {
    async function loadCotiEvents() {
      try {
        const {
          events: eventData,
          cotiEvent,
          total,
        } = await fetchCotiEvents(visibleItems);
        setCotiEventData(cotiEvent);
        setListCotiEventData(eventData);
        setCountCotiEvents(total);
      } catch (error) {
        console.error("Error fetching coti events:", error);
      }
    }
    loadCotiEvents();
  }, [visibleItems]);

  const getDarkerColor = (color) => {
    if (!color) return "bg-black/50";

    return color.replace(/100/, "300");
  };

  const handleViewMore = () => {
    if (visibleItems >= countCotiEvents) return;
    setVisibleItems((prev) => prev + 5);
  };

  const renderSkeleton = () => (
    <div className="grid h-full min-[320px]:grid-cols-1 md:grid-cols-4 gap-4">
      {/* First Event Skeleton */}
      <div className="h-[476px] bg-gray-800 animate-pulse min-[320px]:col-span-1 md:col-span-2 relative"></div>

      {/* Community Events Skeleton */}
      <div className="h-[476px] bg-gray-800 animate-pulse min-[320px]:col-span-1 lg:col-span-1"></div>

      {/* Second Event Skeleton */}
      <div className="h-[476px] bg-gray-800 animate-pulse min-[320px]:col-span-1 lg:col-span-1"></div>

      {/* Small Events Skeleton */}
      {[1, 2, 3, 4].map((_, index) => (
        <div
          key={index}
          className="h-[300px] bg-gray-800 animate-pulse md:col-span-1 lg:col-span-1"
        ></div>
      ))}
    </div>
  );

  return (
    <section
      id="stats-section"
      className="px-4 py-6 w-full bg-black md:py-12 mb-200 pb-200"
    >
      <div className="mb-12 text-center" id="Events">
        <div className="mb-2 text-3xl font-bold text-white">
          {eventsSection ? (
            eventsSection?.sectionName || ""
          ) : (
            <div className="flex flex-col justify-center items-center">
              <div className="h-7 bg-gray-700 animate-pulse rounded-lg mb-3 w-[50%]"></div>
              <div className="h-7 bg-gray-700 animate-pulse rounded-lg mb-3 w-[70%]"></div>
            </div>
          )}
        </div>
        <div className=" text-white max-w-[70%] mx-auto text-center mb-12">
          <p
            dangerouslySetInnerHTML={{
              __html: eventsSection?.sectionDescription || "",
            }}
          ></p>
        </div>
      </div>
      <div className="mx-auto max-w-7xl">
        {isLoading ? (
          renderSkeleton()
        ) : (
          <div className="grid h-full min-[320px]:grid-cols-1 md:grid-cols-4 md:gap-0">
            {/* Dubai Event */}
            <div className="h-full bg-black min-[320px]:col-span-1 md:col-span-2 relative">
              <Link
                href={specialFirstEvents?.registerUrl || ""}
                target="_blank"
              >
                <div className="absolute inset-0 w-full h-full">
                  {specialFirstEvents && (
                    <img
                      src={specialFirstEvents?.avatar?.url}
                      alt="Global COTI Event"
                      className="object-cover object-center absolute w-full h-full"
                    />
                  )}
                </div>
                <div className="md:absolute min-[320px]:relative inset-0 bg-black/50">
                  <div className="flex flex-col justify-between p-6 lg:h-full min-[320px]:h-[476px]">
                    <div className="flex justify-between items-start flex-wrap gap-3">
                      <h3 className="text-3xl font-bold text-white">
                        {specialFirstEvents?.title}
                      </h3>
                      <div className="flex gap-2 items-center">
                        <span className="px-3 py-1 text-sm text-white rounded-full backdrop-blur-sm bg-white/20">
                          {specialFirstEvents &&
                          specialFirstEvents?.startDateTime
                            ? dayjs(specialFirstEvents?.startDateTime).format(
                                "DD/MM/YY"
                              )
                            : "To be updated"}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between items-end flex-wrap gap-3">
                      <div className="text-4xl font-bold text-white w-3/4">
                        <span className="overflow-hidden text-xl font-normal line-clamp-1">
                          {specialFirstEvents?.description}
                        </span>
                      </div>
                      {specialFirstEvents && specialFirstEvents?.registerUrl ? (
                        <Link
                          href={specialFirstEvents?.registerUrl || ""}
                          target="_blank"
                        >
                          <div className="flex justify-center items-center w-8 h-8 text-white rounded-full backdrop-blur-sm bg-white/20">
                            <span className="sr-only">View details</span>→
                          </div>
                        </Link>
                      ) : null}
                    </div>
                  </div>
                </div>
              </Link>
            </div>

            {/* Total Community Events */}
            <div className="flex flex-col p-6 h-full bg-purple-200 min-[320px]:col-span-1 lg:col-span-1">
              <div className="flex-1">
                <h3 className="mb-2 text-xl">{cotiEventData?.title}</h3>
                <div className="mb-4 text-5xl font-bold">
                  {cotiEventData?.totalEvents}
                </div>
                <h4 className="mb-4 font-medium">
                  {cotiEventData?.description}
                </h4>
                <ul className="space-y-1 text-sm h-[150px] overflow-auto">
                  {listCotiEventData && listCotiEventData.length > 0 ? (
                    listCotiEventData.map((event) => (
                      <>
                        <li className="flex justify-start items-center">
                          <Link href={event?.registerUrl || ""} target="_blank">
                            <p className="w-[75px] px-2 py-1 mr-2 whitespace-nowrap bg-yellow-300 rounded-full">
                              {event && event.startDateTime
                                ? dayjs(event.startDateTime).format("DD/MM/YY")
                                : "To be updated"}
                            </p>
                          </Link>
                          <p>{event.title}</p>
                        </li>
                      </>
                    ))
                  ) : (
                    <p>No Events Available</p>
                  )}
                </ul>
              </div>
              <div className="mt-12">
                {listCotiEventData &&
                  listCotiEventData.length >= 5 &&
                  countCotiEvents !== visibleItems && (
                    <Button
                      onClick={handleViewMore}
                      className="flex items-center px-4 py-2 text-sm text-black bg-purple-300 rounded-full transition-colors w-fit"
                    >
                      View More
                    </Button>
                  )}
              </div>
            </div>

            <div
              className={`flex flex-col justify-between min-[320px]:col-span-1 lg:col-span-1 relative`}
            >
              <Link
                href={specialSecondEvents?.registerUrl || ""}
                target="_blank"
                className="flex flex-col justify-between"
              >
                <div className="absolute inset-0 w-full h-full">
                  {specialSecondEvents && (
                    <img
                      src={specialSecondEvents?.avatar?.url}
                      alt="Global COTI Event"
                      className="object-cover object-center absolute w-full h-full"
                    />
                  )}
                </div>
                <div className="md:absolute min-[320px]:relative inset-0 bg-black/50">
                  <div className="flex flex-col justify-between p-6 lg:h-full min-[320px]:h-[476px]">
                    <div className="flex justify-between items-start flex-wrap gap-3">
                      <h3 className="text-3xl font-bold text-white">
                        {specialSecondEvents?.title}
                      </h3>
                      <div className="flex gap-2 items-center">
                        <span className="px-3 py-1 text-sm text-white rounded-full backdrop-blur-sm bg-white/20">
                          {specialSecondEvents &&
                          specialSecondEvents.startDateTime
                            ? dayjs(specialSecondEvents?.startDateTime).format(
                                "DD/MM/YY"
                              )
                            : "To be updated"}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between items-end flex-wrap">
                      <div className="text-4xl font-bold text-white">
                        <span className="overflow-hidden text-sm font-normal line-clamp-1">
                          {specialSecondEvents?.description}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>

            {/* Privacy Network (now Poolz IDO Launch Pad) */}
            {events.slice(0, 4).map((event, index) => (
              <div
                className={`flex flex-col justify-between p-6 ${bgColors[index]} md:col-span-1 lg:col-span-1`}
              >
                <Link
                  href={event.registerUrl}
                  target="_blank"
                  className="flex flex-col justify-between min-h-[220px] max-h-[220px]"
                >
                  <div className="min-h-[96px]">
                    <h3 className="text-2xl font-bold line-clamp-2">
                      {event.title}
                    </h3>
                    <div className="overflow-hidden mt-2 text-lg line-clamp-2">
                      {event.description}
                    </div>
                  </div>
                  <div className="mt-2">
                    <div className="flex items-center mt-12">
                      <Link
                        href={event.registerUrl}
                        target="_blank"
                        className={`flex items-center px-4 py-2 text-sm text-black ${getDarkerColor(
                          bgColors[index]
                        )} ${
                          event && event.registerUrl
                            ? "pointer-events-auto"
                            : "pointer-events-none"
                        } rounded-full transition-colors hover:opacity-80`}
                      >
                        {event && event.startDateTime
                          ? dayjs(event.startDateTime).format("DD/MM/YYYY")
                          : "To be updated"}
                      </Link>
                    </div>
                  </div>
                </Link>
              </div>
            ))}

            {specialEvents &&
              specialEvents.length > 0 &&
              specialEvents.map((event, index) => (
                <div
                  key={index}
                  className={`flex flex-row justify-between p-6 bg-indigo-100 md:col-span-4 lg:col-span-4 gap-10 w-full`}
                >
                  <Link
                    href={event.registerUrl}
                    target="_blank"
                    className="flex flex-row justify-between gap-10"
                  >
                    <div className="flex flex-col justify-between">
                      <div>
                        <h3 className="text-2xl font-bold">{event.title}</h3>
                        <div className="overflow-hidden mt-2 text-lg line-clamp-3">
                          {event.description}
                        </div>
                        <div className="overflow-hidden mt-3 text-sm line-clamp-3 [&>p>p>span]:text-sm">
                          <p
                            dangerouslySetInnerHTML={{ __html: event.content }}
                          ></p>
                        </div>
                      </div>
                      <div className="mt-4">
                        <div className="flex items-center">
                          <Link
                            href={event.registerUrl}
                            target="_blank"
                            className={`flex items-center px-4 py-2 text-sm text-white bg-black rounded-full transition-colors hover:opacity-80`}
                          >
                            {dayjs(event.startDateTime).format("DD/MM/YYYY")}
                          </Link>
                        </div>
                      </div>
                    </div>
                    <img
                      src={event.avatar?.url}
                      alt="Special Event"
                      className="object-cover object-center w-1/3"
                    />
                  </Link>
                </div>
              ))}

            {/* <div className="flex flex-col justify-between p-6 bg-orange-200 md:col-span-1 lg:col-span-1">
            <div>
              <h3 className="mb-2 text-sm">
                Growth In Community Deployed Smart Contracts Past 30 Days
              </h3>
              <div className="text-4xl font-bold">
                2000<span className="text-2xl">%</span>
              </div>
            </div>
            <div>
              <div className="text-sm">COTI Network</div>
              <div className="mt-12">
                <a
                  href="#"
                  className="flex items-center px-4 py-2 text-sm text-black bg-orange-300 rounded-full transition-colors hover:opacity-80 w-fit"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="mr-1 w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                    />
                  </svg>
                  Explorer
                </a>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-between p-6 bg-yellow-100 md:col-span-2 lg:col-span-2">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="mb-2 text-sm">Frontends Deployed in March</h3>
                <div className="text-5xl font-bold">258</div>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold">
                  New Prompt Engineer Projects
                </div>
                <div className="text-lg">Verified on COTI</div>
                <div className="text-sm opacity-60">#COTICreatives</div>
              </div>
            </div>
            <div className="flex justify-end mt-4 -space-x-2">
              <div className="overflow-hidden relative w-10 h-10 rounded-full border-2 border-white">
                <Image
                  src="/images/person_one.png"
                  alt="Team member 1"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="overflow-hidden relative w-10 h-10 rounded-full border-2 border-white">
                <Image
                  src="/images/person_two.png"
                  alt="Team member 2"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="overflow-hidden relative w-10 h-10 rounded-full border-2 border-white">
                <Image
                  src="/images/person_three.png"
                  alt="Team member 3"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="overflow-hidden relative w-10 h-10 rounded-full border-2 border-white">
                <Image
                  src="/images/person_four.png"
                  alt="Team member 1"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="overflow-hidden relative w-10 h-10 rounded-full border-2 border-white">
                <Image
                  src="/images/person_five.png"
                  alt="Team member 2"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="overflow-hidden relative w-10 h-10 rounded-full border-2 border-white">
                <Image
                  src="/images/person_six.png"
                  alt="Team member 3"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div> */}
          </div>
        )}
      </div>
    </section>
  );
}
