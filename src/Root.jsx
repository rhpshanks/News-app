import { useEffect, useState } from "react";
import App from "./App.jsx";
import MethodologyPage from "./components/MethodologyPage.jsx";
import RoundupPage from "./components/RoundupPage.jsx";

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
  return (
    <App onNavigateMethodology={() => navigate("/methodology")} onNavigateRoundup={() => navigate("/roundup")} />
  );
}
