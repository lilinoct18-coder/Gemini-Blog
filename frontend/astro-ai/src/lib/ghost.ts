import GhostContentAPI from "@tryghost/content-api";

const ghost = new GhostContentAPI({
  url: import.meta.env.GHOST_URL,
  key: import.meta.env.GHOST_CONTENT_API_KEY,
  version: "v5.0",
});

export async function getPosts() {
  return await ghost.posts.browse({
    filter: "author:lilin",
    include: "tags,authors",
    limit: "all",
  });
}

export async function getPostBySlug(slug: string) {
  return await ghost.posts.read({ slug }, { include: "tags,authors" });
}

export async function getTags() {
  return await ghost.tags.browse({ limit: "all" });
}
