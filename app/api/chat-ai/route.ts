import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export const dynamic = "force-dynamic";

const SYSTEM_PROMPT = `Sen Vorte Studio'nun web sitesindeki chatbot asistanısın. Kısa ve net yanıt ver (max 2-3 cümle).

KESİNLİKLE YAPAMAZSIN — bu kuralları asla çiğneme:
- Fiyat söyleyemezsin, tahmin bile veremezsin
- Süre taahhüdü veremezsin ("2 haftada biter" gibi)
- Olmayan özellik vaat edemezsin
- Rakip firma hakkında yorum yapamazsın
- İndirim, kampanya uyduramaz veya taahhüt edemezsin
- Teknik detay uydurmaman gerekir
- Hosting fiyatı veya domain fiyatı söyleyemezsin
- "Kesinlikle", "garanti" gibi kesin ifadeler kullanamazsın

YAPABİLİRSİN:
- Vorte Studio'nun ne yaptığını anlat: Next.js ile modern, hızlı, SEO uyumlu web siteleri
- Genel süreç hakkında bilgi ver: Briefing → Tasarım → Geliştirme → Test → Teslim
- Hosting gereksinimleri hakkında yönlendir: Node.js destekli VPS gerekir, shared hosting uygun değildir
- Domain hakkında: Müşteri kendi adına kayıt ettirmelidir, İsimTescil veya Natro önerilir
- Hizmet türlerini say: Tanıtım sitesi, e-ticaret, portföy, katalog, randevu sistemi
- "Detaylı bilgiyi ekibimiz görüşmede paylaşacak" diyebilirsin
- Müşteriyi formu tamamlamaya teşvik edebilirsin

CEVAP VEREMEZSEN VEYA EMİN DEĞİLSEN:
"Bu konuyu not aldım, ekibimiz size detaylı bilgi verecek. Şimdi teklif hazırlığına devam edelim mi?"

ÖNEMLİ: Her yanıtın sonunda müşteriyi forma devam etmeye yönlendir.
Türkçe konuş. Kısa ve sıcak ol. "Siz" hitabı kullan.`;

export async function POST(req: Request) {
  try {
    const { question, firmName, sector, city, step } = await req.json();

    if (!question || typeof question !== "string" || question.length > 500) {
      return NextResponse.json(
        { answer: "Sorunuzu anlayamadım. Lütfen kısa ve net bir şekilde sorunuzu yazın." },
        { status: 200 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      // API key yoksa sabit fallback yanıt
      return NextResponse.json({
        answer: "Sorunuzu not aldım, ekibimiz size detaylı bilgi verecek. Şimdi teklif hazırlığına devam edelim mi?",
      });
    }

    const ai = new GoogleGenAI({ apiKey });

    const contextPrompt = `
Müşteri bilgileri:
- Firma: ${firmName || "Belirtilmedi"}
- Sektör: ${sector || "Belirtilmedi"}
- Şehir: ${city || "Belirtilmedi"}
- Chatbot adımı: ${step || "Bilinmiyor"}

Müşterinin sorusu: "${question}"

Kısa ve net yanıt ver (max 2-3 cümle). Sonunda formu tamamlamaya yönlendir.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [{ role: "user", parts: [{ text: contextPrompt }] }],
      config: {
        systemInstruction: SYSTEM_PROMPT,
        maxOutputTokens: 200,
        temperature: 0.3, // Düşük temperature = daha tutarlı, daha az halüsinasyon
      },
    });

    const answer =
      response.text?.trim() ||
      "Sorunuzu not aldım, ekibimiz size detaylı bilgi verecek. Formu tamamlayarak teklif sürecini başlatalım mı?";

    return NextResponse.json({ answer });
  } catch (err) {
    console.error("Chat AI hatası:", err);
    return NextResponse.json({
      answer: "Şu an teknik bir sorun yaşıyoruz. Sorunuzu not aldım, ekibimiz size dönüş yapacak. Formu tamamlamaya devam edebilirsiniz.",
    });
  }
}
