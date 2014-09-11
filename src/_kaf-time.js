
// function to calculate local time in Boston, absent the ability to check our server
function calcTime(city, offset) {
    d = new Date();
    utc = d.getTime() + (d.getTimezoneOffset() * 60000);
    nd = new Date(utc + (3600000*offset));
    return nd.toLocaleString();
}

	// for promos and stamps
	var now = calcTime('Boston', '-4');


