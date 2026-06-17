"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, deleteUser } from "@/lib/features/userSlice";
import {
  Table,
  Spinner,
  Card,
  Alert,
  Button,
  Modal,
  Pagination,
} from "react-bootstrap";
import { useRouter } from "next/navigation";
import {
  People,
  ArrowClockwise,
  PencilSquare,
  Trash,
} from "react-bootstrap-icons";

export default function UserDirectoryPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [smShow, setSmShow] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  // Extract variables out of your user Redux store slice
  const { usersList, loading, error } = useSelector((state) => state.users);
  const pagination = usersList?.pagination;
  console.log(pagination, currentPage);
  useEffect(() => {
    dispatch(fetchUsers(currentPage));
  }, [dispatch, currentPage]);
  console.log(usersList);
  // Clean tool to format dates beautifully (e.g., "May 26, 2026")
  const formatDate = (dateString) => {
    if (!dateString) return <span className="text-muted small">N/A</span>;
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Clean tool to format timestamp strings cleanly with standard time
  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return <span className="text-muted small">N/A</span>;
    return new Date(dateTimeString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="container-fluid py-2">
      {/* Dynamic Header Panel */}
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div className="d-flex align-items-center gap-2">
          <People size={26} className="text-primary" />
          <h3 className="m-0 fw-bold text-dark">User Directory</h3>
        </div>

        <button
          className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-2 rounded-2"
          onClick={() => dispatch(fetchUsers(currentPage))}
          disabled={loading}
        >
          <ArrowClockwise
            className={loading ? "spin-animation" : ""}
            size={14}
          />
          <span>Refresh</span>
        </button>
      </div>

      {/* Error Alert Banner */}
      {error && (
        <Alert variant="danger" className="fw-medium small shadow-sm rounded-3">
          {error}
        </Alert>
      )}

      {/* Primary Data Grid Interface */}
      <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
        <Card.Body className="p-0">
          {loading ? (
            /* Loading Spinner Placeholder */
            <div className="d-flex flex-column align-items-center justify-content-center py-5 gap-3">
              <Spinner animation="border" variant="primary" role="status" />
              <span className="text-muted small fw-medium">
                Syncing user directory...
              </span>
            </div>
          ) : usersList?.data && usersList?.data?.length > 0 ? (
            /* Data Grid Module Layout Wrapper */
            <div className="table-responsive">
              <Table hover className="align-middle mb-0 text-nowrap">
                <thead className="table-dark border-bottom text-secondary small uppercase fw-semibold">
                  <tr>
                    <th className="py-3 px-4">Name</th>
                    <th className="py-3 px-4">Age</th>
                    <th className="py-3 px-4">Phone Number</th>
                    <th className="py-3 px-4">Last Period Date</th>
                    <th className="py-3 px-4">Onboarding Completed At</th>
                    <th className="py-3 px-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-dark small fw-medium">
                  {usersList?.data?.map((user, index) => (
                    <tr key={user._id || user.id || index}>
                      {/* 1. NAME FIELD */}
                      <td className="px-4">
                        <span className="fw-bold text-dark text-capitalize">
                          {user.name || "Unknown User"}
                        </span>
                      </td>

                      {/* 2. AGE FIELD */}
                      <td className="px-4 text-secondary">
                        {user.age ? (
                          `${user.age} yrs`
                        ) : (
                          <span className="text-muted">N/A</span>
                        )}
                      </td>

                      {/* 3. PHONE NUMBER FIELD */}
                      <td className="px-4 font-monospace text-secondary">
                        {user.phone_number || "N/A"}
                      </td>

                      {/* 4. LAST_PERIOD_DATE FIELD (Safe digging nested check) */}
                      <td className="px-4 text-secondary">
                        {formatDate(
                          user.onboarding_payload?.last_period_date ||
                            user.last_period_start,
                        )}
                      </td>

                      {/* 5. ONBOARDING_COMPLETED_AT FIELD */}
                      <td className="px-4 text-muted">
                        {formatDateTime(user.onboarding_completed_at)}
                      </td>

                      {/* 6. ACTIONS FIELD */}
                      <td className="px-4 text-center">
                        <div className="d-flex justify-content-center gap-2">
                          <button
                            className="btn btn-sm btn-light text-primary border rounded-2 d-flex align-items-center p-2"
                            title="View User Details"
                            onClick={() => {
                              // console.log("Viewing User ID:", user.id);
                              router.push(`/user/edit/${user.id}`);
                            }}
                          >
                            <PencilSquare size={14} />
                          </button>
                          <button
                            className="btn btn-sm btn-light text-danger border rounded-2 d-flex align-items-center p-2"
                            title="Delete User"
                            onClick={() => {
                              setSmShow(true);
                              setSelectedUser(user);
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
              <People size={40} className="mb-2 text-secondary opacity-50" />
              <p className="m-0 small fw-medium">
                No users found inside database records.
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
          <p>Are you sure you want to delete this user?</p>
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
                  await dispatch(deleteUser(selectedUser?.id)).unwrap();

                  setSmShow(false);

                  // Optional if your reducer doesn't remove the user automatically
                  dispatch(fetchUsers(currentPage));
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
