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
import { fetchBudget, updateBudgetPosition } from "../api/budget";
import Donut_budgets from "../components/Donut_budgets";
import Flag from "../components/Flag";
import BudgetModal from "../components/Modals/BudgetModal";
import ConfirmModal from "../components/Modals/ConfirmModal";
import type { Budget } from "../types/Budget";
import ExpenseModal from "../components/Modals/ExpenseModal";

// Composant pour chaque vignette draggable
function SortableBudgetCard({
	budget,
	onSettingsClick,
	onAddExpenseClick,
}: {
	budget: Budget;
	onSettingsClick: (budget: Budget) => void;
	onAddExpenseClick: (budget: Budget) => void;
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
	const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);

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
			className={`relative h-full border-1 rounded-xl border-[#aaa] bg-[var(--color-primary)] shadow-md hover:brightness-85 max-w-45.5 ${
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
					{/* Permet la 1ere lettre en majuscule .charAt(0).toUpperCase() + budget.name.slice(1) */}
					{budget.name.charAt(0).toUpperCase() + budget.name.slice(1)}
				</p>

				<div className="relative flex items-center justify-center mt-2">
					{/* Donut centré */}
					<Donut_budgets
						budget={budget}
						height={150}
						width={150}
						size={85}
						key={`${budget.id}-${budget.spent_amount}-${budget.allocated_amount}-${budget.warning_amount}-${budget.color}-${Date.now()}`}
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

					{/* 🔔 Indicateur d'alerte si applicable */}
					<div className="absolute -top-5.5 -left-10">
						{flagText && (
							<Flag color={flagColor} text={flagText} width={7} height={1.1} />
						)}
					</div>
				</div>
			</div>

			<button
				type="button"
				onClick={(e) => {
					e.preventDefault();
					e.stopPropagation();
					onAddExpenseClick(budget);
				}}
				className="w-12 absolute bottom-2.5 left-2 opacity-90 hover:opacity-100 transition-opacity z-10 cursor-pointer pointer-events-auto"
			>
				<img
					src="/plus.svg"
					alt="bouton +"
					className="w-5 opacity-70 hover:opacity-100 cursor-pointer"
				/>
			</button>

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
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
	const [selectedBudgetForExpense, setSelectedBudgetForExpense] =
		useState<Budget | null>(null);
	const [isAddBudgetModalOpen, setIsAddBudgetModalOpen] = useState(false);
	const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);
	const [confirmText, setConfirmText] = useState("");
	const [showConfirm, setShowConfirm] = useState(false);
	const [confirmKey, setConfirmKey] = useState(0);

	const handleAddExpenseClick = (budget: Budget) => {
		setSelectedBudgetForExpense(budget);
		setIsExpenseModalOpen(true);
		setConfirmKey((prev) => prev + 1);
	};

	const handleExpenseUpdate = () => {
		// Rafraîchir les budgets après ajout de dépense
		refreshBudgets(); // Cette fonction va mettre à jour les données
		setIsExpenseModalOpen(false);
		setSelectedBudgetForExpense(null);
		setConfirmKey((prev) => prev + 1);
	};

	// Données globales calculées
	const totalAllocated = budgets.reduce(
		(acc, b) => acc + Number(b.allocated_amount || 0),
		0,
	);
	const totalSpent = budgets.reduce(
		(acc, b) => acc + Number(b.spent_amount || 0),
		0,
	);
	const totalRemaining = totalAllocated - totalSpent;
	const percentRemaining =
		totalAllocated > 0
			? Math.max((totalRemaining / totalAllocated) * 100, 0)
			: 0;

	// Fonction pour recharger les données depuis l'API
	const refreshBudgets = async () => {
		try {
			const data = await fetchBudget();
			// Trier par position stockée en BDD
			const sortedData = data.sort(
				(a, b) => (a.position || 0) - (b.position || 0),
			);
			setBudgets(sortedData);
		} catch (error) {
			console.error("❌ Erreur lors du chargement des budgets :", error);
		}
	};

	// Capteurs pour le drag & drop (souris et clavier)
	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: { distance: 8 },
		}),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	);

	// Réagir à la touche Échap pour fermer une modale
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

	// Gérer la fin du glisser-déposer
	const handleDragEnd = async (event: DragEndEvent) => {
		const { active, over } = event;

		if (active.id !== over?.id) {
			const oldIndex = budgets.findIndex((b) => b.id === active.id);
			const newIndex = budgets.findIndex((b) => b.id === over?.id);

			const newOrder = arrayMove(budgets, oldIndex, newIndex);

			setBudgets(newOrder);

			// Mise à jour des positions dans la BDD via API
			await Promise.all(
				newOrder.map((budget, index) => updateBudgetPosition(budget.id, index)),
			);
		}
	};

	// Chargement initial
	useEffect(() => {
		refreshBudgets();
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

	// Supprime le budget de la liste
	const handleBudgetDeleted = (id: number) => {
		setBudgets((prev) => prev.filter((b) => b.id !== id));
	};

	// Supprime le message de confirmation après affichage
	useEffect(() => {
		if (confirmTextDelete) {
			const timer = setTimeout(() => {
				navigate(location.pathname, { replace: true, state: {} });
			}, 4000);

			return () => clearTimeout(timer);
		}
	}, [confirmTextDelete, location.pathname, navigate]);

	// Gestion de la création/modification de budget
	const handleBudgetCreated = () => {
		refreshBudgets(); // Recharge toutes les données
		setIsAddBudgetModalOpen(false);
	};

	const handleBudgetUpdated = () => {
		setIsModalOpen(false);
		refreshBudgets(); // Recharge toutes les données au lieu de juste mettre à jour l'état local
	};

	console.log("budgets", budgets);

	return (
		<div className="relative mb-6 lg:mb-42">
			<div className="fixed top-16 left-0 w-full z-20 bg-white border-b-2 border-[#aaa] shadow-md h-23">
				<div className="mx-auto max-w-screen-xl px-4 text-center font-semibold text-md sm:w-8/10 xl:w-1/2 2xl:w-4/10">
					<p className="mb-2">Mes budgets</p>

					<div className="relative">
						<progress
							className="progress progress-secondary w-9/10 h-3.5 shadow-md shadow-gray-400 border border-black"
							value={percentRemaining}
							max="100"
						></progress>
						<p className="absolute left-1/2 -translate-x-1/2 top-0.5 text-black font-semibold text-[11px]">
							{percentRemaining.toFixed(0)}%
						</p>
					</div>

					<div className="flex justify-between text-sm sm:px-8">
						<div>
							<p>Budget restant</p>
							<p>{totalRemaining.toFixed(2)} €</p>
						</div>
						<div>
							<p>Budget dépensé</p>
							<p>{totalSpent.toFixed(2)} €</p>
						</div>
						<div>
							<p>Budget total</p>
							<p>{totalAllocated.toFixed(2)} €</p>
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
							className="absolute z-10 -left-45 text-[#242324] hidden md:flex"
						>
							<img
								src="/arrow.svg"
								alt="icone retour"
								className="-mt-1.5 -left-24 w-8 opacity-70 hidden md:block lg:-left-46 mr-1"
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
							{budgets.map((budget) => (
								<SortableBudgetCard
									key={budget.id}
									budget={budget}
									onSettingsClick={handleSettingsClick}
									onAddExpenseClick={handleAddExpenseClick} // Nouvelle prop
								/>
							))}
						</div>
					</div>
				</SortableContext>
			</DndContext>
			{budgets.length > 0 && (
				<div className="flex justify-center mt-4 -mb-6">
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
			)}

			{/* Modal de modification de budget */}
			{isModalOpen && selectedBudget && (
				<BudgetModal
					isOpen={isModalOpen}
					onClose={() => setIsModalOpen(false)}
					budget={selectedBudget}
					mode="edit"
					onConfirmMessage={handleShowConfirm}
					onBudgetCreated={handleBudgetCreated}
					onBudgetUpdated={handleBudgetUpdated}
					onBudgetDeleted={handleBudgetDeleted}
				/>
			)}
			{/* Modal d'ajout de budget */}
			{isAddBudgetModalOpen && (
				<BudgetModal
					isOpen={isAddBudgetModalOpen}
					onClose={() => setIsAddBudgetModalOpen(false)}
					budget={null}
					mode="create"
					onConfirmMessage={handleShowConfirm}
					onBudgetCreated={handleBudgetCreated}
					onBudgetUpdated={handleBudgetUpdated}
					onBudgetDeleted={() => {}}
				/>
			)}
			{isExpenseModalOpen && selectedBudgetForExpense && (
				<ExpenseModal
					isOpen={isExpenseModalOpen}
					onClose={() => {
						setIsExpenseModalOpen(false);
						setSelectedBudgetForExpense(null);
					}}
					budget={selectedBudgetForExpense}
					mode="create"
					onExpenseUpdate={handleExpenseUpdate}
				/>
			)}
			{/* Modals de confirmation */}

			{showConfirm && (
				<div className="fixed bottom-4 left-4 z-50">
					<ConfirmModal confirmText={confirmText} key={confirmKey} />
				</div>
			)}
			{confirmTextDelete && (
				<ConfirmModal confirmText={confirmTextDelete} key={confirmKey} />
			)}
		</div>
	);
}
