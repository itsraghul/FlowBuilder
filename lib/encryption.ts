
import crypto from "crypto";
import "server-only";

const ALG = "aes-256-cbc"; //Key length is 32 bytes



export const symmentricEncrypt = (key: string): string => {
    const encryptionKey = process.env.ENCRYPTION_KEY;
    if (!encryptionKey) {
        throw new Error("Encryption key not found");
    }

    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(ALG, Buffer.from(encryptionKey, "hex"), iv);

    let encryptedData = cipher.update(key);
    encryptedData = Buffer.concat([encryptedData, cipher.final()]) //All lefr over bits are encrypted

    return iv.toString("hex") + ":" + encryptedData.toString("hex");
}

export const symmentricDecrypt = (encrypted: string): string => {
    const encryptionKey = process.env.ENCRYPTION_KEY;
    if (!encryptionKey) {
        throw new Error("Encryption key not found");
    }
    const textParts = encrypted.split(":");
    const iv = Buffer.from(textParts.shift() as string, "hex");
    const encryptedText = Buffer.from(textParts.join(":"), "hex");

    const decipher = crypto.createDecipheriv(ALG, Buffer.from(encryptionKey, "hex"), iv);

    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return decrypted.toString();


}