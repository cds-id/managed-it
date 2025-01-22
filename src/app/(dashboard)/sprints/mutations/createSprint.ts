import { resolver } from "@blitzjs/rpc";
import db from "db";
import { CreateSprintSchema } from "../schemas";

export default resolver.pipe(
  resolver.zod(CreateSprintSchema),
  resolver.authorize(),
  async (input) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const sprint = await db.sprint.create({ data: input });

    return sprint;
  }
);
