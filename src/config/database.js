const mysql = require("mysql2/promise");

const db = mysql.createPool({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
	waitForConnections: true,
	connectionLimit: 10,
	queueLimit: 0,
});

async function initializeDatabase() {
	const connection = await db.getConnection();

	try {
		await connection.query(`
      CREATE TABLE IF NOT EXISTS requests (
        id VARCHAR(36) PRIMARY KEY,
        status ENUM('pending', 'processing', 'completed', 'failed') NOT NULL,
        output_csv_url TEXT DEFAULT NULL,
        created_at INT(11),
        updated_at INT(11)
      );
    `);

		await connection.query(`
      CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        request_id VARCHAR(36),
        serial_number INT,
        product_name VARCHAR(255) NOT NULL,
        input_image_url TEXT,
        output_image_url TEXT DEFAULT NULL,
        created_at INT(11),
        updated_at INT(11),
        FOREIGN KEY (request_id) REFERENCES requests(id)
      );
    `);

    console.log("Tables Created Successfully");
	} catch (error) {
		console.error("Error initializing the database:", error);
	} finally {
		connection.release();
	}
}

initializeDatabase().catch(console.error);

module.exports = {
	db,
};
