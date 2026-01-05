export type LegalPageType = 'aviso-legal' | 'privacidad' | 'cookies';

export const LEGAL_CONTENT: Record<LegalPageType, { title: string; content: string }> = {
    'aviso-legal': {
        title: 'Aviso Legal',
        content: `
      <h2>1. Datos Identificativos</h2>
      <p>En cumplimiento con el deber de información recogido en artículo 10 de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y del Comercio Electrónico, se reflejan los siguientes datos: la empresa titular de dominio web es <strong>Tahona La Baguette</strong> (en adelante Tahona La Baguette), con domicilio a estos efectos en Calle de Valdevarnes, 3, 28039 Madrid.</p>
      
      <h2>2. Usuarios</h2>
      <p>El acceso y/o uso de este portal de Tahona La Baguette atribuye la condición de USUARIO, que acepta, desde dicho acceso y/o uso, las Condiciones Generales de Uso aquí reflejadas.</p>
      
      <h2>3. Uso del Portal</h2>
      <p>Este sitio web proporciona el acceso a multitud de informaciones, servicios, programas o datos (en adelante, "los contenidos") en Internet pertenecientes a Tahona La Baguette. El USUARIO asume la responsabilidad del uso del portal.</p>
      
      <h2>4. Propiedad Intelectual e Industrial</h2>
      <p>Tahona La Baguette es titular de todos los derechos de propiedad intelectual e industrial de su página web, así como de los elementos contenidos en la misma (a título enunciativo, imágenes, sonido, audio, vídeo, software o textos; marcas o logotipos, combinaciones de colores, estructura y diseño, etc.).</p>
    `
    },
    'privacidad': {
        title: 'Política de Privacidad',
        content: `
      <h2>1. Responsable del Tratamiento</h2>
      <p>Tahona La Baguette se compromete a proteger la privacidad de los usuarios que acceden a esta web y/o cualquiera de sus servicios.</p>
      
      <h2>2. Finalidad del Tratamiento</h2>
      <p>Tratamos la información que nos facilitan las personas interesadas con el fin de gestionar el envío de la información solicitada y facilitar a los interesados ofertas de productos y servicios de su interés.</p>
      
      <h2>3. Legitimación</h2>
      <p>La base legal para el tratamiento de sus datos es la ejecución de la solicitud de información realizada por el usuario a través de los formularios de contacto o el consentimiento para el uso de cookies.</p>
      
      <h2>4. Destinatarios</h2>
      <p>Los datos no se cederán a terceros salvo obligación legal.</p>
      
      <h2>5. Derechos</h2>
      <p>Cualquier persona tiene derecho a obtener confirmación sobre si en Tahona La Baguette estamos tratando datos personales que les conciernan, o no. Las personas interesadas tienen derecho a si acceder a sus datos personales, así como a solicitar la rectificación de los datos inexactos o, en su caso, solicitar su supresión cuando, entre otros motivos, los datos ya no sean necesarios para los fines que fueron recogidos.</p>
    `
    },
    'cookies': {
        title: 'Política de Cookies',
        content: `
      <h2>1. ¿Qué son las cookies?</h2>
      <p>Una cookie es un fichero que se descarga en su ordenador al acceder a determinadas páginas web. Las cookies permiten a una página web, entre otras cosas, almacenar y recuperar información sobre los hábitos de navegación de un usuario o de su equipo.</p>
      
      <h2>2. Tipos de cookies utilizadas</h2>
      <p>Esta web utiliza cookies propias y de terceros para mejorar la experiencia de navegación y obtener estadísticas de uso.</p>
      <ul>
        <li><strong>Cookies Técnicas:</strong> Son aquellas que permiten al usuario la navegación a través de una página web y la utilización de las diferentes opciones o servicios que en ella existan.</li>
        <li><strong>Cookies de Análisis:</strong> Son aquellas que bien tratadas por nosotros o por terceros, nos permiten cuantificar el número de usuarios y así realizar la medición y análisis estadístico de la utilización que hacen los usuarios del servicio ofertado.</li>
      </ul>
      
      <h2>3. Gestión de cookies</h2>
      <p>Puede usted permitir, bloquear o eliminar las cookies instaladas en su equipo mediante la configuración de las opciones del navegador instalado en su ordenador.</p>
    `
    }
};
