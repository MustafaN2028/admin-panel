"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "next/navigation";
import { fetchUserById, updateUser } from "@/lib/features/userSlice";
import { Form } from "react-bootstrap";
export default function EditUserPage() {
  const params = useParams();
  const dispatch = useDispatch();
  const router = useRouter();
  const [formData, setFormData] = useState({
    address: {
      line1: "",
      city: "",
      state: "",
      pincode: "",
    },
    name: "",
    phone_number: "",
    age: "",
    cycle_length: "",
    period_length: "",
    preferred_language: "",
    last_period_start: "",
    onboarding_completed: false,
    onboarding_payload: {
      name: "",
      age: "",
      cycle_length_option: "",
      period_duration: "",
      flow_type: "",
      last_period_date: "",
      cramps: "",
      mood_swings: "",
      irregular_cycle: "",
    },
  });
  const [errors, setErrors] = useState({
    phone_number: "",
  });
  const validatePhoneNumber = (phone) => {
    if (!phone.trim()) {
      return "Phone number is required";
    }

    if (!/^\d+$/.test(phone)) {
      return "Phone number must contain only digits";
    }

    if (!/^[6-9]\d{9}$/.test(phone)) {
      return "Enter a valid 10-digit mobile number";
    }

    return "";
  };
  const { selectedUser, loading, error } = useSelector((state) => state.users);
  useEffect(() => {
    console.log("Inside useEffect", params?.id);
    if (params?.id) {
      dispatch(fetchUserById(params.id));
    }
  }, [dispatch, params.id]);
  useEffect(() => {
    if (selectedUser?.data) {
      setFormData({
        address: {
          line1: selectedUser?.data?.address?.line1 || "",
          city: selectedUser?.data?.address?.city || "",
          state: selectedUser?.data?.address?.state || "",
          pincode: selectedUser?.data?.address?.pincode || "",
        },
        name: selectedUser?.data?.name || "",
        phone_number: selectedUser?.data?.phone_number || "",
        age: selectedUser?.data?.age || "",
        cycle_length: selectedUser?.data?.cycle_length || "",
        period_length: selectedUser?.data?.period_length || "",
        preferred_language: selectedUser?.data?.preferred_language || "",
        onboarding_completed: selectedUser?.data?.onboarding_completed || false,
        last_period_start:
          selectedUser?.data?.onboarding_payload?.last_period_date || "",
        onboarding_payload: {
          name: selectedUser?.data?.onboarding_payload?.name || "",
          age: selectedUser?.data?.onboarding_payload?.age || "",
          cycle_length_option:
            selectedUser?.data?.onboarding_payload?.cycle_length_option || "",
          period_duration:
            selectedUser?.data?.onboarding_payload?.period_duration || "",
          flow_type: selectedUser?.data?.onboarding_payload?.flow_type || "",
          last_period_date:
            selectedUser?.data?.onboarding_payload?.last_period_date || "",
          cramps: selectedUser?.data?.onboarding_payload?.cramps || "",
          mood_swings:
            selectedUser?.data?.onboarding_payload?.mood_swings || "",
          irregular_cycle:
            selectedUser?.data?.onboarding_payload?.irregular_cycle || "",
        },
      });
    }
  }, [selectedUser?.data]);

  console.log("params:", params);
  console.log("id:", params?.id);
  console.log(selectedUser?.data);
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form Data", formData);
    const phoneError = validatePhoneNumber(formData.phone_number);

    if (phoneError) {
      setErrors({
        ...errors,
        phone_number: phoneError,
      });
      return;
    }
    try {
      await dispatch(
        updateUser({
          id: params.id,
          userData: formData,
        }),
      ).unwrap();
      router.push("/user");
    } catch (error) {
      console.log("Update failed", error);
    }
  };
  return (
    <div className="container py-2 ">
      <h3 className="fw-bold m-0 text-dark">Edit User</h3>
      <div className="row">
        <div className="col-md-12">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Edit User</h5>
              <form onSubmit={handleSubmit}>
                <div className="row m-0">
                  <div className="col-sm-6 mb-3">
                    <label htmlFor="line1" className="form-label">
                      Line
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="line1"
                      value={formData?.address?.line1 || ""}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          address: {
                            ...formData.address,
                            line1: e.target.value,
                          },
                        });
                      }}
                    />
                  </div>
                  <div className="col-sm-6 mb-3">
                    <label htmlFor="city" className="form-label">
                      City
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="city"
                      value={formData?.address?.city || ""}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          address: {
                            ...formData.address,
                            city: e.target.value,
                          },
                        });
                      }}
                    />
                  </div>
                  <div className="col-sm-6 mb-3">
                    <label htmlFor="state" className="form-label">
                      State
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="state"
                      value={formData?.address?.state || ""}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          address: {
                            ...formData.address,
                            state: e.target.value,
                          },
                        });
                      }}
                    />
                  </div>
                  <div className="col-sm-6 mb-3">
                    <label htmlFor="pincode" className="form-label">
                      Pincode
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="pincode"
                      value={formData?.address?.pincode || ""}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          address: {
                            ...formData.address,
                            pincode: e.target.value,
                          },
                        });
                      }}
                    />
                  </div>
                  <div className="col-sm-6 mb-3">
                    <label htmlFor="name" className="form-label">
                      Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      value={formData?.name || ""}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          name: e.target.value,
                        });
                      }}
                    />
                  </div>
                  <div className="col-sm-6 mb-3">
                    <label htmlFor="phone_number" className="form-label">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="phone_number"
                      value={formData?.phone_number || ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        setFormData({
                          ...formData,
                          phone_number: e.target.value,
                        });
                        setErrors({
                          ...errors,
                          phone_number: validatePhoneNumber(value),
                        });
                      }}
                    />
                    {errors.phone_number && (
                      <div className="text-danger small mt-1">
                        {errors.phone_number}
                      </div>
                    )}
                  </div>
                  <div className="col-sm-6 mb-3">
                    <label htmlFor="age" className="form-label">
                      Age
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="age"
                      value={formData.age || ""}
                      onChange={(e) => {
                        setFormData({ ...formData, age: e.target.value });
                      }}
                    />
                  </div>
                  <div className="col-sm-6 mb-3">
                    <label htmlFor="cycle_length" className="form-label">
                      Cycle Length
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="cycle_length"
                      value={formData?.cycle_length || ""}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          cycle_length: e.target.value,
                        });
                      }}
                    />
                  </div>
                  <div className="col-sm-6 mb-3">
                    <label htmlFor="preferred_language" className="form-label">
                      Preferred Language
                    </label>
                    <select
                      className="form-control"
                      value={formData.preferred_language || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          preferred_language: e.target.value,
                        })
                      }
                    >
                      <option value={formData?.preferred_language}>
                        {formData?.preferred_language}
                      </option>
                    </select>
                  </div>
                  <div className="col-sm-6 mb-3">
                    <label htmlFor="last_period_start" className="form-label">
                      Last Period Start
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="last_period_start"
                      value={formData?.last_period_start || ""}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          last_period_start: e.target.value,
                        });
                      }}
                    />
                  </div>
                  <div className="col-sm-6 mb-3">
                    <label
                      htmlFor="onboarding_completed"
                      className="form-label"
                    >
                      Onboarding Completed
                    </label>
                    <Form.Check // prettier-ignore
                      type="switch"
                      id="onboarding_completed"
                      checked={formData.onboarding_completed || false}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          onboarding_completed: e.target.checked,
                        })
                      }
                    />
                  </div>
                </div>
                {formData?.onboarding_completed && (
                  <div className="row m-0">
                    <div className="col-sm-6 mb-3">
                      <label
                        htmlFor="onboarding_payload.name"
                        className="form-label"
                      >
                        Name
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="onboarding_payload.name"
                        value={formData?.onboarding_payload?.name || ""}
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            onboarding_payload: {
                              ...formData?.onboarding_payload,
                              name: e.target.value,
                            },
                          });
                        }}
                      />
                    </div>
                    <div className="col-sm-6 mb-3">
                      <label
                        htmlFor="onboarding_payload.age"
                        className="form-label"
                      >
                        Age
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="onboarding_payload.age"
                        value={formData?.onboarding_payload?.age || ""}
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            onboarding_payload: {
                              ...formData?.onboarding_payload,
                              age: e.target.value,
                            },
                          });
                        }}
                      />
                    </div>
                    <div className="col-sm-6 mb-3">
                      <label
                        htmlFor="onboarding_payload.cycle_length_option"
                        className="form-label"
                      >
                        Cycle Length Option
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="onboarding_payload.cycle_length_option"
                        value={
                          formData?.onboarding_payload?.cycle_length_option ||
                          ""
                        }
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            onboarding_payload: {
                              ...formData?.onboarding_payload,
                              cycle_length_option: e.target.value,
                            },
                          });
                        }}
                      />
                    </div>
                    <div className="col-sm-6 mb-3">
                      <label
                        htmlFor="onboarding_payload.period_duration"
                        className="form-label"
                      >
                        Period Duration
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="onboarding_payload.period_duration"
                        value={
                          formData?.onboarding_payload?.period_duration || ""
                        }
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            onboarding_payload: {
                              ...formData?.onboarding_payload,
                              period_duration: e.target.value,
                            },
                          });
                        }}
                      />
                    </div>
                    <div className="col-sm-6 mb-3">
                      <label
                        htmlFor="onboarding_payload.flow_type"
                        className="form-label"
                      >
                        Flow Type
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="onboarding_payload.flow_type"
                        value={formData?.onboarding_payload?.flow_type || ""}
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            onboarding_payload: {
                              ...formData?.onboarding_payload,
                              flow_type: e.target.value,
                            },
                          });
                        }}
                      />
                    </div>
                    <div className="col-sm-6 mb-3">
                      <label
                        htmlFor="onboarding_payload.cramps"
                        className="form-label"
                      >
                        Cramps
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="onboarding_payload.cramps"
                        value={formData?.onboarding_payload?.cramps || ""}
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            onboarding_payload: {
                              ...formData?.onboarding_payload,
                              cramps: e.target.value,
                            },
                          });
                        }}
                      />
                    </div>
                    <div className="col-sm-6 mb-3">
                      <label
                        htmlFor="onboarding_payload.mood_swings"
                        className="form-label"
                      >
                        Mood Swings
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="onboarding_payload.mood_swings"
                        value={formData?.onboarding_payload?.mood_swings || ""}
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            onboarding_payload: {
                              ...formData?.onboarding_payload,
                              mood_swings: e.target.value,
                            },
                          });
                        }}
                      />
                    </div>
                    <div className="col-sm-6 mb-3">
                      <label
                        htmlFor="onboarding_payload.irregular_cycle"
                        className="form-label"
                      >
                        Irregular Cycle
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="onboarding_payload.irregular_cycle"
                        value={
                          formData?.onboarding_payload?.irregular_cycle || ""
                        }
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            onboarding_payload: {
                              ...formData?.onboarding_payload,
                              irregular_cycle: e.target.value,
                            },
                          });
                        }}
                      />
                    </div>
                  </div>
                )}
                <button type="submit" className="btn btn-primary" disabled={loading}>
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
