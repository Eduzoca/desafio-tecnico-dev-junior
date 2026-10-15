import { MotionConfig } from "motion/react";
import {
  BrandHeader,
  BrandFooter,
  Hero,
  ComoFunciona,
} from "./components/Brand";
import { BuscaForm } from "./components/BuscaForm";
import { BuscaResultados } from "./components/BuscaResultados";
import { Reveal } from "./components/Visual";
import { useBusca } from "./hooks/useBusca";
export default function App() {
  const { resultado, consulta, erros, carregando, buscar } = useBusca();
  return (
    <MotionConfig reducedMotion="user">
      <BrandHeader />
      <main id="inicio">
        <div className="hero-background" aria-hidden="true">
          <div className="blob blob-red" />
          <div className="blob blob-blue" />
        </div>
        <div className="layout" id="busca">
          <Hero />
          <Reveal className="form-reveal" delay={0.2}>
            <BuscaForm carregando={carregando} onSearch={buscar} />
          </Reveal>
        </div>
        <BuscaResultados
          resultado={resultado}
          consulta={consulta}
          erros={erros}
          carregando={carregando}
        />
        <ComoFunciona />
      </main>
      <BrandFooter />
    </MotionConfig>
  );
}
