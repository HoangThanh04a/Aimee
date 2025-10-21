import { Box, Icon, Page, Text } from "zmp-ui";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import DebugInfo from "../components/DebugInfo";

function HomePage() {
  const [carouselIdx, setCarouselIdx] = useState(0);
  const navigate = useNavigate();

  const categories = [
    { id: 1, label: "Cà phê", icon: "zi-coffee" },
    { id: 2, label: "Trà ", icon: "zi-milk-tea" },
    { id: 3, label: "Sữa tươi", icon: "zi-milk" },
    { id: 4, label: "Nước đồng giá", icon: "zi-cocktail" },
    { id: 5, label: "Đồ ăn", icon: "zi-burger" },
    { id: 6, label: "Combo", icon: "zi-gift" },
  ];

  const carouselItems = [
    { 
      text: "Khám phá hương vị mới", 
      subtext: "Thức uống tươi ngon mỗi ngày",
      icon: "zi-coffee"
    },
    { 
      text: "Giao hàng tận nơi", 
      subtext: "Nhanh chóng và tiện lợi",
      icon: "zi-delivery"
    },
    { 
      text: "Ưu đãi mỗi tuần", 
      subtext: "Thưởng thức với giá tốt nhất",
      icon: "zi-star"
    }
  ];

  // Auto-scroll carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCarouselIdx((prev) => (prev + 1) % carouselItems.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Page className="bg-white min-h-screen no-scroll-x safe-area-top safe-area-bottom">
      {/* Header */}
      <Box className="bg-blue-100 p-4 shadow-sm">
        <Box className="flex items-center">
          <Box className="bg-blue-500 rounded-full p-2 mr-3">
            <Icon icon="zi-coffee" size={28} className="text-white" />
          </Box>
          <Box>
            <Text.Title className="text-blue-800 font-bold text-xl">
              Aimee Coffee
            </Text.Title>
            <Text size="xSmall" className="text-blue-700/70">
              Thức uống tươi – vị ngon mỗi ngày
            </Text>
          </Box>
        </Box>

        {/* Search bar */}
        <Box className="relative mt-4">
          <Icon
            icon="zi-search"
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Tìm kiếm đồ uống, món ăn..."
            className="w-full pl-12 pr-4 py-3 rounded-full bg-white shadow-sm outline-none text-sm border border-gray-100 focus:ring-2 focus:ring-blue-200"
          />
        </Box>
      </Box>

      {/* Carousel */}
      <Box className="px-4 py-5">
        <Box className="relative rounded-2xl overflow-hidden bg-blue-50 border border-blue-100 shadow-sm" style={{ height: "160px" }}>
          {carouselItems.map((item, idx) => (
            <Box
              key={idx}
              className={`absolute inset-0 flex flex-col items-center justify-center text-center text-blue-900 transition-all duration-700 ease-in-out`}
              style={{
                opacity: carouselIdx === idx ? 1 : 0,
                transform: carouselIdx === idx ? "scale(1)" : "scale(1.05)",
              }}
            >
              <Icon icon={item.icon} size={48} className="mb-3 text-blue-500" />
              <Text className="text-2xl font-semibold mb-1">{item.text}</Text>
              <Text size="small" className="text-blue-700/70">{item.subtext}</Text>
            </Box>
          ))}

          {/* Dots */}
          <Box className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
            {carouselItems.map((_, idx) => (
              <button
                key={idx}
                className={`h-2 rounded-full transition-all duration-300 ${
                  carouselIdx === idx ? "bg-blue-500 w-6" : "bg-blue-200 w-2"
                }`}
                onClick={() => setCarouselIdx(idx)}
              />
            ))}
          </Box>
        </Box>
      </Box>

      {/* Categories */}
      <Box className="px-4 py-2">
        <Text.Title className="font-bold text-blue-900 mb-3 flex items-center">
          <Icon icon="zi-list" className="mr-2 text-blue-500" />
          Danh mục
        </Text.Title>

        <Box className="grid grid-cols-3 gap-3">
          {categories.map((item) => (
            <Box
              key={item.id}
              className="cursor-pointer transform transition-all duration-200 hover:scale-105 active:scale-95 text-center"
              onClick={() => navigate(`/category/${item.id}`)}
            >
              <Box className="bg-blue-50 rounded-xl p-5 shadow-sm border border-blue-100 flex items-center justify-center">
                <Icon icon={item.icon} size={32} className="text-blue-500" />
              </Box>
              <Text size="small" className="text-blue-900 mt-2 font-medium">
                {item.label}
              </Text>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Debug Info - Remove this after fixing */}
      <DebugInfo />

      {/* Bottom Spacing */}
      <Box className="h-16" />
    </Page>
  );
}

export default HomePage;
