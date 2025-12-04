import sha256 from 'crypto-js/sha256';
import encHex from 'crypto-js/enc-hex';

export default function useTriggerMarketingConversion() {
  return {
    sendCompleteRegistrationEvent,
    sendLeadEvent,
    sendPurchaseEvent,
    sendGoogleOfflineConversionEvent,
  };
}

function sendCompleteRegistrationEvent(
  sessionId: string,
  ipAddress: string,
  campaign: {
    id: number;
    lead_type_id: number;
    offer_id: number | string;
    lead_type_name: string;
    lead_score_baseline: number;
  },
  answers: Record<string, unknown>
) {
  sendFacebookConversion({
    eventName: 'CompleteRegistration',
    sessionId: sessionId,
    userData: {
      client_ip_address: ipAddress,
      client_user_agent: navigator.userAgent,
    },
    customData: {
      content_name: campaign.lead_type_id,
      status: '1',
      currency: 'USD',
      value: 0,
    },
    leadId: 0,
    campaign: campaign,
  });

  senGoogleAnalyticsConversion({
    event: 'completeRegistration',
    valid: true,
    session_id: sessionId,
    cid: `${campaign.id}`,
    ltid: `${campaign.lead_type_id}`,
    status: '1',
    oid: `${campaign.offer_id}`,
    event_id: sessionId,
    version: '2',
    lead_value: campaign.lead_score_baseline,
    form_response: answers,
  });
}

function sendLeadEvent(
  sessionId: string,
  ipAddress: string,
  campaign: {
    id: number;
    lead_type_id: number;
    offer_id: number | string;
    lead_type_name: string;
    lead_score_baseline: number;
  },
  answers: Record<string, unknown>,
  contact: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    zip_code: string;
  },
  leadId: number
) {
  const userDataHashed = hashAttributes({
    email: contact.email.trim(),
    phone: contact.phone.trim(),
    zip: contact.zip_code.trim(),
    fn: contact.first_name.trim(),
    ln: contact.last_name.trim(),
  });

  sendFacebookConversion({
    eventName: 'Lead',
    sessionId: sessionId,
    userData: {
      client_ip_address: ipAddress,
      client_user_agent: navigator.userAgent,
      ...userDataHashed,
    },
    customData: {
      content_name: String(campaign.lead_type_id),
      status: '1',
      currency: 'USD',
      value: 0,
    },
    leadId,
    campaign: campaign,
  });

  senGoogleAnalyticsConversion({
    event: 'Lead',
    valid: true,
    session_id: sessionId,
    cid: `${campaign.id}`,
    ltid: `${campaign.lead_type_id}`,
    status: 1,
    oid: `${campaign.offer_id}`,
    userEmail: contact.email,
    userPhone: contact.phone,
    event_id: sessionId,
    version: '2',
    lead_value: campaign.lead_score_baseline,
    form_response: answers,
  });
}

function sendPurchaseEvent(
  sessionId: string,
  ipAddress: string,
  campaign: {
    id: number;
    lead_type_id: number;
    offer_id: number | string;
    lead_type_name: string;
    lead_score_baseline: number;
  },
  answers: Record<string, unknown>,
  contact: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    zip_code: string;
  },
  leadId: number
) {
  const userDataHashed = hashAttributes({
    email: contact.email.trim(),
    phone: contact.phone.trim(),
    zip: contact.zip_code.trim(),
    fn: contact.first_name.trim(),
    ln: contact.last_name.trim(),
  });

  sendFacebookConversion({
    eventName: 'Purchase',
    sessionId: sessionId,
    userData: {
      client_ip_address: ipAddress,
      client_user_agent: window.navigator.userAgent,
      ...userDataHashed,
    },
    customData: {
      content_name: String(campaign.lead_type_id),
      status: '1',
      currency: 'USD',
      value: String(campaign.lead_score_baseline),
    },
    leadId,
    campaign: campaign,
  });
}

function sendGoogleOfflineConversionEvent(campaign: {
  id: number;
  lead_type_id: number;
  offer_id: number | string;
  lead_type_name: string;
  lead_score_baseline: number;
}) {
  const clickId = gclid();
  if (!clickId) {
    return;
  }

  const payload = {
    campaign,
    lead_id: 0,
    send_to: 'google',
    data: {
      gclid: clickId,
      lead_type_id: campaign.lead_type_id,
      event_name: 'Google Offline Conversion',
    },
  };

  post(payload).catch((err) => {
    console.error(err);
  });
}

function senGoogleAnalyticsConversion(properties: unknown) {
  try {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(properties);
  } catch (err) {
    console.error('Unable to send event to GA:  ', err);
  }
}

function sendFacebookConversion({
  eventName,
  sessionId,
  userData,
  customData,
  leadId,
  campaign,
}: {
  eventName: string;
  sessionId: string;
  userData: { client_user_agent: string; client_ip_address: string };
  customData: unknown;
  leadId: number;
  campaign: unknown;
}) {
  const { fbp, fbc } = facebookUserData();

  const payload = {
    event_name: eventName,
    event_id: sessionId,
    event_time: Math.floor(Date.now() / 1000),
    action_source: 'website',
    event_source_url: window.location.href,
    user_data: {
      fbc,
      fbp,
      ...userData,
    },
    custom_data: customData,
    test_event_code: '',
  };

  const testCode = fbTestCode();
  if (testCode) {
    payload.test_event_code = testCode;
  }

  post({
    lead_id: leadId,
    data: payload,
    campaign,
    send_to: 'facebook',
  }).catch((err) => {
    console.error(err);
  });
}

function facebookUserData() {
  const fbp = getCookie('_fbp') || null;
  let fbc = getCookie('_fbc') || null;

  if (!fbc) {
    const fbclid = getURLParameter('fbclid') || null;
    if (fbclid) {
      fbc = `fb.1.${Date.now()}.${fbclid}`;
    }
  }

  return {
    fbp,
    fbc,
  };
}

async function post(payload: unknown) {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/widget/conversion`;

  try {
    await fetch(url, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: unknown) {
    console.error('Unable to register conversion: ', err);
  }
}

function getCookie(name: string) {
  const nameEQ = name + '=';
  const ca = document.cookie.split(';');
  const cookieLength = ca.length;

  for (let i = 0; i < cookieLength; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }

  return null;
}

function fbTestCode() {
  return getURLParameter('fb_test_code');
}

function gclid() {
  return getURLParameter('gclid');
}

function getURLParameter(name: string) {
  return new URLSearchParams(window.location.search).get(name);
}

function hash(value: string) {
  return sha256(value).toString(encHex);
}

function hashAttributes(obj: Record<string, string>) {
  const response: Record<string, string> = {};

  for (const [key, value] of Object.entries(obj)) {
    response[key] = hash(value);
  }

  return response;
}

declare global {
  interface Window {
    dataLayer: unknown[];
  }
}
