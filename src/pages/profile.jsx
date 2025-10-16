import { Page, Box, Text, Button, Icon } from "zmp-ui";
import { FaUser, FaClock, FaStar, FaPhone } from 'react-icons/fa';
import { FaHome, FaBell, FaShoppingCart, FaUser as FaUserIcon } from 'react-icons/fa';

function ProfilePage() {
  return (
    <Page className="bg-white min-h-screen">
      <Box className="flex items-center p-4 border-b">
        <Text.Title size="large">Cá nhân</Text.Title>
        <Box className="ml-auto flex gap-2">
          <Icon icon="zi-more" />
          <Icon icon="zi-close" />
        </Box>
      </Box>
      <Box className="px-4 py-2">
        <Box className="bg-green-100 rounded-xl p-3 mb-4">
          <Text.Title size="medium" className="text-green-700">Đăng ký thành viên</Text.Title>
          <Text size="small">Tích điểm đổi thưởng, mở rộng tiện ích</Text>
        </Box>
        <Box className="mb-4">
          <Text.Title size="small">Cá nhân</Text.Title>
          <Box className="mt-2 space-y-2">
            <div className="flex items-center py-3 border-b border-gray-200 last:border-b-0 cursor-pointer">
              <FaUser className="text-xl text-gray-500 mr-3" />
              <span className="flex-1 text-base">Thông tin tài khoản</span>
              <span className="text-gray-400 text-lg">&gt;</span>
            </div>
            <div className="flex items-center py-3 cursor-pointer">
              <FaClock className="text-xl text-gray-500 mr-3" />
              <span className="flex-1 text-base">Lịch sử đơn hàng</span>
              <span className="text-gray-400 text-lg">&gt;</span>
            </div>
          </Box>
        </Box>
        <Box>
          <Text.Title size="small">Khác</Text.Title>
          <Box className="mt-2 space-y-2">
            <div className="flex items-center py-3 border-b border-gray-200 last:border-b-0 cursor-pointer">
              <FaStar className="text-xl text-gray-500 mr-3" />
              <span className="flex-1 text-base">Đánh giá đơn hàng</span>
              <span className="text-gray-400 text-lg">&gt;</span>
            </div>
            <div className="flex items-center py-3 cursor-pointer">
              <FaPhone className="text-xl text-gray-500 mr-3" />
              <span className="flex-1 text-base">Liên hệ và góp ý</span>
              <span className="text-gray-400 text-lg">&gt;</span>
            </div>
          </Box>
        </Box>
      </Box>
      {/* Navigation 4 nút cố định dưới cùng - style và icon đồng nhất với các trang khác */}
      <Box className="fixed left-0 w-full bg-white border-t flex justify-between items-center py-0 px-0 z-50" style={{minWidth: '320px', bottom: 0, height: '56px'}}>
        <Button variant="tertiary" className="flex flex-col items-center flex-1 min-w-0 h-full font-sans" size="small" style={{height: '100%'}} onClick={() => window.location.href = '/'}>
          <FaHome className="text-xl mb-1" />
          <Text size="xSmall" className="truncate w-full text-center font-sans">Trang chủ</Text>
        </Button>
        <Button variant="tertiary" className="flex flex-col items-center flex-1 min-w-0 h-full font-sans" size="small" style={{height: '100%'}} onClick={() => window.location.href = '/notification'}>
          <FaBell className="text-xl mb-1" />
          <Text size="xSmall" className="truncate w-full text-center font-sans">Thông báo</Text>
        </Button>
        <Button variant="tertiary" className="flex flex-col items-center flex-1 min-w-0 h-full font-sans" size="small" style={{height: '100%'}} onClick={() => window.location.href = '/cart'}>
          <FaShoppingCart className="text-xl mb-1" />
          <Text size="xSmall" className="truncate w-full text-center font-sans">Giỏ hàng</Text>
        </Button>
        <Button variant="tertiary" className="flex flex-col items-center flex-1 min-w-0 h-full font-sans" size="small" style={{height: '100%'}} onClick={() => window.location.href = '/profile'}>
          <FaUserIcon className="text-xl mb-1" />
          <Text size="xSmall" className="truncate w-full text-center font-sans">Cá nhân</Text>
        </Button>
      </Box>
    </Page>
  );
}

export default ProfilePage;
