class TodoApp {
    constructor() {
        this.baseURL = "http://localhost:8000" // FastAPI server URL
        this.token = localStorage.getItem("token")
        this.currentUser = null
        this.todos = []
        this.currentFilter = "all"
        this.editingTodoId = null

        this.init()
    }

    async init() {
        this.setupEventListeners()

        if (this.token) {
            await this.verifyToken()
        } else {
            this.showAuthContainer()
        }
    }

    setupEventListeners() {
        // Auth form listeners
        document.getElementById("loginForm").addEventListener("submit", (e) => this.handleLogin(e))
        document.getElementById("registerForm").addEventListener("submit", (e) => this.handleRegister(e))
        document.getElementById("showRegister").addEventListener("click", (e) => this.showRegisterForm(e))
        document.getElementById("showLogin").addEventListener("click", (e) => this.showLoginForm(e))
        document.getElementById("logoutBtn").addEventListener("click", () => this.logout())

        // Todo form listeners
        document.getElementById("addTodoForm").addEventListener("submit", (e) => this.handleAddTodo(e))
        document.getElementById("editTodoForm").addEventListener("submit", (e) => this.handleEditTodo(e))

        // Filter listeners
        document.querySelectorAll(".filter-btn").forEach((btn) => {
            btn.addEventListener("click", (e) => this.handleFilter(e))
        })

        // Search listener
        document.getElementById("searchInput").addEventListener("input", (e) => this.handleSearch(e))

        // Modal listeners
        document.getElementById("closeModal").addEventListener("click", () => this.closeModal())
        document.getElementById("cancelEdit").addEventListener("click", () => this.closeModal())
        document.getElementById("editModal").addEventListener("click", (e) => {
            if (e.target.id === "editModal") this.closeModal()
        })
    }

    showLoading() {
        document.getElementById("loading").classList.remove("hidden")
    }

    hideLoading() {
        document.getElementById("loading").classList.add("hidden")
    }

    showAuthContainer() {
        document.getElementById("auth-container").classList.remove("hidden")
        document.getElementById("app-container").classList.add("hidden")
    }

    showAppContainer() {
        document.getElementById("auth-container").classList.add("hidden")
        document.getElementById("app-container").classList.remove("hidden")
    }

    showRegisterForm(e) {
        e.preventDefault()
        document.getElementById("login-form").classList.add("hidden")
        document.getElementById("register-form").classList.remove("hidden")
    }

    showLoginForm(e) {
        e.preventDefault()
        document.getElementById("register-form").classList.add("hidden")
        document.getElementById("login-form").classList.remove("hidden")
    }

