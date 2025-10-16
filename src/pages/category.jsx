import { Page, Box, Text } from "zmp-ui";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function CategoryPage() {
  const { type } = useParams(); // ví dụ: "caphe", "tra", "combo", "doan", ...
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!type) return;
    const apiUrl = `https://zalo-api.onrender.com/api/products?search=${type}`; // ⚠️ Thay URL bằng API Render thật của bạn
    fetch(apiUrl)
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Lỗi tải sản phẩm:", err));
  }, [type]);

  const getCategoryName = (key) => {
    switch (key) {
      case "caphe":
        return "Cà phê";
      case "tra":
        return "Trà - Trà sữa";
      case "combo":
        return "Combo";
      case "doan":
        return "Đồ ăn";
      case "suatuoi":
        return "Sữa tươi đặc biệt";
      case "nuocdonggia":
        return "Nước đồng giá";
      default:
        return "Sản phẩm";
    }
  };

  return (
    <Page className="bg-white min-h-screen">
      <Box className="p-4">
        <Text.Title size="large">{getCategoryName(type)}</Text.Title>

        <Box className="grid grid-cols-2 gap-4 mt-4">
          {products.map((sp, idx) => (
            <Box
              key={idx}
              className="bg-white rounded-xl border p-2 text-center"
            >
              {sp.image ? (
                <img
                  src={sp.image}
                  alt={sp.name}
                  className="w-full h-40 object-cover rounded-xl mb-2 cursor-pointer"
                  onClick={() => navigate(`/product/${sp.id}`)}
                />
              ) : (
                <Box className="w-full h-40 bg-gray-100 rounded-xl mb-2" />
              )}
              <Text size="medium" className="font-bold">
                {sp.name}
              </Text>
              {sp.price && (
                <Text size="small" className="text-gray-600">
                  {sp.price}đ
                </Text>
              )}
            </Box>
          ))}
        </Box>
      </Box>
    </Page>
  );
}

export default CategoryPage;
