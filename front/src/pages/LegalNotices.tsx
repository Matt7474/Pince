import { useTranslation } from "react-i18next";

export default function LegalNotices() {
	const { t } = useTranslation();
	return (
		<div className="max-w-3xl mx-auto p-6 text-gray-800">
			<h1 className="text-2xl font-bold mb-4">{t("legalNotices.title")}</h1>

			<p className="mb-2">
				{t("legalNotices.intro1")} <strong>La Pince</strong>{" "}
				{t("legalNotices.intro2")}
			</p>

			<h2 className="text-xl font-semibold mt-6 mb-2">
				{t("legalNotices.section1")}
			</h2>
			<ul className="list-disc ml-6 mb-4">
				<li>
					<strong>{t("legalNotices.appName")}</strong> La Pince
				</li>
				<li>
					<strong>{t("legalNotices.editor")}</strong> Matthieu Dimier
				</li>
				<li>
					<strong>{t("legalNotices.status")}</strong>{" "}
					{t("legalNotices.personalSite")}
				</li>
				<li>
					<strong>{t("legalNotices.address")}</strong>{" "}
					{t("legalNotices.confidential")}
				</li>
				<li>
					<strong>{t("legalNotices.email")}</strong> dimier.matt.dev@gmail.com
				</li>
				<li>
					<strong>{t("legalNotices.publisher")}</strong> Matthieu Dimier
				</li>
			</ul>

			<h2 className="text-xl font-semibold mt-6 mb-2">
				{t("legalNotices.section2")}
			</h2>
			<p className="mb-2">{t("legalNotices.hostedBy")}</p>
			<ul className="list-disc ml-6 mb-4">
				<li>
					<strong>{t("legalNotices.host")}</strong> o2switch
				</li>
				<li>
					<strong>{t("legalNotices.hostAddress")}</strong> Chemin des Pardiaux,
					63000 Clermont-Ferrand, France
				</li>
				<li>
					<strong>{t("legalNotices.hostWebsite")}</strong>{" "}
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
				{t("legalNotices.section3")}
			</h2>
			<p className="mb-4">
				{t("legalNotices.termsStart")} <strong>La Pince</strong>{" "}
				{t("legalNotices.termsEnd")}
			</p>

			<h2 className="text-xl font-semibold mt-6 mb-2">
				{t("legalNotices.section4")}
			</h2>
			<p className="mb-4">{t("legalNotices.gdpr")}</p>

			<h2 className="text-xl font-semibold mt-6 mb-2">
				{t("legalNotices.section5")}
			</h2>
			<p className="mb-4">{t("legalNotices.copyright")}</p>

			<h2 className="text-xl font-semibold mt-6 mb-2">
				{t("legalNotices.section6")}
			</h2>
			<p className="mb-4">{t("legalNotices.liability")}</p>

			<p className="mt-8 text-sm text-gray-500">
				{t("legalNotices.updatedAt")}
			</p>
		</div>
	);
}
