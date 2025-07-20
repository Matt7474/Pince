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

	const [chartOptions, setChartOptions] = useState<ApexOptions | null>(null);
	const [chartSeries, setChartSeries] = useState<number[] | null>(null);
	const [labels, setLabels] = useState<string[]>([]);
	const [colors, setColors] = useState<string[]>([]);
	const [budgetId, setBudgetIds] = useState<number[]>([]);

	useEffect(() => {
		if (!budgets || budgets.length === 0) return;

		const filteredBudgets = budgets.filter(
			(budget) => budget.allocated_amount > 0,
		);

		const _labels = filteredBudgets.map((budget) => budget.name);
		const _colors = filteredBudgets.map((budget) => budget.color);
		const _ids = filteredBudgets.map((budget) => budget.id);
		const _series = filteredBudgets.map(
			(budget) => budget.allocated_amount - budget.spent_amount,
		);

		const options: ApexOptions = {
			chart: {
				type: "donut",
				width: 350,
				height: 350,
				toolbar: { show: false },
				animations: { enabled: false },
				events: {
					dataPointSelection: (_e, _ctx, config) => {
						const selectedIndex = config.dataPointIndex;
						const selectedId = _ids[selectedIndex];
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

			labels: _labels,
			colors: _colors,
			dataLabels: {
				enabled: true,
				formatter: (_val, opts) => {
					const value = _series[opts.seriesIndex];
					return `${Math.round(value * 100) / 100} €`;
				},
				style: {
					colors: ["#000"],
					fontSize: "14px",
					fontWeight: 900,
				},
				dropShadow: {
					enabled: true,
					top: 0,
					left: 0,
					blur: 2,
					color: "#fff",
					opacity: 2,
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
									`${_series.reduce((a, b) => a + b, 0).toFixed(2)} €`,
							},
						},
					},
				},
			},
			legend: {
				show: false,
			},
			responsive: [
				{
					breakpoint: 480,
					options: {
						chart: {
							width: 300,
							height: 300,
						},
					},
				},
			],
		};

		setLabels(_labels);
		setColors(_colors);
		setBudgetIds(_ids);
		setChartSeries(_series);
		setChartOptions(options);
	}, [budgets, navigate]);

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

	if (!chartOptions || !chartSeries) return null;

	// Calcul du total restant pour affichage en titre (optionnel)
	// const totalRestant = chartSeries.reduce((a, b) => a + b, 0).toFixed(2);

	return (
		<div className="flex flex-col">
    <div className="flex justify-center min-w-full">
        <div className="relative">
            <ReactApexChart
                options={chartOptions}
                series={chartSeries}
                type="donut"
                height={350}
                width={350}
            />
            <div
                className="bg-white rounded-full pointer-events-none absolute left-1/2 top-1/2
                transform -translate-x-1/2 -translate-y-1/2 -z-[1]"
                style={{ width: "65%", height: "65%" }}
            ></div>
        </div>
    </div>

			<div className="my-2 px-4 flex flex-wrap justify-center gap-2 ">
				{labels.map((label, index) => (
					<button
						type="button"
						key={budgetId[index]}
						className="flex items-center space-x-2  cursor-pointer "
						onClick={() =>
							navigate(`/budgets/${budgetId[index]}`, {
								state: {
									budget: {
										name: label,
										color: colors[index],
										id: budgetId[index],
										allocated_amount: 0,
										spent_amount: 0,
									},
								},
							})
						}
					>
						<span
							className="block w-4 h-4 rounded-xl"
							style={{ backgroundColor: colors[index] }}
						/>
						<span className="text-sm font-medium">{label}</span>
					</button>
				))}
			</div>
		</div>
	);
}
