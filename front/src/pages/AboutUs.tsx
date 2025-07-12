export default function AboutUs() {
	return (
		<div className="max-w-4xl mx-auto py-8 px-4">
			<h1 className="text-2xl font-bold mb-4">Qui sommes-nous ?</h1>

			<p className="mb-4">
				<strong>La Pince</strong> est une application indépendante, conçue et
				développée avec passion par <strong>Matthieu Dimier</strong>, concepteur
				& développeur web full-stack.
			</p>

			<p className="mb-4">
				L'objectif ? Proposer un outil simple, ludique et efficace pour aider
				chacun à mieux gérer son budget au quotidien. Grâce à une interface
				épurée, des icônes personnalisables et une approche intuitive, La Pince
				permet de visualiser ses dépenses, fixer des seuils d’alerte et garder
				le contrôle sur ses finances.
			</p>

			<p className="mb-4">
				Cette application est née d’un constat : il manque souvent des solutions
				accessibles, hors des grandes plateformes, pour suivre ses dépenses de
				manière personnelle et personnalisée. La Pince se veut légère, éthique
				et respectueuse de vos données.
			</p>

			<p className="mb-4">
				Vous avez une suggestion ou une idée d’amélioration ? <br /> Vous pouvez
				écrire à :{" "}
				<a
					href="mailto:dimier.matt.dev@gmail.com"
					className="text-indigo-600 hover:underline"
				>
					dimier.matt.dev@gmail.com
				</a>
			</p>

			<p className="mt-6 text-gray-600 italic">
				Merci d’utiliser La Pince ! 💸
			</p>
		</div>
	);
}
