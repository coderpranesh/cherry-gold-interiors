

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, message, Card, Typography, Select } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined, LockOutlined } from '@ant-design/icons';
import AuthAPI from '../../api/authAPI';  // Updated import path
import './AuthStyles.css';

const { Title } = Typography;
const { Option } = Select;

const Register = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validatePhone = (_, value) => {
    if (!value || /^[0-9]{10}$/.test(value)) {
      return Promise.resolve();
    }
    return Promise.reject(new Error('Please enter a valid 10-digit Indian phone number!'));
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await AuthAPI.register(values);
      message.success('Registration successful! Please check your email for verification.');
      navigate('/verify-otp', { state: { email: values.email } });
    } catch (error) {
      message.error(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <Card className="auth-card">
        <div className="auth-header">
          <Title level={3} className="gold-text">Create Account</Title>
          <p>Join our platform today</p>
        </div>
        <Form
          name="register"
          onFinish={onFinish}
          className="auth-form"
          scrollToFirstError
        >
          <Form.Item
            name="name"
            rules={[{ required: true, message: 'Please input your full name!' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Full Name" />
          </Form.Item>

          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email!' }
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="Email" />
          </Form.Item>

          <Form.Item
            name="phone"
            rules={[
              { required: true, message: 'Please input your phone number!' },
              { validator: validatePhone }
            ]}
          >
            <Input
              prefix={<PhoneOutlined />}
              addonBefore={<Select defaultValue="+91" style={{ width: 70 }}>
                <Option value="+91">+91</Option>
              </Select>}
              style={{ width: '100%' }}
              placeholder="Phone Number"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: 'Please input your password!' },
              { min: 8, message: 'Password must be at least 8 characters!' }
            ]}
            hasFeedback
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            dependencies={['password']}
            hasFeedback
            rules={[
              { required: true, message: 'Please confirm your password!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('The two passwords do not match!'));
                },
              }),
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Confirm Password" />
          </Form.Item>

          <Form.Item
            name="referral_code"
            help="Optional: Enter if you were referred by someone"
          >
            <Input placeholder="Referral Code" />
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading} 
              block
              className="auth-button"
            >
              Register
            </Button>
          </Form.Item>
        </Form>
        <div className="auth-footer">
          Already have an account? <a href="/login" className="gold-text">Login now!</a>
        </div>
      </Card>
    </div>
  );
};

export default Register;