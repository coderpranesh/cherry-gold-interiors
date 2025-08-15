import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Form, Input, Button, message, Card, Typography, Divider } from 'antd';
import { KeyOutlined } from '@ant-design/icons';
import axios from 'axios';
import './AuthStyles.css';

const { Title, Text } = Typography;

const VerifyOTP = () => {
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const location = useLocation();
  const navigate = useNavigate();
  const { phone } = location.state || {};

  useEffect(() => {
    if (!phone) {
      navigate('/register');
      return;
    }

    const timer = countdown > 0 && setInterval(() => {
      setCountdown(countdown - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown, phone, navigate]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8000/api/accounts/verify-otp/', {
        phone,
        otp: values.otp
      });
      message.success('Verification successful! You can now login.');
      navigate('/login');
    } catch (error) {
      if (error.response) {
        message.error(error.response.data.message || 'Verification failed');
      } else {
        message.error('Network error. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const resendOTP = async () => {
    setResendLoading(true);
    try {
      await axios.post('http://localhost:8000/api/accounts/resend-otp/', { phone });
      message.success('OTP resent successfully!');
      setCountdown(60);
    } catch (error) {
      if (error.response) {
        message.error(error.response.data.message || 'Failed to resend OTP');
      } else {
        message.error('Network error. Please try again.');
      }
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="auth-container light-premium-theme">
      <Card className="auth-card" hoverable>
        <div className="auth-header">
          <Title level={3} className="premium-title">Verify OTP</Title>
          <Text type="secondary" className="premium-subtext">
            Enter the 6-digit code sent to +91 {phone}
          </Text>
        </div>
        
        <Divider className="premium-divider" />
        
        <Form
          name="verify-otp"
          onFinish={onFinish}
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
              Verify & Continue
            </Button>
          </Form.Item>
        </Form>

        <Divider className="premium-divider">or</Divider>

        <div className="auth-footer">
          {countdown > 0 ? (
            <Text type="secondary">Resend code in {countdown} seconds</Text>
          ) : (
            <Button 
              type="link" 
              onClick={resendOTP} 
              loading={resendLoading}
              className="premium-link"
            >
              Resend OTP
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};

export default VerifyOTP;