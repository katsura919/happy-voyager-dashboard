import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
        const apiKey = process.env.CLOUDINARY_API_KEY;
        const apiSecret = process.env.CLOUDINARY_API_SECRET;

        if (!cloudName || !apiKey || !apiSecret) {
            return NextResponse.json({ error: "Cloudinary credentials not configured" }, { status: 500 });
        }

        // Create signature for signed upload
        const timestamp = Math.round(Date.now() / 1000);
        const folder = "happy-voyager/blog-covers";

        // Build signature string
        const signatureString = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;

        // Use Web Crypto API to create SHA-1 hash
        const encoder = new TextEncoder();
        const data = encoder.encode(signatureString);
        const hashBuffer = await crypto.subtle.digest("SHA-1", data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const signature = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");

        // Upload to Cloudinary
        const uploadFormData = new FormData();
        uploadFormData.append("file", file);
        uploadFormData.append("api_key", apiKey);
        uploadFormData.append("timestamp", timestamp.toString());
        uploadFormData.append("signature", signature);
        uploadFormData.append("folder", folder);

        const uploadResponse = await fetch(
            `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
            { method: "POST", body: uploadFormData }
        );

        if (!uploadResponse.ok) {
            const error = await uploadResponse.json();
            return NextResponse.json({ error: error.error?.message ?? "Upload failed" }, { status: 500 });
        }

        const result = await uploadResponse.json();

        return NextResponse.json({
            url: result.secure_url,
            public_id: result.public_id,
        });
    } catch (error) {
        console.error("Cloudinary upload error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
