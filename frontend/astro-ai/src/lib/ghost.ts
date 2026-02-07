import GhostContentAPI from "@tryghost/content-api";

const ghostUrl = import.meta.env.GHOST_URL;
const ghostKey = import.meta.env.GHOST_CONTENT_API_KEY;

// Ghost Content API key must be 26 hex characters.
const isKeyValid = typeof ghostKey === "string" && /^[0-9a-f]{26}$/.test(ghostKey);

const ghost = isKeyValid
  ? new GhostContentAPI({ url: ghostUrl, key: ghostKey, version: "v5.0" })
  : null;

export async function getPosts() {
  if (!ghost) {
    console.warn("[ghost] No valid API key – returning empty posts.");
    return [];
  }
  return await ghost.posts.browse({
    filter: "author:lilin",
    include: "tags,authors",
    limit: "all",
  });
}

export async function getPostBySlug(slug: string) {
  if (!ghost) {
    console.warn("[ghost] No valid API key – cannot fetch post.");
    return undefined;
  }
  return await ghost.posts.read({ slug }, { include: "tags,authors" });
}

export async function getTags() {
  if (!ghost) {
    console.warn("[ghost] No valid API key – returning empty tags.");
    return [];
  }
  return await ghost.tags.browse({ limit: "all" });
}
