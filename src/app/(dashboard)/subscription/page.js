"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteSubscription,
  fetchSubscriptions,
} from "@/lib/features/subscriptionSlice";
import {
  Table,
  Spinner,
  Card,
  Alert,
  Badge,
  Pagination,
  Modal,
  Button,
} from "react-bootstrap";
import { useRouter } from "next/navigation";

import {
  GraphUp,
  ArrowClockwise,
  PencilSquare,
  Trash,
} from "react-bootstrap-icons";

export default function SubscriptionPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [smShow, setSmShow] = useState(false);
  const [selectedSubs, setSelectedsubs] = useState(null);
  // Extract variables out of your central subscription Redux store slice
  const { subscriptionsList, loading, error } = useSelector(
    (state) => state.subscriptions,
  );

  const pagination = subscriptionsList?.pagination;
  useEffect(() => {
    dispatch(fetchSubscriptions(currentPage));
  }, [dispatch, currentPage]);

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
          onClick={() => dispatch(fetchSubscriptions(currentPage))}
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
                            className="text-success border border-success-subtle px-2 py-1 rounded-2"
                          >
                            Active
                          </Badge>
                        ) : sub.status === "inactive" ? (
                          <Badge
                            bg="warning-subtle"
                            className="text-warning border border-warning-subtle px-2 py-1 rounded-2"
                          >
                            Inactive
                          </Badge>
                        ) : (
                          <Badge
                            bg="danger-subtle"
                            className="text-danger border border-danger-subtle px-2 py-1 rounded-2"
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
                            onClick={() => {
                              router.push(`/subscription/edit/${sub.id}`);
                            }}
                          >
                            <PencilSquare size={14} />
                          </button>
                          <button
                            className="btn btn-sm btn-light text-danger border rounded-2 d-flex align-items-center p-2"
                            title="Revoke / Terminate Plan"
                            onClick={() => {
                              setSmShow(true);
                              setSelectedsubs(sub);
                            }}
                          >
                            <Trash size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <Pagination className="justify-content-center mt-3">
                <Pagination.First
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(1)}
                />

                <Pagination.Prev
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                />

                {currentPage > 2 && (
                  <>
                    <Pagination.Item onClick={() => setCurrentPage(1)}>
                      1
                    </Pagination.Item>

                    {currentPage > 3 && <Pagination.Ellipsis />}
                  </>
                )}

                {currentPage > 1 && (
                  <Pagination.Item
                    onClick={() => setCurrentPage(currentPage - 1)}
                  >
                    {currentPage - 1}
                  </Pagination.Item>
                )}

                <Pagination.Item active>{currentPage}</Pagination.Item>

                {currentPage < pagination?.pages && (
                  <Pagination.Item
                    onClick={() => setCurrentPage(currentPage + 1)}
                  >
                    {currentPage + 1}
                  </Pagination.Item>
                )}

                {currentPage < pagination?.pages - 1 && (
                  <>
                    {currentPage < pagination?.pages - 2 && (
                      <Pagination.Ellipsis />
                    )}

                    <Pagination.Item
                      onClick={() => setCurrentPage(pagination.pages)}
                    >
                      {pagination.pages}
                    </Pagination.Item>
                  </>
                )}

                <Pagination.Next
                  disabled={currentPage === pagination?.pages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                />

                <Pagination.Last
                  disabled={currentPage === pagination?.pages}
                  onClick={() => setCurrentPage(pagination.pages)}
                />
              </Pagination>
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
      <Modal
        size="sm"
        show={smShow}
        onHide={() => setSmShow(false)}
        aria-labelledby="example-modal-sizes-title-sm"
        centered
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          {/* <Modal.Title id="example-modal-sizes-title-sm">
            Small Modal
          </Modal.Title> */}
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete this subscriber?</p>
          <div className="d-flex justify-content-between">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setSmShow(false)}
            >
              Close
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={async () => {
                try {
                  await dispatch(deleteSubscription(selectedSubs?.id)).unwrap();

                  setSmShow(false);

                  // Optional if your reducer doesn't remove the user automatically
                  dispatch(fetchSubscriptions(currentPage));
                } catch (error) {
                  console.error(error);
                }
              }}
            >
              Delete
            </Button>
          </div>
        </Modal.Body>
      </Modal>
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
