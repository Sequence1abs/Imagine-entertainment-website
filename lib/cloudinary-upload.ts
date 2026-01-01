export interface CloudinaryUploadResult {
    url: string;
    public_id: string;
    width: number;
    height: number;
}

export async function uploadToCloudinary(
    file: File,
    folder: string = 'imagine-events'
): Promise<CloudinaryUploadResult> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Upload failed');
    }

    return response.json();
}
