/**
 * POST /api/voice/speak
 *
 * Body: { slug: string, text?: string }
 *
 * - slug must be a known PerformerSpec slug; voice_id/settings resolved server-side.
 * - If text is omitted, uses the performer's signatureLine.
 * - Streams MP3 back to the client (Content-Type: audio/mpeg).
 * - On-demand only. For characters we've pre-rendered (voiceSampleUrl set),
 *   the client should fetch the static file instead — cheaper, no credits spent.
 *
 * Key never leaves the server.
 */
import { NextResponse } from "next/server";
import { PERFORMER_BY_SLUG } from "@/data/performers";

export const runtime = "nodejs";
export const maxDuration = 30;

// Cap to prevent a runaway prompt burning through credits.
const MAX_TEXT_LEN = 500;

export async function POST(req: Request) {
  const started = Date.now();
  const key = process.env.ELEVENLABS_API_KEY;
  if (!key) {
    console.warn("[voice/speak] ELEVENLABS_API_KEY missing");
    return NextResponse.json({ error: "ELEVENLABS_API_KEY not configured" }, { status: 503 });
  }

  let body: { slug?: string; text?: string } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid JSON body" }, { status: 400 });
  }

  const slug = body.slug?.toLowerCase();
  if (!slug) return NextResponse.json({ error: "slug required" }, { status: 400 });

  const performer = PERFORMER_BY_SLUG[slug];
  if (!performer) {
    return NextResponse.json({ error: `unknown performer: ${slug}` }, { status: 404 });
  }

  const text = (body.text ?? performer.signatureLine).slice(0, MAX_TEXT_LEN);
  if (!text.trim()) {
    return NextResponse.json({ error: "empty text" }, { status: 400 });
  }

  const elevenUrl = `https://api.elevenlabs.io/v1/text-to-speech/${performer.voiceId}?output_format=mp3_44100_128`;

  const upstream = await fetch(elevenUrl, {
    method: "POST",
    headers: {
      "xi-api-key": key,
      "Content-Type": "application/json",
      Accept: "audio/mpeg",
    },
    body: JSON.stringify({
      text,
      model_id: "eleven_multilingual_v2",
      voice_settings: {
        stability: performer.voiceSettings.stability,
        similarity_boost: performer.voiceSettings.similarityBoost,
        style: performer.voiceSettings.style ?? 0.15,
        use_speaker_boost: performer.voiceSettings.useSpeakerBoost ?? true,
      },
    }),
  });

  if (!upstream.ok) {
    const errText = await upstream.text().catch(() => "");
    console.error(
      `[voice/speak] upstream_error slug=${slug} status=${upstream.status} ms=${Date.now() - started}`,
    );
    return NextResponse.json(
      { error: "ElevenLabs upstream error", status: upstream.status, detail: errText.slice(0, 300) },
      { status: 502 },
    );
  }

  console.info(`[voice/speak] ok slug=${slug} chars=${text.length} ms=${Date.now() - started}`);

  // Stream MP3 back — ReadableStream plumbed through Response
  return new Response(upstream.body, {
    status: 200,
    headers: {
      "Content-Type": "audio/mpeg",
      "Cache-Control": "no-store",
      "X-Voice-Slug": slug,
    },
  });
}
