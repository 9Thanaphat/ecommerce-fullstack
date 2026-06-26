import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import {
  Mail, LogOut, User, Phone, MapPin, Pencil, X, Check, KeyRound, ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import {
  ThailandAddressTypeahead,
  ThailandAddressValue,
} from "react-thailand-address-typeahead";

type UserData = {
  id: number;
  email: string;
  role: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  address: string | null;
  subdistrict: string | null;
  city: string | null;
  province: string | null;
  postalCode: string | null;
};

type ProfileForm = {
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  subdistrict: string;
  city: string;
  province: string;
  postalCode: string;
};

function toForm(u: UserData): ProfileForm {
  return {
    firstName: u.firstName ?? "",
    lastName: u.lastName ?? "",
    phone: u.phone ?? "",
    address: u.address ?? "",
    subdistrict: u.subdistrict ?? "",
    city: u.city ?? "",
    province: u.province ?? "",
    postalCode: u.postalCode ?? "",
  };
}

function ViewField({ label, value }: { label: string; value: string | null }) {
  return (
    <div>
      <p className="text-xs text-gray-400 mb-0.5">{label}</p>
      <p className="text-sm font-medium text-gray-800">
        {value || <span className="text-gray-300 font-normal italic">ยังไม่ได้ระบุ</span>}
      </p>
    </div>
  );
}

const inputCls = (error?: boolean) =>
  `w-full border rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 placeholder:text-gray-300 ${
    error
      ? "border-red-300 focus:ring-red-200 bg-red-50"
      : "border-gray-200 focus:ring-gray-300"
  }`;

function PlainInput({
  label, name, value, onChange, placeholder, error,
}: {
  label: string;
  name: keyof ProfileForm;
  value: string;
  onChange: (n: keyof ProfileForm, v: string) => void;
  placeholder?: string;
  error?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs mb-1">
        <span className={error ? "text-red-500" : "text-gray-400"}>{label}</span>
        {error && <span className="ml-1 text-red-400 text-[10px]">จำเป็น</span>}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
        placeholder={placeholder}
        className={inputCls(error)}
      />
    </div>
  );
}

function AddressLabel({ label, error }: { label: string; error?: boolean }) {
  return (
    <label className="block text-xs mb-1">
      <span className={error ? "text-red-500" : "text-gray-400"}>{label}</span>
      {error && <span className="ml-1 text-red-400 text-[10px]">จำเป็น</span>}
    </label>
  );
}

export default function UserProfile() {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof ProfileForm, boolean>>>({});
  const [form, setForm] = useState<ProfileForm>({
    firstName: "", lastName: "", phone: "",
    address: "", subdistrict: "", city: "", province: "", postalCode: "",
  });
  const [showPwForm, setShowPwForm] = useState(false);
  const [pwForm, setPwForm] = useState({ current: "", next: "", confirm: "" });
  const [pwSaving, setPwSaving] = useState(false);
  const navigate = useNavigate();
  const { setAuthUser } = useCart();
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetch(`${apiUrl}/auth/check-auth`, { credentials: "include" })
      .then((r) => r.json())
      .then((data) => {
        if (!data.authenticated) { navigate("/auth"); return; }
        setUser(data.user);
        setForm(toForm(data.user));
      })
      .catch(() => navigate("/auth"))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (name: keyof ProfileForm, val: string) => {
    setForm((prev) => ({ ...prev, [name]: val }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: false }));
  };

  const handleAddressChange = (val: ThailandAddressValue) => {
    setForm((prev) => ({
      ...prev,
      subdistrict: val.subdistrict,
      city: val.district,
      province: val.province,
      postalCode: val.postalCode,
    }));
    setErrors((prev) => ({
      ...prev, subdistrict: false, city: false, province: false, postalCode: false,
    }));
  };

  const addressFields: (keyof ProfileForm)[] = ["address", "subdistrict", "city", "province", "postalCode"];

  const handleSave = async () => {
    const newErrors: Partial<Record<keyof ProfileForm, boolean>> = {};
    for (const f of addressFields) {
      if (!form[f].trim()) newErrors[f] = true;
    }
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }

    setSaving(true);
    try {
      const res = await fetch(`${apiUrl}/auth/profile`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setUser((prev) => prev ? { ...prev, ...form } : prev);
        setEditing(false);
        setErrors({});
        toast.success("บันทึกข้อมูลสำเร็จ");
      } else {
        toast.error("เกิดข้อผิดพลาด กรุณาลองใหม่");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!pwForm.current || !pwForm.next) return toast.error("กรุณากรอกข้อมูลให้ครบ");
    if (pwForm.next.length < 6) return toast.error("รหัสผ่านใหม่ต้องมีอย่างน้อย 6 ตัวอักษร");
    if (pwForm.next !== pwForm.confirm) return toast.error("รหัสผ่านใหม่ไม่ตรงกัน");
    setPwSaving(true);
    try {
      const res = await fetch(`${apiUrl}/auth/change-password`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: pwForm.current, newPassword: pwForm.next }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("เปลี่ยนรหัสผ่านสำเร็จ");
        setShowPwForm(false);
        setPwForm({ current: "", next: "", confirm: "" });
      } else {
        toast.error(data.message ?? "เกิดข้อผิดพลาด");
      }
    } finally {
      setPwSaving(false);
    }
  };

  const handleCancel = () => {
    if (user) setForm(toForm(user));
    setEditing(false);
    setErrors({});
  };

  const handleLogout = async () => {
    await fetch(`${apiUrl}/auth/logout`, { method: "POST", credentials: "include" });
    setAuthUser(null);
    navigate("/auth");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-sm text-gray-400">Loading...</p>
      </div>
    );
  }

  if (!user) return null;

  const initials = (user.firstName && user.lastName)
    ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
    : user.email.slice(0, 2).toUpperCase();

  const displayName = [user.firstName, user.lastName].filter(Boolean).join(" ") || null;

  const addressVal: ThailandAddressValue = {
    subdistrict: form.subdistrict,
    district: form.city,
    province: form.province,
    postalCode: form.postalCode,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-8 py-12">

        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">Account</p>
          <h1 className="text-2xl font-bold text-gray-900">Your Profile</h1>
        </div>

        {/* Avatar */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-4 flex items-center gap-5">
          <div className="w-16 h-16 rounded-full bg-gray-900 flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xl font-semibold">{initials}</span>
          </div>
          <div className="flex-1 min-w-0">
            {displayName && <p className="text-base font-semibold text-gray-900 truncate">{displayName}</p>}
            <p className={`text-sm truncate ${displayName ? "text-gray-500" : "text-base font-semibold text-gray-900"}`}>
              {user.email}
            </p>
          </div>
        </div>

        {/* Account info */}
        <div className="bg-white border border-gray-200 rounded-xl divide-y divide-gray-100 mb-4">
          {[
            { icon: Mail, label: "Email", value: user.email },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-3 px-6 py-4">
              <Icon size={16} className="text-gray-400 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-400 mb-0.5">{label}</p>
                <p className="text-sm font-medium text-gray-800 capitalize">{value}</p>
              </div>
            </div>
          ))}
        </div>


        {/* Profile section */}
        <div className="bg-white border border-gray-200 rounded-xl mb-6">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <p className="text-sm font-semibold text-gray-800">ข้อมูลส่วนตัว</p>
            {!editing ? (
              <button
                onClick={() => setEditing(true)}
                className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-800 border border-gray-200 hover:border-gray-400 px-3 py-1.5 rounded-lg transition-all"
              >
                <Pencil size={12} /> แก้ไข
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 border border-gray-200 px-3 py-1.5 rounded-lg transition-all"
                >
                  <X size={12} /> ยกเลิก
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-1.5 text-xs text-white bg-gray-900 hover:bg-gray-700 disabled:opacity-50 px-3 py-1.5 rounded-lg transition-all"
                >
                  <Check size={12} /> {saving ? "กำลังบันทึก..." : "บันทึก"}
                </button>
              </div>
            )}
          </div>

          <div className="p-6 flex flex-col gap-6">

            {/* ชื่อ */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <User size={14} className="text-gray-400" />
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">ชื่อ</p>
              </div>
              {editing ? (
                <div className="grid grid-cols-2 gap-3">
                  <PlainInput label="ชื่อ" name="firstName" value={form.firstName} onChange={handleChange} placeholder="เช่น สมชาย" />
                  <PlainInput label="นามสกุล" name="lastName" value={form.lastName} onChange={handleChange} placeholder="เช่น ใจดี" />
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <ViewField label="ชื่อ" value={user.firstName} />
                  <ViewField label="นามสกุล" value={user.lastName} />
                </div>
              )}
            </div>

            {/* ติดต่อ */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Phone size={14} className="text-gray-400" />
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">ข้อมูลติดต่อ</p>
              </div>
              {editing ? (
                <PlainInput label="เบอร์โทรศัพท์" name="phone" value={form.phone} onChange={handleChange} placeholder="เช่น 081-234-5678" />
              ) : (
                <ViewField label="เบอร์โทรศัพท์" value={user.phone} />
              )}
            </div>

            {/* ที่อยู่ */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <MapPin size={14} className="text-gray-400" />
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">ที่อยู่</p>
              </div>

              {editing ? (
                <div className="flex flex-col gap-3">
                  <PlainInput
                    label="ที่อยู่ (บ้านเลขที่ / ถนน)"
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    placeholder="เช่น 123/45 ถ.สุขุมวิท"
                    error={errors.address}
                  />

                  {/* Typeahead สำหรับ ตำบล อำเภอ จังหวัด รหัส */}
                  <ThailandAddressTypeahead
                    value={addressVal}
                    onValueChange={handleAddressChange}
                  >
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <AddressLabel label="ตำบล / แขวง" error={errors.subdistrict} />
                        <ThailandAddressTypeahead.SubdistrictInput
                          placeholder="พิมพ์เพื่อค้นหา..."
                          className={inputCls(errors.subdistrict)}
                        />
                      </div>
                      <div>
                        <AddressLabel label="อำเภอ / เขต" error={errors.city} />
                        <ThailandAddressTypeahead.DistrictInput
                          placeholder="พิมพ์เพื่อค้นหา..."
                          className={inputCls(errors.city)}
                        />
                      </div>
                      <div>
                        <AddressLabel label="จังหวัด" error={errors.province} />
                        <ThailandAddressTypeahead.ProvinceInput
                          placeholder="พิมพ์เพื่อค้นหา..."
                          className={inputCls(errors.province)}
                        />
                      </div>
                      <div>
                        <AddressLabel label="รหัสไปรษณีย์" error={errors.postalCode} />
                        <ThailandAddressTypeahead.PostalCodeInput
                          placeholder="เช่น 10110"
                          className={inputCls(errors.postalCode)}
                        />
                      </div>
                    </div>

                    <ThailandAddressTypeahead.Suggestion
                      containerProps={{
                        className: "bg-white border border-gray-200 rounded-xl shadow-lg py-1 overflow-y-auto max-h-52 z-50 min-w-[220px]",
                      }}
                      optionItemProps={{
                        className: "px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer",
                      }}
                    />
                  </ThailandAddressTypeahead>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <ViewField label="ที่อยู่" value={user.address} />
                  <div className="grid grid-cols-2 gap-4">
                    <ViewField label="ตำบล / แขวง" value={user.subdistrict} />
                    <ViewField label="อำเภอ / เขต" value={user.city} />
                    <ViewField label="จังหวัด" value={user.province} />
                    <ViewField label="รหัสไปรษณีย์" value={user.postalCode} />
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Change Password */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <button
            onClick={() => setShowPwForm((v) => !v)}
            className="w-full flex items-center gap-3 px-6 py-4 hover:bg-gray-50 transition-colors text-left"
          >
            <KeyRound size={16} className="text-gray-400 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-800">เปลี่ยนรหัสผ่าน</p>
              <p className="text-xs text-gray-400 mt-0.5">อัปเดตรหัสผ่านสำหรับบัญชีนี้</p>
            </div>
            <ChevronRight size={15} className={`text-gray-300 transition-transform ${showPwForm ? "rotate-90" : ""}`} />
          </button>

          {showPwForm && (
            <div className="border-t border-gray-100 px-6 py-5 flex flex-col gap-3">
              {[
                { label: "รหัสผ่านปัจจุบัน", key: "current" as const },
                { label: "รหัสผ่านใหม่ (อย่างน้อย 6 ตัว)", key: "next" as const },
                { label: "ยืนยันรหัสผ่านใหม่", key: "confirm" as const },
              ].map(({ label, key }) => (
                <div key={key}>
                  <label className="block text-xs text-gray-400 mb-1">{label}</label>
                  <input
                    type="password"
                    value={pwForm[key]}
                    onChange={(e) => setPwForm((p) => ({ ...p, [key]: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-300 placeholder:text-gray-300"
                    placeholder="••••••••"
                  />
                </div>
              ))}
              <div className="flex gap-2 pt-1">
                <button
                  onClick={handleChangePassword}
                  disabled={pwSaving}
                  className="flex items-center gap-1.5 text-xs font-medium bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-700 disabled:opacity-50 transition-colors"
                >
                  {pwSaving ? "กำลังบันทึก..." : "บันทึก"}
                </button>
                <button
                  onClick={() => { setShowPwForm(false); setPwForm({ current: "", next: "", confirm: "" }); }}
                  className="text-xs text-gray-400 hover:text-gray-600 px-4 py-2 rounded-lg border border-gray-200 hover:border-gray-400 transition-colors"
                >
                  ยกเลิก
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Sign out */}
        <button
          onClick={handleLogout}
          className="flex items-center mt-6 gap-2 text-sm text-red-500 hover:text-red-700 border border-red-200 hover:border-red-400 hover:bg-red-50 px-4 py-2 rounded-lg transition-all"
        >
          <LogOut size={15} />
          Sign out
        </button>

      </div>
    </div>
  );
}
