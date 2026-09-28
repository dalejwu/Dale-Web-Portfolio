import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl !== 'https://your-project.supabase.co'
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Fetch top 10 leaderboard entries from Supabase
 */
export async function fetchRemoteLeaderboard() {
  if (!isSupabaseConfigured || !supabase) {
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('leaderboard')
      .select('id, name, bugs, score, diff, created_at')
      .order('score', { ascending: false })
      .order('bugs', { ascending: false })
      .limit(10);

    if (error) {
      console.warn('[Leaderboard] Supabase fetch error:', error.message);
      return null;
    }

    return (data || []).map((row) => ({
      id: row.id,
      name: row.name,
      bugs: row.bugs,
      score: row.score,
      diff: row.diff,
      date: row.created_at ? row.created_at.split('T')[0] : new Date().toISOString().split('T')[0]
    }));
  } catch (err) {
    console.warn('[Leaderboard] Unexpected error fetching scores:', err);
    return null;
  }
}

/**
 * Submit score to Supabase leaderboard
 */
export async function submitRemoteScore({ name, bugs, score, diff }) {
  if (!isSupabaseConfigured || !supabase) {
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('leaderboard')
      .insert([
        {
          name: name.slice(0, 14),
          bugs,
          score,
          diff
        }
      ])
      .select();

    if (error) {
      console.warn('[Leaderboard] Supabase insert error:', error.message);
      return null;
    }

    return data?.[0] || null;
  } catch (err) {
    console.warn('[Leaderboard] Error saving score:', err);
    return null;
  }
}

/**
 * Subscribe to real-time changes on the leaderboard table
 */
export function subscribeToLeaderboard(onNewEntry) {
  if (!isSupabaseConfigured || !supabase) {
    return () => {};
  }

  try {
    const channel = supabase
      .channel('leaderboard-realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'leaderboard' },
        (payload) => {
          if (payload.new && onNewEntry) {
            onNewEntry({
              id: payload.new.id,
              name: payload.new.name,
              bugs: payload.new.bugs,
              score: payload.new.score,
              diff: payload.new.diff,
              date: payload.new.created_at
                ? payload.new.created_at.split('T')[0]
                : new Date().toISOString().split('T')[0]
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  } catch (err) {
    console.warn('[Leaderboard] Realtime subscription error:', err);
    return () => {};
  }
}
