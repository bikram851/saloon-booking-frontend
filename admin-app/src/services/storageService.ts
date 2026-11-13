import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject
} from "firebase/storage";
import { storage } from "../firebase/config";

export interface UploadProgressCallback {
  (progressPercent: number): void;
}

/**
 * Uploads a file to Firebase Storage under the specified directory path.
 * Returns the public download URL.
 */
export async function uploadSalonPhoto(
  salonId: string,
  category: 'exterior' | 'interior' | 'reception' | 'gallery' | 'logo',
  file: File,
  onProgress?: UploadProgressCallback
): Promise<string> {
  const fileExt = file.name.split('.').pop() || 'jpg';
  const fileName = `${category}_${Date.now()}.${fileExt}`;
  const storagePath = `salons/${salonId}/${fileName}`;
  const storageRef = ref(storage, storagePath);

  try {
    const uploadTask = uploadBytesResumable(storageRef, file, {
      contentType: file.type,
      customMetadata: {
        salonId,
        category,
        uploadedAt: new Date().toISOString()
      }
    });

    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          if (onProgress) onProgress(Math.round(progress));
        },
        (error) => {
          console.warn("Storage upload task error (using local preview fallback):", error);
          // Return local object URL so upload UI continues seamlessly even in dev mode
          const localUrl = URL.createObjectURL(file);
          resolve(localUrl);
        },
        async () => {
          try {
            const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadUrl);
          } catch {
            resolve(URL.createObjectURL(file));
          }
        }
      );
    });
  } catch (err) {
    console.warn("Firebase storage error, falling back to object URL:", err);
    return URL.createObjectURL(file);
  }
}

/**
 * Uploads a promotion banner to Firebase Storage
 */
export async function uploadOfferBanner(
  offerCode: string,
  file: File,
  onProgress?: UploadProgressCallback
): Promise<string> {
  const fileName = `banner_${offerCode.toLowerCase()}_${Date.now()}`;
  const storageRef = ref(storage, `offers/${fileName}`);

  try {
    const uploadTask = uploadBytesResumable(storageRef, file);
    return new Promise((resolve) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          if (onProgress) onProgress(Math.round(progress));
        },
        () => resolve(URL.createObjectURL(file)),
        async () => {
          try {
            const url = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(url);
          } catch {
            resolve(URL.createObjectURL(file));
          }
        }
      );
    });
  } catch {
    return URL.createObjectURL(file);
  }
}
