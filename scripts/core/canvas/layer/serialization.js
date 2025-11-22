export default class Serializer {
    constructor() {

    }

    static serialize(data) {
        const points = data.points;
        const buffer = new ArrayBuffer(8 * points.length);

        const view = new Float32Array(buffer);
        for (let i = 0; i < points.length; i += 2) {
            view[i] = points[i].x;
            view[i + 1] = points[i].y;
        }

        return {
            ...data,
            points: buffer
        }
    }

    static unserialize() {

    }
}