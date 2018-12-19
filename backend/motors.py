#!/usr/bin/env python
import sys
import argparse
import serial
from time import *

SLEEP_INT   = 0.1 #sleep time in seconds between sending subcommands on serial port
STEP_PER_CM = 9804 #motor steps per cm

def options():
    parser = argparse.ArgumentParser(description="%s: Gilroy Lab CLI Camera Controller"%(sys.argv[0]), add_help=True)
    parser.add_argument("-p", "--port", default="COM3", help="Serial port to send commands on.", required=False)
    parser.add_argument("-x", "--x_distance", type=float, default=12.0, help="X Distance b/w center of plates.", required=False)
    parser.add_argument("-y", "--y_distance", type=float, default=12.0, help="Y Distance b/w center of plates.", required=False)
    parser.add_argument("-n", "--num_plates", type=float, default=1, help="Number of plates to move right/left or up/down.", required=False)
    arm_movement_group=parser.add_mutually_exclusive_group(required=False)
    arm_movement_group.add_argument("-c", "--home", action="store_true", help="Seek to home location.")
    arm_movement_group.add_argument("-m", "--homex", action="store_true", help="Seek to home X at current Y location (horizontal home).")
    arm_movement_group.add_argument("-l", "--left", action="store_true", help="Move camera arm left <num> petri plates.")
    arm_movement_group.add_argument("-r", "--right", action="store_true", help="Move camera arm right <num> petri plates.")
    arm_movement_group.add_argument("-d", "--down", action="store_true", help="Move camera arm down <num> petri plates.")
    arm_movement_group.add_argument("-u", "--up", action="store_true", help="Move camera arm up <num> petri plates.")
    arm_movement_group.add_argument("-s", "--stop", action="store_true", help="Stop arm movement.")
    arm_movement_group.add_argument("-i", "--status", action="store_true", help="Get arm controller status string.")
    return parser

class CamController():
    def __init__(self, port):
        try:
            self.ser = serial.Serial(port,
                                    9600,
                                    timeout=1,
                                    parity=serial.PARITY_NONE,
                                    bytesize=serial.EIGHTBITS,
                                    stopbits=serial.STOPBITS_ONE)
        except:
            print("Unexpected error:", sys.exc_info()[0])
            raise

    def __del__(self):
        if(self.ser):
            self.ser.close()

    def send_command(self, command):
        self.ser.write(command.encode('ascii')+'\r\n')
        r=self.ser.read(32)
        return(r)

    def send_command_stop(self):
        self.send_command('SK')

    def send_command_status(self):
        r1 = self.send_command('1RS');
        print(r1)
        sleep(SLEEP_INT);
        r2 = self.send_command('2RS');
        print(r2)
        sleep(SLEEP_INT);
        return(r1+'\n'+r2)
        
    def send_command_home(self):
        self.send_command('DL2')
        sleep(SLEEP_INT)
        self.send_command('AC5')
        sleep(SLEEP_INT)
        self.send_command('DE2');
        sleep(SLEEP_INT)
        self.send_command('DI-1200000')
        sleep(SLEEP_INT)
        self.send_command('VE1')
        sleep(SLEEP_INT)
        self.send_command('FL')
        sleep(SLEEP_INT)

    def send_command_homex(self):
        self.send_command('DL2')
        sleep(SLEEP_INT)
        self.send_command('1DI-1200000')
        sleep(SLEEP_INT)
        self.send_command('1VE1')
        sleep(SLEEP_INT)
        self.send_command('1FL')
        sleep(SLEEP_INT)

    def send_command_x(self,x):
        self.send_command('1DI%d'%(x))
        sleep(SLEEP_INT)
        self.send_command('VE3')
        sleep(SLEEP_INT)
        self.send_command('1FL')
        sleep(SLEEP_INT)

    def send_command_left(self,x):
        self.send_command_x(x)

    def send_command_right(self,x):
        self.send_command_x(-x)

    def send_command_y(self,y):
        self.send_command('2DI%d'%y)
        sleep(SLEEP_INT)
        self.send_command('VE3')
        sleep(SLEEP_INT)
        self.send_command('2FL')
        sleep(SLEEP_INT)

    def send_command_up(self,y):
        self.send_command_y(-y)

    def send_command_down(self,y):
        self.send_command_y(y)

### Main pipeline
def main():
    # Define options
    parser = options()
    # Parse CLI options
    args = parser.parse_args(sys.argv[1:])
    # Create the camera controller object
    controller = CamController(args.port)
    # Parse and process the command to send to the camera controller object
    if( args.home ):
        controller.send_command_home()
    elif( args.homex ):
        controller.send_command_homex()
    elif( args.left ):
        x = int(args.x_distance * STEP_PER_CM * args.num_plates)
        controller.send_command_left(x)
    elif( args.right ):
        x = int(args.x_distance * STEP_PER_CM * args.num_plates)
        controller.send_command_right(x)
    elif( args.down):
        y = int(args.y_distance * STEP_PER_CM * args.num_plates)
        controller.send_command_down(y)
    elif( args.up):
        y = int(args.y_distance * STEP_PER_CM * args.num_plates)
        controller.send_command_up(y)
    elif( args.stop ):
        controller.send_command_stop()
    elif( args.status ):
        response = controller.send_command_status()
        print(response)
    del(controller)

if __name__ == '__main__':
    main()
