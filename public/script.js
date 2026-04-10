const container = document.getElementById('chat-container'); // pegue o elemento pelo id do html
const input = document.getElementById('userInput');
const btn = document.getElementById('sendBtn');

// enviar com a tela enter

input.addEventListener('keypress', (e) => {
    if(e.key == 'Enter') sendMessage();
})

// requisição na api, tem que ser assíncrona

async function sendMessage() {
    const message = input.value.trim(); // trim = remover os espaços no final  
    if (!message) return;
        // inverte a lógica, se a mensagem não existir faça tal coisa 

    // add pergunta do user
    input.value = '';
    appendMessage('user', message); // appendMessage = adiciona uma msg nova pro user

    //  interface
    btn.disabled = true;
    btn.classList.add('opacity-50');
    btn.innerText = '...';

    // try catch = tratamento de erros, comunica com PhP
    // try + await + async = tenta executar o código sincronizado com a api 
    try {
        const response = await fetch('.../src/chat.php', {  // await = depois que ocorrer o envio da msg no async
            // fetch retorna um arq json
            method: 'POST', // method post = cria novos dados na requisição
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({message: message})
        });

        const data = await response.json();
        if (data.reply){
            appendMessage('Mentor', data.reply);
        } else {
            appendMessage('Mentor', 'Erro: ' + (data.error) || 'Não foi possível obter a resposta.');
        } } catch (error){ // catch pega o erro caso de errado, impedindo q a aplicação trave.
            appendMessage('Mentor', 'Erro de conexão com o servidor.');
        } finally {
        btn.disabled = false;
        btn.innerText = 'Enviar';
    }
}

function appendMessage(role,content) {
    const div = document.createElement('div');  // cria um novo elemento html dentro do java script
    div.classname = role === 'user' ? 'flex justify-end' : 'flex justify-start';

    const inner = document.createElement('div');
    // estilos diferentes para o user e para o mentor
    if (role === 'user'){
        inner.className = 'bg-blue-600 text-white p-4 rounded-2xl max-w[85%] shadow-md'
        // renderizar o markdown e colorir o código 
        inner.innerHTML = marked.parse(content);
        setTimeout(() => {
            inner.querySelectorAll('pre code').forEach(block => {
                hljs.highlightElement(block);
            });
        }, 10);
    } 

    div.appendChild(inner);
    container.appendChild(div);

    container.scrollTo({top: container.scrollHeight, behavior:'smooth'});
}

