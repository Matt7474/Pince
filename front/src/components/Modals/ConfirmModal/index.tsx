import { useEffect, useState } from "react";

type ModalProps = {
	confirmText: string;
	onClose?: () => void;
};

export default function ConfirmModal({ confirmText, onClose }: ModalProps) {
	const [visible, setVisible] = useState(true);
	const [hasEntered, setHasEntered] = useState(false);

	useEffect(() => {
		const enterTimeout = setTimeout(() => setHasEntered(true), 50);

		const timer = setTimeout(() => {
			setVisible(false);
			onClose?.();
		}, 2500);

		return () => {
			clearTimeout(timer);
			clearTimeout(enterTimeout);
		};
	}, []);

	return (
		<div
			className={`fixed bottom-4 left-4 z-50 px-4 mr-4 py-2 mb-20 bg-green-500 text-white rounded-lg shadow-lg transition-all duration-500 ease-in-out ${
				hasEntered && visible
					? "translate-x-0 opacity-100"
					: "-translate-x-full opacity-0"
			}`}
		>
			<p className="text-sm font-semibold">{confirmText}</p>
		</div>
	);
}
