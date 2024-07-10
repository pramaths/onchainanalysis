const Joi = require('joi');

const transactionSchema = Joi.object({
    transactionHash: Joi.string().alphanum().required(),
    from_address: Joi.string().alphanum().required(),
    to_address: Joi.string().alphanum().length(42).required(),
    value: Joi.string().regex(/^\d+$/).required(),
    timestamp: Joi.date().timestamp('unix').required(),
    nonce: Joi.number().integer().min(0).required(),
    blockNumber: Joi.number().integer().positive().required(),
    status: Joi.boolean().required(),
    contractAddress: Joi.string().alphanum().optional(),
    logs: Joi.array().optional()
});

function validateTransaction(tx) {
    const { error, value } = transactionSchema.validate(tx);
    if (error) {
        console.error(`Validation error: ${error.message}`);
        return { valid: false, message: error.message };
    }
    console.log('Transaction is valid:', value);
    return { valid: true, data: value };
}


module.exports = { validateTransaction };