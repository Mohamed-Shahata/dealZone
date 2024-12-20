export const globelResponse = ((err, req, res, next) => {
  if (err) {
    return res.status(err["cause"] || 500).json({
      message: "catch error",
      errorMsg: err.message
    })
  }
})