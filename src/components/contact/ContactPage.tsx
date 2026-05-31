// src/components/contact/ContactPage.tsx
"use client";

import { useRef, useState, useMemo, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { submitInquiry } from "@/lib/actions/submitInquiry"; // 1. Import your secure Server Action

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
    message: ""
  });

  // State: Tracks if the user confirmed an input
  const [confirmedFields, setConfirmedFields] = useState({
    firstName: false,
    surname: false,
    email: false,
    phone: false,
    message: false
  });

  // State: Tracks checkbox acceptance, submitting state, error feedback, and submit completion [1]
  const [isPending, setIsPending] = useState(false); // Idempotency check state [1]
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // Error feedback state [1]
  const [isSubmitted, setIsSubmitted] = useState(false);

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

  // Entrance animations via GSAP
  useGSAP(
    () => {
      const formLines = gsap.utils.toArray<HTMLElement>(".contact-form-line");
      const formFields = gsap.utils.toArray<HTMLElement>(".contact-form-field");

      const tl = gsap.timeline();

      tl.set(imageRef.current, {
        opacity: 1,
        xPercent: -100,
      })
        .set(titleRef.current, {
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
        })
        .to(imageRef.current, {
          xPercent: 0,
          duration: 1.1,
          ease: "power4.out",
        })
        .to(
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
    if (e && e.key !== 'Enter') return;
    if (formData[field].trim() !== "") {
      setConfirmedFields((prev) => ({ ...prev, [field]: true }));
      if (e) (e.target as HTMLElement).blur();
    } else {
      setConfirmedFields((prev) => ({ ...prev, [field]: false }));
    }
  };

  // Form Validation: Checks if required fields are filled and the terms checkbox is ticked
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

  // Handle Form Submission asynchronously [1]
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || isPending) return;

    // 2. Lock inputs and buttons to prevent double-submitting (Idempotency) [1]
    setIsPending(true);
    setErrorMessage(null);

    // 3. Trigger the secure Server Action on Vercel [1]
    const result = await submitInquiry({
      firstName: formData.firstName,
      surname: formData.surname,
      email: formData.email,
      phone: formData.phone,
      subject: formData.subject,
      message: formData.message,
    });

    // 4. Release submission lock [1]
    setIsPending(false);

    if (result.success) {
      // Show success screen [1]
      setIsSubmitted(true);
    } else {
      // Display secure error feedback directly to the editor [1]
      setErrorMessage(result.error || "An unexpected error occurred. Please try again.");
    }
  };

  return (
    <main
      ref={pageRef}
      className="relative min-h-screen bg-white text-black"
    >
      <section className="relative min-h-screen bg-white">
        
        {/* Left Hand Split-Screen Image */}
       <div
  ref={imageRef}
  className="absolute left-0 top-0 h-full w-[45.7vw] overflow-hidden bg-zinc-400"
>
  <img
    src="/assets/images/Contact/ContactPage.png"
    alt=""
    className="h-full w-full object-cover"
  />

  <div className="absolute left-[20px] bottom-[738px] w-[634px] max-w-[calc(100%-40px)] text-justify justify-start">
    <span className="text-white text-xl font-bold font-['LT_Superior'] uppercase">
      NOMINATED ARCHITECT MARK CASHMAN 6232
      <br />
      <br />
    </span>
    <span className="text-white text-base font-medium font-['LT_Superior'] uppercase">
      To find out more information about any of the projects on the website, or to talk about your project please contact our studio
    </span>
  </div>
</div>

        {/* Dynamic Big Page Title */}
<h1
  ref={titleRef}
  className="absolute left-[20px] top-[20px] w-[1485px] max-w-[calc(100vw-40px)] justify-start font-['LT_Superior'] text-[clamp(7rem,20.5vw,310px)] font-bold uppercase leading-[0.82] pointer-events-none select-none z-10"
>
  <span className="text-white">Con</span>
  <span className="text-black">tacT</span>
</h1>

        {/* Right Hand Side Content Area */}
<div className="relative ml-[50.6vw] pt-[40vh] pb-[15vh] w-[38.2vw] flex flex-col justify-start">
          {isSubmitted ? (
            <div className="flex flex-col gap-4 animate-fade-in">
              <h2 className="text-5xl font-bold uppercase tracking-tighter font-['LT_Superior']">
                THANK YOU
              </h2>
              <span className="text-sm font-normal font-mono uppercase tracking-[0.2em] text-zinc-500">
                your message is delivered
              </span>
              <p className="text-sm text-zinc-700 leading-relaxed max-w-sm mt-4">
                We have received your message, {formData.firstName}. Our studio team will review your inquiry regarding "{formData.subject}" and get back to you shortly.
              </p>
            </div>
          ) : (
            <form 
              onSubmit={handleSubmit} 
              className="relative flex flex-col gap-6"
            >
              {/* Input Row: FIRST NAME & SURNAME */}
              <div className="contact-form-line grid grid-cols-2 gap-8 border-b border-black pb-2">
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
                  className={`contact-form-field bg-transparent text-lg uppercase placeholder:text-black/50 outline-none transition-opacity duration-300
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
                  className={`contact-form-field bg-transparent text-lg uppercase placeholder:text-black/50 outline-none transition-opacity duration-300
                    ${confirmedFields.surname ? "opacity-100 font-medium" : "opacity-40 focus:opacity-100"}
                    ${isPending ? "pointer-events-none opacity-20" : ""}
                  `}
                />
              </div>

              {/* Input Row: EMAIL */}
              <div className="contact-form-line border-b border-black py-2">
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
                  className={`contact-form-field w-full bg-transparent text-lg uppercase placeholder:text-black/50 outline-none transition-opacity duration-300
                    ${confirmedFields.email ? "opacity-100 font-medium" : "opacity-40 focus:opacity-100"}
                    ${isPending ? "pointer-events-none opacity-20" : ""}
                  `}
                />
              </div>

              {/* Input Row: PHONE */}
              <div className="contact-form-line border-b border-black py-2">
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
                  className={`contact-form-field w-full bg-transparent text-lg uppercase placeholder:text-black/50 outline-none transition-opacity duration-300
                    ${confirmedFields.phone ? "opacity-100 font-medium" : "opacity-40 focus:opacity-100"}
                    ${isPending ? "pointer-events-none opacity-20" : ""}
                  `}
                />
              </div>

              {/* Input Row: SUBJECT RADIO BUTTONS */}
             <div className="contact-form-line flex flex-col gap-2 pt-2 pb-6 border-b border-black">
                <span className="contact-form-field text-xs uppercase opacity-40 font-mono tracking-wider">
                  Subject (Required)
                </span>
                <div className="flex flex-col gap-2.5 mt-1">
                  {[
                    "Talk about project",
                    "Apply for position",
                    "Other"
                  ].map((option) => (
                    <label
                      key={option}
                      className={`contact-form-field flex items-center gap-3 cursor-pointer select-none text-sm uppercase opacity-60 hover:opacity-100 transition-opacity duration-200
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
                        className="hidden"
                      />
                      <span className="size-3.5 border border-black flex items-center justify-center shrink-0">
                        {formData.subject === option && <div className="size-2 bg-black" />}
                      </span>
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              </div>

             {/* Input Row: MESSAGE */}
<div className="contact-form-line border-b border-black pt-2 pb-16 h-44">
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
                  className={`contact-form-field h-full w-full resize-none bg-transparent text-lg uppercase placeholder:text-black/50 outline-none transition-opacity duration-300
                    ${confirmedFields.message ? "opacity-100 font-medium" : "opacity-40 focus:opacity-100"}
                    ${isPending ? "pointer-events-none opacity-20" : ""}
                  `}
                />
              </div>

              

              {/* Error Feedback Message [1] */}
              {errorMessage && (
                <div className="contact-form-field mt-4 text-xs font-mono uppercase text-red-600 leading-normal max-w-sm animate-fade-in">
                  [Error]: {errorMessage}
                </div>
              )}

              {/* Submit Button Wrapper */}
              <div
                ref={sendRef}
                className="self-end mt-12"
              >
                <button
                  type="submit"
                  disabled={!isFormValid || isPending}
                  className={`text-[clamp(4rem,7.5vw,115px)] font-bold uppercase leading-none transition-all duration-300
                    ${isFormValid && !isPending
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
