const { default: axios } = require("axios");
const { timestamp } = require("../helpers/timestamp.helper");

exports.lipaNaMpesaHandler = async (req, res, next) => {
  const { amount, phone } = req.body;

  const token = req.accessToken;

  const passkey = process.env.PASS_KEY;

  const businessShortCode = process.env.SHORT_CODE;

  if (!token || !amount || !phone) {
    res.status(404).json({
      message: "There is something wrong",
    });
  }

  console.log({
    callBack: process.env.LIPA_NA_MPESA_CALLBACK_URL,
  });

  const auth = `Bearer ${token}`;

  const payload = {
    BusinessShortCode: +businessShortCode,
    Password: new Buffer.from(
      `${businessShortCode}${passkey}${timestamp}`
    ).toString("base64"),
    Timestamp: timestamp,
    TransactionType: "CustomerPayBillOnline",
    Amount: amount,
    PartyA: phone,
    PartyB: +process.env.SHORT_CODE,
    PhoneNumber: phone,
    CallBackURL: process.env.LIPA_NA_MPESA_CALLBACK_URL,
    AccountReference: "CompanyXLTD",
    TransactionDesc: "Payment of X",
  };

  try {
    let { data } = await axios.post(process.env.LIPA_NA_MPESA_URL, payload, {
      headers: {
        Authorization: auth,
      },
    });

    res.status(200).json({
      message: "success",
      data: {
        data,
      },
    });
  } catch (error) {
    console.log({ error });
    res.status(401).json({
      status: "fail",
      message: {
        error: error["response"]["statusText"],
      },
    });
  }
};

exports.lipaNaMpesaCallBackHandler = (req, res) => {
  const data = req.body.Body.stkCallback;

  console.log({
    response: data,
    data: data.CallbackMetadata,
  });
};
