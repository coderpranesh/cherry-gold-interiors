import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Input, Button, message, Card, Typography, Select, Row, Col, Divider } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined, LockOutlined } from '@ant-design/icons';
import axios from 'axios';
import { goldenTheme } from '../Theme'; // Use correct casing to match 'Theme.js'
import './AuthStyles.css';

const { Title, Text } = Typography;
const { Option } = Select;

const Register = () => {
  const [loading, setLoading] = useState(false);
  const [referralCode, setReferralCode] = useState('');
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const payload = {
        ...values,
        referral_code: referralCode,
      };
      const response = await axios.post('http://localhost:8000/api/auth/register/', payload);
      message.success('Registration successful! Please verify your email and phone.');
      navigate('/login');
    } catch (error) {
      message.error(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const validatePhone = (_, value) => {
    if (!value || /^[6-9]\d{9}$/.test(value)) {
      return Promise.resolve();
    }
    return Promise.reject(new Error('Please enter a valid Indian phone number!'));
  };

  return (
    <div className="auth-container" style={{ background: 'linear-gradient(135deg, #f9f9f9 0%, #f0f0f0 100%)' }}>
      <Card 
        className="auth-card"
        style={{ 
          maxWidth: 640,
          border: '1px solid rgba(212, 175, 55, 0.3)',
          boxShadow: '0 8px 24px rgba(212, 175, 55, 0.1)'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Title level={3} style={{ color: goldenTheme.token.colorPrimary }}>
            Create New Account
          </Title>
          <Text type="secondary">Join us to start your journey</Text>
        </div>

        <Form
          name="register"
          onFinish={onFinish}
          layout="vertical"
          scrollToFirstError
        >
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="username"
                label="Username"
                rules={[
                  { required: true, message: 'Please input your username!' },
                  { min: 4, message: 'Username must be at least 4 characters!' }
                ]}
              >
                <Input 
                  prefix={<UserOutlined style={{ color: 'rgba(0, 0, 0, 0.25)' }} />} 
                  placeholder="Username" 
                  size="large"
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: 'Please input your email!' },
                  { type: 'email', message: 'Please enter a valid email!' },
                ]}
              >
                <Input 
                  prefix={<MailOutlined style={{ color: 'rgba(0, 0, 0, 0.25)' }} />} 
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
                rules={[{ required: true, message: 'Please input your first name!' }]}
              >
                <Input placeholder="First Name" size="large" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="last_name"
                label="Last Name"
                rules={[{ required: true, message: 'Please input your last name!' }]}
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
              addonBefore={<Select defaultValue="+91" style={{ width: 70 }} disabled>
                <Option value="+91">+91</Option>
              </Select>}
              placeholder="Phone Number"
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
                ]}
                hasFeedback
              >
                <Input.Password 
                  prefix={<LockOutlined style={{ color: 'rgba(0, 0, 0, 0.25)' }} />} 
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
                  prefix={<LockOutlined style={{ color: 'rgba(0, 0, 0, 0.25)' }} />} 
                  placeholder="Confirm Password" 
                  size="large"
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="referral_code"
            label="Referral Code (Optional)"
          >
            <Input
              placeholder="Enter referral code if any"
              onChange={(e) => setReferralCode(e.target.value)}
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
              Register
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
      </Card>
    </div>
  );
};

export default Register;