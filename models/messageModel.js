const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    senderId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User',
      required: true
    },
    recieverId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User',
      required: true
    },
    message: {
      type: String, 
      required: true,
      maxLength: 1000,
      trim: true,
      validate: [
        {
          validator: (value) => value.length > 0,
          message: 'Message cannot be empty',
        },
        {
          validator: (value) => /^[a-zA-Z0-9\s]*$/.test(value),
          message: 'Message can only contain alphanumeric characters and spaces',
        },
      ],
    },
    status: {
      type: String,
      enum: ['sent', 'delivered', 'seen'],
      default: 'sent',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Message = mongoose.model('Message', messageSchema);
module.exports = { Message };

// const mongoose = require("mongoose");

// const messageSchema = new mongoose.Schema(
//   {
//     senderId: { 
//       type: mongoose.Schema.Types.ObjectId, 
//       ref: 'User',
//       required: true
//     },
//     recieverId: { 
//       type: mongoose.Schema.Types.ObjectId, 
//       ref: 'User',
//       required: true
//     },
//     message: {
//       type: String, 
//       required: true,
//       maxLength: 1000,
//       trim: true,
//       validate: [
//         {
//           validator: (value) => value.length > 0,
//           message: 'Message cannot be empty',
//         },
//         {
//           validator: (value) => /^[a-zA-Z0-9\s]*$/.test(value),
//           message: 'Message can only contain alphanumeric characters and spaces',
//         },
//       ],
//     },
//     createdAt: {
//       type: Date,
//       default: Date.now,
//     },
//   },
//   { timestamps: true } // ✅ Fixed placement
// );

// const Message = mongoose.model('Message', messageSchema);
// module.exports = { Message };
