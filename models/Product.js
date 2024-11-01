import mongoose, { Schema, model, models } from "mongoose";

// Vérifier si le modèle existe déjà
const Product = models.Product || model('Product', new Schema({
    title: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    category : {type:mongoose.Types.ObjectId, ref:'Category'},
    properties: {type: Object},
    images: String,
}, {
    timestamps: true,
}));

export { Product };
