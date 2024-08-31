const { db } = require("../config/database");

exports.create = async (id, status) => {
      const currentEpoch = Math.floor(Date.now() / 1000);

	await db.query("INSERT INTO requests (id, status, created_at) VALUES (?, ?, ?)", [
		id,
		status,
            currentEpoch
	]);
};

exports.findById = async (id) => {
	const [rows] = await db.query("SELECT * FROM requests WHERE id = ?", [
		id,
	]);
	return rows[0];
};

exports.updateStatus = async (id, status) => {
      const currentEpoch = Math.floor(Date.now() / 1000);

	await db.query("UPDATE requests SET status = ?, updated_at = ? WHERE id = ?", [
		status,
            currentEpoch,
		id,
	]);
};

exports.updateCSV = async (id, csvUrl) => {
      const currentEpoch = Math.floor(Date.now() / 1000);
	const statusComplete = "completed";

	await db.query("UPDATE requests SET output_csv_url = ?, updated_at = ?, status = ? WHERE id = ?", [
		csvUrl,
            currentEpoch,
		statusComplete,
		id,
	]);
};