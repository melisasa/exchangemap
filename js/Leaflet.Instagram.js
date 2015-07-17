//var imagesArr = null;

L.Instagram = L.FeatureGroup.extend({
	options: {
		icon: {						
			iconSize: [40, 40],
			className: 'leaflet-marker-instagram'
		},
		popup: {
			className: 'leaflet-popup-instagram'
		},		
		//imageTemplate: '<a href="{link}" title="View on Instagram"><img src="{image_standard}"/></a><p>{caption}<br>Posted on: {time}</a></p><br><table style="width:100%"><tr><td align="left"><i class="fa fa-arrow-left" id="toggle-previous"></i></td><td align="right"><i class="fa fa-arrow-right" id="toggle-next"></i></td></tr></table>', 
		imageTemplate: '<a href="{link}" title="View on Instagram"><img src="{image_standard}"/></a><p>{caption}<br>Posted on: </a></p><br><table style="width:100%"><tr><td align="left"><i class="fa fa-arrow-left"></i></td><td align="right"><i class="fa fa-arrow-right"></i></td></tr></table>', 
		videoTemplate: '<a href="{link}" title="View on Instagram"><video autoplay controls poster="{image_standard}"><source src="{video_standard}" type="video/mp4"/></video></a><p>{caption}</a></p>', 	
		
                
                
                onClick: function(evt) {
			var image    = evt.layer.image,
			    options  = this.options,
			    template = options.imageTemplate;

			if (image.type === 'video' && (!!document.createElement('video').canPlayType('video/mp4; codecs=avc1.42E01E,mp4a.40.2'))) {
				template = options.videoTemplate;
			}

			evt.layer.bindPopup(L.Util.template(template, image), options.popup).openPopup();
		}
	},

	initialize: function (url, options) {	
		this._url = url;
		options = L.setOptions(this, options);
		L.FeatureGroup.prototype.initialize.call(this);
		if (options.onClick) {
			this.on('click', options.onClick, this);
		}
	},

	onAdd: function (map) {
		this.load();
		L.FeatureGroup.prototype.onAdd.call(this, map);
	},

	load: function (url) {
		var self = this;
		reqwest({
			url: url || this._url,
			type: 'jsonp', 
			success: function (data) {
				self._parse(data.data || data.rows || []);
				self.fire('load', { data: data });
			}
		});
		return this;
	},

	_parse: function (images) {
		for (var i = 0, len = images.length; i < len; i++) {
			var image = images[i];
                        //imagesArr = images; //images is a json array 
			if (image.images) { // Instagram API
				if (image.location) {
					if (this.options.filter) {
						if (image.tags && image.tags.indexOf(this.options.filter) !== -1) {
							this.addLayer(this._parseImage(image));
						} 
					} else {
						this.addLayer(this._parseImage(image));
					}
				}
			} else { // CartoDB
				this.addLayer(image);
			}                         
		}
		return this;
	},

	// Simplify image format from Instagram API
	_parseImage: function (image) {
		return {
			
                        latitude:       image.location.latitude,
			longitude:      image.location.longitude,
			image_thumb:    image.images.thumbnail.url,
			image_standard: image.images.standard_resolution.url,
			caption:        (image.caption) ? image.caption.text : '',
			type: 			image.type,			
			video_standard: (image.type === 'video') ? image.videos.standard_resolution.url : null,
			link: 			image.link,
			time:           function() { 
                            
                            var unix_timestamp = parseInt(image.caption.created_time);                            
                            var date = new Date(unix_timestamp*1000);

                            var day = date.getDate();
                            var month = date.getMonth()+1;
                            var year = date.getFullYear();
                            
                            if(day < 10) {
                                day = '0' + day;
                            }
                            
                            if(month < 10) {
                                month = '0' + month;
                            }
                            
                            return day + "-" + month + "-" + year;
                        }
                        
                        
		};
	},
        
               
	addLayer: function (image) {	
		var marker = L.marker([image.latitude, image.longitude], {
			icon: L.icon(L.extend({
				iconUrl: image.image_thumb		
			}, this.options.icon)),
			title: image.caption || ''
		});		
		marker.image = image;
		L.FeatureGroup.prototype.addLayer.call(this, marker);
	}
        
        
});

L.instagram = function (url, options) {
	return new L.Instagram(url, options);
};
/*
$(document).ready(function() {

    $("body").on("click", "#toggle-previous", function () {
        //var arrPosition;
        var imgSrc = $(this).closest(".leaflet-popup-content").find("a").attr("href"); // link of current img
        var img = $(this).closest(".leaflet-popup-content").find("img").attr("src"); // src of current img
        
        //this refers to object that is clicked, in this case is the arrow clicked
        //closest looks for the closest .leaflet-popup-content class element to the arrow (obtained via inspect element)
        //find looks within the /leaflet-popup-content to find <a href>, the img link in this case 
        
        for(var i=0;i<imagesArr.length;i++) {
            var srcLink = imagesArr[i]["link"];              
            if(srcLink == imgSrc) { // get the array position of current image 
               var j = parseInt(i)-1; // position of prev image in array                  
               var prevImgLink = imagesArr[i]["link"];  
               $("img").each(function(index) {                                    
                                
               });               
               break;
            }
        }
        
        // do arrPosition
        
        
                        //should retrieve images[i +1]
                    
			/*var image    = something.layer.image,
			    options  = this.options,
			    template = options.imageTemplate;

			if (image.type === 'video' && (!!document.createElement('video').canPlayType('video/mp4; codecs=avc1.42E01E,mp4a.40.2'))) {
				template = options.videoTemplate;
			}
                        
                        something.layer.bindPopup(L.Util.template(template, image), options.popup).openPopup();
                       */
        
    });
 
});