"use client";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { createSubscriptionPlan } from "@/lib/features/subscriptionPlansSlice";
import { Form, Button, Alert } from "react-bootstrap";

export default function CreateSubscriptionPlanPage() {
    const dispatch = useDispatch();
    const router = useRouter();
    const [formData, setFormData] = useState({
        code: "",
        name: "",
        display_name: "",
        description: "",
        amount: 0,
        interval: "monthly",
        interval_count: 1,
        trial_days: 0,
        trial_price: 0,
        features: "",
        is_active: true,
        is_default: false,
        sort_order: 1,
    });

    const { loading, error } = useSelector((state) => state.subscriptionPlans);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await dispatch(
                createSubscriptionPlan({
                    ...formData,
                    name: formData.display_name,
                    display_name: formData.display_name,
                    amount: Number(formData.amount),
                    amount_paise: Number(formData.amount) * 100,
                    currency: "INR",
                    interval_count: Number(formData.interval_count),
                    trial_days: Number(formData.trial_days),
                    trial_price: Number(formData.trial_price),
                    sort_order: Number(formData.sort_order),
                    features: formData.features
                        .split(",")
                        .map((feature) => feature.trim())
                        .filter(Boolean),
                }),
            ).unwrap();
            router.push("/subscription-plans");
        } catch (createError) {
            console.error("Create failed", createError);
        }
    };

    return (
        <div className="container py-2">
            <div className="d-flex align-items-center justify-content-between mb-4">
                <div>
                    <h3 className="fw-bold m-0 text-dark">Create Subscription Plan</h3>
                    <p className="text-muted small mb-0">
                        Add a new Razorpay subscription plan for your product catalog.
                    </p>
                </div>
            </div>

            {error && (
                <Alert variant="danger" className="small">
                    {error}
                </Alert>
            )}

            <div className="row">
                <div className="col-md-8">
                    <div className="card">
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label">Code</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={formData.code}
                                        onChange={(e) =>
                                            setFormData({ ...formData, code: e.target.value })
                                        }
                                        required
                                    />
                                </div>
                                {/* <div className="mb-3">
                                    <label className="form-label">Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={formData.name}
                                        onChange={(e) =>
                                            setFormData({ ...formData, name: e.target.value })
                                        }
                                        required
                                    />
                                </div> */}
                                <div className="mb-3">
                                    <label className="form-label">Display Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={formData.display_name}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                display_name: e.target.value,
                                                name: e.target.value,
                                            })
                                        }
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Description</label>
                                    <Form.Control
                                        as="textarea"
                                        rows={4}
                                        value={formData.description}
                                        onChange={(e) =>
                                            setFormData({ ...formData, description: e.target.value })
                                        }
                                    />
                                </div>
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Amount</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            value={formData.amount}
                                            onChange={(e) =>
                                                setFormData({ ...formData, amount: Number(e.target.value) })
                                            }
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Interval</label>
                                        <select
                                            className="form-select"
                                            value={formData.interval}
                                            onChange={(e) =>
                                                setFormData({ ...formData, interval: e.target.value })
                                            }
                                            required
                                        >
                                            <option value="monthly">MONTHLY</option>
                                            <option value="quarterly">QUARTERLY</option>
                                            <option value="yearly">YEARLY</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-4 mb-3">
                                        <label className="form-label">Interval Count</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            value={formData.interval_count}
                                            onChange={(e) =>
                                                setFormData({ ...formData, interval_count: Number(e.target.value) })
                                            }
                                        />
                                    </div>
                                    <div className="col-md-4 mb-3">
                                        <label className="form-label">Trial Days</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            value={formData.trial_days}
                                            onChange={(e) =>
                                                setFormData({ ...formData, trial_days: Number(e.target.value) })
                                            }
                                        />
                                    </div>
                                    <div className="col-md-4 mb-3">
                                        <label className="form-label">Trial Price</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            value={formData.trial_price}
                                            onChange={(e) =>
                                                setFormData({ ...formData, trial_price: Number(e.target.value) })
                                            }
                                        />
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Features (comma separated)</label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        value={formData.features}
                                        onChange={(e) =>
                                            setFormData({ ...formData, features: e.target.value })
                                        }
                                    />
                                </div>
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <Form.Check
                                            type="switch"
                                            label="Is Active"
                                            checked={formData.is_active}
                                            onChange={(e) =>
                                                setFormData({ ...formData, is_active: e.target.checked })
                                            }
                                        />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <Form.Check
                                            type="switch"
                                            label="Is Default"
                                            checked={formData.is_default}
                                            onChange={(e) =>
                                                setFormData({ ...formData, is_default: e.target.checked })
                                            }
                                        />
                                    </div>
                                </div>
                                <div className="d-flex gap-2">
                                    <Button
                                        variant="secondary"
                                        onClick={() => router.push("/subscription-plans")}
                                        disabled={loading}
                                    >
                                        Cancel
                                    </Button>
                                    <Button type="submit" variant="primary" disabled={loading}>
                                        Create Plan
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
