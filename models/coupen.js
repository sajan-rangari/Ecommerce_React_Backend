
const mongoose = require('mongoose');


const coupenSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    discountType: {
        type: String,
        required: true
    },
    discountValue: {
        type: String,
        required: true
    },
    minOrderAmount: {
        type: String,
        required: true
    },
    expiryDate: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    }
})

coupenSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

coupenSchema.set('toJSON', {
    virtuals: true,
});

exports.Coupen = mongoose.model('Coupen', coupenSchema);