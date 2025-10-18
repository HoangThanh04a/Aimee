import { Box, Button, Icon, Page, Text, Input, Grid, Avatar, Spinner, Modal, Checkbox, Radio } from "zmp-ui";
import { FaHome, FaBell, FaShoppingCart, FaUser, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { API_ENDPOINTS, apiHelpers } from "../config/api";

function CategoryCaphePage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [toppings, setToppings] = useState([]);
  const [selectedToppings, setSelectedToppings] = useState([]);
  const [productSizes, setProductSizes] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [basePrice, setBasePrice] = useState(0);

  // Gọi API để lấy sản phẩm cà phê (category_id = 1)
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(apiHelpers.getProductsByCategory(1));
        if (!response.ok) {
          throw new Error('Không thể tải dữ liệu sản phẩm');
        }
        const data = await response.json();
        // Lọc sản phẩm có category_id = 1 (Cà phê)
        const coffeeProducts = data.filter(product => product.category_id === 1);
        setProducts(coffeeProducts);
      } catch (err) {
        setError(err.message);
        console.error('Lỗi khi tải sản phẩm:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Gọi API để lấy topping cho category_id = 6
  useEffect(() => {
    const fetchToppings = async () => {
      try {
        const response = await fetch(apiHelpers.getProductsByCategory(1));
        if (response.ok) {
          const data = await response.json();
          // Lấy sản phẩm có category_id = 6 (Topping)
          const toppingProducts = data.filter(p => p.category_id === 6);
          if (toppingProducts.length > 0) {
            setToppings(toppingProducts);
          } else {
            // Fallback mock data nếu không có category_id = 6
            const mockToppings = [
              { product_id: 1, name: "Trân Châu Khoai Môn - 小芋圓", price: 5000 },
              { product_id: 2, name: "Kem Cheese - 朵朵奶蓋", price: 7000 },
              { product_id: 3, name: "Thạch Sương Sáo Viên (8) - 黑色仙草凍 (8粒)", price: 5000 },
              { product_id: 4, name: "Thạch Sữa Viên (8) - 白色牛奶凍 (8粒)", price: 7000 },
              { product_id: 5, name: "Trân Châu Đường Đen - 黑糖珍珠", price: 5000 }
            ];
            setToppings(mockToppings);
          }
        }
      } catch (err) {
        console.error('Lỗi khi tải topping:', err);
      }
    };

    fetchToppings();
  }, []);

  // Gọi API để lấy sizes và product_sizes
  useEffect(() => {
    const fetchSizesAndProductSizes = async () => {
      try {
        // Gọi API sizes
        const sizesResponse = await fetch(API_ENDPOINTS.SIZES.BASE);
        if (sizesResponse.ok) {
          const sizesData = await sizesResponse.json();
          setSizes(sizesData);
        }

        // Gọi API product_sizes
        const productSizesResponse = await fetch(API_ENDPOINTS.PRODUCT_SIZES.BASE);
        if (productSizesResponse.ok) {
          const productSizesData = await productSizesResponse.json();
          setProductSizes(productSizesData);
        }
      } catch (err) {
        console.error('Lỗi khi tải sizes và product_sizes:', err);
      }
    };

    fetchSizesAndProductSizes();
  }, []);

  return (
    <Page className="bg-white dark:bg-black min-h-screen">
      {/* Header */}
      <Box className="flex items-center p-4">
        <Button 
          variant="tertiary" 
          size="small" 
          className="mr-2"
          onClick={() => navigate("/")}
        >
          <FaArrowLeft className="text-lg" />
        </Button>
        <Text.Title size="large">Cà phê</Text.Title>
        <Button variant="tertiary" size="small" className="ml-auto">
          <Icon icon="zi-more" />
        </Button>
      </Box>

      {/* Search */}
      <Box className="px-4 pb-2">
        <Input placeholder="Tìm kiếm cà phê..." clearable />
      </Box>

      {/* Content */}
      <Box className="px-4 pb-20">
        {loading ? (
          <Box className="flex justify-center items-center py-8">
            <Spinner />
            <Text className="ml-2">Đang tải sản phẩm...</Text>
          </Box>
        ) : error ? (
          <Box className="text-center py-8">
            <Text className="text-red-500">Lỗi: {error}</Text>
            <Button 
              className="mt-4" 
              onClick={() => window.location.reload()}
            >
              Thử lại
            </Button>
          </Box>
        ) : products.length === 0 ? (
          <Box className="text-center py-8">
            <Text>Không có sản phẩm cà phê nào</Text>
          </Box>
        ) : (
          <Grid cols={2} gap={4}>
            {products.map((product) => (
              <Box 
                key={product.product_id} 
                className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 cursor-pointer"
                onClick={() => {
                  setSelectedProduct(product);
                  // Tự động chọn size đầu tiên và giá
                  const firstSize = productSizes.find(ps => ps.product_id === product.product_id);
                  if (firstSize) {
                    setSelectedSize(firstSize.size_id);
                    setBasePrice(firstSize.price);
                  }
                  setShowProductModal(true);
                }}
              >
                {/* Product Image - Làm nhỏ hơn */}
                <Box className="h-32 bg-gray-100 flex items-center justify-center">
                  {product.image ? (
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="h-full w-auto object-contain"
                    />
                  ) : (
                    <Icon icon="zi-coffee" size={32} className="text-gray-400" />
                  )}
                </Box>
                
                {/* Product Info */}
                <Box className="p-3">
                  <Text.Title size="small" className="mb-1 line-clamp-2">
                    {product.name}
                  </Text.Title>
                  
                  {product.description && (
                    <Text size="xSmall" className="text-gray-600 mb-2 line-clamp-2">
                      {product.description}
                    </Text>
                  )}
                  
                  <Box className="flex justify-between items-center">
                    <Text className="font-bold text-green-600">
                      Thêm vào giỏ hàng
                    </Text>
                    <Button 
                      size="small" 
                      className="bg-blue-500 text-white"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedProduct(product);
                        // Tự động chọn size đầu tiên và giá
                        const firstSize = productSizes.find(ps => ps.product_id === product.product_id);
                        if (firstSize) {
                          setSelectedSize(firstSize.size_id);
                          setBasePrice(firstSize.price);
                        }
                        setShowProductModal(true);
                      }}
                    >
                      <Icon icon="zi-plus" size={16} />
                    </Button>
                  </Box>
                </Box>
              </Box>
            ))}
          </Grid>
        )}
      </Box>

      {/* Product Detail Modal */}
      <Modal
        visible={showProductModal}
        onClose={() => setShowProductModal(false)}
        title=""
        className="product-detail-modal"
      >
        {selectedProduct && (
          <Box className="bg-white">
            {/* Product Image - Giống hình 1 */}
            <Box className="relative bg-yellow-200 flex items-center justify-center py-4">
              {selectedProduct.image ? (
                <img 
                  src={selectedProduct.image} 
                  alt={selectedProduct.name}
                  className="w-full h-auto object-contain"
                />
              ) : (
                <Icon icon="zi-coffee" size={80} className="text-gray-400" />
              )}
              <Box className="absolute bottom-2 right-2 bg-white px-2 py-1 rounded text-xs">
                1/1
              </Box>
            </Box>

            {/* Product Info */}
            <Box className="p-4">
              <Text.Title size="large" className="mb-2">
                {selectedProduct.name}
              </Text.Title>
              
              <Text className="text-lg font-bold text-green-600 mb-4">
                {basePrice.toLocaleString()} ₫
              </Text>

              {/* Size Selection */}
              <Box className="mb-4">
                <Text className="font-semibold mb-2">Size</Text>
                <Box className="space-y-2">
                  {productSizes
                    .filter(ps => ps.product_id === selectedProduct.product_id)
                    .map((productSize) => {
                      const size = sizes.find(s => s.size_id === productSize.size_id);
                      return (
                        <Radio
                          key={productSize.size_id}
                          checked={selectedSize === productSize.size_id}
                          onChange={() => {
                            setSelectedSize(productSize.size_id);
                            setBasePrice(productSize.price);
                          }}
                          label={`${size?.name} ${size?.volume} - ${productSize.price.toLocaleString()} ₫`}
                        />
                      );
                    })}
                </Box>
              </Box>

              {/* Ice Selection */}
              <Box className="mb-4">
                <Text className="font-semibold mb-2">Lượng Đá</Text>
                <Button variant="secondary" className="w-full justify-between bg-gray-100 border-gray-300">
                  Chọn 1
                  <Icon icon="zi-chevron-down" />
                </Button>
              </Box>

              {/* Quantity */}
              <Box className="mb-4">
                <Text className="font-semibold mb-2">Số lượng</Text>
                <Box className="flex items-center justify-between">
                  <Button 
                    size="small" 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-full"
                  >
                    -
                  </Button>
                  <Text className="text-lg font-semibold">{quantity}</Text>
                  <Button 
                    size="small" 
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 rounded-full"
                  >
                    +
                  </Button>
                </Box>
              </Box>

              {/* Toppings Selection */}
              <Box className="mb-6">
                <Text className="font-semibold mb-3">Topping</Text>
                <Box className="space-y-2">
                  {toppings.map((topping) => (
                    <Box key={topping.product_id} className="flex items-center justify-between py-2 border-b border-gray-100">
                      <Checkbox
                        checked={selectedToppings.includes(topping.product_id)}
                        onChange={(checked) => {
                          if (checked) {
                            setSelectedToppings([...selectedToppings, topping.product_id]);
                          } else {
                            setSelectedToppings(selectedToppings.filter(id => id !== topping.product_id));
                          }
                        }}
                        label={topping.name}
                      />
                      <Text className="text-green-600 font-semibold">
                        +{(topping.price || 0).toLocaleString()} ₫
                      </Text>
                    </Box>
                  ))}
                </Box>
              </Box>

              {/* Add to Cart Button */}
              <Button 
                className="w-full bg-blue-500 text-white py-3 text-lg font-semibold"
                onClick={() => {
                  // Logic thêm vào giỏ hàng
                  console.log('Added to cart:', {
                    product: selectedProduct,
                    size: selectedSize,
                    quantity,
                    toppings: selectedToppings,
                    basePrice
                  });
                  setShowProductModal(false);
                }}
              >
                <Icon icon="zi-shopping-cart" className="mr-2" />
                Thêm vào giỏ hàng +{basePrice.toLocaleString()} ₫
              </Button>
            </Box>
          </Box>
        )}
      </Modal>

      {/* Bottom navigation */}
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

export default CategoryCaphePage;
