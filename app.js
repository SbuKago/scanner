/*
  Dispatch Barcode Tracker
  Beginner-friendly Vanilla JavaScript.

  Main storage keys:
  - dispatch_product_master
  - dispatch_loading_records
  - dispatch_barcode_problems
  - dispatch_session
*/

const STORAGE_KEYS = {
  products: "dispatch_product_master",
  loading: "dispatch_loading_records",
  problems: "dispatch_barcode_problems",
  session: "dispatch_session"
};

const DEFAULT_PRODUCTS = [
  { productCode: "413817", barcode: "6009211225657", product: "Lentil & Quinoa Pop Chips – Creamy Cheddar", packSize: "85 g" },
  { productCode: "413807", barcode: "6009207314334", product: "Lentil & Quinoa Pop Chips – Creamy Cheddar", packSize: "20 g" },
  { productCode: "413816", barcode: "6009211225640", product: "Lentil & Quinoa Pop Chips – BBQ", packSize: "85 g" },
  { productCode: "413808", barcode: "6009207314341", product: "Lentil & Quinoa Pop Chips – BBQ", packSize: "20 g" },
  { productCode: "413819", barcode: "6009223668152", product: "Lentil & Quinoa Pop Chips – Sour Cream and Chives", packSize: "85 g" },
  { productCode: "410810", barcode: "6005000288865", product: "HCC Sea Salt 50g", packSize: "50g" },
  { productCode: "410808", barcode: "6009184110455", product: "HCC Sea Salt 125g", packSize: "125g" },
  { productCode: "410807", barcode: "6009184110462", product: "HCC Sea Salt & Black Pepper 125g", packSize: "125g" },
  { productCode: "410811", barcode: "6005000895865", product: "HCC Sea Salt & Black Pepper 50g", packSize: "50g" },
  { productCode: "410806", barcode: "6009184110479", product: "HCC Sour Cream & Chives 125g", packSize: "125g" },
  { productCode: "410812", barcode: "6009184110486", product: "HCC Rosemary & Sea Salt 125g", packSize: "125g" },
  { productCode: "410819", barcode: "6009214098296", product: "HCC Rottisserie Chicken 125g", packSize: "125g" },
  { productCode: "410809", barcode: "6009226480089", product: "HCC roast lamb & rosemary flavoured 125g", packSize: "125g" },
  { productCode: "410820", barcode: "6009226451577", product: "HCC sea salt & white balsamic vinegar flavoured 50g", packSize: "50g" },
  { productCode: "410802", barcode: "6009226478611", product: "HCC sea salt & white balsamic vinegar flavoured 125g", packSize: "125g" },
  { productCode: "410801", barcode: "6009226462993", product: "HCC sriracha flavoured 125g", packSize: "125g" },
  { productCode: "410827", barcode: "6009245410159", product: "HCC Parmesan & Truffle 125g", packSize: "125g" },
  { productCode: "410823", barcode: "6009245410104", product: "HCC Sweet & Sticky Chilli 50g", packSize: "50g" },
  { productCode: "410824", barcode: "6009245410111", product: "HCC Sweet & Sticky Chilli 125g", packSize: "125g" },
  { productCode: "410821", barcode: "6009245410081", product: "HCC Dijon Mustard 50g", packSize: "50g" },
  { productCode: "410822", barcode: "6009245410098", product: "HCC Dijon Mustard 125g", packSize: "125g" },
  { productCode: "410825", barcode: "6009245410128", product: "HCC Rotisserie chicken 50g", packSize: "50g" },
  { productCode: "410905", barcode: "6009173755049", product: "HCS Sea Salt 50g", packSize: "50g" },
  { productCode: "410907", barcode: "6009173755087", product: "HCS Sea Salt 125g", packSize: "125g" },
  { productCode: "410901", barcode: "6009184110417", product: "HCS Sea Salt & Black Pepper 125g", packSize: "125g" },
  { productCode: "417608", barcode: "6009211697829", product: "HCS Caramelised Onion and Mature Cheddar", packSize: "50g" },
  { productCode: "417606", barcode: "6009173755070", product: "HCS Caramelised Onion and Mature Cheddar", packSize: "125g" },
  { productCode: "417610", barcode: "6009211697843", product: "HCS Flame Grilled Steak", packSize: "50g" },
  { productCode: "417602", barcode: "6009184110394", product: "HCS Flame Grilled Steak", packSize: "125g" },
  { productCode: "410904", barcode: "6009173755056", product: "HCS Sour cream & Red onion 50g", packSize: "50g" },
  { productCode: "410909", barcode: "6009211697836", product: "HCS Sour cream & Red onion 125g", packSize: "125g" },
  { productCode: "410911", barcode: "6009226451560", product: "HCS sticky ribs with chilli flavoured 50g", packSize: "50g" },
  { productCode: "410913", barcode: "6009226462986", product: "HCS sticky ribs with chilli flavoured 125g", packSize: "125g" },
  { productCode: "410916", barcode: "6009226652455", product: "HCS sea salt & white balsamic vinegar flavoured 50g", packSize: "50g" },
  { productCode: "410914", barcode: "6009226478628", product: "HCS sea salt & white balsamic vinegar flavoured 125g", packSize: "125g" },
  { productCode: "410912", barcode: "6009226451584", product: "HCS Sour Cream & Jalapeno 125 g", packSize: "125g" },
  { productCode: "410612", barcode: "6009223192367", product: "Prawn Cocktail mix 30 g", packSize: "30 g" },
  { productCode: "410611", barcode: "6009223192336", product: "Prawn Cocktail mix 100 g", packSize: "100 g" },
  { productCode: "410605", barcode: "6009175940368", product: "Prawn Cocktail 30 g", packSize: "30 g" },
  { productCode: "410604", barcode: "00020024277", product: "Prawn Cocktail 125 g", packSize: "125 g" },
  { productCode: "410607", barcode: "6009175940382", product: "Streaky Crackle 30 g", packSize: "30 g" },
  { productCode: "410602", barcode: "6009178477823", product: "Streaky Crackle 100 g", packSize: "100 g" },
  { productCode: "410606", barcode: "6009175940399", product: "Sweet Onion Rings 75 g", packSize: "75 g" },
  { productCode: "410603", barcode: "6008000521604", product: "Salt & Vinegar Onion Rings 75 g", packSize: "75 g" },
  { productCode: "410601", barcode: "6009175940580", product: "Potato Fries Salt & Vinegar 125 g", packSize: "125 g" },
  { productCode: "410613", barcode: "6009223398301", product: "Potato Fries Salt & Vinegar 30 g", packSize: "30 g" },
  { productCode: "410404", barcode: "6009214098241", product: "Lentil Chips Sour Cream & Chives Flavoured 40 g", packSize: "40 g" },
  { productCode: "410403", barcode: "6009214098258", product: "Lentil Chips Sour Cream & Chives Flavoured 100 g", packSize: "100 g" },
  { productCode: "410406", barcode: "6009214098197", product: "Chickpea Chips Sweet Chilli Flavoured 40 g", packSize: "40 g" },
  { productCode: "410405", barcode: "6009214098203", product: "Chickpea Chips Sweet Chilli Flavoured 100 g", packSize: "100 g" },
  { productCode: "410407", barcode: "6009223567240", product: "Chickpea Chips Sea Salt & Black Pepper Flavoured 100 g", packSize: "100 g" },
  { productCode: "410402", barcode: "6009214098265", product: "Quinoa Chips BBQ Flavoured 40 g", packSize: "40 g" },
  { productCode: "410401", barcode: "6009214098272", product: "Quinoa Chips BBQ Flavoured 100 g", packSize: "100 g" },
  { productCode: "410408", barcode: "6009223567257", product: "Quinoa Chips Sea Salt Flavoured 100 g", packSize: "100 g" },
  { productCode: "410409", barcode: "6009223567264", product: "Lentil Chips Creamy Cheddar Flavoured 100 g", packSize: "100 g" },
  { productCode: "410614", barcode: "6009214296180", product: "Cocktail Mix Chip BBQ 100 g", packSize: "100 g" },
  { productCode: "410610", barcode: "6009223187172", product: "Cocktail Mix Chip BBQ 30 g", packSize: "30 g" },
  { productCode: "340031773", barcode: "16009510808305", product: "Simba Straws Sour Cream & Chives Flavoured", packSize: "110 g" },
  { productCode: "410617", barcode: "6007875204742", product: "Corn Crunch Cheddar Flavoured 100g", packSize: "100 g" },
  { productCode: "411416", barcode: "6009233586477", product: "Cheddar flavoured corn crunch 30 g", packSize: "30g" },
  { productCode: "410615", barcode: "6009233586453", product: "Tomato Crunch 100g", packSize: "100g" },
  { productCode: "411418", barcode: "6009233586491", product: "Tomato flavoured corn crunch 30g", packSize: "30g" },
  { productCode: "410616", barcode: "6009233586460", product: "Jalapeno Crunch 100g", packSize: "100g" },
  { productCode: "411417", barcode: "6009233586484", product: "Jalapeno Popper flavoured corn crunch 30g", packSize: "30g" },
  { productCode: "412005", barcode: "6009195223038", product: "POPCORN - Caramel Coated 150 g", packSize: "150 g" },
  { productCode: "412003", barcode: "6009189862717", product: "POPCORN - Sea Salt 90 g", packSize: "90 g" },
  { productCode: "412004", barcode: "6009189862700", product: "POPCORN - Salt & Vinegar 90 g", packSize: "90 g" },
  { productCode: "412002", barcode: "6009189862694", product: "POPCORN - Sour Cream & Chives 90 g", packSize: "90 g" },
  { productCode: "412007", barcode: "6009195499853", product: "POPCORN - Sour Cream & Chives 25 g", packSize: "25 g" },
  { productCode: "412001", barcode: "6009189862687", product: "POPCORN - White Cheddar 90 g", packSize: "90 g" },
  { productCode: "412006", barcode: "009195499846", product: "POPCORN - White Cheddar 25 g", packSize: "25 g" },
  { productCode: "412009", barcode: "6009223464297", product: "POPCORN - Feta & Black Pepper 90 g", packSize: "90 g" },
  { productCode: "412010", barcode: "6009223464303", product: "POPCORN - Jalapeno Atchar 90 g", packSize: "90 g" },
  { productCode: "412011", barcode: "6009223464327", product: "POPCORN - Butter Flavoured 90 g", packSize: "90 g" },
  { productCode: "FG017", barcode: "6009701000269", product: "HP Feta & Black Pepper 90 g", packSize: "90 g" },
  { productCode: "FG015", barcode: "6009701000245", product: "HP Cream Cheese & Chives 90 g", packSize: "90 g" },
  { productCode: "FG016", barcode: "6009701000252", product: "HP Cheesy Cheese 90 g", packSize: "90 g" },
  { productCode: "FG020", barcode: "6005574002003", product: "HP Butter Flavour 90 g", packSize: "90 g" },
  { productCode: "FG019", barcode: "6009701000283", product: "HP Caramel Popcorn 150 g", packSize: "150 g" },
  { productCode: "FG011", barcode: "6009701000023", product: "HP Caramel Popcorn 22 g x 4", packSize: "22 g x 4" },
  { productCode: "415855", barcode: "6009223668152", product: "Lentil & Quinoa Sour Cream & Chives Popped Chips", packSize: "85 g" },
  { productCode: "415854", barcode: "6009223668145", product: "Lentil & Quinoa Popped Chips Chilli Cream Cheese Flavoured", packSize: "85 g" },
  { productCode: "4172AB", barcode: "6005574000917", product: "HP Sweet & Salty Popcorn 90g", packSize: "90g" },
  { productCode: "4165AJ", barcode: "6005574002812", product: "Field & Flavour Tomato 120g", packSize: "120g" },
  { productCode: "4165AI", barcode: "6005574002829", product: "Field & Flavour Smoked Beef 120g", packSize: "120g" },
  { productCode: "4165AK", barcode: "6005574002805", product: "Field & Flavour Salt & vinegar 120g", packSize: "120g" },
  { productCode: "4165AL", barcode: "6005574000467", product: "Field & Flavour Cheese Flavoured 120g", packSize: "120g" },
  { productCode: "4165AM", barcode: "6005574000573", product: "Field & Flavour Lightly Salted Flavoured 120g", packSize: "120g" },
  { productCode: "4165AA", barcode: "6005574002867", product: "KC Tomato Flavoured Chips 36 g", packSize: "36g" },
  { productCode: "4165AC", barcode: "6005574002843", product: "KC Salt & Vinegar Flavoured Chips 36 g", packSize: "36g" },
  { productCode: "4165AG", barcode: "6005574002881", product: "KC Grilled Steak Flavoured Chips 36 g", packSize: "36g" },
  { productCode: "4165AB", barcode: "6005574002850", product: "KC Tomato Flavoured Chips 120 g", packSize: "120g" },
  { productCode: "4165AD", barcode: "6005574002836", product: "KC Salt & Vinegar Flavoured Chips 120 g", packSize: "120g" },
  { productCode: "4165AH", barcode: "6005574002874", product: "KC Grilled Steak Flavoured Chips 120 g", packSize: "120g" },
  { productCode: "4108AM", barcode: "6005574003468", product: "KC Blazin'hot BBQ 36g (BIG STORES)", packSize: "36g" },
  { productCode: "4108AO", barcode: "6005574003468", product: "KC Blazin'hot BBQ 36g (SMALL STORES)", packSize: "36g" },
  { productCode: "4108AL", barcode: "6005574003451", product: "KC Blazin'hot BBQ 120g (BIG STORES)", packSize: "120g" },
  { productCode: "4108AN", barcode: "6005574003451", product: "KC Blazin'hot BBQ 120g (SMALL STORES)", packSize: "120g" },
  { productCode: "4108AS", barcode: "6005574003505", product: "Blue Salt & Vinegar", packSize: "120g" },
  { productCode: "4108AR", barcode: "6005574003499", product: "Salt & Vinegar", packSize: "120g" },
  { productCode: "4108AQ", barcode: "6005574003482", product: "Boerewors", packSize: "120g" },
  { productCode: "4108AP", barcode: "6005574003475", product: "Chutney", packSize: "120g" },
  { productCode: "4108AT", barcode: "6009710723180", product: "Lay's KC Sea Salt & Black Pepper 120 g", packSize: "120g" },
  { productCode: "4108AU", barcode: "6009710723159", product: "Lay's KC Sea Salt & Black Pepper 30 g", packSize: "30g" },
  { productCode: "4108AV", barcode: "6009710723173", product: "Lay's KC Cheddar & Cranberry 120 g", packSize: "120g" },
  { productCode: "4108AY", barcode: "6009710723142", product: "Lay's KC Cheddar & Cranberry 30 g", packSize: "30g" },
  { productCode: "4108AW", barcode: "6009710723166", product: "Lay's KC Rib-Eye & Mushroom 120 g", packSize: "120g" },
  { productCode: "4108AX", barcode: "6009710723135", product: "Lay's KC Rib-Eye & Mushroom 30 g", packSize: "30g" }
];

