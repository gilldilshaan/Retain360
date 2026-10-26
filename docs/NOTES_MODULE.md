# My Notes module: how it works (viva guide)

## New files
| File | What it does |
|---|---|
| `src/hooks/useLocalStorage.js` | Custom hook. Works like `useState` but also saves to the browser, so data survives refresh. |
| `src/context/NotesContext.jsx` | Shared box for notes, pins, recent searches + add / edit / delete / pin functions. |
| `src/context/ToastContext.jsx` | Shared `showToast("message")` function + the popup itself. |
| `src/components/form/` | Reusable `Input`, `Select`, `TextArea` (label + field + error message). |
| `src/components/notes/Modal.jsx` | Reusable popup. Uses `children`. Closes on Escape or background click. |
| `src/components/notes/NoteFormModal.jsx` | Add / Edit form with validation. |
| `src/components/notes/ConfirmModal.jsx` | "Are you sure?" popup before delete. |
| `src/components/notes/NoteEditor.jsx` | The writing area on a note's page. Auto-saves on every change. |
| `src/components/NoteDetailPage.jsx` | One note on its own page, at `/notes/:noteId`. Shows "Note not found" for bad ids. |
| `src/styles/notes-extra.css` | Styles for all of the above. |

## Changed files
`main.jsx` (wraps app in providers), `App.jsx` (nested routes, toast from context),
`NotesPage.jsx` (uses context, `useMemo`, sort), `NoteCard`, `NotesGrid`,
`NoteDrawer`, `NotesHeader`, `FilterBar`, `noteLibrary.js` (semesters 1-8).

## The 5 features in one line each
1. **Context + useLocalStorage**: notes live in one shared place and are saved in the browser.
2. **Add / edit / delete**: a modal form with validation and reusable inputs.
3. **Routing**: `/notes` = list, `/notes/:noteId` = single note (nested + dynamic route + not-found).
4. **Search / sort / filter**: search runs live as you type, `useMemo` for the filtered list, sort dropdown.
5. **ToastContext**: any page can show a toast with one line.

## Adding content when creating a note
The add form has a "Note content" box (reusable `TextArea`). Whatever is typed is saved as `content`.
It is optional; the note page editor can be used later. In Edit mode the box is hidden, because the
text is changed in the auto-save editor (this avoids two places editing the same text at once).

## Writing notes (auto-save)
Each note now has a `content` field (the actual text). On `/notes/:noteId` the `NoteEditor`
shows a big textarea. Typing updates local state and the change handler
calls `updateNote(id, { content })`, which saves into Context and localStorage.
Search also looks inside `content`. After adding a new note the app opens its page so you can start writing.

## Likely viva questions
- **How does auto-save work?** `text` changes on every key press and the `onChange` handler saves it straight away via `onSave`.
- **Why `key={note.id}` on NoteEditor?** When we click a related note, the page does not unmount. The key forces React to create a fresh editor with the new note's text.
- **Why Context instead of props?** Notes are needed by the list page, the detail page and the drawer. Context avoids passing them through every component (prop drilling).
- **Why `useMemo` for filtering?** The filter + sort only needs to run again when notes or filters change, not on every render.
- **Why `useCallback` on `showToast`?** So the function stays the same between renders and `handleReviewed` in App.jsx does not get re-created every time.
- **Why `useRef` in the form?** To focus the title input automatically when the modal opens.
- **Why `useEffect` in `Modal`?** To add a keyboard listener for Escape, and remove it (cleanup) when the modal closes.
- **How does routing work?** `/notes` has an `<Outlet />`. `index` shows the list, `:noteId` shows one note. `useParams()` reads the id from the URL.
- **Why `Number(noteId)`?** URL params are always text, our ids are numbers.
- **Why `[...result].sort()` and not `result.sort()`?** `sort` changes the original array. We copy first so state is never changed directly.
- **Where is data stored?** In `localStorage` (keys starting with `retain360-`). To reset the demo data, clear them in the browser dev tools (Application tab).
- **Limitation:** no backend, so notes only exist in this browser. File upload and compression are the next step.
