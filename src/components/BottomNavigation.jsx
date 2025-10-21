import { Box, Button, Text } from "zmp-ui";
import { FaHome, FaBell, FaShoppingCart, FaUser } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";

function BottomNavigation() {
  const navigate = useNavigate();

  return (
    <Box className="fixed left-0 w-full bg-white border-t flex justify-between items-center py-0 px-0 z-50 safe-area-bottom" style={{minWidth: '320px', bottom: 0, height: '56px'}}>
      <Button variant="tertiary" className="flex flex-col items-center justify-center flex-1 min-w-0 h-full font-sans" size="small" style={{height: '100%'}} onClick={() => navigate("/")}>
        <FaHome className="text-xl mb-1 mx-auto" />
        <Text size="xSmall" className="truncate w-full text-center font-sans">Trang chủ</Text>
      </Button>
      <Button variant="tertiary" className="flex flex-col items-center justify-center flex-1 min-w-0 h-full font-sans" size="small" style={{height: '100%'}} onClick={() => navigate("/notification")}>
        <FaBell className="text-xl mb-1 mx-auto" />
        <Text size="xSmall" className="truncate w-full text-center font-sans">Thông báo</Text>
      </Button>
      <Button variant="tertiary" className="flex flex-col items-center justify-center flex-1 min-w-0 h-full font-sans" size="small" style={{height: '100%'}} onClick={() => navigate("/cart")}>
        <FaShoppingCart className="text-xl mb-1 mx-auto" />
        <Text size="xSmall" className="truncate w-full text-center font-sans">Giỏ hàng</Text>
      </Button>
      <Button variant="tertiary" className="flex flex-col items-center justify-center flex-1 min-w-0 h-full font-sans" size="small" style={{height: '100%'}} onClick={() => navigate("/profile")}>
        <FaUser className="text-xl mb-1 mx-auto" />
        <Text size="xSmall" className="truncate w-full text-center font-sans">Cá nhân</Text>
      </Button>
    </Box>
  );
}

export default BottomNavigation;
