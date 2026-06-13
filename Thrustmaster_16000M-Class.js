export class ThrustMaster16000M_JoyStick {
  constructor(options) {
    this.handednessHardwareToggle = 'Right';
    if (options?.handednessHardwareToggle) {
      this.setHandednessHardwareToggle(options.handednessHardwareToggle);
    } else {
      this.setHandednessHardwareToggle(this.handednessHardwareToggle)
    }

    this.devMode = false;

    this.buttonListeners = {};
    this.stickListeners = {};

    this.buttonMap = {
      "STICK_TRIGGER": { "Left": { "Code": 288, "Name": "BTN_288", "ManufacturerId": 1 }, "Right": { "Code": 288, "Name": "BTN_288", "ManufacturerId": 1 } },
      "STICK_SOUTH": { "Left": { "Code": 289, "Name": "BTN_289", "ManufacturerId": 2 }, "Right": { "Code": 289, "Name": "BTN_289", "ManufacturerId": 2 } },
      "STICK_WEST": { "Left": { "Code": 290, "Name": "BTN_290", "ManufacturerId": 4 }, "Right": { "Code": 290, "Name": "BTN_290", "ManufacturerId": 4 } },
      "STICK_EAST": { "Left": { "Code": 291, "Name": "BTN_291", "ManufacturerId": 3 }, "Right": { "Code": 291, "Name": "BTN_291", "ManufacturerId": 3 } },
      "BASE_LEFT_1": { "Left": { "Code": 298, "Name": "BTN_298", "ManufacturerId": 11 }, "Right": { "Code": 292, "Name": "BTN_292", "ManufacturerId": 5 } },
      "BASE_LEFT_2": { "Left": { "Code": 299, "Name": "BTN_299", "ManufacturerId": 12 }, "Right": { "Code": 293, "Name": "BTN_293", "ManufacturerId": 6 } },
      "BASE_LEFT_3": { "Left": { "Code": 300, "Name": "BTN_300", "ManufacturerId": 13 }, "Right": { "Code": 294, "Name": "BTN_294", "ManufacturerId": 7 } },
      "BASE_LEFT_4": { "Left": { "Code": 303, "Name": "BTN_303", "ManufacturerId": 16 }, "Right": { "Code": 297, "Name": "BTN_297", "ManufacturerId": 10 } },
      "BASE_LEFT_5": { "Left": { "Code": 302, "Name": "BTN_302", "ManufacturerId": 15 }, "Right": { "Code": 296, "Name": "BTN_296", "ManufacturerId": 9 } },
      "BASE_LEFT_6": { "Left": { "Code": 301, "Name": "BTN_301", "ManufacturerId": 14 }, "Right": { "Code": 295, "Name": "BTN_295", "ManufacturerId": 8 } },
      "BASE_RIGHT_1": { "Left": { "Code": 294, "Name": "BTN_294", "ManufacturerId": 7 }, "Right": { "Code": 300, "Name": "BTN_300", "ManufacturerId": 13 } },
      "BASE_RIGHT_2": { "Left": { "Code": 293, "Name": "BTN_293", "ManufacturerId": 6 }, "Right": { "Code": 299, "Name": "BTN_299", "ManufacturerId": 12 } },
      "BASE_RIGHT_3": { "Left": { "Code": 292, "Name": "BTN_292", "ManufacturerId": 5 }, "Right": { "Code": 298, "Name": "BTN_298", "ManufacturerId": 11 } },
      "BASE_RIGHT_4": { "Left": { "Code": 295, "Name": "BTN_295", "ManufacturerId": 8 }, "Right": { "Code": 301, "Name": "BTN_301", "ManufacturerId": 14 } },
      "BASE_RIGHT_5": { "Left": { "Code": 296, "Name": "BTN_296", "ManufacturerId": 9 }, "Right": { "Code": 302, "Name": "BTN_302", "ManufacturerId": 15 } },
      "BASE_RIGHT_6": { "Left": { "Code": 297, "Name": "BTN_297", "ManufacturerId": 10 }, "Right": { "Code": 303, "Name": "BTN_303", "ManufacturerId": 16 } }
    };

    this.buttons = Object.keys(this.buttonMap);

    this.stickMap = {
      "MAIN_PITCH": "Y",
      "MAIN_ROLL": "X",
      "MAIN_YAW": "RZ",
      "MINI_PITCH": "HAT0Y",
      "MINI_ROLL": "HAT0X"
    };

    this.sticks = Object.keys(this.stickMap);

    this.button = {
      on: (logicalName, cb) => { this.buttonListeners[logicalName] = cb; }
    };

    this.stick = {
      on: (logicalName, cb) => {
        const hardwareAxis = this.stickMap[logicalName];
        if (hardwareAxis) {
          this.stickListeners[hardwareAxis] = cb;
        } else {
          console.error(`Stick axis "${logicalName}" not found in stickMap.`);
        }
      }
    };

    this.handleInput = this.handleInput.bind(this);

    console.log(`Joystick Ready!`)
  }

  setHandednessHardwareToggle(mode) {
    const normalized = String(mode).toLowerCase();
    const isLeft = ['left', 'lefty', 'left-handed', 'left handed', 'left hand', 'southpaw', 'south-paw', 'south paw'].includes(normalized);

    this.handednessHardwareToggle = isLeft ? 'Left' : 'Right';

    console.log(`Handedness Updated to [${this.handednessHardwareToggle}]. Make sure the toggle switch below the Thrustmaster 16000M is set for [${this.handednessHardwareToggle}] handed users.`)
  }

  setDevMode(mode) {
    if (typeof mode != 'boolean') return

    this.devMode = mode;

    console.warn(`DevMode is [${mode ? 'Enabled' : 'Disabled'}]${mode ? ' Additional logs will print to the console with the prefix [TM16KM]' : ''}.`)

    return this;
  }

  listButtons() {
    console.log(`Available Buttons:`)
    this.buttons.forEach(button => {
      console.log(`  ${button}`)
    })
    return;
  }

  listSticks() {
    console.log(`Available Sticks:`)
    this.sticks.forEach(stick => {
      console.log(`  ${stick}`)
    });
    return;
  }

  handleInput(data) {
    if (this.devMode) {
      console.log(`[TM16KM] >> handInput >> data:`, data);
    }
    if (data.Button) {
      const incomingCode = parseInt(data.Button.Code);

      const logicalName = Object.keys(this.buttonMap).find(key =>
        this.buttonMap[key][this.handednessHardwareToggle].Code === incomingCode
      );

      if (logicalName && this.buttonListeners[logicalName]) {
        this.buttonListeners[logicalName](data.Button.State);
      }
    }

    if (data.Stick) {
      const axis = data.Stick.Axis;
      if (this.stickListeners[axis]) {
        this.stickListeners[axis](data.Stick.Value);
      }
    }
  }
}