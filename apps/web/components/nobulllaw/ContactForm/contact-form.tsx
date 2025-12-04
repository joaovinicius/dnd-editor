'use client';

import { useForm } from 'react-hook-form';

import { Button } from '../../ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../ui/form';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/select';
import { Checkbox } from '../../ui/checkbox';
import { useState } from 'react';
import { SuccessMessage } from './success-message';
import { FailureMessage } from './failure-message';
import { validatePostalCode } from '../../../lib/address';
import { validatePhoneNumber } from '../../../lib/phone-number';

const MarketingConversion = () =>
  import(
    /* webpackChunkName: "conversion-script" */ '../../../hooks/useTriggerMarketingConversion'
  ).then((m) => m.default());

declare global {
  interface Window {
    JLGAnalytics: { data: () => object };
  }
}

function maskUSPhone(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 10);

  const len = digits.length;

  if (len === 0) return '';
  if (len < 4) return `(${digits}`;
  if (len < 7) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;

  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

const CAMPAIGN = {
  form_id: 75,
  cid: '128',
  oid: '1908',
  version: '2',
  lead_source_id: '1',
  lead_source_type: '0',
  lead_source_type_name: 'Unknown',
  lead_type_id: '71',
  lead_type_name: 'Personal Injury',
};

const PHONE_MIN_LENGTH = 14;

export const defaultConsentTerms = `
<p>
    I hereby expressly consent to receive automated
    communications including calls, texts, emails, and/or
    prerecorded messages. By submitting this form, you agree to
    our Terms &amp; acknowledge our 
    <a
      href="https://www.nobulllaw.com/legals/privacy-policy"
      rel="noopener noreferrer"
      target="_blank"
    >
      Privacy Policy
    </a>
    .
</p>
`;

export type ConsentTermsProps = {
  consentTerms?: string;
}

type FormData = {
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  zip_code: string;
  case_type: string;
  details: string;
  consented: boolean;
};

