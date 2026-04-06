"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SignatureCanvas from "./signature-canvas";
import {
  createContractDraft,
  sendContractVerification,
  verifyContractEmail,
  getContractByProposal,
} from "@/actions/contracts";

interface ContractSigningProps {
  proposalToken: string;
  firmName: string;
  contactName: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
}

type Step = "info" | "verify" | "read" | "sign" | "done";

export default function ContractSigning({
  proposalToken,
  firmName,
  contactName,
  contactEmail,
  contactPhone,
}: ContractSigningProps) {
  const [step, setStep] = useState<Step>("info");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [contractId, setContractId] = useState<string | null>(null);
  const [contractText, setContractText] = useState<string>("");

  // Form bilgileri
  const [signerName, setSignerName] = useState(contactName || "");
  const [signerTcNo, setSignerTcNo] = useState("");
  const [signerTaxNo, setSignerTaxNo] = useState("");
  const [signerTitle, setSignerTitle] = useState("");
  const [signerCompany, setSignerCompany] = useState("");
  const [signerEmail, setSignerEmail] = useState(contactEmail || "");
  const [signerPhone, setSignerPhone] = useState(contactPhone || "");
  const [signerAddress, setSignerAddress] = useState("");
  const [isCompany, setIsCompany] = useState(false);

  // Doğrulama
  const [verifyCode, setVerifyCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);

  // İmza
  const [signatureData, setSignatureData] = useState<string | null>(null);
  const [accepted, setAccepted] = useState(false);

  // ── Adım 1: Bilgi formu gönder ──
  async function handleInfoSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await createContractDraft(proposalToken, {
      signerName,
      signerTcNo: isCompany ? undefined : signerTcNo || undefined,
      signerTaxNo: isCompany ? signerTaxNo || undefined : undefined,
      signerTitle: signerTitle || undefined,
      signerCompany: isCompany ? signerCompany || undefined : undefined,
      signerEmail,
      signerPhone: signerPhone || undefined,
      signerAddress: signerAddress || undefined,
    });

    if (res.success && res.contractId) {
      setContractId(res.contractId);

      // Mevcut sözleşme varsa ve imzalanmışsa
      if (res.existing) {
        const existing = await getContractByProposal(proposalToken);
        if (existing?.status === "SIGNED") {
          setStep("done");
          setLoading(false);
          return;
        }
      }

      setStep("verify");
    } else {
      setError(res.error || "Bir hata oluştu");
    }
    setLoading(false);
  }

  // ── Adım 2: Doğrulama kodu gönder ──
  async function handleSendCode() {
    if (!contractId) return;
    setLoading(true);
    setError(null);
    const res = await sendContractVerification(contractId);
    if (res.success) {
      setCodeSent(true);
    } else {
      setError(res.error || "Kod gönderilemedi");
    }
    setLoading(false);
  }

  async function handleVerifyCode(e: React.FormEvent) {
    e.preventDefault();
    if (!contractId) return;
    setLoading(true);
    setError(null);

    const res = await verifyContractEmail(contractId, verifyCode);
    if (res.success) {
      // Sözleşme metnini getir
      const contract = await getContractByProposal(proposalToken);
      if (contract?.contractText) {
        setContractText(contract.contractText);
      }
      setStep("read");
    } else {
      setError(res.error || "Doğrulama başarısız");
    }
    setLoading(false);
  }

  // ── Adım 4: İmzala (API route ile IP alınır) ──
  async function handleSign() {
    if (!contractId || !signatureData) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/contracts/sign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contractId,
          signatureData,
          userAgent: navigator.userAgent,
          device: `${window.screen.width}x${window.screen.height}`,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setStep("done");
      } else {
        setError(data.error || "İmzalama başarısız");
      }
    } catch {
      setError("Bağlantı hatası, tekrar deneyin");
    }
    setLoading(false);
  }

  // ── Adım göstergesi ──
  const steps = [
    { key: "info", label: "Bilgiler", num: 1 },
    { key: "verify", label: "Doğrulama", num: 2 },
    { key: "read", label: "Sözleşme", num: 3 },
    { key: "sign", label: "İmza", num: 4 },
  ];
  const currentStepIndex = steps.findIndex((s) => s.key === step);

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
      {/* Başlık */}
      <div className="border-b border-white/5 px-6 py-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-[#FF4500]">
          Sözleşme İmzalama
        </h2>
        <p className="mt-1 text-xs text-white/30">
          {firmName} projesi için hizmet sözleşmesi
        </p>
      </div>

      {/* Adım göstergesi */}
      {step !== "done" && (
        <div className="border-b border-white/5 px-6 py-3">
          <div className="flex items-center gap-2">
            {steps.map((s, i) => (
              <div key={s.key} className="flex items-center gap-2">
                <div
                  className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold transition-colors ${
                    i <= currentStepIndex
                      ? "bg-[#FF4500] text-white"
                      : "bg-white/5 text-white/20"
                  }`}
                >
                  {i < currentStepIndex ? (
                    <svg className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    s.num
                  )}
                </div>
                <span className={`text-[10px] ${i <= currentStepIndex ? "text-white/50" : "text-white/15"}`}>
                  {s.label}
                </span>
                {i < steps.length - 1 && (
                  <div className={`h-px w-6 ${i < currentStepIndex ? "bg-[#FF4500]/30" : "bg-white/5"}`} />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Hata mesajı */}
      {error && (
        <div className="mx-6 mt-4 rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <AnimatePresence mode="wait">
        {/* ── ADIM 1: Bilgi Formu ── */}
        {step === "info" && (
          <motion.form
            key="info"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            onSubmit={handleInfoSubmit}
            className="p-6 space-y-4"
          >
            {/* Şahıs / Şirket toggle */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setIsCompany(false)}
                className={`flex-1 rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
                  !isCompany
                    ? "border-[#FF4500]/30 bg-[#FF4500]/10 text-[#FF4500]"
                    : "border-white/10 text-white/30 hover:border-white/20"
                }`}
              >
                Şahıs / Bireysel
              </button>
              <button
                type="button"
                onClick={() => setIsCompany(true)}
                className={`flex-1 rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
                  isCompany
                    ? "border-[#FF4500]/30 bg-[#FF4500]/10 text-[#FF4500]"
                    : "border-white/10 text-white/30 hover:border-white/20"
                }`}
              >
                Şirket / Tüzel Kişi
              </button>
            </div>

            {/* Ad Soyad */}
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-white/30 mb-1.5">
                Ad Soyad *
              </label>
              <input
                type="text"
                required
                value={signerName}
                onChange={(e) => setSignerName(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-[#FF4500]/30"
                placeholder="Ad Soyad"
              />
            </div>

            {/* TC / Vergi No */}
            {isCompany ? (
              <>
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-white/30 mb-1.5">
                    Şirket Unvanı *
                  </label>
                  <input
                    type="text"
                    required
                    value={signerCompany}
                    onChange={(e) => setSignerCompany(e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-[#FF4500]/30"
                    placeholder="Şirket Adı Ltd. Şti."
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-white/30 mb-1.5">
                      Vergi No
                    </label>
                    <input
                      type="text"
                      value={signerTaxNo}
                      onChange={(e) => setSignerTaxNo(e.target.value)}
                      className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-[#FF4500]/30"
                      placeholder="Vergi No"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-white/30 mb-1.5">
                      Unvan / Pozisyon
                    </label>
                    <input
                      type="text"
                      value={signerTitle}
                      onChange={(e) => setSignerTitle(e.target.value)}
                      className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-[#FF4500]/30"
                      placeholder="Şirket Müdürü"
                    />
                  </div>
                </div>
              </>
            ) : (
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-white/30 mb-1.5">
                  TC Kimlik No
                </label>
                <input
                  type="text"
                  value={signerTcNo}
                  onChange={(e) => setSignerTcNo(e.target.value.replace(/\D/g, "").slice(0, 11))}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-[#FF4500]/30"
                  placeholder="11 haneli TC Kimlik No"
                  maxLength={11}
                />
              </div>
            )}

            {/* E-posta */}
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-white/30 mb-1.5">
                E-posta * <span className="text-[#FF4500]/50">(doğrulama kodu gönderilecek)</span>
              </label>
              <input
                type="email"
                required
                value={signerEmail}
                onChange={(e) => setSignerEmail(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-[#FF4500]/30"
                placeholder="ornek@firma.com"
              />
            </div>

            {/* Telefon + Adres */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-white/30 mb-1.5">
                  Telefon
                </label>
                <input
                  type="tel"
                  value={signerPhone}
                  onChange={(e) => setSignerPhone(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-[#FF4500]/30"
                  placeholder="05XX XXX XX XX"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-white/30 mb-1.5">
                  Adres
                </label>
                <input
                  type="text"
                  value={signerAddress}
                  onChange={(e) => setSignerAddress(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-[#FF4500]/30"
                  placeholder="Şehir / İlçe"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !signerName || !signerEmail}
              className="w-full rounded-xl bg-gradient-to-r from-[#FF4500] to-orange-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#FF4500]/20 transition-all hover:shadow-[#FF4500]/40 disabled:opacity-50"
            >
              {loading ? "İşleniyor..." : "Devam Et"}
            </button>
          </motion.form>
        )}

        {/* ── ADIM 2: E-posta Doğrulama ── */}
        {step === "verify" && (
          <motion.div
            key="verify"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="p-6 space-y-4"
          >
            <div className="text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#FF4500]/10">
                <svg className="h-6 w-6 text-[#FF4500]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white/80">E-posta Doğrulayın</h3>
              <p className="mt-1 text-sm text-white/30">
                <span className="text-[#FF4500]/70">{signerEmail}</span> adresine 6 haneli doğrulama kodu gönderilecek.
              </p>
            </div>

            {/* Bilgilendirme kutusu */}
            <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 space-y-2">
              <div className="flex items-start gap-2">
                <svg className="h-4 w-4 shrink-0 mt-0.5 text-amber-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
                <div className="space-y-1.5">
                  <p className="text-xs text-amber-300/90 font-medium">
                    Doğrulama kodu e-postanıza gönderilecektir.
                  </p>
                  <p className="text-[11px] text-white/40 leading-relaxed">
                    Gelen kutunuzda mail göremiyorsanız, lütfen
                    <span className="text-amber-400/80 font-semibold"> Önemsiz (Junk/Spam) </span>
                    klasörünü kontrol edin. Mail bu klasöre düşmüş olabilir.
                  </p>
                  <p className="text-[11px] text-white/40 leading-relaxed">
                    Önemsiz klasöründe bulduğunuzda
                    <span className="text-emerald-400/80 font-semibold"> &quot;Önemsiz Değil&quot; </span>
                    olarak işaretleyin, böylece sonraki mailler gelen kutunuza ulaşır.
                  </p>
                  <p className="text-[11px] text-white/30">
                    Kod 10 dakika geçerlidir. Süre dolarsa &quot;Tekrar gönder&quot; ile yeni kod alabilirsiniz.
                  </p>
                </div>
              </div>
            </div>

            {!codeSent ? (
              <button
                onClick={handleSendCode}
                disabled={loading}
                className="w-full rounded-xl bg-gradient-to-r from-[#FF4500] to-orange-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#FF4500]/20 transition-all hover:shadow-[#FF4500]/40 disabled:opacity-50"
              >
                {loading ? "Gönderiliyor..." : "Doğrulama Kodu Gönder"}
              </button>
            ) : (
              <form onSubmit={handleVerifyCode} className="space-y-3">
                <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-4 py-3 text-center space-y-1">
                  <div className="text-xs text-emerald-400 font-medium">
                    Doğrulama kodu gönderildi!
                  </div>
                  <div className="text-[11px] text-white/30">
                    Gelen kutunuzu veya Önemsiz/Spam klasörünüzü kontrol edin.
                  </div>
                </div>
                <input
                  type="text"
                  required
                  value={verifyCode}
                  onChange={(e) => setVerifyCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-center text-2xl font-bold tracking-[0.5em] text-white placeholder-white/20 outline-none focus:border-[#FF4500]/30"
                  placeholder="000000"
                  maxLength={6}
                  autoFocus
                />
                <button
                  type="submit"
                  disabled={loading || verifyCode.length !== 6}
                  className="w-full rounded-xl bg-gradient-to-r from-[#FF4500] to-orange-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#FF4500]/20 transition-all hover:shadow-[#FF4500]/40 disabled:opacity-50"
                >
                  {loading ? "Doğrulanıyor..." : "Doğrula"}
                </button>
                <button
                  type="button"
                  onClick={handleSendCode}
                  disabled={loading}
                  className="w-full text-center text-xs text-white/20 hover:text-white/40 transition-colors"
                >
                  Tekrar gönder
                </button>
              </form>
            )}
          </motion.div>
        )}

        {/* ── ADIM 3: Sözleşme Okuma ── */}
        {step === "read" && (
          <motion.div
            key="read"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="p-6 space-y-4"
          >
            <div className="text-center">
              <h3 className="text-sm font-semibold text-white/60">Sözleşme Metni</h3>
              <p className="mt-1 text-[10px] text-white/20">
                Lütfen sözleşmeyi dikkatle okuyun ve aşağıya kayarak devam edin.
              </p>
            </div>

            {/* Sözleşme metni - scrollable */}
            <div className="relative">
              <div
                className="h-[400px] overflow-y-auto rounded-lg border border-white/10 bg-black/30 p-4 text-xs text-white/50 leading-relaxed whitespace-pre-wrap font-mono"
                style={{ scrollBehavior: "smooth" }}
              >
                {contractText}
              </div>
              <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black/60 to-transparent rounded-b-lg" />
            </div>

            <button
              onClick={() => setStep("sign")}
              className="w-full rounded-xl bg-gradient-to-r from-[#FF4500] to-orange-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#FF4500]/20 transition-all hover:shadow-[#FF4500]/40"
            >
              Okudum, İmza Adımına Geç
            </button>
          </motion.div>
        )}

        {/* ── ADIM 4: İmza ── */}
        {step === "sign" && (
          <motion.div
            key="sign"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="p-6 space-y-4"
          >
            <div className="text-center">
              <h3 className="text-sm font-semibold text-white/60">Dijital İmza</h3>
              <p className="mt-1 text-[10px] text-white/20">
                Aşağıdaki alana parmağınızla veya mouse ile imzanızı atın.
              </p>
            </div>

            <SignatureCanvas onSignatureChange={setSignatureData} />

            {/* Kabul checkbox */}
            <label className="flex items-start gap-3 rounded-lg border border-white/5 bg-white/[0.02] p-3 cursor-pointer">
              <input
                type="checkbox"
                checked={accepted}
                onChange={(e) => setAccepted(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-white/20 accent-[#FF4500]"
              />
              <span className="text-xs text-white/40 leading-relaxed">
                İşbu sözleşmeyi okudum, anladım ve tüm maddeleri kabul ediyorum.
                İmzalayan kişi olarak, temsil ettiğim gerçek veya tüzel kişilik adına
                işlem yapma yetkisine sahip olduğumu beyan ederim.
              </span>
            </label>

            <button
              onClick={handleSign}
              disabled={loading || !signatureData || !accepted}
              className="w-full rounded-xl bg-gradient-to-r from-[#FF4500] to-orange-600 px-6 py-4 text-base font-bold text-white shadow-2xl shadow-[#FF4500]/20 transition-all hover:shadow-[#FF4500]/40 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
            >
              {loading ? "İmzalanıyor..." : "Sözleşmeyi İmzala ve Gönder"}
            </button>

            <p className="text-center text-[9px] text-white/15">
              İmza anında IP adresiniz, cihaz bilginiz ve zaman damgası kaydedilecektir.
              Bu veriler HMK m. 193 uyarınca kesin delil olarak kabul edilir.
            </p>
          </motion.div>
        )}

        {/* ── TAMAMLANDI ── */}
        {step === "done" && (
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-8 text-center"
          >
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10">
              <svg className="h-8 w-8 text-emerald-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-emerald-400">Sözleşme İmzalandı!</h3>
            <p className="mt-2 text-sm text-white/40">
              İmzalı sözleşme e-posta adresinize gönderilecektir.
              En kısa sürede projenize başlanacaktır.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <a
                href="https://wa.me/905431883425"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-4 py-2.5 text-sm text-emerald-400 transition-colors hover:bg-emerald-500/10"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                </svg>
                WhatsApp ile İletişim
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
