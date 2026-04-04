function checkoutValidation(req, res, next) {
  const {
    user_name,
    user_surname,
    user_email,
    shipping_city,
    shipping_address,
    shipping_postal_code,
    shipping_country,
    total_price,
    coupon,
    coupon_id,
    loot,
  } = req.body;

  if (
    typeof user_name !== "string" ||
    !user_name.trim() ||
    typeof user_surname !== "string" ||
    !user_surname.trim() ||
    typeof user_email !== "string" ||
    !user_email.trim() ||
    typeof shipping_city !== "string" ||
    !shipping_city.trim() ||
    typeof shipping_address !== "string" ||
    !shipping_address.trim() ||
    typeof shipping_postal_code !== "string" ||
    !shipping_postal_code.trim() ||
    typeof shipping_country !== "string" ||
    !shipping_country.trim()
  ) {
    return res.status(400).json({
      success: false,
      error: "Bad request",
    });
  }

  if (isNaN(total_price) || total_price <= 0) {
    return res.status(400).json({
      success: false,
      error: "Bad request",
    });
  }

  if (typeof coupon != "boolean") {
    return res.status(400).json({
      success: false,
      error: "Bad request",
    });
  }

  if (typeof coupon_id != "undefined" && typeof coupon_id != "number") {
    return res.status(400).json({
      success: false,
      error: "Bad request",
    });
  }

  if (loot.length === 0) {
    return res.status(400).json({
      success: false,
      error: "Bad request",
    });
  }

  for (const el of loot) {
    const { id, finalPrice, quantity } = el;
    if (isNaN(id) || isNaN(quantity) || isNaN(finalPrice)) {
      return res.status(400).json({
        success: false,
        error: "Bad request",
      });
    }
  }

  next();
}

module.exports = checkoutValidation;
