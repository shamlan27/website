"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { authAPI, ordersAPI, Order } from "@/lib/api";
import Footer from "../components/Footer";

export default function Dashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'settings'>('overview');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeleteVerificationModal, setShowDeleteVerificationModal] = useState(false);
  const [deleteCode, setDeleteCode] = useState('');
  const [deletePassword, setDeletePassword] = useState('');
  const [isRequestingDelete, setIsRequestingDelete] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [deleteStep, setDeleteStep] = useState<'confirm' | 'verify'>('confirm');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showTrackingModal, setShowTrackingModal] = useState(false);
  const [showViewDetailsModal, setShowViewDetailsModal] = useState(false);
  const [showAllOrdersModal, setShowAllOrdersModal] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelComment, setCancelComment] = useState('');
  const [refundMethod, setRefundMethod] = useState('bank_transfer');
  
  // Profile update states
  const [profileData, setProfileData] = useState({ firstname: '', lastname: '', email: '' });
  const [passwordData, setPasswordData] = useState({ current_password: '', new_password: '', new_password_confirmation: '' });
  const [profileMessage, setProfileMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  const [passwordMessage, setPasswordMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isCancellingOrder, setIsCancellingOrder] = useState(false);

  useEffect(() => {
    // Check for tab parameter in URL
    const tabParam = searchParams.get('tab');
    if (tabParam === 'settings' || tabParam === 'orders' || tabParam === 'overview') {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  useEffect(() => {
    // Initialize profile data when user is loaded
    if (user) {
      setProfileData({
        firstname: user.firstname || '',
        lastname: user.lastname || user.lastName || '',
        email: user.email || ''
      });
    }
  }, [user]);

  useEffect(() => {
    const checkAuth = async () => {
      if (!authAPI.isAuthenticated()) {
        router.push("/login");
        return;
      }

      try {
        const userData = await authAPI.getUser();
        setUser(userData.user || userData);

        // Fetch orders
        try {
          const ordersData = await ordersAPI.getAll();
          setOrders(ordersData.orders || []);
        } catch (orderError) {
          console.error("Error loading orders:", orderError);
          // Don't logout if only orders fail, just keep orders empty
          setOrders([]);
        }
      } catch (error) {
        console.error("Error loading dashboard:", error);
        authAPI.logout();
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleLogout = () => {
    authAPI.logout();
    router.push("/login");
  };

  const handleDeleteAccount = async () => {
    if (deleteStep === 'confirm') {
      // First step: request delete code
      setIsRequestingDelete(true);
      try {
        const response = await authAPI.requestDeleteAccount();
        if (response.success) {
          setDeleteStep('verify');
          setShowDeleteModal(false);
          setShowDeleteVerificationModal(true);
        } else {
          alert(response.message || 'Failed to request account deletion. Please try again.');
        }
      } catch (error) {
        console.error('Error requesting delete:', error);
        alert('Failed to request account deletion. Please try again.');
      } finally {
        setIsRequestingDelete(false);
      }
    } else {
      // Second step: verify and delete
      if (!deleteCode.trim()) {
        alert('Please enter the verification code');
        return;
      }

      // Check if user needs password (social auth users don't need password, password users do)
      const isSocialAuthUser = !!user?.provider; // Social auth users have provider field
      const needsPassword = !isSocialAuthUser;

      if (needsPassword && !deletePassword) {
        alert('Please enter your password');
        return;
      }

      setIsDeletingAccount(true);
      try {
        const deleteData: { code: string; password?: string } = { code: deleteCode };
        if (needsPassword) {
          deleteData.password = deletePassword;
        }

        const response = await authAPI.deleteAccount(deleteData);
        if (response.success) {
          authAPI.logout();
          router.push("/");
        } else {
          alert(response.message || 'Failed to delete account. Please check your code and try again.');
        }
      } catch (error) {
        console.error('Error deleting account:', error);
        alert('Failed to delete account. Please try again.');
      } finally {
        setIsDeletingAccount(false);
      }
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/user/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify(profileData)
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        // Update local user data
        const updatedUser = { ...user, ...profileData };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setProfileMessage({ type: 'success', text: 'Profile updated successfully!' });
        setTimeout(() => setProfileMessage(null), 5000);
      } else {
        setProfileMessage({ type: 'error', text: data.message || 'Failed to update profile' });
        setTimeout(() => setProfileMessage(null), 5000);
      }
    } catch (error) {
      console.error('Update profile error:', error);
      setProfileMessage({ type: 'error', text: 'Network error. Please try again.' });
      setTimeout(() => setProfileMessage(null), 5000);
    }
  };

  const handleChangePassword = async () => {
    // Validation checks
    if (!passwordData.current_password) {
      setPasswordMessage({ type: 'error', text: 'Current password is required' });
      setTimeout(() => setPasswordMessage(null), 5000);
      return;
    }

    if (!passwordData.new_password) {
      setPasswordMessage({ type: 'error', text: 'New password is required' });
      setTimeout(() => setPasswordMessage(null), 5000);
      return;
    }

    if (passwordData.new_password.length < 8) {
      setPasswordMessage({ type: 'error', text: 'New password must be at least 8 characters' });
      setTimeout(() => setPasswordMessage(null), 5000);
      return;
    }

    if (passwordData.new_password !== passwordData.new_password_confirmation) {
      setPasswordMessage({ type: 'error', text: 'New passwords do not match' });
      setTimeout(() => setPasswordMessage(null), 5000);
      return;
    }

    try {
      console.log('Sending password change request with data:', {
        current_password: '***',
        new_password: '***',
        new_password_confirmation: '***'
      });

      const response = await fetch('http://127.0.0.1:8000/api/user/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify({
          current_password: passwordData.current_password,
          new_password: passwordData.new_password,
          new_password_confirmation: passwordData.new_password_confirmation
        })
      });

      const data = await response.json();
      console.log('Password change response:', data);
      
      if (response.ok && data.success) {
        setPasswordData({ current_password: '', new_password: '', new_password_confirmation: '' });
        setPasswordMessage({ type: 'success', text: '✓ Password changed successfully!' });
        alert('✓ Password Changed Successfully!\n\nYour password has been updated. You can now use your new password to log in.');
        setTimeout(() => setPasswordMessage(null), 5000);
      } else {
        const errorMsg = data.message || 'Failed to change password';
        setPasswordMessage({ type: 'error', text: errorMsg });
        alert('❌ Password Change Failed\n\n' + errorMsg);
        setTimeout(() => setPasswordMessage(null), 5000);
      }
    } catch (error) {
      console.error('Change password error:', error);
      const errorMsg = 'Network error. Please try again.';
      setPasswordMessage({ type: 'error', text: errorMsg });
      alert('❌ Password Change Failed\n\n' + errorMsg);
      setTimeout(() => setPasswordMessage(null), 5000);
    }
  };

  const handleCancelOrder = async () => {
    if (!selectedOrder || !cancelReason) {
      alert('Please select a cancellation reason');
      return;
    }

    setIsCancellingOrder(true);

    try {
      const cancellationData = {
        reason: cancelReason,
        comment: cancelComment,
        refund_method: refundMethod
      };

      await ordersAPI.cancel(selectedOrder.order_id, cancellationData);
      
      // Refresh orders
      const ordersData = await ordersAPI.getAll();
      setOrders(ordersData.orders || []);

      alert('Order cancelled successfully! Cancellation email sent. Refund will be processed in 7-14 business days.');
      setShowCancelModal(false);
      setSelectedOrder(null);
      setCancelReason('');
      setCancelComment('');
    } catch (error) {
      console.error('Error cancelling order:', error);
      alert('Failed to cancel order. Please try again.');
    } finally {
      setIsCancellingOrder(false);
    }
  };

  const getStatusColor = (status: string) => {
    const s = (status ?? '').toString().toLowerCase().trim();
    switch (s) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const pendingOrders = orders.filter(o => {
    const s = (o.status ?? '').toString().toLowerCase().trim();
    return s === 'pending' || s === 'processing';
  });
  const deliveredOrders = orders.filter(o => ((o.status ?? '').toString().toLowerCase().trim()) === 'delivered');
  // Ensure numeric accumulation even if backend returns strings/nulls
  const totalSpent = orders.reduce((sum, order) => sum + Number(order.total_amount ?? 0), 0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Welcome, {user?.lastname || user?.lastName || "User"}!</h2>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div 
                onClick={() => setShowAllOrdersModal(true)}
                className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Orders</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{orders.length}</p>
                    <p className="text-xs text-blue-600 mt-1">Click to view all</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-full">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Pending</p>
                    <p className="text-2xl font-bold text-yellow-600 mt-1">{pendingOrders.length}</p>
                  </div>
                  <div className="p-3 bg-yellow-100 rounded-full">
                    <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Delivered</p>
                    <p className="text-2xl font-bold text-green-600 mt-1">{deliveredOrders.length}</p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-full">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Spent</p>
                    <p className="text-2xl font-bold text-purple-600 mt-1">${Number(totalSpent).toFixed(2)}</p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-full">
                    <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-lg shadow mb-8">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
              </div>
              <div className="p-6">
                {orders.length === 0 ? (
                  <div className="text-center py-8">
                    <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                    </svg>
                    <p className="text-gray-600 mb-4">No orders yet</p>
                    <Link
                      href="/shop"
                      className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      Start Shopping
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.slice(0, 5).map((order) => (
                      <div key={order.id} className="relative flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <div>
                          <p className="font-medium text-gray-900">Order #{order.order_id}</p>
                          <p className="text-sm text-gray-600">{new Date(order.created_at).toLocaleDateString()}</p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">${Number(order.total_amount ?? 0).toFixed(2)}</p>
                            <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(order.status)}`}>
                              {(() => { const s = ((order.status ?? '') as any).toString().toLowerCase(); return s ? s.charAt(0).toUpperCase() + s.slice(1) : ''; })()}
                            </span>
                          </div>
                          <div className="relative">
                            <button
                              onClick={() => setOpenDropdown(openDropdown === order.id ? null : order.id)}
                              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                            >
                              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"/>
                              </svg>
                            </button>
                            {openDropdown === order.id && (
                              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                                <button
                                  onClick={() => {
                                    setSelectedOrder(order);
                                    setShowViewDetailsModal(true);
                                    setOpenDropdown(null);
                                  }}
                                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2 rounded-t-lg"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                                  </svg>
                                  <span>View Details</span>
                                </button>
                                {(((order as any).tracking_number || (order as any).trackingNumber || (order as any).tracking)) && (
                                  <button
                                    onClick={() => {
                                      setSelectedOrder(order);
                                      setShowTrackingModal(true);
                                      setOpenDropdown(null);
                                    }}
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                                    </svg>
                                    <span>Track Order</span>
                                  </button>
                                )}
                                {(() => { const s = ((order.status ?? '') as any).toString().toLowerCase().trim(); return s === 'pending' || s === 'processing'; })() && (
                                  <button
                                    onClick={() => {
                                      setSelectedOrder(order);
                                      setShowCancelModal(true);
                                      setOpenDropdown(null);
                                    }}
                                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2 rounded-b-lg"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                                    </svg>
                                    <span>Cancel Order</span>
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link href="/shop" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Browse Products</h4>
                    <p className="text-sm text-gray-600">Explore our catalog</p>
                  </div>
                </div>
              </Link>

              <Link href="/custom-card" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-purple-100 rounded-full">
                    <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Custom Card</h4>
                    <p className="text-sm text-gray-600">Design your card</p>
                  </div>
                </div>
              </Link>

              <button onClick={() => setActiveTab('settings')} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow text-left">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gray-100 rounded-full">
                    <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Account Settings</h4>
                    <p className="text-sm text-gray-600">Manage your profile</p>
                  </div>
                </div>
              </button>
            </div>
          </>
        )}

        {/* My Cards Tab - REMOVED */}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Order History & Tracking</h2>
            <div className="bg-white rounded-lg shadow">
              {orders.length === 0 ? (
                <div className="p-12 text-center">
                  <svg className="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                  </svg>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders yet</h3>
                  <p className="text-gray-600 mb-6">Start shopping to see your orders here</p>
                  <Link
                    href="/shop"
                    className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Browse Products
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {orders.map((order) => (
                    <div key={order.id} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <p className="text-sm text-gray-600">Order ID: {order.order_id}</p>
                          <p className="text-sm text-gray-500">Placed on {(order.created_at ? new Date(order.created_at).toLocaleDateString() : '-') }</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                          {(() => { const s = ((order.status ?? '') as any).toString().toLowerCase(); return s ? s.charAt(0).toUpperCase() + s.slice(1) : ''; })()}
                        </span>
                      </div>

                      {/* Order Items */}
                      <div className="space-y-2 mb-4">
                        {(order.items || []).map((item, idx) => (
                          <div key={idx} className="flex items-center space-x-3">
                            {item.image && (
                              <img src={item.image} alt={item.product_name} className="w-12 h-12 object-cover rounded" />
                            )}
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">{item.product_name}</p>
                              <p className="text-xs text-gray-500">Qty: {item.quantity} × ${item.price}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                        <div>
                          <p className="text-lg font-semibold text-gray-900">Total: ${Number(order.total_amount ?? 0).toFixed(2)}</p>
                          {(((order as any).tracking_number || (order as any).trackingNumber || (order as any).tracking)) && (
                            <p className="text-sm text-gray-600">Tracking: {((order as any).tracking_number || (order as any).trackingNumber || (order as any).tracking)}</p>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          {(((order as any).tracking_number || (order as any).trackingNumber || (order as any).tracking)) && (
                            <button
                              onClick={() => {
                                setSelectedOrder(order);
                                setShowTrackingModal(true);
                              }}
                              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                            >
                              Track Order
                            </button>
                          )}
                          {(() => { const s = ((order.status ?? '') as any).toString().toLowerCase().trim(); return s === 'pending' || s === 'processing'; })() && (
                            <button
                              onClick={() => {
                                setSelectedOrder(order);
                                setShowCancelModal(true);
                              }}
                              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                            >
                              Cancel Order
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Account Settings</h2>
            
            {/* Profile Settings */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Information</h3>
              
              {/* Profile Message */}
              {profileMessage && (
                <div className={`mb-4 p-4 rounded-lg ${
                  profileMessage.type === 'success' 
                    ? 'bg-green-50 border border-green-200 text-green-800' 
                    : 'bg-red-50 border border-red-200 text-red-800'
                }`}>
                  <p className="text-sm font-medium">{profileMessage.text}</p>
                </div>
              )}
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input
                    type="text"
                    value={profileData.firstname}
                    onChange={(e) => setProfileData({ ...profileData, firstname: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    value={profileData.lastname}
                    onChange={(e) => setProfileData({ ...profileData, lastname: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <button 
                  onClick={handleUpdateProfile}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Update Profile
                </button>
              </div>
            </div>

            {/* Change Password */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Change Password</h3>
              
              {/* Password Message */}
              {passwordMessage && (
                <div className={`mb-4 p-4 rounded-lg ${
                  passwordMessage.type === 'success' 
                    ? 'bg-green-50 border border-green-200 text-green-800' 
                    : 'bg-red-50 border border-red-200 text-red-800'
                }`}>
                  <p className="text-sm font-medium">{passwordMessage.text}</p>
                </div>
              )}
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                  <input
                    type="password"
                    value={passwordData.current_password}
                    onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">New Password (min. 8 characters)</label>
                  <input
                    type="password"
                    value={passwordData.new_password}
                    onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    value={passwordData.new_password_confirmation}
                    onChange={(e) => setPasswordData({ ...passwordData, new_password_confirmation: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <button 
                  onClick={handleChangePassword}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Change Password
                </button>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-white rounded-lg shadow p-6 border-2 border-red-200">
              <h3 className="text-lg font-semibold text-red-600 mb-4">Danger Zone</h3>
              <p className="text-sm text-gray-600 mb-4">
                Once you delete your account, there is no going back. Please be certain.
              </p>
              <button
                onClick={() => {
                  setDeleteStep('confirm');
                  setShowDeleteModal(true);
                }}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                Delete Account
              </button>
            </div>
          </>
        )}
      </div>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Delete Account</h3>
            <p className="text-gray-600 mb-6">
              Are you absolutely sure you want to delete your account? This action cannot be undone and all your data will be permanently removed.
            </p>
            <p className="text-sm text-gray-500 mb-4">
              We'll send a verification code to your email to confirm this action.
            </p>
            <div className="flex space-x-4">
              <button
                onClick={handleDeleteAccount}
                disabled={isRequestingDelete}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isRequestingDelete ? (
                  <>
                    <svg className="animate-spin h-5 w-5 inline mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending Code...
                  </>
                ) : (
                  'Send Verification Code'
                )}
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={isRequestingDelete}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Verification Modal */}
      {showDeleteVerificationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Verify Account Deletion</h3>
            <p className="text-gray-600 mb-6">
              We've sent a verification code to your email. Enter the code below to confirm account deletion.
              The code expires in 15 minutes.
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Verification Code *
                </label>
                <input
                  type="text"
                  value={deleteCode}
                  onChange={(e) => setDeleteCode(e.target.value)}
                  placeholder="Enter 6-digit code"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  maxLength={6}
                />
              </div>

              {(() => {
                const isSocialAuthUser = !!user?.provider;
                return !isSocialAuthUser ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Password *
                    </label>
                    <input
                      type="password"
                      value={deletePassword}
                      onChange={(e) => setDeletePassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                ) : null;
              })()}

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-sm text-yellow-800">
                  <strong>Warning:</strong> This action cannot be undone. Your account and all associated data will be permanently deleted.
                </p>
              </div>
            </div>

            <div className="flex space-x-4 mt-6">
              <button
                onClick={handleDeleteAccount}
                disabled={isDeletingAccount}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeletingAccount ? (
                  <>
                    <svg className="animate-spin h-5 w-5 inline mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Deleting Account...
                  </>
                ) : (
                  'Delete Account'
                )}
              </button>
              <button
                onClick={() => {
                  setShowDeleteVerificationModal(false);
                  setDeleteCode('');
                  setDeletePassword('');
                  setDeleteStep('confirm');
                }}
                disabled={isDeletingAccount}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Order Modal */}
      {showCancelModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Cancel Order</h3>
            <p className="text-gray-600 mb-4">Order ID: {selectedOrder.order_id}</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cancellation Reason *</label>
                <select
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select a reason</option>
                  <option value="ordered_by_mistake">Ordered by mistake</option>
                  <option value="found_better_price">Found better price</option>
                  <option value="changed_mind">Changed my mind</option>
                  <option value="delivery_too_long">Delivery time too long</option>
                  <option value="duplicate_order">Duplicate order</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {cancelReason === 'other' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Please specify</label>
                  <textarea
                    value={cancelComment}
                    onChange={(e) => setCancelComment(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Tell us why you're cancelling..."
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Refund Method</label>
                <select
                  value={refundMethod}
                  onChange={(e) => setRefundMethod(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="original_payment">Original Payment Method</option>
                  <option value="store_credit">Store Credit</option>
                </select>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  <strong>Refund Processing Time:</strong> {refundMethod === 'bank_transfer' ? '7-14 business days' : '5-7 business days'}
                </p>
              </div>
            </div>

            <div className="flex space-x-4 mt-6">
              <button
                onClick={handleCancelOrder}
                disabled={isCancellingOrder}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCancellingOrder ? (
                  <>
                    <svg className="animate-spin h-5 w-5 inline mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Cancelling...
                  </>
                ) : (
                  'Confirm Cancellation'
                )}
              </button>
              <button
                onClick={() => {
                  setShowCancelModal(false);
                  setSelectedOrder(null);
                  setCancelReason('');
                  setCancelComment('');
                }}
                disabled={isCancellingOrder}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Keep Order
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tracking Modal */}
      {showTrackingModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Order Tracking</h3>
                <p className="text-gray-600">Order ID: {selectedOrder.order_id}</p>
              </div>
              <button
                onClick={() => {
                  setShowTrackingModal(false);
                  setSelectedOrder(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>

            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Tracking Number:</span>
                <span className="text-sm font-mono bg-gray-100 px-3 py-1 rounded">{((selectedOrder as any).tracking_number || (selectedOrder as any).trackingNumber || (selectedOrder as any).tracking || '')}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Status:</span>
                <span className={`text-sm px-3 py-1 rounded-full ${getStatusColor(selectedOrder.status)}`}>
                  {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                </span>
              </div>
            </div>

            {/* Tracking Timeline */}
            <div className="space-y-4">
              <div className={`flex ${selectedOrder.status === 'delivered' || selectedOrder.status === 'shipped' || selectedOrder.status === 'processing' || selectedOrder.status === 'pending' ? 'opacity-100' : 'opacity-50'}`}>
                <div className="flex flex-col items-center mr-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${selectedOrder.status === 'delivered' || selectedOrder.status === 'shipped' || selectedOrder.status === 'processing' || selectedOrder.status === 'pending' ? 'bg-blue-600' : 'bg-gray-300'}`}>
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <div className={`w-0.5 h-12 ${selectedOrder.status === 'delivered' || selectedOrder.status === 'shipped' || selectedOrder.status === 'processing' ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                </div>
                <div className="pb-8">
                  <p className="font-medium text-gray-900">Order Placed</p>
                  <p className="text-sm text-gray-600">{new Date(selectedOrder.created_at).toLocaleString()}</p>
                </div>
              </div>

              <div className={`flex ${selectedOrder.status === 'delivered' || selectedOrder.status === 'shipped' || selectedOrder.status === 'processing' ? 'opacity-100' : 'opacity-50'}`}>
                <div className="flex flex-col items-center mr-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${selectedOrder.status === 'delivered' || selectedOrder.status === 'shipped' || selectedOrder.status === 'processing' ? 'bg-blue-600' : 'bg-gray-300'}`}>
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <div className={`w-0.5 h-12 ${selectedOrder.status === 'delivered' || selectedOrder.status === 'shipped' ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                </div>
                <div className="pb-8">
                  <p className="font-medium text-gray-900">Processing</p>
                  <p className="text-sm text-gray-600">Your order is being prepared</p>
                </div>
              </div>

              <div className={`flex ${selectedOrder.status === 'delivered' || selectedOrder.status === 'shipped' ? 'opacity-100' : 'opacity-50'}`}>
                <div className="flex flex-col items-center mr-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${selectedOrder.status === 'delivered' || selectedOrder.status === 'shipped' ? 'bg-blue-600' : 'bg-gray-300'}`}>
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <div className={`w-0.5 h-12 ${selectedOrder.status === 'delivered' ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                </div>
                <div className="pb-8">
                  <p className="font-medium text-gray-900">Shipped</p>
                  <p className="text-sm text-gray-600">Package is on the way</p>
                </div>
              </div>

              <div className={`flex ${selectedOrder.status === 'delivered' ? 'opacity-100' : 'opacity-50'}`}>
                <div className="flex flex-col items-center mr-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${selectedOrder.status === 'delivered' ? 'bg-green-600' : 'bg-gray-300'}`}>
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                  </div>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Delivered</p>
                  <p className="text-sm text-gray-600">
                    {selectedOrder.status === 'delivered' ? 'Package delivered successfully' : 'Estimated delivery in 3-5 business days'}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-4">Order Items</h4>
              <div className="space-y-3">
                {(selectedOrder.items || []).map((item, idx) => (
                  <div key={idx} className="flex items-center space-x-3">
                    {item.image && (
                      <img src={item.image} alt={item.product_name} className="w-16 h-16 object-cover rounded" />
                    )}
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{item.product_name}</p>
                      <p className="text-sm text-gray-600">Qty: {item.quantity} × ${item.price}</p>
                    </div>
                    <p className="font-semibold text-gray-900">${(item.quantity * item.price).toFixed(2)}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between">
                <span className="font-semibold text-gray-900">Total:</span>
                <span className="font-bold text-lg text-gray-900">${Number(selectedOrder.total_amount ?? 0).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Details Modal */}
      {showViewDetailsModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Order Details</h3>
                <p className="text-gray-600">Order ID: {selectedOrder.order_id}</p>
              </div>
              <button
                onClick={() => {
                  setShowViewDetailsModal(false);
                  setSelectedOrder(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>

            <div className="mb-6">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm font-medium text-gray-700">Order Date:</p>
                  <p className="text-sm text-gray-900">{selectedOrder.created_at ? new Date(selectedOrder.created_at).toLocaleString() : '-'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Status:</p>
                  <span className={`inline-block text-sm px-3 py-1 rounded-full ${getStatusColor(selectedOrder.status)}`}>
                    {(() => { const s = ((selectedOrder.status ?? '') as any).toString().toLowerCase(); return s ? s.charAt(0).toUpperCase() + s.slice(1) : ''; })()}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Payment Method:</p>
                  <p className="text-sm text-gray-900">{selectedOrder.payment_method?.toUpperCase() || '-'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Total Amount:</p>
                  <p className="text-sm font-bold text-gray-900">${Number(selectedOrder.total_amount ?? 0).toFixed(2)}</p>
                </div>
              </div>
              {(((selectedOrder as any).tracking_number || (selectedOrder as any).trackingNumber || (selectedOrder as any).tracking)) && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm font-medium text-blue-900">Tracking Number:</p>
                  <p className="text-sm font-mono text-blue-800">{((selectedOrder as any).tracking_number || (selectedOrder as any).trackingNumber || (selectedOrder as any).tracking)}</p>
                </div>
              )}
            </div>

            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 mb-4">All Products in This Order</h4>
              <div className="space-y-3">
                {(selectedOrder.items || []).map((item, idx) => (
                  <div key={idx} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                    {item.image && (
                      <img src={item.image} alt={item.product_name} className="w-20 h-20 object-cover rounded" />
                    )}
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{item.product_name}</p>
                      <p className="text-sm text-gray-600">Product ID: {item.product_id || 'N/A'}</p>
                      <p className="text-sm text-gray-600">Unit Price: ${Number(item.price ?? 0).toFixed(2)}</p>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">${(Number(item.quantity ?? 0) * Number(item.price ?? 0)).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {selectedOrder.shipping_address && (
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-2">Shipping Address</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-900">{(selectedOrder.shipping_address as any).firstName} {(selectedOrder.shipping_address as any).lastName}</p>
                  <p className="text-sm text-gray-600">{(selectedOrder.shipping_address as any).address}</p>
                  <p className="text-sm text-gray-600">{(selectedOrder.shipping_address as any).city}, {(selectedOrder.shipping_address as any).province} {(selectedOrder.shipping_address as any).zipCode}</p>
                  <p className="text-sm text-gray-600">{(selectedOrder.shipping_address as any).country}</p>
                  <p className="text-sm text-gray-600 mt-2">Phone: {(selectedOrder.shipping_address as any).phone}</p>
                  <p className="text-sm text-gray-600">Email: {(selectedOrder.shipping_address as any).email}</p>
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-3">
              {(((selectedOrder as any).tracking_number || (selectedOrder as any).trackingNumber || (selectedOrder as any).tracking)) && (
                <button
                  onClick={() => {
                    setShowViewDetailsModal(false);
                    setShowTrackingModal(true);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Track Order
                </button>
              )}
              {(() => { const s = ((selectedOrder.status ?? '') as any).toString().toLowerCase().trim(); return s === 'pending' || s === 'processing'; })() && (
                <button
                  onClick={() => {
                    setShowViewDetailsModal(false);
                    setShowCancelModal(true);
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Cancel Order
                </button>
              )}
              <button
                onClick={() => {
                  setShowViewDetailsModal(false);
                  setSelectedOrder(null);
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* All Orders Modal */}
      {showAllOrdersModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">All Orders Summary</h3>
                <p className="text-gray-600 mt-1">Complete overview of all your orders</p>
              </div>
              <button
                onClick={() => setShowAllOrdersModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm font-medium text-blue-900">Total Orders</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">{orders.length}</p>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm font-medium text-yellow-900">Pending</p>
                <p className="text-3xl font-bold text-yellow-600 mt-2">{pendingOrders.length}</p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm font-medium text-green-900">Delivered</p>
                <p className="text-3xl font-bold text-green-600 mt-2">{deliveredOrders.length}</p>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <p className="text-sm font-medium text-purple-900">Total Spent</p>
                <p className="text-3xl font-bold text-purple-600 mt-2">${Number(totalSpent).toFixed(2)}</p>
              </div>
            </div>

            {/* Orders List */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 text-lg">All Orders ({orders.length})</h4>
              {orders.length === 0 ? (
                <div className="text-center py-12">
                  <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                  </svg>
                  <p className="text-gray-500">No orders found</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {orders.map((order) => (
                    <div key={order.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <p className="font-semibold text-gray-900">Order #{order.order_id}</p>
                            <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(order.status)}`}>
                              {(() => { const s = ((order.status ?? '').toString().toLowerCase()); return s ? s.charAt(0).toUpperCase() + s.slice(1) : ''; })()}
                            </span>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                            <p className="text-gray-600">
                              <span className="font-medium">Date:</span> {order.created_at ? new Date(order.created_at).toLocaleDateString() : '-'}
                            </p>
                            <p className="text-gray-600">
                              <span className="font-medium">Items:</span> {(order.items || []).length} product(s)
                            </p>
                            <p className="text-gray-600">
                              <span className="font-medium">Total:</span> ${Number(order.total_amount ?? 0).toFixed(2)}
                            </p>
                          </div>
                          {(order.items || []).length > 0 && (
                            <div className="mt-2">
                              <p className="text-xs text-gray-500 mb-1">Products:</p>
                              <div className="flex flex-wrap gap-1">
                                {(order.items || []).map((item, idx) => (
                                  <span key={idx} className="text-xs bg-gray-100 px-2 py-1 rounded">
                                    {item.product_name} (x{item.quantity})
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setSelectedOrder(order);
                              setShowAllOrdersModal(false);
                              setShowViewDetailsModal(true);
                            }}
                            className="px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            View Details
                          </button>
                          {(((order as any).tracking_number || (order as any).trackingNumber || (order as any).tracking)) && (
                            <button
                              onClick={() => {
                                setSelectedOrder(order);
                                setShowAllOrdersModal(false);
                                setShowTrackingModal(true);
                              }}
                              className="px-3 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                            >
                              Track
                            </button>
                          )}
                          {(() => { const s = ((order.status ?? '').toString().toLowerCase().trim()); return s === 'pending' || s === 'processing'; })() && (
                            <button
                              onClick={() => {
                                setSelectedOrder(order);
                                setShowAllOrdersModal(false);
                                setShowCancelModal(true);
                              }}
                              className="px-3 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowAllOrdersModal(false)}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
