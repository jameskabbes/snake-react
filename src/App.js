import React, { useState, useEffect } from 'react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION = 'RIGHT';
const APPLE = { x: 15, y: 15 };

const App = () => {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  const moveSnake = () => {
    const head = { ...snake[0] };

    switch (direction) {
      case 'UP':
        head.y -= 1;
        break;
      case 'DOWN':
        head.y += 1;
        break;
      case 'LEFT':
        head.x -= 1;
        break;
      case 'RIGHT':
        head.x += 1;
        break;
      default:
        break;
    }

    const newSnake = [head, ...snake.slice(0, -1)];

    if (isCollision(head) || isOutOfBounds(head)) {
      setGameOver(true);
    } else if (isEatingApple(head)) {
      setScore(score + 1);
      generateApple();
      setSnake(newSnake);
    } else {
      setSnake(newSnake);
    }
  };

  const isCollision = (head) => {
    return snake.some((segment, index) => {
      if (index === 0) return false;
      return segment.x === head.x && segment.y === head.y;
    });
  };

  const isOutOfBounds = (head) => {
    return (
      head.x < 0 ||
      head.y < 0 ||
      head.x >= GRID_SIZE ||
      head.y >= GRID_SIZE
    );
  };

  const isEatingApple = (head) => {
    return head.x === APPLE.x && head.y === APPLE.y;
  };

  const generateApple = () => {
    const newApple = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };

    if (isCollision(newApple)) {
      return generateApple();
    }

    APPLE.x = newApple.x;
    APPLE.y = newApple.y;
  };

  const handleKeyPress = (e) => {
    e.preventDefault();

    const { key } = e;

    if (key === 'ArrowUp' && direction !== 'DOWN') {
      setDirection('UP');
    } else if (key === 'ArrowDown' && direction !== 'UP') {
      setDirection('DOWN');
    } else if (key === 'ArrowLeft' && direction !== 'RIGHT') {
      setDirection('LEFT');
    } else if (key === 'ArrowRight' && direction !== 'LEFT') {
      setDirection('RIGHT');
    }
  };

  useEffect(() => {
    const intervalId = setInterval(moveSnake, 200);

    return () => {
      clearInterval(intervalId);
    };
  }, [snake]);

  return (
    <div className="App" tabIndex="0" onKeyDown={handleKeyPress}>
      <h1>Snake Game</h1>
      <div className="game-area">
        {!gameOver &&
          [...Array(GRID_SIZE)].map((_, row) => (
            <div key={row} className="row">
              {[...Array(GRID_SIZE)].map((_, col) => (
                <div
                  key={col}
                  className={`cell ${
                    snake.some((s) => s.x === col && s.y === row)
                      ? 'snake'
                      : APPLE.x === col && APPLE.y === row
                      ? 'apple'
                      : ''
                  }`}
                ></div>
              ))}
            </div>
          ))}
        {gameOver && <h2>Game Over!</h2>}
        <h3>Score: {score}</h3>
      </div>
    </div>
  );
};

export default App;