export function ContactForm(
  { consentTerms = defaultConsentTerms }: ConsentTermsProps = {
    consentTerms: defaultConsentTerms,
  }
) {
  const [leadSubmissionSucceeded, setLeadSubmissionSucceeded] =
    useState<boolean>();
  const [leadSubmissionFailed, setLeadSubmissionFailed] = useState<boolean>();
  const form = useForm<FormData>({
    defaultValues: {
      first_name: '',
      last_name: '',
      phone: '',
      email: '',
      zip_code: '',
      case_type: '',
      details: '',
      consented: undefined,
    },
  });
  const {
    formState: { isSubmitting },
    setError,
    setValue,
  } = form;

  const searchUrlParam = (param: string) => {
    const params = new URLSearchParams(window.location.search);
    return params.get(param) || '';
  };

  const randomString = (length = 32) => {
    const array = new Uint8Array(length);
    window.crypto.getRandomValues(array);
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    return Array.from(
      array,
      (byte) => characters[byte % characters.length]
    ).join('');
  };

  const clientIpAddress = async () => {
    try {
      const response = await fetch('https://api.ipify.org?format=json');

      if (response.ok) {
        const data = await response.json();
        if (data.ip) {
          return data.ip;
        }
      }
    } catch (error) {
      console.error('Error fetching IP address:', error);
    }

    return null;
  };

  async function getCampaign() {
    const oid = searchUrlParam('oid') || 1908;
    const cid = searchUrlParam('cid') || 128;
    const domain = window.location.hostname;
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/widget/forms/${CAMPAIGN.form_id}?campaign_id=${cid}&offer_id=${oid}&domain=${domain}`
    );

    if (response.ok) {
      const responseJson = await response.json();

      return {
        form_id: 75,
        cid: responseJson.campaign.id,
        oid: responseJson.campaign.offer_id,
        version: '2',
        lead_source_id: responseJson.campaign.lead_source_id,
        lead_source_type: responseJson.campaign.lead_source_type,
        lead_source_type_name: responseJson.campaign.lead_source_type_name,
        lead_type_id: responseJson.campaign.lead_type_id,
        lead_type_name: responseJson.campaign.lead_type_name,
      };
    }

    return {
      form_id: CAMPAIGN.form_id,
      cid: CAMPAIGN.cid,
      oid: CAMPAIGN.oid,
      version: '2',
      lead_source_id: CAMPAIGN.lead_source_id,
      lead_source_type: '0',
      lead_source_type_name: CAMPAIGN.lead_source_type_name,
      lead_type_id: CAMPAIGN.lead_type_id,
      lead_type_name: CAMPAIGN.lead_type_name,
    };
  }

  async function onSubmit(values: FormData) {
    const sessionId = randomString();
    const ipAddress = (await clientIpAddress()) || '';

    const campaign = await getCampaign();

    let analytics = {};

    try {
      analytics = window['JLGAnalytics'] ? window['JLGAnalytics'].data() : {};
    } catch (e) {}

    const payload = {
      campaign: {
        id: campaign.cid,
        lead_type_id: campaign.lead_type_id,
        lead_type_name: campaign.lead_type_name,
        lead_source_id: campaign.lead_source_id,
        lead_source_type: campaign.lead_source_type,
        lead_source_type_name: campaign.lead_source_type_name,
        callback_settings: {},
        offer_id: campaign.oid,
        form_id: campaign.form_id,
        lead_score_baseline: 0,
      },
      session_id: sessionId,
      ip_address: ipAddress,
      user_agent: navigator.userAgent,
      is_qualified: true,
      is_2fa_enabled: false,
      lead_score: 0,
      contact: {
        ...values,
      },
      answers: {
        '331': {
          value: values.case_type,
          score: 0,
        },
      },
      analytics,
    };

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/widget/forms/${CAMPAIGN.form_id}/visitors/leads`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }
    );

    const useTriggerMarketingConversion = await MarketingConversion();
    const {
      sendCompleteRegistrationEvent,
      sendLeadEvent,
      sendPurchaseEvent,
      sendGoogleOfflineConversionEvent,
    } = useTriggerMarketingConversion;

    if (response.ok) {
      const responsePayload = await response.json();
      const { lead_id } = responsePayload;

      setLeadSubmissionSucceeded(true);
      sendCompleteRegistrationEvent(
        sessionId,
        ipAddress,
        payload.campaign,
        payload.answers
      );
      sendLeadEvent(
        sessionId,
        ipAddress,
        payload.campaign,
        payload.answers,
        payload.contact,
        lead_id
      );
      sendPurchaseEvent(
        sessionId,
        ipAddress,
        payload.campaign,
        payload.answers,
        payload.contact,
        lead_id
      );
      sendGoogleOfflineConversionEvent(payload.campaign);
      return;
    }

    setLeadSubmissionFailed(true);
  }

  const onEnterPostalCode = async (postalCode: string) => {
    const { is_valid: isValid } = await validatePostalCode(postalCode);

    if (!isValid) {
      setError('zip_code', { type: 'manual', message: 'Invalid postal code' });
      return;
    }

    setValue('zip_code', postalCode, { shouldValidate: true });
  };

  const onEnterPhoneNumber = async (phoneNumber: string) => {
    const phoneNumberWithDDI = `+1${phoneNumber}`;

    const { is_valid: isValid } = await validatePhoneNumber(phoneNumberWithDDI);

    if (!isValid) {
      setError('phone', { type: 'manual', message: 'Invalid phone number' });
      return;
    }

    setValue('phone', phoneNumber, { shouldValidate: true });
  };

  const inputClassName =
    'bg-white border-black rounded-sm !py-3 shadow-0 focus-visible:border-0 focus-visible:ring-0 h-auto h-[46px]';

  if (leadSubmissionSucceeded) {
    return <SuccessMessage />;
  }

  if (leadSubmissionFailed) {
    return <FailureMessage />;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 grid-rows-2 gap-4 md:grid-cols-2 md:grid-rows-1">
          <FormField
            control={form.control}
            name="first_name"
            rules={{
              required: 'First name is required',
              minLength: {
                value: 2,
                message: 'First name must have at least 2 characters',
              },
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="first_name" className="sr-only">
                  First Name
                </FormLabel>
                <FormControl>
                  <Input
                    id="first_name"
                    placeholder="First name"
                    {...field}
                    className={inputClassName}
                    aria-describedby="first-name-description"
                  />
                </FormControl>
                <FormMessage id="first-name-description" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="last_name"
            rules={{
              required: 'Last name is required',
              minLength: {
                value: 2,
                message: 'Last name must have at least 2 characters',
              },
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="last_name" className="sr-only">
                  Last Name
                </FormLabel>
                <FormControl>
                  <Input
                    id="last_name"
                    placeholder="Last name"
                    {...field}
                    className={inputClassName}
                    aria-describedby="last-name-description"
                  />
                </FormControl>
                <FormMessage id="last-name-description" />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-1 grid-rows-2 gap-4 md:grid-cols-2 md:grid-rows-1">
          <FormField
            control={form.control}
            name="phone"
            rules={{
              required: 'Phone is required',
              minLength: {
                value: PHONE_MIN_LENGTH,
                message: 'Phone is invalid',
              },
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="phone" className="sr-only">
                  Phone Number
                </FormLabel>
                <FormControl>
                  <FormControl>
                    <Input
                      id="phone"
                      placeholder="Phone"
                      {...field}
                      onChange={(e) => {
                        field.onChange(maskUSPhone(e.target.value));
                      }}
                      onBlur={(e) => onEnterPhoneNumber(e.target.value)}
                      className={inputClassName}
                      aria-describedby="phone-description"
                    />
                  </FormControl>
                </FormControl>
                <FormMessage id="phone-description" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="zip_code"
            rules={{
              required: 'Zipcode name is required',
              minLength: {
                value: 5,
                message: 'Zip code must have at least 5 characters',
              },
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="zip_code" className="sr-only">
                  Zip Code
                </FormLabel>
                <FormControl>
                  <Input
                    id="zip_code"
                    placeholder="Postal code"
                    {...field}
                    className={inputClassName}
                    onBlur={(e) => onEnterPostalCode(e.target.value)}
                    aria-describedby="zip-code-description"
                  />
                </FormControl>
                <FormMessage id="zip-code-description" />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="email" className="sr-only">
                Email
              </FormLabel>
              <FormControl>
                <Input
                  id="email"
                  placeholder="Email"
                  {...field}
                  className={inputClassName}
                  aria-describedby="email-description"
                />
              </FormControl>
              <FormMessage id="email-description" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="case_type"
          rules={{
            required: 'Case type is required',
            validate: (value) =>
              ['1731', '1732', '1734', '1735', '1736', '1737'].includes(
                value
              ) || 'Invalid case type',
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="case_type" className="sr-only">
                Case Type
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger
                    id="case_type-trigger"
                    aria-describedby="case-type-description"
                    aria-controls="case_type"
                    aria-label="Case Type"
                    className="shadow-0 w-full rounded-sm border border-black bg-white py-3 focus-visible:ring-0 data-[size=default]:h-auto"
                  >
                    <SelectValue placeholder="Case Type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent
                  id="case_type"
                  aria-describedby="case-type-description"
                >
                  <SelectItem value="1731">Auto Accident</SelectItem>
                  <SelectItem value="1732">Workplace Accidents</SelectItem>
                  <SelectItem value="1733">Medical Malpractice</SelectItem>
                  <SelectItem value="1734">Dog Bites/Animal Attack</SelectItem>
                  <SelectItem value="1735">Nursing Home Abuse</SelectItem>
                  <SelectItem value="1736">Slip and Fall</SelectItem>
                  <SelectItem value="1737">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage id="case-type-description" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="details"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="details" className="sr-only">
                Details
              </FormLabel>
              <FormControl>
                <Textarea
                  id="details"
                  placeholder="Tell us what happened"
                  className={inputClassName}
                  {...field}
                  aria-describedby="details-description"
                />
              </FormControl>
              <FormMessage id="details-description" />
            </FormItem>
          )}
        />
        <div className="flex gap-2">
          <div>
            <FormField
              control={form.control}
              name="consented"
              rules={{
                required: 'You must agree before submitting',
                validate: (value) =>
                  value === true || 'You must agree before submitting',
              }}
              render={({ field }) => (
                <FormItem id="consented-item">
                  <FormLabel htmlFor="consented" className="sr-only">
                    Consent
                  </FormLabel>
                  <FormControl>
                    <Checkbox
                      id="consented"
                      checked={field.value}
                      onCheckedChange={(checked) => field.onChange(checked)}
                      className="data-[state=checked]:bg-brand-primary data-[state=checked]:border-brand-primary border-black"
                      aria-labelledby="consent-terms"
                      aria-describedby="consent-terms-description"
                    />
                  </FormControl>
                  <FormMessage id="consent-terms-description" />
                </FormItem>
              )}
            />
          </div>
          <div
            id="consent-terms"
            className="consent-terms"
            dangerouslySetInnerHTML={{ __html: consentTerms }}
          />
        </div>
        <Button
          className="font-work-sans w-full cursor-pointer bg-[#0468B2] py-7 text-xl font-bold hover:bg-[#0468B2]/90 text-white"
          type="submit"
          disabled={isSubmitting}
          aria-describedby="submit-description"
        >
          Start your Claim
        </Button>
      </form>
    </Form>
  );
}

export default ContactForm;
