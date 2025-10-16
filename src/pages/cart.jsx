import { Page, Box, Text, Icon, Input, Button } from "zmp-ui";
import { FaHome, FaBell, FaShoppingCart, FaUser } from 'react-icons/fa';

function CartPage() {
  return (
    <Page className="bg-white min-h-screen">
      <Box className="flex items-center p-4 border-b">
        <Text.Title size="large">Giỏ hàng</Text.Title>
        <Box className="ml-auto flex gap-2">
          <Icon icon="zi-more" />
          <Icon icon="zi-close" />
        </Box>
      </Box>
      <Box className="px-4 py-2 text-center text-gray-500">Không có sản phẩm trong giỏ hàng</Box>
      <Box className="px-4 py-2">
        <Text.Title size="small">Hình thức nhận hàng</Text.Title>
        <Box className="mt-2 space-y-2">
          <Button variant="tertiary" fullWidth>Chọn cửa hàng</Button>
          <Button variant="tertiary" fullWidth>18h30 - 19h00, 09/10/2025</Button>
          <Button variant="tertiary" fullWidth>Chọn người nhận</Button>
          <Input placeholder="Nhập ghi chú..." />
        </Box>
      </Box>
      <Box className="fixed bottom-0 left-0 w-full bg-white p-4 border-t flex justify-between items-center">
        <Text>0 sản phẩm</Text>
        <Text>0đ</Text>
        <Button disabled>Đặt hàng</Button>
      </Box>
      {/* Bottom navigation buttons */}
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

export default CartPage;
