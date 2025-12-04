import { Project, Service, Stat, Testimonial } from './types';

export const COMPANY_NAME = "Minhas Aluminium & Glass";
export const WHATSAPP_NUMBER = "923053571118"; // Placeholder
export const WHATSAPP_MESSAGE = encodeURIComponent("Assalamualaikum! I’m interested in a quote for aluminium & glass work. Please advise next steps.");

// Update these links with your real social accounts
export const SOCIAL_LINKS = {
  facebook: "https://facebook.com/minhasaluminium",
  instagram: "https://instagram.com/minhas_aluminium",
  tiktok: "https://tiktok.com/@minhas_aluminium",
  whatsapp: `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`
};

// Update these map links with your real location
// Direct link for "Visit our workshop" text
export const MAP_DIRECT_LINK = "https://maps.app.goo.gl/7czpFd6jadmbuwuW7";
// Embed URL using a query to ensure a Pin is shown. 
export const MAP_EMBED_SRC = "https://maps.google.com/maps?q=Minhas+Aluminium+and+Glass+Corporation+Rawalpindi&t=&z=15&ie=UTF8&iwloc=&output=embed";

export const STATS: Stat[] = [
  { id: 1, label: "Projects Completed", value: 312, suffix: "+" },
  { id: 2, label: "Happy Clients", value: 184, suffix: "" },
  { id: 3, label: "Years of Service", value: 16, suffix: "+" },
  { id: 4, label: "Skilled Staff", value: 28, suffix: "" },
];

export const SERVICES: Service[] = [
  { 
    id: 1, 
    title: "Aluminium Windows", 
    description: "Durable, thermally-efficient sliding and casement windows.", 
    icon: "maximize",
    details: "Our premium aluminium windows combine sleek modern aesthetics with robust performance. Designed for Pakistan's variable climate, they offer superior sealing against dust and noise.",
    features: ["Double Glazing options for thermal insulation", "Multi-point locking systems", "Dust-proof brush seals", "Smooth sliding mechanism"],
    qualitySpecs: "We use 1.6mm to 2.0mm gauge high-grade extruded aluminium (6063-T5 alloy) with powder-coated or anodized finishes that resist corrosion and fading.",
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1502005229766-5283522529dd?q=80&w=2000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?q=80&w=2000&auto=format&fit=crop"
    ]
  },
  { 
    id: 2, 
    title: "Glass Facades", 
    description: "Large-scale aluminium-framed facades for modern commercial builds.", 
    icon: "layers",
    details: "Transform commercial exteriors with our curtain wall and spider glass systems. We create seamless glass skins that maximize natural light while ensuring structural integrity.",
    features: ["Structural Glazing", "Spider Fitting Systems", "Reflective & Tinted Glass options", "Wind load resistance"],
    qualitySpecs: "Utilizing heavy-duty mullions and transoms, paired with 12mm+ tempered safety glass and SS-304 grade spider fittings for maximum durability.",
    images: [
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1556912172-45b7abe8d7e1?q=80&w=2000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1464938050520-ef2270bb8ce8?q=80&w=2000&auto=format&fit=crop"
    ]
  },
  { 
    id: 3, 
    title: "Sliding Doors", 
    description: "Smooth, heavy-duty sliding doors with slim sightlines.", 
    icon: "grid",
    details: "Connect your indoor and outdoor spaces with our panoramic sliding doors. Engineered for heavy usage, they glide effortlessly and provide a secure barrier when closed.",
    features: ["Floor-to-ceiling height capacity", "Heavy-duty rollers (up to 200kg sash)", "Slim profiles for maximum view", "Insect screen integration"],
    qualitySpecs: "Reinforced aluminium profiles with thermal break options. We use 8mm to 12mm tempered glass with high-performance weather stripping.",
    images: [
      "https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=2000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=2000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1595846519845-68e298c2edd8?q=80&w=2000&auto=format&fit=crop"
    ]
  },
  { 
    id: 4, 
    title: "Glass Partitions", 
    description: "Minimal frames, maximum clarity for offices and homes.", 
    icon: "shield",
    details: "Create privacy without sacrificing light. Our glass partitions are perfect for corporate offices, co-working spaces, and modern home interiors.",
    features: ["Frameless glass entries", "Frosted/Sandblasted designs", "Acoustic insulation", "Patch fitting doors"],
    qualitySpecs: "10mm to 12mm tempered glass with polished edges. Channels are installed with high-grade silicone and minimal aluminium U-channels.",
    images: [
      "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=2069&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1504384308090-c54be3855833?q=80&w=2000&auto=format&fit=crop"
    ]
  },
  { 
    id: 5, 
    title: "Shopfronts", 
    description: "High-impact storefronts and rolling shutters for retail.", 
    icon: "briefcase",
    details: "Your shopfront is your brand's first impression. We design frameless and framed glass fronts that are secure, elegant, and inviting.",
    features: ["Automated sensor doors", "Security glass", "Custom branding etching", "Rolling shutter integration"],
    qualitySpecs: "High-tensile aluminium framing for high-traffic areas. Laminated safety glass options available for enhanced security.",
    images: [
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?q=80&w=2000&auto=format&fit=crop"
    ]
  },
  { 
    id: 6, 
    title: "Stair Railings", 
    description: "Sleek aluminium and glass rail systems.", 
    icon: "home",
    details: "Modern safety solutions for balconies, staircases, and atriums. Our railings offer a clean, unobstructed view while meeting safety standards.",
    features: ["Top-mounted or side-mounted", "Handrail options (Wood/SS/Aluminium)", "Button/Standoff fixings", "UV resistant"],
    qualitySpecs: "12mm tempered glass with stainless steel (grade 304/316) or heavy-gauge aluminium posts and brackets.",
    images: [
      "https://images.unsplash.com/photo-1506146332389-18140dc7b2fb?q=80&w=2000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=2000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1595846061803-a15d97f26c36?q=80&w=2000&auto=format&fit=crop"
    ]
  },
];

