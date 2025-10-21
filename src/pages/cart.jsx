import { Page, Box, Text, Button, Icon } from "zmp-ui";
import { useAtom } from "jotai";
import { cartItemsAtom, removeCartItemAtom } from "../state/cart";
import { useNavigate } from "react-router-dom";

function CartPage() {
  const navigate = useNavigate();
  const [items] = useAtom(cartItemsAtom);
  const [, removeItem] = useAtom(removeCartItemAtom);

  const totalQuantity = items.reduce((sum, it) => sum + it.quantity, 0);
  const totalPrice = items.reduce((sum, it) => sum + it.unitPrice * it.quantity, 0);

  const handleRemoveItem = (itemId, productName) => {
    if (window.confirm(`Xóa "${productName}" khỏi giỏ hàng?`)) {
      removeItem(itemId);
    }
  };

  return (
    <Page className="bg-white min-h-screen no-scroll-x safe-area-top safe-area-bottom">
      {/* Header - tone xanh nhạt */}
      <Box className="bg-blue-100 border-b border-blue-200 sticky top-0 z-10 shadow-sm safe-area-top">
        <Box className="flex items-center justify-between p-4">
          <Button
            variant="tertiary"
            size="small"
            onClick={() => navigate(-1)}
            className="text-blue-700 hover:text-blue-900 rounded-full p-2"
          >
            <Icon icon="zi-arrow-left" size={22} />
          </Button>
          <Text.Title className="text-blue-900 font-semibold title-responsive">
            Giỏ hàng
          </Text.Title>
          <Box className="w-8" />
        </Box>
      </Box>

      {/* Empty Cart */}
      {items.length === 0 ? (
        <Box className="flex flex-col items-center justify-center py-20 px-4">
          <Box className="bg-blue-50 rounded-full w-28 h-28 flex items-center justify-center mb-6 shadow-inner">
            <Icon icon="zi-cart" size={56} className="text-blue-500" />
          </Box>
          <Text className="text-blue-800 font-medium text-lg mb-2">
            Giỏ hàng trống
          </Text>
          <Text size="small" className="text-blue-600/70 mb-6 text-center">
            Thêm sản phẩm yêu thích vào giỏ hàng nhé!
          </Text>
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-full transition-colors"
            onClick={() => navigate("/")}
          >
            <Icon icon="zi-plus-circle" className="mr-2" />
            Bắt đầu mua sắm
          </Button>
        </Box>
      ) : (
        <>
          {/* Cart Items */}
          <Box className="spacing-responsive space-y-3 pb-36">
            {items.map((it) => (
              <Box
                key={it.id}
                className="bg-white border border-blue-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all relative"
              >
                {/* Remove Button */}
                <Button
                  variant="tertiary"
                  size="small"
                  onClick={() => handleRemoveItem(it.id, it.product.name)}
                  className="absolute top-3 right-3 bg-blue-50 hover:bg-blue-100 rounded-full p-2"
                >
                  <Icon icon="zi-close" size={18} className="text-blue-600" />
                </Button>

                <Box className="flex gap-3">
                  {/* Product Image */}
                  <Box className="w-20 h-20 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden border border-blue-100">
                    {it.product.image ? (
                      <img
                        src={it.product.image}
                        alt={it.product.name}
                        className="w-full h-full object-cover rounded-xl"
                      />
                    ) : (
                      <Icon icon="zi-coffee" size={28} className="text-blue-400" />
                    )}
                  </Box>

                  {/* Product Info */}
                  <Box className="flex-1 pr-8">
                    <Text className="font-semibold text-blue-900 mb-1">
                      {it.product.name}
                    </Text>

                    <Box className="space-y-1 text-blue-800/80">
                      <Box className="flex items-center gap-1 text-sm">
                        <Icon icon="zi-resize" size={14} className="text-blue-500" />
                        <Text size="xSmall">Size: {it.sizeLabel}</Text>
                      </Box>

                      {it.toppings && it.toppings.length > 0 && (
                        <Box className="flex items-start gap-1 text-sm">
                          <Icon icon="zi-plus-circle" size={14} className="text-green-500 mt-0.5" />
                          <Text size="xSmall">
                            {it.toppings.map((t) => t.name).join(", ")}
                          </Text>
                        </Box>
                      )}

                      <Box className="flex items-center gap-1 text-sm">
                        <Icon icon="zi-list" size={14} className="text-blue-400" />
                        <Text size="xSmall">Số lượng: {it.quantity}</Text>
                      </Box>

                      {it.note && (
                        <Box className="flex items-start gap-1 text-sm">
                          <Icon icon="zi-note" size={14} className="text-blue-500 mt-0.5" />
                          <Text size="xSmall" className="text-blue-700 italic">
                            {it.note}
                          </Text>
                        </Box>
                      )}
                    </Box>

                    {/* Price */}
                    <Text className="font-bold text-blue-600 mt-2">
                      {(it.unitPrice * it.quantity).toLocaleString()} ₫
                    </Text>
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>

      </>
      )}
    </Page>
    );
}

export default CartPage;
