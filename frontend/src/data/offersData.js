/**
 * Cherry Gold Interiors - Centralized Offers Data
 * 
 * AUTOMATIC HISTORY LOGIC:
 * - `isActive: true` wala offer automatically "Current Active Offer" banta hai.
 * - Pichle sabhi offers automatically "Previous Offers & Archive (History)" section me shift ho jate hain.
 */

export const allOffersList = [
  // 🌟 1. CURRENT ACTIVE OFFER: BIG HOME INTERIOR OFFER
  {
    id: 'big-home-interior-offer-2026',
    title: 'BIG HOME INTERIOR OFFER',
    monthWord: 'BIG HOME',
    brandPrefix: 'CHERRY GOLD INTERIORS',
    subtitle: 'Complete your home interiors & get a FREE GIFT!',
    tagline: '✨ More you invest in your dream home, bigger your FREE gift!',
    period: '31st October 2026',
    startDate: '2026-09-26T00:00:00+05:30',
    endDate: '2026-10-31T23:59:59+05:30',
    category: 'Festive',
    season: 'Mega Interior Bonanza',
    isActive: true, // 👈 Currently Active Offer
    tier: 'All Interior Bookings',
    reward: 'Free 55" Samsung Smart TV, 1.5 Ton AC, 2000L Refrigerator, Faber Chimney or Surprise Gift',
    worth: 'Up to Rs.65,000 in FREE GIFTS',
    img: '/images/tv-55.jpg',
    description: 'Complete your dream home interiors with Cherry Gold Interiors and unlock assured luxury appliances & gifts for every booking bracket.',
    underSixLakhGift: {
      title: '🎁 Under ₹6 Lakh? You still get a SURPRISE GIFT! 🎉',
      desc: 'Possible gifts include: Geyser 🚿, Microwave Oven 🍿, Air Fryer 🍟 & other surprise luxury gifts!',
      items: ['Geyser 🚿', 'Microwave Oven 🍿', 'Air Fryer 🍟', 'Surprise Home Gifts 🎁']
    },
    terms: 'Terms & conditions apply. Gift models/brands are subject to availability. Offer applicable on eligible interior packages and confirmed bookings.',
    benefits: [
      '💰 ₹6 Lakh+ : 🍳 Faber Chimney — FREE',
      '💰 ₹8 Lakh+ : ❄️ 2000L Refrigerator — FREE',
      '💰 ₹10 Lakh+ : ❄️ 1.5 Ton AC — FREE',
      '💰 ₹12.5 Lakh+ : 📺 55" Samsung Smart TV — FREE',
      '🎁 Under ₹6 Lakh : 🎉 Assured Surprise Gift (Geyser / Microwave / Air Fryer)'
    ],
    packages: [
      {
        tier: '₹6 Lakh+',
        amount: '₹6,00,000 Onwards',
        reward: '🍳 Faber Chimney — FREE',
        note: 'Auto-Clean High Suction Kitchen Chimney',
        img: '/images/chimney.jpg',
        glow: 'rgba(201,168,76,0.35)',
        featured: false,
        badge: 'Kitchen Upgrade',
      },
      {
        tier: '₹8 Lakh+',
        amount: '₹8,00,000 Onwards',
        reward: '❄️ 2000L Refrigerator — FREE',
        note: 'Frost-Free Double Door Refrigerator',
        img: '/images/fridge.jpg',
        glow: 'rgba(201,168,76,0.4)',
        featured: false,
        badge: 'Home Upgrade',
      },
      {
        tier: '₹10 Lakh+',
        amount: '₹10,00,000 Onwards',
        reward: '❄️ 1.5 Ton AC — FREE',
        note: '5-Star High Efficiency Inverter Split AC',
        img: '/images/ac.jpg',
        glow: 'rgba(212,175,55,0.45)',
        featured: false,
        badge: 'Luxury Comfort',
      },
      {
        tier: '₹12.5 Lakh+',
        amount: '₹12,50,000 Onwards',
        reward: '📺 55" Samsung Smart TV — FREE',
        note: 'Crystal 4K Ultra HD Samsung Smart TV',
        img: '/images/tv-55.jpg',
        glow: 'rgba(245,215,124,0.55)',
        featured: true,
        badge: 'Mega Gift',
      },
      {
        tier: 'Under ₹6 Lakh',
        amount: 'Up to ₹5.99L',
        reward: '🎁 Surprise Gift 🎉',
        note: 'Geyser 🚿 | Microwave Oven 🍿 | Air Fryer 🍟',
        img: '/images/surprise-gift.jpg',
        glow: 'rgba(245,215,124,0.3)',
        featured: false,
        badge: 'Assured Gift',
      },
    ]
  },

  // 📜 2. PAST OFFERS (AUTOMATICALLY SHIFTED TO HISTORY ARCHIVE)
  {
    id: 'september-2026',
    title: 'The September Privilege',
    monthWord: 'SEPTEMBER',
    subtitle: 'Exclusive Interior Benefits, Curated for You.',
    period: '01 Sep 2026 - 15 Sep 2026',
    startDate: '2026-09-01T00:00:00+05:30',
    endDate: '2026-09-15T23:59:59+05:30',
    category: 'Seasonal',
    season: 'Autumn Privilege',
    isActive: false, // 👈 Moved to Past Offers Archive
    tier: 'Rs.7 Lakh Onwards',
    reward: 'Free Samsung Smart TV (43" / 55")',
    worth: 'Worth Rs.50,000 FREE',
    img: '/images/tv-55.jpg',
    description: 'Elevate your home this September with Cherry Gold Interiors. Received a complimentary brand new Samsung Smart TV with qualifying quotations.',
    benefits: [
      '43" Samsung Smart TV on bookings Rs.7L onwards',
      '55" Ultra HD Samsung Smart TV on bookings Rs.10L onwards',
      'Original Manufacturer Warranty Included',
      'Free 3D Design Preview & Site Inspection'
    ]
  },
  {
    id: 'diwali-2025',
    title: 'Grand Diwali & Dhanteras Mahotsav',
    period: '10 Oct 2025 - 15 Nov 2025',
    startDate: '2025-10-10T00:00:00+05:30',
    endDate: '2025-11-15T23:59:59+05:30',
    category: 'Festive',
    season: 'Diwali Festive',
    isActive: false,
    tier: 'Rs.8 Lakh Onwards',
    reward: 'Free Modular Kitchen Chimney + Hob & 10g Silver Coin',
    worth: 'Worth Rs.48,000 FREE',
    img: '/images/chimney.jpg',
    description: 'Exclusive festive celebration package for homeowners starting interiors before Diwali. Delivered complete with Faber auto-clean chimney and 3-burner brass hob.',
    benefits: [
      'Faber Auto-Clean 1200 m³/hr Chimney',
      'Faber 3-Burner Toughened Glass Hob',
      'BIS Hallmarked 10g Pure Silver Coin',
      'Complimentary 3D Lighting Blueprint'
    ]
  },
  {
    id: 'monsoon-2025',
    title: 'Monsoon Home Refresh & Luxury Comfort',
    period: '01 Jul 2025 - 15 Aug 2025',
    startDate: '2025-07-01T00:00:00+05:30',
    endDate: '2025-08-15T23:59:59+05:30',
    category: 'Seasonal',
    season: 'Monsoon Special',
    isActive: false,
    tier: 'Rs.12 Lakh Onwards',
    reward: 'Daikin 1.5 Ton 5-Star AC or Italian Leatherette Recliner',
    worth: 'Worth Rs.55,000 FREE',
    img: '/images/ac.jpg',
    description: 'Engineered for full 3BHK and villa projects. Clients received either a 5-Star Inverter AC or a motorized plush single-seater recliner sofa with anti-moisture warranty.',
    benefits: [
      'Daikin 1.5 Ton 5-Star Inverter AC (Copper)',
      'Option for Motorized Italian Recliner Sofa',
      'Termite & Boiling Water Proof (BWP) Upgrade',
      'Free Complete Pre-Monsoon Site Inspection'
    ]
  },
  {
    id: 'akshaya-2025',
    title: 'Akshaya Tritiya Shubh Aarambh Privilege',
    period: '15 Apr 2025 - 10 May 2025',
    startDate: '2025-04-15T00:00:00+05:30',
    endDate: '2025-05-10T23:59:59+05:30',
    category: 'Auspicious',
    season: 'Gold Celebration',
    isActive: false,
    tier: 'Rs.9.5 Lakh Onwards',
    reward: 'Guaranteed 24K Pure Gold Coin (5g) + Backlit Mandir Jali',
    worth: 'Worth Rs.42,000 FREE',
    img: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=700&q=80',
    description: 'Honoring auspicious beginnings for new Griha Pravesh. Included guaranteed BIS certified gold coin plus customized laser CNC backlit pooja room partitions.',
    benefits: [
      '5g 24K Pure Gold Coin (Certified BIS)',
      'Custom Backlit CNC Corian Mandir Jali',
      'Vastu Compliant Layout Architecture',
      'Complimentary Brass Designer Handles'
    ]
  },
  {
    id: 'newyear-2025',
    title: 'New Year Grand Smart-Living Makeover',
    period: '20 Dec 2024 - 15 Jan 2025',
    startDate: '2024-12-20T00:00:00+05:30',
    endDate: '2025-01-15T23:59:59+05:30',
    category: 'Festive',
    season: 'New Year Special',
    isActive: false,
    tier: 'Rs.6.5 Lakh Onwards',
    reward: 'Full Home Smart Automation Kit + Magnetic Track Lights',
    worth: 'Worth Rs.38,000 FREE',
    img: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=700&q=80',
    description: 'Welcoming the New Year with modern living. Included Wi-Fi smart touch switchboards, Alexa voice integration and elegant false ceiling magnetic lighting layout.',
    benefits: [
      'Smart Touch Switchboards (Alexa/Google)',
      'Magnetic Concealed Track Light Fixtures',
      'Complimentary Amazon Echo Show 8 Hub',
      'App-Controlled Living Room Mood Presets'
    ]
  },
  {
    id: 'summer-2025',
    title: 'Summer Villa & Master Suite Privilege',
    period: '01 Mar 2025 - 10 Apr 2025',
    startDate: '2025-03-01T00:00:00+05:30',
    endDate: '2025-04-10T23:59:59+05:30',
    category: 'Seasonal',
    season: 'Luxury Suite',
    isActive: false,
    tier: 'Rs.15 Lakh Onwards',
    reward: 'Floor-to-Ceiling Lacquered Glass Wardrobe with Sensor LEDs',
    worth: 'Worth Rs.75,000 FREE',
    img: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=700&q=80',
    description: 'Premium master bedroom package for luxury apartments and duplex villas. Included ultra-modern aluminium profile tinted glass wardrobe shutters.',
    benefits: [
      'Lacquered Fluted Glass Wardrobe Shutters',
      'Motion Sensor Internal Strip Lighting',
      'Soft-Close Blum (Austria) Hardware',
      'Velvet Finish Jewellery & Watch Organizers'
    ]
  }
];

export function getActiveOffer() {
  const active = allOffersList.find(o => o.isActive === true);
  return active || allOffersList[0];
}

export function getPastOffersList() {
  const activeOffer = getActiveOffer();
  return allOffersList.filter(o => o.id !== activeOffer?.id);
}
