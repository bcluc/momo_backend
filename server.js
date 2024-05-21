// server.js
const express = require("express");
const dotenv = require("dotenv");
const crypto = require("crypto");
const https = require("https");

dotenv.config();

const app = express();
app.use(express.json());

function payMomo(amount) {
  return new Promise((resolve, reject) => {
    const accessKey = process.env.MOMO_ACCESS_KEY;
    const secretKey = process.env.MOMO_SECRET_KEY; // key to test // don't change
    const orderInfo = "pay with MoMo"; // order info
    const partnerCode = "MOMO";
    const redirectUrl = process.env.REDIRECT_URL; // redirect URL after payment
    const ipnUrl = process.env.IPN_URL; // URL for IPN
    const requestType = "payWithMethod";
    const orderId = partnerCode + new Date().getTime(); // order ID, can change
    const requestId = orderId;
    const extraData = ""; // extra data (address, COD code, ...)
    const paymentCode = process.env.PAYMENT_CODE;
    const orderGroupId = "";
    const autoCapture = true;
    const lang = "vi"; // language

    const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;

    const signature = crypto
      .createHmac("sha256", secretKey)
      .update(rawSignature)
      .digest("hex");

    const requestBody = JSON.stringify({
      partnerCode: partnerCode,
      partnerName: "Test",
      storeId: "MomoTestStore",
      requestId: requestId,
      amount: amount,
      orderId: orderId,
      orderInfo: orderInfo,
      redirectUrl: redirectUrl,
      ipnUrl: ipnUrl,
      lang: lang,
      requestType: requestType,
      autoCapture: autoCapture,
      extraData: extraData,
      orderGroupId: orderGroupId,
      signature: signature,
    });

    const options = {
      hostname: process.env.MOMO_HOSTNAME,
      port: 443,
      path: "/v2/gateway/api/create",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(requestBody),
      },
    };

    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });
      res.on("end", () => {
        const response = JSON.parse(data);
        resolve(response.payUrl);
      });
    });

    req.on("error", (e) => {
      reject(e);
    });

    req.write(requestBody);
    req.end();
  });
}

app.post("/pay", async (req, res) => {
  const { amount } = req.body;
  try {
    const payUrl = await payMomo(amount);
    res.json({ payUrl });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/check", async (req, res) => {});

app.get("/welcome", (req, res) => {
  res.status(200).send({ message: "Welcome to the Momo REST-API" });
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  payMomo(4500);
});
