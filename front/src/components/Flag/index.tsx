type FlagProps = {
	color: string | null;
	text: string | null;
	width?: number | null;
	height?: number | null;
};

export default function Flag({ color, text, width, height }: FlagProps) {
	return (
		<div
			className={`absolute ${color} border-1 border-black flex items-center rotate-315 z-20`}
			style={{ width: `${width}rem`, height: `${height}rem` }}
		>
			<p className="font-semibold text-sm whitespace-nowrap animate-marquee">
				{text}
			</p>
		</div>
	);
}
