/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { DocuboxLogo } from './components/DocuboxLogo.tsx';
import { 
  RotateCcw, 
  Send, 
  Mail, 
  MessageSquare, 
  Check, 
  Copy, 
  ArrowRight, 
  ArrowLeft, 
  ExternalLink,
  Printer,
  Sparkles,
  RefreshCw
} from 'lucide-react';

/* ===== CONFIGURACIÓN DOCUBOX ===== */
const CONFIG = {
  whatsapp: '523312345678', // Solo dígitos con código de país
  telefonoVisible: '+52 33 1234 5678',
  email: 'ventas@docubox.mx'
};

/* ===== PREGUNTAS DEL CUESTIONARIO ===== */
interface QuizOption {
  v: string;
  t: string;
}

interface QuizQuestion {
  id: string;
  title: string;
  multi?: boolean;
  options: QuizOption[];
}

const QUESTIONS: QuizQuestion[] = [
  {
    id: 'tipo',
    title: '¿Qué tipo de negocio tienes?',
    options: [
      { v: 'imprenta', t: 'Imprenta o producción gráfica' },
      { v: 'copiado', t: 'Centro de copiado o papelería' },
      { v: 'oficina', t: 'Oficina, empresa u organización' },
      { v: 'distribuidor', t: 'Distribuidor o revendedor' }
    ]
  },
  {
    id: 'necesidad',
    multi: true,
    title: '¿Qué necesitas?',
    options: [
      { v: 'equipo', t: 'Un equipo de impresión nuevo o adicional' },
      { v: 'toner', t: 'Tóner y consumibles' },
      { v: 'refacciones', t: 'Refacciones' },
      { v: 'asesoria', t: 'Asesoría para elegir o usar mejor mi equipo' }
    ]
  },
  {
    id: 'volumen',
    title: '¿Cuántas páginas imprimes al mes, aproximadamente?',
    options: [
      { v: 'bajo', t: 'Menos de 5,000' },
      { v: 'medio', t: 'Entre 5,000 y 30,000' },
      { v: 'alto', t: 'Más de 30,000' },
      { v: 'nose', t: 'No lo sé' }
    ]
  },
  {
    id: 'marca',
    title: '¿Con qué marca trabajas hoy?',
    options: [
      { v: 'xerox', t: 'Xerox' },
      { v: 'otra', t: 'Otra marca' },
      { v: 'ninguna', t: 'Aún no tengo equipo' }
    ]
  },
  {
    id: 'frecuencia',
    title: '¿Cada cuánto compras consumibles o refacciones?',
    options: [
      { v: 'semanal', t: 'Cada semana' },
      { v: 'mensual', t: 'Cada mes' },
      { v: 'ocasional', t: 'De vez en cuando' },
      { v: 'primera', t: 'Sería mi primera compra' }
    ]
  },
  {
    id: 'prioridad',
    title: '¿Qué pesa más al elegir proveedor?',
    options: [
      { v: 'disponibilidad', t: 'Que el producto esté disponible' },
      { v: 'precio', t: 'El precio' },
      { v: 'atencion', t: 'Atención personalizada' },
      { v: 'soporte', t: 'Soporte técnico y refacciones' }
    ]
  },
  {
    id: 'urgencia',
    title: '¿Cuándo lo necesitas?',
    options: [
      { v: 'urgente', t: 'Esta semana' },
      { v: 'mes', t: 'Este mes' },
      { v: 'evaluando', t: 'Estoy evaluando opciones' }
    ]
  },
  {
    id: 'zona',
    title: '¿Dónde está tu negocio?',
    options: [
      { v: 'gdl', t: 'Guadalajara y alrededores' },
      { v: 'mty', t: 'Monterrey y alrededores' },
      { v: 'mx', t: 'Otra ciudad de México' },
      { v: 'usa', t: 'Estados Unidos' }
    ]
  }
];

