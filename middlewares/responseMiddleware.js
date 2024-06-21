const Joi = require('joi');

const transactionSchema = Joi.object({
  from: Joi.string().required(),
  to: Joi.string().required(),
  value: Joi.number().positive().required(),
  transactionHash: Joi.string().required()
});

function responseValidator(req, res, next) {
  const data = req.responseData;

  const { error } = transactionSchema.validate(data);
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      data: error.details
    });
  }

  res.status(200).json({
    success: true,
    message: 'Transaction data',
    data
  });
}

module.exports = responseValidator;
