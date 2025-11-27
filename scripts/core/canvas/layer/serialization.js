export default class Serializer {
    static serialize(data) {
        const points = data.points;
        const buffer = new ArrayBuffer(8 * points.length);

        const view = new Float32Array(buffer);
        for (let i = 0; i < points.length; i += 1) {
            console.log('Serializing point:', i / 2);
            console.table(points[i]);
            view[i] = points[i].x;
            view[i + 1] = points[i].y;
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
            console.log('Unserializing point:', i / 2);
            console.table({ x: view[i], y: view[i + 1] });
            points.push({ x: view[i], y: view[i + 1] });
        }

        return {
            ...data,
            points
        }
    }
}