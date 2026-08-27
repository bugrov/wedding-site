-- CreateEnum
CREATE TYPE "lead_status" AS ENUM ('NEW', 'IN_PROGRESS', 'REJECTED');

-- CreateEnum
CREATE TYPE "project_status" AS ENUM ('IN_PROGRESS', 'IN_REVIEW', 'PAID', 'PUBLISHED', 'CANCELLED');

-- CreateTable
CREATE TABLE "admin_users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admin_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leads" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "contact_name" TEXT NOT NULL,
    "groom_name" TEXT NOT NULL,
    "bride_name" TEXT NOT NULL,
    "wedding_date" TIMESTAMP(3) NOT NULL,
    "phone" TEXT NOT NULL,
    "telegram" TEXT,
    "comment" TEXT,
    "template_id" TEXT NOT NULL,
    "theme_id" TEXT,
    "blocks_config" JSONB NOT NULL,
    "status" "lead_status" NOT NULL DEFAULT 'NEW',

    CONSTRAINT "leads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "projects" (
    "id" TEXT NOT NULL,
    "lead_id" TEXT,
    "slug" TEXT NOT NULL,
    "groom_name" TEXT NOT NULL,
    "bride_name" TEXT NOT NULL,
    "wedding_date" TIMESTAMP(3) NOT NULL,
    "template_id" TEXT NOT NULL,
    "theme_id" TEXT,
    "blocks_config" JSONB NOT NULL,
    "status" "project_status" NOT NULL DEFAULT 'IN_PROGRESS',
    "client_access_token" TEXT NOT NULL,
    "telegram_chat_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "published_at" TIMESTAMP(3),

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "themes" (
    "id" TEXT NOT NULL,
    "template_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "color_tokens" JSONB NOT NULL,
    "font_pair" TEXT NOT NULL,
    "decor_override" TEXT,

    CONSTRAINT "themes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "guests" (
    "id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "personal_link_token" TEXT,

    CONSTRAINT "guests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rsvp_responses" (
    "id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "guest_id" TEXT,
    "name" TEXT NOT NULL,
    "attending" BOOLEAN NOT NULL,
    "headcount" INTEGER NOT NULL DEFAULT 1,
    "food_pref" TEXT,
    "comment" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "rsvp_responses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "admin_users_email_key" ON "admin_users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "projects_lead_id_key" ON "projects"("lead_id");

-- CreateIndex
CREATE UNIQUE INDEX "projects_slug_key" ON "projects"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "projects_client_access_token_key" ON "projects"("client_access_token");

-- CreateIndex
CREATE UNIQUE INDEX "guests_personal_link_token_key" ON "guests"("personal_link_token");

-- AddForeignKey
ALTER TABLE "leads" ADD CONSTRAINT "leads_theme_id_fkey" FOREIGN KEY ("theme_id") REFERENCES "themes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "leads"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_theme_id_fkey" FOREIGN KEY ("theme_id") REFERENCES "themes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guests" ADD CONSTRAINT "guests_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rsvp_responses" ADD CONSTRAINT "rsvp_responses_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rsvp_responses" ADD CONSTRAINT "rsvp_responses_guest_id_fkey" FOREIGN KEY ("guest_id") REFERENCES "guests"("id") ON DELETE SET NULL ON UPDATE CASCADE;
