// Signup page (/signup)
'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { insforge } from '@/lib/insforge';
import { MessageSquare } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string; form?: string }>({});
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const newErrors: typeof errors = {};
    if (!email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = 'Enter a valid email address';
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 8) newErrors.password = 'Password must be at least 8 characters';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const { data, error } = await insforge.auth.signUp({ email, password });
      if (error) {
        const msg = error.message || 'Something went wrong. Please try again.';
        if (msg.toLowerCase().includes('already')) {
          setErrors({ form: 'An account with this email already exists.' });
        } else if (msg.toLowerCase().includes('password')) {
          setErrors({ password: 'Password must be at least 8 characters.' });
        } else {
          setErrors({ form: msg });
        }
        return;
      }

      if (data?.requireEmailVerification) {
        setErrors({ form: 'Please check your email to verify your account, then log in.' });
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
          <h1 className="mt-6 text-2xl font-bold">Create your account</h1>
          <p className="mt-2 text-sm text-gray-400">Start building your chat widget in minutes.</p>
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
            placeholder="Minimum 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
            autoComplete="new-password"
            required
          />
          {errors.form && (
            <p className="text-sm text-red-400">{errors.form}</p>
          )}
          <Button type="submit" loading={loading} className="w-full">
            Create Account
          </Button>
        </form>

        <p className="text-center text-sm text-gray-400">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-brand-primary hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
