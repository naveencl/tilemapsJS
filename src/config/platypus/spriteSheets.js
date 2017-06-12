var createKey = function (path) {
        return path.replace(projectSrc, '').replace('.json', '').replace('.png', '');
    },
    createFramesArray = function (frame, base) {
        var i = 0,
            fw = frame.width,
            fh = frame.height,
            rx = frame.regX || 0,
            ry = frame.regY || 0,
            w = 0,
            h = 0,
            x = 0,
            y = 0,
            frames = [];

        // Subtract the size of a frame so that margin slivers aren't returned as frames.
        w = base.sourceSize.w - fw;
        h = base.sourceSize.h - fh;

        for (y = 0; y <= h; y += fh) {
            for (x = 0; x <= w; x += fw) {
                frames.push([x, y, fw, fh, i, rx, ry]);
            }
        }

        return frames;
    },
    createDefault = function (frame, img) {
        return {
            images: [img],
            frames: [[frame.frame.x, frame.frame.y, frame.frame.w, frame.frame.h, 0, Math.floor(frame.frame.w / 2), Math.floor(frame.frame.h / 2)]],
            animations: {
                "default": 0
            }
        };
    },
    updateImageIndex = function (frames, fromIndex, toIndex) {
        var i = frames.length;
        
        while (i--) {
            if (frames[i][4] === fromIndex) {
                frames[i][4] = toIndex;
            } else if (frames[i][4] > fromIndex) {
                frames[i][4] -= 1;
            }
        }
    },
    reposition = function (ss, img, s, key) {
        var arr = ss.images,
            def = null,
            f = null,
            str = '',
            i = ss.images.length,
            imageIndex = 0;

        while (i--) {
            str = createKey(ss.images[i]);
            if (str === key) {
                imageIndex = i;
                break;
            }
        }

        if (!Array.isArray(ss.frames)) {
            ss.frames = createFramesArray(ss.frames, s);
        }

        for (i = 0; i < ss.frames.length; i++) {
            f = ss.frames[i];
            if (f[4] === imageIndex) {
                if (s.trimmed) {
                    if (f[0] < s.spriteSourceSize.x) {
                        f[2] -= s.spriteSourceSize.x - f[0];
                        f[5] -= s.spriteSourceSize.x - f[0];
                        f[0] = 0;
                    } else {
                        f[0] -= s.spriteSourceSize.x;
                    }

                    if (f[0] + f[2] > s.spriteSourceSize.w) {
                        f[2] = s.spriteSourceSize.w - f[0];
                    }

                    if (f[1] < s.spriteSourceSize.y) {
                        f[3] -= s.spriteSourceSize.y - f[1];
                        f[6] -= s.spriteSourceSize.y - f[1];
                        f[1] = 0;
                    } else {
                        f[1] -= s.spriteSourceSize.y;
                    }

                    if (f[1] + f[3] > s.spriteSourceSize.h) {
                        f[3] = s.spriteSourceSize.h - f[1];
                    }
                }
                f[0] += s.frame.x;
                f[1] += s.frame.y;
            }
        }
        
        str = projectSrc + img;
        ss.images[imageIndex] = str;

        // merge images if they're the same.
        i = 0;
        while (i !== ss.images.length) {
            if ((i !== imageIndex) && (ss.images[i] === str)) {
                if (imageIndex > i) { // We choose to merge into the lowest index so we're moving less.
                    imageIndex = i;
                    i += 1;
                } else {
                    updateImageIndex(ss.frames, i, imageIndex);
                    ss.images.splice(i, 1);
                }
            } else {
                i += 1;
            }
        }
        
        return ss;
    },
    updatePack = function (pack, spriteSheets, imageMap) {
        var i = 0,
            frame = null,
            frames = pack.frames,
            key = '';
        
        grunt.log.writeln('Handling "' + pack.meta.image + '" packed image.');

        // Handle one-to-one unlisted or nonexistent sprite sheets
        for (frame in frames) {
            if (frames.hasOwnProperty(frame)) {
                key = createKey(frame);
                
                if (imageMap[key]) {
                    grunt.log.writeln('  Updating ' + key);
                    i = imageMap[key].length;
                    while (i--) {
                        reposition(imageMap[key][i], pack.meta.image, frames[frame], key);
                    }
                } else {
                    grunt.log.warn(key + ": Did not have associated spritesheet, created default.");
                    spriteSheets[key] = createDefault(frames[frame], pack.meta.image);
                }
            }
        }
    },
    j = 0,
    key = '',
    file = grunt.file,
    sSs = {},
    str = '',
    projectSrc = 'assets/images/',
    data = file.expand({}, projectSrc + "*.json"),
    i = data.length,
    imageToSSMap = {},
    json = null,
    packs = [];
    
// Create sprite sheet list and list packed textures where applicable
while (i--) {
    key = createKey(data[i]);
    json = file.readJSON(data[i]);
    if (json.meta) { // This is a TexturePacker file
        packs.push(json);
    } else {
        sSs[key] = json;
        if (json.images) {
            j = json.images.length;
            while (j--) {
                str = json.images[j];
                if (/^[^\/]*$/.test(str)) {
                    str = projectSrc + str;
                    if (str.indexOf('.') < 0) {
                        str += '.png';
                    }
                    json.images[j] = str;
                }
                key = createKey(str);
                if (imageToSSMap[key]) {
                    imageToSSMap[key].push(json);
                } else {
                    imageToSSMap[key] = [json];
                }
            }
        }
    }
}

// Now implement packed versions where applicable.
i = packs.length;
while (i--) {
    updatePack(packs[i], sSs, imageToSSMap);
}

return sSs;
