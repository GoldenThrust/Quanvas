export default class Serializer {
    static serialize(data) {
        const points = data.points;
        const buffer = new ArrayBuffer(8 * points.length);

        const view = new Float32Array(buffer);

        let i = 0;
        for (const point of points) {
            view[i++] = point.x;
            view[i++] = point.y;
        }

        return {
            ...data,
            points: buffer
        }
    }

    static unserialize(data) {
        const buffer = data.points;
        const view = new Float32Array(buffer);
        const points = [];
        for (let i = 0; i < view.length; i += 2) {
            points.push({ x: view[i], y: view[i + 1] });
        }

        return {
            ...data,
            points
        }
    }
}