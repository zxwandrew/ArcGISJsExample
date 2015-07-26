if (Meteor.isClient) {
  var routePath = "https://js.arcgis.com/4.0beta1",
    routeLoaded = false,
    loadHandler = function() {
      routeLoaded = true;
    };

  Router.route('/', {
    verbose: true,
    name: 'home',
    template: 'ArcGIS',
    controller: PreloadController,
    preload: {
      timeOut: 5000,
      styles: ['https://js.arcgis.com/4.0beta1/esri/css/esri.css', 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css'],
      sync: routePath,
      onBeforeSync: function(fileName) {
        if (fileName === routePath) {
          var script = document.createElement('script');
          script.rel = 'preload javascript';
          script.type = 'text/javascript';
          script.src = routePath;
          script.onload = loadHandler;
          document.body.appendChild(script);
          return false;
        }
      },
      onSync: function(fileName) {
        if (routeLoaded && fileName === routePath) {
          return !!require && !!define;
        }
      },
      onAfterSync: function(fileName) {
        return false;
      }
    }
  });

  Template.ArcGIS.rendered = function() {
    var map, view;

    if (routeLoaded) {
      require([
        "esri/Map",
        "esri/views/SceneView",
        "dojo/domReady!"
      ], function(Map, SceneView) {
        map = new Map({
          basemap: "streets"
        });

        view = new SceneView({
          container: "viewDiv",
          map: map,
          scale: 240000000
        })

      })
    }
  };
}

if (Meteor.isServer) {
  Meteor.startup(function() {});
}
