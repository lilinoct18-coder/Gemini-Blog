import GhostContentAPI from "@tryghost/content-api";

/** Minimal shape for Ghost post used in list and detail views */
export interface GhostPost {
  slug: string;
  title?: string;
  excerpt?: string;
  published_at?: string;
  feature_image?: string | null;
  tags?: unknown[];
  html?: string;
  primary_author?: {
    name?: string;
    bio?: string;
    profile_image?: string | null;
  };
}

const ghostUrl = import.meta.env.GHOST_URL;
const ghostKey = import.meta.env.GHOST_CONTENT_API_KEY;

// Ghost Content API key must be 26 hex characters.
export function isValidGhostKey(value: unknown): value is string {
  return typeof value === "string" && /^[0-9a-f]{26}$/.test(value);
}

const isKeyValid = isValidGhostKey(ghostKey);

const ghost = isKeyValid
  ? new GhostContentAPI({ url: ghostUrl, key: ghostKey, version: "v5.0" })
  : null;

export async function getPosts() {
  if (!ghost) {
    console.warn("[ghost] No valid API key – returning empty posts.");
    return [];
  }
  try {
    return await ghost.posts.browse({
      filter: "author:novis",
      include: "tags,authors",
      limit: "all",
    });
  } catch (err) {
    console.warn("[ghost] Failed to fetch posts:", err);
    return [];
  }
}

export async function getPostBySlug(slug: string) {
  if (!ghost) {
    console.warn("[ghost] No valid API key – cannot fetch post.");
    return undefined;
  }
  try {
    return await ghost.posts.read({ slug }, { include: "tags,authors" });
  } catch (err) {
    console.warn("[ghost] Failed to fetch post:", err);
    return undefined;
  }
}

export async function getTags() {
  if (!ghost) {
    console.warn("[ghost] No valid API key – returning empty tags.");
    return [];
  }
  try {
    return await ghost.tags.browse({ limit: "all" });
  } catch (err) {
    console.warn("[ghost] Failed to fetch tags:", err);
    return [];
  }
}
