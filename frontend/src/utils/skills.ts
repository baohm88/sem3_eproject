export function jsonOrCsvToArray(v?: string | null): string[] {
    if (!v) return [];
    const s = String(v).trim();
    if (!s) return [];
    if (s.startsWith("[")) {
        try {
            const arr = JSON.parse(s);
            return Array.isArray(arr)
                ? arr.filter(Boolean).map((x: string) => x.trim())
                : [];
        } catch {
            /* rơi xuống CSV */
        }
    }
    // CSV
    return s
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean);
}

export function arrayToJson(arr: string[]): string {
    const clean = Array.from(new Set(arr.map((s) => s.trim()).filter(Boolean)));
    return JSON.stringify(clean);
}

export function arrayToCsv(arr: string[]): string {
    return jsonOrCsvToArray(arrayToJson(arr)).join(", ");
}
