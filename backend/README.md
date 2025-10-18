# Aimee Coffee Backend API

## Cấu hình Environment Variables

Tạo file `.env` trong thư mục `backend/` với nội dung sau:

```env
# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/DB

# Server Configuration
PORT=4000
NODE_ENV=development

# API Base URLs
API_BASE_URL=http://localhost:4000/api

# Frontend URLs
FRONTEND_URL=http://localhost:3000

# File Upload Configuration
UPLOAD_DIR=../src/static
MAX_FILE_SIZE=5242880

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# JWT Configuration (if needed later)
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=24h

# Pagination Defaults
DEFAULT_PAGE_SIZE=20
MAX_PAGE_SIZE=100
```

## Cài đặt và chạy

```bash
# Cài đặt dependencies
npm install

# Chạy server
npm start

# Chạy với auto-reload (development)
npm run dev
```

## API Endpoints

### Categories
- `GET /api/categories` - Lấy danh sách categories
- `GET /api/categories/search?q=keyword` - Tìm kiếm categories
- `GET /api/categories/:id` - Lấy category theo ID
- `POST /api/categories` - Tạo category mới
- `PUT /api/categories/:id` - Cập nhật category
- `DELETE /api/categories/:id` - Xóa category

### Sizes
- `GET /api/sizes` - Lấy danh sách sizes
- `GET /api/sizes/search?q=keyword` - Tìm kiếm sizes
- `GET /api/sizes/:id` - Lấy size theo ID
- `POST /api/sizes` - Tạo size mới
- `PUT /api/sizes/:id` - Cập nhật size
- `DELETE /api/sizes/:id` - Xóa size

### Products
- `GET /api/products` - Lấy danh sách products
- `GET /api/products?category_id=1` - Lấy products theo category
- `GET /api/products/search?q=keyword` - Tìm kiếm products
- `GET /api/products/:id` - Lấy product theo ID
- `POST /api/products` - Tạo product mới
- `PUT /api/products/:id` - Cập nhật product
- `DELETE /api/products/:id` - Xóa product

### Product Sizes
- `GET /api/product-sizes` - Lấy danh sách product_sizes
- `GET /api/product-sizes/product/:productId` - Lấy sizes của product
- `GET /api/product-sizes/search?q=keyword` - Tìm kiếm product_sizes
- `GET /api/product-sizes/:id` - Lấy product_size theo ID
- `POST /api/product-sizes` - Tạo product_size mới
- `PUT /api/product-sizes/:id` - Cập nhật product_size
- `DELETE /api/product-sizes/:id` - Xóa product_size

### Combos
- `GET /api/combos` - Lấy danh sách combos
- `GET /api/combos/:id` - Lấy combo theo ID
- `GET /api/combos/:id/items` - Lấy combo với items
- `GET /api/combos/search?q=keyword` - Tìm kiếm combos
- `POST /api/combos` - Tạo combo mới
- `PUT /api/combos/:id` - Cập nhật combo
- `DELETE /api/combos/:id` - Xóa combo

### Orders
- `GET /api/orders` - Lấy danh sách orders
- `GET /api/orders?zalo_id=user123` - Lấy orders của user
- `GET /api/orders/search?q=keyword` - Tìm kiếm orders
- `GET /api/orders/:id` - Lấy order theo ID
- `POST /api/orders` - Tạo order mới
- `PUT /api/orders/:id` - Cập nhật order
- `DELETE /api/orders/:id` - Xóa order

### Accounts
- `GET /api/accounts` - Lấy danh sách accounts
- `GET /api/accounts/search?q=keyword` - Tìm kiếm accounts
- `GET /api/accounts/:id` - Lấy account theo ID
- `POST /api/accounts` - Tạo account mới
- `PUT /api/accounts/:id` - Cập nhật account
- `DELETE /api/accounts/:id` - Xóa account

### Bills
- `GET /api/bills` - Lấy danh sách bills
- `GET /api/bills/search?q=keyword` - Tìm kiếm bills
- `GET /api/bills/:id` - Lấy bill theo ID
- `POST /api/bills` - Tạo bill mới
- `PUT /api/bills/:id` - Cập nhật bill
- `DELETE /api/bills/:id` - Xóa bill

### Upload
- `POST /api/upload` - Upload file (multipart/form-data)

## Cấu trúc Database

Database sử dụng PostgreSQL với các bảng:
- `accounts` - Tài khoản người dùng
- `categories` - Danh mục sản phẩm
- `products` - Sản phẩm
- `sizes` - Kích thước
- `product_sizes` - Kích thước và giá sản phẩm
- `combos` - Combo
- `combo_items` - Sản phẩm trong combo
- `orders` - Đơn hàng
- `order_items` - Sản phẩm trong đơn hàng
- `bills` - Hóa đơn
