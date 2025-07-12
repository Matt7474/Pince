import type { ApexOptions } from "apexcharts";
import { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { Link, useNavigate } from "react-router-dom";
import type { Budget } from "../../types/Budget";

type DonutHomepageProps = {
	budgets: Budget[];
};

export default function Donut_homepage({ budgets }: DonutHomepageProps) {
	const navigate = useNavigate();

	// State séparé pour éviter les recalculs constants
	const [chartOptions, setChartOptions] = useState<ApexOptions | null>(null);
	const [chartSeries, setChartSeries] = useState<number[] | null>(null);
	const [, setChartLabels] = useState<string[]>([]);
	const [, setChartColors] = useState<string[]>([]);
	const [, setChartBudgetIds] = useState<number[]>([]);

	useEffect(() => {
		if (!budgets || budgets.length === 0) return;

		const filteredBudgets = budgets.filter(
			(budget) => budget.allocated_amount > 0,
		);

		const labels = filteredBudgets.map((budget) => budget.name);
		const colors = filteredBudgets.map((budget) => budget.color);
		const ids = filteredBudgets.map((budget) => budget.id);
		const series = filteredBudgets.map(
			(budget) => budget.allocated_amount - budget.spent_amount,
		);

		const options: ApexOptions = {
			chart: {
				type: "donut",
				events: {
					dataPointSelection: (_e, _ctx, config) => {
						const selectedIndex = config.dataPointIndex;
						const selectedId = ids[selectedIndex];
						if (selectedId) {
							navigate(`/budgets/${selectedId}`, {
								state: {
									budget: filteredBudgets[selectedIndex],
								},
							});
						}
					},
				},
			},
			labels,
			colors,
			dataLabels: {
				enabled: true,
				formatter: (_val, opts) => {
					const value = series[opts.seriesIndex];
					return `${Math.round(value * 100) / 100} €`;
				},
				style: {
					colors: ["#000"],
					fontSize: "14px",
				},
			},
			plotOptions: {
				pie: {
					donut: {
						size: "80%",
						labels: {
							show: true,
							total: {
								show: true,
								label: "Budget restant",
								color: "#000",
								fontSize: "18px",
								fontWeight: "bold",
								formatter: () =>
									`${series.reduce((a, b) => a + b, 0).toFixed(2)} €`,
							},
						},
					},
				},
			},
			legend: {
				show: true,
				position: "bottom",
				fontSize: "14px",
				horizontalAlign: "center",
			},
			responsive: [
				{
					breakpoint: 480,
					options: {
						chart: {
							width: 300,
						},
						legend: {
							position: "bottom",
						},
					},
				},
			],
		};

		// 🔐 MAJ des states
		setChartLabels(labels);
		setChartColors(colors);
		setChartBudgetIds(ids);
		setChartSeries(series);
		setChartOptions(options);
	}, [budgets]);

	// 💡 Affichage alternatif si aucun budget
	if (!budgets || budgets.length === 0) {
		return (
			<div className="py-3 flex flex-col justify-center">
				<p className="text-center mb-3">Aucun budget à afficher</p>
				<Link
					className="text-center underline font-semibold text-[var(--color-secondary)]"
					to={"/budgets"}
				>
					Créer mon premier budget
				</Link>
			</div>
		);
	}

	// 💡 Ne pas afficher tant que les données ne sont pas prêtes
	if (!chartOptions || !chartSeries) return null;

	return (
		<div className="relative pt-8 pb-8 flex items-center justify-center">
			<ReactApexChart
				key={JSON.stringify(chartSeries)} // 🔑 force un re-render propre
				options={chartOptions}
				series={chartSeries}
				type="donut"
				height={350}
			/>
			<div
				className="bg-white rounded-full absolute left-1/2 top-1/2 
				transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-[-1]"
				style={{ height: "200px", width: "200px" }}
			/>
		</div>
	);
}
