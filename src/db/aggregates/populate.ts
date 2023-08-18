export async function getAndPopulate(
  collection,
  filters: any = {},
  options: any = {},
  fields = []
) {
  const populations = [];
  let pipeline = [];

  pipeline.push({
    $match: filters,
  });
  pipeline.push({ $sort: { _id: -1 } });

  for (const field of fields) {
    const { field: name, collection, unwind } = field;

    populations.push({
      $lookup: {
        from: collection,
        localField: name,
        foreignField: "_id",
        as: name,
      },
    });

    if (unwind) {
      populations.push({ $unwind: { path: `$${name}` } });
    }
  }

  if (options.skip != null) {
    pipeline.push({ $skip: parseInt(options.skip) });
  }

  if (options.limit != null) {
    pipeline.push({ $limit: parseInt(options.limit) });
  }

  pipeline = pipeline.concat(populations);

  return await collection.aggregate(pipeline).toArray();
}
