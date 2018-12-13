/* Wesley Slade - 2018 - 3rd Year IXD Student - Sheridan College - Attributions listed where code not original

*/


// Declare a "SerialPort" object
var serial;
var latestData = "waiting for data"; // you'll use this to write incoming data to the canvas

var sensors = [];


var splitter;


// Variables for image content
var heart;
var like;
var anger;
var posts = [6];
var randomPost;


//Variables for easy placing of objects within sketch
var windowX = window.innerWidth / 100;
var windowY = window.innerHeight / 100;



//Variables for image manipulation 
var m;
var heartFade = 255;
var likeFade = 255;
var angerFade = 255;
var raiseHeart = 0;
var raiseLike = 0;
var raiseAnger = 0;

//Variables for user interactions
var Posted = false;
var user = false;
var userCheck = 0;

//Variables for sounds and counters related to sound
var heartSounds0;
var heartSounds1;
var heartSounds2;
var heartSounds3;
var fullHeart = 0;
var totalHearts = 0;

var likeSounds0;
var likeSounds1;
var likeSounds2;
var likeSounds3;
var fullLike = 0;
var totalLikes = 0;

var angerSounds0;
var angerSounds1;
var angerSounds2;
var angerSounds3;
var fullShout = 0;
var totalShouts = 0;

//Variables for total user interactions 
var totalEmotions;

var sound = false;






function preload() {
    //Loads Reactions
    heart = loadImage('Assets/Reactions/Hearts.png');
    like = loadImage('Assets//Reactions/Like.png');
    anger = loadImage('Assets//Reactions/Anger.png');
    imageMode(CENTER);
    //Loads Posts
    for (var i = 0; i < 6; i++) {
        posts[i] = loadImage('Assets/Posts/post' + i + '.png');
    }
    
    //Loads Sounds
    soundFormats('wav');
    heartSounds0 = loadSound('Assets/Sounds/Heart/heart0.wav');
    heartSounds1 = loadSound('Assets/Sounds/Heart/heart1.wav');
    heartSounds2 = loadSound('Assets/Sounds/Heart/heart2.wav');
    heartSounds3 = loadSound('Assets/Sounds/Heart/heart3.wav');

    likeSounds0 = loadSound('Assets/Sounds/Like/like0.wav');
    likeSounds1 = loadSound('Assets/Sounds/Like/like1.wav');
    likeSounds2 = loadSound('Assets/Sounds/Like/like2.wav');
    likeSounds3 = loadSound('Assets/Sounds/Like/like3.wav');

    angerSounds0 = loadSound('Assets/Sounds/Anger/anger0.wav');
    angerSounds1 = loadSound('Assets/Sounds/Anger/anger1.wav');
    angerSounds2 = loadSound('Assets/Sounds/Anger/anger2.wav');
    angerSounds3 = loadSound('Assets/Sounds/Anger/anger3.wav');

}

//var showsplittext;


//Sensor Data For Emojies
var heartData, likeData, angerData;

function setup() {
    createCanvas(window.innerWidth, window.innerHeight);
    frameRate(30);
    likeSoundFX = [likeSounds0, likeSounds1, likeSounds2, likeSounds3];
    heartSoundFX = [heartSounds0, heartSounds1, heartSounds2, heartSounds3];
    angerSoundFX = [angerSounds0, angerSounds1, angerSounds2, angerSounds3];
    
    /*
    Most function setup code provided by Doug Whitton - IXD professor - Fall 2018
    
    */
    

    // Instantiate our SerialPort object
    serial = new p5.SerialPort();

    // Get a list the ports available
    // You should have a callback defined to see the results
    serial.list();

    // Assuming our Arduino is connected, let's open the connection to it
    // Change this to the name of your arduino's serial port
    serial.open("/dev/cu.usbmodem1421");

    // Here are the callbacks that you can register

    // When we connect to the underlying server
    serial.on('connected', serverConnected);

    // When we get a list of serial ports that are available
    serial.on('list', gotList);
    // OR
    //serial.onList(gotList);

    // When we some data from the serial port
    serial.on('data', gotData);
    // OR
    //serial.onData(gotData);

    // When or if we get an error
    serial.on('error', gotError);
    // OR
    //serial.onError(gotError);

    // When our serial port is opened and ready for read/write
    serial.on('open', gotOpen);
    // OR
    //serial.onOpen(gotOpen);

    // Callback to get the raw data, as it comes in for handling yourself
    //serial.on('rawdata', gotRawData);
    // OR
    //serial.onRawData(gotRawData);
}


   /*
    Code provided by Doug Whitton - IXD professor - Fall 2018
    
    */

