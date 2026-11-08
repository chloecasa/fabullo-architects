"use client";

import { useRef, useState, useMemo, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { submitInquiry } from "@/lib/actions/submitInquiry";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const ContactPage = () => {
  const pageRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const sendRef = useRef<HTMLDivElement>(null);

  // State: Tracks contact form input values
  const [formData, setFormData] = useState({
    firstName: "",
    surname: "",
    email: "",
    phone: "",
    subject: "", // Tracks selected subject option
    message: "",
  });

  // State: Tracks if the user confirmed an input
  const [confirmedFields, setConfirmedFields] = useState({
    firstName: false,
    surname: false,
    email: false,
    phone: false,
    message: false,
  });

  // State: Tracks submitting state, error feedback, and submit completion
  const [isPending, setIsPending] = useState(false); // Idempotency check state
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Tells the Header to hide its logo and nav while this hero is on screen
  useEffect(() => {
    const updateHeaderVisibility = () => {
      const contactBottom = pageRef.current?.getBoundingClientRect().bottom ?? 0;

      if (contactBottom > 0) {
        document.body.classList.add("contact-page-active");
      } else {
        document.body.classList.remove("contact-page-active");
      }
    };

    updateHeaderVisibility();

    window.addEventListener("scroll", updateHeaderVisibility);
    window.addEventListener("resize", updateHeaderVisibility);

    return () => {
      document.body.classList.remove("contact-page-active");
      window.removeEventListener("scroll", updateHeaderVisibility);
      window.removeEventListener("resize", updateHeaderVisibility);
    };
  }, []);

  // Entrance animations via GSAP (incorporating Rule C: matchMedia)
  useGSAP(
    () => {
      const formLines = gsap.utils.toArray<HTMLElement>(".contact-form-line");
      const formFields = gsap.utils.toArray<HTMLElement>(".contact-form-field");

      const tl = gsap.timeline();
      const mm = gsap.matchMedia();

      tl.set(titleRef.current, {
        clipPath: "inset(100% 0% 0% 0%)",
      })
        .set(formLines, {
          scaleX: 0,
          transformOrigin: "left center",
        })
        .set(formFields, {
          opacity: 0,
          y: 20,
        })
        .set(sendRef.current, {
          opacity: 0,
          y: 80,
        });

      // Complex image entrance runs ONLY on desktop screens where the element is visible
      mm.add("(min-width: 1024px)", () => {
        gsap.set(imageRef.current, {
          opacity: 1,
          xPercent: -100,
        });
        tl.to(
          imageRef.current,
          {
            xPercent: 0,
            duration: 1.1,
            ease: "power4.out",
          },
          0
        );
      });

      tl.to(
        titleRef.current,
        {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 1.1,
          ease: "power4.out",
        },
        0.15
      )
        .to(
          formLines,
          {
            scaleX: 1,
            duration: 0.7,
            stagger: 0.12,
            ease: "power3.out",
          },
          0.75
        )
        .to(
          formFields,
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.08,
            ease: "power3.out",
          },
          0.85
        )
        .to(
          sendRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power4.out",
          },
          1.15
        );

      ScrollTrigger.create({
        trigger: pageRef.current,
        start: "bottom 80%",
        end: "bottom top",
        scrub: true,
        onUpdate: (self) => {
          gsap.to(pageRef.current, {
            opacity: 1 - self.progress * 0.45,
            y: -self.progress * 80,
            duration: 0.1,
            overwrite: true,
          });
        },
      });
    },
    { scope: pageRef }
  );

  // Helper to change input state to confirmed (100% opacity) on keypress or blur
  const handleConfirmField = (field: keyof typeof confirmedFields, e?: React.KeyboardEvent) => {
    if (e && e.key !== "Enter") return;
    if (formData[field].trim() !== "") {
      setConfirmedFields((prev) => ({ ...prev, [field]: true }));
      if (e) (e.target as HTMLElement).blur();
    } else {
      setConfirmedFields((prev) => ({ ...prev, [field]: false }));
    }
  };

  // Form Validation: Checks if required fields are filled
  const isFormValid = useMemo(() => {
    return (
      formData.firstName.trim() !== "" &&
      formData.surname.trim() !== "" &&
      formData.email.trim() !== "" &&
      formData.subject !== "" &&
      formData.message.trim() !== "" &&
      !isPending
    );
  }, [formData, isPending]);

  // Handle Form Submission asynchronously
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || isPending) return;

    // Lock inputs and buttons to prevent double-submitting (Idempotency)
    setIsPending(true);
    setErrorMessage(null);

    // Trigger the secure Server Action on Vercel
    const result = await submitInquiry({
      firstName: formData.firstName,
      surname: formData.surname,
      email: formData.email,
      phone: formData.phone,
      subject: formData.subject,
      message: formData.message,
    });

    // Release submission lock
    setIsPending(false);

    if (result.success) {
      setIsSubmitted(true);
    } else {
      setErrorMessage(result.error || "An unexpected error occurred. Please try again.");
    }
  };

  return (
    <main ref={pageRef} className="relative min-h-svh bg-white text-black">
      <section className="relative min-h-svh bg-white rounded-none">
        {/* Component 1: Left Hand Split-Screen Image (desktop only: hidden below lg) */}
        <div
          ref={imageRef}
          className="absolute left-0 top-0 h-full w-[45.7vw] overflow-hidden bg-zinc-400 hidden lg:block rounded-none"
        >
          <img
            src="/assets/images/Contact/ContactPage.png"
            alt="Architectural space perspective"
            className="h-full w-full object-cover rounded-none"
          />

          <div className="absolute left-[20px] bottom-[738px] w-[634px] max-w-[calc(100%-40px)] text-justify justify-start rounded-none">
            <span className="text-white text-xl font-bold font-['LT_Superior'] uppercase rounded-none">
              NOMINATED ARCHITECT MARK CASHMAN 6232
              <br />
              <br />
            </span>
            <span className="text-white text-base font-medium font-['LT_Superior'] uppercase rounded-none">
              To find out more information about any of the projects on the website, or to talk about your project please contact our studio
            </span>
          </div>
        </div>

        {/* Component 2: Dynamic Big Page Title (Position & Text Sizing) */}
        <h1
          ref={titleRef}
          className={[
            "absolute justify-start font-['LT_Superior'] font-bold uppercase leading-[0.82] pointer-events-none select-none z-10 rounded-none",
            // 01. Mobile Min (320x640)
            "left-[12px] top-[73px] text-[48px]",
            // 02. Mobile Std (390x844)
            "min-[375px]:left-[12px] min-[375px]:top-[80px] min-[375px]:text-[56px]",
            // 03. Tablet Port (768x1024)
            "md:left-[20px] md:top-[110px] md:text-[96px]",
            // 04. Tablet Land (1024x768)
            "lg:left-[20px] lg:top-[20px] lg:text-[clamp(7rem,20.5vw,310px)] lg:w-[1485px] lg:max-w-[calc(100vw-40px)]",
          ].join(" ")}
        >
          {/* Note: "Con" is text-black on mobile (against the white page) and turns white on large displays */}
          <span className="text-black lg:text-white">Con</span>
          <span className="text-black">tacT</span>
        </h1>

        {/* Component 3: Right Hand Side Form Content Area */}
        <div
          className={[
            "relative flex flex-col justify-start rounded-none",
            // 01. Mobile Min (320x640) - Centered full width
            "ml-0 pt-[150px] px-[12px] pb-[40px] w-full",
            // 02. Mobile Std (390x844) - Centered full width
            "min-[375px]:ml-0 min-[375px]:pt-[160px] min-[375px]:px-[12px] min-[375px]:pb-[40px] min-[375px]:w-full",
            // 03. Tablet Port (768x1024) - Clean, centered full width layout
            "md:ml-0 md:pt-[240px] md:px-[40px] md:pb-[60px] md:w-full md:max-w-2xl md:mx-auto",
            // 04. Tablet Land (1024x768) - Desktop split layout
            "lg:ml-[50.6vw] lg:pt-[40vh] lg:pb-[15vh] lg:w-[38.2vw] lg:px-0 lg:max-w-none",
          ].join(" ")}
        >
          {isSubmitted ? (
            <div className="flex flex-col gap-4 animate-fade-in rounded-none">
              <h2 className="text-5xl font-bold uppercase tracking-tighter font-['LT_Superior'] rounded-none">
                THANK YOU
              </h2>
              <span className="text-sm font-normal font-mono uppercase tracking-[0.2em] text-zinc-500 rounded-none">
                your message is delivered
              </span>
              <p className="text-base text-zinc-700 leading-relaxed max-w-sm mt-4 rounded-none">
                We have received your message, {formData.firstName}. Our studio team will review your inquiry regarding {formData.subject} and get back to you shortly.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="relative flex flex-col gap-6 rounded-none"
            >
              {/* Input Row: FIRST NAME & SURNAME (stacked on phones, side by side from 640px) */}
              <div className="contact-form-line grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 border-b border-black pb-2 rounded-none">
                <input
                  type="text"
                  name="firstName"
                  disabled={isPending}
                  placeholder="First name (Required)"
                  value={formData.firstName}
                  onChange={(e) => {
                    setConfirmedFields((prev) => ({ ...prev, firstName: false }));
                    setFormData((prev) => ({ ...prev, firstName: e.target.value }));
                  }}
                  onKeyDown={(e) => handleConfirmField("firstName", e)}
                  onBlur={() => handleConfirmField("firstName")}
                  className={`contact-form-field bg-transparent text-lg uppercase placeholder:text-black/50 outline-none transition-opacity duration-300 rounded-none
                    ${confirmedFields.firstName ? "opacity-100 font-medium" : "opacity-40 focus:opacity-100"}
                    ${isPending ? "pointer-events-none opacity-20" : ""}
                  `}
                />

                <input
                  type="text"
                  name="surname"
                  disabled={isPending}
                  placeholder="Last name (Required)"
                  value={formData.surname}
                  onChange={(e) => {
                    setConfirmedFields((prev) => ({ ...prev, surname: false }));
                    setFormData((prev) => ({ ...prev, surname: e.target.value }));
                  }}
                  onKeyDown={(e) => handleConfirmField("surname", e)}
                  onBlur={() => handleConfirmField("surname")}
                  className={`contact-form-field bg-transparent text-lg uppercase placeholder:text-black/50 outline-none transition-opacity duration-300 rounded-none
                    ${confirmedFields.surname ? "opacity-100 font-medium" : "opacity-40 focus:opacity-100"}
                    ${isPending ? "pointer-events-none opacity-20" : ""}
                  `}
                />
              </div>

              {/* Input Row: EMAIL */}
              <div className="contact-form-line border-b border-black py-2 rounded-none">
                <input
                  type="email"
                  disabled={isPending}
                  placeholder="Email address (Required)"
                  value={formData.email}
                  onChange={(e) => {
                    setConfirmedFields((prev) => ({ ...prev, email: false }));
                    setFormData((prev) => ({ ...prev, email: e.target.value.toLowerCase() }));
                  }}
                  onKeyDown={(e) => handleConfirmField("email", e)}
                  onBlur={() => handleConfirmField("email")}
                  className={`contact-form-field w-full bg-transparent text-lg uppercase placeholder:text-black/50 outline-none transition-opacity duration-300 rounded-none
                    ${confirmedFields.email ? "opacity-100 font-medium" : "opacity-40 focus:opacity-100"}
                    ${isPending ? "pointer-events-none opacity-20" : ""}
                  `}
                />
              </div>

              {/* Input Row: PHONE */}
              <div className="contact-form-line border-b border-black py-2 rounded-none">
                <input
                  type="tel"
                  disabled={isPending}
                  placeholder="Phone"
                  value={formData.phone}
                  onChange={(e) => {
                    setConfirmedFields((prev) => ({ ...prev, phone: false }));
                    setFormData((prev) => ({ ...prev, phone: e.target.value }));
                  }}
                  onKeyDown={(e) => handleConfirmField("phone", e)}
                  onBlur={() => handleConfirmField("phone")}
                  className={`contact-form-field w-full bg-transparent text-lg uppercase placeholder:text-black/50 outline-none transition-opacity duration-300 rounded-none
                    ${confirmedFields.phone ? "opacity-100 font-medium" : "opacity-40 focus:opacity-100"}
                    ${isPending ? "pointer-events-none opacity-20" : ""}
                  `}
                />
              </div>

              {/* Input Row: SUBJECT RADIO BUTTONS */}
              <div className="contact-form-line flex flex-col gap-2 pt-2 pb-6 border-b border-black rounded-none">
                <span className="contact-form-field text-sm uppercase opacity-40 font-mono tracking-wider rounded-none">
                  Subject (Required)
                </span>
                <div className="flex flex-col gap-2.5 mt-1 rounded-none">
                  {["Talk about project", "Apply for position", "Other"].map((option) => (
                    <label
                      key={option}
                      className={`contact-form-field flex items-center gap-3 min-h-[44px] cursor-pointer select-none text-base uppercase opacity-60 hover:opacity-100 focus-within:opacity-100 transition-opacity duration-200 rounded-none
                        ${isPending ? "pointer-events-none opacity-20" : ""}
                      `}
                    >
                      <input
                        type="radio"
                        name="subject"
                        disabled={isPending}
                        value={option}
                        checked={formData.subject === option}
                        onChange={() => setFormData((prev) => ({ ...prev, subject: option }))}
                        className="hidden rounded-none"
                      />
                      <span className="size-3.5 border border-black flex items-center justify-center shrink-0 rounded-none">
                        {formData.subject === option && <div className="size-2 bg-black rounded-none" />}
                      </span>
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Input Row: MESSAGE */}
              <div className="contact-form-line border-b border-black pt-2 pb-16 h-44 rounded-none">
                <textarea
                  name="message"
                  disabled={isPending}
                  placeholder="Message (Required)"
                  value={formData.message}
                  onChange={(e) => {
                    setConfirmedFields((prev) => ({ ...prev, message: false }));
                    setFormData((prev) => ({ ...prev, message: e.target.value }));
                  }}
                  onBlur={() => handleConfirmField("message")}
                  className={`contact-form-field h-full w-full resize-none bg-transparent text-lg uppercase placeholder:text-black/50 outline-none transition-opacity duration-300 rounded-none
                    ${confirmedFields.message ? "opacity-100 font-medium" : "opacity-40 focus:opacity-100"}
                    ${isPending ? "pointer-events-none opacity-20" : ""}
                  `}
                />
              </div>

              {/* Error Feedback Message */}
              {errorMessage && (
                <div className="contact-form-field mt-4 text-sm font-mono uppercase text-red-600 leading-normal max-w-sm animate-fade-in rounded-none">
                  [Error]: {errorMessage}
                </div>
              )}

              {/* Submit Button Wrapper */}
              <div ref={sendRef} className="self-end mt-12 rounded-none">
                <button
                  type="submit"
                  disabled={!isFormValid || isPending}
                  className={`text-[clamp(4rem,7.5vw,115px)] font-bold uppercase leading-none transition-all duration-300 rounded-none
                    ${
                      isFormValid && !isPending
                        ? "opacity-100 hover:opacity-50 cursor-pointer"
                        : "opacity-25 pointer-events-none"
                    }
                  `}
                >
                  {isPending ? "Sending" : "Send"}
                </button>
              </div>
            </form>
          )}
        </div>
      </section>
    </main>
  );
};

export default ContactPage;
