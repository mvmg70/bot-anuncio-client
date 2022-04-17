import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const storage = getStorage();

export async function upload(file) {
  /** @type {any} */
  const metadata = {
    contentType: file.type,
    lastModified: file.lastModified,
    name: file.name,
    size: file.size,
    webkitRelativePath: file.webkitRelativePath,
  };

  const storageRef = ref(storage, `images/advertisement/${file.name}`);
  const uploadTask = uploadBytesResumable(storageRef, file, metadata);

  return await getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
    return downloadURL;
  });
}
