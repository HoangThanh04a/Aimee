import pool from "../db.js";

// Lấy danh sách product_sizes
export const getProductSizes = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT ps.*, p.name as product_name, s.size_name 
       FROM product_sizes ps 
       JOIN products p ON ps.product_id = p.product_id 
       JOIN sizes s ON ps.size_id = s.size_id 
       ORDER BY ps.product_id, ps.size_id`
    );
    res.json(result.rows);
  } catch (err) {
    console.error("❌ Lỗi lấy product_sizes:", err);
    res.status(500).json({ error: err.message });
  }
};

// Lấy product_sizes theo product_id
export const getProductSizesByProductId = async (req, res) => {
  const { productId } = req.params;
  try {
    const result = await pool.query(
      `SELECT ps.*, s.size_name 
       FROM product_sizes ps 
       JOIN sizes s ON ps.size_id = s.size_id 
       WHERE ps.product_id = $1 
       ORDER BY ps.size_id`,
      [productId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("❌ Lỗi lấy product_sizes theo product_id:", err);
    res.status(500).json({ error: err.message });
  }
};

// Lấy product_size theo ID
export const getProductSizeById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `SELECT ps.*, p.name as product_name, s.size_name 
       FROM product_sizes ps 
       JOIN products p ON ps.product_id = p.product_id 
       JOIN sizes s ON ps.size_id = s.size_id 
       WHERE ps.product_size_id = $1`,
      [id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ message: "Không tìm thấy product_size" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Tạo product_size mới
export const createProductSize = async (req, res) => {
  const { product_id, size_id, price } = req.body;
  try {
    // Kiểm tra xem product_size đã tồn tại chưa
    const existing = await pool.query(
      "SELECT * FROM product_sizes WHERE product_id = $1 AND size_id = $2",
      [product_id, size_id]
    );
    
    if (existing.rows.length > 0) {
      return res.status(400).json({ 
        message: "Product size đã tồn tại" 
      });
    }

    const result = await pool.query(
      `INSERT INTO product_sizes (product_id, size_id, price)
       VALUES ($1, $2, $3) RETURNING *`,
      [product_id, size_id, price]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Cập nhật product_size
export const updateProductSize = async (req, res) => {
  const { id } = req.params;
  const { product_id, size_id, price } = req.body;
  try {
    // Kiểm tra xem product_size khác đã tồn tại chưa (nếu thay đổi product_id hoặc size_id)
    if (product_id || size_id) {
      const current = await pool.query(
        "SELECT product_id, size_id FROM product_sizes WHERE product_size_id = $1",
        [id]
      );
      
      if (current.rows.length === 0) {
        return res.status(404).json({ message: "Không tìm thấy product_size" });
      }

      const checkProductId = product_id || current.rows[0].product_id;
      const checkSizeId = size_id || current.rows[0].size_id;

      const existing = await pool.query(
        "SELECT * FROM product_sizes WHERE product_id = $1 AND size_id = $2 AND product_size_id != $3",
        [checkProductId, checkSizeId, id]
      );
      
      if (existing.rows.length > 0) {
        return res.status(400).json({ 
          message: "Product size đã tồn tại" 
        });
      }
    }

    const result = await pool.query(
      `UPDATE product_sizes SET product_id=$1, size_id=$2, price=$3 
       WHERE product_size_id=$4 RETURNING *`,
      [product_id, size_id, price, id]
    );
    
    if (result.rows.length === 0)
      return res.status(404).json({ message: "Không tìm thấy product_size" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Xóa product_size
export const deleteProductSize = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("DELETE FROM product_sizes WHERE product_size_id=$1", [id]);
    if (result.rowCount === 0)
      return res.status(404).json({ message: "Không tìm thấy product_size" });
    res.json({ message: "Đã xóa product_size thành công" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Tìm kiếm product_sizes
export const searchProductSizes = async (req, res) => {
  const { q, product_id, size_id } = req.query;
  try {
    let query = `SELECT ps.*, p.name as product_name, s.size_name 
                 FROM product_sizes ps 
                 JOIN products p ON ps.product_id = p.product_id 
                 JOIN sizes s ON ps.size_id = s.size_id`;
    const conditions = [];
    const params = [];
    let paramCount = 0;

    if (q) {
      paramCount++;
      conditions.push(`(p.name ILIKE $${paramCount} OR s.size_name ILIKE $${paramCount})`);
      params.push(`%${q}%`);
    }

    if (product_id) {
      paramCount++;
      conditions.push(`ps.product_id = $${paramCount}`);
      params.push(product_id);
    }

    if (size_id) {
      paramCount++;
      conditions.push(`ps.size_id = $${paramCount}`);
      params.push(size_id);
    }

    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }

    query += " ORDER BY ps.product_id, ps.size_id";

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
