"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogTrigger,
} from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

import { Plus } from "lucide-react"

import { InsertForm } from "./insert-form"

export function InsertButton() {
	const [isOpen, setIsOpen] = useState(false)
	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							variant="outline"
							size="icon"
							className="size-10 hover:bg-primary/10"
							onClick={() => setIsOpen(true)}
						>
							<span className="sr-only">Insert</span>
							<Plus className="size-6" />
						</Button>
					</TooltipTrigger>
					<TooltipContent>
						<p>Ban a player</p>
					</TooltipContent>
				</Tooltip>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Ban a player</DialogTitle>
					<DialogDescription></DialogDescription>
				</DialogHeader>
				<InsertForm onSuccess={() => setIsOpen(false)} onCancel={() => setIsOpen(false)} />
			</DialogContent>
		</Dialog>
	)
}