let products = loadStorage(STORAGE_KEYS.products, DEFAULT_PRODUCTS);
let loadingRecords = loadStorage(STORAGE_KEYS.loading, []);
let barcodeProblems = loadStorage(STORAGE_KEYS.problems, []);
let currentSession = loadStorage(STORAGE_KEYS.session, null);

let currentScannedProduct = null;
let currentScannedBarcode = "";
let scanner = null;
let scannerRunning = false;
let problemBarcode = "";
let problemProduct = null;

// ---------- Basic helpers ----------

function $(id) {
  return document.getElementById(id);
}

function loadStorage(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch (error) {
    console.error("Could not load local storage:", error);
    return fallback;
  }
}

function saveStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function normalizeBarcode(value) {
  // Barcodes are strings. Never convert them to numbers.
  return String(value ?? "")
    .trim()
    .replace(/\s+/g, "");
}

function displayValue(value) {
  return value === undefined || value === null || value === "" ? "-" : String(value);
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

function formatDateTime(dateValue) {
  const date = new Date(dateValue);
  return {
    date: date.toLocaleDateString("en-ZA"),
    time: date.toLocaleTimeString("en-ZA", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    })
  };
}

function showToast(message, type = "") {
  const toast = $("toast");
  toast.textContent = message;
  toast.className = `toast ${type}`;
  toast.classList.remove("hidden");

  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => {
    toast.classList.add("hidden");
  }, 3500);
}

