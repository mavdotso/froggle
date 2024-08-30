import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp } from 'lucide-react';
import React from 'react';

export function ArrowKeys() {
    const keyStyle = "w-8 h-8 flex items-center justify-center rounded border bg-muted font-medium text-muted-foreground";
    const iconStyle = "w-3 h-3"

    return (
        <div className="inline-flex flex-col items-center gap-1">
            <kbd className={keyStyle}>
                <ArrowUp className={iconStyle} />
            </kbd>
            <div className="flex gap-1">
                <kbd className={keyStyle}>
                    <ArrowLeft className={iconStyle} />
                </kbd>
                <kbd className={keyStyle}>
                    <ArrowDown className={iconStyle} />
                </kbd>
                <kbd className={keyStyle}>
                    <ArrowRight className={iconStyle} />
                </kbd>
            </div>
        </div>
    );
}