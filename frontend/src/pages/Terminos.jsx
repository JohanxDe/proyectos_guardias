import React from 'react';
import "../styles/terminos.css"; // Un CSS sencillo para darle formato

const Terminos = () => {
    return (
        <div className="terminos-container">
            <h1>Términos y Condiciones de Uso</h1>
            <p className="last-update">Última actualización: {new Date().toLocaleDateString()}</p>

            <section>
                <h2>1. Naturaleza del Servicio</h2>
                <p>
                    <strong>Servicio JG</strong> es una plataforma digital de intermediación laboral independiente. 
                    Nuestra función exclusiva es facilitar el contacto entre postulantes y empresas que buscan servicios 
                    de seguridad (GGSS) u otras áreas.
                </p>
            </section>

            <section>
                <h2>2. Deslinde de Responsabilidad Laboral</h2>
                <p>
                    <strong>Servicio JG</strong> NO es una empresa de servicios transitorios ni actúa como empleador. 
                    No tenemos relación jerárquica, de dependencia ni de subordinación con las empresas contratantes. 
                    Cualquier contrato, promesa de empleo o condiciones de trabajo son responsabilidad exclusiva de la 
                    empresa que publica la vacante.
                </p>
            </section>

            <section>
                <h2>3. Veracidad de las Ofertas</h2>
                <p>
                    Si bien realizamos esfuerzos por validar las ofertas, el usuario reconoce que la veracidad de los 
                    sueldos, ubicaciones y funciones publicadas es responsabilidad de la empresa externa. Servicio JG 
                    no se hace responsable por perjuicios derivados de información errónea proporcionada por terceros.
                </p>
            </section>

            <section>
                <h2>4. Proceso de Selección</h2>
                <p>
                    El proceso de entrevista, selección y contratación es gestionado directamente por la empresa interesada. 
                    Servicio JG no garantiza la obtención de un puesto de trabajo por el solo hecho de postular a través 
                    de la plataforma o contactar vía WhatsApp.
                </p>
            </section>

            <p className="final-note">
                Al utilizar este sitio, usted acepta que Servicio JG queda libre de toda responsabilidad legal 
                derivada de los conflictos que puedan surgir entre el trabajador y la empresa contratante.
            </p>
        </div>
    );
};

export default Terminos;