function showNotice(message, type = "info") {
  const notice = $("appNotice");
  notice.textContent = message;
  notice.className = `app-notice alert alert-${type}`;
  notice.classList.remove("hidden");

  setTimeout(() => notice.classList.add("hidden"), 5000);
}

// ---------- Navigation ----------

function showSection(sectionId) {
  document.querySelectorAll(".page-section").forEach(section => {
    section.classList.toggle("active", section.id === sectionId);
  });

  document.querySelectorAll(".nav-button").forEach(button => {
    button.classList.toggle("active", button.dataset.section === sectionId);
  });

  $("mainNav").classList.remove("open");

  if (sectionId === "dashboard") {
    updateDashboard();
  } else if (sectionId === "history") {
    renderLoadingHistory();
  } else if (sectionId === "products") {
    renderProducts();
  } else if (sectionId === "problems") {
    renderProblems();
  } else if (sectionId === "reports") {
    renderReports();
  } else if (sectionId === "scan") {
    updateScanSessionUI();
    setTimeout(() => focusBarcodeInput(), 150);
  }
}

// ---------- Session ----------

function openSessionModal() {
  $("sessionName").value = "";
  $("sessionUser").value = currentSession?.user || "";
  $("sessionTruck").value = currentSession?.truck || "";
  $("sessionCustomer").value = currentSession?.customer || "";
  $("sessionDelivery").value = currentSession?.delivery || "";
  $("sessionRoute").value = currentSession?.route || "";
  $("sessionModal").classList.remove("hidden");
  $("sessionName").focus();
}

function closeSessionModal() {
  $("sessionModal").classList.add("hidden");
}

function startSession() {
  const user = $("sessionUser").value.trim();
  const truck = $("sessionTruck").value.trim();
  const customer = $("sessionCustomer").value.trim();
  const delivery = $("sessionDelivery").value.trim();

  if (!user || !truck || !customer || !delivery) {
    showToast("Please enter employee, truck, customer and delivery information.", "warning");
    return;
  }

  currentSession = {
    id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
    name: $("sessionName").value.trim() || "Loading Session",
    user,
    truck,
    customer,
    delivery,
    route: $("sessionRoute").value.trim(),
    startedAt: new Date().toISOString()
  };

  saveStorage(STORAGE_KEYS.session, currentSession);
  closeSessionModal();
  updateSessionUI();
  showSection("scan");
  showToast("Loading session started.", "success");
}

function endSession() {
  if (!currentSession) return;

  const count = getSessionLoadedCount();

  const confirmed = confirm(
    `Are you sure you want to end this loading session?\n\n${count} pallet(s) loaded.\n\nHistorical records will not be deleted.`
  );

  if (!confirmed) return;

  currentSession = null;
  saveStorage(STORAGE_KEYS.session, null);
  currentScannedProduct = null;
  currentScannedBarcode = "";
  hideLoadConfirmation();
  updateSessionUI();
  showToast("Loading session ended.", "success");
}

function getSessionLoadedCount() {
  if (!currentSession) return 0;

  return loadingRecords.filter(
    record => record.sessionId === currentSession.id && record.status === "LOADED"
  ).length;
}

