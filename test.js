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


console.log(convertDateAndTime('2019-05-13T13:19:24.842Z'));