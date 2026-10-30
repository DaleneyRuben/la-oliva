import ftLogo from '@/assets/public-info/logo-ft.png';
import { Botanical } from './Botanical';

export function PublicInfoFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-public-rule">
      <Botanical name="branch" className="bottom-11 left-0 hidden w-[210px] md:block" />
      <Botanical
        name="leaves"
        className="-right-2.5 -top-5 hidden w-[96px] -scale-x-100 opacity-85 md:block"
      />
      <div className="relative flex justify-center px-6 pb-[84px] pt-12">
        <img
          src={ftLogo}
          alt="La Oliva, catering con altura. Sabor, calidad, experiencia"
          className="block h-auto w-[220px] md:w-[280px]"
        />
      </div>
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-11 rounded-t-[60%_34px] bg-public-olive"
      />
    </footer>
  );
}