function updateSessionUI() {
  const hasSession = Boolean(currentSession);

  $("scanSessionBadge").textContent = hasSession ? "SESSION ACTIVE" : "NO SESSION";
  $("scanSessionBadge").className = `badge ${hasSession ? "badge-success" : "badge-neutral"}`;

  $("sessionBadge").textContent = hasSession ? "SESSION ACTIVE" : "NO SESSION";
  $("sessionBadge").className = `badge ${hasSession ? "badge-success" : "badge-neutral"}`;

  $("noSessionWarning").classList.toggle("hidden", hasSession);

  if (hasSession) {
    $("dashboardSessionText").textContent =
      `${currentSession.customer} • ${currentSession.truck} • ${currentSession.delivery}`;

    $("sessionSummary").innerHTML = `
      <div class="session-item"><small>User</small><strong>${escapeHtml(currentSession.user)}</strong></div>
      <div class="session-item"><small>Truck</small><strong>${escapeHtml(currentSession.truck)}</strong></div>
      <div class="session-item"><small>Customer</small><strong>${escapeHtml(currentSession.customer)}</strong></div>
      <div class="session-item"><small>Delivery</small><strong>${escapeHtml(currentSession.delivery)}</strong></div>
    `;
  } else {
    $("dashboardSessionText").textContent = "No active session.";
    $("sessionSummary").innerHTML = `
      <div class="empty-table">Start a loading session to begin scanning pallets.</div>
    `;
  }
}

function updateScanSessionUI() {
  updateSessionUI();
}

// ---------- Excel import ----------

function importExcel() {
  $("excelFileInput").click();
}

async function handleExcelFile(event) {
  const file = event.target.files[0];
  if (!file) return;

  try {
    if (typeof XLSX === "undefined") {
      throw new Error("The Excel reader library did not load. Check your internet connection.");
    }

    $("excelStatus").textContent = `Reading ${file.name}...`;
    $("excelStatus").className = "alert alert-info";

    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, {
      type: "array",
      cellText: true,
      cellDates: false
    });

    const firstSheetName = workbook.SheetNames[0];

    if (!firstSheetName) {
      throw new Error("The Excel file does not contain a worksheet.");
    }

    const sheet = workbook.Sheets[firstSheetName];

    // raw values are kept as strings where possible.
    const rows = XLSX.utils.sheet_to_json(sheet, {
      defval: "",
      raw: false
    });

    if (!rows.length) {
      throw new Error("The worksheet is empty.");
    }

    const importedProducts = rows
      .map(row => normalizeProductRow(row))
      .filter(product => product.barcode);

    if (!importedProducts.length) {
      throw new Error(
        "No barcode values were found. Make sure your spreadsheet has a Barcode column."
      );
    }

    products = importedProducts;
    saveStorage(STORAGE_KEYS.products, products);

    renderProducts();
    updateDashboard();

    $("excelStatus").textContent =
      `File: ${file.name} • Products Loaded: ${products.length} • Unique Barcodes: ${getUniqueBarcodeCount()} • Status: Ready for Scanning`;
    $("excelStatus").className = "alert alert-success";

    showToast(`${products.length} product/barcode records imported.`, "success");
  } catch (error) {
    console.error(error);
    $("excelStatus").textContent = `Import failed: ${error.message}`;
    $("excelStatus").className = "alert alert-error";
    showToast(error.message, "error");
  } finally {
    event.target.value = "";
  }
}

function normalizeHeader(header) {
  return String(header ?? "")
    .trim()
    .toLowerCase()
    .replace(/[\s_\-/]+/g, "");
}

function findColumn(row, possibleNames) {
  const keys = Object.keys(row);

  for (const name of possibleNames) {
    const wanted = normalizeHeader(name);

    const exact = keys.find(key => normalizeHeader(key) === wanted);
    if (exact) return exact;
  }

  // More forgiving fallback: find a header containing a keyword.
  for (const key of keys) {
    const normalized = normalizeHeader(key);

    if (possibleNames.some(name => normalized.includes(normalizeHeader(name)))) {
      return key;
    }
  }

  return null;
}

function normalizeProductRow(row) {
  const barcodeColumn = findColumn(row, [
    "Barcode",
    "Bar Code",
    "Pallet Barcode",
    "EAN",
    "UPC",
    "GTIN",
    "Barcode Number"
  ]);

  const productCodeColumn = findColumn(row, [
    "Product Code",
    "ProductCode",
    "SKU",
    "Item Code",
    "ItemCode"
  ]);

  const descriptionColumn = findColumn(row, [
    "Product Description",
    "Product",
    "Description",
    "Product Name"
  ]);

  const customerColumn = findColumn(row, [
    "Customer",
    "Customer Name",
    "Customer Code"
  ]);

  const packSizeColumn = findColumn(row, [
    "Pack Size",
    "PackSize",
    "Size"
  ]);

  const casesColumn = findColumn(row, [
    "Cases Per Pallet",
    "Cases/Pallet",
    "Cases Pallet",
    "Cases"
  ]);

  const palletTypeColumn = findColumn(row, [
    "Pallet Type",
    "Pallet",
    "PalletType"
  ]);

  return {
    barcode: normalizeBarcode(barcodeColumn ? row[barcodeColumn] : ""),
    productCode: productCodeColumn ? String(row[productCodeColumn]).trim() : "",
    description: descriptionColumn ? String(row[descriptionColumn]).trim() : "",
    customer: customerColumn ? String(row[customerColumn]).trim() : "",
    packSize: packSizeColumn ? String(row[packSizeColumn]).trim() : "",
    casesPerPallet: casesColumn ? String(row[casesColumn]).trim() : "",
    palletType: palletTypeColumn ? String(row[palletTypeColumn]).trim() : ""
  };
}

function getUniqueBarcodeCount() {
  return new Set(products.map(product => product.barcode)).size;
}

function getProductByBarcode(barcode) {
  const normalized = normalizeBarcode(barcode);

  return products.find(product => product.barcode === normalized) || null;
}

// ---------- Barcode validation ----------

function checkBarcode() {
  const barcode = normalizeBarcode($("barcodeInput").value);

  if (!barcode) {
    showToast("Enter or scan a barcode first.", "warning");
    focusBarcodeInput();
    return;
  }

  if (!currentSession) {
    showToast("Start a loading session before scanning.", "warning");
    openSessionModal();
    return;
  }

  currentScannedBarcode = barcode;
  const product = getProductByBarcode(barcode);
  currentScannedProduct = product;

  const previousLoads = loadingRecords.filter(
    record =>
      normalizeBarcode(record.barcode) === barcode &&
      record.status === "LOADED"
  );

  if (previousLoads.length > 0) {
    showDuplicateResult(barcode, previousLoads);
    return;
  }

  if (!product) {
    showInvalidResult(barcode);
    return;
  }

  showValidResult(product);
}

function showValidResult(product) {
  $("scanResult").className = "scan-result success";
  $("scanResult").innerHTML = `
    <div class="result-icon">✓</div>
    <h3>VALID BARCODE</h3>
    <p><strong>Barcode:</strong> ${escapeHtml(product.barcode)}</p>
    <p><strong>Product:</strong> ${escapeHtml(displayValue(product.description))}</p>
    <p><strong>Product Code:</strong> ${escapeHtml(displayValue(product.productCode))}</p>
    <p><strong>Customer:</strong> ${escapeHtml(displayValue(product.customer))}</p>
    <p><strong>Barcode Quality:</strong> PASS</p>
  `;

  showLoadConfirmation(product);
}

