import React from 'react';
import { LockOutlined, UserOutlined, EyeTwoTone, EyeInvisibleOutlined } from '@ant-design/icons';
import { Button, Form, message, Input } from 'antd';
import { NavLink, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, getAuth } from 'firebase/auth';

const Login = () => {
  const auth = getAuth();
  const nav = useNavigate()
  const onFinish = (values) => {
    signInWithEmailAndPassword(auth, values.email, values.password)
      .then((res) => {
        message.open({
          type: 'success',
          content: 'Login success',
        });
        localStorage.setItem("userEmail",res.user.email)
        nav("/dashboard")
      })
      .catch(e => {
        message.open({
          type: 'error',
          content: e.message,
        });
      })
  };
  return (
      <div className='container'>
        <h2>Login</h2>
        <Form
          name="normal_login"
          className="login-form"
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
        >
          <Form.Item
            name="email"
            rules={[
              {
                required: true,
                message: 'Please input your Email!',
              },
            ]}
          >
            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Email" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: 'Please input your Password!',
              },
            ]}

          >
            <Input.Password
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined className="icon" />
              }
            />
          </Form.Item>


          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-form-button" >
              Log in
            </Button>
            <div style={{ textAlign: "center", marginTop: 10 }}>
              Or <NavLink to="/register">register now!</NavLink>
            </div>
          </Form.Item>
        </Form>
      </div>
  );
}

export default Login