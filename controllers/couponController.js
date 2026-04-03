const connect = require("../database/db");

function sendCoupon(req, res) {
  const { code } = req.body;
  if (typeof code != "string" || !code.trim()) {
    return res.status(400).json({
      success: false,
      error: "Bad request",
    });
  }
  const sql =
    "select *,DATE(start_date) as start ,DATE(end_date) as end from coupons where code=?";

  connect.query(sql, [code], (err, resultQuery) => {
    if (err)
      return res.status(500).json({
        success: false,
        error: "Internal server error",
      });

    if (resultQuery.length > 0) {
      const today = new Date().toISOString().slice(0, 10);
      const start = new Date(resultQuery[0]?.start).toISOString().slice(0, 10);
      const end = new Date(resultQuery[0]?.end).toISOString().slice(0, 10);

      if (today > start && today < end) {
        return res.json({
          success: true,
          result: {
            valid: true,
            discount: resultQuery[0].discount,
          },
        });
      } else {
        return res.json({
          success: false,
          result: {
            valid: false,
          },
        });
      }
    } else {
      return res.json({
        success: false,
        result: {
          valid: false,
        },
      });
    }
  });
}

module.exports = { sendCoupon };
