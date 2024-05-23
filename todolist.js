const form = document.querySelector("form");
const todo_input = document.getElementById("todo_input");
const todosContainer = document.getElementById("todo");
const errContainer = document.getElementById("err-container");

form.addEventListener("submit", (e) => {
    e.preventDefault();

    if(todo_input.value.trim()) {
        addTodo(todo_input.value);
    } else {
        setError();
    }

    todo_input.value = "";
    todo_input.focus();

})



function addTodo(todo, arr=false) {

    const todoEl = document.createElement("li");
    todoEl.className = "todo-item";

    if(!arr) {
        todoEl.innerHTML = `
            <p>${todo}</p>
            <i class="fas fa-trash delete"></i>
        `
    } else {
        todoEl.innerHTML = `
            <p>${todo.todoText}</p>
            <i class="fas fa-trash delete"></i>
        `
    }

    todoEl.querySelector(".delete").addEventListener("click", () => {
       todoEl.remove(); 
       removeTodoFromLS(todoEl.querySelector("p").innerHTML)
    });

    todoEl.addEventListener("click", () => {
        const getTodos = getLS();
        const todofilter = getTodos.findIndex(todo => {
            return todo.todoText === todoEl.querySelector("p").innerHTML;
        })

        if(todoEl.classList.contains("active")) {
            getTodos[todofilter].completed = false;
        } else getTodos[todofilter].completed = true;

        todoEl.classList.toggle("active");

        updateLS(getTodos);
    });

    todosContainer.appendChild(todoEl);

    if(!arr) {
        setLocalStorage(todo);
    }
        
    if(arr) {
        if(todo.completed) {
            todoEl.classList.add("active");
        } else return;
    }

}

function setLocalStorage(todo) {
    const LSTodos = getLS();
    const todosArr = [];

    todosArr.push({
        todoText: todo,
        completed: false
    });

    localStorage.setItem("todos", JSON.stringify([...LSTodos,...todosArr]));

}

function updateLS(getls) {
    localStorage.setItem("todos", JSON.stringify([...getls]));
}

function removeTodoFromLS(todo) {
    const LSTodos = getLS();

    localStorage.setItem("todos", JSON.stringify(LSTodos.filter(todos => todos.todoText != todo)))
}

function getLS() {
    const LSTodos = JSON.parse(localStorage.getItem("todos")) || [];
    return LSTodos;
}

function addTodosFromLS() {
    const getTodosFromLS = getLS();

    getTodosFromLS.forEach(todo => {
        addTodo(todo, true);
    })
}

addTodosFromLS();


let i = 20;

function setError() {
    const error = document.createElement("div");
    error.className = "error"; 
    error.id = "error";
    error.innerHTML = `
        <i class="fas fa-exclamation-circle"></i>
        <span>Input cannot be empty!</span>
    `
    errContainer.appendChild(error);

    setTimeout(() => {
        error.remove();
    }, 2500);
}