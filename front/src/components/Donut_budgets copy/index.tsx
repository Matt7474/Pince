import type { ApexOptions } from "apexcharts";
import ReactApexChart from "react-apexcharts";
import type { Budget } from "../../types/Budget";

type Props = {
	budget: Budget;
	height?: number | string;
	width?: number | string;
};

export default function Donut_budgets({ budget, height, width }: Props) {
	const remainingBudget = 200;
	const allocated_amount = 400;

	const options: ApexOptions = {
		chart: {
			type: "pie",
			width: width, // la taille en px, passée en props
			height: height, // pareil
		},
		//
		colors: [budget.color],

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
						width: 200,
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
					size: "80%",
					labels: {
						show: true,
						name: {
							show: true,
							fontSize: "18px",
							fontWeight: 600,
							color: "#000",
							offsetY: -10,
							formatter: () => `${remainingBudget.toFixed(2)} €`,
						},
						value: {
							show: true,
							fontSize: "14px",
							color: remainingBudget < 0 ? "#ef4444" : "#8c8c8c",
							offsetY: 30,
							formatter: () =>
								`${remainingBudget.toFixed(2)} € / ${allocated_amount} €`,
						},
						total: {
							show: true,
							label: "",
							fontSize: "14px",
							fontWeight: "bold",
							color: "#666",
							formatter: () =>
								`${remainingBudget.toFixed(2)} € / ${allocated_amount} €`,
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
	// const series = [100, 0];

	return (
		<div className="flex justify-center">
			<div style={{ width, height }}>
				<ReactApexChart
					options={options}
					series={[100, 0]}
					type="donut"
					height={height}
					width={width}
				/>
			</div>
		</div>
	);
}
