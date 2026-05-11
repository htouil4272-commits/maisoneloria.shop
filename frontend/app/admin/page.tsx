'use client';

import { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';
import { Eye, MousePointerClick, DollarSign, TrendingUp, RefreshCw, Bell, BellOff, LogOut, Search } from 'lucide-react';

const STORAGE_KEY = 'eloriaAdminToken';
const INACTIVITY_MS = 30 * 60 * 1000; // تسجيل خروج تلقائي بعد 30 دقيقة بدون نشاط

const STATUS_LABELS: Record<string, { ar: string; className: string }> = {
  pending: { ar: 'قيد الانتظار', className: 'bg-amber-100 text-amber-800 border-amber-200' },
  confirmed: { ar: 'مؤكد', className: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
  cancelled: { ar: 'ملغي', className: 'bg-rose-100 text-rose-800 border-rose-200' },
};

interface OrderItemView {
  product_name: string;
  variant?: string;
  quantity: number;
  price: number;
}

interface OrderRow {
  id: number;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_city: string;
  items: OrderItemView[];
  total: number;
  status: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

interface OrdersResponse {
  success: boolean;
  orders: OrderRow[];
  counts: Record<string, number>;
  error?: string;
}

interface AnalyticsStats {
  views: number;
  visitors: number;
  clicks: number;
  revenue: number;
  orders: number;
  conversionRate: number;
}

interface AnalyticsChartData {
  date: string;
  views: number;
  orders: number;
  revenue: number;
}

interface AnalyticsResponse {
  success: boolean;
  stats: AnalyticsStats;
  chartData: AnalyticsChartData[];
  error?: string;
}

const STATUS_FILTERS: Array<{ value: string; label: string }> = [
  { value: '', label: 'الكل' },
  { value: 'pending', label: 'قيد الانتظار' },
  { value: 'confirmed', label: 'مؤكد' },
  { value: 'cancelled', label: 'ملغي' },
];

export default function AdminPage() {
  const [token, setToken] = useState<string | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  
  // Analytics State
  const [stats, setStats] = useState<AnalyticsStats | null>(null);
  const [chartData, setChartData] = useState<AnalyticsChartData[]>([]);
  const [daysFilter, setDaysFilter] = useState<number>(7);

  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);
  const [knownOrderIds, setKnownOrderIds] = useState<Set<number>>(new Set());
  const knownOrderIdsRef = useRef<Set<number>>(new Set());
  const [newOrderToast, setNewOrderToast] = useState<string | null>(null);
  const [muted, setMuted] = useState(false);

  // استخدام sessionStorage بدل localStorage — يُمسح عند إغلاق المتصفح
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = window.sessionStorage.getItem(STORAGE_KEY);
      if (saved) setToken(saved);
    }
  }, []);

  const handleLogout = useCallback(() => {
    setToken(null);
    setOrders([]);
    setCounts({});
    setStats(null);
    setChartData([]);
    knownOrderIdsRef.current = new Set();
    if (typeof window !== 'undefined') {
      window.sessionStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  // تسجيل خروج تلقائي بعد 30 دقيقة من عدم النشاط
  useEffect(() => {
    if (!token) return;
    let inactivityTimer: ReturnType<typeof setTimeout>;

    const resetTimer = () => {
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(() => handleLogout(), INACTIVITY_MS);
    };

    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
    events.forEach((e) => window.addEventListener(e, resetTimer));
    resetTimer();

    return () => {
      clearTimeout(inactivityTimer);
      events.forEach((e) => window.removeEventListener(e, resetTimer));
    };
  }, [token, handleLogout]);

  useEffect(() => {
    const id = setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => clearTimeout(id);
  }, [search]);

  const fetchOrders = useCallback(
    async (currentToken: string, options: { silent?: boolean } = {}) => {
      if (!options.silent) setIsLoading(true);
      try {
        const params = new URLSearchParams();
        if (statusFilter) params.set('status', statusFilter);
        if (debouncedSearch) params.set('search', debouncedSearch);

        const response = await fetch(`/api/admin/orders?${params.toString()}`, {
          headers: { Authorization: `Bearer ${currentToken}` },
          cache: 'no-store',
        });

        if (response.status === 401) {
          handleLogout();
          return;
        }

        const data: OrdersResponse = await response.json();
        if (!data.success) {
          setError(data.error || 'فشل في جلب الطلبات');
          return;
        }

        setError('');
        setCounts(data.counts || {});
        setOrders((previous) => {
          const previousIds = new Set(previous.map((o) => o.id));
          const currentKnown = knownOrderIdsRef.current;
          const newOrders = data.orders.filter((o) => !previousIds.has(o.id) && !currentKnown.has(o.id));
          if (currentKnown.size > 0 && newOrders.length > 0) {
            const first = newOrders[0];
            setNewOrderToast(`طلب جديد: ${first.customer_name} — ${first.customer_city}`);
            if (!muted) playBeep();
            if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
              try {
                new Notification('طلب جديد على Maison Eloria', {
                  body: `${first.customer_name} • ${first.customer_phone} • ${first.customer_city}`,
                });
              } catch {
                /* ignore */
              }
            }
          }
          knownOrderIdsRef.current = new Set(data.orders.map((o) => o.id));
          return data.orders;
        });
      } catch {
        setError('تعذر الاتصال بالخادم');
      } finally {
        if (!options.silent) setIsLoading(false);
      }
    },
    [statusFilter, debouncedSearch, muted, handleLogout],
  );

  const fetchAnalytics = useCallback(
    async (currentToken: string, days: number) => {
      try {
        const response = await fetch(`/api/analytics/overview?days=${days}`, {
          headers: { Authorization: `Bearer ${currentToken}` },
          cache: 'no-store',
        });
        
        if (response.status === 401) {
          handleLogout();
          return;
        }

        const data: AnalyticsResponse = await response.json();
        if (data.success) {
          setStats(data.stats);
          setChartData(data.chartData);
        }
      } catch (err) {
        console.error("Failed to fetch analytics", err);
      }
    },
    [handleLogout]
  );

  useEffect(() => {
    if (!token) return;
    fetchOrders(token);
    fetchAnalytics(token, daysFilter);
    const id = setInterval(() => {
      fetchOrders(token, { silent: true });
      fetchAnalytics(token, daysFilter);
    }, 15000);
    return () => clearInterval(id);
  }, [token, fetchOrders, fetchAnalytics, daysFilter]);

  useEffect(() => {
    if (token && typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'default') {
        Notification.requestPermission().catch(() => undefined);
      }
    }
  }, [token]);

  useEffect(() => {
    if (!newOrderToast) return;
    const id = setTimeout(() => setNewOrderToast(null), 6000);
    return () => clearTimeout(id);
  }, [newOrderToast]);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      let data: any = {};
      try {
        data = await response.json();
      } catch {
        if (response.status === 502 || response.status === 503) {
          setLoginError('الخادم غير متاح حالياً (502). يرجى إعادة تشغيل الباكند من Easypanel والمحاولة مجدداً.');
        } else {
          setLoginError(`خطأ في الخادم (${response.status})`);
        }
        return;
      }
      if (!response.ok || !data.success) {
        setLoginError(data.detail || data.error || 'بيانات الدخول غير صحيحة');
        return;
      }
      setToken(data.token);
      if (typeof window !== 'undefined') {
        window.sessionStorage.setItem(STORAGE_KEY, data.token);
      }
      setUsername('');
      setPassword('');
    } catch {
      setLoginError('تعذر الاتصال بالخادم — تحقق من أن الباكند يعمل في Easypanel');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const updateStatus = async (id: number, status: 'confirmed' | 'cancelled') => {
    if (!token) return;
    setActionLoadingId(id);
    try {
      const response = await fetch(`/api/admin/orders/${id}/status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      if (response.status === 401) {
        handleLogout();
        return;
      }
      const data = await response.json();
      if (!data.success) {
        alert(data.error || 'فشل في تحديث الحالة');
        return;
      }
      await fetchOrders(token, { silent: true });
      await fetchAnalytics(token, daysFilter);
    } catch {
      alert('تعذر الاتصال بالخادم');
    } finally {
      setActionLoadingId(null);
    }
  };

  if (!token) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center bg-gray-50 px-4 py-10" dir="rtl">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm space-y-6 rounded-3xl border border-gray-100 bg-white p-8 shadow-2xl shadow-gray-200/50"
        >
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <LogOut className="h-6 w-6 ml-1" />
            </div>
            <h1 className="font-playfair text-2xl font-bold text-gray-900">Maison Eloria</h1>
            <p className="mt-2 text-sm text-gray-500">مرحباً بك مجدداً! أدخل كلمة المرور للوصول إلى لوحة التحكم.</p>
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">اسم المستخدم</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoFocus
              autoComplete="username"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm transition-all focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/10"
              placeholder="admin"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">كلمة المرور</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm transition-all focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/10"
              placeholder="••••••••"
            />
          </div>
          {loginError && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-center text-sm font-medium text-rose-600">
              {loginError}
            </div>
          )}
          <button
            type="submit"
            disabled={isLoggingIn}
            className="w-full rounded-xl bg-emerald-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-600/30 transition-all hover:bg-emerald-700 active:scale-[0.98] disabled:opacity-50"
          >
            {isLoggingIn ? 'جاري الدخول...' : 'تسجيل الدخول'}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-slate-50 px-4 pb-12 pt-6 sm:px-6 lg:px-8 font-sans text-slate-900" dir="rtl">
      {newOrderToast && (
        <div className="fixed left-1/2 top-4 z-50 -translate-x-1/2 rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white shadow-xl shadow-emerald-900/20 flex items-center gap-2 animate-in fade-in slide-in-from-top-4">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          {newOrderToast}
        </div>
      )}
      
      <div className="mx-auto max-w-7xl space-y-6">
        {/* HEADER */}
        <header className="flex flex-wrap items-end justify-between gap-4 rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">نظرة عامة على الأداء</h1>
            <p className="mt-1 text-sm text-slate-500 flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              تحديث تلقائي في الوقت الفعلي
            </p>
          </div>
          <div className="flex items-center gap-2">
            <select 
              value={daysFilter}
              onChange={(e) => setDaysFilter(Number(e.target.value))}
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
            >
              <option value={1}>اليوم</option>
              <option value={7}>آخر 7 أيام</option>
              <option value={30}>آخر 30 يوم</option>
              <option value={90}>آخر 3 أشهر</option>
            </select>
            <button
              onClick={() => setMuted((m) => !m)}
              className="flex items-center justify-center h-9 w-9 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
              title={muted ? 'تفعيل الصوت' : 'كتم الصوت'}
            >
              {muted ? <BellOff size={18} /> : <Bell size={18} />}
            </button>
            <button
              onClick={() => { fetchOrders(token); fetchAnalytics(token, daysFilter); }}
              className="flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200 transition-colors"
            >
              <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
              <span>تحديث</span>
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center justify-center h-9 w-9 rounded-xl border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors ml-2"
              title="تسجيل الخروج"
            >
              <LogOut size={18} className="mr-0.5" />
            </button>
          </div>
        </header>

        {/* ANALYTICS CARDS */}
        {stats && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Eye size={24} />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">الزيارات (Page Views)</p>
                  <p className="text-2xl font-bold text-slate-900">{stats.views.toLocaleString()}</p>
                </div>
              </div>
            </div>
            
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                  <MousePointerClick size={24} />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">النقرات (Clicks)</p>
                  <p className="text-2xl font-bold text-slate-900">{stats.clicks.toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <DollarSign size={24} />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">المبيعات المؤكدة (Revenue)</p>
                  <p className="text-2xl font-bold text-slate-900">{stats.revenue.toLocaleString()} <span className="text-base font-normal text-slate-500">درهم</span></p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                  <TrendingUp size={24} />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">معدل التحويل (Conversion)</p>
                  <p className="text-2xl font-bold text-slate-900">{stats.conversionRate}%</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CHARTS */}
        {chartData.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <h3 className="mb-6 text-base font-bold text-slate-800">المبيعات والطلبات</h3>
              <div className="h-72 w-full" dir="ltr">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="date" tick={{fontSize: 12}} tickLine={false} axisLine={false} tickFormatter={(val) => val.split('-').slice(1).join('/')} />
                    <YAxis yAxisId="left" tick={{fontSize: 12}} tickLine={false} axisLine={false} />
                    <YAxis yAxisId="right" orientation="right" tick={{fontSize: 12}} tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                      labelStyle={{ fontWeight: 'bold', color: '#0F172A', marginBottom: '4px' }}
                    />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                    <Bar yAxisId="left" dataKey="revenue" name="المبيعات (درهم)" fill="#10B981" radius={[4, 4, 0, 0]} maxBarSize={40} />
                    <Bar yAxisId="right" dataKey="orders" name="الطلبات" fill="#F59E0B" radius={[4, 4, 0, 0]} maxBarSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <h3 className="mb-6 text-base font-bold text-slate-800">حركة الزوار (الزيارات)</h3>
              <div className="h-72 w-full" dir="ltr">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="date" tick={{fontSize: 12}} tickLine={false} axisLine={false} tickFormatter={(val) => val.split('-').slice(1).join('/')} />
                    <YAxis tick={{fontSize: 12}} tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                      labelStyle={{ fontWeight: 'bold', color: '#0F172A', marginBottom: '4px' }}
                    />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                    <Line type="monotone" dataKey="views" name="المشاهدات" stroke="#3B82F6" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm font-medium text-rose-600">{error}</div>
        )}

        {/* ORDERS TABLE */}
        <div className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-100 p-4 bg-slate-50/50">
            <div className="flex flex-wrap items-center gap-2">
              {STATUS_FILTERS.map((filter) => (
                <button
                  key={filter.value || 'all'}
                  onClick={() => setStatusFilter(filter.value)}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                    statusFilter === filter.value
                      ? 'bg-slate-800 text-white shadow-md'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {filter.label} {filter.value && counts[filter.value] !== undefined ? `(${counts[filter.value]})` : ''}
                </button>
              ))}
            </div>
            <div className="relative w-full sm:w-auto">
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
                <Search size={16} />
              </div>
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="بحث برقم الطلب، الاسم، الهاتف..."
                className="w-full sm:w-72 rounded-xl border border-slate-200 bg-white pr-10 pl-4 py-2.5 text-sm transition-all focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/10"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-right text-sm">
              <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">رقم الطلب</th>
                  <th className="px-6 py-4">العميل</th>
                  <th className="px-6 py-4">المدينة</th>
                  <th className="px-6 py-4">المنتجات</th>
                  <th className="px-6 py-4">الإجمالي</th>
                  <th className="px-6 py-4">الحالة</th>
                  <th className="px-6 py-4">التاريخ</th>
                  <th className="px-6 py-4 text-center">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {orders.map((order) => {
                  const status = STATUS_LABELS[order.status] || {
                    ar: order.status,
                    className: 'bg-slate-100 text-slate-800 border-slate-200',
                  };
                  const itemsList = Array.isArray(order.items) ? order.items : [];
                  return (
                    <tr key={order.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs font-medium text-slate-500" dir="ltr">
                        {order.order_number}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900">{order.customer_name}</div>
                        <a href={`tel:${order.customer_phone}`} className="text-xs font-mono text-slate-500 hover:text-emerald-600 transition-colors mt-0.5 inline-block" dir="ltr">
                          {order.customer_phone}
                        </a>
                      </td>
                      <td className="px-6 py-4 text-slate-600 font-medium">{order.customer_city}</td>
                      <td className="px-6 py-4">
                        <ul className="space-y-1.5 text-xs text-slate-600">
                          {itemsList.map((item, idx) => (
                            <li key={idx} className="flex items-center gap-2">
                              <span className="h-1.5 w-1.5 rounded-full bg-slate-300 flex-shrink-0"></span>
                              <span>{item.product_name} <span className="font-bold text-slate-900 ml-1">×{item.quantity}</span></span>
                            </li>
                          ))}
                        </ul>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md inline-block">
                          {Number(order.total).toFixed(0)} د.م
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-bold ${status.className}`}>
                          {status.ar}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500 font-medium">
                        {formatDate(order.created_at)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap items-center justify-center gap-2">
                          <button
                            onClick={() => updateStatus(order.id, 'confirmed')}
                            disabled={actionLoadingId === order.id || order.status === 'confirmed'}
                            className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm transition-all hover:bg-emerald-700 disabled:opacity-50 disabled:shadow-none"
                          >
                            تأكيد
                          </button>
                          <button
                            onClick={() => updateStatus(order.id, 'cancelled')}
                            disabled={actionLoadingId === order.id || order.status === 'cancelled'}
                            className="rounded-lg bg-white border border-rose-200 text-rose-600 px-3 py-1.5 text-xs font-bold shadow-sm transition-all hover:bg-rose-50 disabled:opacity-50 disabled:shadow-none"
                          >
                            إلغاء
                          </button>
                          <a
                            href={`https://wa.me/212${order.customer_phone.replace(/^0/, '')}`}
                            target="_blank"
                            rel="noreferrer"
                            className="rounded-lg bg-[#25D366]/10 text-[#25D366] border border-[#25D366]/20 px-3 py-1.5 text-xs font-bold transition-all hover:bg-[#25D366]/20 flex items-center gap-1.5"
                          >
                            <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                            واتساب
                          </a>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {orders.length === 0 && !isLoading && (
                  <tr>
                    <td colSpan={8} className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center justify-center text-slate-400">
                        <Search size={32} className="mb-3 opacity-50" />
                        <p className="text-base font-medium text-slate-600">لا توجد طلبات حالياً</p>
                        <p className="text-sm mt-1">لم يتم العثور على أي طلبات تطابق بحثك أو الفلتر الحالي.</p>
                      </div>
                    </td>
                  </tr>
                )}
                {isLoading && orders.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center justify-center text-emerald-600">
                        <RefreshCw size={32} className="mb-3 animate-spin" />
                        <p className="text-base font-medium">جاري تحميل البيانات...</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function formatDate(value: string): string {
  try {
    const date = new Date(value.replace(' ', 'T') + 'Z');
    return date.toLocaleString('ar-MA', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return value;
  }
}

function playBeep() {
  if (typeof window === 'undefined') return;
  try {
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    oscillator.type = 'sine';
    oscillator.frequency.value = 880;
    gain.gain.setValueAtTime(0.001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
    oscillator.connect(gain).connect(ctx.destination);
    oscillator.start();
    oscillator.stop(ctx.currentTime + 0.5);
  } catch {
    /* ignore audio errors */
  }
}
