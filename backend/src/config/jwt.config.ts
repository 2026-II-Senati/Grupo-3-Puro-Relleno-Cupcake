export const JWT_ISSUER = "puro-relleno-cupcake";

export const JWT_AUDIENCE = "puro-relleno-cupcake-web";

export function getJwtSecret(): string {
    const secret = process.env.JWT_SECRET;

    if (
        !secret ||
        Buffer.byteLength(secret, "utf8") < 32
    ) {
        throw new Error(
            "JWT_SECRET debe contener al menos 32 bytes."
        );
    }

    return secret;
}