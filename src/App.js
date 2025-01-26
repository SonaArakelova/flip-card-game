import './App.css';
import React, { useState, useEffect } from 'react';
import { faker } from '@faker-js/faker'; 

const generateDeck = (numPairs) => {
  const images = [];
  for (let i = 0; i < numPairs; i++) {
    const avatar = faker.image.avatar();
    images.push(avatar);  
  }

  const deck = [...images, ...images]; // Duplicate the images 
  return deck.sort(() => Math.random() - 0.5); // Shuffle
};

const MemoryGame = () => {
  const [deck, setDeck] = useState([]);
  const [flippedIndices, setFlippedIndices] = useState([]); 
  const [matchedPairs, setMatchedPairs] = useState([]); 
  const [numPairs, setNumPairs] = useState(2); 
  const [gameStarted, setGameStarted] = useState(false); 
  const [score, setScore] = useState(0); 

  const flipCard = (index) => {
    if (flippedIndices.length === 2 || flippedIndices.includes(index) || matchedPairs.includes(deck[index])) {
      return; 
    }

    setFlippedIndices((prev) => [...prev, index]);
  };

  // Checking the flipped cards 
  useEffect(() => {
    if (flippedIndices.length === 2) {
      const [firstIndex, secondIndex] = flippedIndices;
      if (deck[firstIndex] === deck[secondIndex]) {
        setMatchedPairs((prev) => [...prev, deck[firstIndex]]);
        setScore((prevScore) => prevScore + 10); 
      }

      // Flip back 
      setTimeout(() => setFlippedIndices([]), 1000);
    }
  }, [flippedIndices, deck]);

  const restartGame = () => {
    if (numPairs < 2) return; 

    setDeck(generateDeck(numPairs));
    setFlippedIndices([]);
    setMatchedPairs([]);
    setScore(0); 
    setGameStarted(true);
  };

  // Check for game over 
  useEffect(() => {
    if (matchedPairs.length === numPairs) {
      setGameStarted(false); 
    }
  }, [matchedPairs, numPairs]);

  const handleInputChange = (e) => {
    const value = e.target.value;

    if (value === '' || (value >= 2 && value <= 10 && value % 2 === 0)) {
      setNumPairs(value === '' ? '' : parseInt(value));
    }
  };

  return (
    <div className="memory-game">
      <h1>Memory Game</h1>

      {/* Input field  */}
      {!gameStarted ? (
        <div className="input-container">
          <label className='numlabel' htmlFor="num-pairs">Choose number of pairs:</label>
          <br />
          <input
            className='numinput'
            type="number"
            id="num-pairs"
            min="2"
            max="10"
            step="2"
            value={numPairs}
            onChange={handleInputChange}
          />
          <button onClick={restartGame}>Start Game</button>
        </div>
      ) : (
        <>
          {/* Game board */}
          <button onClick={() => setGameStarted(false)}>Go Back</button>
          <div className="card-grid">
            {deck.map((image, index) => {
              const isFlipped = flippedIndices.includes(index) || matchedPairs.includes(image);
              return (
                <div
                  key={index}
                  className={`card ${isFlipped ? 'flipped' : ''}`}
                  onClick={() => flipCard(index)}
                >
                  {isFlipped ? (
                    <img src={image} alt="card" style={{ width: '100%', height: '100%' }} />
                  ) : (
                    '?'
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* score */}
      {gameStarted === false && matchedPairs.length === numPairs && (
        <div className="score-overlay">
          <div className="score-board">
            <h2>Game Over!</h2>
            <p>Your Score: {score} points</p>
            <button onClick={restartGame}>Play Again</button>
          </div>
        </div>
      )}
    </div>
  );
};




function App() {
  return (
    <div className="App">

       <MemoryGame />  
    
    </div>
  );
}

export default App;
