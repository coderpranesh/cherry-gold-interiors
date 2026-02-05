import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  Form, Input, Button, message, Card, Typography, Row, Col, 
  Alert, Result, Spin 
} from 'antd';
import { 
  MailOutlined, SafetyCertificateOutlined, VerifiedOutlined,
  ArrowLeftOutlined, ReloadOutlined 
} from '@ant-design/icons';
import AuthAPI from '../api/AuthAPI';
import { goldenTheme } from '../Theme';

const { Title, Text } = Typography;

const VerifyEmail = () => {
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [timer, setTimer] = useState(0);
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const [form] = Form.useForm();

  useEffect(() => {
    // Check if email is passed from registration
    if (location.state?.email) {
      setEmail(location.state.email);
    } else {
      // Try to get email from localStorage (for resend scenario)
      const savedEmail = localStorage.getItem('pending_verification_email');
      if (savedEmail) {
        setEmail(savedEmail);
      } else {
        // No email found, redirect to register
        message.warning('No email found for verification. Please register first.');
        navigate('/register');
      }
    }

    // Start resend timer (60 seconds)
    setTimer(60);
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [location, navigate]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await AuthAPI.verifyEmailOTP({
        email: email,
        otp: values.otp
      });
      
      message.success(response.message || 'Email verified successfully!');
      
      // Clear pending verification email
      localStorage.removeItem('pending_verification_email');
      
      // Navigate based on response
      if (response.access && response.refresh) {
        // Auto-login after verification
        navigate('/dashboard');
      } else {
        // Go to login page
        navigate('/login', {
          state: {
            message: 'Email verified successfully! You can now login.'
          }
        });
      }
    } catch (error) {
      console.error('Verification error:', error);
      
      if (error.response?.data) {
        const errorData = error.response.data;
        
        if (errorData.otp) {
          message.error(
            Array.isArray(errorData.otp) 
              ? errorData.otp[0] 
              : errorData.otp
          );
        } else if (errorData.error) {
          message.error(errorData.error);
        } else {
          message.error('Verification failed. Please try again.');
        }
      } else {
        message.error('Verification failed. Please check your connection.');
      }
      
      // Clear OTP input on error
      form.setFieldValue('otp', '');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (timer > 0) {
      message.warning(`Please wait ${timer} seconds before requesting a new code.`);
      return;
    }
    
    setResending(true);
    try {
      await AuthAPI.resendEmailOTP({ email: email });
      message.success('New verification code has been sent to your email.');
      
      // Reset timer
      setTimer(60);
      const interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      console.error('Resend error:', error);
      
      if (error.response?.data) {
        const errorData = error.response.data;
        
        if (errorData.email) {
          message.error(
            Array.isArray(errorData.email) 
              ? errorData.email[0] 
              : errorData.email
          );
        } else if (errorData.error) {
          message.error(errorData.error);
        } else {
          message.error('Failed to resend verification code.');
        }
      } else {
        message.error('Failed to resend verification code. Please try again.');
      }
    } finally {
      setResending(false);
    }
  };

  const handleBackToRegister = () => {
    navigate('/register');
  };

  const maskEmail = (email) => {
    if (!email) return '';
    const [username, domain] = email.split('@');
    const maskedUsername = username.length > 2 
      ? username.substring(0, 2) + '*'.repeat(username.length - 2)
      : '*'.repeat(username.length);
    return `${maskedUsername}@${domain}`;
  };

  return (
    <div style={{ 
      background: 'linear-gradient(135deg, #f9f9f9 0%, #f0f0f0 100%)',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <Card 
        style={{ 
          maxWidth: 500,
          width: '100%',
          border: '1px solid rgba(212, 175, 55, 0.3)',
          boxShadow: '0 8px 24px rgba(212, 175, 55, 0.1)',
          borderRadius: '12px'
        }}
      >
        <Result
          icon={<VerifiedOutlined style={{ color: goldenTheme.token.colorPrimary }} />}
          title="Verify Your Email"
          subTitle={
            <div style={{ marginTop: 8 }}>
              <Text type="secondary">
                We've sent a 6-digit verification code to{' '}
                <Text strong>{maskEmail(email)}</Text>
              </Text>
              <br />
              <Text type="secondary" style={{ fontSize: '12px' }}>
                Check your inbox (and spam folder) for the email.
              </Text>
            </div>
          }
        />

        <div style={{ marginTop: 24 }}>
          <Form
            form={form}
            name="verify-email"
            onFinish={onFinish}
            layout="vertical"
          >
            <Form.Item
              name="otp"
              rules={[
                { required: true, message: 'Please enter the verification code!' },
                { len: 6, message: 'Verification code must be 6 digits!' },
                { pattern: /^\d+$/, message: 'Verification code must contain only numbers!' }
              ]}
            >
              <Input.OTP 
                length={6} 
                size="large"
                style={{ 
                  justifyContent: 'center',
                  gap: '8px'
                }}
                inputStyle={{
                  width: '44px',
                  height: '44px',
                  fontSize: '18px',
                  textAlign: 'center'
                }}
              />
            </Form.Item>
            
            <Form.Item style={{ marginTop: 32 }}>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={loading}
                block
                size="large"
                style={{ 
                  backgroundColor: goldenTheme.token.colorPrimary,
                  borderColor: goldenTheme.token.colorPrimary,
                  fontWeight: 500,
                  height: '48px',
                  borderRadius: '8px'
                }}
              >
                {loading ? 'Verifying...' : 'Verify Email'}
              </Button>
            </Form.Item>
          </Form>

          <div style={{ textAlign: 'center', marginTop: 24 }}>
            <Text type="secondary">Didn't receive the code? </Text>
            <Button 
              type="link" 
              onClick={handleResendOTP}
              disabled={resending || timer > 0}
              loading={resending}
              icon={timer > 0 ? null : <ReloadOutlined />}
              style={{ padding: 0, marginLeft: 4 }}
            >
              {resending ? 'Sending...' : timer > 0 ? `Resend (${timer}s)` : 'Resend Code'}
            </Button>
          </div>

          <Divider style={{ margin: '24px 0' }} />

          <div style={{ textAlign: 'center' }}>
            <Button 
              onClick={handleBackToRegister}
              type="link"
              icon={<ArrowLeftOutlined />}
              style={{ marginRight: 16 }}
            >
              Back to Registration
            </Button>
            
            <Link to="/login">
              <Button type="link">
                Already verified? Login
              </Button>
            </Link>
          </div>
        </div>

        <Alert
          message="Important"
          description="The verification code expires in 10 minutes. If you don't verify within this time, you'll need to request a new code."
          type="info"
          showIcon
          style={{ marginTop: 24 }}
        />
      </Card>
    </div>
  );
};

export default VerifyEmail;