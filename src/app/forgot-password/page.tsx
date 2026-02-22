// Forgot Password page (/forgot-password)
'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { insforge } from '@/lib/insforge';
import { MessageSquare, ArrowLeft } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email.trim()) {
      setError('Email is required');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const { error: resetError } = await insforge.auth.sendResetPasswordEmail({ email });
      if (resetError) {
        setError(resetError.message || 'Something went wrong. Please try again.');
        return;
      }
      setSent(true);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 text-2xl font-bold">
            <MessageSquare className="h-7 w-7 text-brand-primary" />
            Nexora
          </Link>
          <h1 className="mt-6 text-2xl font-bold">Reset your password</h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Enter your email and we&apos;ll send you a reset link.
          </p>
        </div>

        {sent ? (
          <div className="rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 p-8 text-center space-y-4">
            <p className="text-green-400 font-medium">Check your email</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              If an account exists for <span className="font-medium">{email}</span>, you&apos;ll receive a password reset link shortly.
            </p>
            <Link href="/login" className="inline-flex items-center gap-1 text-sm text-brand-primary hover:underline">
              <ArrowLeft className="h-4 w-4" />
              Back to login
            </Link>
          </div>
        ) : (
          <>
            <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 p-8">
              <Input
                label="Email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={error}
                autoComplete="email"
                required
              />
              <Button type="submit" loading={loading} className="w-full">
                Send Reset Link
              </Button>
            </form>

            <p className="text-center text-sm text-gray-500 dark:text-gray-400">
              <Link href="/login" className="inline-flex items-center gap-1 font-medium text-brand-primary hover:underline">
                <ArrowLeft className="h-4 w-4" />
                Back to login
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