function showInvalidResult(barcode) {
  $("scanResult").className = "scan-result error";
  $("scanResult").innerHTML = `
    <div class="result-icon">✕</div>
    <h3>BARCODE NOT FOUND</h3>
    <p><strong>Barcode:</strong> ${escapeHtml(barcode)}</p>
    <p>This barcode does not exist in the imported product master.</p>
    <p><strong>DO NOT LOAD THIS PALLET</strong></p>
    <button id="reportUnknownButton" class="danger-button">Report Barcode Problem</button>
  `;

  $("reportUnknownButton").addEventListener("click", () => {
    openProblemModal(barcode, null);
  });

  hideLoadConfirmation();
}

function showDuplicateResult(barcode, previousLoads) {
  const last = previousLoads[previousLoads.length - 1];
  const date = formatDateTime(last.timestamp);

  $("scanResult").className = "scan-result warning";
  $("scanResult").innerHTML = `
    <div class="result-icon">⚠</div>
    <h3>DUPLICATE PALLET</h3>
    <p><strong>Barcode:</strong> ${escapeHtml(barcode)}</p>
    <p>This barcode has already been loaded.</p>
    <p><strong>Loaded:</strong> ${escapeHtml(date.date)} ${escapeHtml(date.time)}</p>
    <p><strong>Truck:</strong> ${escapeHtml(displayValue(last.truck))}</p>
    <button id="reportDuplicateButton" class="danger-button">Report Duplicate Barcode</button>
  `;

  $("reportDuplicateButton").addEventListener("click", () => {
    openProblemModal(barcode, currentScannedProduct);
  });

  $("duplicatePanel").innerHTML = `
    <strong>⚠ Duplicate scan detected.</strong>
    This pallet barcode already exists in the loading history.
    Do not load it again unless your supervisor confirms it.
  `;
  $("duplicatePanel").classList.remove("hidden");

  hideLoadConfirmation();
}

function focusBarcodeInput() {
  if (!$("scan").classList.contains("active")) return;
  $("barcodeInput").focus();
}

function hideLoadConfirmation() {
  $("loadConfirmationPanel").classList.add("hidden");
  $("duplicatePanel").classList.add("hidden");
}

function showLoadConfirmation(product) {
  $("duplicatePanel").classList.add("hidden");
  $("loadConfirmationPanel").classList.remove("hidden");

  $("loadTruck").value = currentSession?.truck || "";
  $("loadCustomer").value = currentSession?.customer || product.customer || "";
  $("loadDelivery").value = currentSession?.delivery || "";
  $("loadRoute").value = currentSession?.route || "";
  $("loadCases").value = product.casesPerPallet || "";
  $("loadQuantity").value = "";
  $("loadPalletType").value = product.palletType || "";
  $("loadUser").value = currentSession?.user || "";

  $("loadProductSummary").innerHTML = `
    <div class="summary-item"><small>Barcode</small><strong>${escapeHtml(product.barcode)}</strong></div>
    <div class="summary-item"><small>Product Code</small><strong>${escapeHtml(displayValue(product.productCode))}</strong></div>
    <div class="summary-item"><small>Product</small><strong>${escapeHtml(displayValue(product.description))}</strong></div>
    <div class="summary-item"><small>Customer</small><strong>${escapeHtml(displayValue(product.customer))}</strong></div>
    <div class="summary-item"><small>Pack Size</small><strong>${escapeHtml(displayValue(product.packSize))}</strong></div>
    <div class="summary-item"><small>Cases/Pallet</small><strong>${escapeHtml(displayValue(product.casesPerPallet))}</strong></div>
  `;

  $("loadTruck").focus();
}

function confirmLoad() {
  if (!currentSession) {
    showToast("No active loading session.", "warning");
    return;
  }

  if (!currentScannedProduct || !currentScannedBarcode) {
    showToast("No valid barcode has been selected.", "warning");
    return;
  }

  const truck = $("loadTruck").value.trim();
  const customer = $("loadCustomer").value.trim();
  const delivery = $("loadDelivery").value.trim();
  const loadedBy = $("loadUser").value.trim();

  if (!truck || !customer || !delivery || !loadedBy) {
    showToast("Truck, customer, delivery and loaded-by fields are required.", "warning");
    return;
  }

  const duplicate = loadingRecords.some(
    record =>
      normalizeBarcode(record.barcode) === currentScannedBarcode &&
      record.status === "LOADED"
  );

  if (duplicate) {
    showToast("This pallet has already been loaded.", "warning");
    return;
  }

  const record = {
    id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
    sessionId: currentSession.id,
    timestamp: new Date().toISOString(),
    date: getToday(),
    time: new Date().toLocaleTimeString("en-ZA", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    }),
    truck,
    customer,
    delivery,
    route: $("loadRoute").value.trim(),
    barcode: currentScannedBarcode,
    productCode: currentScannedProduct.productCode,
    product: currentScannedProduct.description,
    packSize: currentScannedProduct.packSize,
    cases: numberOrZero($("loadCases").value),
    quantity: numberOrZero($("loadQuantity").value),
    palletType: $("loadPalletType").value.trim(),
    status: "LOADED",
    loadedBy
  };

  loadingRecords.push(record);
  saveStorage(STORAGE_KEYS.loading, loadingRecords);

  currentScannedProduct = null;
  currentScannedBarcode = "";

  $("barcodeInput").value = "";
  hideLoadConfirmation();

  $("scanResult").className = "scan-result success";
  $("scanResult").innerHTML = `
    <div class="result-icon">✓</div>
    <h3>PALLET LOADED</h3>
    <p>Barcode ${escapeHtml(record.barcode)} was successfully recorded.</p>
    <p>Ready for the next pallet.</p>
  `;

  updateDashboard();
  renderLoadingHistory();
  renderReports();

  showToast("Pallet loading saved.", "success");

  setTimeout(() => {
    $("barcodeInput").value = "";
    focusBarcodeInput();
  }, 250);
}

