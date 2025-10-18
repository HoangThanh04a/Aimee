import { Box, Button, Icon, Page, Text, Input, Grid, Avatar } from "zmp-ui";
import { FaHome, FaBell, FaShoppingCart, FaUser } from 'react-icons/fa';
import Clock from "../components/clock";
import Logo from "../components/logo";
import bg from "../static/bg.svg";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function HomePage() {
  const [carouselIdx, setCarouselIdx] = useState(0);
  const navigate = useNavigate();
  const [products, setProducts] = useState({
    caPhe: [],
    tra: [],
    suaTuoi: [],
    nuocDongGia: [],
    doAn: [],
    combo: []
  });

  const categories = [
    { label: "Cà phê", icon: "zi-coffee", path: "caphe" },
    { label: "Trà - Trà sữa", icon: "zi-milk-tea", path: "tra" },
    { label: "Sữa tươi đặc biệt", icon: "zi-milk", path: "suatuoi" },
    { label: "Nước đồng giá", icon: "zi-cocktail", path: "nuocdonggia" },
    { label: "Đồ ăn", icon: "zi-burger", path: "doan" },
    { label: "Combo", icon: "zi-gift", path: "combo" },
  ];

  const carouselItems = [
    "Valentine: Giảm 50% cho đơn hàng trên 100K",
    "Tặng voucher 20K cho thành viên mới",
    "Combo tiết kiệm chỉ từ 49K"
  ];
  return (
    <Page className="bg-white dark:bg-black min-h-screen">
      {/* Header */}
      <Box className="flex items-center p-4">
        <Avatar src="/static/bg.svg" size={32} className="mr-2" />
        <Text.Title size="large">Aimee Coffee</Text.Title>
        <Button variant="tertiary" size="small" className="ml-auto">
          <Icon icon="zi-more" />
        </Button>
      </Box>
      {/* Search */}
      <Box className="px-4 pb-2">
        <Input placeholder="Tìm nhanh đồ uống, món mới ..." clearable />
      </Box>
      {/* Banner Carousel */}
      <Box className="px-4 pb-2">
        <Box className="rounded-xl overflow-hidden relative" style={{background: 'linear-gradient(90deg, #e2a7d3 0%, #7ecbff 100%)', minHeight: '110px'}}>
          <Box className="flex justify-center items-center h-full w-full">
            <Box className="flex w-full justify-center gap-4">
              {carouselItems.map((text, idx) => (
                <Box
                  key={idx}
                  className={`bg-white/80 rounded px-4 py-4 text-center font-bold text-lg max-w-xs cursor-pointer transition-all duration-300 ${carouselIdx === idx ? 'shadow-lg scale-105' : 'opacity-60'}`}
                  onClick={() => setCarouselIdx(idx)}
                  style={{display: carouselIdx === idx ? 'block' : 'none'}}
                >
                  {text}
                </Box>
              ))}
            </Box>
            {/* Carousel Controls */}
            <Box className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
              {carouselItems.map((_, idx) => (
                <button
                  key={idx}
                  className={`w-2 h-2 rounded-full ${carouselIdx === idx ? 'bg-blue-500' : 'bg-gray-300'}`}
                  onClick={() => setCarouselIdx(idx)}
                  aria-label={`Chuyển đến banner ${idx+1}`}
                />
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
      {/* Categories Carousel */}
      <Box className="px-4 py-2 overflow-x-auto">
        <Box className="flex gap-4" style={{ minWidth: 'max-content' }}>
          {categories.map((item, idx) => (
            <Box key={idx} className="flex flex-col items-center min-w-[80px] cursor-pointer" onClick={() => navigate(item.path)}>
              <Box className="bg-blue-100 rounded-full p-2 mb-1">
                <Icon icon={item.icon} size={32} />
              </Box>
              <Text size="small" className="text-center">{item.label}</Text>
            </Box>
          ))}
        </Box>
      </Box>
      {/* Suggestion */}
      {/* Xóa phần hiển thị các nhóm sản phẩm ở dưới */}
      {/* Bottom navigation buttons with react-icons */}
      <Box className="fixed left-0 w-full bg-white border-t flex justify-between items-center py-0 px-0 z-50" style={{minWidth: '320px', bottom: 0, height: '56px'}}>
        <Button variant="tertiary" className="flex flex-col items-center flex-1 min-w-0 h-full font-sans" size="small" style={{height: '100%'}} onClick={() => navigate("/")}> 
          <FaHome className="text-xl mb-1" />
          <Text size="xSmall" className="truncate w-full text-center font-sans">Trang chủ</Text>
        </Button>
        <Button variant="tertiary" className="flex flex-col items-center flex-1 min-w-0 h-full font-sans" size="small" style={{height: '100%'}} onClick={() => navigate("/notification")}> 
          <FaBell className="text-xl mb-1" />
          <Text size="xSmall" className="truncate w-full text-center font-sans">Thông báo</Text>
        </Button>
        <Button variant="tertiary" className="flex flex-col items-center flex-1 min-w-0 h-full font-sans" size="small" style={{height: '100%'}} onClick={() => navigate("/cart")}> 
          <FaShoppingCart className="text-xl mb-1" />
          <Text size="xSmall" className="truncate w-full text-center font-sans">Giỏ hàng</Text>
        </Button>
        <Button variant="tertiary" className="flex flex-col items-center flex-1 min-w-0 h-full font-sans" size="small" style={{height: '100%'}} onClick={() => navigate("/profile")}> 
          <FaUser className="text-xl mb-1" />
          <Text size="xSmall" className="truncate w-full text-center font-sans">Cá nhân</Text>
        </Button>
      </Box>
    </Page>
  );
}

export default HomePage;
