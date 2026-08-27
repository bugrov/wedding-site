-- CreateIndex
CREATE INDEX "guests_project_id_idx" ON "guests"("project_id");

-- CreateIndex
CREATE INDEX "leads_theme_id_idx" ON "leads"("theme_id");

-- CreateIndex
CREATE INDEX "projects_theme_id_idx" ON "projects"("theme_id");

-- CreateIndex
CREATE INDEX "rsvp_responses_project_id_idx" ON "rsvp_responses"("project_id");

-- CreateIndex
CREATE INDEX "rsvp_responses_guest_id_idx" ON "rsvp_responses"("guest_id");
