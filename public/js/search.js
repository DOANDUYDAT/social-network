axios.get('/search')
    .then(res => {
        $('.typeahead').typeahead({
            source: res.data.map(user => {
                let userName = user.name.first + ' ' + user.name.last;
                return userName;
            }),
            autoSelect: false
        })
    })
    .catch(err => {
        console.log(err);
    })

