import fetch from 'node-fetch';

async function getImageBuffer(imageUrl) {
    try {
        // Fetching the image from the URL
        const response = await fetch(imageUrl);
        if (!response.ok) {
            console.log(`Failed to fetch image: ${response.status} ${response.statusText}`);
            console.log(response);
            return -1;
        }
        // Reading the response as a buffer
        const buffer = await response.url;
        console.log("buffer:", buffer);

        if (buffer === undefined) return -1;
        // Return the buffer
        return buffer;
    } catch (error) {
        console.error('Error fetching image:', error);
        throw error; // Propagate the error
    }
}

// Exporting the function
export default async function pollinationAI(prompt) {
    console.log("prompt: ", prompt);
    const width = 1024;
    const height = 1024;
    const seed = 42; // Each seed generates a new image variation

    const imageUrl = `https://pollinations.ai/p/${encodeURIComponent(prompt)}?width=${width}&height=${height}&seed=${seed}`;

    // Return the image buffer
    try {
        const buffer = await getImageBuffer(imageUrl);
        if (buffer !== -1) {
            console.log('Image buffer fetched successfully.');
            return buffer;
        }
    } catch (error) {
        console.error('Error fetching image buffer:', error);
    }
}
