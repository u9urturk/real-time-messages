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
    if ( message.value !== "" && sender.value !== ""){
        socket.emit('chat', {
            message: message.value,
            sender: sender.value
        })
    
        baseSender = sender.value
    }
   
})


socket.on('chat', data => {
    feedback.innerHTML = "";
    if (baseSender === data.sender) {
        output.innerHTML += "<div class='w-1/2 h-auto flex justify-end '>" + "<p>" + data.message + "</p></div>"
    } else {
        output.innerHTML += "<div class='w-1/2 h-auto flex justify-start'>" + "<p><strong>" + data.sender + ' : </strong>' + data.message + "</p></div>"
    }
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

