import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { formatTime } from '@/lib/utils';

interface EndGameDialogProps {
    isOpen: boolean;
    onClose: () => void;
    time: number;
    moves: number;
    imageUrl: string | null;
}

export function EndGameDialog({ isOpen, onClose, time, moves, imageUrl }: EndGameDialogProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Maze Completed!</DialogTitle>
                    <DialogDescription>
                        <p>Time: {formatTime(time)}</p>
                        <p>Total Moves: {moves}</p>
                        {imageUrl && (
                            <img
                                src={imageUrl}
                                alt="Completed Maze"
                                style={{ maxWidth: '100%', height: 'auto', marginTop: '1rem' }}
                            />
                        )}
                    </DialogDescription>
                </DialogHeader>
                <div className="flex justify-end">
                    <Button onClick={() => {
                        onClose();
                    }}>
                        Play Again
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}