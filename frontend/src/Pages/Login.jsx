import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Checkbox, message, Card, Typography, Divider } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import axios from 'axios';
import './AuthStyles.css';

const { Title, Text } = Typography;

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/api/auth/login/',
        {
          email: values.email,
          password: values.password
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 10000 // 10 seconds timeout
        }
      );
      
      // Store authentication data
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      // Configure axios defaults for all future requests
      axios.defaults.headers.common['Authorization'] = `Token ${response.data.token}`;
      
      message.success('Login successful!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      if (error.response) {
        // Handle specific error cases
        if (error.response.status === 400) {
          if (error.response.data?.non_field_errors) {
            message.error(error.response.data.non_field_errors[0]);
          } else {
            message.error('Invalid credentials. Please try again.');
          }
        } else if (error.response.status === 403) {
          message.error('Account not verified. Please check your email.');
        } else if (error.response.status === 500) {
          message.error('Server error. Please try again later.');
        } else {
          message.error('Login failed. Please try again.');
        }
      } else if (error.code === 'ECONNABORTED') {
        message.error('Request timeout. Please check your connection.');
      } else {
        message.error('Network error. Please check your connection.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container light-premium-theme">
      <Card className="auth-card" hoverable>
        <div className="auth-header">
          <Title level={3} className="premium-title">Welcome Back</Title>
          <Text type="secondary" className="premium-subtext">Sign in to your account</Text>
        </div>
        
        <Divider className="premium-divider" />
        
        <Form
          name="login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          layout="vertical"
          autoComplete="off"
        >
          <Form.Item
            name="email"
            label="Email"
            validateTrigger="onBlur"
            rules={[
              { 
                required: true, 
                message: 'Please input your email!' 
              },
              {
                type: 'email',
                message: 'Please enter a valid email address!',
                validateTrigger: 'onBlur'
              }
            ]}
          >
            <Input 
              prefix={<UserOutlined className="premium-input-icon" />} 
              placeholder="Enter your email" 
              className="premium-input"
              autoComplete="email"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[
              { required: true, message: 'Please input your password!' },
              { min: 8, message: 'Password must be at least 8 characters!' }
            ]}
          >
            <Input.Password 
              prefix={<LockOutlined className="premium-input-icon" />} 
              placeholder="Enter your password" 
              className="premium-input"
              autoComplete="current-password"
            />
          </Form.Item>

          <Form.Item>
            <div className="flex-between">
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox className="premium-checkbox">Remember me</Checkbox>
              </Form.Item>
              <a className="premium-link" href="/forgot-password">
                Forgot password?
              </a>
            </div>
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              className="auth-button premium-button"
              block
              size="large"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Sign In'}
            </Button>
          </Form.Item>
        </Form>

        <Divider className="premium-divider">or</Divider>

        <div className="auth-footer">
          Don't have an account? <a href="/register" className="premium-link">Sign up</a>
        </div>
      </Card>
    </div>
  );
};

export default Login;