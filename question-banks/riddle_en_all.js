// Riddle Journey - All Questions and Answers
// Total questions: 360 (Ages 6-7: 120, Ages 8-9: 120, Ages 10-11: 120)
// Each of the 12 activities per age group includes 10 questions.

(()=>{
const riddleJourneyData = {
  "Ages 6-7": {
    "Activity 1: Animals and Nature": [
      {
        "questionNumber": 1,
        "question": "I have long ears and a small round tail, and I love to hop and eat carrots. Who am I?",
        "correctAnswer": "Rabbit",
        "incorrectOptions": [
          "Butterfly",
          "Turtle",
          "Cat"
        ]
      },
      {
        "questionNumber": 2,
        "question": "I live in water, breathe through gills, and have no legs. Who am I?",
        "correctAnswer": "Fish",
        "incorrectOptions": [
          "Zebra",
          "Dolphin",
          "Kangaroo"
        ]
      },
      {
        "questionNumber": 3,
        "question": "I fly in the sky, have wings and feathers, and build a nest in a tree. Who am I?",
        "correctAnswer": "Bird",
        "incorrectOptions": [
          "Fish",
          "Pelican",
          "Butterfly"
        ]
      },
      {
        "questionNumber": 4,
        "question": "I am a large animal with a long trunk and wide ears. Who am I?",
        "correctAnswer": "Elephant",
        "incorrectOptions": [
          "Rooster",
          "Rabbit",
          "Cat"
        ]
      },
      {
        "questionNumber": 5,
        "question": "I crawl slowly and carry my house on my back. Who am I?",
        "correctAnswer": "Turtle",
        "incorrectOptions": [
          "Bird",
          "Hyrax",
          "Zebra"
        ]
      },
      {
        "questionNumber": 6,
        "question": "In the morning I crow \"cock-a-doodle-doo\" and wake up the farm. Who am I?",
        "correctAnswer": "Rooster",
        "incorrectOptions": [
          "Turtle",
          "Lion",
          "Elephant"
        ]
      },
      {
        "questionNumber": 7,
        "question": "I am a furry animal that loves to say \"meow\" and chase yarn. Who am I?",
        "correctAnswer": "Cat",
        "incorrectOptions": [
          "Turtle",
          "Zebra",
          "Rooster"
        ]
      },
      {
        "questionNumber": 8,
        "question": "I have black and white stripes and look like a small horse. Who am I?",
        "correctAnswer": "Zebra",
        "incorrectOptions": [
          "Fish",
          "Donkey",
          "Rooster"
        ]
      },
      {
        "questionNumber": 9,
        "question": "I open in the morning toward the sun and close when evening falls, and I have petals. Who am I?",
        "correctAnswer": "Flower",
        "incorrectOptions": [
          "Grass",
          "Tree",
          "Bush"
        ]
      },
      {
        "questionNumber": 10,
        "question": "I fly from flower to flower and have colorful, beautiful wings. Who am I?",
        "correctAnswer": "Butterfly",
        "incorrectOptions": [
          "Bird",
          "Crow",
          "Zebra"
        ]
      }
    ],
    "Activity 2: Household Objects": [
      {
        "questionNumber": 1,
        "question": "I have small wheels and a handle to push, and I help carry toys or groceries. What am I?",
        "correctAnswer": "Cart",
        "incorrectOptions": [
          "Table",
          "Lamp",
          "Cloth"
        ]
      },
      {
        "questionNumber": 2,
        "question": "I have pages and stories or pictures, and you can open me and read. What am I?",
        "correctAnswer": "Book",
        "incorrectOptions": [
          "Cart",
          "Newspaper",
          "Notebook"
        ]
      },
      {
        "questionNumber": 3,
        "question": "When it is cold or raining, you wrap me around your neck to stay warm. What am I?",
        "correctAnswer": "Scarf",
        "incorrectOptions": [
          "Hat",
          "Comb",
          "Coat"
        ]
      },
      {
        "questionNumber": 4,
        "question": "I stand on four legs in the room, and plates or games are placed on me. What am I?",
        "correctAnswer": "Table",
        "incorrectOptions": [
          "Television",
          "Chair",
          "Bed"
        ]
      },
      {
        "questionNumber": 5,
        "question": "I have teeth but I do not bite, and I comb tangled or messy hair. What am I?",
        "correctAnswer": "Comb",
        "incorrectOptions": [
          "Table",
          "Scarf",
          "Pillow"
        ]
      },
      {
        "questionNumber": 6,
        "question": "I light up the room when it is dark, and you can turn me on and off. What am I?",
        "correctAnswer": "Lamp",
        "incorrectOptions": [
          "Moon",
          "Television",
          "Book"
        ]
      },
      {
        "questionNumber": 7,
        "question": "At night you rest your head on me to sleep comfortably. What am I?",
        "correctAnswer": "Pillow",
        "incorrectOptions": [
          "Bed",
          "Blanket",
          "Shirt"
        ]
      },
      {
        "questionNumber": 8,
        "question": "I have a handle, a rim, and a body, and I help you drink water or hot chocolate without spilling. What am I?",
        "correctAnswer": "Cup",
        "incorrectOptions": [
          "Funnel",
          "Pillow",
          "Bottle"
        ]
      },
      {
        "questionNumber": 9,
        "question": "When something spills on the floor, you wipe and clean with me. What am I?",
        "correctAnswer": "Rag",
        "incorrectOptions": [
          "Paper",
          "Towel",
          "Table"
        ]
      },
      {
        "questionNumber": 10,
        "question": "I am closed when not in use, and opened when you want to take out clothes. What am I?",
        "correctAnswer": "Closet",
        "incorrectOptions": [
          "House",
          "Room",
          "Box"
        ]
      }
    ],
    "Activity 3: Food and Sweets": [
      {
        "questionNumber": 1,
        "question": "I am round, green on the outside and red and sweet on the inside, and very tasty in summer. What am I?",
        "correctAnswer": "Watermelon",
        "incorrectOptions": [
          "Clementine",
          "Carrot",
          "Strawberry"
        ]
      },
      {
        "questionNumber": 2,
        "question": "I am yellow, sweet, and easy to peel without a knife. What am I?",
        "correctAnswer": "Banana",
        "incorrectOptions": [
          "Pineapple",
          "Bell pepper",
          "Orange"
        ]
      },
      {
        "questionNumber": 3,
        "question": "I am baked in the oven, sweet and crispy, and sometimes have chocolate or sprinkles on me. What am I?",
        "correctAnswer": "Cookie",
        "incorrectOptions": [
          "Bread",
          "Quiche",
          "Cake"
        ]
      },
      {
        "questionNumber": 4,
        "question": "You drink me cold or hot, and I help build strong bones. What am I?",
        "correctAnswer": "Milk",
        "incorrectOptions": [
          "Water",
          "Juice",
          "Tea"
        ]
      },
      {
        "questionNumber": 5,
        "question": "I am round, hot, and delicious, with red sauce and melted cheese on top. What am I?",
        "correctAnswer": "Pizza",
        "incorrectOptions": [
          "Spaghetti",
          "Lasagna",
          "Cake"
        ]
      },
      {
        "questionNumber": 6,
        "question": "I grow on a tree, can be red, green, or yellow, and sometimes you dip me in honey. What am I?",
        "correctAnswer": "Apple",
        "incorrectOptions": [
          "Banana",
          "Orange",
          "Strawberry"
        ]
      },
      {
        "questionNumber": 7,
        "question": "I am sweet, melt in your mouth, and come in brown, white, or dark colors. What am I?",
        "correctAnswer": "Chocolate",
        "incorrectOptions": [
          "Cookie",
          "Cake",
          "Bread"
        ]
      },
      {
        "questionNumber": 8,
        "question": "I am orange, grow in the ground, and rabbits love to nibble on me. What am I?",
        "correctAnswer": "Carrot",
        "incorrectOptions": [
          "Sweet potato",
          "Butternut squash",
          "Orange"
        ]
      },
      {
        "questionNumber": 9,
        "question": "I am made from bread, and inside me you can put cheese, spread, hummus, or jam. What am I?",
        "correctAnswer": "Sandwich",
        "incorrectOptions": [
          "Pita",
          "Toast",
          "Pancake"
        ]
      },
      {
        "questionNumber": 10,
        "question": "I am cold and sweet, eaten in a cone or on a stick, and come in many flavors. What am I?",
        "correctAnswer": "Ice cream",
        "incorrectOptions": [
          "Snow",
          "Slushie",
          "Milkshake"
        ]
      }
    ],
    "Activity 4: Colors and Shapes": [
      {
        "questionNumber": 1,
        "question": "I have three straight sides and three corners. What shape am I?",
        "correctAnswer": "Triangle",
        "incorrectOptions": [
          "Rectangle",
          "Square",
          "Hexagon"
        ]
      },
      {
        "questionNumber": 2,
        "question": "I have no corners at all, and I am completely round like a ball or a wheel. What shape am I?",
        "correctAnswer": "Circle",
        "incorrectOptions": [
          "Triangle",
          "Square",
          "Pentagon"
        ]
      },
      {
        "questionNumber": 3,
        "question": "I have four sides completely equal in length and four right corners. What shape am I?",
        "correctAnswer": "Square",
        "incorrectOptions": [
          "Rectangle",
          "Octagon",
          "Oval"
        ]
      },
      {
        "questionNumber": 4,
        "question": "This is the color of the sky on a clear day and of the sea. What color am I?",
        "correctAnswer": "Blue",
        "incorrectOptions": [
          "Red",
          "Yellow",
          "Purple"
        ]
      },
      {
        "questionNumber": 5,
        "question": "This is the color of grass and fresh leaves in spring. What color am I?",
        "correctAnswer": "Green",
        "incorrectOptions": [
          "White",
          "Blue",
          "Orange"
        ]
      },
      {
        "questionNumber": 6,
        "question": "This is the color of the sun and of a lemon. What color am I?",
        "correctAnswer": "Yellow",
        "incorrectOptions": [
          "Red",
          "Blue",
          "Orange"
        ]
      },
      {
        "questionNumber": 7,
        "question": "This is the color of a strawberry and of a fire truck. What color am I?",
        "correctAnswer": "Red",
        "incorrectOptions": [
          "Green",
          "White",
          "Purple"
        ]
      },
      {
        "questionNumber": 8,
        "question": "What color do you get when you mix red and yellow?",
        "correctAnswer": "Orange",
        "incorrectOptions": [
          "Blue",
          "Black",
          "Purple"
        ]
      },
      {
        "questionNumber": 9,
        "question": "I have four sides, two long and two short. What shape am I?",
        "correctAnswer": "Rectangle",
        "incorrectOptions": [
          "Square",
          "Triangle",
          "Rhombus"
        ]
      },
      {
        "questionNumber": 10,
        "question": "What color do you get when you mix blue and red?",
        "correctAnswer": "Purple",
        "incorrectOptions": [
          "Brown",
          "Blue",
          "Burgundy"
        ]
      }
    ],
    "Activity 5: Vehicles": [
      {
        "questionNumber": 1,
        "question": "I have two wheels, handlebars, and pedals, and you power me with your legs. What am I?",
        "correctAnswer": "Bicycle",
        "incorrectOptions": [
          "Bus",
          "Ambulance",
          "Ship"
        ]
      },
      {
        "questionNumber": 2,
        "question": "I travel on special tracks and connect many cars together. What am I?",
        "correctAnswer": "Train",
        "incorrectOptions": [
          "Ship",
          "Bus",
          "Fire truck"
        ]
      },
      {
        "questionNumber": 3,
        "question": "I have big wings and fly high in the sky above the clouds. What am I?",
        "correctAnswer": "Airplane",
        "incorrectOptions": [
          "Train",
          "Bus",
          "Helicopter"
        ]
      },
      {
        "questionNumber": 4,
        "question": "I sail on the water and carry passengers or cargo across the sea. What am I?",
        "correctAnswer": "Ship",
        "incorrectOptions": [
          "Helicopter",
          "Ambulance",
          "Bicycle"
        ]
      },
      {
        "questionNumber": 5,
        "question": "I have four wheels, a steering wheel, and doors, and I drive on the road. What am I?",
        "correctAnswer": "Car",
        "incorrectOptions": [
          "Helicopter",
          "Airplane",
          "Fire truck"
        ]
      },
      {
        "questionNumber": 6,
        "question": "I have a flashing siren and a red color, and I help put out fires. What am I?",
        "correctAnswer": "Fire truck",
        "incorrectOptions": [
          "Ship",
          "Airplane",
          "Bicycle"
        ]
      },
      {
        "questionNumber": 7,
        "question": "I am big, travel on a fixed route, and pick up many passengers at stops. What am I?",
        "correctAnswer": "Bus",
        "incorrectOptions": [
          "Airplane",
          "Truck",
          "Car"
        ]
      },
      {
        "questionNumber": 8,
        "question": "I have a propeller spinning on top and can hover in the air and land in a small spot. What am I?",
        "correctAnswer": "Helicopter",
        "incorrectOptions": [
          "Car",
          "Ship",
          "Bicycle"
        ]
      },
      {
        "questionNumber": 9,
        "question": "I have blue-and-red lights and a siren, and I help get quickly to someone who needs medical help. What am I?",
        "correctAnswer": "Ambulance",
        "incorrectOptions": [
          "Airplane",
          "Car",
          "Fire truck"
        ]
      },
      {
        "questionNumber": 10,
        "question": "I am big and strong, and designed to carry very heavy loads. What am I?",
        "correctAnswer": "Truck",
        "incorrectOptions": [
          "Airplane",
          "Fire truck",
          "Ship"
        ]
      }
    ],
    "Activity 6: Time and Seasons": [
      {
        "questionNumber": 1,
        "question": "This is the hottest season of the year, when people go to the beach and pool and summer vacation is long. Which season is it?",
        "correctAnswer": "Summer",
        "incorrectOptions": [
          "Autumn",
          "Spring",
          "Winter"
        ]
      },
      {
        "questionNumber": 2,
        "question": "This is the coldest season of the year, when heavy rain or snow sometimes falls and people wear a thick coat. Which season is it?",
        "correctAnswer": "Winter",
        "incorrectOptions": [
          "Summer",
          "Spring",
          "Autumn"
        ]
      },
      {
        "questionNumber": 3,
        "question": "When I appear in the sky, it means the day is over and night is beginning. Who am I?",
        "correctAnswer": "Moon",
        "incorrectOptions": [
          "Star",
          "Sun",
          "Rainbow"
        ]
      },
      {
        "questionNumber": 4,
        "question": "When I shine high in the sky, it means the day has begun and there is light everywhere. Who am I?",
        "correctAnswer": "Sun",
        "incorrectOptions": [
          "Rainbow",
          "Star",
          "Moon"
        ]
      },
      {
        "questionNumber": 5,
        "question": "This is the season when many flowers bloom and nature wakes up to life. Which season is it?",
        "correctAnswer": "Spring",
        "incorrectOptions": [
          "Summer",
          "Autumn",
          "Winter"
        ]
      },
      {
        "questionNumber": 6,
        "question": "This is the season when yellow and orange leaves fall from the trees and it starts getting cooler. Which season is it?",
        "correctAnswer": "Autumn",
        "incorrectOptions": [
          "Summer",
          "Spring",
          "Winter"
        ]
      },
      {
        "questionNumber": 7,
        "question": "This is the time when we eat breakfast and leave for school or kindergarten. Which part of the day is it?",
        "correctAnswer": "Morning",
        "incorrectOptions": [
          "Night",
          "Noon",
          "Evening"
        ]
      },
      {
        "questionNumber": 8,
        "question": "This is the time when it is dark outside, we go to sleep, and we dream dreams. Which part of the day is it?",
        "correctAnswer": "Night",
        "incorrectOptions": [
          "Noon",
          "Morning",
          "Evening"
        ]
      },
      {
        "questionNumber": 9,
        "question": "There are seven of these in a week, and one of them is Saturday. What is it?",
        "correctAnswer": "Day",
        "incorrectOptions": [
          "Hour",
          "Month",
          "Year"
        ]
      },
      {
        "questionNumber": 10,
        "question": "This is the time when we eat a meal in the middle of the day. Which part of the day is it?",
        "correctAnswer": "Noon",
        "incorrectOptions": [
          "Evening",
          "Morning",
          "Night"
        ]
      }
    ],
    "Activity 7: The Human Body": [
      {
        "questionNumber": 1,
        "question": "We have two of these, and with them we see colors, shapes, and friends. What are they?",
        "correctAnswer": "Eyes",
        "incorrectOptions": [
          "Ears",
          "Nostrils",
          "Teeth"
        ]
      },
      {
        "questionNumber": 2,
        "question": "We have two of these on the sides of our head, and with them we hear music and sounds. What are they?",
        "correctAnswer": "Ears",
        "incorrectOptions": [
          "Eyes",
          "Cheeks",
          "Mouth"
        ]
      },
      {
        "questionNumber": 3,
        "question": "It is in the center of the face and helps smell good scents and also breathe. What is it?",
        "correctAnswer": "Nose",
        "incorrectOptions": [
          "Cheeks",
          "Hair",
          "Teeth"
        ]
      },
      {
        "questionNumber": 4,
        "question": "We have ten of them on our hands and ten on our feet, and with them we hold objects and walk. What are they?",
        "correctAnswer": "Fingers and toes",
        "incorrectOptions": [
          "Legs",
          "Hands",
          "Hair"
        ]
      },
      {
        "questionNumber": 5,
        "question": "We open it to speak, smile, and eat. What is it?",
        "correctAnswer": "Mouth",
        "incorrectOptions": [
          "Belly button",
          "Eye",
          "Nose"
        ]
      },
      {
        "questionNumber": 6,
        "question": "With them we run, jump, and walk from place to place. What are they?",
        "correctAnswer": "Legs",
        "incorrectOptions": [
          "Hands",
          "Teeth",
          "Fingers"
        ]
      },
      {
        "questionNumber": 7,
        "question": "It is at the top of the body, and on it are the eyes, ears, and mouth. What is it?",
        "correctAnswer": "Head",
        "incorrectOptions": [
          "Eyes",
          "Teeth",
          "Nose"
        ]
      },
      {
        "questionNumber": 8,
        "question": "It covers the body from the outside and protects us, and it can be light or dark. What is it?",
        "correctAnswer": "Skin",
        "incorrectOptions": [
          "Fingers",
          "Mouth",
          "Eyes"
        ]
      },
      {
        "questionNumber": 9,
        "question": "These are white rows inside the mouth that help chew food. What are they?",
        "correctAnswer": "Teeth",
        "incorrectOptions": [
          "Mouth",
          "Ears",
          "Nose"
        ]
      },
      {
        "questionNumber": 10,
        "question": "It grows on the head, and you can cut, comb, or tie it. What is it?",
        "correctAnswer": "Hair",
        "incorrectOptions": [
          "Nose",
          "Fingers",
          "Legs"
        ]
      }
    ],
    "Activity 8: Space and Stars": [
      {
        "questionNumber": 1,
        "question": "The big burning ball that lights up and warms Earth during the day. Who am I?",
        "correctAnswer": "Sun",
        "incorrectOptions": [
          "Mars",
          "Gravity",
          "Spaceship"
        ]
      },
      {
        "questionNumber": 2,
        "question": "I appear in the sky at night, and sometimes look like a full circle, a half circle, or shaped like a banana. Who am I?",
        "correctAnswer": "Moon",
        "incorrectOptions": [
          "Earth",
          "Sun",
          "Star"
        ]
      },
      {
        "questionNumber": 3,
        "question": "These are small twinkling points of light seen in the night sky far, far away. What are they?",
        "correctAnswer": "Stars",
        "incorrectOptions": [
          "Moon",
          "Sky",
          "Planets"
        ]
      },
      {
        "questionNumber": 4,
        "question": "I am a special vehicle that flies into space and takes astronauts to the stars or the moon. What am I?",
        "correctAnswer": "Spaceship",
        "incorrectOptions": [
          "Comet",
          "Asteroid",
          "Space rover"
        ]
      },
      {
        "questionNumber": 5,
        "question": "I am our planet where we live, and I have continents, oceans, and air to breathe. What am I?",
        "correctAnswer": "Earth",
        "incorrectOptions": [
          "Uranus",
          "Jupiter",
          "Mars"
        ]
      },
      {
        "questionNumber": 6,
        "question": "I am a person who wears a special suit and travels to explore space. Who am I?",
        "correctAnswer": "Astronaut",
        "incorrectOptions": [
          "Teacher",
          "Police officer",
          "Firefighter"
        ]
      },
      {
        "questionNumber": 7,
        "question": "I am a thick, special suit that protects anyone in space. What am I?",
        "correctAnswer": "Spacesuit",
        "incorrectOptions": [
          "Ski suit",
          "Knight's armor",
          "Diving suit"
        ]
      },
      {
        "questionNumber": 8,
        "question": "I am a red planet sometimes called \"the Red Planet.\" Which planet am I?",
        "correctAnswer": "Mars",
        "incorrectOptions": [
          "Venus",
          "Pluto",
          "Saturn"
        ]
      },
      {
        "questionNumber": 9,
        "question": "I am the force that pulls us down to the ground and keeps us from floating in the air. What am I?",
        "correctAnswer": "Gravity",
        "incorrectOptions": [
          "Wind",
          "Parachute",
          "Balloon"
        ]
      },
      {
        "questionNumber": 10,
        "question": "I am the highest up of all. What am I?",
        "correctAnswer": "Sky",
        "incorrectOptions": [
          "Ceiling",
          "Moon",
          "Roof"
        ]
      }
    ],
    "Activity 9: Magic and Fairy Tales": [
      {
        "questionNumber": 1,
        "question": "I am a large imaginary creature that breathes fire from its mouth and has wings and scales. Who am I?",
        "correctAnswer": "Dragon",
        "incorrectOptions": [
          "Giant",
          "Unicorn",
          "Eagle"
        ]
      },
      {
        "questionNumber": 2,
        "question": "I am a beautiful white horse that in fairy tales has one twisted horn on its forehead. Who am I?",
        "correctAnswer": "Unicorn",
        "incorrectOptions": [
          "Flying horse",
          "Magical deer",
          "Dragon"
        ]
      },
      {
        "questionNumber": 3,
        "question": "I am a small magical figure with wings who knows how to sprinkle fairy dust. Who am I?",
        "correctAnswer": "Fairy",
        "incorrectOptions": [
          "Elf",
          "Witch",
          "Princess"
        ]
      },
      {
        "questionNumber": 4,
        "question": "I am a wooden or metal object waved in the air to cast a spell in fairy tales. What am I?",
        "correctAnswer": "Wand",
        "incorrectOptions": [
          "Sword",
          "Flying broom",
          "Magic key"
        ]
      },
      {
        "questionNumber": 5,
        "question": "I am a large, tall building where a king, queen, or princess sometimes lives in stories. What am I?",
        "correctAnswer": "Castle",
        "incorrectOptions": [
          "Forest cabin",
          "Dragon's cave",
          "Watchtower"
        ]
      },
      {
        "questionNumber": 6,
        "question": "I am a secret passage that opens to another world when you find the right key. What am I?",
        "correctAnswer": "Magic portal",
        "incorrectOptions": [
          "Enchanted mirror",
          "Secret bridge",
          "Treasure chest"
        ]
      },
      {
        "questionNumber": 7,
        "question": "I am a legendary creature that lives under the water and is half fish and half human. Who am I?",
        "correctAnswer": "Mermaid",
        "incorrectOptions": [
          "Sea monster",
          "Fairy",
          "Giant turtle"
        ]
      },
      {
        "questionNumber": 8,
        "question": "I am a thick, special book containing stories about witches, giants, and adventures. What am I?",
        "correctAnswer": "Spellbook",
        "incorrectOptions": [
          "Parchment scroll",
          "Treasure map",
          "Secret diary"
        ]
      },
      {
        "questionNumber": 9,
        "question": "I am a pointed hat associated with wizards and witches in fairy tales. What am I?",
        "correctAnswer": "Wizard hat",
        "incorrectOptions": [
          "King's crown",
          "Magic cloak",
          "Knight's helmet"
        ]
      },
      {
        "questionNumber": 10,
        "question": "I am a closed box that can hide shiny treasure inside. What am I?",
        "correctAnswer": "Treasure chest",
        "incorrectOptions": [
          "Magic potion",
          "Crystal ball",
          "Bag of coins"
        ]
      }
    ],
    "Activity 10: Short Logic Riddles": [
      {
        "questionNumber": 1,
        "question": "Roy has 2 apples and his sister has 2 apples. Who has more apples?",
        "correctAnswer": "Both have the same number",
        "incorrectOptions": [
          "Roy has more",
          "His sister has more",
          "Cannot be known"
        ]
      },
      {
        "questionNumber": 2,
        "question": "One bird is sitting on a branch and one more bird joins it. How many birds are sitting on the branch?",
        "correctAnswer": "2 birds",
        "incorrectOptions": [
          "One bird",
          "3 birds",
          "No birds"
        ]
      },
      {
        "questionNumber": 3,
        "question": "One dog runs fast and one rabbit runs faster. Who arrives first if both start together?",
        "correctAnswer": "The rabbit",
        "incorrectOptions": [
          "The dog",
          "Both arrive together",
          "Cannot be known"
        ]
      },
      {
        "questionNumber": 4,
        "question": "There is a red box and a blue box. Which one has a sticker if the sticker is not in the blue one?",
        "correctAnswer": "In the red box",
        "incorrectOptions": [
          "In the blue box",
          "In both boxes",
          "In neither box"
        ]
      },
      {
        "questionNumber": 5,
        "question": "On the table there are 3 spoons and 2 cups. What are there more of on the table?",
        "correctAnswer": "Spoons",
        "incorrectOptions": [
          "Cups",
          "Both have the same number",
          "Not enough information"
        ]
      },
      {
        "questionNumber": 6,
        "question": "Danny is taller than Michal, and Michal is taller than Noa. Who is the shortest among them?",
        "correctAnswer": "Noa",
        "incorrectOptions": [
          "Danny",
          "Michal",
          "Everyone is the same height"
        ]
      },
      {
        "questionNumber": 7,
        "question": "If you have 3 balloons and one flies away into the sky, how many balloons are left in your hand?",
        "correctAnswer": "2 balloons",
        "incorrectOptions": [
          "3 balloons",
          "One balloon",
          "0 balloons"
        ]
      },
      {
        "questionNumber": 8,
        "question": "On a train there is a first car, a middle car, and a last car. Which car is between the first and the last?",
        "correctAnswer": "The middle car",
        "incorrectOptions": [
          "The first car",
          "The last car",
          "There is no such car"
        ]
      },
      {
        "questionNumber": 9,
        "question": "Jonathan has one dog and Dana has two cats. Who has more pets?",
        "correctAnswer": "Dana",
        "incorrectOptions": [
          "Jonathan",
          "Both have the same number",
          "Nobody has any"
        ]
      },
      {
        "questionNumber": 10,
        "question": "If you are standing in line and someone is standing right behind me, who comes after me?",
        "correctAnswer": "The person behind me",
        "incorrectOptions": [
          "The person in front of me",
          "Me",
          "Nobody"
        ]
      }
    ],
    "Activity 11: Detective Challenges": [
      {
        "questionNumber": 1,
        "question": "We found an eraser, a pencil, and an open notebook with a drawing on the table. What was probably done here a moment ago?",
        "correctAnswer": "Writing or drawing",
        "incorrectOptions": [
          "Cooking a meal",
          "Putting together a puzzle",
          "Playing ball"
        ]
      },
      {
        "questionNumber": 2,
        "question": "In the room there is a puddle of water near an open window after a gray cloud. What probably happened outside?",
        "correctAnswer": "It rained",
        "incorrectOptions": [
          "The sun shone",
          "It snowed",
          "A warm wind blew"
        ]
      },
      {
        "questionNumber": 3,
        "question": "On the floor lie five puzzle pieces and an open box next to them. What were they trying to put together?",
        "correctAnswer": "A puzzle",
        "incorrectOptions": [
          "Lego",
          "A block tower",
          "A toy train"
        ]
      },
      {
        "questionNumber": 4,
        "question": "Next to the door lie a pair of wet shoes and a closed umbrella. What probably happened a moment ago?",
        "correctAnswer": "Someone came in from outside",
        "incorrectOptions": [
          "Someone went to sleep",
          "Someone made food",
          "Someone cleaned the house"
        ]
      },
      {
        "questionNumber": 5,
        "question": "On the table there is an empty cup with a little hot chocolate at the bottom and a straw. What was drunk here?",
        "correctAnswer": "Hot chocolate",
        "incorrectOptions": [
          "Orange juice",
          "Water",
          "Hot tea"
        ]
      },
      {
        "questionNumber": 6,
        "question": "Next to the dog's water bowl are a few pieces of dry food. Who ate here earlier?",
        "correctAnswer": "The dog",
        "incorrectOptions": [
          "The cat",
          "The bird",
          "The rabbit"
        ]
      },
      {
        "questionNumber": 7,
        "question": "In the drawer were found scissors, colored paper, and glue. What activity are they about to do?",
        "correctAnswer": "Arts and crafts",
        "incorrectOptions": [
          "Baking",
          "Cleaning",
          "Math homework"
        ]
      },
      {
        "questionNumber": 8,
        "question": "On the couch lie a folded blanket and a small teddy bear. Where did they probably rest?",
        "correctAnswer": "On the couch",
        "incorrectOptions": [
          "In the kitchen",
          "In the yard",
          "In the bathroom"
        ]
      },
      {
        "questionNumber": 9,
        "question": "Next to the drawing board are colored chalks and a board eraser. What did they do on the board?",
        "correctAnswer": "They drew",
        "incorrectOptions": [
          "They hung laundry",
          "They stuck stickers",
          "They read a book"
        ]
      },
      {
        "questionNumber": 10,
        "question": "In the school backpack there is a pencil case, a water bottle, and a lunch box. Where are they going with this bag?",
        "correctAnswer": "To school",
        "incorrectOptions": [
          "To the pool",
          "Grocery shopping",
          "Sleeping over at a friend's"
        ]
      }
    ],
    "Activity 12: Master Riddles": [
      {
        "questionNumber": 1,
        "question": "I have a face and hands, but no eyes, mouth, or legs, and I help tell the time. What am I?",
        "correctAnswer": "Clock",
        "incorrectOptions": [
          "Compass",
          "Phone",
          "Calendar"
        ]
      },
      {
        "questionNumber": 2,
        "question": "I fill up with water when I am on a plate, but when you wipe me I disappear. What am I?",
        "correctAnswer": "Water",
        "incorrectOptions": [
          "Soup",
          "Juice",
          "Milk"
        ]
      },
      {
        "questionNumber": 3,
        "question": "The more you take away from me, the bigger I get. What am I?",
        "correctAnswer": "Hole",
        "incorrectOptions": [
          "Tunnel",
          "Cave",
          "Trench"
        ]
      },
      {
        "questionNumber": 4,
        "question": "I have blades, but I do not eat – I help cut paper or fabric. What am I?",
        "correctAnswer": "Scissors",
        "incorrectOptions": [
          "Knife",
          "Fork",
          "Peeler"
        ]
      },
      {
        "questionNumber": 5,
        "question": "I go up when you throw me, but I always come back down in the end. What am I?",
        "correctAnswer": "Ball",
        "incorrectOptions": [
          "Balloon",
          "Kite",
          "Boomerang"
        ]
      },
      {
        "questionNumber": 6,
        "question": "I have pages, but I am not a tree, and I have staples or a cover. What am I?",
        "correctAnswer": "Notebook",
        "incorrectOptions": [
          "Book",
          "Diary",
          "Pad"
        ]
      },
      {
        "questionNumber": 7,
        "question": "I get wet when I dry you after a shower. What am I?",
        "correctAnswer": "Towel",
        "incorrectOptions": [
          "Bathrobe",
          "Soap",
          "Bath mat"
        ]
      },
      {
        "questionNumber": 8,
        "question": "I have wheels, but I am not a car, and I roll on the floor when you push me. What am I?",
        "correctAnswer": "Toy wagon",
        "incorrectOptions": [
          "Scooter",
          "Skateboard",
          "Toy truck"
        ]
      },
      {
        "questionNumber": 9,
        "question": "When I stand near the light, I copy your every move on the wall or floor. Who am I?",
        "correctAnswer": "Shadow",
        "incorrectOptions": [
          "Reflection",
          "Doll",
          "Mirror"
        ]
      },
      {
        "questionNumber": 10,
        "question": "I have many holes, yet I hold water or soap bubbles. What am I?",
        "correctAnswer": "Sponge",
        "incorrectOptions": [
          "Strainer",
          "Pillow",
          "Cloth"
        ]
      }
    ]
  },
  "Ages 8-9": {
    "Activity 1: Animals and Nature": [
      {
        "questionNumber": 1,
        "question": "I live in dense forests, have thick brown fur, and love honey, fruit, and fish. Who am I?",
        "correctAnswer": "Bear",
        "incorrectOptions": [
          "Wolf",
          "Wild boar",
          "Deer"
        ]
      },
      {
        "questionNumber": 2,
        "question": "I am a quiet nocturnal bird, have large eyes that see in the dark, and turn my head in almost every direction. Who am I?",
        "correctAnswer": "Owl",
        "incorrectOptions": [
          "Crow",
          "Hawk",
          "Pigeon"
        ]
      },
      {
        "questionNumber": 3,
        "question": "I live in the desert, can walk for many days without drinking much water, and have one or two humps on my back. Who am I?",
        "correctAnswer": "Camel",
        "incorrectOptions": [
          "Horse",
          "Donkey",
          "Lizard"
        ]
      },
      {
        "questionNumber": 4,
        "question": "I am an amphibian that lives both in water and on land, starts as a tadpole, and jumps in long leaps. Who am I?",
        "correctAnswer": "Frog",
        "incorrectOptions": [
          "Toad",
          "Salamander",
          "Water turtle"
        ]
      },
      {
        "questionNumber": 5,
        "question": "I am a large, intelligent marine mammal that lives in the ocean and comes up to breathe air from time to time. Who am I?",
        "correctAnswer": "Whale",
        "incorrectOptions": [
          "Dolphin",
          "Shark",
          "Seal"
        ]
      },
      {
        "questionNumber": 6,
        "question": "I am a small insect that works in a hive, collects nectar from flowers, and produces sweet honey. Who am I?",
        "correctAnswer": "Bee",
        "incorrectOptions": [
          "Wasp",
          "Butterfly",
          "Ant"
        ]
      },
      {
        "questionNumber": 7,
        "question": "I am a very fast predator with spotted fur that lives in the savanna and can run at high speed for a short distance. Who am I?",
        "correctAnswer": "Cheetah",
        "incorrectOptions": [
          "Leopard",
          "Lion",
          "Hyena"
        ]
      },
      {
        "questionNumber": 8,
        "question": "I am a nocturnal animal, have leathery wings, and navigate in the dark using sound waves. Who am I?",
        "correctAnswer": "Bat",
        "incorrectOptions": [
          "Hedgehog",
          "Badger",
          "Owl"
        ]
      },
      {
        "questionNumber": 9,
        "question": "I am a long reptile with no legs that sheds its skin as it grows. Who am I?",
        "correctAnswer": "Snake",
        "incorrectOptions": [
          "Lizard",
          "Chameleon",
          "Iguana"
        ]
      },
      {
        "questionNumber": 10,
        "question": "I am a seabird that dives into cold water and swims swiftly, but does not fly in the air. Who am I?",
        "correctAnswer": "Penguin",
        "incorrectOptions": [
          "Seagull",
          "Pelican",
          "Albatross"
        ]
      }
    ],
    "Activity 2: Household Objects": [
      {
        "questionNumber": 1,
        "question": "I am in the kitchen, cool on the inside, and keep milk, vegetables, and eggs from spoiling. What am I?",
        "correctAnswer": "Refrigerator",
        "incorrectOptions": [
          "Freezer",
          "Oven",
          "Dishwasher"
        ]
      },
      {
        "questionNumber": 2,
        "question": "I display moving pictures and sound, and you sit in front of me to watch a movie or a show. What am I?",
        "correctAnswer": "Television",
        "incorrectOptions": [
          "Projector",
          "Radio",
          "Speaker"
        ]
      },
      {
        "questionNumber": 3,
        "question": "I have a screen and a keyboard or mouse, and I help you write, search for information, and play. What am I?",
        "correctAnswer": "Computer",
        "incorrectOptions": [
          "Tablet",
          "Television",
          "Printer"
        ]
      },
      {
        "questionNumber": 4,
        "question": "I am an appliance that heats or cooks food quickly using special waves. What am I?",
        "correctAnswer": "Microwave",
        "incorrectOptions": [
          "Toaster",
          "Kettle",
          "Oven"
        ]
      },
      {
        "questionNumber": 5,
        "question": "I have a round opening, spin with water and soap, and wash dirty clothes. What am I?",
        "correctAnswer": "Washing machine",
        "incorrectOptions": [
          "Clothes dryer",
          "Dishwasher",
          "Water heater"
        ]
      },
      {
        "questionNumber": 6,
        "question": "I hang on the wall or stand in the room, and show you a reflection of yourself. What am I?",
        "correctAnswer": "Mirror",
        "incorrectOptions": [
          "Picture",
          "Window",
          "Wall clock"
        ]
      },
      {
        "questionNumber": 7,
        "question": "I have a latch and a key that locks or unlocks a door. What am I?",
        "correctAnswer": "Lock",
        "incorrectOptions": [
          "Door handle",
          "Doorbell",
          "Door hinge"
        ]
      },
      {
        "questionNumber": 8,
        "question": "I am an appliance that helps suck up dust and crumbs from the floor and carpet. What am I?",
        "correctAnswer": "Vacuum cleaner",
        "incorrectOptions": [
          "Squeegee",
          "Broom",
          "Floor cloth"
        ]
      },
      {
        "questionNumber": 9,
        "question": "I have small wheels, am movable around the room, and am comfortable to sit on at a desk. What am I?",
        "correctAnswer": "Office chair",
        "incorrectOptions": [
          "Stool",
          "Armchair",
          "Side table"
        ]
      },
      {
        "questionNumber": 10,
        "question": "I heat or cool the air in the room according to the temperature you choose. What am I?",
        "correctAnswer": "Air conditioner",
        "incorrectOptions": [
          "Fan",
          "Space heater",
          "Air purifier"
        ]
      }
    ],
    "Activity 3: Food and Sweets": [
      {
        "questionNumber": 1,
        "question": "I am a sour yellow fruit whose juice is squeezed and added to dressing or tea. Which fruit am I?",
        "correctAnswer": "Lemon",
        "incorrectOptions": [
          "Banana",
          "Pear",
          "Mango"
        ]
      },
      {
        "questionNumber": 2,
        "question": "I am a small round green vegetable that grows inside a pod, and many children like me boiled or steamed. What am I?",
        "correctAnswer": "Peas",
        "incorrectOptions": [
          "Green beans",
          "Broccoli",
          "Cucumber"
        ]
      },
      {
        "questionNumber": 3,
        "question": "I am a food made of baked dough, sweet or savory, and sometimes filled with cheese, chocolate, or fruit. What am I?",
        "correctAnswer": "Pastry",
        "incorrectOptions": [
          "Cookie",
          "Pancake",
          "Bread"
        ]
      },
      {
        "questionNumber": 4,
        "question": "I am a sweet spread made from ground nuts and cocoa, easily spread on bread or cake. What am I?",
        "correctAnswer": "Chocolate hazelnut spread",
        "incorrectOptions": [
          "Peanut butter",
          "Halva spread",
          "Dulce de leche"
        ]
      },
      {
        "questionNumber": 5,
        "question": "I am a round orange fruit rich in vitamin C and easy to peel. Which fruit am I?",
        "correctAnswer": "Orange",
        "incorrectOptions": [
          "Clementine",
          "Peach",
          "Persimmon"
        ]
      },
      {
        "questionNumber": 6,
        "question": "I am a hot drink made by steeping leaves or herbs in boiling water, and sometimes mint or lemon is added to me. What am I?",
        "correctAnswer": "Tea",
        "incorrectOptions": [
          "Coffee",
          "Hot chocolate",
          "Clear broth"
        ]
      },
      {
        "questionNumber": 7,
        "question": "I am a salty, crunchy snack made from heated corn kernels. What am I?",
        "correctAnswer": "Popcorn",
        "incorrectOptions": [
          "Pretzels",
          "Potato chips",
          "Rice cakes"
        ]
      },
      {
        "questionNumber": 8,
        "question": "I am a soft white dairy product made from fermented milk and can be eaten plain or with fruit. What am I?",
        "correctAnswer": "Yogurt",
        "incorrectOptions": [
          "Cream cheese",
          "Cottage cheese",
          "Sour cream"
        ]
      },
      {
        "questionNumber": 9,
        "question": "I am a small purple or green fruit that grows in clusters on a vine. Which fruit am I?",
        "correctAnswer": "Grapes",
        "incorrectOptions": [
          "Plums",
          "Cherries",
          "Strawberries"
        ]
      },
      {
        "questionNumber": 10,
        "question": "I am a brownish-yellow powdered spice that smells wonderful and is added to cakes and porridge. What am I?",
        "correctAnswer": "Cinnamon",
        "incorrectOptions": [
          "Turmeric",
          "Paprika",
          "Cardamom"
        ]
      }
    ],
    "Activity 4: Colors and Shapes": [
      {
        "questionNumber": 1,
        "question": "I have six equal sides and six corners, and I resemble a honeycomb cell. What shape am I?",
        "correctAnswer": "Hexagon",
        "incorrectOptions": [
          "Pentagon",
          "Octagon",
          "Triangle"
        ]
      },
      {
        "questionNumber": 2,
        "question": "I am a three-dimensional shape whose faces are all equal squares, like a game die. What shape am I?",
        "correctAnswer": "Cube",
        "incorrectOptions": [
          "Rectangular prism",
          "Pyramid",
          "Prism"
        ]
      },
      {
        "questionNumber": 3,
        "question": "I am a three-dimensional shape completely round from every direction, like planet Earth. What shape am I?",
        "correctAnswer": "Sphere",
        "incorrectOptions": [
          "Cylinder",
          "Cone",
          "Oval"
        ]
      },
      {
        "questionNumber": 4,
        "question": "This is a light color obtained when you mix red with white. What color is it?",
        "correctAnswer": "Pink",
        "incorrectOptions": [
          "Orange",
          "Purple",
          "Peach"
        ]
      },
      {
        "questionNumber": 5,
        "question": "This is a dark color created when many colors are mixed together or black is added. What color is it?",
        "correctAnswer": "Brown",
        "incorrectOptions": [
          "Gray",
          "Dark blue",
          "Dark purple"
        ]
      },
      {
        "questionNumber": 6,
        "question": "I have five pointed vertices and am recognized as the symbol of a star in the sky. What shape am I?",
        "correctAnswer": "Star",
        "incorrectOptions": [
          "Hexagon",
          "Heart",
          "Arrow"
        ]
      },
      {
        "questionNumber": 7,
        "question": "I am a three-dimensional shape with a circular base and a pointed vertex on top, like an upside-down ice cream cone. What shape am I?",
        "correctAnswer": "Cone",
        "incorrectOptions": [
          "Cylinder",
          "Sphere",
          "Pyramid"
        ]
      },
      {
        "questionNumber": 8,
        "question": "This is a color that often appears in a rainbow between blue and violet. What color is it?",
        "correctAnswer": "Indigo",
        "incorrectOptions": [
          "Turquoise",
          "Light blue",
          "Burgundy"
        ]
      },
      {
        "questionNumber": 9,
        "question": "I have four equal sides, but my angles are not right angles, and I look like a tilted square. What shape am I?",
        "correctAnswer": "Rhombus",
        "incorrectOptions": [
          "Rectangle",
          "Trapezoid",
          "Kite"
        ]
      },
      {
        "questionNumber": 10,
        "question": "This is a light shade of green obtained when white or yellow is added to green. What color is it?",
        "correctAnswer": "Light green",
        "incorrectOptions": [
          "Olive green",
          "Turquoise",
          "Lemon yellow"
        ]
      }
    ],
    "Activity 5: Vehicles": [
      {
        "questionNumber": 1,
        "question": "I travel beneath the surface of the water and allow a crew to explore the depths without getting wet. What am I?",
        "correctAnswer": "Submarine",
        "incorrectOptions": [
          "Motorboat",
          "Ferry",
          "Inflatable boat"
        ]
      },
      {
        "questionNumber": 2,
        "question": "I have four wheels and a steering wheel, and I usually carry a family or small group between cities. What am I?",
        "correctAnswer": "Car",
        "incorrectOptions": [
          "Bus",
          "Minivan",
          "Camper van"
        ]
      },
      {
        "questionNumber": 3,
        "question": "I run on rails and carry passengers in connected cars between cities. What am I?",
        "correctAnswer": "Light rail",
        "incorrectOptions": [
          "Subway",
          "Bus",
          "Taxi"
        ]
      },
      {
        "questionNumber": 4,
        "question": "I am a small or medium-sized aircraft that uses a relatively short runway for takeoff and landing. What am I?",
        "correctAnswer": "Small airplane",
        "incorrectOptions": [
          "Helicopter",
          "Glider",
          "Hot air balloon"
        ]
      },
      {
        "questionNumber": 5,
        "question": "I am a large vessel that carries giant containers from one port to another around the world. What am I?",
        "correctAnswer": "Container ship",
        "incorrectOptions": [
          "Oil tanker",
          "Fishing boat",
          "Yacht"
        ]
      },
      {
        "questionNumber": 6,
        "question": "I am a two-wheeled motor vehicle that allows fast movement between cars. What am I?",
        "correctAnswer": "Motorcycle",
        "incorrectOptions": [
          "Electric scooter",
          "Bicycle",
          "Tricycle"
        ]
      },
      {
        "questionNumber": 7,
        "question": "I am an off-road vehicle with strong drive designed to travel on unpaved roads, sand, and rocks. What am I?",
        "correctAnswer": "Off-road vehicle",
        "incorrectOptions": [
          "Tractor",
          "City car",
          "Truck"
        ]
      },
      {
        "questionNumber": 8,
        "question": "I am an open or closed railway car pulled by a locomotive and designed to transport equipment or goods. What am I?",
        "correctAnswer": "Freight car",
        "incorrectOptions": [
          "Passenger car",
          "Locomotive",
          "Cable car"
        ]
      },
      {
        "questionNumber": 9,
        "question": "I am a light watercraft propelled by the wind blowing into a sail. What am I?",
        "correctAnswer": "Sailboat",
        "incorrectOptions": [
          "Rowboat",
          "Kayak",
          "Jet ski"
        ]
      },
      {
        "questionNumber": 10,
        "question": "I am a vehicle that runs on a special track inside a city and has regular stops along the route. What am I?",
        "correctAnswer": "Tram",
        "incorrectOptions": [
          "Bus",
          "Taxi",
          "Bicycle"
        ]
      }
    ],
    "Activity 6: Time and Seasons": [
      {
        "questionNumber": 1,
        "question": "In the Hebrew calendar, this is the first month of the year and of the Tishrei holidays. Which month is it?",
        "correctAnswer": "Tishrei",
        "incorrectOptions": [
          "Nisan",
          "Elul",
          "Cheshvan"
        ]
      },
      {
        "questionNumber": 2,
        "question": "It has 60 seconds, and 60 of these make up one hour. What is it?",
        "correctAnswer": "Minute",
        "incorrectOptions": [
          "Hour",
          "Second",
          "Quarter hour"
        ]
      },
      {
        "questionNumber": 3,
        "question": "A full day consists of 24 hours, starting at midnight and ending at the next midnight. What is it?",
        "correctAnswer": "Day",
        "incorrectOptions": [
          "24-hour period",
          "Week",
          "Night"
        ]
      },
      {
        "questionNumber": 4,
        "question": "A period of 12 months in which Earth completes one orbit around the Sun. What is it?",
        "correctAnswer": "Year",
        "incorrectOptions": [
          "Decade",
          "Month",
          "Half year"
        ]
      },
      {
        "questionNumber": 5,
        "question": "A unit of time longer than a week and shorter than a year, usually having 30 or 31 days; February has 28 or 29 days. What is it?",
        "correctAnswer": "Month",
        "incorrectOptions": [
          "Week",
          "Quarter",
          "Year"
        ]
      },
      {
        "questionNumber": 6,
        "question": "This is the day when school starts after the long summer vacation. What event is it?",
        "correctAnswer": "Back to school",
        "incorrectOptions": [
          "Start of summer vacation",
          "Sports day",
          "End of semester"
        ]
      },
      {
        "questionNumber": 7,
        "question": "This is the part of the day when the sun sets and the light fades toward night. Which part is it?",
        "correctAnswer": "Evening",
        "incorrectOptions": [
          "Morning",
          "Noon",
          "Dawn"
        ]
      },
      {
        "questionNumber": 8,
        "question": "This is a fixed series of seven days that repeats over and over again. What is it?",
        "correctAnswer": "Week",
        "incorrectOptions": [
          "Weekend",
          "Month",
          "24-hour period"
        ]
      },
      {
        "questionNumber": 9,
        "question": "This is the part of the day when the sun rises and the light grows stronger. Which part is it?",
        "correctAnswer": "Morning",
        "incorrectOptions": [
          "Evening",
          "Noon",
          "Night"
        ]
      },
      {
        "questionNumber": 10,
        "question": "This is a phenomenon in which the changing of seasons causes changes in temperature and day length. What is it?",
        "correctAnswer": "Season of the year",
        "incorrectOptions": [
          "Day and night",
          "Month of the year",
          "Solar eclipse"
        ]
      }
    ],
    "Activity 7: The Human Body": [
      {
        "questionNumber": 1,
        "question": "This is a muscular organ that beats non-stop and pumps blood to all parts of the body. What organ is this?",
        "correctAnswer": "Heart",
        "incorrectOptions": [
          "Lungs",
          "Stomach",
          "Liver"
        ]
      },
      {
        "questionNumber": 2,
        "question": "These are a pair of organs in the chest that help us breathe air, take in oxygen, and release carbon dioxide. What are they?",
        "correctAnswer": "Lungs",
        "incorrectOptions": [
          "Kidneys",
          "Heart",
          "Muscles"
        ]
      },
      {
        "questionNumber": 3,
        "question": "This is the part of the skeleton that protects the brain from impacts. What is it?",
        "correctAnswer": "Skull",
        "incorrectOptions": [
          "Spine",
          "Sternum",
          "Femur"
        ]
      },
      {
        "questionNumber": 4,
        "question": "This is an organ inside the head that allows us to think, learn, remember, and feel. What is it?",
        "correctAnswer": "Brain",
        "incorrectOptions": [
          "Heart",
          "Spinal cord",
          "Inner ear"
        ]
      },
      {
        "questionNumber": 5,
        "question": "These are hard parts in the body connected together to form the skeleton that supports us. What are they?",
        "correctAnswer": "Bones",
        "incorrectOptions": [
          "Muscles",
          "Tendons",
          "Cartilage"
        ]
      },
      {
        "questionNumber": 6,
        "question": "This is the place where two bones meet and bend, such as in the elbow or knee. What is it called?",
        "correctAnswer": "Joint",
        "incorrectOptions": [
          "Muscle",
          "Bone",
          "Ligament"
        ]
      },
      {
        "questionNumber": 7,
        "question": "This is a red fluid that flows through vessels in the body and carries oxygen and nutrients to all cells. What is it?",
        "correctAnswer": "Blood",
        "incorrectOptions": [
          "Lymph",
          "Digestive juices",
          "Water"
        ]
      },
      {
        "questionNumber": 8,
        "question": "This is the long part of the leg starting below the thigh and reaching down to the ankle. Which part is it?",
        "correctAnswer": "Lower leg",
        "incorrectOptions": [
          "Thigh",
          "Forearm",
          "Upper arm"
        ]
      },
      {
        "questionNumber": 9,
        "question": "This is the organ through which food passes after swallowing on its way to digestion. What is it?",
        "correctAnswer": "Esophagus",
        "incorrectOptions": [
          "Trachea",
          "Stomach",
          "Small intestine"
        ]
      },
      {
        "questionNumber": 10,
        "question": "This is the part of the arm located between the shoulder and the elbow. Which part is it?",
        "correctAnswer": "Upper arm",
        "incorrectOptions": [
          "Forearm",
          "Hand",
          "Lower leg"
        ]
      }
    ],
    "Activity 8: Space and Stars": [
      {
        "questionNumber": 1,
        "question": "This is the largest planet in our solar system, and it has a Great Red Spot. Which planet is it?",
        "correctAnswer": "Jupiter",
        "incorrectOptions": [
          "Saturn",
          "Mars",
          "Neptune"
        ]
      },
      {
        "questionNumber": 2,
        "question": "This is the planet famous for the impressive, bright rings surrounding it. Which planet is it?",
        "correctAnswer": "Saturn",
        "incorrectOptions": [
          "Jupiter",
          "Uranus",
          "Venus"
        ]
      },
      {
        "questionNumber": 3,
        "question": "This is the circular or elliptical path in which a planet revolves around another star, like Earth around the Sun. What is it called?",
        "correctAnswer": "Orbit",
        "incorrectOptions": [
          "Rotation",
          "Equator",
          "Gravity"
        ]
      },
      {
        "questionNumber": 4,
        "question": "This is an optical instrument that magnifies very distant objects in the sky so we can see stars and moons. What is it?",
        "correctAnswer": "Telescope",
        "incorrectOptions": [
          "Microscope",
          "Binoculars",
          "Compass"
        ]
      },
      {
        "questionNumber": 5,
        "question": "This is a chunk of rock, dust, and ice that orbits the Sun and sometimes displays a glowing tail. What is it?",
        "correctAnswer": "Comet",
        "incorrectOptions": [
          "Meteor",
          "Asteroid",
          "Moon"
        ]
      },
      {
        "questionNumber": 6,
        "question": "This is a giant system of billions of stars, gas, and dust held together by gravity. What is it called?",
        "correctAnswer": "Galaxy",
        "incorrectOptions": [
          "Solar system",
          "Nebula",
          "Star cluster"
        ]
      },
      {
        "questionNumber": 7,
        "question": "This is an object that revolves around a planet or satellite, like the Moon revolving around Earth. What is it?",
        "correctAnswer": "Satellite",
        "incorrectOptions": [
          "Star",
          "Comet",
          "Dwarf planet"
        ]
      },
      {
        "questionNumber": 8,
        "question": "This is the region beyond Earth's atmosphere where there is almost no air and gravity is different. What is it?",
        "correctAnswer": "Space",
        "incorrectOptions": [
          "Sky",
          "Stratosphere",
          "Universe"
        ]
      },
      {
        "questionNumber": 9,
        "question": "This is the closest planet to the Sun in our solar system. Which planet is it?",
        "correctAnswer": "Mercury",
        "incorrectOptions": [
          "Venus",
          "Mars",
          "Jupiter"
        ]
      },
      {
        "questionNumber": 10,
        "question": "This is the layer of gases surrounding Earth that partially protects us from radiation and small meteors. What is it called?",
        "correctAnswer": "Atmosphere",
        "incorrectOptions": [
          "Ionosphere",
          "Space",
          "Ozone"
        ]
      }
    ],
    "Activity 9: Magic and Fairy Tales": [
      {
        "questionNumber": 1,
        "question": "This is a small or large key that opens a locked chest, but does not open any ordinary door in the room. What is special about it?",
        "correctAnswer": "Magic key",
        "incorrectOptions": [
          "Enchanted lock",
          "Music box",
          "Magic medallion"
        ]
      },
      {
        "questionNumber": 2,
        "question": "This is a mysterious potion or liquid in fairy tales; whoever drinks it changes shape or gains a special power. What is it?",
        "correctAnswer": "Magic potion",
        "incorrectOptions": [
          "Fairy dust",
          "Enchanted fruit",
          "Magic ring"
        ]
      },
      {
        "questionNumber": 3,
        "question": "This is a special mirror in fairy tales that not only reflects your face, but answers questions or shows distant places. What is it?",
        "correctAnswer": "Magic mirror",
        "incorrectOptions": [
          "Crystal ball",
          "Magic window",
          "Talking picture"
        ]
      },
      {
        "questionNumber": 4,
        "question": "This is a magical bridge that suddenly appears between two cliffs or two worlds and disappears after you cross it. What is special about it?",
        "correctAnswer": "Magic bridge",
        "incorrectOptions": [
          "Vanishing path",
          "Cloud gate",
          "Time tunnel"
        ]
      },
      {
        "questionNumber": 5,
        "question": "This is a legendary creature living deep in the forest, very short, with a hat or a long beard. Who is it?",
        "correctAnswer": "Dwarf",
        "incorrectOptions": [
          "Elf",
          "Troll",
          "Woodland sprite"
        ]
      },
      {
        "questionNumber": 6,
        "question": "These are wings that suddenly appear on your back and allow you to fly over branches and mountains. What are they?",
        "correctAnswer": "Wings",
        "incorrectOptions": [
          "Flying boots",
          "Flying cloak",
          "Flying carpet"
        ]
      },
      {
        "questionNumber": 7,
        "question": "This is a secret door hidden behind a curtain, bookshelf, or bushes. What characterizes it?",
        "correctAnswer": "Secret door",
        "incorrectOptions": [
          "Hidden room",
          "Secret cellar",
          "Vanishing hatch"
        ]
      },
      {
        "questionNumber": 8,
        "question": "This is an hourglass or magical clock that can slow down time or turn back a brief moment. What is special about it?",
        "correctAnswer": "Magic clock",
        "incorrectOptions": [
          "Time compass",
          "Time stone",
          "Book of memories"
        ]
      },
      {
        "questionNumber": 9,
        "question": "This is a sparkling stone that glows in the dark without a battery or flame. What kind of stone is it?",
        "correctAnswer": "Glowing stone",
        "incorrectOptions": [
          "Magic diamond",
          "Eternal torch",
          "Magic flashlight"
        ]
      },
      {
        "questionNumber": 10,
        "question": "This is a mysterious voice that whispers a clue from inside a cave or forest to help a traveler find the way. What is it?",
        "correctAnswer": "Mysterious voice",
        "incorrectOptions": [
          "Returning echo",
          "Forest song",
          "Whisper of the wind"
        ]
      }
    ],
    "Activity 10: Short Logic Riddles": [
      {
        "questionNumber": 1,
        "question": "In a closet there are 4 blue shirts and 2 red shirts. If you pull out one shirt without looking, which color is most likely to come out?",
        "correctAnswer": "Blue",
        "incorrectOptions": [
          "Red",
          "Both colors have an equal chance",
          "Cannot be known"
        ]
      },
      {
        "questionNumber": 2,
        "question": "Danny, Noa, and Itay are standing in line. Danny is not first, and Itay is standing right after Noa. Who is standing first?",
        "correctAnswer": "Noa",
        "incorrectOptions": [
          "Danny",
          "Itay",
          "Impossible to know"
        ]
      },
      {
        "questionNumber": 3,
        "question": "One box is heavy and a second box is light. If you place the light one inside the heavy one, which box is heavier now?",
        "correctAnswer": "The heavy one",
        "incorrectOptions": [
          "The light one",
          "Both are equal in weight",
          "Neither"
        ]
      },
      {
        "questionNumber": 4,
        "question": "On a table there are 5 pencils. You take 2 pencils. How many pencils remain on the table?",
        "correctAnswer": "3",
        "incorrectOptions": [
          "2",
          "5",
          "7"
        ]
      },
      {
        "questionNumber": 5,
        "question": "If a dog is shorter than a cat, and a cat is shorter than a horse, which is the tallest of the three?",
        "correctAnswer": "The horse",
        "incorrectOptions": [
          "The cat",
          "The dog",
          "All are the same height"
        ]
      },
      {
        "questionNumber": 6,
        "question": "There are three jugs: the first jug has water, the second jug has juice, and the third jug has nothing. Which jug is easiest to lift?",
        "correctAnswer": "The third jug",
        "incorrectOptions": [
          "The first jug",
          "The second jug",
          "All three are equal"
        ]
      },
      {
        "questionNumber": 7,
        "question": "Yael is older than Lior, and Lior is older than Ido. Who is the youngest among them?",
        "correctAnswer": "Ido",
        "incorrectOptions": [
          "Yael",
          "Lior",
          "All are the same age"
        ]
      },
      {
        "questionNumber": 8,
        "question": "In a room there are 3 lit lightbulbs. You turn off one lightbulb. How many lightbulbs remain lit?",
        "correctAnswer": "2",
        "incorrectOptions": [
          "1",
          "3",
          "0"
        ]
      },
      {
        "questionNumber": 9,
        "question": "There is a rope 10 meters long and you cut it in half. What is the length of each half?",
        "correctAnswer": "5",
        "incorrectOptions": [
          "10",
          "2",
          "20"
        ]
      },
      {
        "questionNumber": 10,
        "question": "Roni has 3 books, and her friend has twice as many books as Roni. How many books does her friend have?",
        "correctAnswer": "6",
        "incorrectOptions": [
          "3",
          "5",
          "9"
        ]
      }
    ],
    "Activity 11: Detective Challenges": [
      {
        "questionNumber": 1,
        "question": "We found on the table an eraser covered in rubber crumbs, a scribbled page, and a torn sheet next to it. What probably happened?",
        "correctAnswer": "Someone erased and rewrote",
        "incorrectOptions": [
          "Someone painted with watercolors",
          "Someone cut out puzzle figures",
          "Someone stuck stickers"
        ]
      },
      {
        "questionNumber": 2,
        "question": "In the yard there are muddy footprints leading from the path to the front door, and the door is slightly open. What probably happened?",
        "correctAnswer": "Someone came in from outside",
        "incorrectOptions": [
          "Someone watered the potted plants",
          "Someone closed the window",
          "Someone washed the floor"
        ]
      },
      {
        "questionNumber": 3,
        "question": "Next to a fruit bowl are banana peels and apple cores, while the bowl itself is almost empty. What was done here?",
        "correctAnswer": "Someone ate fruit",
        "incorrectOptions": [
          "Someone made a vegetable salad",
          "Someone arranged bowls",
          "Someone washed dishes"
        ]
      },
      {
        "questionNumber": 4,
        "question": "In the room there is a soccer ball next to a tilted flowerpot and soil spilled on the floor. What probably happened?",
        "correctAnswer": "The ball hit the flowerpot",
        "incorrectOptions": [
          "The wind opened the door",
          "Someone watered the flower",
          "A cat jumped on the shelf"
        ]
      },
      {
        "questionNumber": 5,
        "question": "On the desk there is an open notebook, an uncapped pen, and a full glass of water. What was probably done here?",
        "correctAnswer": "Someone wrote in the notebook",
        "incorrectOptions": [
          "Someone read a story from the book",
          "Someone organized the pencil case",
          "Someone folded paper"
        ]
      },
      {
        "questionNumber": 6,
        "question": "Near the balcony door there is a small puddle of water and the sky outside is cloudy, even though it was sunny in the morning. What happened?",
        "correctAnswer": "It rained",
        "incorrectOptions": [
          "The puddle dried up",
          "Heavy snow fell",
          "A dry wind blew"
        ]
      },
      {
        "questionNumber": 7,
        "question": "In the kitchen there is flour on the counter, a bowl with leftover dough, and a warm baking pan. What was made here?",
        "correctAnswer": "Cake or bread",
        "incorrectOptions": [
          "Fruit salad was cut",
          "Vegetable soup was cooked",
          "A cheese sandwich was made"
        ]
      },
      {
        "questionNumber": 8,
        "question": "On the couch lie two pillows, an unfolded blanket, and a book placed upside down. What was probably done here?",
        "correctAnswer": "Someone rested or read",
        "incorrectOptions": [
          "Someone folded laundry into the closet",
          "Someone ate breakfast",
          "Someone played a board game"
        ]
      },
      {
        "questionNumber": 9,
        "question": "Next to the shelf there is a book lying on the floor and a small ladder next to the closet. Why was the ladder used?",
        "correctAnswer": "To reach a high shelf",
        "incorrectOptions": [
          "To paint the ceiling",
          "To fix a lamp",
          "To wash the window"
        ]
      },
      {
        "questionNumber": 10,
        "question": "In the bag were found a wet swimsuit, a towel, and flip-flops. Where did they probably return from?",
        "correctAnswer": "Pool or beach",
        "incorrectOptions": [
          "A hike on forest trails",
          "Gym class in the hall",
          "A visit to the library"
        ]
      }
    ],
    "Activity 12: Master Riddles": [
      {
        "questionNumber": 1,
        "question": "I have a collar and a row of buttons in front, sleeves, but no arms. What am I?",
        "correctAnswer": "Shirt",
        "incorrectOptions": [
          "Coat",
          "Sweater",
          "Jacket"
        ]
      },
      {
        "questionNumber": 2,
        "question": "I keep going all the time but never leave my spot, and I have hands. What am I?",
        "correctAnswer": "Clock",
        "incorrectOptions": [
          "Pendulum",
          "Thermometer",
          "Compass"
        ]
      },
      {
        "questionNumber": 3,
        "question": "I have columns/pages, yet I am not a building, and I have lines, yet I am not an audience. What am I?",
        "correctAnswer": "Book",
        "incorrectOptions": [
          "Newspaper",
          "Notebook",
          "Dictionary"
        ]
      },
      {
        "questionNumber": 4,
        "question": "I break the moment you say my name, even though nobody touches me. What am I?",
        "correctAnswer": "Silence",
        "incorrectOptions": [
          "Secret",
          "Echo",
          "Sound"
        ]
      },
      {
        "questionNumber": 5,
        "question": "I have eyes, yet I cannot see, and I have a head, yet I cannot think – I grow in the ground. What am I?",
        "correctAnswer": "Potato",
        "incorrectOptions": [
          "Onion",
          "Carrot",
          "Garlic"
        ]
      },
      {
        "questionNumber": 6,
        "question": "I can fill an entire room yet take up no space at all. What am I?",
        "correctAnswer": "Light",
        "incorrectOptions": [
          "Air",
          "Shadow",
          "Sound"
        ]
      },
      {
        "questionNumber": 7,
        "question": "I am made of a thin film of soapy water, float in the air when blown, and eventually pop. What am I?",
        "correctAnswer": "Soap bubble",
        "incorrectOptions": [
          "Balloon",
          "Cloud",
          "Foam"
        ]
      },
      {
        "questionNumber": 8,
        "question": "I start out tall and the more I am used, the shorter I become, until I disappear. What am I?",
        "correctAnswer": "Candle",
        "incorrectOptions": [
          "Pencil",
          "Chalk",
          "Bar of soap"
        ]
      },
      {
        "questionNumber": 9,
        "question": "I have a back, yet no lower back, and I help you lean when sitting. What am I?",
        "correctAnswer": "Chair backrest",
        "incorrectOptions": [
          "Pillow",
          "Sofa",
          "Footstool"
        ]
      },
      {
        "questionNumber": 10,
        "question": "I fall from the sky without legs, and wet the ground and leaves. What am I?",
        "correctAnswer": "Rain",
        "incorrectOptions": [
          "Dew",
          "Hail",
          "Snow"
        ]
      }
    ]
  },
  "Ages 10-11": {
    "Activity 1: Animals and Nature": [
      {
        "questionNumber": 1,
        "question": "I am a bird of prey with exceptionally sharp eyesight, can dive at high speed toward prey, and bear a name that also suggests swift movement. Who am I?",
        "correctAnswer": "Falcon",
        "incorrectOptions": [
          "Hawk",
          "Eagle",
          "Owl"
        ]
      },
      {
        "questionNumber": 2,
        "question": "I am a marine mammal capable of sleeping while one half of my brain stays awake to keep breathing and stay alert. Who am I?",
        "correctAnswer": "Dolphin",
        "incorrectOptions": [
          "Whale",
          "Seal",
          "Manatee"
        ]
      },
      {
        "questionNumber": 3,
        "question": "I am a small insect capable of lifting a weight several times my own body weight and living in organized underground colonies. Who am I?",
        "correctAnswer": "Ant",
        "incorrectOptions": [
          "Termite",
          "Beetle",
          "Wasp"
        ]
      },
      {
        "questionNumber": 4,
        "question": "I am a marine reptile that migrates thousands of kilometers and returns to lay eggs on the very beach where it hatched. Who am I?",
        "correctAnswer": "Sea turtle",
        "incorrectOptions": [
          "Marine iguana",
          "Sea snake",
          "Saltwater crocodile"
        ]
      },
      {
        "questionNumber": 5,
        "question": "I am a long-legged water bird with a large beak that filters fish or guards chicks in a high nest. Who am I?",
        "correctAnswer": "Heron",
        "incorrectOptions": [
          "Stork",
          "Pelican",
          "Flamingo"
        ]
      },
      {
        "questionNumber": 6,
        "question": "I am a mammal capable of gliding through the air between trees using a membrane of skin stretched between its legs. Who am I?",
        "correctAnswer": "Flying squirrel",
        "incorrectOptions": [
          "Colugo",
          "Regular squirrel",
          "Honey badger"
        ]
      },
      {
        "questionNumber": 7,
        "question": "I am a marine invertebrate that changes the color and texture of its skin to camouflage itself and hide from predators. Who am I?",
        "correctAnswer": "Octopus",
        "incorrectOptions": [
          "Squid",
          "Hermit crab",
          "Starfish"
        ]
      },
      {
        "questionNumber": 8,
        "question": "I am a small songbird known for its ability to mimic the calls of other birds and its surroundings. Who am I?",
        "correctAnswer": "Mockingbird",
        "incorrectOptions": [
          "Nightingale",
          "Lark",
          "Sparrow"
        ]
      },
      {
        "questionNumber": 9,
        "question": "I am a small desert mammal that lives in cool burrows and survives without direct drinking thanks to the food it eats. Who am I?",
        "correctAnswer": "Desert mouse",
        "incorrectOptions": [
          "Jerboa",
          "Gerbil",
          "Mole rat"
        ]
      },
      {
        "questionNumber": 10,
        "question": "I am a marine animal with no brain, heart, or bones, moving with the current using a gel bell and stinging tentacles. Who am I?",
        "correctAnswer": "Jellyfish",
        "incorrectOptions": [
          "Sea anemone",
          "Sea cucumber",
          "Coral"
        ]
      }
    ],
    "Activity 2: Household Objects": [
      {
        "questionNumber": 1,
        "question": "I am an electrical appliance that uses hot air or steam to smooth wrinkles in fabric without burning it. What am I?",
        "correctAnswer": "Steam iron",
        "incorrectOptions": [
          "Clothes dryer",
          "Hair dryer",
          "Room humidifier"
        ]
      },
      {
        "questionNumber": 2,
        "question": "I am an accessory placed at the entrance of a home or room to trap dirt and moisture from shoes before entering. What am I?",
        "correctAnswer": "Doormat",
        "incorrectOptions": [
          "Floor cloth",
          "Squeegee",
          "Living room rug"
        ]
      },
      {
        "questionNumber": 3,
        "question": "I am a tool with a serrated blade designed to cut wood or hard materials with back-and-forth motions. What am I?",
        "correctAnswer": "Saw",
        "incorrectOptions": [
          "Chisel",
          "Drill",
          "File"
        ]
      },
      {
        "questionNumber": 4,
        "question": "I am a mechanism that closes or opens an electrical circuit and prevents overload or a short circuit in the breaker panel. What am I?",
        "correctAnswer": "Circuit breaker",
        "incorrectOptions": [
          "Voltage stabilizer",
          "UPS",
          "Electrical outlet"
        ]
      },
      {
        "questionNumber": 5,
        "question": "I am an instrument that measures temperature inside a room, outdoors, or in the body and displays the value in numbers or on a scale. What am I?",
        "correctAnswer": "Thermometer",
        "incorrectOptions": [
          "Barometer",
          "Hygrometer",
          "Wall clock"
        ]
      },
      {
        "questionNumber": 6,
        "question": "I am a kitchen utensil with small holes designed to drain water from pasta, rice, or washed vegetables. What am I?",
        "correctAnswer": "Colander",
        "incorrectOptions": [
          "Mixing bowl",
          "Ladle",
          "Grater"
        ]
      },
      {
        "questionNumber": 7,
        "question": "I am a component that stores electrical energy for repeated use in portable devices. What am I?",
        "correctAnswer": "Battery",
        "incorrectOptions": [
          "Charger",
          "Power cable",
          "Transformer"
        ]
      },
      {
        "questionNumber": 8,
        "question": "I am an accessory placed on a desk or shelf that keeps books upright so they do not fall over. What am I?",
        "correctAnswer": "Bookends",
        "incorrectOptions": [
          "Laptop stand",
          "Storage box",
          "Reading stand"
        ]
      },
      {
        "questionNumber": 9,
        "question": "I am a mechanism that prevents water or air from flowing backward in a pipe after already passing in the desired direction. What am I?",
        "correctAnswer": "Check valve",
        "incorrectOptions": [
          "Ball valve",
          "Pressure gauge",
          "Flow regulator"
        ]
      },
      {
        "questionNumber": 10,
        "question": "I am a security device that detects movement or the opening of a door and alerts when there is an unexpected change. What am I?",
        "correctAnswer": "Motion detector",
        "incorrectOptions": [
          "Security camera",
          "Alarm",
          "Intercom"
        ]
      }
    ],
    "Activity 3: Food and Sweets": [
      {
        "questionNumber": 1,
        "question": "I am a fruit that grows on a tree, botanically considered a fruit, yet in the kitchen often treated like a vegetable, like a tomato or cucumber. What am I?",
        "correctAnswer": "Avocado",
        "incorrectOptions": [
          "Mango",
          "Papaya",
          "Kiwi"
        ]
      },
      {
        "questionNumber": 2,
        "question": "I am a grain ground into flour and used to make bread, dough, and breakfast cereals. Which grain is this?",
        "correctAnswer": "Wheat",
        "incorrectOptions": [
          "Barley",
          "Oats",
          "Spelt"
        ]
      },
      {
        "questionNumber": 3,
        "question": "I am a sweet substance that bees produce from flower nectar and store in the hive. What am I?",
        "correctAnswer": "Honey",
        "incorrectOptions": [
          "Maple syrup",
          "Date syrup",
          "Jam"
        ]
      },
      {
        "questionNumber": 4,
        "question": "I am a cooking process in which ingredients are stirred with liquid over heat until the mixture thickens or cooks slowly. What is it?",
        "correctAnswer": "Simmering / slow cooking",
        "incorrectOptions": [
          "Deep frying",
          "Grilling",
          "Steaming"
        ]
      },
      {
        "questionNumber": 5,
        "question": "I am a tropical fruit with a spiky or tough rind on the outside and sweet-tart yellow flesh on the inside. Which fruit is this?",
        "correctAnswer": "Pineapple",
        "incorrectOptions": [
          "Passion fruit",
          "Coconut",
          "Guava"
        ]
      },
      {
        "questionNumber": 6,
        "question": "I am a dairy product made by separating fat from milk, used for baking and spreading, and hardening when refrigerated. What am I?",
        "correctAnswer": "Butter",
        "incorrectOptions": [
          "Heavy cream",
          "Margarine",
          "Cream cheese"
        ]
      },
      {
        "questionNumber": 7,
        "question": "I am a small legume used to make a popular spread, soups, and protein dishes. What am I?",
        "correctAnswer": "Chickpea",
        "incorrectOptions": [
          "Lentils",
          "White beans",
          "Fava beans"
        ]
      },
      {
        "questionNumber": 8,
        "question": "I am an aromatic spice obtained from dried tree bark and rolled into a quill or ground into powder. What am I?",
        "correctAnswer": "Cinnamon",
        "incorrectOptions": [
          "Clove",
          "Nutmeg",
          "Ginger"
        ]
      },
      {
        "questionNumber": 9,
        "question": "I am a puffy, airy yeast baked good originating from preparation with yeast and rising before baking. What am I?",
        "correctAnswer": "Yeast bread",
        "incorrectOptions": [
          "Sourdough bread",
          "Pita",
          "Puff pastry"
        ]
      },
      {
        "questionNumber": 10,
        "question": "I am a basic sense associated with salt, sugar, lemon, or bitter coffee. Which concept describes this?",
        "correctAnswer": "Taste",
        "incorrectOptions": [
          "Smell",
          "Texture",
          "Spiciness"
        ]
      }
    ],
    "Activity 4: Colors and Shapes": [
      {
        "questionNumber": 1,
        "question": "I am a polygon with eight sides and eight angles, like a classic \"STOP\" sign. What shape am I?",
        "correctAnswer": "Octagon",
        "incorrectOptions": [
          "Hexagon",
          "Decagon",
          "Pentagon"
        ]
      },
      {
        "questionNumber": 2,
        "question": "I am a geometric solid with a polygonal base and triangular faces that meet at a single apex on top. What shape am I?",
        "correctAnswer": "Pyramid",
        "incorrectOptions": [
          "Prism",
          "Rectangular prism",
          "Cube"
        ]
      },
      {
        "questionNumber": 3,
        "question": "I am a geometric solid with two parallel circular bases and a curved side, like a tin can. What shape am I?",
        "correctAnswer": "Cylinder",
        "incorrectOptions": [
          "Cone",
          "Sphere",
          "Ellipsoid"
        ]
      },
      {
        "questionNumber": 4,
        "question": "In color theory, the three primary colors from which many other colors are made are red, blue, and what is the third?",
        "correctAnswer": "Yellow",
        "incorrectOptions": [
          "Green",
          "Orange",
          "Purple"
        ]
      },
      {
        "questionNumber": 5,
        "question": "When you mix two adjacent primary colors, you get a secondary color. What is obtained by mixing blue and yellow?",
        "correctAnswer": "Green",
        "incorrectOptions": [
          "Orange",
          "Purple",
          "Turquoise"
        ]
      },
      {
        "questionNumber": 6,
        "question": "I am a polygon with five equal sides and equal angles, sometimes resembling the shape of a house or a star. What shape am I?",
        "correctAnswer": "Pentagon",
        "incorrectOptions": [
          "Hexagon",
          "Octagon",
          "Trapezoid"
        ]
      },
      {
        "questionNumber": 7,
        "question": "I am a closed curved line where all points on it are at an equal distance from a single center. What shape am I?",
        "correctAnswer": "Circle",
        "incorrectOptions": [
          "Ellipse",
          "Crescent",
          "Arc"
        ]
      },
      {
        "questionNumber": 8,
        "question": "A quadrilateral in which two pairs of opposite sides are parallel to each other, including both the square and the rectangle. What general name fits this?",
        "correctAnswer": "Parallelogram",
        "incorrectOptions": [
          "Trapezoid",
          "Kite",
          "Rhombus"
        ]
      },
      {
        "questionNumber": 9,
        "question": "A color obtained when black is added to another color, producing a darker and deeper version of it. What is this process called?",
        "correctAnswer": "Shading",
        "incorrectOptions": [
          "Tinting",
          "Saturation",
          "Hue"
        ]
      },
      {
        "questionNumber": 10,
        "question": "A triangle in which all three sides are equal in length and all three angles are also equal. Which triangle is this?",
        "correctAnswer": "Equilateral triangle",
        "incorrectOptions": [
          "Isosceles triangle",
          "Right triangle",
          "Scalene triangle"
        ]
      }
    ],
    "Activity 5: Vehicles": [
      {
        "questionNumber": 1,
        "question": "An aircraft without an engine of its own that drifts or glides using air currents and wind. What is it?",
        "correctAnswer": "Glider",
        "incorrectOptions": [
          "Hot air balloon",
          "Paraglider",
          "Light aircraft"
        ]
      },
      {
        "questionNumber": 2,
        "question": "An urban or intercity transit system that runs on a separate track to avoid traffic jams. What is it?",
        "correctAnswer": "Light rail / Metro",
        "incorrectOptions": [
          "Bus",
          "Tram",
          "Shared taxi"
        ]
      },
      {
        "questionNumber": 3,
        "question": "A watercraft designed to transport vehicles and passengers over a relatively short distance between coasts or islands. What is it?",
        "correctAnswer": "Ferry",
        "incorrectOptions": [
          "Cruise ship",
          "Cargo ship",
          "Tugboat"
        ]
      },
      {
        "questionNumber": 4,
        "question": "A two-wheeled motor vehicle primarily designed for riding off-road, on trails, or in sport riding. What is it?",
        "correctAnswer": "Dirt bike",
        "incorrectOptions": [
          "Scooter",
          "Mountain bike",
          "ATV"
        ]
      },
      {
        "questionNumber": 5,
        "question": "An aircraft capable of taking off vertically and hovering in one place without needing a long runway. What is it?",
        "correctAnswer": "Helicopter",
        "incorrectOptions": [
          "Passenger plane",
          "Drone",
          "Fighter jet"
        ]
      },
      {
        "questionNumber": 6,
        "question": "A heavy vehicle equipped with a crane or boom for lifting and moving heavy loads at construction sites or ports. What is it?",
        "correctAnswer": "Mobile crane",
        "incorrectOptions": [
          "Dump truck",
          "Bulldozer",
          "Forklift"
        ]
      },
      {
        "questionNumber": 7,
        "question": "A marine vessel consisting of two parallel hulls joined together for greater stability. What is it?",
        "correctAnswer": "Catamaran",
        "incorrectOptions": [
          "Rowboat",
          "Standard sailboat",
          "Paddleboard"
        ]
      },
      {
        "questionNumber": 8,
        "question": "A vehicle or system that allows high-speed travel on an air cushion or magnetic track. What is it?",
        "correctAnswer": "Maglev train / Hovercraft",
        "incorrectOptions": [
          "Regular high-speed train",
          "Tram",
          "Cable car"
        ]
      },
      {
        "questionNumber": 9,
        "question": "A small, fast watercraft often used for rescue, patrol, or water sports. What is it?",
        "correctAnswer": "Motorboat",
        "incorrectOptions": [
          "Kayak",
          "Sailboat",
          "Barge"
        ]
      },
      {
        "questionNumber": 10,
        "question": "A vehicle or carriage specially adapted for traveling over snow or ice. What is it?",
        "correctAnswer": "Snowmobile / Snowcat",
        "incorrectOptions": [
          "Regular off-road vehicle",
          "Horse-drawn sleigh",
          "ATV"
        ]
      }
    ],
    "Activity 6: Time and Seasons": [
      {
        "questionNumber": 1,
        "question": "An astronomical phenomenon in which day and night are nearly equal in length twice a year. What is it called?",
        "correctAnswer": "Vernal / Autumnal equinox",
        "incorrectOptions": [
          "Solstice",
          "Lunar eclipse",
          "Meteor shower"
        ]
      },
      {
        "questionNumber": 2,
        "question": "In the Hebrew calendar, a year in which an extra month is added to align the lunar year with the solar year. Which year is this?",
        "correctAnswer": "Leap year",
        "incorrectOptions": [
          "Regular year",
          "Sabbatical year",
          "Civil year"
        ]
      },
      {
        "questionNumber": 3,
        "question": "A unit of time consisting of 100 years. Which unit of time is this?",
        "correctAnswer": "Century",
        "incorrectOptions": [
          "Decade",
          "Millennium",
          "Generation"
        ]
      },
      {
        "questionNumber": 4,
        "question": "A unit of time consisting of 10 years. Which unit of time is this?",
        "correctAnswer": "Decade",
        "incorrectOptions": [
          "Century",
          "Jubilee",
          "Year"
        ]
      },
      {
        "questionNumber": 5,
        "question": "The day of the year when the Sun reaches its highest or lowest point relative to the equator, marking the start of summer or winter. What is it?",
        "correctAnswer": "Solstice",
        "incorrectOptions": [
          "Vernal / Autumnal equinox",
          "New Year",
          "Midday"
        ]
      },
      {
        "questionNumber": 6,
        "question": "The time difference between different time zones around the world resulting from Earth's rotation on its axis. What is it called?",
        "correctAnswer": "Time zone difference",
        "incorrectOptions": [
          "Daylight saving time",
          "Local time",
          "Date line"
        ]
      },
      {
        "questionNumber": 7,
        "question": "Time measured from a certain reference point, such as BCE or CE, or daylight saving and standard time. What is it?",
        "correctAnswer": "Time",
        "incorrectOptions": [
          "Duration",
          "Date",
          "Hour"
        ]
      },
      {
        "questionNumber": 8,
        "question": "A precise point on the timeline at which an action or event occurs, as opposed to a duration of time. What is it?",
        "correctAnswer": "Moment",
        "incorrectOptions": [
          "Period",
          "Minute",
          "Era"
        ]
      },
      {
        "questionNumber": 9,
        "question": "A natural cycle that repeats every year due to the tilt of Earth's axis and its orbit around the Sun. What is it?",
        "correctAnswer": "Cycle of the seasons",
        "incorrectOptions": [
          "Lunar cycle",
          "Tides",
          "Day and night"
        ]
      },
      {
        "questionNumber": 10,
        "question": "Setting the clock forward by one hour during the spring and summer months to make better use of evening daylight. What is it called?",
        "correctAnswer": "Daylight saving time",
        "incorrectOptions": [
          "Standard winter time",
          "Universal time",
          "Atomic clock"
        ]
      }
    ],
    "Activity 7: The Human Body": [
      {
        "questionNumber": 1,
        "question": "A system of cells and fluids that protects the body against invading bacteria and viruses. Which system is this?",
        "correctAnswer": "Immune system",
        "incorrectOptions": [
          "Respiratory system",
          "Circulatory system",
          "Lymphatic system"
        ]
      },
      {
        "questionNumber": 2,
        "question": "A network of cells that transmits rapid electrical signals between the brain and the rest of the body. Which system is this?",
        "correctAnswer": "Nervous system",
        "incorrectOptions": [
          "Muscular system",
          "Skeletal system",
          "Transport system"
        ]
      },
      {
        "questionNumber": 3,
        "question": "Tissues in the body capable of contracting and relaxing to move bones and organs. What are they?",
        "correctAnswer": "Muscles",
        "incorrectOptions": [
          "Tendons",
          "Ligaments",
          "Bones"
        ]
      },
      {
        "questionNumber": 4,
        "question": "An organ that filters waste and excess fluids from the blood and produces urine. Which organ is this?",
        "correctAnswer": "Kidneys",
        "incorrectOptions": [
          "Liver",
          "Urinary bladder",
          "Spleen"
        ]
      },
      {
        "questionNumber": 5,
        "question": "The largest organ of the human body, covering it on the outside and protecting it. What is it?",
        "correctAnswer": "Skin",
        "incorrectOptions": [
          "Liver",
          "Small intestine",
          "Lungs"
        ]
      },
      {
        "questionNumber": 6,
        "question": "The organ system that breaks down food into nutrients the body can absorb and use for energy. Which system is this?",
        "correctAnswer": "Digestive system",
        "incorrectOptions": [
          "Excretory system",
          "Respiratory system",
          "Circulatory system"
        ]
      },
      {
        "questionNumber": 7,
        "question": "Blood vessels that carry blood away from the heart to the rest of the body. What are they called?",
        "correctAnswer": "Arteries",
        "incorrectOptions": [
          "Veins",
          "Capillaries",
          "Lymph vessels"
        ]
      },
      {
        "questionNumber": 8,
        "question": "Blood vessels that return blood from the rest of the body back to the heart. What are they called?",
        "correctAnswer": "Veins",
        "incorrectOptions": [
          "Arteries",
          "Capillaries",
          "Aorta"
        ]
      },
      {
        "questionNumber": 9,
        "question": "The part of the brain primarily responsible for balance, coordination, and precise movement. Which part is this?",
        "correctAnswer": "Cerebellum",
        "incorrectOptions": [
          "Brainstem",
          "Cerebral cortex",
          "Hypothalamus"
        ]
      },
      {
        "questionNumber": 10,
        "question": "The part of the eye that receives light and transmits visual information to the optic nerve. What is it?",
        "correctAnswer": "Retina",
        "incorrectOptions": [
          "Cornea",
          "Lens",
          "Iris"
        ]
      }
    ],
    "Activity 8: Space and Stars": [
      {
        "questionNumber": 1,
        "question": "The force that attracts objects with mass toward one another and keeps planets in orbit and moons around planets. Which force is this?",
        "correctAnswer": "Gravity",
        "incorrectOptions": [
          "Magnetic force",
          "Centrifugal force",
          "Solar radiation"
        ]
      },
      {
        "questionNumber": 2,
        "question": "An icy celestial body whose gas and dust form a glowing coma and tail when approaching the Sun. What is it?",
        "correctAnswer": "Comet",
        "incorrectOptions": [
          "Asteroid",
          "Meteoroid",
          "Moon"
        ]
      },
      {
        "questionNumber": 3,
        "question": "A region in space where gravity is so strong that not even light can escape from it. What is it?",
        "correctAnswer": "Black hole",
        "incorrectOptions": [
          "White dwarf",
          "Neutron star",
          "Nebula"
        ]
      },
      {
        "questionNumber": 4,
        "question": "A massive, violent explosion of a giant star at the end of its life, emitting intense light. What is this phenomenon called?",
        "correctAnswer": "Supernova",
        "incorrectOptions": [
          "Solar eclipse",
          "Solar flare",
          "Meteor"
        ]
      },
      {
        "questionNumber": 5,
        "question": "The distance light travels in a vacuum during one year, used as a unit of measurement for vast distances in space. What is it?",
        "correctAnswer": "Light-year",
        "incorrectOptions": [
          "Astronomical unit",
          "Parsec",
          "Mercury year"
        ]
      },
      {
        "questionNumber": 6,
        "question": "The hottest planet in our solar system, surrounded by dense clouds of sulfuric acid. Which planet is it?",
        "correctAnswer": "Venus",
        "incorrectOptions": [
          "Mercury",
          "Mars",
          "Jupiter"
        ]
      },
      {
        "questionNumber": 7,
        "question": "A giant cloud of gas and dust in space where new stars are often formed. What is it called?",
        "correctAnswer": "Nebula",
        "incorrectOptions": [
          "Galaxy",
          "Star cluster",
          "Solar system"
        ]
      },
      {
        "questionNumber": 8,
        "question": "The farthest planet from the Sun in our solar system. Which planet is it?",
        "correctAnswer": "Neptune",
        "incorrectOptions": [
          "Uranus",
          "Saturn",
          "Jupiter"
        ]
      },
      {
        "questionNumber": 9,
        "question": "The phenomenon in which one celestial body blocks the light of another celestial body, such as a solar or lunar eclipse. What is it?",
        "correctAnswer": "Eclipse",
        "incorrectOptions": [
          "Transit",
          "Moon phase",
          "Tide"
        ]
      },
      {
        "questionNumber": 10,
        "question": "The layer of air and gases surrounding a planet and protecting its surface. What is it?",
        "correctAnswer": "Atmosphere",
        "incorrectOptions": [
          "Magnetosphere",
          "Lithosphere",
          "Hydrosphere"
        ]
      }
    ],
    "Activity 9: Clue Challenge": [
      {
        "questionNumber": 1,
        "question": "I attract certain metal objects toward myself without touching them.",
        "correctAnswer": "Magnet",
        "incorrectOptions": [
          "Compass",
          "Battery",
          "Screwdriver"
        ]
      },
      {
        "questionNumber": 2,
        "question": "I show how hot or cold the air or your body is.",
        "correctAnswer": "Thermometer",
        "incorrectOptions": [
          "Clock",
          "Scale",
          "Ruler"
        ]
      },
      {
        "questionNumber": 3,
        "question": "I help scientists see tiny things that the naked eye cannot see.",
        "correctAnswer": "Microscope",
        "incorrectOptions": [
          "Telescope",
          "Magnifying glass",
          "Binoculars"
        ]
      },
      {
        "questionNumber": 4,
        "question": "I store energy and help a toy or flashlight operate.",
        "correctAnswer": "Battery",
        "incorrectOptions": [
          "Lightbulb",
          "Switch",
          "Cable"
        ]
      },
      {
        "questionNumber": 5,
        "question": "I appear when an object blocks light, and my shape changes throughout the day.",
        "correctAnswer": "Shadow",
        "incorrectOptions": [
          "Reflection",
          "Rainbow",
          "Light"
        ]
      },
      {
        "questionNumber": 6,
        "question": "I am a sound that returns to you after hitting a wall.",
        "correctAnswer": "Echo",
        "incorrectOptions": [
          "Whisper",
          "Noise",
          "Whistle"
        ]
      },
      {
        "questionNumber": 7,
        "question": "I rise from a boiling kettle and disappear into the air.",
        "correctAnswer": "Steam",
        "incorrectOptions": [
          "Smoke",
          "Water",
          "Ice"
        ]
      },
      {
        "questionNumber": 8,
        "question": "I am a preserved trace or sign of a living creature from long ago.",
        "correctAnswer": "Fossil",
        "incorrectOptions": [
          "Ordinary rock",
          "Seashell",
          "Fresh bone"
        ]
      },
      {
        "questionNumber": 9,
        "question": "I split white light into a rainbow of colors.",
        "correctAnswer": "Prism",
        "incorrectOptions": [
          "Mirror",
          "Lens",
          "Flashlight"
        ]
      },
      {
        "questionNumber": 10,
        "question": "There are three switches outside a closed room and one lightbulb inside. Only one switch turns on the bulb. You may enter the room only once. How do you find out which switch controls the bulb?",
        "correctAnswer": "Turn on one switch for a few minutes, turn it off, and turn on a second switch; enter the room. A lit bulb belongs to the second switch, an unlit but warm bulb belongs to the first, and an unlit and cold bulb belongs to the third.",
        "incorrectOptions": [
          "Turn on all three switches, turn them off, and identify by light intensity.",
          "Turn on one switch and enter immediately; if the bulb is off, it is the third switch.",
          "Enter the room first, flip each switch in turn, and see which one lights the bulb."
        ]
      }
    ],
    "Activity 10: Short Logic Riddles": [
      {
        "questionNumber": 1,
        "question": "In a closet there are three boxes: one has apples, the second has oranges, and the third has mixed fruit. All labels are placed incorrectly; you pull one fruit from the box labeled \"Mixed\" and see it is an apple. What is inside the box labeled \"Oranges\"?",
        "correctAnswer": "A mix of apples and oranges",
        "incorrectOptions": [
          "Only apples",
          "Only oranges",
          "An empty box"
        ]
      },
      {
        "questionNumber": 2,
        "question": "A shepherd has 17 sheep. All but 9 ran away. How many sheep does the shepherd have left?",
        "correctAnswer": "9 sheep",
        "incorrectOptions": [
          "8 sheep",
          "17 sheep",
          "26 sheep"
        ]
      },
      {
        "questionNumber": 3,
        "question": "There are 8 identical-looking balls, and one of them is heavier than the others. With a two-pan balance scale, what is the minimum number of weighings needed to find the heavy ball for sure?",
        "correctAnswer": "2 weighings",
        "incorrectOptions": [
          "One weighing",
          "3 weighings",
          "4 weighings"
        ]
      },
      {
        "questionNumber": 4,
        "question": "A closed room contains one lightbulb and one switch outside the room. You may enter the room only once after flipping the switch. How can you know for sure which switch position turned on the bulb if it is currently off?",
        "correctAnswer": "Warm up the bulb / turn it on and check for heat",
        "incorrectOptions": [
          "Turn it on and enter immediately, checking if the bulb is lit",
          "Turn it off and enter immediately, checking if the bulb is lit",
          "Count the lightbulbs in the room before entering"
        ]
      },
      {
        "questionNumber": 5,
        "question": "A 100-meter-long train enters a 100-meter-long tunnel at a constant speed. How long will it take the train to pass completely through the tunnel if it travels at 100 meters per second?",
        "correctAnswer": "2 seconds",
        "incorrectOptions": [
          "One second",
          "4 seconds",
          "10 seconds"
        ]
      },
      {
        "questionNumber": 6,
        "question": "If you write the numbers from 1 to 100, how many times does the digit 9 appear in the ones place?",
        "correctAnswer": "10 times",
        "incorrectOptions": [
          "9 times",
          "11 times",
          "20 times"
        ]
      },
      {
        "questionNumber": 7,
        "question": "In a drawer there are 10 blue socks and 10 white socks loose in complete darkness. What is the minimum number of socks you need to pull out to guarantee a matching pair of the same color?",
        "correctAnswer": "3",
        "incorrectOptions": [
          "2",
          "4",
          "11"
        ]
      },
      {
        "questionNumber": 8,
        "question": "A bat and a ball together cost 1.10 shekels. The bat costs 1 shekel more than the ball. How much does the ball cost?",
        "correctAnswer": "0.05 shekels",
        "incorrectOptions": [
          "0.10 shekels",
          "0.15 shekels",
          "1.00 shekel"
        ]
      },
      {
        "questionNumber": 9,
        "question": "If Tom's father is my father's only son, who is my father to Tom?",
        "correctAnswer": "Grandfather",
        "incorrectOptions": [
          "Father",
          "Uncle",
          "Brother"
        ]
      },
      {
        "questionNumber": 10,
        "question": "There are three switches outside a closed room and one lightbulb inside. Only one switch turns on the bulb. You may enter the room only once. How do you find out which switch controls the bulb?",
        "correctAnswer": "Turn on one switch for a few minutes, turn it off, and turn on a second switch; enter the room. A lit bulb belongs to the second switch, an unlit but warm bulb belongs to the first, and an unlit and cold bulb belongs to the third.",
        "incorrectOptions": [
          "Turn on all three switches, turn them off, and identify by light intensity.",
          "Turn on one switch and enter immediately; if the bulb is off, it is the third switch.",
          "Enter the room first, flip each switch in turn, and see which one lights the bulb."
        ]
      }
    ],
    "Activity 11: Detective Challenges": [
      {
        "questionNumber": 1,
        "question": "In a room there is a window locked from the inside, shattered glass on the ground outside, and a little water around the shards. What probably happened?",
        "correctAnswer": "A stone or object hit the window from outside",
        "incorrectOptions": [
          "The wind broke the window from inside",
          "Someone dropped a glass cup near the door",
          "Someone watered the flowerpot near the wall"
        ]
      },
      {
        "questionNumber": 2,
        "question": "On a desk were found an open notepad, a fountain pen out of ink, and a blue stain on someone's right hand. Which hand probably writes normally?",
        "correctAnswer": "Left hand",
        "incorrectOptions": [
          "Right hand",
          "Both hands together",
          "Neither hand wrote"
        ]
      },
      {
        "questionNumber": 3,
        "question": "In a room there is an analog clock that stopped at exactly 08:15, and a new battery lies next to it. What probably happened to the clock?",
        "correctAnswer": "The battery died / was not installed",
        "incorrectOptions": [
          "The clock is set to daylight saving time",
          "The hands got stuck because of dust",
          "The clock shows the time of another city"
        ]
      },
      {
        "questionNumber": 4,
        "question": "On a windowsill there is a flowerpot with dry, cracked soil, even though it rained across the rest of the yard over the past week. Where was the flowerpot probably standing?",
        "correctAnswer": "Under shelter",
        "incorrectOptions": [
          "In the middle of the open lawn",
          "Inside a puddle in the yard",
          "On the exposed garden fence"
        ]
      },
      {
        "questionNumber": 5,
        "question": "In a drawer were found a key broken in two and a locked box whose lock is scratched. What did someone try to do here?",
        "correctAnswer": "Tried to force the box open",
        "incorrectOptions": [
          "Carefully lock the drawer",
          "Oil the lock",
          "Replace the box"
        ]
      },
      {
        "questionNumber": 6,
        "question": "On the table there is a cup of tea with faint steam still rising from it, an open book next to it, and signs that a door was opened. What probably happened a moment ago?",
        "correctAnswer": "Someone drank tea and read a book",
        "incorrectOptions": [
          "Someone prepared breakfast in the kitchen",
          "Someone washed dishes in the sink",
          "Someone folded laundry in the bedroom"
        ]
      },
      {
        "questionNumber": 7,
        "question": "In a room there is a shiny floor that is still slightly damp, and a \"Caution, Wet Floor\" sign stands near the door. Which action was just completed?",
        "correctAnswer": "The floor was mopped",
        "incorrectOptions": [
          "Crumbs were swept from the rug",
          "Dust was vacuumed from the curtain",
          "Toys were put away in a bin"
        ]
      },
      {
        "questionNumber": 8,
        "question": "Next to the computer were found headphones resting on the desk, a turned-off monitor, and a notebook full of notes. What was probably done before turning off the monitor?",
        "correctAnswer": "Someone typed or studied on the computer",
        "incorrectOptions": [
          "Someone watched TV in the living room",
          "Someone played the piano",
          "Someone cooked in the oven"
        ]
      },
      {
        "questionNumber": 9,
        "question": "On a bookshelf there is a neat row of books, and in the middle one book is missing, leaving a narrow gap. What probably happened?",
        "correctAnswer": "A book was taken out",
        "incorrectOptions": [
          "An extra-thick book was added",
          "The books were arranged by color",
          "Dust was wiped off the shelf"
        ]
      },
      {
        "questionNumber": 10,
        "question": "On a sheet of paper there are deep pencil pressure marks outlining a word, yet the sheet itself has no graphite on it. What probably happened?",
        "correctAnswer": "Someone pressed hard with a pencil on a sheet above it",
        "incorrectOptions": [
          "Someone erased the word with an eraser",
          "Someone spilled water on the sheet",
          "Someone folded the sheet into a paper airplane"
        ]
      }
    ],
    "Activity 12: Master Riddles": [
      {
        "questionNumber": 1,
        "question": "I cannot speak, hear, or feel, yet I keep secrets written inside pages. What am I?",
        "correctAnswer": "Book",
        "incorrectOptions": [
          "Notebook",
          "Diary",
          "Magazine"
        ]
      },
      {
        "questionNumber": 2,
        "question": "The more there is of me, the less you see, yet I am not a gas or physical fog. What am I?",
        "correctAnswer": "Darkness",
        "incorrectOptions": [
          "Shadow",
          "Fog",
          "Night"
        ]
      },
      {
        "questionNumber": 3,
        "question": "I start with A (Aleph), end with Z (Tav), and contain all the words ever written in the language. What am I?",
        "correctAnswer": "Alphabet",
        "incorrectOptions": [
          "Dictionary",
          "Sentence",
          "Book"
        ]
      },
      {
        "questionNumber": 4,
        "question": "I can be straight or curved, long or short, and connect two points in space or on a page. What am I?",
        "correctAnswer": "Line",
        "incorrectOptions": [
          "Segment",
          "Ray",
          "Path"
        ]
      },
      {
        "questionNumber": 5,
        "question": "I exist only when there is movement or change, and if everything stands completely frozen I am barely felt. What am I?",
        "correctAnswer": "Time",
        "incorrectOptions": [
          "Motion",
          "Speed",
          "Rhythm"
        ]
      },
      {
        "questionNumber": 6,
        "question": "I have a beginning and an end, yet in the middle I can branch into many directions and confuse anyone looking for the exit. What am I?",
        "correctAnswer": "Maze",
        "incorrectOptions": [
          "Path",
          "Road",
          "Track"
        ]
      },
      {
        "questionNumber": 7,
        "question": "I can be transparent or colorful, break easily, or bend rays of light. What am I?",
        "correctAnswer": "Glass",
        "incorrectOptions": [
          "Plastic",
          "Crystal",
          "Water"
        ]
      },
      {
        "questionNumber": 8,
        "question": "I am found in every sentence written, yet I have no meaning on my own without the words around me. What am I?",
        "correctAnswer": "Word",
        "incorrectOptions": [
          "Letter",
          "Syllable",
          "Comma"
        ]
      },
      {
        "questionNumber": 9,
        "question": "I appear after rain and sometimes near waterfalls, and I have a spectrum of colors ordered by wavelength. What am I?",
        "correctAnswer": "Rainbow",
        "incorrectOptions": [
          "Halo",
          "Cloud",
          "Mist"
        ]
      },
      {
        "questionNumber": 10,
        "question": "I am a question starting with \"Who,\" \"What,\" \"Where,\" or \"How,\" and my purpose is to make you think. What am I?",
        "correctAnswer": "Riddle",
        "incorrectOptions": [
          "Question",
          "Task",
          "Mystery"
        ]
      }
    ]
  }
};

globalThis.RIDDLE_JOURNEY_EN = riddleJourneyData;
})();
