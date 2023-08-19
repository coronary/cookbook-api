export async function getAndPopulate(
  collection,
  filters: any = {},
  options: any = {},
  search,
  fields: {
    populateFields: Array<{
      field: string;
      collection: string;
      unwind?: boolean;
    }>;
    searchFields?: string[];
    tags?: string[];
  }
) {
  const { populateFields, searchFields, tags } = fields;
  const populations = [];
  let pipeline = [];

  pipeline.push({
    $match: filters,
  });

  pipeline.push({ $sort: { _id: -1 } });

  for (const field of populateFields) {
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

  if (options.skip != null && search == null) {
    pipeline.push({ $skip: parseInt(options.skip) });
  }

  if (options.limit != null && search == null) {
    pipeline.push({ $limit: parseInt(options.limit) });
  }

  pipeline = pipeline.concat(populations);

  if (search != null && searchFields != null) {
    const searchAggregate = {
      $match: {
        $or: searchFields.map((field) => {
          return {
            [field]: { $regex: search, $options: "i" },
          };
        }),
        ...(tags != null &&
          tags.length > 0 && {
            "tags.name": { $all: tags },
          }),
      },
    };

    pipeline.push({ $sort: { _id: -1 } });
    pipeline.push(searchAggregate);

    if (options.skip != null) {
      pipeline.push({ $skip: parseInt(options.skip) });
    }

    if (options.limit != null) {
      pipeline.push({ $limit: parseInt(options.limit) });
    }
  }

  return await collection.aggregate(pipeline).toArray();
}
