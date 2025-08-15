import React, { useState } from 'react';
import { Users, Gift, Share2, Trophy, Copy } from 'lucide-react';

const ReferEarn = () => {
  const [referralCode, setReferralCode] = useState('CG_' + Math.random().toString(36).substr(2, 8).toUpperCase());

  const copyReferralCode = () => {
    navigator.clipboard.writeText(referralCode);
    alert('Referral code copied to clipboard!');
  };

  return (
    <div className="py-32 bg-[#FDFBD4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Refer & Earn
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Share Cherry Gold Interiors with your friends and family. Earn rewards for every successful referral while helping others transform their spaces.
          </p>
        </div>

        {/* Reward Structure */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className=" bg-gradient-to-r from-gray-900 to-red-800  rounded-2xl p-8 text-white">
            <div className="flex items-center mb-4">
              <Trophy className="w-8 h-8 mr-3" />
              <h2 className="text-2xl font-bold">Premium Projects</h2>
            </div>
            <div className="text-4xl font-bold mb-2">5%</div>
            <p className="text-lg mb-4">Reward on projects above ₹2,00,000</p>
            <ul className="text-sm opacity-90 space-y-1">
              <li>• Complete home interiors</li>
              <li>• Multiple room projects</li>
              <li>• Premium kitchen & wardrobe combos</li>
            </ul>
          </div>
          
          <div className=" bg-gradient-to-r from-gray-900 to-red-800  rounded-2xl p-8 text-white">
            <div className="flex items-center mb-4">
              <Gift className="w-8 h-8 mr-3" />
              <h2 className="text-2xl font-bold">Standard Projects</h2>
            </div>
            <div className="text-4xl font-bold mb-2">3%</div>
            <p className="text-lg mb-4">Reward on projects above ₹1,00,000</p>
            <ul className="text-sm opacity-90 space-y-1">
              <li>• Modular kitchens</li>
              <li>• Wardrobe designs</li>
              <li>• Individual room projects</li>
            </ul>
          </div>
        </div>

        {/* Your Referral Code */}
        <div className="bg-[#f1f1de] rounded-2xl shadow-lg p-8 mb-16">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Referral Code</h2>
            <div className="bg-gray-50 rounded-lg p-4 inline-block">
              <div className="flex items-center space-x-4">
                <span className="text-2xl font-bold text-red-500">{referralCode}</span>
                <button
                  onClick={copyReferralCode}
                  className="bg-red-500 text-white p-2 rounded-lg hover:bg-orange-700 transition-colors"
                >
                  <Copy className="w-5 h-5" />
                </button>
              </div>
            </div>
            <p className="text-gray-600 mt-4">
              Share this code with your friends and family to start earning rewards
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-[#f1f1de] rounded-2xl shadow-lg p-8 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Share2 className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">1. Share Your Code</h3>
              <p className="text-gray-600">Share your unique referral code with friends and family</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">2. They Book & Pay</h3>
              <p className="text-gray-600">Your friend books a project and makes the payment</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Gift className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">3. You Earn Rewards</h3>
              <p className="text-gray-600">Receive your reward after project completion</p>
            </div>
          </div>
        </div>

        {/* Referral Dashboard */}
        <div className="bg-[#f1f1de] rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Your Referral Dashboard</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-red-50 rounded-lg p-6 text-center">
              <div className="text-2xl font-bold text-red-600 mb-2">12</div>
              <div className="text-sm text-gray-600">Total Referrals</div>
            </div>
            
            <div className="bg-green-50 rounded-lg p-6 text-center">
              <div className="text-2xl font-bold text-green-600 mb-2">8</div>
              <div className="text-sm text-gray-600">Successful Projects</div>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-6 text-center">
              <div className="text-2xl font-bold text-blue-600 mb-2">₹45,000</div>
              <div className="text-sm text-gray-600">Total Earnings</div>
            </div>
            
            <div className="bg-purple-50 rounded-lg p-6 text-center">
              <div className="text-2xl font-bold text-purple-600 mb-2">₹12,000</div>
              <div className="text-sm text-gray-600">Pending Rewards</div>
            </div>
          </div>

          {/* Recent Referrals */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Referrals</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left p-4 font-medium text-gray-900">Name</th>
                    <th className="text-left p-4 font-medium text-gray-900">Project</th>
                    <th className="text-left p-4 font-medium text-gray-900">Value</th>
                    <th className="text-left p-4 font-medium text-gray-900">Status</th>
                    <th className="text-left p-4 font-medium text-gray-900">Reward</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-4">Amit Sharma</td>
                    <td className="p-4">Modular Kitchen</td>
                    <td className="p-4">₹3,50,000</td>
                    <td className="p-4">
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                        Completed
                      </span>
                    </td>
                    <td className="p-4 font-semibold text-green-600">₹17,500</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4">Priya Patel</td>
                    <td className="p-4">Wardrobe</td>
                    <td className="p-4">₹1,20,000</td>
                    <td className="p-4">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                        In Progress
                      </span>
                    </td>
                    <td className="p-4 font-semibold text-blue-600">₹3,600</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4">Rajesh Kumar</td>
                    <td className="p-4">Complete Home</td>
                    <td className="p-4">₹8,50,000</td>
                    <td className="p-4">
                      <span className="bg-red-100 text-orange-800 px-2 py-1 rounded-full text-xs">
                        Consultation
                      </span>
                    </td>
                    <td className="p-4 font-semibold text-red-600">₹42,500</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Terms & Conditions */}
        <div className="mt-16 bg-gray-100 rounded-2xl p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Terms & Conditions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-600">
            <div>
              <h4 className="font-semibold mb-2">Reward Eligibility:</h4>
              <ul className="space-y-1">
                <li>• Minimum project value: ₹1,00,000</li>
                <li>• Referred customer must be new to Cherry Gold</li>
                <li>• Reward paid after project completion</li>
                <li>• Self-referrals are not allowed</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Payment Terms:</h4>
              <ul className="space-y-1">
                <li>• Rewards processed within 30 days</li>
                <li>• Payment via bank transfer or cheque</li>
                <li>• TDS applicable as per government rules</li>
                <li>• Minimum payout: ₹1,000</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferEarn;