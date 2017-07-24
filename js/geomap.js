var map,name,address,point,type,markers,xml,icon,marker;
var mark;
var infoWindow;
var marker_array = [];
var type_array1 = [];
var type_array2 = [];
var type_array3 = [];
var centerControlDiv,centerControl;
var image = '';
var iwOuter, iwBackground;

var delhi = {lat: 28.6139, lng: 77.2090};
var patna = {lat: 25.5941, lng: 85.1376};
var bang = {lat: 12.9716, lng: 77.5946};
var pun = {lat: 18.5204, lng: 73.8567};

function CenterControl(controlDiv, map) {
$(document).ready(function(){
  $("select").click(function(){
    var abc = $(this).val();
    switch (abc) {
      case 'delhi': map.setCenter(delhi);
      break;
      case 'patna': map.setCenter(patna);
      break;
      case 'pune': map.setCenter(pun);
      break;
      case 'banglore': map.setCenter(bang);
      break;
      default: alert('wrong input');
    }
  });
});
}

function popCloseButton(){
centerControlDiv = document.createElement('div');
centerControl = new CenterControl(centerControlDiv, map);

  centerControlDiv.index = 1;
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(centerControlDiv);

infoWindow = new google.maps.InfoWindow;

google.maps.event.addListener(infoWindow, 'domready', function() {


  });
}

function showVisibleMarkers(marking, typing){
google.maps.event.addListener(map, 'idle', function() {
  var bounds = map.getBounds();
  for(var i = 0; i<=marking.length; i++){
    var infoPanel = $('.info-'+(i+1));
    var stat = infoPanel.attr("stat");
    var proid = infoPanel.attr("infoid");
    mark = marking[i];
    
      if(stat != undefined){
        if((bounds.contains(mark.getPosition())===true)&&(stat == typing[i])) {
      infoPanel.show();
    }else {
      infoPanel.hide();
    }
      }
    
  }
});
}

function mapDef(){
map = new google.maps.Map(document.getElementById('map'), {
  zoom: 11,
  center: delhi,
  fullscreenControl: true,
  fullscreenControl:{
    position: google.maps.ControlPosition.TOP_CENTER
  },
  zoomControl: true,
  zoomControlOptions: {
    position: google.maps.ControlPosition.RIGHT_TOP
  }
});
}

function mapInitiation(){
  mapDef();

  var marker2 = new google.maps.Marker({
       position: delhi,
    });
    marker2.setMap(map);

popCloseButton();

downloadUrl('public/sample.xml', function(data) {
  xml = data.responseXML;
  markers = xml.documentElement.getElementsByTagName('marker');
  Array.prototype.forEach.call(markers, function(markerElem) {
  name = markerElem.getAttribute('name');
  address = markerElem.getAttribute('address');
  society = markerElem.getAttribute('society');
  type = markerElem.getAttribute('type');
  path = markerElem.getAttribute('path');
  proid = markerElem.getAttribute('proid');
  point = new google.maps.LatLng(
        parseFloat(markerElem.getAttribute('lat')),
        parseFloat(markerElem.getAttribute('lng')));
  mobile = markerElem.getAttribute('mobile');


     var infowincontent ='<div layout="column" class="infocover"><div class="coverimg">'+
         '<img  src="https://storage.googleapis.com/cafeindica/thisisnotarandomstringinfactnoneis/'+path+'" style="" />' +
       '</div> <div layout="column" class="cover-text"> <p class="md-headline cover-font">'+name+ '</p>'+
         '<span class="md-subhead cover-society">' +society+'</span></div></div>' ;

    type_array1.push(type);

    

    switch (type) {
      case 'complete': image = 'images/map/com.png';
      break;
      case 'Execution': image = 'images/map/incom.png';
      break;
      case 'Design': image = 'images/map/incom.png';
      break;
      case 'Negotiation': image = 'images/map/incom.png';
      break;
      case 'Finished': image = 'images/map/com.png';
      break;
      case 'Closed': image = 'images/map/com.png';

        break;
      default: image = '';
    }

     var marker;

     var icon = {
       url: image,
       scaledSize: new google.maps.Size(48, 48),
     };

    for (var i = 0; i < markers.length; i++) {
    marker = new google.maps.Marker({
      map: map,
      position: point,
      icon: icon
    });
  }

  marker_array.push(marker);

    marker.addListener('click', function() {
      infoWindow.setContent(infowincontent);
      infoWindow.open(map, marker);
    });
  });
});
  showVisibleMarkers(marker_array,type_array1);
}

