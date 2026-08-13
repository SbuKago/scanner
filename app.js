(function () {
  "use strict";

  const STORAGE_KEYS = {
    products: "dispatch_product_master",
    loading: "dispatch_loading_records",
    problems: "dispatch_barcode_problems",
    session: "dispatch_session"
  };

  const AUTHORIZED_USERS = ["Sibusiso Makhonjwa", "Afection", "Boitumelo"];

  const FULL_PRODUCT_MASTER = [
    { productCode: "413817", outerBarcode: "#N/A", barcode: "6009211225657", description: "Lentil & Quinoa Pop Chips – Creamy Cheddar", packSize: "85 g", sellBy: "112", bbDate: "98", casesPerPallet: "32", unitsPerCase: "12", unitsPerOuter: "#N/A" },
    { productCode: "413807", outerBarcode: "#N/A", barcode: "6009207314334", description: "Lentil & Quinoa Pop Chips – Creamy Cheddar", packSize: "20 g", sellBy: "112", bbDate: "98", casesPerPallet: "70", unitsPerCase: "20", unitsPerOuter: "#N/A" },
    { productCode: "413816", outerBarcode: "#N/A", barcode: "6009211225640", description: "Lentil & Quinoa Pop Chips – BBQ", packSize: "85 g", sellBy: "112", bbDate: "98", casesPerPallet: "32", unitsPerCase: "12", unitsPerOuter: "#N/A" },
    { productCode: "413808", outerBarcode: "#N/A", barcode: "6009207314341", description: "Lentil & Quinoa Pop Chips – BBQ", packSize: "20 g", sellBy: "112", bbDate: "98", casesPerPallet: "70", unitsPerCase: "20", unitsPerOuter: "#N/A" },
    { productCode: "413819", outerBarcode: "#N/A", barcode: "6009223668152", description: "Lentil & Quinoa Pop Chips – Sour Cream and Chives", packSize: "85 g", sellBy: "112", bbDate: "98", casesPerPallet: "32", unitsPerCase: "12", unitsPerOuter: "#N/A" },
    { productCode: "410810", outerBarcode: "6005000288865", barcode: "6005000288865", description: "HCC Sea Salt 50g", packSize: "50g", sellBy: "112", bbDate: "71", casesPerPallet: "42", unitsPerCase: "24", unitsPerOuter: "24 / Outer Case67424" },
    { productCode: "410808", outerBarcode: "6009184110455", barcode: "6009184110455", description: "HCC Sea Salt 125g", packSize: "125g", sellBy: "84", bbDate: "71", casesPerPallet: "20", unitsPerCase: "26", unitsPerOuter: "26 / Outer Case5420" },
    { productCode: "410807", outerBarcode: "6009184110462", barcode: "6009184110462", description: "HCC Sea Salt & Black Pepper 125g", packSize: "125g", sellBy: "84", bbDate: "119", casesPerPallet: "20", unitsPerCase: "26", unitsPerOuter: "26 / Outer Case5420" },
    { productCode: "410811", outerBarcode: "6005000895865", barcode: "6005000895865", description: "HCC Sea Salt & Black Pepper 50g", packSize: "50g", sellBy: "106", bbDate: "119", casesPerPallet: "42", unitsPerCase: "24", unitsPerOuter: "24 / Outer Case67424" },
    { productCode: "410806", outerBarcode: "6009184110479", barcode: "6009184110479", description: "HCC Sour Cream & Chives 125g", packSize: "125g", sellBy: "106", bbDate: "119", casesPerPallet: "20", unitsPerCase: "26", unitsPerOuter: "26 / Outer Case5420" },
    { productCode: "410812", outerBarcode: "6009184110486", barcode: "6009184110486", description: "HCC Rosemary & Sea Salt 125g", packSize: "125g", sellBy: "106", bbDate: "119", casesPerPallet: "20", unitsPerCase: "26", unitsPerOuter: "26 / Outer Case5420" },
    { productCode: "410819", outerBarcode: "6009214098296", barcode: "6009214098296", description: "HCC Rottisserie Chicken 125g", packSize: "125g", sellBy: "106", bbDate: "119", casesPerPallet: "20", unitsPerCase: "26", unitsPerOuter: "26 / Outer Case5420" },
    { productCode: "410809", outerBarcode: "6009226480089", barcode: "6009226480089", description: "HCC roast lamb & rosemary flavoured 125g", packSize: "125g", sellBy: "106", bbDate: "119", casesPerPallet: "20", unitsPerCase: "26", unitsPerOuter: "26 / Outer Case5420" },
    { productCode: "410820", outerBarcode: "6009226451577", barcode: "6009226451577", description: "HCC sea salt & white balsamic vinegar flavoured 50g", packSize: "50g", sellBy: "106", bbDate: "119", casesPerPallet: "42", unitsPerCase: "24", unitsPerOuter: "24 / Outer Case67424" },
    { productCode: "410802", outerBarcode: "6009226478611", barcode: "6009226478611", description: "HCC sea salt & white balsamic vinegar flavoured 125g", packSize: "125g", sellBy: "106", bbDate: "119", casesPerPallet: "20", unitsPerCase: "26", unitsPerOuter: "26 / Outer Case5420" },
    { productCode: "410801", outerBarcode: "6009226462993", barcode: "6009226462993", description: "HCC sriracha flavoured 125g", packSize: "125g", sellBy: "106", bbDate: "119", casesPerPallet: "20", unitsPerCase: "26", unitsPerOuter: "26 / Outer Case5420" },
    { productCode: "410827", outerBarcode: "6009245410159", barcode: "6009245410159", description: "HCC Parmesan &Truffle 125g", packSize: "125g", sellBy: "106", bbDate: "119", casesPerPallet: "20", unitsPerCase: "26", unitsPerOuter: "26 / Outer Case5420" },
    { productCode: "410823", outerBarcode: "6009245410104", barcode: "6009245410104", description: "HCC Sweet & Sticky Chilli 50g", packSize: "50g", sellBy: "106", bbDate: "119", casesPerPallet: "42", unitsPerCase: "24", unitsPerOuter: "24 / Outer Case67424" },
    { productCode: "410824", outerBarcode: "6009245410111", barcode: "6009245410111", description: "HCC Sweet & Sticky Chilli 125g", packSize: "125g", sellBy: "106", bbDate: "119", casesPerPallet: "20", unitsPerCase: "26", unitsPerOuter: "26 / Outer Case5420" },
    { productCode: "410821", outerBarcode: "6009245410081", barcode: "6009245410081", description: "HCC Dijon Mustard 50g", packSize: "50g", sellBy: "106", bbDate: "119", casesPerPallet: "42", unitsPerCase: "24", unitsPerOuter: "24 / Outer Case67424" },
    { productCode: "410822", outerBarcode: "6009245410098", barcode: "6009245410098", description: "HCC Dijon Mustard 125g", packSize: "125g", sellBy: "106", bbDate: "119", casesPerPallet: "20", unitsPerCase: "26", unitsPerOuter: "26 / Outer Case5420" },
    { productCode: "410825", outerBarcode: "6009245410128", barcode: "6009245410128", description: "HCC Rotisserie chicken 50g", packSize: "50g", sellBy: "106", bbDate: "119", casesPerPallet: "42", unitsPerCase: "24", unitsPerOuter: "24 / Outer Case67424" },
    { productCode: "410905", outerBarcode: "6009173755049", barcode: "6009173755049", description: "HCS Sea Salt 50g", packSize: "50g", sellBy: "106", bbDate: "119", casesPerPallet: "42", unitsPerCase: "42", unitsPerOuter: "42 / Outer Case67424" },
    { productCode: "410907", outerBarcode: "6009173755087", barcode: "6009173755087", description: "HCS Sea Salt 125g", packSize: "125g", sellBy: "106", bbDate: "119", casesPerPallet: "42", unitsPerCase: "16", unitsPerOuter: "16 / Outer Case67424" },
    { productCode: "410901", outerBarcode: "6009184110417", barcode: "6009184110417", description: "HCS Sea Salt & Black Pepper 125g", packSize: "125g", sellBy: "106", bbDate: "119", casesPerPallet: "42", unitsPerCase: "16", unitsPerOuter: "16 / Outer Case67424" },
    { productCode: "410904", outerBarcode: "6009173755056", barcode: "6009173755056", description: "HCS Sour cream & Red onion 50g", packSize: "50g", sellBy: "106", bbDate: "119", casesPerPallet: "42", unitsPerCase: "42", unitsPerOuter: "42 / Outer Case67424" },
    { productCode: "410909", outerBarcode: "6009211697836", barcode: "6009211697836", description: "HCS Sour cream & Red onion 125g", packSize: "125g", sellBy: "106", bbDate: "119", casesPerPallet: "42", unitsPerCase: "16", unitsPerOuter: "16 / Outer Case67424" },
    { productCode: "410911", outerBarcode: "6009226451560", barcode: "6009226451560", description: "HCS sticky ribs with chilli flavoured 50g", packSize: "50g", sellBy: "106", bbDate: "119", casesPerPallet: "42", unitsPerCase: "42", unitsPerOuter: "42 / Outer Case67424" },
    { productCode: "410913", outerBarcode: "6009226462986", barcode: "6009226462986", description: "HCS sticky ribs with chilli flavoured 125g", packSize: "125g", sellBy: "106", bbDate: "119", casesPerPallet: "42", unitsPerCase: "16", unitsPerOuter: "16 / Outer Case67424" },
    { productCode: "410916", outerBarcode: "6009226652455", barcode: "6009226652455", description: "HCS sea salt & white balsamic vinegar flavoured 50g", packSize: "50g", sellBy: "106", bbDate: "119", casesPerPallet: "42", unitsPerCase: "42", unitsPerOuter: "42 / Outer Case67424" },
    { productCode: "410914", outerBarcode: "6009226478628", barcode: "6009226478628", description: "HCS sea salt & white balsamic vinegar flavoured 125g", packSize: "125g", sellBy: "106", bbDate: "119", casesPerPallet: "42", unitsPerCase: "16", unitsPerOuter: "16 / Outer Case67424" },
    { productCode: "410912", outerBarcode: "6009226451584", barcode: "6009226451584", description: "HCS Sour Cream & Jalapeno 125 g", packSize: "125g", sellBy: "106", bbDate: "119", casesPerPallet: "42", unitsPerCase: "16", unitsPerOuter: "16 / Outer Case67424" },
    { productCode: "410612", outerBarcode: "6009223192367", barcode: "6009223192367", description: "Prawn Cocktail mix 30 g", packSize: "30 g", sellBy: "98", bbDate: "112", casesPerPallet: "30", unitsPerCase: "48", unitsPerOuter: "48 / Outer Case65304" },
    { productCode: "410611", outerBarcode: "6009223192336", barcode: "6009223192336", description: "Prawn Cocktail mix 100 g", packSize: "100 g", sellBy: "98", bbDate: "112", casesPerPallet: "20", unitsPerCase: "20", unitsPerOuter: "20 / Outer Case54204" },
    { productCode: "410605", outerBarcode: "6009175940368", barcode: "6009175940368", description: "Prawn Cocktail 30 g", packSize: "30 g", sellBy: "98", bbDate: "112", casesPerPallet: "30", unitsPerCase: "48", unitsPerOuter: "48 / Outer Case65304" },
    { productCode: "410604", outerBarcode: "20024277", barcode: "20024277", description: "Prawn Cocktail 125 g", packSize: "125 g", sellBy: "98", bbDate: "112", casesPerPallet: "20", unitsPerCase: "20", unitsPerOuter: "20 / Outer Case54204" },
    { productCode: "410607", outerBarcode: "6009175940382", barcode: "6009175940382", description: "Streaky Crackle 30 g", packSize: "30 g", sellBy: "98", bbDate: "112", casesPerPallet: "30", unitsPerCase: "48", unitsPerOuter: "48 / Outer Case65304" },
    { productCode: "410602", outerBarcode: "6009178477823", barcode: "6009178477823", description: "Streaky Crackle 100 g", packSize: "100 g", sellBy: "98", bbDate: "112", casesPerPallet: "20", unitsPerCase: "20", unitsPerOuter: "20 / Outer Case54204" },
    { productCode: "410606", outerBarcode: "6009175940399", barcode: "6009175940399", description: "Sweet Onion Rings 75 g", packSize: "75 g", sellBy: "98", bbDate: "112", casesPerPallet: "20", unitsPerCase: "20", unitsPerOuter: "20 / Outer Case54204" },
    { productCode: "410603", outerBarcode: "6008000521604", barcode: "6008000521604", description: "Salt & Vinegar Onion Rings 75 g", packSize: "75 g", sellBy: "98", bbDate: "112", casesPerPallet: "20", unitsPerCase: "20", unitsPerOuter: "20 / Outer Case54204" },
    { productCode: "410601", outerBarcode: "6009175940580", barcode: "6009175940580", description: "Potato Fries Salt & Vinegar 125 g", packSize: "125 g", sellBy: "98", bbDate: "112", casesPerPallet: "20", unitsPerCase: "20", unitsPerOuter: "20 / Outer Case54204" },
    { productCode: "410613", outerBarcode: "6009223398301", barcode: "6009223398301", description: "Potato Fries Salt & Vinegar 30 g", packSize: "30 g", sellBy: "98", bbDate: "112", casesPerPallet: "30", unitsPerCase: "48", unitsPerOuter: "48 / Outer Case65304" },
    { productCode: "410404", outerBarcode: "6009214098241", barcode: "6009214098241", description: "Lentil Chips Sour Cream & Chives Flavoured 40 g", packSize: "40 g", sellBy: "98", bbDate: "112", casesPerPallet: "30", unitsPerCase: "45", unitsPerOuter: "45 / Outer Case65304" },
    { productCode: "410403", outerBarcode: "6009214098258", barcode: "6009214098258", description: "Lentil Chips Sour Cream & Chives Flavoured100 g", packSize: "100 g", sellBy: "98", bbDate: "112", casesPerPallet: "20", unitsPerCase: "20", unitsPerOuter: "20 / Outer Case54204" },
    { productCode: "410406", outerBarcode: "6009214098197", barcode: "6009214098197", description: "Chickpea Chips Sweet Chilli Flavoured 40 g", packSize: "40 g", sellBy: "98", bbDate: "112", casesPerPallet: "30", unitsPerCase: "45", unitsPerOuter: "45 / Outer Case65304" },
    { productCode: "410405", outerBarcode: "6009214098203", barcode: "6009214098203", description: "Chickpea Chips Sweet Chilli Flavoured 100 g", packSize: "100 g", sellBy: "98", bbDate: "112", casesPerPallet: "20", unitsPerCase: "20", unitsPerOuter: "20 / Outer Case54204" },
    { productCode: "410407", outerBarcode: "6009223567240", barcode: "6009223567240", description: "Chickpea Chips Sea Salt & Black Pepper Flavoured 100 g", packSize: "100 g", sellBy: "98", bbDate: "112", casesPerPallet: "20", unitsPerCase: "20", unitsPerOuter: "20 / Outer Case54204" },
    { productCode: "410402", outerBarcode: "6009214098265", barcode: "6009214098265", description: "Quinoa Chips BBQ Flavoured 40 g", packSize: "40 g", sellBy: "98", bbDate: "112", casesPerPallet: "30", unitsPerCase: "45", unitsPerOuter: "45 / Outer Case65304" },
    { productCode: "410401", outerBarcode: "6009214098272", barcode: "6009214098272", description: "Quinoa Chips BBQ Flavoured 100 g", packSize: "100 g", sellBy: "98", bbDate: "112", casesPerPallet: "20", unitsPerCase: "20", unitsPerOuter: "20 / Outer Case54204" },
    { productCode: "410408", outerBarcode: "6009223567257", barcode: "6009223567257", description: "Quinoa Chips Sea Salt Flavoured 100 g", packSize: "100 g", sellBy: "98", bbDate: "112", casesPerPallet: "20", unitsPerCase: "20", unitsPerOuter: "20 / Outer Case54204" },
    { productCode: "410409", outerBarcode: "6009223567264", barcode: "6009223567264", description: "Lentil Chips Creamy Cheddar Flavoured 100 g", packSize: "100 g", sellBy: "98", bbDate: "112", casesPerPallet: "20", unitsPerCase: "20", unitsPerOuter: "20 / Outer Case54204" },
    { productCode: "410614", outerBarcode: "6009214296180", barcode: "6009214296180", description: "Cocktail Mix Chip BBQ 100 g", packSize: "100 g", sellBy: "98", bbDate: "112", casesPerPallet: "20", unitsPerCase: "20", unitsPerOuter: "20 / Outer Case54204" },
    { productCode: "410610", outerBarcode: "6009223187172", barcode: "6009223187172", description: "Cocktail Mix Chip BBQ 30 g", packSize: "30 g", sellBy: "98", bbDate: "112", casesPerPallet: "30", unitsPerCase: "48", unitsPerOuter: "48 / Outer Case65354" },
    { productCode: "410617", outerBarcode: "6007875204742", barcode: "6007875204742", description: "Corn Crunch Cheddar Flavoured 100g", packSize: "100 g", sellBy: "98", bbDate: "112", casesPerPallet: "20", unitsPerCase: "20", unitsPerOuter: "20 / Outer Case54204" },
    { productCode: "411416", outerBarcode: "6009233586477", barcode: "6009233586477", description: "Cheddar flavoured corn crunch 30 g", packSize: "30g", sellBy: "98", bbDate: "112", casesPerPallet: "30", unitsPerCase: "48", unitsPerOuter: "48 / Outer Case65304" },
    { productCode: "410615", outerBarcode: "6009233586453", barcode: "6009233586453", description: "Tomato Crunch 100g", packSize: "100g", sellBy: "98", bbDate: "112", casesPerPallet: "20", unitsPerCase: "20", unitsPerOuter: "20 / Outer Case54204" },
    { productCode: "411417", outerBarcode: "6009233586484", barcode: "6009233586484", description: "Jalapeno Popper flavoured corn crunch 30g", packSize: "30g", sellBy: "98", bbDate: "112", casesPerPallet: "30", unitsPerCase: "48", unitsPerOuter: "48 / Outer Case65304" },
    { productCode: "412005", outerBarcode: "6009195223038", barcode: "6009195223038", description: "POPCORN - Caramel Coated 150 g", packSize: "150 g", sellBy: "114", bbDate: "155", casesPerPallet: "48", unitsPerCase: "14", unitsPerOuter: "14 / Outer Case16348" },
    { productCode: "412003", outerBarcode: "6009189862717", barcode: "6009189862717", description: "POPCORN - Sea Salt 90 g", packSize: "90 g", sellBy: "127", bbDate: "141", casesPerPallet: "32", unitsPerCase: "14", unitsPerOuter: "14 / Outer Case84324" },
    { productCode: "412004", outerBarcode: "6009189862700", barcode: "6009189862700", description: "POPCORN - Salt & Vinegar 90 g", packSize: "90 g", sellBy: "127", bbDate: "141", casesPerPallet: "32", unitsPerCase: "14", unitsPerOuter: "14 / Outer Case84324" },
    { productCode: "412002", outerBarcode: "6009189862694", barcode: "6009189862694", description: "POPCORN - Sour Cream & Chives 90 g", packSize: "90 g", sellBy: "127", bbDate: "141", casesPerPallet: "32", unitsPerCase: "14", unitsPerOuter: "14 / Outer Case84324" },
    { productCode: "412007", outerBarcode: "6009195499853", barcode: "6009195499853", description: "POPCORN - Sour Cream & Chives 25 g", packSize: "25 g", sellBy: "127", bbDate: "141", casesPerPallet: "48", unitsPerCase: "24", unitsPerOuter: "24 / Outer Case12448" },
    { productCode: "412001", outerBarcode: "6009189862687", barcode: "6009189862687", description: "POPCORN - White Cheddar 90 g", packSize: "90 g", sellBy: "127", bbDate: "141", casesPerPallet: "32", unitsPerCase: "14", unitsPerOuter: "14 / Outer Case84324" },
    { productCode: "412006", outerBarcode: "6009195499846", barcode: "6009195499846", description: "POPCORN - White Cheddar 25 g", packSize: "25 g", sellBy: "127", bbDate: "141", casesPerPallet: "48", unitsPerCase: "24", unitsPerOuter: "24 / Outer Case12448" },
    { productCode: "412009", outerBarcode: "6009223464297", barcode: "6009223464297", description: "POPCORN - Feta & Black Pepper 90 g", packSize: "90 g", sellBy: "127", bbDate: "141", casesPerPallet: "32", unitsPerCase: "14", unitsPerOuter: "14 / Outer Case84324" },
    { productCode: "412010", outerBarcode: "6009223464303", barcode: "6009223464303", description: "POPCORN - Jalapeno Atchar 90 g", packSize: "90 g", sellBy: "127", bbDate: "141", casesPerPallet: "32", unitsPerCase: "14", unitsPerOuter: "14 / Outer Case84324" },
    { productCode: "412011", outerBarcode: "6009223464327", barcode: "6009223464327", description: "POPCORN - Butter Flavoured 90 g", packSize: "90 g", sellBy: "127", bbDate: "141", casesPerPallet: "32", unitsPerCase: "14", unitsPerOuter: "14 / Outer Case84324" }
  ];

  // Auto-sync stale local storage data with FULL_PRODUCT_MASTER
  let products = FULL_PRODUCT_MASTER;
  saveStorage(STORAGE_KEYS.products, products);

  let loadingRecords = loadStorage(STORAGE_KEYS.loading, []);
  let barcodeProblems = loadStorage(STORAGE_KEYS.problems, []);
  let currentSession = loadStorage(STORAGE_KEYS.session, null);

  let currentScannedProduct = null;
  let currentScannedBarcode = "";

  function $(id) {
    return document.getElementById(id);
  }

  function loadStorage(key, fallback) {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : fallback;
    } catch (error) {
      console.error("Storage read error:", error);
      return fallback;
    }
  }

  function saveStorage(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error("Storage write error:", error);
    }
  }

  function normalizeCode(value) {
    return String(value ?? "").trim().replace(/[\s\r\n\t]/g, "").toLowerCase();
  }

  function cleanNumber(val) {
    if (!val) return 0;
    const match = String(val).match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
  }

  function displayValue(value) {
    return value === undefined || value === null || value === "" || value === "#N/A" ? "-" : String(value);
  }

  function getEffectiveOuterBarcode(product) {
    if (product && product.outerBarcode && product.outerBarcode !== "#N/A" && product.outerBarcode.trim() !== "") {
      return product.outerBarcode;
    }
    return product ? product.barcode : "-";
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function getToday() {
    return new Date().toISOString().slice(0, 10);
  }

  function showToast(message, type = "") {
    const toast = $("toast");
    if (!toast) return;
    toast.textContent = message;
    toast.className = `toast ${type}`;
    toast.classList.remove("hidden");
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => toast.classList.add("hidden"), 3500);
  }

  function getProductByAnyCode(code) {
    const query = normalizeCode(code);
    if (!query) return null;
    return products.find(p => 
      normalizeCode(p.barcode) === query ||
      normalizeCode(p.outerBarcode) === query ||
      normalizeCode(p.productCode) === query
    ) || null;
  }

  function showSection(sectionId) {
    document.querySelectorAll(".page-section").forEach(s => s.classList.toggle("active", s.id === sectionId));
    document.querySelectorAll(".nav-button").forEach(b => b.classList.toggle("active", b.dataset.section === sectionId));
    if (sectionId === "dashboard") updateDashboard();
    if (sectionId === "history") renderLoadingHistory();
    if (sectionId === "products") renderProducts();
  }

  function ensureActiveSession() {
    if (!currentSession) {
      currentSession = {
        id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
        user: AUTHORIZED_USERS[0],
        truck: "TRK-01-GP",
        customer: "General Dispatch",
        delivery: "DEL-001",
        route: "Main Route",
        startedAt: new Date().toISOString()
      };
      saveStorage(STORAGE_KEYS.session, currentSession);
    }
  }

  function checkBarcode() {
    const input = $("barcodeInput");
    if (!input) return;
    const rawCode = input.value.trim();
    if (!rawCode) {
      showToast("Enter or scan a barcode/code first.", "warning");
      return;
    }

    ensureActiveSession();
    currentScannedBarcode = rawCode;
    const product = getProductByAnyCode(rawCode);
    currentScannedProduct = product;

    const query = normalizeCode(rawCode);
    const duplicates = loadingRecords.filter(r => 
      normalizeCode(r.barcode) === query ||
      normalizeCode(r.outerBarcode) === query ||
      normalizeCode(r.productCode) === query
    );

    if (duplicates.length > 0) {
      showDuplicateResult(rawCode, duplicates);
      return;
    }

    if (!product) {
      showInvalidResult(rawCode);
      return;
    }

    showValidResult(product, rawCode);
  }

  function showValidResult(product, scannedCode) {
    const res = $("scanResult");
    res.className = "scan-result success";

    const outerBarcode = getEffectiveOuterBarcode(product);

    res.innerHTML = `
      <div class="result-icon">✓</div>
      <h3>VALID PRODUCT MATCH</h3>
      <p><strong>Scanned Code:</strong> ${escapeHtml(scannedCode)}</p>
      <p><strong>Product:</strong> ${escapeHtml(product.description)}</p>
      <p><strong>Product SKU:</strong> ${escapeHtml(product.productCode)}</p>
      <p><strong>Barcode:</strong> ${escapeHtml(product.barcode)}</p>
      <p><strong>Outer Barcode:</strong> ${escapeHtml(outerBarcode)}</p>
    `;
    showLoadConfirmation(product);
  }

  function showInvalidResult(scannedCode) {
    const res = $("scanResult");
    res.className = "scan-result error";
    res.innerHTML = `
      <div class="result-icon">✕</div>
      <h3>PRODUCT NOT FOUND</h3>
      <p><strong>Scanned Code:</strong> ${escapeHtml(scannedCode)}</p>
      <p>No match for barcode, outer barcode, or SKU.</p>
    `;
    if ($("loadConfirmationPanel")) $("loadConfirmationPanel").classList.add("hidden");
  }

  function showDuplicateResult(scannedCode, duplicates) {
    const res = $("scanResult");
    res.className = "scan-result warning";
    res.innerHTML = `
      <div class="result-icon">⚠</div>
      <h3>DUPLICATE SCAN DETECTED</h3>
      <p><strong>Scanned Code:</strong> ${escapeHtml(scannedCode)}</p>
      <p>This product/barcode has already been recorded in history.</p>
    `;
    if ($("loadConfirmationPanel")) $("loadConfirmationPanel").classList.add("hidden");
  }

  function showLoadConfirmation(product) {
    if ($("loadConfirmationPanel")) $("loadConfirmationPanel").classList.remove("hidden");
    
    const cases = cleanNumber(product.casesPerPallet);
    const unitsPerCase = cleanNumber(product.unitsPerCase);
    const calculatedUnits = cases * unitsPerCase;
    const outerBarcode = getEffectiveOuterBarcode(product);

    if ($("loadCases")) $("loadCases").value = cases || "";
    if ($("loadQuantity")) $("loadQuantity").value = calculatedUnits || "";

    if ($("loadProductSummary")) {
      $("loadProductSummary").innerHTML = `
        <div class="summary-item"><small>Product Code</small><strong>${escapeHtml(product.productCode)}</strong></div>
        <div class="summary-item"><small>Description</small><strong>${escapeHtml(product.description)}</strong></div>
        <div class="summary-item"><small>Outer Barcode</small><strong>${escapeHtml(outerBarcode)}</strong></div>
        <div class="summary-item"><small>Barcode</small><strong>${escapeHtml(product.barcode)}</strong></div>
        <div class="summary-item"><small>Cases / Pallet</small><strong>${cases || "-"}</strong></div>
        <div class="summary-item"><small>Units / Case</small><strong>${unitsPerCase || "-"}</strong></div>
        <div class="summary-item"><small>Units / Pallet</small><strong id="summaryTotalUnits">${calculatedUnits || "-"}</strong></div>
      `;
    }
  }

  function recalculateUnits() {
    if (!currentScannedProduct) return;
    const casesVal = parseInt($("loadCases") ? $("loadCases").value : 0, 10) || 0;
    const unitsPerCase = cleanNumber(currentScannedProduct.unitsPerCase);
    const totalUnits = casesVal * unitsPerCase;

    if ($("loadQuantity")) {
      $("loadQuantity").value = totalUnits;
    }

    const summaryUnits = $("summaryTotalUnits");
    if (summaryUnits) {
      summaryUnits.textContent = totalUnits;
    }
  }

  function confirmLoad() {
    if (!currentScannedProduct) return;
    const record = {
      id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
      date: getToday(),
      time: new Date().toLocaleTimeString("en-ZA"),
      truck: $("loadTruck") ? $("loadTruck").value : "",
      customer: $("loadCustomer") ? $("loadCustomer").value : "",
      delivery: $("loadDelivery") ? $("loadDelivery").value : "",
      barcode: currentScannedProduct.barcode,
      outerBarcode: getEffectiveOuterBarcode(currentScannedProduct),
      productCode: currentScannedProduct.productCode,
      product: currentScannedProduct.description,
      cases: $("loadCases") ? $("loadCases").value : 0,
      quantity: $("loadQuantity") ? $("loadQuantity").value : 0,
      status: "LOADED",
      loadedBy: $("loadUser") ? $("loadUser").value : AUTHORIZED_USERS[0]
    };

    loadingRecords.push(record);
    saveStorage(STORAGE_KEYS.loading, loadingRecords);
    if ($("barcodeInput")) $("barcodeInput").value = "";
    if ($("loadConfirmationPanel")) $("loadConfirmationPanel").classList.add("hidden");
    showToast("Pallet successfully logged.", "success");
    renderLoadingHistory();
    updateDashboard();
  }

  function renderProducts() {
    if ($("productCount")) $("productCount").textContent = products.length;
    if ($("uniqueBarcodeCount")) $("uniqueBarcodeCount").textContent = new Set(products.map(p => p.barcode)).size;
    const body = $("productBody");
    if (!body) return;

    body.innerHTML = products.map(p => `
      <tr>
        <td><code>${escapeHtml(p.productCode)}</code></td>
        <td><code>${escapeHtml(getEffectiveOuterBarcode(p))}</code></td>
        <td><code>${escapeHtml(p.barcode)}</code></td>
        <td>${escapeHtml(p.description)}</td>
        <td>${escapeHtml(displayValue(p.packSize))}</td>
        <td>${escapeHtml(displayValue(p.sellBy))}</td>
        <td>${escapeHtml(displayValue(p.bbDate))}</td>
        <td>${escapeHtml(displayValue(p.casesPerPallet))}</td>
        <td>${escapeHtml(cleanNumber(p.unitsPerCase))}</td>
        <td>${escapeHtml(displayValue(p.unitsPerOuter))}</td>
      </tr>
    `).join("");
  }

  function renderLoadingHistory() {
    const body = $("historyBody");
    if (!body) return;
    body.innerHTML = loadingRecords.slice().reverse().map(r => `
      <tr>
        <td>${escapeHtml(r.date)}</td>
        <td>${escapeHtml(r.time)}</td>
        <td>${escapeHtml(displayValue(r.truck))}</td>
        <td>${escapeHtml(displayValue(r.customer))}</td>
        <td>${escapeHtml(displayValue(r.delivery))}</td>
        <td><code>${escapeHtml(r.barcode)}</code></td>
        <td>${escapeHtml(r.product)}</td>
        <td>${escapeHtml(r.cases)}</td>
        <td>${escapeHtml(r.quantity)}</td>
        <td class="status-loaded">${escapeHtml(r.status)}</td>
        <td>${escapeHtml(r.loadedBy)}</td>
      </tr>
    `).join("");
  }

  function updateDashboard() {
    if ($("statPallets")) $("statPallets").textContent = loadingRecords.length;
    if ($("statValid")) $("statValid").textContent = loadingRecords.filter(r => r.status === "LOADED").length;
  }

  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".nav-button").forEach(btn => {
      btn.addEventListener("click", () => showSection(btn.dataset.section));
    });

    if ($("checkBarcodeButton")) $("checkBarcodeButton").addEventListener("click", checkBarcode);
    if ($("confirmLoadButton")) $("confirmLoadButton").addEventListener("click", confirmLoad);

    if ($("barcodeInput")) {
      $("barcodeInput").addEventListener("keypress", (e) => {
        if (e.key === "Enter") checkBarcode();
      });
    }

    const casesInput = $("loadCases");
    if (casesInput) {
      ["input", "change", "keyup"].forEach(evt => {
        casesInput.addEventListener(evt, recalculateUnits);
      });
    }

    renderProducts();
    renderLoadingHistory();
    updateDashboard();
  });
})();