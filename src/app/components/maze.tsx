import { Maze } from '@/lib/maze-generator';
import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface MazeCanvasProps {
    maze: Maze;
    cellSize: number;
}

export default function MazeCanvas({ maze, cellSize }: MazeCanvasProps) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [playerPos, setPlayerPos] = useState({ x: maze.startCoord?.x || 0, y: maze.startCoord?.y || 0 });
    const [moveCount, setMoveCount] = useState(0);
    const [timer, setTimer] = useState(0);
    const [isGameStarted, setIsGameStarted] = useState(false);
    const [isGameFinished, setIsGameFinished] = useState(false);
    const [visitedCells, setVisitedCells] = useState<Set<string>>(
        new Set([`${maze.startCoord?.x || 0},${maze.startCoord?.y || 0}`])
    );

    useEffect(() => {
        const startX = maze.startCoord?.x || 0;
        const startY = maze.startCoord?.y || 0;
        setPlayerPos({ x: startX, y: startY });
        setMoveCount(0);
        setTimer(0);
        setIsGameStarted(false);
        setIsGameFinished(false);
        setVisitedCells(new Set([`${startX},${startY}`]));
    }, [maze]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const { mazeMap, endCoord } = maze;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.lineWidth = cellSize / 40;

        function drawCell(x: number, y: number, cell: any) {
            function drawLine(x1: number, y1: number, x2: number, y2: number) {
                if (!ctx) return;
                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.stroke();
            }

            const xPos = x * cellSize;
            const yPos = y * cellSize;

            if (!cell.n) drawLine(xPos, yPos, xPos + cellSize, yPos);
            if (!cell.s) drawLine(xPos, yPos + cellSize, xPos + cellSize, yPos + cellSize);
            if (!cell.e) drawLine(xPos + cellSize, yPos, xPos + cellSize, yPos + cellSize);
            if (!cell.w) drawLine(xPos, yPos, xPos, yPos + cellSize);
        }

        function drawStats() {
            if (!canvas || !ctx) return;
            ctx.font = '16px Arial';
            ctx.fillStyle = 'black';
            ctx.textAlign = 'left';
            ctx.fillText(`Moves: ${moveCount}`, 10, canvas.height + 20);
            ctx.fillText(`Time: ${formatTime(timer)}`, 10, canvas.height + 40);
        }

        function drawFinish() {
            if (!ctx) return;
            if (!maze.endCoord) return;
            ctx.save();
            ctx.globalAlpha = 1;
            ctx.font = `${cellSize * 0.8}px Arial`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('🪷', maze.endCoord.x * cellSize + cellSize / 2, maze.endCoord.y * cellSize + cellSize / 2);
            ctx.restore();
        }

        function drawPlayer() {
            if (!ctx) return;
            ctx.save();
            ctx.globalAlpha = 1;
            ctx.font = `${cellSize * 0.8}px Arial`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('🐸', playerPos.x * cellSize + cellSize / 2, playerPos.y * cellSize + cellSize / 2);
            ctx.restore();
        }

        function drawTrail() {
            if (!ctx) return;
            ctx.save();
            ctx.globalAlpha = 0.1;
            ctx.fillStyle = 'green';
            visitedCells.forEach(cell => {
                const [x, y] = cell.split(',').map(Number);
                ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
            });
            ctx.restore();
        }

        function redrawMaze() {
            if (!canvas || !ctx) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            maze.mazeMap.forEach((row, y) => row.forEach((cell, x) => drawCell(x, y, cell)));
            drawTrail();
            drawFinish();
            drawPlayer();
            drawStats();
        }

        redrawMaze();

        function handleKeyDown(e: KeyboardEvent) {
            if (isGameFinished) return;

            const { x, y } = playerPos;
            let newX = x;
            let newY = y;

            switch (e.key) {
                case 'ArrowUp':
                    if (maze.mazeMap[y][x].n) newY = Math.max(0, y - 1);
                    break;
                case 'ArrowDown':
                    if (maze.mazeMap[y][x].s) newY = Math.min(maze.height - 1, y + 1);
                    break;
                case 'ArrowLeft':
                    if (maze.mazeMap[y][x].w) newX = Math.max(0, x - 1);
                    break;
                case 'ArrowRight':
                    if (maze.mazeMap[y][x].e) newX = Math.min(maze.width - 1, x + 1);
                    break;
                default:
                    return;
            }

            if (newX !== x || newY !== y) {
                if (!isGameStarted) {
                    setIsGameStarted(true);
                }
                setPlayerPos({ x: newX, y: newY });
                setMoveCount((prev) => prev + 1);
                setVisitedCells(prev => new Set(prev).add(`${newX},${newY}`));
                if (newX === maze.endCoord?.x && newY === maze.endCoord?.y) {
                    setIsGameFinished(true);
                }
            }
        }

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [maze, cellSize, playerPos, moveCount, timer, isGameStarted, isGameFinished]);

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;
        if (isGameStarted && !isGameFinished) {
            interval = setInterval(() => {
                setTimer((prevTimer) => prevTimer + 1);
            }, 1000);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isGameStarted, isGameFinished]);

    function formatTime(seconds: number) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    return (
        <div className="flex flex-col items-center w-full">
            <Card>
                <CardHeader className='flex-row justify-between items-baseline'>
                    <span className='text-muted-foreground text-sm'>Time: <Badge variant="outline">{formatTime(timer)}</Badge></span>
                    <span className='text-muted-foreground text-sm'>Moves: <Badge variant="outline">{moveCount}</Badge></span>
                </CardHeader>
                <CardContent>
                    <canvas
                        ref={canvasRef}
                        width={maze.width * cellSize}
                        height={maze.height * cellSize}
                        className="border border-black"
                        tabIndex={0}
                    />
                </CardContent>
            </Card>
        </div>
    );
}