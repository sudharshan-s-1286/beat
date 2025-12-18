import { useState } from "react";
import { Button, Checkbox, Form, Input, message } from "antd";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const login = async () => {
    console.log("Attempting login for:", email);
    try {
      const res = await axios.post("http://localhost:5000/api/signin", {
        email,
        password,
      });

      console.log("Login Response:", res.data);

      if (res.data.jwt) {
        localStorage.setItem("token", res.data.jwt);
        console.log("Token stored in localStorage:", res.data.jwt);
        message.success("Login successful");
        setEmail("");
        setPassword("");

        // Short delay to ensure localstorage is set before navigation
        setTimeout(() => navigate("/music"), 1000);
      } else {
        console.warn("No token received in response");
        message.error("Login failed: No token received");
      }

    } catch (err) {
      console.error("Login Error:", err);
      if (err.response && err.response.data && err.response.data.error) {
        message.error(err.response.data.error);
      } else {
        message.error("Invalid email or password");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-fixed bg-center bg-cover" style={{ backgroundColor: "#121212" }}>
      <div className="w-125 p-8 rounded-xl bg-black/70 hover:bg-black/80 hover:shadow-2xl transition-all border border-neutral-800">

        {/* Heading */}
        <h2 className="text-4xl text-center font-extrabold text-white mb-8 hover:text-green-500 transition">
          Login
        </h2>

        {/* AntD Form */}
        <Form layout="vertical" onFinish={login} autoComplete="off">
          <Form.Item
            label={
              <span className="text-white hover:text-green-500 transition">
                Email
              </span>
            }
            name="email"
            rules={[
              { required: true, message: "Please input your email!" },
              { type: "email", message: "Enter a valid email!" },
            ]}
          >
            <Input value={email} onChange={(e) => setEmail(e.target.value)} className="hover:border-green-500 focus:border-green-500" />
          </Form.Item>

          <Form.Item
            label={
              <span className="text-white hover:text-green-500 transition">
                Password
              </span>
            }
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="hover:border-green-500 focus:border-green-500"
            />
          </Form.Item>

          {/* Remember me */}
          <Form.Item>
            <Checkbox
              style={{ color: "white" }}
              className="hover:text-green-500 transition"
            >
              Remember me
            </Checkbox>
          </Form.Item>

          <Form.Item>
            <Button
              block
              htmlType="submit"
              type="primary"
              size="large"
              className="bg-green-600 hover:bg-green-500 border-none text-white font-bold"
              style={{ backgroundColor: "#1db954", color: "white" }}
            >
              Login
            </Button>
          </Form.Item>
        </Form>

        {/* Redirect */}
        <div className="text-center text-white mt-4">
          If you are new here,{" "}
          <Link
            to="/signup"
            className="underline hover:text-green-500 transition"
          >
            Sign up
          </Link>
        </div>

      </div>
    </div>
  );
};

export default SignIn;
