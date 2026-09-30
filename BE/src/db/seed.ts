import { or, sql } from 'drizzle-orm';
import { db, pool } from './index.js';
import { exercise } from './schema.js';
import { builtInExercises } from './seed-data.js';

// Isi / perbarui latihan bawaan. Aman dijalankan berulang: baris yang tidak berubah
// tidak disentuh, jadi sync_seq-nya tetap dan klien tidak menarik ulang.
const now = new Date();

const written = await db
  .insert(exercise)
  .values(
    builtInExercises.map((e) => ({
      ...e,
      movement_key: e.movement_key ?? null,
      user_id: null,
      is_custom: false,
      created_at: now,
      updated_at: now,
      deleted_at: null,
    })),
  )
  .onConflictDoUpdate({
    target: exercise.id,
    set: {
      name: sql`excluded.name`,
      type: sql`excluded.type`,
      muscle_group: sql`excluded.muscle_group`,
      movement_key: sql`excluded.movement_key`,
      updated_at: sql`excluded.updated_at`,
      deleted_at: null,
      sync_seq: sql`nextval('sync_seq')`,
    },
    setWhere: or(
      sql`${exercise.name} is distinct from excluded.name`,
      sql`${exercise.type} is distinct from excluded.type`,
      sql`${exercise.muscle_group} is distinct from excluded.muscle_group`,
      sql`${exercise.movement_key} is distinct from excluded.movement_key`,
      sql`${exercise.deleted_at} is not null`,
    ),
  })
  .returning({ id: exercise.id });

console.log(`Seed latihan bawaan: ${written.length} baris ditulis dari ${builtInExercises.length}`);
await pool.end();