// We are connected and ready to go
function serverConnected() {
    println("Connected to Server");
}

// Got the list of ports
function gotList(thelist) {
    println("List of Serial Ports:");
    // theList is an array of their names
    for (var i = 0; i < thelist.length; i++) {
        // Display in the console
        println(i + " " + thelist[i]);
    }
}

// Connected to our serial device
function gotOpen() {
    println("Serial Port is Open");
}

// Uh oh, here is an error, let's log it
function gotError(theerror) {
    println(theerror);
}

// There is data available to work with from the serial port
function gotData() {
    var currentString = serial.readLine(); // read the incoming string
    trim(currentString); // remove any trailing whitespace
    if (!currentString) return; // if the string is empty, do no more
    //console.log(currentString);             // println the string
    latestData = currentString; // save it for the draw method
    console.log("latestData" + latestData); //check to see if data is coming in
    splitter = split(latestData, ','); // split each number using the comma as a delimiter
    //console.log("splitter[0]" + splitter[0]); 
    heartData = splitter[0]; //put the first sensor's data into a variable
    likeData = splitter[1];
    angerData = splitter[2];
    userData = splitter[3];


    //showsplittext = (splitter[0]);

}

// We got raw from the serial port
function gotRawData(thedata) {
    println("gotRawData" + thedata);
}

// Methods available
// serial.read() returns a single byte of data (first in the buffer)
// serial.readChar() returns a single char 'A', 'a'
// serial.readBytes() returns all of the data available as an array of bytes
// serial.readBytesUntil('\n') returns all of the data available until a '\n' (line break) is encountered
// serial.readString() retunrs all of the data available as a string
// serial.readStringUntil('\n') returns all of the data available as a string until a specific string is encountered
// serial.readLine() calls readStringUntil with "\r\n" typical linebreak carriage return combination
// serial.last() returns the last byte of data from the buffer
// serial.lastChar() returns the last byte of data from the buffer as a char
// serial.clear() clears the underlying serial buffer
// serial.available() returns the number of bytes available in the buffer
// serial.write(somevar) writes out the value of somevar to the serial device


/* Wesley Slade - 2018 - 3rd Year IXD Student - Sheridan College */

function draw() {
    
    //Variables
    background(255, 255, 255);
    var heartFade = map(heartData, 0, 1000, 255, 0);
    var likeFade = map(likeData, 0, 1000, 255, 0);
    var angerFade = map(likeData, 0, 1000, 255, 0);
    totalEmotions = totalHearts + totalLikes + totalShouts;
    console.log("emotions" + totalEmotions);
 // Checking variables to see if user is present to interaction, then running the sketch if user is present
    if (user == true) {
        postFunc();
        noStroke();
        heartFunc();
        likeFunc();
        angerFunc();
    }
//detcting user present
    userDetection();


    console.log("Hearts" + totalHearts);
    console.log("likes" + totalLikes);
    console.log("shouts" + totalShouts);
}

function windowResized() {
    resizeCanvas(window.innerWidth, window.innerHeight);
}

// Functions rendering the images and their states based on user reactions

