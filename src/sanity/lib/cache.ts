/** Tag for on-demand revalidation when Sanity content is published. */
export const SANITY_CACHE_TAG = "sanity";

/** Weekly publish cadence: cache until webhook calls revalidateTag/revalidatePath. */
export const sanityFetchOptions: {
  next: { revalidate: false; tags: string[] };
} = {
  next: {
    revalidate: false,
    tags: [SANITY_CACHE_TAG],
  },
};
