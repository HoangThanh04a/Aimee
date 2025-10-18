import pool from "../db.js";

// Lấy danh sách sizes
export const getSizes = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM sizes ORDER BY size_id");
    res.json(result.rows);
  } catch (err) {
    console.error("❌ Lỗi lấy sizes:", err);
    res.status(500).json({ error: err.message });
  }
};

// Lấy size theo ID
export const getSizeById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM sizes WHERE size_id = $1", [id]);
    if (result.rows.length === 0)
      return res.status(404).json({ message: "Không tìm thấy size" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Tạo size mới
export const createSize = async (req, res) => {
  const { size_name } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO sizes (size_name)
       VALUES ($1) RETURNING *`,
      [size_name]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Cập nhật size
export const updateSize = async (req, res) => {
  const { id } = req.params;
  const { size_name } = req.body;
  try {
    const result = await pool.query(
      `UPDATE sizes SET size_name=$1 
       WHERE size_id=$2 RETURNING *`,
      [size_name, id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ message: "Không tìm thấy size" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Xóa size
export const deleteSize = async (req, res) => {
  const { id } = req.params;
  try {
    // Kiểm tra xem size có được sử dụng trong product_sizes không
    const checkProductSizes = await pool.query(
      "SELECT COUNT(*) FROM product_sizes WHERE size_id = $1",
      [id]
    );
    
    if (parseInt(checkProductSizes.rows[0].count) > 0) {
      return res.status(400).json({ 
        message: "Không thể xóa size vì còn sản phẩm sử dụng size này" 
      });
    }

    const result = await pool.query("DELETE FROM sizes WHERE size_id=$1", [id]);
    if (result.rowCount === 0)
      return res.status(404).json({ message: "Không tìm thấy size" });
    res.json({ message: "Đã xóa size thành công" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Tìm kiếm sizes
export const searchSizes = async (req, res) => {
  const { q } = req.query;
  try {
    const result = await pool.query(
      "SELECT * FROM sizes WHERE size_name ILIKE $1 ORDER BY size_id",
      [`%${q}%`]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
