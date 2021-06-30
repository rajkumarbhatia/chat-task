const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const ChatSchema = new mongoose.Schema(
  {
    room_id: { // Unique id
      type: String,
      required: true
    },

    message : {
        type : String,
    },

    message : {
        type : String,
    },

    seen : {
        type : Boolean,
        default : false
    },

    seen_users : [{type : mongoose.Schema.Types.ObjectId,ref : "User"}], // when `room_type` = `individual`,

    primary_room_id: { // Object id from `Room`
        type : mongoose.Schema.Types.ObjectId,
        ref : "Room",
    },

    sender_id : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
    },

    receiver_id : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
    },

    room_type : {
        type : String,
        enum : ["group",'individual'],
    },
    
    members:[{type : mongoose.Schema.Types.ObjectId,ref : "User"}], // when `room_type` = `individual`

  },
  {
    versionKey: false,
    timestamps: true
  }
)
ChatSchema.plugin(mongoosePaginate)
module.exports = mongoose.model('Chat', ChatSchema)
