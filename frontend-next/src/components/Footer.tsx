'use client';

function Footer() {
  return (
    <footer className="footer-wrapper" id="contato">
      {/* Newsletter Strip - Adidas Style (Yellow/High Contrast) */}
      <div className="bg-[#ede734] text-black py-10 px-4">
        <div className="container-custom flex flex-col md:flex-row justify-center md:justify-between items-center gap-6">
          <h3 className="text-2xl md:text-3xl font-bold uppercase tracking-tighter text-center md:text-left">
            FAÇA PARTE DO CLUBE E GANHE 15% OFF
          </h3>
          <button className="bg-black text-white font-bold uppercase py-4 px-8 tracking-wider hover:bg-gray-800 transition-colors flex items-center gap-2 group cursor-pointer text-sm">
            INSCREVA-SE DE GRAÇA
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </button>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="bg-white text-black pt-16 pb-12 border-t border-gray-100">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-x-8 gap-y-10">
            <div className="col-span-1">
              <h4 className="font-bold uppercase mb-6 tracking-tight text-lg font-display">Loja</h4>
              <ul className="space-y-3 text-sm font-light">
                <li>
                  <a
                    href="#lancamentos"
                    className="hover:underline decoration-1 underline-offset-4"
                  >
                    Lançamentos
                  </a>
                </li>
                <li>
                  <a href="#camisas" className="hover:underline decoration-1 underline-offset-4">
                    Times Brasileiros
                  </a>
                </li>
                <li>
                  <a href="#camisas" className="hover:underline decoration-1 underline-offset-4">
                    Times Europeus
                  </a>
                </li>
                <li>
                  <a href="#camisas" className="hover:underline decoration-1 underline-offset-4">
                    Seleções
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:underline decoration-1 underline-offset-4 text-red-600 font-medium"
                  >
                    Outlet
                  </a>
                </li>
              </ul>
            </div>

            <div className="col-span-1">
              <h4 className="font-bold uppercase mb-6 tracking-tight text-lg font-display">
                Suporte
              </h4>
              <ul className="space-y-3 text-sm font-light">
                <li>
                  <a href="#" className="hover:underline decoration-1 underline-offset-4">
                    Ajuda e FAQ
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline decoration-1 underline-offset-4">
                    Trocas e Devoluções
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline decoration-1 underline-offset-4">
                    Tabelas de Medidas
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline decoration-1 underline-offset-4">
                    Acompanhe seu Pedido
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline decoration-1 underline-offset-4">
                    Fale Conosco
                  </a>
                </li>
              </ul>
            </div>

            <div className="col-span-1">
              <h4 className="font-bold uppercase mb-6 tracking-tight text-lg font-display">
                Institucional
              </h4>
              <ul className="space-y-3 text-sm font-light">
                <li>
                  <a href="#" className="hover:underline decoration-1 underline-offset-4">
                    Sobre a LDsports
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline decoration-1 underline-offset-4">
                    Trabalhe Conosco
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline decoration-1 underline-offset-4">
                    Sustentabilidade
                  </a>
                </li>
              </ul>
            </div>

            <div className="col-span-1">
              <h4 className="font-bold uppercase mb-6 tracking-tight text-lg font-display">
                Siga-nos
              </h4>
              <div className="flex gap-4">
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center hover:bg-gray-700 transition"
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
                  className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center hover:bg-gray-700 transition"
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
                  className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center hover:bg-gray-700 transition"
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
      <div className="bg-[#2e2e2e] text-gray-300 py-6 text-xs">
        <div className="container-custom flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-wrap gap-4 justify-center md:justify-start">
            <a href="#" className="hover:text-white transition-colors">
              Configurações de Cookies
            </a>
            <span className="hidden md:inline text-gray-600">|</span>
            <a href="#" className="hover:text-white transition-colors">
              Privacidade
            </a>
            <span className="hidden md:inline text-gray-600">|</span>
            <a href="#" className="hover:text-white transition-colors">
              Termos e Condições
            </a>
            <span className="hidden md:inline text-gray-600">|</span>
            <a href="#" className="hover:text-white transition-colors">
              Mapa do Site
            </a>
          </div>

          <p className="text-gray-500 mt-2 md:mt-0">
            &copy; {new Date().getFullYear()} LDsports Brasil.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
