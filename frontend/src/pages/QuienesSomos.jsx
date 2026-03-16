import React from "react";
import "../styles/terminos.css";

const QuienesSomos = () => {
  return (
    <div className="terminos-container">
      <h1>Sobre JG Service</h1>
      <p className="last-update">Conoce nuestra misión y visión</p>

      <section>
        <h2>1. Nuestra Identidad</h2>
        <p>
          <strong>JG Service</strong> es una plataforma digital chilena nacida
          con el firme propósito de modernizar y facilitar la conexión entre
          profesionales de la seguridad y empresas que buscan excelencia
          operativa. Nos especializamos en el sector de seguridad privada,
          entendiendo los desafíos únicos de esta industria en el país.
        </p>
      </section>

      <section>
        <h2>2. Nuestra Misión</h2>
        <p>
          Nuestra misión es proveer un canal eficiente, transparente y seguro
          para el reclutamiento de personal en Chile. Buscamos asegurar que cada
          vacante publicada represente una oportunidad real de crecimiento para
          el trabajador y una solución de calidad para el empleador.
        </p>
      </section>

      <section>
        <h2>3. Nuestra Visión</h2>
        <p>
          Aspiramos a ser el portal líder y más confiable para el mercado
          laboral de seguridad privada a nivel nacional. Queremos impulsar la
          profesionalización del rubro mediante el uso de tecnología accesible
          que simplifique la vida de quienes buscan y ofrecen empleo.
        </p>
      </section>

      <section>
        <h2>4. ¿Por qué elegir JG Service?</h2>
        <p>
          A diferencia de los portales de empleo genéricos, en{" "}
          <strong>JG Service</strong> filtramos y categorizamos las ofertas
          pensando específicamente en las necesidades del guardia de seguridad,
          conserje y personal de vigilancia, integrando herramientas de contacto
          directo para agilizar los procesos de postulación.
        </p>
      </section>

      <p className="final-note">
        En JG Service, no solo publicamos avisos; construimos puentes seguros
        hacia tu próximo desafío laboral en el sector de la seguridad.
      </p>
    </div>
  );
};

export default QuienesSomos;
