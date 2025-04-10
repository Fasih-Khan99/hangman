"use client";
import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

const wordList = [
    // Fruits
    "apple", "banana", "apricot", "blueberry", "cherry", "grapefruit", "kiwi",
    "lemon", "lime", "mango", "orange", "papaya", "peach", "pear", "pineapple",
    "plum", "pomegranate", "raspberry", "strawberry", "watermelon",
  
    // Programming
    "javascript", "typescript", "react", "angular", "nodejs", "frontend", "backend", "variable",
    "function", "component", "developer", "database", "framework", "syntax", "typescript",
  
    // Celebrities
    "tom cruise", "john cena", "emma watson", "keanu reeves", "chris hemsworth",
    "leonardo dicaprio", "robert downey jr", "margot robbie", "Undertaker", "Ronaldo", "Messi", "Neymar", "Dhoni",
  
    // Animals
    "elephant", "giraffe", "kangaroo", "crocodile", "penguin", "dolphin", "cheetah", "lion",
    "tiger", "zebra", "octopus", "gorilla", "koala",
  
    // Movies & Shows
    "harry potter", "breaking bad", "stranger things", "avengers", "batman", "superman",
    "spiderman", "jurassic park", "fast and furious", "lord of the rings", "Peaky Blinders",
  
    // Random Fun Words
    "hangman", "puzzle", "unicorn", "spaceship", "galaxy", "rainbow", "wizard", "pirate",
    "treasure", "volcano", "island", "fireworks", "hamburger", "donut", "robot", "ninja",
    "ice cream", "mountain", "submarine", "skateboard", "trampoline", "campfire", "backpack",
  
    // Places
    "new york", "los angeles", "london", "paris", "tokyo", "dubai", "barcelona", "istanbul",
    "sydney", "rome", "berlin", "moscow", "toronto", "karachi", "lahore", "delhi", "singapore"
  ];
  
const MAX_ATTEMPTS = 6;

const HANGMAN_STAGES = [
  `\n\n\n\n\n😄`, `\n\n\n\n\n😐`, `\n\n\n\n😕`, `\n\n\n😟`, `\n\n☹️`, `\n😣`, `😵`,
];

