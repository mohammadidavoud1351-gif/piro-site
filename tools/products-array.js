const products = [
  // ========== نشیمن — کاناپه ==========
  // تهران — ۵ تنوع
  {id:'tehran1',  varGroup:'tehran', varOrder:1, variantLabel:'تک‌نفره',  c:'living', sub:'sofa', fa:'کاناپه تهران', en:'Tehran Sofa', price:'۷۸,۰۰۰,۰۰۰',  img:'tehran1.jpg',  img2:'tehran1-d.jpg',  badge:'پرفروش'},
  {id:'tehran25', varGroup:'tehran', varOrder:2, variantLabel:'دونفره',   c:'living', sub:'sofa', fa:'کاناپه تهران', en:'Tehran Sofa', price:'۱۰۵,۰۰۰,۰۰۰', img:'tehran25.jpg', img2:'tehran25-d.jpg'},
  {id:'tehran35', varGroup:'tehran', varOrder:3, variantLabel:'سه‌نفره',  c:'living', sub:'sofa', fa:'کاناپه تهران', en:'Tehran Sofa', price:'۱۳۸,۰۵۰,۰۰۰', img:'tehran35.jpg', img2:'tehran35-d.jpg'},
  {id:'tehranl',  varGroup:'tehran', varOrder:4, variantLabel:'ال‌شکل',   c:'living', sub:'sofa', fa:'کاناپه تهران', en:'Tehran Sofa', price:'۱۴۵,۰۰۰,۰۰۰', img:'tehranl.jpg',  img2:'tehranl-d.jpg'},
  {id:'tehrancl', varGroup:'tehran', varOrder:5, variantLabel:'شزلون',    c:'living', sub:'sofa', fa:'کاناپه تهران', en:'Tehran Sofa', price:'۱۱۵,۰۰۰,۰۰۰', img:'tehrancl.jpg', img2:'tehrancl.jpg'},

  // پالما — ۵ تنوع
  {id:'palma1',  varGroup:'palma', varOrder:1, variantLabel:'تک‌نفره', c:'living', sub:'sofa', fa:'کاناپه پالما', en:'Palma Sofa', price:'۶۵,۴۵۰,۰۰۰',  img:'palma1.jpg',  img2:'palma1-d.jpg'},
  {id:'palma2',  varGroup:'palma', varOrder:2, variantLabel:'دونفره',  c:'living', sub:'sofa', fa:'کاناپه پالما', en:'Palma Sofa', price:'۹۲,۰۰۰,۰۰۰',  img:'palma2.jpg',  img2:'palma2-d.jpg'},
  {id:'palma3',  varGroup:'palma', varOrder:3, variantLabel:'سه‌نفره', c:'living', sub:'sofa', fa:'کاناپه پالما', en:'Palma Sofa', price:'۱۱۲,۷۵۰,۰۰۰', img:'palma3.jpg',  img2:'palma3-d.jpg'},
  {id:'palmal',  varGroup:'palma', varOrder:4, variantLabel:'ال‌شکل',  c:'living', sub:'sofa', fa:'کاناپه پالما', en:'Palma Sofa', price:'۱۳۵,۰۰۰,۰۰۰', img:'palmal.jpg',  img2:'palmal-d.jpg'},
  {id:'palmacl', varGroup:'palma', varOrder:5, variantLabel:'شزلون',   c:'living', sub:'sofa', fa:'کاناپه پالما', en:'Palma Sofa', price:'۱۰۵,۰۰۰,۰۰۰', img:'palmacl.jpg', img2:'palmacl-d.jpg'},

  // هرموسا — ۳ تنوع
  {id:'hermosa1', varGroup:'hermosa', varOrder:1, variantLabel:'تک‌نفره', c:'living', sub:'sofa', fa:'کاناپه هرموسا', en:'Hermosa Sofa', price:'۸۵,۰۰۰,۰۰۰',  img:'hermosa1-d.jpg', img2:'hermosa1-d.jpg', badge:'جدید'},
  {id:'hermosa2', varGroup:'hermosa', varOrder:2, variantLabel:'دونفره',  c:'living', sub:'sofa', fa:'کاناپه هرموسا', en:'Hermosa Sofa', price:'۱۲۹,۲۵۰,۰۰۰', img:'hermosa2.jpg',   img2:'hermosa2-d.jpg'},
  {id:'hermosa3', varGroup:'hermosa', varOrder:3, variantLabel:'سه‌نفره', c:'living', sub:'sofa', fa:'کاناپه هرموسا', en:'Hermosa Sofa', price:'۱۶۵,۰۰۰,۰۰۰', img:'hermosa3.jpg',   img2:'hermosa3-d.jpg'},

  // موژه — ۲ تنوع (muge1 و muge2 — فقط دکوراتیو)
  {id:'muge1', varGroup:'muge', varOrder:1, variantLabel:'تک‌نفره', c:'living', sub:'sofa', fa:'کاناپه موژه', en:'Muge Sofa', price:'۸۶,۳۵۰,۰۰۰',  img:'muge1-d.jpg', img2:'muge1-d.jpg'},
  {id:'muge2', varGroup:'muge', varOrder:2, variantLabel:'دونفره',  c:'living', sub:'sofa', fa:'کاناپه موژه', en:'Muge Sofa', price:'۱۳۸,۰۵۰,۰۰۰', img:'muge2-d.jpg', img2:'muge2-d.jpg'},

  // گوردو — ۳ تنوع
  {id:'gordo1',  varGroup:'gordo', varOrder:1, variantLabel:'تک‌نفره', c:'living', sub:'sofa', fa:'کاناپه گوردو', en:'Gordo Sofa', price:'۶۶,۰۰۰,۰۰۰',  img:'gordo1.jpg',  img2:'gordo1.jpg'},
  {id:'gordo2',  varGroup:'gordo', varOrder:2, variantLabel:'دونفره',  c:'living', sub:'sofa', fa:'کاناپه گوردو', en:'Gordo Sofa', price:'۸۸,۰۰۰,۰۰۰',  img:'gordo2.jpg',  img2:'gordo2-d.jpg'},
  {id:'gordocl', varGroup:'gordo', varOrder:3, variantLabel:'+شزلون',  c:'living', sub:'sofa', fa:'کاناپه گوردو', en:'Gordo Sofa', price:'۱۱۵,۰۰۰,۰۰۰', img:'gordocl.jpg', img2:'gordocl-d.jpg'},

  // شیتو — ۴ تنوع
  {id:'shito2',  varGroup:'shito', varOrder:1, variantLabel:'دونفره',  c:'living', sub:'sofa', fa:'کاناپه شیتو', en:'Shito Sofa', price:'۸۸,۰۰۰,۰۰۰',  img:'shito2.jpg',  img2:'shito2-d.jpg'},
  {id:'shito3',  varGroup:'shito', varOrder:2, variantLabel:'سه‌نفره', c:'living', sub:'sofa', fa:'کاناپه شیتو', en:'Shito Sofa', price:'۱۱۵,۰۰۰,۰۰۰', img:'shito3.jpg',  img2:'shito3-d.jpg'},
  {id:'shitol',  varGroup:'shito', varOrder:3, variantLabel:'ال‌شکل',  c:'living', sub:'sofa', fa:'کاناپه شیتو', en:'Shito Sofa', price:'۱۳۵,۰۰۰,۰۰۰', img:'shitol.jpg',  img2:'shitol.jpg'},
  {id:'shitocl', varGroup:'shito', varOrder:4, variantLabel:'شزلون',   c:'living', sub:'sofa', fa:'کاناپه شیتو', en:'Shito Sofa', price:'۱۰۵,۰۰۰,۰۰۰', img:'shitocl.jpg', img2:'shitocl-d.jpg'},

  // دیبا — ۲ تنوع
  {id:'diba2', varGroup:'diba', varOrder:1, variantLabel:'دونفره',  c:'living', sub:'sofa', fa:'کاناپه دیبا', en:'Diba Sofa', price:'۹۸,۴۵۰,۰۰۰',  img:'diba2.jpg', img2:'diba2-d.jpg'},
  {id:'diba3', varGroup:'diba', varOrder:2, variantLabel:'سه‌نفره', c:'living', sub:'sofa', fa:'کاناپه دیبا', en:'Diba Sofa', price:'۱۲۵,۰۰۰,۰۰۰', img:'diba3.jpg', img2:'diba3-d.jpg'},

  // هنکا — تک‌نفره
  {id:'henka', c:'living', sub:'sofa', fa:'کاناپه هنکا', en:'Henka Sofa', price:'۸۶,۳۵۰,۰۰۰', img:'henka.jpg', img2:'henka.jpg', variantLabel:'تک‌نفره'},

  // همدم — دونفره
  {id:'hamdam', c:'living', sub:'bench', fa:'نیمکت همدم', en:'Hamdam Loveseat', price:'۵۵,۰۰۰,۰۰۰', img:'hamdam.jpg', img2:'hamdam-d.jpg'},

  // ========== نشیمن — مبل راحتی ==========
  {id:'lam',    c:'living', sub:'lounge', fa:'مبل راحتی لَم',    en:'Lam Lounge Chair',    price:'۶۵,۴۵۰,۰۰۰', img:'lam.jpg',    img2:'lam-d.jpg'},
  {id:'blando', c:'living', sub:'lounge', fa:'مبل راحتی بلاندو', en:'Blando Lounge Chair', price:'۶۱,۰۵۰,۰۰۰', img:'blando.jpg', img2:'blando-d.jpg'},

  // ========== نشیمن — صندلی ==========
  {id:'zen',    c:'living', sub:'chair', fa:'صندلی زِن',      en:'Zen Chair',      price:'۱۹,۲۵۰,۰۰۰', img:'zen.jpg',    img2:'zen-d.jpg',    badge:'پرفروش'},
  {id:'hyrcani',c:'living', sub:'chair', fa:'صندلی هیرکانی',  en:'Hyrcani Chair',  price:'۲۲,۰۰۰,۰۰۰', img:'hyrcani.jpg',img2:'hyrcani-d.jpg'},
  {id:'lean',   c:'living', sub:'chair', fa:'صندلی لین',      en:'Lean Chair',     price:'۱۶,۵۰۰,۰۰۰', img:'lean.jpg',   img2:'lean-d.jpg'},
  {id:'chairb', c:'living', sub:'chair', fa:'صندلی بی',       en:'Chair B',        price:'۲۵,۰۰۰,۰۰۰', img:'chairb.jpg', img2:'chairb-d.jpg'},

  // ========== نشیمن — استول ==========
  {id:'alef',    c:'living', sub:'barstool', fa:'استول الف', en:'Alef Barstool', price:'۱۴,۵۰۰,۰۰۰', img:'alef.jpg',    img2:'alef-d.jpg'},
  {id:'leanbar', c:'living', sub:'barstool', fa:'استول لین',  en:'Lean Barstool', price:'۱۲,۵۰۰,۰۰۰', img:'leanbar.jpg', img2:'leanbar-d.jpg'},

  // ========== نشیمن — نیمکت ==========
  // لَت — ۳ تنوع
  {id:'lat120', varGroup:'lat', varOrder:1, variantLabel:'۱۲۰cm', c:'living', sub:'bench', fa:'نیمکت لَت', en:'Lat Bench', price:'۴۵,۰۰۰,۰۰۰', img:'lat120.jpg', img2:'lat120-d.jpg'},
  {id:'lat150', varGroup:'lat', varOrder:2, variantLabel:'۱۵۰cm', c:'living', sub:'bench', fa:'نیمکت لَت', en:'Lat Bench', price:'۵۲,۸۰۰,۰۰۰', img:'lat150.jpg', img2:'lat150-d.jpg'},
  {id:'lat200', varGroup:'lat', varOrder:3, variantLabel:'۲۰۰cm', c:'living', sub:'bench', fa:'نیمکت لَت', en:'Lat Bench', price:'۶۵,۰۰۰,۰۰۰', img:'lat200.jpg', img2:'lat200-d.jpg'},

  // موگنسن — ۲ تنوع
  {id:'mogensen',  varGroup:'mogensen', varOrder:1, variantLabel:'کوتاه', c:'living', sub:'bench', fa:'نیمکت موگنسن', en:'Mogensen Bench', price:'۳۵,۰۰۰,۰۰۰', img:'mogensen.jpg',  img2:'mogensen-d.jpg'},
  {id:'mogensen2', varGroup:'mogensen', varOrder:2, variantLabel:'بلند',  c:'living', sub:'bench', fa:'نیمکت موگنسن', en:'Mogensen Bench', price:'۳۵,۰۰۰,۰۰۰', img:'mogensen2.jpg', img2:'mogensen2-d.jpg'},

  // ========== سرویس خواب — تخت‌خواب ==========
  // نوشا — ۲ تنوع
  {id:'nosha90',  varGroup:'nosha', varOrder:1, variantLabel:'۹۰×۲۰۰',  c:'bedroom', sub:'bed', fa:'تخت‌خواب نوشا', en:'Nosha Bed', price:'۷۱,۵۰۰,۰۰۰', img:'nosha90.jpg',  img2:'nosha90-d.jpg'},
  {id:'nosha160', varGroup:'nosha', varOrder:2, variantLabel:'۱۶۰×۲۰۰', c:'bedroom', sub:'bed', fa:'تخت‌خواب نوشا', en:'Nosha Bed', price:'۷۸,۰۰۰,۰۰۰', img:'nosha160.jpg', img2:'nosha160-d.jpg'},

  // لیندا
  {id:'linda160', c:'bedroom', sub:'bed', fa:'تخت‌خواب لیندا', en:'Linda Bed', price:'۸۵,۰۰۰,۰۰۰', img:'linda160.jpg', img2:'linda160-d.jpg', variantLabel:'۱۶۰×۲۰۰'},

  // ندا — ۲ تنوع
  {id:'neda90',  varGroup:'neda', varOrder:1, variantLabel:'۹۰×۲۰۰',  c:'bedroom', sub:'bed', fa:'تخت‌خواب ندا', en:'Neda Bed', price:'۷۵,۰۰۰,۰۰۰', img:'neda90.jpg',  img2:'neda90-d.jpg',  badge:'جدید'},
  {id:'neda160', varGroup:'neda', varOrder:2, variantLabel:'۱۶۰×۲۰۰', c:'bedroom', sub:'bed', fa:'تخت‌خواب ندا', en:'Neda Bed', price:'۸۸,۰۰۰,۰۰۰', img:'neda160.jpg', img2:'neda160-d.jpg', badge:'جدید'},

  // الارا — فقط دکوراتیو
  {id:'elara160', c:'bedroom', sub:'bed', fa:'تخت‌خواب الارا', en:'Elara Bed', price:'۱۰۴,۵۰۰,۰۰۰', img:'elara160-d.jpg', img2:'elara160-d.jpg', variantLabel:'۱۶۰×۲۰۰'},

  // ========== سرویس خواب — پاتختی ==========
  {id:'mono',     c:'bedroom', sub:'nightstand', fa:'پاتختی مونو', en:'Mono Nightstand',  price:'۱۲,۰۰۰,۰۰۰', img:'mono.jpg',     img2:'mono-d.jpg'},
  {id:'nightmood',c:'bedroom', sub:'nightstand', fa:'پاتختی مود',  en:'Mood Nightstand',  price:'۱۸,۰۰۰,۰۰۰', img:'nightmood.jpg',img2:'nightmood-d.jpg'},

  // ========== سرویس خواب — دراور ==========
  {id:'dresser',  c:'bedroom', sub:'dresser', fa:'دراور مود',       en:'Mood Dresser',       price:'۴۵,۰۰۰,۰۰۰', img:'dresser.jpg',  img2:'dresser-d.jpg'},
  {id:'dresser2', c:'bedroom', sub:'dresser', fa:'دراور مود لارج',  en:'Mood Dresser Large', price:'۶۵,۰۰۰,۰۰۰', img:'dresser2.jpg', img2:'dresser2-d.jpg'},

  // ========== سرویس خواب — رخت‌آویز ==========
  {id:'tana', c:'bedroom', sub:'hanger', fa:'رخت‌آویز تانا', en:'Tana Clothes Hanger', price:'۲۸,۰۰۰,۰۰۰', img:'tana.jpg', img2:'tana-d.jpg'},

  // ========== میز — میز ناهارخوری ==========
  // ارسباران — ۲ تنوع
  {id:'arasbaran6', varGroup:'arasbaran', varOrder:1, variantLabel:'۶ نفره', c:'tables', sub:'dining', fa:'میز ارسباران', en:'Arasbaran Dining Table', price:'۱۱۲,۰۰۰,۰۰۰', img:'arasbaran6.jpg', img2:'arasbaran6-d.jpg', badge:'جدید'},
  {id:'arasbaran8', varGroup:'arasbaran', varOrder:2, variantLabel:'۸ نفره', c:'tables', sub:'dining', fa:'میز ارسباران', en:'Arasbaran Dining Table', price:'۱۳۵,۰۰۰,۰۰۰', img:'arasbaran8.jpg', img2:'arasbaran8-d.jpg'},

  // سِرکا — ۲ تنوع
  {id:'cerca4', varGroup:'cerca', varOrder:1, variantLabel:'۴ نفره', c:'tables', sub:'dining', fa:'میز سِرکا', en:'Cerca Dining Table', price:'۷۱,۵۰۰,۰۰۰', img:'cerca4.jpg', img2:'cerca4-d.jpg'},
  {id:'cerca8', varGroup:'cerca', varOrder:2, variantLabel:'۸ نفره', c:'tables', sub:'dining', fa:'میز سِرکا', en:'Cerca Dining Table', price:'۹۵,۰۰۰,۰۰۰', img:'cerca8.jpg', img2:'cerca8-d.jpg'},

  // کایا — فقط ۴ نفره دارد عکس
  {id:'kaya4', c:'tables', sub:'dining', fa:'میز کایا', en:'Kaya Dining Table', price:'۷۵,۹۰۰,۰۰۰', img:'kaya4-d.jpg', img2:'kaya4-d.jpg', variantLabel:'۴ نفره'},

  // مود
  {id:'diningmood',   c:'tables', sub:'dining', fa:'میز ناهارخوری مود',    en:'Mood Dining Table',    price:'۸۸,۰۰۰,۰۰۰', img:'diningmood.jpg',   img2:'diningmood-d.jpg'},
  {id:'ox',           c:'tables', sub:'dining', fa:'میز ناهارخوری OX',     en:'OX Dining Table',      price:'۹۵,۰۰۰,۰۰۰', img:'ox.jpg',           img2:'ox-d.jpg'},
  {id:'talk',         c:'tables', sub:'dining', fa:'میز ناهارخوری تاک',    en:'Talk Dining Table',    price:'۸۵,۰۰۰,۰۰۰', img:'talk-d.jpg',       img2:'talk-d.jpg'},
  {id:'pianura',      c:'tables', sub:'dining', fa:'میز پیانورا',           en:'Pianura Dining Table', price:'۷۸,۰۰۰,۰۰۰', img:'pianura.jpg',      img2:'pianura-d.jpg'},
  {id:'diningsimple', c:'tables', sub:'dining', fa:'میز ناهارخوری سیمپل',  en:'Simple Dining Table',  price:'۶۵,۰۰۰,۰۰۰', img:'diningsimple.jpg', img2:'diningsimple-d.jpg'},

  // ========== میز — میز جلو مبلی ==========
  {id:'emi',         c:'tables', sub:'coffee', fa:'میز جلو‌مبلی امی',     en:'EMI Coffee Table',      price:'۷۱,۵۰۰,۰۰۰', img:'emi.jpg',         img2:'emi-d.jpg'},
  {id:'en',          c:'tables', sub:'coffee', fa:'میز جلو‌مبلی EN',      en:'EN Coffee Table',       price:'۲۸,۰۰۰,۰۰۰', img:'en.jpg',          img2:'en-d.jpg'},
  {id:'kazoko',      c:'tables', sub:'coffee', fa:'میز جلو‌مبلی کازوکو', en:'Kazoko Coffee Table',   price:'۳۸,۰۰۰,۰۰۰', img:'kazoko.jpg',      img2:'kazoko-d.jpg'},
  {id:'sencilla',    c:'tables', sub:'coffee', fa:'میز جلو‌مبلی سنسیلا', en:'Sencilla Coffee Table', price:'۲۵,۰۰۰,۰۰۰', img:'sencilla.jpg',    img2:'sencilla-d.jpg'},
  {id:'shonin',      c:'tables', sub:'coffee', fa:'میز جلو‌مبلی شونین',  en:'Shonin Coffee Table',   price:'۳۲,۰۰۰,۰۰۰', img:'shonin.jpg',      img2:'shonin-d.jpg'},
  {id:'coffeesimple',c:'tables', sub:'coffee', fa:'میز جلو‌مبلی سیمپل',  en:'Simple Coffee Table',   price:'۲۸,۰۰۰,۰۰۰', img:'coffeesimple.jpg',img2:'coffeesimple-d.jpg'},

  // ========== میز — میز عسلی ==========
  {id:'sideen',      c:'tables', sub:'sidetable', fa:'میز عسلی EN',      en:'EN Side Table',       price:'۴۹,۵۰۰,۰۰۰', img:'sideen.jpg',      img2:'sideen-d.jpg'},
  {id:'sidemore',    c:'tables', sub:'sidetable', fa:'میز عسلی مور',     en:'More Side Table',     price:'۲۲,۰۰۰,۰۰۰', img:'sidemore.jpg',    img2:'sidemore-d.jpg'},
  {id:'nik',         c:'tables', sub:'sidetable', fa:'میز عسلی نیک',     en:'Nik Side Table',      price:'۱۵,۰۰۰,۰۰۰', img:'nik.jpg',         img2:'nik-d.jpg'},
  {id:'sidesencilla',c:'tables', sub:'sidetable', fa:'میز عسلی سنسیلا',  en:'Sencilla Side Table', price:'۱۸,۰۰۰,۰۰۰', img:'sidesencilla.jpg',img2:'sidesencilla-d.jpg'},
  {id:'shonins',     c:'tables', sub:'sidetable', fa:'میز عسلی شونین',   en:'Shonin Side Table',   price:'۱۸,۰۰۰,۰۰۰', img:'shonins.jpg',     img2:'shonins-d.jpg'},

  // ========== میز — میز بار ==========
  {id:'alto', c:'tables', sub:'bartable', fa:'میز بار آلتو', en:'Alto Bar Table', price:'۴۹,۵۰۰,۰۰۰', img:'alto.jpg', img2:'alto-d.jpg'},

  // ========== میز — میز تحریر ==========
  {id:'etude',  c:'tables', sub:'desk', fa:'میز تحریر اِتود',  en:'Etude Writing Desk',  price:'۹۵,۱۵۰,۰۰۰', img:'etude-d.jpg',  img2:'etude-d.jpg',  badge:'جدید'},
  {id:'rain',   c:'tables', sub:'desk', fa:'میز تحریر رَین',   en:'Rain Writing Desk',   price:'۷۸,۰۰۰,۰۰۰', img:'rain-d.jpg',   img2:'rain-d.jpg'},
  {id:'sketch', c:'tables', sub:'desk', fa:'میز تحریر اسکچ',   en:'Sketch Writing Desk', price:'۵۵,۰۰۰,۰۰۰', img:'sketch-d.jpg', img2:'sketch-d.jpg'},

  // ========== میز — میز آرایش ==========
  {id:'sense', c:'tables', sub:'vanity', fa:'میز آرایش سنس', en:'Sense Vanity Table', price:'۴۵,۰۰۰,۰۰۰', img:'sense.jpg', img2:'sense-d.jpg'},

  // ========== کنسول — سایدبورد ==========
  {id:'sideboard',  c:'console', sub:'sideboard', fa:'سایدبورد مود کوچک', en:'Mood Sideboard Small', price:'۶۲,۰۰۰,۰۰۰', img:'sideboard.jpg',  img2:'sideboard-d.jpg'},
  {id:'sideboard2', c:'console', sub:'sideboard', fa:'سایدبورد مود بزرگ', en:'Mood Sideboard Large', price:'۸۸,۰۰۰,۰۰۰', img:'sideboard2.jpg', img2:'sideboard2-d.jpg'},

  // ========== کنسول — کنسول ==========
  {id:'console110', varGroup:'consolemood', varOrder:1, variantLabel:'۱۱۰cm', c:'console', sub:'consoleunit', fa:'کنسول مود', en:'Mood Console', price:'۳۵,۰۰۰,۰۰۰', img:'console110.jpg', img2:'console110-d.jpg'},
  {id:'console130', varGroup:'consolemood', varOrder:2, variantLabel:'۱۳۰cm', c:'console', sub:'consoleunit', fa:'کنسول مود', en:'Mood Console', price:'۴۵,۰۰۰,۰۰۰', img:'console130.jpg', img2:'console130-d.jpg'},

  // ========== کنسول — میز تلویزیون ==========
  {id:'largo',   c:'console', sub:'tv', fa:'میز تلویزیون لارگو',  en:'Largo TV Console',  price:'۵۵,۰۰۰,۰۰۰', img:'largo.jpg',   img2:'largo-d.jpg'},
  {id:'tvmood2', c:'console', sub:'tv', fa:'میز تلویزیون مود ۲',  en:'Mood TV Console 2', price:'۴۲,۰۰۰,۰۰۰', img:'tvmood2.jpg', img2:'tvmood2.jpg'},
  {id:'tvmood3', c:'console', sub:'tv', fa:'میز تلویزیون مود ۳',  en:'Mood TV Console 3', price:'۵۵,۰۰۰,۰۰۰', img:'tvmood3.jpg', img2:'tvmood3-d.jpg'},

  // ========== کنسول — کابینت ==========
  {id:'cabinet', c:'console', sub:'cabinet', fa:'کابینت مود', en:'Mood Cabinet', price:'۵۵,۰۰۰,۰۰۰', img:'cabinet.jpg', img2:'cabinet-d.jpg'},

  // ========== کنسول — آینه ==========
  {id:'mirror', c:'console', sub:'mirror', fa:'آینه میرو', en:'Miro Mirror', price:'۱۵,۵۰۰,۰۰۰', img:'mirror.jpg', img2:'mirror-d.jpg'},

  // ========== کنسول — شلف ==========
  {id:'piso',     c:'console', sub:'shelf', fa:'شلف پیزو',          en:'Piso Shelf',          price:'۱۸,۰۰۰,۰۰۰', img:'piso-d.jpg',    img2:'piso-d.jpg'},
  {id:'sheen2s',  c:'console', sub:'shelf', fa:'شلف شین کوتاه ۲طبقه', en:'Sheen Short 2S Shelf', price:'۳۵,۰۰۰,۰۰۰', img:'sheen2s.jpg',   img2:'sheen2s-d.jpg'},
  {id:'sheen3s',  c:'console', sub:'shelf', fa:'شلف شین کوتاه ۳طبقه', en:'Sheen Short 3S Shelf', price:'۴۵,۰۰۰,۰۰۰', img:'sheen3s.jpg',   img2:'sheen3s-d.jpg'},
  {id:'sheentall',c:'console', sub:'shelf', fa:'شلف شین بلند',       en:'Sheen Tall Shelf',     price:'۷۵,۳۵۰,۰۰۰', img:'sheentall.jpg', img2:'sheentall-d.jpg'},
  {id:'sheenw',   c:'console', sub:'shelf', fa:'شلف شین عریض',       en:'Sheen Wide Shelf',     price:'۶۵,۰۰۰,۰۰۰', img:'sheenw.jpg',    img2:'sheenw-d.jpg'},

  // ========== کنسول — آباژور ==========
  {id:'kido2', varGroup:'kido', varOrder:1, variantLabel:'کوتاه', c:'console', sub:'lamp', fa:'آباژور کیدو', en:'Kido Floor Lamp', price:'۱۶,۵۰۰,۰۰۰', img:'kido2.jpg', img2:'kido2-d.jpg'},
  {id:'kido',  varGroup:'kido', varOrder:2, variantLabel:'بلند',  c:'console', sub:'lamp', fa:'آباژور کیدو', en:'Kido Floor Lamp', price:'۱۶,۵۰۰,۰۰۰', img:'kido.jpg',  img2:'kido-d.jpg'},
  {id:'rash',  c:'console', sub:'lamp', fa:'آباژور رَش', en:'Rash Floor Lamp', price:'۱۸,۰۰۰,۰۰۰', img:'rash.jpg', img2:'rash-d.jpg'},

  // ========== کنسول — باکس طبیعی ==========
  {id:'freshboxl', c:'console', sub:'cabinet', fa:'باکس طبیعی بزرگ', en:'Fresh Box Large', price:'۱۲۶,۵۰۰,۰۰۰', img:'freshboxl.jpg', img2:'freshboxl-d.jpg'},
  {id:'freshboxs', c:'console', sub:'cabinet', fa:'باکس طبیعی کوچک', en:'Fresh Box Small', price:'۶۵,۰۰۰,۰۰۰',  img:'freshboxs.jpg', img2:'freshboxs-d.jpg'},
];
