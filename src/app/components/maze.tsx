import { Maze } from '@/lib/maze-generator';
import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowKeys } from './arrow-keys-icon';

interface MazeCanvasProps {
    maze: Maze;
    cellSize: number;
    onRestart: () => void;
}

export default function MazeCanvas({ maze, cellSize, onRestart }: MazeCanvasProps) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [playerPos, setPlayerPos] = useState({ x: maze.startCoord?.x || 0, y: maze.startCoord?.y || 0 });
    const [moveCount, setMoveCount] = useState(0);
    const [timer, setTimer] = useState(0);
    const timerRef = useRef<number | null>(null);
    const [isGameStarted, setIsGameStarted] = useState(false);
    const [isGameFinished, setIsGameFinished] = useState(false);
    const [activeKey, setActiveKey] = useState<string | null>(null);
    const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
    const [scaledCellSize, setScaledCellSize] = useState(cellSize);
    const [visitedCells, setVisitedCells] = useState<Set<string>>(
        new Set([`${maze.startCoord?.x || 0},${maze.startCoord?.y || 0}`])
    );

    useEffect(() => {
        const updateCanvasSize = () => {
            const maxWidth = window.innerWidth * 0.9;
            const maxHeight = window.innerHeight * 0.7;
            const mazeWidth = maze.width * cellSize;
            const mazeHeight = maze.height * cellSize;

            const scaleX = maxWidth / mazeWidth;
            const scaleY = maxHeight / mazeHeight;
            const scale = Math.min(scaleX, scaleY, 1);

            const newWidth = Math.floor(mazeWidth * scale);
            const newHeight = Math.floor(mazeHeight * scale);

            setCanvasSize({ width: newWidth, height: newHeight });
            setScaledCellSize(cellSize * scale);
        };

        updateCanvasSize();
        window.addEventListener('resize', updateCanvasSize);

        return () => {
            window.removeEventListener('resize', updateCanvasSize);
        };
    }, [maze, cellSize]);

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
        if (isGameStarted && !isGameFinished) {
            timerRef.current = requestAnimationFrame(updateTimer);
        } else if (timerRef.current) {
            cancelAnimationFrame(timerRef.current);
        }

        return () => {
            if (timerRef.current) {
                cancelAnimationFrame(timerRef.current);
            }
        };
    }, [isGameStarted, isGameFinished]);

    useEffect(() => {
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

            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                setActiveKey(e.key);
            }
        }

        function handleKeyUp(e: KeyboardEvent) {
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                setActiveKey(null);
            }
        }

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [maze, playerPos, isGameStarted, isGameFinished]);

    function updateTimer() {
        setTimer(prevTimer => prevTimer + 16.67);
        timerRef.current = requestAnimationFrame(updateTimer);
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        function drawCell(x: number, y: number, cell: any) {
            function drawLine(x1: number, y1: number, x2: number, y2: number) {
                if (!ctx) return;
                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.stroke();
            }

            const xPos = x * scaledCellSize;
            const yPos = y * scaledCellSize;

            if (!cell.n) drawLine(xPos, yPos, xPos + scaledCellSize, yPos);
            if (!cell.s) drawLine(xPos, yPos + scaledCellSize, xPos + scaledCellSize, yPos + scaledCellSize);
            if (!cell.e) drawLine(xPos + scaledCellSize, yPos, xPos + scaledCellSize, yPos + scaledCellSize);
            if (!cell.w) drawLine(xPos, yPos, xPos, yPos + scaledCellSize);
        }

        function drawFinish() {
            if (!ctx || !maze.endCoord) return;
            ctx.save();
            ctx.font = `${scaledCellSize * 0.8}px Arial`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('🪷', maze.endCoord.x * scaledCellSize + scaledCellSize / 2, maze.endCoord.y * scaledCellSize + scaledCellSize / 2);
            ctx.restore();
        }

        function drawPlayer() {
            if (!ctx) return;
            ctx.save();
            ctx.font = `${scaledCellSize * 0.8}px Arial`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('🐸', playerPos.x * scaledCellSize + scaledCellSize / 2, playerPos.y * scaledCellSize + scaledCellSize / 2);
            ctx.restore();
        }

        function drawTrail() {
            if (!ctx) return;
            ctx.save();
            ctx.globalAlpha = 0.1;
            ctx.fillStyle = 'green';
            visitedCells.forEach(cell => {
                const [x, y] = cell.split(',').map(Number);
                ctx.fillRect(x * scaledCellSize, y * scaledCellSize, scaledCellSize, scaledCellSize);
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
        }

        redrawMaze();
    }, [maze, scaledCellSize, playerPos, moveCount, isGameStarted, isGameFinished, visitedCells, timer]);

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

    function formatTime(milliseconds: number) {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        const ms = Math.floor((milliseconds % 1000) / 10);
        return `${minutes}:${seconds.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
    }

    return (
        <div className="flex flex-col items-center w-full">
            <Card className="w-full">
                <CardHeader className='flex-row justify-between items-baseline'>
                    <span className='text-muted-foreground text-sm'>Time: <Badge variant="outline">{formatTime(timer)}</Badge></span>
                    <span className='text-muted-foreground text-sm'>Moves: <Badge variant="outline">{moveCount}</Badge></span>
                </CardHeader>
                <CardContent>
                    <div style={{
                        width: canvasSize.width,
                        height: canvasSize.height,
                        margin: '0 auto'
                    }}>
                        <canvas
                            ref={canvasRef}
                            width={canvasSize.width}
                            height={canvasSize.height}
                            className="border border-black"
                        />
                    </div>
                </CardContent>
                <CardFooter className='justify-between items-end'>
                    <Button variant={"outline"} onClick={onRestart}>Restart</Button>
                    <ArrowKeys activeKey={activeKey} />
                </CardFooter>
            </Card>
        </div>
    );
}