import { createImageUrlBuilder, type SanityImageSource } from "@sanity/image-url";

import { dataset, projectId } from "./env";

const builder =
  projectId && dataset
    ? createImageUrlBuilder({ projectId, dataset })
    : null;

type ImageWithAsset = SanityImageSource & {
  asset?: { _ref?: string; _id?: string };
};

/** asset _ref 또는 _id가 실제로 존재하는 유효한 이미지인지 확인 */
export function isValidImageSource(
  source: SanityImageSource | null | undefined,
): source is SanityImageSource {
  if (!source || typeof source !== "object") return false;

  const asset = (source as ImageWithAsset).asset;
  if (!asset) return false;

  const id = asset._ref ?? asset._id;
  return typeof id === "string" && id.length > 0;
}

export function urlForImage(source: SanityImageSource) {
  if (!builder) {
    throw new Error("Sanity image builder is not configured.");
  }
  return builder.image(source);
}

/** 유효한 이미지일 때만 crop URL을 반환, 아니면 null */
export function coverImageUrl(
  source: SanityImageSource | null | undefined,
  width: number,
  height: number,
): string | null {
  if (!builder || !isValidImageSource(source)) return null;
  return urlForImage(source).width(width).height(height).fit("crop").url();
}

/** LQIP base64 문자열 → next/image blur placeholder props */
export function imageBlurProps(lqip: string | null | undefined) {
  if (!lqip) return {};

  return {
    placeholder: "blur" as const,
    blurDataURL: lqip,
  };
}
