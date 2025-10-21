import React, { createContext, useContext, useState, useEffect } from 'react';
import { getSystemInfo, getUserInfo } from 'zmp-sdk';
import { API_ENDPOINTS, apiHelpers } from '../config/api';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Lấy thông tin user từ Zalo
  const fetchZaloUserInfo = async () => {
    try {
      const systemInfo = getSystemInfo();
      console.log('System Info:', systemInfo);
      
      // Lấy thông tin user từ Zalo
      const userInfo = await getUserInfo();
      console.log('Zalo User Info:', userInfo);
      
      // Kiểm tra xem có đủ thông tin không
      if (!userInfo || !userInfo.id) {
        throw new Error('Không thể lấy thông tin user từ Zalo');
      }
      
      return userInfo;
    } catch (err) {
      console.error('Error fetching Zalo user info:', err);
      // Fallback: tạo user info giả lập cho development
      return {
        id: 'demo_user_' + Date.now(),
        name: 'Người dùng Demo',
        avatar: null,
        phone: null
      };
    }
  };

  // Tạo hoặc cập nhật account trong database
  const createOrUpdateAccount = async (zaloUserInfo) => {
    try {
      const accountData = {
        zalo_id: zaloUserInfo.id,
        name: zaloUserInfo.name || 'Người dùng Zalo',
        avatar: zaloUserInfo.avatar || null,
        phone: zaloUserInfo.phone || null,
        // Có thể thêm các trường khác nếu cần
      };

      console.log('Sending account data:', accountData);

      // Gọi API để tạo hoặc cập nhật account
      const response = await fetch(API_ENDPOINTS.ACCOUNTS.UPSERT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(accountData),
      });

      console.log('API Response status:', response.status);
      console.log('API Response headers:', response.headers);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error response:', errorText);
        throw new Error(`API Error: ${response.status} - ${errorText}`);
      }

      const account = await response.json();
      console.log('Account created/updated:', account);
      return account;
    } catch (err) {
      console.error('Error creating/updating account:', err);
      // Fallback: tạo account local nếu API fail
      return {
        zalo_id: zaloUserInfo.id,
        name: zaloUserInfo.name || 'Người dùng Zalo',
        avatar: zaloUserInfo.avatar || null,
        phone: zaloUserInfo.phone || null,
        role: 'user',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    }
  };

  // Khởi tạo user khi app load
  const initializeUser = async () => {
    try {
      setLoading(true);
      setError(null);

      // Lấy thông tin từ Zalo
      const zaloUserInfo = await fetchZaloUserInfo();
      
      // Tạo hoặc cập nhật account trong database
      const account = await createOrUpdateAccount(zaloUserInfo);
      
      setUser(account);
    } catch (err) {
      console.error('Error initializing user:', err);
      // Không set error nếu có fallback, chỉ log
      if (err.message.includes('API Error')) {
        console.warn('API failed, using fallback user data');
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // Refresh user info
  const refreshUser = async () => {
    await initializeUser();
  };

  // Logout (clear user data)
  const logout = () => {
    setUser(null);
    setError(null);
  };

  useEffect(() => {
    initializeUser();
  }, []);

  const value = {
    user,
    loading,
    error,
    refreshUser,
    logout,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};
