// import ayodele from '@/assets/ayodele.png';
// import babarinde from '@/assets/babarinde.png';
// import bridge from '@/assets/bridge.png';
// import chinyere from '@/assets/chinyere.png';
// import emzor from '@/assets/emzor.png';
// import event from '@/assets/event.png';
// import group from '@/assets/group.png';
// import hba from '@/assets/hba-africa.png';
// import health from '@/assets/health.png';
// import hfn_partner from '@/assets/hfn_partner.png';
// import jennifer from '@/assets/jennifer.png';
// import njide from '@/assets/njide.png';
// import oando from '@/assets/oando_logo.png';
// import pharm from '@/assets/pharm.png';
// import reagan from '@/assets/reagan.png';
// import wef from '@/assets/wef.jpg';
import { homePageSchema } from './pages/home.schema.js';
import { aboutPageSchema } from './pages/about.schema.js';
import { governanceSchema } from './pages/governance.schema.js';
import { galleryPageSchema } from './pages/gallery.schema.js';
import { getInvolvedPageSchema } from './pages/getInvolve.schema.js';
import { membershipPageSchema } from './pages/membership.schema.js';
import { contactPageSchema } from './pages/contact.schema.js';
import { eventsPageSchema } from './pages/events.schema.js';
import { newsPageSchema } from './pages/news.schema.js';
import { resourcesPageSchema } from './pages/resources.schema.js';
import { programsPageSchema } from './pages/programs.schema.js';
import { footerSchema } from './pages/footer.schema.js';
import { customPageSchema } from './pages/custom.schema.js';


const eventImage =
  'https://res.cloudinary.com/pou7gd5q41xc/image/upload/v1769883047/events-CNRYrGt8_trfhaz.png';
const breakfast2025 =
  'https://res.cloudinary.com/pou7gd5q41xc/image/upload/v1769881263/1758712162657_yclv7p.jpg';
const roundtable2025 =
  'https://res.cloudinary.com/pou7gd5q41xc/image/upload/v1769881265/1764355254559_g2wv3t.jpg';
const hfn2025 =
  'https://res.cloudinary.com/pou7gd5q41xc/image/upload/v1769881267/1746181486545_mtao0s.jpg';
const latestHero =
  'https://res.cloudinary.com/pou7gd5q41xc/image/upload/v1770045591/243A7993_wxlzkg.jpg';
const society =
  'https://res.cloudinary.com/pou7gd5q41xc/image/upload/v1769734457/Society_For_Family_Health_Logo_1_a5qcrp.png';
const handsJoining =
  'https://res.cloudinary.com/pou7gd5q41xc/image/upload/v1769896360/IMG_9238_vxq385.jpg';
const chairImage =
  'https://res.cloudinary.com/pou7gd5q41xc/image/upload/v1769894247/Bola_Adesola_lr8vif.png';

export const pageSchemas = {
  home: homePageSchema,
  about: aboutPageSchema,
  governance: governanceSchema,
  gallery: galleryPageSchema,
  getinvolved: getInvolvedPageSchema,
  contact: contactPageSchema,
  events: eventsPageSchema,  
  member: membershipPageSchema,
  latestnews: newsPageSchema,
  programs: programsPageSchema,
  resources: resourcesPageSchema,
  footer: footerSchema,
  custom: customPageSchema,
};
