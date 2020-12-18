
// degree dictation
export const possibleTonicNotes = ["G/4", "A/4", "C/5", "D/5"];
export const possibleScales = ["major", "minorNatural", "minorHarmonic"]; // maybe scale should be given as a parameter
export const possibleDegrees = [-5, -6, -7, 1, 2, 3, 4, 5, 6];
export const maxNotes = 7;
export const firstNoteProbabilities = { 1:0.6, 3:0.2, 5:0.1, 2:0.1 };
export const followUpProbabilities = { // probabilities, what comes after the given degree
    "1": {2:0.4 , 3:0.2, 5:0.1, "-7":0.25, "-5":0.05  }, // give 5 steps, probabilities must sum to 1, like 0.4, 0.25, 0.2, 0.1, 0.05)
    "2": {3:0.4 , 1:0.25, 4:0.1, "-7":0.1, "-5":0.05  },
    "3": {4:0.4 , 1:0.25, 2:0.1, 5:0.1, 6:0.05  },
    "4": {5:0.4 , 2:0.25, 1:0.1, 6:0.1, "-7":0.05  },
    "5": {4:0.4 , 6:0.25, 1:0.1, 3:0.1, "-5":0.05  },

    "6": {5:0.4 , 4:0.25, 7:0.1, 2:0.1, "-6":0.05  },
    "7": {6:0.4 , 5:0.25, 2:0.1, 4:0.1, "-7":0.05  },
    "-7": {1:0.5 , 2:0.25, "-6":0.15, "-5":0.1  },
    "-6": {"-5":0.4 , "-7":0.25, 1:0.1, 2:0.1, 6:0.05  },
    "-5": {1:0.5 , "-6":0.25, 2:0.15, "-7":0.1  },
};
export const categories = {
  ONEVOICE: "1voice", 
  TWOVOICE: "2voice", 
  CLASSICAL: "classical", 
  POPJAZZ: "popJazz", 
  FUNCTIONAL: "functional", 
  C_SIMPLE: "C_simple", 
  RM_SIMPLE: "RM_simple", 
  DEGREES: "degrees",
  DEGREES_RANDOM: "degrees_random"
};
