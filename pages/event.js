import style from "../styles/Events2.module.css";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import ModalContext from "../context/ModalContext";
import LoadingCircle from "../components/Extra/LoadingCircle";
import EventCard from "../components/Cards/EventCard";
import Head from "next/head";
import dynamic from "next/dynamic";
const CreateEvent = dynamic(() => import("../components/Modals/CreateEvent"));
import OneSignal from "react-onesignal";
import { useTranslation } from "next-i18next";
import { FaSearch, FaPlus } from "react-icons/fa";

// Hardcoded events formatted to match the provided structure
const hardcodedEvents = [
  {
    _id: "event_1",
    title:
      "فرصة للشباب من جميع جهات المغرب للمشاركة في برنامج تطويري مميز مع Ken.",
    desc: "تطلق Ken. دعوة لتقديم الترشيحات لبرنامج وطني موجه للشباب المغاربة الذين تتراوح أعمارهم بين 18 و 30 سنة. يهدف هذا البرنامج إلى تعزيز المهارات القيادية، تشجيع المشاركة المجتمعية، تحفيز الابتكار الاجتماعي، وإنشاء شبكة من القادة الشباب.",
    eventImage:
      "https://res.cloudinary.com/dghbzamnp/image/upload/v1744898724/opportunities/covers/z5gwkg07ad6rxapqktsf.jpg",
    userInfo: [{ profile_picture: "/images/default_user.jpg" }],
    sponsored: true,
    type_of_event: "hybrid",
    tickets: [
      { price: "0", currency: "MAD" },
      { price: "50", currency: "MAD" },
    ],
    community_service_offered: 10,
    date_of_events: "2025-06-10 to 2025-06-15",
    eventMode: "physical",
    locationName: "Casablanca, Morocco",
    teacher_id: null,
    associationId: "assoc_1",
    additional: "allowAll",
  },
  {
    _id: "event_2",
    title: "PLURAL+ Youth Video Festival 2025",
    desc: "The PLURAL+ Youth Video Festival invites young people worldwide to submit creative videos on migration, diversity, and social inclusion. Winners join a prestigious awards ceremony and network with global changemakers.",
    eventImage:
      "https://res.cloudinary.com/dghbzamnp/image/upload/v1744752315/opportunities/covers/olwduca1utro9oagsdsu.jpg",
    userInfo: [{ profile_picture: "/images/default_user.jpg" }],
    sponsored: true,
    type_of_event: "ticketed",
    tickets: [{ price: "20", currency: "USD" }],
    community_service_offered: 0,
    date_of_events: "2025-07-25 to 2025-08-01",
    eventMode: "physical",
    locationName: "New York, USA",
    teacher_id: null,
    associationId: "assoc_2",
    additional: "allowAll",
  },
  {
    _id: "event_3",
    title: "4.7 Day ESD Chalk Art Competition 2025",
    desc: "The 4.7 Day ESD Chalk Art Competition encourages learners to use chalk art to promote Education for Sustainable Development, inspiring conversations on global citizenship, climate action, and equity.",
    eventImage:
      "https://res.cloudinary.com/dghbzamnp/image/upload/v1744751963/opportunities/covers/amsoa5l3ztivhdhmsobt.jpg",
    userInfo: [{ profile_picture: "/images/default_user.jpg" }],
    sponsored: true,
    type_of_event: "volunteer",
    tickets: [],
    community_service_offered: 15,
    date_of_events: "2025-03-15 to 2025-03-20",
    eventMode: "physical",
    locationName: "Paris, France",
    teacher_id: null,
    associationId: "assoc_3",
    additional: "allowAll",
  },
  {
    _id: "event_4",
    title:
      "UNEP Champions of the Earth Award 2025 – UN’s Highest Environmental Honour",
    desc: "The Champions of the Earth Award by UNEP honors individuals and organizations for innovative solutions addressing climate change, pollution, and biodiversity loss, with a focus on methane emissions, sustainable buildings, and clean air.",
    eventImage:
      "https://res.cloudinary.com/dghbzamnp/image/upload/v1744751573/opportunities/covers/bq9onuhmqdwkrl7185ry.jpg",
    userInfo: [{ profile_picture: "/images/default_user.jpg" }],
    sponsored: true,
    type_of_event: "award",
    tickets: [],
    community_service_offered: 0,
    date_of_events: "2025-07-05 to 2025-07-10",
    eventMode: "hybrid",
    locationName: "Nairobi, Kenya",
    teacher_id: null,
    associationId: "assoc_4",
    additional: "allowAll",
  },
  {
    _id: "event_5",
    title:
      "Prix Visions Jeunesses 2025 – Récompenser les récits portés sur les jeunesses",
    desc: "Le Prix Visions Jeunesses by Ashoka France rewards inspiring youth-focused media productions, offering 3,000 € and distribution to winners for original written, audio, visual, or graphic works.",
    eventImage:
      "https://res.cloudinary.com/dghbzamnp/image/upload/v1744673610/opportunities/covers/m44psuk06pcfgjnmwq24.jpg",
    userInfo: [{ profile_picture: "/images/default_user.jpg" }],
    sponsored: true,
    type_of_event: "award",
    tickets: [],
    community_service_offered: 0,
    date_of_events: "2025-05-25 to 2025-05-30",
    eventMode: "hybrid",
    locationName: "Lyon, France",
    teacher_id: null,
    associationId: "assoc_5",
    additional: "allowAll",
  },
  {
    _id: "event_6",
    title: "Qra w Tfannane – Volontariat Lecture et Animation Enfants",
    desc: "Qra w Tfannane, led by Eden Maroc, fosters a love for reading among children in Rabat and Salé through volunteer-led reading sessions and creative activities held twice monthly.",
    eventImage:
      "https://res.cloudinary.com/dghbzamnp/image/upload/v1744487920/opportunities/covers/sljj2wjldus3hvwdfyz9.jpg",
    userInfo: [{ profile_picture: "/images/default_user.jpg" }],
    sponsored: false,
    type_of_event: "volunteer",
    tickets: [],
    community_service_offered: 20,
    date_of_events: "2025-04-20 to 2025-04-25",
    eventMode: "physical",
    locationName: "Rabat, Morocco",
    teacher_id: null,
    associationId: "assoc_6",
    additional: "allowAll",
  },
  {
    _id: "event_7",
    title:
      "برنامج ريادة الأعمال للشباب المقاولين – دعم مشاريع في الفلاحة، الفلاحة التحويلية والخدمات الرقمية المرتبطة بها",
    desc: "برنامج ريادة الأعمال يدعم 100 شاب وشابة في تحويل أفكارهم الفلاحية إلى مشاريع ملموسة من خلال التكوين، المواكبة، والاستشارة القانونية، مع التركيز على الاقتصاد الأخضر.",
    eventImage:
      "https://res.cloudinary.com/dghbzamnp/image/upload/v1744412364/opportunities/covers/o0eqzi7iy1oswc0xkz0r.jpg",
    userInfo: [{ profile_picture: "/images/default_user.jpg" }],
    sponsored: true,
    type_of_event: "workshop",
    tickets: [{ price: "0", currency: "MAD" }],
    community_service_offered: 5,
    date_of_events: "2025-09-10 to 2025-09-15",
    eventMode: "physical",
    locationName: "Marrakech, Morocco",
    teacher_id: null,
    associationId: "assoc_7",
    additional: "allowAll",
  },
  {
    _id: "event_8",
    title: "UN SDG Action Awards 2025 – Heroes of Tomorrow",
    desc: "The UN SDG Action Awards celebrate individuals and initiatives driving sustainable development through creativity and innovation, with winners honored at a global ceremony in Rome.",
    eventImage:
      "https://res.cloudinary.com/dghbzamnp/image/upload/v1744376909/opportunities/covers/sjb1lx0nd5nlcvukvrb7.jpg",
    userInfo: [{ profile_picture: "/images/default_user.jpg" }],
    sponsored: true,
    type_of_event: "award",
    tickets: [],
    community_service_offered: 0,
    date_of_events: "2025-10-24 to 2025-10-29",
    eventMode: "hybrid",
    locationName: "Rome, Italy",
    teacher_id: null,
    associationId: "assoc_8",
    additional: "allowAll",
  },
  {
    _id: "event_9",
    title:
      "Training on International Climate Negotiations – 4C Maroc (April 2025)",
    desc: "4C Maroc offers fully funded training for young African and Arab climate leaders to master international climate policy processes under the UNFCCC, focusing on Moroccan and regional priorities.",
    eventImage:
      "https://res.cloudinary.com/dghbzamnp/image/upload/v1744160399/opportunities/covers/g8lctubcyctowvh7ba6l.jpg",
    userInfo: [{ profile_picture: "/images/default_user.jpg" }],
    sponsored: true,
    type_of_event: "workshop",
    tickets: [{ price: "0", currency: "MAD" }],
    community_service_offered: 10,
    date_of_events: "2025-04-21 to 2025-04-25",
    eventMode: "physical",
    locationName: "Rabat, Morocco",
    teacher_id: null,
    associationId: "assoc_9",
    additional: "allowAll",
  },
  {
    _id: "event_10",
    title: "Funding for climate-related student research in Africa 2025",
    desc: "The Climate Research Fund for African Students supports undergraduate and postgraduate research on climate themes like renewable energy and climate adaptation, offering funding and mentorship.",
    eventImage:
      "https://res.cloudinary.com/dghbzamnp/image/upload/v1744158758/opportunities/covers/ctlqtdwb21iienvbw5vx.jpg",
    userInfo: [{ profile_picture: "/images/default_user.jpg" }],
    sponsored: true,
    type_of_event: "grant",
    tickets: [],
    community_service_offered: 0,
    date_of_events: "2025-07-20 to 2025-07-25",
    eventMode: "hybrid",
    locationName: "Accra, Ghana",
    teacher_id: null,
    associationId: "assoc_10",
    additional: "allowAll",
  },
  {
    _id: "event_11",
    title:
      "Fully Funded International Conservation Congress in Abu Dhabi – 2025",
    desc: "A global conservation event for youth to showcase sustainable initiatives, network with experts, and build partnerships for biodiversity and climate action, with all costs covered.",
    eventImage:
      "https://res.cloudinary.com/dghbzamnp/image/upload/v1744156823/opportunities/covers/zm9cz46r2vbbqabk6ro3.jpg",
    userInfo: [{ profile_picture: "/images/default_user.jpg" }],
    sponsored: true,
    type_of_event: "conference",
    tickets: [{ price: "0", currency: "AED" }],
    community_service_offered: 5,
    date_of_events: "2025-05-05 to 2025-05-10",
    eventMode: "physical",
    locationName: "Abu Dhabi, UAE",
    teacher_id: null,
    associationId: "assoc_11",
    additional: "allowAll",
  },
  {
    _id: "event_12",
    title: "Green Hydrogen Camp Tunisia",
    desc: "A fully funded summer school and hackathon in Tunisia for EU and MENA students to explore renewable hydrogen technologies through workshops, site visits, and a 48-hour hackathon.",
    eventImage:
      "https://res.cloudinary.com/dghbzamnp/image/upload/v1744133774/opportunities/covers/ka2ic1joxkawyf6wqhnq.jpg",
    userInfo: [{ profile_picture: "/images/default_user.jpg" }],
    sponsored: true,
    type_of_event: "workshop",
    tickets: [{ price: "0", currency: "TND" }],
    community_service_offered: 10,
    date_of_events: "2025-07-07 to 2025-07-11",
    eventMode: "physical",
    locationName: "Tunis, Tunisia",
    teacher_id: null,
    associationId: "assoc_12",
    additional: "allowAll",
  },
  {
    _id: "event_13",
    title: "UNESCO Clubs Worldwide Youth Multimedia Competition 2025",
    desc: "UNESCO invites youth to submit sustainable solutions aligned with SDGs via video, essay, or presentation, with winners receiving scholarships and a chance to attend a U.S. summer camp.",
    eventImage:
      "https://res.cloudinary.com/dghbzamnp/image/upload/v1743891402/opportunities/covers/ih6horxysvppphirfyds.jpg",
    userInfo: [{ profile_picture: "/images/default_user.jpg" }],
    sponsored: true,
    type_of_event: "competition",
    tickets: [],
    community_service_offered: 0,
    date_of_events: "2025-08-15 to 2025-08-20",
    eventMode: "hybrid",
    locationName: "Washington D.C., USA",
    teacher_id: null,
    associationId: "assoc_13",
    additional: "allowAll",
  },
  {
    _id: "event_14",
    title:
      "ARLEM Award 2025 – Young Local Entrepreneurship in the Mediterranean",
    desc: "The ARLEM Award honors young Mediterranean entrepreneurs supported by local authorities, announced at the 16th ARLEM Plenary in Palermo, fostering economic collaboration.",
    eventImage:
      "https://res.cloudinary.com/dghbzamnp/image/upload/v1743890989/opportunities/covers/pjgdwofwz6u1incrz9xq.jpg",
    userInfo: [{ profile_picture: "/images/default_user.jpg" }],
    sponsored: true,
    type_of_event: "award",
    tickets: [],
    community_service_offered: 0,
    date_of_events: "2025-04-25 to 2025-04-30",
    eventMode: "physical",
    locationName: "Palermo, Italy",
    teacher_id: null,
    associationId: "assoc_14",
    additional: "allowAll",
  },
  {
    _id: "event_15",
    title: "One World Summit Italy 2025",
    desc: "A global event in Milan gathering young leaders to discuss innovative solutions for global challenges, fostering idea exchange and leadership development.",
    eventImage:
      "https://res.cloudinary.com/dghbzamnp/image/upload/v1743817279/opportunities/covers/wyrbpzsygbzki1vyufyt.jpg",
    userInfo: [{ profile_picture: "/images/default_user.jpg" }],
    sponsored: true,
    type_of_event: "conference",
    tickets: [{ price: "100", currency: "EUR" }],
    community_service_offered: 5,
    date_of_events: "2025-07-28 to 2025-07-31",
    eventMode: "physical",
    locationName: "Milan, Italy",
    teacher_id: null,
    associationId: "assoc_15",
    additional: "allowAll",
  },
  {
    _id: "event_16",
    title: "MENA Scholarship Programme (MSP) – Morocco 2025",
    desc: "The MSP offers short-term training in the Netherlands for Moroccan professionals aged 20–45, empowering them in priority sectors through top Dutch institutions.",
    eventImage:
      "https://res.cloudinary.com/dghbzamnp/image/upload/v1743799576/opportunities/covers/spycmhcsuxujjbizbp5l.png",
    userInfo: [{ profile_picture: "/images/default_user.jpg" }],
    sponsored: true,
    type_of_event: "workshop",
    tickets: [{ price: "0", currency: "EUR" }],
    community_service_offered: 0,
    date_of_events: "2025-03-25 to 2025-03-30",
    eventMode: "physical",
    locationName: "Amsterdam, Netherlands",
    teacher_id: null,
    associationId: "assoc_16",
    additional: "allowAll",
  },
  {
    _id: "event_17",
    title: "دعوة لتقديم مقترحات – دعم الصناعات الثقافية والإبداعية في المغرب",
    desc: "دعوة بتمويل 6.9 مليون يورو لدعم الصناعات الثقافية والإبداعية في المغرب، تشمل دعم رواد الأعمال الشباب وبرامج التكوين والمبادرات المشتركة مع أوروبا.",
    eventImage:
      "https://res.cloudinary.com/dghbzamnp/image/upload/v1743789811/opportunities/covers/lwz9jmq1asmdnzopiblh.jpg",
    userInfo: [{ profile_picture: "/images/default_user.jpg" }],
    sponsored: true,
    type_of_event: "grant",
    tickets: [],
    community_service_offered: 0,
    date_of_events: "2025-07-10 to 2025-07-15",
    eventMode: "hybrid",
    locationName: "Rabat, Morocco",
    teacher_id: null,
    associationId: "assoc_17",
    additional: "allowAll",
  },
  {
    _id: "event_18",
    title:
      "Lab Innova Morocco 2025 – Training & Internationalization for Innovative Moroccan Startups",
    desc: "Lab Innova Morocco supports 20 Moroccan startups in circular economy and sustainable development with training, coaching, and a study tour in Italy.",
    eventImage:
      "https://res.cloudinary.com/dghbzamnp/image/upload/v1743788981/opportunities/covers/hsq54t2hyzrj8qm0hcz2.jpg",
    userInfo: [{ profile_picture: "/images/default_user.jpg" }],
    sponsored: true,
    type_of_event: "workshop",
    tickets: [{ price: "0", currency: "MAD" }],
    community_service_offered: 5,
    date_of_events: "2025-05-15 to 2025-05-20",
    eventMode: "hybrid",
    locationName: "Rabat, Morocco",
    teacher_id: null,
    associationId: "assoc_18",
    additional: "allowAll",
  },
  {
    _id: "event_19",
    title:
      "InspireHER Contest 2025 – Empowering Women Entrepreneurs in the MENA Region",
    desc: "The InspireHER Contest supports MENA women entrepreneurs with awards, capacity-building, and networking, celebrated at the UfM Women Business Forum in Palermo.",
    eventImage:
      "https://res.cloudinary.com/dghbzamnp/image/upload/v1743722457/opportunities/covers/p4hwihbvtrzbj7v1vftz.jpg",
    userInfo: [{ profile_picture: "/images/default_user.jpg" }],
    sponsored: true,
    type_of_event: "competition",
    tickets: [],
    community_service_offered: 0,
    date_of_events: "2025-06-05 to 2025-06-10",
    eventMode: "physical",
    locationName: "Palermo, Italy",
    teacher_id: null,
    associationId: "assoc_19",
    additional: "allowAll",
  },
  {
    _id: "event_20",
    title: "Deepfake AI Competition – DeepTech Summit 2025",
    desc: "A national Moroccan competition to develop AI solutions against deepfakes, part of the DeepTech Summit, with winners rewarded in Benguerir.",
    eventImage:
      "https://res.cloudinary.com/dghbzamnp/image/upload/v1743721698/opportunities/covers/ew81is3v33y2pooaboyt.png",
    userInfo: [{ profile_picture: "/images/default_user.jpg" }],
    sponsored: true,
    type_of_event: "competition",
    tickets: [{ price: "0", currency: "MAD" }],
    community_service_offered: 0,
    date_of_events: "2025-04-10 to 2025-04-15",
    eventMode: "physical",
    locationName: "Benguerir, Morocco",
    teacher_id: null,
    associationId: "assoc_20",
    additional: "allowAll",
  },
  {
    _id: "event_21",
    title: "COAL Prize 2025 – Freshwater Edition",
    desc: "The COAL Prize invites artists to submit projects on freshwater, offering €12,000 and a residency to winners for transformative ecological proposals.",
    eventImage:
      "https://res.cloudinary.com/dghbzamnp/image/upload/v1743720093/opportunities/covers/iigqzlztkshugtxxaxox.jpg",
    userInfo: [{ profile_picture: "/images/default_user.jpg" }],
    sponsored: true,
    type_of_event: "award",
    tickets: [],
    community_service_offered: 0,
    date_of_events: "2025-08-01 to 2025-08-05",
    eventMode: "hybrid",
    locationName: "Brussels, Belgium",
    teacher_id: null,
    associationId: "assoc_21",
    additional: "allowAll",
  },
  {
    _id: "event_22",
    title: "Summer Program 2025",
    desc: "A UNESCO Center for Peace summer program offering Model UN, STEAM, or local project tracks to enhance leadership and cultural exchange among global youth.",
    eventImage:
      "https://res.cloudinary.com/dghbzamnp/image/upload/v1743634192/opportunities/covers/dev7dqpp98dni0a7shpa.jpg",
    userInfo: [{ profile_picture: "/images/default_user.jpg" }],
    sponsored: true,
    type_of_event: "workshop",
    tickets: [{ price: "200", currency: "USD" }],
    community_service_offered: 10,
    date_of_events: "2025-07-20 to 2025-08-02",
    eventMode: "physical",
    locationName: "Virginia, USA",
    teacher_id: null,
    associationId: "assoc_22",
    additional: "allowAll",
  },
  {
    _id: "event_23",
    title: "Volunteering Opportunity in Spain: LearnInRural",
    desc: "LearnInRural engages 48 youth from rural areas in Spain, Turkey, Hungary, and Morocco in volunteering to create educational environments and promote social inclusion.",
    eventImage:
      "https://res.cloudinary.com/dghbzamnp/image/upload/v1743553345/opportunities/covers/p0xly5nylgvltffcj1no.jpg",
    userInfo: [{ profile_picture: "/images/default_user.jpg" }],
    sponsored: true,
    type_of_event: "volunteer",
    tickets: [],
    community_service_offered: 20,
    date_of_events: "2025-09-01 to 2025-09-07",
    eventMode: "physical",
    locationName: "Seville, Spain",
    teacher_id: null,
    associationId: "assoc_23",
    additional: "allowAll",
  },
  {
    _id: "event_24",
    title: "Green Fellowship Program 2025",
    desc: "The Green Fellowship Program supports young sustainability leaders with conferences, community service, and mentorship to become visible changemakers.",
    eventImage:
      "https://res.cloudinary.com/dghbzamnp/image/upload/v1743311124/opportunities/covers/o4drzj7g4yjwpfewvth0.jpg",
    userInfo: [{ profile_picture: "/images/default_user.jpg" }],
    sponsored: true,
    type_of_event: "fellowship",
    tickets: [],
    community_service_offered: 10,
    date_of_events: "2025-06-25 to 2025-06-30",
    eventMode: "hybrid",
    locationName: "Cape Town, South Africa",
    teacher_id: null,
    associationId: "assoc_24",
    additional: "allowAll",
  },
  {
    _id: "event_25",
    title: "Leading Scholarship – One Young World Summit 2025",
    desc: "Fully funded access to the One Young World Summit for young leaders from underrepresented countries to connect with global changemakers in Munich.",
    eventImage:
      "https://res.cloudinary.com/dghbzamnp/image/upload/v1743208576/opportunities/covers/kssijsazv3pqh8ozn6ro.jpg",
    userInfo: [{ profile_picture: "/images/default_user.jpg" }],
    sponsored: true,
    type_of_event: "conference",
    tickets: [{ price: "0", currency: "EUR" }],
    community_service_offered: 5,
    date_of_events: "2025-11-03 to 2025-11-06",
    eventMode: "physical",
    locationName: "Munich, Germany",
    teacher_id: null,
    associationId: "assoc_25",
    additional: "allowAll",
  },
  {
    _id: "event_26",
    title: "2025 Jacobs Teen Innovation Challenge",
    desc: "A global virtual competition for teens aged 13–18 to develop SDG-aligned solutions using design thinking, fostering innovation and community impact.",
    eventImage:
      "https://res.cloudinary.com/dghbzamnp/image/upload/v1743207778/opportunities/covers/tzbkkn95klsdhh5iy7rb.jpg",
    userInfo: [{ profile_picture: "/images/default_user.jpg" }],
    sponsored: true,
    type_of_event: "competition",
    tickets: [{ price: "0", currency: "USD" }],
    community_service_offered: 0,
    date_of_events: "2025-04-15 to 2025-04-20",
    eventMode: "online",
    locationName: "Online",
    teacher_id: null,
    associationId: "assoc_26",
    additional: "allowAll",
  },
  {
    _id: "event_27",
    title: "The Possibilists Global Changemaker Survey 2025",
    desc: "A global survey for young changemakers to share insights on social and environmental innovation, offering rewards like workshops and coaching sessions.",
    eventImage:
      "https://res.cloudinary.com/dghbzamnp/image/upload/v1743179050/opportunities/covers/nso9agzrry8rl1z1wiov.jpg",
    userInfo: [{ profile_picture: "/images/default_user.jpg" }],
    sponsored: true,
    type_of_event: "survey",
    tickets: [],
    community_service_offered: 0,
    date_of_events: "2025-05-10 to 2025-05-15",
    eventMode: "online",
    locationName: "Vienna, Austria",
    teacher_id: null,
    associationId: "assoc_27",
    additional: "allowAll",
  },

  {
    _id: "event_29",
    title: "Entrepreneurship World Cup 2025",
    desc: "A global pitch competition for entrepreneurs from over 200 countries, offering $1 million in prizes, mentorship, and investor connections.",
    eventImage:
      "https://res.cloudinary.com/dghbzamnp/image/upload/v1742954044/opportunities/covers/uphef2ybkpomi8rhdnll.png",
    userInfo: [{ profile_picture: "/images/default_user.jpg" }],
    sponsored: true,
    type_of_event: "competition",
    tickets: [{ price: "0", currency: "USD" }],
    community_service_offered: 0,
    date_of_events: "2025-06-15 to 2025-06-20",
    eventMode: "hybrid",
    locationName: "Dubai, UAE",
    teacher_id: null,
    associationId: "assoc_29",
    additional: "allowAll",
  },
  {
    _id: "event_30",
    title: "Action With Africa Challenge 2025",
    desc: "An Enactus Germany initiative supporting entrepreneurial projects tackling Africa’s challenges, offering up to €30,000 in funding for sustainable development.",
    eventImage:
      "https://res.cloudinary.com/dghbzamnp/image/upload/v1742950936/opportunities/covers/csi6h7gvljcqpascyctc.jpg",
    userInfo: [{ profile_picture: "/images/default_user.jpg" }],
    sponsored: true,
    type_of_event: "competition",
    tickets: [{ price: "0", currency: "EUR" }],
    community_service_offered: 0,
    date_of_events: "2025-08-05 to 2025-08-10",
    eventMode: "hybrid",
    locationName: "Berlin, Germany",
    teacher_id: null,
    associationId: "assoc_30",
    additional: "allowAll",
  },
  {
    _id: "event_31",
    title: "Fuzé - Digital Africa 2025 Accelerator Program",
    desc: "Fuzé by Digital Africa supports African tech startups with €20,000–€100,000 funding, mentoring, and industry connections to scale innovative ventures.",
    eventImage:
      "https://res.cloudinary.com/dghbzamnp/image/upload/v1742949837/opportunities/covers/pnupiikw5bucv11ramsp.jpg",
    userInfo: [{ profile_picture: "/images/default_user.jpg" }],
    sponsored: true,
    type_of_event: "accelerator",
    tickets: [],
    community_service_offered: 0,
    date_of_events: "2025-05-25 to 2025-05-30",
    eventMode: "hybrid",
    locationName: "Lagos, Nigeria",
    teacher_id: null,
    associationId: "assoc_31",
    additional: "allowAll",
  },
  {
    _id: "event_32",
    title: "MTF Pitch 2025",
    desc: "MTF Pitch offers early-stage tech startups a chance to win £30,000 by pitching at the Muslim Tech Fest in London, with mentorship and investor connections.",
    eventImage:
      "https://res.cloudinary.com/dghbzamnp/image/upload/v1742530195/opportunities/covers/osz9u5bu6m8seq1zujii.png",
    userInfo: [{ profile_picture: "/images/default_user.jpg" }],
    sponsored: true,
    type_of_event: "competition",
    tickets: [{ price: "50", currency: "GBP" }],
    community_service_offered: 0,
    date_of_events: "2025-07-15 to 2025-07-20",
    eventMode: "physical",
    locationName: "London, UK",
    teacher_id: null,
    associationId: "assoc_32",
    additional: "allowAll",
  },
  {
    _id: "event_33",
    title: "ECOP Morocco Membership Call 2025",
    desc: "ECOP Morocco invites ocean science and activism enthusiasts to join a network for marine conservation, offering workshops, mentorship, and project leadership.",
    eventImage:
      "https://res.cloudinary.com/dghbzamnp/image/upload/v1741989846/opportunities/covers/gqtza9tkfiktonqyi2xl.jpg",
    userInfo: [{ profile_picture: "/images/default_user.jpg" }],
    sponsored: false,
    type_of_event: "membership",
    tickets: [],
    community_service_offered: 15,
    date_of_events: "2025-06-10 to 2025-06-15",
    eventMode: "hybrid",
    locationName: "Agadir, Morocco",
    teacher_id: null,
    associationId: "assoc_33",
    additional: "allowAll",
  },
  {
    _id: "event_34",
    title: "Wanted: Social Entrepreneur in Morocco",
    desc: "BOOKBRIDGE seeks social entrepreneurs in Morocco to build profitable social businesses with coaching, team support, and a 0% interest loan.",
    eventImage:
      "https://res.cloudinary.com/dghbzamnp/image/upload/v1741832234/opportunities/covers/mauzo37vpwounagoxnry.jpg",
    userInfo: [{ profile_picture: "/images/default_user.jpg" }],
    sponsored: true,
    type_of_event: "workshop",
    tickets: [{ price: "0", currency: "MAD" }],
    community_service_offered: 10,
    date_of_events: "2025-04-20 to 2025-04-25",
    eventMode: "physical",
    locationName: "Fez, Morocco",
    teacher_id: null,
    associationId: "assoc_34",
    additional: "allowAll",
  },
  {
    _id: "event_35",
    title: "Green Small-Scale Innovative Projects Competition",
    desc: "A competition supporting green projects in Morocco with $5,000–$60,000 grants for renewable energy, water management, and sustainable agriculture.",
    eventImage:
      "https://res.cloudinary.com/dghbzamnp/image/upload/v1741831627/opportunities/covers/pezpnxopxqryihsgxz1j.jpg",
    userInfo: [{ profile_picture: "/images/default_user.jpg" }],
    sponsored: true,
    type_of_event: "competition",
    tickets: [],
    community_service_offered: 0,
    date_of_events: "2025-07-27 to 2025-08-01",
    eventMode: "hybrid",
    locationName: "Tangier, Morocco",
    teacher_id: null,
    associationId: "assoc_35",
    additional: "allowAll",
  },
  {
    _id: "event_36",
    title: "CorpsAfrica Volunteer Program – Morocco",
    desc: "A 10-month volunteer program for young Moroccans to serve rural communities, co-creating sustainable projects with training and support.",
    eventImage:
      "https://res.cloudinary.com/dghbzamnp/image/upload/v1741745466/opportunities/covers/yef70j8mfg4djypru7ny.jpg",
    userInfo: [{ profile_picture: "/images/default_user.jpg" }],
    sponsored: true,
    type_of_event: "volunteer",
    tickets: [],
    community_service_offered: 25,
    date_of_events: "2025-05-05 to 2025-05-10",
    eventMode: "physical",
    locationName: "Oujda, Morocco",
    teacher_id: null,
    associationId: "assoc_36",
    additional: "allowAll",
  },
  {
    _id: "event_37",
    title:
      "Moroccan Youth Council for Diplomatic and International Cooperation",
    desc: "An initiative engaging young Moroccans globally to support Morocco’s diplomatic efforts, promoting unity and international relations.",
    eventImage:
      "https://res.cloudinary.com/dghbzamnp/image/upload/v1741731310/opportunities/covers/vxlmmdheingmqv5w2ds5.jpg",
    userInfo: [{ profile_picture: "/images/default_user.jpg" }],
    sponsored: true,
    type_of_event: "membership",
    tickets: [],
    community_service_offered: 10,
    date_of_events: "2025-07-20 to 2025-07-25",
    eventMode: "hybrid",
    locationName: "Rabat, Morocco",
    teacher_id: null,
    associationId: "assoc_37",
    additional: "allowAll",
  },
  {
    _id: "event_38",
    title: "Digital Energy Challenge 2025",
    desc: "A challenge to develop digital solutions for energy access and renewable energy integration in Africa, co-funded by the EU, AFD, and ADEME.",
    eventImage:
      "https://res.cloudinary.com/dghbzamnp/image/upload/v1741729553/opportunities/covers/mfwv4tgrxxj4eq5yfy1z.jpg",
    userInfo: [{ profile_picture: "/images/default_user.jpg" }],
    sponsored: true,
    type_of_event: "competition",
    tickets: [],
    community_service_offered: 0,
    date_of_events: "2025-06-25 to 2025-06-30",
    eventMode: "hybrid",
    locationName: "Addis Ababa, Ethiopia",
    teacher_id: null,
    associationId: "assoc_38",
    additional: "allowAll",
  },
  {
    _id: "event_39",
    title:
      "UNICEF Venture Fund: Equity-Free Funding Opportunity for Fem Tech Solutions",
    desc: "The UNICEF Venture Fund offers up to $100K in equity-free funding for startups using AI, data science, or blockchain to improve women’s and girls’ healthcare and economic participation.",
    eventImage:
      "https://res.cloudinary.com/dghbzamnp/image/upload/v1741556213/opportunities/covers/xmpbjimqmhohmjgacein.jpg",
    userInfo: [{ profile_picture: "/images/default_user.jpg" }],
    sponsored: true,
    type_of_event: "grant",
    tickets: [],
    community_service_offered: 0,
    date_of_events: "2025-05-15 to 2025-05-20",
    eventMode: "hybrid",
    locationName: "Geneva, Switzerland",
    teacher_id: null,
    associationId: "assoc_39",
    additional: "allowAll",
  },
  {
    _id: "event_40",
    title: "[Fully Funded] COP30 preparation and mobilization program",
    desc: "A program empowering Global South youth to participate in COP30 in Brazil, with training in climate negotiations, science, and justice.",
    eventImage:
      "https://res.cloudinary.com/dghbzamnp/image/upload/v1741295543/opportunities/covers/dekbtzibmavddlroosst.jpg",
    userInfo: [{ profile_picture: "/images/default_user.jpg" }],
    sponsored: true,
    type_of_event: "conference",
    tickets: [{ price: "0", currency: "BRL" }],
    community_service_offered: 5,
    date_of_events: "2025-11-05 to 2025-11-21",
    eventMode: "physical",
    locationName: "Belém, Brazil",
    teacher_id: null,
    associationId: "assoc_40",
    additional: "allowAll",
  },
  {
    _id: "event_41",
    title: "Elles Tech Tour 2025",
    desc: "La French Tech Maroc’s Elles Tech Tour promotes women in tech across five Moroccan cities, offering coaching and a tour of French Tech communities.",
    eventImage:
      "https://res.cloudinary.com/dghbzamnp/image/upload/v1741281989/opportunities/covers/erc5ahcbtgyfdtjsois1.jpg",
    userInfo: [{ profile_picture: "/images/default_user.jpg" }],
    sponsored: true,
    type_of_event: "workshop",
    tickets: [{ price: "0", currency: "MAD" }],
    community_service_offered: 5,
    date_of_events: "2025-04-01 to 2025-04-30",
    eventMode: "physical",
    locationName: "Casablanca, Morocco",
    teacher_id: null,
    associationId: "assoc_41",
    additional: "allowAll",
  },
  {
    _id: "event_42",
    title: "2nd Eco-Campus International Conference 2025",
    desc: "A conference in Kuala Lumpur discussing the role of higher education in sustainable development, fostering multi-disciplinary collaborations for eco-friendly practices.",
    eventImage:
      "https://res.cloudinary.com/dghbzamnp/image/upload/v1741139938/opportunities/covers/dvdzvbm7nhzprgdifyhk.jpg",
    userInfo: [{ profile_picture: "/images/default_user.jpg" }],
    sponsored: true,
    type_of_event: "conference",
    tickets: [{ price: "150", currency: "MYR" }],
    community_service_offered: 5,
    date_of_events: "2025-09-18 to 2025-09-20",
    eventMode: "physical",
    locationName: "Kuala Lumpur, Malaysia",
    teacher_id: null,
    associationId: "assoc_42",
    additional: "allowAll",
  },
  {
    _id: "event_43",
    title: "Scholarships for International Students in Japan",
    desc: "Scholarships from the Japanese Government, JASSO, and private foundations support international students with tuition, living expenses, and travel for studies in Japan.",
    eventImage:
      "https://res.cloudinary.com/dghbzamnp/image/upload/v1741006370/opportunities/covers/ulck2qu6pzgakb8uf7k5.jpg",
    userInfo: [{ profile_picture: "/images/default_user.jpg" }],
    sponsored: true,
    type_of_event: "scholarship",
    tickets: [],
    community_service_offered: 0,
    date_of_events: "2025-06-10 to 2025-06-15",
    eventMode: "hybrid",
    locationName: "Tokyo, Japan",
    teacher_id: null,
    associationId: "assoc_43",
    additional: "allowAll",
  },
  {
    _id: "event_44",
    title: "Ro'wad Al Shabab Al Arabi (Arab Youth Pioneers)",
    desc: "An initiative honoring 100 young Arab leaders under 35 for their contributions to leadership, innovation, and social impact, fostering a better future.",
    eventImage:
      "https://res.cloudinary.com/dghbzamnp/image/upload/v1740960206/opportunities/covers/t3ycfbg6han9yx2xkurt.jpg",
    userInfo: [{ profile_picture: "/images/default_user.jpg" }],
    sponsored: true,
    type_of_event: "award",
    tickets: [],
    community_service_offered: 0,
    date_of_events: "2025-05-25 to 2025-05-30",
    eventMode: "physical",
    locationName: "Dubai, UAE",
    teacher_id: null,
    associationId: "assoc_44",
    additional: "allowAll",
  },
];

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

