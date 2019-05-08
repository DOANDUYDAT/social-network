


const requestFriend = (e) => {
    if (e.innerHTML === 'Add Friend') {
        const receiver = e.previousElementSibling.value;
        e.innerHTML = 'Loading';
        axios.post('/request-friend', {
                to: receiver
            })
            .then((res) => {
                console.log(res.data);
            })
            .catch((err) => {
                console.log(err);
            })
        socket.emit('request friend', {
            from: userAccount,
            to: receiver,
        });
        setTimeout(() => {
            e.innerHTML = "Cancel";
        }, 500);

    } else if (e.innerHTML === 'Cancel'){
        e.innerHTML = 'Loading';
        setTimeout(() => {
            e.innerHTML = "Add Friend";
        }, 500);
    }
    
};

const acceptFriend = (e) => {
    
    const successNotify = e.previousElementSibling;
    const newFriend = e.nextElementSibling;
    const buttonDelete = newFriend.nextElementSibling;
    buttonDelete.style.display = 'none';
    e.style.display = 'none';
    successNotify.style.display = 'inline';
    console.log(newFriend.value);
    axios.post('/add-friend', {
        friend: newFriend.value,
        answer: 'yes',
    }).then(res => {
        console.log(res);
    }).catch(err => {
        console.log(err);
    });
    socket.emit('accept friend', {
        from: userAccount,
        to: newFriend.value
    })
};

const deleteFriend = (e) => {
    console.log(e);
    const newFriend = e.previousElementSibling;
    const buttonAccept = newFriend.previousElementSibling;
    const successNotify = buttonAccept.previousElementSibling;
    buttonAccept.style.display = 'none';
    e.style.display = 'none';
    console.log(successNotify);
    successNotify.style.display = 'inline';
    console.log(newFriend.value);
    axios.post('/add-friend', {
        friend: newFriend.value,
        answer: 'no',
    }).then(res => {
        console.log(res);
    }).catch(err => {
        console.log(err);
    })
};
