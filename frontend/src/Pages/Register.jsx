
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Select, message, Card, Typography, Divider } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined, LockOutlined } from '@ant-design/icons';
import axios from 'axios';
import './AuthStyles.css';

const { Option } = Select;
const { Title, Text } = Typography;

const Register = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/auth/register/', values);
      message.success('Registration successful! Please verify your phone number.');
      navigate('/verify-otp', { state: { phone: values.phone } });
    } catch (error) {
      if (error.response) {
        message.error(error.response.data.message || 'Registration failed');
      } else {
        message.error('Network error. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container light-premium-theme">
      <Card className="auth-card" hoverable>
        <div className="auth-header">
          <Title level={3} className="premium-title">Create Your Account</Title>
          <Text type="secondary" className="premium-subtext">Join our exclusive community</Text>
        </div>
        
        <Divider className="premium-divider" />
        
        <Form
          form={form}
          name="register"
          onFinish={onFinish}
          scrollToFirstError
          layout="vertical"
        >
          <Form.Item
            name="username"
            label="Username"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input 
              prefix={<UserOutlined className="premium-input-icon" />} 
              placeholder="Choose a username" 
              className="premium-input"
            />
          </Form.Item>

          <Form.Item
            name="name"
            label="Full Name"
            rules={[{ required: true, message: 'Please input your full name!' }]}
          >
            <Input 
              prefix={<UserOutlined className="premium-input-icon" />} 
              placeholder="Your full name" 
              className="premium-input"
            />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email!' },
            ]}
          >
            <Input 
              prefix={<MailOutlined className="premium-input-icon" />} 
              placeholder="your@email.com" 
              className="premium-input"
            />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Phone Number"
            rules={[
              { required: true, message: 'Please input your phone number!' },
              { pattern: /^[6-9]\d{9}$/, message: 'Please enter a valid Indian phone number!' },
            ]}
          >
            <Input
              prefix={<PhoneOutlined className="premium-input-icon" />}
              addonBefore={<Select defaultValue="+91" className="premium-select">
                <Option value="+91">+91</Option>
              </Select>}
              className="premium-input"
              placeholder="9876543210"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[
              { required: true, message: 'Please input your password!' },
              { min: 8, message: 'Password must be at least 8 characters!' },
            ]}
            hasFeedback
          >
            <Input.Password 
              prefix={<LockOutlined className="premium-input-icon" />} 
              placeholder="Create a password" 
              className="premium-input"
            />
          </Form.Item>

          <Form.Item
            name="confirm"
            label="Confirm Password"
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
            <Input.Password 
              prefix={<LockOutlined className="premium-input-icon" />} 
              placeholder="Confirm your password" 
              className="premium-input"
            />
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              className="auth-button premium-button"
              block
              size="large"
            >
              Create Account
            </Button>
          </Form.Item>
        </Form>

        <Divider className="premium-divider">or</Divider>

        <div className="auth-footer">
          Already have an account? <a href="/login" className="premium-link">Sign in</a>
        </div>
      </Card>
    </div>
  );
};

export default Register;