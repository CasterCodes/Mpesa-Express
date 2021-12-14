const { default: axios } = require("axios");

exports.getAuthToken = async (req, res, next) => {
  let buffer = new Buffer.from(
    process.env.CONSUMER_KEY + ":" + process.env.CONSUMER_SECRET
  );

  let auth = `Basic ${buffer.toString("base64")}`;

  try {
    let { data } = await axios.get(process.env.OAUTH_TOKEN_URL, {
      headers: {
        Authorization: auth,
      },
    });

    const accessToken = data.access_token;

    req.accessToken = accessToken;

    next();
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: {
        error,
      },
    });
  }
};
