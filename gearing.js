/**
 * Created by asus1 on 2015/8/14.
 */
var SVGNS = 'http://www.w3.org/2000/svg';
var rotateState = 0;
var height = 1000, width = 1000;
var container = getContainer();
var gearRadius = 10;
var radiusSun = 80;
var radiusPlanet = 160;
var planetTrack = radiusSun+radiusPlanet;
var radiusAnnulus = radiusSun + radiusPlanet*2;
var annulus = drawAnnulus(radiusAnnulus,0,gearRadius);
var sun = drawSun(radiusSun,11,gearRadius);
var planet = [];
planet[0] = drawPlanet(radiusPlanet,30/180*Math.PI,5.5,planetTrack,gearRadius);
planet[1] = drawPlanet(radiusPlanet,150/180*Math.PI,5.5,planetTrack,gearRadius);
planet[2] = drawPlanet(radiusPlanet,270/180*Math.PI,5.5,planetTrack,gearRadius);
rotate();


function getContainer(){
    var body = document.getElementsByTagName("body");
    var svg = document.createElementNS(SVGNS,"svg");
    svg.setAttribute("height",height);
    svg.setAttribute("width",width);
    body[0].appendChild(svg);
    var container = document.createElementNS(SVGNS,"g");
    container.setAttribute("transform","translate("+width/2+","
        +height/2+")rotate(0)");
    container.setAttribute("id","total");
    svg.appendChild(container);
    return container;
}

function drawAnnulus(radius,rotate,gearRadius){
    radius = radius +3/2*gearRadius;
    var holder = document.createElementNS(SVGNS,"g");
    holder.setAttribute("id","Annulus");
    holder.setAttribute("transform","rotate("+rotate+")");
    holder.rotation = 0;
    container.appendChild(holder);
    var path = document.createElementNS(SVGNS,"path");
    var d = "M"+radius+","+0;
    d+="A"+radius+","+radius+" 0 1 0 "+0+","+radius;
    d+="A"+radius+","+radius+" 0 0 0 "+radius+","+0;
    d=drawGearing(d,radius-gearRadius*3/2,gearRadius,false);
    path.setAttribute("fill","rgb(128,128,128)");
    path.setAttribute("d",d);
    holder.appendChild(path);
    return holder;
}

function drawSun(radius,rotate,gearRadius){
    var holder = document.createElementNS(SVGNS,"g");
    holder.setAttribute("id","Sun");
    holder.setAttribute("transform","rotate("+rotate+")");
    holder.rotation = rotate;
    container.appendChild(holder);
    var path = document.createElementNS(SVGNS,"path");
    var d = "M"+radius/4+","+0;
    d+="A"+radius/4+","+radius/4+" 0 1 0 "+0+","+radius/4;
    d+="A"+radius/4+","+radius/4+" 0 0 0 "+radius/4+","+0;
    d=drawGearing(d,radius,gearRadius,true);
    path.setAttribute("fill","rgb(64,64,64)");
    path.setAttribute("d",d);
    holder.appendChild(path);
    return holder;
}

function drawPlanet(radius,angle,rotate,track,gearRadius){
    var holder = document.createElementNS(SVGNS,"g");
    var x = track*Math.cos(angle);
    var y = track*Math.sin(angle);
    holder.setAttribute("id","Planet");
    holder.setAttribute("transform","translate("+x+","
        +y+")"+"rotate("+rotate+")");
    holder.track = track;
    holder.angle = angle;
    holder.rotation = rotate;
    container.appendChild(holder);
    var path = document.createElementNS(SVGNS,"path");
    var d = "M"+radius/6+","+0;
    d+="A"+radius/6+","+radius/6+" 0 1 0 "+0+","+radius/6;
    d+="A"+radius/6+","+radius/6+" 0 0 0 "+radius/6+","+0;
    d=drawGearing(d,radius,gearRadius,true);
    path.setAttribute("fill","rgb(192,192,192)");
    path.setAttribute("d",d);
    holder.appendChild(path);
    return holder;
}

function drawGearing(d,radius,gearRadius,isOuter){
    var gearNum = radius*2/gearRadius;
    var gearAngle = Math.PI/gearNum;
    var rAngle = 0;
    if(isOuter==false){
        radius = radius + gearRadius/2;
    }else{
        radius = radius - gearRadius/2;
    }
    d+="M";
    var startX0 = Math.cos(rAngle);
    var startY0 = Math.sin(rAngle);
    d+=startX0*radius+","+startY0*radius;
    while(rAngle<2*Math.PI){
        rAngle+=gearAngle;
        var X1 = Math.cos(rAngle);
        var Y1 = Math.sin(rAngle);
        rAngle+=gearAngle;
        var X2 = Math.cos(rAngle);
        var Y2 = Math.sin(rAngle);
        d+="A"+radius+","+radius+" 0 0 1 "+X1*radius+","+Y1*radius;
        if(isOuter==false) {
            d += "L" + X1 * (radius -gearRadius) + "," + Y1 * (radius - gearRadius);
            d += "L" + X2 * (radius - gearRadius) + "," + Y2 * (radius - gearRadius);
            d += "L" + X2 * radius + "," + Y2 * radius;
        }
        else{
            d += "L" + X1 * (radius + gearRadius) + "," + Y1 * (radius + gearRadius);
            d += "L" + X2 * (radius + gearRadius) + "," + Y2 * (radius + gearRadius);
            d += "L" + X2 * radius + "," + Y2 * radius;
        }
    }
    d+="Z";
    return d;
}

function rotate(){
    var i;
    if(rotateState == 0 ){
        for(i=0;i<planet.length;i++){
            planet[i].rotation -= 0.15;
            planet[i].angle += 0.1/180*Math.PI;
            var x = planet[i].track * Math.cos(planet[i].angle);
            var y = planet[i].track * Math.sin(planet[i].angle);
            planet[i].setAttribute("transform","translate("+x+","
            +y+")"+"rotate("+planet[i].rotation+")");
        }
        sun.rotation += 0.6;
        sun.setAttribute("transform","rotate("+sun.rotation+")");
        setTimeout("rotate()",20);
    }else if(rotateState == 1){
        annulus.rotation -= 0.1;
        annulus.setAttribute("transform","rotate("+annulus.rotation+")");
        for(i=0;i<planet.length;i++){
            planet[i].rotation -= 0.25;
            x = planet[i].track * Math.cos(planet[i].angle);
            y = planet[i].track * Math.sin(planet[i].angle);
            planet[i].setAttribute("transform","translate("+x+","
            +y+")"+"rotate("+planet[i].rotation+")");
        }
        sun.rotation += 0.5;
        sun.setAttribute("transform","rotate("+sun.rotation+")");
        setTimeout("rotate()",20);
    }else{
        annulus.rotation += 0.24;
        annulus.setAttribute("transform","rotate("+annulus.rotation+")");
        for(i=0;i<planet.length;i++){
            planet[i].rotation += 0.3;
            planet[i].angle += 0.2/180*Math.PI;
            x = planet[i].track * Math.cos(planet[i].angle);
            y = planet[i].track * Math.sin(planet[i].angle);
            planet[i].setAttribute("transform","translate("+x+","
            +y+")"+"rotate("+planet[i].rotation+")");
        }
        setTimeout("rotate()",20);
    }
}

function changeSunState(){
    rotateState = 2;
}
function changePlanetState(){
    rotateState = 1;
}
function changeAnnulusState(){
    rotateState = 0;
}