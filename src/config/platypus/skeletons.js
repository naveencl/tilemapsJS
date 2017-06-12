var createKey = function (path) {
        return path.replace(projectSrc, '').replace('.json', '');
    },
    file = grunt.file,
    spines = {},
    projectSrc = 'assets/spine/',
    data = file.expand({}, projectSrc + "*.json"),
    i = data.length;
    
// Create sprite sheet list and list packed textures where applicable
while (i--) {
    spines[createKey(data[i])] = file.readJSON(data[i]);
}

return spines;
