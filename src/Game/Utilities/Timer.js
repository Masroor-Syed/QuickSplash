import React,{Component} from 'react';
import Cookies from "universal-cookie";
import {socket} from "../../Router";

const cookies = new Cookies();

class Timer extends Component {

    componentDidMount(){
        let c = window.createjs;
        const stage = new c.Stage("canvasDisplay");

        let question1 = this.props.question1;
        let question2 = this.props.question2;

        // Set timer.
        let time = this.props.time;
        let timeLeftColour = "blue";
        let timeOverColour = "red";

        let startAngle = 0.000001 * Math.PI / 180; // Radian = degrees x pi / 180
        let endAngle = 0;

        // Arc 1
        let timeLeftCircle = new c.Shape();
        timeLeftCircle.graphics.s(timeLeftColour);
        timeLeftCircle
            .graphics
            .setStrokeStyle(10)
            .arc(0, 0, 45, startAngle, endAngle);
        timeLeftCircle.x = 75; // Position the circle on screen
        timeLeftCircle.y = 75;

        // Arc 2
        let timeOverCircle = new c.Shape();
        timeOverCircle.graphics.s(timeOverColour);
        timeOverCircle
            .graphics
            .setStrokeStyle(10)
            .arc(0, 0, 45, endAngle, startAngle);
        timeOverCircle.x = timeLeftCircle.x;
        timeOverCircle.y = timeLeftCircle.y;

        let timerText = new c.Text(time, '50px Arial', "black");
        timerText.x = 47;
        timerText.y = 53;

        stage.addChild(timeLeftCircle, timeOverCircle, timerText);

        stage.update();

        var decTime = (2 / time) * Math.PI; // How much to decrease each time.

        // Timer. Runs every second.
        let timer = setInterval(function () {

            time -= 1; // Decrement time left.

            startAngle += decTime;

            // Remove old circles, and time left
            stage.removeChild(timeLeftCircle);
            stage.removeChild(timeOverCircle);
            stage.removeChild(timerText);

            timerText = new c.Text(time, '50px Arial', "black");
            if (time < 10) {
                timerText.x = 62; // Position for single digit num
            } else
                timerText.x = 47;
            timerText.y = 53;

            // Add new ones
            timeLeftCircle = new c.Shape();
            timeLeftCircle.graphics.s(timeLeftColour);
            timeLeftCircle
                .graphics
                .setStrokeStyle(10)
                .arc(75, 75, 45, startAngle, endAngle);

            timeOverCircle = new c.Shape();
            timeOverCircle.graphics.s(timeOverColour);
            timeOverCircle
                .graphics
                .setStrokeStyle(10)
                .arc(75, 75, 45, endAngle, startAngle);

            stage.addChild(timeLeftCircle);
            stage.addChild(timeOverCircle);
            stage.addChild(timerText);

            stage.update();

            // When timer is complete...
            if (time === 0)
            {
                clearInterval(timer);
                let lobbyCode = localStorage.getItem('lobbyCode');
                let player = cookies.get('username').nickname;
                socket.emit('failedToAnswer', player, lobbyCode, question1, question2);

            }

        }, 1000);

        stage.update();

    }

    render() {
        return (<canvas id="canvasDisplay" width={150} height={150}/>);
    }
}

export default Timer;
