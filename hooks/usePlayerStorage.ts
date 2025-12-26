import { useState, useEffect, useCallback } from "react"
import { PlayerSchema } from "@/config/schema"
import { CacheStatus } from "@/config/types"
import { PlayerDatabase } from "@/lib/indexedDb"
import { queryLimiter } from "@/lib/queryLimiter"
import { supabase } from "@/lib/supabase"

export const usePlayerStorage = () => {
	const [players, setPlayers] = useState<PlayerSchema[]>([])
	const [loading, setLoading] = useState<boolean>(true)
	const [error, setError] = useState<string | null>(null)
	const [cacheStatus, setCacheStatus] = useState<CacheStatus>({
		isFresh: false,
		count: 0,
		lastUpdated: null,
	})

	const db = new PlayerDatabase()

	const loadFromCache = useCallback(async (): Promise<PlayerSchema[] | null> => {
		try {
			const cachedPlayers = await db.getAllPlayers()
			const isFresh = await db.isCacheFresh()
			const stats = await db.getCacheStats()

			setPlayers(cachedPlayers)
			setCacheStatus({
				isFresh,
				count: stats.count,
				lastUpdated: stats.lastUpdated,
			})

			return cachedPlayers
		} catch (err) {
			console.warn("Cache load failed:", err)
			return null
		}
	}, [db])

	const refreshFromServer = useCallback(async (): Promise<PlayerSchema[]> => {
		const canQuery = queryLimiter.canQuery()
		if (canQuery !== true) {
			throw new Error(`Rate limit: 1 query/hour. Try again in ${canQuery.timeLeft} minutes.`)
		}

		setLoading(true)
		setError(null)

		try {
			const { data, error: supabaseError } = await supabase
				.from("players")
				.select("*")
				.order("last_updated", { ascending: false })

			if (supabaseError) throw supabaseError
			if (!data) throw new Error("No data received")

			await db.storeAllPlayers(data)

			setPlayers(data)
			setCacheStatus({
				isFresh: true,
				count: data.length,
				lastUpdated: new Date().toISOString(),
			})

			return data
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : "Unknown error occurred"
			setError(errorMessage)
			throw err
		} finally {
			setLoading(false)
		}
	}, [db])

	const smartRefresh = useCallback(
		async (force: boolean = false): Promise<PlayerSchema[]> => {
			if (!force) {
				const cached = await loadFromCache()
				if (cached && cached.length > 0 && cacheStatus.isFresh) {
					return cached
				}
			}

			return await refreshFromServer()
		},
		[loadFromCache, refreshFromServer, cacheStatus.isFresh],
	)

	const clearCache = useCallback(async (): Promise<void> => {
		await db.clearCache()
		setPlayers([])
		setCacheStatus({ isFresh: false, count: 0, lastUpdated: null })
	}, [db])

	useEffect(() => {
		smartRefresh().catch((err) => {
			console.error("Initial load failed:", err)
		})
	}, [])

	return {
		players,
		loading,
		error,
		cacheStatus,
		refreshFromServer,
		smartRefresh,
		clearCache,
		loadFromCache,
	}
}
