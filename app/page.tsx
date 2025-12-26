"use client"

import { useState, useEffect } from "react"

import { PlayerSchema } from "@/config/schema"

import { columns } from "@/components/data-table/columns"
import { DataTable } from "@/components/data-table/data-table"

import { ThemeToggle } from "@/components/theme-toggle"
import { AnimatedNumberBasic } from "@/components/animated-number"
import { InsertButton } from "@/components/insert-button"
import { SearchButton } from "@/components/search-button"
import { RefreshButton } from "@/components/refresh-button"

import { usePlayerStorage } from "@/hooks/usePlayerStorage"

export default function DemoPage() {
	const [mounted, setMounted] = useState(false)
	const [dbData, setDBData] = useState<PlayerSchema[] | null>([])

	const { loadFromIndexedDB, loadFromSupabase, clearData } = usePlayerStorage()

	useEffect(() => {
		setMounted(true)
		let isMounted = true

		const loadData = async () => {
			try {
				const serverData = await loadFromSupabase()
				console.log("Supabase:", serverData)

				// Check if Supabase returned data
				if (serverData && serverData.length > 0) {
					setDBData(serverData)
				} else {
					// Empty array from Supabase, fall back to IndexedDB
					console.log("Supabase returned empty, loading from IndexedDB...")
					try {
						const localData = await loadFromIndexedDB()
						setDBData(localData)
						console.log("Loaded from IndexedDB fallback:", localData)
					} catch (idbError) {
						console.error("Error loading from IndexedDB:", idbError)
						// Set empty array if both fail
						setDBData([])
					}
				}
			} catch (error) {
				console.error("Error loading from Supabase:", error)

				try {
					const localData = await loadFromIndexedDB()
					setDBData(localData)
					console.log("Loaded from IndexedDB fallback:", localData)
				} catch (idbError) {
					console.error("Error loading from IndexedDB:", idbError)
					setDBData([])
				}
			}
		}

		loadData()

		return () => {
			isMounted = false
		}
	}, [])

	if (!mounted) {
		return null
	}

	return (
		<div className="container flex flex-col py-10 gap-10 mx-auto">
			<div className="flex flex-col gap-5 items-center justify-center mx-5 sm:mx-0">
				<h1 className="text-5xl font-bold">GBF Ban List</h1>
				<div className="flex gap-3 items-center justify-center">
					<span>Up to</span>
					<AnimatedNumberBasic number={dbData?.length || 0} />
					<span>players</span>
				</div>
				{/* <Input className="max-w-lg" placeholder="Search ID / Player..." /> */}
				<div className="flex gap-8">
					<InsertButton />
					<SearchButton />
					<RefreshButton
						loadSupabase={loadFromSupabase}
						clearData={clearData}
						setDBData={setDBData}
					/>
					<ThemeToggle className="hover:bg-primary/10" />
				</div>
			</div>
			<div className="mx-5 sm:mx-0">
				<DataTable columns={columns} data={dbData || []} />
			</div>
		</div>
	)
}
