import { z } from "zod"

export const playerIdType = z.number()
export type PlayerIdType = z.infer<typeof playerIdType>

export const playerSchema = z.object({
	id: playerIdType,
	gameID: z.number(),
	name: z.string(),
	raid: z.string(),
	reason: z.string().nullable(),
})
export type PlayerSchema = z.infer<typeof playerSchema>

export const createPlayerSchema = z.object({
	gameID: z
		.number()
		.min(1, { message: "ID is required" })
		.max(9999999999, { message: "ID is too long" }),
	name: z
		.string()
		.min(1, { message: "Name is required" })
		.max(20, { message: "Name cannot exceed 20 characters" }),
	raid: z
		.string()
		.min(1, { message: "Raid is required" })
		.max(20, { message: "Raid cannot exceed 20 characters" }),
	reason: z.string().max(100, { message: "Reason cannot exceed 100 characters" }).nullable(),
})
export type CreatePlayerSchema = z.infer<typeof createPlayerSchema>

export const updatePlayerSchema = createPlayerSchema.partial().extend({
	id: playerIdType,
})
export type UpdatePlayerSchema = z.infer<typeof updatePlayerSchema>
