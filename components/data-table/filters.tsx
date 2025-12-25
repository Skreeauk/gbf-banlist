"use client"

import { useState } from "react"

import { type Table as TanstackTable } from "@tanstack/react-table"

import { Input } from "@/components/ui/input"

interface FiltersProps<TData> {
	table: TanstackTable<TData>
}

export function Filters<TData>({ table }: FiltersProps<TData>) {
	return (
		<>
			<Input
				placeholder="Filter ID..."
				value={(table.getColumn("gameID")?.getFilterValue() as string) ?? ""}
				onChange={(event) => table.getColumn("gameID")?.setFilterValue(event.target.value)}
				className="max-w-3xs"
			/>
			<Input
				placeholder="Filter Names..."
				value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
				onChange={(event) => table.getColumn("name")?.setFilterValue(event.target.value)}
				className="max-w-3xs"
			/>
		</>
	)
}
