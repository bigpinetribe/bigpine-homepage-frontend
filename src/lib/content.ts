import { getCollection } from "astro:content";
import fs from "node:fs";
import path from "node:path";

export interface GlobalSettings {
  tribalCouncil: {
    name: string;
    title?: string;
    photo?: string;
  }[];
  contact: {
    address?: string;
    phone?: string;
    fax?: string;
    email?: string;
  };
  facebookUrl?: string;
}

export async function getGlobalSettings(): Promise<GlobalSettings> {
  const settingsPath = path.join(process.cwd(), "content/global/settings.json");
  const content = fs.readFileSync(settingsPath, "utf-8");
  return JSON.parse(content);
}

export async function getDepartments() {
  const departments = await getCollection("departments");
  return departments.map((dept) => ({
    slug: dept.data.slug,
    name: dept.data.name,
  })).sort((a, b) => a.name.localeCompare(b.name));
}

export async function getNews() {
  const news = await getCollection("news");
  return news.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}
