'use client'
import { Maze } from '@/lib/maze-generator';
import { useState, useEffect } from 'react';
import MazeCanvas from './components/maze';
import { DifficultySelector } from './components/difficulty-selector';
import { Button } from '@/components/ui/button';
import { ArrowKeys } from './components/arrow-keys-icon';

export default function Home() {
  const [maze, setMaze] = useState<Maze | null>(null);
  const [cellSize, setCellSize] = useState<number>(40);
  const [difficulty, setDifficulty] = useState<string>("10");
  const [activeKey, setActiveKey] = useState<string | null>(null);

  function startMaze() {
    const size = Number(difficulty) || 10;
    setMaze(new Maze(size, size));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        setActiveKey(e.key);
      }
    };

    function handleKeyUp() {
      setActiveKey(null);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return (
    <div className="flex flex-col justify-between items-center bg-white p-4 min-h-screen">
      <div className="flex justify-center items-center mb-4">
        <DifficultySelector onDifficultyChange={setDifficulty} />
        <Button onClick={startMaze} className="ml-2">Start</Button>
      </div>
      <div className="flex flex-grow justify-center items-center">
        {maze && <MazeCanvas maze={maze} cellSize={cellSize} />}
      </div>
      <ArrowKeys activeKey={activeKey} />
    </div>
  );
};