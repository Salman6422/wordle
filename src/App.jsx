import React, { useEffect, useState } from 'react'

const API_URL = ""
const WORD_LENGTH = 5; 

const App = () => {

  const [solution, setSolution] = useState('')
  const [guesses, setGuesses] = useState(Array(6).fill(null));
  const [currentGuess, setCurrentGuess] = useState('')
  const [isGameOver, setIsGameOver] = useState(false)

  useEffect(() => {
    const handleType = (event)=>{

      if (isGameOver) {
        return;
      }

      if (event.key === 'Enter') {
        if (currentGuess.length !== 5) {
          return;
        }
        const isCorrect = solution === currentGuess;
        if (isCorrect) {
          setIsGameOver(true);
        }
      }

      if (event.key === 'Backspace') {
        setCurrentGuess(currentGuess.slice(0, -1));
        return
      }

      if (currentGuess.length >= 5) {
        return;
      }

      setCurrentGuess(oldGuess => oldGuess + event.key);
    };

    window.addEventListener('keydown',handleType);

    return () => window.addEventListener('keydown', handleType);

  }, [currentGuess, isGameOver, solution]);
  

  useEffect(()=>{
    const fetchWord = async ()=>{
      const response = await fetch(API_URL);
      const words = await response.json();
      const randomWord = words[Math.floor(Math.random * words.length)];
      setSolution(randomWord);
    }

    fetchWord();

  },[]);

  return (
    <div className='board'>
      {
      guesses.map((guess, i) => {
        const isCurrentGuess = i === guesses.findIndex(val => val == null);
        return (
          <Line guess={isCurrentGuess ? currentGuess : guess ?? ""}/>
        )
      })
      }
      {/* {oldGuess} */}
    </div>
  )
}

export default App


function Line({ guess }){
  const tiles = [];
  for(let i=0; i<WORD_LENGTH; i++){
    const char = guess[i];
    tiles.push(<div className='tile'>{char}</div>)
  }
  return <div className='line'>
    {tiles}
  </div>
}