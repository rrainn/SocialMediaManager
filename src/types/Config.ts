export interface Config {
	socialNetworks: SocialNetwork[];
	/**
	 * The interval in seconds to check for updates.
	 */
	refreshInterval: number;

	webServer?: {
		port: number;

		s3ImageCredentials?: {
			region: string;
			accessKeyId: string;
			secretAccessKey: string;
			bucket: string;
		};
	}
}

/**
 * Settings controlling how the client polls a server while it asynchronously
 * processes an uploaded media attachment (e.g. transcoding, thumbnail
 * generation). Applies to platforms whose media upload endpoint may return
 * before the attachment is ready to be referenced from a post.
 */
export interface MediaProcessingSettings {
	/**
	 * The maximum number of times to poll the server for media processing
	 * completion before giving up and attempting to publish anyway.
	 * Defaults to 10.
	 */
	pollAttempts?: number;
	/**
	 * The number of milliseconds to wait between media processing polls.
	 * Defaults to 1000ms.
	 */
	pollIntervalMs?: number;
}

interface MastodonSocialNetwork {
	uuid: `${string}-${string}-${string}-${string}-${string}`
	name: string;
	type: SocialNetworkType.mastodon;
	credentials: {
		endpoint: string;
		streamingEndpoint?: string;
		password: string;
	};
	settings?: {
		includeHashtags?: boolean;
		mediaProcessing?: MediaProcessingSettings;
	};
	listen: boolean;
}
interface PixelfedSocialNetwork {
	uuid: `${string}-${string}-${string}-${string}-${string}`
	name: string;
	type: SocialNetworkType.pixelfed;
	credentials: {
		/**
		 * The base URL of the Pixelfed instance (e.g. `https://pixelfed.social`).
		 */
		endpoint: string;
		/**
		 * OAuth bearer access token for the Pixelfed account. Pixelfed uses the
		 * Mastodon-compatible OAuth flow; the token must include at least the
		 * `write` scope to publish posts.
		 */
		password: string;
	};
	settings?: {
		includeHashtags?: boolean;
		mediaProcessing?: MediaProcessingSettings;
	};
	listen: boolean;
}
interface BlueskySocialNetwork {
	uuid: `${string}-${string}-${string}-${string}-${string}`
	name: string;
	type: SocialNetworkType.bluesky;
	credentials: {
		endpoint: string;
		username: string;
		password: string;
	};
	settings?: {
		includeHashtags?: boolean;
	};
	listen: boolean;
}
interface S3SocialNetwork {
	uuid: `${string}-${string}-${string}-${string}-${string}`
	name: string;
	type: SocialNetworkType.s3;
	credentials: {
		region: string;
		accessKeyId: string;
		secretAccessKey: string;
		bucket: string;
	};
	settings?: {
		includeHashtags?: boolean;
	}
	listen: boolean;
}
interface NostrSocialNetwork {
	uuid: `${string}-${string}-${string}-${string}-${string}`
	name: string;
	type: SocialNetworkType.nostr;
	credentials: {
		privateKey: string;
		publicKey: string;
		relays: string[];
	};
	profile?: { [key: string]: string };
	settings?: {
		includeHashtags?: boolean;
	};
	imageHandler?: {
		"type": SocialNetworkType.s3,
		credentials: {
			region: string;
			accessKeyId: string;
			secretAccessKey: string;
			bucket: string;
		};
		/**
		 * A string representing the URL to change the post to.
		 *
		 * For example if you upload to S3 but want the image URL in the post to be `https://example.com/image.jpg` you would set this to `https://example.com/{{key}}`.
		 *
		 * `{{key}}` will be replaced with the key of the image in the S3 bucket.
		 */
		postURLRemap?: string;
	};
	/**
	 * Optional custom event handler. When provided, the prepared event data (kind, content, tags)
	 * is passed to this function instead of being signed and published using the default nostr-tools
	 * flow. Useful for custom signing flows (e.g. NIP-46 remote signing), proof-of-work mining, or
	 * routing through relay proxies.
	 *
	 * When using `eventHandler`, the `credentials.privateKey` and `credentials.relays` fields are
	 * not used.
	 */
	eventHandler?: (event: { kind: number; content: string; tags: string[][] }) => Promise<{
		id?: string;
		pubkey?: string;
		parent?: { uri: string; cid: string };
		root?: { uri: string; cid: string };
		key?: string;
		tags?: unknown;
	} | undefined>;
	listen: boolean;
}
export type SocialNetwork = MastodonSocialNetwork | S3SocialNetwork | BlueskySocialNetwork | NostrSocialNetwork | PixelfedSocialNetwork;

export enum SocialNetworkType {
	mastodon = "mastodon",
	s3 = "s3",
	bluesky = "bluesky",
	nostr = "nostr",
	pixelfed = "pixelfed",
}

/**
 * Returns whether hashtags should be included by default for a given social network type.
 */
export function defaultIncludeHashtags(type: SocialNetworkType): boolean {
	switch (type) {
		case SocialNetworkType.mastodon:
		case SocialNetworkType.nostr:
		case SocialNetworkType.bluesky:
		case SocialNetworkType.pixelfed:
			return true;
		case SocialNetworkType.s3:
			return false;
	}
}
