// src/pages/Admin/AdminDashboard.jsx
import React, { useEffect, useMemo, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  getAdminMetrics,
  getAdminTimeseries,
  getTopCompanies,
  getTopDrivers,
  listUsers,
  deactivateUser,
  reactivateUser,
} from "../../api/admin";

// Your shared UI components
import ConfirmModal from "../../components/common/ConfirmModal";
import FilterBar from "../../components/common/FilterBar";
import PaginationBar from "../../components/common/PaginationBar";

// Charts
import {
  Chart as ChartJS,
  LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

function cents(n) {
  if (n == null) return "-";
  return `$${(n / 100).toFixed(2)}`;
}
const todayISO = () => new Date().toISOString().slice(0, 10);
const minusDaysISO = (d) => {
  const dt = new Date();
  dt.setUTCDate(dt.getUTCDate() - d);
  return dt.toISOString().slice(0, 10);
};

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [metrics, setMetrics] = useState(null);
  const [ts, setTs] = useState(null);
  const [topCompanies, setTopCompanies] = useState([]);
  const [topDrivers, setTopDrivers] = useState([]);

  // Metrics time range (integrates your FilterBar via a select)
  const [metricsRange, setMetricsRange] = useState("30"); // days: "7" | "30" | "90"

  // Users table state
  const [users, setUsers] = useState({ items: [], page: 1, size: 10, totalItems: 0, totalPages: 0, hasNext: false });
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [role, setRole] = useState(""); // "", "Rider", "Driver", "Company", "Admin"
  const [search, setSearch] = useState("");

  // Confirm modal
  const [confirm, setConfirm] = useState({ show: false, mode: "deactivate", user: null });

  // Initial load (metrics, timeseries, top lists)
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        // default last 30 days
        const range = Number(metricsRange);
        const params = { from: minusDaysISO(range - 1), to: todayISO() };
        const [m, tsData, tc, td] = await Promise.all([
          getAdminMetrics(params),
          getAdminTimeseries(params),
          getTopCompanies(5),
          getTopDrivers(5),
        ]);
        if (!mounted) return;
        setMetrics(m);
        setTs(tsData);
        setTopCompanies(tc);
        setTopDrivers(td);
      } catch (e) {
        setErr(e?.message || "Failed to load admin data.");
      } finally {
        setLoading(false);
      }
    })();
    return () => { mounted = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // first render only

  // Re-load metrics when metricsRange changes (FilterBar select)
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const range = Number(metricsRange);
        const params = { from: minusDaysISO(range - 1), to: todayISO() };
        const [m, tsData] = await Promise.all([
          getAdminMetrics(params),
          getAdminTimeseries(params),
        ]);
        if (!mounted) return;
        setMetrics(m);
        setTs(tsData);
      } catch (e) {
        setErr(e?.message || "Failed to load metrics.");
      } finally {
        setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [metricsRange]);

  // Load users list when filters/page change
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await listUsers({ page, size, role: role || undefined, search: search || undefined });
        if (!mounted) return;
        setUsers(data);
      } catch (e) {
        setErr(e?.message || "Failed to load users.");
      }
    })();
    return () => { mounted = false; };
  }, [page, size, role, search]);

  const roleOptions = useMemo(
    () => [
      { value: "", label: "All roles" },
      { value: "Rider", label: "Rider" },
      { value: "Driver", label: "Driver" },
      { value: "Company", label: "Company" },
      { value: "Admin", label: "Admin" },
    ],
    []
  );

  const rangeOptions = useMemo(
    () => [
      { value: "7", label: "Last 7 days" },
      { value: "30", label: "Last 30 days" },
      { value: "90", label: "Last 90 days" },
    ],
    []
  );

  const openConfirm = (mode, user) => setConfirm({ show: true, mode, user });
  const closeConfirm = () => setConfirm({ show: false, mode: "deactivate", user: null });

  const handleConfirm = async () => {
    if (!confirm.user) return;
    try {
      if (confirm.mode === "deactivate") {
        await deactivateUser(confirm.user.id, { reasonCode: "manual" });
      } else {
        await reactivateUser(confirm.user.id, { reasonCode: "manual" });
      }
      const data = await listUsers({ page, size, role: role || undefined, search: search || undefined });
      setUsers(data);
    } catch (e) {
      alert(e?.message || "Operation failed.");
    }
  };

  if (loading && !metrics) return <div className="container py-4">Loading admin dashboard...</div>;
  if (err) return <div className="container py-4 text-danger">{err}</div>;

  // Chart configs
  const lineOptions = { responsive: true, plugins: { legend: { position: "top" } } };
  const usersSeries = ts && ({
    labels: ts.dates,
    datasets: [{ label: "New Users / day", data: ts.newUsers }]
  });
  const ordersSeries = ts && ({
    labels: ts.dates,
    datasets: [{ label: "Completed Orders / day", data: ts.completedOrders }]
  });
  const moneySeries = ts && ({
    labels: ts.dates,
    datasets: [
      { label: "Order GMV (¢)", data: ts.orderGmvCents },
      { label: "Membership Revenue (¢)", data: ts.membershipRevenueCents },
    ]
  });

  return (
    <div className="container py-3">
      <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
        <h2 className="mb-0">Admin Dashboard</h2>

        {/* Use your FilterBar for metrics range */}
        <FilterBar
          className="flex-grow-1"
          selects={[
            {
              value: metricsRange,
              onChange: setMetricsRange,
              options: rangeOptions,
              ariaLabel: "metrics-range",
              style: { maxWidth: 200, marginLeft: "auto" },
            },
          ]}
        />
      </div>

      {/* Metrics */}
      {metrics && (
        <div className="row g-3 mt-1">
          <div className="col-6 col-sm-4 col-lg-2"><MetricCard label="Total Users" value={metrics.totalUsers} /></div>
          <div className="col-6 col-sm-4 col-lg-2"><MetricCard label="Riders" value={metrics.riders} /></div>
          <div className="col-6 col-sm-4 col-lg-2"><MetricCard label="Drivers" value={metrics.drivers} /></div>
          <div className="col-6 col-sm-4 col-lg-2"><MetricCard label="Companies" value={metrics.companies} /></div>
          <div className="col-6 col-sm-4 col-lg-2"><MetricCard label="Active Companies" value={metrics.activeCompanies} /></div>
          <div className="col-6 col-sm-4 col-lg-2"><MetricCard label="Transactions" value={metrics.transactionsCount} /></div>
          <div className="col-6 col-sm-4 col-lg-2"><MetricCard label="Membership Revenue" value={cents(metrics.membershipRevenueCents)} /></div>
          <div className="col-6 col-sm-4 col-lg-2"><MetricCard label="Order GMV" value={cents(metrics.orderGmvCents)} /></div>
          <div className="col-6 col-sm-4 col-lg-2"><MetricCard label="Salary Paid" value={cents(metrics.salaryPaidCents)} /></div>
          <div className="col-6 col-sm-4 col-lg-2"><MetricCard label="Topups" value={cents(metrics.topupsCents)} /></div>
          <div className="col-6 col-sm-4 col-lg-2"><MetricCard label="Withdrawals" value={cents(metrics.withdrawalsCents)} /></div>
        </div>
      )}

      {/* Charts */}
      {ts && (
        <div className="row g-3 mt-2">
          <div className="col-12 col-lg-6">
            <Panel title="New Users (daily)">
              <Line options={lineOptions} data={usersSeries} />
            </Panel>
          </div>
          <div className="col-12 col-lg-6">
            <Panel title="Completed Orders (daily)">
              <Line options={lineOptions} data={ordersSeries} />
            </Panel>
          </div>
          <div className="col-12">
            <Panel title="Revenue (daily)">
              <Line options={lineOptions} data={moneySeries} />
            </Panel>
          </div>
        </div>
      )}

      {/* Top lists */}
      <div className="row g-3 mt-2">
        <div className="col-12 col-lg-6">
          <Panel title="Top Companies (by revenue)">
            <ol className="mb-0 ps-3">
              {topCompanies.map((c) => (
                <li key={c.id} className="mb-1">
                  <strong>{c.name}</strong> — {cents(c.revenueCents)} (★ {Number(c.rating).toFixed(1)})
                </li>
              ))}
              {topCompanies.length === 0 && <div>No data</div>}
            </ol>
          </Panel>
        </div>
        <div className="col-12 col-lg-6">
          <Panel title="Top Drivers (by salary received)">
            <ol className="mb-0 ps-3">
              {topDrivers.map((d) => (
                <li key={d.userId} className="mb-1">
                  <strong>{d.fullName}</strong> — {cents(d.salaryCents)} (★ {Number(d.rating).toFixed(1)})
                </li>
              ))}
              {topDrivers.length === 0 && <div>No data</div>}
            </ol>
          </Panel>
        </div>
      </div>

      {/* Users */}
      <Panel title="Users" className="mt-3">
        {/* Use your FilterBar for users: search + role select */}
        <FilterBar
          className="mb-2"
          search={{
            value: search,
            onChange: (v) => { setPage(1); setSearch(v); },
            placeholder: "Search email…",
          }}
          selects={[
            {
              value: role,
              onChange: (v) => { setPage(1); setRole(v); },
              options: roleOptions,
              ariaLabel: "role-filter",
              style: { maxWidth: 180 },
            },
          ]}
        />

        <div className="table-responsive">
          <table className="table table-sm align-middle">
            <thead className="table-light">
              <tr>
                <Th>Email</Th><Th>Role</Th><Th>Active</Th><Th>Created</Th><Th>Action</Th>
              </tr>
            </thead>
            <tbody>
              {users.items.map((u) => (
                <tr key={u.id}>
                  <Td>{u.email}</Td>
                  <Td>{u.role}</Td>
                  <Td>{u.isActive ? "Yes" : "No"}</Td>
                  <Td>{new Date(u.createdAt).toLocaleString()}</Td>
                  <Td>
                    {u.isActive ? (
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => openConfirm("deactivate", u)}
                      >
                        Deactivate
                      </button>
                    ) : (
                      <button
                        className="btn btn-sm btn-outline-success"
                        onClick={() => openConfirm("reactivate", u)}
                      >
                        Activate
                      </button>
                    )}
                  </Td>
                </tr>
              ))}
              {users.items.length === 0 && (
                <tr><Td colSpan={5}>No users found.</Td></tr>
              )}
            </tbody>
          </table>
        </div>

        <PaginationBar
          className="mt-2"
          page={users.page}
          size={size}
          totalItems={users.totalItems || 0}
          totalPages={users.totalPages || 1}
          onPageChange={setPage}
          onSizeChange={(n) => { setPage(1); setSize(n); }}
          sizeOptions={[10, 20, 50]}
        />
      </Panel>

      {/* Confirm modal for activate/deactivate */}
      <ConfirmModal
        show={confirm.show}
        onHide={closeConfirm}
        title={confirm.mode === "deactivate" ? "Deactivate user" : "Activate user"}
        message={
          confirm.user ? (
            <span>
              Are you sure you want to <strong>{confirm.mode}</strong> <code>{confirm.user.email}</code>?
            </span>
          ) : "Are you sure?"
        }
        confirmText={confirm.mode === "deactivate" ? "Deactivate" : "Activate"}
        variant={confirm.mode === "deactivate" ? "danger" : "success"}
        onConfirm={handleConfirm}
      />
    </div>
  );
}

function MetricCard({ label, value }) {
  return (
    <div className="border rounded-3 p-3 h-100">
      <div className="text-muted small">{label}</div>
      <div className="fw-bold fs-5 mt-1">{value}</div>
    </div>
  );
}

function Panel({ title, children, className = "" }) {
  return (
    <div className={`border rounded-3 p-3 ${className}`}>
      <h5 className="mt-0">{title}</h5>
      {children}
    </div>
  );
}
function Th({ children }) { return <th className="text-start">{children}</th>; }
function Td({ children, colSpan }) { return <td colSpan={colSpan}>{children}</td>; }
