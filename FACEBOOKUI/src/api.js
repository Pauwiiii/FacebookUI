// Lightweight API client using fetch for /api/posts
const BASE = '/api/posts';

async function handleResponse(res) {
  const content = await res.json().catch(() => null);
  if (!res.ok) {
    // Backend returns { errors: [...] } for validation
    const err = (content && content.errors) ? content.errors.join('; ') : (content && content.message) || res.statusText;
    throw new Error(err || 'Request failed');
  }
  return content;
}

export async function listPosts() {
  const res = await fetch(BASE);
  return handleResponse(res);
}

export async function getPost(id) {
  const res = await fetch(`${BASE}/${id}`);
  return handleResponse(res);
}

export async function createPost(payload) {
  try {
    const res = await fetch(BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return await handleResponse(res);
  } catch (e) {
    console.error('createPost error', e);
    throw e;
  }
}

export async function updatePost(id, payload) {
  const res = await fetch(`${BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return handleResponse(res);
}

export async function deletePost(id) {
  const res = await fetch(`${BASE}/${id}`, {
    method: 'DELETE'
  });
  if (res.status === 204) return true;
  if (res.status === 404) return false;
  // any other status: throw
  if (!res.ok) throw new Error(res.statusText);
  return true;
}