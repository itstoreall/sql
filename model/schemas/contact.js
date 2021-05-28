const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const { Schema, SchemaTypes } = mongoose;

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Set name for contact'],
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    address: {
      type: Array,
      set: data => data || [],
    },
    account: {
      name: String,
      address: String,
    },
    owner: {
      type: SchemaTypes.ObjectId, // id from mongoose
      ref: 'user', // ref link to user collection
    },
  },
  {
    versionKey: false,
    timestamps: true,
    toObject: {
      virtuals: true, // show virtual fields in console

      // hide fields from console
      transform: function (doc, ret) {
        delete ret._id;
        delete ret.shortContact;
        return ret;
      },
    },
    toJSON: {
      virtuals: true, // show virtual fields in return

      // hide fields from return
      transform: function (doc, ret) {
        delete ret._id;
        delete ret.shortContact;
        return ret;
      },
    },
  },
);

contactSchema.virtual('shortContact').get(function () {
  return `This is contact ${this.name} - ${this.phone}`;
});

contactSchema.path('name').validate(value => {
  const re = /[A-Z]\w+/;
  return re.test(String(value));
});

// Connects pagination
contactSchema.plugin(mongoosePaginate);

const Contact = mongoose.model('contact', contactSchema);

module.exports = Contact;
