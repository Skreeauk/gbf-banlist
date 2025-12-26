import { PlayerSchema } from "@/config/schema"

export class PlayerDatabase {
	private dbName: string = "GBFBanListDB"
	private storeName: string = "players"
	private db: IDBDatabase | null = null
	private version: number = 1
	private initPromise: Promise<IDBDatabase> | null = null

	async init(): Promise<IDBDatabase> {
		// Return cached DB if already open
		if (this.db) {
			return this.db
		}

		// Return pending promise if init is already in progress
		if (this.initPromise) {
			return this.initPromise
		}

		this.initPromise = new Promise((resolve, reject) => {
			const request = indexedDB.open(this.dbName, this.version)

			request.onerror = () => {
				console.log("IndexedDB error:", request.error?.message)
				this.initPromise = null
				reject(request.error)
			}

			request.onsuccess = () => {
				this.db = request.result
				resolve(this.db)
			}

			request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
				const db = (event.target as IDBOpenDBRequest).result

				if (!db.objectStoreNames.contains(this.storeName)) {
					db.createObjectStore(this.storeName, {
						keyPath: "id",
						autoIncrement: false,
					})
				}
			}
		})

		return this.initPromise
	}

	async storeAllPlayers(players: PlayerSchema[]): Promise<number> {
		await this.init()

		return new Promise((resolve, reject) => {
			if (!this.db) {
				reject(new Error("Indexed DB not initialized"))
				return
			}

			const transaction = this.db.transaction([this.storeName], "readwrite")
			const store = transaction.objectStore(this.storeName)

			store.clear()

			players.forEach((player) => {
				store.put(player)
			})

			transaction.oncomplete = () => {
				console.log("All players stored successfully")
				resolve(players.length)
			}

			transaction.onerror = () => {
				console.log("Transaction error (storeAllPlayers):", transaction.error?.message)
				reject(transaction.error)
			}
		})
	}

	async getAllPlayers(): Promise<PlayerSchema[]> {
		await this.init()

		return new Promise((resolve, reject) => {
			if (!this.db) {
				reject(new Error("Indexed DB not initialized"))
				return
			}

			const transaction = this.db.transaction([this.storeName], "readonly")
			const store = transaction.objectStore(this.storeName)
			const request = store.getAll()

			request.onsuccess = () => {
				const players = request.result.map((player) => {
					return {
						...player,
					}
				})
				resolve(players)
			}

			request.onerror = () => reject(request.error)
		})
	}

	async clearData(): Promise<void> {
		await this.init()

		return new Promise((resolve, reject) => {
			if (!this.db) {
				reject(new Error("Database not initialized"))
				return
			}

			const transaction = this.db.transaction([this.storeName], "readwrite")
			const store = transaction.objectStore(this.storeName)
			const request = store.clear()

			request.onsuccess = () => {
				resolve()
			}

			request.onerror = () => reject(request.error)
		})
	}

	close(): void {
		if (this.db) {
			this.db.close()
			this.db = null
			this.initPromise = null
		}
	}
}
