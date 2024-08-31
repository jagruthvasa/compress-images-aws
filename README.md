<!-- GitHub User Info README -->
<a id="readme-top"></a>

# Image Processing & CSV Generation Service

## 📝 Overview

This Node.js application processes images from a CSV file, compresses them, generates a new CSV with the output URLs, and stores the processed CSV in an AWS S3 bucket. Additionally, the application triggers a webhook upon completion of the image processing.


## ✨ Features

- **CSV Parsing**: Reads and validates the structure of an input CSV file.
- **Image Processing**: Downloads images, compresses them, and uploads them to AWS S3.
- **CSV Generation**: Creates a new CSV file containing the original and processed image URLs, and stores it in AWS S3.
- **Webhook Trigger**: Sends a webhook notification upon completion of processing.
- **Error Handling**: Provides specific error messages for CSV structure validation, image processing failures, and more.


## 🌐 Hosted URL

Visit the hosted site `https://compress-images-aws.onrender.com/`

<p align="right">(<a href="#readme-top">back to top</a>)</p>


## 🚀 Technologies Used

- [![Node.js](https://img.shields.io/badge/Node.js-43853D?style=flat&logo=node.js&logoColor=white)](https://nodejs.org/)
- [![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- [![Express.js](https://img.shields.io/badge/Express.js-000000?style=flat&logo=express&logoColor=white)](https://expressjs.com/)
- [![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=flat&logo=mysql&logoColor=white)](https://www.mysql.com/)
- [![AWS](https://img.shields.io/badge/Amazon%20Web%20Services-232F3E?style=flat&logo=amazon-aws&logoColor=white)](https://aws.amazon.com/)
- [![Render.com](https://img.shields.io/badge/Render.com-333333?style=flat)](https://render.com/)
- [![Postman](https://img.shields.io/badge/Postman-FF6C37?style=flat&logo=postman&logoColor=white)](https://www.postman.com/)


<p align="right">(<a href="#readme-top">back to top</a>)</p>


## API 🛠️ Endpoints

### 1. Process CSV and Generate Images

**Endpoint:** `POST https://compress-images-aws.onrender.com/api/upload`

**Description:** Process a CSV file to generate images and store the results.

**Request Body:**
```json
{
  "webhookUrl": "string",
  "csvFile": "file"
}
```

**Response Body:**
```json
{
  "requestId": "string",
  "message": "Your file has been accepted and is being processed."
}
```

### 2. Get Request Status

**Endpoint:** `GET https://compress-images-aws.onrender.com/api/status/:requestId`

**Description:** Retrieve the status of a processing request.

**Path Parameters:**
- `requestId` (string): The unique ID of the request.

**Response:**
```json
{
  "requestId": "string",
  "status": "string",
  "csvUrl": "string",
  "message": "string"
}
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>


## 📬 Postman Collection

Access the Postman collection for API testing: [Public Collection](https://www.postman.com/aviation-architect-34779856/workspace/compress-images-aws/request/36467777-f011c6eb-a532-45d7-a635-ee63bb9840c8).

<p align="right">(<a href="#readme-top">back to top</a>)</p>


## 📄 Detailed Project Description

For a detailed overview of the project, please refer to the [Google Document](https://docs.google.com/document/d/11Q5R1RDQNjv7wLYlivay_bg3x6zv5g325ZncCn_LmOw/edit?usp=sharing).

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- CONTACT -->
## 📞 Contact

**Vasa Sai Jagruth**

- **LinkedIn:** [@jagruth](https://www.linkedin.com/in/jagruth/)
- **Email:** jagruthvasa@gmail.com
- **Phone:** +91 90105 45613

<p align="right">(<a href="#readme-top">back to top</a>)</p>


## 📝 Note

Please email me at [jagruthvasa@gmail.com](mailto:jagruthvasa@gmail.com) if you encounter any server downtime during testing. I will promptly restart the server (hosted on render.com).


<p align="right">(<a href="#readme-top">back to top</a>)</p>
