import { sql } from 'drizzle-orm'
import {
  index,
  integer,
  sqliteTable,
  text,
  uniqueIndex,
} from 'drizzle-orm/sqlite-core'

const createdAt = integer('created_at', { mode: 'timestamp_ms' })
  .notNull()
  .default(sql`(unixepoch() * 1000)`)

const updatedAt = integer('updated_at', { mode: 'timestamp_ms' })
  .notNull()
  .default(sql`(unixepoch() * 1000)`)

export const users = sqliteTable(
  'users',
  {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    email: text('email').notNull(),
    passwordHash: text('password_hash').notNull(),
    role: text('role', {
      enum: ['super_admin', 'dept_admin', 'content_editor', 'viewer'],
    }).notNull(),
    department: text('department'),
    status: text('status', { enum: ['active', 'suspended'] })
      .notNull()
      .default('active'),
    avatarUrl: text('avatar_url'),
    lastLogin: integer('last_login', { mode: 'timestamp_ms' }),
    createdAt,
    updatedAt,
  },
  (t) => [
    uniqueIndex('users_email_unique').on(t.email),
    index('users_role_idx').on(t.role),
  ],
)

export const rolesPermissions = sqliteTable(
  'roles_permissions',
  {
    id: text('id').primaryKey(),
    roleName: text('role_name').notNull(),
    permissionsJson: text('permissions_json').notNull(),
    createdBy: text('created_by'),
    createdAt,
    updatedAt,
  },
  (t) => [uniqueIndex('roles_permissions_role_name_unique').on(t.roleName)],
)

export const pages = sqliteTable(
  'pages',
  {
    id: text('id').primaryKey(),
    slug: text('slug').notNull(),
    title: text('title').notNull(),
    contentJson: text('content_json').notNull(),
    metaTitle: text('meta_title'),
    metaDesc: text('meta_desc'),
    ogImage: text('og_image'),
    status: text('status', { enum: ['draft', 'published'] })
      .notNull()
      .default('draft'),
    authorId: text('author_id'),
    createdAt,
    updatedAt,
  },
  (t) => [uniqueIndex('pages_slug_unique').on(t.slug), index('pages_status_idx').on(t.status)],
)

export const blogPosts = sqliteTable(
  'blog_posts',
  {
    id: text('id').primaryKey(),
    title: text('title').notNull(),
    slug: text('slug').notNull(),
    content: text('content').notNull(),
    excerpt: text('excerpt'),
    categoryId: text('category_id'),
    authorId: text('author_id'),
    featuredImage: text('featured_image'),
    status: text('status', { enum: ['draft', 'published', 'archived'] })
      .notNull()
      .default('draft'),
    publishedAt: integer('published_at', { mode: 'timestamp_ms' }),
    viewCount: integer('view_count').notNull().default(0),
    readTimeMinutes: integer('read_time_minutes'),
    createdAt,
    updatedAt,
  },
  (t) => [
    uniqueIndex('blog_posts_slug_unique').on(t.slug),
    index('blog_posts_status_idx').on(t.status),
  ],
)

export const programs = sqliteTable(
  'programs',
  {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    slug: text('slug').notNull(),
    description: text('description').notNull(),
    category: text('category', {
      enum: ['education', 'humanitarian', 'community', 'research', 'capacity'],
    }).notNull(),
    icon: text('icon'),
    featuredImage: text('featured_image'),
    status: text('status', { enum: ['active', 'inactive'] })
      .notNull()
      .default('active'),
    sortOrder: integer('sort_order').notNull().default(0),
    createdAt,
    updatedAt,
  },
  (t) => [uniqueIndex('programs_slug_unique').on(t.slug), index('programs_category_idx').on(t.category)],
)

export const events = sqliteTable(
  'events',
  {
    id: text('id').primaryKey(),
    title: text('title').notNull(),
    slug: text('slug').notNull(),
    date: integer('date', { mode: 'timestamp_ms' }).notNull(),
    endDate: integer('end_date', { mode: 'timestamp_ms' }),
    location: text('location'),
    address: text('address'),
    description: text('description').notNull(),
    capacity: integer('capacity'),
    registrationsCount: integer('registrations_count').notNull().default(0),
    featuredImage: text('featured_image'),
    speakersJson: text('speakers_json'),
    status: text('status', {
      enum: ['upcoming', 'ongoing', 'past', 'cancelled'],
    })
      .notNull()
      .default('upcoming'),
    createdBy: text('created_by'),
    createdAt,
    updatedAt,
  },
  (t) => [uniqueIndex('events_slug_unique').on(t.slug), index('events_status_idx').on(t.status)],
)

