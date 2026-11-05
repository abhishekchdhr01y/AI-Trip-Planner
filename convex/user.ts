import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const CreateNewUser = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    imageUrl: v.string(),
  },

  handler: async (ctx, args) => {
    const db = ctx.db as any;

    // if user already exist 
    const user = await db
      .query("userTable")
      .filter((q: any) => q.eq(q.field("email"), args.email))
      .collect();

    if (user?.length === 0) {
      const userData = {
        name: args.name,
        email: args.email,
        imageUrl: args.imageUrl,
      };

      // if not then create New user
      await db.insert("userTable", userData);
      return userData;
    }

    return user[0];
  },
});