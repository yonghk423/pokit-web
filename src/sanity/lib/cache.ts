/** Tag for on-demand revalidation when Sanity content is published. */
export const SANITY_CACHE_TAG = "sanity";

/** Weekly publish cadence: cache until webhook calls revalidateTag/revalidatePath. */
export const sanityFetchOptions: {
  next: { revalidate: false | 0; tags: string[]; cache?: "no-store" };
} =
  process.env.NODE_ENV === "development"
    ? {
        next: {
          revalidate: 0,
          tags: [SANITY_CACHE_TAG],
          cache: "no-store",
        },
      }
    : {
        next: {
          revalidate: false,
          tags: [SANITY_CACHE_TAG],
        },
      };
