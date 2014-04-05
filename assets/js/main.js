(function(jQuery, window, document, undefined) {
    $(function() {
        var $map = $('#map');

        var styles = [{
            'stylers': [
                { 'saturation': -100 },
                { 'visibility': 'simplified' },
                { 'invert_lightness': true },
                { 'lightness': 16 },
                { 'weight': 0.9 }
            ]
        }];

        var styledMap = new google.maps.StyledMapType(styles, {name: 'GDG Campania Map'});

        var mapOptions = {
            zoom: 14,
            center: new google.maps.LatLng(40.912610, 14.785914),
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            disableDefaultUI: true,
            scrollwheel: false,
            navigationControl: false,
            mapTypeControl: false,
            scaleControl: false,
            draggable: false
        };

        map = new google.maps.Map($map.get(0), mapOptions);
        map.mapTypes.set('map_style', styledMap);
        map.setMapTypeId('map_style');
    });
})(jQuery, window, document);
