// Settings page — profile, appearance, danger zone
'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@insforge/nextjs';
import { insforge } from '@/lib/insforge';
import { useTheme } from '@/components/ThemeProvider';
import { useToast } from '@/components/ui/Toast';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import Spinner from '@/components/ui/Spinner';
import { Sun, Moon, Monitor } from 'lucide-react';

const THEME_OPTIONS = [
  { value: 'light' as const, label: 'Light', Icon: Sun },
  { value: 'dark' as const, label: 'Dark', Icon: Moon },
  { value: 'system' as const, label: 'System', Icon: Monitor },
];

export default function SettingsPage() {
  const { user, isLoaded } = useUser();
  const { theme, setTheme } = useTheme();
  const { showToast } = useToast();

  const [fullName, setFullName] = useState('');
  const [saving, setSaving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (user?.profile?.name) {
      setFullName(user.profile.name);
    }
  }, [user]);

  async function handleSaveProfile() {
    setSaving(true);
    try {
      const { error } = await insforge.auth.setProfile({ name: fullName.trim() });
      if (error) {
        showToast(error.message ?? 'Failed to save profile.', 'error');
      } else {
        showToast('Profile updated!', 'success');
      }
    } catch {
      showToast('Something went wrong.', 'error');
    } finally {
      setSaving(false);
    }
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center py-24">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <h1 className="text-2xl font-bold">Settings</h1>

      {/* Profile Section */}
      <section className="rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 p-6">
        <h2 className="text-lg font-semibold mb-4">Profile</h2>
        <div className="space-y-4">
          <Input
            label="Full Name"
            placeholder="Your full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            maxLength={100}
          />
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-200">
              Email
            </label>
            <div className="rounded-lg border border-gray-200 dark:border-white/20 bg-gray-50 dark:bg-white/5 px-3 py-2.5 text-sm text-gray-500 dark:text-gray-400">
              {user?.email ?? ''}
            </div>
          </div>
          <Button onClick={handleSaveProfile} loading={saving}>
            Save Changes
          </Button>
        </div>
      </section>

      {/* Appearance Section */}
      <section className="rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 p-6">
        <h2 className="text-lg font-semibold mb-4">Appearance</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Choose your preferred theme for the Nexora dashboard.
        </p>
        <div className="flex gap-3">
          {THEME_OPTIONS.map(({ value, label, Icon }) => (
            <button
              key={value}
              type="button"
              onClick={() => setTheme(value)}
              className={`flex flex-1 flex-col items-center gap-2 rounded-lg border p-4 text-sm font-medium transition ${
                theme === value
                  ? 'border-brand-primary bg-brand-primary/5 text-brand-primary'
                  : 'border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:border-gray-300 dark:hover:border-white/20'
              }`}
            >
              <Icon className="h-5 w-5" />
              {label}
            </button>
          ))}
        </div>
      </section>

      {/* Danger Zone */}
      <section className="rounded-xl border border-red-200 dark:border-red-900/50 bg-white dark:bg-white/5 p-6">
        <h2 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-2">Danger Zone</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Permanently delete your account and all associated data.
        </p>
        <Button
          variant="destructive"
          onClick={() => setShowDeleteModal(true)}
        >
          Delete Account
        </Button>
      </section>

      <Modal
        open={showDeleteModal}
        title="Delete Account"
        message="Please contact support to delete your account. This feature is not yet available for self-service."
        confirmLabel="OK"
        onConfirm={() => setShowDeleteModal(false)}
        onCancel={() => setShowDeleteModal(false)}
      />
    </div>
  );
}
