export interface PreviewSlide {
  title?: string;
  image: string;
  smallImage?: string;
  textLeft?: string;
  textMiddle?: string;
  textRight?: string;
}

export interface JournalEntry {
  slug: string;
  id: number;
  title: string;
  subtitle: string;
  desc: string;
  img: string;
  previewTemplate?: "version-1" | "version-2" | "version-3" | "version-4" | "version-5";
  previewSlides?: PreviewSlide[];
}

const BOX_1_SLIDES: PreviewSlide[] = [
  {
    title: 'TONGKAH ON CO-ARCHITECTURE "SITE".',
    image: "/assets/images/hero.png",
  },
  {
    image: "/assets/images/hero.png",
    textLeft:
      "WE ARE EXTREMELY PROUD TO SEE OUR TONGKAH PROJECT FEATURED ON THE CO-ARCHITECTURE PLATFORM THIS MORNING SEEN USING THE LINK BELOW:\n\nhttps://site.co-architecture.com/projects/tongkah-by-mck-architects/",
    textRight:
      "WE THANK LUKE AND HIS TEAM AT CO-ARCHITECTURE FOR SHOWCASING TONGKAH AND FOR CONTINUING TO DEDICATE THEIR RESPECTIVE ENERGY TO PROMOTING AUSTRALIAN ARCHITECTURE TO THE WORLD.",
  },
  {
    image: "/media/Sun Garden Hero.jpeg",
    smallImage: "/media/Sun Garden Hero.jpeg",
    textLeft:
      "Launched in 2022, THEY have established THEMSELVES as a trailblazing publication, committed to showcasing the most innovative and captivating designs from around the world.\n\nhttps://site.co-architecture.com/",
    textRight:
      "CO-architecture IS AN ONLINE destination for cutting-edge architectural and interior design inspiration in the digital realm.",
  },
];

const BOX_2_SLIDES: PreviewSlide[] = [
  {
    title: "OUR 2023\nCARBON-NEUTRAL QUEST",
    image: "/assets/images/hero.png",
  },
  {
    image: "/assets/images/hero.png",
    textLeft:
      "Reducing fossil fuel emissions can start with us and what we do everyday however our largest impact can be achieved through the work that we do. Being certified carbon neutral begins the conversation with the clients and within our office. It acts as a launch pad to raise awareness and promote passive thermal design.",
    textRight:
      "The process of becoming certified carbon neutral was not difficult, there are so many resources out there and methods to continue to reduce our carbon footprint. Going to green energy early in the process helped us start from a lower base point.\n\nBecoming carbon neutral was fundamentally driven by our studio’s awareness of its environmental footprint, and our desire as people, and as a team to do better.",
  },
  {
    image: "/assets/images/hero.png",
    textLeft:
      "Undertaking the carbon neutral certification opened up conversations within our office, firstly around carbon offsets and the process of certification but then the conversation expanded to include what more we can do as an office, and what we can do within our projects to create more sustainable outcomes.\n\nOne of the most exciting initiatives that developed from the carbon neutral journey was to develop in house sustainability consultants, this includes an inhouse BASIX and NatHERS assessor and develop a passive house knowledge base.",
    textMiddle:
      "We went through the Carbon Reduction Institute to become certified carbon neutral. The process was straight forward and involved data gathering from the office as well as our staff.\n\nThe Carbon Reduction Institute is internationally renowned and ISO globally approved, giving us confidence in its credibility and allowing us to follow a recognized path to carbon neutrality.",
  },
  {
    image: "/assets/images/hero.png",
    textLeft:
      "We purchased carbon offsets through the Carbon Reduction Institute, we choose the highest level of offset, gold standard. Whilst these offset programs are gold standard, we felt that we could improve with obtaining locally based offsets in our next audit. We did not need to purchase many offsets to become carbon neutral, our aim is to continue to reduce this towards zero.\n\nOne of the largest contributors to our emissions as a practice was through our electricity usage. With two offices and multiple computers and devices it was obvious to transition to green energy. This reduced the emissions and therefore the offsets that we required.",
    textRight:
      "As a relatively small office, we knew in advance that our carbon emissions would not be large, this can lead to a lack of desire or urgency to undertake a carbon neutral certification. But, what is key to remember, is that every emission counts and that by doing our upmost as an office to reduce the effects of climate change we are playing a part in the larger move towards a more sustainable future.",
  },
];

