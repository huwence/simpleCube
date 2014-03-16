/*
 *
 * SimpleCube JavaScript File
 * @author huwence (huwence@gmail.com)
 * @data 2013-01-02 15:14
 *
 * */

(function () {

        //the length of cube
    var L = 200,   
        //the half of Length
        HL = L / 2, 
        //There must define tHe eight points on cube, the three dimension to record the points
        POINTS = {
            A: [  HL,   HL,   HL], //A point
            B: [  HL, - HL,   HL], //B point
            C: [- HL, - HL,   HL], //C point
            D: [- HL,   HL,   HL], //D point
            E: [  HL,   HL, - HL], //E point
            F: [  HL, - HL, - HL], //F point
            G: [- HL, - HL, - HL], //G point
            H: [- HL,   HL, - HL]  //H point
        },
        //the camera position on z axis
        CZ = 800,  
        //the distance between camera and canvas
        PERSPECTIVE = 400,
        //the Height of canvas
        HEIGHT = 300,
        //the width of canvas
        WIDTH = 400,
        //context of canvas
        CONTEXT,
        //FPS
        FPS = 60,
        //INTERVAL
        INTERVAL = 1000 / FPS

    var RegPath = /^([A-H])([A-H])([A-H])([A-H])$/

    //request animation frame
    var _requestFrame = (function () {
        return  window.requestAnimationFrame       ||   
                window.webkitRequestAnimationFrame ||   
                window.mozRequestAnimationFrame    ||   
                window.oRequestAnimationFrame      ||   
                window.msRequestAnimationFrame     ||   
                function (callback){  
                    window.setTimeout(callback, 1000/60)  
                }
    })()

    function drawSurface (path, color) {
        var result = RegPath.exec(path) 

        if (!result)
            return

        var point1 = getProjectionPoint(result[1]),
            point2 = getProjectionPoint(result[2]),
            point3 = getProjectionPoint(result[3]),
            point4 = getProjectionPoint(result[4])

        CONTEXT.fillStyle = color || '#000'
		CONTEXT.strokeStyle = '#000';
        CONTEXT.beginPath()
        CONTEXT.moveTo(point1[0], point1[1])
        CONTEXT.lineTo(point2[0], point2[1])
        CONTEXT.lineTo(point3[0], point3[1])
        CONTEXT.lineTo(point4[0], point4[1])
        CONTEXT.lineTo(point1[0], point1[1])
        CONTEXT.fill()
        CONTEXT.stroke()
    }

    //return the projetion point in canvas
    function getProjectionPoint (point) {
        if (!POINTS[point])
            return false

        var x = POINTS[point][0],
            y = POINTS[point][1],
            z = POINTS[point][2]

        //projection point
        var pX = x * PERSPECTIVE / (Math.abs(CZ - z)) + WIDTH / 2,
            pY = y * PERSPECTIVE / (Math.abs(CZ - z)) + HEIGHT / 2

        return [pX, pY]
    }

    function rotate (point, angles) {
        if (!POINTS[point])
            return false

        if (!angles)
            angles = {x: 0, y: 0, z: 0}

        var x = POINTS[point][0],
            y = POINTS[point][1],
            z = POINTS[point][2]

        //rotate X axis
        if (angles.x) {
            var temp_y = y

            angles.x *= Math.PI / 180
            y = y * Math.cos(angles.x) + z * Math.sin(angles.x)
            z = z * Math.cos(angles.x) - temp_y * Math.sin(angles.x)
        }

        //rotate Y axis
        if (angles.y) {
            var temp_x = x

            angles.y *= Math.PI / 180
            x = x * Math.cos(angles.y) - z * Math.sin(angles.y)
            z = temp_x * Math.sin(angles.y) + z * Math.cos(angles.y)
        }

        //rotate Z axis
        if (angles.z) {
            var temp_x = x

            angles.z *= Math.PI / 180
            x = x * Math.cos(angles.z) - y * Math.sin(angles.z)
            y = temp_x * Math.sin(angles.z) + y * Math.cos(angles.z)
        }

        POINTS[point][0] = x
        POINTS[point][1] = y 
        POINTS[point][2] = z
    }

    //we need to draw every surface on cube
    function draw () {
        CONTEXT.clearRect(0, 0, WIDTH, HEIGHT)
        //draw AEFB
        drawSurface('AEFB', '#33ff33')
        //draw DHGC
        drawSurface('DHGC', '#ffff2a')
        //draw CGFB
        drawSurface('CGFB', '#99cc99')
        //draw DHEA
        drawSurface('DHEA', '#66cc66')
        //draw HEFG
        drawSurface('HEFG', '#2a2aff')
        //draw ABCD
        drawSurface('ABCD', '#ff2aaa')
    }

    function initialize(){
       var canvas = document.createElement('canvas'),
           start = +new Date()

       canvas.height = HEIGHT
       canvas.width = WIDTH
       CONTEXT = canvas.getContext('2d')
       document.body.appendChild(canvas)

       function autoRotate (){
           var now = +new Date(),
               delta = now - start

           if (delta >= INTERVAL) {
               for (var p in POINTS) {
                   rotate(p, {x: 1.4, y: 2, z: 1.2})
               }

               draw()
           }

           _requestFrame(autoRotate)
       }

       autoRotate()
    }

    initialize()

})()