export default function HangmanGame() {
  const router = useRouter();
  const [word, setWord] = useState("");
  const [guesses, setGuesses] = useState<string[]>([]);
  const [wrongGuesses, setWrongGuesses] = useState<string[]>([]);
  const [guess, setGuess] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);

  // Audio refs
  const bgMusicRef = useRef<HTMLAudioElement | null>(null);
  const loseSoundRef = useRef<HTMLAudioElement | null>(null);
  const winSoundRef = useRef<HTMLAudioElement | null>(null);
  const [hintLetter, setHintLetter] = useState("");

  // Start game music
  const startGameMusic = () => {
    if (!bgMusicRef.current) {
      bgMusicRef.current = new Audio("/Game.mp3");
      bgMusicRef.current.loop = true;
    }
    bgMusicRef.current.play().catch(() => {});
  };

  // Stop game music
  const stopGameMusic = () => {
    if (bgMusicRef.current) {
      bgMusicRef.current.pause();
      bgMusicRef.current.currentTime = 0;
    }
  };

  // Play lose sound
  const playLoseSound = () => {
    stopGameMusic(); // stop game music first
    if (!loseSoundRef.current) {
      loseSoundRef.current = new Audio("/gameover.mp3");
    }
    loseSoundRef.current.play().catch(() => {});
  };

  // Play winning sound
  const playWinSound = () => {
    stopGameMusic(); // stop game music first
    if (!winSoundRef.current) {
      winSoundRef.current = new Audio("/Victory.mp3");
    }
    winSoundRef.current.play().catch(() => {});
  };

  // Reset game logic
  const resetGame = () => {
    const newWord = wordList[Math.floor(Math.random() * wordList.length)];
    const hint = newWord[Math.floor(Math.random() * newWord.length)];

    setWord(newWord);
    setGuesses([hint]);  // show one letter as hint
    setHintLetter(hint);
    setWrongGuesses([]);
    setGuess("");
    setGameOver(false);
    setWon(false);

    stopGameMusic();
    if (loseSoundRef.current) {
      loseSoundRef.current.pause();
      loseSoundRef.current.currentTime = 0;
    }


    startGameMusic();
  };

  useEffect(() => {
    const randomWord = wordList[Math.floor(Math.random() * wordList.length)];
    const hint = randomWord[Math.floor(Math.random() * randomWord.length)];
    setWord(randomWord);
    setGuesses([hint]);
    setHintLetter(hint);
    startGameMusic();

    return () => {
      stopGameMusic();
    };
  }, []);

  const handleGuess = () => {
    if (!guess || gameOver) return;

    const lower = guess.toLowerCase();
    setGuess("");

    if (guesses.includes(lower) || wrongGuesses.includes(lower)) return;

    if (word.includes(lower)) {
      const updatedGuesses = [...guesses, lower];
      setGuesses(updatedGuesses);

      const allLettersGuessed = word.split("").every((letter) => updatedGuesses.includes(letter));
      if (allLettersGuessed) {
        setWon(true);
        setGameOver(true);
        stopGameMusic();
        playWinSound();
      }
    } else {
      const updatedWrong = [...wrongGuesses, lower];
      setWrongGuesses(updatedWrong);

      if (updatedWrong.length >= MAX_ATTEMPTS) {
        setGameOver(true);
        setWon(false);
        playLoseSound();
      }
    }
  };

  const renderWord = () => {
    return word
      .split("")
      .map((letter, idx) => (guesses.includes(letter) ? letter : "_"))
      .join(" ");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black p-4">
      <div className="bg-gray-950 shadow-md rounded-lg p-6 w-full max-w-md text-center h-150">
        <h1 className="text-4xl font-bold mb-4 text-center">🪓 Hangman</h1>
       
        {!word ? (
          <p className="text-gray-100 text-2xl">Loading word...</p>
        ) : (
          <>
            <pre className="text-4xl mb-4 bg-[url('/hanging.png')] bg-no-repeat bg-contain bg-center">
            <br/>
                {HANGMAN_STAGES[wrongGuesses.length]}
            </pre>
            
            <p className="text-xl tracking-widest mb-2">{renderWord()}</p>
            <p className="text-sm text-gray-500 mb-2">
              Remaining Attempts: {MAX_ATTEMPTS - wrongGuesses.length}
            </p>
            <p className="text-sm text-red-500 mb-4">
              Wrong Guesses: {wrongGuesses.join(", ")}
            </p>

            {!gameOver && (
              <div className="flex gap-2 justify-center">
                <input
                  type="text"
                  value={guess}
                  maxLength={1}
                  onChange={(e) => setGuess(e.target.value)}
                  className="border px-2 py-1 w-12 text-center"
                />
                <button
                  onClick={handleGuess}
                  className="bg-green-500 text-white px-4 py-1 rounded-3xl hover:bg-red-500"
                >
                  Guess
                </button>
              </div>
            )}

            {gameOver && (
              <div className="mt-4 font-semibold text-lg">
                {won ? "🎉 You won!" : `💀 Game Over! The word was "${word}".`}
                <br />
                <button
                  onClick={resetGame}
                  className="rounded-3xl mt-4 bg-green-500 text-white px-4 py-2 hover:bg-green-600 transition-transform transform hover:scale-105"
                >
                  Restart Game
                </button>
              </div>
            )}
          </>
        )}
         <button
        onClick={() => router.push("/")}
        className="rounded-3xl bg-green-500 hover:bg-red-500 px-4 py-2 mt-5  font-bold transition-transform transform hover:scale-105"
      >
        Quit Game
      </button>
      </div>
    </div>
  );
}
