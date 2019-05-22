function like(e) {
    console.log(e);

    const parent = e.parentElement;
    const postId = parent.firstElementChild;
    axios.get('/post/t/like/', {
        params: {
            postId: postId.value
        }
    })
        .then(res => {
            const likeElement = e.firstElementChild;
            likeElement.innerHTML = res.data.length;
        })
        .catch(err => {
            console.log(err);
        })
}

function dislike(e) {
    console.log(e);
    const parent = e.parentElement;
    const postId = parent.firstElementChild;
    axios.get('/post/t/dislike/', {
        params: {
            postId: postId.value
        }
    })
        .then(res => {
            const likeElement = e.firstElementChild;
            likeElement.innerHTML = res.data.length;
        })
        .catch(err => {
            console.log(err);
        })
}


function postComment(e) {
    const parent = e.parentElement;
    const postId = parent.firstElementChild;
    const comment = e;
    // console.log(e);
    e.addEventListener('keydown', ele => {
        if (ele.keyCode === 13) {
            if (comment.value) {
                // e.preventDefault();
                // console.log(comment.value);

                const listComments = document.getElementById('list-comments-' + postId.value);
                const newComment = document.createElement('div');

                newComment.className = 'post-comment';
                let htmlCode = '';
                htmlCode += '<img src="' + userAvatar + '" alt="" class="profile-photo-sm" />'
                htmlCode += '<p><a href="' + userAccount + '" class="profile-link">' + userFullName + '</a> ' + comment.value + ' </p>';
                newComment.innerHTML = htmlCode;
                listComments.appendChild(newComment);

                axios.post('/post/comment', {
                    comment: comment.value,
                    postId: postId.value
                })
                    .then(res => {
                        console.log(res);
                    })
                    .catch(err => {
                        console.log(err);
                    })
                socket.emit('new comment', {
                    postId: postId.value,
                    from: userAccount
                })
                comment.value = '';
            }
        }
    })

}


function loadComments(e) {
    const parent = e.parentElement;
    const postId = parent.firstElementChild;
    const url = '/post/t/' + postId.value + '/comments';


    axios.get(url)
        .then(res => {
            const comments = res.data;
            const listComments = document.getElementById('list-comments-' + postId.value);
            let htmlCode = '';
            if (comments.length > 0) {
                comments.forEach(comment => {
                    const fullName = comment.owner.name.first + ' ' + comment.owner.name.last;
                    htmlCode += '<div class="post-comment">';
                    htmlCode += '<img src="' + comment.owner.avatar + '" alt="" class="profile-photo-sm" />';
                    htmlCode += '<p><a href="' + comment.owner.account + '" class="profile-link">' + fullName + ' </a><i class="em em-laughing"></i>' + comment.body + '</p>';
                    htmlCode += '</div>';
                })
                listComments.innerHTML = htmlCode;


            } else {
                listComments.innerHTML = htmlCode;

            }
            if (!listComments.nextElementSibling) {
                const commentBox = document.createElement('div');
                commentBox.className = 'post-comment';


                let htmlCodeForCommentBox = '';
                htmlCodeForCommentBox += '<input type="hidden" value="' + postId.value + '">';
                htmlCodeForCommentBox += '<img src="' + userAvatar + '" alt="" class="profile-photo-sm" />';
                htmlCodeForCommentBox += '<input type="text" class="form-control" placeholder="Post a comment" onclick="postComment(this)" required />';


                commentBox.innerHTML = htmlCodeForCommentBox;

                listComments.parentNode.appendChild(commentBox);
            }
        })
        .catch(err => {
            console.log(err);
        })
}
