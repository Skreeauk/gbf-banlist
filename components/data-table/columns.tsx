"use client"

import { ColumnDef } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { MoreHorizontal } from "lucide-react"

import { ColumnHeader } from "./column-header"
import { PlayerSchema } from "@/config/schema"

export const columns: ColumnDef<PlayerSchema>[] = [
	{
		accessorKey: "gameID",
		header: ({ column }) => <ColumnHeader column={column} title="ID" />,
		filterFn: (row, id, value) => {
			const gameID = String(row.getValue(id)).toLowerCase()
			return gameID.includes(String(value).toLowerCase())
		},
	},
	{
		accessorKey: "name",
		header: ({ column }) => <ColumnHeader column={column} title="Name" />,
	},
	{
		accessorKey: "raid",
		header: ({ column }) => <ColumnHeader column={column} title="Raid" />,
	},
	{
		accessorKey: "reason",
		header: ({ column }) => <ColumnHeader column={column} title="Reason / Description" />,
		cell: ({ row }) => <div className="max-w-6xl truncate">{row.getValue("reason")}</div>,
	},
	{
		id: "actions",
		cell: ({ row }) => {
			const rowData = row.original

			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild className="relative float-right">
						<Button variant="ghost" className="size-8 p-0">
							<span className="sr-only">Open menu</span>
							<MoreHorizontal className="size-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuItem
							onClick={() => navigator.clipboard.writeText(rowData.gameID.toString())}
						>
							Copy ID
						</DropdownMenuItem>
						<DropdownMenuItem onClick={() => navigator.clipboard.writeText(rowData.name)}>
							Copy Name
						</DropdownMenuItem>
						<DropdownMenuItem asChild>
							<a
								href={`https://game.granbluefantasy.jp/#profile/${rowData.gameID}`}
								target="_blank"
								rel="noopener noreferrer"
							>
								Visit Profile
							</a>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			)
		},
	},
]
