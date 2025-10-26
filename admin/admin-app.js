// Admin Panel JavaScript
(function() {
    'use strict';

    let authToken = localStorage.getItem('adminToken');
    let currentUser = null;

    // DOM Elements
    const loginSection = document.getElementById('login-section');
    const dashboardSection = document.getElementById('dashboard-section');
    const loginForm = document.getElementById('login-form');
    const loginError = document.getElementById('login-error');
    const logoutBtn = document.getElementById('logout-btn');
    const adminUsername = document.getElementById('admin-username');
    const newContentBtn = document.getElementById('new-content-btn');
    const contentFormContainer = document.getElementById('content-form-container');
    const contentForm = document.getElementById('content-form');
    const cancelBtn = document.getElementById('cancel-btn');
    const contentList = document.getElementById('content-list');
    const messagesList = document.getElementById('messages-list');

    // Initialize
    init();

    function init() {
        if (authToken) {
            verifyToken();
        } else {
            showLogin();
        }

        setupEventListeners();
    }

    function setupEventListeners() {
        loginForm.addEventListener('submit', handleLogin);
        logoutBtn.addEventListener('click', handleLogout);
        newContentBtn.addEventListener('click', showContentForm);
        cancelBtn.addEventListener('click', hideContentForm);
        contentForm.addEventListener('submit', handleContentSubmit);
    }

    // Authentication
    async function handleLogin(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (response.ok) {
                authToken = data.token;
                currentUser = data.user;
                localStorage.setItem('adminToken', authToken);
                showDashboard();
                loadContent();
                loadMessages();
            } else {
                showError(data.error || 'Login failed');
            }
        } catch (error) {
            showError('Network error. Please try again.');
        }
    }

    async function verifyToken() {
        try {
            const response = await fetch('/api/auth/verify', {
                headers: { 'Authorization': `Bearer ${authToken}` }
            });

            if (response.ok) {
                const data = await response.json();
                currentUser = data.user;
                showDashboard();
                loadContent();
                loadMessages();
            } else {
                handleLogout();
            }
        } catch (error) {
            handleLogout();
        }
    }

    function handleLogout() {
        authToken = null;
        currentUser = null;
        localStorage.removeItem('adminToken');
        showLogin();
    }

    function showError(message) {
        loginError.textContent = message;
        loginError.style.display = 'block';
        setTimeout(() => {
            loginError.style.display = 'none';
        }, 5000);
    }

    function showLogin() {
        loginSection.classList.remove('hidden');
        dashboardSection.classList.add('hidden');
    }

    function showDashboard() {
        loginSection.classList.add('hidden');
        dashboardSection.classList.remove('hidden');
        if (currentUser) {
            adminUsername.textContent = `Logged in as: ${currentUser.username}`;
        }
    }

    // Content Management
    async function loadContent() {
        try {
            const response = await fetch('/api/content');
            const content = await response.json();

            if (content.length === 0) {
                contentList.innerHTML = '<p>No content yet. Click "New Content" to add some.</p>';
                return;
            }

            contentList.innerHTML = content.map(item => `
                <div class="content-item">
                    <h3>${escapeHtml(item.title)}</h3>
                    <div class="content-meta">
                        Category: ${escapeHtml(item.category)} | 
                        Created: ${new Date(item.created_at).toLocaleDateString()}
                    </div>
                    <div class="content-body">${escapeHtml(item.body.substring(0, 200))}${item.body.length > 200 ? '...' : ''}</div>
                    ${item.alt_text ? `<div class="content-meta">Alt Text: ${escapeHtml(item.alt_text)}</div>` : ''}
                    <div class="content-actions">
                        <button class="btn-primary" onclick="editContent(${item.id})">Edit</button>
                        <button class="btn-danger" onclick="deleteContent(${item.id})">Delete</button>
                    </div>
                </div>
            `).join('');
        } catch (error) {
            contentList.innerHTML = '<p>Error loading content.</p>';
        }
    }

    async function loadMessages() {
        try {
            const response = await fetch('/api/contact');
            const messages = await response.json();

            if (messages.length === 0) {
                messagesList.innerHTML = '<p>No messages yet.</p>';
                return;
            }

            messagesList.innerHTML = messages.map(msg => `
                <div class="message-item">
                    <div class="message-header">
                        <span class="message-from">${escapeHtml(msg.name)}</span>
                        <span class="message-date">${new Date(msg.created_at).toLocaleString()}</span>
                    </div>
                    <div class="message-email">${escapeHtml(msg.email)}</div>
                    <div class="message-text">${escapeHtml(msg.message)}</div>
                </div>
            `).join('');
        } catch (error) {
            messagesList.innerHTML = '<p>Error loading messages.</p>';
        }
    }

    function showContentForm(isEdit = false) {
        contentFormContainer.classList.remove('hidden');
        document.getElementById('form-title').textContent = isEdit ? 'Edit Content' : 'Add New Content';
        contentFormContainer.scrollIntoView({ behavior: 'smooth' });
    }

    function hideContentForm() {
        contentFormContainer.classList.add('hidden');
        contentForm.reset();
        document.getElementById('content-id').value = '';
    }

    async function handleContentSubmit(e) {
        e.preventDefault();

        const id = document.getElementById('content-id').value;
        const title = document.getElementById('content-title').value;
        const body = document.getElementById('content-body').value;
        const altText = document.getElementById('content-alt-text').value;
        const category = document.getElementById('content-category').value;

        const data = {
            title,
            body,
            alt_text: altText,
            category
        };

        try {
            const url = id ? `/api/content/${id}` : '/api/content';
            const method = id ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (response.ok) {
                showFormMessage(result.message, 'success');
                hideContentForm();
                loadContent();
            } else {
                showFormMessage(result.error || 'Failed to save content', 'error');
            }
        } catch (error) {
            showFormMessage('Network error. Please try again.', 'error');
        }
    }

    function showFormMessage(message, type) {
        const formMessage = document.getElementById('form-message');
        formMessage.textContent = message;
        formMessage.className = type === 'success' ? 'success-message' : 'error-message';
        formMessage.style.display = 'block';

        setTimeout(() => {
            formMessage.style.display = 'none';
        }, 5000);
    }

    // Global functions for inline event handlers
    window.editContent = async function(id) {
        try {
            const response = await fetch(`/api/content/${id}`);
            const content = await response.json();

            document.getElementById('content-id').value = content.id;
            document.getElementById('content-title').value = content.title;
            document.getElementById('content-body').value = content.body;
            document.getElementById('content-alt-text').value = content.alt_text || '';
            document.getElementById('content-category').value = content.category;

            showContentForm(true);
        } catch (error) {
            alert('Error loading content for editing');
        }
    };

    window.deleteContent = async function(id) {
        if (!confirm('Are you sure you want to delete this content?')) {
            return;
        }

        try {
            const response = await fetch(`/api/content/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });

            if (response.ok) {
                loadContent();
            } else {
                alert('Failed to delete content');
            }
        } catch (error) {
            alert('Network error. Please try again.');
        }
    };

    // Utility function to escape HTML
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

})();
