import React, { useState, useEffect } from "react";
import { Form, Input, message, Card } from "antd";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Spinner from "../components/Spinner";
import "../styles/Register.css";
const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  //from submit
  const submitHandler = async (values) => {
    try {
      setLoading(true);
      //await axios.post("/api/v1/users/register", values);
      await axios.post("http://localhost:8080/api/v1/users/register", values)
      message.success("Registaration Successful");
      setLoading(false);
      navigate("/login");
    } catch (error) {
      setLoading(false);
      message.error("The email you provide is already taken");
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
      <div className="register-page ">
        {loading && <Spinner />}
        <Card className="card-container">
        <Form layout="vertical" onFinish={submitHandler}>
          <h1>Register Form</h1>
          <Form.Item label="Name" name="name">
            <Input />
          </Form.Item>
          <Form.Item label="Email" name="email">
            <Input type="email" />
          </Form.Item>
          <Form.Item label="Password" name="password">
            <Input type="password" />
          </Form.Item>
          <div className="d-flex flex-column mt-3">
          <button className="btn btn-primary mb-4">Register</button>
            <Link to="/login">Already have an account? Click Here to login</Link>
            
          </div>
        </Form>
        </Card>
      </div>
    </>
  );
};

export default Register;