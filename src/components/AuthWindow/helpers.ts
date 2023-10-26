type authInfoRequestProps = {
  phone: string;
  code: string;
  type: string;
};
export const createAuthInfoRequest = ({
  phone,
  type,
  code,
}: authInfoRequestProps) => ({
  address: null,
  checkin_page: window.location.href,
  do_not_track: null,
  cookie_enabled: navigator.cookieEnabled,
  language: navigator.language,
  opener: null,
  phone_number: phone,
  screen_width: window.screen.width || null,
  screen_height: window.screen.height || null,
  sms_code: code,
  type,
  user_agent: navigator.userAgent,
  vendor: navigator.vendor || null,
  vendor_version: null,
});

export const getTextForTimer = (timer: number): string => {
  const t = timer.toString();

  if (t.length > 1) return `0: ${t}`;

  return `0: 0${t}`;
};
