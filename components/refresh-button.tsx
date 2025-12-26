"use client"

import { useState } from "react"
import { toast } from "sonner"

import { PlayerSchema } from "@/config/schema"

import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

import { RefreshCcw } from "lucide-react"

import { cn } from "@/lib/utils"

interface RefreshButtonProps {
	loadSupabase: () => Promise<PlayerSchema[]>
	clearData: () => Promise<void>
	setDBData: (data: PlayerSchema[] | null) => void
}

export function RefreshButton({ loadSupabase, clearData, setDBData }: RefreshButtonProps) {
	const [isLoading, setIsLoading] = useState(false)

	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<Button
					variant="outline"
					size="icon"
					className="size-10 hover:bg-primary/10"
					onClick={async () => {
						try {
							setIsLoading(true)
							await clearData()
							const newData = await loadSupabase()
							setDBData(newData)
							toast.success(`Updated with latest data!`)
						} catch (error) {
							console.error("Error refreshing data:", error)
							toast.error(
								`Failed to refresh data: ${error instanceof Error ? error.message : String(error)}`,
							)
						} finally {
							setIsLoading(false)
						}
					}}
				>
					<span className="sr-only">Refresh</span>
					<RefreshCcw className={cn("size-6", isLoading && "animate-[spin_1s_reverse_infinite]")} />
				</Button>
			</TooltipTrigger>
			<TooltipContent>
				<p>Refresh data</p>
			</TooltipContent>
		</Tooltip>
	)
}