const SEGMENTS: Record<string, { name: string; text: string; recs: string[] }> = {
  imprenta: {
    name: 'Producción gráfica',
    text: 'Tu operación depende de equipos que trabajan a ritmo constante y de tener material a tiempo.',
    recs: [
      'Equipos de impresión digital para producción continua',
      'Tóner y consumibles con reabasto programado',
      'Refacciones disponibles para reducir paros'
    ]
  },
  copiado: {
    name: 'Centro de copiado y servicios comerciales',
    text: 'Imprimes mucho y a diario, así que el abasto constante pesa tanto como el equipo.',
    recs: [
      'Equipos para volumen medio y alto',
      'Reabasto frecuente de tóner y consumibles',
      'Refacciones de desgaste común'
    ]
  },
  oficina: {
    name: 'Oficina y organizaciones',
    text: 'Necesitas equipos confiables para el uso diario y no quedarte sin suministros.',
    recs: [
      'Equipos de impresión para uso profesional diario',
      'Tóner programado para evitar quedarte sin material',
      'Asesoría para dimensionar el equipo según tu uso'
    ]
  },
  distribuidor: {
    name: 'Distribución y reventa',
    text: 'Buscas surtido, buenas condiciones por volumen y tiempos de entrega claros.',
    recs: [
      'Catálogo de consumibles y refacciones',
      'Cotización por volumen',
      'Información clara de disponibilidad y entregas'
    ]
  }
};

