import { Box, Button, Icon, Page, Text, Input, Grid, Avatar, Spinner, Modal, Checkbox, Radio } from "zmp-ui";
import { FaHome, FaBell, FaShoppingCart, FaUser, FaArrowLeft } from 'react-icons/fa';
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { API_ENDPOINTS, apiHelpers } from "../config/api";

function CategoryPage() {
  const navigate = useNavigate();
  const { categoryId } = useParams();
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

  // Gọi API để lấy sản phẩm theo category
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(apiHelpers.getProductsByCategory(categoryId));
        if (!response.ok) {
          throw new Error('Không thể tải dữ liệu sản phẩm');
        }
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err.message);
        console.error('Lỗi khi tải sản phẩm:', err);
      } finally {
        setLoading(false);
      }
    };

    if (categoryId) {
      fetchProducts();
    }
  }, [categoryId]);

  // Gọi API để lấy topping cho category_id = 6
  useEffect(() => {
    const fetchToppings = async () => {
      try {
        const response = await fetch(apiHelpers.getProductsByCategory(6));
        if (response.ok) {
          const data = await response.json();
          setToppings(data);
        }
      } catch (err) {
        console.error('Lỗi khi tải topping:', err);
      }
    };

    fetchToppings();
  }, []);

  // Gọi API để lấy product_sizes
  useEffect(() => {
    const fetchProductSizes = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.PRODUCT_SIZES.BASE);
        if (response.ok) {
          const data = await response.json();
          setProductSizes(data);
        }
      } catch (err) {
        console.error('Lỗi khi tải product_sizes:', err);
      }
    };

    fetchProductSizes();
  }, []);

  // Gọi API để lấy sizes
  useEffect(() => {
    const fetchSizes = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.SIZES.BASE);
        if (response.ok) {
          const data = await response.json();
          setSizes(data);
        }
      } catch (err) {
        console.error('Lỗi khi tải sizes:', err);
      }
    };

    fetchSizes();
  }, []);

  // Gọi API để lấy tên category
  useEffect(() => {
    const fetchCategoryName = async () => {
      try {
        const response = await fetch(`${API_ENDPOINTS.CATEGORIES.BASE}/${categoryId}`);
        if (response.ok) {
          const data = await response.json();
          setCategoryName(data.name);
        }
      } catch (err) {
        console.error('Lỗi khi tải tên category:', err);
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
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    // Tự động chọn size đầu tiên và giá
    const firstSize = productSizes.find(ps => ps.product_id === product.product_id);
    if (firstSize) {
      setSelectedSize(firstSize.size_id);
      setBasePrice(firstSize.price);
    }
    setShowProductModal(true);
  };

  const handleCloseModal = () => {
    setShowProductModal(false);
    resetModal();
  };

  if (loading) {
    return (
      <Page className="flex items-center justify-center min-h-screen">
        <Box className="text-center">
          <Spinner />
          <Text className="mt-4">Đang tải sản phẩm...</Text>
        </Box>
      </Page>
    );
  }

  if (error) {
    return (
      <Page className="flex items-center justify-center min-h-screen">
        <Box className="text-center">
          <Text className="text-red-500 mb-4">{error}</Text>
          <Button onClick={() => window.location.reload()}>
            Thử lại
          </Button>
        </Box>
      </Page>
    );
  }

  return (
    <Page className="bg-gray-50 min-h-screen">
      {/* Header */}
      <Box className="bg-white shadow-sm border-b border-gray-200">
        <Box className="flex items-center justify-between p-4">
          <Button 
            variant="secondary" 
            size="small"
            onClick={() => navigate(-1)}
            className="flex items-center"
          >
            <FaArrowLeft className="mr-2" />
            Quay lại
          </Button>
          <Text.Title size="small" className="text-center flex-1">
            {categoryName || 'Danh mục'}
          </Text.Title>
          <Box className="w-16" /> {/* Spacer */}
        </Box>
      </Box>

      {/* Products Grid */}
      <Box className="p-4">
        {products.length === 0 ? (
          <Box className="text-center py-8">
            <Icon icon="zi-coffee" size={48} className="text-gray-400 mb-4" />
            <Text className="text-gray-500">Không có sản phẩm nào</Text>
          </Box>
        ) : (
          <Grid cols={2} gap={4}>
            {products.map((product) => (
              <Box 
                key={product.product_id} 
                className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 cursor-pointer"
                onClick={() => handleProductClick(product)}
              >
                {/* Product Image */}
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
                        handleProductClick(product);
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
        onClose={handleCloseModal}
        title={selectedProduct?.name || ''}
        className="max-h-[90vh] overflow-y-auto"
      >
        <Box className="p-4">
          {/* Product Image */}
          <Box className="mb-4">
            <Box className="h-48 bg-gray-100 rounded-lg flex items-center justify-center">
              {selectedProduct?.image ? (
                <img 
                  src={selectedProduct.image} 
                  alt={selectedProduct.name}
                  className="h-full w-auto object-contain"
                />
              ) : (
                <Icon icon="zi-coffee" size={48} className="text-gray-400" />
              )}
            </Box>
          </Box>

          {/* Price */}
          <Text className="text-lg font-bold text-green-600 mb-4">
            {basePrice.toLocaleString()} ₫
          </Text>

          {/* Size Selection */}
          <Box className="mb-4">
            <Text className="font-semibold mb-2">Size</Text>
            <Box className="space-y-2">
              {productSizes
                .filter(ps => ps.product_id === selectedProduct?.product_id)
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
                      label={`${size?.size_name || size?.name} ${size?.volume || ''} - ${productSize.price.toLocaleString()} ₫`}
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
              handleCloseModal();
            }}
          >
            <Icon icon="zi-shopping-cart" className="mr-2" />
            Thêm vào giỏ hàng +{basePrice.toLocaleString()} ₫
          </Button>
        </Box>
      </Modal>
    </Page>
  );
}

export default CategoryPage;