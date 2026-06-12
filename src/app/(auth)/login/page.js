"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import { Envelope, Lock } from "react-bootstrap-icons";
const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);
  // Production Grade Email Regex Pattern
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  // Enforces: 8+ chars, 1 Uppercase, 1 Lowercase, 1 Number, 1 Special Char
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const handleEmailChange = (val) => {
    setEmail(val);
    if (val.trim() === "") {
      setEmailError("Email Cannot be Empty");
    } else if (!emailRegex.test(val)) {
      setEmailError("Please Enter Valid Email");
    } else {
      setEmailError("");
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
                <Form autoComplete="false" onSubmit={handleSubmit} noValidate>
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0 text-muted">
                        <Envelope size={16} />
                      </span>
                      <Form.Control
                        type="email"
                        placeholder="Enter Your Email"
                        className="bg-light border-start-0"
                        value={email}
                        onChange={(e) => handleEmailChange(e.target.value)}
                        required
                      />
                      {emailError && (
                        <span className="invalid-feedback d-block small fw-medium">
                          {emailError}
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
