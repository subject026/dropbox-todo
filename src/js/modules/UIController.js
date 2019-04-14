import { Dropbox } from "dropbox";

export const DOM = {
  header: ".header",
  buttonAuthenticate: "#button-authenticate",
  main: ".main",
  loadingTodos: ".loading-todos",
  listForm: ".list__form"
};

const mainEl = document.querySelector(DOM.main);

export function renderAuthenticateLink() {
  const dbx = new Dropbox({ clientId: "e45k6j9mvumew4x" });
  var authUrl = dbx.getAuthenticationUrl("http://localhost:1111");
  const el = `
  <a href="${authUrl}">Authenticate</a>
  `;
  document.querySelector(DOM.header).insertAdjacentHTML("beforeend", el);
}

export const loading = {
  html: `<span class="loading-todos">Loading todos...</span>`,
  render() {
    document.querySelector(DOM.main).innerHTML = this.html;
  },
  remove() {
    const loadingEl = document.querySelector(DOM.loadingTodos);
    document.querySelector(DOM.loadingTodos).parentNode.removeChild(loadingEl);
  }
};

function listMarkup(state) {
  const markup = `
    <section class="list">
      <h3 class="list__title">${state.title}</h3>
      <ul class="list__list">
        ${todosMarkup(state)}
      </ul>
      <form name="addTodoForm" class="list__form">
        <input name="todoText" type="text" />
        <button type="submit">Add todo</button>
      </form>
    </section>
  `;
  return markup;
}

function todoMarkup(todo) {
  return `<li class="list__item" data-id="${todo.id}">
            <input type="checkbox" ${todo.isComplete ? "checked" : ""}>
            ${todo.todo}
            <button type="button">delete</button>
          </li>`;
}

function todosMarkup(state) {
  let markup = "";
  state.todos.forEach(todo => {
    markup += todoMarkup(todo);
  });
  return markup;
}

export function render(state) {
  mainEl.innerHTML = listMarkup(state);
}