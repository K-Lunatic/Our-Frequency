import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import Home from "@/pages/Home";
import Test from "@/pages/Test";
import Result from "@/pages/Result";
import Synergy from "@/pages/Synergy";
import RealSaju from "@/pages/RealSaju";
import Sync from "@/pages/Sync";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          element={
            <div className="relative min-h-screen bg-[#FCF9F2] text-stone-800 overflow-x-hidden font-suit">
              <div className="relative z-10">
                <Outlet />
              </div>
            </div>
          }
        >
          <Route path="/" element={<Home />} />
          <Route path="/test" element={<Test />} />
          <Route path="/result" element={<Result />} />
          <Route path="/synergy" element={<Synergy />} />
          <Route path="/realsaju" element={<RealSaju />} />
          <Route path="/sync" element={<Sync />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
