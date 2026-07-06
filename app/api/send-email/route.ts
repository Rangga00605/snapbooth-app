import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

export const runtime = "nodejs";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function parseDataUrl(dataUrl: string) {
  const match = dataUrl.match(/^data:(.+);base64,(.+)$/);
  if (!match) return null;
  return {
    mimeType: match[1],
    base64: match[2]
  };
}

async function saveToSupabase(email: string, base64: string, mimeType: string) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const bucket = process.env.PHOTOBOOTH_BUCKET || "photobooth-results";

  if (!supabaseUrl || !serviceKey) {
    return { publicUrl: null, sessionId: null };
  }

  const supabase = createClient(supabaseUrl, serviceKey);
  const extension = mimeType.includes("png") ? "png" : "jpg";
  const filename = `results/snapbooth-${Date.now()}.${extension}`;
  const buffer = Buffer.from(base64, "base64");

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(filename, buffer, {
      contentType: mimeType,
      upsert: false
    });

  if (uploadError) {
    console.error("Supabase upload error:", uploadError.message);
    return { publicUrl: null, sessionId: null };
  }

  const { data: publicData } = supabase.storage.from(bucket).getPublicUrl(filename);

  const { data: sessionData, error: sessionError } = await supabase
    .from("sessions")
    .insert({ template_id: null, status: "selesai" })
    .select("id")
    .single();

  if (sessionError) {
    console.error("Supabase session insert error:", sessionError.message);
  }

  const sessionId = sessionData?.id || null;

  await supabase.from("final_results").insert({
    session_id: sessionId,
    file_result: publicData.publicUrl,
    output_type: "email"
  });

  await supabase.from("email_logs").insert({
    session_id: sessionId,
    email_tujuan: email,
    file_result: publicData.publicUrl,
    status: "diproses"
  });

  return { publicUrl: publicData.publicUrl, sessionId };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = String(body.email || "").trim();
    const imageData = String(body.imageData || "");

    if (!isValidEmail(email)) {
      return NextResponse.json({ message: "Format email tidak valid." }, { status: 400 });
    }

    const parsed = parseDataUrl(imageData);
    if (!parsed) {
      return NextResponse.json({ message: "File foto tidak valid." }, { status: 400 });
    }

    const resendKey = process.env.RESEND_API_KEY;
    if (!resendKey) {
      return NextResponse.json(
        {
          message:
            "RESEND_API_KEY belum diisi. Download/print tetap bisa dipakai, tetapi kirim email perlu konfigurasi Resend."
        },
        { status: 500 }
      );
    }

    const saved = await saveToSupabase(email, parsed.base64, parsed.mimeType);
    const resend = new Resend(resendKey);
    const filename = parsed.mimeType.includes("png") ? "snapbooth-result.png" : "snapbooth-result.jpg";

    const emailResult = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "SnapBooth <onboarding@resend.dev>",
      to: email,
      subject: "Hasil Foto SnapBooth Kamu",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
          <h2>Foto SnapBooth kamu sudah siap 🎉</h2>
          <p>Terima kasih sudah menggunakan SnapBooth.</p>
          <p>Hasil foto kamu kami lampirkan pada email ini.</p>
          ${saved.publicUrl ? `<p>Link foto: <a href="${saved.publicUrl}">${saved.publicUrl}</a></p>` : ""}
        </div>
      `,
      attachments: [
        {
          filename,
          content: parsed.base64
        }
      ]
    });

    if (saved.sessionId && process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY
      );
      await supabase
        .from("email_logs")
        .update({ status: "berhasil", sent_at: new Date().toISOString() })
        .eq("session_id", saved.sessionId)
        .eq("email_tujuan", email);
    }

    return NextResponse.json({ message: "Foto berhasil dikirim ke email.", data: emailResult });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Terjadi kesalahan saat mengirim email.", detail: String(error) },
      { status: 500 }
    );
  }
}
