"use client";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSubscriptions } from "@/lib/features/subscriptionSlice";
import { Table, Spinner, Card, Alert, Badge } from "react-bootstrap";
import {
  GraphUp,
  ArrowClockwise,
  PencilSquare,
  Trash,
} from "react-bootstrap-icons";

export default function SubscriptionPage() {
  const dispatch = useDispatch();

  // Extract variables out of your central subscription Redux store slice
  const { subscriptionsList, loading, error } = useSelector(
    (state) => state.subscriptions,
  );

  useEffect(() => {
    dispatch(fetchSubscriptions());
  }, [dispatch]);

  // Clean formatting tool to map database labels like 'smart_care' to 'Smart Care'
  const formatPlanName = (planString) => {
    if (!planString) return "N/A";
    return planString
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Financial Formatter for Currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR", // Changed to INR since the keys suggest a Razorpay integration model
    }).format(amount || 0);
  };

  // Date Formatter
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="container-fluid py-2">
      {/* Dynamic Header Panel Wrapper */}
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div className="d-flex align-items-center gap-2">
          <GraphUp size={26} className="text-success" />
          <h3 className="m-0 fw-bold text-dark">Subscriptions</h3>
        </div>

        <button
          className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-2 rounded-2"
          onClick={() => dispatch(fetchSubscriptions())}
          disabled={loading}
        >
          <ArrowClockwise
            className={loading ? "spin-animation" : ""}
            size={14}
          />
          <span>Refresh</span>
        </button>
      </div>

      {/* Network Fault Alert Banner */}
      {error && (
        <Alert variant="danger" className="fw-medium small shadow-sm rounded-3">
          {error}
        </Alert>
      )}

      {/* Primary Data Grid Interface Layout Block */}
      <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
        <Card.Body className="p-0">
          {loading ? (
            /* Loading Spinner Indicator Placeholder */
            <div className="d-flex flex-column align-items-center justify-content-center py-5 gap-3">
              <Spinner animation="border" variant="success" role="status" />
              <span className="text-muted small fw-medium">
                Syncing plan records...
              </span>
            </div>
          ) : subscriptionsList?.data && subscriptionsList?.data?.length > 0 ? (
            /* Interactive Data Grid Module Layout Wrapper */
            <div className="table-responsive">
              <Table hover className="align-middle mb-0 text-nowrap">
                <thead className="table-dark border-bottom text-secondary small uppercase fw-semibold">
                  <tr>
                    <th className="py-3 px-4">Plan Name</th>
                    <th className="py-3 px-4">Price Rate</th>
                    <th className="py-3 px-4">Purchased On</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-dark small fw-medium">
                  {subscriptionsList?.data?.map((sub, index) => (
                    <tr key={sub._id || sub.id || index}>
                      {/* 1. PLAN FIELD */}
                      <td className="px-4">
                        <span className="fw-bold text-dark">
                          {formatPlanName(sub.plan)}
                        </span>
                      </td>

                      {/* 2. PRICE FIELD */}
                      <td className="px-4 font-monospace fw-bold text-secondary">
                        {formatCurrency(sub.price)}
                      </td>

                      {/* 3. CREATED_AT FIELD */}
                      <td className="px-4 text-muted">
                        {formatDate(sub.created_at)}
                      </td>

                      {/* 4. ACTIVE/STATUS FIELD */}
                      <td className="px-4">
                        {sub.status === "active" ? (
                          <Badge
                            bg="success-subtle"
                            className="text-success border border-success-subtle px-2 py-1.5 rounded-2"
                          >
                            Active
                          </Badge>
                        ) : (
                          <Badge
                            bg="danger-subtle"
                            className="text-danger border border-danger-subtle px-2 py-1.5 rounded-2"
                          >
                            {sub.status || "Inactive"}
                          </Badge>
                        )}
                      </td>

                      {/* 5. ACTIONS FIELD */}
                      <td className="px-4 text-center">
                        <div className="d-flex justify-content-center gap-2">
                          <button
                            className="btn btn-sm btn-light text-primary border rounded-2 d-flex align-items-center p-2"
                            title="View Transaction Details"
                            onClick={() => console.log("Viewing ID:", sub.id)}
                          >
                            <PencilSquare size={14} />
                          </button>
                          <button
                            className="btn btn-sm btn-light text-danger border rounded-2 d-flex align-items-center p-2"
                            title="Revoke / Terminate Plan"
                            onClick={() =>
                              console.log("Cancelling ID:", sub.id)
                            }
                          >
                            <Trash size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          ) : (
            /* Empty State View Layout Component Fallback */
            <div className="text-center py-5 text-muted">
              <GraphUp size={40} className="mb-2 text-secondary opacity-50" />
              <p className="m-0 small fw-medium">
                No system subscriptions found in database records.
              </p>
            </div>
          )}
        </Card.Body>
      </Card>

      <style jsx>{`
        .spin-animation {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
