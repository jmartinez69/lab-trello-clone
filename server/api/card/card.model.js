const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CardSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"]
    },
    description: String,
    dueDate: {
      type: Date,
      default: Date.now
    },
    position: Number,
    list: {
      type: Schema.Types.ObjectId,
      ref: "List",
      require: true
    }
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  }
);

module.exports = mongoose.model("Card", CardSchema);
