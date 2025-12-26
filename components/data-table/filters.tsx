import { type Table as TanstackTable } from "@tanstack/react-table"

import { Input } from "@/components/ui/input"
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"

interface FiltersProps<TData> {
	table: TanstackTable<TData>
}

export function Filters<TData>({ table }: FiltersProps<TData>) {
	return (
		<>
			<Input
				name="gameID-filter"
				placeholder="Filter ID..."
				value={(table.getColumn("gameID")?.getFilterValue() as string) ?? ""}
				onChange={(event) => table.getColumn("gameID")?.setFilterValue(event.target.value)}
				className="max-w-3xs"
			/>
			<Input
				name="name-filter"
				placeholder="Filter Names..."
				value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
				onChange={(event) => table.getColumn("name")?.setFilterValue(event.target.value)}
				className="max-w-3xs"
			/>
			<Select
				name="raid-filter"
				value={(table.getColumn("raid")?.getFilterValue() as string) ?? "All"}
				onValueChange={(value) => {
					value === "All"
						? table.getColumn("raid")?.setFilterValue("")
						: table.getColumn("raid")?.setFilterValue(value)
				}}
			>
				<SelectTrigger className="w-45">
					<SelectValue placeholder="Filter Raids..." />
				</SelectTrigger>
				<SelectContent>
					<SelectGroup>
						<SelectItem value="All">All Raids</SelectItem>
						<SelectItem value="Hexa">Hexa</SelectItem>
						<SelectItem value="Faa0">Faa0</SelectItem>
						<SelectItem value="Versusia">Versusia</SelectItem>
					</SelectGroup>
				</SelectContent>
			</Select>
		</>
	)
}
