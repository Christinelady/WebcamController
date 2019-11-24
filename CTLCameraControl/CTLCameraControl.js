const { spawn } = require('child_process');

const COMMANDS = {
    PAN_RELATIVE: 'Pan (relative)',
    TILT_RELATIVE: 'Tilt (relative)',
    PAN_RESET: 'Pan Reset',
    TILT_RESET: 'Tilt Reset',
}

class CTLCameraControl {
    constructor() {
        this.COMMANDS = COMMANDS;

        this.speed = 100;
    }

    __setDebug(debug = true) {
        this.debug = debug;
    }

    setSpeed(val) {
        if (val < 0 || val > 10000) {
            throw new Error("Speed should be between 0-1000");
        }

        this.speed = val;

        return this;
    }

    turnRight(speed = false) {
        return this.rawCommand(COMMANDS.PAN_RELATIVE, speed || this.speed);
    }

    turnLeft(speed = false) {
        return this.rawCommand(COMMANDS.PAN_RELATIVE, (speed || this.speed) * -1);
    }

    tiltUp(speed = false) {
        return this.rawCommand(COMMANDS.TILT_RELATIVE, speed || this.speed);
    }

    tiltDown(speed = false) {
        return this.rawCommand(COMMANDS.TILT_RELATIVE, (speed || this.speed) * -1);
    }

    resetPan() {
        return this.rawCommand(COMMANDS.PAN_RESET);
    }

    resetTilt() {
        return this.rawCommand(COMMANDS.TILT_RESET);
    }

    reset() {
        return this.resetPan()
            .then(() => this.delay(2000))
            .then(() => this.resetTilt());
    }
    
    delay(time) {
        return new Promise((resolve, reject) => {
            setTimeout(() => resolve(), time);
        });
    }

    rawCommand(command, value = 0) {
        return new Promise((resolve, reject) => {
            const child = spawn('uvcdynctrl', ['-s', command, '--', value]);

            child.on('exit', (code) => {
                resolve();
            });

            if (this.debug) {
                child.stdout.on('data', (data) => {
                    console.log(`stdout: ${data}`);
                });
                child.stderr.on('data', (data) => {
                    console.log(`stderr: ${data}`);
                });
            }
        });
    }
}

module.exports = CTLCameraControl;
