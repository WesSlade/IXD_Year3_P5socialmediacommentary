import processing.serial.*;

Serial myPort;

int diameter0;
int diameter1;
int diameter2;

//a new line in ASCII is 10
int linefeed = 10;

void setup(){
  size(640, 480);
// Serial.list() will show you the device name in the console  
//println(Serial.list());
//make sure to enter the correct board
String portName = "/dev/cu.usbmodem1421";
myPort = new Serial(this, portName, 9600);
myPort.bufferUntil(linefeed);
}

void draw() {
  background(0);
  fill(255,0,0);
  ellipse(100, height/2, diameter0, diameter0);
  fill(0,255,0);
  ellipse(300, height/2, diameter1, diameter1);
  fill(0,0,255);
  ellipse(500, height/2, diameter2, diameter2);
}

void serialEvent(Serial myPort){
  // a newline is \n
  String myString = myPort.readStringUntil('\n');
  
 
   // split the string at the commas
   // and convert the sections into integers:
   // use this if statement so that the code is only running if there is data in the serial prt
  if (myString != null) {
    println(myString);
    //trim removes all the whitespace 
    myString = trim(myString);
    //split means each sensor value is separated with a comma
    // each sensor value becomes an item in an array
    int sensors[] = int(split(myString, ','));
    
    for (int sensorNum = 0; sensorNum < sensors.length; sensorNum++) {
      print("sensors.length  " + sensors.length);
      
}
  diameter0 = sensors[0];
  diameter1 = sensors[1];
  diameter2 = sensors[2]; 
}
  // if you get an error message about 'disabling serial port..' unplug the usb cable 
  // plug it back in, should work ok. Also do it if not all the circles draw 
}