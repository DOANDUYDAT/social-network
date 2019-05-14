// function getConversation(e) {
//     const convertsationId = e.children[0].value;
//     const url = '/messages/t/' + convertsationId;
//     axios.get(url)
//         .then(res => {
//             console.log(res);
//             const boxConversation = document.getElementById('box-conversation');
//             let htmlCode = '';
//             res.data.conversation.forEach(message => {
//                 if (message.author.account === userAccount) {
//                     const timeOfMessage = convertDateAndTime(message.createdAt);
//                     htmlCode += '<li class="right">';
//                     htmlCode += '<img src="' + message.author.avatar + '" alt="" class="profile-photo-sm pull-right" />';
//                     htmlCode += '<div class="chat-item">';
//                     htmlCode += '<div class="chat-item-header">';
//                     htmlCode += '<h5>' + message.author.name.first + ' ' + + message.author.name.last + '</h5>';
//                     htmlCode += '<small class="text-muted">' + timeOfMessage + '</small>';
//                     htmlCode += '</div>';
//                     htmlCode += '<p>' + message.body + '</p>';
//                     htmlCode += '</div>';
//                     htmlCode += '</li>';
//                 } else {
//                     const timeOfMessage = convertDateAndTime(message.createdAt);
//                     htmlCode += '<li class="left">';
//                     htmlCode += '<img src="' + message.author.avatar + '" alt="" class="profile-photo-sm pull-left" />';
//                     htmlCode += '<div class="chat-item">';
//                     htmlCode += '<div class="chat-item-header">';
//                     htmlCode += '<h5>' + message.author.name.first + ' ' + + message.author.name.last + '</h5>';
//                     htmlCode += '<small class="text-muted">' + timeOfMessage + '</small>';
//                     htmlCode += '</div>';
//                     htmlCode += '<p>' + message.body + '</p>';
//                     htmlCode += '</div>';
//                     htmlCode += '</li>';
//                 }
//                 htmlCode += 
//             })

//         })
//         .catch(err => {
//             console.log(err);
//         })


// }

function convertDateAndTime(dateAndTime) {
    const now = new Date();
    const timeOfMessage = new Date(dateAndTime);
    const timeFollowSecond = Math.floor((now - timeOfMessage) / 1000);
    const timeFollowMinute = Math.floor(timeFollowSecond / 60);
    const timeFollowHour = Math.floor(timeFollowMinute / 60);
    const timeFollowDay = Math.floor(timeFollowHour / 24);
    if (timeFollowDay > 0) {
        return (timeFollowDay + ' days ago');
    } else if (timeFollowHour > 0) {
        return (timeFollowHour + ' hours ago');
    } else if (timeFollowMinute > 0) {
        return (timeFollowMinute + ' minutes ago');
    } else {
        return ('seconds ago');
    }
}


const btnSendMessage = document.getElementById('input-send-message');
btnSendMessage.addEventListener('keydown', e => {
    // e.preventDefault();
    if (e.keyCode === 13) {
        const boxConversation = document.getElementById('box-conversation');
        // console.log(boxConversation);
        const conversationId = e.srcElement.nextElementSibling;
        // console.log(convertsationId.value);
        // console.log(e)
        const reply = e.srcElement;
        // console.log(reply.value);
        axios.get('/friend', {
            params: {
                key: userAccount
            }
        }).then(res => {
            const message = document.createElement('li');
            message.className = 'right';
            let htmlCode = '';
            // const timeOfMessage = convertDateAndTime(message.createdAt);
            // htmlCode += '<li class="right">';
            htmlCode += '<img src="' + res.data.avatar + '" alt="" class="profile-photo-sm pull-right" />';
            htmlCode += '<div class="chat-item">';
            htmlCode += '<div class="chat-item-header">';
            htmlCode += '<h5>' + res.data.name.first + ' ' + res.data.name.last + '</h5>';
            htmlCode += '<small class="text-muted">seconds ago</small>';
            htmlCode += '</div>';
            htmlCode += '<p>' + reply.value + '</p>';
            htmlCode += '</div>';
            // htmlCode += '</li>';
            message.innerHTML = htmlCode;
            // console.log(message);
            boxConversation.appendChild(message);
            reply.value = '';
        }).catch(err => {
            console.log(err);
        })



        // const url = '/messages/t/' + convertsationId.value;
        // axios.post(url, {
        //     composedMessage: reply.value
        // }).then(res => {
        //     console.log(res);
        // }).catch(err => {
        //     console.log(err);
        // })
        
        socket.emit('message', {
            composedMessage: reply.value,
            from: userAccount,
            conversationId: conversationId.value
        });
        
        
    }
})


function sendReply(e) {
    // e.preventDefault();
    const boxConversation = document.getElementById('box-conversation');
    // console.log(boxConversation);
    const parent = e.parentElement;
    const conversationId = parent.previousElementSibling
    const reply = conversationId.previousElementSibling;
    // const reply = parent.previousElementSibling;
    // console.log(convertsationId.value);
    // console.log(reply.value);
    axios.get('/friend', {
        params: {
            key: userAccount
        }
    }).then(res => {
        const message = document.createElement('li');
        message.className = 'right';
        let htmlCode = '';
        // const timeOfMessage = convertDateAndTime(message.createdAt);
        // htmlCode += '<li class="right">';
        htmlCode += '<img src="' + res.data.avatar + '" alt="" class="profile-photo-sm pull-right" />';
        htmlCode += '<div class="chat-item">';
        htmlCode += '<div class="chat-item-header">';
        htmlCode += '<h5>' + res.data.name.first + ' ' + res.data.name.last + '</h5>';
        htmlCode += '<small class="text-muted">seconds ago</small>';
        htmlCode += '</div>';
        htmlCode += '<p>' + reply.value + '</p>';
        htmlCode += '</div>';
        // htmlCode += '</li>';
        message.innerHTML = htmlCode;
        // console.log(message);
        boxConversation.appendChild(message);
        reply.value = '';
    }).catch(err => {
        console.log(err);
    })



    // const url = '/messages/t/' + convertsationId.value;
    // axios.post(url, {
    //     composedMessage: reply.value
    // }).then(res => {
    //     console.log(res);
    // }).catch(err => {
    //     console.log(err);
    // })

    socket.emit('message', {
        composedMessage: reply.value,
        from: userAccount,
        conversationId: conversationId.value
    });

}