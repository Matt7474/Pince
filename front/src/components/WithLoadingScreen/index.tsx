import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

type Props = {
	children: React.ReactNode;
	videoSrc: string;
};

export default function WithLoadingScreen({ children, videoSrc }: Props) {
	const { t } = useTranslation();
	const [showOverlay, setShowOverlay] = useState(true);
	const [fadeOut, setFadeOut] = useState(false);

	// Référence vers l'élément vidéo HTML pour pouvoir le manipuler directement
	const videoRef = useRef<HTMLVideoElement>(null);

	// Permet la gestion de la logique de timing et des événements vidéo
	useEffect(() => {
		// Récupération de l'élément vidéo via la ref
		const video = videoRef.current;

		// Fonction interne qui déclenche la fin de la transition
		const endTransition = () => {
			setFadeOut(true);
			setTimeout(() => setShowOverlay(false), 700);
		};

		// Variable pour stocker l'ID du timeout (permet de l'annuler si besoin)
		let timeoutId: ReturnType<typeof setTimeout> | null = null;

		// Timeout de sécurité : force la fin après 3 secondes maximum
		// Utile si la vidéo ne se charge pas ou met trop de temps
		timeoutId = setTimeout(() => {
			endTransition();
		}, 3000);

		const handleEnded = () => {
			if (timeoutId) clearTimeout(timeoutId);
			endTransition();
		};

		// Ajout de l'event listener sur la vidéo si elle existe
		if (video) {
			video.addEventListener("ended", handleEnded);
		}

		// Fonction de cleanup appelée au démontage du composant
		return () => {
			if (timeoutId) clearTimeout(timeoutId);
			if (video) {
				video.removeEventListener("ended", handleEnded);
			}
		};
	}, []);

	// Deuxième useEffect : configuration de la vitesse de lecture de la vidéo
	useEffect(() => {
		if (videoRef.current) {
			videoRef.current.playbackRate = 1.4;
		}
	}, []);

	return (
		<div className="relative">
			{children}
			{showOverlay && (
				<div
					className={`fixed inset-0 z-51 transition-opacity duration-700 ${
						fadeOut ? "opacity-0 pointer-events-none" : "opacity-100"
					}`}
				>
					<div className="fixed inset-0 z-50 flex items-center justify-center bg-black transition-opacity duration-700 flex-col">
						<div className="text-center mb-6">
							<p className="text-5xl text-amber-100 font-bold my-3">
								{t("landing.welcome")}{" "}
							</p>
							<p className="text-red-600 text-5xl font-bold mb-3">LA PINCE</p>
						</div>

						<video
							ref={videoRef} // Référence pour manipulation via JavaScript
							src={videoSrc} // Source de la vidéo passée en props
							autoPlay
							muted
							playsInline // Évite le mode plein écran sur mobile
							className="w-[90%] h-auto rounded-xl 2xl:h-[80%]"
						/>
					</div>
				</div>
			)}
		</div>
	);
}
