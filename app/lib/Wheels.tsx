export type WheelPreset = { 
    id: string; 
    name: string ; 
    items: string[]; 
    updatedAt: number; 

}


const KEY = "spinwheel.presets.v1"


export function LoadPresets(): WheelPreset[] {
    if(typeof window === "undefined") return []; 

    try {
        const raw = localStorage.getItem(KEY);
        if(!raw) return []; 
        const parsed = JSON.parse(raw) as WheelPreset[];
        return Array.isArray(parsed) ? parsed: []
    } catch {
        return []
    }
    
}


export function savePresets(presets: WheelPreset[]){ 
    localStorage.setItem(KEY, JSON.stringify(presets))
}

export function uid() {
    return crypto.randomUUID?.() ?? `id_${Math.random().toString(16).slice(2)}`

}