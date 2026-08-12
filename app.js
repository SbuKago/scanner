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

let products = loadStorage(STORAGE_KEYS.products, []);
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
  if (value === undefined || value === null) return "";

  // Convert to string and clean all whitespace, including non-breaking spaces & unicode control chars
  let str = String(value)
    .trim()
    .replace(/[\s\u00A0\u200B-\u200D\uFEFF]/g, "");

  // Handle scientific notation (e.g. 6.00921e+12 -> 6009211225657)
  if (/^[+-]?\d+(\.\d+)?[eE][+-]?\d+$/.test(str)) {
    try {
      const num = Number(str);
      if (!isNaN(num)) {
        str = num.toLocaleString("fullwide", { useGrouping: false });
      }
    } catch (e) {
      console.warn("Could not parse scientific notation barcode:", str);
    }
  }

  // Strip trailing decimal zeroes from Excel float conversions (e.g. "6009211225657.0")
  if (/^\d+\.0+$/.test(str)) {
    str = str.split(".")[0];
  }

  return str;
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
      cellText: false,
      raw: true
    });

    const firstSheetName = workbook.SheetNames[0];

    if (!firstSheetName) {
      throw new Error("The Excel file does not contain a worksheet.");
    }

    const sheet = workbook.Sheets[firstSheetName];

    const rows = XLSX.utils.sheet_to_json(sheet, {
      defval: "",
      raw: true
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
    .replace(/[\s\u00A0_\-/]+/g, "");
}

function findColumn(row, possibleNames) {
  const keys = Object.keys(row);

  for (const name of possibleNames) {
    const wanted = normalizeHeader(name);

    const exact = keys.find(key => normalizeHeader(key) === wanted);
    if (exact) return exact;
  }

  // Fallback match by header substring
  for (const key of keys) {
    const normalized = normalizeHeader(key);

    if (possibleNames.some(name => normalized.includes(normalizeHeader(name)))) {
      return key;
    }
  }

  return null;
}

function normalizeProductRow(row) {
  let barcodeColumn = findColumn(row, [
    "Barcode",
    "Bar Code",
    "Pallet Barcode",
    "EAN",
    "UPC",
    "GTIN",
    "Barcode Number",
    "Code Number"
  ]);

  // Dynamic fallback: look across all columns for numeric digits
  if (!barcodeColumn) {
    const keys = Object.keys(row);
    barcodeColumn = keys.find(k => {
      const val = normalizeBarcode(row[k]);
      return /^\d{6,18}$/.test(val);
    });
  }

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
  return new Set(products.map(product => normalizeBarcode(product.barcode))).size;
}

function getProductByBarcode(barcode) {
  const normalized = normalizeBarcode(barcode);
  if (!normalized) return null;

  return products.find(product => normalizeBarcode(product.barcode) === normalized) || null;
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
      () => {}
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
  renderReports();
  updateDashboard();
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
    $("barcodeInput").value = $("barcodeInput").value.replace(/[\r\n]/g, "");
  });

  $("startCameraButton").addEventListener("click", startCameraScanner);
  $("stopCameraButton").addEventListener("click", stopCameraScanner);

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

  window.addEventListener("beforeunload", () => {
    if (scannerRunning) {
      try {
        scanner.stop();
      } catch (error) {
        // Ignore cleanup errors
      }
    }
  });
});