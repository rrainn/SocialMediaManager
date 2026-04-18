import Poster from "./Poster";
import { SocialNetwork, SocialNetworkType } from "./types/Config";

describe("Pixelfed", () => {
	const network: SocialNetwork & {"type": SocialNetworkType.pixelfed} = {
		"uuid": "00000000-0000-0000-0000-000000000001",
		"name": "test-pixelfed",
		"type": SocialNetworkType.pixelfed,
		"credentials": {
			"endpoint": "https://pixelfed.example",
			"password": "fake-token"
		},
		"listen": false
	};

	test("post() rejects when no image is provided", async () => {
		const poster = new Poster();
		await expect(poster.post(network, { "message": "hello" })).rejects.toThrow(/Pixelfed posts require an image/);
	});

	test("reply() rejects when no image is provided", async () => {
		const poster = new Poster();
		await expect(poster.reply(network, { "id": "12345" }, { "message": "hi" })).rejects.toThrow(/Pixelfed replies require an image/);
	});
});
