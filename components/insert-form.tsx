// import { supabase } from "@/lib/supabase"

import { useForm } from "@tanstack/react-form"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
	InputGroup,
	InputGroupAddon,
	InputGroupText,
	InputGroupTextarea,
} from "@/components/ui/input-group"
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"

import { CreatePlayerSchema, createPlayerSchema } from "@/config/schema"

type InsertFormProps = {
	onSuccess: () => void
	onCancel: () => void
}

export function InsertForm({ onSuccess, onCancel }: InsertFormProps) {
	const defaultValues: CreatePlayerSchema = {
		gameID: 0,
		name: "",
		raid: "Hexa",
		reason: "",
	}

	const form = useForm({
		defaultValues,
		validators: {
			onSubmit: createPlayerSchema,
		},
		onSubmit: async ({ value }) => {
			// const { data, error } = await supabase.from("players").insert({
			// 	gameID: value.gameID,
			// 	name: value.name,
			// 	raid: value.raid,
			// 	reason: value.reason,
			// })

			// if (error) {
			// 	toast.error(`Error submitting player: ${error.message}`)
			// 	return
			// }

			toast.success("Player submitted successfully!")
			onSuccess()
		},
	})

	return (
		<form
			id="insertPlayerForm"
			onSubmit={(e) => {
				e.preventDefault()
				e.stopPropagation()
				form.handleSubmit()
			}}
		>
			<FieldGroup>
				<form.Field
					name="gameID"
					children={(field) => {
						const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
						return (
							<Field data-invalid={isInvalid}>
								<FieldLabel htmlFor={field.name}>ID</FieldLabel>
								<Input
									id={field.name}
									name={field.name}
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(parseInt(e.target.value))}
									aria-invalid={isInvalid}
									autoComplete="off"
									type="number"
								/>
								{isInvalid && <FieldError errors={field.state.meta.errors} />}
							</Field>
						)
					}}
				/>
				<form.Field
					name="name"
					children={(field) => {
						const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
						return (
							<Field data-invalid={isInvalid}>
								<FieldLabel htmlFor={field.name}>Name</FieldLabel>
								<Input
									id={field.name}
									name={field.name}
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									aria-invalid={isInvalid}
									placeholder="Oopy Goopy"
									autoComplete="off"
								/>
								{isInvalid && <FieldError errors={field.state.meta.errors} />}
							</Field>
						)
					}}
				/>
				<form.Field
					name="raid"
					children={(field) => {
						const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
						return (
							<Field data-invalid={isInvalid}>
								<FieldLabel htmlFor={field.name}>Raid</FieldLabel>
								<Select
									name={field.name}
									value={field.state.value}
									onValueChange={(value) => field.handleChange(value)}
									aria-invalid={isInvalid}
								>
									<SelectTrigger id={field.name} name={field.name} className="">
										<SelectValue placeholder="Select a raid" />
									</SelectTrigger>
									<SelectContent>
										<SelectGroup>
											<SelectItem value="Hexa">Hexa</SelectItem>
											<SelectItem value="Faa0">Faa0</SelectItem>
											<SelectItem value="Versusia">Versusia</SelectItem>
										</SelectGroup>
									</SelectContent>
								</Select>
								{isInvalid && <FieldError errors={field.state.meta.errors} />}
							</Field>
						)
					}}
				/>
				<form.Field
					name="reason"
					children={(field) => {
						const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
						return (
							<Field data-invalid={isInvalid}>
								<FieldLabel htmlFor={field.name}>Reason / Description</FieldLabel>
								<InputGroup>
									<InputGroupTextarea
										id={field.name}
										name={field.name}
										value={field.state.value ?? ""}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										placeholder="He sucks."
										rows={6}
										maxLength={100}
										className="min-h-24 resize-none"
										aria-invalid={isInvalid}
									/>
									<InputGroupAddon align="block-end">
										<InputGroupText className="tabular-nums font-mono">
											{field.state.value?.length}/100 characters
										</InputGroupText>
									</InputGroupAddon>
								</InputGroup>
								{isInvalid && <FieldError errors={field.state.meta.errors} />}
							</Field>
						)
					}}
				/>
			</FieldGroup>
			<Field orientation="horizontal" className="pt-6">
				<form.Subscribe>
					{(state) => (
						<>
							<Button
								type="button"
								variant="outline"
								onClick={(e) => {
									e.preventDefault()
									e.stopPropagation()
									form.reset()
									onCancel()
								}}
								disabled={!state.canSubmit}
							>
								Cancel
							</Button>
							<Button
								type="submit"
								form="insertPlayerForm"
								disabled={!state.canSubmit}
								className="flex items-center justify-center gap-2"
							>
								{state.isSubmitting && <Spinner />}
								Submit
							</Button>
						</>
					)}
				</form.Subscribe>
			</Field>
		</form>
	)
}
