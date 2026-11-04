export type NatureType = 'high' | 'interested' | 'eval' | 'grey' | 'oem' | 'partner' | 'support';
export type PuzzleKey = 'L' | 'I' | 'E' | 'C' | 'S' | 'M' | 'G';

export interface AEInfo {
  name: string;
  email: string;
  wa: string;
  region: string;
  languages: string[];
  specialties: string[];
}

export const AE_DATA: Record<string, AEInfo> = {
  Sarah: {
    name: "Sarah Chen",
    email: "sarah.chen@teyesglobal.com",
    wa: "+8613923456789",
    region: "CIS / Eastern Europe / Turkey / MEA",
    languages: ["English", "Russian", "Turkish"],
    specialties: ["CC4 Pro", "CC3 2K", "OEM/ODM", "Regional Distribution"]
  },
  Kevin: {
    name: "Kevin Morales",
    email: "kevin.morales@teyesglobal.com",
    wa: "+8613812345678",
    region: "Latin America / Iberia / Americas",
    languages: ["English", "Spanish", "Portuguese"],
    specialties: ["CC4 Pro", "CC4L", "X1 Pro", "Car Audio", "Retail Chain"]
  },
  Leo: {
    name: "Leo Zhang",
    email: "leo.zhang@teyesglobal.com",
    wa: "+8613712345678",
    region: "APAC / Southeast Asia / Africa / Global English",
    languages: ["English", "Chinese", "Indonesian"],
    specialties: ["CC4 Pro", "CC3 2K", "OEM/ODM", "E-commerce Partners"]
  },
  Director: {
    name: "Michael Wang",
    email: "michael.wang@teyesglobal.com",
    wa: "+8618612345678",
    region: "Global Key Accounts / OEM Tier-1 / Strategic Partners",
    languages: ["English", "Chinese"],
    specialties: ["CC4 Pro Flagship", "OEM/ODM Volume", "Exclusive Partnerships", "Car Audio OEM"]
  }
};

export interface PuzzleMeta {
  title: string;
  question: string;
  principle: string;
}

export const PUZZLE_META: Record<PuzzleKey, PuzzleMeta> = {
  L: { title: "Location", question: "Distribution planned for [Country/Region]?", principle: "区域法律保护、物流运费评估、语言匹配度判定。" },
  I: { title: "Identity", question: "Distributor, Installer, Retailer, or OEM?", principle: "身份过滤，排除非B端噪音；OEM/ODM单独分流。" },
  E: { title: "Experience", question: "What brands/products are you carrying now?", principle: "评估实力级次，判断品牌忠诚度与替换紧迫度。" },
  C: { title: "Channel", question: "Physical shops, Online, or Both? Monthly volume?", principle: "判断市场实际吞吐资源与渠道类型。" },
  S: { title: "Stage", question: "Replacing brand, expanding catalog, or launching new?", principle: "判定转化紧迫度与痛点深浅。" },
  M: { title: "Model", question: "Interested in CC4 Pro / CC3 2K / CC4L / X1 Pro / Car Audio?", principle: "型号意图分层：旗舰型搜索者需VIP承接，入门型需成本教育。" },
  G: { title: "Language", question: "Preferred language: EN / ES / PT / TR / RU / Other?", principle: "语言匹配直接影响信任建立；西/葡/土/俄区必须用母语或双语。" }
};

