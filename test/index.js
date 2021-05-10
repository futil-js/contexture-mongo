let { expect } = require('chai')
let MongoProvider = require('../src/index')
let { MongoClient } = require('mongodb')
let { MongoMemoryServer } = require('mongodb-memory-server')

let getClient = () => new MongoMemoryServer()

// let aggregate

// before(async () => {
//   let mongoServer = new MongoMemoryServer()
//   let mongoUri = await mongoServer.getConnectionString()
//   let conn = await MongoClient.connect(mongoUri, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   let db = conn.db(await mongoServer.getDbName())
//   let col = db.collection('test')

//   // Generate sample data
//   let sampleData = _.times(
//     i => ({
//       createdAt: new Date(`2020-02-0${(i % 5) + 1}`),
//       metrics: { usersCount: i * 100 },
//     }),
//     50
//   )
//   col.insertMany(sampleData)
//   aggregate = aggs => col.aggregate(aggs).toArray()
// })

let fullLookup = {
  from: 'organization',
  localField: 'organization',
  foreignField: '_id',
  as: 'organization',
}

let stuff = {
  options: {},
  node: {
    field: 'organization',
    type: 'facet',
    isMongoId: true,
    paused: false,
    lookup: 'organization',
    values: ['53b46fec938d8948dw294gl0'],
    mode: 'include',
    optionsFilter: '',
    key: 'organization-facet',
    lastUpdateTime: 1603807973631,
    schema: 'user',
  },
  schema: {
    securityRules: 'restrictToSameOrg',
    mongo: { collection: 'user' },
    fields: {
      _id: {
        typeDefault: 'mongoId',
        typeOptions: ['mongoId'],
        mongo: { dataType: 'objectId' },
        field: '_id',
        label: 'Id',
        defaultComponentProps: { Facet: {} },
        hide: { facetFilter: true },
        defaultNodeProps: { facet: { isMongoId: true } },
      },
      organization: {
        typeDefault: 'mongoId',
        typeOptions: ['mongoId'],
        mongo: { dataType: 'objectId' },
        field: 'organization',
        label: 'Agency',
        defaultComponentProps: { Facet: {} },
        hide: { facetFilter: true },
        defaultNodeProps: { facet: { isMongoId: true } },
      },
    },
  },
  filters: {
    $and: [
      { isDeleted: { $nin: [true] } },
      { status: { $in: ['open'] } },
      { dueAt: { $gte: '2020-10-27T14:23:28.397Z' } },
      {
        $or: [
          { maxResponses: { $gte: 0, $lte: 0 } },
          { remainingSlots: { $gte: 1 } },
        ],
      },
      { organization: { $in: ['53b46fec938d89315aae1940'] } },
    ],
  },
  aggs: [
    { $unwind: '$organization' },
    { $group: { _id: '$organization' } },
    { $group: { _id: 1, count: { $sum: 1 } } },
  ],
}

describe('MongoProvider', () => {
  xit('should return a standard search', () => {})
  xit('should run a simple lookup/unwind on a node with a string "lookup" property', () => {})
  xit('should run a custom lookup on a node with a custom object "lookup" property', () => {})
  xit('should not unwind the lookup if noUnwind is true', () => {})
})
