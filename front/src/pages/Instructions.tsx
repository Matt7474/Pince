export default function Instructions() {
	return (
		<div className="max-w-4xl mx-auto py-8 px-4">
			<h2 className="text-2xl font-bold text-center flex">
				Mode d'emploi - La Pince{" "}
				<img src="logo-pince.svg" alt="logo-site" className="-mt-1 w-10" />
			</h2>

			<section className="mb-8">
				<h2 className="text-xl font-semibold mb-3 flex items-center">
					<span className="mr-2">👋</span> Bienvenue dans La Pince !
				</h2>
				<p className="mb-3">
					Salut toi ! Bienvenue dans <strong>La Pince</strong>, l'app qui serre
					ton budget... sans te faire mal au porte-monnaie !
				</p>
				<p className="mb-3">
					Tu connais ce moment où tu regardes ton compte en banque et tu te
					demandes : "Mais j'ai acheté QUOI pour que ça descende aussi vite ?"
					Nous aussi ! C'est pour ça qu'on a créé La Pince : une application
					simple, drôle (un peu comme nous) et redoutablement efficace pour
					t'aider à reprendre le contrôle sur ton argent.
				</p>
				<p className="mb-3">
					Dans ce guide, on va te montrer comment utiliser toutes les
					fonctionnalités de La Pince pour devenir un vrai maître de tes
					finances. Et tout ça sans jargon compliqué ni leçons de morale !
				</p>
			</section>

			<section className="mb-8">
				<h2 className="text-xl font-semibold mb-3 flex items-center">
					<span className="mr-2">🔐</span> Créer ton compte
				</h2>
				<p className="mb-3">
					Avant de commencer à maîtriser ton budget comme un pro, il te faut un
					compte :
				</p>
				<ol className="list-decimal pl-8 mb-3">
					<li className="mb-1">
						Sur la page d'accueil, clique sur "S'enregistrer"
					</li>
					<li className="mb-1">
						Remplis le formulaire avec tes infos (nom, prénom, email, mot de
						passe)
					</li>
					<li className="mb-1">Clique sur "S'enregistrer"</li>
					<li className="mb-1">
						Tadaaaaa ! Te voilà prêt à pincer tes finances !
					</li>
				</ol>
				<p className="mb-3">
					N'oublie pas : ton email servira d'identifiant et ton mot de passe
					doit être assez costaud (comme les pinces de notre crabe mascotte).
				</p>
			</section>

			<section className="mb-8">
				<h2 className="text-xl font-semibold mb-3 flex items-center">
					<span className="mr-2">🔑</span> Se connecter
				</h2>
				<p className="mb-3">
					Tu as déjà un compte ? Super ! Pour te connecter :
				</p>
				<ol className="list-decimal pl-8 mb-3">
					<li className="mb-1">
						Sur la page d'accueil, clique sur "Se connecter"
					</li>
					<li className="mb-1">Entre ton email et ton mot de passe</li>
					<li className="mb-1">Clique sur "Se connecter"</li>
				</ol>
				<p className="mb-3">
					Si tu as oublié ton mot de passe (ça arrive même aux meilleurs),
					clique sur "Pas de compte ?" en bas du formulaire et suis les
					instructions pour le réinitialiser.
				</p>
			</section>

			<section className="mb-8">
				<h2 className="text-xl font-semibold mb-3 flex items-center">
					<span className="mr-2">📊</span> Le tableau de bord
				</h2>
				<p className="mb-3">
					Bienvenue dans ton QG financier ! Le tableau de bord te donne une vue
					d'ensemble de ta situation en un coup d'œil :
				</p>
				<ul className="list-disc pl-8 mb-3">
					<li className="mb-1">
						<strong>Budget restant</strong> : Le grand chiffre au centre avec le
						donut coloré, c'est ce qu'il te reste à dépenser. Plus montant est
						élevé, mieux c'est !
					</li>
					<li className="mb-1">
						<strong>Répartition des budgets</strong> : Les différentes couleurs
						du donut représentent tes différentes catégories de budget
						(alimentation, transport, loisirs, etc.)
					</li>
					<li className="mb-1">
						<strong>Dernières dépenses</strong> : En bas, tu trouveras la liste
						de tes dernières dépenses avec leur montant et leur catégorie. Tu
						peux filtrer tes dépenses par catégories en clickant sur les icones
						au dessus de la liste.
					</li>
				</ul>
				<p className="mb-3">
					Le tableau de bord est ton ami, jette-lui un œil régulièrement pour
					garder le cap !
				</p>
			</section>

			<section className="mb-8">
				<h2 className="text-xl font-semibold mb-3 flex items-center">
					<span className="mr-2">💰</span> Gérer tes budgets
				</h2>

				<div className="mb-4">
					<h3 className="font-semibold mb-2">Voir tous tes budgets</h3>
					<ol className="list-decimal pl-8 mb-3">
						<li className="mb-1 flex gap-1">
							Clique sur le logo{" "}
							<img
								src="/budget.svg"
								alt="logo budget"
								className="bg-gray-700 rounded p-0.5 w-5 -mt-1"
							/>{" "}
							dans le menu du bas.
						</li>
						<li className="mb-1">
							Tu verras tous tes budgets représentés par des cercles colorés
						</li>
						<li className="mb-1">
							Chaque cercle indique le montant dépensé par rapport au montant
							total alloué
						</li>
						<li className="mb-1 text-red-500">
							<span className="font-bold">Astuce !</span> : Tu peux reorganiser
							l'ordre d'affichage de tes budgets en maintenant un budget et en
							le deplacant ou tu veux
						</li>
					</ol>
				</div>

				<div className="mb-4">
					<h3 className="font-semibold mb-2">Créer un nouveau budget</h3>
					<p className="mb-2">Pour créer un nouveau budget :</p>
					<ol className="list-decimal pl-8 mb-3">
						<li className="mb-1">
							Sur la page "Mes budgets", clique sur "Ajouter un budget"
						</li>
						<li className="mb-1">
							Donne un nom à ton budget (ex : "Alimentation", "Transport",
							"Sorties").
						</li>
						<li className="mb-1">
							Choisis une couleur pour l'identifier facilement.
						</li>
						<li className="mb-1">
							Définis le montant que tu veux allouer à ce budget.
						</li>
						<li className="mb-1">
							Définis un montant d'alerte que tu veux pour ce budget.
						</li>
						<li className="mb-1">
							Choisis un emoji parmis plus de 3782 (oui c'est tres précis) pour
							l'identifier facilement.
						</li>
						<li className="mb-1">Clique sur "Valider"</li>
					</ol>
					<p className="mb-2">
						Et voilà, ton nouveau budget est créé ! Tu peux maintenant commencer
						à suivre tes dépenses dans cette catégorie.
					</p>
				</div>

				<div className="mb-4">
					<h3 className="font-semibold mb-2">
						Modifier ou supprimer un budget
					</h3>
					<p className="mb-2">Pour modifier un budget existant :</p>
					<ol className="list-decimal pl-8 mb-3">
						<li className="mb-1">
							Click sur le logo settings en bas a droite d'un budget
						</li>
						<li className="mb-1">
							Clique sur l'icône en forme de crayon (en haut à droite)
						</li>
						<li className="mb-1">Modifie les informations que tu souhaites</li>
						<li className="mb-1">Clique sur "Valider"</li>
					</ol>

					<p className="mb-2">Pour supprimer un budget :</p>
					<ol className="list-decimal pl-8 mb-3">
						<li className="mb-1">
							Click sur le logo settings en bas a droite d'un budget.
						</li>
						<li className="mb-1">Clique sur la poubelle en bas a droite.</li>
						<li className="mb-1">Une confirmation, et le tour est joué !</li>
					</ol>
					<p className="mb-2 text-red-500 font-medium">
						Attention : la suppression d'un budget supprimera aussi toutes les
						dépenses associées !
					</p>
				</div>
			</section>

			<section className="mb-8">
				<h2 className="text-xl font-semibold mb-3 flex items-center">
					<span className="mr-2">📝</span> Suivre tes dépenses
				</h2>

				<div className="mb-4">
					<h3 className="font-semibold mb-2">Ajouter une dépense</h3>
					<ol className="list-decimal pl-8 mb-3">
						<li className="mb-1">
							Depuis la page de détail d'un budget, clique sur "Ajouter une
							dépense"
						</li>
						<li className="mb-1">Entre le montant de ta dépense</li>
						<li className="mb-1">
							Ajoute une description (ex : "Courses au supermarché du coin")
						</li>
						<li className="mb-1">Sélectionne la date de la dépense</li>
						<li className="mb-1">Clique sur "Valider"</li>
					</ol>
					<p className="mb-2">
						La dépense sera automatiquement déduite du budget sélectionné.
						Facile, non ?
					</p>
				</div>

				<div className="mb-4">
					<h3 className="font-semibold mb-2">Gérer tes dépenses existantes</h3>
					<p className="mb-2">Pour modifier une dépense :</p>
					<ol className="list-decimal pl-8 mb-3">
						<li className="mb-1">
							Dans la liste des dépenses, trouve celle que tu veux modifier
						</li>
						<li className="mb-1">Clique dessus pour afficher les détails</li>
						<li className="mb-1">Clique sur l'icône en forme de crayon</li>
						<li className="mb-1">Modifie les informations</li>
						<li className="mb-1">Clique sur "Valider"</li>
					</ol>

					<p className="mb-2">Pour supprimer une dépense :</p>
					<ol className="list-decimal pl-8 mb-3">
						<li className="mb-1">Trouve la dépense dans la liste</li>
						<li className="mb-1">Clique dessus pour afficher les détails</li>
						<li className="mb-1">Clique sur les trois petits points</li>
						<li className="mb-1">Sélectionne "Supprimer"</li>
						<li className="mb-1">Confirme la suppression</li>
					</ol>
					<p className="mb-2">
						Le montant sera automatiquement réajouté à ton budget disponible.
					</p>
				</div>
			</section>

			<section className="mb-8">
				<h2 className="text-xl font-semibold mb-3 flex items-center">
					<span className="mr-2">💡</span> Astuces et conseils
				</h2>
				<ul className="list-disc pl-8 mb-3">
					<li className="mb-1">
						<strong>Sois régulier</strong> : Entre tes dépenses au fur et à
						mesure pour avoir une vision claire de ta situation
					</li>
					<li className="mb-1">
						<strong>Sois réaliste</strong> : Fixe des budgets que tu peux tenir
						(surtout au début)
					</li>
					<li className="mb-1">
						<strong>Utilise les couleurs</strong> : Personnalise les couleurs de
						tes budgets pour les repérer en un clin d'œil
					</li>
					<li className="mb-1">
						<strong>Vérifie ton tableau de bord</strong> : Jette un œil régulier
						à ton tableau de bord pour rester informé
					</li>
				</ul>
			</section>

			<section className="mb-8">
				<h2 className="text-xl font-semibold mb-3 flex items-center">
					<span className="mr-2">🆘</span> Besoin d'aide ?
				</h2>
				<p className="mb-3">
					Si tu as la moindre question ou si tu rencontres un problème, n'hésite
					pas à nous contacter à
					<a
						href="mailto:dimier.matt.dev@gmail.com"
						className="text-blue-600 hover:underline mx-1 underline"
					>
						lapince
					</a>
				</p>
				<p className="mb-3">
					La Pince est là pour t'aider à gérer ton argent sans prise de tête.
					Alors détends-toi, suis ton budget et profite de la vie !
				</p>
				<p className="font-semibold mt-4">🦀 L'équipe de La Pince</p>
			</section>

			<div className="text-center text-sm mt-8">
				Dernière mise à jour : Juillet 2025
			</div>
		</div>
	);
}
