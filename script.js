function maskPassword(pass) {
    return '•'.repeat(pass.length);
}

function copyText(txt) {
    navigator.clipboard.writeText(txt).then(
        () => {
            showNotification('Copiado com sucesso!');
        },
        () => {
            showNotification('Falha ao copiar!', 'error');
        }
    );
}

function showNotification(message, type = 'success') {
    const alert = document.getElementById('alert');
    const span = alert.querySelector('span');
    const icon = alert.querySelector('i');
    
    span.textContent = message;
    
    if (type === 'error') {
        alert.style.background = 'var(--danger-color)';
        icon.className = 'fas fa-exclamation-circle';
    } else {
        alert.style.background = 'var(--success-color)';
        icon.className = 'fas fa-check-circle';
    }
    
    alert.style.display = 'flex';
    
    setTimeout(() => {
        alert.style.display = 'none';
    }, 3000);
}

function togglePasswordVisibility(inputId) {
    const input = document.getElementById(inputId);
    const eyeIcon = document.getElementById(inputId + '-eye');
    
    if (input.type === 'password') {
        input.type = 'text';
        eyeIcon.className = 'fas fa-eye-slash';
    } else {
        input.type = 'password';
        eyeIcon.className = 'fas fa-eye';
    }
}

const deletePassword = (website) => {
    if (confirm(`Tem certeza que deseja excluir a senha de ${website}?`)) {
        let data = localStorage.getItem("passwords");
        let arr = JSON.parse(data);
        let arrUpdated = arr.filter((e) => {
            return e.website != website;
        });
        localStorage.setItem("passwords", JSON.stringify(arrUpdated));
        showNotification(`Senha de ${website} excluída com sucesso!`);
        showPasswords();
    }
}

function showPasswords() {
    const tbody = document.querySelector(".passwords-table tbody");
    const data = localStorage.getItem("passwords");
    tbody.innerHTML = "";

    if (!data || JSON.parse(data).length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="4" class="empty-state">
                    <i class="fas fa-key"></i>
                    <div>Nenhuma senha foi adicionada ainda</div>
                    <small>Adicione sua primeira senha usando o formulário abaixo</small>
                </td>
            </tr>
        `;
        return;
    }

    const arr = JSON.parse(data);

    arr.forEach((element, index) => {
        const tr = document.createElement("tr");
        const passwordId = `password-${index}`;

        const tdSite = document.createElement("td");
        const siteContent = document.createElement("div");
        siteContent.className = "cell-content";
        siteContent.innerHTML = `
            <span>${element.website}</span>
            <button class="copy-btn" onclick="copyText('${element.website}')" title="Copiar site">
                <i class="fas fa-copy"></i>
            </button>
        `;
        tdSite.appendChild(siteContent);
        tr.appendChild(tdSite);

        const tdLogin = document.createElement("td");
        const loginContent = document.createElement("div");
        loginContent.className = "cell-content";
        loginContent.innerHTML = `
            <span>${element.username}</span>
            <button class="copy-btn" onclick="copyText('${element.username}')" title="Copiar login">
                <i class="fas fa-copy"></i>
            </button>
        `;
        tdLogin.appendChild(loginContent);
        tr.appendChild(tdLogin);

        const tdSenha = document.createElement("td");
        const passwordContent = document.createElement("div");
        passwordContent.className = "cell-content";
        let isMasked = true;
        
        passwordContent.innerHTML = `
            <span class="password-cell" id="${passwordId}">${maskPassword(element.password)}</span>
            <button class="eye-btn" onclick="togglePasswordInTable('${passwordId}', '${element.password}')" title="Mostrar/Ocultar senha">
                <i class="fas fa-eye" id="${passwordId}-eye"></i>
            </button>
            <button class="copy-btn" onclick="copyText('${element.password}')" title="Copiar senha">
                <i class="fas fa-copy"></i>
            </button>
        `;
        
        tdSenha.appendChild(passwordContent);
        tr.appendChild(tdSenha);

        const tdActions = document.createElement("td");
        const actionsContent = document.createElement("div");
        actionsContent.className = "cell-content";
        actionsContent.innerHTML = `
            <button class="btn-danger" onclick="deletePassword('${element.website}')" title="Excluir senha">
                <i class="fas fa-trash"></i>
                Excluir
            </button>
        `;
        tdActions.appendChild(actionsContent);
        tr.appendChild(tdActions);

        tbody.appendChild(tr);
    });
    
    document.getElementById("website").value = "";
    document.getElementById("username").value = "";
    document.getElementById("password").value = "";
}

function togglePasswordInTable(passwordId, originalPassword) {
    const passwordElement = document.getElementById(passwordId);
    const eyeIcon = document.getElementById(passwordId + '-eye');
    
    if (passwordElement.textContent === maskPassword(originalPassword)) {
        passwordElement.textContent = originalPassword;
        eyeIcon.className = 'fas fa-eye-slash';
    } else {
        passwordElement.textContent = maskPassword(originalPassword);
        eyeIcon.className = 'fas fa-eye';
    }
}


console.log("PassX - Sistema carregado com sucesso!");
showPasswords();

document.querySelector(".btn-primary").addEventListener("click", (e) => {
    e.preventDefault();
    
    const websiteInput = document.getElementById("website");
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");
    
    if (!websiteInput.value.trim() || !usernameInput.value.trim() || !passwordInput.value.trim()) {
        showNotification('Por favor, preencha todos os campos!', 'error');
        return;
    }
    
    let passwords = localStorage.getItem("passwords");
    let json = passwords ? JSON.parse(passwords) : [];
    
    const existingPassword = json.find(item => item.website.toLowerCase() === websiteInput.value.toLowerCase());
    if (existingPassword) {
        if (!confirm(`Já existe uma senha salva para ${websiteInput.value}. Deseja substituir?`)) {
            return;
        }
        json = json.filter(item => item.website.toLowerCase() !== websiteInput.value.toLowerCase());
    }
    
    json.push({
        website: websiteInput.value.trim(),
        username: usernameInput.value.trim(),
        password: passwordInput.value
    });
    
    localStorage.setItem("passwords", JSON.stringify(json));
    showNotification('Senha salva com sucesso!');
    showPasswords();
});
