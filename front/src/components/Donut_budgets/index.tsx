import type { ApexOptions } from "apexcharts";
import ReactApexChart from "react-apexcharts";
import type { Budget } from "../../types/Budget";
import { useTranslation } from "react-i18next";

type Props = {
	budget: Budget;
	height?: number | string;
	width?: number | string;
	size?: number | string;
	fontSizePersoSpent?: number | string;
	fontSizePersoRemaining?: number | string;
};

export default function Donut_budgets({
	budget,
	height,
	width,
	size,
	fontSizePersoSpent,
	fontSizePersoRemaining,
}: Props) {
	const { t } = useTranslation();
	const allocated_amount = budget.allocated_amount;
	const budgetSpent = Number(budget.spent_amount ?? 0);
	const remainingBudget = allocated_amount - budgetSpent;
	const series = [budgetSpent, remainingBudget];

	const options: ApexOptions = {
		chart: {
			type: "pie",
		},
		//
		// colors: [
		// 	getComputedStyle(document.documentElement)
		// 		.getPropertyValue("--color-primary")
		// 		.trim(),
		// 	budget.color,
		// ],
		colors: ["#e5e7eb", budget.color],

		//
		// dataLabels = options pour la partie "cercle" du donut (les %)
		dataLabels: {
			enabled: false,
			style: {
				fontSize: "14px",
				colors: ["#000"],
			},
		},

		//
		// responsive = options pour la gestion du format / taille du donut
		responsive: [
			{
				breakpoint: 480,
				options: {
					chart: {
						width: typeof width === "number" ? width : 200, // Changement de taille
					},
					legend: {
						position: "bottom",
					},
				},
			},
		],

		//
		// plotOptions = options pour la partie "centrale" du donut (le budget restant etc ...)
		plotOptions: {
			pie: {
				donut: {
					size: `${size}%`,
					labels: {
						show: false,
						name: {
							show: false, // On désactive ce champ, tout est géré via "value"
						},
						value: {
							show: true,
							fontSize: "14px",
							fontWeight: 600,
							color: remainingBudget < 0 ? "#ef4444" : "#000",
							offsetY: 0, // Centrage vertical
							formatter: () => {
								return `${remainingBudget.toFixed(2)} €<br/><span style="color:#8c8c8c; font-size: 12px;">${remainingBudget.toFixed(2)} € / ${allocated_amount} €</span>`;
							},
						},
						total: {
							show: false, // On désactive "total" pour éviter la redondance
						},
					},
				},
			},
		},

		//
		// legend = options de la partie basse sous le donut
		legend: {
			show: false,
			position: "bottom",
			horizontalAlign: "center",
			fontSize: "14px",

			itemMargin: {
				horizontal: 10,
				vertical: 5,
			},
		},
	};

	//
	// series = options pour le % attibué par budget au niveau de la representation du donut
	// const series = [100, { percentSpent }];

	return (
		<div
			className="relative flex justify-center items-center"
			style={{ width, height }}
		>
			<ReactApexChart
				options={options}
				series={series}
				type="donut"
				height={height}
				width={width}
			/>

			<div className="absolute text-center text-gray-500 text-[10px] mt-10">
				<div>
					<p className={`${fontSizePersoSpent}`}>
						{t("donut.spentLabel")} : {budgetSpent.toFixed(2)}{" "}
						{t("devise.symbol")}
					</p>
					<p className={`${fontSizePersoRemaining}`}>
						{t("donut.remainingLabel")} : {remainingBudget.toFixed(2)}{" "}
						{t("devise.symbol")}
					</p>
					{/* <p className={`${fontSizePersoRemaining}`}>
						Alloué {allocated_amount.toFixed(2)} €
					</p> */}
				</div>
			</div>
		</div>
	);
}
