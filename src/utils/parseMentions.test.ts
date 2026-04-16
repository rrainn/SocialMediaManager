import { parseMentions } from "./parseMentions";

// Mock nostr-tools nip19.decode for test isolation
jest.mock("nostr-tools", () => ({
	nip19: {
		decode: jest.fn().mockImplementation((npub: string) => {
			// Simulate decoding a valid npub to a hex pubkey
			if (npub.startsWith("npub1")) {
				return { type: "npub", data: "a".repeat(64) };
			}
			throw new Error("Invalid npub");
		})
	}
}));

describe("parseMentions", () => {
	test("Should return unchanged content when there are no mentions", () => {
		const result = parseMentions("Hello world");
		expect(result.content).toBe("Hello world");
		expect(result.tags).toEqual([]);
	});

	test("Should parse @npub mention and generate p tag", () => {
		const result = parseMentions("Hello @npub1abc123");
		expect(result.content).toBe("Hello nostr:npub1abc123");
		expect(result.tags).toEqual([["p", "a".repeat(64)]]);
	});

	test("Should parse nostr:npub mention and generate p tag", () => {
		const result = parseMentions("Hello nostr:npub1abc123");
		expect(result.content).toBe("Hello nostr:npub1abc123");
		expect(result.tags).toEqual([["p", "a".repeat(64)]]);
	});

	test("Should handle multiple mentions", () => {
		const result = parseMentions("Hello @npub1abc123 and @npub1def456");
		expect(result.tags).toHaveLength(2);
		expect(result.tags[0][0]).toBe("p");
		expect(result.tags[1][0]).toBe("p");
	});

	test("Should handle mentions on separate lines", () => {
		const result = parseMentions("Hello @npub1abc123\nWorld @npub1def456");
		expect(result.tags).toHaveLength(2);
	});

	test("Should handle content with no matching patterns", () => {
		const result = parseMentions("Just some #hashtags and regular text");
		expect(result.content).toBe("Just some #hashtags and regular text");
		expect(result.tags).toEqual([]);
	});

	test("Should strip trailing non-word characters from npub string", () => {
		const result = parseMentions("Hello @npub1abc123!");
		// The npub is cleaned before decoding, and mention is replaced in content
		expect(result.tags).toHaveLength(1);
		expect(result.tags[0][0]).toBe("p");
	});
});
