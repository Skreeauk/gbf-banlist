export interface CacheMetadata {
	timestamp: number
	count: number
	lastUpdated: string | null
}

export interface QueryLimitResult {
	allowed: boolean
	timeLeft?: number // in minutes
	nextAllowed?: Date
}

export interface CacheStatus {
	isFresh: boolean
	count: number
	lastUpdated: string | null
}

export interface StorageResult<T> {
	source: "cache" | "api" | "localStorage" | "api_no_cache"
	data: T
}
