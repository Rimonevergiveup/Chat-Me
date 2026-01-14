import { useEffect, useState } from 'react';

export function Starfield() {
    const [stars, setStars] = useState<{ x: number, y: number, size: number, opacity: number }[]>([]);

    useEffect(() => {
        const generatedStars = Array.from({ length: 150 }).map(() => ({
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 2 + 1,
            opacity: Math.random() * 0.5 + 0.2
        }));
        setStars(generatedStars);
    }, []);

    return (
        <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-void">
            {stars.map((star, i) => (
                <div
                    key={i}
                    className="absolute bg-white rounded-full animate-pulse"
                    style={{
                        left: `${star.x}%`,
                        top: `${star.y}%`,
                        width: `${star.size}px`,
                        height: `${star.size}px`,
                        opacity: star.opacity,
                        animationDelay: `${Math.random() * 5}s`,
                        animationDuration: `${Math.random() * 3 + 2}s`
                    }}
                />
            ))}
            <div className="absolute inset-0 bg-gradient-to-br from-neon-blue/5 via-transparent to-neon-purple/5" />
        </div>
    );
}
