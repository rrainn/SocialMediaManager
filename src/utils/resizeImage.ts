import Jimp from "jimp";

/**
 * Resizes an image buffer by the given percentage.
 */
export async function resizeImage(image: Buffer, percentage: number): Promise<Buffer> {
	const img = await Jimp.read(image);
	img.scale(percentage / 100);
	return await img.getBufferAsync(Jimp.MIME_PNG);
}
