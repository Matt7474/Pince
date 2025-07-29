import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

const transporter = nodemailer.createTransport({
	host: process.env.EMAIL_HOST,
	port: parseInt(process.env.EMAIL_PORT),
	secure: process.env.EMAIL_PORT === "465", // true si SSL
	auth: {
		user: process.env.EMAIL_USER,
		pass: process.env.EMAIL_PASS,
	},
});

async function sendTestEmail() {
	try {
		const info = await transporter.sendMail({
			from: `"La Pince" <${process.env.EMAIL_USER}>`,
			to: "d.matt7@hotmail.com",
			subject: "Test d'envoi",
			html: "<p>Voici un test d'envoi d'email depuis nodemailer 🎉</p>",
		});

		console.log("E-mail envoyé avec succès !", info.messageId);
	} catch (err) {
		console.error("Erreur lors de l'envoi de l'e-mail :", err);
	}
}

sendTestEmail();
