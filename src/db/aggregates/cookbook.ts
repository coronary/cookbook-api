import { COLLECTIONS } from "../db";

export async function getAndPopulateCookbooks(cookbookName: string) {
  return await COLLECTIONS.COOKBOOKS.aggregate([
    {
      $match: {
        $expr: {
          $eq: ["$name", cookbookName],
        },
      },
    },
    {
      $lookup: {
        from: "guides",
        localField: "guides",
        foreignField: "_id",
        as: "guides_arr",
      },
    },
    {
      $lookup: {
        from: "sections",
        localField: "guides_arr.sections",
        foreignField: "_id",
        as: "sections_arr",
      },
    },
    {
      $addFields: {
        guides_arr: {
          $map: {
            input: "$guides_arr",
            as: "g",
            in: {
              $mergeObjects: [
                "$$g",
                {
                  sections: {
                    $map: {
                      input: "$$g.sections",
                      as: "s",
                      in: {
                        $first: {
                          $filter: {
                            input: "$sections_arr",
                            cond: { $eq: ["$$s", "$$this._id"] },
                          },
                        },
                      },
                    },
                  },
                },
              ],
            },
          },
        },
      },
    },
    {
      $addFields: {
        guides: {
          $map: {
            input: "$guides",
            as: "g",
            in: {
              $first: {
                $filter: {
                  input: "$guides_arr",
                  cond: { $eq: ["$$g", "$$this._id"] },
                },
              },
            },
          },
        },
      },
    },
    {
      $unset: ["guides_arr", "sections_arr"],
    },
  ]).toArray();
}
