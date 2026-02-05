import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { 
  Form, Input, Button, message, Card, Typography, Row, Col, 
  Alert, Divider, Modal, Spin, Tag, Checkbox, Steps, Result 
} from 'antd';
import { 
  UserOutlined, MailOutlined, PhoneOutlined, LockOutlined, 
  GiftOutlined, TeamOutlined, CheckOutlined, CloseOutlined,
  SafetyCertificateOutlined, VerifiedOutlined
} from '@ant-design/icons';
import AuthAPI from '../api/AuthAPI';
import { goldenTheme } from '../Theme';
import './AuthStyles.css';

const { Title, Text, Paragraph } = Typography;
const { Step } = Steps;

const Register = () => {
  const [loading, setLoading] = useState(false);
  const [referralValid, setReferralValid] = useState(null);
  const [referralValidating, setReferralValidating] = useState(false);
  const [referrerInfo, setReferrerInfo] = useState(null);
  const [showReferralInfo, setShowReferralInfo] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [currentStep, setCurrentStep] = useState(0); // 0: Registration, 1: Verification
  const [registrationData, setRegistrationData] = useState(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  // Check for referral code in URL parameters
  useEffect(() => {
    const refCode = searchParams.get('ref');
    if (refCode) {
      form.setFieldValue('referral_code_input', refCode);
      validateReferralCode(refCode);
    }
  }, [searchParams]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      console.log('Sending registration data:', values);
      
      const response = await AuthAPI.register(values);
      
      console.log('Registration response:', response);
      
      // Store registration data for verification step
      setRegistrationData({
        email: values.email,
        username: values.username
      });
      
      if (response.verification_required) {
        message.success('Registration successful! Please check your email for verification code.');
        setCurrentStep(1);
      } else {
        // Admin-created or auto-verified users
        message.success('Registration successful! You can now login.');
        navigate('/login');
      }
    } catch (error) {
      console.error('Registration error:', error);
      handleRegistrationError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegistrationError = (error) => {
    console.log('Full error object:', error);
    console.log('Error response:', error.response);
    
    if (error.response?.data) {
      const errorData = error.response.data;
      
      // Handle non-field errors
      if (errorData.non_field_errors) {
        message.error(
          Array.isArray(errorData.non_field_errors) 
            ? errorData.non_field_errors[0] 
            : errorData.non_field_errors
        );
        return;
      }
      
      // Handle error object
      if (errorData.error) {
        message.error(errorData.error);
        return;
      }
      
      // Handle specific error messages
      if (errorData.referral_code_input) {
        message.error(
          Array.isArray(errorData.referral_code_input) 
            ? errorData.referral_code_input[0] 
            : errorData.referral_code_input
        );
        return;
      }
      
      // Handle field-specific errors
      const fieldErrors = {};
      Object.keys(errorData).forEach(key => {
        if (Array.isArray(errorData[key])) {
          fieldErrors[key] = errorData[key][0];
        } else {
          fieldErrors[key] = errorData[key];
        }
      });
      
      // Set form field errors
      form.setFields(
        Object.keys(fieldErrors).map(fieldName => ({
          name: fieldName,
          errors: [fieldErrors[fieldName]]
        }))
      );
      
      // Show first error as message
      const firstError = Object.values(fieldErrors)[0];
      if (firstError) {
        message.error(firstError);
      }
    } else if (error.message) {
      message.error(error.message);
    } else {
      message.error('Registration failed. Please check your connection and try again.');
    }
  };

  const handleVerifyOTP = async (otp) => {
    try {
      setLoading(true);
      const response = await AuthAPI.verifyEmailOTP({
        email: registrationData.email,
        otp: otp
      });
      
      message.success(response.message || 'Email verified successfully!');
      
      // Auto-login after verification if tokens are returned
      if (response.access && response.refresh) {
        // Store tokens
        localStorage.setItem('access_token', response.access);
        localStorage.setItem('refresh_token', response.refresh);
        
        // Navigate to dashboard
        navigate('/dashboard');
      } else {
        // Navigate to login
        navigate('/login', { 
          state: { 
            message: 'Email verified successfully! You can now login.' 
          } 
        });
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      if (error.response?.data) {
        const errorData = error.response.data;
        if (errorData.error) {
          message.error(errorData.error);
        } else if (errorData.otp) {
          message.error(
            Array.isArray(errorData.otp) 
              ? errorData.otp[0] 
              : errorData.otp
          );
        } else {
          message.error('OTP verification failed');
        }
      } else {
        message.error('OTP verification failed. Please try again.');
      }
      return Promise.reject(error);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      setLoading(true);
      await AuthAPI.resendEmailOTP({ email: registrationData.email });
      message.success('New verification code has been sent to your email.');
    } catch (error) {
      console.error('Resend OTP error:', error);
      if (error.response?.data?.email) {
        message.error(error.response.data.email);
      } else {
        message.error('Failed to resend verification code. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const validatePhone = (_, value) => {
    if (!value) {
      return Promise.reject(new Error('Please input your phone number!'));
    }
    if (!/^[6-9]\d{9}$/.test(value)) {
      return Promise.reject(new Error('Please enter a valid 10-digit Indian phone number starting with 6-9!'));
    }
    return Promise.resolve();
  };

  const validateEmail = (_, value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value) {
      return Promise.reject(new Error('Please input your email address!'));
    }
    if (!emailRegex.test(value)) {
      return Promise.reject(new Error('Please enter a valid email address!'));
    }
    return Promise.resolve();
  };

  const validateReferralCode = async (value) => {
    if (!value) {
      setReferralValid(null);
      setReferrerInfo(null);
      return Promise.resolve();
    }
    
    // Basic format validation first
    if (!/^[A-Z0-9]{8,10}$/.test(value)) {
      setReferralValid(false);
      setReferrerInfo(null);
      return Promise.reject(new Error('Invalid referral code format!'));
    }
    
    // Validate with server
    setReferralValidating(true);
    try {
      const response = await AuthAPI.validateReferral(value);
      if (response.valid) {
        setReferralValid(true);
        setReferrerInfo({
          name: response.referrer_name,
          code: value
        });
        return Promise.resolve();
      } else {
        setReferralValid(false);
        setReferrerInfo(null);
        return Promise.reject(new Error(response.message || 'Invalid referral code'));
      }
    } catch (error) {
      console.error('Referral validation error:', error);
      setReferralValid(false);
      setReferrerInfo(null);
      return Promise.reject(new Error('Failed to validate referral code'));
    } finally {
      setReferralValidating(false);
    }
  };

  const referralValidator = async (_, value) => {
    return validateReferralCode(value);
  };

  const onValuesChange = (changedValues) => {
    // Reset referral validation when referral code changes
    if (changedValues.referral_code_input !== undefined) {
      setReferralValid(null);
      setReferrerInfo(null);
    }
  };

  const copyReferralLink = () => {
    const referralCode = form.getFieldValue('referral_code_input');
    if (referralCode) {
      const referralLink = `${window.location.origin}/register?ref=${referralCode}`;
      navigator.clipboard.writeText(referralLink);
      message.success('Referral link copied to clipboard!');
    }
  };

  const showReferralBenefitsModal = () => {
    setShowReferralInfo(true);
  };

  const handleBackToRegistration = () => {
    setCurrentStep(0);
    setRegistrationData(null);
  };

  // Verification Step Component
  const VerificationStep = () => (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <Result
        icon={<VerifiedOutlined style={{ color: goldenTheme.token.colorPrimary }} />}
        title="Verify Your Email Address"
        subTitle={`We've sent a 6-digit verification code to ${registrationData?.email}`}
        extra={[
          <div key="verification-form" style={{ maxWidth: 400, margin: '0 auto' }}>
            <Form
              name="verify-email"
              onFinish={async (values) => {
                await handleVerifyOTP(values.otp);
              }}
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
                  style={{ justifyContent: 'center' }}
                />
              </Form.Item>
              
              <Form.Item style={{ marginTop: 24 }}>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  loading={loading}
                  size="large"
                  style={{ 
                    backgroundColor: goldenTheme.token.colorPrimary,
                    borderColor: goldenTheme.token.colorPrimary,
                    width: '100%',
                    maxWidth: 200
                  }}
                >
                  Verify Email
                </Button>
              </Form.Item>
            </Form>
            
            <div style={{ marginTop: 16 }}>
              <Text type="secondary">Didn't receive the code? </Text>
              <Button 
                type="link" 
                onClick={handleResendOTP}
                disabled={loading}
                style={{ padding: 0 }}
              >
                Resend Code
              </Button>
            </div>
            
            <Divider />
            
            <Button 
              onClick={handleBackToRegistration}
              type="link"
              style={{ marginTop: 8 }}
            >
              ← Back to registration
            </Button>
          </div>
        ]}
      />
    </div>
  );

  // Registration Step Component
  const RegistrationStep = () => (
    <>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <Title level={3} style={{ color: goldenTheme.token.colorPrimary, marginBottom: 8 }}>
          Create New Account
        </Title>
        <Text type="secondary">Join Cherry Gold Interiors and start your design journey</Text>
      </div>

      <Row gutter={[24, 0]}>
        <Col xs={24} lg={14}>
          <Form
            form={form}
            name="register"
            onFinish={onFinish}
            onValuesChange={onValuesChange}
            layout="vertical"
            scrollToFirstError
            initialValues={{
              username: '',
              email: '',
              first_name: '',
              last_name: '',
              phone: '',
              password: '',
              confirm_password: '',
              referral_code_input: searchParams.get('ref') || '',
              terms_accepted: false
            }}
          >
            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="username"
                  label="Username"
                  rules={[
                    { required: true, message: 'Please input your username!' },
                    { min: 4, message: 'Username must be at least 4 characters!' },
                    { max: 150, message: 'Username cannot exceed 150 characters!' },
                    { 
                      pattern: /^[a-zA-Z0-9_]+$/, 
                      message: 'Username can only contain letters, numbers, and underscores!' 
                    }
                  ]}
                >
                  <Input 
                    prefix={<UserOutlined style={{ color: 'rgba(0,0,0,0.25)' }} />} 
                    placeholder="Username" 
                    size="large"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="email"
                  label="Email Address"
                  rules={[
                    { required: true, message: 'Please input your email!' },
                    { validator: validateEmail },
                  ]}
                >
                  <Input 
                    prefix={<MailOutlined style={{ color: 'rgba(0,0,0,0.25)' }} />} 
                    placeholder="Email" 
                    size="large"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="first_name"
                  label="First Name"
                  rules={[
                    { required: true, message: 'Please input your first name!' },
                    { max: 30, message: 'First name cannot exceed 30 characters!' }
                  ]}
                >
                  <Input placeholder="First Name" size="large" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="last_name"
                  label="Last Name"
                  rules={[
                    { required: true, message: 'Please input your last name!' },
                    { max: 150, message: 'Last name cannot exceed 150 characters!' }
                  ]}
                >
                  <Input placeholder="Last Name" size="large" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="phone"
              label="Phone Number"
              rules={[
                { required: true, message: 'Please input your phone number!' },
                { validator: validatePhone },
              ]}
            >
              <Input
                prefix={<PhoneOutlined style={{ color: 'rgba(0,0,0,0.25)' }} />}
                placeholder="10-digit phone number starting with 6-9"
                maxLength={10}
                size="large"
              />
            </Form.Item>

            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="password"
                  label="Password"
                  rules={[
                    { required: true, message: 'Please input your password!' },
                    { min: 8, message: 'Password must be at least 8 characters!' },
                    { 
                      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                      message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number!'
                    }
                  ]}
                  hasFeedback
                >
                  <Input.Password 
                    prefix={<LockOutlined style={{ color: 'rgba(0,0,0,0.25)' }} />} 
                    placeholder="Password" 
                    size="large"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="confirm_password"
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
                    prefix={<LockOutlined style={{ color: 'rgba(0,0,0,0.25)' }} />} 
                    placeholder="Confirm Password" 
                    size="large"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Divider>
              <Text type="secondary" style={{ fontSize: '14px' }}>
                <GiftOutlined /> Referral Program (Optional)
              </Text>
            </Divider>

            <Form.Item
              name="referral_code_input"
              label="Friend's Referral Code"
              rules={[
                { validator: referralValidator }
              ]}
              validateStatus={referralValidating ? 'validating' : referralValid ? 'success' : referralValid === false ? 'error' : ''}
              help={
                referralValidating ? 
                  <Spin size="small" /> : 
                referralValid === false ? 
                  'Invalid referral code' : 
                referralValid ? 
                  `Referral code valid! You were referred by ${referrerInfo?.name}` : 
                  'Enter your friend\'s referral code to help them earn rewards'
              }
              extra={
                <Button 
                  type="link" 
                  size="small" 
                  onClick={showReferralBenefitsModal}
                  style={{ padding: 0, height: 'auto' }}
                >
                  How does the referral program work?
                </Button>
              }
            >
              <Input
                prefix={<GiftOutlined style={{ color: 'rgba(0,0,0,0.25)' }} />}
                placeholder="Enter your friend's referral code"
                size="large"
                disabled={referralValidating}
                suffix={
                  referralValidating ? 
                    <Spin size="small" /> : 
                  referralValid ? 
                    <CheckOutlined style={{ color: '#52c41a' }} /> : 
                  referralValid === false ? 
                    <CloseOutlined style={{ color: '#ff4d4f' }} /> : 
                    null
                }
              />
            </Form.Item>

            {referralValid && (
              <div style={{ 
                background: '#f6ffed', 
                border: '1px solid #b7eb8f', 
                borderRadius: '6px', 
                padding: '12px', 
                marginBottom: '16px' 
              }}>
                <Text style={{ color: '#389e0d' }}>
                  <TeamOutlined /> You're joining through {referrerInfo?.name}'s referral. 
                  Both of you will earn rewards when your project is completed!
                </Text>
              </div>
            )}

            <Form.Item
              name="terms_accepted"
              valuePropName="checked"
              rules={[
                {
                  validator: (_, value) =>
                    value ? Promise.resolve() : Promise.reject(new Error('You must accept the Terms & Conditions')),
                },
              ]}
            >
              <Checkbox>
                I agree to the{' '}
                <Button type="link" onClick={() => setShowTermsModal(true)} style={{ padding: 0, height: 'auto' }}>
                  Terms & Conditions
                </Button>
              </Checkbox>
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
                  fontWeight: 500,
                  height: '48px',
                  borderRadius: '8px'
                }}
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </Form.Item>
          </Form>

          <div className="auth-footer" style={{ textAlign: 'center', marginTop: 16 }}>
            Already have an account?{' '}
            <Link 
              to="/login" 
              style={{ 
                color: goldenTheme.token.colorPrimary,
                fontWeight: 500
              }}
            >
              Login now
            </Link>
          </div>
        </Col>

        <Col xs={24} lg={10}>
          <BenefitsSidebar 
            referralValid={referralValid}
            copyReferralLink={copyReferralLink}
            referrerInfo={referrerInfo}
          />
        </Col>
      </Row>
    </>
  );

  return (
    <div className="auth-container" style={{ 
      background: 'linear-gradient(135deg, #f9f9f9 0%, #f0f0f0 100%)',
      minHeight: '100vh',
      padding: '20px 0'
    }}>
      <Card 
        className="auth-card"
        style={{ 
          maxWidth: 800,
          margin: '0 auto',
          border: '1px solid rgba(212, 175, 55, 0.3)',
          boxShadow: '0 8px 24px rgba(212, 175, 55, 0.1)',
          borderRadius: '12px',
          overflow: 'hidden'
        }}
      >
        <Steps 
          current={currentStep} 
          style={{ 
            padding: '20px 24px 0',
            backgroundColor: '#fafafa',
            borderBottom: '1px solid #f0f0f0'
          }}
          size="small"
        >
          <Step title="Registration" />
          <Step title="Email Verification" />
        </Steps>
        
        <div style={{ padding: '24px' }}>
          {currentStep === 0 ? <RegistrationStep /> : <VerificationStep />}
        </div>
      </Card>

      {/* Referral Program Info Modal */}
      <ReferralInfoModal 
        showReferralInfo={showReferralInfo}
        setShowReferralInfo={setShowReferralInfo}
      />

      {/* Terms & Conditions Modal */}
      <TermsModal 
        showTermsModal={showTermsModal}
        setShowTermsModal={setShowTermsModal}
      />
    </div>
  );
};

// Benefits Sidebar Component
const BenefitsSidebar = ({ referralValid, copyReferralLink, referrerInfo }) => (
  <div style={{ 
    background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.1) 0%, rgba(212, 175, 55, 0.05) 100%)', 
    padding: '24px', 
    borderRadius: '8px',
    height: '100%'
  }}>
    <Title level={4} style={{ color: goldenTheme.token.colorPrimary, marginBottom: 16 }}>
      <TeamOutlined /> Referral Program Benefits
    </Title>
    
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: 12 }}>
        <div style={{ 
          backgroundColor: goldenTheme.token.colorPrimary, 
          borderRadius: '50%', 
          width: 24, 
          height: 24, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          marginRight: 12,
          flexShrink: 0
        }}>
          <Text strong style={{ color: 'white', fontSize: 14 }}>1</Text>
        </div>
        <div>
          <Text strong>Earn Cash Rewards</Text>
          <Paragraph type="secondary" style={{ margin: 0 }}>
            Get up to 5% of your friend's project value as cash reward
          </Paragraph>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: 12 }}>
        <div style={{ 
          backgroundColor: goldenTheme.token.colorPrimary, 
          borderRadius: '50%', 
          width: 24, 
          height: 24, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          marginRight: 12,
          flexShrink: 0
        }}>
          <Text strong style={{ color: 'white', fontSize: 14 }}>2</Text>
        </div>
        <div>
          <Text strong>Exclusive Discounts</Text>
          <Paragraph type="secondary" style={{ margin: 0 }}>
            Both you and your friend get special discounts on your projects
          </Paragraph>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: 12 }}>
        <div style={{ 
          backgroundColor: goldenTheme.token.colorPrimary, 
          borderRadius: '50%', 
          width: 24, 
          height: 24, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          marginRight: 12,
          flexShrink: 0
        }}>
          <Text strong style={{ color: 'white', fontSize: 14 }}>3</Text>
        </div>
        <div>
          <Text strong>Priority Support</Text>
          <Paragraph type="secondary" style={{ margin: 0 }}>
            Referred customers get priority customer support
          </Paragraph>
        </div>
      </div>
    </div>

    <Divider style={{ margin: '16px 0' }} />

    <Title level={5} style={{ marginBottom: 12 }}>Reward Structure</Title>
    
    <div style={{ marginBottom: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <Text>Projects above ₹2,00,000</Text>
        <Tag color="gold">5% Reward</Tag>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <Text>Projects above ₹1,00,000</Text>
        <Tag color="blue">3% Reward</Tag>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Text>Other projects</Text>
        <Tag color="green">1% Reward</Tag>
      </div>
    </div>

    <Divider style={{ margin: '16px 0' }} />

    <Title level={5} style={{ marginBottom: 12 }}>Have a referral code?</Title>
    <Paragraph type="secondary" style={{ marginBottom: 16 }}>
      Enter your friend's referral code during registration to help them earn rewards and get exclusive benefits for yourself too!
    </Paragraph>

    {referralValid && (
      <Button 
        icon={<GiftOutlined />} 
        onClick={copyReferralLink}
        block
        style={{ 
          backgroundColor: '#f6ffed',
          borderColor: '#b7eb8f',
          color: '#389e0d',
          marginBottom: 8
        }}
      >
        Copy Referral Link
      </Button>
    )}

    <Alert
      message="Email Verification Required"
      description="After registration, you'll receive a verification code via email to activate your account."
      type="info"
      showIcon
      style={{ marginTop: 16 }}
    />
  </div>
);

// Referral Info Modal Component
const ReferralInfoModal = ({ showReferralInfo, setShowReferralInfo }) => (
  <Modal
    title="Referral Program Details"
    open={showReferralInfo}
    onCancel={() => setShowReferralInfo(false)}
    footer={[
      <Button key="close" onClick={() => setShowReferralInfo(false)}>
        Close
      </Button>
    ]}
    width={600}
  >
    <div style={{ marginBottom: 16 }}>
      <Title level={5}>How it works:</Title>
      <ol>
        <li>Enter your friend's referral code during registration</li>
        <li>Complete your interior design project with Cherry Gold</li>
        <li>Your friend receives a cash reward based on your project value</li>
        <li>You receive exclusive discounts on your project</li>
      </ol>
    </div>

    <div style={{ marginBottom: 16 }}>
      <Title level={5}>Terms & Conditions:</Title>
      <ul>
        <li>Minimum project value: ₹1,00,000</li>
        <li>Reward paid after project completion</li>
        <li>Self-referrals are not allowed</li>
        <li>Reward subject to verification</li>
        <li>Referral code must be entered during registration</li>
      </ul>
    </div>

    <Alert
      message="Note"
      description="The referral code must be entered during registration and cannot be added later."
      type="info"
      showIcon
    />
  </Modal>
);

// Terms & Conditions Modal Component
const TermsModal = ({ showTermsModal, setShowTermsModal }) => (
  <Modal
    title="Terms & Conditions"
    open={showTermsModal}
    onCancel={() => setShowTermsModal(false)}
    footer={[
      <Button key="close" onClick={() => setShowTermsModal(false)}>
        Close
      </Button>
    ]}
    width={700}
    style={{ top: 20 }}
  >
    <div style={{ maxHeight: '60vh', overflow: 'auto', paddingRight: 8 }}>
      <div style={{ marginBottom: 16 }}>
        <Title level={5}>1. Account Registration</Title>
        <Paragraph>
          By creating an account, you agree to provide accurate and complete information. 
          You are responsible for maintaining the confidentiality of your account credentials.
        </Paragraph>
      </div>

      <div style={{ marginBottom: 16 }}>
        <Title level={5}>2. Email Verification</Title>
        <Paragraph>
          You must verify your email address to activate your account. 
          Verification codes are valid for 10 minutes only.
        </Paragraph>
      </div>

      <div style={{ marginBottom: 16 }}>
        <Title level={5}>3. Referral Program</Title>
        <Paragraph>
          Referral rewards are subject to project completion and verification. 
          Rewards are paid out only after the referred customer's project is fully completed and paid for.
        </Paragraph>
      </div>

      <div style={{ marginBottom: 16 }}>
        <Title level={5}>4. Privacy</Title>
        <Paragraph>
          We collect and process your personal data in accordance with our Privacy Policy. 
          By registering, you consent to our data practices.
        </Paragraph>
      </div>

      <div style={{ marginBottom: 16 }}>
        <Title level={5}>5. Service Usage</Title>
        <Paragraph>
          You agree to use our services only for lawful purposes and in accordance with these terms.
        </Paragraph>
      </div>

      <Alert
        message="Important"
        description="By accepting these terms, you acknowledge that you have read, understood, and agree to be bound by all the terms and conditions."
        type="warning"
        showIcon
      />
    </div>
  </Modal>
);

export default Register;