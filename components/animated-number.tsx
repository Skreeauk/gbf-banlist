"use client"
import { useEffect, useState } from "react"
import { AnimatedNumber } from "./ui/animated-number"

interface AnimatedNumberBasicProps {
	number?: number
}

export function AnimatedNumberBasic({ number }: AnimatedNumberBasicProps) {
	const [value, setValue] = useState(0)

	useEffect(() => {
		setValue(number || 0)
	}, [number])

	return (
		<AnimatedNumber
			className="inline-flex items-center font-mono text-2xl font-light"
			springOptions={{
				bounce: 0,
				duration: 2000,
			}}
			value={value}
		/>
	)
}
