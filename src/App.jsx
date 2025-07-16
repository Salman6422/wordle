import React, { useEffect, useState } from 'react'

const API_URL = "https://random-word-api.vercel.app/api?words=100&length=5";
const WORD_LENGTH = 5; 

const App = () => {
  const [solution, setSolution] = useState('')
  const [guesses, setGuesses] = useState(Array(6).fill(null));
  const [currentGuess, setCurrentGuess] = useState('')
  const [isGameOver, setIsGameOver] = useState(false)

  useEffect(() => {
    const handleType = (event) => {
      if (isGameOver) return;

      if (event.key === 'Enter') {
        if (currentGuess.length !== 5) return;

        const newGuesses = [...guesses];
        newGuesses[guesses.findIndex(val => val === null)] = currentGuess;
        setGuesses(newGuesses);
        setCurrentGuess('');

        if (solution === currentGuess) {
          setIsGameOver(true);
        }
        return;
      }

      if (event.key === 'Backspace') {
        setCurrentGuess(currentGuess.slice(0, -1));
        return;
      }

      if (currentGuess.length >= 5) return;
      if (!event.key.match(/^[a-z]$/i)) return;

      setCurrentGuess(oldGuess => oldGuess + event.key.toUpperCase());
    };

    window.addEventListener('keydown', handleType);
    return () => window.removeEventListener('keydown', handleType);
  }, [currentGuess, isGameOver, solution, guesses]);

  useEffect(() => {
    const fetchWord = async () => {
      try {
        const response = await fetch(API_URL);
        const words = await response.json();
        const randomWord = words[Math.floor(Math.random() * words.length)].toUpperCase();
        setSolution(randomWord);
      } catch (error) {
        console.error("Failed to fetch word:", error);
        setSolution(API_URL);
      }
    }

    fetchWord();
  }, []);

  return (
    <>
    {/* <div>{solution}</div> */}
      <h1 className='wordle'>wordle</h1>
      {/* <div className='solution'>{solution}</div> */}
      <div className='board'>
        {guesses.map((guess, i) => {
          const isCurrentGuess = i === guesses.findIndex(val => val === null);
          return (
            <Line 
              key={i}
              guess={isCurrentGuess ? currentGuess : guess ?? ""}
              isFinal={!isCurrentGuess && guess !== null}
              solution={solution}
            />
          )
        })}
      </div>
    </>
  )
}

export default App

function Line({ guess, isFinal, solution }) {
  const tiles = [];
  
  for (let i = 0; i < WORD_LENGTH; i++) {
    const char = guess[i];
    let className = 'tile';
    
    if (isFinal) {
      if (char === solution[i]) {
        className += ' correct';
      } else if (solution.includes(char)) {
        className += ' close';
      } else {
        className += ' incorrect';
      }
    }
    
    tiles.push(
      <div key={i} className={className}>
        {char}
      </div>
    );
  }
  
  return <div className='line'>{tiles}</div>;
}