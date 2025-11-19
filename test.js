
#computeCurveHandle() {
    if (activeMetaData.selectedTool === 'K-quadratic') {
        this.memorizePath.push({
            x: this.previousPosition.x,
            y: this.previousPosition.y,
            cp: this.pointsCount % 2 === 1 ? true : false
        });
    } else if (activeMetaData.selectedTool === 'K-bezier') {

    }
}


#quadratic(x, y) {
    console.clear();
    this.#drawline();
    const path = this.memorizePath;
    this.ctx.circle(path[0].x, path[0].y, 'blue');
    console.table(path)
    const count = path.length - 1;
    for (let i = 1; i < count; i += 2) {
        const p = path[i + 1];
        const cp = path[i];
        this.ctx.quadraticCurveTo?.(cp.x, cp.y, p.x, p.y);
        this.currentPathProp.path?.quadraticCurveTo?.(cp.x, cp.y, p.x, p.y);
        this.ctx.circle(p.x, p.y, p.cp ? 'purple' : 'maroon')
        this.ctx.circle(cp.x, cp.y, cp.cp ? 'yellow' : 'black')
    }

    console.log('Out of loop');
    console.table(path[count])

    this.ctx.quadraticCurveTo?.(path[count].x, path[count].y, x, y);
    this.ctx.circle(path[count].x, path[count].y, path[count].cp ? 'springgreen' : 'red')
}
