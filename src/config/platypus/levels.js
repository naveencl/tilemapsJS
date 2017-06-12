var createKey = function (path) {
        return path.replace(projectSrc, '').replace('.json', '');
    },
    updatePath = function (obj) {
        if (obj && (typeof obj.image === 'string')) {
            obj.image = obj.image.replace(srcLoc, destLoc);
        }
    },
    file = grunt.file,
    level = null,
    levels = {},
    cycle = null,
    projectSrc = 'assets/levels/',
    srcLoc = '../images/',
    destLoc = 'assets/images/',
    data = file.expand({}, projectSrc + "*.json"),
    i = data.length,
    j = 0;
    
// Create sprite sheet list and list packed textures where applicable
while (i--) {
    level = file.readJSON(data[i]);
    updatePath(level);
    cycle = level.layers;
    if (cycle) {
        j = cycle.length;
        while (j--) {
            updatePath(cycle[j]);
        }
    }
    cycle = level.tilesets;
    if (cycle) {
        j = cycle.length;
        while (j--) {
            updatePath(cycle[j]);
        }
    }
    levels[createKey(data[i])] = level;
}

return levels;
