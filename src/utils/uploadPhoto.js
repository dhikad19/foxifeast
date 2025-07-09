// utils/uploadPhoto.js
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

export async function uploadPhoto(uid, file) {
  const storage = getStorage();
  const photoRef = ref(storage, `profilePhotos/${uid}`);
  await uploadBytes(photoRef, file);
  return await getDownloadURL(photoRef);
}
