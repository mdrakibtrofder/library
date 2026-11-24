import { HashRouter, Route, Routes } from "react-router-dom";
import Layout from "@/components/Layout";
import Home from "@/pages/Home";
import Library from "@/pages/Library";
import Reader from "@/pages/Reader";
import NotFound from "@/pages/NotFound";
import { useRevealObserver } from "@/hooks/use-reveal";

// HashRouter keeps deep links (#/read/clean-code) working on GitHub Pages.
const Shell = () => {
  useRevealObserver();
  return (
    <Routes>
      <Route path="/read/:id" element={<Reader />} />
      <Route path="/" element={<Layout><Home /></Layout>} />
      <Route path="/library" element={<Layout><Library /></Layout>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <HashRouter>
    <Shell />
  </HashRouter>
);

export default App;
