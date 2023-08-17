export async function getAndPopulate(
  collection,
  filters: any = {},
  options: any = {},
  fields = []
) {
  const populations = [];

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
  let pipeline = [];

  pipeline.push({
    $match: filters,
  });

  if (options.skip != null) {
    pipeline.push({ $skip: options.skip });
  }

  if (options.limit != null) {
    pipeline.push({ $limit: options.limit });
  }

  pipeline = pipeline.concat(populations);

  return await collection.aggregate(pipeline).toArray();
}
