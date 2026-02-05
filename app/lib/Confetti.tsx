import confetti from "canvas-confetti";

export function fireConfetti() {
    const duration = 900 
    const end = Date.now() + duration; 


    (function frame() {
        confetti({
            particleCount: 120,
            spread: 80,
            startVelocity: 45,
            origin: { x: 0.5, y: 0.2 },
        });

        if( Date.now() < end) requestAnimationFrame(frame);
    }
    )();


}