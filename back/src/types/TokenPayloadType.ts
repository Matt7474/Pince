//On attribut user.id à a propriété id du payload.
//Dans CoreModel on a du définit l'id comme potentiellement undefined (voire CoreModel.ts pour plus d'explications)
//On

export interface TokenPayloadType {
	id: number;
	email: string;
}
