-- Sprint 1.4 — Mesafeli PDF kalıcı veri saklayıcı delili
-- 6502 sayılı Kanun + Mesafeli Sözleşmeler Yönetmeliği m.5/1-a ve m.6
-- PDF gönderim zamanı DB'de izlenerek tüketici uyuşmazlıklarında
-- ispat yükümlülüğü karşılanır.

ALTER TABLE "Contract" ADD COLUMN "pdfSentAt" TIMESTAMP(3);
ALTER TABLE "Contract" ADD COLUMN "mesafeliPdfSentAt" TIMESTAMP(3);
ALTER TABLE "Contract" ADD COLUMN "pdfSendError" TEXT;
