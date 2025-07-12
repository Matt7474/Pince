import { Link } from "react-router-dom";

export default function NotFound() {
	return (
		<>
			<div className="flex flex-col justify-center items-center min-h-[calc(100vh-10rem)] text-gray-700 text-center">
				<h1 className="text-8xl font-semibold mt-5">404</h1>
				<img src="/404-crab.png" alt="page 404" className="-my-25 w-80" />
				<h2 className="text-5xl font-bold -mt-6">LA PINCE</h2>
				<p className="text-3xl font-semibold my-4">Page non trouvée</p>
				<p className="text-xl font-semibold text-center">
					Désolé, la page que vous cherchez est introuvable
				</p>
				<Link
					to="/homepage"
					className="mt-6 px-4 py-2 bg-gray-300 border-2 border-gray-700 text-gray-700 rounded"
				>
					Retour à l’accueil
				</Link>
			</div>
		</>
	);
}
