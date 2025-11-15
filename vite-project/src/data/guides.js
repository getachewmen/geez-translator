// data/guides.js
export const guides = [
  {
    id: 1,
    title: "መራሕያን ምንድን ናቸው?",
    subtitle: "What are Geez Pronouns?",
    content: `መራሕያን "መርሐ- መራ" ከሚለው የግእዝ ግሥ የተገኘ ሲሆን ትርጉሙም መሪዎች ማለት ነው፡፡ መራሕያን የሚባሉት በሰው ስም ፋንታ ተተክተው የሚነገሩ የእርባታ መደቦች ናቸው፡፡`,
    englishContent: `"Merahyan" (Pronouns) are derived from the Geez verb "Merha-Mera" meaning "leaders". They are honorific titles used in place of personal names.`,
    category: "pronouns",
    icon: "👥",
    level: "beginner"
  },
  {
    id: 2,
    title: "የመራሕያን ዝርዝር",
    subtitle: "List of Geez Pronouns",
    content: `በግእዝ ሰዋስው ውስጥ 10 መራሕያን (ተውላጠ ስሞች) አሉ፡፡`,
    englishContent: `There are 10 main pronouns in Geez grammar:`,
    pronouns: [
      { geez: "ውእቱ", amharic: "እሱ", english: "He" },
      { geez: "ውእቶሙ", amharic: "እነርሱ(ተ)", english: "They (masc)" },
      { geez: "ይእቲ", amharic: "እርሷ", english: "She" },
      { geez: "ውእቶን", amharic: "እነርሱ(አ)", english: "They (fem)" },
      { geez: "አንተ", amharic: "አንተ", english: "You (masc)" },
      { geez: "አንትሙ", amharic: "እናንተ(ተ)", english: "You (masc pl)" },
      { geez: "አንቲ", amharic: "አንቺ", english: "You (fem)" },
      { geez: "አንትን", amharic: "እናንተ(አ)", english: "You (fem pl)" },
      { geez: "አነ", amharic: "እኔ", english: "I" },
      { geez: "ንሕነ", amharic: "እኛ", english: "We" }
    ],
    category: "pronouns",
    icon: "📝",
    level: "beginner"
  },
  {
    id: 3,
    title: "የመራሕያን ክፍፍል",
    subtitle: "Classification of Pronouns",
    content: `መራሕያን በቁጥር፣ በፆታ እና በመደብ ይከፈላሉ፡፡`,
    englishContent: `Pronouns are classified by number, gender, and grammatical person.`,
    classifications: [
      {
        type: "በቁጥር",
        items: [
          "ነጠላ ቁጥር: ውእቱ፣ ይእቲ፣ አንተ፣ አንቲ፣ አነ",
          "ብዙ ቁጥር: ውእቶሙ፣ ውእቶን፣ አንትሙ፣ አንትን፣ ንሕነ"
        ]
      },
      {
        type: "በፆታ",
        items: [
          "ተባዕታይ ፆታ: ውእቱ፣ ውእቶሙ፣ አንተ፣ አንትሙ",
          "አንስታይ ፆታ: ይእቲ፣ ውእቶን፣ አንቲ፣ አንትን"
        ]
      },
      {
        type: "በመደብ",
        items: [
          "አንደኛ መደብ: አነ፣ ንሕነ",
          "ሁለተኛ መደብ: አንተ፣ አንትሙ፣ አንቲ፣ አንትን",
          "ሦስተኛ መደብ: ውእቱ፣ ውእቶሙ፣ ይእቲ፣ ውእቶን"
        ]
      }
    ],
    category: "grammar",
    icon: "🔤",
    level: "intermediate"
  },
  {
    id: 4,
    title: "የመራሕያን አገልግሎት",
    subtitle: "Functions of Pronouns",
    content: `መራሕያን በዐረፍተ ነገር ውስጥ ሶስት ዋና አገልግሎቶች አላቸው፡፡`,
    englishContent: `Pronouns serve three main functions in Geez sentences:`,
    functions: [
      {
        title: "፩. የስም ምትክ ሆነው",
        description: "መራሕያን ስምን ተክተው ይነገራሉ",
        example: "ንሕነ አንበብነ መዝሙረ ዳዊት",
        translation: "We read the Psalms of David"
      },
      {
        title: "፪. ነባር አንቀጽ ሆነው",
        description: "መራሕያን እንደ ነባር አንቀጽ ያገለግላሉ",
        example: "መኑ አነ?",
        translation: "Who am I?"
      },
      {
        title: "፫. አመልካች ቅጽል ሆነው",
        description: "መራሕያን 'ይህ' ወይም 'ያ' ብለው ያገለግላሉ",
        example: "ውእቱ ወልድ ሖረ ኀበ ሀገረ እንግልጣር",
        translation: "That son went to England"
      }
    ],
    category: "grammar",
    icon: "⚙️",
    level: "intermediate"
  },
  {
    id: 5,
    title: "የግሥ ዝርዝር በመራሕያን",
    subtitle: "Verb Conjugation with Pronouns",
    content: `ግሦች ከመራሕያን ጋር በሚዘረዘሩበት ጊዜ የተለያዩ ለውጦች ይከሰታሉ፡፡`,
    englishContent: `Verbs undergo various changes when conjugated with pronouns.`,
    conjugation: {
      title: "የግሥ አዘራዘር ምሳሌ: ቀተለ (to kill)",
      examples: [
        { pronoun: "ውእቱ", form: "ቀተለ", meaning: "He killed" },
        { pronoun: "ውእቶሙ", form: "ቀተሉ", meaning: "They killed" },
        { pronoun: "ይእቲ", form: "ቀተለት", meaning: "She killed" },
        { pronoun: "አንተ", form: "ቀተልከ", meaning: "You killed" },
        { pronoun: "አንቲ", form: "ቀተልኪ", meaning: "You killed (f)" },
        { pronoun: "አነ", form: "ቀተልኩ", meaning: "I killed" },
        { pronoun: "ንሕነ", form: "ቀተልነ", meaning: "We killed" }
      ]
    },
    rules: [
      "በውእቱ ጊዜ: ምንም ለውጥ የለም",
      "በውእቶሙ ጊዜ: መድረሻ ፊደል ወደ ካዕብ ይቀየራል",
      "በይእቲ ጊዜ: 'ት' ይጨመራል",
      "በአንተ ጊዜ: መድረሻ ፊደል ወደ ሳድስ ተቀይሮ 'ከ' ይጨመራል"
    ],
    category: "verbs",
    icon: "🔄",
    level: "advanced"
  },
  {
    id: 6,
    title: "ገቢር መራሕያን",
    subtitle: "Object Pronouns",
    content: `ገቢር መራሕያን በተሳቢነት የሚያገለግሉ የመራሕያን ክፍሎች ናቸው፡፡`,
    englishContent: `Object pronouns are used as direct objects in sentences.`,
    objectPronouns: [
      { geez: "ኪያሁ", amharic: "እሱን", english: "Him" },
      { geez: "ኪያሆሙ", amharic: "እነርሱን", english: "Them (m)" },
      { geez: "ኪያሃ", amharic: "እርሷን", english: "Her" },
      { geez: "ኪያሆን", amharic: "እነርሱን", english: "Them (f)" },
      { geez: "ኪያከ", amharic: "አንተን", english: "You (m)" },
      { geez: "ኪያክሙ", amharic: "እናንተን", english: "You (m pl)" },
      { geez: "ኪያኪ", amharic: "አንችን", english: "You (f)" },
      { geez: "ኪያክን", amharic: "እናንተን", english: "You (f pl)" },
      { geez: "ኪያየ", amharic: "እኔን", english: "Me" },
      { geez: "ኪያነ", amharic: "እኛን", english: "Us" }
    ],
    examples: [
      "ኪያሁ አፈቅር - Love him",
      "ኪያክሙ ኢያርእየኒ - Don't show me you (pl)"
    ],
    category: "pronouns",
    icon: "🎯",
    level: "intermediate"
  },
  {
    id: 7,
    title: "ድርብ መራሕያን",
    subtitle: "Reflexive Pronouns",
    content: `ድርብ መራሕያን በባለቤትነት የሚያገለግሉ የመራሕያን ክፍሎች ናቸው፡፡`,
    englishContent: `Reflexive pronouns indicate self-action or possession.`,
    reflexivePronouns: [
      { geez: "ለሊሁ", amharic: "ራሱ", english: "Himself" },
      { geez: "ለሊሆሙ", amharic: "ራሳቸው", english: "Themselves (m)" },
      { geez: "ለሊሃ", amharic: "ራሷ", english: "Herself" },
      { geez: "ለሊሆን", amharic: "ራሳቸው", english: "Themselves (f)" },
      { geez: "ለሊከ", amharic: "ራስህ", english: "Yourself (m)" },
      { geez: "ለሊክሙ", amharic: "ራሳችሁ", english: "Yourselves (m)" },
      { geez: "ለሊኪ", amharic: "ራስሽ", english: "Yourself (f)" },
      { geez: "ለሊክን", amharic: "ራሳችሁ", english: "Yourselves (f)" },
      { geez: "ለልየ", amharic: "ራሴ", english: "Myself" },
      { geez: "ለሊነ", amharic: "ራሳችን", english: "Ourselves" }
    ],
    examples: [
      "ለልየ ውእቱ ዘገበርኩ - That which I did myself",
      "ለሊነ ነአምር ኵሎ - We ourselves know everything"
    ],
    category: "pronouns",
    icon: "🔄",
    level: "advanced"
  },
  {
    id: 8,
    title: "መስተዋድዳን ቀለማት",
    subtitle: "Prepositions and Particles",
    content: `መስተዋድዳን ቀለማት ከስም እና ከግስ በተጨማሪ የንግግሩን ሐሳብ የሚያጠናክሩ ቀለማት ናቸው፡፡`,
    englishContent: `Prepositions and particles are words that enhance the meaning of nouns and verbs.`,
    prepositions: [
      { geez: "ዲበ", amharic: "በ...ላይ", english: "On" },
      { geez: "ታሕተ", amharic: "በ...ታች", english: "Under" },
      { geez: "ማዕከለ", amharic: "በ...መካከል", english: "Between" },
      { geez: "ውስተ", amharic: "በ...ውስጥ", english: "Inside" },
      { geez: "ቅድመ", amharic: "በ...ፊት", english: "Before" },
      { geez: "ድኅረ", amharic: "በ...ኋላ", english: "After" },
      { geez: "ኀበ", amharic: "ወደ", english: "To" },
      { geez: "ከመ", amharic: "እንደ", english: "Like" }
    ],
    category: "grammar",
    icon: "🔗",
    level: "intermediate"
  }
];