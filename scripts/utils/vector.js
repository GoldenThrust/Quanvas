export function getNormal(c1, c2) {
    const tangent = calculateTangent(c1, c2);
    return calculateNormal(tangent);
}

export function calculateTangent(a, b) {
    const x = b.x - a.x;
    const y = b.y - a.y;

    const L = Math.hypot(x, y);

    return {
        x,
        y,
        ux: x / L,
        uy: y / L
    }
}

export function calculateNormal(tangent) {
    const { x: Tx, y: Ty, ux: Tux, uy: Tuy } = tangent;

    return {
        x: -Ty,
        y: Tx,
        ux: -Tuy,
        uy: Tux
    }
}