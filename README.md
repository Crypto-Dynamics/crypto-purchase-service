Here is a clean and professional `README.md` file formatted for GitHub, based on the Pago Wallet integration documentation:

---

````markdown
# Pago Wallet Integration  
**Enable Crypto Onramp & Offramp via Bank Cards in Kenya**

This project demonstrates how to integrate **Pago Wallet** into a Node.js crypto service to enable users in Kenya to:

- **Buy Crypto (Onramp):** Purchase cryptocurrencies (BTC, ETH, USDT, etc.) using bank cards.
- **Sell Crypto (Offramp):** Convert crypto to KES and withdraw funds to a bank account.

---

## 🚀 Tech Stack

- **Node.js + Express** – Backend service
- **Sequelize** – Database models
- **Swagger** – API documentation
- **Pago Wallet API** – Payment processing

---

## 📘 API Environments

| Environment | Base URL |
|-------------|----------|
| Sandbox     | `https://api-sandbox.pagopay.com/v1` |
| Production  | `https://api.pagopay.com/v1`         |

### Authentication

Use your API key from Pago Wallet Dashboard:

```http
Authorization: Bearer <API_KEY>
````

---

## 🔁 Onramp: Buy Crypto with Bank Card

### Flow

1. User provides crypto type and card info.
2. Backend sends request to Pago.
3. On success, user’s crypto wallet is credited.

### Example (Node.js)

```js
const axios = require('axios');

async function processPagoPayment(cardDetails, amount, currency, cryptoType, user) {
  const response = await axios.post(
    `${process.env.PAGO_WALLET_BASE_URL}/transactions/card-to-crypto`,
    {
      cardNumber: cardDetails.cardNumber,
      cardHolder: cardDetails.cardHolder,
      expiryDate: cardDetails.expiryDate,
      cvv: cardDetails.cvv,
      amount,
      currency,
      cryptoCurrency: cryptoType,
      customerEmail: user.email,
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.PAGO_WALLET_API_KEY}`,
      },
    }
  );

  return {
    success: true,
    transactionId: response.data.transactionId,
    cryptoAmount: response.data.cryptoAmount,
  };
}
```

### Response

```json
{
  "success": true,
  "transactionId": "PAGO-123456789",
  "cryptoAmount": 0.005,
  "status": "completed"
}
```

---

## 🔄 Offramp: Sell Crypto to Bank Account

### Flow

1. User selects crypto and provides bank details.
2. Backend sends withdrawal request.
3. Crypto is converted and deposited to the bank.

### Example (Node.js)

```js
async function sellCryptoToBank(walletAddress, amount, cryptoType, bankAccount) {
  const response = await axios.post(
    `${process.env.PAGO_WALLET_BASE_URL}/transactions/crypto-to-bank`,
    {
      walletAddress,
      amount,
      cryptoCurrency: cryptoType,
      bankAccountNumber: bankAccount.accountNumber,
      bankCode: bankAccount.bankCode,
      recipientName: bankAccount.accountName,
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.PAGO_WALLET_API_KEY}`,
      },
    }
  );

  return {
    success: true,
    transactionId: response.data.transactionId,
    fiatAmount: response.data.fiatAmount,
  };
}
```

### Response

```json
{
  "success": true,
  "transactionId": "PAGO-987654321",
  "fiatAmount": 5000,
  "status": "processing"
}
```

---

## 📡 Webhooks: Real-Time Transaction Updates

### Setup Endpoint

```js
app.post('/pago-webhook', async (req, res) => {
  const { event, data } = req.body;

  if (event === "transaction.completed") {
    await Transaction.update(
      { status: "completed" },
      { where: { transactionReference: data.transactionId } }
    );
  }

  res.status(200).send("OK");
});
```

### Webhook Events

| Event                   | Description                    |
| ----------------------- | ------------------------------ |
| `transaction.completed` | Payment processed successfully |
| `transaction.failed`    | Payment failed                 |
| `withdrawal.processed`  | Crypto-to-bank completed       |

---

## 🇰🇪 Kenya Compliance & KYC

* Ensure Pago Wallet is registered with **CBK (Central Bank of Kenya)**.
* Require user ID (National ID/Passport) for transactions above **KES 100,000**.

### Fees (Indicative)

* **Onramp:** 2.5% – 4% (Card processing)
* **Offramp:** 1% – 2.5% (Bank transfer)

---

## 🧪 Sandbox Testing

| Scenario | Card Number           | CVV |
| -------- | --------------------- | --- |
| Success  | `4242 4242 4242 4242` | 123 |
| Failure  | `4000 0000 0000 0002` | 123 |

---

## ✅ Go-Live Checklist

* [x] Switch to **Production API Key**
* [x] Configure **Webhook URL**
* [x] Implement **KYC Checks**
* [x] Enforce **User Transaction Limits**

---

## 📚 References

* Pago Wallet Docs: [https://docs.pagopay.com](https://docs.pagopay.com)
* CBK Regulations: [https://www.centralbank.go.ke](https://www.centralbank.go.ke)

---

## License

MIT License. Use at your own discretion and ensure compliance with local regulations.

```

---

You can copy the above into a file called `README.md` and push it to your GitHub repository. Let me know if you'd like to include Docker instructions, Swagger setup, or a quickstart API test guide.
```
