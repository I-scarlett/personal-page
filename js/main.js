var TxtType = function(el, toRotate, period) {
        this.toRotate = toRotate;
        this.el = el;
        this.loopNum = 0;
        this.period = parseInt(period, 10) || 2000;
        this.txt = '';
        this.tick();
        this.isDeleting = false;
    };

    TxtType.prototype.tick = function() {
        var i = this.loopNum % this.toRotate.length;
        var fullTxt = this.toRotate[i];

        if (this.isDeleting) {
        this.txt = fullTxt.substring(0, this.txt.length - 1);
        } else {
        this.txt = fullTxt.substring(0, this.txt.length + 1);
        }

        this.el.innerHTML = '<span class="wrap">'+this.txt+'</span>';

        var that = this;
        var delta = 100 - Math.random() * 50;

        if (this.isDeleting) { delta /= 2; }

        if (!this.isDeleting && this.txt === fullTxt) {
        delta = this.period;
        this.isDeleting = true;
        } else if (this.isDeleting && this.txt === '') {
        this.isDeleting = false;
        this.loopNum++;
        delta = 500;
        }

        if(this.loopNum == this.toRotate.length-1 && this.isDeleting){

          this.el.innerHTML = '<span class="wrap" style = "color:white; text-decoration: underline ">'+this.txt+'</span>';
          $('wrap').addClass('hover');
          return;

        }
        setTimeout(function() {
        that.tick();
        }, delta);
    };



// load globe
var earth;
function initialize() {
  earth = new WE.map('earth_div');
  earth.setView([37.773972, -122.431297], 5); // san francisico

  WE.tileLayer('http://tile.stamen.com/toner-lite/{z}/{x}/{y}.png',{
          attribution: ''
        }).addTo(earth);



// add markers
  var wuhan = WE.marker([30.59, 114.30],).addTo(earth);
  wuhan.bindPopup("<b>Wuhan,China</b>\
  <br>Where I was born, lived and enjoyed for 22 years<br/>"
  , {maxWidth: 150, closeButton: true});

  var madison = WE.marker([43.07, -89.40]).addTo(earth);
  madison.bindPopup("<b>Madison,WI</b>\
  <br>I studied urban planning and GIS in University of Wisconsin-Madison<br/>"
  , {maxWidth: 150, closeButton: true});


  var sunny = WE.marker([37.36, -122.04]).addTo(earth);
  sunny.bindPopup("<b>Sunnyvale,CA</b>\
  <br>Where I live since 2016<br/>"
  , {maxWidth: 150, closeButton: true});


  var ranlat = Math.random()*180-90;
  ranlat = Math.round(ranlat * 100) / 100;
  var ranlong = Math.random()*360 - 180;
  ranlong = Math.round(ranlong * 100) / 100;


  var hostURL = "https://nominatim.openstreetmap.org/reverse.php";
  var parameters = {
    "format" : "json",
    "lat" : ranlat,
    "lon" : ranlong,
  };

  var random = WE.marker([ranlat, ranlong]).addTo(earth);

  var URL = hostURL + "?" + $.param(parameters, true);
  $.ajax({
    "method": "POST",
    "url" : URL
  }).done(function(data) {

    if ( data === null || data["error"] != null ) {
      random.bindPopup("<b>I'm feeling lucky today!</b>\
      <br>This is a random place on the earth<br/>"
      , {maxWidth: 150, closeButton: true});
      return;
    }
    var address = data["display_name"];
    if (address !== null) {
      random.bindPopup("<b>This is a random place on the earth!</b>\
      <br>You are at " + address + "</br>",
      {maxWidth: 150, closeButton: true});
      return;
    }
  });

  // Start a simple rotation animation
  var before = null;
  requestAnimationFrame(function animate(now) {
    var c = earth.getPosition();
    var elapsed = before? now - before: 0;
    before = now;
    earth.setCenter([c[0], c[1] + 0.03*(elapsed/30)]);
    requestAnimationFrame(animate);
    });
}




window.onload = function() {
  initialize();
  var elements = document.getElementsByClassName('typewrite');
  for (var i=0; i<elements.length; i++) {
      var toRotate = elements[i].getAttribute('data-type');
      var period = elements[i].getAttribute('data-period');
      if (toRotate) {
        new TxtType(elements[i], JSON.parse(toRotate), period);
      }
  }

    // INJECT CSS
var css = document.createElement("style");
css.type = "test/css";
css.innerHTML = ".typewrite > .wrap { border-right: 0.08em; solid #000000;}";
document.body.appendChild(css);









};
