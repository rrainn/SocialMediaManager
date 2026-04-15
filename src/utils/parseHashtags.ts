/**
 * Parses hashtags from a raw string, returning the tag names without the `#` prefix.
 */
export function parseHashtags(raw: string): string[] {
	return raw.replaceAll(/\(|\)/gmu, "").split(" ").filter((word) => word.startsWith("#")).map((word) => word.substring(1).replace(/\W+/g, ""));
}