export const SPECIAL_SCRIPTS: Record<string, string | Record<string, string>> = {
  "No Response": {
    en: "Hi [Name], I noticed we haven't continued our chat. Regional distributor slots for CC4 Pro are moving fast in [Region]. Do you have a quick minute to verify your shop scale so I can save your spot?",
    es: "Hola [Name], noté que no continuamos nuestra conversa. Los cupos de distribuidor regional para CC4 Pro se están agotando rápido en [Region]. ¿Tienes un minuto para confirmar el tamaño de tu tienda y guardar tu lugar?",
    pt: "Olá [Name], percebi que não continuamos nosso chat. Os slots de distribuidor regional para CC4 Pro estão acabando rápido em [Region]. Você tem um minuto para confirmar o tamanho da sua loja e garantir sua vaga?",
    tr: "Merhaba [Name], sohbetimize devam etmediğimizi fark ettim. [Region] bölgesinde CC4 Pro bölge distribütörü kontenjanları hızla doluyor. Mağaza ölçeğinizi teyit etmem için bir dakikanız var mı?",
    ru: "Здравствуйте, [Name]. Я заметил, что мы не продолжили наш разговор. Слоты регионального дистрибьютора CC4 Pro в [Region] быстро заполняются. У вас есть минута, чтобы подтвердить масштаб вашего магазина?"
  },
  "Timezone": {
    en: "Hi [Name], just a heads up that our Regional Manager for [Region] is currently offline due to timezone differences. I'm gathering all your details now so [AE] can review your Tier-1 access first thing in the morning.",
    es: "Hola [Name], aviso que nuestro Gerente Regional para [Region] está desconectado por diferencia horaria. Estoy recopilando todos tus datos ahora para que [AE] revise tu acceso Tier-1 apenas amanezca.",
    pt: "Olá [Name], aviso que nosso Gerente Regional para [Region] está offline por diferença de fuso. Estou reunindo todos os seus dados agora para que [AE] revise seu acesso Tier-1 assim que amanhecer.",
    tr: "Merhaba [Name], [Region] için Bölge Müdürümüzün saat farkı nedeniyle çevrimdışı olduğunu belirtmek isterim. [AE]'nin sabah ilk iş Tier-1 erişiminizi incelemesi için tüm detaylarınızı şimdi topluyorum.",
    ru: "Здравствуйте, [Name]. Наш региональный менеджер для [Region] сейчас офлайн из-за разницы во времени. Я собираю все ваши данные, чтобы [AE] могла рассмотреть ваш доступ Tier-1 первым делом утром."
  },
  "Sample Follow-up": {
    en: "Hi [Name], following up on the sample order. Have you had a chance to test the CC4 Pro unit? Our Regional Manager [AE] is ready to discuss bulk pricing once you confirm quality satisfaction.",
    es: "Hola [Name], haciendo seguimiento sobre el pedido de muestra. ¿Tuviste oportunidad de probar la unidad CC4 Pro? Nuestro Gerente Regional [AE] está listo para discutir precios por volumen una vez confirmes la calidad.",
    pt: "Olá [Name], fazendo follow-up sobre a amostra. Você teve chance de testar a unidade CC4 Pro? Nosso Gerente Regional [AE] está pronto para discutir preços em massa assim que confirmar a satisfação com a qualidade."
  },
  "OEM Follow-up": {
    en: "Hi [Name], regarding your OEM/ODM inquiry. Our Engineering Director has reviewed your requirements for [Model]. We can support [MOQ] units with [LeadTime] delivery. Shall we schedule a technical call?",
    es: "Hola [Name], respecto a tu consulta OEM/ODM. Nuestro Director de Ingeniería revisó tus requisitos para [Model]. Podemos soportar [MOQ] unidades con entrega en [LeadTime]. ¿Agendamos una llamada técnica?"
  }
};

export interface Reply {
  text: string;
  next: string;
}

export interface ConversationNode {
  thinking: string;
  script?: string;
  script_gen?: (puzzles: Record<PuzzleKey, boolean>, formData: { loc: string; iden: string; model: string; lang: string }) => string;
  tag: string;
  replies: Reply[];
}

