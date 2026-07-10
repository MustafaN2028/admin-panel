"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import {
    fetchSubscriptionPlanById,
    updateSubscriptionPlan,
} from "@/lib/features/subscriptionPlansSlice";
import { Form, Button } from "react-bootstrap";

export default function EditSubscriptionPlanPage() {
    const params = useParams();
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

    const { selectedPlan, loading, error } = useSelector(
        (state) => state.subscriptionPlans,
    );

    useEffect(() => {
        if (params?.plan_id) {
            dispatch(fetchSubscriptionPlanById(params.plan_id));
        }
    }, [dispatch, params.plan_id]);

    useEffect(() => {
        if (selectedPlan?.data) {
            setFormData({
                code: selectedPlan.data.code || "",
                name: selectedPlan.data.name || "",
                display_name: selectedPlan.data.display_name || "",
                description: selectedPlan.data.description || "",
                amount: selectedPlan.data.amount ?? 0,
                interval: selectedPlan.data.interval || "monthly",
                interval_count: selectedPlan.data.interval_count ?? 1,
                trial_days: selectedPlan.data.trial_days ?? 0,
                trial_price: selectedPlan.data.trial_price ?? 0,
                features: Array.isArray(selectedPlan.data.features)
                    ? selectedPlan.data.features.join(", ")
                    : selectedPlan.data.features || "",
                is_active: selectedPlan.data.is_active ?? true,
                is_default: selectedPlan.data.is_default ?? false,
                sort_order: selectedPlan.data.sort_order ?? 1,
            });
        }
    }, [selectedPlan]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await dispatch(
                updateSubscriptionPlan({
                    planId: params.plan_id,
                    planData: {
                        name: formData.display_name,
                        display_name: formData.display_name,
                        description: formData.description,
                        amount: Number(formData.amount),
                        amount_paise: Number(formData.amount) * 100,
                        currency: "INR",
                        interval: formData.interval,
                        interval_count: Number(formData.interval_count),
                        trial_days: Number(formData.trial_days),
                        trial_price: Number(formData.trial_price),
                        features: formData.features
                            .split(",")
                            .map((feature) => feature.trim())
                            .filter(Boolean),
                        is_active: formData.is_active,
                        is_default: formData.is_default,
                        sort_order: Number(formData.sort_order),
                    },
                }),
            ).unwrap();
            router.push("/subscription-plans");
        } catch (updateError) {
            console.error("Update failed", updateError);
        }
    };

    return (
        <div className="container py-2">
            <h3 className="fw-bold m-0 mb-3 text-dark">Edit Subscription Plan</h3>
            {error && (
                <div className="alert alert-danger small" role="alert">
                    {error}
                </div>
            )}
            <div className="row">
                <div className="col-md-8">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Plan Details</h5>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label">Code</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={formData.code}
                                        readOnly
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
                                </div>
                                <div className="row">
                                    <div className="col-md-4 mb-3">
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
                                </div>
                                <div className="row">
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
                                    <div className="col-md-4 mb-3">
                                        <label className="form-label">Sort Order</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            value={formData.sort_order}
                                            onChange={(e) =>
                                                setFormData({ ...formData, sort_order: Number(e.target.value) })
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
                                        Save Changes
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div >
        </div >
    );
}
