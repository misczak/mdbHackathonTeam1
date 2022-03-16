exports = function(query, path){
  return [
        {
          '$search': {
            'index': 'menu_item', 
            'autocomplete': {
              'query': query, 
              'path': path, 
              'tokenOrder': 'any', 
              'fuzzy': {
                'maxEdits': 2, 
                'prefixLength': 0
              }
            }, 
            'highlight': {
              'path': 'menuItemName'
            }
          }
        }, {
          '$project': {
            'document': '$$ROOT', 
            'highlights': {
              '$meta': 'searchHighlights'
            }, 
            'score': {
              '$meta': 'searchScore'
            }
          }
        }, {
          '$limit': 15
        }, {
          '$sort': {
            'score': -1
          }
        }
      ];
};