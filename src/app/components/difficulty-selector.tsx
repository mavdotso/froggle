import React from 'react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface DifficultySelectorProps {
    onDifficultyChange: (value: string) => void;
}

export function DifficultySelector({ onDifficultyChange }: DifficultySelectorProps) {
    return (
        <Select onValueChange={onDifficultyChange}>
            <SelectTrigger>
                <SelectValue placeholder="Select difficulty" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem className='cursor-pointer' value="15">Easy</SelectItem>
                <SelectItem className='cursor-pointer' value="20">Medium</SelectItem>
                <SelectItem className='cursor-pointer' value="25">Hard</SelectItem>
                <SelectItem className='cursor-pointer' value="35">Extreme</SelectItem>
            </SelectContent>
        </Select>
    );
}