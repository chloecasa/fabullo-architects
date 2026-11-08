"use client";

import { useState } from "react";

interface SubscribeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SubscribeModal = ({ isOpen, onClose }: SubscribeModalProps) => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[3000] flex items-center justify-center bg-black/20 px-4 sm:px-5">
      <div className="max-h-[90svh] w-full max-w-xl overflow-y-auto bg-white p-6 sm:p-8">
        <div className="mb-8 flex items-start justify-between gap-4 sm:mb-12 sm:gap-6">
          <h2 className="text-4xl font-bold uppercase leading-none sm:text-5xl">
            Subscribe
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] shrink-0 font-mono text-sm font-bold transition-opacity hover:opacity-40 sm:text-base"
          >
            [ CLOSE ]
          </button>
        </div>

        <form
          className="flex flex-col gap-8"
          onSubmit={(e) => {
            e.preventDefault();
            setIsSubmitted(true);
          }}
        >
          {isSubmitted ? (
            <p className="text-2xl font-bold uppercase leading-tight sm:text-3xl">
              Thank you. You are subscribed.
            </p>
          ) : (
            <>
              <label className="flex flex-col gap-2 text-lg uppercase sm:text-2xl">
                Email
                <input
                  type="email"
                  required
                  className="border-b border-black bg-transparent py-2 text-base outline-none sm:text-lg"
                />
              </label>

              <button
                type="submit"
                className="min-h-[44px] self-end text-4xl font-bold uppercase transition-opacity hover:opacity-40 sm:text-6xl"
              >
                Submit
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default SubscribeModal;
