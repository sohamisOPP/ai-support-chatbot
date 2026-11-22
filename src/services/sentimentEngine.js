// Advanced Client-Side NLP & Sentiment Analysis Engine
// Implements Sentiment Scoring, Emotion Categorization, Intent Recognition & Entity Extraction

const POSITIVE_LEXICON = {
  amazing: 0.9, excellent: 0.9, awesome: 0.85, love: 0.8, great: 0.75,
  wonderful: 0.8, fantastic: 0.85, helpful: 0.7, thanks: 0.6, thank: 0.6,
  good: 0.5, best: 0.8, perfect: 0.9, resolved: 0.7, appreciated: 0.65,
  fast: 0.5, pleased: 0.6, brilliant: 0.8, super: 0.7, prompt: 0.6,
  satisfied: 0.7, smooth: 0.5, impressed: 0.8, kudos: 0.75, joy: 0.8
};

const NEGATIVE_LEXICON = {
  terrible: -0.9, horrible: -0.9, awful: -0.85, worst: -0.95, hate: -0.85,
  furious: -0.95, angry: -0.85, pissed: -0.9, disgusting: -0.9, scam: -0.95,
  fraud: -0.95, thief: -0.9, steal: -0.85, stolen: -0.85, cheat: -0.85,
  ridiculous: -0.8, unacceptable: -0.9, garbage: -0.85, trash: -0.8,
  useless: -0.8, pathetic: -0.85, incompetent: -0.9, disappointed: -0.7,
  broken: -0.65, fail: -0.65, failed: -0.7, sucks: -0.8, stupid: -0.75,
  annoying: -0.6, frustrated: -0.75, frustrating: -0.75, slow: -0.4,
  bad: -0.5, wrong: -0.5, error: -0.4, bug: -0.45, issue: -0.3,
  problem: -0.35, charged: -0.3, double: -0.4, late: -0.5, delayed: -0.45,
  unhappy: -0.6, cancel: -0.5, refund: -0.4, loss: -0.5, sue: -0.9,
  lawsuit: -0.95, lawyer: -0.85, attorney: -0.8
};

const INTENSIFIERS = {
  very: 1.4, extremely: 1.7, totally: 1.5, absolutely: 1.6, completely: 1.5,
  so: 1.3, really: 1.35, highly: 1.4, ridiculously: 1.7, immensely: 1.6,
  barely: 0.5, hardly: 0.4, slightly: 0.6, somewhat: 0.7
};

const NEGATORS = new Set([
  'not', "don't", "didn't", "won't", "can't", "never", "no", "neither",
  "hardly", "nowhere", "without"
]);

const ESCALATION_KEYWORDS = [
  'human', 'agent', 'representative', 'supervisor', 'manager', 'person',
  'speak to someone', 'talk to someone', 'real person', 'lawyer', 'attorney',
  'lawsuit', 'sue', 'legal action', 'police', 'fraud', 'scam', 'unacceptable',
  'cancel my account', 'cancel subscription', 'call me'
];

/**
 * Analyzes sentiment from input text
 */
