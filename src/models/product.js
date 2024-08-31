const { db } = require("../config/database");

exports.create = async (
	requestId,
	serialNumber,
	productName,
	inputUrl
) => {
	const currentEpoch = Math.floor(Date.now() / 1000);
	try {
		// Insert the new record
		await db.query(
			"INSERT INTO products (request_id, serial_number, product_name, input_image_url, created_at) VALUES (?, ?, ?, ?, ?)",
			[requestId, serialNumber, productName, inputUrl, currentEpoch]
		);

		// Retrieve the last inserted ID
		const [results] = await db.query("SELECT LAST_INSERT_ID() AS id");
		const insertedId = results[0].id;

		return insertedId;
	} catch (error) {
		console.error("Error creating record:", error);
		throw error;
	}
};

exports.findByRequestId = async (requestId) => {
	const [rows] = await db.query(
		"SELECT * FROM products WHERE request_id = ?",
		[requestId]
	);
	return rows;
};

exports.updateOutputUrl = async (id, outputUrl) => {
	const currentEpoch = Math.floor(Date.now() / 1000);

	await db.query("UPDATE products SET output_image_url = ?, updated_at = ? WHERE id = ?", [
		outputUrl,
		currentEpoch,
		id,
	]);
};

exports.fetchAggregatedProductData = async (requestId) => {  
	const [rows] = await db.query(`
	    SELECT 
		  serial_number,
		  product_name,
		  GROUP_CONCAT(input_image_url ORDER BY id ASC) AS input_image_urls,
		  GROUP_CONCAT(output_image_url ORDER BY id ASC) AS output_image_urls
	    FROM products
	    WHERE request_id = ?
	    GROUP BY serial_number, product_name
	`, [requestId]);
  
	return rows;
  };

//   SELECT 
// 		  serial_number,
// 		  product_name,
// 		  GROUP_CONCAT(input_image_url ORDER BY id ASC) AS input_image_urls,
// 		  GROUP_CONCAT(output_image_url ORDER BY id ASC) AS output_image_urls
// 	    FROM products
// 	    WHERE request_id = 'ede22598-3f4b-48b9-a72f-4b36fb546654'
// 	    GROUP BY serial_number, product_name 