const Event = () => {
  const router = useRouter();
  const { eventStatus } = useContext(ModalContext);
  const [open, setOpen] = eventStatus;
  const [data, setData] = useState("");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const { t } = useTranslation("common");
  const [location, setLocation] = useState("");
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [locationName, setLocationName] = useState("");

  useEffect(() => {
    addRoutePath("title", title);
  }, [title]);

  useEffect(() => {
    const handleScroll = () => {
      const banner = document.querySelector(`.${style.banner}`);
      if (banner) {
        const scroll = window.scrollY;
        banner.style.setProperty("--scroll", scroll);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (localStorage.getItem("userInfo")) {
      setData(JSON.parse(localStorage.getItem("userInfo")));
    }
  }, []);

  function addRoutePath(route, value) {
    router.push(
      {
        query: {
          ...router.query,
          [route]: value,
        },
      },
      undefined,
      {
        shallow: true,
      }
    );
  }

  useEffect(() => {
    async function getUserData(title) {
      try {
        const response = await fetch("/api/events/search_events", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: title,
            school:
              JSON.parse(localStorage?.getItem("userInfo"))?.schoolId || "null",
            location: location || null,
            locationName: locationName || null,
          }),
        });

        if (response.ok) {
          const result = await response.json();
          setEvents([...(result.tutors || []), ...hardcodedEvents]);
        } else {
          setEvents(hardcodedEvents);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
        setEvents(hardcodedEvents);
      } finally {
        setLoading(false);
      }
    }
    getUserData(title);
  }, [title, location]);

  useEffect(() => {
    if (localStorage && localStorage.getItem("userInfo")) {
      const initializeOneSignal = async () => {
        try {
          await OneSignal.init({
            appId: "3b28d10b-3b88-426f-8025-507667803b2a",
            safari_web_id:
              "web.onesignal.auto.65a2ca34-f112-4f9d-a5c6-253c0b61cb9f",
            notifyButton: {
              enable: false,
            },
            promptOptions: {
              slidedown: {
                prompts: [
                  {
                    type: "push",
                    autoPrompt: true,
                    text: {
                      actionMessage:
                        "Stay updated on the latest opportunities: Allow notifications!",
                      acceptButton: "Allow",
                      cancelButton: "Cancel",
                    },
                    delay: {
                      pageViews: 1,
                      timeDelay: 20,
                    },
                  },
                ],
              },
            },
            allowLocalhostAsSecureOrigin: true,
          });

          const userInfo = JSON.parse(localStorage.getItem("userInfo"));
          if (userInfo && userInfo.schoolId) {
            await OneSignal.login(userInfo._id);
            if (userInfo.email) {
              OneSignal.User.addEmail(userInfo.email);
            }
            OneSignal.User.addTags({ schoolId: userInfo.schoolId });
          }
        } catch (error) {
          console.error("Error initializing OneSignal:", error);
        }
      };

      initializeOneSignal();

      const askForNotificationPermission = async () => {
        try {
          await OneSignal.showSlidedownPrompt();
        } catch (error) {
          console.error("Error requesting notification permission:", error);
        }
      };

      const containerElement = document.getElementById("container");
      if (containerElement) {
        containerElement.addEventListener(
          "click",
          askForNotificationPermission
        );
      }

      return () => {
        if (containerElement) {
          containerElement.removeEventListener(
            "click",
            askForNotificationPermission
          );
        }
      };
    }
  }, [router]);

  const showPosition = async (position) => {
    setLocation([position.coords.latitude, position.coords.longitude]);
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}`;
    const response = await fetch(url);
    const data = await response.json();
    setLocationName(
      `${data.address.town ? `${data.address.town},` : ""} ${
        data.address.country
      }`
    );
    setInput(
      `${data.address.town ? `${data.address.town},` : ""} ${
        data.address.country
      }`
    );
  };

  const handleSuggestionClick = (suggestion) => {
    setInput(suggestion.label);
    setLocation([suggestion.lat, suggestion.lon]);
    setLocationName(suggestion.label);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleChangeLocation = (e) => {
    const value = e.target.value;
    setInput(value);
    if (value.length > 2) {
      fetchLocations(value);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const fetchLocations = async (query) => {
    if (!query) {
      setSuggestions([]);
      return;
    }
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      query
    )}`;
    const response = await fetch(url);
    const data = await response.json();
    setSuggestions(
      data.map((item) => ({
        label: item.display_name,
        lat: item.lat,
        lon: item.lon,
      }))
    );
  };

  return (
    <div id="container" className={style.container}>
      <Head>
        <title>NoteSwap | Events</title>
        <meta
          name="description"
          content="Discover amazing events and opportunities on NoteSwap."
        />
      </Head>
      <CreateEvent business={false} meeting={false} />

      <main className={style.main}>
        <div className={style.banner}>
          <h1 className={style.title}>Discover Opportunities</h1>
          <section className={style.search}>
            <FaSearch className={style.searchIcon} aria-hidden="true" />
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={style.searchInput}
              placeholder={t("search_opportunities")}
              autoFocus
              aria-label={t("search_opportunities")}
            />
          </section>
          <div className={style.filters}>
            <div className={style.locationWrapper}>
              <input
                type="text"
                className={style.locationInput}
                value={input}
                onChange={handleChangeLocation}
                placeholder={t("enter_location")}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                onFocus={() => input && setShowSuggestions(true)}
                aria-label={t("enter_location")}
              />
              {showSuggestions && suggestions.length > 0 && (
                <ul className={style.suggestions}>
                  {suggestions.map((suggestion, index) => (
                    <li
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className={style.suggestionItem}
                      role="option"
                      aria-selected="false"
                    >
                      {suggestion.label}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <button
              onClick={() =>
                navigator.geolocation.getCurrentPosition(showPosition)
              }
              className={style.filterButton}
              aria-label={t("use_current_location")}
            >
              {t("current_location")}
            </button>
            <button
              onClick={() => {
                setLocationName("Online");
                setLocation("Online");
                setInput("Online");
              }}
              className={style.filterButton}
              aria-label={t("online")}
            >
              {t("online")}
            </button>
          </div>
        </div>

        <section className={style.events}>
          {loading ? (
            <div className={style.loading}>
              <LoadingCircle />
              <h2>{t("loading")}</h2>
            </div>
          ) : events.length === 0 ? (
            <div className={style.noEvents}>
              <h3>{t("no_events")}</h3>
            </div>
          ) : (
            <>
              <p className={style.results}>
                {events.length} {t("result")}
                {events.length === 1 ? "" : "s"} {t("found")}
              </p>
              <div className={style.eventGrid}>
                {events.map((event) => (
                  <EventCard key={event._id} data={event} />
                ))}
              </div>
            </>
          )}
        </section>
      </main>

      {data?.role === "teacher" && (
        <button
          onClick={() => setOpen(true)}
          className={style.createEventButton}
          aria-label={t("create_new_event")}
          title={t("create_new_event")}
        >
          <FaPlus size={24} />
          <span>{t("create_new_event")}</span>
        </button>
      )}
    </div>
  );
};

export default Event;
