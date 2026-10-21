// Stores the real uploaded files (PDF, PPT, DOCX, images) inside the browser's
// IndexedDB. No library and no backend needed.
//   saveFile(id, file) -> store a file under a note id
//   loadFile(id)       -> get it back (or undefined if there is none)
//   removeFile(id)     -> delete it
// The note itself (in localStorage) only keeps the small details: name + size.

const DB_NAME = "retain360-files"
const STORE = "files"

export const MAX_SIZE = 10 * 1024 * 1024 // 10 MB
export const ACCEPT = ".pdf,.ppt,.pptx,.doc,.docx,.png,.jpg,.jpeg,.gif,.webp"
const ALLOWED = ACCEPT.replace(/\./g, "").split(",")

function getExtension(file) {
  return file.name.split(".").pop().toLowerCase()
}

// "lecture.pdf" -> "PDF", "slides.pptx" -> "PPT" ...
export function detectType(file) {
  const ext = getExtension(file)
  if (ext === "pdf") return "PDF"
  if (ext === "ppt" || ext === "pptx") return "PPT"
  if (ext === "doc" || ext === "docx") return "DOCX"
  return "IMG"
}

// returns an error message, or "" when the file is fine
export function validateFile(file) {
  if (!ALLOWED.includes(getExtension(file))) return "Unsupported file. Use PDF, PPT, DOCX or an image."
  if (file.size > MAX_SIZE) return "File is too large (maximum 10 MB)."
  return ""
}

// 2457600 -> "2.3 MB"
export function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

// ── small IndexedDB helpers ──
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1)
    request.onupgradeneeded = () => request.result.createObjectStore(STORE)
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

async function run(mode, action) {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, mode)
    const request = action(tx.objectStore(STORE))
    tx.oncomplete = () => {
      db.close()
      resolve(request.result)
    }
    tx.onerror = () => reject(tx.error)
  })
}

export const saveFile = (id, file) => run("readwrite", (store) => store.put(file, String(id)))
export const loadFile = (id) => run("readonly", (store) => store.get(String(id)))
export const removeFile = (id) => run("readwrite", (store) => store.delete(String(id)))
