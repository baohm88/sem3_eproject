export function cleanPayload(obj) {
    const out = {};
    for (const [k, v] of Object.entries(obj || {})) {
        if (v === "" || v === undefined) continue; 
        out[k] = v;
    }
    return out;
}
