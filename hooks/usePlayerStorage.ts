"use client"

import { useMemo, useEffect } from "react"
import { PlayerSchema } from "@/config/schema"
import { PlayerDatabase } from "@/lib/indexedDb"
import { localStorageDB } from "@/lib/localStorageDB"
import { supabase } from "@/lib/supabase"

export const usePlayerStorage = () => {
	const db = useMemo(() => new PlayerDatabase(), [])

	useEffect(() => {
		return () => {
			// Cleanup: close database connection when component unmounts
			db.close()
		}
	}, [db])

	const loadFromIndexedDB = async (): Promise<PlayerSchema[] | null> => {
		try {
			const cachedPlayers = await db.getAllPlayers()

			return cachedPlayers
		} catch (err) {
			console.warn("IndexedDB load failed:", err)
			return null
		}
	}

	const loadFromSupabase = async (): Promise<PlayerSchema[]> => {
		const canQuery = localStorageDB.canQuery()
		if (!canQuery) {
			console.log(`Rate limited to 1 / hour. Try again later`)
			return []
		}

		try {
			const { data, error: supabaseError } = await supabase
				.from("players")
				.select("id, gameID, name, raid, reason")

			if (supabaseError) throw supabaseError

			if (!data) throw new Error("No data received")

			await db.storeAllPlayers(data)

			return data
		} catch (err) {
			throw err
		}
	}

	const clearData = async (): Promise<void> => {
		await db.clearData()
		localStorageDB.reset()
	}

	return {
		loadFromSupabase,
		clearData,
		loadFromIndexedDB,
	}
}
