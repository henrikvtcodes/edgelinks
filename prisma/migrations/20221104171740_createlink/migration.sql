-- CreateEnum
CREATE TYPE "RedirectType" AS ENUM ('PermanentRedirect', 'TemporaryRedirect');

-- CreateTable
CREATE TABLE "Link" (
    "id" STRING NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "description" STRING,
    "url" STRING NOT NULL,
    "slug" STRING NOT NULL,
    "redirectType" "RedirectType" NOT NULL DEFAULT 'TemporaryRedirect',
    "enableCache" BOOL NOT NULL DEFAULT false,
    "maxAge" INT4 NOT NULL DEFAULT 0,
    "swr" INT4 NOT NULL DEFAULT 0,

    CONSTRAINT "Link_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Link_slug_key" ON "Link"("slug");
