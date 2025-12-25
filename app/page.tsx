import { createClient } from "@supabase/supabase-js"
import { Database } from "@/config/supabase"

import { AnimatedNumberBasic } from "@/components/animated-number"

import { PlayerSchema } from "@/config/schema"

import { columns } from "@/components/data-table/columns"
import { DataTable } from "@/components/data-table/data-table"
import { ThemeToggle } from "@/components/theme-toggle"
import { Input } from "@/components/ui/input"

import { Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"

async function getData(): Promise<PlayerSchema[]> {
	// Fetch data from your API here.
	return [
		{
			id: "1",
			gameID: 1,
			name: "PlayerOne",
			raid: "RaidA",
			reason: "Violation of rules",
			createdAt: new Date(),
			updatedAt: new Date(),
		},
		{
			id: "2",
			gameID: 2,
			name: "PlayerOne",
			raid: "RaidA",
			reason: "Violation of rules",
			createdAt: new Date(),
			updatedAt: new Date(),
		},
		{
			id: "3",
			gameID: 3,
			name: "PlayerOne",
			raid: "RaidA",
			reason:
				"Violation of rules aaaaaaaaaaaaaaaaa aaaaaaaaaaaaaaaaaa aaaaaaaaaaaaaaaaaa aaaaaaaaaaaaaaaa aaaaaaa",
			createdAt: new Date(),
			updatedAt: new Date(),
		},
		{
			id: "4",
			gameID: 4,
			name: "PlayerOne1q1111111111111111111111111111111111",
			raid: "RaidA",
			reason: "Violation of rules",
			createdAt: new Date(),
			updatedAt: new Date(),
		},
		{
			id: "5",
			gameID: 5,
			name: "PlayerOne",
			raid: "RaidA",
			reason: "Violation of rules",
			createdAt: new Date(),
			updatedAt: new Date(),
		},
		{
			id: "6",
			gameID: 6,
			name: "PlayerOne",
			raid: "RaidA",
			reason: "Violation of rules",
			createdAt: new Date(),
			updatedAt: new Date(),
		},
		{
			id: "7",
			gameID: 7,
			name: "PlayerOne",
			raid: "RaidA",
			reason: "Violation of rules",
			createdAt: new Date(),
			updatedAt: new Date(),
		},
		{
			id: "8",
			gameID: 8,
			name: "PlayerOne",
			raid: "RaidA",
			reason: "Violation of rules",
			createdAt: new Date(),
			updatedAt: new Date(),
		},
		{
			id: "9",
			gameID: 9,
			name: "PlayerOne",
			raid: "RaidA",
			reason: "Violation of rules",
			createdAt: new Date(),
			updatedAt: new Date(),
		},
		{
			id: "10",
			gameID: 10,
			name: "PlayerOne",
			raid: "RaidA",
			reason: "Violation of rules",
			createdAt: new Date(),
			updatedAt: new Date(),
		},
		{
			id: "11",
			gameID: 11,
			name: "PlayerOne",
			raid: "RaidA",
			reason: "Violation of rules",
			createdAt: new Date(),
			updatedAt: new Date(),
		},
	]
}

export default async function DemoPage() {
	// const supabase = createClient(
	// 	process.env.NEXT_PUBLIC_SUPABASE_URL!,
	// 	process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
	// )

	// const { data, error } = await supabase.from("players").select()

	// const { data, error } = await supabase
	// 	.from("players")
	// 	.insert({
	// 		gameID: 99929,
	// 		name: "TestPlayer2",
	// 		raid: "TestRaid2",
	// 		reason: "Testing2",
	// 		created_at: new Date().toISOString(),
	// 		updated_at: new Date().toISOString(),
	// 	})
	// 	.select()

	// console.log("Data:::", data)

	const fakeData = await getData()

	return (
		<div className="container flex flex-col py-10 gap-10 mx-auto">
			<div className="flex flex-col gap-5 items-center justify-center mx-5 sm:mx-0">
				<h1 className="text-5xl font-bold">GBF Ban List</h1>
				<div className="flex gap-3 items-center justify-center">
					<span>Up to</span>
					<AnimatedNumberBasic number={2041} />
					<span>players</span>
				</div>
				{/* <Input className="max-w-lg" placeholder="Search ID / Player..." /> */}
				<div className="flex gap-8">
					<Button variant="outline" size="icon" className="size-10 hover:bg-primary/10">
						<span className="sr-only">Close</span>
						<Plus className="size-6" />
					</Button>
					<Button variant="outline" size="icon" className="size-10 hover:bg-primary/10">
						<span className="sr-only">Search</span>
						<Search className="size-6" />
					</Button>
					<ThemeToggle className="hover:bg-primary/10" />
				</div>
			</div>
			<div className="mx-5 sm:mx-0">
				<DataTable columns={columns} data={fakeData} />
			</div>
		</div>
	)
}

// export default function Page() {
// return <ComponentExample />;
// }
