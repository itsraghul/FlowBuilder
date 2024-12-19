"use client";


import { useEffect } from 'react'

const useSaveShortcut = ({ onSave }: { onSave: () => void }): void => {
    useEffect(() => {
        const handKeyDown = (event: KeyboardEvent) => {
            if ((event.metaKey || event.ctrlKey) && event.key === 's') {
                event.preventDefault();
                onSave();
            }
        }

        document.addEventListener('keydown', handKeyDown);

        return () => {
            document.removeEventListener('keydown', handKeyDown);
        }
    }, [onSave]);
}

export default useSaveShortcut