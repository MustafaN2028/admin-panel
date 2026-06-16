"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import { Envelope, Lock, Telephone } from "react-bootstrap-icons";
const LoginPage = () => {
  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");
  const [mobileError, setMobileError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);
  // Enforces: 8+ chars, 1 Uppercase, 1 Lowercase, 1 Number, 1 Special Char
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const mobileRegex = /^\+?[0-9]{10,15}$/;
  // Logic Handler for Mobile Inputs
  const handleMobileChange = (val) => {
    // Strip out spaces or dashes if the user types them formatted
    const cleanVal = val.replace(/[\s-]/g, "");
    setMobileNumber(cleanVal);

    if (cleanVal.trim() === "") {
      setMobileError("Mobile Number Cannot be Empty");
    } else if (!mobileRegex.test(cleanVal)) {
      setMobileError("Please Enter a Valid Mobile Number (10-15 digits)");
    } else {
      setMobileError("");
    }
  };
  const handlePasswordChange = (val) => {
    setPassword(val);
    if (val.trim() === "") {
      setPasswordError("Password Cannot be Empty");
    } else if (!passwordRegex.test(val)) {
      setPasswordError(
        "Password Must be Atleast 8 Chars with one uppercase, one lowercase, one number and one special character",
      );
    } else {
      setPasswordError("");
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="min-vh-100 d-flex justify-content-center align-items-center">
      <Container>
        <Row className="justify-content-center">
          <Col xs={12} sm={8} md={6} lg={4}>
            <Card className="border-0 shadow-lg p-3 rounded-4">
              <Card.Body>
                <h4 className="fw-bold text-dark mb-4 text-center">Sign In</h4>
                <Form autoComplete="off " onSubmit={handleSubmit} noValidate>
                  <Form.Group className="mb-3">
                    <Form.Label>Mobile Number</Form.Label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0 text-muted">
                        <Telephone size={16} />{" "}
                        {/* Updated to Telephone Icon */}
                      </span>
                      <Form.Control
                        type="tel" // Updated input type to phone layout trigger
                        placeholder="Enter Mobile Number"
                        className="bg-light border-start-0"
                        value={mobileNumber}
                        onChange={(e) => handleMobileChange(e.target.value)}
                        required
                      />
                      {mobileError && (
                        <span className="invalid-feedback d-block small fw-medium">
                          {mobileError}
                        </span>
                      )}
                    </div>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0 text-muted">
                        <Lock size={16} />
                      </span>
                      <Form.Control
                        type="password"
                        placeholder="••••••••"
                        className="bg-light border-start-0"
                        value={password}
                        onChange={(e) => handlePasswordChange(e.target.value)}
                        required
                      />
                      {passwordError && (
                        <span className="invalid-feedback d-block small fw-medium">
                          {passwordError}
                        </span>
                      )}
                    </div>
                  </Form.Group>
                  <Button
                    variant="primary"
                    type="submit"
                    className="w-100 py-2 fw-semibold shadow-sm rounded-2"
                  >
                    Sign In
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default LoginPage;
