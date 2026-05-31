"use client";

import { useRef, useState, useMemo } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const ContactPage = () => {
  const pageRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const mgkRef = useRef<HTMLDivElement>(null);
  const sendRef = useRef<HTMLDivElement>(null);

  // Survey modal state
  const [isSurveyOpen, setIsSurveyOpen] = useState(false);

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

  // State: Tracks checkbox acceptance and submit completion
  const [isAccepted, setIsAccepted] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Entrance animations via GSAP
  useGSAP(
    () => {
      const formLines = gsap.utils.toArray<HTMLElement>(".contact-form-line");
      const formFields = gsap.utils.toArray<HTMLElement>(".contact-form-field");

      const tl = gsap.timeline({
        onComplete: () => {
          setTimeout(() => {
            setIsSurveyOpen(true);
          }, 1200);
        }
      });

      tl.set(imageRef.current, {
        opacity: 1,
        xPercent: -100,
      })
        .set(titleRef.current, {
          clipPath: "inset(100% 0% 0% 0%)",
        })
        .set(mgkRef.current, {
          opacity: 0,
          y: 40,
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
          mgkRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
          },
          0.65
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
      isAccepted
    );
  }, [formData, isAccepted]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    setIsSubmitted(true);
  };

  return (
    <main
      ref={pageRef}
      className="relative min-h-screen bg-amber-50 text-black"
    >
      <section className="relative min-h-screen bg-amber-50">
        
        {/* Left Hand Split-Screen Image (stretches to match the height of content) */}
        <div
          ref={imageRef}
          className="absolute left-0 top-0 h-full w-[45.7vw] overflow-hidden bg-zinc-400"
        >
          <img
            src="/assets/images/hero.png"
            alt=""
            className="h-full w-full object-cover"
          />
        </div>

        {/* Dynamic Big Page Title */}
        <h1
          ref={titleRef}
          className="absolute left-0 top-[-2.5vw] w-full text-[clamp(7rem,20.5vw,310px)] font-bold uppercase leading-[0.82] tracking-[-0.04em] pointer-events-none select-none z-10"
        >
          <span className="text-white">Con</span>
          <span className="text-black">tacT</span>
        </h1>

        {/* Visual MGK Marker */}
        <div
          ref={mgkRef}
          className="absolute left-[25.3vw] top-[35vh] text-[clamp(4rem,8vw,128px)] font-bold uppercase leading-none text-white select-none pointer-events-none z-15"
        >
          mgk
        </div>

        {/* Right Hand Side Content Area - Uses natural flex layout with safe padding-bottom */}
        <div className="relative ml-[50.6vw] pt-[30vh] pb-[15vh] w-[38.2vw] flex flex-col justify-start">
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
                  `}
                />

                <input
                  type="text"
                  name="surname"
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
                  `}
                />
              </div>

              {/* Input Row: EMAIL */}
              <div className="contact-form-line border-b border-black py-2">
                <input
                  type="email"
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
                  `}
                />
              </div>

              {/* Input Row: PHONE */}
              <div className="contact-form-line border-b border-black py-2">
                <input
                  type="tel"
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
                  `}
                />
              </div>

              {/* Input Row: SUBJECT CHECKBOXES (Required) */}
              <div className="contact-form-line flex flex-col gap-2 py-2 border-b border-black">
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
                      className="contact-form-field flex items-center gap-3 cursor-pointer select-none text-sm uppercase opacity-60 hover:opacity-100 transition-opacity duration-200"
                    >
                      <input
                        type="radio"
                        name="subject"
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
              <div className="contact-form-line border-b border-black py-2 h-28">
                <textarea
                  name="message"
                  placeholder="Message (Required)"
                  value={formData.message}
                  onChange={(e) => {
                    setConfirmedFields((prev) => ({ ...prev, message: false }));
                    setFormData((prev) => ({ ...prev, message: e.target.value }));
                  }}
                  onBlur={() => handleConfirmField("message")}
                  className={`contact-form-field h-full w-full resize-none bg-transparent text-lg uppercase placeholder:text-black/50 outline-none transition-opacity duration-300
                    ${confirmedFields.message ? "opacity-100 font-medium" : "opacity-40 focus:opacity-100"}
                  `}
                />
              </div>

              {/* Checkbox & Google Disclosure Area */}
              <div className="contact-form-field mt-1 flex items-start gap-4">
                
                {/* Interactive Custom Checkbox */}
                <button
                  type="button"
                  onClick={() => setIsAccepted(!isAccepted)}
                  className="mt-1 size-3.5 border border-black flex items-center justify-center cursor-pointer shrink-0"
                >
                  {isAccepted && <div className="size-2 bg-black" />}
                </button>

                <p className="max-w-72 text-[10px] uppercase leading-tight text-zinc-600">
                  This site is protected by reCAPTCHA and the Google{" "}
                  <span className="underline">Privacy Policy</span> and{" "}
                  <span className="underline">Terms of Service</span> apply
                  <br />
                  <br />
                  For information on how to unsubscribe, please review{" "}
                  <span className="underline">our privacy policy.</span>
                </p>
              </div>

              {/* Submit Button Wrapper aligned dynamic-right */}
              <div
                ref={sendRef}
                className="self-end mt-12"
              >
                <button
                  type="submit"
                  className={`text-[clamp(4rem,7.5vw,115px)] font-bold uppercase leading-none transition-all duration-300
                    ${isFormValid 
                      ? "opacity-100 hover:opacity-50 cursor-pointer" 
                      : "opacity-25 pointer-events-none"
                    }
                  `}
                >
                  Send
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
