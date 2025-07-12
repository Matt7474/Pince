import { useEffect, useRef, useState } from "react";

type Props = {
	children: React.ReactNode;
	videoSrc: string;
};

export default function WithLoadingScreen({ children, videoSrc }: Props) {
	const [showOverlay, setShowOverlay] = useState(true);
	const [fadeOut, setFadeOut] = useState(false);
	const videoRef = useRef<HTMLVideoElement>(null);

	useEffect(() => {
		const video = videoRef.current;

		const endTransition = () => {
			setFadeOut(true);
			setTimeout(() => setShowOverlay(false), 700); // temps pour le fade-out
		};

		let timeoutId: ReturnType<typeof setTimeout> | null = null;

		// On force la fin de l'overlay après 4s en cas de reseau insufisant
		timeoutId = setTimeout(() => {
			endTransition();
		}, 10);
		//4000

		// Si la vidéo se termine avant les 4s, on annule le timeout
		const handleEnded = () => {
			if (timeoutId) clearTimeout(timeoutId);
			endTransition();
		};

		if (video) {
			video.addEventListener("ended", handleEnded);
		}

		return () => {
			if (timeoutId) clearTimeout(timeoutId);
			if (video) {
				video.removeEventListener("ended", handleEnded);
			}
		};
	}, []);

	useEffect(() => {
		if (videoRef.current) {
			videoRef.current.playbackRate = 1.3;
		}
	}, []);

	return (
		<div className="relative">
			{children}

			{showOverlay && (
				<div
					className={`fixed inset-0 z-50 transition-opacity duration-700 ${
						fadeOut ? "opacity-0 pointer-events-none" : "opacity-100"
					}`}
				>
					<div className="fixed inset-0 z-50 flex items-center justify-center bg-black transition-opacity duration-700 flex-col">
						<div className="text-center mb-6">
							<p className="text-5xl text-amber-100 font-bold mb-3">
								BIENVENU SUR{" "}
								<span className="text-red-600 text-5xl font-bold mb-3">
									LA PINCE
								</span>
							</p>
						</div>
						<video
							ref={videoRef}
							src={videoSrc}
							autoPlay
							muted
							playsInline
							className="w-[90%] h-auto rounded-xl 2xl:h-[90%]"
						/>
					</div>
				</div>
			)}
		</div>
	);
}
