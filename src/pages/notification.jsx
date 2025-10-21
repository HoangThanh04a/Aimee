import { Page, Box, Text, Icon, Button } from "zmp-ui";
import { FaHome, FaBell, FaShoppingCart, FaUser } from 'react-icons/fa';

function NotificationPage() {
  return (
    <Page className="bg-white min-h-screen">
      {/* Header */}
      <Box className="bg-blue-100 px-4 py-3 flex items-center justify-between border-b border-blue-200 shadow-sm">
        <Text.Title size="large" className="text-blue-900 font-semibold">
          Thông báo
        </Text.Title>
        <Box className="flex gap-3 text-blue-700">
          <Icon icon="zi-more" size={20} className="cursor-pointer hover:text-blue-900 transition-colors" />
          <Icon icon="zi-close" size={20} className="cursor-pointer hover:text-blue-900 transition-colors" />
        </Box>
      </Box>

      {/* Notification List */}
      <Box className="px-4 py-4 space-y-3">
        <Box className="flex items-start gap-3 p-3 bg-blue-50 rounded-xl border border-blue-100 shadow-sm hover:shadow-md transition-all">
          <Box className="bg-blue-500 rounded-full p-2 flex items-center justify-center">
            <Icon icon="zi-coffee" size={24} className="text-white" />
          </Box>
          <Box>
            <Text.Title size="small" className="text-blue-900 font-semibold">
              Chào bạn mới
            </Text.Title>
            <Text size="xSmall" className="text-blue-700/80 leading-snug">
              Cảm ơn bạn đã sử dụng Aimee Coffee! Bắt đầu hành trình thưởng thức hương vị mới ngay hôm nay ☕
            </Text>
          </Box>
        </Box>

        <Box className="flex items-start gap-3 p-3 bg-blue-50 rounded-xl border border-blue-100 shadow-sm hover:shadow-md transition-all">
          <Box className="bg-blue-500 rounded-full p-2 flex items-center justify-center">
            <Icon icon="zi-discount" size={24} className="text-white" />
          </Box>
          <Box>
            <Text.Title size="small" className="text-blue-900 font-semibold">
              Giảm 50% cho đơn đầu tiên
            </Text.Title>
            <Text size="xSmall" className="text-blue-700/80 leading-snug">
              Nhập mã <span className="font-semibold text-blue-800">WELCOME</span> để được giảm 50% giá trị đơn hàng đầu tiên.
            </Text>
          </Box>
        </Box>

        <Box className="flex items-start gap-3 p-3 bg-blue-50 rounded-xl border border-blue-100 shadow-sm hover:shadow-md transition-all">
          <Box className="bg-blue-500 rounded-full p-2 flex items-center justify-center">
            <Icon icon="zi-gift" size={24} className="text-white" />
          </Box>
          <Box>
            <Text.Title size="small" className="text-blue-900 font-semibold">
              Ưu đãi cuối tuần
            </Text.Title>
            <Text size="xSmall" className="text-blue-700/80 leading-snug">
              Mua 2 tặng 1 cho tất cả đồ uống — chỉ áp dụng đến hết Chủ Nhật này 🎉
            </Text>
          </Box>
        </Box>
      </Box>

      {/* Bottom Navigation */}
      <Box className="fixed bottom-0 left-0 w-full bg-white border-t border-blue-100 flex justify-between items-center shadow-sm z-50" style={{ height: '60px' }}>
        {[
          { icon: <FaHome />, label: "Trang chủ", link: "/" },
          { icon: <FaBell />, label: "Thông báo", link: "/notification" },
          { icon: <FaShoppingCart />, label: "Giỏ hàng", link: "/cart" },
          { icon: <FaUser />, label: "Cá nhân", link: "/profile" },
        ].map((item, idx) => (
          <Button
            key={idx}
            variant="tertiary"
            className="flex flex-col items-center justify-center flex-1 text-blue-700 hover:text-blue-900 transition-all duration-200 font-sans"
            size="small"
            style={{ height: "100%" }}
            onClick={() => (window.location.href = item.link)}
          >
            <Box className={`text-xl mb-1 ${idx === 1 ? "text-blue-600" : ""}`}>
              {item.icon}
            </Box>
            <Text size="xSmall" className={`truncate text-center font-medium ${idx === 1 ? "text-blue-600" : ""}`}>
              {item.label}
            </Text>
          </Button>
        ))}
      </Box>
    </Page>
  );
}

export default NotificationPage;
