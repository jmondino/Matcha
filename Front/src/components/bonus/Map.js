import React, { Component } from 'react';

class SimpleHereMap extends React.Component {
    componentDidMount() {
      var platform = new window.H.service.Platform({
          app_id: 'BEEOWKD421LN2R7mm453',
          app_code: 'X6qdeUrwMJp5oE5kSKybrPLBvhPvHWdIvyW_QwNgB1A',
          })
  
      var layers = platform.createDefaultLayers();
      var map = new window.H.Map(
          document.getElementById('map'),
          layers.normal.map,
          {
              center: {lat: 42.345978, lng: -83.0405},
              zoom: 12,
          });
  
      var events = new window.H.mapevents.MapEvents(map);
      var behavior = new window.H.mapevents.Behavior(events);
      var ui = window.H.ui.UI.createDefault(map, layers);
    }
  
    render() {
        return (
            <div id="map" className=""></div>
        );
    }
}

export default SimpleHereMap;