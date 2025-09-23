-- CreateTable
CREATE TABLE "requirements" (
  "id" TEXT NOT NULL,
  "module_id" TEXT NOT NULL,
  "object_id" TEXT NOT NULL,
  "baseline_id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "status" TEXT NOT NULL,
  "priority" TEXT NOT NULL,
  "verification_method" TEXT,
  "dedupe_hash" TEXT NOT NULL,
  "extras" JSONB,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "requirements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "metrics" (
  "id" TEXT NOT NULL,
  "requirement_id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "value" DOUBLE PRECISION,
  "unit" TEXT,
  "normalized_unit" TEXT,
  "lower" DOUBLE PRECISION,
  "lower_inc" BOOLEAN,
  "upper" DOUBLE PRECISION,
  "upper_inc" BOOLEAN,
  "method" TEXT NOT NULL,
  "confidence" DOUBLE PRECISION,
  "source_fragment" TEXT,
  "extras" JSONB,
  CONSTRAINT "metrics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rbom_nodes" (
  "id" TEXT NOT NULL,
  "code" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "level" INTEGER NOT NULL,
  "parent_id" TEXT,
  "path" TEXT NOT NULL,
  "baseline_id" TEXT,
  "extras" JSONB,
  CONSTRAINT "rbom_nodes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "requirement_rbom_bindings" (
  "id" TEXT NOT NULL,
  "requirement_id" TEXT NOT NULL,
  "rbom_node_id" TEXT NOT NULL,
  "baseline_id" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "requirement_rbom_bindings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "change_packages" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "owner_id" TEXT NOT NULL,
  "severity" TEXT NOT NULL,
  "status" TEXT NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "due_at" TIMESTAMP(3),
  CONSTRAINT "change_packages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "change_orders" (
  "id" TEXT NOT NULL,
  "change_package_id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "assignee_id" TEXT NOT NULL,
  "status" TEXT NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "due_at" TIMESTAMP(3),
  CONSTRAINT "change_orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "diffs" (
  "id" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "severity" TEXT NOT NULL,
  "target_type" TEXT NOT NULL,
  "target_id" TEXT NOT NULL,
  "before" JSONB,
  "after" JSONB,
  "description" TEXT,
  "detected_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "change_package_id" TEXT,
  CONSTRAINT "diffs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
  "id" TEXT NOT NULL,
  "channel" TEXT NOT NULL,
  "recipient_user_id" TEXT,
  "recipient_role" TEXT,
  "title" TEXT NOT NULL,
  "body" TEXT NOT NULL,
  "sent_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "read_at" TIMESTAMP(3),
  "confirmed_at" TIMESTAMP(3),
  "related_type" TEXT,
  "related_id" TEXT,
  CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_packages" (
  "id" TEXT NOT NULL,
  "change_package_id" TEXT NOT NULL,
  "assignee_id" TEXT NOT NULL,
  "status" TEXT NOT NULL,
  "issued_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "ack_at" TIMESTAMP(3),
  CONSTRAINT "work_packages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "acknowledgements" (
  "id" TEXT NOT NULL,
  "work_package_id" TEXT NOT NULL,
  "user_id" TEXT NOT NULL,
  "ack_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "status" TEXT NOT NULL,
  "reason" TEXT,
  CONSTRAINT "acknowledgements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "deliverables" (
  "id" TEXT NOT NULL,
  "work_package_id" TEXT NOT NULL,
  "url" TEXT NOT NULL,
  "metadata" JSONB,
  "uploaded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "checksum" TEXT,
  CONSTRAINT "deliverables_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verifications" (
  "id" TEXT NOT NULL,
  "requirement_id" TEXT,
  "metric_id" TEXT,
  "method" TEXT NOT NULL,
  "outcome" TEXT NOT NULL,
  "evidence_urls" JSONB,
  "verified_by" TEXT NOT NULL,
  "verified_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "notes" TEXT,
  CONSTRAINT "verifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "closures" (
  "id" TEXT NOT NULL,
  "change_package_id" TEXT NOT NULL,
  "summary" TEXT NOT NULL,
  "result" TEXT NOT NULL,
  "closed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "closures_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
  "id" TEXT NOT NULL,
  "who" JSONB,
  "when" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "action" TEXT NOT NULL,
  "target" JSONB,
  "before" JSONB,
  "after" JSONB,
  "trace_id" TEXT,
  "view_id" TEXT,
  "client_ip" TEXT,
  CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lookups" (
  "id" TEXT NOT NULL,
  "domain" TEXT NOT NULL,
  "key" TEXT NOT NULL,
  "value" TEXT NOT NULL,
  "locale" TEXT,
  "version" TEXT,
  CONSTRAINT "lookups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "meta_requirement_fields" (
  "id" TEXT NOT NULL,
  "module" TEXT NOT NULL,
  "key" TEXT NOT NULL,
  "label" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "required" BOOLEAN,
  "visible" BOOLEAN,
  "options" JSONB,
  "order" INTEGER,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "meta_requirement_fields_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "requirements_dedupe_hash_key" ON "requirements"("dedupe_hash");

-- CreateIndex
CREATE INDEX "idx_requirements_module_object_baseline" ON "requirements"("module_id", "object_id", "baseline_id");

-- CreateIndex
CREATE INDEX "idx_requirements_status" ON "requirements"("status");

-- CreateIndex
CREATE INDEX "idx_metrics_requirement_id" ON "metrics"("requirement_id");

-- CreateIndex
CREATE INDEX "idx_metrics_name" ON "metrics"("name");

-- CreateIndex
CREATE INDEX "idx_rbom_nodes_parent_id" ON "rbom_nodes"("parent_id");

-- CreateIndex
CREATE INDEX "idx_rbom_nodes_code" ON "rbom_nodes"("code");

-- CreateIndex
CREATE UNIQUE INDEX "uq_rbom_nodes_code_baseline_id" ON "rbom_nodes"("code", "baseline_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_requirement_rbom_bindings" ON "requirement_rbom_bindings"("requirement_id", "rbom_node_id", "baseline_id");

-- CreateIndex
CREATE INDEX "idx_change_packages_owner_id" ON "change_packages"("owner_id");

-- CreateIndex
CREATE INDEX "idx_change_packages_status" ON "change_packages"("status");

-- CreateIndex
CREATE INDEX "idx_change_orders_assignee_id" ON "change_orders"("assignee_id");

-- CreateIndex
CREATE INDEX "idx_change_orders_status" ON "change_orders"("status");

-- CreateIndex
CREATE INDEX "idx_diffs_change_package_id" ON "diffs"("change_package_id");

-- CreateIndex
CREATE INDEX "idx_diffs_severity" ON "diffs"("severity");

-- CreateIndex
CREATE INDEX "idx_diffs_target_type" ON "diffs"("target_type");

-- CreateIndex
CREATE INDEX "idx_notifications_recipient_user_id" ON "notifications"("recipient_user_id");

-- CreateIndex
CREATE INDEX "idx_notifications_recipient_role" ON "notifications"("recipient_role");

-- CreateIndex
CREATE INDEX "idx_notifications_sent_at" ON "notifications"("sent_at");

-- CreateIndex
CREATE INDEX "idx_work_packages_assignee_id" ON "work_packages"("assignee_id");

-- CreateIndex
CREATE INDEX "idx_work_packages_status" ON "work_packages"("status");

-- CreateIndex
CREATE INDEX "idx_audit_logs_when" ON "audit_logs"("when");

-- CreateIndex
CREATE INDEX "idx_audit_logs_view_id" ON "audit_logs"("view_id");

-- CreateIndex
CREATE INDEX "idx_audit_logs_trace_id" ON "audit_logs"("trace_id");

-- CreateIndex
CREATE INDEX "idx_lookups_domain" ON "lookups"("domain");

-- CreateIndex
CREATE INDEX "idx_meta_requirement_fields_module" ON "meta_requirement_fields"("module");

-- CreateIndex
CREATE UNIQUE INDEX "uq_meta_requirement_fields_module_key" ON "meta_requirement_fields"("module", "key");

-- CreateIndex
CREATE UNIQUE INDEX "closures_change_package_id_key" ON "closures"("change_package_id");

-- AddForeignKey
ALTER TABLE "metrics" ADD CONSTRAINT "metrics_requirement_id_fkey" FOREIGN KEY ("requirement_id") REFERENCES "requirements"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "requirement_rbom_bindings" ADD CONSTRAINT "requirement_rbom_bindings_requirement_id_fkey" FOREIGN KEY ("requirement_id") REFERENCES "requirements"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "requirement_rbom_bindings" ADD CONSTRAINT "requirement_rbom_bindings_rbom_node_id_fkey" FOREIGN KEY ("rbom_node_id") REFERENCES "rbom_nodes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "change_orders" ADD CONSTRAINT "change_orders_change_package_id_fkey" FOREIGN KEY ("change_package_id") REFERENCES "change_packages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "diffs" ADD CONSTRAINT "diffs_change_package_id_fkey" FOREIGN KEY ("change_package_id") REFERENCES "change_packages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_packages" ADD CONSTRAINT "work_packages_change_package_id_fkey" FOREIGN KEY ("change_package_id") REFERENCES "change_packages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "acknowledgements" ADD CONSTRAINT "acknowledgements_work_package_id_fkey" FOREIGN KEY ("work_package_id") REFERENCES "work_packages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deliverables" ADD CONSTRAINT "deliverables_work_package_id_fkey" FOREIGN KEY ("work_package_id") REFERENCES "work_packages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "verifications" ADD CONSTRAINT "verifications_requirement_id_fkey" FOREIGN KEY ("requirement_id") REFERENCES "requirements"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "closures" ADD CONSTRAINT "closures_change_package_id_fkey" FOREIGN KEY ("change_package_id") REFERENCES "change_packages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
