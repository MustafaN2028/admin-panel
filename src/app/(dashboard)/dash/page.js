"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "@/lib/features/userSlice";
import { fetchSubscriptions } from "@/lib/features/subscriptionSlice";
import { Button, Card } from "react-bootstrap";
import { People, GraphUp, ArrowClockwise } from "react-bootstrap-icons";

const Dash = () => {
  const dispatch = useDispatch();
  const [refresh, setRefresh] = useState(false);
  const { usersList } = useSelector((state) => state.users);
  const { subscriptionsList } = useSelector((state) => state.subscriptions);

  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchSubscriptions());
  }, []);
  const handleRefresh = async () => {
    try {
      setRefresh(true);
      await Promise.all([
        dispatch(fetchSubscriptions()).unwrap(),
        dispatch(fetchUsers()).unwrap(),
      ]);
      setRefresh(false);
    } catch (error) {
      console.log(error);
      setRefresh(false);
    }
  };
  return (
    <div className="container py-3">
      <div className="row mb-3">
        <div className="col-sm-6">
          <h3>Hello, Admin</h3>
        </div>
        <div className="col-sm-6 d-flex justify-content-end">
          <Button variant="primary" onClick={handleRefresh} disabled={refresh}>
            <ArrowClockwise size={14} />
            <span> {refresh ? "Refreshing....." : "Refresh"}</span>
          </Button>
        </div>
      </div>
      <div className="row">
        {/* Card 1: Total Users */}
        <div className="col-md-3">
          <Card className="shadow-sm">
            <Card.Body className="">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <div className="h3 mb-0">{usersList?.pagination?.total}</div>
                <div className="bg-primary bg-opacity-10 p-2 rounded-circle text-primary">
                  <People size={24} />
                </div>
              </div>
              <h6 className="card-title mb-1">Total Users</h6>
              {/* <p className="card-text text-muted small mb-0">
                <span className="text-success">+2.5%</span> from last month
              </p> */}
            </Card.Body>
          </Card>
        </div>

        {/* Card 2: Active Subscriptions */}
        <div className="col-md-3">
          <Card className="shadow-sm">
            <Card.Body>
              <div className="d-flex align-items-center justify-content-between mb-3">
                <div className="h3 mb-0">
                  {subscriptionsList?.pagination?.total}
                </div>
                <div className="bg-success bg-opacity-10 p-2 rounded-circle text-success">
                  <GraphUp size={24} />
                </div>
              </div>
              <h6 className="card-title mb-1">Active Subscriptions</h6>
              {/* <p className="card-text text-muted small mb-0">
                <span className="text-success">+1.2%</span> from last month
              </p> */}
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dash;
