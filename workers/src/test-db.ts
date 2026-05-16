const { drizzle } = require('drizzle-orm/d1');

export default {
  async fetch(request, env) {
    const db = drizzle(env.DB);
    try {
      const result = await db.select({ name: 'sqlite_master.name' })
        .from({ sqlite_master: 'sqlite_master' })
        .where({ type: 'table' })
        .all();
      return new Response(JSON.stringify(result));
    } catch (e) {
      return new Response(e.message, { status: 500 });
    }
  }
}
