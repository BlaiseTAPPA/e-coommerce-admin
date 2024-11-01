// Dans le fichier Category.js
import mongoose , { Schema, model, models } from "mongoose";

// Vérifier si le modèle existe déjà
const CategorySchema = new Schema({
    name: { type: String, required: true },
    parent: {type:mongoose.Types.ObjectId, ref:'Category'},
    properties: [{type:Object}]
});

const Category = models.Category || model('Category', CategorySchema);

export { Category };
