let Promise = require('bluebird')

// Basic function to encapsulate everything needed to run a request - tiny wrapper over raw mongo syntax
let mongoDSL = (client, dsl) => {
  let Collection = client.collection(dsl.collection)
  if (dsl.aggs) return Collection.aggregate(dsl.aggs).toArray()
}

let MongoProvider = config => ({
  groupCombinator: (group, filters) => ({
    [`$${group.join === 'not' ? 'nor' : group.join}`]: filters,
  }),
  types: config.types,
  runSearch(options, node, schema, filters, aggs) {
    console.log({ options, node, filters, aggs })
    let client = config.getClient()

    let request = {
      request: {
        // criteria: filters,
        collection: schema.mongo.collection,
        aggs: [
          {
            $match: filters || {},
          },
          ...(node.lookup
            ? [
                {
                  $lookup: {
                    from: node.lookup.from || node.lookup,
                    localField: node.lookup.localField || node.lookup,
                    foreignField: node.lookup.foreignField || '_id',
                    as: node.lookup.as || node.lookup,
                  },
                },
                {
                  $unwind: {
                    path: node.lookup.unwindPath || node.lookup,
                    preserveNullAndEmptyArrays: true,
                  },
                },
              ]
            : {}),
          ...aggs,
        ],
      },
    }

    // Log Request
    node._meta.requests.push(request)

    let result = Promise.resolve(mongoDSL(client, request.request))
    return result.tap(results => {
      // Log response
      request.response = results
    })
  },
})

module.exports = MongoProvider
