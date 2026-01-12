export type NatureType = 'high' | 'interested' | 'eval' | 'grey';
export type PuzzleKey = 'L' | 'I' | 'E' | 'C' | 'S';

export interface AEInfo {
  email: string;
  wa: string;
}

export const AE_DATA: Record<string, AEInfo> = {
  Sarah: { email: "sarah@teyes.com", wa: "+8613100000001" },
  Kevin: { email: "kevin@teyes.com", wa: "+8613100000002" },
  Leo: { email: "leo@teyes.com", wa: "+8613100000003" },
  Director: { email: "director@teyes.com", wa: "+8613100000000" }
};

export interface PuzzleMeta {
  title: string;
  question: string;
  principle: string;
}

export const PUZZLE_META: Record<PuzzleKey, PuzzleMeta> = {
  L: { title: "Location", question: "Distribution planned for [Country]?", principle: "区域法律保护及物流运费评估。" },
  I: { title: "Identity", question: "Are you a Distributor, Installer, or Retailer?", principle: "身份过滤，排除非B端噪音。" },
  E: { title: "Experience", question: "What brands/products are you carrying now?", principle: "评估实力级次，判断品牌忠诚度。" },
  C: { title: "Channel", question: "Physical shops or Online sales network?", principle: "判断市场实际吞吐资源。" },
  S: { title: "Stage", question: "Replacing current brand or expanding catalog?", principle: "判定转化紧迫度与痛点深浅。" }
};

export const SPECIAL_SCRIPTS: Record<string, string> = {
  "No Response": "Hi [Name], I noticed we haven't continued our chat. Regional distributor slots are moving fast. Do you have a quick minute to verify your shop scale so I can save your spot?",
  "Timezone": "Hi [Name], just a heads up that our Regional Manager for your area is currently offline due to timezone differences. I'm gathering all your details now so he can review your Tier-1 access first thing in the morning."
};

export interface Reply {
  text: string;
  next: string;
}

export interface ConversationNode {
  thinking: string;
  script?: string;
  script_gen?: (puzzles: Record<PuzzleKey, boolean>, formData: { loc: string; iden: string }) => string;
  tag: string;
  replies: Reply[];
}

export const CONVERSATION_TREES: Record<NatureType, { r1: ConversationNode }> = {
  high: {
    r1: {
      thinking: "表单大鱼：复述表单 [L/I] 建立专业感，直接挖掘 [E/S]。",
      script_gen: (p, f) => `Hi [Name], reviewed your distributor application for ${f.loc || '[Market]'}. Since you are a professional ${f.iden || 'partner'}, I'd like to match the best policy for you. Which brands are you currently handling, and what monthly CC3 volume are you projecting?`,
      tag: "CRM: HIGH_INTENT_AUDIT",
      replies: [
        { text: "Selling [Brand]. Targeting 200 units/mo.", next: "r2_a" },
        { text: "Need price list first to decide.", next: "r2_b" },
        { text: "Have shops, need protection details.", next: "r2_a" },
        { text: "I'm just a car enthusiast.", next: "finish_retail" }
      ]
    }
  },
  interested: {
    r1: {
      thinking: "目录意向：定性买家身份，补全国家 L。",
      script_gen: (p, f) => `Hi, thanks for downloading the 2026 TEYES catalog. Are you looking at TEYES for your local distribution opportunity or just for personal use? Also, which region are you based in?`,
      tag: "CRM: CATALOG_QUALIFY",
      replies: [
        { text: "Distribution. Based in [Market].", next: "r2_c" },
        { text: "Personal use only.", next: "finish_retail" },
        { text: "Thinking of starting a shop.", next: "r2_c" },
        { text: "Is it Android system?", next: "r2_tech" }
      ]
    }
  },
  eval: {
    r1: {
      thinking: "WA直聊：认知对齐，首要任务补全 L 和 I。",
      script_gen: (p, f) => `Hi TEYES here. Are you reaching out regarding distribution opportunities or technical support? Also, what is your business location?`,
      tag: "CRM: UNKNOWN_PROBING",
      replies: [
        { text: "Wholesale/Distribution in [Market].", next: "r2_c" },
        { text: "Retail support help.", next: "finish_support" },
        { text: "Just curious about price.", next: "r2_b" },
        { text: "Looking for [Model] price.", next: "r2_b" }
      ]
    }
  },
  grey: {
    r1: {
      thinking: "碎片流量：快速筛选，不浪费高保活话术。",
      script_gen: (p, f) => `Hi, to better assist you, please let us know if you are a business owner or a retail user. What is your country?`,
      tag: "CRM: GREY_FILTER",
      replies: [
        { text: "Shop owner in [Market].", next: "eval.r1" },
        { text: "Private user.", next: "finish_retail" },
        { text: "Price list please.", next: "r2_b" },
        { text: "No reply.", next: "finish_nurture" }
      ]
    }
  }
};

