import Nav from "../components/nav";
import Hero from "../components/hero";
import BountyGrid from "../components/bounty-grid";
import StatsGrid from "../components/stats-grid";
import AgentGrid from "../components/agent-grid";
import videos from "@/data/videos-data";
import CurrentAwards from "../components/community-awards";
import dynamic from "next/dynamic";
import CommunityStories from "../components/community-stories";

// Dynamically import heavy components
const VideoGrid = dynamic(() => import("../components/video-grid"), {
  loading: () => <div>Loading...</div>,
  ssr: false, // Disable server-side rendering for video grid
});

// Use lazy loading for images
// const DynamicImage = dynamic(() => import("next/image"));

export default function Home() {
  return (
    <main>
      <Hero />
      <CommunityStories />
      <StatsGrid />
      <BountyGrid />
      {/* <CurrentAwards />
        <VideoGrid
          title="Feburary '25 Posthoc Creator Awards"
          description="The COTI WAGMI Commity found and awarded these COTI creatives who are sharing important content in the wild."
          videos={videos}
        />
        <AgentGrid /> */}
    </main>
  );
}