function comSite(){
  mapDef();

 popCloseButton();

downloadUrl('public/sample.xml', function(data) {
  xml = data.responseXML;
  markers = xml.documentElement.getElementsByTagName('marker');
  Array.prototype.forEach.call(markers, function(markerElem) {
  name = markerElem.getAttribute('name');
  address = markerElem.getAttribute('address');
  society = markerElem.getAttribute('society');
  type = markerElem.getAttribute('type');
  path = markerElem.getAttribute('path');
  point = new google.maps.LatLng(
        parseFloat(markerElem.getAttribute('lat')),
        parseFloat(markerElem.getAttribute('lng')));

        var infowincontent ='<div layout="column" class="infocover"><div class="coverimg">'+
            '<img  src="https://storage.googleapis.com/cafeindica/thisisnotarandomstringinfactnoneis/'+path+'" style="" />' +
          '</div> <div layout="column" class="cover-text"> <p class="md-headline cover-font">'+name+ '</p>'+
            '<span class="md-subhead cover-society">' +society+'</span></div></div>' ;

     image = 'images/map/com.png';

      var pt;
      if((type=='Finished')||(type=='Closed')){
        pt = point;
        type_array2.push(type);
      }else {
        type_array2.push('null');
      }

      var icon = {
        url: image,
        scaledSize: new google.maps.Size(48, 48),
      };

    var marker = new google.maps.Marker({
      map: map,
      position: pt,
      icon: icon
    });

    marker_array.push(marker);

    marker.addListener('click', function() {
      infoWindow.setContent(infowincontent);
      infoWindow.open(map, marker);
     });
  });
});
showVisibleMarkers(marker_array,type_array2);
}

function incomSite(){
  mapDef();

 popCloseButton();

downloadUrl('public/sample.xml', function(data) {
  xml = data.responseXML;
  markers = xml.documentElement.getElementsByTagName('marker');
  Array.prototype.forEach.call(markers, function(markerElem) {
  name = markerElem.getAttribute('name');
  address = markerElem.getAttribute('address');
  society = markerElem.getAttribute('society');
  type = markerElem.getAttribute('type');
  path = markerElem.getAttribute('path');
  point = new google.maps.LatLng(
        parseFloat(markerElem.getAttribute('lat')),
        parseFloat(markerElem.getAttribute('lng')));

        var infowincontent ='<div layout="column" class="infocover"><div   class="coverimg">'+
            '<img  src="https://storage.googleapis.com/cafeindica/thisisnotarandomstringinfactnoneis/'+path+'" style="" />' +
          '</div> <div layout="column" class="cover-text"> <p class="md-headline cover-font">'+name+ '</p>'+
            '<span class="md-subhead cover-society">' +society+'</span></div></div>' ;

            image = 'images/map/incom.png';

            var pt;
            if((type=='Design')||(type=='Execution')||(type=='Negotiation')){
              pt = point;
              type_array3.push(type);
            }else {
              type_array3.push('null');
            }


      var icon = {
        url: image,
        scaledSize: new google.maps.Size(48, 48),
      };

    var marker = new google.maps.Marker({
      map: map,
      position: pt,
      icon: icon
    });

    marker_array.push(marker);

    marker.addListener('click', function() {
      infoWindow.setContent(infowincontent);
      infoWindow.open(map, marker);
     });
  });
});
showVisibleMarkers(marker_array,type_array3);
}

function downloadUrl(url, callback) {
var request = window.ActiveXObject ?
   new ActiveXObject('Microsoft.XMLHTTP') :
   new XMLHttpRequest;

request.onreadystatechange = function() {
 if (request.readyState == 4) {
   request.onreadystatechange = doNothing;
   callback(request, request.status);
 }
};

request.open('GET', url, true);
request.send(null);
}

function doNothing() {}