export function analyzeSentiment(text) {
  if (!text || typeof text !== 'string') {
    return {
      score: 0,
      label: 'Neutral',
      emotion: 'Neutral',
      frustrationLevel: 0,
      escalationRecommended: false,
      escalationReason: null
    };
  }

  const rawText = text;
  const lowerText = text.toLowerCase();
  const words = lowerText.replace(/[^a-z0-9\s'-]/g, ' ').split(/\s+/).filter(Boolean);

  let totalScore = 0;
  let wordMatches = 0;
  let isNegated = false;
  let intensity = 1.0;

  for (let i = 0; i < words.length; i++) {
    const word = words[i];

    if (NEGATORS.has(word)) {
      isNegated = !isNegated;
      continue;
    }

    if (INTENSIFIERS[word]) {
      intensity = INTENSIFIERS[word];
      continue;
    }

    let wordVal = 0;
    if (POSITIVE_LEXICON[word]) {
      wordVal = POSITIVE_LEXICON[word];
    } else if (NEGATIVE_LEXICON[word]) {
      wordVal = NEGATIVE_LEXICON[word];
    }

    if (wordVal !== 0) {
      if (isNegated) {
        wordVal = -wordVal * 0.75;
        isNegated = false;
      }
      totalScore += wordVal * intensity;
      wordMatches++;
      intensity = 1.0;
    }
  }

  // Check for ALL CAPS (shouting indicator)
  const lettersOnly = rawText.replace(/[^A-Za-z]/g, '');
  if (lettersOnly.length > 8) {
    const uppercaseCount = (rawText.match(/[A-Z]/g) || []).length;
    if (uppercaseCount / lettersOnly.length > 0.6) {
      totalScore -= 0.6; // Heavy negative tilt for shouting
    }
  }

  // Check for repeated exclamation or question marks (e.g., "???!!!")
  if (/(!{2,}|\?{2,}|!\?|\?!)/.test(rawText)) {
    totalScore -= 0.3;
  }

  // Emoji sentiment
  if (/😡|🤬|👿|😠|💔|👎/.test(rawText)) totalScore -= 1.0;
  if (/😢|😭|😞|🙁/.test(rawText)) totalScore -= 0.6;
  if (/❤️|🎉|🚀|⭐|👍|😃|😊|🙌|🥳/.test(rawText)) totalScore += 0.8;

  // Normalized score between -1.0 and 1.0
  let normalizedScore = 0;
  if (wordMatches > 0 || Math.abs(totalScore) > 0) {
    const count = Math.max(wordMatches, 1);
    normalizedScore = Math.max(-1, Math.min(1, (totalScore / count) * 1.2));
  }

  // Calculate frustration index (0 to 100%)
  let frustrationLevel = 0;
  if (normalizedScore < 0) {
    frustrationLevel = Math.round(Math.abs(normalizedScore) * 100);
  } else if (normalizedScore < 0.2) {
    frustrationLevel = 15;
  }

  // Classify Emotion & Label
  let label = 'Neutral';
  let emotion = 'Neutral';

  if (normalizedScore <= -0.55) {
    label = 'Very Negative';
    emotion = frustrationLevel > 80 ? 'Furious' : 'Frustrated';
  } else if (normalizedScore < -0.15) {
    label = 'Negative';
    emotion = 'Concerned';
  } else if (normalizedScore > 0.55) {
    label = 'Very Positive';
    emotion = 'Delighted';
  } else if (normalizedScore > 0.15) {
    label = 'Positive';
    emotion = 'Satisfied';
  }

  // Escalation detection
  let escalationRecommended = false;
  let escalationReason = null;

  if (frustrationLevel >= 70) {
    escalationRecommended = true;
    escalationReason = `High Frustration Detected (${frustrationLevel}%)`;
  }

  for (const keyword of ESCALATION_KEYWORDS) {
    if (lowerText.includes(keyword)) {
      escalationRecommended = true;
      escalationReason = `Customer Requested Escalation: "${keyword}"`;
      break;
    }
  }

  return {
    score: parseFloat(normalizedScore.toFixed(2)),
    label,
    emotion,
    frustrationLevel,
    escalationRecommended,
    escalationReason
  };
}

/**
 * Extracts entities like Order ID, Amounts, Tracking Number, Emails
 */
export function extractEntities(text) {
  if (!text) return [];

  const entities = [];

  // Order ID (e.g. #ORD-1234, ORD-9921, Order #12345, #98721)
  const orderRegex = /(?:order\s*#?|#)\s*([A-Z]{0,4}-?\d{4,8})/gi;
  let match;
  while ((match = orderRegex.exec(text)) !== null) {
    entities.push({
      type: 'ORDER_ID',
      label: 'Order ID',
      value: match[1].toUpperCase(),
      raw: match[0]
    });
  }

  // Tracking numbers (e.g. TRK-992182, 1Z9999999999999999, 9400100000000000000000)
  const trackingRegex = /\b(TRK-[A-Z0-9]{6,12}|1Z[A-Z0-9]{16}|9\d{21})\b/gi;
  while ((match = trackingRegex.exec(text)) !== null) {
    entities.push({
      type: 'TRACKING_NUMBER',
      label: 'Tracking #',
      value: match[0].toUpperCase(),
      raw: match[0]
    });
  }

  // Currency amounts (e.g. $49.99, €120, 50 USD, £35.00)
  const amountRegex = /(?:[\$€£]\s*(\d+(?:\.\d{2})?)|\b(\d+(?:\.\d{2})?)\s*(?:usd|eur|gbp|dollars|euros))/gi;
  while ((match = amountRegex.exec(text)) !== null) {
    const val = match[1] || match[2];
    entities.push({
      type: 'CURRENCY',
      label: 'Amount',
      value: `$${val}`,
      raw: match[0]
    });
  }

  // Email address
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g;
  while ((match = emailRegex.exec(text)) !== null) {
    entities.push({
      type: 'EMAIL',
      label: 'Customer Email',
      value: match[0].toLowerCase(),
      raw: match[0]
    });
  }

  // Deduplicate entities by type and value
  const uniqueEntities = [];
  const seen = new Set();
  for (const ent of entities) {
    const key = `${ent.type}:${ent.value}`;
    if (!seen.has(key)) {
      seen.add(key);
      uniqueEntities.push(ent);
    }
  }

  return uniqueEntities;
}

/**
 * Predicts customer intent from text
 */
export function predictIntent(text) {
  if (!text) {
    return { intent: 'GENERAL_INQUIRY', confidence: 0.5, label: 'General Inquiry' };
  }

  const lower = text.toLowerCase();

  // Pattern matrix
  const patterns = [
    {
      intent: 'ESCALATION_DEMAND',
      label: 'Escalation to Human',
      keywords: ['human', 'agent', 'person', 'representative', 'supervisor', 'manager', 'talk to someone', 'real person'],
      weight: 1.5
    },
    {
      intent: 'REFUND_REQUEST',
      label: 'Refund & Return Request',
      keywords: ['refund', 'money back', 'reimburse', 'return item', 'return', 'cancel order', 'compensation'],
      weight: 1.3
    },
    {
      intent: 'BILLING_ISSUE',
      label: 'Billing & Charges',
      keywords: ['double charged', 'charged twice', 'billing', 'invoice', 'credit card', 'payment', 'charge', 'subscription fee', 'unauthorized charge'],
      weight: 1.2
    },
    {
      intent: 'ORDER_STATUS',
      label: 'Order Tracking & Status',
      keywords: ['where is my order', 'track', 'tracking', 'package', 'delivery', 'has not arrived', 'shipping', 'transit', 'delayed'],
      weight: 1.2
    },
    {
      intent: 'PASSWORD_RESET',
      label: 'Account Access & Auth',
      keywords: ['password', 'forgot password', 'reset password', 'locked out', 'login', 'sign in', 'two-factor', '2fa', 'authenticator'],
      weight: 1.2
    },
    {
      intent: 'TECHNICAL_BUG',
      label: 'Technical Bug & Outage',
      keywords: ['bug', 'crash', 'not working', '500 error', '404', 'broken', 'glitch', 'down', 'white screen', 'fails to load'],
      weight: 1.1
    },
    {
      intent: 'FEEDBACK_PRAISE',
      label: 'Customer Praise & Feedback',
      keywords: ['thank you', 'thanks', 'amazing', 'great job', 'love this', 'awesome service', 'excellent', 'kudos'],
      weight: 1.0
    },
    {
      intent: 'FEATURE_INQUIRY',
      label: 'Feature & Product Inquiry',
      keywords: ['how do i', 'can i', 'do you have', 'feature', 'api', 'pricing', 'integration', 'export', 'setup'],
      weight: 0.9
    }
  ];

  let bestMatch = { intent: 'GENERAL_INQUIRY', label: 'General Support Inquiry', score: 0 };

  for (const item of patterns) {
    let score = 0;
    for (const kw of item.keywords) {
      if (lower.includes(kw)) {
        score += item.weight;
      }
    }
    if (score > bestMatch.score) {
      bestMatch = { intent: item.intent, label: item.label, score };
    }
  }

  const confidence = bestMatch.score > 0
    ? Math.min(0.98, 0.65 + bestMatch.score * 0.15)
    : 0.50;

  return {
    intent: bestMatch.intent,
    label: bestMatch.label,
    confidence: parseFloat(confidence.toFixed(2))
  };
}
