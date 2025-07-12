import Joi from "joi";

//Création d'un schéma: format de données pour l'email et le password
export const registerSchema = Joi.object({
	email: Joi.string().email().required().empty("").messages({
		"string.email": "Le format de l'email est invalide.",
		"any.required": "Le champ email est obligatoire.",
		"string.empty": "Le champ email est obligatoire.",
	}),
	password: Joi.string()
		.pattern(/^(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9\-!@#$%^&*()_+=]{8,}$/)
		.required()
		.empty("")
		.messages({
			"string.pattern.base":
				"Le mot de passe doit contenir au moins 8 caractères, dont 1 chiffre et 1 majuscule.",
			"any.required": "Le champ password est obligatoire.",
			"string.empty": "Le champ password est obligatoire.",
		}),
	first_name: Joi.string()
		.min(2)
		.max(30)
		.pattern(/^[A-Za-zÀ-ÖØ-öø-ÿ'’-]+$/u)
		.required()
		.messages({
			"string.pattern.base":
				"Le prénom ne doit contenir que des lettres, tirets ou apostrophes.",
			"string.min": "Le prénom doit contenir au moins 2 caractères.",
			"string.max": "Le prénom ne doit pas dépasser 30 caractères.",
			"any.required": "Le champ prénom est obligatoire.",
		}),

	last_name: Joi.string()
		.min(2)
		.max(30)
		.pattern(/^[A-Za-zÀ-ÖØ-öø-ÿ'’-]+$/u)
		.required()
		.messages({
			"string.pattern.base":
				"Le nom ne doit contenir que des lettres, tirets ou apostrophes.",
			"string.min": "Le nom doit contenir au moins 2 caractères.",
			"string.max": "Le nom ne doit pas dépasser 30 caractères.",
			"any.required": "Le champ nom est obligatoire.",
		}),
});

//Création d'un schéma: format de données pour l'email et le password
export const loginSchema = Joi.object({
	email: Joi.string().email().empty("").required().messages({
		"string.email": "Le format de l'email est invalide.",
		"any.required": "Le champ email est obligatoire.",
		"string.empty": "Le champ email est obligatoire.",
	}),
	password: Joi.string().empty("").required().messages({
		"any.required": "Le champ password est obligatoire.",
		"string.empty": "Le champ email est obligatoire.",
	}),
});

//Création d'un schéma pour le montant (on veut un nombre positif à maximum deux chiffres après la virgule)
//En principe, la conversion du montant avec Number() a déjà réduit le nombre de chiffre après la virgule à 2
//Le reste des champs (description, payment_method, date) n'est pas required et la date est séléctionnée via un calendrier
export const amountSchema = Joi.number()
	.positive()
	.precision(2) // maximum 2 chiffres après la virgule
	.custom((value, helpers) => {
		// Vérifie qu'il n'y a pas plus de deux décimales
		if (!Number.isInteger(value * 100)) {
			return helpers.error("number.decimalPlaces");
		}
		return value;
	}, "Decimal places validation")
	.messages({
		"number.base": "Le champ doit être un nombre.",
		"number.positive": "Le nombre doit être positif.",
		"number.decimalPlaces":
			"Le nombre ne peut avoir que deux chiffres après la virgule au maximum.",
	});

export const budgetSchema = Joi.object({
	name: Joi.string().max(255).required().empty(""),
	warning_amount_for_db: amountSchema,
	allocated_amount_for_db: amountSchema,
	color: Joi.string().max(255).optional().allow(""),
	icon: Joi.string().optional().allow(""),
}).messages({
	"any.required": "Le champ titre du budget est obligatoire.",
	"string.empty": "Le champ titre du budget est obligatoire.",
});
