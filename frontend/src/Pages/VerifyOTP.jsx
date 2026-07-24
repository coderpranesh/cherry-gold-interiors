// src/components/Auth/VerifyOTP.jsx
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Form, Input, Button, message, Card, Typography } from 'antd';
import { PhoneOutlined } from '@ant-design/icons';
import AuthAPI from '../api/authAPI';
import { goldenTheme } from '../theme';
import './AuthStyles.css';

const { Title, Text } = Typography;

const VerifyOTP = () => {
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const phone = location.state?.phone || '';

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await AuthAPI.verifyOTP({
        phone: phone,
        otp: values.otp
      });
      
      message.success('Phone number verified successfully!');
      navigate('/login');
    } catch (error) {
      console.error('OTP verification error:', error);
      message.error(error.response?.data?.error || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setResendLoading(true);
    try {
      await AuthAPI.resendOTP(phone);
      message.success('OTP resent successfully!');
    } catch (error) {
      console.error('Resend OTP error:', error);
      message.error('Failed to resend OTP. Please try again.');
    } finally {
      setResendLoading(false);
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
            Verify Phone Number
          </Title>
          <Text type="secondary">Enter the OTP sent to {phone}</Text>
        </div>

        <Form name="verify-otp" onFinish={onFinish} layout="vertical">
          <Form.Item
            name="otp"
            label="OTP"
            rules={[
              { required: true, message: 'Please input the OTP!' },
              { len: 6, message: 'OTP must be 6 digits!' }
            ]}
          >
            <Input
              prefix={<PhoneOutlined style={{ color: 'rgba(0, 0, 0, 0.25)' }} />}
              placeholder="Enter 6-digit OTP"
              maxLength={6}
              size="large"
            />
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
              Verify OTP
            </Button>
          </Form.Item>
        </Form>

        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <Button 
            type="link" 
            loading={resendLoading}
            onClick={handleResendOTP}
            style={{ color: goldenTheme.token.colorPrimary }}
          >
            Didn't receive OTP? Resend
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default VerifyOTP;