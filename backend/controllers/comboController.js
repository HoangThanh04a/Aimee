import pool from "../db.js";

// Lấy danh sách combos
export const getCombos = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM combos ORDER BY combo_id");
    res.json(result.rows);
  } catch (err) {
    console.error("❌ Lỗi lấy combos:", err);
    res.status(500).json({ error: err.message });
  }
};

// Lấy combo theo ID
export const getComboById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM combos WHERE combo_id = $1", [id]);
    if (result.rows.length === 0)
      return res.status(404).json({ message: "Không tìm thấy combo" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Lấy combo với items
export const getComboWithItems = async (req, res) => {
  const { id } = req.params;
  try {
    const comboResult = await pool.query("SELECT * FROM combos WHERE combo_id = $1", [id]);
    if (comboResult.rows.length === 0)
      return res.status(404).json({ message: "Không tìm thấy combo" });

    const itemsResult = await pool.query(
      `SELECT ci.*, p.name as product_name, p.image as product_image
       FROM combo_items ci 
       JOIN products p ON ci.product_id = p.product_id 
       WHERE ci.combo_id = $1`,
      [id]
    );

    res.json({
      ...comboResult.rows[0],
      items: itemsResult.rows
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Tạo combo mới
export const createCombo = async (req, res) => {
  const { combo_name, description, image, price, items = [] } = req.body;
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // Tạo combo
    const comboResult = await client.query(
      `INSERT INTO combos (combo_name, description, image, price)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [combo_name, description, image, price]
    );
    
    const comboId = comboResult.rows[0].combo_id;
    
    // Thêm combo items
    for (const item of items) {
      await client.query(
        `INSERT INTO combo_items (combo_id, product_id, quantity)
         VALUES ($1, $2, $3)`,
        [comboId, item.product_id, item.quantity || 1]
      );
    }
    
    await client.query('COMMIT');
    res.status(201).json(comboResult.rows[0]);
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
};

// Cập nhật combo
export const updateCombo = async (req, res) => {
  const { id } = req.params;
  const { combo_name, description, image, price, items } = req.body;
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // Cập nhật combo
    const comboResult = await client.query(
      `UPDATE combos SET combo_name=$1, description=$2, image=$3, price=$4 
       WHERE combo_id=$5 RETURNING *`,
      [combo_name, description, image, price, id]
    );
    
    if (comboResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ message: "Không tìm thấy combo" });
    }
    
    // Cập nhật combo items nếu có
    if (items) {
      // Xóa items cũ
      await client.query("DELETE FROM combo_items WHERE combo_id = $1", [id]);
      
      // Thêm items mới
      for (const item of items) {
        await client.query(
          `INSERT INTO combo_items (combo_id, product_id, quantity)
           VALUES ($1, $2, $3)`,
          [id, item.product_id, item.quantity || 1]
        );
      }
    }
    
    await client.query('COMMIT');
    res.json(comboResult.rows[0]);
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
};

// Xóa combo
export const deleteCombo = async (req, res) => {
  const { id } = req.params;
  try {
    // Kiểm tra xem combo có trong order_items không
    const checkOrders = await pool.query(
      "SELECT COUNT(*) FROM order_items WHERE combo_id = $1",
      [id]
    );
    
    if (parseInt(checkOrders.rows[0].count) > 0) {
      return res.status(400).json({ 
        message: "Không thể xóa combo vì còn trong đơn hàng" 
      });
    }

    const result = await pool.query("DELETE FROM combos WHERE combo_id=$1", [id]);
    if (result.rowCount === 0)
      return res.status(404).json({ message: "Không tìm thấy combo" });
    res.json({ message: "Đã xóa combo thành công" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Tìm kiếm combos
export const searchCombos = async (req, res) => {
  const { q } = req.query;
  try {
    const result = await pool.query(
      "SELECT * FROM combos WHERE combo_name ILIKE $1 OR description ILIKE $1 ORDER BY combo_id",
      [`%${q}%`]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
