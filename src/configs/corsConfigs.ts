const whitelist = ["http://localhost:5173"];

export default {
  origin: function (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void
  ) {
    if (whitelist.indexOf(origin || "") !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "PUT", "POST", "DELETE"],
  optionsSuccessStatus: 200,
  credentials: true,
  allowedHeaders: [
    "Language",
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "device-remember-token",
    "Access-Control-Allow-Origin",
    "Origin",
    "Accept",
    "X-Password-Confirmation",
    "token",
  ],
};
