import argon2 from "argon2";

export async function hash(password: string): Promise<string> {
	try {
		const hash = await argon2.hash(password);
		return hash;
	} catch (err) {
		return "error";
	}
}

export async function verify(
	hashedPassword: string,
	inputPassword: string,
): Promise<boolean | string> {
	try {
		const isCorrect = await argon2.verify(hashedPassword, inputPassword);
		return isCorrect;
	} catch (err) {
		console.log("err?: ", err);
		return "error";
	}
}
