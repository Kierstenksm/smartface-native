const File = require('nf-core/io/file');

Path = {};

Object.defineProperties(Path, {
    'ImagesUriScheme': {
        get: function(){
            return 'images://';
        },
    },
    'AssetsUriScheme': {
        get: function(){
            return 'assets://';
        },
    },
    'Separator': {
        get: function(){
            return '/';
        },
    },
    'DataDirectory': {
        get: function(){
            return File.getDocumentsDirectory();
        },
    }
});

module.exports = Path;