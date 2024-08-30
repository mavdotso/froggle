'use client'
import { Maze } from '@/lib/maze-generator';
import { useState } from 'react';
import MazeCanvas from './components/maze';
import { DifficultySelector } from './components/difficulty-selector';
import { Button } from '@/components/ui/button';
import { ArrowKeys } from './components/arrow-keys-icon';

export default function Home() {
  const [maze, setMaze] = useState<Maze | null>(null);
  const [cellSize, setCellSize] = useState<number>(40);
  const [difficulty, setDifficulty] = useState<string>("10");

  function startMaze() {
    const size = Number(difficulty) || 10;
    setMaze(new Maze(size, size));
  };

  return (
    <div className="flex flex-col justify-between items-center bg-white p-4 min-h-screen">
      <div className="flex justify-center items-center mb-4">
        <DifficultySelector onDifficultyChange={setDifficulty} />
        <Button onClick={startMaze} className="ml-2">Start</Button>
      </div>
      <div className="flex flex-grow justify-center items-center">
        {maze && <MazeCanvas maze={maze} cellSize={cellSize} />}
      </div>
      <ArrowKeys />
    </div>
  );
};