function heartFunc() {
    tint(255, heartFade);
    image(heart, windowX * 30, windowY * 66 - raiseHeart, 200 + raiseHeart, 200 + raiseHeart);

    if (heartData > 400) {
        raiseHeart++;
        fullHeart++;
    }
    if (heartData < 200 && raiseHeart > 0) {
        raiseHeart--;
        fullHeart--;
    }
    if (fullHeart >= 150) {
        Posted = false;
        randomPost = Math.floor(Math.random() * posts.length);
        randomSound = Math.floor(Math.random() * 4);
        heartSoundFX[randomSound].play();
        fullHeart = 0;
        totalHearts++;
        raiseHeart = 0;
    }

    if (fullHeart < 0) {
        fullHeart = 0;
    }

}


function likeFunc() {
    tint(255, likeFade);
    image(like, windowX * 50, windowY * 66 - raiseLike, 200 + raiseLike, 200 + raiseLike);
    if (likeData > 200) {
        raiseLike++;
        fullLike += 20;
    }
    if (likeData < 200 && raiseLike > 0) {
        raiseLike--;
        fullLike--;
    }
    if (fullLike >= 150) {
        Posted = false;
        randomPost = Math.floor(Math.random() * posts.length);
        randomSound = Math.floor(Math.random() * 4);
        likeSoundFX[randomSound].play();
        fullLike = 0;
        totalLikes++;
        raiseLike = 0;
    }

    if (fullLike < 0) {
        fullLike = 0;
    }

}

function angerFunc() {
    tint(255, angerFade);
    image(anger, windowX * 70, windowY * 66 - raiseAnger, 200 + raiseAnger, 200 + raiseAnger);
    if (angerData >= 900) {}

    if (angerData > 800) {
        raiseAnger++;
        fullShout++;
    }
    if (angerData < 200 && raiseAnger > 0) {
        raiseAnger--;
        fullShout--;
    }
    if (fullShout >= 150) {
        Posted = false;
        fullShout = 0;
        randomPost = Math.floor(Math.random() * posts.length);
        randomSound = Math.floor(Math.random() * 4);
        angerSoundFX[randomSound].play();
        totalShouts++;
        raiseAnger = 0;
    }
    if (fullShout < 0) {
        fullShout = 0;
    }
    console.log(sound);
}

// Function selecting and display posts to users, also plays sounds if users have interacted with multiple posts in specific ways

function postFunc() {
    if (Posted == false) {
        randomPost = Math.floor(Math.random() * posts.length);
        randomSound = Math.floor(Math.random() * 4);

        if (totalLikes >= 2) {
            likeSoundFX[randomSound].play();
            randomSound = Math.floor(Math.random() * 4);
            likeSoundFX[randomSound].play();
        }
        if (totalHearts >= 2) {
            heartSoundFX[randomSound].play();
            randomSound = Math.floor(Math.random() * 4);
            heartSoundFX[randomSound].play();
        }

        if (totalShouts >= 2) {
            angerSoundFX[randomSound].play();
            randomSound = Math.floor(Math.random() * 4);
            angerSoundFX[randomSound].play();
        }

        if (totalEmotions >= 4) {
            likeSoundFX[randomSound].play();
            randomSound = Math.floor(Math.random() * 4);
            angerSoundFX[randomSound].play();
            randomSound = Math.floor(Math.random() * 4);
            heartSoundFX[randomSound].play();
            randomSound = Math.floor(Math.random() * 4);
            heartSoundFX[randomSound].play();
        }
//User has interacted with a post at least once
        Posted = true;

    }
    image(posts[randomPost], window.innerWidth / 2, window.innerHeight / 3, 600, 720);
}


//detects if users are present at mouse's location, counts how long no users are present


function userDetection() {

    if (pmouseX != mouseX) {

        user = true;

    }

    if (pmouseX == mouseX) {

        userCheck++;

    } else {
        userCheck = 0;
    }

    if (userCheck == 1500) {
        user = false;
        resetScene();
    }

}
//Resets the scene if users have been missing for a set amount of time
function resetScene() {
    heartFade = 255;
    likeFade = 255;
    angerFade = 255;
    raiseHeart = 0;
    raiseLike = 0;
    raiseAnger = 0;


}
