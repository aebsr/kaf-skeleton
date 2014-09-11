// stamps

// create adStamp object
function adStamp(img,url,starts,ends,target) {
	this.img = img;	
	this.url = url;			
	// default start and end dates mean ad will definitely run unless constraints are placed on it
	this.starts = new Date('January 1, 2013 00:00:01'); 
	this.ends = new Date('December 31, 2020 00:00:01');
	this.target = '#stamp-target-m, #stamp-target, #recipe-adstamp, #bec-adstamp, #blog-adstamp, #community-adstamp, #adstamp';  
			// eventually remove #stamp-target-m and #stamp-target
	
	// send newly created objects to an array
	adStamp.objects.push(this);
}

adStamp.objects = [];

adStamp.prototype.remove = function() {
  for (var i=0; i<adStamp.objects.length; i++) {
    if (adStamp.objects[i] == this) {
      adStamp.objects.splice(i,1);
    }
  }
};


// console.log(adStamp.objects);



// create new stamps
/*
var ourpicksStamp = new adStamp();
	ourpicksStamp.img = '/images/stamps/summersale.jpg';
	ourpicksStamp.url = 'http://www.kingarthurflour.com/shop/refine-results/on-sale';
	ourpicksStamp.starts = new Date('May 24, 2013 00:00:01');
	ourpicksStamp.ends = new Date('June 8, 2013 00:00:01');
*/



// assemble the stamp HTML for display on the page
function buildStamp(theObject) {
	$(theObject.target)
	.append($('<a></a>', {'href': theObject.url, 'class': 'stampblock'})
	.append($('<img />', {'src': theObject.img})) );
}

// stamps - iterate through stamp objects and display all that are not expired
function showStamps() {
	var stampsToShow = '';
	var numStamps = adStamp.objects.length;
	
	for (var i = 0; i < numStamps; i++) {
		//console.log(i);

		// determine whether to add stamp to list
		if ( 
		Date.parse(now) > Date.parse(adStamp.objects[i].starts) && Date.parse(now) < Date.parse(adStamp.objects[i].ends) 
		) {
			stampsToShow += buildStamp(adStamp.objects[i]);
		}
	}
	return stampsToShow;
	
}