    async handleLogin(e) {
        e.preventDefault()
        this.showLoading()

        const email = document.getElementById("loginEmail").value
        const password = document.getElementById("loginPassword").value

        try {
            const response = await fetch(`${this.baseURL}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            })

            const data = await response.json()

            if (response.ok) {
                this.token = data.token
                localStorage.setItem("token", this.token)
                await this.verifyToken()
                this.showToast("Login successful!", "success")
            } else {
                this.showToast(data.detail || "Login failed", "error")
            }
        } catch (error) {
            this.showToast("Network error. Please try again.", "error")
        } finally {
            this.hideLoading()
        }
    }

    async handleRegister(e) {
        e.preventDefault()
        this.showLoading()

        const full_name = document.getElementById("registerName").value
        const email = document.getElementById("registerEmail").value
        const password = document.getElementById("registerPassword").value

        try {
            const response = await fetch(`${this.baseURL}/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ full_name, email, password }),
            })

            const data = await response.json()

            if (response.ok) {
                this.token = data.token
                localStorage.setItem("token", this.token)
                await this.verifyToken()
                this.showToast("Registration successful!", "success")
            } else {
                this.showToast(data.detail || "Registration failed", "error")
            }
        } catch (error) {
            this.showToast("Network error. Please try again.", "error")
        } finally {
            this.hideLoading()
        }
    }

    async verifyToken() {
        try {
            const response = await fetch(`${this.baseURL}/auth/me/${this.token}`)
            const data = await response.json()

            if (response.ok) {
                this.currentUser = data
                document.getElementById("userName").textContent = `Welcome, ${data.full_name || data.email}!`
                this.showAppContainer()
                await this.loadTodos()
            } else {
                this.logout()
            }
        } catch (error) {
            this.logout()
        }
    }

    logout() {
        this.token = null
        this.currentUser = null
        this.todos = []
        localStorage.removeItem("token")
        this.showAuthContainer()
        this.showToast("Logged out successfully", "success")
    }

    async loadTodos() {
        this.showLoading()
        try {
            const response = await fetch(`${this.baseURL}/todos/all`)
            const data = await response.json()

            if (response.ok) {
                this.todos = data
                this.renderTodos()
            } else {
                this.showToast("Failed to load todos", "error")
            }
        } catch (error) {
            this.showToast("Network error while loading todos", "error")
        } finally {
            this.hideLoading()
        }
    }

    async handleAddTodo(e) {
        e.preventDefault()

        const title = document.getElementById("todoTitle").value
        const description = document.getElementById("todoDescription").value
        const deadline = document.getElementById("todoDeadline").value

        if (!title.trim()) {
            this.showToast("Please enter a title", "warning")
            return
        }

        this.showLoading()

        try {
            const response = await fetch(`${this.baseURL}/todos`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ title, description }),
            })

            const data = await response.json()

            if (response.ok) {
                // If deadline is set, update it
                if (deadline) {
                    await this.setDeadline(data.id, deadline)
                }

                await this.loadTodos()
                document.getElementById("addTodoForm").reset()
                this.showToast("Todo added successfully!", "success")
            } else {
                this.showToast("Failed to add todo", "error")
            }
        } catch (error) {
            this.showToast("Network error while adding todo", "error")
        } finally {
            this.hideLoading()
        }
    }

    async setDeadline(todoId, deadline) {
        try {
            await fetch(`${this.baseURL}/todos/${todoId}/set-deadline`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ deadline }),
            })
        } catch (error) {
            console.error("Failed to set deadline:", error)
        }
    }

    async toggleTodoStatus(todoId, completed) {
        this.showLoading()

        const endpoint = completed ? "complete" : "incomplete"

        try {
            const response = await fetch(`${this.baseURL}/todos/${todoId}/${endpoint}`, {
                method: "POST",
            })

            if (response.ok) {
                await this.loadTodos()
                this.showToast(`Todo marked as ${completed ? "completed" : "incomplete"}`, "success")
            } else {
                this.showToast("Failed to update todo status", "error")
            }
        } catch (error) {
            this.showToast("Network error while updating todo", "error")
        } finally {
            this.hideLoading()
        }
    }

    async deleteTodo(todoId) {
        if (!confirm("Are you sure you want to delete this todo?")) {
            return
        }

        this.showLoading()

        try {
            const response = await fetch(`${this.baseURL}/todos/${todoId}`, {
                method: "DELETE",
            })

            if (response.ok) {
                await this.loadTodos()
                this.showToast("Todo deleted successfully", "success")
            } else {
                this.showToast("Failed to delete todo", "error")
            }
        } catch (error) {
            this.showToast("Network error while deleting todo", "error")
        } finally {
            this.hideLoading()
        }
    }

    openEditModal(todo) {
        this.editingTodoId = todo.id
        document.getElementById("editTitle").value = todo.title
        document.getElementById("editDescription").value = todo.description || ""

        if (todo.deadline) {
            const date = new Date(todo.deadline)
            document.getElementById("editDeadline").value = date.toISOString().slice(0, 16)
        }

        document.getElementById("editModal").classList.remove("hidden")
    }

    closeModal() {
        document.getElementById("editModal").classList.add("hidden")
        this.editingTodoId = null
    }

    async handleEditTodo(e) {
        e.preventDefault()

        const title = document.getElementById("editTitle").value
        const description = document.getElementById("editDescription").value
        const deadline = document.getElementById("editDeadline").value

        if (!title.trim()) {
            this.showToast("Please enter a title", "warning")
            return
        }

        this.showLoading()

        try {
            const response = await fetch(`${this.baseURL}/todos/${this.editingTodoId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ title, description }),
            })

            if (response.ok) {
                // Update deadline if provided
                if (deadline) {
                    await this.setDeadline(this.editingTodoId, deadline)
                }

                await this.loadTodos()
                this.closeModal()
                this.showToast("Todo updated successfully!", "success")
            } else {
                this.showToast("Failed to update todo", "error")
            }
        } catch (error) {
            this.showToast("Network error while updating todo", "error")
        } finally {
            this.hideLoading()
        }
    }

    handleFilter(e) {
        document.querySelectorAll(".filter-btn").forEach((btn) => btn.classList.remove("active"))
        e.target.classList.add("active")
        this.currentFilter = e.target.dataset.filter
        this.renderTodos()
    }

    handleSearch(e) {
        this.searchQuery = e.target.value.toLowerCase()
        this.renderTodos()
    }

    getFilteredTodos() {
        let filtered = [...this.todos]

        // Apply status filter
        if (this.currentFilter === "completed") {
            filtered = filtered.filter((todo) => todo.completed)
        } else if (this.currentFilter === "pending") {
            filtered = filtered.filter((todo) => !todo.completed)
        }

        // Apply search filter
        if (this.searchQuery) {
            filtered = filtered.filter(
                (todo) =>
                    todo.title.toLowerCase().includes(this.searchQuery) ||
                    (todo.description && todo.description.toLowerCase().includes(this.searchQuery)),
            )
        }

        return filtered
    }

    renderTodos() {
        const todosList = document.getElementById("todosList")
        const emptyState = document.getElementById("emptyState")
        const filteredTodos = this.getFilteredTodos()

        if (filteredTodos.length === 0) {
            todosList.innerHTML = ""
            emptyState.classList.remove("hidden")
            return
        }

        emptyState.classList.add("hidden")

        todosList.innerHTML = filteredTodos.map((todo) => this.createTodoHTML(todo)).join("")

        // Add event listeners to action buttons
        filteredTodos.forEach((todo) => {
            const toggleBtn = document.getElementById(`toggle-${todo.id}`)
            const editBtn = document.getElementById(`edit-${todo.id}`)
            const deleteBtn = document.getElementById(`delete-${todo.id}`)

            if (toggleBtn) {
                toggleBtn.addEventListener("click", () => this.toggleTodoStatus(todo.id, !todo.completed))
            }
            if (editBtn) {
                editBtn.addEventListener("click", () => this.openEditModal(todo))
            }
            if (deleteBtn) {
                deleteBtn.addEventListener("click", () => this.deleteTodo(todo.id))
            }
        })
    }

    createTodoHTML(todo) {
        const isCompleted = todo.completed
        const isOverdue = todo.deadline && new Date(todo.deadline) < new Date() && !isCompleted

        let statusBadge = ""
        if (isCompleted) {
            statusBadge = '<span class="status-badge completed">Completed</span>'
        } else if (isOverdue) {
            statusBadge = '<span class="status-badge overdue">Overdue</span>'
        } else {
            statusBadge = '<span class="status-badge pending">Pending</span>'
        }

        const deadlineHTML = todo.deadline
            ? `<div class="todo-deadline">
                  <i class="fas fa-calendar-alt"></i>
                  ${new Date(todo.deadline).toLocaleString()}
              </div>`
            : ""

        const createdAtHTML = `
              <div class="todo-created">
                  <i class="fas fa-clock"></i>
                  Created: ${new Date(todo.created_at).toLocaleDateString()}
              </div>
          `

        return `
              <div class="todo-item ${isCompleted ? "completed" : ""}">
                  <div class="todo-header">
                      <h3 class="todo-title">${this.escapeHtml(todo.title)}</h3>
                      <div class="todo-status">
                          ${statusBadge}
                      </div>
                  </div>
                  
                  ${todo.description ? `<p class="todo-description">${this.escapeHtml(todo.description)}</p>` : ""}
                  
                  <div class="todo-meta">
                      ${createdAtHTML}
                      ${deadlineHTML}
                  </div>
                  
                  <div class="todo-actions">
                      <button id="toggle-${todo.id}" class="action-btn btn-${isCompleted ? "secondary" : "success"}">
                          <i class="fas fa-${isCompleted ? "undo" : "check"}"></i>
                          ${isCompleted ? "Mark Incomplete" : "Mark Complete"}
                      </button>
                      <button id="edit-${todo.id}" class="action-btn btn-primary">
                          <i class="fas fa-edit"></i>
                          Edit
                      </button>
                      <button id="delete-${todo.id}" class="action-btn btn-danger">
                          <i class="fas fa-trash"></i>
                          Delete
                      </button>
                  </div>
              </div>
          `
    }

    escapeHtml(text) {
        const div = document.createElement("div")
        div.textContent = text
        return div.innerHTML
    }

    showToast(message, type = "info") {
        const toastContainer = document.getElementById("toast-container")
        const toast = document.createElement("div")
        toast.className = `toast ${type}`

        const icon =
            type === "success"
                ? "check-circle"
                : type === "error"
                    ? "exclamation-circle"
                    : type === "warning"
                        ? "exclamation-triangle"
                        : "info-circle"

        toast.innerHTML = `
              <i class="fas fa-${icon}"></i>
              <span>${message}</span>
          `

        toastContainer.appendChild(toast)

        setTimeout(() => {
            toast.remove()
        }, 5000)
    }
}

document.addEventListener("DOMContentLoaded", () => {
    new TodoApp()
})
  