export const eventRegistrations = sqliteTable(
  'event_registrations',
  {
    id: text('id').primaryKey(),
    eventId: text('event_id').notNull(),
    name: text('name').notNull(),
    email: text('email').notNull(),
    phone: text('phone'),
    organization: text('organization'),
    roleTitle: text('role_title'),
    dietaryNeeds: text('dietary_needs'),
    accessibilityNeeds: text('accessibility_needs'),
    status: text('status', { enum: ['confirmed', 'cancelled', 'waitlist'] })
      .notNull()
      .default('confirmed'),
    registeredAt: integer('registered_at', { mode: 'timestamp_ms' })
      .notNull()
      .default(sql`(unixepoch() * 1000)`),
    createdAt,
    updatedAt,
  },
  (t) => [index('event_registrations_event_id_idx').on(t.eventId)],
)

export const campaigns = sqliteTable(
  'campaigns',
  {
    id: text('id').primaryKey(),
    title: text('title').notNull(),
    slug: text('slug').notNull(),
    goalAmount: integer('goal_amount').notNull(),
    raisedAmount: integer('raised_amount').notNull().default(0),
    deadline: integer('deadline', { mode: 'timestamp_ms' }),
    description: text('description').notNull(),
    featuredImage: text('featured_image'),
    status: text('status', { enum: ['active', 'completed', 'paused'] })
      .notNull()
      .default('active'),
    donorCount: integer('donor_count').notNull().default(0),
    createdBy: text('created_by'),
    createdAt,
    updatedAt,
  },
  (t) => [uniqueIndex('campaigns_slug_unique').on(t.slug), index('campaigns_status_idx').on(t.status)],
)

export const donations = sqliteTable(
  'donations',
  {
    id: text('id').primaryKey(),
    donorName: text('donor_name').notNull(),
    donorEmail: text('donor_email').notNull(),
    donorPhone: text('donor_phone'),
    amount: integer('amount').notNull(),
    currency: text('currency').notNull(),
    campaignId: text('campaign_id'),
    paymentRef: text('payment_ref').notNull(),
    gateway: text('gateway', { enum: ['paystack', 'stripe'] }).notNull(),
    status: text('status', {
      enum: ['pending', 'completed', 'failed', 'refunded'],
    })
      .notNull()
      .default('pending'),
    anonymous: integer('anonymous', { mode: 'boolean' }).notNull().default(false),
    dedicationMessage: text('dedication_message'),
    donatedAt: integer('donated_at', { mode: 'timestamp_ms' })
      .notNull()
      .default(sql`(unixepoch() * 1000)`),
    createdAt,
    updatedAt,
    deletedAt: integer('deleted_at', { mode: 'timestamp_ms' }),
  },
  (t) => [uniqueIndex('donations_payment_ref_unique').on(t.paymentRef), index('donations_status_idx').on(t.status)],
)

export const contacts = sqliteTable(
  'contacts',
  {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    email: text('email').notNull(),
    phone: text('phone'),
    subject: text('subject'),
    department: text('department', {
      enum: ['general', 'education', 'humanitarian', 'community', 'hr', 'press', 'partnership'],
    }),
    message: text('message').notNull(),
    type: text('type', { enum: ['contact', 'partnership', 'community', 'press', 'humanitarian'] })
      .notNull()
      .default('contact'),
    status: text('status', { enum: ['new', 'in_progress', 'resolved'] })
      .notNull()
      .default('new'),
    assignedTo: text('assigned_to'),
    repliedAt: integer('replied_at', { mode: 'timestamp_ms' }),
    source: text('source'),
    createdAt,
    updatedAt,
    deletedAt: integer('deleted_at', { mode: 'timestamp_ms' }),
  },
  (t) => [index('contacts_status_idx').on(t.status), index('contacts_type_idx').on(t.type)],
)

