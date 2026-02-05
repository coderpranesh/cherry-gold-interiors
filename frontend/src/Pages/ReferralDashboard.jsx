import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, Button, Table, Tag, Space, message, Row, Col, 
  Divider, Typography, Input, Modal, Form
} from 'antd';
import { 
  CopyOutlined, ShareAltOutlined, GiftOutlined, 
  TeamOutlined, BankOutlined, TrophyOutlined, InfoCircleOutlined
} from '@ant-design/icons';
import axios from 'axios';
import AuthAPI from '../api/AuthAPI';
import copy from 'copy-to-clipboard';

const { Title, Text, Paragraph } = Typography;

const ReferralDashboard = () => {
  const [loading, setLoading] = useState(false);
  const [referralData, setReferralData] = useState({
    referral_code: '',
    total_earnings: 0,
    available_balance: 0,
    referrals: []
  });
  const [withdrawLoading, setWithdrawLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [bankDetails, setBankDetails] = useState({
    account_number: '',
    ifsc_code: '',
    account_holder_name: '',
    pan_number: ''
  });
  const navigate = useNavigate();

  // Fetch referral data
  const fetchReferralData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        message.error('Please login first');
        navigate('/login');
        return;
      }
      
      const response = await axios.get('http://localhost:8000/api/auth/referrals/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      setReferralData(response.data);
    } catch (error) {
      console.error('Referral fetch error:', error.response);
      if (error.response?.status === 401) {
        message.error('Session expired. Please login again.');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        navigate('/login');
      } else {
        message.error('Failed to fetch referral data');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReferralData();
  }, []);

  const handleCopyCode = () => {
    if (referralData?.referral_code) {
      copy(referralData.referral_code);
      message.success('Referral code copied to clipboard!');
    }
  };

  const handleShareClick = () => {
    const shareText = `Join Cherry Gold Interiors using my referral code: ${referralData?.referral_code} and get special benefits!`;
    if (navigator.share) {
      navigator.share({
        title: 'Cherry Gold Interiors Referral Program',
        text: shareText,
        url: window.location.origin,
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
      const token = localStorage.getItem('accessToken');
      const response = await axios.post('http://localhost:8000/api/auth/withdraw/', bankDetails, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      message.success('Withdrawal request submitted successfully!');
      setIsModalVisible(false);
      setBankDetails({
        account_number: '',
        ifsc_code: '',
        account_holder_name: '',
        pan_number: ''
      });
      fetchReferralData(); // Refresh data
    } catch (error) {
      console.error('Withdrawal error:', error.response);
      
      if (error.response?.status === 401) {
        message.error('Session expired. Please login again.');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        navigate('/login');
      } else {
        const errorMsg = error.response?.data?.error || 
                         error.response?.data?.message || 
                         'Withdrawal request failed';
        message.error(errorMsg);
      }
    } finally {
      setWithdrawLoading(false);
    }
  };

  const handleWithdrawCancel = () => {
    setIsModalVisible(false);
    setBankDetails({
      account_number: '',
      ifsc_code: '',
      account_holder_name: '',
      pan_number: ''
    });
  };

  const handleBankDetailChange = (field, value) => {
    setBankDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const columns = [
    {
      title: 'Referred User',
      dataIndex: 'referred_user',
      key: 'referred_user',
      render: (user) => user ? `${user.first_name || ''} ${user.last_name || ''}`.trim() : 'N/A',
    },
    {
      title: 'Email',
      dataIndex: 'referred_user',
      key: 'email',
      render: (user) => user?.email || 'N/A',
    },
    {
      title: 'Project Value',
      dataIndex: 'project_value',
      key: 'project_value',
      render: (value) => `₹${value ? value.toLocaleString('en-IN') : '0'}`,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color = 'default';
        let text = 'Pending';
        
        if (status === 'completed') {
          color = 'green';
          text = 'Completed';
        } else if (status === 'pending') {
          color = 'orange';
          text = 'Pending';
        } else if (status === 'paid') {
          color = 'blue';
          text = 'Paid';
        }
        
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: 'Your Reward',
      dataIndex: 'reward_amount',
      key: 'reward_amount',
      render: (amount) => (
        <Text strong style={{ color: '#d4af37' }}>
          ₹{amount ? amount.toLocaleString('en-IN') : '0'}
        </Text>
      ),
    },
  ];

  // Premium color palette
  const premiumColors = {
    gold: '#d4af37',
    darkGold: '#b8941f',
    charcoal: '#1f1f1f',
    lightCharcoal: '#2a2a2a',
    cream: '#FDFBD4',
    lightCream: '#f1f1de',
    red: '#dc143c',
    darkRed: '#8b0000',
    success: '#52c41a',
    warning: '#faad14',
    error: '#f5222d',
    info: '#1890ff'
  };

  return (
    <div style={{ 
      padding: '32px 0', 
      background: premiumColors.cream,
      minHeight: '100vh'
    }}>
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '0 16px' 
      }}>
        {/* Header Section */}
        <div style={{ 
          textAlign: 'center', 
          marginBottom: '48px',
          padding: '0 16px'
        }}>
          <Title level={1} style={{ 
            color: premiumColors.charcoal, 
            marginBottom: '16px',
            fontWeight: 700,
            fontSize: '2.5rem'
          }}>
            Refer & Earn
          </Title>
          <Paragraph style={{ 
            fontSize: '18px', 
            color: premiumColors.charcoal,
            maxWidth: '800px',
            margin: '0 auto',
            lineHeight: 1.6
          }}>
            Share Cherry Gold Interiors with your friends and family. Earn rewards for every successful referral.
          </Paragraph>
        </div>

        {/* Reward Structure */}
        <Row gutter={[24, 24]} style={{ marginBottom: '48px' }}>
          <Col xs={24} md={12}>
            <Card 
              style={{ 
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #1f1f1f 0%, #8b0000 100%)',
                color: 'white',
                border: 'none',
                height: '100%'
              }}
              bodyStyle={{ padding: '32px' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                <TrophyOutlined style={{ fontSize: '24px', marginRight: '12px', color: premiumColors.gold }} />
                <Title level={3} style={{ color: 'white', margin: 0 }}>Premium Projects</Title>
              </div>
              <div style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '8px' }}>5%</div>
              <Paragraph style={{ color: 'rgba(255,255,255,0.9)', fontSize: '16px', marginBottom: '16px' }}>
                Reward on projects above ₹2,00,000
              </Paragraph>
            </Card>
          </Col>
          
          <Col xs={24} md={12}>
            <Card 
              style={{ 
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #1f1f1f 0%, #8b0000 100%)',
                color: 'white',
                border: 'none',
                height: '100%'
              }}
              bodyStyle={{ padding: '32px' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                <GiftOutlined style={{ fontSize: '24px', marginRight: '12px', color: premiumColors.gold }} />
                <Title level={3} style={{ color: 'white', margin: 0 }}>Standard Projects</Title>
              </div>
              <div style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '8px' }}>3%</div>
              <Paragraph style={{ color: 'rgba(255,255,255,0.9)', fontSize: '16px', marginBottom: '16px' }}>
                Reward on projects above ₹1,00,000
              </Paragraph>
            </Card>
          </Col>
        </Row>

        {/* Your Referral Code */}
        <Card 
          style={{ 
            borderRadius: '16px',
            background: premiumColors.lightCream,
            marginBottom: '48px',
            border: 'none',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
          }}
          bodyStyle={{ padding: '32px' }}
        >
          <div style={{ textAlign: 'center' }}>
            <Title level={2} style={{ color: premiumColors.charcoal, marginBottom: '24px' }}>
              Your Referral Code
            </Title>
            <div style={{ 
              background: 'white', 
              borderRadius: '8px', 
              padding: '16px', 
              display: 'inline-block',
              marginBottom: '16px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <Text style={{ fontSize: '24px', fontWeight: 700, color: premiumColors.red }}>
                  {referralData.referral_code || 'Loading...'}
                </Text>
                <Button
                  type="primary"
                  icon={<CopyOutlined />}
                  onClick={handleCopyCode}
                  style={{ 
                    backgroundColor: premiumColors.red,
                    borderColor: premiumColors.red,
                    borderRadius: '6px'
                  }}
                >
                  Copy
                </Button>
                <Button
                  icon={<ShareAltOutlined />}
                  onClick={handleShareClick}
                  style={{ 
                    borderRadius: '6px'
                  }}
                >
                  Share
                </Button>
              </div>
            </div>
            <Paragraph style={{ color: premiumColors.charcoal, margin: 0 }}>
              Share this code with your friends and family to start earning rewards
            </Paragraph>
          </div>
        </Card>

        {/* Referral Dashboard */}
        <Card 
          style={{ 
            borderRadius: '16px',
            background: premiumColors.lightCream,
            marginBottom: '48px',
            border: 'none',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
          }}
          bodyStyle={{ padding: '32px' }}
        >
          <Title level={2} style={{ color: premiumColors.charcoal, marginBottom: '32px' }}>
            Your Referral Dashboard
          </Title>
          
          <Row gutter={[16, 16]} style={{ marginBottom: '32px' }}>
            <Col xs={12} md={6}>
              <Card 
                style={{ 
                  background: '#fee2e2', 
                  borderRadius: '8px',
                  border: 'none',
                  textAlign: 'center'
                }}
                bodyStyle={{ padding: '16px' }}
              >
                <div style={{ fontSize: '24px', fontWeight: 700, color: premiumColors.red, marginBottom: '8px' }}>
                  {referralData.referrals.length}
                </div>
                <div style={{ fontSize: '14px', color: premiumColors.charcoal }}>Total Referrals</div>
              </Card>
            </Col>
            
            <Col xs={12} md={6}>
              <Card 
                style={{ 
                  background: '#dcfce7', 
                  borderRadius: '8px',
                  border: 'none',
                  textAlign: 'center'
                }}
                bodyStyle={{ padding: '16px' }}
              >
                <div style={{ fontSize: '24px', fontWeight: 700, color: premiumColors.success, marginBottom: '8px' }}>
                  {referralData.referrals.filter(r => r.status === 'completed' || r.status === 'paid').length}
                </div>
                <div style={{ fontSize: '14px', color: premiumColors.charcoal }}>Successful</div>
              </Card>
            </Col>
            
            <Col xs={12} md={6}>
              <Card 
                style={{ 
                  background: '#dbeafe', 
                  borderRadius: '8px',
                  border: 'none',
                  textAlign: 'center'
                }}
                bodyStyle={{ padding: '16px' }}
              >
                <div style={{ fontSize: '24px', fontWeight: 700, color: premiumColors.info, marginBottom: '8px' }}>
                  ₹{referralData.total_earnings.toLocaleString('en-IN')}
                </div>
                <div style={{ fontSize: '14px', color: premiumColors.charcoal }}>Total Earnings</div>
              </Card>
            </Col>
            
            <Col xs={12} md={6}>
              <Card 
                style={{ 
                  background: '#f3e8ff', 
                  borderRadius: '8px',
                  border: 'none',
                  textAlign: 'center'
                }}
                bodyStyle={{ padding: '16px' }}
              >
                <div style={{ fontSize: '24px', fontWeight: 700, color: '#8b5cf6', marginBottom: '8px' }}>
                  ₹{referralData.available_balance.toLocaleString('en-IN')}
                </div>
                <div style={{ fontSize: '14px', color: premiumColors.charcoal }}>Available Balance</div>
              </Card>
            </Col>
          </Row>

          {/* Withdrawal Button */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <Button
              type="primary"
              size="large"
              icon={<BankOutlined />}
              onClick={showWithdrawModal}
              disabled={referralData.available_balance < 500}
              style={{ 
                backgroundColor: premiumColors.gold,
                borderColor: premiumColors.darkGold,
                borderRadius: '8px',
                padding: '0 32px',
                height: '48px',
                fontWeight: 600
              }}
            >
              Withdraw Earnings
            </Button>
            {referralData.available_balance < 500 && (
              <Paragraph type="secondary" style={{ marginTop: '8px' }}>
                Minimum withdrawal amount is ₹500
              </Paragraph>
            )}
          </div>

          {/* Recent Referrals */}
          <div>
            <Title level={3} style={{ color: premiumColors.charcoal, marginBottom: '16px' }}>
              Recent Referrals
            </Title>
            <Table
              columns={columns}
              dataSource={referralData.referrals}
              loading={loading}
              rowKey="id"
              pagination={{ pageSize: 5 }}
              style={{ borderRadius: '8px', overflow: 'hidden' }}
              locale={{
                emptyText: 'No referrals yet. Share your code to start earning!'
              }}
            />
          </div>
        </Card>

        {/* Terms & Conditions */}
        <Card 
          style={{ 
            borderRadius: '16px',
            background: '#f3f4f6',
            border: 'none'
          }}
          bodyStyle={{ padding: '32px' }}
        >
          <Title level={3} style={{ color: premiumColors.charcoal, marginBottom: '16px' }}>
            Terms & Conditions
          </Title>
          <Row gutter={[24, 16]}>
            <Col xs={24} md={12}>
              <Title level={5} style={{ color: premiumColors.charcoal }}>Reward Eligibility:</Title>
              <ul style={{ color: premiumColors.charcoal, paddingLeft: '16px' }}>
                <li>Minimum project value: ₹1,00,000</li>
                <li>Referred customer must be new to Cherry Gold</li>
                <li>Reward paid after project completion</li>
                <li>Self-referrals are not allowed</li>
              </ul>
            </Col>
            <Col xs={24} md={12}>
              <Title level={5} style={{ color: premiumColors.charcoal }}>Payment Terms:</Title>
              <ul style={{ color: premiumColors.charcoal, paddingLeft: '16px' }}>
                <li>Rewards processed within 30 days</li>
                <li>Payment via bank transfer</li>
                <li>TDS applicable as per government rules</li>
                <li>Minimum payout: ₹500</li>
              </ul>
            </Col>
          </Row>
        </Card>
      </div>

      {/* Withdrawal Modal */}
      <Modal
        title="Withdrawal Request"
        open={isModalVisible}
        onOk={handleWithdrawOk}
        onCancel={handleWithdrawCancel}
        confirmLoading={withdrawLoading}
        okText="Submit Request"
        okButtonProps={{
          style: {
            backgroundColor: premiumColors.red,
            borderColor: premiumColors.red,
            borderRadius: '6px'
          }
        }}
        cancelButtonProps={{
          style: {
            borderRadius: '6px'
          }
        }}
        width={600}
        style={{ borderRadius: '12px' }}
        bodyStyle={{ padding: '24px' }}
      >
        <Form layout="vertical">
          <Form.Item label="Account Number" required>
            <Input
              placeholder="Enter your bank account number"
              value={bankDetails.account_number}
              onChange={(e) => handleBankDetailChange('account_number', e.target.value)}
              size="large"
              style={{ borderRadius: '6px' }}
            />
          </Form.Item>
          <Form.Item label="Account Holder Name" required>
            <Input
              placeholder="Enter account holder name"
              value={bankDetails.account_holder_name}
              onChange={(e) => handleBankDetailChange('account_holder_name', e.target.value)}
              size="large"
              style={{ borderRadius: '6px' }}
            />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="IFSC Code" required>
                <Input
                  placeholder="Enter IFSC code"
                  value={bankDetails.ifsc_code}
                  onChange={(e) => handleBankDetailChange('ifsc_code', e.target.value)}
                  size="large"
                  style={{ borderRadius: '6px' }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="PAN Number" required>
                <Input
                  placeholder="Enter PAN number"
                  value={bankDetails.pan_number}
                  onChange={(e) => handleBankDetailChange('pan_number', e.target.value)}
                  size="large"
                  style={{ borderRadius: '6px' }}
                />
              </Form.Item>
            </Col>
          </Row>
          <div style={{ 
            background: '#fffbe6', 
            padding: '16px', 
            borderRadius: '6px',
            border: '1px solid #ffe58f'
          }}>
            <Text style={{ color: premiumColors.charcoal }}>
              <InfoCircleOutlined style={{ marginRight: '8px', color: '#faad14' }} />
              Withdrawals are processed within 3-5 business days after verification
            </Text>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default ReferralDashboard;