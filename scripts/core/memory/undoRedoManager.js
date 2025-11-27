class undoRedoManager {
    constructor() {
        this.history = [];
        this.redoStack = [];
    }
    
    updateHistory(data) {
        this.history.push(data);
        this.redoStack = [];
    }

    undo(){
        if (this.history.length === 0) return null;
        const lastState = this.history.pop();
        this.redoStack.push(lastState);
        return lastState;
    }

    redo() {
        if (this.redoStack.length === 0) return null;
        const lastState = this.redoStack.pop();
        this.history.push(lastState);
        return lastState;
    }

    clearHistory() {
        this.history = [];
        this.redoStack = [];
    }
}