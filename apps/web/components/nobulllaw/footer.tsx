import Logo from "../ui/logo";

export function Footer() {
  return (
    <footer className="bg-brand-primary mt-10">
      <div className="max-w-8xl flex flex-col items-center justify-center gap-4 py-10 text-center text-white">
        <Logo
          color="white"
          className="mx-auto h-auto max-w-[298px] min-w-[90px]"
        />
        <p>
          © No Bull Law. All rights reserved.
          <br /> 2925 Richmond Ave, Suite 1600, Houston, TX 77098
          <br />{' '}
          <a
            className="paragraph no-underline"
            href={'#cookie-consent-renew'}
            aria-label="Update Your Cookie Consent"
          >
            Update Your Cookie Consent
          </a>{' '}
          |{' '}
          <a
            href="https://www.nobulllaw.com/legals/privacy-policy?fbclid=-1&amp;gclid=-1&amp;oid=1908"
            target="_blank"
            rel="noopener noreferrer"
            className="link-2"
          >
            Privacy Policy
          </a>
        </p>
      </div>
    </footer>
  )
}

export default Footer;