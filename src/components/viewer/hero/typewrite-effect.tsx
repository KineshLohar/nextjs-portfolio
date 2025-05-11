'use client';

import { useState, useEffect } from "react";

// Define the words array as a constant of strings
const words: string[] = ['Full Stack Developer', 'Software Developer', 'React Developer', 'Front End Developer', 'MERN Developer'];

export const TypewriterEffect = () => {
  const [currentWord, setCurrentWord] = useState<string>(''); // Word that is being typed or deleted
  const [isDeleting, setIsDeleting] = useState<boolean>(false); // Whether we are deleting characters
  const [wordIndex, setWordIndex] = useState<number>(0); // Index to keep track of current word
  const [isTyping, setIsTyping] = useState<boolean>(true); // Whether we are typing or deleting
  const [charIndex, setCharIndex] = useState<number>(0); // Character index to handle typing/deleting

  useEffect(() => {
    let typingInterval: NodeJS.Timeout;
    let deletingInterval: NodeJS.Timeout;

    const currentWordText = words[wordIndex];

    // Typing effect
    if (isTyping) {
      typingInterval = setInterval(() => {
        setCurrentWord(() => currentWordText.substring(0, charIndex + 1));
        setCharIndex((prev) => prev + 1);

        // When the word is fully typed, start deleting
        if (charIndex === currentWordText.length) {
          clearInterval(typingInterval);
          setIsTyping(false);
          setTimeout(() => {
            setIsDeleting(true);
          }, 1000); // Wait for 1 second before starting to delete
        }
      }, 150); // Typing speed
    }

    // Deleting effect
    if (isDeleting) {
      deletingInterval = setInterval(() => {
        setCurrentWord(() => currentWordText.substring(0, charIndex - 1));
        setCharIndex((prev) => prev - 1);

        // When the word is fully deleted, move to the next word
        if (charIndex === 0) {
          clearInterval(deletingInterval);
          setIsDeleting(false);
          setWordIndex((prev) => (prev + 1) % words.length); // Loop back to the first word
          setTimeout(() => {
            setIsTyping(true);
          }, 500); // Wait for half a second before starting to type the next word
        }
      }, 50); // Deleting speed
    }

    return () => {
      clearInterval(typingInterval);
      clearInterval(deletingInterval);
    };
  }, [charIndex, isTyping, isDeleting, wordIndex]); // Trigger the effect whenever these states change

  return (
    <div className="w-full h-full flex justify-center items-center font-lato italic text-zinc-200 mt-2">
      <h3 className="sm:text-2xl">
        Passionate{" "}
        <span className="inline-block">{currentWord}</span>
        <span className="border-r-4 border-zinc-300 animate-blink"></span>
      </h3>
    </div>
  );
};
