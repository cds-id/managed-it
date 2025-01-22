import { paginate } from "blitz";
import { resolver } from "@blitzjs/rpc";
import db, { Prisma } from "db";

interface GetSprintsInput
  extends Pick<
    Prisma.SprintFindManyArgs,
    "where" | "orderBy" | "skip" | "take"
  > {}

export default resolver.pipe(
  resolver.authorize(),
  async ({ where, orderBy, skip = 0, take = 100 }: GetSprintsInput) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const {
      items: sprints,
      hasMore,
      nextPage,
      count,
    } = await paginate({
      skip,
      take,
      count: () => db.sprint.count({ where }),
      query: (paginateArgs) =>
        db.sprint.findMany({ ...paginateArgs, where, orderBy }),
    });

    return {
      sprints,
      nextPage,
      hasMore,
      count,
    };
  }
);
