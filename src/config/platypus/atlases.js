var createKey = function (path) {
        return path.replace(projectSrc, '').replace('.atlas', '');
    },
    file = grunt.file,
    atlases = {},
    projectSrc = 'assets/spine/',
    imageDest = 'assets/images/',
    data = file.expand({}, projectSrc + "*.atlas"),
    i = data.length;
    
// Create sprite sheet list and list packed textures where applicable
while (i--) {
    atlases[createKey(data[i])] = imageDest + file.read(data[i]);
}

return atlases;
