import { Clock, Globe, Mail, Search, User } from "lucide-react";
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
          <Search size={16} /> Encontre seu professor
        </a>
      </nav>
    </>
  );
}
export function Hero() {
  return (
    <>
      {" "}
      <Reveal className="hero-photo">
        <img
          src="/brand/hero-aluna.webp"
          alt="Aluna da King of Languages com notebook, sorrindo"
          width="1200"
          height="1531"
          fetchPriority="high"
        />
      </Reveal>
      <Reveal className="hero-copy" delay={0.1}>
        <header>
          <span className="marca">UM PROFESSOR SÓ PRA VOCÊ</span>
          <h1>
            Aulas particulares de idiomas <em>no seu horário.</em>
          </h1>
          <p>
            Escolha o idioma, os dias e a duração da aula. Encontre um professor
            que pode acompanhar seu aprendizado, no seu ritmo.
          </p>
          <div className="hero-badge">
            <Stars />
            <span>+9.000 alunos já começaram a falar inglês</span>
          </div>
          <ul className="hero-benefits">
            <li>
              <User />
              Aulas individuais e personalizadas
            </li>
            <li>
              <Clock />O mesmo horário nos dias escolhidos
            </li>
            <li>
              <Globe />
              Inglês, Espanhol ou Francês
            </li>
          </ul>
        </header>
      </Reveal>
    </>
  );
}
export function Stories() {
  return (
    <section className="stories">
      <Reveal>
        <span className="marca">HISTÓRIAS REAIS</span>
        <h2>Quem aprendeu inglês com a gente</h2>
        <p>Histórias reais, resultado comprovado.</p>
      </Reveal>
      <div className="story-grid">
        {[
          {
            foto: "deise",
            nome: "Deise Pinho",
            texto: "Cheguei na King do zero. Em 1 ano, escrevo e me comunico.",
          },
          {
            foto: "guilherme",
            nome: "Guilherme Querino",
            texto:
              "Conversação de segunda a sexta. Vou fazer intercâmbio de trabalho.",
          },
          {
            foto: "cirlene",
            nome: "Cirlene Nunes",
            texto: "Já estudei em várias escolas e nada se compara.",
          },
        ].map((aluno, i) => (
          <Reveal key={aluno.foto} delay={i * 0.1}>
            <article className="story">
              <div className="story-person">
                <img
                  src={`/brand/${aluno.foto}.webp`}
                  alt={`Foto de ${aluno.nome}`}
                  width="56"
                  height="56"
                  loading="lazy"
                />
                <div>
                  <h3>{aluno.nome}</h3>
                  <Stars />
                </div>
              </div>
              <blockquote>{aluno.texto}</blockquote>
            </article>
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
