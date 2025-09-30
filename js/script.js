function showFeedback(message, type) {
    const feedbackDiv = document.getElementById('feedback-message');
    feedbackDiv.textContent = message;
    feedbackDiv.className = `feedback-message show ${type}`;
    feedbackDiv.style.display = 'block';

    setTimeout(() => {
        feedbackDiv.classList.remove('show');
        setTimeout(() => feedbackDiv.style.display = 'none', 500);
    }, 5000);
}

function applyCpfMask(input) {
    let value = input.value.replace(/\D/g, '');
    
    if (value.length > 3) value = value.replace(/^(\d{3})/, '$1.');
    if (value.length > 6) value = value.replace(/^(\d{3})\.(\d{3})/, '$1.$2.');
    if (value.length > 9) value = value.replace(/^(\d{3})\.(\d{3})\.(\d{3})/, '$1.$2.$3-');
    
    input.value = value.substring(0, 14);
}

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('pesquisaForm');
    const cpfInput = document.getElementById('cpf');
    const submitBtn = document.getElementById('submitBtn');

    cpfInput.addEventListener('input', () => applyCpfMask(cpfInput));

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="loading-spinner"></span> Enviando...';

        const formData = new FormData(form);
        const data = {};

        for (const [key, value] of formData.entries()) {
            if (key === 'setorReabilitacao') {
                continue; 
            }
            data[key] = value;
        }

        data.setorReabilitacao = Array.from(form.querySelectorAll('input[name="setorReabilitacao"]:checked')).map(cb => cb.value);

        if (data.setorReabilitacao.length === 0) {
            showFeedback('Erro: Selecione pelo menos um setor de reabilitação utilizado.', 'error');
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Enviar';
            return;
        }

        try {
            const response = await fetch('/api/submit-pesquisa', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (response.ok) {
                showFeedback(result.message || 'Pesquisa enviada com sucesso! Verifique os logs do Vercel.', 'success');
                form.reset();
            } else {
                throw new Error(result.error || 'Erro desconhecido ao enviar os dados.');
            }
        } catch (error) {
            console.error('Erro de Submissão:', error);
            showFeedback(`Erro ao enviar: ${error.message}.`, 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Enviar';
        }
    });
});