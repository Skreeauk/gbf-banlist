import { createId } from "@paralleldrive/cuid2"

export class LocalStorageDB {
	private key: string
	private windowMs: number

	constructor(key: string = "GBFBanListQuery", windowMs: number = 3600000) {
		this.key = key
		this.windowMs = windowMs // 1 hour in ms
	}

	canQuery(): boolean {
		if (typeof window === "undefined") return true

		const storedCUID = localStorage.getItem("GBFBanListCUID")
		if (!storedCUID) {
			const cuid = createId()
			localStorage.setItem("GBFBanListCUID", cuid)
		}

		const now = Date.now()
		const stored = localStorage.getItem(this.key)

		if (!stored) {
			localStorage.setItem(this.key, Date.now().toString())
			return true
		}

		const timeElapsed = now - parseInt(stored)

		if (timeElapsed > this.windowMs) {
			localStorage.setItem(this.key, Date.now().toString())
			return true
		}

		return false
	}

	reset(): void {
		if (typeof window !== "undefined") {
			localStorage.removeItem(this.key)
		}
	}
}

export const localStorageDB = new LocalStorageDB("GBFBanListQuery", 3600000)
