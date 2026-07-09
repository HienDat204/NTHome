/**
 * Migration Script: Base64 Images → File Storage
 *
 * Converts all base64-encoded images stored in the database to actual files
 * on disk and updates the database records with file paths.
 *
 * Usage:
 *   node prisma/migrate-base64-to-files.js          # Run live migration
 *   node prisma/migrate-base64-to-files.js --dry-run  # Preview only
 *
 * Make sure DATABASE_URL is set to your local SQLite in .env.local before running.
 * (Prisma client loads .env, but NOT .env.local, so we load it manually below.)
 */

const path = require('path')

// Load .env.local manually so script can run outside Next.js
try {
  require('dotenv').config({ path: path.join(process.cwd(), '.env.local') })
} catch (_) {
  // dotenv may not be installed; try dotenv-expand fallback
  try {
    const dotenv = require('dotenv')
    const fs = require('fs')
    const envPath = path.join(process.cwd(), '.env.local')
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf-8')
      envContent.split('\n').forEach(line => {
        const [key, ...valueParts] = line.split('=')
        if (key && valueParts.length) {
          const val = valueParts.join('=').trim()
          if (!process.env[key.trim()]) {
            process.env[key.trim()] = val
          }
        }
      })
    }
  } catch (_2) { /* ignore */ }
}

const { PrismaClient } = require('@prisma/client')
const { writeFile, mkdir, unlink } = require('fs/promises')
const { existsSync } = require('fs')

const prisma = new PrismaClient()
const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads')

const DRY_RUN = process.argv.includes('--dry-run')

function isBase64Image(value) {
  return typeof value === 'string' && value.startsWith('data:')
}

function extractBase64Data(dataUrl) {
  const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/)
  if (!match) return null
  return { mimeType: match[1], data: match[2] }
}

function getExtension(mimeType) {
  const map = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/gif': '.gif',
    'image/webp': '.webp',
  }
  return map[mimeType] || '.jpg'
}

async function saveBase64AsFile(dataUrl, prefix = '') {
  const extracted = extractBase64Data(dataUrl)
  if (!extracted) return null

  const { mimeType, data } = extracted
  const ext = getExtension(mimeType)
  const filename = `${prefix}${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`
  const filepath = path.join(UPLOAD_DIR, filename)

  if (DRY_RUN) {
    console.log(`  [DRY RUN] Would save: ${filename}`)
    return `/uploads/${filename}`
  }

  if (!existsSync(UPLOAD_DIR)) {
    await mkdir(UPLOAD_DIR, { recursive: true })
  }

  const buffer = Buffer.from(data, 'base64')
  await writeFile(filepath, buffer)
  console.log(`  ✓ Saved: ${filename} (${(buffer.length / 1024).toFixed(1)} KB)`)
  return `/uploads/${filename}`
}

async function migrateModel(modelName, records, getImageFields, updateFn) {
  console.log(`\n📦 Migrating ${modelName}...`)
  let migrated = 0
  let skipped = 0

  for (const record of records) {
    const fields = getImageFields(record)
    const hasBase64 = Object.values(fields).some(isBase64Image)

    if (!hasBase64) {
      skipped++
      continue
    }

    const updates = {}
    const base64Images = []

    for (const [fieldName, value] of Object.entries(fields)) {
      if (isBase64Image(value)) {
        const newPath = await saveBase64AsFile(value, `${modelName.toLowerCase()}-${record.id}-${fieldName}-`)
        if (newPath) {
          updates[fieldName] = newPath
          base64Images.push(value.substring(0, 80) + '...')
        }
      } else if (value) {
        updates[fieldName] = value
      }
    }

    if (Object.keys(updates).length > 0 && !DRY_RUN) {
      try {
        await updateFn(record.id, updates)
        migrated++
      } catch (err) {
        console.error(`  ✗ Failed to update ${modelName} ${record.id}: ${err.message}`)
      }
    } else if (DRY_RUN) {
      migrated++
    }
  }

  console.log(`  → Migrated: ${migrated}, Skipped (no base64): ${skipped}`)
  return { migrated, skipped }
}

