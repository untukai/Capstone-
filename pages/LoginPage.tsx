
import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/Button';
import Input from '../components/Input';
import { User } from '../types';
import { useNotification } from '../hooks/useNotification';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'pembeli' | 'penjual'>('pembeli');
  const { login } = useAuth();
  const { showNotification } = useNotification();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Update email default saat ganti role untuk kenyamanan demo
  React.useEffect(() => {
    if (role === 'penjual') {
        setEmail(prev => prev || 'penjual@example.com');
    } else {
        setEmail(prev => prev === 'penjual@example.com' ? '' : prev);
    }
  }, [role]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim() || !password.trim()) {
        showNotification('Gagal', 'Email dan password harus diisi.', 'error');
        return;
    }
    
    try {
        await login(email, password, role);
        showNotification('Berhasil Masuk', `Selamat datang kembali sebagai ${role === 'penjual' ? 'Penjual' : 'Pembeli'}!`);
        
        // Redirect logic
        const redirectUrl = searchParams.get('redirect');
        if (redirectUrl) {
            navigate(redirectUrl);
        } else {
            // Jika penjual, arahkan ke dashboard. Jika pembeli, ke home/profile.
            navigate(role === 'penjual' ? '/seller' : '/profile');
        }
    } catch (error) {
        showNotification('Login Gagal', 'Terjadi kesalahan saat masuk.', 'error');
        console.error(error);
    }
  };

  return (
    <div className="flex justify-center items-center py-12 px-4">
      <div className="w-full max-w-md bg-white dark:bg-neutral-800 p-8 rounded-xl shadow-lg">
        <div className="text-center">
            <h1 className="text-3xl font-bold text-neutral-800 dark:text-neutral-100">Selamat Datang</h1>
            <p className="text-neutral-500 dark:text-neutral-400 mt-2">Masuk untuk mengakses akun KODIK Anda.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6 mt-8">
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-200 mb-2">Masuk sebagai:</label>
            <div className="grid grid-cols-2 gap-2 rounded-lg bg-neutral-100 dark:bg-neutral-700/50 p-1">
              <button
                type="button"
                onClick={() => setRole('pembeli')}
                className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${role === 'pembeli' ? 'bg-primary text-white shadow' : 'text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'}`}
              >
                Pembeli
              </button>
              <button
                type="button"
                onClick={() => setRole('penjual')}
                className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${role === 'penjual' ? 'bg-primary text-white shadow' : 'text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'}`}
              >
                Penjual
              </button>
            </div>
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-neutral-700 dark:text-neutral-200 mb-1">Email</label>
            <Input 
              type="email" 
              id="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              placeholder={role === 'penjual' ? 'penjual@example.com' : 'nama@email.com'}
            />
          </div>
          <div>
            <label htmlFor="password"  className="block text-sm font-medium text-neutral-700 dark:text-neutral-200 mb-1">Password</label>
            <Input 
              type="password" 
              id="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              placeholder="********"
            />
          </div>
          <Button type="submit" className="w-full !font-bold !py-3">
            Masuk sebagai {role === 'penjual' ? 'Penjual' : 'Pembeli'}
          </Button>
        </form>
        <p className="text-center text-sm text-neutral-600 dark:text-neutral-300 mt-8">
          Belum punya akun? <a href="#" className="font-medium text-primary hover:underline">Daftar di sini</a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
