This guide shows exactly which lines of code in your return block control the
fonts, sizes, positions, and images for each of the three slides.

Part 1: ABOUT US Layout

{slide.layout === "about-us" && (
  <div className="relative w-full h-full flex flex-col justify-between p-6 md:p-12 lg:p-16">
    {/* Top Section */}
    <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start justify-between w-full">
      
      {/* 🟢 IMAGE CONTAINER */}
      {/* Modify 'lg:w-[58%]' to make it wider/narrower. Modify 'aspect-[16/9]' to change its shape. */}
      <div className="relative w-full lg:w-[58%] aspect-[16/9] md:aspect-[2.2/1] overflow-hidden">
        <Image
          src={slide.image || "/assets/images/Tareola Image.png"}
          alt={slide.title}
          fill
          className="object-cover" // Controls how image fits inside container ('object-cover' or 'object-contain')
        />
      </div>
      
      {/* 🔵 DESCRIPTION PARAGRAPHS */}
      {/* Modify 'lg:w-[38%]' to adjust the column block width. */}
      {/* Modify 'font-sans' (font family), 'font-bold' (weight), and 'text-m' (font-size) to change text styles. */}
      {/* Note: 'text-m' is not a valid Tailwind class. Change it to 'text-sm' (14px) or 'text-base' (16px). */}
      <div className="flex flex-col sm:flex-row gap-6 lg:gap-12 w-full lg:w-[38%]">
        <p className="flex-1 font-sans font-bold text-sm leading-relaxed text-black text-justify">
          {slide.description}
        </p>
        <p className="flex-1 font-sans font-bold text-sm leading-relaxed text-black text-justify">
          {slide.descriptionTwo || slide.description}
        </p>
      </div>
    </div>

    {/* Bottom Section */}
    <div className="flex flex-col md:flex-row justify-between items-baseline gap-4 mt-auto w-full">
      {/* 🔴 MAIN TITLE ("ABOUT US") */}
      {/* Modify 'font-serif' to change font. Modify 'text-[clamp(3rem,10vw,15rem)]' to adjust how big/small it scales on screens. */}
      <h1 className="font-serif text-[clamp(3rem,10vw,15rem)] leading-none uppercase">
        {slide.title}
      </h1>
      
      {/* 🟡 "[GET TO KNOW MORE]" BUTTON */}
      {/* Modify 'font-sans' (font family), 'text-xl md:text-3xl lg:text-4xl' (responsive font-size checkpoints) */}
      <button
        type="button"
        onClick={goToProfile}
        className="font-sans text-xl md:text-3xl lg:text-4xl tracking-tight uppercase transition-opacity hover:opacity-40 whitespace-nowrap"
      >
        [GET TO KNOW MORE]
      </button>
    </div>
  </div>
)}

Part 2: TESTIMONIALS Layout

{slide.layout === "testimonials" && (
  <div className="relative w-full h-full flex flex-col md:flex-row bg-white">
    
    {/* 🟢 FULL HEIGHT IMAGE */}
    {/* Modify 'md:w-[49%]' to adjust how much width the left image occupies (e.g., 'md:w-[40%]') */}
    <div className="relative w-full md:w-[49%] h-1/2 md:h-full">
      <Image
        src={slide.image!}
        alt={slide.title}
        fill
        className="object-cover"
      />
    </div>

    {/* Right Side: Content Area */}
    <div className="flex-1 flex flex-col justify-between p-6 md:p-12 lg:p-16">
      {/* Header */}
      <div className="w-full">
        {/* 🔴 MAIN TITLE ("TESTIMONIALS") */}
        {/* Modify 'font-serif' and responsive scale clamp text sizes. */}
        <h1 className="font-serif text-[clamp(2.5rem,6vw,8rem)] leading-none uppercase font-bold tracking-tight">
          {slide.title}
        </h1>
      </div>

      {/* 🔵 TESTIMONIAL QUOTE */}
      {/* Modify 'max-w-xl' to change paragraph width boundary. */}
      {/* Modify 'text-xl md:text-2xl lg:text-3xl' to change the size of the active quote across devices. */}
      <div className="my-auto max-w-xl">
        <p className="font-sans text-xl md:text-2xl lg:text-3xl leading-relaxed text-black/70">
          {testimonials[testimonialIndex]}
        </p>
      </div>

      {/* 🟡 NAVIGATION BUTTONS */}
      {/* Modify 'gap-6' to change spacing between [prev] and [next]. */}
      {/* Modify 'text-lg md:text-xl' inside the buttons to change their text size. */}
      <div className="flex gap-6 items-center justify-end mt-auto self-end">
        <button
          type="button"
          onClick={() => setTestimonialIndex((prev) => prev - 1)}
          className={`font-sans text-lg md:text-xl font-bold uppercase transition-opacity hover:opacity-50 ${
            testimonialIndex > 0 ? "visible" : "invisible pointer-events-none"
          }`}
        >
          [prev]
        </button>
        <button
          type="button"
          onClick={() => setTestimonialIndex((prev) => prev + 1)}
          className={`font-sans text-lg md:text-xl font-bold uppercase transition-opacity hover:opacity-50 ${
            testimonialIndex < 2 ? "visible" : "invisible pointer-events-none"
          }`}
        >
          [next]
        </button>
      </div>
    </div>
  </div>
)}

