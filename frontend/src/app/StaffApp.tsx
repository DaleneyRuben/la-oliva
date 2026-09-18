import { PublicSiteRedirect } from '@/app/PublicSiteRedirect';
import { ThemeProvider } from '@/features/theme/theme';
import { StaffRouter } from '@/router';

type StaffAppProps = {
  publicSiteUrl?: string;
  redirect?: (url: string) => void;
};

export function StaffApp({ publicSiteUrl, redirect }: StaffAppProps) {
  return (
    <ThemeProvider>
      <StaffRouter
        publicRegistrationElement={
          <PublicSiteRedirect publicSiteUrl={publicSiteUrl} redirect={redirect} />
        }
      />
    </ThemeProvider>
  );
}
