const socket = io.connect('http://localhost:3000')

const sender = document.getElementById('sender')
const message = document.getElementById('message')
const submitBtn = document.getElementById('submitBtn')
const output = document.getElementById('output')
const feedback = document.getElementById('feedback')

let baseSender = ''



message.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && message.value !== "" && sender.value !== "") {
        socket.emit('chat', {
            message: message.value,
            sender: sender.value
        })

        baseSender = sender.value
    }
})


submitBtn.addEventListener('click', () => {
    if (message.value !== "" && sender.value !== "") {
        socket.emit('chat', {
            message: message.value,
            sender: sender.value
        })

        baseSender = sender.value
    }

})

async function fetchMessages() {
    const response = await fetch(`/api/messages`);
    const data = response.json();
    console.log(data);
}



socket.on('chat', data => {
    feedback.innerHTML = "";
    data.then(res => {
        res.forEach(e => {
            
            if (baseSender === e.sender) {
                output.innerHTML += "<div style='justify-content: flex-end;' class='w-[55%] h-auto flex '>" + "<p>" + data.message + "</p></div>"
            } else {
                output.innerHTML += "<div class='w-[55%] h-auto flex justify-start'>" + "<p><strong>" + data.sender + ' : </strong>' + data.message + "</p></div>"
            }
        });
    })
    message.value = '';
})

message.addEventListener('input', () => {
    console.log(message.value);
    if (message.value) {

        socket.emit('typing', sender.value)
    } else {
        socket.emit('stopTyping');
    }

})

socket.on('typing', data => {
    feedback.innerHTML = '<p>' + data + ' yazıyor...</p>'
})

socket.on('stopTyping', () => {
    feedback.innerHTML = "";
})

