import { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Footer from "./components/Footer";
import FooterLargeScreen from "./components/FooterLargeScreen";
import Header from "./components/Header";
import ScrollToTop from "./components/ScrollToTop";
import AboutUs from "./pages/AboutUs";
import BudgetDetails from "./pages/BudgetDetails";
import Budgets from "./pages/Budgets";
import Homepage from "./pages/Homepage";
import Instructions from "./pages/Instructions";
import Landing from "./pages/Landing";
import LegalNotices from "./pages/LegalNotices";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import PostLoginPage from "./pages/PostLoginPage";
import Cookies from "./pages/PrivacyPolicy";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import TermsAndConditionsOfSale from "./pages/TermsAndConditionsOfSale";
import "./App.css";
import PrivateRoute from "./components/PrivateRoute.tsx";

function App() {
	useEffect(() => {
		const storedTheme = localStorage.getItem("color-secondary");
		if (storedTheme) {
			document.documentElement.style.setProperty(
				"--color-secondary",
				storedTheme,
			);
		}
	}, []);
	return (
		<div className="min-h-screen flex flex-col bg-neutral-100">
			<BrowserRouter>
				{/* Force le scroll en haut a chaques changement de page */}
				<ScrollToTop />
				<Header />
				<main className="flex flex-grow flex-col mx-3 items-center bg-transparent pt-16 pb-24">
					<Routes>
						{/* Routes publique */}
						<Route path="/login" element={<Login />} />
						<Route path="/register" element={<Register />} />
						<Route path="/cgu" element={<TermsAndConditionsOfSale />} />
						<Route path="/cookies" element={<Cookies />} />
						<Route path="/mentions" element={<LegalNotices />} />
						<Route path="/instructions" element={<Instructions />} />
						<Route path="/aboutUs" element={<AboutUs />} />

						{/* Routes privée */}
						<Route element={<PrivateRoute />}>
							<Route path="/profile" element={<Profile />} />
							<Route path="/" element={<Landing />} />
							<Route path="/home" element={<PostLoginPage />} />
							<Route path="/homepage" element={<Homepage />} />
							<Route path="/budgets" element={<Budgets />} />
							<Route path="/budgets/:id" element={<BudgetDetails />} />

							{/* Route 404 */}
							<Route path={"*"} element={<NotFound />} />
						</Route>
					</Routes>
				</main>
				{/* Footer mobile */}
				<div className="block lg:hidden">
					<Footer />
				</div>

				{/* Footer desktop */}
				<div className="hidden lg:block">
					<FooterLargeScreen />
				</div>
			</BrowserRouter>
		</div>
	);
}

export default App;
