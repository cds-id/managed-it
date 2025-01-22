import { resolver } from "@blitzjs/rpc";
import db from "db";
import { CreateClientSchema } from "../schemas";

export default resolver.pipe(
  resolver.zod(CreateClientSchema),
  resolver.authorize(),
  async (input) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const client = await db.client.create({ data: input });

    return client;
  }
);
