import { useEffect, useState } from "react";

type ModalProps = {
	confirmText: string;
	onClose?: () => void;
};

export default function ConfirmModal({ confirmText, onClose }: ModalProps) {
	const [visible, setVisible] = useState(false);
	const [shouldRender, setShouldRender] = useState(true);

	useEffect(() => {
		// Déclenche l’entrée
		const enterTimeout = setTimeout(() => setVisible(true), 50);

		// Déclenche la sortie après 1800ms
		const timer = setTimeout(() => setVisible(false), 1800);

		// Quand l'animation de sortie est finie, démonte le composant
		const cleanup = setTimeout(() => {
			setShouldRender(false);
			onClose?.();
		}, 2500);

		return () => {
			clearTimeout(enterTimeout);
			clearTimeout(timer);
			clearTimeout(cleanup);
		};
	}, []);

	if (!shouldRender) return null;

	return (
		<div
			className={`fixed bottom-4 left-4 z-50 px-4 py-2 mb-20 bg-green-500 text-white rounded-lg shadow-lg transition-all duration-500 ease-in-out lg:mb-45 lg:z-50
        ${visible ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"}`}
		>
			<p className="text-sm font-semibold">{confirmText}</p>
		</div>
	);
}
