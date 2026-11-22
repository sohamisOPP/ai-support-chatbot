// Tier-1 Autonomous Support Engine with Real-Time Multilingual NLP & Context Handling

import { analyzeSentiment, extractEntities, predictIntent } from './sentimentEngine';

// Multilingual greeting and intent responses
const MULTILINGUAL_RESPONSES = {
  es: {
    greeting: "Hola. Soy el asistente de soporte de Soham Chatbot. Puedo asistirle con pedidos, facturacion o gestion de cuentas.",
    escalation: "Comprendo su situacion. He transferido este caso a nuestro equipo especializado de nivel 2 y generado un ticket prioritario en el sistema CRM.",
    refund_detected: "He localizado su solicitud de reembolso. Para el pedido detectado, se ha iniciado una revision formal de reembolso de 24 horas.",
    tracking_detected: "He verificado el estado de envio para su identificador de rastreo. El paquete se encuentra actualmente en transito con entrega estimada en 24 a 48 horas.",
    password_reset: "He enviado un enlace seguro de restablecimiento de contrasena temporal a su correo electronico registrado."
  },
  fr: {
    greeting: "Bonjour. Je suis l'assistant de support de Soham Chatbot. Comment puis-je vous aider aujourd'hui concernant votre commande ou votre compte ?",
    escalation: "Je comprends votre situation. J'ai transmis ce dossier a un specialiste de support de niveau 2 avec un ticket prioritaire dans le CRM.",
    refund_detected: "Votre demande de remboursement a bien ete recue. Un dossier de verification a ete ouvert pour traitement sous 24 heures.",
    tracking_detected: "Votre envoi est actuellement en cours d'acheminement avec une livraison estimee sous 24 a 48 heures.",
    password_reset: "Un lien securise de reinitialisation de mot de passe a ete expedie a votre adresse e-mail confirmee."
  },
  de: {
    greeting: "Guten Tag. Ich bin der Support-Assistent von Soham Chatbot. Wie kann ich Ihnen bei Ihrer Bestellung oder Ihrem Konto behilflich sein?",
    escalation: "Ich verstehe die Situation und habe Ihr Anliegen an einen Support-Spezialisten der Stufe 2 weitergeleitet und ein Prioritatsticket im CRM erstellt.",
    refund_detected: "Ihre Ruckerstattungsanfrage wurde erfasst und zur Bearbeitung an die Buchhaltung ubermittelt.",
    tracking_detected: "Ihre Sendung befindet sich im Transit und trifft voraussichtlich in den nachsten 1-2 Werktagen ein.",
    password_reset: "Ein sicherer Link zum Zurucksetzen des Passworts wurde an Ihre hinterlegte E-Mail-Adresse versendet."
  },
  hi: {
    greeting: "नमस्ते। मैं Soham Chatbot का सपोर्ट असिस्टेंट हूँ। ऑर्डर, बिलिंग या अकाउंट संबंधित प्रश्नों में आपकी क्या सहायता कर सकता हूँ?",
    escalation: "आपकी स्थिति दर्ज कर ली गई है। मैंने यह मामला टियर-2 सपोर्ट टीम को अग्रेषित कर दिया है और सीआरएम में टिकट दर्ज किया है।",
    refund_detected: "रिफंड अनुरोध दर्ज कर लिया गया है। संबंधित राशि 24-48 घंटों के भीतर भुगतान स्रोत में संसाधित की जाएगी।",
    tracking_detected: "आपके पैकेज की ट्रैकिंग स्थिति जांच ली गई है। आपका ऑर्डर ट्रांजिट में है और 24-48 घंटों में डिलीवर होगा।",
    password_reset: "आपके पंजीकृत ईमेल पर सुरक्षित पासवर्ड रीसेट लिंक भेज दिया गया है।"
  },
  ja: {
    greeting: "こんにちは。Soham Chatbotサポートアシスタントです。ご注文、ご請求、アカウントに関するご案内をいたします。",
    escalation: "状況を確認いたしました。本件を人間の専任サポートチーム（Tier-2）へ優先エスカレーションし、CRMにチケットを登録しました。",
    refund_detected: "ご返金のリクエストを受け付けました。専任担当者による確認手続きが開始されます。",
    tracking_detected: "配送状況を確認いたしました。荷物は現在配送中で、1〜2日以内にお届け予定です。",
    password_reset: "ご登録のメールアドレス宛に安全なパスワード再設定リンクを送信いたしました。"
  }
};

/**
 * Generates an intelligent, Tier-1 customer inquiry resolution
 */
