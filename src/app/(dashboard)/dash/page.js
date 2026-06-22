"use client";
import { useState, useMemo } from "react";
import { Button, Card, Row, Col, Form, Badge, Table, ProgressBar } from "react-bootstrap";
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
  Speedometer2
} from "react-bootstrap-icons";

const Dash = () => {
  // Navigation active tab: 'overview' | 'users' | 'subscriptions' | 'orders' | 'payments'
  const [activeTab, setActiveTab] = useState("overview");

  // Chart hover nodes states
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const [hoveredTrendIdx, setHoveredTrendIdx] = useState(null);
  const [hoveredSubIdx, setHoveredSubIdx] = useState(null);

  // Tab 1 Date values
  const [overviewStart, setOverviewStart] = useState("2026-06-16");
  const [overviewEnd, setOverviewEnd] = useState("2026-06-22");

  // Tab 2 Date values
  const [usersSignupStart, setUsersSignupStart] = useState("2026-06-01");
  const [usersSignupEnd, setUsersSignupEnd] = useState("2026-06-22");
  const [usersLastLogin, setUsersLastLogin] = useState("2026-06-22");
  const [usersSubStart, setUsersSubStart] = useState("2026-06-15");

  // Tab 4 Date values
  const [ordersPlacedStart, setOrdersPlacedStart] = useState("2026-06-01");
  const [ordersPlacedEnd, setOrdersPlacedEnd] = useState("2026-06-22");
  const [ordersDeliveredStart, setOrdersDeliveredStart] = useState("2026-06-01");
  const [ordersDeliveredEnd, setOrdersDeliveredEnd] = useState("2026-06-22");
  const [ordersCancelledStart, setOrdersCancelledStart] = useState("2026-06-01");
  const [ordersCancelledEnd, setOrdersCancelledEnd] = useState("2026-06-22");

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

  // Tab 2: User management static logs
  const usersMockTable = [
    { name: "Priya Sharma", joinDate: "2026-06-18", lastActive: "2026-06-22", status: "Active", orders: 12 },
    { name: "Rohan Verma", joinDate: "2026-06-12", lastActive: "2026-06-21", status: "Active", orders: 8 },
    { name: "Aarti Patel", joinDate: "2026-06-05", lastActive: "2026-06-19", status: "Cancelled", orders: 2 },
    { name: "Amit Khanna", joinDate: "2026-05-24", lastActive: "2026-06-22", status: "Active", orders: 15 },
    { name: "Sneha Reddy", joinDate: "2026-05-18", lastActive: "2026-06-10", status: "Expired", orders: 0 },
    { name: "Karan Malhotra", joinDate: "2026-06-20", lastActive: "2026-06-22", status: "Active", orders: 1 },
  ];

  // Tab 3: Subscription Analytics
  const subGrowthData = [
    { label: "Jun 16", growth: 12, cancellations: 2 },
    { label: "Jun 17", growth: 19, cancellations: 1 },
    { label: "Jun 18", growth: 15, cancellations: 3 },
    { label: "Jun 19", growth: 28, cancellations: 2 },
    { label: "Jun 20", growth: 10, cancellations: 4 },
    { label: "Jun 21", growth: 8, cancellations: 1 },
    { label: "Jun 22", growth: 22, cancellations: 2 },
  ];

  // Tab 4: Orders & Fulfillment Tracker
  const ordersMockTable = [
    { id: "ORD-2026-8890", placed: "2026-06-18", payment: "2026-06-18", dispatch: "2026-06-19", delivery: "2026-06-21", status: "Delivered", amount: 1500 },
    { id: "ORD-2026-8891", placed: "2026-06-20", payment: "2026-06-20", dispatch: "2026-06-21", delivery: "Pending", status: "In Transit", amount: 2200 },
    { id: "ORD-2026-8892", placed: "2026-06-21", payment: "2026-06-21", dispatch: "Pending", delivery: "Pending", status: "Pending Dispatch", amount: 1250 },
    { id: "ORD-2026-8893", placed: "2026-06-22", payment: "Pending", dispatch: "Pending", delivery: "Pending", status: "Awaiting Payment", amount: 3500 },
    { id: "ORD-2026-8894", placed: "2026-06-15", payment: "2026-06-15", dispatch: "Cancelled", delivery: "Cancelled", status: "Cancelled", amount: 1800 },
  ];

  // Tab 5: Payments Ledger Logs
  const paymentsMockTable = [
    { id: "TXN-9821-A", paymentDate: "2026-06-22", linkedDate: "2026-06-22", refundDate: "N/A", amount: 2999, status: "Success" },
    { id: "TXN-9822-B", paymentDate: "2026-06-22", linkedDate: "2026-06-22", refundDate: "N/A", amount: 1500, status: "Success" },
    { id: "TXN-9823-C", paymentDate: "2026-06-21", linkedDate: "2026-06-21", refundDate: "N/A", amount: 4500, status: "Failed" },
    { id: "TXN-9824-D", paymentDate: "2026-06-20", linkedDate: "2026-06-20", refundDate: "2026-06-21", amount: 2500, status: "Refunded" },
    { id: "TXN-9825-E", paymentDate: "2026-06-19", linkedDate: "2026-06-19", refundDate: "N/A", amount: 2999, status: "Success" },
  ];

  return (
    <div className="container-fluid py-3 px-md-4 bg-light min-vh-100">
      
      {/* 1. TOP TITLE HEADER */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center mb-4 gap-2">
        <div>
          <h2 className="fw-bold text-dark mb-1">Aartava System Analytics</h2>
          <p className="text-muted small mb-0">High-fidelity dashboard interface prototype covering metrics aggregates.</p>
        </div>
        <div className="d-flex align-items-center gap-2">
          <Badge bg="success-subtle" className="text-success border border-success-subtle px-2 py-1.5 rounded-2">
            Design Mode: Enabled
          </Badge>
          <Badge bg="dark" className="px-2 py-1.5 rounded-2">
            Local Time: 2026-06-22
          </Badge>
        </div>
      </div>

      {/* 2. TABBED MANAGEMENT NAVIGATION BAR */}
      <Card className="border-0 shadow-sm rounded-4 mb-4 overflow-hidden tab-navigation-card">
        <Card.Body className="p-2 bg-white">
          <div className="d-flex flex-wrap gap-2">
            {[
              { id: "overview", label: "📊 Overview Dashboard", color: "primary" },
              { id: "users", label: "👥 User Management", color: "info" },
              { id: "subscriptions", label: "💳 Subscriptions Hub", color: "success" },
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
                <span className="fw-semibold text-secondary small">Filter Scope:</span>
                <Badge bg="primary-subtle" className="text-primary px-3 py-1.5 rounded-2">Last 7 Days (Jun 16 - Jun 22)</Badge>
              </div>
              <div className="d-flex align-items-center gap-2">
                <Form.Control
                  type="date"
                  size="sm"
                  value={overviewStart}
                  onChange={(e) => setOverviewStart(e.target.value)}
                  className="font-monospace border-light-subtle rounded-2"
                />
                <span className="text-muted small">to</span>
                <Form.Control
                  type="date"
                  size="sm"
                  value={overviewEnd}
                  onChange={(e) => setOverviewEnd(e.target.value)}
                  className="font-monospace border-light-subtle rounded-2"
                />
                <Button variant="outline-dark" size="sm" className="rounded-2" disabled>Filter</Button>
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
                      <span className="text-muted small fw-semibold text-uppercase tracking-wider">👥 New Users</span>
                      <h3 className="fw-bold mt-1 mb-0 font-monospace">156</h3>
                    </div>
                    <div className="kpi-icon-bg bg-primary bg-opacity-10 text-primary p-2.5 rounded-3">
                      <PersonPlusFill size={22} />
                    </div>
                  </div>
                  <div className="d-flex align-items-center mt-3 gap-1">
                    <span className="text-success small fw-bold d-flex align-items-center gap-0.5">
                      <ArrowUpRight size={12} /> +12.4%
                    </span>
                    <span className="text-muted small">vs last period</span>
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
                      <span className="text-muted small fw-semibold text-uppercase tracking-wider">🆕 Daily Active (DAU)</span>
                      <div className="d-flex align-items-baseline gap-2 mt-1">
                        <h3 className="fw-bold mb-0 font-monospace">842</h3>
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
                    <span className="text-success small fw-bold d-flex align-items-center gap-0.5">
                      <ArrowUpRight size={12} /> +4.2%
                    </span>
                    <span className="text-muted small">active sessions today</span>
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
                      <span className="text-muted small fw-semibold text-uppercase tracking-wider">📈 Weekly Active (WAU)</span>
                      <h3 className="fw-bold mt-1 mb-0 font-monospace">4,520</h3>
                    </div>
                    <div className="kpi-icon-bg bg-info bg-opacity-10 text-info p-2.5 rounded-3">
                      <GraphUp size={22} />
                    </div>
                  </div>
                  <div className="d-flex flex-column mt-3 w-100">
                    <div className="d-flex justify-content-between small text-muted mb-1">
                      <span>DAU to WAU ratio:</span>
                      <strong>18.6%</strong>
                    </div>
                    <div className="progress-bar-thin bg-light rounded-pill">
                      <div className="progress-bar-fill bg-info rounded-pill" style={{ width: "18.6%" }} />
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
                      <span className="text-muted small fw-semibold text-uppercase tracking-wider">💰 Total Income</span>
                      <h3 className="fw-bold mt-1 mb-0 font-monospace text-emerald">{formatCurrency(283700)}</h3>
                    </div>
                    <div className="kpi-icon-bg bg-success bg-opacity-10 text-success p-2.5 rounded-3">
                      <CurrencyRupee size={22} />
                    </div>
                  </div>
                  <div className="d-flex align-items-center mt-3 gap-1">
                    <span className="text-success small fw-bold d-flex align-items-center gap-0.5">
                      <ArrowUpRight size={12} /> +18.5%
                    </span>
                    <span className="text-muted small">in selected dates</span>
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
                    <h5 className="m-0 fw-bold text-dark">Subscriptions Scope</h5>
                  </div>
                </Card.Header>
                <Card.Body className="p-4">
                  <div className="d-flex flex-column gap-3 w-100">
                    <div className="d-flex align-items-center justify-content-between bg-light p-2.5 rounded-3 border-start border-3 border-primary shadow-xs">
                      <div>
                        <h6 className="mb-0 fw-bold text-dark small">Active (as of selected date)</h6>
                        <span className="text-muted text-xxs">Total ongoing sub-base</span>
                      </div>
                      <span className="fw-bold font-monospace text-primary h5 mb-0">874</span>
                    </div>

                    <div className="d-flex align-items-center justify-content-between bg-light p-2.5 rounded-3 border-start border-3 border-success shadow-xs">
                      <div>
                        <h6 className="mb-0 fw-bold text-dark small">Started (in date range)</h6>
                        <span className="text-muted text-xxs">New purchases conversion</span>
                      </div>
                      <span className="fw-bold font-monospace text-success h5 mb-0">+142</span>
                    </div>

                    <div className="d-flex align-items-center justify-content-between bg-light p-2.5 rounded-3 border-start border-3 border-danger shadow-xs">
                      <div>
                        <h6 className="mb-0 fw-bold text-dark small">Cancelled (in date range)</h6>
                        <span className="text-muted text-xxs">Unsubscribed/refunded plans</span>
                      </div>
                      <span className="fw-bold font-monospace text-danger h5 mb-0">-24</span>
                    </div>

                    <div className="d-flex align-items-center justify-content-between bg-light p-2.5 rounded-3 border-start border-3 border-warning shadow-xs">
                      <div>
                        <h6 className="mb-0 fw-bold text-dark small">Renewed (in date range)</h6>
                        <span className="text-muted text-xxs">Cycle renewals complete</span>
                      </div>
                      <span className="fw-bold font-monospace text-warning h5 mb-0">+92</span>
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
                    <h5 className="m-0 fw-bold text-dark">📦 Orders Overview</h5>
                  </div>
                  <span className="text-muted small">Total: <strong>1,280</strong> placed</span>
                </Card.Header>
                <Card.Body className="p-4 d-flex flex-column justify-content-center">
                  <div className="mb-4">
                    <h6 className="text-muted small fw-semibold text-uppercase mb-2">Fulfillment Distribution</h6>
                    <div className="progress rounded-4 shadow-xs" style={{ height: "30px" }}>
                      <div className="progress-bar bg-success" style={{ width: "88%" }}>Delivered (88%)</div>
                      <div className="progress-bar bg-warning text-dark" style={{ width: "12%" }}>Pending (12%)</div>
                    </div>
                  </div>

                  <Row className="g-3">
                    <Col xs={4}>
                      <div className="p-3 bg-light rounded-3 d-flex flex-column align-items-center text-center border">
                        <CheckCircleFill size={20} className="text-success mb-1.5" />
                        <h6 className="mb-0.5 text-secondary small">Delivered</h6>
                        <h5 className="fw-bold text-dark mb-0 font-monospace">1,126</h5>
                      </div>
                    </Col>
                    <Col xs={4}>
                      <div className="p-3 bg-light rounded-3 d-flex flex-column align-items-center text-center border">
                        <HourglassSplit size={20} className="text-warning mb-1.5" />
                        <h6 className="mb-0.5 text-secondary small">Pending</h6>
                        <h5 className="fw-bold text-dark mb-0 font-monospace">154</h5>
                      </div>
                    </Col>
                    <Col xs={4}>
                      <div className="p-3 bg-light rounded-3 d-flex flex-column align-items-center text-center border">
                        <ClipboardData size={20} className="text-primary mb-1.5" />
                        <h6 className="mb-0.5 text-secondary small">Fulfillment</h6>
                        <h5 className="fw-bold text-dark mb-0 font-monospace">88%</h5>
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
                    <h5 className="m-0 fw-bold text-dark">💰 Daily Revenue Breakdown</h5>
                    <span className="text-muted small">Daily revenue collections in INR</span>
                  </div>
                  <Badge bg="success-subtle" className="text-success border border-success-subtle">Revenue (INR)</Badge>
                </Card.Header>
                <Card.Body className="p-4 position-relative">
                  <div className="chart-container-inner" style={{ minHeight: "240px" }}>
                    <svg width="100%" height="220" viewBox="0 0 500 220" className="overflow-visible">
                      <defs>
                        <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                          <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
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
                          style={{ cursor: "pointer", transition: "all 0.15s ease" }}
                        />
                      ))}

                      {/* Labels */}
                      <text x="45" y="192" textAnchor="middle" fontSize="10" fill="#9ca3af">Jun 16</text>
                      <text x="117" y="192" textAnchor="middle" fontSize="10" fill="#9ca3af">Jun 17</text>
                      <text x="190" y="192" textAnchor="middle" fontSize="10" fill="#9ca3af">Jun 18</text>
                      <text x="262" y="192" textAnchor="middle" fontSize="10" fill="#9ca3af">Jun 19</text>
                      <text x="335" y="192" textAnchor="middle" fontSize="10" fill="#9ca3af">Jun 20</text>
                      <text x="407" y="192" textAnchor="middle" fontSize="10" fill="#9ca3af">Jun 21</text>
                      <text x="480" y="192" textAnchor="middle" fontSize="10" fill="#9ca3af">Jun 22</text>
                    </svg>

                    {/* Tooltip Overlay */}
                    {hoveredIdx !== null && (
                      <div
                        className="chart-tooltip shadow border rounded-3 p-2 bg-dark text-white position-absolute"
                        style={{
                          left: `${(overviewRevenueBreakdown[hoveredIdx].label === "Jun 16" ? 15 : hoveredIdx * 15 + 10)}%`,
                          top: "30px",
                          zIndex: 10,
                        }}
                      >
                        <div className="text-secondary small fw-bold">{overviewRevenueBreakdown[hoveredIdx].label}</div>
                        <div className="fw-bold font-monospace text-emerald">{formatCurrency(overviewRevenueBreakdown[hoveredIdx].revenue)}</div>
                        <div className="text-light small text-xxs font-monospace">Orders: {overviewRevenueBreakdown[hoveredIdx].orders}</div>
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
                    <h5 className="m-0 fw-bold text-dark">📊 Users & Revenue Trend</h5>
                    <span className="text-muted small">Registrations & Gross collections correlated</span>
                  </div>
                  <div className="d-flex gap-2">
                    <span className="badge-legend bg-primary-subtle text-primary border border-primary-subtle px-1.5 py-0.5 rounded text-xxs">Users</span>
                    <span className="badge-legend bg-success-subtle text-success border border-success-subtle px-1.5 py-0.5 rounded text-xxs">Revenue (k)</span>
                  </div>
                </Card.Header>
                <Card.Body className="p-4 position-relative">
                  <div className="chart-container-inner" style={{ minHeight: "240px" }}>
                    <svg width="100%" height="220" viewBox="0 0 500 220" className="overflow-visible">
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
                      <text x="45" y="192" textAnchor="middle" fontSize="10" fill="#9ca3af">Jun 16</text>
                      <text x="117" y="192" textAnchor="middle" fontSize="10" fill="#9ca3af">Jun 17</text>
                      <text x="190" y="192" textAnchor="middle" fontSize="10" fill="#9ca3af">Jun 18</text>
                      <text x="262" y="192" textAnchor="middle" fontSize="10" fill="#9ca3af">Jun 19</text>
                      <text x="335" y="192" textAnchor="middle" fontSize="10" fill="#9ca3af">Jun 20</text>
                      <text x="407" y="192" textAnchor="middle" fontSize="10" fill="#9ca3af">Jun 21</text>
                      <text x="480" y="192" textAnchor="middle" fontSize="10" fill="#9ca3af">Jun 22</text>
                    </svg>

                    {/* Trend Tooltip */}
                    {hoveredTrendIdx !== null && (
                      <div
                        className="chart-tooltip shadow border rounded-3 p-2 bg-dark text-white position-absolute"
                        style={{
                          left: `${(trendData[hoveredTrendIdx].label === "Jun 16" ? 15 : hoveredTrendIdx * 15 + 10)}%`,
                          top: "20px",
                          zIndex: 10,
                        }}
                      >
                        <div className="text-secondary small fw-bold">{trendData[hoveredTrendIdx].label}</div>
                        <div className="text-primary small font-monospace">👥 New Users: {trendData[hoveredTrendIdx].users}</div>
                        <div className="text-emerald small font-monospace">💰 Income: {formatCurrency(trendData[hoveredTrendIdx].revenue * 1000)}</div>
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
                    <Form.Label className="small fw-semibold text-muted">Signup Date Range</Form.Label>
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
                    <Form.Label className="small fw-semibold text-muted">Last Login Date</Form.Label>
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
                    <Form.Label className="small fw-semibold text-muted">Subscription Start Date</Form.Label>
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
                <h6 className="text-muted small mb-1">Users Joined (Selected Dates)</h6>
                <h4 className="fw-bold text-primary font-monospace mb-0">48</h4>
              </div>
            </Col>
            <Col xs={12} sm={4}>
              <div className="bg-white p-3 rounded-4 border shadow-sm text-center">
                <h6 className="text-muted small mb-1">Users Last Active (by selected date)</h6>
                <h4 className="fw-bold text-success font-monospace mb-0">215</h4>
              </div>
            </Col>
            <Col xs={12} sm={4}>
              <div className="bg-white p-3 rounded-4 border shadow-sm text-center">
                <h6 className="text-muted small mb-1">Total Range Registrations</h6>
                <h4 className="fw-bold text-dark font-monospace mb-0">156</h4>
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
                    {usersMockTable.map((user, idx) => (
                      <tr key={idx}>
                        <td className="px-4">
                          <span className="fw-bold text-dark text-capitalize">{user.name}</span>
                        </td>
                        <td className="px-4 font-monospace text-secondary">{user.joinDate}</td>
                        <td className="px-4 font-monospace text-secondary">{user.lastActive}</td>
                        <td className="px-4">
                          {user.status === "Active" ? (
                            <Badge bg="success-subtle" className="text-success border border-success-subtle rounded-2 px-2 py-1.5">Active</Badge>
                          ) : user.status === "Cancelled" ? (
                            <Badge bg="danger-subtle" className="text-danger border border-danger-subtle rounded-2 px-2 py-1.5">Cancelled</Badge>
                          ) : (
                            <Badge bg="warning-subtle" className="text-warning border border-warning-subtle rounded-2 px-2 py-1.5">Expired</Badge>
                          )}
                        </td>
                        <td className="px-4 text-center font-monospace fw-bold">{user.orders}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
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
                <span className="text-muted small fw-semibold">Started in Range</span>
                <h4 className="fw-bold text-primary font-monospace mt-1 mb-0">+142</h4>
              </div>
            </Col>
            <Col xs={6} md={3}>
              <div className="bg-white p-3 rounded-4 border shadow-sm">
                <span className="text-muted small fw-semibold">Cancelled in Range</span>
                <h4 className="fw-bold text-danger font-monospace mt-1 mb-0">-24</h4>
              </div>
            </Col>
            <Col xs={6} md={3}>
              <div className="bg-white p-3 rounded-4 border shadow-sm">
                <span className="text-muted small fw-semibold">Renewed in Range</span>
                <h4 className="fw-bold text-success font-monospace mt-1 mb-0">+92</h4>
              </div>
            </Col>
            <Col xs={6} md={3}>
              <div className="bg-white p-3 rounded-4 border shadow-sm">
                <span className="text-muted small fw-semibold">Active Subscriptions (Today)</span>
                <h4 className="fw-bold text-dark font-monospace mt-1 mb-0">874</h4>
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
                    <h5 className="m-0 fw-bold text-dark">📈 Daily Subscription Growth & Cancellations</h5>
                    <span className="text-muted small">Subscription changes day-by-day</span>
                  </div>
                  <div className="d-flex gap-2">
                    <span className="badge-legend bg-indigo-subtle text-indigo border border-indigo-subtle px-1.5 py-0.5 rounded text-xxs">Signups</span>
                    <span className="badge-legend bg-danger-subtle text-danger border border-danger-subtle px-1.5 py-0.5 rounded text-xxs">Cancellations</span>
                  </div>
                </Card.Header>
                <Card.Body className="p-4 position-relative">
                  <div className="chart-container-inner" style={{ minHeight: "220px" }}>
                    <svg width="100%" height="200" viewBox="0 0 500 200" className="overflow-visible">
                      {/* Grid Lines */}
                      {[0, 1, 2, 3].map((g) => (
                        <line key={g} x1="40" y1={15 + g * 45} x2="480" y2={15 + g * 45} stroke="#f3f4f6" strokeWidth="1.5" />
                      ))}

                      {/* Signups Line */}
                      <path
                        d="M 45 120 L 117 80 L 190 100 L 262 30 L 335 130 L 407 140 L 480 60"
                        fill="none"
                        stroke="#6366f1"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />

                      {/* Cancellations Line */}
                      <path
                        d="M 45 140 L 117 145 L 190 135 L 262 140 L 335 120 L 407 145 L 480 140"
                        fill="none"
                        stroke="#f43f5e"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />

                      {/* Interactive nodes */}
                      {[
                        { x: 45, growth: 12, cancel: 2 },
                        { x: 117, growth: 19, cancel: 1 },
                        { x: 190, growth: 15, cancel: 3 },
                        { x: 262, growth: 28, cancel: 2 },
                        { x: 335, growth: 10, cancel: 4 },
                        { x: 407, growth: 8, cancel: 1 },
                        { x: 480, growth: 22, cancel: 2 },
                      ].map((node, i) => (
                        <circle
                          key={i}
                          cx={node.x}
                          cy={150 - (node.growth * 4)}
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
                    {hoveredSubIdx !== null && (
                      <div
                        className="chart-tooltip shadow border rounded-3 p-2 bg-dark text-white position-absolute"
                        style={{
                          left: `${(subGrowthData[hoveredSubIdx].label === "Jun 16" ? 15 : hoveredSubIdx * 15 + 10)}%`,
                          top: "20px",
                          zIndex: 10,
                        }}
                      >
                        <div className="text-secondary small fw-bold">{subGrowthData[hoveredSubIdx].label}</div>
                        <div className="text-indigo small font-monospace">Signups: +{subGrowthData[hoveredSubIdx].growth}</div>
                        <div className="text-danger small font-monospace">Cancelled: -{subGrowthData[hoveredSubIdx].cancellations}</div>
                      </div>
                    )}
                  </div>
                </Card.Body>
              </Card>
            </Col>

            {/* Renewal Rate Radial Gauge Chart */}
            <Col lg={5}>
              <Card className="border-0 shadow-sm rounded-4 h-100 overflow-hidden">
                <Card.Header className="bg-white border-0 pt-4 px-4 pb-0">
                  <h5 className="m-0 fw-bold text-dark">🔄 Renewal Rate Rate</h5>
                  <span className="text-muted small">Subscription retention analytics</span>
                </Card.Header>
                <Card.Body className="p-4 d-flex flex-column align-items-center justify-content-center">
                  <div className="position-relative d-flex align-items-center justify-content-center mb-3" style={{ width: "160px", height: "160px" }}>
                    {/* SVG Radial Progress Circle */}
                    <svg width="100%" height="100%" viewBox="0 0 100 100" className="overflow-visible">
                      <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f3f4f6" strokeWidth="9" />
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="transparent"
                        stroke="#10b981"
                        strokeWidth="9"
                        strokeDasharray="251.2"
                        strokeDashoffset="40" // represents 84%
                        strokeLinecap="round"
                        transform="rotate(-90 50 50)"
                      />
                    </svg>
                    <div className="position-absolute text-center">
                      <h2 className="fw-bold mb-0 font-monospace text-emerald">84%</h2>
                      <span className="text-muted text-xxs fw-semibold uppercase">Renewal Rate</span>
                    </div>
                  </div>

                  <div className="w-100 mt-2 p-3 bg-light rounded-3 d-flex justify-content-around text-center border">
                    <div>
                      <h6 className="text-muted small mb-0.5">Average Plan Lifecycle</h6>
                      <h5 className="fw-bold text-dark mb-0 font-monospace">180 Days</h5>
                    </div>
                    <div className="border-end" />
                    <div>
                      <h6 className="text-muted small mb-0.5">Churn Rate</h6>
                      <h5 className="fw-bold text-danger mb-0 font-monospace">1.2%</h5>
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
          {/* A. Date Filters */}
          <Card className="border-0 shadow-sm rounded-4 mb-4">
            <Card.Body className="p-4 bg-white">
              <h6 className="fw-bold text-dark mb-3">Order Schedule Filters</h6>
              <Row className="g-3">
                <Col sm={12} md={4}>
                  <Form.Group>
                    <Form.Label className="small fw-semibold text-muted">Orders Placed Range</Form.Label>
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
                    <Form.Label className="small fw-semibold text-muted">Delivered in Range</Form.Label>
                    <div className="d-flex align-items-center gap-2">
                      <Form.Control
                        type="date"
                        size="sm"
                        value={ordersDeliveredStart}
                        onChange={(e) => setOrdersDeliveredStart(e.target.value)}
                        className="font-monospace border-light-subtle rounded-2"
                      />
                      <span className="text-muted small">to</span>
                      <Form.Control
                        type="date"
                        size="sm"
                        value={ordersDeliveredEnd}
                        onChange={(e) => setOrdersDeliveredEnd(e.target.value)}
                        className="font-monospace border-light-subtle rounded-2"
                      />
                    </div>
                  </Form.Group>
                </Col>
                <Col sm={12} md={4}>
                  <Form.Group>
                    <Form.Label className="small fw-semibold text-muted">Cancelled in Range</Form.Label>
                    <div className="d-flex align-items-center gap-2">
                      <Form.Control
                        type="date"
                        size="sm"
                        value={ordersCancelledStart}
                        onChange={(e) => setOrdersCancelledStart(e.target.value)}
                        className="font-monospace border-light-subtle rounded-2"
                      />
                      <span className="text-muted small">to</span>
                      <Form.Control
                        type="date"
                        size="sm"
                        value={ordersCancelledEnd}
                        onChange={(e) => setOrdersCancelledEnd(e.target.value)}
                        className="font-monospace border-light-subtle rounded-2"
                      />
                    </div>
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
                <h5 className="fw-bold text-warning mb-0">Wednesday & Sunday</h5>
              </div>
            </Col>
            <Col xs={12} md={4}>
              <div className="bg-white p-3.5 rounded-4 border shadow-sm text-center">
                <h6 className="text-muted small mb-1">⏱️ Average Delivery Time</h6>
                <h5 className="fw-bold text-success mb-0">2.4 Days <span className="text-muted text-xxs font-normal">(In-range calculation)</span></h5>
              </div>
            </Col>
            <Col xs={12} md={4}>
              <div className="bg-white p-3.5 rounded-4 border shadow-sm text-center">
                <h6 className="text-muted small mb-1">📊 Fulfillment Target Ratio</h6>
                <h5 className="fw-bold text-dark mb-0">94% achieved</h5>
              </div>
            </Col>
          </Row>

          {/* C. Orders Timeline Table */}
          <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
            <Card.Header className="bg-white border-0 pt-4 px-4 pb-0">
              <div className="d-flex align-items-center gap-2">
                <ClockHistory className="text-secondary" size={20} />
                <h5 className="m-0 fw-bold text-dark">Orders Delivery Track sheet</h5>
              </div>
            </Card.Header>
            <Card.Body className="p-0 mt-3">
              <div className="table-responsive">
                <Table hover className="align-middle mb-0 text-nowrap">
                  <thead className="table-dark border-bottom text-secondary small uppercase fw-semibold">
                    <tr>
                      <th className="py-3 px-4">Order ID</th>
                      <th className="py-3 px-4">Placed Date 📅</th>
                      <th className="py-3 px-4">Payment Date 📅</th>
                      <th className="py-3 px-4">Dispatch Date 📅</th>
                      <th className="py-3 px-4">Delivery Date 📅</th>
                      <th className="py-3 px-4">Fulfillment Status</th>
                    </tr>
                  </thead>
                  <tbody className="text-dark small fw-medium">
                    {ordersMockTable.map((order, idx) => (
                      <tr key={idx}>
                        <td className="px-4 fw-bold font-monospace">{order.id}</td>
                        <td className="px-4 font-monospace text-secondary">{order.placed}</td>
                        <td className="px-4 font-monospace text-secondary">{order.payment}</td>
                        <td className="px-4 font-monospace text-secondary">
                          {order.dispatch === "Pending" ? <span className="text-warning">Pending</span> : order.dispatch}
                        </td>
                        <td className="px-4 font-monospace text-secondary">
                          {order.delivery === "Pending" ? <span className="text-warning">Pending</span> : order.delivery}
                        </td>
                        <td className="px-4">
                          {order.status === "Delivered" ? (
                            <Badge bg="success-subtle" className="text-success border border-success-subtle rounded-2 px-2 py-1.5">Delivered</Badge>
                          ) : order.status === "In Transit" || order.status === "Pending Dispatch" ? (
                            <Badge bg="warning-subtle" className="text-warning-emphasis border border-warning-subtle rounded-2 px-2 py-1.5">{order.status}</Badge>
                          ) : order.status === "Cancelled" ? (
                            <Badge bg="danger-subtle" className="text-danger border border-danger-subtle rounded-2 px-2 py-1.5">Cancelled</Badge>
                          ) : (
                            <Badge bg="secondary-subtle" className="text-secondary border border-secondary-subtle rounded-2 px-2 py-1.5">{order.status}</Badge>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </div>
      )}

      {/* ==========================================
          TAB 5: PAYMENTS & TRANSACTIONS VIEW
          ========================================== */}
      {activeTab === "payments" && (
        <div className="animate-fade-in">
          {/* A. Payments Stats Metrics Row */}
          <Row className="g-3 mb-4">
            <Col xs={6} md={3}>
              <div className="bg-white p-3 rounded-4 border shadow-sm text-center">
                <span className="text-muted small fw-semibold d-block">Revenue Per Day (Avg)</span>
                <h4 className="fw-bold text-success font-monospace mt-1 mb-0">{formatCurrency(45200)}</h4>
              </div>
            </Col>
            <Col xs={6} md={3}>
              <div className="bg-white p-3 rounded-4 border shadow-sm text-center">
                <span className="text-muted small fw-semibold d-block">Revenue Per Month (Est)</span>
                <h4 className="fw-bold text-emerald font-monospace mt-1 mb-0">{formatCurrency(1240000)}</h4>
              </div>
            </Col>
            <Col xs={6} md={3}>
              <div className="bg-white p-3 rounded-4 border shadow-sm text-center">
                <span className="text-muted small fw-semibold d-block">Failed Payments (Daily)</span>
                <h4 className="fw-bold text-danger font-monospace mt-1 mb-0">3 failed</h4>
              </div>
            </Col>
            <Col xs={6} md={3}>
              <div className="bg-white p-3 rounded-4 border shadow-sm text-center">
                <span className="text-muted small fw-semibold d-block">Refunds Issued (Scope)</span>
                <h4 className="fw-bold text-warning font-monospace mt-1 mb-0">{formatCurrency(8500)}</h4>
              </div>
            </Col>
          </Row>

          {/* B. Payments Table Ledger */}
          <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
            <Card.Header className="bg-white border-0 pt-4 px-4 pb-0">
              <div className="d-flex align-items-center gap-2">
                <CashStack className="text-success" size={20} />
                <h5 className="m-0 fw-bold text-dark">Payments Transactions log</h5>
              </div>
            </Card.Header>
            <Card.Body className="p-0 mt-3">
              <div className="table-responsive">
                <Table hover className="align-middle mb-0 text-nowrap">
                  <thead className="table-dark border-bottom text-secondary small uppercase fw-semibold">
                    <tr>
                      <th className="py-3 px-4">Txn ID</th>
                      <th className="py-3 px-4">Payment Date 📅</th>
                      <th className="py-3 px-4">Subscription Linked Date 📅</th>
                      <th className="py-3 px-4">Refund Date 📅</th>
                      <th className="py-3 px-4 text-end">Amount</th>
                      <th className="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="text-dark small fw-medium">
                    {paymentsMockTable.map((txn, idx) => (
                      <tr key={idx}>
                        <td className="px-4 fw-bold font-monospace">{txn.id}</td>
                        <td className="px-4 font-monospace text-secondary">{txn.paymentDate}</td>
                        <td className="px-4 font-monospace text-secondary">{txn.linkedDate}</td>
                        <td className="px-4 font-monospace text-secondary">
                          {txn.refundDate === "N/A" ? <span className="text-muted">N/A</span> : txn.refundDate}
                        </td>
                        <td className="px-4 text-end font-monospace fw-bold text-dark">{formatCurrency(txn.amount)}</td>
                        <td className="px-4">
                          {txn.status === "Success" ? (
                            <Badge bg="success-subtle" className="text-success border border-success-subtle rounded-2 px-2 py-1.5">Success</Badge>
                          ) : txn.status === "Failed" ? (
                            <Badge bg="danger-subtle" className="text-danger border border-danger-subtle rounded-2 px-2 py-1.5">Failed</Badge>
                          ) : (
                            <Badge bg="warning-subtle" className="text-warning-emphasis border border-warning-subtle rounded-2 px-2 py-1.5">Refunded</Badge>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
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
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1);
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
