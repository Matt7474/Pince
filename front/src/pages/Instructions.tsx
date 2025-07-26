import { useTranslation } from "react-i18next";

export default function Instructions() {
	const { t } = useTranslation();
	return (
		<div className="max-w-4xl mx-auto py-8 px-4">
			<h2 className="text-2xl font-bold text-center flex">
				{t("instructions.title")} - La Pince{" "}
				<img src="logo-pince.svg" alt="logo-site" className="-mt-1 w-10" />
			</h2>

			<section className="mb-8">
				<h2 className="text-xl font-semibold mb-3 flex items-center">
					<span className="mr-2">👋</span> {t("instructions.welcomeStart")} La
					Pince !
				</h2>
				<p className="mb-3">
					{t("instructions.greeting")} <strong>La Pince</strong>
					{t("instructions.appDescription")}
				</p>
				<p className="mb-3">{t("instructions.introText")}</p>
				<p className="mb-3">{t("instructions.guidePurpose")}</p>
			</section>

			<section className="mb-8">
				<h2 className="text-xl font-semibold mb-3 flex items-center">
					<span className="mr-2">🔐</span>
					{t("instructions.createAccountTitle")}
				</h2>
				<p className="mb-3">{t("instructions.createAccountIntro")}</p>
				<ol className="list-decimal pl-8 mb-3">
					<li className="mb-1">{t("instructions.homepageRegister")}</li>
					<li className="mb-1">{t("instructions.fillForm")}</li>
					<li className="mb-1">{t("instructions.clickRegister")}</li>
					<li className="mb-1">{t("instructions.readyMessage")}</li>
				</ol>
				<p className="mb-3">{t("instructions.accountNote")}</p>
			</section>

			<section className="mb-8">
				<h2 className="text-xl font-semibold mb-3 flex items-center">
					<span className="mr-2">🔑</span>
					{t("instructions.loginTitle")}
				</h2>
				<p className="mb-3">{t("instructions.loginPrompt")}</p>
				<ol className="list-decimal pl-8 mb-3">
					<li className="mb-1">{t("instructions.homepageLogin")}</li>
					<li className="mb-1">{t("instructions.enterCredentials")}</li>
					<li className="mb-1">{t("instructions.clickLogin")}</li>
				</ol>
				<p className="mb-3">{t("instructions.forgotPassword")}</p>
			</section>

			<section className="mb-8">
				<h2 className="text-xl font-semibold mb-3 flex items-center">
					<span className="mr-2">📊</span>
					{t("instructions.dashboardTitle")}
				</h2>
				<p className="mb-3">{t("instructions.dashboardWelcome")}</p>
				<ul className="list-disc pl-8 mb-3">
					<li className="mb-1">
						<strong>{t("instructions.remainingBudgetLabel")}</strong> :
						{t("instructions.remainingBudgetDescription")}
					</li>
					<li className="mb-1">
						<strong>{t("instructions.budgetDistributionLabel")}</strong> :
						{t("instructions.budgetDistributionDescription")}
					</li>
					<li className="mb-1">
						<strong>{t("instructions.recentExpensesLabel")}</strong> :
						{t("instructions.recentExpensesDescription")}
					</li>
				</ul>
				<p className="mb-3">{t("instructions.dashboardAdvice")}</p>
			</section>

			<section className="mb-8">
				<h2 className="text-xl font-semibold mb-3 flex items-center">
					<span className="mr-2">💰</span>
					{t("instructions.manageBudgetsTitle")}
				</h2>

				<div className="mb-4">
					<h3 className="font-semibold mb-2">
						{t("instructions.viewBudgets")}
					</h3>
					<ol className="list-decimal pl-8 mb-3">
						<li className="mb-1 flex gap-1">
							{t("instructions.clickLogo")}{" "}
							<img
								src="/budget.svg"
								alt="logo budget"
								className="bg-gray-700 rounded p-0.5 w-5 -mt-1"
							/>{" "}
							{t("instructions.bottomMenu")}
						</li>
						<li className="mb-1">{t("instructions.budgetsCirclesDesc")}</li>
						<li className="mb-1">{t("instructions.circleAmountDesc")}</li>
						<li className="mb-1 text-red-500">
							<span className="font-bold">{t("instructions.tip")}</span> :
							{t("instructions.reorderBudgets")}
						</li>
					</ol>
				</div>

				<div className="mb-4">
					<h3 className="font-semibold mb-2">
						{t("instructions.createBudgetTitle")}
					</h3>
					<p className="mb-2">{t("instructions.createBudgetStep1")} :</p>
					<ol className="list-decimal pl-8 mb-3">
						<li className="mb-1">{t("instructions.createBudgetStep2")}</li>
						<li className="mb-1">{t("instructions.createBudgetStep3")}</li>
						<li className="mb-1">{t("instructions.createBudgetStep4")}</li>
						<li className="mb-1">{t("instructions.createBudgetStep5")}</li>
						<li className="mb-1">{t("instructions.createBudgetStep6")}</li>
						<li className="mb-1">{t("instructions.createBudgetStep7")}</li>
						<li className="mb-1">{t("instructions.createBudgetStep8")}</li>
					</ol>
					<p className="mb-2">{t("instructions.createBudgetStep9")}</p>
				</div>

				<div className="mb-4">
					<h3 className="font-semibold mb-2">
						{t("instructions.editDeleteBudgetTitle")}
					</h3>
					<p className="mb-2">{t("instructions.editBudgetStep1")}</p>
					<ol className="list-decimal pl-8 mb-3">
						<li className="mb-1">{t("instructions.editBudgetStep2")}</li>
						<li className="mb-1">{t("instructions.editBudgetStep3")}</li>
						<li className="mb-1">{t("instructions.editBudgetStep4")}</li>
						<li className="mb-1">{t("instructions.editBudgetStep5")}</li>
					</ol>

					<p className="mb-2">{t("instructions.deleteBudgetStep1")}</p>
					<ol className="list-decimal pl-8 mb-3">
						<li className="mb-1">{t("instructions.deleteBudgetStep2")}</li>
						<li className="mb-1">{t("instructions.deleteBudgetStep3")}</li>
						<li className="mb-1">{t("instructions.deleteBudgetStep4")}</li>
					</ol>
					<p className="mb-2 text-red-500 font-medium">
						{t("instructions.deleteBudgetWarning")}
					</p>
				</div>
			</section>

			<section className="mb-8">
				<h2 className="text-xl font-semibold mb-3 flex items-center">
					<span className="mr-2">📝</span>{" "}
					{t("instructions.manageExpensesTitle")}
				</h2>

				<div className="mb-4">
					<h3 className="font-semibold mb-2">
						{t("instructions.addExpenseTitle")}
					</h3>
					<ol className="list-decimal pl-8 mb-3">
						<li className="mb-1">{t("instructions.addExpenseStep1")}</li>
						<li className="mb-1">{t("instructions.addExpenseStep2")}</li>
						<li className="mb-1">{t("instructions.addExpenseStep3")}</li>
						<li className="mb-1">{t("instructions.addExpenseStep4")}</li>
						<li className="mb-1">{t("instructions.addExpenseStep5")}</li>
					</ol>
					<p className="mb-2">{t("instructions.addExpenseNote")}</p>
				</div>

				<div className="mb-4">
					<h3 className="font-semibold mb-2">
						{t("instructions.editExpenseTitle")}
					</h3>
					<p className="mb-2">{t("instructions.editExpenseStep1")}</p>
					<ol className="list-decimal pl-8 mb-3">
						<li className="mb-1">{t("instructions.editExpenseStep2")}</li>
						<li className="mb-1">{t("instructions.editExpenseStep3")}</li>
						<li className="mb-1">{t("instructions.editExpenseStep4")}</li>
						<li className="mb-1">{t("instructions.editExpenseStep5")}</li>
						<li className="mb-1">{t("instructions.editExpenseStep6")}</li>
					</ol>

					<p className="mb-2">{t("instructions.deleteExpenseTitle")}</p>
					<ol className="list-decimal pl-8 mb-3">
						<li className="mb-1">{t("instructions.deleteExpenseStep1")}</li>
						<li className="mb-1">{t("instructions.deleteExpenseStep2")}</li>
						<li className="mb-1">{t("instructions.deleteExpenseStep3")}</li>
						<li className="mb-1">{t("instructions.deleteExpenseStep4")}</li>
						<li className="mb-1">{t("instructions.deleteExpenseStep5")}</li>
					</ol>
					<p className="mb-2">{t("instructions.deleteExpenseNote")}</p>
				</div>
			</section>

			<section className="mb-8">
				<h2 className="text-xl font-semibold mb-3 flex items-center">
					<span className="mr-2">💡</span> {t("instructions.tipsAndAdvice")}
				</h2>
				<ul className="list-disc pl-8 mb-3">
					<li className="mb-1">
						<strong>{t("instructions.adviceRegular")}</strong>{" "}
						{t("instructions.adviceRegularDesc")}
					</li>
					<li className="mb-1">
						<strong>{t("instructions.adviceRealistic")}</strong>{" "}
						{t("instructions.adviceRealisticDesc")}
					</li>
					<li className="mb-1">
						<strong>{t("instructions.adviceColors")}</strong>{" "}
						{t("instructions.adviceColorsDesc")}
					</li>
					<li className="mb-1">
						<strong>{t("instructions.adviceDashboard")}</strong>{" "}
						{t("instructions.adviceDashboardDesc")}
					</li>
				</ul>
			</section>

			<section className="mb-8">
				<h2 className="text-xl font-semibold mb-3 flex items-center">
					<span className="mr-2">🆘</span> {t("instructions.needHelp")}
				</h2>
				<p className="mb-3">
					{t("instructions.contactUs")}
					<a
						href="mailto:dimier.matt.dev@gmail.com"
						className="text-blue-600 hover:underline mx-1 underline"
					>
						lapince
					</a>
				</p>
				<p className="mb-3">{t("instructions.closing")}</p>
				<p className="font-semibold mt-4">
					🦀 {t("instructions.teamSignature")}
				</p>
			</section>

			<div className="text-center text-sm mt-8">
				{t("instructions.lastUpdate")}
			</div>
		</div>
	);
}