const BOX_3_SLIDES: PreviewSlide[] = [
  {
    title: "THE NEW AVALON STUDIO",
    image: "/assets/images/hero.png",
  },
  {
    image: "/assets/images/hero.png",
    textLeft:
      "Historically MCK’s body of work has taken us overseas as well as interstate, with projects ranging from New York and Los Angeles to Bangkok, whilst domestically our work has taken us from Western Australia and South Australia to Victoria as well as top to bottom of the NSW coastline.",
    textRight:
      "Towards the end of 2019, an opportunity arose to create an MCK Architects satellite studio on the Northern Beaches, right in the heart of the Avalon Beach village. Local residents from the MCK team, Nat Matthews and Steve Koolloos would form the backbone of the studio.",
  },
  {
    image: "/assets/images/hero.png",
    textLeft:
      "Over the years we have worked on several projects in and around the Northern Beaches, however now with a presence in the locality, the hope is for that body of work to grow.",
    textRight:
      "The studio is modest yet extremely relaxed and was fitted out with facilities to comfortably host up to 6 team members. The open plan is simple and is embodied with the casual ambience that Avalon is famous for.",
  },
];

const BOX_4_SLIDES: PreviewSlide[] = [
  {
    title: "TATHRA",
    image: "/assets/images/hero.png",
  },
  {
    image: "/assets/images/hero.png",
    textLeft:
      "In March 2018, a bushfire tore through the NSW coastal town of Tathra, ultimately burning 1250 hectares of land and destroying 69 homes. Not long after its impact, Peter Boyce travelled to Tathra to offer his services, gratis to those in need.",
    textMiddle:
      "Later that year Peter contacted our office to see if we were interested in assisting, preferably gratis, something we did not hesitate to sign up for.",
    textRight:
      "The Carters are mum and dad, Michelle + Chris, with their three children Jai, Levi + Kiah. They are proud and resilient people who insisted on re-building their home on their dream property.",
  },
  {
    image: "/assets/images/hero.png",
    textLeft:
      "A design process ensued with regular contact, and several meetings until a design was agreed upon. The home was inspired by a generous view of the Pacific Ocean to the East.",
    textRight:
      "Chris works in the construction industry as do his two sons, and together they ambitiously set out to commence the construction process.",
  },
  {
    image: "/assets/images/hero.png",
    textLeft:
      "As the home nears completion, there is a profound sense of gratification for all involved, least of all the Carter family. Lifelong bonds have been forged through the simple premise of helping those in need.",
  },
];

const BOX_5_SLIDES: PreviewSlide[] = [
  {
    title: "MCK WELCOMES STEFANO MANUELLI\nUK ARB # 67150I",
    image: "/assets/images/hero.png",
  },
  {
    image: "/assets/images/hero.png",
    textLeft:
      "Stefano joined MCK Architects in 2025 after working with Luigi Rosselli Architects, Peter Stutchbury Architecture as an Associate, and Candalepas Associates. Stefano graduated with First Class Honours in Architecture from the University of Genoa in 1998.",
    textRight:
      "He moved to Sydney from London in 2013. With experience in high-profile, award-winning projects across hotel, leisure, residential, and office sectors, both in Australia and abroad, Stefano has developed a well-rounded skill set.",
  },
];


export const JOURNAL_ENTRIES: JournalEntry[] = [
  {
    id: 1,
    title: "Entry — 01",
    subtitle: "Architectural Journal",
    desc: "An exploration of context-driven design and refined structural forms within the modern landscape.",
    img: "/assets/images/hero.png",
    previewTemplate: "version-1",
    previewSlides: BOX_1_SLIDES,
    slug: ""
  },
  {
    id: 2,
    title: "Entry — 02",
    subtitle: "Architectural Journal",
    desc: "An exploration of context-driven design and refined structural forms within the modern landscape.",
    img: "/assets/images/hero.png",
    previewTemplate: "version-2",
    previewSlides: BOX_2_SLIDES,
    slug: ""
  },
  {
    id: 3,
    title: "Entry — 03",
    subtitle: "Architectural Journal",
    desc: "An exploration of context-driven design and refined structural forms within the modern landscape.",
    img: "/assets/images/hero.png",
    previewTemplate: "version-3",
    previewSlides: BOX_3_SLIDES,
    slug: ""
  },
  {
    id: 4,
    title: "Entry — 04",
    subtitle: "Architectural Journal",
    desc: "An exploration of context-driven design and refined structural forms within the modern landscape.",
    img: "/assets/images/hero.png",
    previewTemplate: "version-4",
    previewSlides: BOX_4_SLIDES,
    slug: ""
  },
  {
    id: 5,
    title: "Entry — 05",
    subtitle: "Architectural Journal",
    desc: "An exploration of context-driven design and refined structural forms within the modern landscape.",
    img: "/assets/images/hero.png",
    previewTemplate: "version-5",
    previewSlides: BOX_5_SLIDES,
    slug: ""
  },
  
];
