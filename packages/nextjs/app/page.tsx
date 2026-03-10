"use client";

import type { NextPage } from "next";

const Home: NextPage = () => {
  return (
    <div className="min-h-screen bg-base-200">
      <section className="grid lg:grid-cols-2 min-h-[calc(100vh-4rem)]">
        <div className="flex flex-col justify-center px-8 lg:px-16 py-20 border-b lg:border-b-0 lg:border-r border-base-300">
          <div className="flex items-center gap-2 mb-7">
            <span className="w-5 h-px bg-primary" />
            <span className="text-primary text-xs font-medium tracking-[0.2em] uppercase">
              Hawaiian Coffee · On-Chain
            </span>
          </div>

          <h1 className="flex flex-col gap-1 font-serif text-5xl lg:text-7xl font-light leading-[1.08] text-base-content mb-7">
            <span>
              <span className="italic text-accent">Trace</span> Every
            </span>
            <span className="font-semibold">Bean&apos;s Journey</span>
            <span>to Your Cup</span>
          </h1>

          <p className="text-secondary text-base font-light leading-relaxed max-w-md mb-10">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer sem erat, finibus non nisl nec, scelerisque
            rutrum ligula. Cras dictum congue ante commodo posuere. Etiam imperdiet eu lacus facilisis ornare. Donec
            eleifend nec quam ac suscipit.
          </p>

          <div className="flex flex-wrap gap-3 mb-10">
            <button className="btn btn-primary px-7 text-sm tracking-wide">Track Your Coffee</button>
            <button className="btn btn-ghost border border-base-300 px-7 text-sm tracking-wide">View on Chain</button>
          </div>
        </div>

        <div className="flex flex-col justify-center px-8 lg:px-16 py-20 gap-6">
          <div className="flex w-full bg-base-100 border border-base-300 rounded-xl overflow-hidden focus-within:ring-1 focus-within:ring-primary transition-all">
            <input
              type="text"
              placeholder="Enter Batch ID..."
              className="flex-1 bg-transparent px-5 py-4 text-base-content placeholder-secondary/50 outline-none"
            />
            <button
              type="button"
              className="btn btn-ghost rounded-none border-0 border-l border-base-300 px-7 text-sm tracking-wide h-auto"
            >
              Submit
            </button>
          </div>

          <div className="grid grid-cols-2 gap-px bg-base-300 border border-base-300 rounded-xl overflow-hidden">
            <div className="bg-base-100 p-7 hover:bg-base-200 transition-colors">
              <div className="font-serif text-5xl font-light text-base-content leading-none mb-1">---</div>
              <div className="text-xs text-secondary uppercase tracking-widest">Batches Tracked</div>
            </div>

            <div className="bg-base-100 p-7 hover:bg-base-200 transition-colors">
              <div className="font-serif text-5xl font-light text-base-content leading-none mb-1">---</div>
              <div className="text-xs text-secondary uppercase tracking-widest">Verified Farms</div>
            </div>

            <div className="bg-base-100 p-7 hover:bg-base-200 transition-colors">
              <div className="font-serif text-5xl font-light text-base-content leading-none mb-1">---</div>
              <div className="text-xs text-secondary uppercase tracking-widest">Islands</div>
            </div>

            <div className="bg-base-100 p-7 hover:bg-base-200 transition-colors">
              <div className="font-serif text-5xl font-light text-base-content leading-none mb-1">---</div>
              <div className="text-xs text-secondary uppercase tracking-widest">On-Chain Verified</div>
            </div>
          </div>

          <div className="flex items-center gap-3 px-5 py-4 bg-base-100 border border-base-300 rounded-xl text-sm text-secondary">
            <div className="inline-grid *:[grid-area:1/1]">
              <div className="status status-success animate-ping"></div>
              <div className="status status-success"></div>
            </div>
            Live · - new batches verified in the past day
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
