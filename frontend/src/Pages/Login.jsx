// src/Pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Input, Button, Checkbox, message, Card, Typography, Divider } from 'antd';
import { UserOutlined, LockOutlined, GoogleOutlined, FacebookOutlined } from '@ant-design/icons';
import AuthAPI from '../api/AuthAPI';
import { goldenTheme } from '../Theme';
import './AuthStyles.css';

const { Title, Text } = Typography;

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      console.log('Attempting login with:', values);
      
      const response = await AuthAPI.login(values);
      
      console.log('Login response:', response);
      
      message.success('Welcome back! Login successful.');
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      
      if (error.response?.status === 401 || error.response?.status === 400) {
        const errorData = error.response?.data;
        
        if (errorData?.error === "Phone number not verified") {
          message.error('Please verify your phone number before logging in.');
          navigate('/verify-otp', { state: { phone: values.username } });
        } else if (errorData?.error === "Email not verified") {
          message.error('Please verify your email before logging in.');
        } else if (errorData?.error === "Invalid credentials") {
          message.error('Invalid username or password. Please try again.');
        } else {
          message.error(errorData?.detail || 'Authentication failed. Please check your credentials.');
        }
      } else {
        message.error('Network error. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container" style={{ background: 'linear-gradient(135deg, #f9f9f9 0%, #f0f0f0 100%)' }}>
      <Card 
        className="auth-card"
        style={{ 
          maxWidth: 480,
          border: '1px solid rgba(212, 175, 55, 0.3)',
          boxShadow: '0 8px 24px rgba(212, 175, 55, 0.1)'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Title level={3} style={{ color: goldenTheme.token.colorPrimary }}>
            Welcome Back
          </Title>
          <Text type="secondary">Sign in to your account to continue</Text>
        </div>

        <Form
          name="login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            name="username"
            label="Username or Email"
            rules={[{ required: true, message: 'Please input your username or email!' }]}
          >
            <Input 
              prefix={<UserOutlined style={{ color: 'rgba(0, 0, 0, 0.25)' }} />} 
              placeholder="Username or Email" 
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password 
              prefix={<LockOutlined style={{ color: 'rgba(0, 0, 0, 0.25)' }} />} 
              placeholder="Password" 
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>Remember me</Checkbox>
              </Form.Item>
              <Link to="/forgot-password" className="auth-link">
                Forgot password?
              </Link>
            </div>
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading} 
              block
              size="large"
              style={{ 
                backgroundColor: goldenTheme.token.colorPrimary,
                borderColor: goldenTheme.token.colorPrimary,
                fontWeight: 500
              }}
            >
              Log in
            </Button>
          </Form.Item>
        </Form>

        <Divider style={{ color: 'rgba(0, 0, 0, 0.35)' }}>or</Divider>

        <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
          <Button 
            block 
            icon={<GoogleOutlined />} 
            size="large"
            style={{ background: '#fff', color: '#db4437', borderColor: '#db4437' }}
          >
            Google
          </Button>
          <Button 
            block 
            icon={<FacebookOutlined />} 
            size="large"
            style={{ background: '#fff', color: '#4267B2', borderColor: '#4267B2' }}
          >
            Facebook
          </Button>
        </div>

        <div className="auth-footer" style={{ textAlign: 'center' }}>
          Don't have an account?{' '}
          <Link 
            to="/register" 
            style={{ 
              color: goldenTheme.token.colorPrimary,
              fontWeight: 500
            }}
          >
            Register now
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default Login;