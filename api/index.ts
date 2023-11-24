import express, { ErrorRequestHandler } from "express"
import { httpError } from "./util/errors"
import { z } from "zod"
import { decrypt, encrypt, hashPassphrase, isPassphraseCorrect } from "./secret"
import { PrismaClient } from "@prisma/client"
import { nanoid } from "nanoid"
import { validateRequest } from "./util/validate"

const app = express()
const port = 8080

const prisma = new PrismaClient()

app.use(express.json())

app.post(
  "/",
  validateRequest({
    body: z.object({
      plaintext: z.string().max(1024_00).min(1),
      passphrase: z.string().max(64).min(1),
    }),
  }),
  async (req, res, next) => {
    try {
      const ciphertext = encrypt(
        Buffer.from(req.body.plaintext, "utf-8"),
        req.body.passphrase
      )
      const record = await prisma.encryptedData.create({
        data: {
          id: nanoid(),
          payload: ciphertext,
          ...hashPassphrase(req.body.passphrase),
        },
      })

      res.status(201).send({
        url: `${req.protocol}://${req.get("host")}${req.originalUrl}${
          record.id
        }`,
      })
    } catch (error) {
      console.error(error)
      res.status(500).send(httpError(500))
    }
  }
)

app.post(
  "/:id",
  validateRequest({
    params: z.object({
      id: z.string().max(64).min(1),
    }),
    body: z.object({
      passphrase: z.string().max(64).min(1),
    }),
  }),
  async (req, res, next) => {
    try {
      const record = await prisma.encryptedData.findFirst({
        where: { id: req.params.id },
      })
      if (
        record === null ||
        !isPassphraseCorrect(record.salt, record.hash, req.body.passphrase)
      ) {
        res.status(404).send(httpError(404))
      } else {
        await prisma.encryptedData.delete({
          where: {
            id: req.params.id,
          },
        })
        res.status(200).send({
          plaintext: decrypt(record.payload, req.body.passphrase).toString(),
        })
      }
    } catch (error) {
      console.error(error)
      res.status(500).send(httpError(500))
    }
  }
)

app.use(((err, req, res, next) => {
  console.error(err)
  res.status(500).send(httpError(500))
}) as ErrorRequestHandler)

app.listen(port, () => {
  console.log(`Listening on port ${port}...`)
})
