import { PlayerSchema } from "@/config/schema"

interface StoredPlayer extends PlayerSchema {
	cached_at: number
}

export class PlayerDatabase {
	private dbName: string = "RaidTrackerDB"
	private storeName: string = "players"
	private db: IDBDatabase | null = null
	private version: number = 1

	async init(): Promise<IDBDatabase> {
		return new Promise((resolve, reject) => {
			const request = indexedDB.open(this.dbName, this.version)

			request.onerror = () => reject(request.error)

			request.onsuccess = () => {
				this.db = request.result
				resolve(this.db)
			}

			request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
				const db = (event.target as IDBOpenDBRequest).result

				if (!db.objectStoreNames.contains(this.storeName)) {
					const store = db.createObjectStore(this.storeName, {
						keyPath: "id",
						autoIncrement: false,
					})

					store.createIndex("name", "name", { unique: false })
					store.createIndex("raid", "raid", { unique: false })
					store.createIndex("created_at_ms", "_created_at_ms", { unique: false })
					store.createIndex("last_updated_ms", "_last_updated_ms", { unique: false })
					store.createIndex("cached_at", "_cached_at", { unique: false })
				}
			}
		})
	}

	async storeAllPlayers(players: PlayerSchema[]): Promise<number> {
		await this.init()

		return new Promise((resolve, reject) => {
			if (!this.db) {
				reject(new Error("Database not initialized"))
				return
			}

			const transaction = this.db.transaction([this.storeName], "readwrite")
			const store = transaction.objectStore(this.storeName)

			store.clear()

			const now = Date.now()
			players.forEach((player) => {
				const storedPlayer: StoredPlayer = {
					...player,
					cached_at: now,
				}
				store.put(storedPlayer)
			})

			transaction.oncomplete = () => resolve(players.length)
			transaction.onerror = () => reject(transaction.error)
		})
	}

	async getAllPlayers(): Promise<PlayerSchema[]> {
		await this.init()

		return new Promise((resolve, reject) => {
			if (!this.db) {
				reject(new Error("Database not initialized"))
				return
			}

			const transaction = this.db.transaction([this.storeName], "readonly")
			const store = transaction.objectStore(this.storeName)
			const request = store.getAll()

			request.onsuccess = () => {
				const players = request.result.map((storedPlayer: StoredPlayer) => {
					const { cached_at, ...player } = storedPlayer
					return {
						...player,
					}
				})
				resolve(players)
			}

			request.onerror = () => reject(request.error)
		})
	}

	async isCacheFresh(maxAgeMs: number = 3600000): Promise<boolean> {
		await this.init()

		return new Promise((resolve, reject) => {
			if (!this.db) {
				reject(new Error("Database not initialized"))
				return
			}

			const transaction = this.db.transaction([this.storeName], "readonly")
			const store = transaction.objectStore(this.storeName)
			const index = store.index("cached_at")
			const request = index.getAll()

			request.onsuccess = () => {
				if (request.result.length === 0) {
					resolve(false)
					return
				}

				const oldestCache = Math.min(...request.result.map((p: StoredPlayer) => p.cached_at))
				const cacheAge = Date.now() - oldestCache
				resolve(cacheAge < maxAgeMs)
			}

			request.onerror = () => reject(request.error)
		})
	}

	async clearCache(): Promise<void> {
		await this.init()

		return new Promise((resolve, reject) => {
			if (!this.db) {
				reject(new Error("Database not initialized"))
				return
			}

			const transaction = this.db.transaction([this.storeName], "readwrite")
			const store = transaction.objectStore(this.storeName)
			const request = store.clear()

			request.onsuccess = () => resolve()
			request.onerror = () => reject(request.error)
		})
	}

	async getCacheStats(): Promise<{ count: number; lastUpdated: string | null }> {
		await this.init()

		return new Promise((resolve, reject) => {
			if (!this.db) {
				reject(new Error("Database not initialized"))
				return
			}

			const transaction = this.db.transaction([this.storeName], "readonly")
			const store = transaction.objectStore(this.storeName)
			const countRequest = store.count()
			const cacheTimeRequest = store.index("cached_at").getAll()

			Promise.all([
				new Promise<number>((res, rej) => {
					countRequest.onsuccess = () => res(countRequest.result)
					countRequest.onerror = () => rej(countRequest.error)
				}),
				new Promise<StoredPlayer[]>((res, rej) => {
					cacheTimeRequest.onsuccess = () => res(cacheTimeRequest.result)
					cacheTimeRequest.onerror = () => rej(cacheTimeRequest.error)
				}),
			])
				.then(([count, players]) => {
					if (players.length === 0) {
						resolve({ count, lastUpdated: null })
						return
					}

					const latestCache = Math.max(...players.map((p) => p.cached_at))
					resolve({
						count,
						lastUpdated: new Date(latestCache).toISOString(),
					})
				})
				.catch(reject)
		})
	}
}
