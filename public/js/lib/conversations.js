// function convertDateAndTime(dateAndTime) {
//     const now = new Date();
//     const timeOfMessage = new Date(dateAndTime);
//     const timeFollowSecond = Math.floor((now - timeOfMessage) / 1000);
//     const timeFollowMinute = Math.floor(timeFollowSecond / 60);
//     const timeFollowHour = Math.floor(timeFollowMinute / 60);
//     const timeFollowDay = Math.floor(timeFollowHour / 24);
//     if (timeFollowDay > 0) {
//         return (timeFollowDay + ' days ago');
//     } else if (timeFollowHour > 0) {
//         return (timeFollowHour + ' hours ago');
//     } else if (timeFollowMinute > 0) {
//         return (timeFollowMinute + ' minutes ago');
//     } else {
//         return ('seconds ago');
//     }
// }

function convertTime() {

    return new Date().toLocaleString();
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
            htmlCode += '<small class="text-muted">' + convertTime() + '</small>';
            htmlCode += '</div>';
            htmlCode += '<p>' + reply.value + '</p>';
            htmlCode += '</div>';
            // htmlCode += '</li>';
            message.innerHTML = htmlCode;
            // console.log(message);
            boxConversation.appendChild(message);


            const miniConversation = 'conver-' + conversationId.value;
            const minBoxConversation = document.getElementById(miniConversation);
            // let htmlCodeForMiniConversation = '';
            // htmlCodeForMiniConversation += '<input type="hidden" value="' + conversationId.value + '" />';
            // htmlCodeForMiniConversation += '<a href="/messages/t/' + conversationId.value + '">';
            // htmlCodeForMiniConversation += '<div class="contact">';
            // htmlCodeForMiniConversation += '<img src="' + res.data.avatar + '" alt="" class="profile-photo-sm pull-left" />';
            // htmlCodeForMiniConversation += '<div class="msg-preview">';
            // htmlCodeForMiniConversation += '<h6>' + res.data.name.first + ' ' + res.data.name.last + '</h6>';
            // htmlCodeForMiniConversation += '<p class="text-muted">you: ' + reply.value + '</p>';
            // htmlCodeForMiniConversation += '<small class="text-muted">' + convertTime() + '</small>';
            // htmlCodeForMiniConversation += '</div>';
            // htmlCodeForMiniConversation += '</div>';
            // htmlCodeForMiniConversation += '</a>';
            // minBoxConversation.innerHTML = htmlCodeForMiniConversation;
            const messageText = minBoxConversation.children[1].children[0].children[1].children[1];
            messageText.innerHTML = 'you:' + reply.value;
            const messageTime = minBoxConversation.children[1].children[0].children[1].children[2];
            messageTime.innerHTML = convertTime();
            // console.log();
            reply.value = '';
        }).catch(err => {
            console.log(err);
        })



        const url = '/messages/t/' + conversationId.value;
        axios.post(url, {
            composedMessage: reply.value
        }).then(res => {
            console.log(res);

        }).catch(err => {
            console.log(err);
        })
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
    const conversationId = parent.previousElementSibling;
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
        message.className = 'left';
        let htmlCode = '';
        // const timeOfMessage = convertDateAndTime(message.createdAt);
        // htmlCode += '<li class="right">';
        htmlCode += '<img src="' + res.data.avatar + '" alt="" class="profile-photo-sm pull-left" />';
        htmlCode += '<div class="chat-item">';
        htmlCode += '<div class="chat-item-header">';
        htmlCode += '<h5>' + res.data.name.first + ' ' + res.data.name.last + '</h5>';
        htmlCode += '<small class="text-muted">' + convertTime() + '</small>';
        htmlCode += '</div>';
        htmlCode += '<p>' + reply.value + '</p>';
        htmlCode += '</div>';
        // htmlCode += '</li>';
        message.innerHTML = htmlCode;
        // console.log(message);
        boxConversation.appendChild(message);



        const miniConversation = 'conver-' + conversationId.value;
        const minBoxConversation = document.getElementById(miniConversation);
        // let htmlCodeForMiniConversation = '';
        // htmlCodeForMiniConversation += '<input type="hidden" value="' + conversationId.value + '" />';
        // htmlCodeForMiniConversation += '<a href="/messages/t/' + conversationId.value + '">';
        // htmlCodeForMiniConversation += '<div class="contact">';
        // htmlCodeForMiniConversation += '<img src="' + res.data.avatar + '" alt="" class="profile-photo-sm pull-left" />';
        // htmlCodeForMiniConversation += '<div class="msg-preview">';
        // htmlCodeForMiniConversation += '<h6>' + res.data.name.first + ' ' + res.data.name.last + '</h6>';
        // htmlCodeForMiniConversation += '<p class="text-muted">' + reply.value + '</p>';
        // htmlCodeForMiniConversation += '<small class="text-muted">' + convertTime() + '</small>';
        // htmlCodeForMiniConversation += '</div>';
        // htmlCodeForMiniConversation += '</div>';
        // htmlCodeForMiniConversation += '</a>';
        // minBoxConversation.innerHTML = htmlCodeForMiniConversation;
        // console.log(minBoxConversation.children[1].children[0].children[1].children);
        const messageText = minBoxConversation.children[1].children[0].children[1].children[1];
        messageText.innerHTML = 'you:' + reply.value;
        const messageTime = minBoxConversation.children[1].children[0].children[1].children[2];
        messageTime.innerHTML = convertTime();
        reply.value = '';
    }).catch(err => {
        console.log(err);
    })



    const url = '/messages/t/' + conversationId.value;
    axios.post(url, {
        composedMessage: reply.value
    }).then(res => {
        console.log(res);

    }).catch(err => {
        console.log(err);
    })
    socket.emit('message', {
        composedMessage: reply.value,
        from: userAccount,
        conversationId: conversationId.value
    });


}