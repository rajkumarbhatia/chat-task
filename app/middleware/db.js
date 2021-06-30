const {
  buildSuccObject,
  buildErrObject,
  itemNotFound
} = require('../middleware/utils')

var mongoose = require('mongoose');

/**
 * Builds sorting
 * @param {string} sort - field to sort from
 * @param {number} order - order for query (1,-1)
 */
const buildSort = (sort, order) => {
  const sortBy = {}
  sortBy[sort] = order
  return sortBy
}

/**
 * Hack for mongoose-paginate, removes 'id' from results
 * @param {Object} result - result object
 */
const cleanPaginationID = result => {
  result.docs.map(element => delete element.id)
  return result
}

/**
 * Builds initial options for query
 * @param {Object} query - query object
 */
const listInitOptions = async req => {
  return new Promise(resolve => {
    const order = req.query.order || -1
    const sort = req.query.sort || 'createdAt'
    const sortBy = buildSort(sort, order)
    const page = parseInt(req.query.page, 10) || 1
    const limit = parseInt(req.query.limit, 10) || 5
    const options = {
      sort: sortBy,
      lean: true,
      page,
      limit
    }
    resolve(options)
  })
}

module.exports = {
  /**
   * Checks the query string for filtering records
   * query.filter should be the text to search (string)
   * query.fields should be the fields to search into (array)
   * @param {Object} query - query object
   */
  async checkQueryString(query) {
    return new Promise((resolve, reject) => {
      try {
        if (
          typeof query.filter !== 'undefined' &&
          typeof query.fields !== 'undefined'
        ) {
          const data = {
            $or: []
          }
          const array = []
          // Takes fields param and builds an array by splitting with ','
          const arrayFields = query.fields.split(',')
          // Adds SQL Like %word% with regex
          arrayFields.map(item => {
            array.push({
              [item]: {
                $regex: new RegExp(query.filter, 'i')
              }
            })
          })
          // Puts array result in data
          data.$or = array
          resolve(data)
        } else {
          resolve({})
        }
      } catch (err) {
        console.log(err.message)
        reject(buildErrObject(422, 'ERROR_WITH_FILTER'))
      }
    })
  },

  /**
   * Gets items from database
   * @param {Object} req - request object
   * @param {Object} query - query object
   */
  async getItems(req, model, query) {
    const options = await listInitOptions(req)
    return new Promise((resolve, reject) => {
      model.paginate(query, options, (err, items) => {
        if (err) {
          reject(buildErrObject(422, err.message))
        }
        resolve(cleanPaginationID(items))
      })
    })
  },

  /**
   * Gets item from database by id
   * @param {string} id - item id
   */
  async getItem(id, model) {
    return new Promise((resolve, reject) => {
      model.findById(id, (err, item) => {
        itemNotFound(err, item, reject, 'NOT_FOUND')
        resolve(item)
      })
    })
  },

  /**
   * Creates a new item in database
   * @param {Object} req - request object
   */
  async createItem(req, model) {
    return new Promise((resolve, reject) => {
      model.create(req, (err, item) => {
        if (err) {
          reject(buildErrObject(422, err.message))
        }
        resolve(item)
      })
    })
  },

  /**
   * Updates an item in database by id
   * @param {string} id - item id
   * @param {Object} req - request object
   */
  async updateItem(id, model, req) {
    return new Promise((resolve, reject) => {
      model.findByIdAndUpdate(
        id,
        req,
        {
          new: true,
          runValidators: true
        },
        (err, item) => {
          itemNotFound(err, item, reject, 'NOT_FOUND')
          resolve(item)
        }
      )
    })
  },

  /**
   * Deletes an item from database by id
   * @param {string} id - id of item
   */
  async deleteItem(id, model) {
    return new Promise((resolve, reject) => {
      model.findByIdAndRemove(id, (err, item) => {
        itemNotFound(err, item, reject, 'NOT_FOUND')
        resolve(buildSuccObject('DELETED'))
      })
    })
  },


  /**
   * Get Chat list from database by user_id
   * @param {object} body 
   */
  async getChatList(body, model) {
    return new Promise((resolve, reject) => {
      try{

        const list = model.aggregate([
          // {
          //   $lookup : {
          //     from : "chats",
          //     localField : "room_id",
          //     foreignField : "room_id",
          //     as : "chats_data",
          //   }
          // },  
          {
            $lookup:
            {
              from: "chats",
              let: { room_id: "$room_id"},
              pipeline: [
                { $match: { $expr: {
                  $or: [
                      { $and: [
                          { $eq: [ "$room_id", "$$room_id" ] },
                          { $eq: [ "$room_type", "individual" ] },
                          { $eq: [ "$receiver_id", mongoose.Types.ObjectId('60db595189bd9107dccee0bb') ] },
                          { $eq: [ "$seen", false ] },

                          // { $eq: [ "$field1", 0 ] }
                      ]},
                      { $and: [
                        { $eq: [ "$room_id", "$$room_id" ] },
                        { $eq: [ "$room_type", "group" ] },
                        { "$not": { "$in": [mongoose.Types.ObjectId('60db595189bd9107dccee0bb'), "$seen_users"] }}
                        // { $nin: [ "$seen_users", [] ] },
                          // { $eq: [ "$field1", 1545001200 ] }
                      ]},
                  ],
              }}}
              ],
              as: "unread_chats"
            }
          },   
          
          {
            $project : {
              unread_chats : {
                $size : "$unread_chats"
              },
              room_id : 1,
              sender_id : 1,
              receiver_id : 1,
              room_type : 1,
            }
          },
          
          
          {
            $skip : 0
          },
          {
            $limit : 10
          }

        ])
        console.log(mongoose.Types.ObjectId('60db595189bd9107dccee0bb'));
        resolve(list)

      }catch(error){
        reject(buildErrObject(422, error.message))
      }

    })
  }
}
