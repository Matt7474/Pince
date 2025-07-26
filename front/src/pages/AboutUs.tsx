import { useTranslation } from "react-i18next";

export default function AboutUs() {
	const { t } = useTranslation();
	return (
		<div className="max-w-4xl mx-auto py-8 px-4">
			<h1 className="text-2xl font-bold mb-4">{t("aboutUs.title")}</h1>

			<p className="mb-4">
				<strong>La Pince</strong>
				{t("aboutUs.intro1")}
				<strong>Matthieu Dimier</strong>
				{t("aboutUs.intro2")}
			</p>

			<p className="mb-4">{t("aboutUs.goal")}</p>

			<p className="mb-4">{t("aboutUs.context")}</p>

			<p className="mb-4">
				{t("aboutUs.contact1")} <br /> {t("aboutUs.contact2")}{" "}
				<a
					href="mailto:dimier.matt.dev@gmail.com"
					className="text-indigo-600 hover:underline"
				>
					dimier.matt.dev@gmail.com
				</a>
			</p>

			<p className="mt-6 text-gray-600 italic">{t("aboutUs.thanks")} 💸</p>
		</div>
	);
}
