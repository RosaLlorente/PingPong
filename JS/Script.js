window.onload = () => {
    const svgFather = document.querySelector("svg");
    const limitX = 1000;
    const limitY = 500;

    //Score variables and HTML elements
    let player1score = 0;
    let player2score = 0;
    const spanPlayer1 = document.querySelectorAll("p span")[0];
    const spanPlayer2 = document.querySelectorAll("p span")[1];

    spanPlayer1.textContent = player1score;
    spanPlayer2.textContent = player2score;

    var Ball = new ball(50, 50, 3, 3, limitX, limitY, 10, svgFather, updateScore);
    var rectangle1 = new Rectangle(0, 200, 30, 100, svgFather);
    var rectangle2 = new Rectangle(970, 200, 30, 100, svgFather);

    Ball.move([rectangle1, rectangle2]);

    //PROGRAM
    MusicBackground();

    //Eventos para asignar teclas de juego
    //Jugador 1
    document.addEventListener("keydown", (event) => 
    {
        if (event.key === "w") 
        {
            if (rectangle1.positionY > 0) 
            {
                rectangle1.positionY -= 10;
                rectangle1.updatePosition();
            }
        } 
        else if (event.key === "s") 
        {
            if (rectangle1.positionY + rectangle1.height < limitY) 
            {
                rectangle1.positionY += 10;
                rectangle1.updatePosition();
            }
        } 

        //Jugador 2
        else if (event.key === "ArrowUp") 
        {
            if (rectangle2.positionY > 0) 
            {
                rectangle2.positionY -= 10;
                rectangle2.updatePosition();
            }
        } 
        else if (event.key === "ArrowDown")
            {
            if (rectangle2.positionY + rectangle2.height < limitY) 
            {
                rectangle2.positionY += 10;
                rectangle2.updatePosition();
            }
        }
    });

    //Función para actualizar la puntuación
    function updateScore(player)
    {
        if (player === 1) 
        {
            player1score++;
            spanPlayer1.textContent = player1score;
        } 
        else if (player === 2) 
        {
            player2score++;
            spanPlayer2.textContent = player2score;
        }
        SoundPoint();
    }
};

//CLASES
//Class that creates a ball
class ball 
{
    constructor(positionX, positionY, speedx, speedy, limitX, limitY, radio, svgFather, updateScoreCallback) 
    {
        this.positionX = positionX;
        this.positionY = positionY;
        this.speedx = speedx;
        this.speedy = speedy;
        this.limitX = limitX;
        this.limitY = limitY;
        this.radio = radio;
        this.updateScore = updateScoreCallback;
        this.crearTag(svgFather);
    }

    crearTag(svgFather) 
    {
        this.ball = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        this.ball.setAttribute("cx", this.positionX);
        this.ball.setAttribute("cy", this.positionY);
        this.ball.setAttribute("r", this.radio);
        this.ball.setAttribute("stroke", "black");
        this.ball.setAttribute("stroke-width", 1);
        this.ball.setAttribute("fill", color());
        svgFather.appendChild(this.ball);
    }

    move(Rectangles)  //Method for interaction with the x axes and rectangles
    {
        setInterval(() => 
        {
            this.positionX += this.speedx;
            this.ball.setAttribute("cx", this.positionX);

            this.positionY += this.speedy;
            this.ball.setAttribute("cy", this.positionY);

            if ((this.positionY + this.radio) > this.limitY || (this.positionY - this.radio) < 0) 
            {
                this.speedy *= -1;
                SoundBall();
            }

            if (this.positionX - this.radio < 0) 
            {
                // Point for player 2
                this.updateScore(2);
                this.reset();
            } 
            else if (this.positionX + this.radio > this.limitX) 
            {
                // Point for player 1
                this.updateScore(1);
                this.reset();
            }

            Rectangles.forEach((rect) => 
            {
                if (this.positionX - this.radio < rect.positionX + rect.width && this.positionX + this.radio > rect.positionX && this.positionY + this.radio > rect.positionY && this.positionY - this.radio < rect.positionY + rect.height) 
                {
                    this.speedx *= -1;
                    SoundBall();
                }
            });
        }, 20);
    }

    reset() 
    {
        this.positionX = this.limitX / 2;
        this.positionY = this.limitY / 2;
        this.speedx *= -1; // Cambia dirección de la ball
        this.ball.setAttribute("cx", this.positionX);
        this.ball.setAttribute("cy", this.positionY);
    }
}

//Class that creates a rectangle
class Rectangle 
{
    constructor(positionX, positionY, width, height, svgFather) 
    {
        this.positionX = positionX;
        this.positionY = positionY;
        this.width = width;
        this.height = height;
        this.crearTag(svgFather);
    }

    crearTag(svgFather) 
    {
        this.Rectangle = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        this.Rectangle.setAttribute("x", this.positionX);
        this.Rectangle.setAttribute("y", this.positionY);
        this.Rectangle.setAttribute("width", this.width);
        this.Rectangle.setAttribute("height", this.height);
        this.Rectangle.setAttribute("stroke", "black");
        this.Rectangle.setAttribute("stroke-width", 1);
        this.Rectangle.setAttribute("fill", color());
        svgFather.appendChild(this.Rectangle);
    }
    updatePosition()
    {
        this.Rectangle.setAttribute("y", this.positionY);
    }
}

//FUNCTIONS
//Function to assign a random color
function color() 
{
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);

    return "rgb(" + r + "," + g + "," + b + ")";
}

//Function to insert background music
function MusicBackground() 
{
    var KeySound = new Audio('Sound/Patty no Theme.mp3');
    KeySound.play();
    KeySound.loop = true;
    KeySound.volume = 0.08;
    document.body.addEventListener('keydown', () =>
    {
        KeySound.play().catch((error) => console.error("Error playing sound:", error));
    });
}

//Function to apply sound effects to the ball
function SoundBall() 
{
    var KeySound = new Audio('Sound/ping-pong-ball-100074 (mp3cut.net).mp3');
    KeySound.play();
    KeySound.volume = 2.0;
}

//Function to apply sound effects to points
function SoundPoint() 
{
    var KeySound = new Audio('Sound/retro-blip-236676.mp3');
    KeySound.play();
    KeySound.volume = 1.0;
}