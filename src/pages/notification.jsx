import { Page, Box, Text, Icon, Button } from "zmp-ui";
import { FaHome, FaBell, FaShoppingCart, FaUser } from 'react-icons/fa';

function NotificationPage() {
  return (
    <Page className="bg-white min-h-screen">
      <Box className="flex items-center p-4 border-b">
        <Text.Title size="large">Thông báo</Text.Title>
        <Box className="ml-auto flex gap-2">
          <Icon icon="zi-more" />
          <Icon icon="zi-close" />
        </Box>
      </Box>
      <Box className="px-4 py-2">
        <Box className="flex items-center gap-2 py-2 border-b">
          <Icon icon="zi-coffee" size={32} />
          <Box>
            <Text.Title size="small">Chào bạn mới</Text.Title>
            <Text size="xSmall">Cảm ơn đã sử dụng Aimee Coffee, bạn có thể dùng ...</Text>
          </Box>
        </Box>
        <Box className="flex items-center gap-2 py-2 border-b">
          <Icon icon="zi-coffee" size={32} />
          <Box>
            <Text.Title size="small">Giảm 50% lần đầu mua hàng</Text.Title>
            <Text size="xSmall">Nhập WELCOME để được giảm 50% giá trị đơn ...</Text>
          </Box>
        </Box>
      </Box>
      {/* Bottom navigation buttons with react-icons */}
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
          <FaUser className="text-xl mb-1" />
          <Text size="xSmall" className="truncate w-full text-center font-sans">Cá nhân</Text>
        </Button>
      </Box>
    </Page>
  );
}

export default NotificationPage;
