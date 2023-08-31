const corsOptions = {
  credentials: true,
  origin: (origin, callback) => {
    const allow_origins = ["https://brilliant-kataifi-2b7724.netlify.app"];
    if (allow_origins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  optionSuccessStatus: 200,
};
module.exports = {
  corsOptions,
};
