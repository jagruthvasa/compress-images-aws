const { stringify } = require("csv-stringify/sync");

exports.formatToCSV = (products) => {
	const data = products.map((product) => ({
		"S. No.": product.serial_number,
		"Product Name": product.product_name,
		"Input Image Urls": product.input_image_url,
		"Output Image Urls": product.output_image_url,
	}));

	return stringify(data, { header: true });
};