export default function App() {
  const [activeTab, setActiveTab] = useState<'inicio' | 'perfil' | 'contacto'>('inicio');

  // SVG Sheet animation key to re-trigger
  const [sheetAnimKey, setSheetAnimKey] = useState<number>(0);

  // Quiz state
  const [quizStep, setQuizStep] = useState<number>(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, any>>({});
  const [quizFinished, setQuizFinished] = useState<boolean>(false);
  const [quizSummary, setQuizSummary] = useState<string>('');
  const [recommendedInterest, setRecommendedInterest] = useState<string>('Asesoría para elegir');

  // Contact form state
  const [formNombre, setFormNombre] = useState<string>('');
  const [formEmpresa, setFormEmpresa] = useState<string>('');
  const [formCorreo, setFormCorreo] = useState<string>('');
  const [formTelefono, setFormTelefono] = useState<string>('');
  const [formInteres, setFormInteres] = useState<string>('Equipos de impresión');
  const [formMensaje, setFormMensaje] = useState<string>('');
  const [formStatus, setFormStatus] = useState<string>('');
  const [copiedSummary, setCopiedSummary] = useState<boolean>(false);

  // References
  const messageInputRef = useRef<HTMLTextAreaElement>(null);

  // Hash listener for tabs
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (['inicio', 'perfil', 'contacto'].includes(hash)) {
        setActiveTab(hash as 'inicio' | 'perfil' | 'contacto');
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const switchTab = (tab: 'inicio' | 'perfil' | 'contacto') => {
    setActiveTab(tab);
    window.location.hash = tab;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProductSelect = (interes: string) => {
    setFormInteres(interes);
    switchTab('contacto');
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Quiz Helpers
  const currentQ = QUESTIONS[quizStep];
  const hasAnswer = (q: QuizQuestion) => {
    if (q.multi) {
      return (quizAnswers[q.id] || []).length > 0;
    }
    return !!quizAnswers[q.id];
  };

  const isChecked = (q: QuizQuestion, val: string) => {
    if (q.multi) {
      return (quizAnswers[q.id] || []).includes(val);
    }
    return quizAnswers[q.id] === val;
  };

  const handleOptionChange = (q: QuizQuestion, val: string) => {
    if (q.multi) {
      const prev = quizAnswers[q.id] || [];
      const updated = prev.includes(val) ? prev.filter((item: string) => item !== val) : [...prev, val];
      setQuizAnswers({ ...quizAnswers, [q.id]: updated });
    } else {
      setQuizAnswers({ ...quizAnswers, [q.id]: val });
    }
  };

  const labelOf = (id: string, v: string) => {
    const q = QUESTIONS.find((item) => item.id === id);
    if (!q) return v;
    const opt = q.options.find((o) => o.v === v);
    return opt ? opt.t : v;
  };

  const leadScore = (a: Record<string, any>) => {
    const urgScore: Record<string, number> = { urgente: 3, mes: 2, evaluando: 1 };
    const volScore: Record<string, number> = { alto: 3, medio: 2, bajo: 1, nose: 1 };
    let s = (urgScore[a.urgencia] || 1) + (volScore[a.volumen] || 1);
    if ((a.necesidad || []).includes('equipo')) s += 2;
    if (['semanal', 'mensual'].includes(a.frecuencia)) s += 1;
    return s;
  };

  const finishQuiz = () => {
    const a = quizAnswers;
    const tipo = a.tipo || 'oficina';
    const seg = SEGMENTS[tipo] || SEGMENTS.oficina;

    const s = leadScore(a);
    const nivel = s >= 7 ? 'Alta' : s >= 5 ? 'Media' : 'Baja';

    const necesidadesTxt = (a.necesidad || []).map((v: string) => labelOf('necesidad', v)).join('; ');
    const summary =
      `Perfil: ${seg.name}\n` +
      `Necesita: ${necesidadesTxt}\n` +
      `Volumen mensual: ${labelOf('volumen', a.volumen)}\n` +
      `Marca actual: ${labelOf('marca', a.marca)}\n` +
      `Frecuencia de compra: ${labelOf('frecuencia', a.frecuencia)}\n` +
      `Prioridad al elegir: ${labelOf('prioridad', a.prioridad)}\n` +
      `Urgencia: ${labelOf('urgencia', a.urgencia)}\n` +
      `Zona: ${labelOf('zona', a.zona)}\n` +
      `Prioridad comercial: ${nivel}`;

    const mapInteres: Record<string, string> = {
      equipo: 'Equipos de impresión',
      toner: 'Tóner y consumibles',
      refacciones: 'Refacciones',
      asesoria: 'Asesoría para elegir'
    };
    const firstNec = (a.necesidad && a.necesidad[0]) ? mapInteres[a.necesidad[0]] : 'Asesoría para elegir';

    setQuizSummary(summary);
    setRecommendedInterest(firstNec || 'Asesoría para elegir');
    setQuizFinished(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const restartQuiz = () => {
    setQuizStep(0);
    setQuizAnswers({});
    setQuizFinished(false);
    setQuizSummary('');
  };

  const sendQuizToContact = () => {
    setFormInteres(recommendedInterest);
    setFormMensaje(`Perfil de cliente (cuestionario):\n${quizSummary}\n\n`);
    switchTab('contacto');
    setTimeout(() => {
      messageInputRef.current?.focus();
    }, 200);
  };

  // Recommendations calculation for display
  const getDynamicRecs = () => {
    const tipo = quizAnswers.tipo || 'oficina';
    const seg = SEGMENTS[tipo] || SEGMENTS.oficina;
    const recs = [...seg.recs];
    if (quizAnswers.marca === 'otra') recs.push('Revisión de qué podemos surtirte para tu equipo actual');
    if (quizAnswers.marca === 'ninguna') recs.push('Asesoría para elegir tu primer equipo');
    if (quizAnswers.zona === 'usa') recs.push('Cotización con envío a Estados Unidos');
    return recs;
  };

  // Form handling
  const composeMessage = () => {
    return (
      `Hola, soy ${formNombre} de ${formEmpresa}.\n` +
      `Me interesa: ${formInteres}.\n\n` +
      `${formMensaje.trim()}\n\n` +
      `Contacto: ${formCorreo}${formTelefono ? ' / ' + formTelefono : ''}`
    );
  };

  const handleWhatsAppSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formNombre || !formEmpresa || !formCorreo) {
      setFormStatus('Por favor completa los campos obligatorios: Nombre, Empresa y Correo.');
      return;
    }
    const msg = composeMessage();
    const waUrl = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`;
    // Open WhatsApp in safe mode
    window.open(waUrl, '_blank', 'noopener,noreferrer');
    setFormStatus('Abrimos tu mensaje en WhatsApp. Envíalo desde ahí para completar tu solicitud.');
  };

  const handleMailSend = () => {
    if (!formNombre || !formEmpresa || !formCorreo) {
      setFormStatus('Por favor completa los campos obligatorios antes de enviar por correo.');
      return;
    }
    const msg = composeMessage();
    const mailtoUrl = `mailto:${CONFIG.email}?subject=${encodeURIComponent('Cotización Docubox: ' + formInteres)}&body=${encodeURIComponent(msg)}`;
    window.location.href = mailtoUrl;
    setFormStatus('Abrimos tu correo con el mensaje listo. Envíalo para completar tu solicitud.');
  };

  const copySummaryToClipboard = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(quizSummary);
      setCopiedSummary(true);
      setTimeout(() => setCopiedSummary(false), 2000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between selection:bg-[#00AEEF]/20 selection:text-[#172033]">
      {/* ============ ENCABEZADO Y PESTAÑAS ============ */}
      <header className="site-header">
        <div className="wrap">
          <button 
            type="button" 
            className="logo text-left cursor-pointer focus:outline-none flex items-center gap-2.5" 
            onClick={() => switchTab('inicio')}
            aria-label="Docubox, ir al inicio"
          >
            <DocuboxLogo className="w-8 h-8 shrink-0 drop-shadow-xs" size={34} />
            <span>Docubox</span>
          </button>

          <nav className="tablist" role="tablist" aria-label="Secciones del sitio">
            <button
              className="tab"
              role="tab"
              id="t-inicio"
              aria-controls="tab-inicio"
              aria-selected={activeTab === 'inicio'}
              tabIndex={activeTab === 'inicio' ? 0 : -1}
              onClick={() => switchTab('inicio')}
            >
              Productos y servicios
            </button>
            <button
              className="tab"
              role="tab"
              id="t-perfil"
              aria-controls="tab-perfil"
              aria-selected={activeTab === 'perfil'}
              tabIndex={activeTab === 'perfil' ? 0 : -1}
              onClick={() => switchTab('perfil')}
            >
              Perfila tu negocio
            </button>
            <button
              className="tab"
              role="tab"
              id="t-contacto"
              aria-controls="tab-contacto"
              aria-selected={activeTab === 'contacto'}
              tabIndex={activeTab === 'contacto' ? 0 : -1}
              onClick={() => switchTab('contacto')}
            >
              Contacto
            </button>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* ============ PESTAÑA 1: INICIO ============ */}
        {activeTab === 'inicio' && (
          <div id="tab-inicio" role="tabpanel" aria-labelledby="t-inicio">
            {/* HERO SECTION */}
            <section className="hero">
              <div className="wrap">
                <div>
                  <h1 className="text-[#172033]">Que tu impresión nunca se detenga.</h1>
                  <p className="lead">
                    Equipos de impresión digital, tóner y refacciones Xerox para imprentas, centros de copiado y oficinas. Con atención personalizada y seguimiento hasta resolver tu necesidad.
                  </p>
                  <div className="btn-row">
                    <button className="btn" onClick={() => switchTab('perfil')}>
                      Perfila tu negocio
                    </button>
                    <button className="btn ghost" onClick={() => scrollToSection('productos')}>
                      Ver productos
                    </button>
                  </div>
                </div>

                <div className="flex flex-col items-center">
                  <svg
                    key={sheetAnimKey}
                    className="sheet"
                    viewBox="0 0 420 500"
                    role="img"
                    aria-label="Hoja de prueba de impresión con círculos cian, magenta y amarillo alineados en registro"
                    style={{ isolation: 'isolate' }}
                  >
                    <rect x="30" y="30" width="360" height="440" fill="#fff" stroke="#C9D0D9" />
                    <g stroke="#172033" strokeWidth="1">
                      <path d="M10 30h14M30 10v14M396 30h14M390 10v14M10 470h14M30 476v14M396 470h14M390 476v14" />
                    </g>
                    {/* The 3 CMYK registration circles with animation */}
                    <circle className="c" cx="165" cy="190" r="95" />
                    <circle className="m" cx="255" cy="190" r="95" />
                    <circle className="y" cx="210" cy="268" r="95" />
                    <g fill="none" stroke="#172033" strokeWidth="1">
                      <circle cx="352" cy="70" r="11" />
                      <path d="M352 53v34M335 70h34" />
                    </g>
                    <g>
                      <rect x="60" y="402" width="26" height="26" fill="#00AEEF" />
                      <rect x="86" y="402" width="26" height="26" fill="#EC008C" />
                      <rect x="112" y="402" width="26" height="26" fill="#FFE600" />
                      <rect x="138" y="402" width="26" height="26" fill="#172033" />
                      <rect x="190" y="402" width="26" height="26" fill="#172033" opacity=".15" />
                      <rect x="216" y="402" width="26" height="26" fill="#172033" opacity=".35" />
                      <rect x="242" y="402" width="26" height="26" fill="#172033" opacity=".55" />
                      <rect x="268" y="402" width="26" height="26" fill="#172033" opacity=".8" />
                    </g>
                    <text x="60" y="452" fontFamily="Source Sans 3, Segoe UI, sans-serif" fontSize="11" fill="#566174">
                      Prueba de impresión Docubox
                    </text>
                  </svg>
                  <button 
                    type="button" 
                    onClick={() => setSheetAnimKey((k) => k + 1)} 
                    className="mt-3 text-xs text-[#566174] hover:text-[#007BA3] flex items-center gap-1.5 transition-colors"
                    title="Repetir animación de registro"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Alinear registro CMYK</span>
                  </button>
                </div>
              </div>
            </section>

            {/* SECCIÓN PRODUCTOS */}
            <section className="block" id="productos">
              <div className="wrap">
                <div className="block-head">
                  <h2>Productos</h2>
                  <p>Lo que necesita un equipo de impresión para trabajar todos los días, en un solo proveedor.</p>
                </div>
                <div className="products">
                  {/* Card Cyan */}
                  <article className="product p-c shadow-sm hover:shadow-md transition-shadow">
                    <h3>Equipos de impresión digital</h3>
                    <p>Impresoras y equipos de impresión digital, principalmente de la familia Xerox, para producción comercial y uso profesional.</p>
                    <ul>
                      <li>Imprentas y producción gráfica</li>
                      <li>Centros de copiado</li>
                      <li>Oficinas y organizaciones</li>
                    </ul>
                    <button
                      className="link"
                      onClick={() => handleProductSelect('Equipos de impresión')}
                    >
                      Cotizar un equipo →
                    </button>
                  </article>

                  {/* Card Magenta */}
                  <article className="product p-m shadow-sm hover:shadow-md transition-shadow">
                    <h3>Tóner y consumibles</h3>
                    <p>Suministros para que tus equipos sigan imprimiendo sin interrupciones y sin quedarte sin material.</p>
                    <ul>
                      <li>Tóner para equipos Xerox</li>
                      <li>Consumibles de impresión</li>
                      <li>Reabasto frecuente o por pedido</li>
                    </ul>
                    <button
                      className="link"
                      onClick={() => handleProductSelect('Tóner y consumibles')}
                    >
                      Cotizar tóner →
                    </button>
                  </article>

                  {/* Card Yellow */}
                  <article className="product p-y shadow-sm hover:shadow-md transition-shadow">
                    <h3>Refacciones</h3>
                    <p>Piezas para reemplazar lo que se desgasta y reducir el tiempo que tu equipo pasa detenido.</p>
                    <ul>
                      <li>Refacciones para equipos Xerox</li>
                      <li>Consulta por modelo de equipo</li>
                      <li>Atención directa de un asesor</li>
                    </ul>
                    <button
                      className="link"
                      onClick={() => handleProductSelect('Refacciones')}
                    >
                      Consultar una refacción →
                    </button>
                  </article>
                </div>
              </div>
            </section>

            {/* SECCIÓN SERVICIOS */}
            <section className="services block">
              <div className="wrap">
                <div className="block-head">
                  <h2>Servicios</h2>
                  <p>Vendemos productos especializados y te acompañamos en la decisión, no solo en la compra.</p>
                </div>
                <dl className="svc">
                  <div>
                    <dt>Asesoría personalizada</dt>
                    <dd>Te ayudamos a identificar el equipo, tóner o refacción que corresponde a tu operación.</dd>
                  </div>
                  <div>
                    <dt>Cotización para negocios</dt>
                    <dd>Atendemos compras de empresas y organizaciones con propuestas pensadas para su volumen de trabajo.</dd>
                  </div>
                  <div>
                    <dt>Abasto para tu operación</dt>
                    <dd>Suministro de consumibles y refacciones para que tu trabajo no se interrumpa.</dd>
                  </div>
                  <div>
                    <dt>Seguimiento hasta resolver</dt>
                    <dd>Damos seguimiento a cada solicitud hasta que tu necesidad quede atendida.</dd>
                  </div>
                  <div>
                    <dt>Información clara</dt>
                    <dd>Datos transparentes sobre productos y servicios antes de que tomes una decisión.</dd>
                  </div>
                </dl>
              </div>
            </section>

            {/* SECCIÓN COBERTURA */}
            <section className="coverage block">
              <div className="wrap">
                <div>
                  <h2>Cerca de tu negocio</h2>
                  <p className="lead">
                    Empezamos en Guadalajara Centro, abrimos sucursal en Monterrey y hoy surtimos en todo México y parte de Estados Unidos.
                  </p>
                </div>
                <div>
                  <ul className="places">
                    <li>
                      <strong>Guadalajara Centro</strong>
                      <span>Origen</span>
                    </li>
                    <li>
                      <strong>Monterrey</strong>
                      <span>Sucursal</span>
                    </li>
                    <li>
                      <strong>México y parte de EE. UU.</strong>
                      <span>Envíos</span>
                    </li>
                  </ul>
                  <div className="cta">
                    <p>¿No sabes por dónde empezar?</p>
                    <button className="btn on-dark" onClick={() => switchTab('perfil')}>
                      Responde el cuestionario
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ============ PESTAÑA 2: CUESTIONARIO ============ */}
        {activeTab === 'perfil' && (
          <div id="tab-perfil" role="tabpanel" aria-labelledby="t-perfil">
            <div className="wrap">
              <div className="page-head">
                <h1>Perfila tu negocio</h1>
                <p>
                  Responde 8 preguntas cortas. Te mostramos qué solución encaja con tu operación y un asesor recibe tu perfil para cotizarte.
                </p>
              </div>

              <div className="quiz shadow-sm">
                {!quizFinished ? (
                  <div id="quiz-flow">
                    <div className="progress-meta">
                      <span>Pregunta {quizStep + 1} de {QUESTIONS.length}</span>
                      <span className="text-xs font-semibold text-[#007BA3]">
                        {Math.round(((quizStep + 1) / QUESTIONS.length) * 100)}%
                      </span>
                    </div>
                    <div className="progress" aria-hidden="true">
                      <div style={{ width: `${((quizStep + 1) / QUESTIONS.length) * 100}%` }} />
                    </div>

                    {/* Step view */}
                    <fieldset className="q" tabIndex={-1}>
                      <legend>{currentQ.title}</legend>
                      <p className="hint">
                        {currentQ.multi ? 'Puedes elegir varias opciones.' : 'Elige una opción.'}
                      </p>
                      <div className="opts">
                        {currentQ.options.map((opt) => {
                          const checked = isChecked(currentQ, opt.v);
                          return (
                            <label key={opt.v} className="opt">
                              <input
                                type={currentQ.multi ? 'checkbox' : 'radio'}
                                name={currentQ.id}
                                value={opt.v}
                                checked={checked}
                                onChange={() => handleOptionChange(currentQ, opt.v)}
                              />
                              <span>{opt.t}</span>
                            </label>
                          );
                        })}
                      </div>
                    </fieldset>

                    <div className="quiz-nav">
                      <button
                        className="btn ghost"
                        type="button"
                        onClick={() => {
                          if (quizStep > 0) setQuizStep((s) => s - 1);
                        }}
                        style={{ visibility: quizStep === 0 ? 'hidden' : 'visible' }}
                      >
                        ← Atrás
                      </button>
                      <button
                        className="btn"
                        type="button"
                        disabled={!hasAnswer(currentQ)}
                        onClick={() => {
                          if (quizStep < QUESTIONS.length - 1) {
                            setQuizStep((s) => s + 1);
                          } else {
                            finishQuiz();
                          }
                        }}
                      >
                        {quizStep === QUESTIONS.length - 1 ? 'Ver mi perfil' : 'Siguiente →'}
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Quiz Result */
                  <div className="result">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#E8F6FB] text-[#007BA3] rounded-full text-xs font-bold mb-3">
                      <Sparkles className="w-3.5 h-3.5" />
                      Perfil generado con éxito
                    </div>
                    <h2>Tu perfil: {SEGMENTS[quizAnswers.tipo]?.name || 'Producción y Oficina'}</h2>
                    <p className="sub">{SEGMENTS[quizAnswers.tipo]?.text}</p>

                    <h3>Lo que te recomendamos</h3>
                    <ul className="text-slate-700 space-y-1">
                      {getDynamicRecs().map((rec, i) => (
                        <li key={i}>{rec}</li>
                      ))}
                    </ul>

                    <div className="flex items-center justify-between mt-7 mb-2">
                      <h3 className="!my-0">Resumen que recibirá el asesor</h3>
                      <button
                        type="button"
                        onClick={copySummaryToClipboard}
                        className="text-xs text-[#007BA3] hover:underline flex items-center gap-1 font-semibold"
                      >
                        {copiedSummary ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        {copiedSummary ? 'Copiado' : 'Copiar texto'}
                      </button>
                    </div>
                    <pre className="summary rounded-md font-mono text-sm leading-relaxed">{quizSummary}</pre>

                    <div className="btn-row">
                      <button className="btn flex items-center gap-2" type="button" onClick={sendQuizToContact}>
                        <span>Enviar a un asesor</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                      <button className="btn ghost flex items-center gap-2" type="button" onClick={restartQuiz}>
                        <RefreshCw className="w-4 h-4" />
                        <span>Volver a empezar</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ============ PESTAÑA 3: CONTACTO ============ */}
        {activeTab === 'contacto' && (
          <div id="tab-contacto" role="tabpanel" aria-labelledby="t-contacto">
            <div className="wrap">
              <div className="page-head">
                <h1>Habla con un asesor</h1>
                <p>
                  Cuéntanos qué necesitas y te respondemos con una cotización. Si ya respondiste el cuestionario, tu perfil se agrega al mensaje.
                </p>
              </div>

              <div className="contact">
                {/* Dónde encontrarnos */}
                <div className="info">
                  <h2>Dónde encontrarnos</h2>
                  <dl>
                    <div>
                      <dt>Guadalajara Centro</dt>
                      <dd>Matriz de distribución & atención directa</dd>
                    </div>
                    <div>
                      <dt>Monterrey</dt>
                      <dd>Sucursal y almacén regional norte</dd>
                    </div>
                    <div>
                      <dt>WhatsApp</dt>
                      <dd>
                        <a href={`https://wa.me/${CONFIG.whatsapp}`} target="_blank" rel="noopener noreferrer" className="font-semibold underline">
                          {CONFIG.telefonoVisible}
                        </a>
                      </dd>
                    </div>
                    <div>
                      <dt>Correo</dt>
                      <dd>
                        <a href={`mailto:${CONFIG.email}`} className="font-semibold underline">
                          {CONFIG.email}
                        </a>
                      </dd>
                    </div>
                    <div>
                      <dt>Redes y tienda en línea</dt>
                      <dd className="space-y-1">
                        <div>Mercado Libre: <strong>DOCUBOX</strong></div>
                        <div>
                          Instagram:{' '}
                          <a
                            href="https://www.instagram.com/docubox.shop/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 font-semibold underline"
                          >
                            docubox.shop
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                        <div>Facebook: <strong>Impresoras Digitales Docubox</strong></div>
                      </dd>
                    </div>
                  </dl>
                </div>

                {/* Formulario */}
                <div className="form-box shadow-sm">
                  <h2>Solicita tu cotización</h2>
                  <form onSubmit={handleWhatsAppSend} noValidate>
                    <div className="two">
                      <div className="field">
                        <label htmlFor="nombre">Nombre *</label>
                        <input
                          id="nombre"
                          name="nombre"
                          type="text"
                          autoComplete="name"
                          value={formNombre}
                          onChange={(e) => setFormNombre(e.target.value)}
                          placeholder="Tu nombre completo"
                          required
                        />
                      </div>
                      <div className="field">
                        <label htmlFor="empresa">Empresa o negocio *</label>
                        <input
                          id="empresa"
                          name="empresa"
                          type="text"
                          autoComplete="organization"
                          value={formEmpresa}
                          onChange={(e) => setFormEmpresa(e.target.value)}
                          placeholder="Nombre de tu empresa o imprenta"
                          required
                        />
                      </div>
                    </div>

                    <div className="two">
                      <div className="field">
                        <label htmlFor="correo">Correo *</label>
                        <input
                          id="correo"
                          name="correo"
                          type="email"
                          autoComplete="email"
                          value={formCorreo}
                          onChange={(e) => setFormCorreo(e.target.value)}
                          placeholder="ejemplo@negocio.com"
                          required
                        />
                      </div>
                      <div className="field">
                        <label htmlFor="telefono">Teléfono o WhatsApp</label>
                        <input
                          id="telefono"
                          name="telefono"
                          type="tel"
                          autoComplete="tel"
                          value={formTelefono}
                          onChange={(e) => setFormTelefono(e.target.value)}
                          placeholder="+52 33 0000 0000"
                        />
                      </div>
                    </div>

                    <div className="field">
                      <label htmlFor="interes">Me interesa</label>
                      <select
                        id="interes"
                        name="interes"
                        value={formInteres}
                        onChange={(e) => setFormInteres(e.target.value)}
                      >
                        <option value="Equipos de impresión">Equipos de impresión</option>
                        <option value="Tóner y consumibles">Tóner y consumibles</option>
                        <option value="Refacciones">Refacciones</option>
                        <option value="Asesoría para elegir">Asesoría para elegir</option>
                      </select>
                    </div>

                    <div className="field">
                      <label htmlFor="mensaje">Mensaje</label>
                      <textarea
                        ref={messageInputRef}
                        id="mensaje"
                        name="mensaje"
                        value={formMensaje}
                        onChange={(e) => setFormMensaje(e.target.value)}
                        placeholder="Modelo de equipo, cantidades, ciudad de entrega…"
                      />
                    </div>

                    <div className="btn-row">
                      <button className="btn flex items-center gap-2" type="submit">
                        <MessageSquare className="w-4 h-4" />
                        <span>Enviar por WhatsApp</span>
                      </button>
                      <button
                        className="btn ghost flex items-center gap-2"
                        type="button"
                        onClick={handleMailSend}
                      >
                        <Mail className="w-4 h-4" />
                        <span>Enviar por correo</span>
                      </button>
                    </div>

                    {formStatus && (
                      <div
                        className="mt-4 p-3 bg-[#E8F6FB] border border-[#007BA3]/30 text-[#007BA3] text-sm rounded flex items-start gap-2"
                        role="status"
                        aria-live="polite"
                      >
                        <Check className="w-4 h-4 shrink-0 mt-0.5" />
                        <span>{formStatus}</span>
                      </div>
                    )}
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ============ FOOTER ============ */}
      <footer>
        <div className="wrap">
          <div className="flex items-center gap-2.5">
            <DocuboxLogo className="w-5 h-5 shrink-0" size={20} />
            <span>© 2026 Docubox. Equipos, tóner y refacciones de impresión.</span>
          </div>
          <span>Guadalajara · Monterrey · México y EE. UU.</span>
        </div>
      </footer>
    </div>
  );
}
