-- CreateTable
CREATE TABLE "EncryptedData" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "payload" BLOB NOT NULL,
    "hash" BLOB NOT NULL,
    "salt" BLOB NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "EncryptedData_id_key" ON "EncryptedData"("id");
