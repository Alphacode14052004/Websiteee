export const story = {
  opening: [
    "The bell above the bookshop door gives its last small warning. Five minutes until closing, and you're still holding a secondhand novel with a cracked blue spine.",
    "On page seventy-three, a handwritten note waits in the margin: ‘If you found this, tell me where you'd go if the story let you leave.’ Someone has drawn an arrow toward the next page.",
  ],
  firstPrompt: "What do you do?",
  firstChoices: [
    {
      id: "speak",
      label: "Ask the other reader",
      detail: "Someone is searching the shelf beside you.",
    },
    {
      id: "margin",
      label: "Answer in the margin",
      detail: "Leave a line for whoever finds it next.",
    },
  ],
  bridges: {
    speak: [
      "You turn to the person beside you. ‘Do books usually ask you questions?’ They laugh. ‘Only the good ones.’",
      "They read the note over your shoulder. ‘So, where would you go?’",
    ],
    margin: [
      "You borrow a pen and write: ‘Somewhere the last page isn't really the end.’ When you look up, the reader beside you is smiling.",
      "‘That's an excellent answer,’ they say. ‘Mind if I borrow it?’",
    ],
  },
  secondPrompt: "The shopkeeper turns the sign to CLOSED. What happens next?",
  secondChoices: [
    {
      id: "coffee",
      label: "Find a late coffee",
      detail: "Keep the conversation going.",
    },
    {
      id: "book",
      label: "Choose one more book",
      detail: "Let the shelves decide.",
    },
  ],
  endings: {
    "speak-coffee": {
      title: "The Blue Hour",
      paragraphs: [
        "The café across the street is nearly empty. They order something warm; you split the last slice of cake. Before the cups are empty, you've traded favourite endings and admitted the ones you'd rewrite. Outside, the rain has stopped. Neither of you is quite ready to call the night finished.",
      ],
    },
    "speak-book": {
      title: "A Map of Almosts",
      paragraphs: [
        "You each pull a book from the shelf without looking. Theirs is a book of maps; yours, a collection of letters. ‘That seems suspiciously like a plot,’ they say. At the till, the shopkeeper slips both into one paper bag. You walk out together, taking the longer way home.",
      ],
    },
    "margin-coffee": {
      title: "A Note for Later",
      paragraphs: [
        "At the café, they write their answer on a napkin and slide it across the table: ‘Wherever the conversation goes next.’ You laugh, then fold it carefully into your book. When the lights dim for closing, you've already made plans to return the next day.",
      ],
    },
    "margin-book": {
      title: "The Next Chapter",
      paragraphs: [
        "You choose a book for them; they choose one for you. Both choices are wrong in perfect ways. Inside yours, you find a note in fresh ink: ‘Tell me what you think when you finish.’ You leave the shop with a new story to read.",
      ],
    },
  },
};

export default story;
