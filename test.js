export function uuid() {
    return ((Math.random() * 16) + (new Date()).toString()).toString(16)
}