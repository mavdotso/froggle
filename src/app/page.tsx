'use client'
import { Maze } from '@/lib/maze-generator';
import { useState, useEffect, useCallback } from 'react';
import MazeCanvas from './components/maze';
import { DifficultySelector } from './components/difficulty-selector';
import { Button } from '@/components/ui/button';
import { ArrowKeys } from './components/arrow-keys-icon';
import { Input } from '@/components/ui/input';

export default function Home() {
  const [maze, setMaze] = useState<Maze | null>(null);
  const [cellSize, setCellSize] = useState<number>(40);
  const [difficulty, setDifficulty] = useState<string>("10");
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [seed, setSeed] = useState<string>("");

  const startMaze = useCallback(() => {
    const size = Number(difficulty) || 10;
    const newSeed = seed || Math.random().toString(36).substring(2, 15);
    setSeed(newSeed);
    setMaze(new Maze(size, size, newSeed));
  }, [difficulty, seed]);

  const generateNewSeed = useCallback(() => {
    const newSeed = Math.random().toString(36).substring(2, 15);
    setSeed(newSeed);
  }, []);

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
      <div className="flex justify-center items-center gap-2 mb-4">
        <DifficultySelector onDifficultyChange={setDifficulty} />
        <Input
          type="text"
          value={seed}
          onChange={(e) => setSeed(e.target.value)}
          placeholder="Enter seed (optional)"
        />
        <Button onClick={generateNewSeed}>New Seed</Button>
        <Button onClick={startMaze}>Start</Button>
      </div>
      <div className="flex flex-grow justify-center items-center">
        {maze && <MazeCanvas maze={maze} cellSize={cellSize} onRestart={startMaze} />}
      </div>
      <ArrowKeys activeKey={activeKey} />
    </div>
  );
};