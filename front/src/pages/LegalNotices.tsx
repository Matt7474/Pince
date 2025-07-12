export default function LegalNotices() {
	return (
		<div className="max-w-3xl mx-auto p-6 text-gray-800">
			<h1 className="text-2xl font-bold mb-4">Mentions légales</h1>

			<p className="mb-2">
				Conformément aux dispositions des articles 6-III et 19 de la Loi
				n°2004-575 du 21 juin 2004 pour la confiance dans l’économie numérique,
				dite LCEN, il est porté à la connaissance des utilisateurs et visiteurs
				du site <strong>La Pince</strong> les présentes mentions légales.
			</p>

			<h2 className="text-xl font-semibold mt-6 mb-2">
				1. Informations légales
			</h2>
			<ul className="list-disc ml-6 mb-4">
				<li>
					<strong>Nom de l’application :</strong> La Pince
				</li>
				<li>
					<strong>Éditeur :</strong> Matthieu Dimier
				</li>
				<li>
					<strong>Statut :</strong> Particulier – Site personnel sans but
					commercial
				</li>
				<li>
					<strong>Adresse :</strong> Adresse communiquée sur demande aux
					autorités compétentes
				</li>
				<li>
					<strong>Email :</strong> dimier.matt.dev@gmail.com
				</li>
				<li>
					<strong>Responsable de publication :</strong> Matthieu Dimier
				</li>
			</ul>

			<h2 className="text-xl font-semibold mt-6 mb-2">2. Hébergement</h2>
			<p className="mb-2">Le site et l’application sont hébergés par :</p>
			<ul className="list-disc ml-6 mb-4">
				<li>
					<strong>Hébergeur :</strong> o2switch
				</li>
				<li>
					<strong>Adresse :</strong> Chemin des Pardiaux, 63000
					Clermont-Ferrand, France
				</li>
				<li>
					<strong>Site :</strong>{" "}
					<a
						href="https://www.o2switch.fr"
						className="text-blue-600 underline"
						target="_blank"
						rel="noopener noreferrer"
					>
						www.o2switch.fr
					</a>
				</li>
			</ul>

			<h2 className="text-xl font-semibold mt-6 mb-2">
				3. Conditions d’utilisation
			</h2>
			<p className="mb-4">
				L'utilisation de l’application <strong>La Pince</strong> implique
				l’acceptation pleine et entière des conditions générales d’utilisation
				accessibles depuis l’application. Ces conditions sont susceptibles
				d’être modifiées ou complétées à tout moment.
			</p>

			<h2 className="text-xl font-semibold mt-6 mb-2">
				4. Données personnelles
			</h2>
			<p className="mb-4">
				Les informations recueillies via l’application font l’objet d’un
				traitement informatique destiné uniquement à l’amélioration du service.
				Conformément à la loi "Informatique et Libertés" et au Règlement Général
				sur la Protection des Données (RGPD), vous disposez d’un droit d’accès,
				de rectification et de suppression des données vous concernant. Pour
				exercer ce droit, contactez-nous à : contact@lapince.app.
			</p>

			<h2 className="text-xl font-semibold mt-6 mb-2">
				5. Propriété intellectuelle
			</h2>
			<p className="mb-4">
				Toute reproduction, représentation, modification, publication,
				adaptation de tout ou partie de l’application, quel que soit le moyen ou
				le procédé utilisé, est interdite sans l'autorisation écrite préalable
				de l’éditeur.
			</p>

			<h2 className="text-xl font-semibold mt-6 mb-2">
				6. Limitation de responsabilité
			</h2>
			<p className="mb-4">
				L’éditeur ne pourra être tenu responsable des dommages directs ou
				indirects causés au matériel de l’utilisateur, lors de l’accès à
				l’application, ni de l’apparition de bugs ou d’incompatibilités.
			</p>

			<p className="mt-8 text-sm text-gray-500">
				Dernière mise à jour : juillet 2025
			</p>
		</div>
	);
}
