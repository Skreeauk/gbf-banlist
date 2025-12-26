"use client"

import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

import { Search } from "lucide-react"

export function SearchButton() {
	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<Button
					variant="outline"
					size="icon"
					className="size-10 hover:bg-primary/10"
					onClick={() => toast.error("Not implemented yet")}
				>
					<span className="sr-only">Search</span>
					<Search className="size-6" />
				</Button>
			</TooltipTrigger>
			<TooltipContent>
				<p>Search</p>
			</TooltipContent>
		</Tooltip>
	)
}
