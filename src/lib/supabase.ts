import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabaseServiceKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

// Create a mock Supabase client for when environment variables are missing
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createMockClient = (): SupabaseClient<any, 'public'> => {
  const mockClient = {
    from: () => ({
      select: () => ({
        data: null,
        error: new Error('Supabase not configured'),
      }),
      insert: () => ({
        data: null,
        error: new Error('Supabase not configured'),
      }),
      update: () => ({
        eq: () => ({ data: null, error: new Error('Supabase not configured') }),
      }),
      delete: () => ({
        eq: () => ({ data: null, error: new Error('Supabase not configured') }),
      }),
    }),
    auth: {
      getUser: () => ({
        data: { user: null },
        error: new Error('Supabase not configured'),
      }),
      signInWithPassword: () => ({
        data: { user: null, session: null },
        error: new Error('Supabase not configured'),
      }),
      signOut: () => ({ error: new Error('Supabase not configured') }),
      onAuthStateChange: () => ({
        data: { subscription: { unsubscribe: () => {} } },
      }),
    },
    storage: {
      from: () => ({
        upload: () => ({
          data: null,
          error: new Error('Supabase not configured'),
        }),
        getPublicUrl: () => ({ data: { publicUrl: '' } }),
      }),
    },
  } as unknown as SupabaseClient<any, 'public'>; // eslint-disable-line @typescript-eslint/no-explicit-any
  return mockClient;
};

// Export a mock client if environment variables are missing
const isConfigured = supabaseUrl && supabaseAnonKey;

// Create the main Supabase client
const supabaseClientOptions = {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const supabase: SupabaseClient<any, 'public'> = isConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, supabaseClientOptions)
  : createMockClient();

// Create admin client with a different storage key to avoid multiple GoTrueClient instances
// The admin client uses a separate storage key so it doesn't conflict with the main client
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const supabaseAdmin: SupabaseClient<any, 'public'> | null =
  supabaseServiceKey && isConfigured
    ? createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
          ...supabaseClientOptions.auth,
          // Use a different storage key for admin to avoid GoTrueClient conflict
          storageKey: 'supabase.auth.admin-token',
        },
      })
    : null;
