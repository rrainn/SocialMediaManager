import { Poster, handleExtraBlueskyFacets, SocialNetworkType, defaultIncludeHashtags } from "./index";

describe("Package exports", () => {
	test("Poster class should be exported", () => {
		expect(Poster).toBeDefined();
	});

	test("handleExtraBlueskyFacets should be exported", () => {
		expect(handleExtraBlueskyFacets).toBeDefined();
	});

	test("SocialNetworkType enum should be exported", () => {
		expect(SocialNetworkType.bluesky).toBe("bluesky");
		expect(SocialNetworkType.mastodon).toBe("mastodon");
		expect(SocialNetworkType.nostr).toBe("nostr");
		expect(SocialNetworkType.s3).toBe("s3");
	});

	test("defaultIncludeHashtags should be exported", () => {
		expect(defaultIncludeHashtags(SocialNetworkType.mastodon)).toBe(true);
		expect(defaultIncludeHashtags(SocialNetworkType.bluesky)).toBe(true);
	});
});
