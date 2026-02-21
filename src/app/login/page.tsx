// Login page (/login)
'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { insforge } from '@/lib/insforge';
import { MessageSquare } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string; form?: string }>({});
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const newErrors: typeof errors = {};
    if (!email.trim()) newErrors.email = 'Email is required';
    if (!password) newErrors.password = 'Password is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const { error } = await insforge.auth.signInWithPassword({ email, password });
      if (error) {
        setErrors({ form: 'Invalid email or password.' });
        return;
      }
      router.push('/dashboard');
    } catch {
      setErrors({ form: 'Something went wrong. Please try again.' });
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
          <h1 className="mt-6 text-2xl font-bold">Welcome back</h1>
          <p className="mt-2 text-sm text-gray-400">Log in to manage your chat widgets.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-white/10 bg-white/5 p-8">
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
            autoComplete="email"
            required
          />
          <Input
            label="Password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
            autoComplete="current-password"
            required
          />
          {errors.form && (
            <p className="text-sm text-red-400">{errors.form}</p>
          )}
          <Button type="submit" loading={loading} className="w-full">
            Log In
          </Button>
          <div className="text-right">
            <Link href="/forgot-password" className="text-sm text-brand-primary hover:underline">
              Forgot password?
            </Link>
          </div>
        </form>

        <p className="text-center text-sm text-gray-400">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="font-medium text-brand-primary hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
