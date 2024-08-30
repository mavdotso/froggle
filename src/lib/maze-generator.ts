import seedrandom from 'seedrandom';

export class Maze {
    width: number;
    height: number;
    mazeMap: any[][];
    startCoord: { x: number; y: number } | null = null;
    endCoord: { x: number; y: number } | null = null;
    private rng: seedrandom.PRNG;
    seed: string;

    constructor(width: number, height: number, seed?: string) {
        this.width = width;
        this.height = height;
        this.seed = seed || Math.random().toString(36).substring(2, 15);
        this.rng = seedrandom(this.seed);
        this.mazeMap = Array.from({ length: height }, () =>
            Array.from({ length: width }, () => ({
                n: false,
                s: false,
                e: false,
                w: false,
                visited: false,
                priorPos: null,
            }))
        );
        this.generateMaze();
        this.defineStartEnd();
    }

    private generateMaze() {
        const dirs = ['n', 's', 'e', 'w'] as const;
        type Direction = (typeof dirs)[number];

        const modDir: Record<Direction, { y: number; x: number; o: Direction }> = {
            n: { y: -1, x: 0, o: 's' },
            s: { y: 1, x: 0, o: 'n' },
            e: { y: 0, x: 1, o: 'w' },
            w: { y: 0, x: -1, o: 'e' },
        };

        let pos = { x: 0, y: 0 };
        const stack = [pos];
        this.mazeMap[pos.y][pos.x].visited = true;

        while (stack.length) {
            const current = stack[stack.length - 1];
            const { x, y } = current;
            const unvisitedNeighbours = dirs
                .map((dir) => ({
                    dir,
                    nx: x + modDir[dir as Direction].x,
                    ny: y + modDir[dir as Direction].y,
                }))
                .filter(({ nx, ny }) => nx >= 0 && ny >= 0 && nx < this.width && ny < this.height && !this.mazeMap[ny][nx].visited);

            if (unvisitedNeighbours.length) {
                const { dir, nx, ny } = unvisitedNeighbours[Math.floor(this.rng.quick() * unvisitedNeighbours.length)];
                this.mazeMap[y][x][dir] = true;
                this.mazeMap[ny][nx][modDir[dir].o] = true;
                this.mazeMap[ny][nx].visited = true;
                this.mazeMap[ny][nx].priorPos = { x, y };
                stack.push({ x: nx, y: ny });
            } else {
                stack.pop();
            }
        }
    }

    private defineStartEnd() {
        this.endCoord = { x: this.width - 1, y: this.height - 1 };
        this.startCoord = { x: 0, y: 0 };
    }
}
