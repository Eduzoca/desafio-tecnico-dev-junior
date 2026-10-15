import { HeroScene } from "./HeroScene";
import { Clock, Globe, Mail, User, Check, ArrowUpRight } from "lucide-react";
import { Reveal, Stars } from "./Visual";
export function BrandHeader() {
  return (
    <>
      <div className="topbar">
        <span>Seu professor particular. Seu idioma. Seu horário.</span>
        <a href="#busca">Quero encontrar meu professor</a>
      </div>
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
        <HeroScene />
        <img
          src="/brand/hero-aluna-ia.png"
          alt="Imagem gerada por IA de uma mulher sorrindo com notebook"
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
          <div className="hero-badge">
            <Stars />
            <span>+9.000 alunos já começaram a falar inglês</span>
          </div>
          <ul className="hero-benefits">
            <li>
              <Check aria-hidden="true" />
              Aulas individuais e personalizadas
            </li>
            <li>
              <Check aria-hidden="true" />O mesmo horário nos dias escolhidos
            </li>
            <li>
              <Check aria-hidden="true" />
              Aulas de 30, 60 ou 90 minutos
            </li>
          </ul>
        </header>
      </Reveal>
    </>
  );
}
export function ComoFunciona() {
  return (
    <section className="como-funciona" aria-labelledby="como-titulo">
      <Reveal className="como-intro">
        <span className="marca">O CAMINHO</span>
        <h2 id="como-titulo">
          Seu próximo passo.
          <br />
          Do seu jeito.
        </h2>
        <p>
          Da escolha do idioma ao horário em comum: tudo começa com a sua
          disponibilidade.
        </p>
      </Reveal>
      <div className="passos">
        {[
          {
            numero: "01",
            Icone: Globe,
            titulo: "Escolha seu idioma",
            texto:
              "Inglês, Espanhol ou Francês. Qual vai ser seu próximo desafio?",
          },
          {
            numero: "02",
            Icone: Clock,
            titulo: "Conte sua rotina",
            texto: "Selecione os dias, a faixa de horário e a duração da aula.",
          },
          {
            numero: "03",
            Icone: User,
            titulo: "Encontre seu professor",
            texto:
              "Compare os horários disponíveis e visualize como ficaria sua semana.",
          },
        ].map(({ numero, Icone, titulo, texto }, i) => (
          <Reveal className="passo" key={numero} delay={i * 0.1}>
            <div className="passo-icon">
              <Icone size={21} aria-hidden="true" />
            </div>
            <div>
              <span className="passo-numero">{numero}</span>
              <h3>{titulo}</h3>
              <p>{texto}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
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
