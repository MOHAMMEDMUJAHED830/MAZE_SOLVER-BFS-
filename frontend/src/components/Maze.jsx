import { useState, useEffect } from 'react';

const Maze = ({ size = 10 }) => {
  const [maze, setMaze] = useState(createEmptyMaze(size));
  const [solution, setSolution] = useState(null);
  const [isSolving, setIsSolving] = useState(false);
  const [error, setError] = useState(null);
  const [visitedCells, setVisitedCells] = useState([]);
  const [currentPath, setCurrentPath] = useState([]);
  const [animationStep, setAnimationStep] = useState(0);
  const [animationSpeed, setAnimationSpeed] = useState(50);
  const [showFinalPath, setShowFinalPath] = useState(false);

  function createEmptyMaze(size) {
    const maze = Array(size).fill().map(() => Array(size).fill(0));
    maze[0][0] = 1; // Start
    maze[size-1][size-1] = 2; // End
    return maze;
  }

  useEffect(() => {
    if (solution && solution.visited) {
      setAnimationStep(0);
      setVisitedCells([]);
      setCurrentPath([]);
      setShowFinalPath(false);
      
      const timer = setInterval(() => {
        setAnimationStep(prev => {
          const nextStep = prev + 1;
          if (nextStep >= solution.visited.length) {
            clearInterval(timer);
            setShowFinalPath(true);
            return prev;
          }
          return nextStep;
        });
      }, animationSpeed);

      return () => clearInterval(timer);
    }
  }, [solution, animationSpeed]);

  useEffect(() => {
    if (solution && solution.visited && animationStep > 0) {
      // Update visited cells
      setVisitedCells(solution.visited.slice(0, animationStep));
      
      // Only show current path during animation, not final path
      if (!showFinalPath) {
        // Find the current working path (BFS frontier)
        const path = [];
        let current = solution.visited[animationStep - 1];
        if (current) {
          path.push(current);
        }
        setCurrentPath(path);
      }
    }
  }, [animationStep, solution, showFinalPath]);

  // When we finish animation, show the complete solution path
  useEffect(() => {
    if (showFinalPath && solution) {
      setCurrentPath(solution.path || []);
    }
  }, [showFinalPath, solution]);

  const handleCellClick = (row, col) => {
    if ((row === 0 && col === 0) || (row === size-1 && col === size-1)) return;
    
    const newMaze = [...maze];
    newMaze[row][col] = newMaze[row][col] === 0 ? 3 : 0;
    setMaze(newMaze);
    setSolution(null);
    setError(null);
    setVisitedCells([]);
    setCurrentPath([]);
    setShowFinalPath(false);
  };

  const solveMaze = async () => {
    setIsSolving(true);
    setError(null);
    setVisitedCells([]);
    setCurrentPath([]);
    setShowFinalPath(false);
    
    try {
      const response = await fetch('http://localhost:5000/solve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          maze: maze,
          start: [0, 0],
          end: [size-1, size-1]
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to solve maze');
      
      setSolution(data);
    } catch (err) {
      console.error('Error solving maze:', err);
      setError(err.message);
    } finally {
      setIsSolving(false);
    }
  };

  const resetMaze = () => {
    setMaze(createEmptyMaze(size));
    setSolution(null);
    setError(null);
    setVisitedCells([]);
    setCurrentPath([]);
    setShowFinalPath(false);
  };

  const generateRandomMaze = () => {
    const newMaze = createEmptyMaze(size);
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        if ((i === 0 && j === 0) || (i === size-1 && j === size-1)) continue;
        newMaze[i][j] = Math.random() < 0.3 ? 3 : 0;
      }
    }
    setMaze(newMaze);
    setSolution(null);
    setError(null);
    setVisitedCells([]);
    setCurrentPath([]);
    setShowFinalPath(false);
  };

  return (
    <div className="maze-container">
      <div className="controls">
        <button onClick={solveMaze} disabled={isSolving}>
          {isSolving ? 'Solving...' : 'Solve Maze'}
        </button>
        <button onClick={resetMaze}>Reset</button>
        <button onClick={generateRandomMaze}>Random Maze</button>
        <div className="speed-control">
          <label>Speed:</label>
          <select 
            value={animationSpeed} 
            onChange={(e) => setAnimationSpeed(Number(e.target.value))}
          >
            <option value={200}>Slow</option>
            <option value={100}>Medium</option>
            <option value={50}>Fast</option>
            <option value={10}>Very Fast</option>
          </select>
        </div>
      </div>
      
      {error && <div className="error">Error: {error}</div>}

      <div className="maze-grid" style={{ gridTemplateColumns: `repeat(${size}, 30px)` }}>
        {maze.map((row, i) => 
          row.map((cell, j) => (
            <div 
              key={`${i}-${j}`}
              className={`cell 
                ${cell === 3 ? 'wall' : ''}
                ${cell === 1 ? 'start' : ''}
                ${cell === 2 ? 'end' : ''}
                ${visitedCells.some(([x, y]) => x === i && y === j) ? 'visited' : ''}
                ${currentPath.some(([x, y]) => x === i && y === j) ? 
                  (showFinalPath ? 'final-path' : 'path') : ''}
              `}
              onClick={() => handleCellClick(i, j)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Maze;