function numberOrZero(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

// ---------- Camera scanner ----------

async function startCameraScanner() {
  if (scannerRunning) return;

  if (typeof Html5Qrcode === "undefined") {
    showToast("Camera scanner library has not loaded. Check your internet connection.", "error");
    return;
  }

  try {
    scanner = new Html5Qrcode("reader");

    const config = {
      fps: 10,
      qrbox: { width: 280, height: 160 },
      rememberLastUsedCamera: true
    };

    await scanner.start(
      { facingMode: "environment" },
      config,
      decodedText => {
        if (!decodedText) return;

        $("barcodeInput").value = normalizeBarcode(decodedText);
        stopCameraScanner();
        checkBarcode();
      },
      () => {
        // Scanner continuously checks frames. Ignore normal "no barcode found" messages.
      }
    );

    scannerRunning = true;
    $("startCameraButton").disabled = true;
    $("stopCameraButton").disabled = false;
    showToast("Camera scanner started.", "success");
  } catch (error) {
    console.error(error);
    showToast(
      "Could not start the camera. Check camera permission or use manual scanning.",
      "error"
    );
  }
}

async function stopCameraScanner() {
  if (!scanner || !scannerRunning) return;

  try {
    await scanner.stop();
    scanner.clear();
  } catch (error) {
    console.warn("Scanner stop warning:", error);
  }

  scanner = null;
  scannerRunning = false;
  $("startCameraButton").disabled = false;
  $("stopCameraButton").disabled = true;
}

// ---------- Loading history ----------

function getFilteredLoadingRecords() {
  const search = $("historySearch").value.trim().toLowerCase();
  const status = $("historyStatusFilter").value;
  const date = $("historyDateFilter").value;

  return loadingRecords
    .slice()
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .filter(record => {
      const searchText = [
        record.barcode,
        record.productCode,
        record.product,
        record.customer,
        record.truck,
        record.delivery,
        record.loadedBy
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch = !search || searchText.includes(search);
      const matchesStatus = status === "ALL" || record.status === status;
      const matchesDate = !date || record.date === date;

      return matchesSearch && matchesStatus && matchesDate;
    });
}

function renderLoadingHistory() {
  const records = getFilteredLoadingRecords();
  const body = $("historyBody");

  if (!records.length) {
    body.innerHTML = `<tr><td colspan="11" class="empty-table">No loading records found.</td></tr>`;
    return;
  }

  body.innerHTML = records
    .map(record => `
      <tr>
        <td>${escapeHtml(displayValue(record.date))}</td>
        <td>${escapeHtml(displayValue(record.time))}</td>
        <td>${escapeHtml(displayValue(record.truck))}</td>
        <td>${escapeHtml(displayValue(record.customer))}</td>
        <td>${escapeHtml(displayValue(record.delivery))}</td>
        <td><code>${escapeHtml(displayValue(record.barcode))}</code></td>
        <td>${escapeHtml(displayValue(record.product))}</td>
        <td>${escapeHtml(displayValue(record.cases))}</td>
        <td>${escapeHtml(displayValue(record.quantity))}</td>
        <td class="${getStatusClass(record.status)}">${escapeHtml(record.status)}</td>
        <td>${escapeHtml(displayValue(record.loadedBy))}</td>
      </tr>
    `)
    .join("");
}

function getStatusClass(status) {
  if (status === "LOADED") return "status-loaded";
  if (status === "ERROR") return "status-error";
  if (status === "DUPLICATE") return "status-duplicate";
  return "";
}

// ---------- Product master ----------

function renderProducts() {
  const search = $("productSearch").value.trim().toLowerCase();

  const filtered = products.filter(product => {
    if (!search) return true;

    return [
      product.barcode,
      product.productCode,
      product.description,
      product.customer,
      product.packSize,
      product.palletType
    ]
      .join(" ")
      .toLowerCase()
      .includes(search);
  });

  $("productCount").textContent = products.length;
  $("uniqueBarcodeCount").textContent = getUniqueBarcodeCount();

  if (!filtered.length) {
    $("productBody").innerHTML =
      `<tr><td colspan="7" class="empty-table">No products found.</td></tr>`;
    return;
  }

  $("productBody").innerHTML = filtered
    .map(product => `
      <tr>
        <td><code>${escapeHtml(product.barcode)}</code></td>
        <td>${escapeHtml(displayValue(product.productCode))}</td>
        <td>${escapeHtml(displayValue(product.description))}</td>
        <td>${escapeHtml(displayValue(product.customer))}</td>
        <td>${escapeHtml(displayValue(product.packSize))}</td>
        <td>${escapeHtml(displayValue(product.casesPerPallet))}</td>
        <td>${escapeHtml(displayValue(product.palletType))}</td>
      </tr>
    `)
    .join("");
}

// ---------- Barcode problems ----------

function openProblemModal(barcode, product) {
  problemBarcode = normalizeBarcode(barcode);
  problemProduct = product || getProductByBarcode(problemBarcode);

  $("problemBarcodePreview").innerHTML = `
    <strong>Barcode:</strong> ${escapeHtml(problemBarcode)}
    <br>
    <strong>Product:</strong> ${escapeHtml(displayValue(problemProduct?.description))}
  `;

  $("problemComment").value = "";
  $("problemReporter").value = currentSession?.user || "";
  $("problemModal").classList.remove("hidden");
  $("problemComment").focus();
}

function closeProblemModal() {
  $("problemModal").classList.add("hidden");
}

function saveProblem() {
  if (!problemBarcode) {
    showToast("No barcode selected.", "warning");
    return;
  }

  const problem = {
    id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
    timestamp: new Date().toISOString(),
    date: getToday(),
    time: new Date().toLocaleTimeString("en-ZA", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    }),
    barcode: problemBarcode,
    product: problemProduct?.description || "",
    problem: $("problemType").value,
    comment: $("problemComment").value.trim(),
    reportedBy: $("problemReporter").value.trim() || currentSession?.user || "",
    status: "OPEN"
  };

  barcodeProblems.push(problem);
  saveStorage(STORAGE_KEYS.problems, barcodeProblems);

  closeProblemModal();
  renderProblems();
  updateDashboard();

  showToast("Barcode problem reported.", "success");
}

function renderProblems() {
  const body = $("problemBody");

  const records = barcodeProblems
    .slice()
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  if (!records.length) {
    body.innerHTML = `<tr><td colspan="9" class="empty-table">No barcode problems reported.</td></tr>`;
    return;
  }

  body.innerHTML = records
    .map(problem => `
      <tr>
        <td>${escapeHtml(problem.date)}</td>
        <td>${escapeHtml(problem.time)}</td>
        <td><code>${escapeHtml(problem.barcode)}</code></td>
        <td>${escapeHtml(displayValue(problem.product))}</td>
        <td>${escapeHtml(problem.problem)}</td>
        <td>${escapeHtml(displayValue(problem.comment))}</td>
        <td>${escapeHtml(displayValue(problem.reportedBy))}</td>
        <td><span class="badge ${problem.status === "OPEN" ? "badge-warning" : "badge-success"}">${escapeHtml(problem.status)}</span></td>
        <td>
          <button class="small-button problem-status-button" data-id="${escapeHtml(problem.id)}">
            ${problem.status === "OPEN" ? "Resolve" : "Re-open"}
          </button>
        </td>
      </tr>
    `)
    .join("");

  document.querySelectorAll(".problem-status-button").forEach(button => {
    button.addEventListener("click", () => toggleProblemStatus(button.dataset.id));
  });
}

function toggleProblemStatus(id) {
  const problem = barcodeProblems.find(item => item.id === id);
  if (!problem) return;

  problem.status = problem.status === "OPEN" ? "RESOLVED" : "OPEN";
  saveStorage(STORAGE_KEYS.problems, barcodeProblems);
  renderProblems();
}

// ---------- Dashboard ----------

function updateDashboard() {
  const today = getToday();

  const todayRecords = loadingRecords.filter(record => record.date === today);
  const todayLoaded = todayRecords.filter(record => record.status === "LOADED");

  const valid = todayRecords.filter(record => record.status === "LOADED").length;
  const errors = todayRecords.filter(record => record.status === "ERROR").length;
  const duplicates = todayRecords.filter(record => record.status === "DUPLICATE").length;

  const customers = new Set(
    todayLoaded.map(record => record.customer).filter(Boolean)
  );

  const cases = todayLoaded.reduce(
    (sum, record) => sum + numberOrZero(record.cases),
    0
  );

  $("statPallets").textContent = todayLoaded.length;
  $("statValid").textContent = valid;
  $("statErrors").textContent = errors;
  $("statDuplicates").textContent = duplicates;
  $("statCustomers").textContent = customers.size;
  $("statCases").textContent = cases;

  const openProblems = barcodeProblems.filter(
    problem => problem.status === "OPEN"
  ).length;

  if (openProblems > 0) {
    $("problemAlert").innerHTML =
      `⚠ <strong>${openProblems} barcode problem(s) require attention.</strong>
       <button class="link-button" id="openProblemsFromAlert">Open Barcode Problems</button>`;
    $("problemAlert").classList.remove("hidden");

    $("openProblemsFromAlert").addEventListener("click", () => showSection("problems"));
  } else {
    $("problemAlert").classList.add("hidden");
  }

  updateSessionUI();
  renderRecentLoading();
}

function renderRecentLoading() {
  const records = loadingRecords
    .slice()
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 10);

  if (!records.length) {
    $("recentLoadingBody").innerHTML =
      `<tr><td colspan="6" class="empty-table">No loading activity yet.</td></tr>`;
    return;
  }

  $("recentLoadingBody").innerHTML = records
    .map(record => `
      <tr>
        <td>${escapeHtml(displayValue(record.time))}</td>
        <td>${escapeHtml(displayValue(record.truck))}</td>
        <td>${escapeHtml(displayValue(record.customer))}</td>
        <td><code>${escapeHtml(displayValue(record.barcode))}</code></td>
        <td>${escapeHtml(displayValue(record.product))}</td>
        <td class="${getStatusClass(record.status)}">${escapeHtml(record.status)}</td>
      </tr>
    `)
    .join("");
}

