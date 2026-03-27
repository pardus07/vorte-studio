import ProspectSearch from "./prospect-search";

// Mock prospect data — gerçek scraper entegrasyonu production'da
const mockProspects = [
  {
    id: "mp1", name: "Güneş Diş Kliniği", phone: "0242 321 XX XX", website: null,
    address: "Muratpaşa, Antalya", googleRating: 4.7, googleReviews: 128,
    googleMapsUrl: "#", mobileScore: null, hasWebsite: false, score: 92,
    issue: "Site yok", addedToLeads: false,
  },
  {
    id: "mp2", name: "Dentaplus Ağız", phone: "0242 248 XX XX", website: "dentaplus.com.tr",
    address: "Konyaaltı, Antalya", googleRating: 4.3, googleReviews: 67,
    googleMapsUrl: "#", mobileScore: 23, hasWebsite: true, score: 75,
    issue: "Mobil 23/100", addedToLeads: false,
  },
  {
    id: "mp3", name: "Smile Center", phone: "0242 502 XX XX", website: "smilecenter.com",
    address: "Muratpaşa, Antalya", googleRating: 4.9, googleReviews: 312,
    googleMapsUrl: "#", mobileScore: 45, hasWebsite: true, score: 60,
    issue: "Mobil 45/100", addedToLeads: true,
  },
  {
    id: "mp4", name: "Antalya Implant", phone: "0242 316 XX XX", website: "antalyaimplant.com",
    address: "Kepez, Antalya", googleRating: 4.1, googleReviews: 24,
    googleMapsUrl: "#", mobileScore: null, hasWebsite: true, score: 35,
    issue: "SSL yok", addedToLeads: false,
  },
  {
    id: "mp5", name: "Özel Dent", phone: null, website: null,
    address: "Döşemealtı, Antalya", googleRating: 3.8, googleReviews: 11,
    googleMapsUrl: "#", mobileScore: null, hasWebsite: false, score: 40,
    issue: "Site yok", addedToLeads: false,
  },
  {
    id: "mp6", name: "AkDent Kliniği", phone: "0242 444 XX XX", website: "akdent.com.tr",
    address: "Muratpaşa, Antalya", googleRating: 4.5, googleReviews: 89,
    googleMapsUrl: "#", mobileScore: 72, hasWebsite: true, score: 15,
    issue: "Düşük öncelik", addedToLeads: false,
  },
];

export default function ProspectPage() {
  return (
    <ProspectSearch
      initialProspects={mockProspects}
      batchInfo={{ query: "Diş Klinikleri in Antalya", totalFound: mockProspects.length }}
    />
  );
}
