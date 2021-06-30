const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const RoomSchema = new mongoose.Schema(
  {
    room_id: {
      type: String,
      required: true
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
    
    // members:[{type : mongoose.Schema.Types.ObjectId,ref : "User"}], // when `room_type` = `individual`

  },
  {
    versionKey: false,
    timestamps: true
  }
)
RoomSchema.plugin(mongoosePaginate)
module.exports = mongoose.model('Room', RoomSchema)
