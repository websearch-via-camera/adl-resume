// Cloudflare Pages Function for handling guestbook submissions
// Sends entries via email for manual review and addition to the codebase

interface GuestbookEntry {
  name: string;
  message: string;
  emoji: string;
  date: string;
}

interface Env {
  RESEND_API_KEY: string;
  CONTACT_EMAIL: string;
}

type PagesFunction<Env = unknown> = (context: EventContext<Env, any, Record<string, unknown>>) => Response | Promise<Response>;

interface EventContext<Env = unknown, P extends string = any, Data extends Record<string, unknown> = Record<string, unknown>> {
  request: Request;
  functionPath: string;
  waitUntil: (promise: Promise<any>) => void;
  passThroughOnException: () => void;
  next: (input?: Request | string, init?: RequestInit) => Promise<Response>;
  env: Env;
  params: Record<P, string>;
  data: Data;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (context.request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const entry: GuestbookEntry = await context.request.json();

    // Validate
    if (!entry.name || !entry.message) {
      return new Response(
        JSON.stringify({ error: 'Name and message are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Sanitize inputs
    const sanitizedName = entry.name.slice(0, 50).trim();
    const sanitizedMessage = entry.message.slice(0, 280).trim();
    const sanitizedEmoji = entry.emoji || "👋";

    // Format as code snippet for easy copy-paste into Guestbook.tsx
    const codeSnippet = `{
  name: "${sanitizedName.replace(/"/g, '\\"')}",
  message: "${sanitizedMessage.replace(/"/g, '\\"').replace(/\n/g, ' ')}",
  date: "${entry.date}",
  emoji: "${sanitizedEmoji}"
},`;

    // Send email via Resend
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${context.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Portfolio Guestbook <onboarding@resend.dev>',
        to: context.env.CONTACT_EMAIL || 'kiarasha@alum.mit.edu',
        subject: `📝 New Guestbook Entry from ${sanitizedName}`,
        html: `
          <h2>New Guestbook Entry ${sanitizedEmoji}</h2>
          <p><strong>From:</strong> ${sanitizedName}</p>
          <p><strong>Date:</strong> ${entry.date}</p>
          <p><strong>Message:</strong></p>
          <blockquote style="border-left: 3px solid #ccc; padding-left: 12px; margin: 12px 0; color: #555;">
            ${sanitizedMessage}
          </blockquote>
          
          <hr style="margin: 24px 0; border: none; border-top: 1px solid #eee;">
          
          <h3>📋 Copy-paste into Guestbook.tsx:</h3>
          <pre style="background: #f5f5f5; padding: 12px; border-radius: 6px; font-size: 13px; overflow-x: auto;">
${codeSnippet}
          </pre>
        `,
        text: `
New Guestbook Entry ${sanitizedEmoji}

From: ${sanitizedName}
Date: ${entry.date}
Message: ${sanitizedMessage}

---

Copy-paste into Guestbook.tsx:

${codeSnippet}
        `,
      }),
    });

    if (!resendResponse.ok) {
      const error = await resendResponse.text();
      console.error('Resend API error:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to submit entry' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Guestbook entry submitted for review' }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Guestbook error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
};
