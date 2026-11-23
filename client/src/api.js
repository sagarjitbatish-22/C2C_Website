// API base URL — proxied through Vite dev server
const BASE = '/api';

// Generic fetch helper
async function request(endpoint, options = {}) {
  const token = localStorage.getItem('c2c_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const res = await fetch(`${BASE}${endpoint}`, { ...options, headers });
  const data = await res.json();

  if (!data.success && res.status >= 400) {
    throw new Error(data.message || 'Something went wrong');
  }
  return data;
}

export const api = {
  // Auth
  register: (body) => request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login:    (body) => request('/auth/login',    { method: 'POST', body: JSON.stringify(body) }),
  me:       ()     => request('/auth/me'),

  // Events
  getEvents:  ()       => request('/events'),
  createEvent:(body)   => request('/events', { method: 'POST', body: JSON.stringify(body) }),
  rsvpEvent:  (id)     => request(`/events/${id}/rsvp`, { method: 'POST' }),
  deleteEvent:(id)     => request(`/events/${id}`, { method: 'DELETE' }),

  // Team
  getTeam:    ()     => request('/team'),
  addMember:  (body) => request('/team', { method: 'POST', body: JSON.stringify(body) }),

  // Queries
  submitQuery:(body) => request('/queries', { method: 'POST', body: JSON.stringify(body) }),
  getQueries: ()     => request('/queries'),
  replyQuery: (id, body) => request(`/queries/${id}/reply`, { method: 'PATCH', body: JSON.stringify(body) }),

  // Instagram
  getInstagram: () => request('/instagram'),
  addPost:     (body) => request('/instagram', { method: 'POST', body: JSON.stringify(body) }),
};
