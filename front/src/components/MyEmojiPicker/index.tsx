import { EmojiPicker } from "frimousse";

export function MyEmojiPicker({
	onSelect,
}: {
	onSelect: (emoji: string) => void;
}) {
	return (
		<EmojiPicker.Root
			columns={11}
			onEmojiSelect={(selected) => onSelect(selected.emoji)}
		>
			<div className="relative mt-2 ">
				<EmojiPicker.Search className="z-10 w-9/10 mt-2 pl-8 appearance-none rounded-md bg-neutral-100 px-2.5 py-2 text-sm! dark:bg-neutral-800 " />
				<img
					src="/glass.svg"
					alt="loupe"
					className="absolute w-4.5 -mt-7 ml-2 brightness-70"
				/>
			</div>
			<EmojiPicker.Viewport>
				<EmojiPicker.List />
			</EmojiPicker.Viewport>
		</EmojiPicker.Root>
	);
}
export default MyEmojiPicker;
