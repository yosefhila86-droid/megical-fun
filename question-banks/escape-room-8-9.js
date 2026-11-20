(function(global){
  global.ESCAPE_ROOM_AGE_BANKS=global.ESCAPE_ROOM_AGE_BANKS||{};
  global.ESCAPE_ROOM_AGE_BANKS['8-9']={activities:[
    {
      title:{he:'תעלומת המצפה והמעבדה',en:'The Observatory and Laboratory Mystery',ru:'Тайна обсерватории и лаборатории'},
      stations:[
        {
          prompt:{he:'אני כוכב הלכת הגדול ביותר במערכת השמש, ויש לי כתם אדום גדול. אני לא כוכב, איני כוכב הלכת המפורסם בטבעות ואיני קרוב לשמש. מי אני? עכשיו בחרו את המספר הגדול ביותר מבין 2, 5 ו-8.',en:'I am the largest planet in the Solar System and have a huge red spot. I am not a star, the planet famous for its rings, or close to the Sun. Who am I? Now choose the largest number: 2, 5, or 8.',ru:'Я самая большая планета Солнечной системы, и на мне есть Большое Красное Пятно. Я не звезда, не планета, знаменитая своими кольцами, и не нахожусь близко к Солнцу. Кто я? Теперь выберите наибольшее число: 2, 5 или 8.'},
          answer:{he:'צדק; המספר הגדול ביותר הוא 8.',en:'Jupiter; the largest number is 8.',ru:'Юпитер; наибольшее число – 8.'},
          explanation:{he:'צדק הוא כוכב הלכת הגדול ביותר, ו-8 גדול מ-2 ומ-5.',en:'Jupiter is the largest planet, and 8 is greater than 2 and 5.',ru:'Юпитер – самая большая планета, а 8 больше 2 и 5.'},
          codeValue:'8'
        },
        {
          prompt:{he:'על שולחן העבודה מונחים מחק מלא פירורים ודף קרוע, וסולם קטן עומד ליד מדף גבוה. היו על המדף 5 ספרים ולקחו 2. כמה ספרים נשארו?',en:'On a desk there is an eraser covered in crumbs and a torn page, and a small ladder stands beside a high shelf. There were 5 books on the shelf, and 2 were taken away. How many books are left?',ru:'На столе лежат крошливый ластик и порванный лист, а рядом с высокой полкой стоит маленькая лестница. На полке было 5 книг, и 2 книги взяли. Сколько книг осталось?'},
          answer:{he:'3 ספרים.',en:'3 books.',ru:'3 книги.'},
          explanation:{he:'מחסרים 2 מ-5: נשארו 3 ספרים.',en:'Subtract 2 from 5: 3 books are left.',ru:'Вычитаем 2 из 5: осталось 3 книги.'},
          codeValue:'3'
        },
        {
          prompt:{he:'איזה איבר שרירי מזרים דם לכל הגוף ופועם מהר אחרי ריצה? בארון יש 4 חולצות כחולות ו-2 אדומות. כמה חולצות יש בסך הכול?',en:'Which muscular organ pumps blood around the body and beats faster after a run? There are 4 blue shirts and 2 red shirts in a closet. How many shirts are there altogether?',ru:'Какой мышечный орган перекачивает кровь по всему телу и бьётся быстрее после бега? В шкафу 4 синие и 2 красные футболки. Сколько всего футболок?'},
          answer:{he:'הלב; יש 6 חולצות.',en:'The heart; there are 6 shirts.',ru:'Сердце; всего 6 футболок.'},
          explanation:{he:'הלב מזרים דם בגוף. מחברים 4 ו-2 ומקבלים 6.',en:'The heart pumps blood through the body. Add 4 and 2 to get 6.',ru:'Сердце перекачивает кровь по телу. Складываем 4 и 2 – получаем 6.'},
          codeValue:'6'
        },
        {
          prompt:{he:'אני מתקדם כל הזמן, אבל נשאר במקומי, ויש לי מחוגים. רבע שעה היא 15 דקות. מהי הספרה הראשונה במספר 15?',en:'I keep moving while staying in one place, and I have hands. A quarter of an hour is 15 minutes. What is the first digit in the number 15?',ru:'Я всё время иду, но остаюсь на месте, и у меня есть стрелки. Четверть часа – это 15 минут. Какая первая цифра в числе 15?'},
          answer:{he:'שעון; הספרה הראשונה ב-15 היא 1.',en:'A clock; the first digit in 15 is 1.',ru:'Часы; первая цифра числа 15 – 1.'},
          explanation:{he:'המחוגים והרמז על התקדמות הזמן מתארים שעון. המספר 15 מתחיל בספרה 1.',en:'The hands and the clue about time passing point to a clock. The number 15 begins with 1.',ru:'Стрелки и подсказка о ходе времени указывают на часы. Число 15 начинается с цифры 1.'},
          codeValue:'1'
        }
      ]
    },
    {
      title:{he:'מעבדת החוקרים בג׳ונגל',en:'The Jungle Researchers’ Lab',ru:'Лаборатория исследователей джунглей'},
      stations:[
        {
          prompt:{he:'אני יונק שעף בלילה בעזרת גלי קול, ואיני ציפור או פרפר. מי אני? כמה רגליים יש לשני בעלי חיים כאלה יחד, אם לכל אחד מהם יש 2 רגליים?',en:'I am a mammal that flies at night using sound waves. I am not a bird or a butterfly. What am I? How many legs do two of these animals have altogether if each has 2 legs?',ru:'Я млекопитающее, которое летает ночью, ориентируясь с помощью звуковых волн. Я не птица и не бабочка. Кто я? Сколько ног вместе у двух таких животных, если у каждого по 2 ноги?'},
          answer:{he:'עטלף; לשני עטלפים יש 4 רגליים.',en:'A bat; two bats have 4 legs.',ru:'Летучая мышь; у двух летучих мышей 4 ноги.'},
          explanation:{he:'עטלף הוא יונק מעופף. לשני עטלפים יש 2 × 2 = 4 רגליים.',en:'A bat is a flying mammal. Two bats have 2 × 2 = 4 legs.',ru:'Летучая мышь – летающее млекопитающее. У двух мышей 2 × 2 = 4 ноги.'},
          codeValue:'4'
        },
        {
          prompt:{he:'בשביל הבוצי נמצאו עקבות של ארבע כפות, קליפות בננה ושיחים שזזו בצמרות העצים. איזו חיה כנראה עברה שם? היו 9 בננות באשכול ונאכלו 4. כמה נשארו?',en:'On a muddy path there are tracks from four paws, banana peels, and bushes disturbed high in the trees. Which animal probably passed by? A bunch had 9 bananas, and 4 were eaten. How many are left?',ru:'На грязной тропе видны следы четырёх лап, банановая кожура и примятые кусты высоко на деревьях. Какое животное, вероятно, прошло здесь? В связке было 9 бананов, 4 съели. Сколько осталось?'},
          answer:{he:'קוף; נשארו 5 בננות.',en:'A monkey; 5 bananas are left.',ru:'Обезьяна; осталось 5 бананов.'},
          explanation:{he:'העקבות והבננות מרמזים על קוף. מחסרים 4 מ-9 ומקבלים 5.',en:'The tracks and bananas point to a monkey. Subtract 4 from 9 to get 5.',ru:'Следы и бананы указывают на обезьяну. Вычитаем 4 из 9 – получаем 5.'},
          codeValue:'5'
        },
        {
          prompt:{he:'איך נקרא התהליך שבו צמחים ירוקים מייצרים מזון בעזרת אור השמש, מים ופחמן דו-חמצני? שתלו 3 שורות ובכל שורה 3 שתילים. כמה שתילים נשתלו?',en:'What is the process called in which green plants make food using sunlight, water, and carbon dioxide? There are 3 rows with 3 seedlings in each row. How many seedlings were planted?',ru:'Как называется процесс, при котором зелёные растения создают пищу с помощью солнечного света, воды и углекислого газа? Посадили 3 ряда по 3 саженца в каждом. Сколько всего саженцев посадили?'},
          answer:{he:'פוטוסינתזה; נשתלו 9 שתילים.',en:'Photosynthesis; 9 seedlings were planted.',ru:'Фотосинтез; посадили 9 саженцев.'},
          explanation:{he:'צמחים מייצרים מזון בתהליך הפוטוסינתזה. 3 × 3 = 9 שתילים.',en:'Plants make food through photosynthesis. 3 × 3 = 9 seedlings.',ru:'Растения создают пищу в процессе фотосинтеза. 3 × 3 = 9 саженцев.'},
          codeValue:'9'
        },
        {
          prompt:{he:'אני נולד במים עם זימים וזנב. כשאני גדל, אני נושם בריאות וקופץ ביבשה. מי אני? כמה רגליים יש לי בבגרותי?',en:'I am born in water with gills and a tail. When I grow up, I breathe with lungs and hop on land. What am I? How many legs do I have as an adult?',ru:'Я рождаюсь в воде с жабрами и хвостом. Повзрослев, я дышу лёгкими и прыгаю по суше. Кто я? Сколько ног у меня во взрослом возрасте?'},
          answer:{he:'צפרדע; לצפרדע בוגרת יש 4 רגליים.',en:'A frog; an adult frog has 4 legs.',ru:'Лягушка; у взрослой лягушки 4 ноги.'},
          explanation:{he:'צפרדע צעירה מתחילה כראשן עם זימים וזנב, ובהמשך מפתחת ריאות ורגליים. לצפרדע בוגרת יש 4 רגליים.',en:'A young frog begins as a tadpole with gills and a tail, then develops lungs and legs. An adult frog has 4 legs.',ru:'Молодая лягушка сначала бывает головастиком с жабрами и хвостом, а затем у неё развиваются лёгкие и ноги. У взрослой лягушки 4 ноги.'},
          codeValue:'4'
        }
      ]
    },
    {
      title:{he:'מנהרת הזמן של הפרעונים',en:'The Pharaohs’ Time Tunnel',ru:'Туннель времени фараонов'},
      stations:[
        {
          prompt:{he:'איזו תרבות עתיקה בנתה פירמידות ענק במדבר והשתמשה בכתב חרטומים? לפירמידה המתוארת יש בסיס מרובע ו-4 פאות משולשות. כמה פאות יש לה בסך הכול?',en:'Which ancient civilization built huge pyramids in the desert and used hieroglyphs? The pyramid described has a square base and 4 triangular sides. How many faces does it have altogether?',ru:'Какая древняя цивилизация строила огромные пирамиды в пустыне и использовала иероглифы? У описанной пирамиды квадратное основание и 4 треугольные боковые грани. Сколько всего у неё граней?'},
          answer:{he:'מצרים העתיקה; לפירמידה יש 5 פאות.',en:'Ancient Egypt; the pyramid has 5 faces.',ru:'Древний Египет; у пирамиды 5 граней.'},
          explanation:{he:'התרבות היא מצרים העתיקה. מוסיפים את הבסיס המרובע ל-4 הפאות המשולשות: 1 + 4 = 5.',en:'The civilization is ancient Egypt. Add the square base to the 4 triangular sides: 1 + 4 = 5.',ru:'Это древний Египет. Прибавляем квадратное основание к 4 треугольным граням: 1 + 4 = 5.'},
          codeValue:'5'
        },
        {
          prompt:{he:'בחדר המגילות נמצאו נוצה טבולה בדיו, מגילת פפירוס חתומה וחותמת שעווה שבורה. בארון היו 8 מגילות, ו-6 מהן נשארו סגורות. כמה מגילות נפתחו?',en:'In the scroll room, someone found a quill dipped in ink, a sealed papyrus scroll, and a broken wax seal. There were 8 scrolls in the cabinet, and 6 remained sealed. How many were opened?',ru:'В комнате свитков нашли перо в чернилах, запечатанный папирусный свиток и сломанную восковую печать. В шкафу было 8 свитков, 6 из них остались запечатанными. Сколько свитков открыли?'},
          answer:{he:'נפתחו 2 מגילות.',en:'2 scrolls were opened.',ru:'Открыли 2 свитка.'},
          explanation:{he:'מתוך 8 מגילות, 6 נשארו סגורות: 8 פחות 6 שווה 2.',en:'Out of 8 scrolls, 6 remained sealed: 8 minus 6 equals 2.',ru:'Из 8 свитков 6 остались запечатанными: 8 минус 6 равно 2.'},
          codeValue:'2'
        },
        {
          prompt:{he:'שעון שמש מודד זמן לפי אורך הצל. אם הצל זז 2 ס״מ בכל שעה, כמה סנטימטרים הוא יזוז בתוך 3 שעות?',en:'A sundial measures time by the length of a shadow. If the shadow moves 2 cm each hour, how many centimeters will it move in 3 hours?',ru:'Солнечные часы измеряют время по длине тени. Если тень перемещается на 2 см каждый час, на сколько сантиметров она переместится за 3 часа?'},
          answer:{he:'6 סנטימטרים.',en:'6 centimeters.',ru:'6 сантиметров.'},
          explanation:{he:'הצל נע 2 ס״מ לשעה במשך 3 שעות: 2 × 3 = 6 ס״מ.',en:'The shadow moves 2 cm per hour for 3 hours: 2 × 3 = 6 cm.',ru:'Тень перемещается на 2 см в час в течение 3 часов: 2 × 3 = 6 см.'},
          codeValue:'6'
        },
        {
          prompt:{he:'אני שומר על הפירמידות, ויש לי גוף של אריה וראש של אדם. מי אני? כמה אותיות יש בשם שלי בעברית: „ספינקס”?',en:'I guard the pyramids and have a lion’s body and a human head. What am I? How many letters are in my Hebrew name, „ספינקס”?',ru:'Я охраняю пирамиды, у меня тело льва и голова человека. Кто я? Сколько букв в моём имени на иврите – «ספינקס»?'},
          answer:{he:'ספינקס; במילה יש 6 אותיות.',en:'The Sphinx; its Hebrew name has 6 letters.',ru:'Сфинкс; в его имени на иврите 6 букв.'},
          explanation:{he:'היצור הוא הספינקס. במילה העברית „ספינקס” יש שש אותיות.',en:'The creature is the Sphinx. Its Hebrew name, „ספינקס”, has six letters.',ru:'Это сфинкс. В его имени на иврите – «ספינקס» – шесть букв.'},
          codeValue:'6'
        }
      ]
    },
    {
      title:{he:'המסע בתוך הגוף',en:'A Journey Inside the Body',ru:'Путешествие внутри тела'},
      stations:[
        {
          prompt:{he:'אנחנו זוג איברים שמתמלאים באוויר כששואפים ומתרוקנים כשנושפים. איננו הלב או הקיבה. מה שמנו? לריאה השמאלית יש 2 אונות, ובריאה הימנית יש אחת יותר. כמה אונות יש בריאה הימנית?',en:'We are a pair of organs that fill with air when you breathe in and empty when you breathe out. We are not the heart or the stomach. What are we? The left lung has 2 lobes, and the right lung has one more. How many lobes does the right lung have?',ru:'Мы – парный орган: наполняемся воздухом при вдохе и опустошаемся при выдохе. Мы не сердце и не желудок. Что это? В левом лёгком 2 доли, а в правом на одну больше. Сколько долей в правом лёгком?'},
          answer:{he:'ריאות; בריאה הימנית יש 3 אונות.',en:'Lungs; the right lung has 3 lobes.',ru:'Лёгкие; в правом лёгком 3 доли.'},
          explanation:{he:'אלה הריאות. לריאה הימנית יש אונה אחת יותר משתיים: 2 + 1 = 3.',en:'These are the lungs. The right lung has one more than two lobes: 2 + 1 = 3.',ru:'Это лёгкие. В правом лёгком на одну долю больше, чем в левом: 2 + 1 = 3.'},
          codeValue:'3'
        },
        {
          prompt:{he:'בחדר האחות נמצא מדחום שמראה 38.5 מעלות, כוס מים ריקה ושמיכה. הטמפרטורה הרגילה היא 37 מעלות. בכמה מעלות שלמות עלה החום, אם מעגלים כלפי מטה?',en:'In the nurse’s room there is a thermometer showing 38.5 degrees, an empty glass of water, and a blanket. Normal temperature is 37 degrees. By how many whole degrees has the temperature risen, rounding down?',ru:'В кабинете медсестры нашли термометр с показанием 38,5 градуса, пустой стакан и одеяло. Нормальная температура – 37 градусов. На сколько целых градусов поднялась температура, если округлить вниз?'},
          answer:{he:'במעלה שלמה אחת.',en:'By 1 whole degree.',ru:'На 1 целый градус.'},
          explanation:{he:'38.5 פחות 37 הם 1.5 מעלות; בעיגול כלפי מטה למעלות שלמות מתקבלת מעלה אחת.',en:'38.5 minus 37 is 1.5 degrees; rounded down to whole degrees, that is 1 degree.',ru:'38,5 минус 37 – это 1,5 градуса; при округлении вниз до целых получаем 1 градус.'},
          codeValue:'1'
        },
        {
          prompt:{he:'השלד האנושי מגן על האיברים הפנימיים ומאפשר תנועה. למבוגר יש 206 עצמות. מהי הספרה האמצעית במספר 206?',en:'The human skeleton protects internal organs and helps us move. An adult has 206 bones. What is the middle digit in 206?',ru:'Скелет человека защищает внутренние органы и помогает двигаться. У взрослого человека 206 костей. Какая цифра стоит посередине числа 206?'},
          answer:{he:'הספרה האמצעית היא 0.',en:'The middle digit is 0.',ru:'Средняя цифра – 0.'},
          explanation:{he:'במספר 206 הספרה שבין 2 ל-6 היא 0.',en:'In 206, the digit between 2 and 6 is 0.',ru:'В числе 206 между цифрами 2 и 6 стоит 0.'},
          codeValue:'0'
        },
        {
          prompt:{he:'אני החומר הקשה ביותר בגוף האדם. אני עוזרת ללעוס ומכוסה באמייל. מה אני? כמה שיניים קדמיות חותכות יש בלסת העליונה?',en:'I am the hardest substance in the human body. I help you chew and am covered in enamel. What am I? How many front incisors are in the upper jaw?',ru:'Я – самое твёрдое вещество в организме человека. Я помогаю пережёвывать пищу и покрыта эмалью. Что это? Сколько передних резцов находится в верхней челюсти?'},
          answer:{he:'שן; בלסת העליונה יש 4 חותכות קדמיות.',en:'A tooth; there are 4 front incisors in the upper jaw.',ru:'Зуб; в верхней челюсти 4 передних резца.'},
          explanation:{he:'האמייל הוא חומר קשה שמצפה את השיניים. בלסת העליונה יש ארבע חותכות קדמיות.',en:'Enamel is the hard substance covering teeth. There are four front incisors in the upper jaw.',ru:'Эмаль – твёрдое вещество, покрывающее зубы. В верхней челюсти четыре передних резца.'},
          codeValue:'4'
        }
      ]
    },
    {
      title:{he:'חדר המפות של מגלי הארצות',en:'The Explorers’ Map Room',ru:'Картографическая комната исследователей'},
      stations:[
        {
          prompt:{he:'אני היבשת הקרה ביותר, בדרום כדור הארץ. חיים בי פינגווינים, אבל לא דובי קוטב. איזו יבשת אני? כמה יבשות יש על פני כדור הארץ?',en:'I am the coldest continent, in the south of the Earth. Penguins live here, but polar bears do not. Which continent am I? How many continents are there on Earth?',ru:'Я – самый холодный материк на юге Земли. Здесь живут пингвины, но не белые медведи. Какой это материк? Сколько материков на Земле?'},
          answer:{he:'אנטארקטיקה; יש 7 יבשות.',en:'Antarctica; there are 7 continents.',ru:'Антарктида; на Земле 7 материков.'},
          explanation:{he:'היבשת הקפואה בדרום היא אנטארקטיקה. לפי החלוקה הנהוגה כאן, יש 7 יבשות.',en:'The frozen continent in the south is Antarctica. In the continent model used here, there are 7 continents.',ru:'Замёрзший материк на юге – Антарктида. В принятой здесь модели выделяют 7 материков.'},
          codeValue:'7'
        },
        {
          prompt:{he:'על השולחן מונחים מצפן שמחטו מצביעה צפונה, משקפת ימית ומפה שמסומנת בה נקודה במרחק 12 ק״מ. הספינה כבר עברה 8 ק״מ. כמה קילומטרים נשארו לה?',en:'On a table are a compass pointing north, marine binoculars, and a map showing a point 12 km away. The ship has already traveled 8 km. How many kilometers does it have left?',ru:'На столе лежат компас, стрелка которого указывает на север, морской бинокль и карта с отмеченной точкой в 12 км. Корабль уже прошёл 8 км. Сколько километров ему осталось?'},
          answer:{he:'4 קילומטרים.',en:'4 kilometers.',ru:'4 километра.'},
          explanation:{he:'המרחק הכולל הוא 12 ק״מ, והספינה עברה 8: נשארו 12 פחות 8, כלומר 4 ק״מ.',en:'The total distance is 12 km, and the ship has traveled 8: 12 minus 8 leaves 4 km.',ru:'Всего нужно пройти 12 км, а корабль уже прошёл 8: 12 минус 8 равно 4 км.'},
          codeValue:'4'
        },
        {
          prompt:{he:'הר געש מתפרץ כאשר מאגמה לוהטת עולה ממעמקי כדור הארץ ונהפכת ללבה. התפרצו 3 הרי געש ביבשה ו-5 מתחת לים. כמה הרי געש התפרצו?',en:'A volcano erupts when hot magma rises from deep inside the Earth and becomes lava. Three volcanoes erupted on land and 5 beneath the sea. How many volcanoes erupted?',ru:'Вулкан извергается, когда горячая магма поднимается из глубин Земли и превращается в лаву. На суше изверглись 3 вулкана, а под водой – 5. Сколько всего вулканов изверглось?'},
          answer:{he:'8 הרי געש.',en:'8 volcanoes.',ru:'8 вулканов.'},
          explanation:{he:'מחברים את 3 ההתפרצויות ביבשה ואת 5 שמתחת לים: 3 + 5 = 8.',en:'Add the 3 eruptions on land and the 5 underwater: 3 + 5 = 8.',ru:'Складываем 3 извержения на суше и 5 под водой: 3 + 5 = 8.'},
          codeValue:'8'
        },
        {
          prompt:{he:'אני הנהר הארוך ביותר באפריקה, וזורם צפונה אל הים התיכון. מה שמי? כמה אותיות יש בשם העברי שלי „הנילוס”?',en:'I am the longest river in Africa and flow north to the Mediterranean Sea. What is my name? How many letters are in my Hebrew name, „הנילוס”?',ru:'Я – самая длинная река Африки, текущая на север, к Средиземному морю. Как я называюсь? Сколько букв в моём названии на иврите – «הנילוס»?'},
          answer:{he:'הנילוס; בשמו בעברית יש 6 אותיות.',en:'The Nile; its Hebrew name has 6 letters.',ru:'Нил; в его названии на иврите 6 букв.'},
          explanation:{he:'זהו נהר הנילוס. סופרים את האותיות בשם העברי „הנילוס”: ה-נ-י-ל-ו-ס, שש אותיות.',en:'This is the Nile. Count the letters in its Hebrew name, „הנילוס”: ה-נ-י-ל-ו-ס – six letters.',ru:'Это Нил. В его названии на иврите «הנילוס» шесть букв: ה-נ-י-ל-ו-ס.'},
          codeValue:'6'
        }
      ]
    },
    {
      title:{he:'המעבדה הסודית של פרופסור ניוטון',en:'Professor Newton’s Secret Laboratory',ru:'Секретная лаборатория профессора Ньютона'},
      stations:[
        {
          prompt:{he:'אני מתכת נוזלית בטמפרטורת החדר, ששימשה בעבר במדחומים. איני ברזל או זהב. מה אני? מים קופאים ב-0 מעלות ורותחים ב-100 מעלות. כמה אפסים יש במספר 100?',en:'I am a metal that is liquid at room temperature and was once used in thermometers. I am not iron or gold. What am I? Water freezes at 0 degrees and boils at 100 degrees. How many zeros are in 100?',ru:'Я – металл, жидкий при комнатной температуре; раньше меня использовали в термометрах. Это не железо и не золото. Что это? Вода замерзает при 0 градусах и кипит при 100. Сколько нулей в числе 100?'},
          answer:{he:'כספית; במספר 100 יש 2 אפסים.',en:'Mercury; 100 has 2 zeros.',ru:'Ртуть; в числе 100 два нуля.'},
          explanation:{he:'המתכת הנוזלית היא כספית. המספר 100 נכתב עם שני אפסים.',en:'The liquid metal is mercury. The number 100 is written with two zeros.',ru:'Жидкий металл – ртуть. Число 100 записывается с двумя нулями.'},
          codeValue:'2'
        },
        {
          prompt:{he:'ליד מבחנה שהתנפצה נמצאו משקפי מגן, נייר לקמוס שהפך לאדום ו-3 פקקים. בקופסה היו 7 פקקים. כמה פקקים חסרים?',en:'Beside a broken test tube, someone found safety goggles, litmus paper that turned red, and 3 stoppers. There were 7 stoppers in the box. How many are missing?',ru:'Рядом с разбитой пробиркой нашли защитные очки, покрасневшую лакмусовую бумагу и 3 пробки. В коробке было 7 пробок. Сколько пробок не хватает?'},
          answer:{he:'חסרים 4 פקקים.',en:'4 stoppers are missing.',ru:'Не хватает 4 пробок.'},
          explanation:{he:'היו 7 פקקים ונשארו 3: 7 פחות 3 שווה 4.',en:'There were 7 stoppers and 3 remain: 7 minus 3 equals 4.',ru:'Было 7 пробок, осталось 3: 7 минус 3 равно 4.'},
          codeValue:'4'
        },
        {
          prompt:{he:'למגנט יש שני קטבים: צפון ודרום. לוקחים 3 מגנטים וחוצים כל אחד לשניים. לכל אחד מ-6 החלקים יש שני קטבים. כמה קטבים יש יחד? מהי ספרת העשרות של התשובה?',en:'A magnet has two poles: north and south. Take 3 magnets and cut each in half. Each of the 6 pieces has two poles. How many poles are there altogether? What is the tens digit of the answer?',ru:'У магнита два полюса: северный и южный. Возьмём 3 магнита и разрежем каждый пополам. У каждой из 6 частей будет по два полюса. Сколько полюсов получится? Какая цифра стоит в разряде десятков?'},
          answer:{he:'יש 12 קטבים; ספרת העשרות היא 1.',en:'There are 12 poles; the tens digit is 1.',ru:'Всего 12 полюсов; цифра десятков – 1.'},
          explanation:{he:'שלושה מגנטים נהפכים ל-6 חלקים, ובכל חלק שני קטבים: 6 × 2 = 12. ספרת העשרות ב-12 היא 1.',en:'Three magnets become 6 pieces, each with 2 poles: 6 × 2 = 12. The tens digit in 12 is 1.',ru:'Из трёх магнитов получаются 6 частей, у каждой по 2 полюса: 6 × 2 = 12. Цифра десятков в числе 12 – 1.'},
          codeValue:'1'
        },
        {
          prompt:{he:'אני כוח בלתי נראה שמושך חפצים אל מרכז כדור הארץ ועוזר לנו להישאר על הקרקע. מה שמי? כמה אותיות יש במילה העברית „כבידה”?',en:'I am an invisible force that pulls objects toward the center of the Earth and keeps us on the ground. What am I? How many letters are in the Hebrew word „כבידה”?',ru:'Я – невидимая сила, притягивающая предметы к центру Земли и помогающая нам оставаться на земле. Что это? Сколько букв в слове на иврите «כבידה»?'},
          answer:{he:'כבידה; במילה יש 5 אותיות.',en:'Gravity; the Hebrew word has 5 letters.',ru:'Гравитация; в слове на иврите 5 букв.'},
          explanation:{he:'הכוח הוא כבידה. במילה העברית „כבידה” יש חמש אותיות.',en:'The force is gravity. Its Hebrew name, „כבידה”, has five letters.',ru:'Эта сила называется гравитацией. В её названии на иврите «כבידה» пять букв.'},
          codeValue:'5'
        }
      ]
    },
    {
      title:{he:'הסטודיו של הצייר הנעלם',en:'The Missing Painter’s Studio',ru:'Студия пропавшего художника'},
      stations:[
        {
          prompt:{he:'אנחנו שלושת צבעי היסוד שמהם אפשר ליצור צבעים רבים. אנחנו לא ירוק. אילו צבעים אנחנו? כמה צבעי יסוד יש?',en:'We are the three primary colors that can be used to make many other colors. We are not green. Which colors are we, and how many primary colors are there?',ru:'Мы – три основных цвета, из которых можно получить многие другие цвета. Мы не зелёный. Какие это цвета и сколько их?'},
          answer:{he:'אדום, כחול וצהוב; יש 3 צבעי יסוד.',en:'Red, blue, and yellow; there are 3 primary colors.',ru:'Красный, синий и жёлтый; основных цветов 3.'},
          explanation:{he:'שלושת צבעי היסוד הם אדום, כחול וצהוב, ולכן מספרם 3.',en:'The three primary colors are red, blue, and yellow, so there are 3.',ru:'Три основных цвета – красный, синий и жёлтый. Всего их 3.'},
          codeValue:'3'
        },
        {
          prompt:{he:'על הרצפה נמצאו כתמי צבע סגול, מכחול רטוב וצנצנת מים עכורים. הצייר ערבב אדום עם איזה צבע כדי ליצור סגול? היו לו 6 שפופרות צבע, והוא השתמש ב-2. כמה נשארו?',en:'On the floor are purple paint stains, a wet paintbrush, and a jar of cloudy water. Which color did the painter mix with red to make purple? The painter had 6 paint tubes and used 2. How many are left?',ru:'На полу – пятна фиолетовой краски, мокрая кисть и банка с мутной водой. Какой цвет художник смешал с красным, чтобы получить фиолетовый? У него было 6 тюбиков краски, и он использовал 2. Сколько осталось?'},
          answer:{he:'כחול; נשארו 4 שפופרות.',en:'Blue; 4 paint tubes are left.',ru:'Синий; осталось 4 тюбика краски.'},
          explanation:{he:'מערבבים אדום וכחול כדי לקבל סגול. מחסרים 2 מ-6 ומקבלים 4 שפופרות.',en:'Mix red and blue to make purple. Subtract 2 from 6 to get 4 paint tubes.',ru:'Чтобы получить фиолетовый, смешивают красный и синий. Вычитаем 2 из 6 – остаётся 4 тюбика.'},
          codeValue:'4'
        },
        {
          prompt:{he:'צליל נוצר מרעידות באוויר ונמדד בתדר. מיתר קצר ומתוח יותר יוצר צליל גבוה יותר. לכינור יש 4 מיתרים וגם לצ׳לו יש 4. כמה מיתרים יש לשניהם יחד?',en:'Sound is made by vibrations in the air and is measured by frequency. A shorter, tighter string makes a higher sound. A violin has 4 strings, and a cello has 4. How many strings do they have altogether?',ru:'Звук возникает из-за колебаний воздуха и характеризуется частотой. Более короткая и натянутая струна звучит выше. У скрипки 4 струны, и у виолончели тоже 4. Сколько струн у них вместе?'},
          answer:{he:'8 מיתרים.',en:'8 strings.',ru:'8 струн.'},
          explanation:{he:'לכינור ולצ׳לו יש 4 מיתרים לכל אחד: 4 + 4 = 8.',en:'The violin and cello each have 4 strings: 4 + 4 = 8.',ru:'У скрипки и виолончели по 4 струны: 4 + 4 = 8.'},
          codeValue:'8'
        },
        {
          prompt:{he:'אני לוח שעליו ציירים מערבבים צבעים, ובדרך כלל יש בו חור לאגודל. מה שמי? כמה אותיות יש במילה העברית „פלטה”?',en:'I am a board on which painters mix colors, usually with a hole for the thumb. What am I? How many letters are in the Hebrew word „פלטה”?',ru:'Я – дощечка, на которой художники смешивают краски; обычно в ней есть отверстие для большого пальца. Что это? Сколько букв в слове на иврите «פלטה»?'},
          answer:{he:'פלטה; במילה יש 4 אותיות.',en:'A palette; the Hebrew word has 4 letters.',ru:'Палитра; в слове на иврите 4 буквы.'},
          explanation:{he:'לוח ערבוב הצבעים נקרא פלטה. במילה העברית „פלטה” יש ארבע אותיות.',en:'The board for mixing paint is a palette. The Hebrew word „פלטה” has four letters.',ru:'Дощечка для смешивания красок называется палитрой. В слове на иврите «פלטה» четыре буквы.'},
          codeValue:'4'
        }
      ]
    },
    {
      title:{he:'המוסך של הממציאים',en:'The Inventors’ Garage',ru:'Гараж изобретателей'},
      stations:[
        {
          prompt:{he:'הומצאתי לפני אלפי שנים. איני מנוע או כנף, ובעזרתי עגלות ומכוניות מתגלגלות בקלות. מה אני? כמה גלגלים יש לתלת-אופן?',en:'I was invented thousands of years ago. I am not an engine or a wing, and I help carts and cars roll easily. What am I? How many wheels does a tricycle have?',ru:'Меня изобрели тысячи лет назад. Я не двигатель и не крыло, но благодаря мне телеги и машины легко катятся. Что это? Сколько колёс у трёхколёсного велосипеда?'},
          answer:{he:'גלגל; לתלת-אופן יש 3 גלגלים.',en:'A wheel; a tricycle has 3 wheels.',ru:'Колесо; у трёхколёсного велосипеда 3 колеса.'},
          explanation:{he:'גלגלים מאפשרים לכלי רכב להתגלגל. לתלת-אופן יש שלושה גלגלים.',en:'Wheels let vehicles roll. A tricycle has three wheels.',ru:'Колёса помогают транспорту катиться. У трёхколёсного велосипеда три колеса.'},
          codeValue:'3'
        },
        {
          prompt:{he:'על שולחן העבודה נמצאו מברג, 4 ברגים מפוזרים וסוללה הפוכה בתוך שלט שלא נדלק. בשלט נדרשות 2 סוללות, ובמגירה יש 9. כמה סוללות יישארו במגירה אחרי שמכניסים לשלט 2?',en:'On a workbench there is a screwdriver, 4 scattered screws, and a battery inserted backward in a remote that will not turn on. The remote needs 2 batteries, and there are 9 in the drawer. How many batteries will remain in the drawer after 2 are put in the remote?',ru:'На рабочем столе лежат отвёртка, 4 разбросанных винта и неправильно вставленная батарейка в неработающем пульте. Пульту нужны 2 батарейки, а в ящике их 9. Сколько батареек останется в ящике, если вставить в пульт 2?'},
          answer:{he:'יישארו 7 סוללות.',en:'7 batteries will remain.',ru:'Останется 7 батареек.'},
          explanation:{he:'מוציאים 2 סוללות מתוך 9: 9 פחות 2 שווה 7.',en:'Take 2 batteries from the 9: 9 minus 2 equals 7.',ru:'Берём 2 батарейки из 9: 9 минус 2 равно 7.'},
          codeValue:'7'
        },
        {
          prompt:{he:'חשמל זורם במעגל סגור דרך חומרים מוליכים, כמו נחושת. במעגל יש 2 נורות ומוסיפים עוד 3. כמה נורות ידלקו כשהמתג ייסגר?',en:'Electricity flows through a closed circuit and conductors such as copper. There are 2 bulbs in a circuit, and 3 more are added. How many bulbs will light when the switch is closed?',ru:'Электричество течёт по замкнутой цепи через проводники, например медь. В цепи 2 лампочки, и добавили ещё 3. Сколько лампочек загорится, когда цепь замкнут?'},
          answer:{he:'5 נורות.',en:'5 bulbs.',ru:'5 лампочек.'},
          explanation:{he:'במעגל יש 2 נורות ועוד 3: בסך הכול 5 נורות.',en:'There are 2 bulbs plus 3 more: 5 bulbs altogether.',ru:'В цепи 2 лампочки и ещё 3: всего 5 лампочек.'},
          codeValue:'5'
        },
        {
          prompt:{he:'אני המוח של המחשב ומבצע חישובים רבים בשנייה. מה אני? מהי הספרה הראשונה בשנה 2026?',en:'I am the brain of a computer and perform many calculations every second. What am I? What is the first digit in the year 2026?',ru:'Я – мозг компьютера и выполняю множество вычислений каждую секунду. Что это? Какая первая цифра в числе 2026?'},
          answer:{he:'מעבד; הספרה הראשונה ב-2026 היא 2.',en:'A processor; the first digit in 2026 is 2.',ru:'Процессор; первая цифра числа 2026 – 2.'},
          explanation:{he:'המעבד מבצע חישובים במחשב. המספר 2026 מתחיל בספרה 2.',en:'The processor performs calculations in a computer. The number 2026 begins with 2.',ru:'Процессор выполняет вычисления в компьютере. Число 2026 начинается с цифры 2.'},
          codeValue:'2'
        }
      ]
    },
    {
      title:{he:'תחנת המיחזור החכמה',en:'The Smart Recycling Station',ru:'Умная станция переработки'},
      stations:[
        {
          prompt:{he:'אני פח כחול שמיועד לנייר ולקרטון, ולא לאריזות או לזכוכית. אספתם 5 עיתונים ו-4 קופסאות קרטון. כמה פריטים תשליכו אליי?',en:'I am a blue bin for paper and cardboard, not packaging or glass. You collected 5 newspapers and 4 cardboard boxes. How many items will you put in me?',ru:'Я – синий контейнер для бумаги и картона, а не для упаковки или стекла. Вы собрали 5 газет и 4 картонные коробки. Сколько предметов вы положите в меня?'},
          answer:{he:'פח כחול; יש 9 פריטים.',en:'A blue bin; there are 9 items.',ru:'Синий контейнер; всего 9 предметов.'},
          explanation:{he:'הפח הכחול מיועד לנייר וקרטון. 5 עיתונים ועוד 4 קופסאות הם 9 פריטים.',en:'The blue bin is for paper and cardboard. 5 newspapers plus 4 boxes make 9 items.',ru:'Синий контейнер предназначен для бумаги и картона. 5 газет и 4 коробки – это 9 предметов.'},
          codeValue:'9'
        },
        {
          prompt:{he:'בחוף נמצאו רשת דיג, בקבוק פלסטיק וצעיף שנשכח. מתוך 10 מתנדבים שבאו לנקות, 4 הלכו להביא שקיות. כמה מתנדבים נשארו בחוף?',en:'On the beach, someone found a fishing net, a plastic bottle, and a forgotten scarf. Of the 10 volunteers who came to clean, 4 went to get bags. How many volunteers stayed on the beach?',ru:'На пляже нашли рыболовную сеть, пластиковую бутылку и забытый шарф. Из 10 волонтёров, пришедших убирать, 4 пошли за мешками. Сколько волонтёров осталось на пляже?'},
          answer:{he:'6 מתנדבים.',en:'6 volunteers.',ru:'6 волонтёров.'},
          explanation:{he:'מתוך 10 מתנדבים, 4 הלכו להביא שקיות: 10 פחות 4 שווה 6.',en:'Of the 10 volunteers, 4 went to get bags: 10 minus 4 equals 6.',ru:'Из 10 волонтёров 4 пошли за мешками: 10 минус 4 равно 6.'},
          codeValue:'6'
        },
        {
          prompt:{he:'אנרגיה סולארית מופקת מאור השמש בעזרת לוחות מיוחדים ואינה מזהמת את האוויר. כל לוח מייצר 2 יחידות חשמל. כמה לוחות דרושים כדי לייצר 6 יחידות?',en:'Solar energy is made from sunlight using special panels and does not pollute the air. Each panel produces 2 units of electricity. How many panels are needed to produce 6 units?',ru:'Солнечную энергию получают с помощью специальных панелей, и она не загрязняет воздух. Каждая панель вырабатывает 2 единицы электричества. Сколько панелей нужно, чтобы получить 6 единиц?'},
          answer:{he:'3 לוחות.',en:'3 panels.',ru:'3 панели.'},
          explanation:{he:'מחלקים 6 יחידות ב-2 יחידות לכל לוח: דרושים 3 לוחות.',en:'Divide 6 units by 2 units per panel: 3 panels are needed.',ru:'Делим 6 единиц на 2 единицы от каждой панели: нужно 3 панели.'},
          codeValue:'3'
        },
        {
          prompt:{he:'אני סמל של שלושה חיצים ירוקים שמסתובבים במעגל. מה אני מסמל? כמה חיצים יש בסמל המיחזור?',en:'I am a symbol of three green arrows turning in a loop. What do I represent? How many arrows are in the recycling symbol?',ru:'Я – знак из трёх зелёных стрелок, образующих круг. Что я обозначаю? Сколько стрелок в символе переработки?'},
          answer:{he:'סמל המיחזור; יש בו 3 חיצים.',en:'The recycling symbol; it has 3 arrows.',ru:'Символ переработки; в нём 3 стрелки.'},
          explanation:{he:'זהו סמל המיחזור, והוא מורכב משלושה חיצים.',en:'This is the recycling symbol, and it is made of three arrows.',ru:'Это символ переработки, состоящий из трёх стрелок.'},
          codeValue:'3'
        }
      ]
    },
    {
      title:{he:'המעבדה הקולינרית',en:'The Culinary Lab',ru:'Кулинарная лаборатория'},
      stations:[
        {
          prompt:{he:'אני אבקה לבנה שמשמשת להתפחת בצק ומשחררת פחמן דו-חמצני. מה אני? אם שמים 2 כפיות ממני בכל עוגה, כמה כפיות צריך ל-3 עוגות?',en:'I am a white powder used as a chemical leavener in dough, releasing carbon dioxide. What am I? If each cake needs 2 teaspoons, how many teaspoons are needed for 3 cakes?',ru:'Я – белый порошок для химического разрыхления теста, при котором выделяется углекислый газ. Что это? Если на один пирог нужно 2 чайные ложки, сколько нужно на 3 пирога?'},
          answer:{he:'אבקת אפייה; צריך 6 כפיות.',en:'Baking powder; 6 teaspoons are needed.',ru:'Разрыхлитель теста; нужно 6 чайных ложек.'},
          explanation:{he:'אבקת אפייה עוזרת לבצק לתפוח. 2 כפיות לכל עוגה כפול 3 עוגות הן 6 כפיות.',en:'Baking powder helps dough rise. 2 teaspoons for each of 3 cakes makes 6 teaspoons.',ru:'Разрыхлитель помогает тесту подняться. 2 ложки на каждый из 3 пирогов – всего 6 ложек.'},
          codeValue:'6'
        },
        {
          prompt:{he:'במטבח נמצאו קליפות ביצים, קמח על השיש ותבנית חמה, אבל העוגה שטוחה. האופה שכח להוסיף שמרים. השתמשו ב-3 ביצים מתוך תבנית של 12. כמה ביצים נשארו?',en:'In the kitchen, there are eggshells, flour on the counter, and a hot baking pan, but the cake is flat. The baker forgot to add yeast. 3 eggs were used from a carton of 12. How many eggs are left?',ru:'На кухне нашли яичную скорлупу, муку на столе и горячую форму, но пирог получился плоским. Повар забыл добавить дрожжи. Из упаковки с 12 яйцами использовали 3. Сколько яиц осталось?'},
          answer:{he:'נשארו 9 ביצים.',en:'9 eggs are left.',ru:'Осталось 9 яиц.'},
          explanation:{he:'בתבנית היו 12 ביצים והשתמשו ב-3: נשארו 12 פחות 3, כלומר 9.',en:'There were 12 eggs and 3 were used: 12 minus 3 leaves 9.',ru:'Было 12 яиц, использовали 3: 12 минус 3 равно 9.'},
          codeValue:'9'
        },
        {
          prompt:{he:'ויטמין C נמצא בשפע בפירות הדר ותורם לבריאות. סוחטים לכוס 4 תפוזים ו-3 לימונים. כמה פירות נסחטו בסך הכול?',en:'Citrus fruits are rich in vitamin C, which supports good health. 4 oranges and 3 lemons are squeezed into a glass. How many fruits were squeezed altogether?',ru:'В цитрусовых много витамина C, полезного для здоровья. В стакан выжали сок из 4 апельсинов и 3 лимонов. Сколько всего фруктов использовали?'},
          answer:{he:'7 פירות.',en:'7 fruits.',ru:'7 фруктов.'},
          explanation:{he:'מחברים את 4 התפוזים ואת 3 הלימונים: 4 + 3 = 7.',en:'Add the 4 oranges and 3 lemons: 4 + 3 = 7.',ru:'Складываем 4 апельсина и 3 лимона: 4 + 3 = 7.'},
          codeValue:'7'
        },
        {
          prompt:{he:'אני נוזל שקוף שחיוני לחיים ומהווה בערך 60% מגוף האדם. מה אני? כמה אותיות יש במילה העברית „מים”?',en:'I am a clear liquid essential for life and make up about 60% of the human body. What am I? How many letters are in the Hebrew word „מים”?',ru:'Я – прозрачная жидкость, необходимая для жизни; я составляю около 60% тела человека. Что это? Сколько букв в слове на иврите «מים»?'},
          answer:{he:'מים; במילה יש 3 אותיות.',en:'Water; the Hebrew word has 3 letters.',ru:'Вода; в слове на иврите 3 буквы.'},
          explanation:{he:'הנוזל הוא מים. במילה העברית „מים” יש שלוש אותיות.',en:'The liquid is water. The Hebrew word „מים” has three letters.',ru:'Это вода. В слове на иврите «מים» три буквы.'},
          codeValue:'3'
        }
      ]
    },
    {
      title:{he:'הספרייה המכושפת',en:'The Enchanted Library',ru:'Заколдованная библиотека'},
      stations:[
        {
          prompt:{he:'אני נער מעץ שאפו מתארך כשהוא משקר. מי אני? אם האף שלי התארך ב-2 ס״מ על כל שקר ובסך הכול התארך ב-8 ס״מ, כמה שקרים סיפרתי?',en:'I am a wooden boy whose nose grows longer when he lies. Who am I? If my nose grew 2 cm for each lie and grew 8 cm altogether, how many lies did I tell?',ru:'Я деревянный мальчик, у которого удлиняется нос, когда он лжёт. Кто я? Если за каждую ложь нос вырастал на 2 см и всего вырос на 8 см, сколько раз я солгал?'},
          answer:{he:'פינוקיו; הוא סיפר 4 שקרים.',en:'Pinocchio; he told 4 lies.',ru:'Пиноккио; он солгал 4 раза.'},
          explanation:{he:'הנער הוא פינוקיו. מחלקים 8 ס״מ ל-2 ס״מ לכל שקר: 8 ÷ 2 = 4.',en:'The boy is Pinocchio. Divide 8 cm by 2 cm per lie: 8 ÷ 2 = 4.',ru:'Это Пиноккио. Делим 8 см на 2 см за каждую ложь: 8 ÷ 2 = 4.'},
          codeValue:'4'
        },
        {
          prompt:{he:'בארמון נמצאה נעל זכוכית בודדת על המדרגות ושעון שנעצר בחצות. איזו אגדה הרמזים מזכירים? באולם היו 9 אורחים, ו-7 כבר עזבו. כמה אורחים נשארו?',en:'In a palace, someone found a single glass slipper on the stairs and a clock stopped at midnight. Which fairy tale do these clues suggest? There were 9 guests in the hall, and 7 have left. How many guests remain?',ru:'Во дворце на лестнице нашли одну хрустальную туфельку, а часы остановились в полночь. Какую сказку напоминают эти подсказки? В зале было 9 гостей, 7 уже ушли. Сколько гостей осталось?'},
          answer:{he:'סינדרלה; נשארו 2 אורחים.',en:'Cinderella; 2 guests remain.',ru:'Золушка; осталось 2 гостя.'},
          explanation:{he:'נעל הזכוכית וחצות מזכירות את סינדרלה. מחסרים 7 מ-9 ונשארים 2 אורחים.',en:'The glass slipper and midnight point to Cinderella. Subtract 7 from 9: 2 guests remain.',ru:'Хрустальная туфелька и полночь напоминают сказку о Золушке. Вычитаем 7 из 9 – остаётся 2 гостя.'},
          codeValue:'2'
        },
        {
          prompt:{he:'כדי לקרוא סיפור, האור מוחזר מן הדף הלבן אל העין, ואילו הדיו השחור בולע אור. בספר יש 10 פרקים וקראת 5. כמה פרקים נשארו לקרוא?',en:'To read a story, light reflects from the white page to the eye, while black ink absorbs light. A book has 10 chapters, and you have read 5. How many chapters are left to read?',ru:'Чтобы читать книгу, свет отражается от белой страницы и попадает в глаза, а чёрные чернила поглощают свет. В книге 10 глав, и ты прочитал 5. Сколько глав осталось прочитать?'},
          answer:{he:'נשארו 5 פרקים.',en:'5 chapters are left.',ru:'Осталось 5 глав.'},
          explanation:{he:'בספר 10 פרקים וקראת 5: 10 פחות 5 שווה 5.',en:'The book has 10 chapters and you read 5: 10 minus 5 equals 5.',ru:'В книге 10 глав, ты прочитал 5: 10 минус 5 равно 5.'},
          codeValue:'5'
        },
        {
          prompt:{he:'אני ספר עבה שמסביר את הפירוש של מילים בשפה. מה שמי? כמה אותיות יש במילה העברית „מילון”?',en:'I am a thick book that explains the meanings of words in a language. What am I? How many letters are in the Hebrew word „מילון”?',ru:'Я – толстая книга, которая объясняет значения слов. Что это? Сколько букв в слове на иврите «מילון»?'},
          answer:{he:'מילון; במילה יש 5 אותיות.',en:'A dictionary; the Hebrew word has 5 letters.',ru:'Словарь; в слове на иврите 5 букв.'},
          explanation:{he:'ספר שמסביר פירושי מילים נקרא מילון. במילה העברית „מילון” יש חמש אותיות.',en:'A book that explains word meanings is a dictionary. The Hebrew word „מילון” has five letters.',ru:'Книга, объясняющая значения слов, – это словарь. В слове на иврите «מילון» пять букв.'},
          codeValue:'5'
        }
      ]
    },
    {
      title:{he:'האצטדיון האולימפי',en:'The Olympic Stadium',ru:'Олимпийский стадион'},
      stations:[
        {
          prompt:{he:'אני ספורט שבו שוחים בבריכה בסגנונות כמו חתירה וחזה. איני ריצה או רכיבה. איזה ספורט אני? שחיין שוחה 2 בריכות הלוך וחזור, כלומר 4 אורכים. כמה פעמים הוא נוגע בקיר?',en:'I am a sport in which people swim in a pool using styles such as freestyle and breaststroke. I am not running or cycling. What sport am I? A swimmer swims 2 lengths there and back, for 4 lengths altogether. How many times does the swimmer touch the wall?',ru:'Я – вид спорта, в котором плавают в бассейне разными стилями, например вольным стилем и брассом. Это не бег и не велоспорт. Что это за спорт? Пловец проплыл 2 бассейна туда и обратно – всего 4 длины. Сколько раз он коснулся стенки?'},
          answer:{he:'שחייה; השחיין נוגע בקיר 4 פעמים.',en:'Swimming; the swimmer touches the wall 4 times.',ru:'Плавание; пловец касается стенки 4 раза.'},
          explanation:{he:'הספורט הוא שחייה. בסיום כל אחד מארבעת האורכים נוגעים בקיר, ולכן יש 4 נגיעות.',en:'The sport is swimming. The swimmer touches the wall at the end of each of the 4 lengths.',ru:'Это плавание. Пловец касается стенки в конце каждого из 4 отрезков.'},
          codeValue:'4'
        },
        {
          prompt:{he:'על המסלול נמצא מקל שליחים שנפל, שעון עצר שבור ו-3 בקבוקי מים ריקים. בקבוצת שליחים רצים 4 רצים, ורק 3 סיימו. כמה רצים לא סיימו?',en:'On the track, someone found a dropped relay baton, a broken stopwatch, and 3 empty water bottles. A relay team has 4 runners, but only 3 finished. How many runners did not finish?',ru:'На дорожке нашли упавшую эстафетную палочку, сломанный секундомер и 3 пустые бутылки. В эстафете участвуют 4 бегуна, но финишировали только 3. Сколько бегунов не финишировали?'},
          answer:{he:'רץ אחד לא סיים.',en:'1 runner did not finish.',ru:'1 бегун не финишировал.'},
          explanation:{he:'מתוך 4 רצים, 3 סיימו: 4 פחות 3 שווה 1.',en:'Out of 4 runners, 3 finished: 4 minus 3 equals 1.',ru:'Из 4 бегунов финишировали 3: 4 минус 3 равно 1.'},
          codeValue:'1'
        },
        {
          prompt:{he:'החיכוך בין סוליית הנעל לרצפה עוזר לספורטאים לא להחליק. לשחקן כדורסל יש 2 נעליים. כמה נעליים יש ל-5 שחקנים? חלקו את התוצאה ב-2.',en:'Friction between a shoe sole and the floor helps athletes avoid slipping. A basketball player has 2 shoes. How many shoes do 5 players have? Divide the result by 2.',ru:'Трение между подошвой обуви и полом помогает спортсменам не скользить. У баскетболиста 2 кроссовка. Сколько кроссовок у 5 игроков? Разделите результат на 2.'},
          answer:{he:'יש 10 נעליים; מחלקים ב-2 ומקבלים 5.',en:'There are 10 shoes; dividing by 2 gives 5.',ru:'Всего 10 кроссовок; делим на 2 и получаем 5.'},
          explanation:{he:'ל-5 שחקנים יש 5 × 2 = 10 נעליים. מחלקים 10 ב-2 ומקבלים 5.',en:'Five players have 5 × 2 = 10 shoes. Divide 10 by 2 to get 5.',ru:'У 5 игроков 5 × 2 = 10 кроссовок. Делим 10 на 2 и получаем 5.'},
          codeValue:'5'
        },
        {
          prompt:{he:'אני סמל אולימפי המורכב מטבעות צבעוניות השזורות זו בזו. מה אני? כמה טבעות יש בסמל האולימפי?',en:'I am an Olympic symbol made of interlinked colored rings. What am I? How many rings are in the Olympic symbol?',ru:'Я – олимпийский символ из переплетённых цветных колец. Что это? Сколько колец в олимпийском символе?'},
          answer:{he:'הטבעות האולימפיות; יש 5 טבעות.',en:'The Olympic rings; there are 5 rings.',ru:'Олимпийские кольца; всего 5 колец.'},
          explanation:{he:'הסמל האולימפי מורכב מחמש טבעות צבעוניות משולבות.',en:'The Olympic symbol is made of five interlinked colored rings.',ru:'Олимпийский символ состоит из пяти переплетённых цветных колец.'},
          codeValue:'5'
        }
      ]
    }
  ]};
})(globalThis);