// ===== PRODUCT LINE DATA =====
export const MODEL_DATA: Record<string, { name: string; tier: string; keySpec: string; targetMargin: string; pitch: string }> = {
  "CC4 Pro": {
    name: "CC4 Pro",
    tier: "Flagship",
    keySpec: "6nm Octa-core, 12TOPS NPU, DTS Audio, 2K QLED",
    targetMargin: "35-45%",
    pitch: "6nm flagship with 12TOPS NPU and DTS-certified audio — the highest-margin tier for premium installers."
  },
  "CC3 2K": {
    name: "CC3 2K",
    tier: "Mid-High",
    keySpec: "2K QLED Display, 8-core, Wireless CarPlay/Android Auto",
    targetMargin: "25-35%",
    pitch: "2K QLED with wireless CarPlay — the volume driver that built TEYES reputation in 40+ countries."
  },
  "CC4L": {
    name: "CC4L",
    tier: "Entry-Plus",
    keySpec: "QLED Display, Quad-core, CarPlay/Android Auto",
    targetMargin: "20-28%",
    pitch: "Entry-level QLED with full smartphone integration — perfect for price-sensitive markets and new shops."
  },
  "X1 Pro": {
    name: "X1 Pro",
    tier: "Entry",
    keySpec: "IPS Display, Dual-core, Wired CarPlay",
    targetMargin: "15-22%",
    pitch: "Budget-friendly IPS unit with reliable wired CarPlay — ideal for starter distributors testing the market."
  },
  "Car Audio": {
    name: "TEYES Car Audio",
    tier: "Accessory",
    keySpec: "Amplifiers, DSP, Subwoofers, Speaker Kits",
    targetMargin: "40-60%",
    pitch: "High-margin audio ecosystem — amplifiers and DSP kits that can double your per-install revenue."
  }
};

// ===== REGION & LANGUAGE MAPPING =====
export const REGION_LANGUAGE_MAP: Record<string, { primary: string; fallback: string; ae: string }> = {
  // Latin America & Iberia
  "Mexico": { primary: "es", fallback: "en", ae: "Kevin" },
  "Spain": { primary: "es", fallback: "en", ae: "Kevin" },
  "Colombia": { primary: "es", fallback: "en", ae: "Kevin" },
  "Argentina": { primary: "es", fallback: "en", ae: "Kevin" },
  "Brazil": { primary: "pt", fallback: "en", ae: "Kevin" },
  "Portugal": { primary: "pt", fallback: "en", ae: "Kevin" },
  "Venezuela": { primary: "es", fallback: "en", ae: "Kevin" },
  "Chile": { primary: "es", fallback: "en", ae: "Kevin" },
  "Peru": { primary: "es", fallback: "en", ae: "Kevin" },
  "Bolivia": { primary: "es", fallback: "en", ae: "Kevin" },
  "Ecuador": { primary: "es", fallback: "en", ae: "Kevin" },
  // Turkey & CIS
  "Turkey": { primary: "tr", fallback: "en", ae: "Sarah" },
  "Russia": { primary: "ru", fallback: "en", ae: "Sarah" },
  "Ukraine": { primary: "ru", fallback: "en", ae: "Sarah" },
  "Kazakhstan": { primary: "ru", fallback: "en", ae: "Sarah" },
  "Uzbekistan": { primary: "ru", fallback: "en", ae: "Sarah" },
  "Georgia": { primary: "ru", fallback: "en", ae: "Sarah" },
  "Azerbaijan": { primary: "tr", fallback: "ru", ae: "Sarah" },
  "Belarus": { primary: "ru", fallback: "en", ae: "Sarah" },
  // Middle East & Africa (English primary, but Arabic markets can use English)
  "Saudi Arabia": { primary: "en", fallback: "en", ae: "Leo" },
  "UAE": { primary: "en", fallback: "en", ae: "Leo" },
  "Kuwait": { primary: "en", fallback: "en", ae: "Leo" },
  "Iraq": { primary: "en", fallback: "en", ae: "Leo" },
  "Jordan": { primary: "en", fallback: "en", ae: "Leo" },
  "Egypt": { primary: "en", fallback: "en", ae: "Leo" },
  "Morocco": { primary: "en", fallback: "fr", ae: "Leo" },
  "Algeria": { primary: "en", fallback: "fr", ae: "Leo" },
  "Tunisia": { primary: "en", fallback: "fr", ae: "Leo" },
  "Nigeria": { primary: "en", fallback: "en", ae: "Leo" },
  "Kenya": { primary: "en", fallback: "en", ae: "Leo" },
  "South Africa": { primary: "en", fallback: "en", ae: "Leo" },
  "Ghana": { primary: "en", fallback: "en", ae: "Leo" },
  "Togo": { primary: "en", fallback: "fr", ae: "Leo" },
  // APAC
  "Indonesia": { primary: "en", fallback: "id", ae: "Leo" },
  "Malaysia": { primary: "en", fallback: "en", ae: "Leo" },
  "Thailand": { primary: "en", fallback: "en", ae: "Leo" },
  "Philippines": { primary: "en", fallback: "en", ae: "Leo" },
  "Vietnam": { primary: "en", fallback: "en", ae: "Leo" },
  "Singapore": { primary: "en", fallback: "en", ae: "Leo" },
  // Europe (English fallback)
  "Germany": { primary: "en", fallback: "de", ae: "Sarah" },
  "France": { primary: "en", fallback: "fr", ae: "Sarah" },
  "Italy": { primary: "en", fallback: "it", ae: "Sarah" },
  "Netherlands": { primary: "en", fallback: "nl", ae: "Sarah" },
  "Belgium": { primary: "en", fallback: "nl", ae: "Sarah" },
  "Poland": { primary: "en", fallback: "pl", ae: "Sarah" },
  "UK": { primary: "en", fallback: "en", ae: "Sarah" },
  "Sweden": { primary: "en", fallback: "sv", ae: "Sarah" },
  "Norway": { primary: "en", fallback: "no", ae: "Sarah" },
  "Denmark": { primary: "en", fallback: "da", ae: "Sarah" },
  "Finland": { primary: "en", fallback: "fi", ae: "Sarah" },
  "Czech Republic": { primary: "en", fallback: "cs", ae: "Sarah" },
  "Hungary": { primary: "en", fallback: "hu", ae: "Sarah" },
  "Romania": { primary: "en", fallback: "ro", ae: "Sarah" },
  "Greece": { primary: "en", fallback: "el", ae: "Sarah" },
  // Americas (non-LatAm)
  "USA": { primary: "en", fallback: "en", ae: "Kevin" },
  "Canada": { primary: "en", fallback: "en", ae: "Kevin" },
  // Default
  "default": { primary: "en", fallback: "en", ae: "Leo" }
};

