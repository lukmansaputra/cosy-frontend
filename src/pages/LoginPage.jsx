import { useEffect, useState } from "react";
import { Lock, Mail, User } from "lucide-react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import { getAuthStatus } from "@/services/auth.service";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { loading: authLoading, login, register, user } = useAuth();
  const { showToast } = useToast();
  const [setupMode, setSetupMode] = useState(false);
  const [checking, setChecking] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    company_name: "COSY MUSEUM",
  });

  useEffect(() => {
    document.title = "Login - COSY MUSEUM";

    return () => {
      document.title = "Cosy";
    };
  }, []);

  useEffect(() => {
    let active = true;

    async function checkStatus() {
      try {
        const status = await getAuthStatus();

        if (active) setSetupMode(!status?.has_users);
      } catch (statusError) {
        if (active) setError(statusError.message);
      } finally {
        if (active) setChecking(false);
      }
    }

    checkStatus();

    return () => {
      active = false;
    };
  }, []);

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0F1110] p-4 text-sm text-[#8B9388]">
        Memeriksa sesi login...
      </div>
    );
  }

  if (user) {
    return <Navigate to={location.state?.from?.pathname || "/"} replace />;
  }

  function updateField(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setError("");
      setSubmitting(true);

      if (setupMode) {
        await register(form);
        showToast({ title: "Owner berhasil dibuat" });
      } else {
        await login({
          email: form.email,
          password: form.password,
        });
        showToast({ title: "Login berhasil" });
      }

      navigate(location.state?.from?.pathname || "/", { replace: true });
    } catch (submitError) {
      setError(submitError.message);
      showToast({
        type: "error",
        title: setupMode ? "Setup gagal" : "Login gagal",
        message: submitError.message,
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0F1110] p-4 text-white">
      <main className="w-full max-w-md rounded-3xl border border-[#252A27] bg-[#161917] p-6 shadow-2xl">
        <div className="mb-7 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#4A5B45]/25">
            <Lock size={24} className="text-[#9fbd91]" />
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#7C9A72]">
            COSY MUSEUM
          </p>
          <h1 className="mt-2 text-2xl font-semibold">
            {setupMode ? "Setup Owner" : "Login"}
          </h1>
          <p className="mt-2 text-sm text-[#8B9388]">
            {checking
              ? "Memeriksa akun..."
              : setupMode
                ? "Buat akun pertama untuk mengamankan dashboard."
                : "Masuk untuk mengelola proyek, RAB, dan invoice."}
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-2xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {setupMode && (
            <InputField
              icon={User}
              label="Nama"
              value={form.full_name}
              onChange={(value) => updateField("full_name", value)}
              placeholder="Masukkan nama owner"
            />
          )}

          <InputField
            icon={Mail}
            label="Email"
            type="email"
            value={form.email}
            onChange={(value) => updateField("email", value)}
            placeholder="nama@email.com"
          />

          <InputField
            icon={Lock}
            label="Password"
            type="password"
            value={form.password}
            onChange={(value) => updateField("password", value)}
            placeholder="Masukkan password"
          />

          {setupMode && (
            <InputField
              label="Nama Perusahaan"
              value={form.company_name}
              onChange={(value) => updateField("company_name", value)}
              placeholder="COSY MUSEUM"
            />
          )}

          <button
            disabled={checking || submitting}
            className="w-full rounded-xl bg-[#4A5B45] py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting
              ? setupMode
                ? "Membuat akun..."
                : "Masuk..."
              : setupMode
                ? "Buat Owner"
                : "Login"}
          </button>
        </form>
      </main>
    </div>
  );
}

function InputField({
  icon: Icon,
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}) {
  return (
    <div>
      <label className="mb-2 block text-sm text-[#8B9388]">{label}</label>
      <div className="relative">
        {Icon && (
          <Icon
            size={17}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8B9388]"
          />
        )}
        <input
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className={`w-full rounded-xl border border-[#252A27] bg-[#101311] p-3 text-white outline-none ${
            Icon ? "pl-10" : ""
          }`}
        />
      </div>
    </div>
  );
}
