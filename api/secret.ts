import crypto from "node:crypto"

const algorithm = "aes-256-ctr"

export const encrypt = (buffer: Buffer, passphrase: string) => {
  const key = createKey(passphrase)
  const iv = crypto.randomBytes(16)
  const cipher = crypto.createCipheriv(algorithm, key, iv)
  return Buffer.concat([iv, cipher.update(buffer), cipher.final()])
}

export const decrypt = (buffer: Buffer, passphrase: string) => {
  const key = createKey(passphrase)
  const iv = buffer.subarray(0, 16)
  const decipher = crypto.createDecipheriv(algorithm, key, iv)
  return Buffer.concat([decipher.update(buffer.subarray(16)), decipher.final()])
}

export const hashPassphrase = (passphrase: string) => {
  const salt = crypto.randomBytes(16)
  const hash = crypto.pbkdf2Sync(
    Buffer.from(passphrase, "utf-8"),
    salt,
    1000,
    64,
    "sha512"
  )

  return { salt, hash }
}

export const isPassphraseCorrect = (
  salt: Buffer,
  hash: Buffer,
  passphrase: string
) => {
  return (
    Buffer.compare(
      hash,
      crypto.pbkdf2Sync(passphrase, salt, 1000, 64, "sha512")
    ) === 0
  )
}

const createKey = (passphrase: string) =>
  crypto
    .createHash("sha256")
    .update(passphrase)
    .digest("base64")
    .substring(0, 32)
