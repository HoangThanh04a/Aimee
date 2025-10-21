import React, { useEffect, useState } from "react";
import { Box, Button, Icon, Page, Text, Input, Grid, Spinner, Modal, Checkbox, Radio } from "zmp-ui";
import { useNavigate, useParams } from "react-router-dom";
import { API_ENDPOINTS, apiHelpers } from "../config/api";
import { useSetAtom } from "jotai";
import { addCartItemAtom } from "../state/cart";

function CategoryPage() {
  const navigate = useNavigate();
  const { categoryId } = useParams();
  
  // CSS để đảm bảo chỉ có 1 thanh cuộn dọc, không có thanh cuộn ngang
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .product-modal .zmp-modal-content {
        overflow: hidden !important;
      }
      .product-modal .zmp-modal-body {
        overflow: hidden !important;
      }
      .product-modal * {
        scrollbar-width: none !important;
        -ms-overflow-style: none !important;
        overflow-x: hidden !important;
      }
      .product-modal *::-webkit-scrollbar {
        display: none !important;
      }
      .product-modal *::-webkit-scrollbar:horizontal {
        display: none !important;
        height: 0 !important;
      }
      .product-modal .main-scroll {
        scrollbar-width: thin !important;
        scrollbar-color: #3B82F6 #F3F4F6 !important;
        overflow-x: hidden !important;
        overflow-y: auto !important;
      }
      .product-modal .main-scroll::-webkit-scrollbar {
        width: 6px !important;
        display: block !important;
      }
      .product-modal .main-scroll::-webkit-scrollbar:horizontal {
        display: none !important;
        height: 0 !important;
      }
      .product-modal .main-scroll::-webkit-scrollbar-track {
        background: #F3F4F6 !important;
        border-radius: 3px !important;
      }
      .product-modal .main-scroll::-webkit-scrollbar-thumb {
        background: #3B82F6 !important;
        border-radius: 3px !important;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  const addCartItem = useSetAtom(addCartItemAtom);
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
  const [categoryName, setCategoryName] = useState('');
  const [iceLevel, setIceLevel] = useState('100%');
  const [note, setNote] = useState('');
  const FETCH_TIMEOUT_MS = 12000;

  // Sử dụng API helper với retry logic
  const fetchWithRetry = apiHelpers.fetchWithRetry;

  const toNumberVnd = (value) => {
    if (typeof value === 'number') return Math.round(value);
    if (typeof value === 'string') {
      const cleaned = value.replace(/[^0-9.-]/g, '');
      const n = parseFloat(cleaned);
      return isNaN(n) ? 0 : Math.round(n);
    }
    return 0;
  };

  const formatVnd = (value) => {
    return toNumberVnd(value).toLocaleString('vi-VN');
  };

  const computeSelectedToppingsTotal = () => {
    return selectedToppings
      .map((id) => {
        const topping = toppings.find((t) => t.product_id === id);
        if (!topping) return 0;
        const prices = productSizes.filter(ps => ps.product_id === topping.product_id).map(ps => ps.price);
        const raw = topping.price ?? (prices.length ? Math.min(...prices) : 0);
        return toNumberVnd(raw);
      })
      .reduce((a, b) => a + b, 0);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const url = apiHelpers.getProductsByCategory(categoryId);
        console.log('🔄 Fetching products from:', url);
        const response = await fetchWithRetry(url);
        const data = await response.json();
        console.log('✅ Products loaded:', data.length, 'items');
        setProducts(data);
      } catch (err) {
        console.error('❌ Lỗi khi tải sản phẩm:', err);
        setError(`Không thể tải sản phẩm: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    if (categoryId) {
      fetchProducts();
    } else {
      setLoading(false);
      setError('Không xác định danh mục (categoryId).');
    }
  }, [categoryId]);

  useEffect(() => {
    const fetchToppings = async () => {
      try {
        const toppingCategoryId = categoryId === '5' ? 7 : 6;
        const url = apiHelpers.getProductsByCategory(toppingCategoryId);
        console.log('🔄 Fetching toppings from:', url);
        const response = await fetchWithRetry(url);
        const data = await response.json();
        console.log('✅ Toppings loaded:', data.length, 'items');
        setToppings(data);
      } catch (err) {
        console.error('❌ Lỗi khi tải topping/sốt:', err);
        // Không set error vì toppings là optional
      }
    };

    if (categoryId) {
      fetchToppings();
    }
  }, [categoryId]);

  useEffect(() => {
    const fetchProductSizes = async () => {
      try {
        console.log('🔄 Fetching product sizes from:', API_ENDPOINTS.PRODUCT_SIZES.BASE);
        const response = await fetchWithRetry(API_ENDPOINTS.PRODUCT_SIZES.BASE);
        const data = await response.json();
        console.log('✅ Product sizes loaded:', data.length, 'items');
        setProductSizes(data);
      } catch (err) {
        console.error('❌ Lỗi khi tải product_sizes:', err);
        // Không set error vì có thể fallback
      }
    };

    fetchProductSizes();
  }, []);

  useEffect(() => {
    const fetchSizes = async () => {
      try {
        console.log('🔄 Fetching sizes from:', API_ENDPOINTS.SIZES.BASE);
        const response = await fetchWithRetry(API_ENDPOINTS.SIZES.BASE);
        const data = await response.json();
        console.log('✅ Sizes loaded:', data.length, 'items');
        setSizes(data);
      } catch (err) {
        console.error('❌ Lỗi khi tải sizes:', err);
        // Không set error vì có thể fallback
      }
    };

    fetchSizes();
  }, []);

  useEffect(() => {
    const fetchCategoryName = async () => {
      try {
        const url = `${API_ENDPOINTS.CATEGORIES.BASE}/${categoryId}`;
        console.log('🔄 Fetching category name from:', url);
        const response = await fetchWithRetry(url);
        const data = await response.json();
        console.log('✅ Category name loaded:', data.name);
        setCategoryName(data.name);
      } catch (err) {
        console.error('❌ Lỗi khi tải tên category:', err);
        setCategoryName('Danh mục');
      }
    };

    if (categoryId) {
      fetchCategoryName();
    }
  }, [categoryId]);

  const resetModal = () => {
    setSelectedToppings([]);
    setSelectedSize(null);
    setQuantity(1);
    setBasePrice(0);
    setIceLevel('100%');
    setNote('');
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    const sizesOfProduct = productSizes.filter(ps => ps.product_id === product.product_id);
    if (sizesOfProduct.length > 0) {
      const lowest = sizesOfProduct.reduce((min, ps) => (ps.price < min.price ? ps : min), sizesOfProduct[0]);
      setSelectedSize(lowest.size_id);
      setBasePrice(lowest.price);
    } else {
      setSelectedSize(null);
      setBasePrice(0);
    }
    setShowProductModal(true);
  };

  const handleCloseModal = () => {
    setShowProductModal(false);
    resetModal();
  };

  if (loading) {
    return (
      <Page className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <Box className="text-center">
          <Spinner className="text-blue-600" />
          <Text className="mt-4 text-gray-600">Đang tải sản phẩm...</Text>
        </Box>
      </Page>
    );
  }

  if (error) {
    return (
      <Page className="flex items-center justify-center min-h-screen bg-gradient-to-b from-red-50 to-white">
        <Box className="text-center p-6">
          <Icon icon="zi-close-circle" size={64} className="text-red-500 mx-auto mb-4" />
          <Text className="text-red-600 mb-4 text-lg">{error}</Text>
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
    <Page className="bg-gradient-to-b from-gray-50 to-white min-h-screen no-scroll-x safe-area-top safe-area-bottom">
      {/* Header với gradient */}
      <Box className="bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg sticky top-0 z-10 safe-area-top">
        <Box className="flex items-center justify-between p-4">
          <Button 
            variant="tertiary"
            size="small"
            onClick={() => navigate(-1)}
            className="text-white hover:bg-white/20 rounded-full p-2"
          >
            <Icon icon="zi-arrow-left" size={24} />
          </Button>
          <Text.Title className="text-white font-bold title-responsive">
            {categoryName || 'Danh mục'}
          </Text.Title>
          <Button
            variant="tertiary"
            size="small"
            onClick={() => navigate('/cart')}
            className="text-white hover:bg-white/20 rounded-full p-2"
          >
            <Icon icon="zi-cart" size={24} />
          </Button>
        </Box>
      </Box>

      {/* Products Grid */}
      <Box className="spacing-responsive">
        {products.length === 0 ? (
          <Box className="text-center py-16">
            <Box className="bg-blue-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
              <Icon icon="zi-coffee" size={48} className="text-blue-500" />
            </Box>
            <Text className="text-gray-500 text-responsive">Không có sản phẩm nào</Text>
          </Box>
        ) : (
          <Grid cols={2} gap={4} className="grid-responsive">
            {products.map((product) => (
              <Box 
                key={product.product_id} 
                className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 cursor-pointer transform transition-all duration-200 hover:scale-105 hover:shadow-xl"
                onClick={() => handleProductClick(product)}
              >
                {/* Product Image với gradient overlay */}
                <Box className="h-32 bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center relative overflow-hidden">
                  {product.image ? (
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="h-full w-auto object-contain"
                    />
                  ) : (
                    <Icon icon="zi-coffee" size={32} className="text-blue-300" />
                  )}
                  <Box className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1">
                    <Icon icon="zi-star" size={12} className="text-yellow-500" />
                  </Box>
                </Box>
                
                {/* Product Info */}
                <Box className="p-3">
                  <Text.Title size="small" className="mb-1 font-bold line-clamp-2 text-gray-800">
                    {product.name}
                  </Text.Title>
                  
                  {product.description && (
                    <Text size="xSmall" className="text-gray-500 mb-3 line-clamp-2">
                      {product.description}
                    </Text>
                  )}
                  
                  <Button 
                    size="small" 
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg py-2 flex items-center justify-center hover:from-blue-700 hover:to-purple-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleProductClick(product);
                    }}
                  >
                    <Icon icon="zi-plus-circle" size={18} className="mr-2" />
                    Thêm vào giỏ
                  </Button>
                </Box>
              </Box>
            ))}
          </Grid>
        )}
      </Box>

      {/* Product Detail Modal */}
      <Modal
        visible={showProductModal}
        onClose={handleCloseModal}
        title=""
        className="product-modal"
      >
        <Box 
          className="max-h-[85vh] overflow-y-auto overflow-x-hidden main-scroll"
        >
          {/* Product Image Header */}
          <Box className="relative">
            <Box className="h-48 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
              {selectedProduct?.image ? (
                <img 
                  src={selectedProduct.image} 
                  alt={selectedProduct.name}
                  className="h-full w-auto object-contain"
                />
              ) : (
                <Icon icon="zi-coffee" size={48} className="text-blue-400" />
              )}
            </Box>
            <Button
              variant="tertiary"
              size="small"
              onClick={handleCloseModal}
              className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg"
            >
              <Icon icon="zi-close" size={24} />
            </Button>
          </Box>

          <Box className="p-4">
            {/* Product Name & Price */}
            <Box className="mb-4">
              <Text.Title className="font-bold text-xl mb-2 text-gray-800">
                {selectedProduct?.name}
              </Text.Title>
              <Box className="flex items-center gap-2">
                <Text className="text-2xl font-bold text-blue-600">
                  {formatVnd(basePrice)} ₫
                </Text>
                {selectedProduct?.description && (
                  <Text size="xSmall" className="text-gray-500 line-clamp-2">
                    {selectedProduct.description}
                  </Text>
                )}
              </Box>
            </Box>

            {/* Size Selection */}
            <Box className="mb-4 bg-gray-50 rounded-xl p-4">
              <Text className="font-bold mb-3 flex items-center text-gray-800">
                <Icon icon="zi-resize" className="mr-2 text-blue-600" />
                Chọn size
              </Text>
              <Box className="space-y-2" style={{ overflow: 'visible' }}>
                {productSizes
                  .filter(ps => ps.product_id === selectedProduct?.product_id)
                  .map((productSize) => {
                    const size = sizes.find(s => s.size_id === productSize.size_id);
                    return (
                      <Box 
                        key={productSize.size_id} 
                        className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                          selectedSize === productSize.size_id 
                            ? 'border-blue-600 bg-blue-50' 
                            : 'border-gray-200 hover:border-blue-300'
                        }`}
                        onClick={() => {
                          setSelectedSize(productSize.size_id);
                          setBasePrice(toNumberVnd(productSize.price));
                        }}
                      >
                        <Radio
                          checked={selectedSize === productSize.size_id}
                          label={`${size?.size_name || size?.name} ${size?.volume || ''} - ${formatVnd(productSize.price)} ₫`}
                        />
                      </Box>
                    );
                  })}
              </Box>
            </Box>

            {/* Ice Level */}
            <Box className="mb-4 bg-gray-50 rounded-xl p-4">
              <Text className="font-bold mb-3 flex items-center text-gray-800">
                <Icon icon="zi-snowflake" className="mr-2 text-blue-600" />
                Lượng đá
              </Text>
              <Box className="flex gap-2">
                {['100%','75%','50%','25%','0%'].map((level) => (
                  <Button
                    key={level}
                    size="small"
                    onClick={() => setIceLevel(level)}
                    className={`flex-1 rounded-lg font-semibold transition-all ${
                      iceLevel === level 
                        ? 'bg-blue-600 text-white shadow-lg' 
                        : 'bg-white text-gray-600 border border-gray-200'
                    }`}
                  >
                    {level}
                  </Button>
                ))}
              </Box>
            </Box>

            {/* Toppings */}
            {toppings.length > 0 && (
              <Box className="mb-4 bg-gray-50 rounded-xl p-4">
                <Text className="font-bold mb-3 flex items-center text-gray-800">
                  <Icon icon="zi-plus-circle" className="mr-2 text-blue-600" />
                  {categoryId === '5' ? 'Chọn sốt' : 'Chọn topping'}
                </Text>
                <Box className="space-y-2" style={{ overflow: 'visible' }}>
                  {toppings.map((topping) => {
                    const toppingPrices = productSizes
                      .filter(ps => ps.product_id === topping.product_id)
                      .map(ps => ps.price);
                    const resolvedToppingPrice = toNumberVnd(topping.price ?? (toppingPrices.length ? Math.min(...toppingPrices) : 0));
                    return (
                      <Box 
                        key={topping.product_id} 
                        className={`flex items-center justify-between p-3 rounded-lg border-2 cursor-pointer transition-all ${
                          selectedToppings.includes(topping.product_id)
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-200 hover:border-green-300'
                        }`}
                        onClick={() => {
                          setSelectedToppings((prev) => {
                            if (prev.includes(topping.product_id)) {
                              return prev.filter((id) => id !== topping.product_id);
                            }
                            return [...prev, topping.product_id];
                          });
                        }}
                      >
                        <Checkbox
                          checked={selectedToppings.includes(topping.product_id)}
                          label={topping.name}
                        />
                        <Text className="text-green-600 font-bold">
                          +{formatVnd(resolvedToppingPrice)} ₫
                        </Text>
                      </Box>
                    );
                  })}
                </Box>
              </Box>
            )}

            {/* Quantity */}
            <Box className="mb-4 bg-gray-50 rounded-xl p-4">
              <Text className="font-bold mb-3 flex items-center text-gray-800">
                <Icon icon="zi-list" className="mr-2 text-blue-600" />
                Số lượng
              </Text>
              <Box className="flex items-center justify-center gap-6">
                <Button 
                  size="large"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-12 h-12 rounded-full bg-white border-2 border-blue-600 text-blue-600 font-bold text-xl shadow-md hover:bg-blue-50"
                >
                  −
                </Button>
                <Text className="text-3xl font-bold text-blue-600 min-w-[60px] text-center">
                  {quantity}
                </Text>
                <Button 
                  size="large"
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-12 h-12 rounded-full bg-blue-600 text-white font-bold text-xl shadow-md hover:bg-blue-700"
                >
                  +
                </Button>
              </Box>
            </Box>

            {/* Note */}
            <Box className="mb-4">
              <Text className="font-bold mb-2 flex items-center text-gray-800">
                <Icon icon="zi-note" className="mr-2 text-blue-600" />
                Ghi chú
              </Text>
              <Input
                placeholder="Thêm yêu cầu đặc biệt..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full rounded-lg border-2 border-gray-200 focus:border-blue-600 p-3"
              />
            </Box>

            {/* Add to Cart Button */}
            <Button 
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 text-lg font-bold rounded-xl shadow-lg flex items-center justify-center"
              onClick={() => {
                if (!selectedProduct) return;
                const currentSize = sizes.find(s => s.size_id === selectedSize);
                const toppingDetails = toppings
                  .filter(t => selectedToppings.includes(t.product_id))
                  .map(t => {
                    const tp = productSizes.filter(ps => ps.product_id === t.product_id).map(ps => ps.price);
                    const raw = t.price ?? (tp.length ? Math.min(...tp) : 0);
                    const price = toNumberVnd(raw);
                    return { productId: t.product_id, name: t.name, price };
                  });
                const toppingsTotal = toppingDetails.reduce((sum, t) => sum + toNumberVnd(t.price), 0);
                const unitPrice = toNumberVnd(basePrice) + toppingsTotal;
                addCartItem({
                  id: `${selectedProduct.product_id}-${selectedSize}-${Date.now()}`,
                  product: selectedProduct,
                  sizeId: selectedSize,
                  sizeLabel: currentSize ? `${currentSize.size_name || currentSize.name}` : '',
                  unitPrice,
                  quantity,
                  toppings: toppingDetails,
                  note: note.trim(),
                });
                handleCloseModal();
                navigate('/cart');
              }}
            >
              <Icon icon="zi-cart" size={24} className="mr-2" />
              Thêm vào giỏ • {formatVnd((toNumberVnd(basePrice) + computeSelectedToppingsTotal()) * quantity)} ₫
            </Button>
          </Box>
        </Box>
      </Modal>
    </Page>
  );
}

export default CategoryPage;