export const PROJECTS: Project[] = [
  {
    id: 1,
    title: "Contemporary Office Facade",
    category: "Facades",
    location: "Islamabad, Blue Area",
    images: [
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1554469384-e58fac16e23a?q=80&w=2000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1464938050520-ef2270bb8ce8?q=80&w=2000&auto=format&fit=crop"
    ],
    description: "A 12-story commercial building featuring our signature spider-glass curtain wall system."
  },
  {
    id: 2,
    title: "Luxury Villa Sliding System",
    category: "Residential",
    location: "DHA Lahore",
    images: [
      "https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=2000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=2000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=2000&auto=format&fit=crop"
    ],
    description: "Floor-to-ceiling thermal break sliding doors connecting the lounge to the patio."
  },
  {
    id: 3,
    title: "Retail Shopfront",
    category: "Shopfronts",
    location: "Rawalpindi, Saddar",
    images: [
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2000&auto=format&fit=crop"
    ],
    description: "Frameless glass entry with automated sensors for a high-end clothing brand."
  },
  {
    id: 4,
    title: "Co-working Space Partitions",
    category: "Interior",
    location: "Karachi, Clifton",
    images: [
      "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1531973576160-7125cd663d86?q=80&w=2000&auto=format&fit=crop"
    ],
    description: "Acoustic glass partitions creating private meeting pods within an open plan."
  },
  {
    id: 5,
    title: "Skyline Apartments",
    category: "Residential",
    location: "Islamabad, E-11",
    images: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?q=80&w=2000&auto=format&fit=crop"
    ],
    description: "Complete aluminium window fit-out for a 200-unit residential complex."
  },
  {
    id: 6,
    title: "Mall Atrium Railings",
    category: "Interior",
    location: "Multan",
    images: [
      "https://images.unsplash.com/photo-1506146332389-18140dc7b2fb?q=80&w=2000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1595846061803-a15d97f26c36?q=80&w=2000&auto=format&fit=crop"
    ],
    description: "Crystal clear tempered glass balustrades for the main atrium."
  }
];

export const TESTIMONIALS: Testimonial[] = [
  { id: 1, name: "Saad Khan", role: "Architect", text: "Minhas Corp delivered the facade 2 weeks ahead of schedule. Their attention to detail on the joinery was impeccable." },
  { id: 2, name: "Mrs. Fatima Ali", role: "Homeowner", text: "The noise reduction from the new double-glazed windows is amazing. Highly recommended for residential projects." },
  { id: 3, name: "Bilal Ahmed", role: "Project Manager, Bahria Town", text: "Professional, safety-conscious, and technically skilled. A reliable partner for large-scale glazing." },
];