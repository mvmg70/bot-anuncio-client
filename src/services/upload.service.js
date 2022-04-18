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

  let name = file.name;

  name = name
    .replace(/[àáâãäå]/iu, "a")
    .replace(/[ÀÁÂÃÄÅ]/g, "A")
    .replace(/[éèêë]/iu, "e")
    .replace(/[ÈÉÊË]/g, "E")
    .replace(/[íìîï]/iu, "i")
    .replace(/[ÍÌÎ]/iu, "I")
    .replace(/[óòõô]/iu, "o")
    .replace(/[ÓÒÕÔ]/iu, "O")
    .replace(/[úùû]/iu, "u")
    .replace(/[ÚÙÛ]/iu, "U")
    .replace(/[ç]/iu, "c")
    .replace(/[Ç]/iu, "C")
    .replace(/ /g, "-")
    .replace(/[^a-z0-9./-]/gi, "");

  const storageRef = ref(storage, `images/advertisement/${new Date().getTime()}-${name}`);
  const uploadTask = await uploadBytesResumable(storageRef, file, metadata);

  console.log(uploadTask);

  return await getDownloadURL(uploadTask.ref).then((downloadURL) => {
    return downloadURL;
  });
}
