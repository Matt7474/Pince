import WithLoadingScreen from "../components/WithLoadingScreen";
import Homepage from "./Homepage";

export default function PostLoginPage() {
	return (
		<WithLoadingScreen videoSrc="/videos/loading.mp4">
			<Homepage />
		</WithLoadingScreen>
	);
}