Part 3: FEATURED Layout

{slide.layout === "featured" && (
  <div className="relative w-full h-full flex flex-col md:flex-row bg-white">
    {/* Left Side: Text Content */}
    <div className="flex-1 flex flex-col justify-between p-6 md:p-12 lg:p-16">
      {/* Header (Title & Subtitle) */}
      <div className="flex flex-col gap-2">
        {/* 🔴 MAIN TITLE ("FEATURED") */}
        {/* Modify font size clamp values here. */}
        <h1 className="font-serif text-[clamp(3rem,10vw,15rem)] leading-none uppercase font-bold text-black">
          {slide.title}
        </h1>
        {/* 🟠 SUBTITLE ("ON THE LOCAL PROJECT") */}
        {/* Modify 'text-xl md:text-3xl' to change size. */}
        {slide.subtitle && (
          <p className="font-sans text-xl md:text-3xl tracking-tight uppercase font-bold text-black/70">
            {slide.subtitle}
          </p>
        )}
      </div>

      {/* 🔵 DESCRIPTION PARAGRAPH POSITIONING */}
      {/* Modify 'md:self-end md:mr-16' to change where this block sits horizontally. 'max-w-sm' limits its width. */}
      {/* Modify 'text-lg md:text-xl' to change its text size. */}
      <div className="my-auto self-center md:self-end md:mr-16 max-w-sm">
        <p className="font-sans text-lg md:text-xl font-bold uppercase text-black/70 leading-relaxed text-justify">
          {slide.description}
        </p>
      </div>

      {/* Spacer to align spacing */}
      <div className="h-0 md:h-12" />
    </div>

    {/* 🟢 RIGHT SIDE IMAGE / VIDEO AREA */}
    {/* Modify 'md:w-[49%]' to adjust the horizontal split ratio (e.g. 'md:w-[40%]' or 'md:w-[50%]') */}
    <button
      type="button"
      data-cursor="[VIEW LOCAL PROJECT]"
      onClick={() => setIsVideoOpen(true)}
      className="relative w-full md:w-[49%] h-1/2 md:h-full cursor-none overflow-hidden group"
    >
      {slide.videoClip ? (
        <video
          src={slide.videoClip}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      ) : (
        <Image
          src={slide.image!}
          alt={slide.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
      )}
    </button>
  </div>
)}

Quick Tailwind CSS Reference for Adjustments:

  - Font Family: font-sans (standard geometric sans-serif), font-serif (classic
    editorial serif).
  - Font Weights: font-normal, font-semibold, font-bold.
  - Standard Sizes: text-xs (12px), text-sm (14px), text-base (16px), text-lg
    (18px), text-xl (20px), text-2xl (24px), text-3xl (30px), text-4xl (36px).
  - Responsive Breakpoints: Prefix any class with md: (tablets) or lg: (desktop
    screens) to override the default mobile size. For example: text-sm
    lg:text-lg will render 14px on mobile and 18px on desktop.
