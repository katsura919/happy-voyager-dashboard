/**
 * Upload a file to Cloudinary via the server-side API route.
 * Returns the secure URL of the uploaded image.
 */
export async function uploadToCloudinary(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/cloudinary-upload", {
        method: "POST",
        body: formData,
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error ?? "Failed to upload image");
    }

    const data = await response.json();
    return data.url as string;
}
