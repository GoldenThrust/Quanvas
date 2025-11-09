import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
    entry: {
        index: './main.js',
        "service-worker": "./service-worker.js"
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, './app'),
        clean: true
    },
    mode: 'development',
};
