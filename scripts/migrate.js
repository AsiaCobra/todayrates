import pg from 'pg'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import * as dotenv from 'dotenv'

dotenv.config()

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Get database URL from env
const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl) {
  console.error('❌ DATABASE_URL not found in .env')
  console.error('   Get it from: Supabase Dashboard > Settings > Database > Connection string > URI')
  console.error('   Add to .env: DATABASE_URL=postgresql://postgres.[ref]:[password]@aws-0-...')
  process.exit(1)
}

async function migrate() {
  console.log('🚀 Running migrations...\n')

  const client = new pg.Client({
    connectionString: databaseUrl,
    ssl: { rejectUnauthorized: false }
  })

  try {
    await client.connect()
    console.log('✅ Connected to database\n')

    // Read and execute setup-db.sql
    const sqlPath = path.join(__dirname, '..', 'setup-db.sql')
    const sql = fs.readFileSync(sqlPath, 'utf8')

    console.log('📄 Executing setup-db.sql...')
    await client.query(sql)
    console.log('✅ Migration complete!\n')

  } catch (error) {
    console.error('❌ Migration failed:', error.message)
    process.exit(1)
  } finally {
    await client.end()
  }
}

migrate()
