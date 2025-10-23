// /api/discovery
const PUBLIC_URL = process.env.PUBLIC_URL || '';

const base = PUBLIC_URL.replace(/\/+$/,'') || '';

const functions = [
  {
    name: "generate_blog_posts_from_text",
    description: "Generate a concise title and blog post from provided text input.",
    parameters: [
      { name: "text", type: "string", description: "The text to generate a blog post from." }
    ],
    endpoint: (base || '') + "/api/tools/generate-blog-posts-from-text",
    http_method: "POST",
    auth_requirements: [
      { provider: "OptiID", scope_bundle: "default", required: false }
    ]
  },
  {
    name: "create_draft",
    description: "Create a new content draft entry",
    parameters: [
      { name: "title", type: "string", description: "Title of draft" },
      { name: "body", type: "string", description: "Body text" }
    ],
    endpoint: (base || '') + "/api/tools/create-draft",
    http_method: "POST",
    auth_requirements: []
  },
  {
    name: "schedule_social_post",
    description: "Schedule or post social content; supports repeat intervals and human approval",
    parameters: [
      { name: "platform", type: "string", description: "twitter | mastodon | generic" },
      { name: "content", type: "string" },
      { name: "repeat", type: "boolean" },
      { name: "days", type: "integer" },
      { name: "approved", type: "boolean" }
    ],
    endpoint: (base || '') + "/api/tools/schedule-social-post",
    http_method: "POST",
    auth_requirements: []
  },
  {
    name: "approve_scheduled_post",
    description: "Approve a pending scheduled social post (human-in-loop)",
    parameters: [
      { name: "jobId", type: "string" },
      { name: "approve", type: "boolean" }
    ],
    endpoint: (base || '') + "/api/tools/approve-scheduled-post",
    http_method: "POST",
    auth_requirements: []
  },
  {
    name: "list_scheduled",
    description: "List scheduled jobs",
    parameters: [],
    endpoint: (base || '') + "/api/tools/list-scheduled",
    http_method: "POST",
    auth_requirements: []
  },
  {
    name: "engage_post_followup",
    description: "Post a follow-up reply to an existing post and optionally repeat",
    parameters: [
      { name: "platform", type: "string" },
      { name: "original_post_id", type: "string" },
      { name: "content", type: "string" },
      { name: "repeat", type: "boolean" },
      { name: "days", type: "integer" }
    ],
    endpoint: (base || '') + "/api/tools/engage-post-followup",
    http_method: "POST",
    auth_requirements: []
  }
];

export default function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.statusCode = 200;
  res.end(JSON.stringify({ functions }, null, 2));
}