export const volunteers = sqliteTable(
  'volunteers',
  {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    email: text('email').notNull(),
    phone: text('phone'),
    location: text('location'),
    skillsJson: text('skills_json'),
    availabilityJson: text('availability_json'),
    languages: text('languages'),
    motivation: text('motivation'),
    howDidYouHear: text('how_did_you_hear'),
    status: text('status', {
      enum: ['pending', 'approved', 'active', 'rejected'],
    })
      .notNull()
      .default('pending'),
    appliedAt: integer('applied_at', { mode: 'timestamp_ms' })
      .notNull()
      .default(sql`(unixepoch() * 1000)`),
    createdAt,
    updatedAt,
    deletedAt: integer('deleted_at', { mode: 'timestamp_ms' }),
  },
  (t) => [uniqueIndex('volunteers_email_unique').on(t.email), index('volunteers_status_idx').on(t.status)],
)

export const newsletterSubscribers = sqliteTable(
  'newsletter_subscribers',
  {
    id: text('id').primaryKey(),
    email: text('email').notNull(),
    firstName: text('first_name'),
    lastName: text('last_name'),
    preferencesJson: text('preferences_json'),
    status: text('status', { enum: ['active', 'unsubscribed'] })
      .notNull()
      .default('active'),
    subscribedAt: integer('subscribed_at', { mode: 'timestamp_ms' })
      .notNull()
      .default(sql`(unixepoch() * 1000)`),
    unsubscribedAt: integer('unsubscribed_at', { mode: 'timestamp_ms' }),
    createdAt,
    updatedAt,
  },
  (t) => [uniqueIndex('newsletter_subscribers_email_unique').on(t.email)],
)

export const jobPostings = sqliteTable(
  'job_postings',
  {
    id: text('id').primaryKey(),
    title: text('title').notNull(),
    department: text('department'),
    location: text('location'),
    type: text('type', {
      enum: ['full_time', 'part_time', 'contract', 'volunteer', 'internship'],
    }).notNull(),
    description: text('description').notNull(),
    requirements: text('requirements'),
    deadline: integer('deadline', { mode: 'timestamp_ms' }),
    status: text('status', { enum: ['open', 'closed', 'archived'] })
      .notNull()
      .default('open'),
    createdBy: text('created_by'),
    createdAt,
    updatedAt,
  },
  (t) => [index('job_postings_status_idx').on(t.status)],
)

export const jobApplications = sqliteTable(
  'job_applications',
  {
    id: text('id').primaryKey(),
    jobId: text('job_id').notNull(),
    name: text('name').notNull(),
    email: text('email').notNull(),
    phone: text('phone'),
    yearsExperience: integer('years_experience'),
    cvUrl: text('cv_url'),
    coverLetter: text('cover_letter'),
    linkedinUrl: text('linkedin_url'),
    status: text('status', {
      enum: ['received', 'reviewing', 'shortlisted', 'rejected', 'hired'],
    })
      .notNull()
      .default('received'),
    appliedAt: integer('applied_at', { mode: 'timestamp_ms' })
      .notNull()
      .default(sql`(unixepoch() * 1000)`),
    createdAt,
    updatedAt,
  },
  (t) => [index('job_applications_job_id_idx').on(t.jobId), index('job_applications_status_idx').on(t.status)],
)

export const mediaLibrary = sqliteTable(
  'media_library',
  {
    id: text('id').primaryKey(),
    filename: text('filename').notNull(),
    url: text('url').notNull(),
    type: text('type', { enum: ['image', 'video', 'document'] }).notNull(),
    sizeBytes: integer('size_bytes'),
    altText: text('alt_text'),
    category: text('category'),
    tagsJson: text('tags_json'),
    uploadedBy: text('uploaded_by'),
    createdAt,
    updatedAt,
  },
  (t) => [index('media_library_type_idx').on(t.type)],
)

export const auditLogs = sqliteTable(
  'audit_logs',
  {
    id: text('id').primaryKey(),
    userId: text('user_id'),
    action: text('action').notNull(),
    resource: text('resource').notNull(),
    resourceId: text('resource_id'),
    detailsJson: text('details_json'),
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    timestamp: integer('timestamp', { mode: 'timestamp_ms' })
      .notNull()
      .default(sql`(unixepoch() * 1000)`),
    createdAt,
    updatedAt,
  },
  (t) => [index('audit_logs_user_id_idx').on(t.userId), index('audit_logs_action_idx').on(t.action)],
)

export const siteSettings = sqliteTable(
  'site_settings',
  {
    key: text('key').primaryKey(),
    valueJson: text('value_json').notNull(),
    updatedBy: text('updated_by'),
    updatedAt,
  }
)

