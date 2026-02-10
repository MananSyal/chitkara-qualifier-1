const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

const EMAIL = "manan2141.be23@chitkara.edu.in";

/* ---------- HELPER FUNCTIONS ---------- */

function fibonacci(n) {
  const result = [0, 1];
  for (let i = 2; i < n; i++) {
    result.push(result[i - 1] + result[i - 2]);
  }
  return result.slice(0, n);
}

function isPrime(num) {
  if (num < 2) return false;
  for (let i = 2; i * i <= num; i++) {
    if (num % i === 0) return false;
  }
  return true;
}

function gcd(a, b) {
  return b === 0 ? a : gcd(b, a % b);
}

function lcm(a, b) {
  return (a * b) / gcd(a, b);
}

/* ---------- ROUTES ---------- */

app.get("/health", (req, res) => {
  res.status(200).json({
    is_success: true,
    official_email: EMAIL
  });
});

app.post("/bfhl", async (req, res) => {
  try {
    const body = req.body;
    const keys = Object.keys(body);

    if (keys.length !== 1) {
      return res.status(400).json({
        is_success: false,
        error: "Request must contain exactly one key"
      });
    }

    const key = keys[0];
    let data;

    switch (key) {
      case "fibonacci":
        data = fibonacci(body.fibonacci);
        break;

      case "prime":
        data = body.prime.filter(isPrime);
        break;

      case "lcm":
        data = body.lcm.reduce((a, b) => lcm(a, b));
        break;

      case "hcf":
        data = body.hcf.reduce((a, b) => gcd(a, b));
        break;
case "AI":
  if (typeof body.AI !== "string") {
    return res.status(400).json({
      is_success: false,
      error: "AI input must be a string"
    });
  }

  const geminiResponse = await axios.post(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent",
    {
      contents: [
        {
          parts: [{ text: body.AI }]
        }
      ]
    },
    {
      params: {
        key: process.env.GEMINI_API_KEY
      },
      timeout: 15000
    }
  );

  const aiText =
    geminiResponse.data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!aiText) {
    return res.status(500).json({
      is_success: false,
      error: "AI response unavailable"
    });
  }

  data = aiText.trim().split(/\s+/)[0];
  break;

      default:
        return res.status(400).json({
          is_success: false,
          error: "Invalid key"
        });
    }

    res.status(200).json({
      is_success: true,
      official_email: EMAIL,
      data: data
    });

  } catch (err) {
    res.status(500).json({
      is_success: false,
      error: "Server error"
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});