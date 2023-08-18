import { COLLECTIONS } from "../db";

export async function getSectionFromNames(
  cookbookName: string,
  guideName: string,
  sectionName: string
) {
  return await COLLECTIONS.COOKBOOKS.aggregate([
    [
      {
        $match: {
          name: cookbookName,
        },
      },
      {
        $lookup: {
          from: "guides",
          localField: "guides",
          foreignField: "_id",
          as: "guides",
          pipeline: [
            {
              $match: {
                name: guideName,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "sections",
          localField: "guides.sections",
          foreignField: "_id",
          as: "guides.sections",
          pipeline: [
            {
              $match: {
                name: sectionName,
              },
            },
          ],
        },
      },
      {
        $unwind: {
          path: "$guides.sections",
        },
      },
      {
        $project: {
          _id: "$guides.sections._id",
          name: "$guides.sections.name",
          body: "$guides.sections.body",
        },
      },
    ],
  ]);
}
