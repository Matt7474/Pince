import { useTranslation } from "react-i18next";

export default function PrivacyPolicy() {
	const { t } = useTranslation();
	return (
		<div className="max-w-4xl mx-auto py-8 px-4">
			<h1 className="text-2xl font-bold mb-4">{t("PrivacyPolicy.title")}</h1>

			<p className="mb-4">
				{t("PrivacyPolicy.intro_part1")} <strong>La Pince</strong>{" "}
				{t("PrivacyPolicy.intro_part2")}
			</p>

			<h2 className="text-xl font-semibold mb-3 mt-7 flex items-center">
				{t("PrivacyPolicy.section1")}
			</h2>
			<p>
				{t("PrivacyPolicy.data_controller")} <br />
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
				{t("PrivacyPolicy.section2")}
			</h2>
			<p>{t("PrivacyPolicy.data_collected")}</p>
			<ul className="list-disc ml-6">
				<li>{t("PrivacyPolicy.data_name")}</li>
				<li>{t("PrivacyPolicy.data_firstname")}</li>
				<li>{t("PrivacyPolicy.data_email")}</li>
				<li>{t("PrivacyPolicy.data_emoji")}t</li>
				<li>{t("PrivacyPolicy.data_budget")}</li>
				<li>{t("PrivacyPolicy.data_ip")}</li>
			</ul>

			<h2 className="text-xl font-semibold mb-3 mt-7 flex items-center">
				{t("PrivacyPolicy.section3")}
			</h2>
			<ul className="list-disc ml-6">
				<li>{t("PrivacyPolicy.purpose_budget")}</li>
				<li>{t("PrivacyPolicy.purpose_ui")}</li>
				<li>{t("PrivacyPolicy.purpose_support")}</li>
				<li>{t("PrivacyPolicy.purpose_security")}</li>
			</ul>

			<h2 className="text-xl font-semibold mb-3 mt-7 flex items-center">
				{t("PrivacyPolicy.section4")}
			</h2>
			<ul className="list-disc ml-6">
				<li>{t("PrivacyPolicy.legal_contract")}</li>
				<li>{t("PrivacyPolicy.legal_consent")}</li>
				<li>{t("PrivacyPolicy.legal_interest")}</li>
			</ul>

			<h2 className="text-xl font-semibold mb-3 mt-7 flex items-center">
				{t("PrivacyPolicy.section5")}
			</h2>
			<p>{t("PrivacyPolicy.retention")}</p>

			<h2 className="text-xl font-semibold mb-3 mt-7 flex items-center">
				{t("PrivacyPolicy.section6")}
			</h2>
			<p>{t("PrivacyPolicy.recipients")}</p>

			<h2 className="text-xl font-semibold mb-3 mt-7 flex items-center">
				{t("PrivacyPolicy.section7")}
			</h2>
			<p>{t("PrivacyPolicy.security")}</p>

			<h2 className="text-xl font-semibold mb-3 mt-7 flex items-center">
				{t("PrivacyPolicy.section8")}
			</h2>
			<p>{t("PrivacyPolicy.rights_info")}</p>
			<ul className="list-disc ml-6">
				<li>{t("PrivacyPolicy.right_access")}</li>
				<li>{t("PrivacyPolicy.right_rectification")}</li>
				<li>{t("PrivacyPolicy.right_deletion")}</li>
				<li>{t("PrivacyPolicy.right_limitation")}</li>
				<li>{t("PrivacyPolicy.right_portability")}</li>
				<li>{t("PrivacyPolicy.right_opposition")}</li>
			</ul>
			<p className="mt-2">
				{t("PrivacyPolicy.contact_rights")}{" "}
				<strong>matthieu.dimier@gmail.com</strong>
			</p>

			<h2 className="text-xl font-semibold mb-3 mt-7 flex items-center">
				{t("PrivacyPolicy.section9")}
			</h2>
			<p>{t("PrivacyPolicy.cookies")}</p>

			<h2 className="text-xl font-semibold mb-3 mt-7 flex items-center">
				{t("PrivacyPolicy.section10")}
			</h2>
			<p>{t("PrivacyPolicy.modifications")}</p>

			<h2 className="text-xl font-semibold mb-3 mt-7 flex items-center">
				{t("PrivacyPolicy.section11")}
			</h2>
			<p>
				{t("PrivacyPolicy.contact")}{" "}
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
