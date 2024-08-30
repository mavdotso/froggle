import React from 'react';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface DifficultySelectorProps {
    onDifficultyChange: (value: string) => void;
}

export function DifficultySelector({ onDifficultyChange }: DifficultySelectorProps) {
    return (
        <Select onValueChange={onDifficultyChange} defaultValue="10">
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select difficulty" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>Difficulty</SelectLabel>
                    <SelectItem value="10">Easy</SelectItem>
                    <SelectItem value="15">Medium</SelectItem>
                    <SelectItem value="20">Hard</SelectItem>
                    <SelectItem value="25">Extreme</SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select>
    );
}