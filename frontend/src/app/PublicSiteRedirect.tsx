import { useEffect } from 'react';
import { PUBLIC_SITE_URL } from '@/utils/env';

type PublicSiteRedirectProps = {
  publicSiteUrl?: string;
  redirect?: (url: string) => void;
};

const replaceLocation = (url: string) => window.location.replace(url);

function registrationUrl(publicSiteUrl: string) {
  if (!publicSiteUrl) return '';
  return new URL('/registro', publicSiteUrl).toString();
}

export function PublicSiteRedirect({
  publicSiteUrl = PUBLIC_SITE_URL,
  redirect = replaceLocation,
}: PublicSiteRedirectProps) {
  const destination = registrationUrl(publicSiteUrl);

  useEffect(() => {
    if (destination) redirect(destination);
  }, [destination, redirect]);

  if (!destination) {
    return <p>El sitio público de registro no está configurado.</p>;
  }

  return (
    <p>
      Redirigiendo al registro público. <a href={destination}>Continuar</a>
    </p>
  );
}
