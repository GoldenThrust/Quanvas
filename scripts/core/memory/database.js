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

    async getAllByIndex(storeName, indexName, indexValue) {
        return new Promise((resolve, reject) => {
            const tx = this.db.transaction(storeName, "readonly");
            const index = tx.objectStore(storeName).index(indexName);
            const request = index.getAll(indexValue);
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

    getProject() {
        const projectId = Database.getCurrentProjectID();
        return this.get('projects', projectId);
    }

    static getCurrentProjectID() {
        return localStorage.getItem('current-project');
    }
}


const database = new Database('quanvas-db-v1', 1);


const storeDefinitions = [
    {
        name: 'projects',
        keyPath: 'id',
        indexes: [
            { name: 'name', keyPath: 'name', unique: false },
            { name: 'createdAt', keyPath: 'createdAt', unique: false },
            { name: 'updatedAt', keyPath: 'updatedAt', unique: false }
        ]
    },
    {
        name: 'layers',
        keyPath: 'id',
        indexes: [
            { name: 'projectId', keyPath: 'projectId', unique: false },
            { name: 'name', keyPath: 'name', unique: false },
            { name: 'order', keyPath: 'order', unique: false },
        ]
    },
    {
        name: 'paths',
        keyPath: 'id',
        autoIncrement: true,
        indexes: [
            { name: 'layerId', keyPath: 'layerId', unique: false },
            { name: 'projectId', keyPath: 'projectId', unique: false },
            { name: 'type', keyPath: 'type', unique: false },
            { name: 'createdAt', keyPath: 'createdAt', unique: false }
        ]
    }
];

try {
    await database.open(storeDefinitions);
    console.log('Database initialized successfully');
} catch (error) {
    console.error('Failed to initialize database:', error);
    throw error;
}

export { database };

export const dbOperations = {
    async createProject(projectData) {
        const project = {
            ...projectData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        return await database.put('projects', project);
    },

    async getProject(projectId) {
        return await database.get('projects', projectId);
    },

    async getAllProjects() {
        return await database.getAll('projects');
    },

    async updateProject(projectId, updateData) {
        const project = await database.get('projects', projectId);
        if (project) {
            const updatedProject = {
                ...project,
                ...updateData,
                updatedAt: new Date().toISOString()
            };
            return await database.put('projects', updatedProject);
        }
        return false;
    },

    async deleteProject(projectId) {
        localStorage.removeItem('current-project');
        const layers = await database.getAllByIndex('layers', 'projectId', projectId);

        if (layers.length !== 0) {
            layers.forEach(async (layer) => {
                await database.delete('layers', layer.id);
            });

            const paths = await database.getAllByIndex('paths', 'projectId', projectId);
            if (paths.length !== 0) {
                paths.forEach(async (path) => {
                    await database.delete('paths', path.id);
                });
            }

            return await database.delete('projects', projectId);
        }
    },

    async createLayer(layerData) {
        const layer = {
            ...layerData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        return await database.put('layers', layer);
    },

    async getLayer(layerId) {
        return await database.get('layers', layerId);
    },

    async getAllLayers() {
        return await database.getAll('layers');
    },

    async getLayersByProject(projectId) {
        return await database.getAllByIndex('layers', 'projectId', projectId);
    },

    async updateLayer(layerId, updateData) {
        const layer = await database.get('layers', layerId);
        if (layer) {
            const updatedLayer = {
                ...layer,
                ...updateData,
                updatedAt: new Date().toISOString()
            };
            return await database.put('layers', updatedLayer);
        }
        return false;
    },

    async deleteLayer(layerId) {
        const paths = await database.getAllByIndex('paths', 'layerId', layerId);
        if (paths.length !== 0) {
            paths.forEach(async (path) => {
                await database.delete('paths', path.id);
            });
        }

        return await database.delete('layers', layerId);
    },

    async createPath(pathData) {
        console.log(pathData);
        const path = {
            ...pathData,
            createdAt: new Date().toISOString()
        };
        return await database.put('paths', path);
    },

    async getPath(pathId) {
        return await database.get('paths', pathId);
    },

    async getPathsByLayer(layerId) {
        return await database.getAllByIndex('paths', 'layerId', layerId);
    },

    async getPathsByProject(projectId) {
        return await database.getAllByIndex('paths', 'projectId', projectId);
    },

    async updatePath(pathId, updateData) {
        const path = await database.get('paths', pathId);
        if (path) {
            const updatedPath = { ...path, ...updateData };
            return await database.put('paths', updatedPath);
        }
        return false;
    },

    async deletePath(pathId) {
        return await database.delete('paths', pathId);
    },

    async clearAllData() {
        await database.clear('projects');
        await database.clear('layers');
        await database.clear('paths');
    }
};