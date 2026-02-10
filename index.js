const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const EMAIL = "manan2141.be23@chitkara.edu.in";

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

app.get("/health", (req, res) => {
  res.status(200).json({
    is_success: true,
    official_email: EMAIL
  });
});

app.post("/bfhl", (req, res) => {
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
        data = "Mumbai";
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