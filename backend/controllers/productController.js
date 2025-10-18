import pool from "../db.js";

// Lấy danh sách sản phẩm
export const getProducts = async (req, res) => {
  try {
    const { category_id, search, is_available } = req.query;
    let query = "SELECT p.*, c.name as category_name FROM products p JOIN categories c ON p.category_id = c.category_id";
    const conditions = [];
    const params = [];
    let paramCount = 0;

    if (category_id) {
      paramCount++;
      conditions.push(`p.category_id = $${paramCount}`);
      params.push(category_id);
    }

    if (search) {
      paramCount++;
      conditions.push(`(p.name ILIKE $${paramCount} OR p.description ILIKE $${paramCount})`);
      params.push(`%${search}%`);
    }

    if (is_available !== undefined) {
      paramCount++;
      conditions.push(`p.is_available = $${paramCount}`);
      params.push(is_available === 'true');
    }

    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }

    query += " ORDER BY p.product_id";

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error("❌ Lỗi lấy sản phẩm:", err);
    res.status(500).json({ error: err.message });
  }
};

// Lấy chi tiết sản phẩm
export const getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `SELECT p.*, c.name as category_name 
       FROM products p 
       JOIN categories c ON p.category_id = c.category_id 
       WHERE p.product_id = $1`, 
      [id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Thêm sản phẩm mới
export const createProduct = async (req, res) => {
  const { category_id, name, description, image, is_available = true } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO products (category_id, name, description, image, is_available)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [category_id, name, description, image, is_available]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Cập nhật sản phẩm
export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { category_id, name, description, image, is_available } = req.body;
  try {
    const result = await pool.query(
      `UPDATE products SET category_id=$1, name=$2, description=$3, image=$4, is_available=$5 
       WHERE product_id=$6 RETURNING *`,
      [category_id, name, description, image, is_available, id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Xóa sản phẩm
export const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    // Kiểm tra xem sản phẩm có trong order_items không
    const checkOrders = await pool.query(
      "SELECT COUNT(*) FROM order_items WHERE product_id = $1",
      [id]
    );
    
    if (parseInt(checkOrders.rows[0].count) > 0) {
      return res.status(400).json({ 
        message: "Không thể xóa sản phẩm vì còn trong đơn hàng" 
      });
    }

    const result = await pool.query("DELETE FROM products WHERE product_id=$1", [id]);
    if (result.rowCount === 0)
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    res.json({ message: "Đã xóa sản phẩm thành công" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Tìm kiếm sản phẩm
export const searchProducts = async (req, res) => {
  const { q, category_id } = req.query;
  try {
    let query = `SELECT p.*, c.name as category_name 
                 FROM products p 
                 JOIN categories c ON p.category_id = c.category_id 
                 WHERE (p.name ILIKE $1 OR p.description ILIKE $1)`;
    const params = [`%${q}%`];
    
    if (category_id) {
      query += " AND p.category_id = $2";
      params.push(category_id);
    }
    
    query += " ORDER BY p.product_id";
    
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};