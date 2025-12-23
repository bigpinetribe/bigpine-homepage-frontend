import { defineConfig } from "tinacms";

const branch =
  process.env.GITHUB_BRANCH ||
  process.env.VERCEL_GIT_COMMIT_REF ||
  process.env.HEAD ||
  "main";

export default defineConfig({
  branch,

  // Get this from tina.io
  clientId: process.env.TINA_PUBLIC_CLIENT_ID,
  token: process.env.TINA_TOKEN,

  build: {
    outputFolder: "admin",
    publicFolder: "public",
  },
  media: {
    tina: {
      mediaRoot: "uploads",
      publicFolder: "public",
    },
  },
  schema: {
    collections: [
      {
        name: "department",
        label: "Departments",
        path: "content/departments",
        format: "mdx",
        fields: [
          {
            type: "string",
            name: "name",
            label: "Department Name",
            required: true,
          },
          {
            type: "string",
            name: "slug",
            label: "URL Slug",
            required: true,
            description: "e.g., 'environmental', 'housing', 'education'",
          },
          {
            type: "rich-text",
            name: "body",
            label: "Page Content",
            isBody: true,
          },
          {
            type: "object",
            name: "staff",
            label: "Staff Members",
            list: true,
            fields: [
              {
                type: "string",
                name: "name",
                label: "Name",
                required: true,
              },
              {
                type: "string",
                name: "title",
                label: "Title",
              },
              {
                type: "string",
                name: "email",
                label: "Email",
              },
              {
                type: "string",
                name: "phone",
                label: "Phone",
              },
              {
                type: "image",
                name: "photo",
                label: "Photo",
              },
            ],
          },
          {
            type: "object",
            name: "documents",
            label: "Documents & Forms",
            list: true,
            fields: [
              {
                type: "string",
                name: "title",
                label: "Document Title",
                required: true,
              },
              {
                type: "string",
                name: "url",
                label: "File URL or Path",
                required: true,
              },
              {
                type: "string",
                name: "description",
                label: "Description",
              },
            ],
          },
        ],
      },
      {
        name: "news",
        label: "News & Events",
        path: "content/news",
        format: "mdx",
        fields: [
          {
            type: "string",
            name: "title",
            label: "Title",
            required: true,
          },
          {
            type: "datetime",
            name: "date",
            label: "Date",
            required: true,
          },
          {
            type: "string",
            name: "excerpt",
            label: "Excerpt",
            description: "Short summary for listing pages",
          },
          {
            type: "image",
            name: "featuredImage",
            label: "Featured Image",
          },
          {
            type: "string",
            name: "category",
            label: "Category",
            options: ["News", "Event", "Announcement", "Meeting"],
          },
          {
            type: "rich-text",
            name: "body",
            label: "Content",
            isBody: true,
          },
        ],
      },
      {
        name: "global",
        label: "Global Settings",
        path: "content/global",
        format: "json",
        ui: {
          global: true,
          allowedActions: {
            create: false,
            delete: false,
          },
        },
        fields: [
          {
            type: "object",
            name: "tribalCouncil",
            label: "Tribal Council",
            list: true,
            fields: [
              {
                type: "string",
                name: "name",
                label: "Name",
                required: true,
              },
              {
                type: "string",
                name: "title",
                label: "Position",
                description: "e.g., 'Chairman', 'Vice Chairman', 'Secretary'",
              },
              {
                type: "image",
                name: "photo",
                label: "Photo",
              },
            ],
          },
          {
            type: "object",
            name: "contact",
            label: "Contact Information",
            fields: [
              {
                type: "string",
                name: "address",
                label: "Address",
              },
              {
                type: "string",
                name: "phone",
                label: "Phone",
              },
              {
                type: "string",
                name: "fax",
                label: "Fax",
              },
              {
                type: "string",
                name: "email",
                label: "Email",
              },
            ],
          },
          {
            type: "string",
            name: "facebookUrl",
            label: "Facebook Page URL",
          },
        ],
      },
      {
        name: "page",
        label: "Pages",
        path: "content/pages",
        format: "mdx",
        fields: [
          {
            type: "string",
            name: "title",
            label: "Title",
            required: true,
          },
          {
            type: "string",
            name: "slug",
            label: "URL Path",
            required: true,
          },
          {
            type: "rich-text",
            name: "body",
            label: "Content",
            isBody: true,
          },
        ],
      },
    ],
  },
});
