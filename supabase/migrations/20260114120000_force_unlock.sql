-- Force the audio bucket to be PUBLIC (The only thing we care about right now)
UPDATE storage.buckets SET public = true WHERE id = 'audio';
