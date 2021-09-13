"use strict";
var theme = {
    notches: 3,
    events: true,
    minutes: true,
    glow: true,
    glow_a: '#e838ff',
    glow_b: 'rgba(255, 38, 56, 0.6)',
    glow_c: 'rgba(179, 38, 255, 1)',
};
var image_loaded = false;
var window_loaded = false;
window.onload = function () {
    window_loaded = true;
    if (image_loaded)
        init();
};
var glow_image = document.createElement('img');
glow_image.src = 'res/glow.png';
glow_image.onload = function () {
    image_loaded = true;
    if (window_loaded)
        init();
};
var glow_canvas = document.createElement('canvas');
glow_canvas.width = 128;
glow_canvas.height = 128;
var glow_ctx = glow_canvas.getContext('2d');
function init() {
    var canvas = document.querySelector('canvas');
    var ctx = canvas.getContext('2d');
    canvas.width = document.body.clientWidth;
    canvas.height = canvas.width;
    var clockRadius = document.body.clientWidth / 2;
    var rot = 0;
    var ambient = false;
    var EVENT_WIDTH = 22;
    var EVENT_BUFFER = theme.notches === 0 ? 2 : 14;
    var TITLE_BUFFER = 2;
    var TITLE_SIZE = 16;
    var NOTCH_BUFFER = 2;
    var DATE_SIZE = 20;
    var COLOR_LIGHT_DIM = 'rgba(65, 199, 232, 0.15)';
    var COLOR_LIGHT_OVERLAY = 'rgba(65, 199, 232, 0.33)';
    var COLOR_MINUTE_HAND = 'rgba(65, 199, 232, 0.8)';
    var degToRad = function (deg) { return deg * (Math.PI / 180); };
    var createDate = function (hour, minute) {
        var date = new Date();
        date.setHours(hour, minute, 0);
        return date;
    };
    var events = [
        { start: createDate(9, 30), end: createDate(11, 20), color: '#33B679', title: 'PAAS' },
        { start: createDate(12, 30), end: createDate(1, 20), color: '#33B679', title: 'STAT' },
        { start: createDate(1, 30), end: createDate(2, 20), color: '#33B679', title: 'MATH' }
    ];
    function getTime() {
        try {
            return tizen.time.getCurrentDateTime();
        }
        catch (e) {
            return new Date();
        }
    }
    function drawCircle(angle, distance, width, color) {
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(angle);
        ctx.beginPath();
        ctx.arc(distance, 0, width / 2, 0, 2 * Math.PI, false);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.closePath();
        ctx.restore();
    }
    function drawRoundedRect(startDistance, endDistance, angle, width, fill, stroke, strokeWidth) {
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(angle);
        ctx.beginPath();
        ctx.moveTo(-width / 2, startDistance);
        ctx.lineTo(-width / 2, endDistance);
        ctx.quadraticCurveTo(-width / 2, endDistance + width / 1.5, 0, endDistance + width / 1.5);
        ctx.quadraticCurveTo(width / 2, endDistance + width / 1.5, width / 2, endDistance);
        ctx.lineTo(width / 2, startDistance);
        ctx.quadraticCurveTo(width / 2, startDistance - width / 1.5, 0, startDistance - width / 1.5);
        ctx.quadraticCurveTo(-width / 2, startDistance - width / 1.5, -width / 2, startDistance);
        ctx.closePath();
        if (fill) {
            ctx.fillStyle = fill;
            ctx.fill();
        }
        if (stroke && strokeWidth) {
            ctx.strokeStyle = stroke;
            ctx.lineWidth = strokeWidth;
            ctx.stroke();
        }
        ctx.restore();
    }
    function drawEvent(event) {
        var startAngle = degToRad(((event.start.getHours() % 12) +
            event.start.getMinutes() / 60) / 12 * 360 + EVENT_WIDTH / 6 - 90);
        var endAngle = degToRad(((event.end.getHours() % 12) +
            event.end.getMinutes() / 60) / 12 * 360 - EVENT_WIDTH / 8 - 90);
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.beginPath();
        ctx.fillStyle = COLOR_LIGHT_DIM;
        ctx.arc(0, 0, clockRadius - EVENT_BUFFER, startAngle, endAngle, false);
        var controlPosX = Math.cos(endAngle + degToRad(4.25)) * (clockRadius - EVENT_BUFFER);
        var controlPosY = Math.sin(endAngle + degToRad(4.25)) * (clockRadius - EVENT_BUFFER);
        var endPosX = Math.cos(endAngle + degToRad(4.25)) * (clockRadius - EVENT_BUFFER - EVENT_WIDTH / 2);
        var endPosY = Math.sin(endAngle + degToRad(4.25)) * (clockRadius - EVENT_BUFFER - EVENT_WIDTH / 2);
        ctx.quadraticCurveTo(controlPosX, controlPosY, endPosX, endPosY);
        controlPosX = Math.cos(endAngle + degToRad(4.25)) * (clockRadius - EVENT_BUFFER - EVENT_WIDTH);
        controlPosY = Math.sin(endAngle + degToRad(4.25)) * (clockRadius - EVENT_BUFFER - EVENT_WIDTH);
        endPosX = Math.cos(endAngle) * (clockRadius - EVENT_BUFFER - EVENT_WIDTH);
        endPosY = Math.sin(endAngle) * (clockRadius - EVENT_BUFFER - EVENT_WIDTH);
        ctx.quadraticCurveTo(controlPosX, controlPosY, endPosX, endPosY);
        ctx.arc(0, 0, clockRadius - EVENT_BUFFER - EVENT_WIDTH, endAngle, startAngle, true);
        controlPosX = Math.cos(startAngle - degToRad(4.25)) * (clockRadius - EVENT_BUFFER - EVENT_WIDTH);
        controlPosY = Math.sin(startAngle - degToRad(4.25)) * (clockRadius - EVENT_BUFFER - EVENT_WIDTH);
        endPosX = Math.cos(startAngle - degToRad(4.25)) * (clockRadius - EVENT_BUFFER - EVENT_WIDTH / 2);
        endPosY = Math.sin(startAngle - degToRad(4.25)) * (clockRadius - EVENT_BUFFER - EVENT_WIDTH / 2);
        ctx.quadraticCurveTo(controlPosX, controlPosY, endPosX, endPosY);
        controlPosX = Math.cos(startAngle - degToRad(4.25)) * (clockRadius - EVENT_BUFFER);
        controlPosY = Math.sin(startAngle - degToRad(4.25)) * (clockRadius - EVENT_BUFFER);
        endPosX = Math.cos(startAngle) * (clockRadius - EVENT_BUFFER);
        endPosY = Math.sin(startAngle) * (clockRadius - EVENT_BUFFER);
        ctx.quadraticCurveTo(controlPosX, controlPosY, endPosX, endPosY);
        ctx.fill();
        ctx.closePath();
        ctx.restore();
        drawCircle(startAngle, clockRadius - EVENT_BUFFER - EVENT_WIDTH / 2, EVENT_WIDTH - 8, event.color);
        ctx.font = "900 " + TITLE_SIZE + "px Arial sans-serif";
        ctx.fillStyle = '#fff';
        ctx.textBaseline = 'top';
        ctx.textAlign = 'center';
        var currentAngle = startAngle + degToRad(96);
        for (var i = 0; i < event.title.length; i++) {
            ctx.save();
            ctx.translate(canvas.width / 2, canvas.height / 2);
            ctx.rotate(currentAngle);
            ctx.fillText(event.title[i], 0, -(clockRadius - EVENT_BUFFER - TITLE_BUFFER));
            ctx.restore();
            if (i < event.title.length - 1)
                currentAngle += ctx.measureText(event.title[i]).width * 0.0065 / 2
                    + ctx.measureText(event.title[i + 1]).width * 0.0065 / 2;
        }
    }
    function drawGlow(offsetX, offsetY, scaleMult, color) {
        glow_ctx.fillStyle = color;
        glow_ctx.globalCompositeOperation = 'source-over';
        glow_ctx.fillRect(0, 0, glow_canvas.width, glow_canvas.height);
        glow_ctx.globalCompositeOperation = 'destination-in';
        glow_ctx.drawImage(glow_image, 0, 0);
        var scale = 240 * scaleMult;
        ctx.drawImage(glow_canvas, canvas.width / 2 + offsetX - scale / 2, canvas.height / 2 + offsetY - scale / 2, scale, scale);
    }
    function drawWatchFace() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        var time = getTime();
        ctx.font = "900 " + DATE_SIZE + "px Arial sans-serif";
        ctx.fillStyle = '#aaa';
        ctx.textBaseline = 'bottom';
        ctx.textAlign = 'center';
        ctx.fillText(['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'][time.getDay()] + " " + time.getDate(), clockRadius, clockRadius + clockRadius / 1.75);
        ctx.fillStyle = '#666';
        ctx.fillRect(clockRadius - 1 * DATE_SIZE, clockRadius + clockRadius / 1.75 + 2, 2 * DATE_SIZE, 2);
        if (!ambient) {
            rot = (rot + 1) % 360;
            var scaleA = 1 + (Math.sin(degToRad(rot + 180)) / 6);
            var scaleB = 1 + (Math.cos(degToRad(rot)) / 6);
            var scaleC = 1.3 + (Math.cos(degToRad(rot - 90)) / 6);
            var offsetX = Math.cos(degToRad(rot + 90)) * 50 + (1 - scaleA);
            var offsetY = Math.sin(degToRad(rot + 90)) * 50 + (1 - scaleB);
            if (theme.glow) {
                ctx.globalCompositeOperation = 'lighter';
                drawGlow(-offsetX, -offsetY, scaleA, theme.glow_b);
                drawGlow(0, 0, scaleC, theme.glow_a);
                drawGlow(offsetX, offsetY, scaleB, theme.glow_c);
                ctx.globalCompositeOperation = 'source-over';
            }
            if (theme.notches) {
                for (var i = 0; i < 12 * 5; i++) {
                    if (i % 15 === 0)
                        drawCircle(degToRad(i / (12 * 5) * 360 - 90), clockRadius - NOTCH_BUFFER - 4, 8, COLOR_MINUTE_HAND);
                    else if (i % 5 === 0 && theme.notches >= 2)
                        drawCircle(degToRad(i / (12 * 5) * 360 - 90), clockRadius - NOTCH_BUFFER - 4, 6, COLOR_LIGHT_OVERLAY);
                    else if (theme.notches >= 3)
                        drawCircle(degToRad(i / (12 * 5) * 360 - 90), clockRadius - NOTCH_BUFFER - 4, 4, COLOR_LIGHT_DIM);
                }
            }
        }
        if (theme.events) {
            for (var _i = 0, events_1 = events; _i < events_1.length; _i++) {
                var event_1 = events_1[_i];
                drawEvent(event_1);
            }
        }
        drawCircle(0, 0, 36, COLOR_LIGHT_OVERLAY);
        drawCircle(0, 0, 20, '#fff');
        if (theme.minutes) {
            var minuteAngle = degToRad((time.getMinutes() + time.getSeconds() / 60) / 60 * 360 - 180);
            drawRoundedRect(34, clockRadius - 64, minuteAngle, 16, COLOR_MINUTE_HAND, undefined, undefined);
        }
        var hourAngle = degToRad(((time.getHours() % 12) + time.getMinutes() / 60) / 12 * 360 - 180);
        drawRoundedRect(36, clockRadius - 80, hourAngle, 16, 'rgba(0, 0, 0, 0.15)', '#fff', 4);
        if (!ambient)
            setTimeout(function () { return window.requestAnimationFrame(drawWatchFace); }, 1000 / 10);
    }
    window.requestAnimationFrame(drawWatchFace);
    window.addEventListener('timetick', drawWatchFace);
    window.addEventListener('ambientmodechanged', function (e) {
        ambient = e.detail.ambientMode;
        drawWatchFace();
    });
    document.addEventListener('visibilitychange', function () {
        if (!document.hidden)
            drawWatchFace();
    });
}
