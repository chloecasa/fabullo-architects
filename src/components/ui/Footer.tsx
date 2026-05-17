"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Footer = () => {
  return (
    <footer className="bg-[#ffffff] h-screen w-full relative overflow-hidden border-t border-white/10">
      
      {/* --- Top Section: Links & CTA --- */}
      <div className="absolute top-[5%] left-[5%] right-[5%] flex flex-col md:flex-row justify-between items-start z-20">
        
        {/* Let's Talk CTA */}
        <div className="flex items-center gap-5 cursor-pointer group">
          <span className="font-lt-superior bold text-4xl md:text-5xl font-semibold text-black tracking-tight">
            LET’S TALK
          </span>
          <div className="relative w-10 h-10 transition-transform duration-300 group-hover:translate-x-2 group-hover:-translate-y-2">
            <Image 
              src="/assets/images/arrow.svg" 
              alt="Arrow" 
              fill 
              className="object-contain" 
            />
          </div>
        </div>

        {/* Navigation Columns */}
        <div className="flex gap-12 md:gap-24 mt-12 md:mt-0">
          <nav className="flex flex-col gap-4">
            <h4 className="text-[12px] opacity-50 font-mono tracking-widest">MENU</h4>
            <div className="flex flex-col gap-2 font-sans font-semibold text-xl">
              <Link href="/" className="hover:opacity-50 transition-opacity">HOME</Link>
              <Link href="/projects" className="hover:opacity-50 transition-opacity">PROJECTS</Link>
              <Link href="/profile" className="hover:opacity-50 transition-opacity">PROFILE</Link>
              <Link href="/journal" className="hover:opacity-50 transition-opacity">JOURNAL</Link>
            </div>
          </nav>
          
          <nav className="flex flex-col gap-4">
            <h4 className="text-[12px] opacity-50 font-mono tracking-widest">SOCIALS</h4>
            <div className="flex flex-col gap-2 font-sans font-semibold text-xl">
              <a href="#" className="hover:opacity-50 transition-opacity">INSTAGRAM</a>
              <a href="#" className="hover:opacity-50 transition-opacity">FACEBOOK</a>
              <a href="#" className="hover:opacity-50 transition-opacity">LINKEDIN</a>
              <a href="#" className="hover:opacity-50 transition-opacity">X</a>
            </div>
          </nav>
        </div>
      </div>

      {/* --- Large Background Typography --- */}
      <h1 className="text-black font-code font-bold text-[clamp(200px,30vw,446px)] absolute left-[1%] bottom-[5%] md:bottom-[-5%] leading-[0.8] select-none pointer-events-none">
        MGK
      </h1>
      
      <h2 className="text-black font-code font-bold text-[clamp(40px,8vw,108px)] absolute right-[2%] bottom-[10%] md:bottom-[12%] select-none pointer-events-none">
        architects
      </h2>

    </footer>
  );
};

export default Footer;
