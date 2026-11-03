export const prerender = false;

import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  const body = await request.json().catch(() => null);

  if (!body?.email) {
    return new Response(JSON.stringify({ error: 'Email is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const apiKey = import.meta.env.LOOPS_API_KEY;
  if (!apiKey) {
    console.error('LOOPS_API_KEY is not set');
    return new Response(JSON.stringify({ error: 'Server configuration error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const res = await fetch('https://app.loops.so/api/v1/contacts/create', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: body.email,
        firstName: body.firstName || '',
        source: body.source || 'website',
        userGroup: body.userGroup || 'subscribers',
        ...(body.bookTitle ? { bookTitle: body.bookTitle } : {}),
      }),
    });

    if (res.ok) {
      return new Response(JSON.stringify({ success: true }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const err = await res.json().catch(() => ({}));
    return new Response(JSON.stringify({ error: err.message || 'Signup failed' }), {
      status: res.status,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Network error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