async function migratePropertyImages() {
  console.log(`\n📦 Migrating PropertyImage records...`)
  const images = await prisma.propertyImage.findMany()
  let migrated = 0
  let skipped = 0

  for (const img of images) {
    if (!isBase64Image(img.imageUrl)) {
      skipped++
      continue
    }

    const newPath = await saveBase64AsFile(img.imageUrl, `property-img-${img.id}-`)
    if (newPath && !DRY_RUN) {
      await prisma.propertyImage.update({
        where: { id: img.id },
        data: { imageUrl: newPath },
      })
    }
    migrated++
  }

  console.log(`  → Migrated: ${migrated}, Skipped: ${skipped}`)
  return { migrated, skipped }
}

async function migrateProjectImages() {
  console.log(`\n📦 Migrating ProjectImage records...`)
  const images = await prisma.projectImage.findMany()
  let migrated = 0
  let skipped = 0

  for (const img of images) {
    if (!isBase64Image(img.imageUrl)) {
      skipped++
      continue
    }

    const newPath = await saveBase64AsFile(img.imageUrl, `project-img-${img.id}-`)
    if (newPath && !DRY_RUN) {
      await prisma.projectImage.update({
        where: { id: img.id },
        data: { imageUrl: newPath },
      })
    }
    migrated++
  }

  console.log(`  → Migrated: ${migrated}, Skipped: ${skipped}`)
  return { migrated, skipped }
}

async function main() {
  console.log('='.repeat(60))
  console.log('  Base64 → File Storage Migration')
  console.log('='.repeat(60))
  console.log(`Mode: ${DRY_RUN ? 'DRY RUN (no changes written)' : 'LIVE (changes will be written)'}`)
  console.log(`Upload dir: ${UPLOAD_DIR}`)

  try {
    // Count before
    const propCount = await prisma.property.count()
    const projCount = await prisma.project.count()
    const articleCount = await prisma.article.count()
    const propImgCount = await prisma.propertyImage.count()
    const projImgCount = await prisma.projectImage.count()

    console.log(`\nDatabase records:`)
    console.log(`  Properties: ${propCount}`)
    console.log(`  Projects: ${projCount}`)
    console.log(`  Articles: ${articleCount}`)
    console.log(`  PropertyImages: ${propImgCount}`)
    console.log(`  ProjectImages: ${projImgCount}`)

    // Migrate Property thumbnails
    const properties = await prisma.property.findMany({ where: { thumbnail: { not: '' } } })
    const propResult = await migrateModel(
      'Properties (thumbnails)',
      properties,
      (r) => ({ thumbnail: r.thumbnail }),
      async (id, updates) => {
        await prisma.property.update({ where: { id }, data: updates })
      }
    )

    // Migrate Project thumbnails
    const projects = await prisma.project.findMany({ where: { thumbnail: { not: '' } } })
    const projResult = await migrateModel(
      'Projects (thumbnails)',
      projects,
      (r) => ({ thumbnail: r.thumbnail }),
      async (id, updates) => {
        await prisma.project.update({ where: { id }, data: updates })
      }
    )

    // Migrate Article thumbnails
    const articles = await prisma.article.findMany({ where: { thumbnail: { not: '' } } })
    const artResult = await migrateModel(
      'Articles (thumbnails)',
      articles,
      (r) => ({ thumbnail: r.thumbnail }),
      async (id, updates) => {
        await prisma.article.update({ where: { id }, data: updates })
      }
    )

    // Migrate PropertyImage rows
    const propImgResult = await migratePropertyImages()

    // Migrate ProjectImage rows
    const projImgResult = await migrateProjectImages()

    // Summary
    const totalMigrated =
      propResult.migrated + projResult.migrated + artResult.migrated +
      propImgResult.migrated + projImgResult.migrated

    console.log('\n' + '='.repeat(60))
    console.log('  Migration Complete')
    console.log('='.repeat(60))
    console.log(`  Total records migrated: ${totalMigrated}`)
    console.log(`  Total skipped: ${propResult.skipped + projResult.skipped + artResult.skipped + propImgResult.skipped + projImgResult.skipped}`)

    if (DRY_RUN) {
      console.log('\n⚠️  This was a DRY RUN. Run without --dry-run to apply changes.')
    } else {
      console.log('\n✅ All base64 images have been migrated to files.')
      console.log('   Old base64 data is now stored as files in /public/uploads/')
    }
  } catch (error) {
    console.error('\n❌ Migration failed:', error.message)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
