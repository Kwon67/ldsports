'use client';

function Footer() {
  return (
    <footer className="footer-wrapper" id="contato">
      {/* WhatsApp Group CTA */}
      <div className="bg-gradient-to-br from-green-500 via-green-400 to-emerald-500 text-white py-8 md:py-16 px-4 relative overflow-hidden">
        {/* Animated Dots Pattern */}
        <div
          className="absolute inset-0 opacity-[0.1] md:opacity-[0.12]"
          style={{
            backgroundImage: 'radial-gradient(circle, #fff 1.5px, transparent 1.5px)',
            backgroundSize: '35px 35px',
            clipPath: 'polygon(0 20%, 100% 0, 100% 80%, 0 100%)',
          }}
        ></div>

        {/* Gradient Orbs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-600/30 rounded-full blur-3xl"></div>

        <div className="container-custom relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-8">
            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-3 py-1.5 md:px-4 md:py-2 mb-3 md:mb-4">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                </span>
                <span className="text-white text-xs font-bold uppercase tracking-wider">
                  Grupo Oficial
                </span>
              </div>
              <div className="flex items-center justify-center md:justify-start gap-2 md:gap-3 mb-2 md:mb-3">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30">
                  <svg className="w-6 h-6 md:w-7 md:h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </div>
                <h3 className="text-2xl md:text-4xl font-black uppercase tracking-tight">
                  Junte-se ao nosso grupo
                </h3>
              </div>
              <p className="text-white text-sm md:text-lg font-medium leading-relaxed mb-4 md:mb-0">
                Receba ofertas exclusivas, lançamentos e novidades em primeira mão! 🔥
              </p>
            </div>
            <button
              onClick={() => {
                const groupUrl = 'https://chat.whatsapp.com/SEU_LINK_DO_GRUPO';
                const link = document.createElement('a');
                link.href = groupUrl;
                link.target = '_blank';
                link.rel = 'noopener noreferrer';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
              className="group relative w-full md:w-auto"
            >
              <div className="absolute -inset-1 bg-white rounded-2xl blur opacity-50 group-hover:opacity-75 transition duration-300"></div>
              <div className="relative bg-white text-green-600 font-black uppercase py-3 md:py-5 px-6 md:px-8 tracking-wider transition-all duration-300 flex items-center justify-center gap-3 shadow-xl rounded-2xl text-sm md:text-base">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                <span>Entrar no Grupo</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="bg-white text-black pt-16 pb-12 relative overflow-hidden">
        {/* Subtle Pattern */}
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: 'radial-gradient(circle, #000 1.5px, transparent 1.5px)',
            backgroundSize: '28px 28px',
            clipPath: 'polygon(0 10%, 100% 0, 100% 90%, 0 100%)',
          }}
        ></div>

        <div className="container-custom relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-x-8 gap-y-10">
            <div className="col-span-1">
              <h4 className="font-bold uppercase mb-6 tracking-tight text-lg font-display text-black">
                Loja
              </h4>
              <ul className="space-y-3 text-sm font-light">
                <li>
                  <a
                    href="#lancamentos"
                    className="text-gray-600 hover:text-black hover:underline decoration-1 underline-offset-4 transition-colors"
                  >
                    Lançamentos
                  </a>
                </li>
                <li>
                  <a
                    href="#camisas"
                    className="text-gray-600 hover:text-black hover:underline decoration-1 underline-offset-4 transition-colors"
                  >
                    Times Brasileiros
                  </a>
                </li>
                <li>
                  <a
                    href="#camisas"
                    className="text-gray-600 hover:text-black hover:underline decoration-1 underline-offset-4 transition-colors"
                  >
                    Times Europeus
                  </a>
                </li>
                <li>
                  <a
                    href="#camisas"
                    className="text-gray-600 hover:text-black hover:underline decoration-1 underline-offset-4 transition-colors"
                  >
                    Seleções
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-red-600 hover:text-red-700 hover:underline decoration-1 underline-offset-4 font-medium transition-colors"
                  >
                    Outlet
                  </a>
                </li>
              </ul>
            </div>

            <div className="col-span-1">
              <h4 className="font-bold uppercase mb-6 tracking-tight text-lg font-display text-black">
                Suporte
              </h4>
              <ul className="space-y-3 text-sm font-light">
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-black hover:underline decoration-1 underline-offset-4 transition-colors"
                  >
                    Ajuda e FAQ
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-black hover:underline decoration-1 underline-offset-4 transition-colors"
                  >
                    Trocas e Devoluções
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-black hover:underline decoration-1 underline-offset-4 transition-colors"
                  >
                    Tabelas de Medidas
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-black hover:underline decoration-1 underline-offset-4 transition-colors"
                  >
                    Acompanhe seu Pedido
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-black hover:underline decoration-1 underline-offset-4 transition-colors"
                  >
                    Fale Conosco
                  </a>
                </li>
              </ul>
            </div>

            <div className="col-span-1">
              <h4 className="font-bold uppercase mb-6 tracking-tight text-lg font-display text-black">
                Institucional
              </h4>
              <ul className="space-y-3 text-sm font-light">
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-black hover:underline decoration-1 underline-offset-4 transition-colors"
                  >
                    Sobre a LDsports
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-black hover:underline decoration-1 underline-offset-4 transition-colors"
                  >
                    Trabalhe Conosco
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-black hover:underline decoration-1 underline-offset-4 transition-colors"
                  >
                    Sustentabilidade
                  </a>
                </li>
              </ul>
            </div>

            <div className="col-span-1">
              <h4 className="font-bold uppercase mb-6 tracking-tight text-lg font-display text-black">
                Siga-nos
              </h4>
              <div className="flex gap-4">
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center hover:bg-gray-800 hover:scale-110 transition-all duration-300"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772 4.902 4.902 0 011.772-1.153c.636-.247 1.363-.416 2.427-.465C9.531 2.013 9.886 2 12.315 2zM12 7a5 5 0 100 10 5 5 0 000-10zm0 1.667a3.333 3.333 0 110 6.666 3.333 3.333 0 010-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center hover:bg-gray-800 hover:scale-110 transition-all duration-300"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center hover:bg-gray-800 hover:scale-110 transition-all duration-300"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Legal Bar */}
      <div className="bg-gray-100 text-gray-600 py-8 text-xs border-t border-gray-200">
        <div className="container-custom flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-wrap gap-4 justify-center md:justify-start">
            <a href="#" className="hover:text-black transition-colors font-medium">
              Configurações de Cookies
            </a>
            <span className="hidden md:inline text-gray-400">|</span>
            <a href="#" className="hover:text-black transition-colors font-medium">
              Privacidade
            </a>
            <span className="hidden md:inline text-gray-400">|</span>
            <a href="#" className="hover:text-black transition-colors font-medium">
              Termos e Condições
            </a>
            <span className="hidden md:inline text-gray-400">|</span>
            <a href="#" className="hover:text-black transition-colors font-medium">
              Mapa do Site
            </a>
          </div>

          <p className="text-gray-600 mt-2 md:mt-0 flex items-center gap-2">
            <span>&copy; {new Date().getFullYear()} LDsports Brasil.</span>
            <span className="text-green-500">★</span>
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
