import React, { useState, useEffect } from 'react';

const Typewriter = ({ text, delay = 100, onTyping }) => {
    const [displayedText, setDisplayedText] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (currentIndex < text.length) {
            const intervalId = setInterval(() => {
                setDisplayedText((prev) => prev + text[currentIndex]);
                setCurrentIndex((prev) => prev + 1);
                if (onTyping) onTyping();
            }, delay);
            return () => clearInterval(intervalId);
        }
    }, [currentIndex, text, delay]);

    return <span>{displayedText}</span>;
};

export default Typewriter;