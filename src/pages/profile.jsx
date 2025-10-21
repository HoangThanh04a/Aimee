import { Page, Box, Text, Button, Icon, Spinner } from "zmp-ui";
import { FaUser, FaClock, FaStar, FaPhone, FaHome, FaBell, FaShoppingCart, FaUser as FaUserIcon } from 'react-icons/fa';
import { useUser } from "../context/UserContext";

function ProfilePage() {
  const { user, loading, error } = useUser();

  if (loading) {
    return (
      <Page className="bg-white min-h-screen flex items-center justify-center">
        <Box className="text-center">
          <Spinner className="text-blue-600" />
          <Text className="mt-4 text-gray-600">Đang tải thông tin...</Text>
        </Box>
      </Page>
    );
  }

  if (error) {
    return (
      <Page className="bg-white min-h-screen flex items-center justify-center">
        <Box className="text-center p-6">
          <Icon icon="zi-close-circle" size={64} className="text-red-500 mx-auto mb-4" />
          <Text className="text-red-600 mb-4 text-lg">Lỗi: {error}</Text>
          <Button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-6"
          >
            Thử lại
          </Button>
        </Box>
      </Page>
    );
  }

  return (
    <Page className="bg-white min-h-screen no-scroll-x safe-area-top safe-area-bottom">
      {/* Header */}
      <Box className="bg-blue-100 border-b border-blue-200 p-4 shadow-sm flex items-center justify-between safe-area-top">
        <Text.Title size="large" className="text-blue-900 font-semibold title-responsive">
          Cá nhân
        </Text.Title>
        <Box className="flex gap-3 text-blue-700">
          <Icon icon="zi-more" size={20} className="cursor-pointer hover:text-blue-900 transition-colors" />
          <Icon icon="zi-close" size={20} className="cursor-pointer hover:text-blue-900 transition-colors" />
        </Box>
      </Box>

      {/* User Info */}
      {user && (
        <Box className="spacing-responsive">
          <Box className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100 rounded-2xl p-4 mb-5 shadow-sm">
            <Box className="flex items-center gap-4">
              <Box className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center overflow-hidden">
                {user.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Icon icon="zi-user" size={32} className="text-blue-500" />
                )}
              </Box>
              <Box className="flex-1">
                <Text.Title size="medium" className="text-blue-800 font-semibold mb-1">
                  {user.name || 'Người dùng Zalo'}
                </Text.Title>
                <Text size="small" className="text-blue-600/80">
                  ID: {user.zalo_id}
                </Text>
                {user.phone && (
                  <Text size="small" className="text-blue-600/80">
                    SĐT: {user.phone}
                  </Text>
                )}
              </Box>
            </Box>
          </Box>
        </Box>
      )}

      {/* Membership Info */}
      <Box className="px-4 py-4">
        <Box className="bg-blue-50 border border-blue-100 rounded-2xl p-4 mb-5 shadow-sm hover:shadow-md transition-all">
          <Text.Title size="medium" className="text-blue-800 font-semibold mb-1">
            Đăng ký thành viên
          </Text.Title>
          <Text size="small" className="text-blue-700/80">
            Tích điểm đổi thưởng, nhận ưu đãi hấp dẫn và mở rộng tiện ích cá nhân ☕
          </Text>
          <Button
            className="mt-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full px-6 py-2 transition-colors"
            size="small"
          >
            Đăng ký ngay
          </Button>
        </Box>

        {/* Personal Section */}
        <Box className="mb-5">
          <Text.Title size="small" className="text-blue-900 font-semibold mb-2">
            Cá nhân
          </Text.Title>
          <Box className="divide-y divide-blue-100 rounded-xl border border-blue-100 overflow-hidden shadow-sm">
            <div className="flex items-center py-3 px-4 hover:bg-blue-50 cursor-pointer transition-colors">
              <FaUser className="text-lg text-blue-500 mr-3" />
              <span className="flex-1 text-base text-blue-900">Thông tin tài khoản</span>
              <span className="text-blue-400 text-lg">&gt;</span>
            </div>
            <div className="flex items-center py-3 px-4 hover:bg-blue-50 cursor-pointer transition-colors">
              <FaClock className="text-lg text-blue-500 mr-3" />
              <span className="flex-1 text-base text-blue-900">Lịch sử đơn hàng</span>
              <span className="text-blue-400 text-lg">&gt;</span>
            </div>
          </Box>
        </Box>

        {/* Other Section */}
        <Box>
          <Text.Title size="small" className="text-blue-900 font-semibold mb-2">
            Khác
          </Text.Title>
          <Box className="divide-y divide-blue-100 rounded-xl border border-blue-100 overflow-hidden shadow-sm">
            <div className="flex items-center py-3 px-4 hover:bg-blue-50 cursor-pointer transition-colors">
              <FaStar className="text-lg text-blue-500 mr-3" />
              <span className="flex-1 text-base text-blue-900">Đánh giá đơn hàng</span>
              <span className="text-blue-400 text-lg">&gt;</span>
            </div>
            <div className="flex items-center py-3 px-4 hover:bg-blue-50 cursor-pointer transition-colors">
              <FaPhone className="text-lg text-blue-500 mr-3" />
              <span className="flex-1 text-base text-blue-900">Liên hệ & góp ý</span>
              <span className="text-blue-400 text-lg">&gt;</span>
            </div>
          </Box>
        </Box>
      </Box>

      {/* Bottom Navigation */}
      <Box
        className="fixed left-0 w-full bg-white border-t border-blue-100 flex justify-between items-center shadow-sm z-50"
        style={{ bottom: 0, height: "60px" }}
      >
        <Button
          variant="tertiary"
          className="flex flex-col items-center flex-1 text-blue-700 hover:text-blue-900 transition-all"
          size="small"
          onClick={() => (window.location.href = "/")}
        >
          <FaHome className="text-xl mb-1" />
          <Text size="xSmall" className="font-medium">
            Trang chủ
          </Text>
        </Button>

        <Button
          variant="tertiary"
          className="flex flex-col items-center flex-1 text-blue-700 hover:text-blue-900 transition-all"
          size="small"
          onClick={() => (window.location.href = "/notification")}
        >
          <FaBell className="text-xl mb-1" />
          <Text size="xSmall" className="font-medium">
            Thông báo
          </Text>
        </Button>

        <Button
          variant="tertiary"
          className="flex flex-col items-center flex-1 text-blue-700 hover:text-blue-900 transition-all"
          size="small"
          onClick={() => (window.location.href = "/cart")}
        >
          <FaShoppingCart className="text-xl mb-1" />
          <Text size="xSmall" className="font-medium">
            Giỏ hàng
          </Text>
        </Button>

        <Button
          variant="tertiary"
          className="flex flex-col items-center flex-1 text-blue-600 transition-all"
          size="small"
          onClick={() => (window.location.href = "/profile")}
        >
          <FaUserIcon className="text-xl mb-1 text-blue-600" />
          <Text size="xSmall" className="font-semibold text-blue-600">
            Cá nhân
          </Text>
        </Button>
      </Box>
    </Page>
  );
}

export default ProfilePage;
