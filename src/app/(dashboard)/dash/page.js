"use client";
import { useState, useMemo, useEffect, useCallback } from "react";
import {
  Button,
  Card,
  Row,
  Col,
  Form,
  Badge,
  Table,
  ProgressBar,
} from "react-bootstrap";
import {
  People,
  GraphUp,
  Calendar3,
  CurrencyRupee,
  CreditCard,
  CartCheck,
  CheckCircleFill,
  HourglassSplit,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  PersonPlusFill,
  TagFill,
  ClockHistory,
  ShieldCheck,
  XCircleFill,
  CashStack,
  ArrowLeftRight,
  ClipboardData,
  Speedometer2,
} from "react-bootstrap-icons";

const getLocalDateString = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const Dash = () => {
  // Navigation active tab: 'overview' | 'users' | 'subscriptions' | 'orders' | 'payments'
  const [activeTab, setActiveTab] = useState("overview");

  // Chart hover nodes states
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const [hoveredTrendIdx, setHoveredTrendIdx] = useState(null);
  const [hoveredSubIdx, setHoveredSubIdx] = useState(null);

  const todayStr = useMemo(() => getLocalDateString(new Date()), []);
  const defaultStartStr = useMemo(
    () => getLocalDateString(new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)),
    [],
  );

  // Tab 1 Date values
  const [overviewStart, setOverviewStart] = useState(defaultStartStr);
  const [overviewEnd, setOverviewEnd] = useState(todayStr);

  // Live Dashboard Overview States
  const [overviewData, setOverviewData] = useState(null);
  const [overviewLoading, setOverviewLoading] = useState(false);
  const [overviewError, setOverviewError] = useState(null);

  const fetchDashboardOverview = useCallback(async () => {
    setOverviewLoading(true);
    setOverviewError(null);
    try {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const params = new URLSearchParams();
      if (overviewStart) params.append("start_date", overviewStart);
      if (overviewEnd) params.append("end_date", overviewEnd);

      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/admin/dashboard/overview?${params.toString()}`;

      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch overview metrics.");
      }

      setOverviewData(data);
    } catch (err) {
      console.error("fetchDashboardOverview error:", err);
      setOverviewError(err.message || "An unexpected error occurred.");
    } finally {
      setOverviewLoading(false);
    }
  }, [overviewStart, overviewEnd]);

  useEffect(() => {
    if (activeTab === "overview") {
      fetchDashboardOverview();
    }
  }, [activeTab, fetchDashboardOverview]);
  console.log(overviewData, "llll");
  // Tab 2 Date values
  const [usersSignupStart, setUsersSignupStart] = useState("");
  const [usersSignupEnd, setUsersSignupEnd] = useState("");
  const [usersLastLogin, setUsersLastLogin] = useState("");
  const [usersSubStart, setUsersSubStart] = useState("");

  // Live Dashboard Users states
  const [usersData, setUsersData] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState(null);
  const [usersPage, setUsersPage] = useState(1);
  const [usersLimit, setUsersLimit] = useState(20);
  const [usersTotalPages, setUsersTotalPages] = useState(1);
  const [usersTotalCount, setUsersTotalCount] = useState(0);

  // Live Dashboard Users Summary stats states
  const [usersJoinedSelected, setUsersJoinedSelected] = useState(48);
  const [usersLastActiveSelected, setUsersLastActiveSelected] = useState(215);
  const [usersTotalRangeRegs, setUsersTotalRangeRegs] = useState(156);

  const fetchDashboardUsers = useCallback(async () => {
    setUsersLoading(true);
    setUsersError(null);
    try {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const params = new URLSearchParams();
      params.append("page", usersPage);
      params.append("limit", usersLimit);
      if (usersSignupStart)
        params.append("signup_start_date", usersSignupStart);
      if (usersSignupEnd) params.append("signup_end_date", usersSignupEnd);
      if (usersLastLogin) params.append("last_active_date", usersLastLogin);
      if (usersSubStart)
        params.append("subscription_start_date", usersSubStart);

      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/admin/dashboard/users?${params.toString()}`;

      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch user list.");
      }

      if (data.success) {
        setUsersData(data.data || []);
        if (data.summary) {
          setUsersJoinedSelected(data.summary.users_joined_selected_dates ?? 0);
          setUsersLastActiveSelected(
            data.summary.users_last_active_selected_date ?? 0,
          );
          setUsersTotalRangeRegs(data.summary.total_range_registrations ?? 0);
        }
        if (data.pagination) {
          setUsersTotalPages(data.pagination.pages || 1);
          setUsersTotalCount(data.pagination.total || 0);
        }
      } else {
        throw new Error(
          data.message || "Request returned unsuccessful status.",
        );
      }
    } catch (err) {
      console.error("fetchDashboardUsers error:", err);
      setUsersError(err.message || "An unexpected error occurred.");
    } finally {
      setUsersLoading(false);
    }
  }, [
    usersPage,
    usersLimit,
    usersSignupStart,
    usersSignupEnd,
    usersLastLogin,
    usersSubStart,
  ]);

  // Reset page to 1 on filter changes to prevent fetching out-of-bounds page indices
  useEffect(() => {
    setUsersPage(1);
  }, [usersSignupStart, usersSignupEnd, usersLastLogin, usersSubStart]);

  useEffect(() => {
    if (activeTab === "users") {
      fetchDashboardUsers();
    }
  }, [activeTab, fetchDashboardUsers]);
  console.log(usersData, "UU");

  // Tab 4 Date & Status values
  const [ordersPlacedStart, setOrdersPlacedStart] = useState("");
  const [ordersPlacedEnd, setOrdersPlacedEnd] = useState("");
  const [ordersDeliveryStart, setOrdersDeliveryStart] = useState("");
  const [ordersDeliveryEnd, setOrdersDeliveryEnd] = useState("");
  const [ordersStatus, setOrdersStatus] = useState("");

  // Orders live list & pagination states
  const [ordersData, setOrdersData] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState(null);
  const [ordersPage, setOrdersPage] = useState(1);
  const [ordersLimit, setOrdersLimit] = useState(20);
  const [ordersTotalPages, setOrdersTotalPages] = useState(1);
  const [ordersTotalCount, setOrdersTotalCount] = useState(0);

  // Orders summary statistics states
  const [ordersPeakDays, setOrdersPeakDays] = useState("Wednesday & Sunday");
  const [ordersAvgDelivery, setOrdersAvgDelivery] = useState(2.4);
  const [ordersFulfillmentRatio, setOrdersFulfillmentRatio] = useState(94);

  const fetchDashboardOrders = useCallback(async () => {
    setOrdersLoading(true);
    setOrdersError(null);
    try {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const params = new URLSearchParams();
      if (ordersPlacedStart) params.append("placed_start_date", ordersPlacedStart);
      if (ordersPlacedEnd) params.append("placed_end_date", ordersPlacedEnd);
      if (ordersDeliveryStart) params.append("delivery_start_date", ordersDeliveryStart);
      if (ordersDeliveryEnd) params.append("delivery_end_date", ordersDeliveryEnd);
      if (ordersStatus) params.append("status", ordersStatus);
      params.append("page", ordersPage);
      params.append("limit", ordersLimit);

      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/admin/dashboard/orders?${params.toString()}`;

      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch orders.");
      }

      if (data.success) {
        setOrdersData(data.data || []);
        if (data.summary) {
          setOrdersPeakDays(
            Array.isArray(data.summary.peak_order_days)
              ? data.summary.peak_order_days.join(" & ")
              : data.summary.peak_order_days || "N/A"
          );
          setOrdersAvgDelivery(data.summary.average_delivery_time_days ?? 0);
          setOrdersFulfillmentRatio(data.summary.fulfillment_target_ratio ?? 0);
        }
        if (data.pagination) {
          setOrdersTotalPages(data.pagination.pages || 1);
          setOrdersTotalCount(data.pagination.total || 0);
        }
      } else {
        throw new Error(data.message || "Request returned unsuccessful status.");
      }
    } catch (err) {
      console.error("fetchDashboardOrders error:", err);
      setOrdersError(err.message || "An unexpected error occurred.");
    } finally {
      setOrdersLoading(false);
    }
  }, [
    ordersPage,
    ordersLimit,
    ordersPlacedStart,
    ordersPlacedEnd,
    ordersDeliveryStart,
    ordersDeliveryEnd,
    ordersStatus,
  ]);

  // Reset page to 1 on filter changes to prevent fetching out-of-bounds page indices
  useEffect(() => {
    setOrdersPage(1);
  }, [
    ordersPlacedStart,
    ordersPlacedEnd,
    ordersDeliveryStart,
    ordersDeliveryEnd,
    ordersStatus,
  ]);

  useEffect(() => {
    if (activeTab === "orders") {
      fetchDashboardOrders();
    }
  }, [activeTab, fetchDashboardOrders]);

  // Tab 3 Subscriptions Hub live analytics states
  const [subStarted, setSubStarted] = useState(142);
  const [subCancelled, setSubCancelled] = useState(24);
  const [subRenewed, setSubRenewed] = useState(92);
  const [subActive, setSubActive] = useState(874);

  const [subRenewalRate, setSubRenewalRate] = useState(84);
  const [subAvgLifecycle, setSubAvgLifecycle] = useState(180);
  const [subChurnRate, setSubChurnRate] = useState(1.2);

  const [subGrowthData, setSubGrowthData] = useState([
    { label: "Jun 16", growth: 12, cancellations: 2 },
    { label: "Jun 17", growth: 19, cancellations: 1 },
    { label: "Jun 18", growth: 15, cancellations: 3 },
    { label: "Jun 19", growth: 28, cancellations: 2 },
    { label: "Jun 20", growth: 10, cancellations: 4 },
    { label: "Jun 21", growth: 8, cancellations: 1 },
    { label: "Jun 22", growth: 22, cancellations: 2 },
  ]);

  const [subLoading, setSubLoading] = useState(false);
  const [subError, setSubError] = useState(null);

  const fetchDashboardSubscriptions = useCallback(async () => {
    setSubLoading(true);
    setSubError(null);
    try {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/admin/dashboard/subscriptions`;

      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch subscriptions.");
      }

      if (data.success) {
        if (data.summary) {
          setSubStarted(data.summary.started ?? 0);
          setSubCancelled(data.summary.cancelled ?? 0);
          setSubRenewed(data.summary.renewed ?? 0);
          setSubActive(data.summary.active_subscriptions_today ?? 0);
        }
        if (data.renewal_analytics) {
          setSubRenewalRate(data.renewal_analytics.renewal_rate ?? 0);
          setSubAvgLifecycle(data.renewal_analytics.average_plan_lifecycle_days ?? 0);
          setSubChurnRate(data.renewal_analytics.churn_rate ?? 0);
        }
        if (data.daily_subscription_growth) {
          const formatChartDate = (dateStr) => {
            if (!dateStr) return "";
            const parts = dateStr.split("-");
            if (parts.length < 3) return dateStr;
            const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            const monthIdx = parseInt(parts[1], 10) - 1;
            const day = parseInt(parts[2], 10);
            return `${months[monthIdx] || parts[1]} ${day}`;
          };
          const mapped = data.daily_subscription_growth.map((item) => ({
            label: formatChartDate(item.date),
            growth: item.signups,
            cancellations: item.cancellations,
          }));
          setSubGrowthData(mapped);
        }
      } else {
        throw new Error(data.message || "Request returned unsuccessful status.");
      }
    } catch (err) {
      console.error("fetchDashboardSubscriptions error:", err);
      setSubError(err.message || "An unexpected error occurred.");
    } finally {
      setSubLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === "subscriptions") {
      fetchDashboardSubscriptions();
    }
  }, [activeTab, fetchDashboardSubscriptions]);

  // Tab 5 Payments Ledger live analytics states
  const [paymentsStart, setPaymentsStart] = useState("2026-03-01");
  const [paymentsEnd, setPaymentsEnd] = useState("2026-06-22");
  const [paymentsStatus, setPaymentsStatus] = useState("captured");
  const [isPaymentsInitial, setIsPaymentsInitial] = useState(true);

  const [paymentsData, setPaymentsData] = useState([]);
  const [paymentsLoading, setPaymentsLoading] = useState(false);
  const [paymentsError, setPaymentsError] = useState(null);
  const [paymentsPage, setPaymentsPage] = useState(1);
  const [paymentsLimit, setPaymentsLimit] = useState(20);
  const [paymentsTotalPages, setPaymentsTotalPages] = useState(1);
  const [paymentsTotalCount, setPaymentsTotalCount] = useState(0);

  const fetchDashboardPayments = useCallback(async () => {
    setPaymentsLoading(true);
    setPaymentsError(null);
    try {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const params = new URLSearchParams();
      if (!isPaymentsInitial) {
        if (paymentsStart) params.append("start_date", paymentsStart);
        if (paymentsEnd) params.append("end_date", paymentsEnd);
        if (paymentsStatus) params.append("status", paymentsStatus);
      }
      params.append("page", paymentsPage);
      params.append("limit", paymentsLimit);

      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/admin/dashboard/payments?${params.toString()}`;

      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch payments.");
      }

      if (data.success) {
        setPaymentsData(data.data || []);
        if (data.pagination) {
          setPaymentsTotalPages(data.pagination.pages || 1);
          setPaymentsTotalCount(data.pagination.total || 0);
        }
      } else {
        throw new Error(data.message || "Request returned unsuccessful status.");
      }
    } catch (err) {
      console.error("fetchDashboardPayments error:", err);
      setPaymentsError(err.message || "An unexpected error occurred.");
    } finally {
      setPaymentsLoading(false);
    }
  }, [
    paymentsPage,
    paymentsLimit,
    paymentsStart,
    paymentsEnd,
    paymentsStatus,
    isPaymentsInitial,
  ]);

  // Reset page to 1 on filter changes
  useEffect(() => {
    setPaymentsPage(1);
  }, [
    paymentsStart,
    paymentsEnd,
    paymentsStatus,
  ]);

  useEffect(() => {
    if (activeTab === "payments") {
      fetchDashboardPayments();
    }
  }, [activeTab, fetchDashboardPayments]);

  const subChartPoints = useMemo(() => {
    return subGrowthData.map((item, idx) => {
      const x = 45 + idx * (435 / Math.max(subGrowthData.length - 1, 1));
      const ySignup = 150 - item.growth * 4;
      const yCancel = 150 - item.cancellations * 4;
      return { x, ySignup, yCancel, ...item };
    });
  }, [subGrowthData]);

  const subSignupPath = useMemo(() => {
    return subChartPoints.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.ySignup.toFixed(1)}`).join(" ");
  }, [subChartPoints]);

  const subCancelPath = useMemo(() => {
    return subChartPoints.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.yCancel.toFixed(1)}`).join(" ");
  }, [subChartPoints]);

  // Hardcoded date values for the designs
  const defaultTodayStr = "2026-06-22";

  // Formatter utilities
  const formatCurrency = (val) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  const formatNumber = (val) => {
    return new Intl.NumberFormat("en-IN").format(val || 0);
  };

  // ==========================================
  // STATIC DESIGN DATA PLOTTERS
  // ==========================================

  // Tab 1: Overview Breakdown
  const overviewRevenueBreakdown = [
    { label: "Jun 16", revenue: 24500, orders: 18 },
    { label: "Jun 17", revenue: 38200, orders: 25 },
    { label: "Jun 18", revenue: 31000, orders: 22 },
    { label: "Jun 19", revenue: 51200, orders: 34 },
    { label: "Jun 20", revenue: 29000, orders: 19 },
    { label: "Jun 21", revenue: 18500, orders: 14 },
    { label: "Jun 22", revenue: 45200, orders: 29 },
  ];

  // Tab 1: Users + Revenue Trend Data
  const trendData = [
    { label: "Jun 16", users: 18, revenue: 24.5 }, // revenue in thousands
    { label: "Jun 17", users: 28, revenue: 38.2 },
    { label: "Jun 18", users: 22, revenue: 31.0 },
    { label: "Jun 19", users: 45, revenue: 51.2 },
    { label: "Jun 20", users: 20, revenue: 29.0 },
    { label: "Jun 21", users: 15, revenue: 18.5 },
    { label: "Jun 22", users: 38, revenue: 45.2 },
  ];

  // Mock data cleaned - replaced with live API states







  return (
    <div className="container-fluid py-3 px-md-4 bg-light min-vh-100">
      {/* 1. TOP TITLE HEADER */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center mb-4 gap-2">
        <div>
          <h2 className="fw-bold text-dark mb-1">Aartava System Analytics</h2>
          <p className="text-muted small mb-0">
            High-fidelity dashboard interface prototype covering metrics
            aggregates.
          </p>
        </div>
        <div className="d-flex align-items-center gap-2">
          <Badge
            bg="success-subtle"
            className="text-success border border-success-subtle px-2 py-1.5 rounded-2"
          >
            Design Mode: Enabled
          </Badge>
          <Badge bg="dark" className="px-2 py-1.5 rounded-2 font-monospace">
            Local Time: {todayStr}
          </Badge>
        </div>
      </div>

      {/* 2. TABBED MANAGEMENT NAVIGATION BAR */}
      <Card className="border-0 shadow-sm rounded-4 mb-4 overflow-hidden tab-navigation-card">
        <Card.Body className="p-2 bg-white">
          <div className="d-flex flex-wrap gap-2">
            {[
              {
                id: "overview",
                label: "📊 Overview Dashboard",
                color: "primary",
              },
              { id: "users", label: "👥 User Management", color: "info" },
              {
                id: "subscriptions",
                label: "💳 Subscriptions Hub",
                color: "success",
              },
              { id: "orders", label: "📦 Orders & Delivery", color: "warning" },
              { id: "payments", label: "💰 Payments Ledger", color: "danger" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={`btn rounded-3 px-3.5 py-2 fw-bold transition-all border-0 ${
                  activeTab === tab.id
                    ? `btn-${tab.color} text-white shadow-sm`
                    : "btn-light text-secondary hover-bg-gray"
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </Card.Body>
      </Card>

      {/* ==========================================
          TAB 1: OVERVIEW DASHBOARD VIEW
          ========================================== */}
      {activeTab === "overview" && (
        <div className="animate-fade-in">
          {/* A. Date Scope Filter UI */}
          <Card className="border-0 shadow-sm rounded-4 mb-4">
            <Card.Body className="p-3 bg-white d-flex flex-wrap justify-content-between align-items-center gap-3">
              <div className="d-flex align-items-center gap-2">
                <Calendar3 className="text-primary" size={18} />
                <span className="fw-semibold text-secondary small">
                  Filter Scope:
                </span>
                <Badge
                  bg="primary-subtle"
                  className="text-primary px-3 py-1.5 rounded-2"
                >
                  Selected Range: {overviewStart} to {overviewEnd}
                </Badge>
              </div>
              <div className="d-flex align-items-center gap-2">
                <Form.Control
                  type="date"
                  size="sm"
                  value={overviewStart}
                  max={todayStr}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val && val <= todayStr) {
                      setOverviewStart(val);
                      if (overviewEnd && val > overviewEnd) {
                        setOverviewEnd(val);
                      }
                    }
                  }}
                  className="font-monospace border-light-subtle rounded-2"
                />
                <span className="text-muted small">to</span>
                <Form.Control
                  type="date"
                  size="sm"
                  value={overviewEnd}
                  max={todayStr}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val && val <= todayStr) {
                      setOverviewEnd(val);
                      if (overviewStart && val < overviewStart) {
                        setOverviewStart(val);
                      }
                    }
                  }}
                  className="font-monospace border-light-subtle rounded-2"
                />
                <Button
                  variant="outline-dark"
                  size="sm"
                  className="rounded-2"
                  onClick={fetchDashboardOverview}
                  disabled={overviewLoading}
                >
                  {overviewLoading ? "Loading..." : "Filter"}
                </Button>
              </div>
            </Card.Body>
          </Card>

          {/* B. Overview Statistics Grid */}
          <Row className="g-3 mb-4">
            {/* New Users */}
            <Col sm={12} md={6} lg={3}>
              <Card className="border-0 shadow-sm rounded-4 h-100 kpi-card position-relative overflow-hidden">
                <Card.Body className="d-flex flex-column justify-content-between p-3.5">
                  <div className="d-flex justify-content-between">
                    <div>
                      <span className="text-muted small fw-semibold text-uppercase tracking-wider">
                        👥 New Users
                      </span>
                      <h3 className="fw-bold mt-1 mb-0 font-monospace">
                        {overviewLoading
                          ? "..."
                          : (overviewData?.new_users ?? 0)}
                      </h3>
                    </div>
                    <div className="kpi-icon-bg bg-primary bg-opacity-10 text-primary p-2.5 rounded-3">
                      <PersonPlusFill size={22} />
                    </div>
                  </div>
                  <div className="d-flex align-items-center mt-3 gap-1">
                    {overviewLoading ? (
                      <span className="text-muted small">Loading trend...</span>
                    ) : (
                      <>
                        <span
                          className={`small fw-bold d-flex align-items-center gap-0.5 ${
                            (overviewData?.new_users_change_percentage ?? 0) >=
                            0
                              ? "text-success"
                              : "text-danger"
                          }`}
                        >
                          {(overviewData?.new_users_change_percentage ?? 0) >=
                          0 ? (
                            <ArrowUpRight size={12} />
                          ) : (
                            <ArrowDownRight size={12} />
                          )}
                          {overviewData?.new_users_change_percentage ?? 0}%
                        </span>
                        <span className="text-muted small">vs last period</span>
                      </>
                    )}
                  </div>
                  <div className="accent-bar bg-primary" />
                </Card.Body>
              </Card>
            </Col>

            {/* DAU */}
            <Col sm={12} md={6} lg={3}>
              <Card className="border-0 shadow-sm rounded-4 h-100 kpi-card position-relative overflow-hidden">
                <Card.Body className="d-flex flex-column justify-content-between p-3.5">
                  <div className="d-flex justify-content-between">
                    <div>
                      <span className="text-muted small fw-semibold text-uppercase tracking-wider">
                        🆕 Daily Active (DAU)
                      </span>
                      <div className="d-flex align-items-baseline gap-2 mt-1">
                        <h3 className="fw-bold mb-0 font-monospace">
                          {overviewLoading
                            ? "..."
                            : (overviewData?.daily_active_users ?? 0)}
                        </h3>
                        <span className="live-pulse-container">
                          <span className="live-pulse-dot" />
                          <span className="live-pulse-ring" />
                        </span>
                      </div>
                    </div>
                    <div className="kpi-icon-bg bg-danger bg-opacity-10 text-danger p-2.5 rounded-3">
                      <Activity size={22} />
                    </div>
                  </div>
                  <div className="d-flex align-items-center mt-3 gap-1">
                    {overviewLoading ? (
                      <span className="text-muted small">Loading trend...</span>
                    ) : (
                      <>
                        <span
                          className={`small fw-bold d-flex align-items-center gap-0.5 ${
                            (overviewData?.dau_change_percentage ?? 0) >= 0
                              ? "text-success"
                              : "text-danger"
                          }`}
                        >
                          {(overviewData?.dau_change_percentage ?? 0) >= 0 ? (
                            <ArrowUpRight size={12} />
                          ) : (
                            <ArrowDownRight size={12} />
                          )}
                          {overviewData?.dau_change_percentage ?? 0}%
                        </span>
                        <span className="text-muted small">
                          active sessions today
                        </span>
                      </>
                    )}
                  </div>
                  <div className="accent-bar bg-danger" />
                </Card.Body>
              </Card>
            </Col>

            {/* WAU */}
            <Col sm={12} md={6} lg={3}>
              <Card className="border-0 shadow-sm rounded-4 h-100 kpi-card position-relative overflow-hidden">
                <Card.Body className="d-flex flex-column justify-content-between p-3.5">
                  <div className="d-flex justify-content-between">
                    <div>
                      <span className="text-muted small fw-semibold text-uppercase tracking-wider">
                        📈 Weekly Active (WAU)
                      </span>
                      <h3 className="fw-bold mt-1 mb-0 font-monospace">
                        {overviewLoading
                          ? "..."
                          : (overviewData?.weekly_active_users ?? 0)}
                      </h3>
                    </div>
                    <div className="kpi-icon-bg bg-info bg-opacity-10 text-info p-2.5 rounded-3">
                      <GraphUp size={22} />
                    </div>
                  </div>
                  <div className="d-flex flex-column mt-3 w-100">
                    <div className="d-flex justify-content-between small text-muted mb-1">
                      <span>DAU to WAU ratio:</span>
                      <strong>
                        {overviewLoading
                          ? "..."
                          : `${overviewData?.dau_wau_ratio ?? 0}%`}
                      </strong>
                    </div>
                    <div className="progress-bar-thin bg-light rounded-pill">
                      <div
                        className="progress-bar-fill bg-info rounded-pill"
                        style={{
                          width: `${overviewData?.dau_wau_ratio ?? 0}%`,
                        }}
                      />
                    </div>
                  </div>
                  <div className="accent-bar bg-info" />
                </Card.Body>
              </Card>
            </Col>

            {/* Revenue */}
            <Col sm={12} md={6} lg={3}>
              <Card className="border-0 shadow-sm rounded-4 h-100 kpi-card position-relative overflow-hidden">
                <Card.Body className="d-flex flex-column justify-content-between p-3.5">
                  <div className="d-flex justify-content-between">
                    <div>
                      <span className="text-muted small fw-semibold text-uppercase tracking-wider">
                        💰 Total Income
                      </span>
                      <h3 className="fw-bold mt-1 mb-0 font-monospace text-emerald">
                        {overviewLoading
                          ? "..."
                          : formatCurrency(overviewData?.total_income ?? 0)}
                      </h3>
                    </div>
                    <div className="kpi-icon-bg bg-success bg-opacity-10 text-success p-2.5 rounded-3">
                      <CurrencyRupee size={22} />
                    </div>
                  </div>
                  <div className="d-flex align-items-center mt-3 gap-1">
                    {overviewLoading ? (
                      <span className="text-muted small">Loading trend...</span>
                    ) : (
                      <>
                        <span
                          className={`small fw-bold d-flex align-items-center gap-0.5 ${
                            (overviewData?.income_change_percentage ?? 0) >= 0
                              ? "text-success"
                              : "text-danger"
                          }`}
                        >
                          {(overviewData?.income_change_percentage ?? 0) >=
                          0 ? (
                            <ArrowUpRight size={12} />
                          ) : (
                            <ArrowDownRight size={12} />
                          )}
                          {overviewData?.income_change_percentage ?? 0}%
                        </span>
                        <span className="text-muted small">
                          in selected dates
                        </span>
                      </>
                    )}
                  </div>
                  <div className="accent-bar bg-success" />
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* C. Subscriptions & Orders Overview Details */}
          <Row className="g-4 mb-4">
            {/* Subscriptions breakdown panel */}
            <Col lg={5}>
              <Card className="border-0 shadow-sm rounded-4 h-100 overflow-hidden">
                <Card.Header className="bg-white border-0 pt-4 px-4 pb-0">
                  <div className="d-flex align-items-center gap-2">
                    <CreditCard className="text-primary" size={20} />
                    <h5 className="m-0 fw-bold text-dark">
                      Subscriptions Scope
                    </h5>
                  </div>
                </Card.Header>
                <Card.Body className="p-4">
                  <div className="d-flex flex-column gap-3 w-100">
                    <div className="d-flex align-items-center justify-content-between bg-light p-2.5 rounded-3 border-start border-3 border-primary shadow-xs">
                      <div>
                        <h6 className="mb-0 fw-bold text-dark small">
                          Active (as of selected date)
                        </h6>
                        <span className="text-muted text-xxs">
                          Total ongoing sub-base
                        </span>
                      </div>
                      <span className="fw-bold font-monospace text-primary h5 mb-0">
                        {overviewLoading
                          ? "..."
                          : (overviewData?.subscriptions?.active ?? 0)}
                      </span>
                    </div>

                    <div className="d-flex align-items-center justify-content-between bg-light p-2.5 rounded-3 border-start border-3 border-success shadow-xs">
                      <div>
                        <h6 className="mb-0 fw-bold text-dark small">
                          Started (in date range)
                        </h6>
                        <span className="text-muted text-xxs">
                          New purchases conversion
                        </span>
                      </div>
                      <span className="fw-bold font-monospace text-success h5 mb-0">
                        {overviewLoading
                          ? "..."
                          : `+${overviewData?.subscriptions?.started ?? 0}`}
                      </span>
                    </div>

                    <div className="d-flex align-items-center justify-content-between bg-light p-2.5 rounded-3 border-start border-3 border-danger shadow-xs">
                      <div>
                        <h6 className="mb-0 fw-bold text-dark small">
                          Cancelled (in date range)
                        </h6>
                        <span className="text-muted text-xxs">
                          Unsubscribed/refunded plans
                        </span>
                      </div>
                      <span className="fw-bold font-monospace text-danger h5 mb-0">
                        {overviewLoading
                          ? "..."
                          : `-${overviewData?.subscriptions?.cancelled ?? 0}`}
                      </span>
                    </div>

                    <div className="d-flex align-items-center justify-content-between bg-light p-2.5 rounded-3 border-start border-3 border-warning shadow-xs">
                      <div>
                        <h6 className="mb-0 fw-bold text-dark small">
                          Renewed (in date range)
                        </h6>
                        <span className="text-muted text-xxs">
                          Cycle renewals complete
                        </span>
                      </div>
                      <span className="fw-bold font-monospace text-warning h5 mb-0">
                        {overviewLoading
                          ? "..."
                          : `+${overviewData?.subscriptions?.renewed ?? 0}`}
                      </span>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            {/* Orders breakdown panel */}
            <Col lg={7}>
              <Card className="border-0 shadow-sm rounded-4 h-100 overflow-hidden">
                <Card.Header className="bg-white border-0 pt-4 px-4 pb-0 d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center gap-2">
                    <CartCheck className="text-warning" size={20} />
                    <h5 className="m-0 fw-bold text-dark">
                      📦 Orders Overview
                    </h5>
                  </div>
                  <span className="text-muted small">
                    Total:{" "}
                    <strong>
                      {overviewLoading
                        ? "..."
                        : (overviewData?.orders?.total_placed ?? 0)}
                    </strong>{" "}
                    placed
                  </span>
                </Card.Header>
                <Card.Body className="p-4 d-flex flex-column justify-content-center">
                  <div className="mb-4">
                    <h6 className="text-muted small fw-semibold text-uppercase mb-2">
                      Fulfillment Distribution
                    </h6>
                    <div
                      className="progress rounded-4 shadow-xs"
                      style={{ height: "30px" }}
                    >
                      <div
                        className="progress-bar bg-success"
                        style={{
                          width: `${overviewLoading ? 88 : (overviewData?.orders?.fulfillment_percentage ?? 0)}%`,
                        }}
                      >
                        Delivered (
                        {overviewLoading
                          ? "..."
                          : `${overviewData?.orders?.fulfillment_percentage ?? 0}%`}
                        )
                      </div>
                      <div
                        className="progress-bar bg-warning text-dark"
                        style={{
                          width: `${overviewLoading ? 12 : Math.max(100 - (overviewData?.orders?.fulfillment_percentage ?? 0), 0)}%`,
                        }}
                      >
                        Pending (
                        {overviewLoading
                          ? "..."
                          : `${Math.max(100 - (overviewData?.orders?.fulfillment_percentage ?? 0), 0)}%`}
                        )
                      </div>
                    </div>
                  </div>

                  <Row className="g-3">
                    <Col xs={4}>
                      <div className="p-3 bg-light rounded-3 d-flex flex-column align-items-center text-center border">
                        <CheckCircleFill
                          size={20}
                          className="text-success mb-1.5"
                        />
                        <h6 className="mb-0.5 text-secondary small">
                          Delivered
                        </h6>
                        <h5 className="fw-bold text-dark mb-0 font-monospace">
                          {overviewLoading
                            ? "..."
                            : (overviewData?.orders?.delivered ?? 0)}
                        </h5>
                      </div>
                    </Col>
                    <Col xs={4}>
                      <div className="p-3 bg-light rounded-3 d-flex flex-column align-items-center text-center border">
                        <HourglassSplit
                          size={20}
                          className="text-warning mb-1.5"
                        />
                        <h6 className="mb-0.5 text-secondary small">Pending</h6>
                        <h5 className="fw-bold text-dark mb-0 font-monospace">
                          {overviewLoading
                            ? "..."
                            : (overviewData?.orders?.pending ?? 0)}
                        </h5>
                      </div>
                    </Col>
                    <Col xs={4}>
                      <div className="p-3 bg-light rounded-3 d-flex flex-column align-items-center text-center border">
                        <ClipboardData
                          size={20}
                          className="text-primary mb-1.5"
                        />
                        <h6 className="mb-0.5 text-secondary small">
                          Fulfillment
                        </h6>
                        <h5 className="fw-bold text-dark mb-0 font-monospace">
                          {overviewLoading
                            ? "..."
                            : `${overviewData?.orders?.fulfillment_percentage ?? 0}%`}
                        </h5>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* D. Data Visualizations & Charts */}
          <Row className="g-4">
            {/* Graph 1: Daily Revenue Breakdown */}
            <Col lg={6}>
              <Card className="border-0 shadow-sm rounded-4 h-100 overflow-hidden position-relative">
                <Card.Header className="bg-white border-0 pt-4 px-4 pb-0 d-flex justify-content-between align-items-center">
                  <div>
                    <h5 className="m-0 fw-bold text-dark">
                      💰 Daily Revenue Breakdown
                    </h5>
                    <span className="text-muted small">
                      Daily revenue collections in INR
                    </span>
                  </div>
                  <Badge
                    bg="success-subtle"
                    className="text-success border border-success-subtle"
                  >
                    Revenue (INR)
                  </Badge>
                </Card.Header>
                <Card.Body className="p-4 position-relative">
                  <div
                    className="chart-container-inner"
                    style={{ minHeight: "240px" }}
                  >
                    <svg
                      width="100%"
                      height="220"
                      viewBox="0 0 500 220"
                      className="overflow-visible"
                    >
                      <defs>
                        <linearGradient
                          id="revGrad"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="0%"
                            stopColor="#10b981"
                            stopOpacity="0.3"
                          />
                          <stop
                            offset="100%"
                            stopColor="#10b981"
                            stopOpacity="0.0"
                          />
                        </linearGradient>
                      </defs>

                      {/* Grid Lines */}
                      {[0, 1, 2, 3].map((g) => (
                        <line
                          key={g}
                          x1="45"
                          y1={20 + g * 50}
                          x2="480"
                          y2={20 + g * 50}
                          stroke="#f3f4f6"
                          strokeWidth="1.5"
                        />
                      ))}

                      {/* Area Path */}
                      <path
                        d="M 45 150 L 117 108 L 190 130 L 262 67 L 335 136 L 407 169 L 480 87 L 480 170 L 45 170 Z"
                        fill="url(#revGrad)"
                      />

                      {/* Stroke Line */}
                      <path
                        d="M 45 150 L 117 108 L 190 130 L 262 67 L 335 136 L 407 169 L 480 87"
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />

                      {/* Nodes */}
                      {[
                        { x: 45, y: 150, val: 24500, lbl: "Jun 16" },
                        { x: 117, y: 108, val: 38200, lbl: "Jun 17" },
                        { x: 190, y: 130, val: 31000, lbl: "Jun 18" },
                        { x: 262, y: 67, val: 51200, lbl: "Jun 19" },
                        { x: 335, y: 136, val: 29000, lbl: "Jun 20" },
                        { x: 407, y: 169, val: 18500, lbl: "Jun 21" },
                        { x: 480, y: 87, val: 45200, lbl: "Jun 22" },
                      ].map((node, i) => (
                        <circle
                          key={i}
                          cx={node.x}
                          cy={node.y}
                          r={hoveredIdx === i ? 6.5 : 4}
                          fill={hoveredIdx === i ? "#059669" : "#10b981"}
                          stroke="#ffffff"
                          strokeWidth="1.5"
                          onMouseEnter={() => setHoveredIdx(i)}
                          onMouseLeave={() => setHoveredIdx(null)}
                          style={{
                            cursor: "pointer",
                            transition: "all 0.15s ease",
                          }}
                        />
                      ))}

                      {/* Labels */}
                      <text
                        x="45"
                        y="192"
                        textAnchor="middle"
                        fontSize="10"
                        fill="#9ca3af"
                      >
                        Jun 16
                      </text>
                      <text
                        x="117"
                        y="192"
                        textAnchor="middle"
                        fontSize="10"
                        fill="#9ca3af"
                      >
                        Jun 17
                      </text>
                      <text
                        x="190"
                        y="192"
                        textAnchor="middle"
                        fontSize="10"
                        fill="#9ca3af"
                      >
                        Jun 18
                      </text>
                      <text
                        x="262"
                        y="192"
                        textAnchor="middle"
                        fontSize="10"
                        fill="#9ca3af"
                      >
                        Jun 19
                      </text>
                      <text
                        x="335"
                        y="192"
                        textAnchor="middle"
                        fontSize="10"
                        fill="#9ca3af"
                      >
                        Jun 20
                      </text>
                      <text
                        x="407"
                        y="192"
                        textAnchor="middle"
                        fontSize="10"
                        fill="#9ca3af"
                      >
                        Jun 21
                      </text>
                      <text
                        x="480"
                        y="192"
                        textAnchor="middle"
                        fontSize="10"
                        fill="#9ca3af"
                      >
                        Jun 22
                      </text>
                    </svg>

                    {/* Tooltip Overlay */}
                    {hoveredIdx !== null && (
                      <div
                        className="chart-tooltip shadow border rounded-3 p-2 bg-dark text-white position-absolute"
                        style={{
                          left: `${overviewRevenueBreakdown[hoveredIdx].label === "Jun 16" ? 15 : hoveredIdx * 15 + 10}%`,
                          top: "30px",
                          zIndex: 10,
                        }}
                      >
                        <div className="text-secondary small fw-bold">
                          {overviewRevenueBreakdown[hoveredIdx].label}
                        </div>
                        <div className="fw-bold font-monospace text-emerald">
                          {formatCurrency(
                            overviewRevenueBreakdown[hoveredIdx].revenue,
                          )}
                        </div>
                        <div className="text-light small text-xxs font-monospace">
                          Orders: {overviewRevenueBreakdown[hoveredIdx].orders}
                        </div>
                      </div>
                    )}
                  </div>
                </Card.Body>
              </Card>
            </Col>

            {/* Graph 2: Daily Users + Revenue Trend Line Chart */}
            <Col lg={6}>
              <Card className="border-0 shadow-sm rounded-4 h-100 overflow-hidden position-relative">
                <Card.Header className="bg-white border-0 pt-4 px-4 pb-0 d-flex justify-content-between align-items-center">
                  <div>
                    <h5 className="m-0 fw-bold text-dark">
                      📊 Users & Revenue Trend
                    </h5>
                    <span className="text-muted small">
                      Registrations & Gross collections correlated
                    </span>
                  </div>
                  <div className="d-flex gap-2">
                    <span className="badge-legend bg-primary-subtle text-primary border border-primary-subtle px-1.5 py-0.5 rounded text-xxs">
                      Users
                    </span>
                    <span className="badge-legend bg-success-subtle text-success border border-success-subtle px-1.5 py-0.5 rounded text-xxs">
                      Revenue (k)
                    </span>
                  </div>
                </Card.Header>
                <Card.Body className="p-4 position-relative">
                  <div
                    className="chart-container-inner"
                    style={{ minHeight: "240px" }}
                  >
                    <svg
                      width="100%"
                      height="220"
                      viewBox="0 0 500 220"
                      className="overflow-visible"
                    >
                      {/* Grid Lines */}
                      {[0, 1, 2, 3].map((g) => (
                        <line
                          key={g}
                          x1="45"
                          y1={20 + g * 50}
                          x2="480"
                          y2={20 + g * 50}
                          stroke="#f3f4f6"
                          strokeWidth="1.5"
                        />
                      ))}

                      {/* Path 1: Users (Blue Line) */}
                      <path
                        d="M 45 150 L 117 90 L 190 126 L 262 38 L 335 138 L 407 168 L 480 80"
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />

                      {/* Path 2: Revenue in Thousands (Emerald Green Line) */}
                      <path
                        d="M 45 110 L 117 70 L 190 95 L 262 30 L 335 100 L 407 135 L 480 60"
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeDasharray="4,3"
                      />

                      {/* Interactive hover overlays mapping */}
                      {[
                        { x: 45, yUser: 150, yRev: 110 },
                        { x: 117, yUser: 90, yRev: 70 },
                        { x: 190, yUser: 126, yRev: 95 },
                        { x: 262, yUser: 38, yRev: 30 },
                        { x: 335, yUser: 138, yRev: 100 },
                        { x: 407, yUser: 168, yRev: 135 },
                        { x: 480, yUser: 80, yRev: 60 },
                      ].map((node, i) => (
                        <g key={i}>
                          <circle
                            cx={node.x}
                            cy={node.yUser}
                            r={hoveredTrendIdx === i ? 6 : 3.5}
                            fill="#3b82f6"
                            stroke="#ffffff"
                            strokeWidth="1"
                            onMouseEnter={() => setHoveredTrendIdx(i)}
                            onMouseLeave={() => setHoveredTrendIdx(null)}
                            style={{ cursor: "pointer" }}
                          />
                          <circle
                            cx={node.x}
                            cy={node.yRev}
                            r={hoveredTrendIdx === i ? 6 : 3.5}
                            fill="#10b981"
                            stroke="#ffffff"
                            strokeWidth="1"
                            onMouseEnter={() => setHoveredTrendIdx(i)}
                            onMouseLeave={() => setHoveredTrendIdx(null)}
                            style={{ cursor: "pointer" }}
                          />
                        </g>
                      ))}

                      {/* Labels */}
                      <text
                        x="45"
                        y="192"
                        textAnchor="middle"
                        fontSize="10"
                        fill="#9ca3af"
                      >
                        Jun 16
                      </text>
                      <text
                        x="117"
                        y="192"
                        textAnchor="middle"
                        fontSize="10"
                        fill="#9ca3af"
                      >
                        Jun 17
                      </text>
                      <text
                        x="190"
                        y="192"
                        textAnchor="middle"
                        fontSize="10"
                        fill="#9ca3af"
                      >
                        Jun 18
                      </text>
                      <text
                        x="262"
                        y="192"
                        textAnchor="middle"
                        fontSize="10"
                        fill="#9ca3af"
                      >
                        Jun 19
                      </text>
                      <text
                        x="335"
                        y="192"
                        textAnchor="middle"
                        fontSize="10"
                        fill="#9ca3af"
                      >
                        Jun 20
                      </text>
                      <text
                        x="407"
                        y="192"
                        textAnchor="middle"
                        fontSize="10"
                        fill="#9ca3af"
                      >
                        Jun 21
                      </text>
                      <text
                        x="480"
                        y="192"
                        textAnchor="middle"
                        fontSize="10"
                        fill="#9ca3af"
                      >
                        Jun 22
                      </text>
                    </svg>

                    {/* Trend Tooltip */}
                    {hoveredTrendIdx !== null && (
                      <div
                        className="chart-tooltip shadow border rounded-3 p-2 bg-dark text-white position-absolute"
                        style={{
                          left: `${trendData[hoveredTrendIdx].label === "Jun 16" ? 15 : hoveredTrendIdx * 15 + 10}%`,
                          top: "20px",
                          zIndex: 10,
                        }}
                      >
                        <div className="text-secondary small fw-bold">
                          {trendData[hoveredTrendIdx].label}
                        </div>
                        <div className="text-primary small font-monospace">
                          👥 New Users: {trendData[hoveredTrendIdx].users}
                        </div>
                        <div className="text-emerald small font-monospace">
                          💰 Income:{" "}
                          {formatCurrency(
                            trendData[hoveredTrendIdx].revenue * 1000,
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </div>
      )}

      {/* ==========================================
          TAB 2: USER MANAGEMENT VIEW
          ========================================== */}
      {activeTab === "users" && (
        <div className="animate-fade-in">
          {/* A. User Filters Card */}
          <Card className="border-0 shadow-sm rounded-4 mb-4">
            <Card.Body className="p-4 bg-white">
              <h6 className="fw-bold text-dark mb-3">User Directory Filters</h6>
              <Row className="g-3">
                <Col sm={12} md={4}>
                  <Form.Group>
                    <Form.Label className="small fw-semibold text-muted">
                      Signup Date Range
                    </Form.Label>
                    <div className="d-flex align-items-center gap-2">
                      <Form.Control
                        type="date"
                        size="sm"
                        value={usersSignupStart}
                        onChange={(e) => setUsersSignupStart(e.target.value)}
                        className="font-monospace border-light-subtle rounded-2"
                      />
                      <span className="text-muted small">to</span>
                      <Form.Control
                        type="date"
                        size="sm"
                        value={usersSignupEnd}
                        onChange={(e) => setUsersSignupEnd(e.target.value)}
                        className="font-monospace border-light-subtle rounded-2"
                      />
                    </div>
                  </Form.Group>
                </Col>
                <Col sm={12} md={4}>
                  <Form.Group>
                    <Form.Label className="small fw-semibold text-muted">
                      Last Login Date
                    </Form.Label>
                    <Form.Control
                      type="date"
                      size="sm"
                      value={usersLastLogin}
                      onChange={(e) => setUsersLastLogin(e.target.value)}
                      className="font-monospace border-light-subtle rounded-2"
                    />
                  </Form.Group>
                </Col>
                <Col sm={12} md={4}>
                  <Form.Group>
                    <Form.Label className="small fw-semibold text-muted">
                      Subscription Start Date
                    </Form.Label>
                    <Form.Control
                      type="date"
                      size="sm"
                      value={usersSubStart}
                      onChange={(e) => setUsersSubStart(e.target.value)}
                      className="font-monospace border-light-subtle rounded-2"
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* B. Users Summary Stats */}
          <Row className="g-3 mb-4">
            <Col xs={12} sm={4}>
              <div className="bg-white p-3 rounded-4 border shadow-sm text-center">
                <h6 className="text-muted small mb-1">
                  Users Joined (Selected Dates)
                </h6>
                <h4 className="fw-bold text-primary font-monospace mb-0">
                  {usersJoinedSelected}
                </h4>
              </div>
            </Col>
            <Col xs={12} sm={4}>
              <div className="bg-white p-3 rounded-4 border shadow-sm text-center">
                <h6 className="text-muted small mb-1">
                  Users Last Active (by selected date)
                </h6>
                <h4 className="fw-bold text-success font-monospace mb-0">
                  {usersLastActiveSelected}
                </h4>
              </div>
            </Col>
            <Col xs={12} sm={4}>
              <div className="bg-white p-3 rounded-4 border shadow-sm text-center">
                <h6 className="text-muted small mb-1">
                  Total Range Registrations
                </h6>
                <h4 className="fw-bold text-dark font-monospace mb-0">
                  {usersTotalRangeRegs}
                </h4>
              </div>
            </Col>
          </Row>

          {/* C. Users Table */}
          <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
            <Card.Body className="p-0">
              <div className="table-responsive">
                <Table hover className="align-middle mb-0 text-nowrap">
                  <thead className="table-dark border-bottom text-secondary small uppercase fw-semibold">
                    <tr>
                      <th className="py-3 px-4">Name</th>
                      <th className="py-3 px-4">Join Date 📅</th>
                      <th className="py-3 px-4">Last Active Date 📅</th>
                      <th className="py-3 px-4">Subscription Status</th>
                      <th className="py-3 px-4 text-center">Total Orders</th>
                    </tr>
                  </thead>
                  <tbody className="text-dark small fw-medium">
                    {usersLoading ? (
                      <tr>
                        <td colSpan="5" className="text-center py-5">
                          <div
                            className="spinner-border spinner-border-sm text-primary me-2"
                            role="status"
                          />
                          <span className="text-muted">
                            Loading live directory...
                          </span>
                        </td>
                      </tr>
                    ) : usersError ? (
                      <tr>
                        <td
                          colSpan="5"
                          className="text-center py-5 text-danger fw-semibold"
                        >
                          ⚠ Error: {usersError}
                        </td>
                      </tr>
                    ) : usersData.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="text-center py-5 text-muted">
                          No users found matching current filters.
                        </td>
                      </tr>
                    ) : (
                      usersData.map((user, idx) => (
                        <tr key={user.id || idx}>
                          <td className="px-4">
                            <span className="fw-bold text-dark text-capitalize">
                              {user.name || "Unnamed User"}
                            </span>
                            {user.phone_number && (
                              <div className="text-muted text-xxs font-monospace mt-0.5">
                                {user.phone_number}
                              </div>
                            )}
                          </td>
                          <td className="px-4 font-monospace text-secondary">
                            {user.join_date || "N/A"}
                          </td>
                          <td className="px-4 font-monospace text-secondary">
                            {user.last_active_date || "N/A"}
                          </td>
                          <td className="px-4">
                            {user.subscription_status?.toLowerCase() ===
                            "active" ? (
                              <Badge
                                bg="success-subtle"
                                className="text-success border border-success-subtle rounded-2 px-2 py-1.5"
                              >
                                Active
                              </Badge>
                            ) : user.subscription_status?.toLowerCase() ===
                              "cancelled" ? (
                              <Badge
                                bg="danger-subtle"
                                className="text-danger border border-danger-subtle rounded-2 px-2 py-1.5"
                              >
                                Cancelled
                              </Badge>
                            ) : user.subscription_status?.toLowerCase() ===
                              "expired" ? (
                              <Badge
                                bg="warning-subtle"
                                className="text-warning border border-warning-subtle rounded-2 px-2 py-1.5"
                              >
                                Expired
                              </Badge>
                            ) : (
                              <Badge
                                bg="secondary-subtle"
                                className="text-secondary border border-secondary-subtle rounded-2 px-2 py-1.5"
                              >
                                Inactive
                              </Badge>
                            )}
                          </td>
                          <td className="px-4 text-center font-monospace fw-bold">
                            {user.total_orders ?? 0}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
            {usersData.length > 0 && (
              <Card.Footer className="bg-white border-0 py-3 px-4 d-flex flex-column flex-sm-row justify-content-between align-items-center gap-3 border-top">
                <div className="d-flex align-items-center gap-2 small text-muted">
                  <span>Show</span>
                  <Form.Select
                    size="sm"
                    value={usersLimit}
                    onChange={(e) => setUsersLimit(Number(e.target.value))}
                    style={{ width: "75px" }}
                    className="border-light-subtle rounded-2 font-monospace"
                  >
                    {[10, 20, 50, 100].map((lim) => (
                      <option key={lim} value={lim}>
                        {lim}
                      </option>
                    ))}
                  </Form.Select>
                  <span>
                    records of <strong>{usersTotalCount}</strong> found
                  </span>
                </div>

                <div className="d-flex align-items-center gap-2">
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    className="rounded-3 px-3 border-light-subtle py-1.5 fw-semibold font-monospace"
                    disabled={usersPage === 1 || usersLoading}
                    onClick={() =>
                      setUsersPage((prev) => Math.max(prev - 1, 1))
                    }
                  >
                    ◀ Prev
                  </Button>
                  <span className="small fw-bold text-secondary font-monospace px-2">
                    Page {usersPage} of {usersTotalPages || 1}
                  </span>
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    className="rounded-3 px-3 border-light-subtle py-1.5 fw-semibold font-monospace"
                    disabled={usersPage === usersTotalPages || usersLoading}
                    onClick={() =>
                      setUsersPage((prev) =>
                        Math.min(prev + 1, usersTotalPages),
                      )
                    }
                  >
                    Next ▶
                  </Button>
                </div>
              </Card.Footer>
            )}
          </Card>
        </div>
      )}

      {/* ==========================================
          TAB 3: SUBSCRIPTION MANAGEMENT VIEW
          ========================================== */}
      {activeTab === "subscriptions" && (
        <div className="animate-fade-in">
          {/* A. Analytics Summary cards */}
          <Row className="g-3 mb-4">
            <Col xs={6} md={3}>
              <div className="bg-white p-3 rounded-4 border shadow-sm">
                <span className="text-muted small fw-semibold">
                  Started in Range
                </span>
                <h4 className="fw-bold text-primary font-monospace mt-1 mb-0">
                  {subLoading ? "..." : `+${subStarted}`}
                </h4>
              </div>
            </Col>
            <Col xs={6} md={3}>
              <div className="bg-white p-3 rounded-4 border shadow-sm">
                <span className="text-muted small fw-semibold">
                  Cancelled in Range
                </span>
                <h4 className="fw-bold text-danger font-monospace mt-1 mb-0">
                  {subLoading ? "..." : `-${subCancelled}`}
                </h4>
              </div>
            </Col>
            <Col xs={6} md={3}>
              <div className="bg-white p-3 rounded-4 border shadow-sm">
                <span className="text-muted small fw-semibold">
                  Renewed in Range
                </span>
                <h4 className="fw-bold text-success font-monospace mt-1 mb-0">
                  {subLoading ? "..." : `+${subRenewed}`}
                </h4>
              </div>
            </Col>
            <Col xs={6} md={3}>
              <div className="bg-white p-3 rounded-4 border shadow-sm">
                <span className="text-muted small fw-semibold">
                  Active Subscriptions (Today)
                </span>
                <h4 className="fw-bold text-dark font-monospace mt-1 mb-0">
                  {subLoading ? "..." : subActive}
                </h4>
              </div>
            </Col>
          </Row>

          {/* B. Subscription Charts */}
          <Row className="g-4 mb-4">
            {/* Daily Subscription Growth Graph */}
            <Col lg={7}>
              <Card className="border-0 shadow-sm rounded-4 h-100 overflow-hidden position-relative">
                <Card.Header className="bg-white border-0 pt-4 px-4 pb-0 d-flex justify-content-between align-items-center">
                  <div>
                    <h5 className="m-0 fw-bold text-dark">
                      📈 Daily Subscription Growth & Cancellations
                    </h5>
                    <span className="text-muted small">
                      Subscription changes day-by-day
                    </span>
                  </div>
                  <div className="d-flex gap-2">
                    <span className="badge-legend bg-indigo-subtle text-indigo border border-indigo-subtle px-1.5 py-0.5 rounded text-xxs">
                      Signups
                    </span>
                    <span className="badge-legend bg-danger-subtle text-danger border border-danger-subtle px-1.5 py-0.5 rounded text-xxs">
                      Cancellations
                    </span>
                  </div>
                </Card.Header>
                <Card.Body className="p-4 position-relative">
                  <div
                    className="chart-container-inner"
                    style={{ minHeight: "220px" }}
                  >
                    {subLoading ? (
                      <div className="d-flex align-items-center justify-content-center" style={{ height: "200px" }}>
                        <div className="spinner-border text-primary" role="status" />
                      </div>
                    ) : subError ? (
                      <div className="d-flex align-items-center justify-content-center text-danger fw-semibold" style={{ height: "200px" }}>
                        ⚠ Error: {subError}
                      </div>
                    ) : subGrowthData.length === 0 ? (
                      <div className="d-flex align-items-center justify-content-center text-muted" style={{ height: "200px" }}>
                        No subscription growth data available.
                      </div>
                    ) : (
                      <>
                        <svg
                          width="100%"
                          height="200"
                          viewBox="0 0 500 200"
                          className="overflow-visible"
                        >
                          {/* Grid Lines */}
                          {[0, 1, 2, 3].map((g) => (
                            <line
                              key={g}
                              x1="40"
                              y1={15 + g * 45}
                              x2="480"
                              y2={15 + g * 45}
                              stroke="#f3f4f6"
                              strokeWidth="1.5"
                            />
                          ))}

                          {/* Signups Line */}
                          <path
                            d={subSignupPath}
                            fill="none"
                            stroke="#6366f1"
                            strokeWidth="3"
                            strokeLinecap="round"
                          />

                          {/* Cancellations Line */}
                          <path
                            d={subCancelPath}
                            fill="none"
                            stroke="#f43f5e"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                          />

                          {/* Interactive nodes */}
                          {subChartPoints.map((node, i) => (
                            <circle
                              key={i}
                              cx={node.x}
                              cy={node.ySignup}
                              r={hoveredSubIdx === i ? 6 : 3.5}
                              fill="#6366f1"
                              stroke="#ffffff"
                              strokeWidth="1"
                              onMouseEnter={() => setHoveredSubIdx(i)}
                              onMouseLeave={() => setHoveredSubIdx(null)}
                              style={{ cursor: "pointer" }}
                            />
                          ))}
                        </svg>
                        {hoveredSubIdx !== null && subGrowthData[hoveredSubIdx] && (
                          <div
                            className="chart-tooltip shadow border rounded-3 p-2 bg-dark text-white position-absolute"
                            style={{
                              left: `${subGrowthData[hoveredSubIdx].label === "Jun 16" ? 15 : hoveredSubIdx * 15 + 10}%`,
                              top: "20px",
                              zIndex: 10,
                            }}
                          >
                            <div className="text-secondary small fw-bold">
                              {subGrowthData[hoveredSubIdx].label}
                            </div>
                            <div className="text-indigo small font-monospace">
                              Signups: +{subGrowthData[hoveredSubIdx].growth}
                            </div>
                            <div className="text-danger small font-monospace">
                              Cancelled: -{subGrowthData[hoveredSubIdx].cancellations}
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </Card.Body>
              </Card>
            </Col>

            {/* Renewal Rate Radial Gauge Chart */}
            <Col lg={5}>
              <Card className="border-0 shadow-sm rounded-4 h-100 overflow-hidden">
                <Card.Header className="bg-white border-0 pt-4 px-4 pb-0">
                  <h5 className="m-0 fw-bold text-dark">
                    🔄 Renewal Rate Rate
                  </h5>
                  <span className="text-muted small">
                    Subscription retention analytics
                  </span>
                </Card.Header>
                <Card.Body className="p-4 d-flex flex-column align-items-center justify-content-center">
                  <div
                    className="position-relative d-flex align-items-center justify-content-center mb-3"
                    style={{ width: "160px", height: "160px" }}
                  >
                    {/* SVG Radial Progress Circle */}
                    <svg
                      width="100%"
                      height="100%"
                      viewBox="0 0 100 100"
                      className="overflow-visible"
                    >
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="transparent"
                        stroke="#f3f4f6"
                        strokeWidth="9"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="transparent"
                        stroke="#10b981"
                        strokeWidth="9"
                        strokeDasharray="251.2"
                        strokeDashoffset={251.2 - (251.2 * (subLoading ? 84 : subRenewalRate)) / 100}
                        strokeLinecap="round"
                        transform="rotate(-90 50 50)"
                      />
                    </svg>
                    <div className="position-absolute text-center">
                      <h2 className="fw-bold mb-0 font-monospace text-emerald">
                        {subLoading ? "..." : `${subRenewalRate}%`}
                      </h2>
                      <span className="text-muted text-xxs fw-semibold uppercase">
                        Renewal Rate
                      </span>
                    </div>
                  </div>

                  <div className="w-100 mt-2 p-3 bg-light rounded-3 d-flex justify-content-around text-center border">
                    <div>
                      <h6 className="text-muted small mb-0.5">
                        Average Plan Lifecycle
                      </h6>
                      <h5 className="fw-bold text-dark mb-0 font-monospace">
                        {subLoading ? "..." : `${subAvgLifecycle} Days`}
                      </h5>
                    </div>
                    <div className="border-end" />
                    <div>
                      <h6 className="text-muted small mb-0.5">Churn Rate</h6>
                      <h5 className="fw-bold text-danger mb-0 font-monospace">
                        {subLoading ? "..." : `${subChurnRate}%`}
                      </h5>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </div>
      )}

      {/* ==========================================
          TAB 4: ORDERS / PAD DELIVERY VIEW
          ========================================== */}
      {activeTab === "orders" && (
        <div className="animate-fade-in">
          {/* A. Date & Status Filters */}
          <Card className="border-0 shadow-sm rounded-4 mb-4">
            <Card.Body className="p-4 bg-white">
              <h6 className="fw-bold text-dark mb-3">Order Schedule Filters</h6>
              <Row className="g-3">
                <Col sm={12} md={4}>
                  <Form.Group>
                    <Form.Label className="small fw-semibold text-muted">
                      Orders Placed Range
                    </Form.Label>
                    <div className="d-flex align-items-center gap-2">
                      <Form.Control
                        type="date"
                        size="sm"
                        value={ordersPlacedStart}
                        onChange={(e) => setOrdersPlacedStart(e.target.value)}
                        className="font-monospace border-light-subtle rounded-2"
                      />
                      <span className="text-muted small">to</span>
                      <Form.Control
                        type="date"
                        size="sm"
                        value={ordersPlacedEnd}
                        onChange={(e) => setOrdersPlacedEnd(e.target.value)}
                        className="font-monospace border-light-subtle rounded-2"
                      />
                    </div>
                  </Form.Group>
                </Col>
                <Col sm={12} md={4}>
                  <Form.Group>
                    <Form.Label className="small fw-semibold text-muted">
                      Delivery Date Range
                    </Form.Label>
                    <div className="d-flex align-items-center gap-2">
                      <Form.Control
                        type="date"
                        size="sm"
                        value={ordersDeliveryStart}
                        onChange={(e) => setOrdersDeliveryStart(e.target.value)}
                        className="font-monospace border-light-subtle rounded-2"
                      />
                      <span className="text-muted small">to</span>
                      <Form.Control
                        type="date"
                        size="sm"
                        value={ordersDeliveryEnd}
                        onChange={(e) => setOrdersDeliveryEnd(e.target.value)}
                        className="font-monospace border-light-subtle rounded-2"
                      />
                    </div>
                  </Form.Group>
                </Col>
                <Col sm={12} md={4}>
                  <Form.Group>
                    <Form.Label className="small fw-semibold text-muted">
                      Fulfillment Status
                    </Form.Label>
                    <Form.Select
                      size="sm"
                      value={ordersStatus}
                      onChange={(e) => setOrdersStatus(e.target.value)}
                      className="border-light-subtle rounded-2 font-medium text-secondary"
                    >
                      <option value="">All Statuses</option>
                      <option value="delivered">Delivered</option>
                      <option value="in_transit">In Transit</option>
                      <option value="pending_dispatch">Pending Dispatch</option>
                      <option value="awaiting_payment">Awaiting Payment</option>
                      <option value="cancelled">Cancelled</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* B. Order Metrics Row */}
          <Row className="g-3 mb-4">
            <Col xs={12} md={4}>
              <div className="bg-white p-3.5 rounded-4 border shadow-sm text-center">
                <h6 className="text-muted small mb-1">📅 Peak Order Days</h6>
                <h5 className="fw-bold text-warning mb-0">
                  {ordersLoading ? "..." : ordersPeakDays}
                </h5>
              </div>
            </Col>
            <Col xs={12} md={4}>
              <div className="bg-white p-3.5 rounded-4 border shadow-sm text-center">
                <h6 className="text-muted small mb-1">
                  ⏱️ Average Delivery Time
                </h6>
                <h5 className="fw-bold text-success mb-0">
                  {ordersLoading ? "..." : `${ordersAvgDelivery} Days`}{" "}
                  <span className="text-muted text-xxs font-normal">
                    (In-range calculation)
                  </span>
                </h5>
              </div>
            </Col>
            <Col xs={12} md={4}>
              <div className="bg-white p-3.5 rounded-4 border shadow-sm text-center">
                <h6 className="text-muted small mb-1">
                  📊 Fulfillment Target Ratio
                </h6>
                <h5 className="fw-bold text-dark mb-0">
                  {ordersLoading ? "..." : `${ordersFulfillmentRatio}% achieved`}
                </h5>
              </div>
            </Col>
          </Row>

          {/* C. Orders Timeline Table */}
          <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
            <Card.Header className="bg-white border-0 pt-4 px-4 pb-0">
              <div className="d-flex align-items-center gap-2">
                <ClockHistory className="text-secondary" size={20} />
                <h5 className="m-0 fw-bold text-dark">
                  Orders Delivery Track sheet
                </h5>
              </div>
            </Card.Header>
            <Card.Body className="p-0 mt-3">
              <div className="table-responsive">
                <Table hover className="align-middle mb-0 text-nowrap">
                  <thead className="table-dark border-bottom text-secondary small uppercase fw-semibold">
                    <tr>
                      <th className="py-3 px-4">Order ID</th>
                      <th className="py-3 px-4">Customer</th>
                      <th className="py-3 px-4">Placed Date 📅</th>
                      <th className="py-3 px-4">Payment Date 📅</th>
                      <th className="py-3 px-4">Dispatch Date 📅</th>
                      <th className="py-3 px-4">Delivery Date 📅</th>
                      <th className="py-3 px-4">Fulfillment Status</th>
                    </tr>
                  </thead>
                  <tbody className="text-dark small fw-medium">
                    {ordersLoading ? (
                      <tr>
                        <td colSpan="7" className="text-center py-5">
                          <div
                            className="spinner-border spinner-border-sm text-primary me-2"
                            role="status"
                          />
                          <span className="text-muted">
                            Loading live orders...
                          </span>
                        </td>
                      </tr>
                    ) : ordersError ? (
                      <tr>
                        <td
                          colSpan="7"
                          className="text-center py-5 text-danger fw-semibold"
                        >
                          ⚠ Error: {ordersError}
                        </td>
                      </tr>
                    ) : ordersData.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="text-center py-5 text-muted">
                          No orders found matching current filters.
                        </td>
                      </tr>
                    ) : (
                      ordersData.map((order, idx) => {
                        const normalizedStatus = order.status?.toLowerCase().replace(/_/g, " ") || "";
                        return (
                          <tr key={order.id || idx}>
                            <td className="px-4 fw-bold font-monospace">
                              {order.id}
                            </td>
                            <td className="px-4">
                              <span className="fw-bold text-dark text-capitalize">
                                {order.customer_name || "Unnamed"}
                              </span>
                              {order.customer_phone_number && (
                                <div className="text-muted text-xxs font-monospace mt-0.5">
                                  {order.customer_phone_number}
                                </div>
                              )}
                            </td>
                            <td className="px-4 font-monospace text-secondary">
                              {order.placed_date || "N/A"}
                            </td>
                            <td className="px-4 font-monospace text-secondary">
                              {normalizedStatus !== "awaiting payment" ? (
                                order.placed_date || "N/A"
                              ) : (
                                <span className="text-warning">Pending</span>
                              )}
                            </td>
                            <td className="px-4 font-monospace text-secondary">
                              {order.dispatch_date || "Pending"}
                            </td>
                            <td className="px-4 font-monospace text-secondary">
                              {order.expected_delivery_date || "Pending"}
                            </td>
                            <td className="px-4">
                              {normalizedStatus === "delivered" ? (
                                <Badge
                                  bg="success-subtle"
                                  className="text-success border border-success-subtle rounded-2 px-2 py-1.5 text-capitalize"
                                >
                                  {order.status}
                                </Badge>
                              ) : normalizedStatus === "in transit" ||
                                normalizedStatus === "pending dispatch" ? (
                                <Badge
                                  bg="warning-subtle"
                                  className="text-warning-emphasis border border-warning-subtle rounded-2 px-2 py-1.5 text-capitalize"
                                >
                                  {order.status}
                                </Badge>
                              ) : normalizedStatus === "cancelled" ? (
                                <Badge
                                  bg="danger-subtle"
                                  className="text-danger border border-danger-subtle rounded-2 px-2 py-1.5 text-capitalize"
                                >
                                  {order.status}
                                </Badge>
                              ) : (
                                <Badge
                                  bg="secondary-subtle"
                                  className="text-secondary border border-secondary-subtle rounded-2 px-2 py-1.5 text-capitalize"
                                >
                                  {order.status || "Unknown"}
                                </Badge>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
            {ordersData.length > 0 && (
              <Card.Footer className="bg-white border-0 py-3 px-4 d-flex flex-column flex-sm-row justify-content-between align-items-center gap-3 border-top">
                <div className="d-flex align-items-center gap-2 small text-muted">
                  <span>Show</span>
                  <Form.Select
                    size="sm"
                    value={ordersLimit}
                    onChange={(e) => setOrdersLimit(Number(e.target.value))}
                    style={{ width: "75px" }}
                    className="border-light-subtle rounded-2 font-monospace"
                  >
                    {[10, 20, 50, 100].map((lim) => (
                      <option key={lim} value={lim}>
                        {lim}
                      </option>
                    ))}
                  </Form.Select>
                  <span>
                    records of <strong>{ordersTotalCount}</strong> found
                  </span>
                </div>

                <div className="d-flex align-items-center gap-2">
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    className="rounded-3 px-3 border-light-subtle py-1.5 fw-semibold font-monospace"
                    disabled={ordersPage === 1 || ordersLoading}
                    onClick={() =>
                      setOrdersPage((prev) => Math.max(prev - 1, 1))
                    }
                  >
                    ◀ Prev
                  </Button>
                  <span className="small fw-bold text-secondary font-monospace px-2">
                    Page {ordersPage} of {ordersTotalPages || 1}
                  </span>
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    className="rounded-3 px-3 border-light-subtle py-1.5 fw-semibold font-monospace"
                    disabled={ordersPage === ordersTotalPages || ordersLoading}
                    onClick={() =>
                      setOrdersPage((prev) =>
                        Math.min(prev + 1, ordersTotalPages),
                      )
                    }
                  >
                    Next ▶
                  </Button>
                </div>
              </Card.Footer>
            )}
          </Card>
        </div>
      )}

      {/* ==========================================
          TAB 5: PAYMENTS & TRANSACTIONS VIEW
          ========================================== */}
      {activeTab === "payments" && (
        <div className="animate-fade-in">
          {/* A. Date & Status Filters */}
          <Card className="border-0 shadow-sm rounded-4 mb-4">
            <Card.Body className="p-4 bg-white">
              <h6 className="fw-bold text-dark mb-3">Payments Ledger Filters</h6>
              <Row className="g-3">
                <Col sm={12} md={6}>
                  <Form.Group>
                    <Form.Label className="small fw-semibold text-muted">
                      Payment Date Range
                    </Form.Label>
                    <div className="d-flex align-items-center gap-2">
                      <Form.Control
                        type="date"
                        size="sm"
                        value={paymentsStart}
                        onChange={(e) => {
                          setPaymentsStart(e.target.value);
                          setIsPaymentsInitial(false);
                        }}
                        className="font-monospace border-light-subtle rounded-2"
                      />
                      <span className="text-muted small">to</span>
                      <Form.Control
                        type="date"
                        size="sm"
                        value={paymentsEnd}
                        onChange={(e) => {
                          setPaymentsEnd(e.target.value);
                          setIsPaymentsInitial(false);
                        }}
                        className="font-monospace border-light-subtle rounded-2"
                      />
                    </div>
                  </Form.Group>
                </Col>
                <Col sm={12} md={6}>
                  <Form.Group>
                    <Form.Label className="small fw-semibold text-muted">
                      Payment Status
                    </Form.Label>
                    <Form.Select
                      size="sm"
                      value={paymentsStatus}
                      onChange={(e) => {
                        setPaymentsStatus(e.target.value);
                        setIsPaymentsInitial(false);
                      }}
                      className="border-light-subtle rounded-2 font-medium text-secondary"
                    >
                      <option value="">All Statuses</option>
                      <option value="captured">Captured</option>
                      <option value="failed">Failed</option>
                      <option value="refunded">Refunded</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* B. Payments Stats Metrics Row */}
          <Row className="g-3 mb-4">
            <Col xs={6} md={3}>
              <div className="bg-white p-3 rounded-4 border shadow-sm text-center">
                <span className="text-muted small fw-semibold d-block">
                  Revenue Per Day (Avg)
                </span>
                <h4 className="fw-bold text-success font-monospace mt-1 mb-0">
                  {formatCurrency(45200)}
                </h4>
              </div>
            </Col>
            <Col xs={6} md={3}>
              <div className="bg-white p-3 rounded-4 border shadow-sm text-center">
                <span className="text-muted small fw-semibold d-block">
                  Revenue Per Month (Est)
                </span>
                <h4 className="fw-bold text-emerald font-monospace mt-1 mb-0">
                  {formatCurrency(1240000)}
                </h4>
              </div>
            </Col>
            <Col xs={6} md={3}>
              <div className="bg-white p-3 rounded-4 border shadow-sm text-center">
                <span className="text-muted small fw-semibold d-block">
                  Failed Payments (Daily)
                </span>
                <h4 className="fw-bold text-danger font-monospace mt-1 mb-0">
                  3 failed
                </h4>
              </div>
            </Col>
            <Col xs={6} md={3}>
              <div className="bg-white p-3 rounded-4 border shadow-sm text-center">
                <span className="text-muted small fw-semibold d-block">
                  Refunds Issued (Scope)
                </span>
                <h4 className="fw-bold text-warning font-monospace mt-1 mb-0">
                  {formatCurrency(8500)}
                </h4>
              </div>
            </Col>
          </Row>

          {/* C. Payments Table Ledger */}
          <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
            <Card.Header className="bg-white border-0 pt-4 px-4 pb-0">
              <div className="d-flex align-items-center gap-2">
                <CashStack className="text-success" size={20} />
                <h5 className="m-0 fw-bold text-dark">
                  Payments Transactions log
                </h5>
              </div>
            </Card.Header>
            <Card.Body className="p-0 mt-3">
              <div className="table-responsive">
                <Table hover className="align-middle mb-0 text-nowrap">
                  <thead className="table-dark border-bottom text-secondary small uppercase fw-semibold">
                    <tr>
                      <th className="py-3 px-4">Txn ID</th>
                      <th className="py-3 px-4">Customer</th>
                      <th className="py-3 px-4">Payment Date 📅</th>
                      <th className="py-3 px-4 text-end">Amount</th>
                      <th className="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="text-dark small fw-medium">
                    {paymentsLoading ? (
                      <tr>
                        <td colSpan="5" className="text-center py-5">
                          <div
                            className="spinner-border spinner-border-sm text-primary me-2"
                            role="status"
                          />
                          <span className="text-muted">
                            Loading live payments...
                          </span>
                        </td>
                      </tr>
                    ) : paymentsError ? (
                      <tr>
                        <td
                          colSpan="5"
                          className="text-center py-5 text-danger fw-semibold"
                        >
                          ⚠ Error: {paymentsError}
                        </td>
                      </tr>
                    ) : paymentsData.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="text-center py-5 text-muted">
                          No transactions found matching current filters.
                        </td>
                      </tr>
                    ) : (
                      paymentsData.map((txn, idx) => (
                        <tr key={txn.id || idx}>
                          <td className="px-4 fw-bold font-monospace">
                            {txn.id}
                          </td>
                          <td className="px-4">
                            <span className="fw-bold text-dark text-capitalize">
                              {txn.customer_name || "Unnamed"}
                            </span>
                            {txn.customer_phone_number && (
                              <div className="text-muted text-xxs font-monospace mt-0.5">
                                {txn.customer_phone_number}
                              </div>
                            )}
                          </td>
                          <td className="px-4 font-monospace text-secondary">
                            {txn.payment_date || "N/A"}
                          </td>
                          <td className="px-4 text-end font-monospace fw-bold text-dark">
                            {formatCurrency(txn.amount)}
                          </td>
                          <td className="px-4">
                            {txn.status?.toLowerCase() === "captured" || txn.status?.toLowerCase() === "success" ? (
                              <Badge
                                bg="success-subtle"
                                className="text-success border border-success-subtle rounded-2 px-2 py-1.5 text-capitalize"
                              >
                                {txn.status}
                              </Badge>
                            ) : txn.status?.toLowerCase() === "failed" ? (
                              <Badge
                                bg="danger-subtle"
                                className="text-danger border border-danger-subtle rounded-2 px-2 py-1.5 text-capitalize"
                              >
                                {txn.status}
                              </Badge>
                            ) : (
                              <Badge
                                bg="warning-subtle"
                                className="text-warning-emphasis border border-warning-subtle rounded-2 px-2 py-1.5 text-capitalize"
                              >
                                {txn.status || "Unknown"}
                              </Badge>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
            {paymentsData.length > 0 && (
              <Card.Footer className="bg-white border-0 py-3 px-4 d-flex flex-column flex-sm-row justify-content-between align-items-center gap-3 border-top">
                <div className="d-flex align-items-center gap-2 small text-muted">
                  <span>Show</span>
                  <Form.Select
                    size="sm"
                    value={paymentsLimit}
                    onChange={(e) => setPaymentsLimit(Number(e.target.value))}
                    style={{ width: "75px" }}
                    className="border-light-subtle rounded-2 font-monospace"
                  >
                    {[10, 20, 50, 100].map((lim) => (
                      <option key={lim} value={lim}>
                        {lim}
                      </option>
                    ))}
                  </Form.Select>
                  <span>
                    records of <strong>{paymentsTotalCount}</strong> found
                  </span>
                </div>

                <div className="d-flex align-items-center gap-2">
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    className="rounded-3 px-3 border-light-subtle py-1.5 fw-semibold font-monospace"
                    disabled={paymentsPage === 1 || paymentsLoading}
                    onClick={() =>
                      setPaymentsPage((prev) => Math.max(prev - 1, 1))
                    }
                  >
                    ◀ Prev
                  </Button>
                  <span className="small fw-bold text-secondary font-monospace px-2">
                    Page {paymentsPage} of {paymentsTotalPages || 1}
                  </span>
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    className="rounded-3 px-3 border-light-subtle py-1.5 fw-semibold font-monospace"
                    disabled={paymentsPage === paymentsTotalPages || paymentsLoading}
                    onClick={() =>
                      setPaymentsPage((prev) =>
                        Math.min(prev + 1, paymentsTotalPages),
                      )
                    }
                  >
                    Next ▶
                  </Button>
                </div>
              </Card.Footer>
            )}
          </Card>
        </div>
      )}

      {/* ==========================================
          STYLES AND DYNAMICS CUSTOM POLISH
          ========================================== */}
      <style jsx>{`
        .transition-all {
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .tracking-wider {
          letter-spacing: 0.05em;
        }
        .font-monospace {
          font-family: var(--font-geist-mono), monospace !important;
        }
        .text-emerald {
          color: #10b981 !important;
        }
        .text-indigo {
          color: #6366f1 !important;
        }
        .text-xxs {
          font-size: 0.65rem !important;
        }
        .hover-bg-gray:hover {
          background-color: #e5e7eb !important;
          color: #111827 !important;
        }

        /* KPI Card styles */
        .kpi-card {
          transition:
            transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),
            box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          background-color: #ffffff;
        }
        .kpi-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px -10px rgba(0, 0, 0, 0.12) !important;
        }
        .accent-bar {
          position: absolute;
          bottom: 0;
          left: 0;
          height: 4px;
          width: 100%;
          opacity: 0.75;
        }
        .kpi-icon-bg {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Pulse */
        .live-pulse-container {
          position: relative;
          display: inline-flex;
          width: 8px;
          height: 8px;
          margin-bottom: 2px;
        }
        .live-pulse-dot {
          position: absolute;
          border-radius: 50%;
          width: 8px;
          height: 8px;
          background-color: #ef4444;
        }
        .live-pulse-ring {
          position: absolute;
          border-radius: 50%;
          width: 8px;
          height: 8px;
          background-color: #ef4444;
          animation: pulse 1.6s cubic-bezier(0, 0, 0.2, 1) infinite;
          opacity: 0.6;
        }
        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 0.85;
          }
          100% {
            transform: scale(3.5);
            opacity: 0;
          }
        }

        /* Progress bars custom design */
        .progress-bar-thin {
          height: 6px;
          width: 100%;
          overflow: hidden;
        }
        .progress-bar-fill {
          height: 100%;
          transition: width 0.5s ease-out;
        }
        .legend-dot {
          display: inline-block;
          width: 7px;
          height: 7px;
          border-radius: 50%;
        }

        /* Tooltip details */
        .chart-tooltip {
          background-color: rgba(17, 24, 39, 0.95) !important;
          border: 1px solid rgba(255, 255, 255, 0.15) !important;
          min-width: 130px;
          backdrop-filter: blur(4px);
        }

        /* Fade-in Animation */
        .animate-fade-in {
          animation: fadeIn 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default Dash;
