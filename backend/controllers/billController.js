import pool from "../db.js";

// Lấy danh sách bills
export const getBills = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT b.*, o.order_id, o.zalo_id, o.order_date, o.status, a.name as customer_name
       FROM bills b 
       JOIN orders o ON b.order_id = o.order_id 
       JOIN accounts a ON o.zalo_id = a.zalo_id 
       ORDER BY b.payment_date DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error("❌ Lỗi lấy bills:", err);
    res.status(500).json({ error: err.message });
  }
};

// Lấy bill theo ID
export const getBillById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `SELECT b.*, o.order_id, o.zalo_id, o.order_date, o.status, o.note, a.name as customer_name, a.phone, a.address
       FROM bills b 
       JOIN orders o ON b.order_id = o.order_id 
       JOIN accounts a ON o.zalo_id = a.zalo_id 
       WHERE b.bill_id = $1`,
      [id]
    );
    
    if (result.rows.length === 0)
      return res.status(404).json({ message: "Không tìm thấy bill" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Tạo bill mới
export const createBill = async (req, res) => {
  const { order_id, total_amount, payment_method } = req.body;
  try {
    // Kiểm tra xem order đã có bill chưa
    const existingBill = await pool.query(
      "SELECT * FROM bills WHERE order_id = $1",
      [order_id]
    );
    
    if (existingBill.rows.length > 0) {
      return res.status(400).json({ 
        message: "Order đã có bill" 
      });
    }

    const result = await pool.query(
      `INSERT INTO bills (order_id, total_amount, payment_method)
       VALUES ($1, $2, $3) RETURNING *`,
      [order_id, total_amount, payment_method]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Cập nhật bill
export const updateBill = async (req, res) => {
  const { id } = req.params;
  const { total_amount, payment_method } = req.body;
  try {
    const result = await pool.query(
      `UPDATE bills SET total_amount=$1, payment_method=$2 
       WHERE bill_id=$3 RETURNING *`,
      [total_amount, payment_method, id]
    );
    
    if (result.rows.length === 0)
      return res.status(404).json({ message: "Không tìm thấy bill" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Xóa bill
export const deleteBill = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("DELETE FROM bills WHERE bill_id=$1", [id]);
    if (result.rowCount === 0)
      return res.status(404).json({ message: "Không tìm thấy bill" });
    res.json({ message: "Đã xóa bill thành công" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Tìm kiếm bills
export const searchBills = async (req, res) => {
  const { q, payment_method, start_date, end_date } = req.query;
  try {
    let query = `SELECT b.*, o.order_id, o.zalo_id, o.order_date, o.status, a.name as customer_name
                 FROM bills b 
                 JOIN orders o ON b.order_id = o.order_id 
                 JOIN accounts a ON o.zalo_id = a.zalo_id`;
    const conditions = [];
    const params = [];
    let paramCount = 0;

    if (q) {
      paramCount++;
      conditions.push(`(a.name ILIKE $${paramCount} OR a.phone ILIKE $${paramCount})`);
      params.push(`%${q}%`);
    }

    if (payment_method) {
      paramCount++;
      conditions.push(`b.payment_method = $${paramCount}`);
      params.push(payment_method);
    }

    if (start_date) {
      paramCount++;
      conditions.push(`b.payment_date >= $${paramCount}`);
      params.push(start_date);
    }

    if (end_date) {
      paramCount++;
      conditions.push(`b.payment_date <= $${paramCount}`);
      params.push(end_date);
    }

    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }

    query += " ORDER BY b.payment_date DESC";

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
