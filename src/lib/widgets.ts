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
    .insert(payload)
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
