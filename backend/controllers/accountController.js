import pool from "../db.js";

// Lấy danh sách accounts
export const getAccounts = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM accounts ORDER BY zalo_id");
    res.json(result.rows);
  } catch (err) {
    console.error("❌ Lỗi lấy accounts:", err);
    res.status(500).json({ error: err.message });
  }
};

// Lấy account theo zalo_id
export const getAccountById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM accounts WHERE zalo_id = $1", [id]);
    if (result.rows.length === 0)
      return res.status(404).json({ message: "Không tìm thấy account" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Tạo account mới
export const createAccount = async (req, res) => {
  const { zalo_id, name, phone, address, role = 'user' } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO accounts (zalo_id, name, phone, address, role)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [zalo_id, name, phone, address, role]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Cập nhật account
export const updateAccount = async (req, res) => {
  const { id } = req.params;
  const { name, phone, address, role } = req.body;
  try {
    const result = await pool.query(
      `UPDATE accounts SET name=$1, phone=$2, address=$3, role=$4 
       WHERE zalo_id=$5 RETURNING *`,
      [name, phone, address, role, id]
    );
    
    if (result.rows.length === 0)
      return res.status(404).json({ message: "Không tìm thấy account" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Xóa account
export const deleteAccount = async (req, res) => {
  const { id } = req.params;
  try {
    // Kiểm tra xem account có orders không
    const checkOrders = await pool.query(
      "SELECT COUNT(*) FROM orders WHERE zalo_id = $1",
      [id]
    );
    
    if (parseInt(checkOrders.rows[0].count) > 0) {
      return res.status(400).json({ 
        message: "Không thể xóa account vì còn đơn hàng" 
      });
    }

    const result = await pool.query("DELETE FROM accounts WHERE zalo_id=$1", [id]);
    if (result.rowCount === 0)
      return res.status(404).json({ message: "Không tìm thấy account" });
    res.json({ message: "Đã xóa account thành công" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Tìm kiếm accounts
export const searchAccounts = async (req, res) => {
  const { q, role } = req.query;
  try {
    let query = "SELECT * FROM accounts";
    const conditions = [];
    const params = [];
    let paramCount = 0;

    if (q) {
      paramCount++;
      conditions.push(`(name ILIKE $${paramCount} OR phone ILIKE $${paramCount} OR address ILIKE $${paramCount})`);
      params.push(`%${q}%`);
    }

    if (role) {
      paramCount++;
      conditions.push(`role = $${paramCount}`);
      params.push(role);
    }

    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }

    query += " ORDER BY zalo_id";

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
