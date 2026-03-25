// CHR Brand Map
const CHR_BRANDS = {
  LHR: { name: "Heathrow Parking",   slug: "heathrowparking" },
  LGW: { name: "Gatwick Parking",    slug: "gatwickparking" },
  MAN: { name: "Manchester Parking", slug: "manchesterairport" },
  STN: { name: "Stansted Parking",   slug: "stanstedparking" },
  LTN: { name: "Luton Parking",      slug: "lutonparking" },
  BHX: { name: "Birmingham Parking", slug: "birminghamairport" },
  EDI: { name: "Edinburgh Parking",  slug: "edinburghairport" },
  BRS: { name: "Bristol Parking",    slug: "bristolairport" },
  NCL: { name: "Newcastle Parking",  slug: "newcastleairport" },
  LBA: { name: "Leeds Bradford Parking", slug: "leedsbradfordairport" },
};

const DEFAULT_BRAND = { name: "Birmingham Parking", slug: "birminghamairport" };

// Date helper
function datePlus(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}

// Initialize
function init() {
  // Get brand from URL
  const urlParams = new URLSearchParams(window.location.search);
  const depart = (urlParams.get("Location") || urlParams.get("location") || "BHX").toUpperCase();
  const brand = CHR_BRANDS[depart] || DEFAULT_BRAND;

  // Set brand identity
  document.title = `${brand.name} - Meet & Greet Parking`;
  document.getElementById("headerTitle").textContent = brand.name;

  // Set logo
  const logoUrl = `https://s3.amazonaws.com/theme-media/img/brand/${brand.slug}-icon.png`;
  const logoEl = document.getElementById("brandLogo");
  logoEl.src = logoUrl;
  logoEl.alt = brand.name;
  logoEl.onerror = () => {
    logoEl.src = "https://s3.amazonaws.com/theme-media/img/brand/heathrowparking-icon.png";
  };

  // Pre-fill dates
  const defaultOutDate = datePlus(1);
  const defaultInDate = datePlus(9);
  document.getElementById("outDate").value = defaultOutDate;
  document.getElementById("inDate").value = defaultInDate;

  // Track manual changes to inDate
  let inDateManuallyChanged = false;
  document.getElementById("inDate").addEventListener("change", () => {
    inDateManuallyChanged = true;
  });

  // Auto-recalculate inDate when outDate changes (unless manually changed)
  document.getElementById("outDate").addEventListener("change", (e) => {
    if (!inDateManuallyChanged) {
      const outDate = new Date(e.target.value);
      outDate.setDate(outDate.getDate() + 8);
      document.getElementById("inDate").value = outDate.toISOString().split("T")[0];
    }
  });

  // Form submission
  document.getElementById("searchForm").addEventListener("submit", handleSubmit);
}

function handleSubmit(e) {
  e.preventDefault();

  const urlParams = new URLSearchParams(window.location.search);
  const agent = urlParams.get("agent") || "WY992";
  const adcode = urlParams.get("adcode") || "";
  const promotionCode = urlParams.get("promotionCode") || "";
  const flight = urlParams.get("flight") || "default";

  // Get form values
  const outDate = document.getElementById("outDate").value;
  const inDate = document.getElementById("inDate").value;
  const outTime = document.getElementById("outTime").value.replace(":", "%3A");
  const inTime = document.getElementById("inTime").value.replace(":", "%3A");

  // Get airport code from URL or default to BHX
  const depart = (urlParams.get("Location") || urlParams.get("location") || "BHX").toUpperCase();

  // Domain resolution for CHR
  const host = window.location.host;
  const isLocal = host.startsWith("127") || host.includes("github.io");
  const basedomain = isLocal ? "www.holidayextras.com" : host;

  // Assemble search URL with meet and greet filter
  const searchUrl = `https://${basedomain}/static/?selectProduct=cp&#/categories?agent=${agent}&ppts=&customer_ref=&lang=en&adults=2&depart=${depart}&terminal=&arrive=&flight=${flight}&in=${inDate}&out=${outDate}&park_from=${outTime}&park_to=${inTime}&filter_meetandgreet=Y&filter_parkandride=&children=0&infants=0&redirectReferal=carpark&from_categories=true&adcode=${adcode}&promotionCode=${promotionCode}`;

  window.location.href = searchUrl;
}

// Initialize on load
document.addEventListener("DOMContentLoaded", init);
