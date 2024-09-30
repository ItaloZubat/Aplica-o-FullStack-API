const registerForm = document.getElementById('registerForm');
const loginForm = document.getElementById('loginForm');
const registerMessageDiv = document.getElementById('registerMessage'); 
const loginMessageDiv = document.getElementById('loginMessage'); 
const API_URL = 'http://localhost:3000/api/auth'; 


registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const email = document.getElementById('email').value;

    try {
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password, email })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Erro no registro');
        }


        registerMessageDiv.textContent = 'Usuário registrado com sucesso!';
    } catch (error) {

        registerMessageDiv.textContent = `Erro: ${error.message}`;
    }
});


loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Erro no login');
        }

   
        localStorage.setItem('token', data.token);

       
        loginMessageDiv.textContent = 'Login bem-sucedido!';
    } catch (error) {
        
        loginMessageDiv.textContent = `Erro: ${error.message}`;
    }
});