// Simple Node.js backend for SQL Server
const express = require('express');
const sql = require('mssql');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(express.json());
app.use(cors());

// SQL Server config
const config = {
  user: 'sa',
  password: '123456', // đúng mật khẩu
  server: 'localhost', // hoặc 'THANHHOANG' nếu bạn đặt vậy
  database: 'DB',      // tên database
  port: 1433,
  options: {
    encrypt: false,
    trustServerCertificate: true
  }
};

// Cấu hình multer lưu vào static
const staticDir = path.join(__dirname, '../src/static');
if (!fs.existsSync(staticDir)) {
  fs.mkdirSync(staticDir);
}
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, staticDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + ext);
  }
});
const upload = multer({ storage: storage });

// Test API: Get all products
app.get('/api/products', async (req, res) => {
  try {
    await sql.connect(config);
    const search = req.query.search;
    let query = 'SELECT * FROM products';
    if (search) {
      if (search === 'caphe') {
        query = "SELECT * FROM products WHERE name LIKE N'%cà phê%'";
      } else if (search === 'tra') {
        query = "SELECT * FROM products WHERE name LIKE N'%trà%' OR name LIKE N'%trà sữa%'";
      } else if (search === 'suatuoi') {
        query = "SELECT * FROM products WHERE name LIKE N'%sữa tươi%'";
      } else if (search === 'nuocdonggia') {
        query = "SELECT * FROM products WHERE name NOT LIKE N'%cà phê%' AND name NOT LIKE N'%trà%' AND name NOT LIKE N'%trà sữa%' AND name NOT LIKE N'%sữa tươi%' AND type != 'combo' AND type != 'food' AND name NOT LIKE N'%7up%' AND name NOT LIKE N'%coca%'";
      } else if (search === 'doan') {
        query = "SELECT * FROM products WHERE type = 'food'";
      } else if (search === 'combo') {
        query = "SELECT * FROM products WHERE type = 'combo'";
      }
    }
    const result = await sql.query(query);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// API cập nhật ảnh sản phẩm
app.post('/api/products/update-image', async (req, res) => {
  const productId = req.body.id;
  const imageUrl = req.body.imageUrl;
  if (!imageUrl) {
    console.error('Không nhận được link ảnh!', req.body);
    return res.status(400).json({ error: 'Không nhận được link ảnh!' });
  }
  try {
    await sql.connect(config);
    await sql.query`UPDATE products SET image = ${imageUrl} WHERE id = ${productId}`;
    console.log(`Đã cập nhật link ảnh cho sản phẩm id=${productId}: ${imageUrl}`);
    res.json({ success: true, image: imageUrl });
  } catch (err) {
    console.error('Lỗi cập nhật link ảnh:', err);
    res.status(500).json({ error: err.message });
  }
});

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ Server đang chạy trên cổng ${PORT}`);
});