export function getRegionConfig(country: string) {
  return REGION_LANGUAGE_MAP[country] || REGION_LANGUAGE_MAP["default"];
}

export function getLocalizedScript(scriptKey: string, country: string): string {
  const config = getRegionConfig(country);
  const scripts = SPECIAL_SCRIPTS[scriptKey];
  if (typeof scripts === 'string') return scripts;
  return scripts?.[config.primary] || scripts?.[config.fallback] || scripts?.["en"] || "";
}

// ===== CONVERSATION TREES =====
export const CONVERSATION_TREES: Record<NatureType, { r1: ConversationNode }> = {
  // === HIGH: Distributor Application / Form Lead ===
  high: {
    r1: {
      thinking: "表单大鱼：复述表单 [L/I/M] 建立专业感，按型号意图分层承接。CC4 Pro搜索者=VIP，CC3/CC4L搜索者=成本教育。",
      script_gen: (p, f) => {
        const model = f.model || (p.M ? "your selected model" : "our product line");
        const loc = f.loc || '[Market]';
        const iden = f.iden || 'partner';
        const ae = getRegionConfig(loc).ae;
        const aeName = AE_DATA[ae]?.name || 'our Regional Manager';
        
        if (model.includes("CC4 Pro") || model.includes("Flagship")) {
          return `Hi [Name], reviewed your distributor application for ${loc}. Since you're a professional ${iden} interested in the ${model}, I'd like to fast-track this. ${aeName} handles flagship partnerships in your region. Which brands are you currently upgrading from, and what's your projected monthly volume for premium head units?`;
        }
        if (model.includes("Audio") || model.includes("audio")) {
          return `Hi [Name], reviewed your application for ${loc}. I see you're interested in our ${model} line — great margin opportunity. Are you currently selling car audio equipment, or looking to add it to your existing head unit catalog?`;
        }
        return `Hi [Name], reviewed your distributor application for ${loc}. Since you are a professional ${iden}, I'd like to match the best policy for you. We currently have three tiers: CC4 Pro (6nm flagship), CC3 2K (volume leader), and CC4L (entry QLED). Which tier fits your market best, and which brands are you currently handling?`;
      },
      tag: "CRM: HIGH_INTENT_AUDIT",
      replies: [
        { text: "Selling [Brand]. Targeting 200 units/mo of CC4 Pro.", next: "r2_flagship" },
        { text: "Need price list for CC3 2K and CC4L first.", next: "r2_volume" },
        { text: "Interested in Car Audio amplifiers.", next: "r2_audio" },
        { text: "Have shops, need protection details.", next: "r2_regional" },
        { text: "I'm just a car enthusiast.", next: "finish_retail" }
      ]
    }
  },

  // === INTERESTED: Catalog Download ===
  interested: {
    r1: {
      thinking: "目录意向：定性买家身份，补全国家 L 和语言 G，检测型号偏好 M。",
      script_gen: (p, f) => {
        const loc = f.loc || 'your region';
        const lang = f.lang || 'en';
        
        if (lang === 'es') {
          return `Hola, gracias por descargar el catálogo TEYES 2026. ¿Buscas TEYES para una oportunidad de distribución local o para uso personal? También, ¿en qué región estás ubicado?`;
        }
        if (lang === 'pt') {
          return `Olá, obrigado por baixar o catálogo TEYES 2026. Você está olhando para a TEYES para uma oportunidade de distribuição local ou apenas para uso pessoal? Também, em qual região você está baseado?`;
        }
        return `Hi, thanks for downloading the 2026 TEYES catalog. Are you looking at TEYES for your local distribution opportunity or just for personal use? Also, which region are you based in?`;
      },
      tag: "CRM: CATALOG_QUALIFY",
      replies: [
        { text: "Distribution. Based in [Market].", next: "r2_c" },
        { text: "Personal use only.", next: "finish_retail" },
        { text: "Thinking of starting a shop.", next: "r2_c" },
        { text: "Is it Android system?", next: "r2_tech" },
        { text: "Quiero ser distribuidor en México.", next: "r2_c" }
      ]
    }
  },

  // === EVAL: Direct WhatsApp / Unknown ===
  eval: {
    r1: {
      thinking: "WA直聊：认知对齐，首要任务补全 L、I、G。检测OEM/型号词意图。",
      script_gen: (p, f) => {
        const msg = f.lang?.toLowerCase() || '';
        if (msg.includes('oem') || msg.includes('odm') || msg.includes('manufacture') || msg.includes('private label')) {
          return `Hi TEYES here. I see you're interested in OEM/ODM collaboration. To route you to the right director, may I know: 1) Your company name and location, 2) Target monthly volume, 3) Preferred model/platform?`;
        }
        return `Hi, TEYES here. Are you reaching out regarding distribution opportunities, OEM/ODM collaboration, or technical support? Also, what is your business location?`;
      },
      tag: "CRM: UNKNOWN_PROBING",
      replies: [
        { text: "Wholesale/Distribution in [Market].", next: "r2_c" },
        { text: "OEM/ODM inquiry from [Company].", next: "r2_oem" },
        { text: "Retail support help.", next: "finish_support" },
        { text: "Just curious about price.", next: "r2_volume" },
        { text: "Looking for CC4 Pro price.", next: "r2_flagship" }
      ]
    }
  },

  // === GREY: Fragmented Traffic ===
  grey: {
    r1: {
      thinking: "碎片流量：快速筛选，不浪费高保活话术。识别语言、型号、意图。",
      script_gen: (p, f) => {
        const msg = f.lang?.toLowerCase() || '';
        if (msg.includes('pantalla') || msg.includes('cc4') || msg.includes('cc3')) {
          return `Hi, I see you're interested in our ${msg.includes('pantalla') ? 'display units' : 'head unit models'}. To better assist you, please let us know: are you a business owner or a retail user? What is your country?`;
        }
        return `Hi, to better assist you, please let us know if you are a business owner or a retail user. What is your country?`;
      },
      tag: "CRM: GREY_FILTER",
      replies: [
        { text: "Shop owner in [Market].", next: "eval.r1" },
        { text: "Private user.", next: "finish_retail" },
        { text: "Price list please.", next: "r2_volume" },
        { text: "OEM project from [Company].", next: "r2_oem" },
        { text: "No reply.", next: "finish_nurture" }
      ]
    }
  },

  // === OEM: OEM/ODM Inquiry ===
  oem: {
    r1: {
      thinking: "OEM大单：直接判定身份与规模，跳过零售过滤，引入Director。",
      script_gen: (p, f) => {
        const loc = f.loc || '[Region]';
        return `Thank you for your OEM/ODM inquiry. TEYES supports white-label manufacturing from 500 units/month with full firmware customization. I'm gathering your requirements for our Engineering Director. What is your company name, target volume, and preferred platform (Android Auto / Custom OS)?`;
      },
      tag: "CRM: OEM_DIRECT",
      replies: [
        { text: "[Company], 1000+ units/month, Android Auto.", next: "r2_oem_detail" },
        { text: "[Company], 200 units/month to start.", next: "r2_oem_starter" },
        { text: "Just exploring options.", next: "r2_oem_explore" },
        { text: "Need car audio OEM, not head unit.", next: "r2_oem_audio" }
      ]
    }
  },

  // === PARTNER: Regional / Exclusive Partnership ===
  partner: {
    r1: {
      thinking: "区域代理：高价值，检测市场容量与排他性需求，直转Director。",
      script_gen: (p, f) => {
        const loc = f.loc || '[Region]';
        return `Hi [Name], I see you're interested in exclusive/regional partnership for ${loc}. TEYES offers territory protection for committed partners with proven channel resources. Can you share: 1) Your current monthly car electronics volume, 2) Number of active shops/installers in your network, 3) Are you currently exclusive to any brand?`;
      },
      tag: "CRM: PARTNER_EXCLUSIVITY",
      replies: [
        { text: "500+ units/month, 15 shops, not exclusive.", next: "r2_partner_vip" },
        { text: "Growing network, 100 units/month.", next: "r2_partner_growth" },
        { text: "Currently exclusive to [Brand].", next: "r2_partner_switch" },
        { text: "Looking for country-level exclusivity.", next: "r2_partner_exclusive" }
      ]
    }
  },

  // === SUPPORT: Post-purchase / Technical ===
  support: {
    r1: {
      thinking: "售后流量：收集机型+车型+国家，导售后，同时识别是否有二次采购/升级意向。",
      script_gen: (p, f) => {
        return `Hi [Name], I'm here to help with your TEYES unit. To route you to the right support specialist, could you share: 1) Your head unit model (CC4 Pro / CC3 2K / CC4L / X1 Pro), 2) Your car make and year, 3) Your country? If you're also interested in upgrading or becoming a distributor, let me know and I'll connect you with the right team.`;
      },
      tag: "CRM: SUPPORT_INTAKE",
      replies: [
        { text: "CC4 Pro in 2020 BMW, [Country]. Need firmware update.", next: "finish_support_tech" },
        { text: "CC3 2K, want to upgrade to CC4 Pro.", next: "r2_upgrade" },
        { text: "Installation issue with [Model].", next: "finish_support_install" },
        { text: "Also interested in distribution.", next: "eval.r1" }
      ]
    }
  }
};

// SDR_DATA_EOF
