import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, message, Card, Typography, Divider } from 'antd';
import { MailOutlined, PhoneOutlined } from '@ant-design/icons';
import axios from 'axios';
import './AuthStyles.css';

const { Title, Text } = Typography;

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: request, 2: verify, 3: reset
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const navigate = useNavigate();

  const onRequestReset = async (values) => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8000/api/accounts/forgot-password/', {
        email: values.email,
        phone: values.phone
      });
      
      if (response.data.otp_sent_to === 'email') {
        message.success(`Reset OTP sent to your email ${values.email}`);
        setEmail(values.email);
      } else {
        message.success(`Reset OTP sent to your phone ending with ${values.phone.slice(-3)}`);
        setPhone(values.phone);
      }
      
      setStep(2);
    } catch (error) {
      if (error.response) {
        message.error(error.response.data.message || 'Password reset failed');
      } else {
        message.error('Network error. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const onVerifyOTP = async (values) => {
    setLoading(true);
    try {
      await axios.post('http://localhost:8000/api/accounts/verify-reset-otp/', {
        email,
        phone,
        otp: values.otp
      });
      message.success('OTP verified successfully');
      setStep(3);
    } catch (error) {
      if (error.response) {
        message.error(error.response.data.message || 'OTP verification failed');
      } else {
        message.error('Network error. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const onResetPassword = async (values) => {
    setLoading(true);
    try {
      await axios.post('http://localhost:8000/api/accounts/reset-password/', {
        email,
        phone,
        new_password: values.new_password,
        confirm_password: values.confirm_password
      });
      message.success('Password reset successfully! You can now login with your new password.');
      navigate('/login');
    } catch (error) {
      if (error.response) {
        message.error(error.response.data.message || 'Password reset failed');
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
          <Title level={3} className="premium-title">
            {step === 1 ? 'Forgot Password' : step === 2 ? 'Verify OTP' : 'Reset Password'}
          </Title>
          <Text type="secondary" className="premium-subtext">
            {step === 1 ? 'Enter your email or phone to reset password' : 
             step === 2 ? 'Enter the OTP sent to your email/phone' : 
             'Enter your new password'}
          </Text>
        </div>
        
        <Divider className="premium-divider" />
        
        {step === 1 && (
          <Form
            name="forgot-password"
            onFinish={onRequestReset}
            layout="vertical"
          >
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { 
                  required: !phone, 
                  message: 'Please input either email or phone!' 
                },
                { type: 'email', message: 'Please enter a valid email!' },
              ]}
            >
              <Input 
                prefix={<MailOutlined className="premium-input-icon" />} 
                placeholder="your@email.com" 
                className="premium-input"
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Item>

            <Text strong style={{ textAlign: 'center', margin: '16px 0' }}>OR</Text>

            <Form.Item
              name="phone"
              label="Phone Number"
              rules={[
                { 
                  required: !email, 
                  message: 'Please input either email or phone!' 
                },
                { pattern: /^[6-9]\d{9}$/, message: 'Please enter a valid Indian phone number!' },
              ]}
            >
              <Input
                prefix={<PhoneOutlined className="premium-input-icon" />}
                addonBefore={<Select defaultValue="+91" className="premium-select">
                  <Option value="+91">+91</Option>
                </Select>}
                className="premium-input"
                placeholder="9433889668"
                onChange={(e) => setPhone(e.target.value)}
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
                Send Reset Code
              </Button>
            </Form.Item>
          </Form>
        )}

        {step === 2 && (
          <Form
            name="verify-otp"
            onFinish={onVerifyOTP}
            layout="vertical"
          >
            <Form.Item
              name="otp"
              label="Verification Code"
              rules={[
                { required: true, message: 'Please input the OTP!' },
                { pattern: /^\d{6}$/, message: 'OTP must be 6 digits!' },
              ]}
            >
              <Input 
                prefix={<KeyOutlined className="premium-input-icon" />} 
                placeholder="Enter 6-digit code" 
                maxLength={6}
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
                Verify OTP
              </Button>
            </Form.Item>
          </Form>
        )}

        {step === 3 && (
          <Form
            name="reset-password"
            onFinish={onResetPassword}
            layout="vertical"
          >
            <Form.Item
              name="new_password"
              label="New Password"
              rules={[
                { required: true, message: 'Please input your new password!' },
                { min: 8, message: 'Password must be at least 8 characters!' },
              ]}
              hasFeedback
            >
              <Input.Password 
                prefix={<LockOutlined className="premium-input-icon" />} 
                placeholder="New password" 
                className="premium-input"
              />
            </Form.Item>

            <Form.Item
              name="confirm_password"
              label="Confirm Password"
              dependencies={['new_password']}
              hasFeedback
              rules={[
                { required: true, message: 'Please confirm your password!' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('new_password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('The two passwords do not match!'));
                  },
                }),
              ]}
            >
              <Input.Password 
                prefix={<LockOutlined className="premium-input-icon" />} 
                placeholder="Confirm new password" 
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
                Reset Password
              </Button>
            </Form.Item>
          </Form>
        )}

        <Divider className="premium-divider" />

        <div className="auth-footer">
          Remember your password? <a href="/login" className="premium-link">Sign in</a>
        </div>
      </Card>
    </div>
  );
};

export default ForgotPassword;