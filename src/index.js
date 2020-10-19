let Promise = require('bluebird')
let _ = require('lodash/fp')

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
                    from: _.getOr(node.lookup, 'lookup.from', node),
                    localField: _.getOr(node.lookup, 'lookup.localField', node),
                    foreignField: _.getOr('_id', 'lookup.foreignField', node),
                    as: _.getOr(node.lookup, 'lookup.as', node),
                  },
                },
                {
                  $unwind: {
                    path: _.getOr(node.lookup, 'lookup.unwind', node),
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
