const socket = io();


const userAccount = document.getElementById('userAccount').value;
const notifyFriend = document.getElementById('notify-friends');
const notifyNews = document.getElementById('notify-news');
const notifyMessages = document.getElementById('notify-messages');


notifyFriend.addEventListener('click', (e) => {
    e.preventDefault();
    let spanOfNotify = notifyFriend.childNodes[0].firstElementChild;
    if( spanOfNotify !== null) {
        notifyFriend.childNodes[0].removeChild(spanOfNotify)
    }
})

notifyNews.addEventListener('click', (e) => {
    e.preventDefault();
    let spanOfNotify = notifyNews.childNodes[0].firstElementChild;
    if( spanOfNotify !== null) {
        notifyNews.childNodes[0].removeChild(spanOfNotify)
    }
})

notifyMessages.addEventListener('click', (e) => {
    e.preventDefault();
    let spanOfNotify = notifyMessages.childNodes[0].firstElementChild;
    if( spanOfNotify !== null) {
        notifyMessages.childNodes[0].removeChild(spanOfNotify)
    }
})

socket.on('connect', data => {
    axios.get('/friend',{
        params: {
            key: userAccount
        }
    }).then(res => {
        console.log(res.data.roomChat)
        res.data.roomChat.forEach( room => {
            socket.emit('join', {
                name: room
            })
        })
    }).catch(err => {
        console.log(err);
    })
    socket.emit('join', {
        name: userAccount
    });
    socket.on(userAccount, data => {
        if (data.type === 'request friend') {
            let spanOfNotify = notifyFriend.childNodes[0].firstElementChild;
            if (spanOfNotify === null) {
                let spanElement = document.createElement('span');
                spanElement.className = "badge badge-pill badge-light";
                spanElement.style.background = "red";
                spanElement.style.fontSize = "13px";
                spanElement.innerText = 1;
                notifyFriend.childNodes[0].appendChild(spanElement);
            } else {
                let numberOfNotify = Number(spanOfNotify.innerText) + 1;
                spanOfNotify.innerText = numberOfNotify;
            }
            let newFriend = document.createElement('li');


            axios.get("/friend", {
                params: {
                    key: data.from,
                }
            }).then(res => {
                const listRequestFriend = document.getElementById('list-request-friends');

                let fullName = res.data.name.first + ' ' + res.data.name.last;

                let htmlCode = '<img src="' + res.data.avatar + '" alt="" class="profile-photo-sm" />';
                htmlCode += '<a href="/' + res.data.account + '" class="profile-link">' + fullName + '</a>';
                htmlCode += '<p hidden>Success</p>';
                htmlCode += '<button class="btn btn-primary" onclick="acceptFriend(this)">Accept</button>';
                htmlCode += '<input type="text" value="' + res.data.account + '" hidden>';
                htmlCode += '<button class="btn btn-primary" onclick="deleteFriend(this)">Delete</button>';

                newFriend.innerHTML = htmlCode;

                listRequestFriend.append(newFriend);

            }).catch(err => {
                console.log(err);
            })

        } else if (data.type === 'accept friend') {
            let spanOfNotify = notifyNews.childNodes[0].firstElementChild;
            if (spanOfNotify === null) {
                let spanElement = document.createElement('span');
                spanElement.className = "badge badge-pill badge-light";
                spanElement.style.background = "red";
                spanElement.style.fontSize = "13px";
                spanElement.innerText = 1;
                notifyNews.childNodes[0].appendChild(spanElement);
            } else {
                let numberOfNotify = Number(spanOfNotify.innerText) + 1;
                spanOfNotify.innerText = numberOfNotify;
            }

            console.log(data);

            let newNotify = document.createElement('li');

            axios.get("/friend", {
                params: {
                    key: data.from,
                }
            }).then(res => {
                // console.log(res.data);
                const listNotifications = document.getElementById('list-notifications');
                let fullName = res.data.name.first + ' ' + res.data.name.last;

                let htmlCode = '<img src="' + res.data.avatar + '" alt="" class="profile-photo-sm" />';
                htmlCode += '<a href="/' + res.data.account + '" class="profile-link">' + fullName + ' and you are friends</a>';
                // htmlCode += '<p> and you are friends aaaaaaaaaaaaaaaaaaaaa</p>';
                
                newNotify.innerHTML = htmlCode;

                listNotifications.append(newNotify);
            }).catch(err => {
                console.log(err);
            })

        } else if (data.type === "news") {
            // let spanOfNotify = notifyNews.childNodes[0].firstElementChild;
            // if (spanOfNotify === null) {
            //     let spanElement = document.createElement('span');
            //     spanElement.className = "badge badge-pill badge-light";
            //     spanElement.style.background = "red";
            //     spanElement.style.fontSize = "13px";
            //     spanElement.innerText = 1;
            //     notifyNews.childNodes[0].appendChild(spanElement);
            // } else {
            //     let numberOfNotify = Number(spanOfNotify.innerText) + 1;
            //     spanOfNotify.innerText = numberOfNotify;
            // }
            // let messageNotify = document.createElement('li');
        }
    });
    socket.on('reply', data => {
        console.log(data);
        let spanOfNotify = notifyMessages.childNodes[0].firstElementChild;
        if (spanOfNotify === null) {
            let spanElement = document.createElement('span');
            spanElement.className = "badge badge-pill badge-light";
            spanElement.style.background = "red";
            spanElement.style.fontSize = "13px";
            spanElement.innerText = 1;
            notifyMessages.childNodes[0].appendChild(spanElement);
        } else {
            let numberOfNotify = Number(spanOfNotify.innerText) + 1;
            spanOfNotify.innerText = numberOfNotify;
        }

        
        axios.get("/friend", {
            params: {
                key: data.from,
            }
        }).then(res => {
            // console.log(res.data);
            let newMessage = document.createElement('li');
            const listMessages = document.getElementById('list-messages');
            let fullName = res.data.name.first + ' ' + res.data.name.last;

            let htmlCode = '';
            htmlCode += '<a href="/messages/t/' + data.conversationId + '">'
            htmlCode += '<div class="contact">';
            htmlCode += '<img src="' + res.data.avatar + '" alt="" class="profile-photo-sm pull-left" />';
            htmlCode += '<div class="msg-preview">';
            htmlCode += '<h6>'+ fullName + '</h6>';
            htmlCode += '<p class="text-muted">' + data.composedMessage + '</p>';
            htmlCode += '</div>';
            htmlCode += '</div>';
            htmlCode += '</a>'
            
            
            newMessage.innerHTML = htmlCode;

            listMessages.append(newMessage);
        }).catch(err => {
            console.log(err);
        })
    })
})