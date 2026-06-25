"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "next/navigation";
import {
  fetchSubscriberById,
  updateSubscription,
  deleteSubscription,
} from "@/lib/features/subscriptionSlice";
import { Form } from "react-bootstrap";
export default function EditSubscriptionPage() {
  const params = useParams();
  const dispatch = useDispatch();
  const router = useRouter();
  const [formData, setFormData] = useState({
    delivery_fee_amount: 0,
    delivery_fee_paid: false,
    plan: "",
    price: 0,
    status: "cancelled",
    auto_renewal: false,
    cancel_at_period_end: false,
    next_billing_date: "",
    renewal_amount: 0,
    trial_active: false,
  });

  const { selectedsubscription, loading, error } = useSelector(
    (state) => state.subscriptions,
  );
  useEffect(() => {
    if (params?.id) {
      dispatch(fetchSubscriberById(params.id));
    }
  }, [dispatch, params.id]);
  useEffect(() => {
    if (selectedsubscription?.data) {
      setFormData({
        delivery_fee_amount: selectedsubscription.data.delivery_fee_amount ?? 0,
        delivery_fee_paid: selectedsubscription.data.delivery_fee_paid ?? false,
        plan: selectedsubscription.data.plan ?? "",
        price: selectedsubscription.data.price ?? 0,
        status: selectedsubscription.data.status ?? "cancelled",
        auto_renewal: selectedsubscription.data.auto_renewal ?? false,
        cancel_at_period_end:
          selectedsubscription.data.cancel_at_period_end ?? false,
        next_billing_date: selectedsubscription.data.next_billing_date ?? "",
        renewal_amount: selectedsubscription.data.renewal_amount ?? 0,
        trial_active: selectedsubscription.data.trial_active ?? false,
      });
    }
  }, [selectedsubscription]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(
        updateSubscription({
          id: params.id,
          userData: formData,
        }),
      ).unwrap();
      router.push("/subscription");
    } catch (error) {
      console.log("Update failed", error);
    }
  };
  return (
    <div className="container py-2 ">
      <h3 className="fw-bold m-0 mb-3 text-dark">Edit Subscription</h3>
      <div className="row">
        <div className="col-md-12">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Edit Subscription</h5>
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Plan</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.plan}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          plan: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">Price</label>
                    <input
                      type="number"
                      className="form-control"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          price: Number(e.target.value),
                        })
                      }
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">Renewal Amount</label>
                    <input
                      type="number"
                      className="form-control"
                      value={formData.renewal_amount}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          renewal_amount: Number(e.target.value),
                        })
                      }
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">Delivery Fee Amount</label>
                    <input
                      type="number"
                      className="form-control"
                      value={formData.delivery_fee_amount}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          delivery_fee_amount: Number(e.target.value),
                        })
                      }
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">Status</label>
                    <select
                      className="form-control"
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          status: e.target.value,
                        })
                      }
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="expired">Expired</option>
                    </select>
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">Next Billing Date</label>
                    <input
                      type="date"
                      className="form-control"
                      value={formData.next_billing_date}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          next_billing_date: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <Form.Check
                      type="switch"
                      label="Delivery Fee Paid"
                      checked={formData.delivery_fee_paid}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          delivery_fee_paid: e.target.checked,
                        })
                      }
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <Form.Check
                      type="switch"
                      label="Auto Renewal"
                      checked={formData.auto_renewal}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          auto_renewal: e.target.checked,
                        })
                      }
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <Form.Check
                      type="switch"
                      label="Cancel At Period End"
                      checked={formData.cancel_at_period_end}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          cancel_at_period_end: e.target.checked,
                        })
                      }
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <Form.Check
                      type="switch"
                      label="Trial Active"
                      checked={formData.trial_active}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          trial_active: e.target.checked,
                        })
                      }
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  Update
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
