import pool from "../db.js";

// Lấy danh sách orders
export const getOrders = async (req, res) => {
  try {
    const { zalo_id, status, limit = 50, offset = 0 } = req.query;
    let query = `SELECT o.*, a.name as customer_name, a.phone 
                 FROM orders o 
                 JOIN accounts a ON o.zalo_id = a.zalo_id`;
    const conditions = [];
    const params = [];
    let paramCount = 0;

    if (zalo_id) {
      paramCount++;
      conditions.push(`o.zalo_id = $${paramCount}`);
      params.push(zalo_id);
    }

    if (status) {
      paramCount++;
      conditions.push(`o.status = $${paramCount}`);
      params.push(status);
    }

    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }

    query += ` ORDER BY o.order_date DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
    params.push(parseInt(limit), parseInt(offset));

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error("❌ Lỗi lấy orders:", err);
    res.status(500).json({ error: err.message });
  }
};

// Lấy order theo ID
export const getOrderById = async (req, res) => {
  const { id } = req.params;
  try {
    const orderResult = await pool.query(
      `SELECT o.*, a.name as customer_name, a.phone, a.address 
       FROM orders o 
       JOIN accounts a ON o.zalo_id = a.zalo_id 
       WHERE o.order_id = $1`,
      [id]
    );
    
    if (orderResult.rows.length === 0)
      return res.status(404).json({ message: "Không tìm thấy order" });

    const itemsResult = await pool.query(
      `SELECT oi.*, p.name as product_name, p.image as product_image, 
              c.combo_name, s.size_name
       FROM order_items oi 
       LEFT JOIN products p ON oi.product_id = p.product_id 
       LEFT JOIN combos c ON oi.combo_id = c.combo_id 
       LEFT JOIN sizes s ON oi.size_id = s.size_id 
       WHERE oi.order_id = $1`,
      [id]
    );

    res.json({
      ...orderResult.rows[0],
      items: itemsResult.rows
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Tạo order mới
export const createOrder = async (req, res) => {
  const { zalo_id, note, items = [] } = req.body;
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // Tạo order
    const orderResult = await client.query(
      `INSERT INTO orders (zalo_id, note)
       VALUES ($1, $2) RETURNING *`,
      [zalo_id, note]
    );
    
    const orderId = orderResult.rows[0].order_id;
    
    // Thêm order items
    for (const item of items) {
      await client.query(
        `INSERT INTO order_items (order_id, product_id, combo_id, size_id, quantity, price)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [orderId, item.product_id, item.combo_id, item.size_id, item.quantity, item.price]
      );
    }
    
    await client.query('COMMIT');
    res.status(201).json(orderResult.rows[0]);
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
};

// Cập nhật order
export const updateOrder = async (req, res) => {
  const { id } = req.params;
  const { status, note } = req.body;
  try {
    const result = await pool.query(
      `UPDATE orders SET status=$1, note=$2 
       WHERE order_id=$3 RETURNING *`,
      [status, note, id]
    );
    
    if (result.rows.length === 0)
      return res.status(404).json({ message: "Không tìm thấy order" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Xóa order
export const deleteOrder = async (req, res) => {
  const { id } = req.params;
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // Xóa order items trước
    await client.query("DELETE FROM order_items WHERE order_id = $1", [id]);
    
    // Xóa bill nếu có
    await client.query("DELETE FROM bills WHERE order_id = $1", [id]);
    
    // Xóa order
    const result = await client.query("DELETE FROM orders WHERE order_id=$1", [id]);
    
    if (result.rowCount === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ message: "Không tìm thấy order" });
    }
    
    await client.query('COMMIT');
    res.json({ message: "Đã xóa order thành công" });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
};

// Tìm kiếm orders
export const searchOrders = async (req, res) => {
  const { q, zalo_id, status } = req.query;
  try {
    let query = `SELECT o.*, a.name as customer_name, a.phone 
                 FROM orders o 
                 JOIN accounts a ON o.zalo_id = a.zalo_id`;
    const conditions = [];
    const params = [];
    let paramCount = 0;

    if (q) {
      paramCount++;
      conditions.push(`(a.name ILIKE $${paramCount} OR a.phone ILIKE $${paramCount} OR o.note ILIKE $${paramCount})`);
      params.push(`%${q}%`);
    }

    if (zalo_id) {
      paramCount++;
      conditions.push(`o.zalo_id = $${paramCount}`);
      params.push(zalo_id);
    }

    if (status) {
      paramCount++;
      conditions.push(`o.status = $${paramCount}`);
      params.push(status);
    }

    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }

    query += " ORDER BY o.order_date DESC";

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
