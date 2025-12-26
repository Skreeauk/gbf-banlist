export class QueryLimiter {
	private key: string
	private limit: number
	private windowMs: number

	constructor(key: string = "supabase_query", limit: number = 1, windowMs: number = 3600000) {
		this.key = key
		this.limit = limit
		this.windowMs = windowMs // 1 hour in ms
	}

	canQuery(): true | { allowed: false; timeLeft: number; nextAllowed: Date } {
		if (typeof window === "undefined") return true

		const now = Date.now()
		const stored = localStorage.getItem(this.key)

		if (!stored) {
			localStorage.setItem(
				this.key,
				JSON.stringify({
					count: 1,
					firstQuery: now,
					lastQuery: now,
				}),
			)
			return true
		}

		const data = JSON.parse(stored)
		const timeSinceFirst = now - data.firstQuery

		if (timeSinceFirst > this.windowMs) {
			localStorage.setItem(
				this.key,
				JSON.stringify({
					count: 1,
					firstQuery: now,
					lastQuery: now,
				}),
			)
			return true
		}

		if (data.count >= this.limit) {
			const timeLeft = Math.ceil((this.windowMs - timeSinceFirst) / (1000 * 60))
			return {
				allowed: false,
				timeLeft,
				nextAllowed: new Date(data.firstQuery + this.windowMs),
			}
		}

		data.count++
		data.lastQuery = now
		localStorage.setItem(this.key, JSON.stringify(data))
		return true
	}

	reset(): void {
		if (typeof window !== "undefined") {
			localStorage.removeItem(this.key)
		}
	}

	getStatus(): { count: number; limit: number; timeLeft: number; nextAllowed: Date | null } {
		if (typeof window === "undefined")
			return { count: 0, limit: this.limit, timeLeft: 0, nextAllowed: null }

		const stored = localStorage.getItem(this.key)
		if (!stored) return { count: 0, limit: this.limit, timeLeft: 0, nextAllowed: null }

		const data = JSON.parse(stored)
		const now = Date.now()
		const timeSinceFirst = now - data.firstQuery
		const timeLeft = Math.max(0, this.windowMs - timeSinceFirst)

		return {
			count: data.count,
			limit: this.limit,
			timeLeft: Math.ceil(timeLeft / (1000 * 60)),
			nextAllowed: new Date(data.firstQuery + this.windowMs),
		}
	}
}

export const queryLimiter = new QueryLimiter("supabase_query", 1, 3600000)
