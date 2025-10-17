import express from "express";
import pkg from "pg";
import cors from "cors";

const { Pool } = pkg;
const app = express();
app.use(express.json());
app.use(cors());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

app.get("/api/products", async (req, res) => {
  try {
    const search = req.query.search;
    let query = "SELECT * FROM products";

    if (search) {
      switch (search) {
        case "caphe":
          query = "SELECT * FROM products WHERE name ILIKE '%cà phê%'";
          break;
        case "tra":
          query =
            "SELECT * FROM products WHERE name ILIKE '%trà%' OR name ILIKE '%trà sữa%'";
          break;
        case "suatuoi":
          query = "SELECT * FROM products WHERE name ILIKE '%sữa tươi%'";
          break;
        case "nuocdonggia":
          query =
            "SELECT * FROM products WHERE name NOT ILIKE '%cà phê%' AND name NOT ILIKE '%trà%' AND name NOT ILIKE '%trà sữa%' AND name NOT ILIKE '%sữa tươi%' AND type NOT IN ('combo','food') AND name NOT ILIKE '%7up%' AND name NOT ILIKE '%coca%'";
          break;
        case "doan":
          query = "SELECT * FROM products WHERE type = 'food'";
          break;
        case "combo":
          query = "SELECT * FROM products WHERE type = 'combo'";
          break;
      }
    }

    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error("❌ Lỗi truy vấn:", err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy trên cổng ${PORT}`);
});
