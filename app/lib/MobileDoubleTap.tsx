import React from "react"
function MobileDoubleTap(onDoubleTap: () => void, delay = 300) {
    const lastTapRef = React.useRef<number>(0);

    return {
        onPointerUp: () => {
            const now = Date.now(); 
            if(now - lastTapRef.current < delay) {
                onDoubleTap(); 
                lastTapRef.current = 0; 
            } else { 
                lastTapRef.current = now;
            }

        }, 
        style: { touchAction: "manipulation" as const}
    }



}

export default MobileDoubleTap