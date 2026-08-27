import { useEffect, useState } from "react";
import App from "./App.jsx";
import MethodologyPage from "./components/MethodologyPage.jsx";
import RoundupPage from "./components/RoundupPage.jsx";
import AboutPage from "./components/AboutPage.jsx";
import ContactPage from "./components/ContactPage.jsx";
import PrivacyPage from "./components/PrivacyPage.jsx";
import AdvertisePage from "./components/AdvertisePage.jsx";
import TrackRecordPage from "./components/TrackRecordPage.jsx";
import TopicPage from "./components/TopicPage.jsx";

const TOPIC_CATEGORIES = ["economic", "political", "social"];

// A hand-rolled router rather than a library, there are only two real pages here.
// Plain <a href> links trigger full navigation (good for crawlers and "open in new
// tab"), this just reads the resulting path and clicks are intercepted only where we
// want an SPA-style transition without a full reload.
export default function Root() {
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    function onPopState() {
      setPath(window.location.pathname);
    }
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  function navigate(to) {
    window.history.pushState({}, "", to);
    setPath(to);
    window.scrollTo(0, 0);
  }

  if (path === "/methodology") {
    return <MethodologyPage onNavigateHome={() => navigate("/")} />;
  }
  if (path === "/roundup") {
    return (
      <RoundupPage onNavigateHome={() => navigate("/")} onNavigateMethodology={() => navigate("/methodology")} />
    );
  }
  if (path === "/about") {
    return (
      <AboutPage
        onNavigateHome={() => navigate("/")}
        onNavigateMethodology={() => navigate("/methodology")}
        onNavigateContact={() => navigate("/contact")}
      />
    );
  }
  if (path === "/contact") {
    return <ContactPage onNavigateHome={() => navigate("/")} />;
  }
  if (path === "/privacy") {
    return <PrivacyPage onNavigateHome={() => navigate("/")} onNavigateContact={() => navigate("/contact")} />;
  }
  if (path === "/advertise") {
    return <AdvertisePage onNavigateHome={() => navigate("/")} onNavigateContact={() => navigate("/contact")} />;
  }
  if (path === "/track-record") {
    return (
      <TrackRecordPage
        onNavigateHome={() => navigate("/")}
        onNavigateMethodology={() => navigate("/methodology")}
        onNavigateContact={() => navigate("/contact")}
      />
    );
  }
  const topicMatch = TOPIC_CATEGORIES.find((cat) => path === `/topic/${cat}`);
  if (topicMatch) {
    return (
      <TopicPage
        category={topicMatch}
        onNavigateHome={() => navigate("/")}
        onNavigateMethodology={() => navigate("/methodology")}
      />
    );
  }
  return (
    <App
      onNavigateMethodology={() => navigate("/methodology")}
      onNavigateRoundup={() => navigate("/roundup")}
      onNavigateAbout={() => navigate("/about")}
      onNavigateContact={() => navigate("/contact")}
      onNavigatePrivacy={() => navigate("/privacy")}
      onNavigateAdvertise={() => navigate("/advertise")}
      onNavigateTrackRecord={() => navigate("/track-record")}
      onNavigateTopic={(cat) => navigate(`/topic/${cat}`)}
    />
  );
}
