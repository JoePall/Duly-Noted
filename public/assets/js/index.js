const $noteID = $(".note-id");
const $noteTitle = $(".note-title");
const $noteText = $(".note-textarea");
const $saveNoteBtn = $(".save-note");
const $editNoteBtn = $(".edit-note");
const $newNoteBtn = $(".new-note");
const $noteList = $(".list-container .list-group");

// A function for getting all notes from the db
const getNotes = () => {
  return $.ajax({
    url: "/api/notes",
    method: "GET",
  });
};

// A function for saving a note to the db
const saveNote = (note) => {
  return $.ajax({
    url: "/api/notes",
    data: note,
    method: "POST",
  });
};

// A function for deleting a note from the db
const deleteNote = (id) => {
  return $.ajax({
    url: "api/notes/" + id,
    method: "DELETE",
  });
};

// A function for editing a note in the db
const editNote = (id, note) => {
  return $.ajax({
    url: "api/notes/" + id,
    data: note,
    method: "POST",
  });
};

// If there is a note, display it, otherwise render empty inputs
const renderActiveNote = (note = {}, readonly = false) => {
  let { id = "", title = "", text = "" } = note;
  
  $noteID.val(id);
  $noteTitle.val(title);
  $noteText.val(text);
  $noteTitle.attr("readonly", readonly);
  $noteText.attr("readonly", readonly);
  $saveNoteBtn.hide();
  $noteTitle.focus();
};

// Get the note data from the inputs, save it to the db and update the view
const handleNoteSave = () => {
  if ($noteID.val() === "") {
    $noteID.val(generateID());
    saveNote(getInputNote()).then(() => {
      getAndRenderNotes();
      renderActiveNote();
    });
  }
  else {
    editNote($noteID.val(), getInputNote()).then(() => {
      getAndRenderNotes();
      renderActiveNote();
    });
  }
};

// Returns a note from the input text
const getInputNote = () => {
  const result = {
    id: $noteID.val(),
    title: $noteTitle.val(),
    text: $noteText.val(),
  };

  return result;
}

const generateID = (length = 50) => {
  let result = "";

  for (let i = 0; i < length; i++) result += Math.floor(Math.random() * 10);

  return result;
}

// Open the note for editing
const handleNoteEdit = function (event) {
  event.stopPropagation();

  const note = $(this).parent(".list-group-item").data();

  renderActiveNote(note, false);
};

// Delete the clicked note
const handleNoteDelete = function (event) {
  event.stopPropagation();

  const note = $(this).parent(".list-group-item").data();

  deleteNote(note.id).then(() => {
    getAndRenderNotes();
    renderActiveNote();
  });
};

const handleNoteView = function () {
  const note = $(this).data();
  renderActiveNote(note, true);
};

// If a note's title or text are empty, hide the save button
// Or else show it
const handleRenderSaveBtn = () => {
  if (!$noteTitle.val().trim() || !$noteText.val().trim()) {
    $saveNoteBtn.hide();
  } else {
    $saveNoteBtn.show();
  }
};

// Render's the list of note titles
const renderNoteList = (notes) => {
  $noteList.empty();

  const noteListItems = [];

  // Returns jquery object for li with given text and delete button
  // unless withDeleteButton argument is provided as false
  const create$li = (text, withButtons = true) => {
    const $li = $("<li class='list-group-item'>");
    const $span = $("<span>").text(text);
    $li.append($span);

    if (withButtons) {
      const $delBtn = $("<i class='fas fa-trash-alt float-right text-danger delete-note'>");
      $li.append($delBtn);

      const $editBtn = $("<i class='fas fa-pen text-secondary float-right mr-3 edit-note'></i>");
      $li.append($editBtn);
    }
    return $li;
  };

  if (notes.length === 0) {
    noteListItems.push(create$li("No saved Notes", false, false));
  }

  notes.forEach((note) => {
    const $li = create$li(note.title).data(note);
    noteListItems.push($li);
  });

  $noteList.append(noteListItems);
};

// Gets notes from the db and renders them to the sidebar
const getAndRenderNotes = () => getNotes().then(renderNoteList);

$saveNoteBtn.click(handleNoteSave);
$newNoteBtn.click(renderActiveNote);
$noteList.on("click", ".edit-note", handleNoteEdit);
$noteList.on("click", ".list-group-item", handleNoteView);
$noteList.on("click", ".delete-note", handleNoteDelete);
$noteTitle.on("keyup", handleRenderSaveBtn);
$noteText.on("keyup", handleRenderSaveBtn);

// Gets and renders the initial list of notes
getAndRenderNotes(); 