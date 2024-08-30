'use client'
import { Maze } from '@/lib/maze-generator';
import { useState } from 'react';
import MazeCanvas from './components/maze';

export default function Home() {
  const [maze, setMaze] = useState<Maze | null>(null);
  const [cellSize, setCellSize] = useState<number>(40);

  const startMaze = () => {
    const size = Number((document.getElementById('diffSelect') as HTMLSelectElement)?.value) || 10;
    setMaze(new Maze(size, size));
  };

  return (
    <div className="flex flex-col bg-white min-h-screen text-center">
      <div className="mb-4 p-4">
        <select id="diffSelect" className="p-2 border rounded">
          <option value="10">Easy</option>
          <option value="15">Medium</option>
          <option value="25">Hard</option>
          <option value="38">Extreme</option>
        </select>
        <button onClick={startMaze} className="ml-2 p-2 border rounded">Start</button>
      </div>
      <div className="flex flex-grow justify-center items-center">
        {maze && <MazeCanvas maze={maze} cellSize={cellSize} />}
      </div>
    </div>
  );
};

