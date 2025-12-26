"use client"

import { toast } from "sonner"

import { Button } from "@/components/ui/button"

import { Search } from "lucide-react"

export function SearchButton() {
	return (
		<Button
			variant="outline"
			size="icon"
			className="size-10 hover:bg-primary/10"
			onClick={() => toast.error("Not implemented yet")}
		>
			<span className="sr-only">Search</span>
			<Search className="size-6" />
		</Button>
	)
}
