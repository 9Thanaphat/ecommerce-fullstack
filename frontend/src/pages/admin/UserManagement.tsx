import { useEffect, useState } from "react";
import { Users, Loader2 } from "lucide-react";

type AdminUser = {
  id: number;
  email: string;
  role: string;
  firstName: string | null;
  lastName: string | null;
  isVerified: boolean;
  createdAt: string;
};

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("th-TH", { day: "2-digit", month: "short", year: "numeric" });

const API = import.meta.env.VITE_API_URL;

export default function UserManagement() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch(`${API}/admin/users`, { credentials: "include" })
      .then((r) => r.json())
      .then((data) => { if (data.success) setUsers(data.users); })
      .finally(() => setLoading(false));
  }, []);

  const visible = users.filter(
    (u) =>
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      [u.firstName, u.lastName].filter(Boolean).join(" ").toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 size={20} className="text-gray-300 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-8 flex items-end justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Users</h1>
          <p className="text-sm text-gray-400 mt-0.5">{users.length} สมาชิกทั้งหมด</p>
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="ค้นหา email / ชื่อ..."
          className="bg-white border border-gray-200 text-gray-700 text-sm rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-300 w-56 transition"
        />
      </div>

      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
        {visible.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Users size={40} className="text-gray-200 mb-4" />
            <p className="text-sm text-gray-400">ไม่พบผู้ใช้</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100">
                  {["#", "Email", "ชื่อ", "Role", "ยืนยัน", "สมัครเมื่อ"].map((h) => (
                    <th key={h} className="px-5 py-3 text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visible.map((u) => (
                  <tr key={u.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4 text-xs text-gray-300 tabular-nums font-mono">{u.id}</td>
                    <td className="px-5 py-4 text-sm text-gray-600">{u.email}</td>
                    <td className="px-5 py-4 text-sm text-gray-500">
                      {[u.firstName, u.lastName].filter(Boolean).join(" ") || (
                        <span className="text-gray-300 italic text-xs">ไม่ระบุ</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-[10px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full ${
                        u.role === "admin" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-500"
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${
                        u.isVerified ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-400"
                      }`}>
                        {u.isVerified ? "ยืนยันแล้ว" : "รอยืนยัน"}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-xs text-gray-400">{fmtDate(u.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
