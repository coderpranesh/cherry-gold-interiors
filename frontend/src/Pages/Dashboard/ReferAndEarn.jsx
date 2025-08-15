
import React, { useState, useEffect } from 'react';
import { Card, Button, message, Typography, Divider, Steps, Form, Input, Modal, Badge } from 'antd';
import { CopyOutlined, DollarOutlined, FormOutlined, GiftOutlined } from '@ant-design/icons';
import api from '../../api/authAPI';
import './DashboardStyles.css';

const { Title, Text, Paragraph } = Typography;
const { Step } = Steps;
const { TextArea } = Input;

const ReferAndEarn = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [withdrawModalVisible, setWithdrawModalVisible] = useState(false);
  const [referModalVisible, setReferModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await api.get('http://127.0.0.1:8000/api/auth/referral/');
      setUserData(response.data);
    } catch (error) {
      message.error('Failed to fetch user data');
    }
  };

  const copyReferralCode = () => {
    navigator.clipboard.writeText(userData?.referral_code);
    message.success('Referral code copied to clipboard!');
  };

  const handleWithdraw = async (values) => {
    setLoading(true);
    try {
      await api.post('/referrals/request-withdrawal/', values);
      message.success('Withdrawal request submitted successfully!');
      setWithdrawModalVisible(false);
      fetchUserData();
    } catch (error) {
      message.error(error.response?.data?.message || 'Withdrawal request failed');
    } finally {
      setLoading(false);
    }
  };

  const handleReferSubmit = async (values) => {
    setLoading(true);
    try {
      await api.post('/referrals/submit-referral/', values);
      message.success('Referral submitted successfully! We will verify and update your rewards.');
      setReferModalVisible(false);
      fetchUserData();
    } catch (error) {
      message.error(error.response?.data?.message || 'Referral submission failed');
    } finally {
      setLoading(false);
    }
  };

  if (!userData) return <div className="loading-spinner">Loading...</div>;

  return (
    <div className="dashboard-container">
      <Card className="dashboard-card">
        <div className="dashboard-header">
          <Title level={3} className="gold-text">
            <GiftOutlined /> Hello, {userData.name}!
          </Title>
          <Paragraph>
            Welcome to our Refer & Earn program. Invite friends and earn amazing rewards!
          </Paragraph>
        </div>

        <Divider />

        <Card className="referral-card">
          <div className="referral-header">
            <Title level={4} className="gold-text">Your Referral Code</Title>
            <Badge 
              count={`Earn ₹${userData.referral_amount || 500} per referral`} 
              style={{ backgroundColor: '#d4af37' }} 
            />
          </div>
          <div className="referral-code-container">
            <Text strong className="referral-code">
              {userData.referral_code}
            </Text>
            <Button
              type="primary"
              icon={<CopyOutlined />}
              onClick={copyReferralCode}
              className="gold-button"
            >
              Copy Code
            </Button>
          </div>
          <div className="referral-share-buttons">
            <Button className="share-button">Share via WhatsApp</Button>
            <Button className="share-button">Share via Email</Button>
            <Button className="share-button">Share via SMS</Button>
          </div>
        </Card>

        <Divider />

        <div className="how-it-works">
          <Title level={4} className="gold-text">How It Works</Title>
          <Steps direction="vertical" current={-1}>
            <Step
              title="Share Your Code"
              description="Share your unique referral code with friends and family through any platform."
            />
            <Step
              title="Friend Completes Purchase"
              description="Your friend signs up using your code and completes their first purchase."
            />
            <Step
              title="Earn Rewards"
              description="You'll receive your reward after their purchase is successfully completed."
            />
          </Steps>
        </div>

        <Divider />

        <Card className="balance-card">
          <Title level={4} className="gold-text">Your Rewards</Title>
          <div className="balance-info">
            <Text strong>Current Balance:</Text>
            <Text className="balance-amount">₹{userData.balance || 0}</Text>
          </div>
          <div className="balance-info">
            <Text strong>Pending Rewards:</Text>
            <Text>₹{userData.pending_balance || 0}</Text>
          </div>
          <div className="balance-info">
            <Text strong>Minimum Withdrawal:</Text>
            <Text>₹{userData.min_withdrawal || 1000}</Text>
          </div>
          <div className="balance-actions">
            <Button
              type="primary"
              icon={<DollarOutlined />}
              onClick={() => setWithdrawModalVisible(true)}
              disabled={userData.balance < userData.min_withdrawal}
              className="gold-button"
              block
            >
              Request Withdrawal
            </Button>
          </div>
        </Card>

        <Divider />

        <div className="action-buttons">
          <Button
            type="primary"
            icon={<FormOutlined />}
            onClick={() => setReferModalVisible(true)}
            className="gold-button"
            block
          >
            Submit Referral Confirmation
          </Button>
        </div>

        <Paragraph type="secondary" className="processing-time">
          Rewards are processed within 3–5 business days after verification.
        </Paragraph>
      </Card>

      {/* Withdrawal Modal */}
      <Modal
        title="Withdrawal Request"
        visible={withdrawModalVisible}
        onCancel={() => setWithdrawModalVisible(false)}
        footer={null}
        centered
      >
        <Form form={form} onFinish={handleWithdraw} layout="vertical">
          <Form.Item
            name="account_holder_name"
            label="Account Holder Name"
            rules={[{ required: true, message: 'Please enter account holder name' }]}
          >
            <Input placeholder="As per bank records" />
          </Form.Item>
          <Form.Item
            name="account_number"
            label="Account Number"
            rules={[{ required: true, message: 'Please enter account number' }]}
          >
            <Input placeholder="Bank account number" />
          </Form.Item>
          <Form.Item
            name="ifsc_code"
            label="IFSC Code"
            rules={[{ required: true, message: 'Please enter IFSC code' }]}
          >
            <Input placeholder="Bank branch IFSC code" />
          </Form.Item>
          <Form.Item
            name="pan_number"
            label="PAN Number"
            rules={[
              { required: true, message: 'Please enter PAN number' },
              {
                pattern: /[A-Z]{5}[0-9]{4}[A-Z]{1}/,
                message: 'Please enter a valid PAN number',
              },
            ]}
          >
            <Input placeholder="PAN card number" />
          </Form.Item>
          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading} 
              block
              className="gold-button"
            >
              Submit Withdrawal Request
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Referral Submission Modal */}
      <Modal
        title="Referral Confirmation"
        visible={referModalVisible}
        onCancel={() => setReferModalVisible(false)}
        footer={null}
        centered
      >
        <Form form={form} onFinish={handleReferSubmit} layout="vertical">
          <Form.Item
            name="friend_name"
            label="Friend's Name"
            rules={[{ required: true, message: "Please enter friend's name" }]}
          >
            <Input placeholder="Friend's full name" />
          </Form.Item>
          <Form.Item
            name="friend_email"
            label="Friend's Email"
            rules={[
              { required: true, message: "Please enter friend's email" },
              { type: 'email', message: 'Please enter a valid email' }
            ]}
          >
            <Input placeholder="Friend's email address" />
          </Form.Item>
          <Form.Item
            name="friend_phone"
            label="Friend's Phone"
            rules={[
              { required: true, message: "Please enter friend's phone number" },
              {
                pattern: /^[0-9]{10}$/,
                message: 'Please enter a valid 10-digit phone number',
              },
            ]}
          >
            <Input addonBefore="+91" placeholder="Friend's phone number" />
          </Form.Item>
          <Form.Item
            name="transaction_id"
            label="Transaction/Order ID"
            rules={[{ required: true, message: 'Please enter transaction ID' }]}
          >
            <Input placeholder="Order or transaction reference" />
          </Form.Item>
          <Form.Item
            name="additional_info"
            label="Additional Information"
          >
            <TextArea rows={4} placeholder="Any additional details about the referral" />
          </Form.Item>
          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading} 
              block
              className="gold-button"
            >
              Submit Referral
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ReferAndEarn;