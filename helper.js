import fs from 'fs';
const dir = 'images/tools';

let read = fs.readdirSync(dir);
read = read.map((file)=> file.slice(0,-4));
console.log(read);