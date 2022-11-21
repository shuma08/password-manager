import React from 'react'
import { LockOutlined, UserOutlined, EyeTwoTone, EyeInvisibleOutlined } from '@ant-design/icons';
import { Button, Form, message, Input } from 'antd';
import { NavLink, useNavigate } from 'react-router-dom';
import { collection, addDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth'

const Register = ({ database }) => {
  const nav = useNavigate()
  const collectionRef = collection(database, 'userPasswords')
  const auth = getAuth();
  const onFinish = (values) => {
    createUserWithEmailAndPassword(auth, values.email, values.password)
      .then(res => {
        // message.open({
        //   type: 'loading',
        //   content: 'Action in progress..',
        //   duration: 0,
        //   onClose
        // });
        sessionStorage.setItem('userEmail', res.user.email);
        addDoc(collectionRef, {
          email: values.email,
          password: values.password,
          accountsInfo: []
        })
          .then(() => {
            
            message.open({
              type: 'success',
              content: 'Account registered',
            });
            nav('/login')
          })
          .catch(e => {
            message.open({
              type: 'error',
              content: e.message,
            });
          })
      })
      .catch(e => {
        message.open({
          type: 'error',
          content: e.message,
        });
      })

    // console.log('Received values of form: ', values);
  };
  return (
    <>
      <div className='container'>
        <h2>Register</h2>
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
                message: 'Please input your email!',
              },
            ]}
          >
            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Email" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                pattern:
                  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$,%^&.*()_}|"=±§:>?<~`+])(?=.*\d).{6,}$/,
                message:
                  "Min 6 characters, at least 1 Upper letter, 1 symbol and 1 number"
              },
              {
                required: true,
                message: 'Please input your Password!',
              }
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
          <Form.Item
            name="confirm"
            dependencies={['password']}
            hasFeedback
            rules={[
              {
                required: true,
                message: 'Please confirm your password!',
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('The two passwords that you entered do not match!'));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="site-form-item-icon" />}
              placeholder='Confirm Password'
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-form-button" >
              Register
            </Button>
            <div style={{ textAlign: "center", marginTop: 10 }}>
              Or <NavLink to="/login">login now!</NavLink>
            </div>
          </Form.Item>
        </Form>
      </div>

    </>
  )
}

export default Register