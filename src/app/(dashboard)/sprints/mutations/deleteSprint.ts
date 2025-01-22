import { resolver } from "@blitzjs/rpc";
import db from "db";
import { DeleteSprintSchema } from "../schemas";

export default resolver.pipe(
  resolver.zod(DeleteSprintSchema),
  resolver.authorize(),
  async ({ id }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const sprint = await db.sprint.deleteMany({ where: { id } });

    return sprint;
  }
);
