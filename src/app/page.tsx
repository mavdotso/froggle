'use client'
import { Maze } from '@/lib/maze-generator';
import { useState, useCallback } from 'react';
import MazeCanvas from './components/maze';
import { DifficultySelector } from './components/difficulty-selector';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { generateSeed } from '@/lib/utils';

export default function Home() {
  const [maze, setMaze] = useState<Maze | null>(null);
  const [cellSize, setCellSize] = useState<number>(40);
  const [difficulty, setDifficulty] = useState<string>("10");
  const [seed, setSeed] = useState<string>("");

  const startMaze = useCallback(() => {
    const size = Number(difficulty) || 10;
    const newSeed = seed || generateSeed();
    setSeed(newSeed);
    setMaze(new Maze(size, size, newSeed));
  }, [difficulty, seed, generateSeed]);

  const generateNewSeed = useCallback(() => {
    const newSeed = generateSeed();
    setSeed(newSeed);
  }, [generateSeed]);


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
        <Button onClick={startMaze}>Start</Button>
        <Button variant={"outline"} onClick={generateNewSeed}>New Seed</Button>
      </div>
      <div className="flex flex-grow justify-center items-center">
        {maze && <MazeCanvas maze={maze} cellSize={cellSize} onRestart={startMaze} />}
      </div>
    </div>
  );
};