// ---------- Reports ----------

function renderReports() {
  const date = $("reportDate").value || getToday();
  $("reportDate").value = date;

  const records = loadingRecords.filter(
    record => record.date === date && record.status === "LOADED"
  );

  const errors = loadingRecords.filter(
    record => record.date === date && record.status === "ERROR"
  ).length;

  const duplicates = loadingRecords.filter(
    record => record.date === date && record.status === "DUPLICATE"
  ).length;

  const customers = new Set(records.map(record => record.customer).filter(Boolean));

  const cases = records.reduce(
    (sum, record) => sum + numberOrZero(record.cases),
    0
  );

  const quantity = records.reduce(
    (sum, record) => sum + numberOrZero(record.quantity),
    0
  );

  $("dailyReport").innerHTML = `
    <div class="report-card"><span>Pallets Loaded</span><strong>${records.length}</strong></div>
    <div class="report-card"><span>Cases Loaded</span><strong>${cases}</strong></div>
    <div class="report-card"><span>Quantity</span><strong>${quantity}</strong></div>
    <div class="report-card"><span>Customers</span><strong>${customers.size}</strong></div>
    <div class="report-card"><span>Errors</span><strong>${errors}</strong></div>
    <div class="report-card"><span>Duplicates</span><strong>${duplicates}</strong></div>
  `;

  const summary = {};

  records.forEach(record => {
    const customer = record.customer || "Unknown";

    if (!summary[customer]) {
      summary[customer] = {
        pallets: 0,
        cases: 0,
        quantity: 0
      };
    }

    summary[customer].pallets += 1;
    summary[customer].cases += numberOrZero(record.cases);
    summary[customer].quantity += numberOrZero(record.quantity);
  });

  const entries = Object.entries(summary);

  $("customerReportBody").innerHTML = entries.length
    ? entries.map(([customer, values]) => `
        <tr>
          <td>${escapeHtml(customer)}</td>
          <td>${values.pallets}</td>
          <td>${values.cases}</td>
          <td>${values.quantity}</td>
        </tr>
      `).join("")
    : `<tr><td colspan="4" class="empty-table">No loaded pallets for this date.</td></tr>`;
}

// ---------- CSV export ----------

function csvEscape(value) {
  const text = String(value ?? "");
  return `"${text.replaceAll('"', '""')}"`;
}

