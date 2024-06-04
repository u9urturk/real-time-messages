const express = require('express');
const socket = require('socket.io');


const baseRoutes = require('./src/routes/baseRoutes')
const app = express();
app.use('/', baseRoutes);
const server = app.listen(3000);

const mongoose = require('mongoose');
const User = require('./src/models/User');
const Message = require('./src/models/Message');


app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

const io = socket(server);

io.on('connection', (socket) => {
    console.log(socket.id)

    const response =  fetch(`/api/messages`);
    const dataDb = response.json();
    io.sockets.emit('chat', dataDb)

    socket.on('chat', data => {
        io.sockets.emit('chat', data)

        User.findOne({ username: data.sender }).then(res => {
            if (res === null) {
                const newUser = new User({ username: data.sender });

                newUser.save().then(savedUser => {
                    console.log('kullanıcı kaydı başarılı. Kullanıcı : ', savedUser)
                    console.log(savedUser._id.toString());
                    const newMessage = new Message({ text: data.message, senderId: savedUser._id.toString() })

                    newMessage.save().then(savedMessage => {
                        console.log('mesaj kayıt edildi.  : ', savedMessage);
                    }).catch(err => {
                        console.error('mesaj kayıt hatası ', err);
                    })

                }).catch(err => {
                    console.error('Kullanıcı kaydedilirken hata oluştu', err)
                })

                return;
            }

            const newMessage = new Message({ text: data.message, senderId: res._id })

            newMessage.save().then(savedMessage => {
                console.log('mesaj kayıt edildi.  : ', savedMessage);
            }).catch(err => {
                console.error('mesaj kayıt hatası ', err);
            })
        })


    })

    socket.on('typing', data => {
        socket.broadcast.emit('typing', data)
    })

    socket.on('stopTyping', () => {
        socket.broadcast.emit('stopTyping')
    })
})



//MongoDB


mongoose.connect('mongodb://localhost:27017/realtimemessages', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

