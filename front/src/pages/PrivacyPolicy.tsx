export default function PrivacyPolicy() {
	return (
		<div className="max-w-4xl mx-auto py-8 px-4">
			<h1 className="text-2xl font-bold mb-4">Politique de confidentialité</h1>

			<p className="mb-4">
				La présente politique de confidentialité a pour but d’informer les
				utilisateurs de l’application <strong>La Pince</strong> sur la manière
				dont sont collectées, utilisées et protégées leurs données personnelles.
			</p>

			<h2 className="text-xl font-semibold mb-3 mt-7 flex items-center">
				1. Responsable du traitement
			</h2>
			<p>
				Le responsable du traitement est : <br />
				<strong>Matthieu Dimier</strong> <br />📧{" "}
				<a
					href="mailto:dimier.matt.dev@gmail.com?subject=Contact%20depuis%20le%20site%20la%20pince&body=Bonjour Matthieu,"
					aria-label="Envoyer un mail"
				>
					dimier.matt.dev@gmail.com
				</a>
				<br />📍 France
			</p>

			<h2 className="text-xl font-semibold mb-3 mt-7 flex items-center">
				2. Données collectées
			</h2>
			<p>Les données pouvant être collectées incluent :</p>
			<ul className="list-disc ml-6">
				<li>Nom</li>
				<li>Prénom</li>
				<li>Adresse e-mail</li>
				<li>Emoji et couleur associée à un budget</li>
				<li>Données de budget (montants alloués, seuils d’alerte)</li>
				<li>Adresse IP (si nécessaire à la sécurité ou aux statistiques)</li>
			</ul>

			<h2 className="text-xl font-semibold mb-3 mt-7 flex items-center">
				3. Finalités de la collecte
			</h2>
			<ul className="list-disc ml-6">
				<li>Création et gestion des budgets utilisateurs</li>
				<li>Personnalisation de l’interface</li>
				<li>Support utilisateur et communication</li>
				<li>Sécurisation de l’application</li>
			</ul>

			<h2 className="text-xl font-semibold mb-3 mt-7 flex items-center">
				4. Base légale du traitement
			</h2>
			<ul className="list-disc ml-6">
				<li>Exécution du contrat (utilisation de l’application)</li>
				<li>Consentement explicite</li>
				<li>Intérêt légitime (sécurité, amélioration du service)</li>
			</ul>

			<h2 className="text-xl font-semibold mb-3 mt-7 flex items-center">
				5. Durée de conservation
			</h2>
			<p>
				Les données sont conservées pendant toute la durée d’utilisation de
				l’application. L’utilisateur peut demander la suppression de ses données
				à tout moment.
			</p>

			<h2 className="text-xl font-semibold mb-3 mt-7 flex items-center">
				6. Destinataires des données
			</h2>
			<p>
				Les données ne sont pas vendues ni cédées à des tiers. Elles peuvent
				être traitées par des prestataires techniques pour l’hébergement et la
				maintenance, dans le strict cadre du fonctionnement de l’application.
			</p>

			<h2 className="text-xl font-semibold mb-3 mt-7 flex items-center">
				7. Sécurité des données
			</h2>
			<p>
				Des mesures techniques et organisationnelles sont mises en œuvre pour
				protéger les données contre tout accès non autorisé, perte ou
				altération.
			</p>

			<h2 className="text-xl font-semibold mb-3 mt-7 flex items-center">
				8. Droits des utilisateurs
			</h2>
			<p>Conformément au RGPD, vous disposez des droits suivants :</p>
			<ul className="list-disc ml-6">
				<li>Droit d’accès</li>
				<li>Droit de rectification</li>
				<li>Droit à l’effacement</li>
				<li>Droit à la limitation du traitement</li>
				<li>Droit à la portabilité</li>
				<li>Droit d’opposition</li>
			</ul>
			<p className="mt-2">
				Pour exercer vos droits, vous pouvez nous contacter à :{" "}
				<strong>matthieu.dimier@gmail.com</strong>
			</p>

			<h2 className="text-xl font-semibold mb-3 mt-7 flex items-center">
				9. Cookies
			</h2>
			<p>
				Nous n’utilisons actuellement aucun cookie ou traceur sur l’application.
				Si cela change, une politique de gestion des cookies sera mise en place.
			</p>

			<h2 className="text-xl font-semibold mb-3 mt-7 flex items-center">
				10. Modifications
			</h2>
			<p>
				La présente politique peut être modifiée à tout moment. En cas de
				changement majeur, les utilisateurs seront informés via un message dans
				l’application.
			</p>

			<h2 className="text-xl font-semibold mb-3 mt-7 flex items-center">
				11. Contact
			</h2>
			<p>
				Pour toute question relative à vos données personnelles, vous pouvez
				écrire à :{" "}
				<strong>
					<a
						href="mailto:dimier.matt.dev@gmail.com?subject=Contact%20depuis%20le%20site%20la%20pince&body=Bonjour Matthieu,"
						aria-label="Envoyer un mail"
					>
						dimier.matt.dev@gmail.com
					</a>
				</strong>
			</p>
		</div>
	);
}
