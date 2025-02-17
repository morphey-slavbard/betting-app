document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const errorMessage = document.getElementById('error-message');

    loginForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent form submission

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // Simple validation (replace with API call if needed)
        if (username === 'admin' && password === 'password') {
            sessionStorage.setItem('loggedIn', true); // Mark user as logged in
            window.location.href = 'index.html'; // Redirect to main app
        } else {
            errorMessage.textContent = 'Invalid username or password';
        }
    });
});
