import mysql from "mysql2/promise";

// MySQL connection configuration with Hostinger defaults
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || "localhost",
  user: process.env.MYSQL_USER || "u288979278_hangushoes",
  password: process.env.MYSQL_PASSWORD || "Hangu#Shoes!Sql2026$Pk",
  database: process.env.MYSQL_DATABASE || "u288979278_hangushoes",
  port: parseInt(process.env.MYSQL_PORT || "3306", 10),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  timezone: "Z",
  enableKeepAlive: true,
  keepAliveInitialDelay: 10000,
});

let initialized = false;

/**
 * Initializes MySQL tables automatically if they do not exist.
 * Matches 100% of MongoDB models, fields, and types.
 */
export async function initMySQLTables(): Promise<void> {
  if (initialized) return;

  // 1. Admins Table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS admins (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(100) NOT NULL UNIQUE,
      email VARCHAR(150) NOT NULL UNIQUE,
      password_hash VARCHAR(255),
      name VARCHAR(100) DEFAULT 'Admin',
      role VARCHAR(50) DEFAULT 'admin',
      permissions JSON,
      is_active BOOLEAN DEFAULT TRUE,
      last_login DATETIME,
      reset_password_token VARCHAR(255),
      reset_password_expires DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  // 2. Products Table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS products (
      id INT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      cat VARCHAR(100) NOT NULL,
      price INT NOT NULL,
      old_price INT,
      img VARCHAR(500) NOT NULL,
      images JSON,
      stock INT NOT NULL DEFAULT 0,
      rating DECIMAL(3,2) DEFAULT 5.0,
      reviews_count INT DEFAULT 0,
      description TEXT NOT NULL,
      badge VARCHAR(50),
      is_sale BOOLEAN DEFAULT FALSE,
      is_featured BOOLEAN DEFAULT FALSE,
      is_bestseller BOOLEAN DEFAULT FALSE,
      is_active BOOLEAN DEFAULT TRUE,
      sizes JSON,
      colors JSON,
      features JSON,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_cat (cat),
      INDEX idx_active (is_active)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  // 3. Orders Table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS orders (
      id INT AUTO_INCREMENT PRIMARY KEY,
      order_id VARCHAR(50) NOT NULL UNIQUE,
      customer_name VARCHAR(150) NOT NULL,
      customer_phone VARCHAR(50) NOT NULL,
      customer_city VARCHAR(100) NOT NULL,
      customer_address TEXT NOT NULL,
      items JSON NOT NULL,
      subtotal INT NOT NULL,
      shipping_fee INT DEFAULT 0,
      cod_fee INT DEFAULT 0,
      total_amount INT NOT NULL,
      payment_method VARCHAR(50) NOT NULL DEFAULT 'cod',
      payment_status VARCHAR(50) NOT NULL DEFAULT 'cod_pending',
      transaction_id VARCHAR(100),
      payment_screenshot VARCHAR(500),
      notes TEXT,
      delivery_note TEXT,
      customer_ip VARCHAR(50),
      status VARCHAR(50) NOT NULL DEFAULT 'awaiting_confirmation',
      cancelled_at DATETIME,
      cancel_reason TEXT,
      courier_name VARCHAR(100),
      tracking_number VARCHAR(100),
      timeline JSON,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_order_id (order_id),
      INDEX idx_status (status),
      INDEX idx_phone (customer_phone)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  // 4. Store Settings Table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS settings (
      id INT PRIMARY KEY,
      shop_name VARCHAR(255) DEFAULT 'Hangu Branded Shoes',
      phone VARCHAR(50) DEFAULT '+92 333 3147691',
      whatsapp_number VARCHAR(50) DEFAULT '923333147691',
      email VARCHAR(150) DEFAULT 'info@hangubrandedshoes.com',
      address TEXT,
      shop_timing VARCHAR(100) DEFAULT '8:00 AM to 5:00 PM',
      shipping_fee INT DEFAULT 250,
      free_shipping_threshold INT DEFAULT 5000,
      announcement_text TEXT,
      is_store_open BOOLEAN DEFAULT TRUE,
      jazzcash_number VARCHAR(50) DEFAULT '03275430305',
      jazzcash_title VARCHAR(150) DEFAULT 'Muhammad Atif Ibrahim',
      easypaisa_number VARCHAR(50) DEFAULT '',
      easypaisa_title VARCHAR(150) DEFAULT '',
      enable_cod BOOLEAN DEFAULT TRUE,
      cod_fee INT DEFAULT 0,
      blocked_phone_numbers JSON,
      deleted_product_ids JSON,
      has_initialized_products BOOLEAN DEFAULT FALSE,
      hero_banner_1 VARCHAR(500) DEFAULT '/images/h3.jpg',
      hero_banner_2 VARCHAR(500) DEFAULT '/images/h1.jpg',
      hero_banner_3 VARCHAR(500) DEFAULT '/images/h2.jpg',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  // 5. Uploaded Images Table (supports binary storage identical to MongoDB GridFS/Binary)
  await pool.query(`
    CREATE TABLE IF NOT EXISTS uploaded_images (
      id VARCHAR(50) PRIMARY KEY,
      filename VARCHAR(255) NOT NULL,
      content_type VARCHAR(100) NOT NULL DEFAULT 'image/webp',
      data LONGBLOB NOT NULL,
      size INT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  initialized = true;
}

export default pool;
