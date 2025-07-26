import { useState, useRef, useEffect } from "react";
import { HexColorPicker } from "react-colorful";

export default function ColorPickerPopover({
	color,
	onChange,
}: {
	color: string;
	onChange: (val: string) => void;
}) {
	const [isOpen, setIsOpen] = useState(false);
	const popoverRef = useRef<HTMLDivElement>(null);

	// Ferme le picker si clic en dehors
	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (
				popoverRef.current &&
				!popoverRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	return (
		<div className="relative">
			{/** biome-ignore lint/a11y/noStaticElementInteractions: <explanation> */}
			{/** biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
			<div
				onClick={() => setIsOpen(!isOpen)}
				className="w-full h-8 rounded-md border border-gray-300 cursor-pointer"
				style={{ backgroundColor: color }}
				title={color}
			></div>

			{isOpen && (
				<div
					ref={popoverRef}
					className="absolute z-50 mt-2 p-2 right-1 bg-white rounded shadow-lg border"
				>
					<HexColorPicker color={color} onChange={onChange} />
				</div>
			)}
		</div>
	);
}
