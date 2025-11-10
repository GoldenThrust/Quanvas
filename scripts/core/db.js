export default class Database {
    constructor(dBName, version = 1) {
        this.dBName = dBName;
        this.version = version;
        this.db = null;
    }

    async open(stores = []) {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dBName, this.version);

            request.addEventListener("upgradeneeded", (e) => {
                const db = e.target.result;

                stores.forEach((store) => {
                    if (!db.objectStoreNames.contains(store.name)) {
                        const objectStore = db.createObjectStore(store.name, {
                            keyPath: store.keyPath || 'id',
                            autoIncrement: store.autoIncrement ?? true
                        });

                        if (store.indexes) {
                            store.indexes.forEach(index => {
                                objectStore.createIndex(index.name, index.keyPath, { unique: index.unique || false });
                            });
                        }
                    }
                });
            })
            request.addEventListener("success", e => {
                this.db = e.target.result;
                resolve(this.db);
            })
            request.addEventListener("error", e => {
                reject(e.target.error);
            })
        })
    }

    async put(storeName, data) {
        return new Promise((resolve, reject) => {
            const tx = this.db.transaction(storeName, "readwrite");

            const request = tx.objectStore(storeName).put(data);
            request.addEventListener("success", _ => {
                resolve(true);
            })
            request.addEventListener("error", e => {
                reject(e.target.error);
            })
        })
    }

    async get(storeName, key) {
        return new Promise((resolve, reject) => {
            const tx = this.db.transaction(storeName, "readonly");

            const request = tx.objectStore(storeName).get(key);
            request.addEventListener("success", e => {
                resolve(e.target.result);
            })
            request.addEventListener("error", e => {
                reject(e.target.error);
            })
        })
    }

    async getAll(storeName) {
        return new Promise((resolve, reject) => {
            const tx = this.db.transaction(storeName, "readonly");

            const request = tx.objectStore(storeName).getAll();
            request.addEventListener("success", e => {
                resolve(e.target.result);
            })
            request.addEventListener("error", e => {
                reject(e.target.error);
            })
        })
    }

    async getByIndex(storeName, indexName, indexValue) {
        return new Promise((resolve, reject) => {
            const tx = this.db.transaction(storeName, "readonly");
            const index = tx.objectStore(storeName).index(indexName);
            const request = index.get(indexValue);
            request.addEventListener("success", e => {
                resolve(e.target.result);
            })

            request.addEventListener("error", e => {
                reject(e.target.error);
            })
        })
    }

    async delete(storeName, key) {
        return new Promise((resolve, reject) => {
            const tx = this.db.transaction(storeName, "readwrite");

            const request = tx.objectStore(storeName).delete(key);
            request.addEventListener("success", _ => {
                resolve(true);
            })
            request.addEventListener("error", e => {
                reject(e.target.error);
            })
        })
    }

    async clear(storeName) {
        return new Promise((resolve, reject) => {
            const tx = this.db.transaction(storeName, "readwrite");

            const request = tx.objectStore(storeName).clear();
            request.addEventListener("success", _ => {
                resolve(true);
            })
            request.addEventListener("error", e => {
                reject(e.target.error);
            })
        })
    }
}