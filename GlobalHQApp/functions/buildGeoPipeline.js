exports = function(long, lat){
  return [
          {
            '$search': {
              'index': 'store_location', 
              'geoWithin': {
                'circle': {
                  'center': {
                    'type': 'Point', 
                    'coordinates': [
                      long, lat
                    ]
                  }, 
                  'radius': 1000000
                }, 
                'path': 'location'
              }
            }
          }
        ];
};