import React, { useState, useEffect } from 'react';
import { 
  Card, Button, Table, Tag, Space, message, Statistic, Row, Col, 
  Divider, Typography, Input, Modal, Progress, Badge 
} from 'antd';
import { 
  CopyOutlined, ShareAltOutlined, DollarOutlined, InfoCircleOutlined, 
  GiftOutlined, UserAddOutlined, CheckCircleOutlined 
} from '@ant-design/icons';
import axios from 'axios';
import copy from 'copy-to-clipboard';
import { goldenTheme } from '../Theme';
import './DashboardStyles.css';

const { Title, Text, Paragraph } = Typography;

const ReferralDashboard = () => {
  const [loading, setLoading] = useState(false);
  const [referralData, setReferralData] = useState(null);
  const [withdrawLoading, setWithdrawLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [bankDetails, setBankDetails] = useState({
    account_number: '',
    ifsc_code: '',
    account_holder_name: '',
    pan_number: ''
  });

  useEffect(() => {
    fetchReferralData();
  }, []);

  const fetchReferralData = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/referrals/');
      setReferralData(response.data);
    } catch (error) {
      message.error('Failed to fetch referral data');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = () => {
    if (referralData?.referral_code) {
      copy(referralData.referral_code);
      message.success('Referral code copied to clipboard!');
    }
  };

  const handleShareClick = () => {
    const shareText = `Join us using my referral code: ${referralData?.referral_code} and get special benefits!`;
    if (navigator.share) {
      navigator.share({
        title: 'Referral Program',
        text: shareText,
        url: window.location.href,
      }).catch(console.error);
    } else {
      copy(shareText);
      message.success('Referral message copied to clipboard!');
    }
  };

  const showWithdrawModal = () => {
    setIsModalVisible(true);
  };

  const handleWithdrawOk = async () => {
    if (!bankDetails.account_number || !bankDetails.ifsc_code || !bankDetails.account_holder_name || !bankDetails.pan_number) {
      message.error('Please fill all bank details');
      return;
    }

    setWithdrawLoading(true);
    try {
      await axios.post('/api/referrals/withdraw/', bankDetails);
      message.success('Withdrawal request submitted successfully!');
      setIsModalVisible(false);
      fetchReferralData();
    } catch (error) {
      message.error(error.response?.data?.message || 'Withdrawal request failed');
    } finally {
      setWithdrawLoading(false);
    }
  };

  const handleWithdrawCancel = () => {
    setIsModalVisible(false);
  };

  const columns = [
    {
      title: 'Referred User',
      dataIndex: 'referred_user',
      key: 'referred_user',
      render: (user) => `${user.first_name} ${user.last_name}`,
    },
    {
      title: 'Email',
      dataIndex: 'referred_user',
      key: 'email',
      render: (user) => user.email,
    },
    {
      title: 'Project Value',
      dataIndex: 'project_value',
      key: 'project_value',
      render: (value) => `₹${value.toLocaleString('en-IN')}`,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color = 'default';
        if (status === 'completed') color = 'green';
        else if (status === 'pending') color = 'orange';
        else if (status === 'paid') color = 'blue';
        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Your Reward',
      dataIndex: 'reward_amount',
      key: 'reward_amount',
      render: (amount) => (
        <Text strong style={{ color: goldenTheme.token.colorPrimary }}>
          ₹{amount?.toLocaleString('en-IN') || '0'}
        </Text>
      ),
    },
  ];

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <Title level={2} style={{ color: goldenTheme.token.colorPrimary, marginBottom: 0 }}>
          <GiftOutlined style={{ marginRight: 12 }} />
          Refer & Earn
        </Title>
        <Text type="secondary">
          Invite friends and earn rewards when they complete projects with us!
        </Text>
      </div>

      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={8}>
          <Card hoverable>
            <Statistic
              title="Your Referral Code"
              value={referralData?.referral_code || '------'}
              prefix={<ShareAltOutlined />}
              valueStyle={{ color: goldenTheme.token.colorPrimary }}
            />
            <Space style={{ marginTop: 16 }}>
              <Button
                type="primary"
                icon={<CopyOutlined />}
                onClick={handleCopyCode}
                style={{ 
                  backgroundColor: goldenTheme.token.colorPrimary,
                  borderColor: goldenTheme.token.colorPrimary
                }}
              >
                Copy Code
              </Button>
              <Button
                icon={<ShareAltOutlined />}
                onClick={handleShareClick}
              >
                Share
              </Button>
            </Space>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card hoverable>
            <Statistic
              title="Total Earnings"
              value={referralData?.total_earnings || 0}
              prefix="₹"
              suffix="INR"
              valueStyle={{ color: goldenTheme.token.colorPrimary }}
            />
            <Progress
              percent={Math.min(100, ((referralData?.total_earnings || 0) / 100000) * 100)}
              strokeColor={goldenTheme.token.colorPrimary}
              showInfo={false}
              style={{ marginTop: 16 }}
            />
            <Text type="secondary" style={{ fontSize: 12 }}>
              Next milestone: ₹100,000
            </Text>
          </Card>
        </Col>
        <Col xs={24} sm={24} md={8}>
          <Card hoverable>
            <Statistic
              title="Available for Withdrawal"
              value={referralData?.available_balance || 0}
              prefix="₹"
              suffix="INR"
              valueStyle={{ color: goldenTheme.token.colorPrimary }}
            />
            <Button
              type="primary"
              icon={<DollarOutlined />}
              onClick={showWithdrawModal}
              disabled={!referralData?.available_balance || referralData.available_balance < 500}
              style={{ 
                marginTop: 16,
                backgroundColor: goldenTheme.token.colorPrimary,
                borderColor: goldenTheme.token.colorPrimary
              }}
              block
            >
              Request Withdrawal
            </Button>
            <Text type="secondary" style={{ fontSize: 12, display: 'block', marginTop: 8 }}>
              Minimum withdrawal: ₹500
            </Text>
          </Card>
        </Col>
      </Row>

      <Card
        title="How It Works"
        style={{ marginBottom: 24 }}
        headStyle={{ borderBottom: `1px solid ${goldenTheme.token.colorBorder}` }}
      >
        <Row gutter={16}>
          <Col xs={24} sm={8}>
            <div style={{ textAlign: 'center', padding: 16 }}>
              <div style={{ 
                fontSize: 48, 
                marginBottom: 16,
                color: goldenTheme.token.colorPrimary,
                fontWeight: 600
              }}>
                1
              </div>
              <Title level={4} style={{ color: goldenTheme.token.colorPrimary }}>
                Share Your Code
              </Title>
              <Text>Share your unique referral code with friends and family</Text>
            </div>
          </Col>
          <Col xs={24} sm={8}>
            <div style={{ textAlign: 'center', padding: 16 }}>
              <div style={{ 
                fontSize: 48, 
                marginBottom: 16,
                color: goldenTheme.token.colorPrimary,
                fontWeight: 600
              }}>
                2
              </div>
              <Title level={4} style={{ color: goldenTheme.token.colorPrimary }}>
                They Book & Pay
              </Title>
              <Text>Your friend books a project and makes the payment</Text>
            </div>
          </Col>
          <Col xs={24} sm={8}>
            <div style={{ textAlign: 'center', padding: 16 }}>
              <div style={{ 
                fontSize: 48, 
                marginBottom: 16,
                color: goldenTheme.token.colorPrimary,
                fontWeight: 600
              }}>
                3
              </div>
              <Title level={4} style={{ color: goldenTheme.token.colorPrimary }}>
                You Earn Rewards
              </Title>
              <Text>Receive your reward after project completion</Text>
            </div>
          </Col>
        </Row>
      </Card>

      <Card
        title="Reward Structure"
        style={{ marginBottom: 24 }}
        headStyle={{ borderBottom: `1px solid ${goldenTheme.token.colorBorder}` }}
      >
        <Row gutter={16}>
          <Col xs={24} sm={12} md={8}>
            <Card hoverable>
              <div style={{ textAlign: 'center' }}>
                <Badge.Ribbon text="Premium" color={goldenTheme.token.colorPrimary}>
                  <Title level={3} style={{ color: goldenTheme.token.colorPrimary }}>
                    5%
                  </Title>
                </Badge.Ribbon>
                <Text strong>Projects over ₹200,000</Text>
                <div style={{ marginTop: 8 }}>
                  <Text type="secondary">Earn ₹10,000+ per referral</Text>
                </div>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card hoverable>
              <div style={{ textAlign: 'center' }}>
                <Title level={3} style={{ color: goldenTheme.token.colorPrimary }}>
                  3%
                </Title>
                <Text strong>Projects over ₹100,000</Text>
                <div style={{ marginTop: 8 }}>
                  <Text type="secondary">Earn ₹3,000+ per referral</Text>
                </div>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={24} md={8}>
            <Card hoverable>
              <div style={{ textAlign: 'center' }}>
                <Title level={3} style={{ color: goldenTheme.token.colorPrimary }}>
                  1%
                </Title>
                <Text strong>Projects below ₹100,000</Text>
                <div style={{ marginTop: 8 }}>
                  <Text type="secondary">Earn ₹500+ per referral</Text>
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </Card>

      <Card 
        title="Your Referrals"
        loading={loading}
        headStyle={{ borderBottom: `1px solid ${goldenTheme.token.colorBorder}` }}
      >
        <Table
          columns={columns}
          dataSource={referralData?.referrals || []}
          loading={loading}
          rowKey="id"
          pagination={{ pageSize: 5 }}
        />
      </Card>

      <Modal
        title="Withdrawal Request"
        visible={isModalVisible}
        onOk={handleWithdrawOk}
        onCancel={handleWithdrawCancel}
        confirmLoading={withdrawLoading}
        okText="Submit Request"
        okButtonProps={{
          style: {
            backgroundColor: goldenTheme.token.colorPrimary,
            borderColor: goldenTheme.token.colorPrimary
          }
        }}
      >
        <Form layout="vertical">
          <Form.Item label="Account Number" required>
            <Input
              placeholder="Enter your bank account number"
              value={bankDetails.account_number}
              onChange={(e) => setBankDetails({...bankDetails, account_number: e.target.value})}
              size="large"
            />
          </Form.Item>
          <Form.Item label="Account Holder Name" required>
            <Input
              placeholder="Enter account holder name"
              value={bankDetails.account_holder_name}
              onChange={(e) => setBankDetails({...bankDetails, account_holder_name: e.target.value})}
              size="large"
            />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="IFSC Code" required>
                <Input
                  placeholder="Enter IFSC code"
                  value={bankDetails.ifsc_code}
                  onChange={(e) => setBankDetails({...bankDetails, ifsc_code: e.target.value})}
                  size="large"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="PAN Number" required>
                <Input
                  placeholder="Enter PAN number"
                  value={bankDetails.pan_number}
                  onChange={(e) => setBankDetails({...bankDetails, pan_number: e.target.value})}
                  size="large"
                />
              </Form.Item>
            </Col>
          </Row>
          <div style={{ background: '#fffbe6', padding: 12, borderRadius: 4 }}>
            <Text type="secondary">
              <InfoCircleOutlined style={{ marginRight: 8 }} />
              Withdrawals are processed within 3-5 business days after verification
            </Text>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default ReferralDashboard;