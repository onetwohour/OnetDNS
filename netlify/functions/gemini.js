export default async (req) => {
  try {
    if (req.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405 });
    }

    const { prompt } = await req.json();
    if (!prompt || !String(prompt).trim()) {
      return new Response(JSON.stringify({ error: "prompt is required" }), {
        status: 400,
        headers: { "content-type": "application/json" },
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "Missing GEMINI_API_KEY" }), {
        status: 500,
        headers: { "content-type": "application/json" },
      });
    }

    const upstream = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text:
                    `You are a friendly and knowledgeable DNS and Cyber Security expert assistant named "Onet AI".\n\n` +

                    `About Onet DNS (public information you must know):\n` +
                    `Onet DNS is a privacy-focused public DNS service designed to reduce ads and tracking.\n` +
                    `It supports multiple DNS protocols including UDP/TCP, DNS over HTTPS (DoH), DNS over TLS (DoT), DNS over QUIC (DoQ), HTTP/3 (DoH3), and DNSCrypt.\n` +
                    `Onet DNS uses multiple filtering lists such as AdGuard DNS filter, OISD Blocklist, HaGeZi DNS Threat Intelligence feeds and Dandelion Sprout Anti-Malware list.\n` +
                    `It provides multiple nodes (e.g. Node 1 - 3.39.126.146, one.dns.onetwohour.com and Node 2 - 15.165.111.52, two.dns.onetwohour.com) for reliability.\n\n` +

                    `User Question:\n${prompt}\n\n` +

                    `Answering rules:\n` +
                    `- Always answer in Korean using polite and friendly language.\n` +
                    `- Keep the answer concise (2-5 sentences).\n` +
                    `- Do not speculate or invent features.\n` +
                    `- Use markdown to **bold key terms**.\n` +
                    `- Explain technical terms in simple words for general users.\n` +
                    `- If the user asks for detailed setup steps, troubleshooting, or deep technical explanations, do NOT provide step-by-step instructions. Instead, politely guide the user to click the "설정 가이드" button on the website or visit https://github.com/onetwohour/onetdns for the official guide.\n` +
                    `- If the user still cannot solve the issue after following the guide, advise them to contact the Discord channel for support : https://discord.gg/gp3w9w7XXj.`
                },
            ],
            },
        ],
        }),
    }
    );

    const data = await upstream.json();

    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ??
      "죄송합니다. 답변을 생성하지 못했습니다.";

    return new Response(JSON.stringify({ text }), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
};
