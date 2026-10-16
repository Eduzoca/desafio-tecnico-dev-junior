import { Globe, Mail, ArrowUpRight } from "lucide-react";
import { Reveal } from "./Visual";
export function BrandHeader() {
  return (
    <>
      <nav className="brand-nav" aria-label="Navegação principal">
        <a href="#inicio" aria-label="King of Languages — início">
          <img
            src="/brand/logo.webp"
            alt="King of Languages"
            width="180"
            height="64"
          />
        </a>
        <a className="nav-link" href="#busca">
          Encontre seu professor <ArrowUpRight size={16} aria-hidden="true" />
        </a>
      </nav>
    </>
  );
}
export function Hero() {
  return (
    <>
      <Reveal className="hero-photo">
        <img
          src="/brand/hero-estudante.png"
          alt="Mulher sorrindo com notebook"
          width="1110"
          height="1417"
          fetchPriority="high"
        />
      </Reveal>
      <Reveal className="hero-copy" delay={0.1}>
        <header>
          <span className="marca">UM PROFESSOR SÓ PRA VOCÊ</span>
          <h1>
            Um professor só pra você. <em>No seu horário.</em>
          </h1>
          <p>
            Inglês, Espanhol ou Francês. Escolha os dias e encontre quem pode
            acompanhar seu aprendizado.{" "}
            <strong>Uma aula que cabe na sua rotina.</strong>
          </p>
        </header>
      </Reveal>
    </>
  );
}
export function BrandFooter() {
  return (
    <footer className="brand-footer">
      <div>
        <img
          src="/brand/logo.webp"
          alt="King of Languages"
          width="180"
          height="64"
        />
        <p>Aulas particulares de idiomas, com um professor só pra você.</p>
      </div>
      <div>
        <a
          href="https://site.kingoflanguages.com.br/"
          target="_blank"
          rel="noreferrer"
        >
          <Globe size={16} />
          Conheça a King
        </a>
        <a href="mailto:contato@kingoflanguages.com.br">
          <Mail size={16} />
          contato@kingoflanguages.com.br
        </a>
        <p>Aprender cabe na sua rotina.</p>
      </div>
    </footer>
  );
}
