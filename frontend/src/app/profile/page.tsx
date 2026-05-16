"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, User, Lock, Save, Loader2, LogOut } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { http } from "@/services/api/http";

export default function ProfilePage() {
  const router = useRouter();
  const { user, isHydrated, clearAuth, setAuth, token } = useAuthStore();
  
  const [activeTab, setActiveTab] = useState<"info" | "security">("info");
  
  // Profile Form State
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState({ type: "", text: "" });

  // Password Form State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    if (isHydrated && !user) {
      router.push("/login");
    } else if (user) {
      setName(user.name || "");
      // Since phone might not be in AuthUser type natively, we use any cast or just empty if not exists
      setPhone((user as any).phone || "");
    }
  }, [user, isHydrated, router]);

  if (!isHydrated || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingProfile(true);
    setProfileMessage({ type: "", text: "" });

    try {
      const res = await http.put("/api/auth/profile", { name, phone });
      if (res.success) {
        setProfileMessage({ type: "success", text: "Profil berhasil diperbarui!" });
        // Update local store
        if (token && res.data) {
          setAuth({ user: res.data as any, token });
        }
      } else {
        setProfileMessage({ type: "error", text: res.message || "Gagal memperbarui profil." });
      }
    } catch (err: any) {
      setProfileMessage({ type: "error", text: err.message || "Terjadi kesalahan koneksi." });
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: "error", text: "Konfirmasi password tidak cocok." });
      return;
    }

    setIsUpdatingPassword(true);
    setPasswordMessage({ type: "", text: "" });

    try {
      const res = await http.put("/api/auth/change-password", {
        current_password: currentPassword,
        password: newPassword,
        password_confirmation: confirmPassword
      });

      if (res.success) {
        setPasswordMessage({ type: "success", text: "Password berhasil diubah!" });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        // If there are validation errors, display them
        const errText = res.errors ? Object.values(res.errors).flat().join(", ") : res.message;
        setPasswordMessage({ type: "error", text: errText || "Gagal mengubah password." });
      }
    } catch (err: any) {
      setPasswordMessage({ type: "error", text: err.message || "Terjadi kesalahan koneksi." });
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center md:items-start md:pt-10 pb-24 md:pb-12">
      <div className="w-full max-w-2xl bg-white min-h-[calc(100vh-6rem)] md:min-h-0 md:rounded-3xl md:shadow-sm md:border md:border-gray-100 flex flex-col overflow-hidden">
        
        {/* Header */}
        <header className="px-4 h-14 flex items-center border-b border-gray-100 shrink-0 sticky top-0 bg-white z-10">
          <button onClick={() => router.back()} className="h-10 w-10 flex items-center justify-center text-gray-900 -ml-2 hover:bg-gray-50 rounded-full transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-base font-bold text-gray-900 ml-2">Pengaturan Profil</h1>
          
          <button 
            onClick={() => { clearAuth(); router.push('/login'); }}
            className="ml-auto flex items-center gap-2 text-sm font-semibold text-rose-600 hover:bg-rose-50 px-3 py-1.5 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Keluar</span>
          </button>
        </header>

        {/* Tabs */}
        <div className="flex border-b border-gray-100 bg-white sticky top-14 z-10">
          <button
            onClick={() => setActiveTab("info")}
            className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-semibold transition-colors relative ${
              activeTab === "info" ? "text-primary" : "text-gray-500 hover:text-gray-900"
            }`}
          >
            <User className="w-4 h-4" />
            Info Pribadi
            {activeTab === "info" && <span className="absolute bottom-0 inset-x-0 h-0.5 bg-primary" />}
          </button>
          <button
            onClick={() => setActiveTab("security")}
            className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-semibold transition-colors relative ${
              activeTab === "security" ? "text-primary" : "text-gray-500 hover:text-gray-900"
            }`}
          >
            <Lock className="w-4 h-4" />
            Keamanan
            {activeTab === "security" && <span className="absolute bottom-0 inset-x-0 h-0.5 bg-primary" />}
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 flex-1">
          {activeTab === "info" ? (
            <form onSubmit={handleUpdateProfile} className="space-y-5 animate-in fade-in slide-in-from-bottom-2">
              
              {profileMessage.text && (
                <div className={`p-3 rounded-xl text-sm font-medium ${profileMessage.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'}`}>
                  {profileMessage.text}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700">Alamat Email</label>
                <input 
                  type="email" 
                  value={user.email} 
                  disabled 
                  className="w-full h-11 px-3 rounded-xl border border-gray-200 bg-gray-100 text-gray-500 text-sm focus:outline-none cursor-not-allowed"
                />
                <p className="text-xs text-gray-400">Email tidak dapat diubah.</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700">Nama Lengkap</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Masukkan nama lengkap"
                  required
                  className="w-full h-11 px-3 rounded-xl border border-gray-200 bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700">Nomor Telepon / WhatsApp</label>
                <input 
                  type="tel" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Contoh: 081234567890"
                  className="w-full h-11 px-3 rounded-xl border border-gray-200 bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>

              <div className="pt-4">
                <button 
                  type="submit" 
                  disabled={isUpdatingProfile || name.trim() === ""}
                  className="w-full h-12 flex items-center justify-center gap-2 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm active:scale-[0.98]"
                >
                  {isUpdatingProfile ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                  Simpan Perubahan
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleUpdatePassword} className="space-y-5 animate-in fade-in slide-in-from-bottom-2">
              
              {passwordMessage.text && (
                <div className={`p-3 rounded-xl text-sm font-medium ${passwordMessage.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'}`}>
                  {passwordMessage.text}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700">Password Saat Ini</label>
                <input 
                  type="password" 
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Masukkan password saat ini"
                  required
                  className="w-full h-11 px-3 rounded-xl border border-gray-200 bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700">Password Baru</label>
                <input 
                  type="password" 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Masukkan password baru (min. 8 karakter)"
                  required
                  minLength={8}
                  className="w-full h-11 px-3 rounded-xl border border-gray-200 bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700">Konfirmasi Password Baru</label>
                <input 
                  type="password" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Ulangi password baru"
                  required
                  minLength={8}
                  className="w-full h-11 px-3 rounded-xl border border-gray-200 bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>

              <div className="pt-4">
                <button 
                  type="submit" 
                  disabled={isUpdatingPassword || !currentPassword || !newPassword || !confirmPassword}
                  className="w-full h-12 flex items-center justify-center gap-2 rounded-xl bg-gray-900 text-white font-bold hover:bg-black transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm active:scale-[0.98]"
                >
                  {isUpdatingPassword ? <Loader2 className="w-5 h-5 animate-spin" /> : <Lock className="w-5 h-5" />}
                  Ubah Password
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
