export async function getTrackAccess(trackId: string) {
  try {
    const res = await fetch(`/api/resolve-audio?track_id=${encodeURIComponent(trackId)}`);
    const json = await res.json();
    return json; // contains access, url, message, etc.
  } catch (err) {
    console.error('Entitlement check failed', err);
    return { access: 'unknown' };
  }
}
