import publicSiteConfig from '../../site.public.json';

type PublicSiteConfig = {
  siteName: string;
  siteUrl: string;
  whatsappNumber: string;
};

const config = publicSiteConfig as PublicSiteConfig;

export const SITE_NAME = config.siteName;
export const SITE_URL = config.siteUrl.replace(/\/+$/, '');
export const WHATSAPP_NUMBER = config.whatsappNumber;
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

export function createWhatsAppLink(message?: string): string {
  if (!message) {
    return WHATSAPP_URL;
  }

  return `${WHATSAPP_URL}?text=${encodeURIComponent(message)}`;
}
