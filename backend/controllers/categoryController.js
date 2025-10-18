import pool from "../db.js";

// Lấy danh sách categories
export const getCategories = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM categories ORDER BY category_id");
    res.json(result.rows);
  } catch (err) {
    console.error("❌ Lỗi lấy categories:", err);
    res.status(500).json({ error: err.message });
  }
};

// Lấy category theo ID
export const getCategoryById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM categories WHERE category_id = $1", [id]);
    if (result.rows.length === 0)
      return res.status(404).json({ message: "Không tìm thấy category" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Tạo category mới
export const createCategory = async (req, res) => {
  const { name, description } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO categories (name, description)
       VALUES ($1, $2) RETURNING *`,
      [name, description]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Cập nhật category
export const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  try {
    const result = await pool.query(
      `UPDATE categories SET name=$1, description=$2 
       WHERE category_id=$3 RETURNING *`,
      [name, description, id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ message: "Không tìm thấy category" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Xóa category
export const deleteCategory = async (req, res) => {
  const { id } = req.params;
  try {
    // Kiểm tra xem category có sản phẩm nào không
    const checkProducts = await pool.query(
      "SELECT COUNT(*) FROM products WHERE category_id = $1",
      [id]
    );
    
    if (parseInt(checkProducts.rows[0].count) > 0) {
      return res.status(400).json({ 
        message: "Không thể xóa category vì còn sản phẩm thuộc category này" 
      });
    }

    const result = await pool.query("DELETE FROM categories WHERE category_id=$1", [id]);
    if (result.rowCount === 0)
      return res.status(404).json({ message: "Không tìm thấy category" });
    res.json({ message: "Đã xóa category thành công" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Tìm kiếm categories
export const searchCategories = async (req, res) => {
  const { q } = req.query;
  try {
    const result = await pool.query(
      "SELECT * FROM categories WHERE name ILIKE $1 OR description ILIKE $1 ORDER BY category_id",
      [`%${q}%`]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
