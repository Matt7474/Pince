import { useTranslation } from "react-i18next";

export default function TermsAndConditionsOfSale() {
	const { t } = useTranslation();
	return (
		<div className="max-w-3xl mx-auto p-6 text-gray-800">
			<h1 className="text-2xl font-bold mb-4">
				{t("TermsAndConditionsOfSale.title")}
			</h1>

			<p className="mb-2">
				{t("TermsAndConditionsOfSale.intro1")} <strong>La Pince</strong>
				{t("TermsAndConditionsOfSale.intro2")}
			</p>

			<h2 className="text-xl font-semibold mt-6 mb-2">
				{t("TermsAndConditionsOfSale.section1Title")}
			</h2>
			<p className="mb-4">{t("TermsAndConditionsOfSale.section1Text")}</p>

			<h2 className="text-xl font-semibold mt-6 mb-2">
				{t("TermsAndConditionsOfSale.section2Title")}
			</h2>
			<p className="mb-4">{t("TermsAndConditionsOfSale.section2Text")}</p>

			<h2 className="text-xl font-semibold mt-6 mb-2">
				{t("TermsAndConditionsOfSale.section3Title")}
			</h2>
			<p className="mb-4">{t("TermsAndConditionsOfSale.section3Text")}</p>

			<h2 className="text-xl font-semibold mt-6 mb-2">
				{t("TermsAndConditionsOfSale.section4Title")}
			</h2>
			<p className="mb-4">{t("TermsAndConditionsOfSale.section4Text")}</p>

			<h2 className="text-xl font-semibold mt-6 mb-2">
				{t("TermsAndConditionsOfSale.section5Title")}
			</h2>
			<p className="mb-4">{t("TermsAndConditionsOfSale.section5Text")}</p>

			<h2 className="text-xl font-semibold mt-6 mb-2">
				{t("TermsAndConditionsOfSale.section6Title")}
			</h2>
			<p className="mb-4">
				{t("TermsAndConditionsOfSale.section6Text")}{" "}
				<strong>
					<a
						href="mailto:dimier.matt@email.com?subject=Contact%20depuis%20le%20site%20la%20pince&body=Bonjour Matthieu,"
						target="_blank"
						rel="noopener noreferrer"
					>
						dimier.matt@gmail.com
					</a>
				</strong>
				.
			</p>

			<h2 className="text-xl font-semibold mt-6 mb-2">
				{t("TermsAndConditionsOfSale.section7Title")}
			</h2>
			<p className="mb-4">{t("TermsAndConditionsOfSale.section7Text")}</p>

			<h2 className="text-xl font-semibold mt-6 mb-2">
				{t("TermsAndConditionsOfSale.section8Title")}
			</h2>
			<p className="mb-4">{t("TermsAndConditionsOfSale.section8Text")}</p>

			<p className="mt-8 text-sm text-gray-500">
				{t("TermsAndConditionsOfSale.lastUpdate")}
			</p>
		</div>
	);
}
