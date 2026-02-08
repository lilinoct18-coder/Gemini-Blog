declare module "@tryghost/content-api" {
  interface GhostContentAPIOptions {
    url: string;
    key: string;
    version: string;
  }

  interface BrowseParams {
    filter?: string;
    include?: string;
    limit?: string;
    page?: number;
    order?: string;
    fields?: string;
  }

  interface ReadParams {
    id?: string;
    slug?: string;
  }

  interface IncludeParams {
    include?: string;
  }

  /* eslint-disable @typescript-eslint/no-explicit-any */
  interface PostsOrPages {
    browse(params?: BrowseParams): Promise<any[]>;
    read(data: ReadParams, params?: IncludeParams): Promise<any>;
  }

  interface Tags {
    browse(params?: BrowseParams): Promise<any[]>;
  }
  /* eslint-enable @typescript-eslint/no-explicit-any */

  class GhostContentAPI {
    constructor(options: GhostContentAPIOptions);
    posts: PostsOrPages;
    pages: PostsOrPages;
    tags: Tags;
  }

  export default GhostContentAPI;
}