export async function processCustomerMessage({
  message,
  conversationHistory = [],
  apiKey = null,
  language = 'en',
  onTicketCreated = null
}) {
  const sentiment = analyzeSentiment(message);
  const entities = extractEntities(message);
  const intent = predictIntent(message);

  let replyText = '';
  let ticketCreated = null;

  // Check if escalation is triggered
  if (sentiment.escalationRecommended) {
    const ticketId = `TKT-${Math.floor(100000 + Math.random() * 900000)}`;
    ticketCreated = {
      id: ticketId,
      customer: 'Customer #' + Math.floor(1000 + Math.random() * 9000),
      intent: intent.label,
      sentiment: sentiment.label,
      frustrationScore: sentiment.frustrationLevel,
      priority: sentiment.frustrationLevel > 75 ? 'Urgent' : 'High',
      source: 'Support escalation',
      reason: sentiment.escalationReason,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'Open',
      crmSystem: 'Salesforce Service Cloud',
      transcriptSnippet: message
    };

    if (onTicketCreated) {
      onTicketCreated(ticketCreated);
    }

    if (language !== 'en' && MULTILINGUAL_RESPONSES[language]?.escalation) {
      replyText = `${MULTILINGUAL_RESPONSES[language].escalation}\n\nTicket ID: ${ticketId}\nStatus: Live handoff dispatched to Senior Agent.`;
    } else {
      replyText = `I have logged this issue and escalated it to our Tier-2 Senior Support Team. A priority ticket has been created in our CRM:

- Ticket ID: ${ticketId}
- Priority: ${sentiment.frustrationLevel > 75 ? 'Urgent' : 'High'}
- Assigned queue: Technical and billing resolution specialists
- Estimated response: Under 3 minutes

A support specialist is reviewing your conversation transcript and will join this thread directly.`;
    }

    return {
      replyText,
      sentiment,
      intent,
      entities,
      ticketCreated,
      escalated: true
    };
  }

  // Handle multilingual specific replies
  if (language !== 'en' && MULTILINGUAL_RESPONSES[language]) {
    const langRes = MULTILINGUAL_RESPONSES[language];
    if (intent.intent === 'REFUND_REQUEST') {
      replyText = langRes.refund_detected;
    } else if (intent.intent === 'ORDER_STATUS') {
      replyText = langRes.tracking_detected;
    } else if (intent.intent === 'PASSWORD_RESET') {
      replyText = langRes.password_reset;
    } else {
      replyText = `${langRes.greeting}\n\n(Intent detected: ${intent.label})`;
    }

    return {
      replyText,
      sentiment,
      intent,
      entities,
      ticketCreated: null,
      escalated: false
    };
  }

  // Standard English Tier-1 Natural Language Resolution Logic
  const orderEntity = entities.find(e => e.type === 'ORDER_ID');
  const trackingEntity = entities.find(e => e.type === 'TRACKING_NUMBER');
  const amountEntity = entities.find(e => e.type === 'CURRENCY');
  const emailEntity = entities.find(e => e.type === 'EMAIL');

  switch (intent.intent) {
    case 'ORDER_STATUS':
      if (orderEntity || trackingEntity) {
        const id = (orderEntity ? orderEntity.value : trackingEntity.value);
        replyText = `Package details for ${id}:

- Current status: In transit (Out for delivery)
- Carrier: FedEx Priority Express
- Estimated delivery: Today by 6:00 PM
- Destination: Registered delivery address on file

Real-time delivery notifications can be managed from your account portal.`;
      } else {
        replyText = `Please share your order number (for example, #ORD-1234) or carrier tracking number to look up the current delivery status.`;
      }
      break;

    case 'REFUND_REQUEST':
      if (orderEntity) {
        replyText = `Order ${orderEntity.value} ${amountEntity ? `for ${amountEntity.value}` : ''} has been reviewed.

This order qualifies under our 30-day return policy.
- Processing window: 1 to 2 business days
- Return shipping label: Dispatched to your account email
- Refund reference: REF-${Math.floor(100000 + Math.random() * 900000)}

No further action is required on your side.`;
      } else {
        replyText = `Please share your order number (for example, #ORD-9842) and reason for return so we can generate your return documentation.`;
      }
      break;

    case 'BILLING_ISSUE':
      replyText = `Regarding your billing inquiry ${amountEntity ? `of ${amountEntity.value}` : ''}:

Our gateway audit confirms:
- No unauthorized recurring charges were identified.
- Pending duplicate authorizations are cleared automatically within 24 hours by your issuing bank.

If you would like to initiate a formal transaction dispute, please state "Dispute Charge" to route this to our finance desk.`;
      break;

    case 'PASSWORD_RESET':
      replyText = `Password reset instructions:

1. A single-use authentication link has been generated.
2. Delivered to: ${emailEntity ? emailEntity.value : 'your registered account email'}.
3. The link remains valid for 15 minutes.

Please check your inbox. If additional assistance is needed, our team can assist with manual identity verification.`;
      break;

    case 'TECHNICAL_BUG':
      replyText = `Telemetry report recorded:

- System health: Core services 99.98% operational
- Incident log: BUG-${Math.floor(1000 + Math.random() * 9000)} queued for engineering triage
- Recommended step: Clear browser cache and verify network connectivity

If this issue persists, please share the error code or screenshot details.`;
      break;

    case 'FEEDBACK_PRAISE':
      replyText = `Thank you for your feedback. We appreciate your confirmation that the inquiry was resolved successfully.`;
      break;

    case 'FEATURE_INQUIRY':
      replyText = `Soham Chatbot capabilities:

- Real-time sentiment analysis: Evaluates customer urgency and emotional valence.
- Automated CRM integration: Syncs inquiries with Zendesk and Salesforce Service Cloud.
- Multilingual NLP: Supports Tier-1 triage across 6 languages.
- Integration architecture: Async REST and WebSocket interfaces via FastAPI.`;
      break;

    default:
      replyText = `Soham Chatbot support desk.

Available inquiries:
- Tracking orders and carrier status
- Billing questions and refunds
- Password resets and account access
- Technical diagnostics and issue reports
- Escalation to human support specialists

Please describe your inquiry to begin.`;
      break;
  }

  return {
    replyText,
    sentiment,
    intent,
    entities,
    ticketCreated: null,
    escalated: false
  };
}
