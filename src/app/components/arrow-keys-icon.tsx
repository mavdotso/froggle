import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp } from 'lucide-react';
import React from 'react';

interface ArrowKeysProps {
    activeKey: string | null;
}

export function ArrowKeys({ activeKey }: ArrowKeysProps) {
    const getKeyStyle = (key: string) =>
        `w-8 h-8 flex items-center justify-center rounded border font-medium ${activeKey === key ? 'text-green-500 bg-white' : 'text-muted-foreground bg-muted '
        }`;
    const iconStyle = "w-3 h-3"

    return (
        <div className="inline-flex flex-col items-center gap-1">
            <kbd className={getKeyStyle('ArrowUp')}>
                <ArrowUp className={iconStyle} />
            </kbd>
            <div className="flex gap-1">
                <kbd className={getKeyStyle('ArrowLeft')}>
                    <ArrowLeft className={iconStyle} />
                </kbd>
                <kbd className={getKeyStyle('ArrowDown')}>
                    <ArrowDown className={iconStyle} />
                </kbd>
                <kbd className={getKeyStyle('ArrowRight')}>
                    <ArrowRight className={iconStyle} />
                </kbd>
            </div>
        </div>
    );
}