export const BRANCHES: Record<string, ConversationNode> = {
  r2_a: {
    thinking: "高价值分支：引入 AE 概念，锁定诚意，补全 C。",
    script: "Excellent. TEYES leads with 2K原装屏 tech. Since you have a professional network, I'd like to introduce our Regional Manager Sarah to discuss the exclusive protection. May I have your email to coordinate the info pack?",
    tag: "CRM: AE_PREP_HANDOVER",
    replies: [
      { text: "Email: [User Email]. Connect Sarah.", next: "r4_handover" },
      { text: "What's the discount for 500 units?", next: "r3_a" },
      { text: "Send prices here first.", next: "r3_a" },
      { text: "I already work with [Brand].", next: "r3_a" }
    ]
  },
  r2_b: {
    thinking: "防御分支：规模交换权限，补全 S。",
    script: "I understand. Wholesale tiers are scale-dependent. To lock the best margin for your region, what is your current monthly sales volume for car electronics?",
    tag: "CRM: SCALE_PROBING",
    replies: [
      { text: "Around 100 units.", next: "r3_a" },
      { text: "Just starting out.", next: "finish_nurture" },
      { text: "High volume (>500).", next: "r2_a" },
      { text: "Send wholesale catalog first.", next: "r3_a" }
    ]
  },
  r2_c: {
    thinking: "基础定性：挖掘经验 E 和资源 C。",
    script: "Glad to hear that. To help you qualify for the wholesale tier, which brands are you currently carrying, and do you have your own installation team?",
    tag: "CRM: BIZ_MAPPING",
    replies: [
      { text: "Selling [Brand], no team.", next: "r3_b" },
      { text: "Professional shop owner.", next: "r2_a" },
      { text: "Just starting as a reseller.", next: "r3_b" },
      { text: "Mostly online dropshipping.", next: "r3_b" }
    ]
  },
  r2_tech: {
    thinking: "技术引导回分销主题。",
    script: "Yes, it's a high-performance Android 2K system. Many shops use TEYES to upgrade their clients. Are you managing a car electronics shop in your area?",
    tag: "CRM: TECH_TO_BIZ",
    replies: [
      { text: "Yes, in [Market].", next: "r2_c" },
      { text: "No, personal car.", next: "finish_retail" },
      { text: "I want to install for others.", next: "r2_c" },
      { text: "Show me the OS video.", next: "r3_b" }
    ]
  },
  r3_a: {
    thinking: "异步推进：发送邮件评估表。",
    script: "Got it. I'll send our 2026 Evaluation Form to your email. Once completed, I'll sync with our Regional Manager to approve your wholesale tier. What is your best email?",
    tag: "CRM: EMAIL_EVAL_SENT",
    replies: [
      { text: "Email: [Email]. Send it.", next: "r4_close" },
      { text: "Talk here first.", next: "r3_a" },
      { text: "What are the requirements?", next: "r3_a" },
      { text: "Send to my WhatsApp.", next: "r4_close" }
    ]
  },
  r3_b: {
    thinking: "样机引导策略。",
    script: "Understood. We suggest starting with a Sample Package to verify the quality. Would you like me to send the sample ordering guide to your email first?",
    tag: "CRM: SAMPLE_PROMOTION",
    replies: [
      { text: "Yes, email it.", next: "r4_close" },
      { text: "Maybe next month.", next: "finish_nurture" },
      { text: "How much for sample?", next: "r4_close" },
      { text: "Not interested.", next: "finish_nurture" }
    ]
  },
  r4_handover: {
    thinking: "最终一击：转交 AE。",
    script: "Perfect. I'm introducing our Regional Manager to this conversation. He will handle the exclusive protection details and wholesale tiering for you. Talk soon!",
    tag: "CRM: READY_FOR_AE",
    replies: []
  },
  r4_close: {
    thinking: "结束收网：邮件闭环。",
    script: "Email sent! Includes our price list and evaluation form. Please reply there once reviewed, and I will handle the next steps for you. Talk soon!",
    tag: "CRM: CASE_CLOSE_FOLLOWUP",
    replies: []
  }
};

export const NATURE_AUTO_MAP: Record<NatureType, PuzzleKey[]> = {
  high: ['L', 'I'],
  interested: ['I'],
  eval: [],
  grey: []
};
