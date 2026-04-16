import * as nostrtools from "nostr-tools";

/**
 * Result of parsing nostr mentions from a string.
 */
export interface ParseMentionsResult {
	/** The content with mentions converted to `nostr:npub` format. */
	content: string;
	/** NIP-27 "p" tags for each mentioned pubkey. */
	tags: string[][];
}

/**
 * Parses nostr mentions (`@npub...` and `nostr:npub...`) from content, converting
 * them to the `nostr:npub` format and returning "p" tags for each mentioned pubkey.
 */
export function parseMentions(content: string): ParseMentionsResult {
	let modifiedContent = content;
	const tags: string[][] = [];

	// Split on spaces and newlines to find mention tokens
	const words = content.split(/ |\n/);
	for (const word of words) {
		if (word.startsWith("@npub") || word.startsWith("nostr:npub")) {
			// Extract the npub string, stripping the prefix and any trailing non-word characters
			const npubString = (word.startsWith("@npub") ? word.substring(1) : word.substring(6)).replace(/\W+/g, "");
			try {
				const decodedProfile = nostrtools.nip19.decode(npubString);
				if (decodedProfile.type === "npub") {
					// Replace the mention in content with the canonical nostr:npub format
					modifiedContent = modifiedContent.replace(word.replace(/[^a-zA-Z0-9@]/g, ""), `nostr:${npubString}`);
					tags.push(["p", decodedProfile.data as string]);
				}
			} catch {
				// Skip invalid npub strings
			}
		}
	}

	return { content: modifiedContent, tags };
}