function downloadCSV(filename, rows) {
  if (!rows.length) {
    showToast("There is no data to export.", "warning");
    return;
  }

  const headers = Object.keys(rows[0]);

  const csv = [
    headers.map(csvEscape).join(","),
    ...rows.map(row => headers.map(header => csvEscape(row[header])).join(","))
  ].join("\r\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();

  URL.revokeObjectURL(url);
}

function exportLoadingHistory() {
  const rows = loadingRecords.map(record => ({
    Date: record.date,
    Time: record.time,
    "Truck Registration": record.truck,
    Customer: record.customer,
    "Delivery Number": record.delivery,
    Route: record.route,
    Barcode: record.barcode,
    "Product Code": record.productCode,
    "Product Description": record.product,
    "Pack Size": record.packSize,
    Cases: record.cases,
    Quantity: record.quantity,
    "Pallet Type": record.palletType,
    Status: record.status,
    "Loaded By": record.loadedBy
  }));

  downloadCSV(`dispatch-loading-history-${getToday()}.csv`, rows);
}

function exportProblems() {
  const rows = barcodeProblems.map(problem => ({
    Date: problem.date,
    Time: problem.time,
    Barcode: problem.barcode,
    Product: problem.product,
    Problem: problem.problem,
    Comment: problem.comment,
    "Reported By": problem.reportedBy,
    Status: problem.status
  }));

  downloadCSV(`barcode-problems-${getToday()}.csv`, rows);
}

function exportAllData() {
  const data = {
    exportedAt: new Date().toISOString(),
    products,
    loadingRecords,
    barcodeProblems,
    currentSession
  };

  const blob = new Blob(
    [JSON.stringify(data, null, 2)],
    { type: "application/json" }
  );

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = `dispatch-backup-${getToday()}.json`;

  document.body.appendChild(link);
  link.click();
  link.remove();

  URL.revokeObjectURL(url);
}

// ---------- Demo data ----------

function loadDemoData() {
  products = [
    {
      barcode: "6001234567890",
      productCode: "CC001",
      description: "Tomato Corn Crunch",
      customer: "Woolworths",
      packSize: "22g",
      casesPerPallet: "20",
      palletType: "CHEP"
    },
    {
      barcode: "6001234567891",
      productCode: "CC002",
      description: "Cheese Corn Crunch",
      customer: "Woolworths",
      packSize: "22g",
      casesPerPallet: "20",
      palletType: "CHEP"
    },
    {
      barcode: "6001234567892",
      productCode: "CC003",
      description: "Jalapeno Corn Crunch",
      customer: "Shoprite",
      packSize: "22g",
      casesPerPallet: "20",
      palletType: "CHEP"
    },
    {
      barcode: "0001234567895",
      productCode: "HS001",
      description: "Caramel HOP Strips",
      customer: "Checkers",
      packSize: "22g",
      casesPerPallet: "20",
      palletType: "CHEP"
    }
  ];

  saveStorage(STORAGE_KEYS.products, products);
  renderProducts();

  $("excelStatus").textContent =
    `Demo data loaded • Products: ${products.length} • Status: Ready for Scanning`;
  $("excelStatus").className = "alert alert-success";

  showToast("Demo product master loaded.", "success");
}

// ---------- Clear data ----------

function clearLoadingRecords() {
  if (!loadingRecords.length) {
    showToast("There are no loading records to clear.", "warning");
    return;
  }

  const confirmed = confirm(
    `Delete ${loadingRecords.length} loading record(s)?\n\nThis cannot be undone unless you exported a backup first.`
  );

  if (!confirmed) return;

  loadingRecords = [];
  saveStorage(STORAGE_KEYS.loading, loadingRecords);

  renderLoadingHistory();
  updateDashboard();
  renderReports();

  showToast("Loading records cleared.", "success");
}

function clearAllData() {
  const confirmed = confirm(
    "This will delete the product master, loading history, barcode problems and active session from this browser.\n\nContinue?"
  );

  if (!confirmed) return;

  Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));

  products = [];
  loadingRecords = [];
  barcodeProblems = [];
  currentSession = null;

  currentScannedProduct = null;
  currentScannedBarcode = "";

  renderProducts();
  renderLoadingHistory();
  renderProblems();
  updateDashboard();
  renderReports();
  updateSessionUI();

  $("excelStatus").textContent =
    "All local data cleared. Import an Excel file to begin.";
  $("excelStatus").className = "alert alert-info";

  showToast("All local data cleared.", "success");
}

// ---------- Event listeners ----------

document.addEventListener("DOMContentLoaded", () => {
  // Navigation
  document.querySelectorAll(".nav-button").forEach(button => {
    button.addEventListener("click", () => showSection(button.dataset.section));
  });

  document.querySelectorAll("[data-go]").forEach(button => {
    button.addEventListener("click", () => showSection(button.dataset.go));
  });

  $("menuButton").addEventListener("click", () => {
    $("mainNav").classList.toggle("open");
  });

  $("dashboardScanButton").addEventListener("click", () => {
    if (!currentSession) {
      openSessionModal();
      return;
    }
    showSection("scan");
  });

  $("startSessionFromScan").addEventListener("click", openSessionModal);

  // Session modal
  $("closeSessionModal").addEventListener("click", closeSessionModal);
  $("cancelSessionButton").addEventListener("click", closeSessionModal);
  $("startSessionButton").addEventListener("click", startSession);

  // Scan
  $("checkBarcodeButton").addEventListener("click", checkBarcode);

  $("barcodeInput").addEventListener("keydown", event => {
    if (event.key === "Enter") {
      event.preventDefault();
      checkBarcode();
    }
  });

  $("barcodeInput").addEventListener("input", () => {
    // If a handheld scanner sends characters quickly, this keeps the field ready.
    $("barcodeInput").value = $("barcodeInput").value.replace(/[\r\n]/g, "");
  });

  $("startCameraButton").addEventListener("click", startCameraScanner);
  $("stopCameraButton").addEventListener("click", stopCameraScanner);

  $("demoValidButton").addEventListener("click", () => {
    $("barcodeInput").value = "6001234567890";
    checkBarcode();
  });

  $("demoInvalidButton").addEventListener("click", () => {
    $("barcodeInput").value = "9999999999999";
    checkBarcode();
  });

  $("cancelLoadButton").addEventListener("click", () => {
    currentScannedProduct = null;
    currentScannedBarcode = "";
    hideLoadConfirmation();

    $("scanResult").className = "scan-result empty";
    $("scanResult").innerHTML = `
      <div class="result-icon">⌕</div>
      <h3>Ready to Scan</h3>
      <p>Scan or enter a pallet barcode.</p>
    `;

    $("barcodeInput").value = "";
    focusBarcodeInput();
  });

  $("confirmLoadButton").addEventListener("click", confirmLoad);

  // Product master
  $("importExcelButton").addEventListener("click", importExcel);
  $("excelFileInput").addEventListener("change", handleExcelFile);
  $("loadDemoDataButton").addEventListener("click", loadDemoData);
  $("productSearch").addEventListener("input", renderProducts);

  // History
  $("historySearch").addEventListener("input", renderLoadingHistory);
  $("historyStatusFilter").addEventListener("change", renderLoadingHistory);
  $("historyDateFilter").addEventListener("change", renderLoadingHistory);
  $("exportHistoryButton").addEventListener("click", exportLoadingHistory);

  // Problems
  $("closeProblemModal").addEventListener("click", closeProblemModal);
  $("cancelProblemButton").addEventListener("click", closeProblemModal);
  $("saveProblemButton").addEventListener("click", saveProblem);
  $("exportProblemsButton").addEventListener("click", exportProblems);

  // Reports
  $("reportDate").addEventListener("change", renderReports);

  // Settings
  $("exportAllButton").addEventListener("click", exportAllData);
  $("clearRecordsButton").addEventListener("click", clearLoadingRecords);
  $("clearAllButton").addEventListener("click", clearAllData);

  // Initial UI
  $("reportDate").value = getToday();
  renderProducts();
  renderLoadingHistory();
  renderProblems();
  renderReports();
  updateDashboard();
  updateSessionUI();

  // Warn if the user tries to leave while camera is active.
  window.addEventListener("beforeunload", () => {
    if (scannerRunning) {
      try {
        scanner.stop();
      } catch (error) {
        // Ignore cleanup errors.
      }
    }
  });
});
