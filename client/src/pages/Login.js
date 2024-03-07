import React, { useState, useEffect } from "react";
import { Form, Input, message, Card } from "antd";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Spinner from "../components/Spinner";
import "../styles/LoginPage.css";


const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  //from submit
  const submitHandler = async (values) => {
    try {
      setLoading(true);
      //const { data } = await axios.post("/api/v1/users/login", values);
      const { data } = await axios.post("http://localhost:8080/api/v1/users/login", values)
      setLoading(false);
      message.success("login success");
      localStorage.setItem(
        "user",
        JSON.stringify({ ...data.user, password: "" })
      );
      navigate("/");
    } catch (error) {
      setLoading(false);
      message.error("invalid email or password");
    }
  };

  //prevent for login user
  useEffect(() => {
    if (localStorage.getItem("user")) {
      navigate("/");
    }
  }, [navigate]);
  return (
    <>
      <div className="login-page">
      {loading && <Spinner />}
      <Card className="card-container">
        <Form layout="vertical" onFinish={submitHandler}>
          <h1>Login Form</h1>
          <Form.Item label="Email" name="email">
            <Input type="email" autoComplete="email" />
          </Form.Item>
          <Form.Item label="Password" name="password">
            <Input type="password" autoComplete="current-password" />
          </Form.Item>
          <div className="d-flex flex-column justify-content-between">
            <button className="btn btn-primary mb-3">Sign-in</button>
            <div className="link">
              <Link to="/register">Sign-up?</Link>
            </div>
          </div>
        </Form>
      </Card>
    </div>
    </>
  );
};

export default Login;
