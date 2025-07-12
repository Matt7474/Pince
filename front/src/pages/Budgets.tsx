import {
	closestCenter,
	DndContext,
	type DragEndEvent,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import {
	arrayMove,
	rectSortingStrategy,
	SortableContext,
	sortableKeyboardCoordinates,
	useSortable,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Donut_budgets from "../components/Donut_budgets";
import Flag from "../components/Flag";
import BudgetModal from "../components/Modals/BudgetModal";
import ConfirmModal from "../components/Modals/ConfirmModal";
// import { fake_budgets } from "../fake_data/budgets";
import type { Budget } from "../types/Budget";
import { fetchBudget, updateBudgetPosition } from "../api/budget";

// Composant pour chaque vignette draggable
function SortableBudgetCard({
	budget,
	onSettingsClick,
}: {
	budget: Budget;
	onSettingsClick: (budget: Budget) => void;
}) {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({ id: budget.id });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		opacity: isDragging ? 0.5 : 1,
	};

	const navigate = useNavigate();
	const handleClick = () => {
		// Si on n'est pas en train de dragger, on permet la navigation
		if (!isDragging) {
			navigate(`/budgets/${budget.id}`);
		}
	};

	// Options pour l'affichage du drapeau d'alerte et de la couleur de budget restant

	const allocated_amount = Number(budget.allocated_amount);
	const spent_amount = Number(budget.spent_amount);
	const warning_amount = Number(budget.warning_amount);
	const remainingBudget = allocated_amount - spent_amount;

	let fontColorSpent = "text-gray-500";
	if (remainingBudget <= 0) {
		fontColorSpent = "text-red-500";
	} else if (remainingBudget <= warning_amount) {
		fontColorSpent = "text-orange-400";
	}

	let flagColor: string | null = null;
	let flagText: string | null = null;

	if (spent_amount > allocated_amount) {
		flagColor = "bg-red-400";
		flagText = "⚠️ Budget dépassé";
	} else if (remainingBudget <= warning_amount) {
		flagColor = "bg-amber-400";
		flagText = "Seuil d'alerte atteint";
	}

	return (
		// biome-ignore lint/a11y/noStaticElementInteractions: <explanation>
		<div
			ref={setNodeRef}
			style={style}
			{...attributes}
			className={`relative h-full  border-1 rounded-xl border-[#aaa] bg-[var(--color-primary)] shadow-md hover:brightness-85 max-w-45.5 ${
				isDragging ? "z-10" : ""
			} cursor-grab active:cursor-grabbing`}
			onClick={handleClick}
			onKeyDown={(e) => {
				if (e.key === "Enter" || e.key === " ") {
				}
			}}
		>
			{/* Zone de drag - invisible mais au-dessus */}
			<div
				{...listeners}
				className="absolute inset-0 z-10"
				style={{
					background: "transparent",
					touchAction: "none",
				}}
			/>

			{/* Contenu cliquable */}
			<div className="relative z-10 pointer-events-none flex flex-col items-center justify-center p-2 overflow-hidden">
				<p className="yellowtail-regular text-xl text-center font-semibold">
					{budget.name}
				</p>

				<div className="relative flex items-center justify-center mt-2">
					{/* Donut centré */}
					<Donut_budgets
						budget={budget}
						height={150}
						width={150}
						size={85}
						fontSizePersoSpent={"text-gray-500 text-[12px] font-semibold -mt-3"}
						fontSizePersoRemaining={`${fontColorSpent} text-[12px] font-semibold`}
					/>

					{/* Icone centrée par-dessus */}

					<span
						className="text-3xl absolute top-1/5 "
						role="img"
						aria-label={budget?.name}
					>
						{budget?.icon}
					</span>

					{/* 🔔 Indicateur d’alerte si applicable */}
					<div className="absolute -top-5.5 -left-10">
						{flagText && (
							<Flag color={flagColor} text={flagText} width={7} height={1.1} />
						)}
					</div>
				</div>
			</div>

			<button
				type="button"
				tabIndex={0}
				className="w-12 absolute -bottom-2 -right-1 opacity-70 hover:opacity-100 transition-opacity z-10 pointer-events-auto"
				onClick={(e) => {
					e.preventDefault();
					e.stopPropagation();
					onSettingsClick(budget);
				}}
			>
				<img src="/settings.svg" alt="bouton paramètre" />
			</button>
		</div>
	);
}

export default function Budgets() {
	const location = useLocation();
	const navigate = useNavigate();
	const confirmTextDelete = location.state?.confirmTextDelete;

	const [budgets, setBudgets] = useState<Budget[]>([]);
	const [isModalOpen, setIsModalOpen] = useState(false); // Pour la modale de détails d’un budget
	const [isAddBudgetModalOpen, setIsAddBudgetModalOpen] = useState(false); // Pour ajouter un budget
	const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null); // Budget sélectionné
	const [confirmText, setConfirmText] = useState("");
	const [showConfirm, setShowConfirm] = useState(false);

	// === 1. Chargement initial des budgets avec l'ordre mémorisé (si dispo) ===
	const fetchData = async () => {
		const data = await fetchBudget();

		// Trier par position stockée en BDD
		const sortedData = data.sort(
			(a, b) => (a.position || 0) - (b.position || 0),
		);

		setBudgets(sortedData);
	};

	// === 2. Capteurs pour le drag & drop (souris et clavier) ===
	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: { distance: 8 }, // évite conflits avec clics
		}),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	);

	// === 3. Réagir à la touche Échap pour fermer une modale de détail ===
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				setSelectedBudget(null);
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => {
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, []);

	// === 4. Gérer la fin du glisser-déposer ===
	const handleDragEnd = async (event: DragEndEvent) => {
		const { active, over } = event;

		if (active.id !== over?.id) {
			const oldIndex = budgets.findIndex((b) => b.id === active.id);
			const newIndex = budgets.findIndex((b) => b.id === over?.id);

			const newOrder = arrayMove(budgets, oldIndex, newIndex);

			setBudgets(newOrder);

			// Mise à jour des positions dans la BDD via API
			await Promise.all(
				newOrder.map(
					(budget, index) => updateBudgetPosition(budget.id, index), // 0-based index
				),
			);
		}
	};

	// Appel au chargement initial
	useEffect(() => {
		fetchData();
	}, []);

	// Ouvre la modale du budget
	const handleSettingsClick = (budget: Budget) => {
		setSelectedBudget(budget);
		setIsModalOpen(true);
	};

	// Ouvre la modale de confirmation d'action
	const handleShowConfirm = (text: string) => {
		setConfirmText(text);
		setShowConfirm(true);
		setTimeout(() => setShowConfirm(false), 5000);
	};

	const handleBudgetDeleted = (id: number) => {
		setBudgets((prev) => prev.filter((b) => b.id !== id));
	};

	// Supprime le message de la modalConfirm de l'historique après affichage
	useEffect(() => {
		if (confirmTextDelete) {
			const timer = setTimeout(() => {
				navigate(location.pathname, { replace: true, state: {} });
			}, 4000);

			return () => clearTimeout(timer);
		}
	}, [confirmTextDelete, location.pathname, navigate]);

	// Met a jour le budget sans toucher l'ordre des positions
	const handleBudgetUpdated = (updatedBudget: Budget) => {
		setBudgets((prev) =>
			prev.map((budget) =>
				budget.id === updatedBudget.id ? updatedBudget : budget,
			),
		);
	};

	console.log("test", budgets);

	return (
		<div className="relative mb-6 lg:mb-42">
			<div className="fixed top-16 left-0 w-full z-20 bg-white border-b-2 border-[#aaa] shadow-md h-23">
				<div className="mx-auto max-w-screen-xl px-4 text-center font-semibold text-md sm:w-8/10 xl:w-1/2 2xl:w-4/10">
					<p className="mb-2">Mes budgets</p>

					<div className="relative">
						<progress
							className="progress progress-secondary w-9/10 h-3.5 shadow-md shadow-gray-400 border border-black"
							value="70"
							max="100"
						></progress>
						<p className="absolute left-1/2 -translate-x-1/2 top-0.5 text-black font-semibold text-[11px]">
							70%
						</p>
					</div>

					<div className="flex justify-between text-sm  sm:px-8 ">
						<div>
							<p>Budget restant</p>
							<p>240,60 €</p>
						</div>
						<div>
							<p>Budget dépensé</p>
							<p>179,60 €</p>
						</div>
						<div>
							<p>Budget total</p>
							<p>420,20 €</p>
						</div>
					</div>
				</div>
			</div>

			<div className="flex justify-center mt-26">
				<div className="relative">
					<div className="absolute mt-2 hover:opacity-80">
						{/* Flèche retour */}
						<Link
							to="/homepage"
							className="absolute z-10 -left-45  text-[#242324] hidden md:flex"
						>
							<img
								src="/arrow.svg"
								alt="icone retour"
								className="-mt-1.5 -left-24 w-8 opacity-70  hidden md:block lg:-left-46 mr-1"
							/>
							Accueil
						</Link>
					</div>

					<button
						type="button"
						className="bg-[var(--color-secondary)] p-2 pb-2.5 rounded-md opacity-100 text-white font-semibold hover:opacity-80 hover:cursor-pointer text-sm"
						onClick={() => {
							setIsAddBudgetModalOpen(true);
						}}
					>
						Ajouter un budget
					</button>
				</div>
			</div>

			{/* Container avec drag & drop */}
			<DndContext
				sensors={sensors}
				collisionDetection={closestCenter}
				onDragEnd={handleDragEnd}
			>
				<SortableContext
					items={budgets.map((b) => b.id)}
					strategy={rectSortingStrategy}
				>
					<div className="justify-center mt-4 sm:flex">
						<div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4">
							{[...budgets].map((budget) => (
								<SortableBudgetCard
									key={budget.id}
									budget={budget}
									onSettingsClick={handleSettingsClick}
								/>
							))}
						</div>
					</div>
				</SortableContext>
			</DndContext>

			<div className="flex justify-center mt-4 -mb-6">
				<button
					type="button"
					className="bg-[var(--color-secondary)] p-2 pb-2.5 rounded-md opacity-100 text-white font-semibold hover:opacity-80 hover:cursor-pointer text-sm "
					onClick={() => {
						setIsAddBudgetModalOpen(true);
					}}
				>
					Ajouter un budget
				</button>
			</div>

			{/* Modal de modification de budget */}
			{isModalOpen && selectedBudget && (
				<BudgetModal
					isOpen={isModalOpen}
					onClose={() => setIsModalOpen(false)}
					budget={selectedBudget}
					mode="edit"
					onConfirmMessage={handleShowConfirm}
					onBudgetCreated={handleBudgetUpdated}
					onBudgetDeleted={handleBudgetDeleted}
				/>
			)}
			{showConfirm && (
				<div className="fixed bottom-4 left-4 z-50">
					<ConfirmModal confirmText={confirmText} />
				</div>
			)}
			{confirmTextDelete && <ConfirmModal confirmText={confirmTextDelete} />}

			{isAddBudgetModalOpen && (
				<BudgetModal
					isOpen={isAddBudgetModalOpen}
					onClose={() => setIsAddBudgetModalOpen(false)}
					budget={null}
					mode="create"
					onConfirmMessage={handleShowConfirm}
					onBudgetCreated={handleBudgetUpdated}
					onBudgetDeleted={() => {}}
				/>
			)}
		</div>
	);
}
