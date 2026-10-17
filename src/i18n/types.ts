import type { CommonCopy } from "./create-common-copy";
import type { HomeCopy } from "./create-home-copy";

export type Dictionary = LegacyDictionary & CommonCopy & { home: HomeCopy };

export type LegacyDictionary = {
  dates: {
    intl: string;
  };
};
