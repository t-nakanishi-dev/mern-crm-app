// backend/encodeBase64.js
const fs = require("fs");

const filePath = "./firebaseServiceAccountKey.json"; 

try {
  const fileBuffer = fs.readFileSync(filePath);
  const base64 = fileBuffer.toString("base64");
  console.log(base64);
} catch (err) {
  console.error("ファイル読み込みエラー:", err.message);
}
