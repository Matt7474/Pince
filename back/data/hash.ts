import argon2 from "argon2";

async function seedUser() {
	const hashedPassword = await argon2.hash("Password1");
	console.log(hashedPassword);
}

seedUser();
