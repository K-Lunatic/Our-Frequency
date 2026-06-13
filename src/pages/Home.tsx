import { useState } from "react";
import { useNavigate } from "react-router-dom";

import HeroCanvas from "@/features/home/components/HeroCanvas";
import HomeActionNav from "@/features/home/components/HomeActionNav";

const USER_CODE_KEY = "user_frequency_code";

export default function Home() {
  const [hasCode] = useState(() => !!localStorage.getItem(USER_CODE_KEY));

  return (
    <main className="layout-page">
      <HeroCanvas />
      <section className="relative z-10 w-full h-full flex flex-col items-center justify-start px-6 pt-[6vh] pointer-events-none">
        <header className="surface-glass !bg-white/40 !backdrop-blur-lg border-white/50 p-8 rounded-[2.5rem] rounded-br-[1rem] text-center w-full max-w-[350px] shadow-[0_8px_32px_rgba(0,0,0,0.06)]">
          <span className="text-subtitle mb-3">Moonlight Garden</span>
          <h1 className="text-hero flex flex-col gap-2">
            <span className="text-[13px] text-stone-500 font-bold tracking-widest uppercase">안녕!</span>
            <span className="leading-snug text-[1.4rem]">네 마음속엔 어떤 달이<br />살고 있니?</span>
          </h1>
        </header>

        <div className="w-full max-w-[320px] mt-[42vh] pointer-events-auto">
          <HomeActionNav hasCode={hasCode} />
        </div>
      </section>
    </main>
  );
}