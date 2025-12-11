const backend_url="https://todo-app-97q5.onrender.com";
// const backend_url = "http://localhost:3000";
let isSigningUp = false
let isAddingTodo = false
//  signup from submission
const signupBtn = document.getElementById('signup-button');
signupBtn.addEventListener("click", async () => {
    if (isSigningUp) return;
    isSigningUp = true;
    signupBtn.disabled = true
    const username = document.getElementById('signup-username').value;
    const password = document.getElementById('signup-password').value;
    document.getElementById('signup-username').value = "";
    document.getElementById('signup-password').value = "";
    document.getElementById("login-username").value = "";
    document.getElementById("login-password").value = "";
    if (!username || !password) {
        alert("Please fill in both username and password");
        isSigningUp = false;
        signupBtn.disabled = false;
        return;
    }
    try {
        const response = await axios.post(`${backend_url}/user/signup`, {
            username,
            password
        })
        console.log(response.data);
        const result = response.data;
        alert(result.message || 'signup successfull');
        document.getElementById('signup-container').style.display = 'none';
        document.getElementById('login-container').style.display = 'flex';
    } catch (error) {
        console.log(error);
        alert(error.response?.data?.message || "error during signing up")
    } finally {
        isSigningUp = false;
        signupBtn.disabled = false;
    }
})
//login form submission
let isLoggingIn = false
const loginBtn = document.getElementById('login-button');
const logoutBtn = document.getElementById('logout-button');
loginBtn.addEventListener("click", async () => {
    if (isLoggingIn) return;
    isLoggingIn = true;
    loginBtn.disabled = true;
    const username = document.getElementById("login-username").value;
    const password = document.getElementById("login-password").value;
    document.getElementById('signup-username').value = "";
    document.getElementById('signup-password').value = "";
    document.getElementById("login-username").value = "";
    document.getElementById("login-password").value = "";
    if (!username || !password) {
        alert("Please fill in both username and password");
        isLoggingIn = false;
        loginBtn.disabled = false;
        return;
    }
    try {
        const response = await axios.post(`${backend_url}/user/login`, {
            username,
            password
        })
        const result = response.data;
        localStorage.setItem('token', result.token);
        document.getElementById('login-container').style.display = 'none';
        document.getElementById('todo-container').style.display = 'flex';
        alert(result.message || 'login successfull');
        loadTodos();
    } catch (error) {
        console.log(error);
        alert(error.response?.data?.message || "error during login")
    } finally {
        isLoggingIn = false;
        loginBtn.disabled = false;
    }
})
logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("token");
    document.getElementById('todo-container').style.display = 'none';
    document.getElementById('login-container').style.display = 'flex';
    document.getElementById("login-username").value = "";
    document.getElementById("login-password").value = "";
    document.getElementById("signup-username").value = "";
    document.getElementById("signup-password").value = "";
    alert("Logged out successfully");
});
// todo form submission
const addTodoButton = document.getElementById('add-button');
addTodoButton.addEventListener('click', async () => {
    if (isAddingTodo) return;
    isAddingTodo = true;
    addTodoButton.disabled = true
    const todoInput = document.getElementById('todo-input');
    const todoText = todoInput.value.trim();
    if (!todoText) {
        isAddingTodo = false;
        addTodoButton.disabled = false;
        return;
    }
    const token = localStorage.getItem('token');
    try {
        await axios.post(`${backend_url}/todo`,
            { title: todoText },
            {
                headers: {
                    Authorization: token
                }
            })
        todoInput.value = ''
        loadTodos();
    } catch (error) {
        console.log("error adding todo:", error);
    } finally {
        isAddingTodo = false;
        addTodoButton.disabled = false;
    }
});
//function for loading todos in todo page
async function loadTodos() {
    const token = localStorage.getItem('token');
    try {
        const response = await axios.get(`${backend_url}/todo`, {
            headers: {
                Authorization: token
            }
        });
        const { todos } = response.data;
        const todoList = document.getElementById('todo-list');
        todoList.innerHTML = '';
        todos.forEach(todo => {
            const div = document.createElement('div');
            const button = document.createElement('button');
            const img = document.createElement("img");
            img.src = "https://upload.wikimedia.org/wikipedia/commons/a/a0/OOjs_UI_icon_close.svg";
            img.alt = "icon";
            img.style.width = "30px";
            img.style.height = "30px";
            button.style.background = "transparent";
            button.style.border = "none";
            button.style.cursor = "pointer";
            button.appendChild(img);
            button.addEventListener("click", () => deleteTodo(todo._id));
            div.textContent = todo.title;
            div.appendChild(button);
            if (todo.done) {
                div.style.textDecoration = 'line-through';
            }
            div.ondblclick = () => {
                completeTodo(todo._id, !todo.done);
            }
            todoList.appendChild(div);
        });
    } catch (error) {
        console.log('error loading todos:', error);
    }
}
//deleting todo logic   
async function deleteTodo(id) {
    const token = localStorage.getItem('token');
    try {
        await axios.delete(`${backend_url}/todo/${id}`,
            {
                headers: {
                    Authorization: token
                }
            }
        );
        loadTodos();
    } catch (error) {
        console.log("error deleting todo:", error);
    }
}
// function for marking complete in non completed tasks
async function completeTodo(id, done) {
    const token = localStorage.getItem('token');
    try {
        await axios.put(`${backend_url}/todo/${id}`,
            { done },
            {
                headers: {
                    Authorization: token
                }
            });
        loadTodos();
    } catch (error) {
        console.log('error completing todos:', error);
    }
}
document.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {

        // Signup active?
        if (document.getElementById("signup-container").style.display !== "none") {
            document.getElementById("signup-button").click();
        }

        // Login active?
        else if (document.getElementById("login-container").style.display !== "none") {
            document.getElementById("login-button").click();
        }

        // Todo active?
        else if (document.getElementById("todo-container").style.display !== "none") {
            document.getElementById("add-button").click();
        }
    }
});

//Toggle between signup and login
document.getElementById('show-login').addEventListener('click', () => {
    document.getElementById('signup-container').style.display = 'none';
    document.getElementById('login-container').style.display = 'flex';
})
document.getElementById('show-signup').addEventListener('click', () => {
    document.getElementById('login-container').style.display = 'none';
    document.getElementById('signup-container').style.display = 'flex';
})
