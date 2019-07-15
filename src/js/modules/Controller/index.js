import * as State from "../Model";
import * as View from "../View";
import { editNodeOn, editNodeOff } from "../View";

function handleAddTodo(event) {
  event.preventDefault();
  const todoText = document.addTodoForm.todoText.value;
  if (!todoText.length) return; // empty input
  const newTodo = State.addTodo(todoText);
  View.addTodo(newTodo);
  document.addTodoForm.todoText.value = "";
  document.addTodoForm.todoText.focus();
}

function handleCheckboxToggle(event) {
  const listEl = event.target.closest(View.DOM.listItem);
  // will also fire when todo is added - no listEl in this case
  if (listEl) {
    State.toggleTodo(listEl.dataset.id);
    listEl.classList.toggle("list__item--checked");
  }
}

//
//  Editing Items / Title
//
function handleListDoubleClick(event) {
  const el = event.target;
  const elType = el.dataset.type;
  if (elType === "list-title" || elType === "todo-text") {
    // if details or title
    editNodeOn(el);
    document.addEventListener("keydown", function handleKeydown(event) {
      if (event.key === "Enter" || event.key === "Escape") {
        event.preventDefault();
        document.removeEventListener("keydown", handleKeydown);
        el.blur();
      }
    });
  }
}

function handleBlur(event) {
  const trimmed = event.target.textContent.trim();
  event.target.textContent = trimmed;
  editNodeOff(event.target);
}

function handleTextInput(event) {
  const el = event.target;
  // will either be editing list title or todo text
  switch (el.dataset.type) {
    case "list-title":
      State.updateTitle(event.target.textContent);
      break;
    case "todo-text":
      const id = event.target.closest(View.DOM.listItem).dataset.id;
      const newText = el.textContent;
      State.editTodoText(id, newText);
      break;
    default:
    // do nothing
  }
}

//
//  Drag & Drop Handlers
//
function handleDragStart(event) {
  event.dataTransfer.setData("text", event.target.dataset.id);
}

function handleDragEnter(event) {
  const binEl = event.target.closest(".note-bin");
  binEl.classList.toggle("note-bin--hovered");
}

// need to prevent default dragover behaviour to allow drop
function handleDragOver(event) {
  event.preventDefault();
}

function handleDragLeave(event) {
  event.preventDefault();
  const binEl = event.target.closest(".note-bin");
  binEl.classList.toggle("note-bin--hovered");
}

function handleDrop(event) {
  event.preventDefault();
  const id = event.dataTransfer.getData("text");
  State.removeTodo(id);
  View.removeTodo(id);
  const binEl = event.target.closest(".note-bin");
  binEl.classList.toggle("note-bin--hovered");
}

export function bindEvents() {
  const list = document.querySelector(View.DOM.list);
  const listForm = document.querySelector(View.DOM.listForm);
  const noteBin = document.querySelector(View.DOM.noteBin);

  listForm.addEventListener("submit", handleAddTodo);
  list.addEventListener("change", handleCheckboxToggle);
  list.addEventListener("dblclick", handleListDoubleClick);
  list.addEventListener("input", handleTextInput);
  list.addEventListener("focusout", handleBlur);

  // Drag & Drop
  list.addEventListener("dragstart", handleDragStart);
  noteBin.addEventListener("dragenter", handleDragEnter);
  noteBin.addEventListener("dragleave", handleDragLeave);
  noteBin.addEventListener("dragover", handleDragOver);
  noteBin.addEventListener("drop", handleDrop);
}