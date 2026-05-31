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
    <div className="fixed inset-0 z-[3000] bg-black/20 flex items-center justify-center px-5">
      <div className="w-full max-w-xl bg-white p-8">
        <div className="flex items-start justify-between gap-6 mb-12">
          <h2 className="text-5xl font-bold uppercase leading-none">
            Subscribe
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="font-mono font-bold transition-opacity hover:opacity-40"
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
  <p className="text-3xl font-bold uppercase leading-none">
    Thank you. You are subscribed.
  </p>
) : (
  <>
    <label className="flex flex-col gap-2 text-2xl uppercase">
      Email
      <input
        type="email"
        required
        className="bg-transparent border-b border-black outline-none py-2"
      />
    </label>

    <button
      type="submit"
      className="self-end text-6xl font-bold uppercase transition-opacity hover:opacity-40"
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
