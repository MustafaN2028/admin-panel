"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchSubscriptionPlans,
    deleteSubscriptionPlan,
} from "@/lib/features/subscriptionPlansSlice";
import {
    Table,
    Spinner,
    Card,
    Alert,
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
    PlusLg,
} from "react-bootstrap-icons";

export default function SubscriptionPlansPage() {
    const dispatch = useDispatch();
    const router = useRouter();
    const [currentPage, setCurrentPage] = useState(1);
    const [smShow, setSmShow] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null);

    const { plansList, loading, error } = useSelector(
        (state) => state.subscriptionPlans,
    );

    const pagination = plansList?.pagination;

    useEffect(() => {
        dispatch(fetchSubscriptionPlans(currentPage));
    }, [dispatch, currentPage]);

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
            <div className="d-flex align-items-center justify-content-between mb-4">
                <div className="d-flex align-items-center gap-2">
                    <GraphUp size={26} className="text-success" />
                    <h3 className="m-0 fw-bold text-dark">Subscription Plans</h3>
                </div>

                <div className="d-flex gap-2 flex-wrap">
                    <button
                        className="btn btn-primary btn-sm d-flex align-items-center gap-2 rounded-2"
                        onClick={() => router.push("/subscription-plans/create")}
                    >
                        <PlusLg size={14} />
                        <span>Create Plan</span>
                    </button>
                    <button
                        className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-2 rounded-2"
                        onClick={() => dispatch(fetchSubscriptionPlans(currentPage))}
                        disabled={loading}
                    >
                        <ArrowClockwise
                            className={loading ? "spin-animation" : ""}
                            size={14}
                        />
                        <span>Refresh</span>
                    </button>
                </div>
            </div>

            {error && (
                <Alert variant="danger" className="fw-medium small shadow-sm rounded-3">
                    {error}
                </Alert>
            )}

            <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
                <Card.Body className="p-0">
                    {loading ? (
                        <div className="d-flex flex-column align-items-center justify-content-center py-5 gap-3">
                            <Spinner animation="border" variant="success" role="status" />
                            <span className="text-muted small fw-medium">
                                Syncing plan records...
                            </span>
                        </div>
                    ) : plansList?.data && plansList?.data?.length > 0 ? (
                        <div className="table-responsive">
                            <Table hover className="align-middle mb-0 text-nowrap">
                                <thead className="table-dark border-bottom text-secondary small uppercase fw-semibold">
                                    <tr>
                                        <th className="py-3 px-4">Code</th>
                                        <th className="py-3 px-4">Name</th>
                                        <th className="py-3 px-4">Display Name</th>
                                        <th className="py-3 px-4">Price</th>
                                        <th className="py-3 px-4">Interval</th>
                                        <th className="py-3 px-4">Created At</th>
                                        <th className="py-3 px-4 text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="text-dark small fw-medium">
                                    {plansList.data.map((plan, index) => (
                                        <tr key={plan.code || plan._id || index}>
                                            <td className="px-4 font-monospace text-secondary">
                                                {plan.code}
                                            </td>
                                            <td className="px-4">{plan.name || "Untitled"}</td>
                                            <td className="px-4">{plan.display_name || "-"}</td>
                                            <td className="px-4">{plan.currency || "INR"} {plan.amount?.toLocaleString() ?? 0}</td>
                                            <td className="px-4">
                                                {plan.interval_count ?? 1} x {plan.interval || "monthly"}
                                            </td>
                                            <td className="px-4 text-muted">
                                                {formatDate(plan.created_at)}
                                            </td>
                                            <td className="px-4 text-center">
                                                <div className="d-flex justify-content-center gap-2">
                                                    <button
                                                        className="btn btn-sm btn-light text-primary border rounded-2 d-flex align-items-center p-2"
                                                        title="Edit Plan"
                                                        onClick={() =>
                                                            router.push(`/subscription-plans/edit/${plan.code}`)
                                                        }
                                                    >
                                                        <PencilSquare size={14} />
                                                    </button>
                                                    <button
                                                        className="btn btn-sm btn-light text-danger border rounded-2 d-flex align-items-center p-2"
                                                        title="Delete Plan"
                                                        onClick={() => {
                                                            setSelectedPlan(plan);
                                                            setSmShow(true);
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
                        <div className="text-center py-5 text-muted">
                            <GraphUp size={40} className="mb-2 text-secondary opacity-50" />
                            <p className="m-0 small fw-medium">
                                No subscription plans found.
                            </p>
                        </div>
                    )}
                </Card.Body>
            </Card>

            <Modal
                size="sm"
                show={smShow}
                onHide={() => setSmShow(false)}
                aria-labelledby="delete-plan-modal"
                centered
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton />
                <Modal.Body>
                    <p>Are you sure you want to delete this plan?</p>
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
                                    await dispatch(deleteSubscriptionPlan(selectedPlan.code)).unwrap();
                                    setSmShow(false);
                                    dispatch(fetchSubscriptionPlans(currentPage));
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
