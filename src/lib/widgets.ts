// Widget CRUD operations via InsForge database SDK
import { insforge } from './insforge';
import type { WidgetRow, CreateWidgetPayload, UpdateWidgetPayload } from './types';

export async function listWidgets(userId: string): Promise<{ data: WidgetRow[] | null; error: string | null }> {
  const { data, error } = await insforge.database
    .from('widgets')
    .select()
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) return { data: null, error: error.message || 'Failed to load widgets' };
  return { data: data as WidgetRow[], error: null };
}

export async function getWidget(widgetId: string, userId: string): Promise<{ data: WidgetRow | null; error: string | null }> {
  const { data, error } = await insforge.database
    .from('widgets')
    .select()
    .eq('id', widgetId)
    .eq('user_id', userId)
    .maybeSingle();

  if (error) return { data: null, error: error.message || 'Failed to load widget' };
  return { data: data as WidgetRow | null, error: null };
}

export async function createWidget(payload: CreateWidgetPayload): Promise<{ data: WidgetRow | null; error: string | null }> {
  const { data, error } = await insforge.database
    .from('widgets')
    .insert([payload])
    .select()
    .single();

  if (error) return { data: null, error: error.message || 'Failed to create widget' };
  return { data: data as WidgetRow, error: null };
}

export async function updateWidget(
  widgetId: string,
  userId: string,
  payload: UpdateWidgetPayload
): Promise<{ data: WidgetRow | null; error: string | null }> {
  const { data, error } = await insforge.database
    .from('widgets')
    .update(payload)
    .eq('id', widgetId)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) return { data: null, error: error.message || 'Failed to update widget' };
  return { data: data as WidgetRow, error: null };
}

export async function deleteWidget(widgetId: string, userId: string): Promise<{ error: string | null }> {
  const { error } = await insforge.database
    .from('widgets')
    .delete()
    .eq('id', widgetId)
    .eq('user_id', userId);

  if (error) return { error: error.message || 'Failed to delete widget' };
  return { error: null };
}

export async function countWidgets(userId: string): Promise<{ count: number; error: string | null }> {
  const { data, error } = await insforge.database
    .from('widgets')
    .select('id', { count: 'exact' })
    .eq('user_id', userId);

  if (error) return { count: 0, error: error.message || 'Failed to count widgets' };
  return { count: data?.length ?? 0, error: null };
}

export async function cloneWidget(widgetId: string, userId: string): Promise<{ data: WidgetRow | null; error: string | null }> {
  const { data: original, error: fetchError } = await getWidget(widgetId, userId);
  if (fetchError || !original) {
    return { data: null, error: fetchError ?? 'Widget not found' };
  }

  // Compute the new name
  let newName = original.name;
  const copyMatch = newName.match(/^(.*)\(Copy(?:\s(\d+))?\)$/);
  if (copyMatch) {
    const base = copyMatch[1].trimEnd();
    const n = copyMatch[2] ? parseInt(copyMatch[2], 10) + 1 : 2;
    newName = `${base} (Copy ${n})`;
  } else {
    newName = `${newName} (Copy)`;
  }

  const { id: _id, created_at: _ca, updated_at: _ua, ...rest } = original as WidgetRow & { updated_at?: string };
  void _id; void _ca; void _ua;

  const { data, error } = await insforge.database
    .from('widgets')
    .insert([{ ...rest, name: newName, user_id: userId }])
    .select()
    .single();

  if (error) return { data: null, error: error.message || 'Failed to clone widget' };
  return { data: data as WidgetRow, error: null };
}
