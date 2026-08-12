(function () {
  "use strict";

  /*
    Dispatch Barcode Tracker
    Local-first Vanilla JavaScript.
  */

  const STORAGE_KEYS = {
    products: "dispatch_product_master",
    loading: "dispatch_loading_records",
    problems: "dispatch_barcode_problems",
    session: "dispatch_session"
  };

  // Default demo dataset loaded automatically if empty
  const DEFAULT_DEMO_PRODUCTS = [
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

  let products = loadStorage(STORAGE_KEYS.products, null);
  if (!products || !Array.isArray(products) || products.length === 0) {
    products = DEFAULT_DEMO_PRODUCTS;
    saveStorage(STORAGE_KEYS.products, products);
  }

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
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error("Could not save to local storage:", error);
    }
  }

  function normalizeBarcode(value) {
    return String(value ?? "")
      .trim()
      .replace(/[\s\r\n\t]/g, "");
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
    if (!toast) return;
    toast.textContent = message;
    toast.className = `toast ${type}`;
    toast.classList.remove("hidden");

    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => {
      toast.classList.add("hidden");
    }, 3500);
  }

  // ---------- Navigation ----------

  function showSection(sectionId) {
    document.querySelectorAll(".page-section").forEach(section => {
      section.classList.toggle("active", section.id === sectionId);
    });

    document.querySelectorAll(".nav-button").forEach(button => {
      button.classList.toggle("active", button.dataset.section === sectionId);
    });

    if ($("mainNav")) $("mainNav").classList.remove("open");

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

  function ensureActiveSession() {
    if (!currentSession) {
      currentSession = {
        id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
        name: "Demo Session",
        user: "Tester",
        truck: "TRK-01-GP",
        customer: "Woolworths",
        delivery: "DEL-99812",
        route: "JHB Central",
        startedAt: new Date().toISOString()
      };
      saveStorage(STORAGE_KEYS.session, currentSession);
      updateSessionUI();
    }
  }

  function openSessionModal() {
    if ($("sessionName")) $("sessionName").value = "";
    if ($("sessionUser")) $("sessionUser").value = currentSession?.user || "";
    if ($("sessionTruck")) $("sessionTruck").value = currentSession?.truck || "";
    if ($("sessionCustomer")) $("sessionCustomer").value = currentSession?.customer || "";
    if ($("sessionDelivery")) $("sessionDelivery").value = currentSession?.delivery || "";
    if ($("sessionRoute")) $("sessionRoute").value = currentSession?.route || "";
    if ($("sessionModal")) $("sessionModal").classList.remove("hidden");
    if ($("sessionName")) $("sessionName").focus();
  }

  function closeSessionModal() {
    if ($("sessionModal")) $("sessionModal").classList.add("hidden");
  }

  function startSession() {
    const user = $("sessionUser") ? $("sessionUser").value.trim() : "";
    const truck = $("sessionTruck") ? $("sessionTruck").value.trim() : "";
    const customer = $("sessionCustomer") ? $("sessionCustomer").value.trim() : "";
    const delivery = $("sessionDelivery") ? $("sessionDelivery").value.trim() : "";

    if (!user || !truck || !customer || !delivery) {
      showToast("Please enter employee, truck, customer and delivery information.", "warning");
      return;
    }

    currentSession = {
      id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
      name: ($("sessionName") && $("sessionName").value.trim()) || "Loading Session",
      user,
      truck,
      customer,
      delivery,
      route: $("sessionRoute") ? $("sessionRoute").value.trim() : "",
      startedAt: new Date().toISOString()
    };

    saveStorage(STORAGE_KEYS.session, currentSession);
    closeSessionModal();
    updateSessionUI();
    showSection("scan");
    showToast("Loading session started.", "success");
  }

  function updateSessionUI() {
    const hasSession = Boolean(currentSession);

    if ($("scanSessionBadge")) {
      $("scanSessionBadge").textContent = hasSession ? "SESSION ACTIVE" : "NO SESSION";
      $("scanSessionBadge").className = `badge ${hasSession ? "badge-success" : "badge-neutral"}`;
    }

    if ($("sessionBadge")) {
      $("sessionBadge").textContent = hasSession ? "SESSION ACTIVE" : "NO SESSION";
      $("sessionBadge").className = `badge ${hasSession ? "badge-success" : "badge-neutral"}`;
    }

    if ($("noSessionWarning")) {
      $("noSessionWarning").classList.toggle("hidden", hasSession);
    }

    if (hasSession) {
      if ($("dashboardSessionText")) {
        $("dashboardSessionText").textContent =
          `${currentSession.customer} • ${currentSession.truck} • ${currentSession.delivery}`;
      }

      if ($("sessionSummary")) {
        $("sessionSummary").innerHTML = `
          <div class="session-item"><small>User</small><strong>${escapeHtml(currentSession.user)}</strong></div>
          <div class="session-item"><small>Truck</small><strong>${escapeHtml(currentSession.truck)}</strong></div>
          <div class="session-item"><small>Customer</small><strong>${escapeHtml(currentSession.customer)}</strong></div>
          <div class="session-item"><small>Delivery</small><strong>${escapeHtml(currentSession.delivery)}</strong></div>
        `;
      }
    } else {
      if ($("dashboardSessionText")) $("dashboardSessionText").textContent = "No active session.";
      if ($("sessionSummary")) {
        $("sessionSummary").innerHTML = `
          <div class="empty-table">Start a loading session to begin scanning pallets.</div>
        `;
      }
    }
  }

  function updateScanSessionUI() {
    updateSessionUI();
  }

  // ---------- Excel Import ----------

  function importExcel() {
    if ($("excelFileInput")) $("excelFileInput").click();
  }

  async function handleExcelFile(event) {
    const file = event.target.files[0];
    if (!file) return;

    try {
      if (typeof XLSX === "undefined") {
        throw new Error("The Excel reader library did not load. Check internet connection.");
      }

      if ($("excelStatus")) {
        $("excelStatus").textContent = `Reading ${file.name}...`;
        $("excelStatus").className = "alert alert-info";
      }

      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: "array", cellText: true, cellDates: false });
      const firstSheetName = workbook.SheetNames[0];

      if (!firstSheetName) throw new Error("The Excel file contains no worksheets.");

      const sheet = workbook.Sheets[firstSheetName];
      const rows = XLSX.utils.sheet_to_json(sheet, { defval: "", raw: false });

      if (!rows.length) throw new Error("The worksheet is empty.");

      const importedProducts = rows
        .map(row => normalizeProductRow(row))
        .filter(product => product.barcode);

      if (!importedProducts.length) {
        throw new Error("No barcode values found. Ensure your sheet has a 'Barcode' column.");
      }

      products = importedProducts;
      saveStorage(STORAGE_KEYS.products, products);

      renderProducts();
      updateDashboard();

      if ($("excelStatus")) {
        $("excelStatus").textContent =
          `File: ${file.name} • Products: ${products.length} • Unique Barcodes: ${getUniqueBarcodeCount()} • Status: Ready`;
        $("excelStatus").className = "alert alert-success";
      }

      showToast(`${products.length} products imported.`, "success");
    } catch (error) {
      console.error(error);
      if ($("excelStatus")) {
        $("excelStatus").textContent = `Import failed: ${error.message}`;
        $("excelStatus").className = "alert alert-error";
      }
      showToast(error.message, "error");
    } finally {
      event.target.value = "";
    }
  }

  function normalizeHeader(header) {
    return String(header ?? "").trim().toLowerCase().replace(/[\s_\-/]+/g, "");
  }

  function findColumn(row, possibleNames) {
    const keys = Object.keys(row);
    for (const name of possibleNames) {
      const wanted = normalizeHeader(name);
      const exact = keys.find(key => normalizeHeader(key) === wanted);
      if (exact) return exact;
    }
    for (const key of keys) {
      const normalized = normalizeHeader(key);
      if (possibleNames.some(name => normalized.includes(normalizeHeader(name)))) return key;
    }
    return null;
  }

  function normalizeProductRow(row) {
    const barcodeColumn = findColumn(row, ["Barcode", "Bar Code", "Pallet Barcode", "EAN", "UPC", "GTIN"]);
    const productCodeColumn = findColumn(row, ["Product Code", "ProductCode", "SKU", "Item Code"]);
    const descriptionColumn = findColumn(row, ["Product Description", "Product", "Description", "Product Name"]);
    const customerColumn = findColumn(row, ["Customer", "Customer Name"]);
    const packSizeColumn = findColumn(row, ["Pack Size", "PackSize", "Size"]);
    const casesColumn = findColumn(row, ["Cases Per Pallet", "Cases/Pallet", "Cases"]);
    const palletTypeColumn = findColumn(row, ["Pallet Type", "Pallet"]);

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
    return new Set((products || []).map(product => product.barcode)).size;
  }

  function getProductByBarcode(barcode) {
    const normalized = normalizeBarcode(barcode);
    return (products || []).find(product => normalizeBarcode(product.barcode) === normalized) || null;
  }

  // ---------- Barcode Verification ----------

  function checkBarcode() {
    const inputField = $("barcodeInput");
    if (!inputField) return;

    const barcode = normalizeBarcode(inputField.value);

    if (!barcode) {
      showToast("Enter or scan a barcode first.", "warning");
      focusBarcodeInput();
      return;
    }

    ensureActiveSession();

    currentScannedBarcode = barcode;
    const product = getProductByBarcode(barcode);
    currentScannedProduct = product;

    const previousLoads = loadingRecords.filter(
      record => normalizeBarcode(record.barcode) === barcode && record.status === "LOADED"
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
    const resultBox = $("scanResult");
    if (!resultBox) return;

    resultBox.className = "scan-result success";
    resultBox.innerHTML = `
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
    const resultBox = $("scanResult");
    if (!resultBox) return;

    resultBox.className = "scan-result error";
    resultBox.innerHTML = `
      <div class="result-icon">✕</div>
      <h3>BARCODE NOT FOUND</h3>
      <p><strong>Barcode:</strong> ${escapeHtml(barcode)}</p>
      <p>This barcode does not exist in the product master.</p>
      <p><strong>DO NOT LOAD THIS PALLET</strong></p>
      <button id="reportUnknownButton" class="danger-button">Report Barcode Problem</button>
    `;

    if ($("reportUnknownButton")) {
      $("reportUnknownButton").addEventListener("click", () => openProblemModal(barcode, null));
    }

    hideLoadConfirmation();
  }

  function showDuplicateResult(barcode, previousLoads) {
    const last = previousLoads[previousLoads.length - 1];
    const date = formatDateTime(last.timestamp);
    const resultBox = $("scanResult");

    if (resultBox) {
      resultBox.className = "scan-result warning";
      resultBox.innerHTML = `
        <div class="result-icon">⚠</div>
        <h3>DUPLICATE PALLET</h3>
        <p><strong>Barcode:</strong> ${escapeHtml(barcode)}</p>
        <p>This barcode has already been loaded.</p>
        <p><strong>Loaded:</strong> ${escapeHtml(date.date)} ${escapeHtml(date.time)}</p>
        <p><strong>Truck:</strong> ${escapeHtml(displayValue(last.truck))}</p>
        <button id="reportDuplicateButton" class="danger-button">Report Duplicate Barcode</button>
      `;

      if ($("reportDuplicateButton")) {
        $("reportDuplicateButton").addEventListener("click", () => openProblemModal(barcode, currentScannedProduct));
      }
    }

    if ($("duplicatePanel")) {
      $("duplicatePanel").innerHTML = `
        <strong>⚠ Duplicate scan detected.</strong>
        This pallet barcode already exists in the loading history.
      `;
      $("duplicatePanel").classList.remove("hidden");
    }

    hideLoadConfirmation();
  }

  function focusBarcodeInput() {
    if ($("scan") && $("scan").classList.contains("active") && $("barcodeInput")) {
      $("barcodeInput").focus();
    }
  }

  function hideLoadConfirmation() {
    if ($("loadConfirmationPanel")) $("loadConfirmationPanel").classList.add("hidden");
    if ($("duplicatePanel")) $("duplicatePanel").classList.add("hidden");
  }

  function updateCalculatedQuantity() {
    if (!$("loadCases") || !$("loadQuantity")) return;

    const cases = numberOrZero($("loadCases").value);
    
    // Extract numerical units per case multiplier if available in packSize (e.g. "24x100g")
    let unitsPerCase = 1;
    if (currentScannedProduct && currentScannedProduct.packSize) {
      const match = String(currentScannedProduct.packSize).match(/^(\d+)/);
      if (match) {
        unitsPerCase = parseInt(match[1], 10) || 1;
      }
    }

    const calculatedQuantity = cases * unitsPerCase;
    $("loadQuantity").value = calculatedQuantity > 0 ? calculatedQuantity : "";
  }

  function showLoadConfirmation(product) {
    if ($("duplicatePanel")) $("duplicatePanel").classList.add("hidden");
    if ($("loadConfirmationPanel")) $("loadConfirmationPanel").classList.remove("hidden");

    if ($("loadTruck")) $("loadTruck").value = currentSession?.truck || "";
    if ($("loadCustomer")) $("loadCustomer").value = currentSession?.customer || product.customer || "";
    if ($("loadDelivery")) $("loadDelivery").value = currentSession?.delivery || "";
    if ($("loadRoute")) $("loadRoute").value = currentSession?.route || "";
    if ($("loadCases")) $("loadCases").value = product.casesPerPallet || "";
    
    // Auto-calculate initial quantity based on cases and pack size
    updateCalculatedQuantity();

    if ($("loadPalletType")) $("loadPalletType").value = product.palletType || "";
    if ($("loadUser")) $("loadUser").value = currentSession?.user || "";

    if ($("loadProductSummary")) {
      $("loadProductSummary").innerHTML = `
        <div class="summary-item"><small>Barcode</small><strong>${escapeHtml(product.barcode)}</strong></div>
        <div class="summary-item"><small>Product Code</small><strong>${escapeHtml(displayValue(product.productCode))}</strong></div>
        <div class="summary-item"><small>Product</small><strong>${escapeHtml(displayValue(product.description))}</strong></div>
        <div class="summary-item"><small>Customer</small><strong>${escapeHtml(displayValue(product.customer))}</strong></div>
        <div class="summary-item"><small>Pack Size</small><strong>${escapeHtml(displayValue(product.packSize))}</strong></div>
        <div class="summary-item"><small>Cases/Pallet</small><strong>${escapeHtml(displayValue(product.casesPerPallet))}</strong></div>
      `;
    }

    if ($("loadTruck")) $("loadTruck").focus();
  }

  function confirmLoad() {
    ensureActiveSession();

    if (!currentScannedProduct || !currentScannedBarcode) {
      showToast("No valid barcode selected.", "warning");
      return;
    }

    const truck = $("loadTruck") ? $("loadTruck").value.trim() : "";
    const customer = $("loadCustomer") ? $("loadCustomer").value.trim() : "";
    const delivery = $("loadDelivery") ? $("loadDelivery").value.trim() : "";
    const loadedBy = $("loadUser") ? $("loadUser").value.trim() : "";

    if (!truck || !customer || !delivery || !loadedBy) {
      showToast("Truck, customer, delivery, and loaded-by fields are required.", "warning");
      return;
    }

    const record = {
      id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
      sessionId: currentSession.id,
      timestamp: new Date().toISOString(),
      date: getToday(),
      time: new Date().toLocaleTimeString("en-ZA", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
      truck,
      customer,
      delivery,
      route: $("loadRoute") ? $("loadRoute").value.trim() : "",
      barcode: currentScannedBarcode,
      productCode: currentScannedProduct.productCode,
      product: currentScannedProduct.description,
      packSize: currentScannedProduct.packSize,
      cases: numberOrZero($("loadCases") ? $("loadCases").value : 0),
      quantity: numberOrZero($("loadQuantity") ? $("loadQuantity").value : 0),
      palletType: $("loadPalletType") ? $("loadPalletType").value.trim() : "",
      status: "LOADED",
      loadedBy
    };

    loadingRecords.push(record);
    saveStorage(STORAGE_KEYS.loading, loadingRecords);

    currentScannedProduct = null;
    currentScannedBarcode = "";

    if ($("barcodeInput")) $("barcodeInput").value = "";
    hideLoadConfirmation();

    if ($("scanResult")) {
      $("scanResult").className = "scan-result success";
      $("scanResult").innerHTML = `
        <div class="result-icon">✓</div>
        <h3>PALLET LOADED</h3>
        <p>Barcode ${escapeHtml(record.barcode)} was successfully recorded.</p>
        <p>Ready for the next pallet.</p>
      `;
    }

    updateDashboard();
    renderLoadingHistory();
    renderReports();
    showToast("Pallet loading saved.", "success");

    setTimeout(() => {
      focusBarcodeInput();
    }, 250);
  }

  function numberOrZero(value) {
    const number = Number(value);
    return Number.isFinite(number) ? number : 0;
  }

  // ---------- Camera Scanner ----------

  async function startCameraScanner() {
    if (scannerRunning) return;

    if (typeof Html5Qrcode === "undefined") {
      showToast("Camera scanner library did not load.", "error");
      return;
    }

    try {
      scanner = new Html5Qrcode("reader");
      const config = { fps: 10, qrbox: { width: 280, height: 160 } };

      await scanner.start(
        { facingMode: "environment" },
        config,
        decodedText => {
          if (!decodedText) return;
          if ($("barcodeInput")) $("barcodeInput").value = normalizeBarcode(decodedText);
          stopCameraScanner();
          checkBarcode();
        },
        () => {}
      );

      scannerRunning = true;
      if ($("startCameraButton")) $("startCameraButton").disabled = true;
      if ($("stopCameraButton")) $("stopCameraButton").disabled = false;
      showToast("Camera scanner started.", "success");
    } catch (error) {
      console.error(error);
      showToast("Could not start camera. Use manual entry.", "error");
    }
  }

  async function stopCameraScanner() {
    if (!scanner || !scannerRunning) return;
    try {
      await scanner.stop();
      scanner.clear();
    } catch (error) {
      console.warn("Scanner stop:", error);
    }
    scanner = null;
    scannerRunning = false;
    if ($("startCameraButton")) $("startCameraButton").disabled = false;
    if ($("stopCameraButton")) $("stopCameraButton").disabled = true;
  }

  // ---------- History & Products Rendering ----------

  function renderLoadingHistory() {
    const body = $("historyBody");
    if (!body) return;

    if (!loadingRecords.length) {
      body.innerHTML = `<tr><td colspan="11" class="empty-table">No loading records found.</td></tr>`;
      return;
    }

    body.innerHTML = loadingRecords
      .slice()
      .reverse()
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
          <td class="status-loaded">${escapeHtml(record.status)}</td>
          <td>${escapeHtml(displayValue(record.loadedBy))}</td>
        </tr>
      `)
      .join("");
  }

  function renderProducts() {
    if ($("productCount")) $("productCount").textContent = (products || []).length;
    if ($("uniqueBarcodeCount")) $("uniqueBarcodeCount").textContent = getUniqueBarcodeCount();

    const body = $("productBody");
    if (!body) return;

    if (!products.length) {
      body.innerHTML = `<tr><td colspan="7" class="empty-table">No products found.</td></tr>`;
      return;
    }

    body.innerHTML = products
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

  // ---------- Problems & Reports ----------

  function openProblemModal(barcode, product) {
    problemBarcode = normalizeBarcode(barcode);
    problemProduct = product || getProductByBarcode(problemBarcode);

    if ($("problemBarcodePreview")) {
      $("problemBarcodePreview").innerHTML = `
        <strong>Barcode:</strong> ${escapeHtml(problemBarcode)}<br>
        <strong>Product:</strong> ${escapeHtml(displayValue(problemProduct?.description))}
      `;
    }

    if ($("problemComment")) $("problemComment").value = "";
    if ($("problemModal")) $("problemModal").classList.remove("hidden");
  }

  function closeProblemModal() {
    if ($("problemModal")) $("problemModal").classList.add("hidden");
  }

  function saveProblem() {
    if (!problemBarcode) return;

    const problem = {
      id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
      date: getToday(),
      time: new Date().toLocaleTimeString("en-ZA"),
      barcode: problemBarcode,
      product: problemProduct?.description || "",
      problem: $("problemType") ? $("problemType").value : "Issue",
      comment: $("problemComment") ? $("problemComment").value.trim() : "",
      reportedBy: ($("problemReporter") && $("problemReporter").value.trim()) || currentSession?.user || "Tester",
      status: "OPEN"
    };

    barcodeProblems.push(problem);
    saveStorage(STORAGE_KEYS.problems, barcodeProblems);
    closeProblemModal();
    renderProblems();
    showToast("Barcode problem reported.", "success");
  }

  function renderProblems() {
    const body = $("problemBody");
    if (!body) return;

    if (!barcodeProblems.length) {
      body.innerHTML = `<tr><td colspan="9" class="empty-table">No problems reported.</td></tr>`;
      return;
    }

    body.innerHTML = barcodeProblems.map(p => `
      <tr>
        <td>${escapeHtml(p.date)}</td>
        <td>${escapeHtml(p.time)}</td>
        <td><code>${escapeHtml(p.barcode)}</code></td>
        <td>${escapeHtml(displayValue(p.product))}</td>
        <td>${escapeHtml(p.problem)}</td>
        <td>${escapeHtml(displayValue(p.comment))}</td>
        <td>${escapeHtml(displayValue(p.reportedBy))}</td>
        <td><span class="badge badge-warning">${escapeHtml(p.status)}</span></td>
        <td>-</td>
      </tr>
    `).join("");
  }

  function renderReports() {
    if (!$("reportDate")) return;
    const date = $("reportDate").value || getToday();
    $("reportDate").value = date;

    const records = loadingRecords.filter(r => r.date === date && r.status === "LOADED");
    if ($("dailyReport")) {
      $("dailyReport").innerHTML = `
        <div class="report-card"><span>Pallets Loaded</span><strong>${records.length}</strong></div>
      `;
    }
  }

  function updateDashboard() {
    const today = getToday();
    const todayLoaded = loadingRecords.filter(r => r.date === today && r.status === "LOADED");

    if ($("statPallets")) $("statPallets").textContent = todayLoaded.length;
    if ($("statValid")) $("statValid").textContent = todayLoaded.length;

    updateSessionUI();
  }

  function loadDemoData() {
    products = DEFAULT_DEMO_PRODUCTS;
    saveStorage(STORAGE_KEYS.products, products);
    renderProducts();
    if ($("excelStatus")) {
      $("excelStatus").textContent = `Demo data loaded • Products: ${products.length}`;
      $("excelStatus").className = "alert alert-success";
    }
    showToast("Demo data loaded.", "success");
  }

  // ---------- Event Listeners ----------

  document.addEventListener("DOMContentLoaded", () => {
    // Navigation
    document.querySelectorAll(".nav-button").forEach(btn => {
      btn.addEventListener("click", () => showSection(btn.dataset.section));
    });

    document.querySelectorAll("[data-go]").forEach(btn => {
      btn.addEventListener("click", () => showSection(btn.dataset.go));
    });

    if ($("menuButton")) {
      $("menuButton").addEventListener("click", () => {
        if ($("mainNav")) $("mainNav").classList.toggle("open");
      });
    }

    if ($("dashboardScanButton")) {
      $("dashboardScanButton").addEventListener("click", () => {
        ensureActiveSession();
        showSection("scan");
      });
    }

    if ($("startSessionFromScan")) $("startSessionFromScan").addEventListener("click", openSessionModal);
    if ($("closeSessionModal")) $("closeSessionModal").addEventListener("click", closeSessionModal);
    if ($("cancelSessionButton")) $("cancelSessionButton").addEventListener("click", closeSessionModal);
    if ($("startSessionButton")) $("startSessionButton").addEventListener("click", startSession);

    // Barcode Verification
    if ($("checkBarcodeButton")) $("checkBarcodeButton").addEventListener("click", checkBarcode);

    if ($("barcodeInput")) {
      $("barcodeInput").addEventListener("keydown", e => {
        if (e.key === "Enter") {
          e.preventDefault();
          checkBarcode();
        }
      });
    }

    // Demo Buttons (Auto-start session if needed)
    if ($("demoValidButton")) {
      $("demoValidButton").addEventListener("click", () => {
        ensureActiveSession();
        if ($("barcodeInput")) $("barcodeInput").value = "6001234567890";
        checkBarcode();
      });
    }

    if ($("demoInvalidButton")) {
      $("demoInvalidButton").addEventListener("click", () => {
        ensureActiveSession();
        if ($("barcodeInput")) $("barcodeInput").value = "9999999999999";
        checkBarcode();
      });
    }

    if ($("confirmLoadButton")) $("confirmLoadButton").addEventListener("click", confirmLoad);
    if ($("cancelLoadButton")) {
      $("cancelLoadButton").addEventListener("click", () => {
        hideLoadConfirmation();
        if ($("barcodeInput")) $("barcodeInput").value = "";
      });
    }

    // Camera
    if ($("startCameraButton")) $("startCameraButton").addEventListener("click", startCameraScanner);
    if ($("stopCameraButton")) $("stopCameraButton").addEventListener("click", stopCameraScanner);

    // Excel & Products
    if ($("importExcelButton")) $("importExcelButton").addEventListener("click", importExcel);
    if ($("excelFileInput")) $("excelFileInput").addEventListener("change", handleExcelFile);
    if ($("loadDemoDataButton")) $("loadDemoDataButton").addEventListener("click", loadDemoData);

    // Problems
    if ($("closeProblemModal")) $("closeProblemModal").addEventListener("click", closeProblemModal);
    if ($("cancelProblemButton")) $("cancelProblemButton").addEventListener("click", closeProblemModal);
    if ($("saveProblemButton")) $("saveProblemButton").addEventListener("click", saveProblem);

    // Auto-calculate units/quantity when cases input changes
    if ($("loadCases")) {
      $("loadCases").addEventListener("input", updateCalculatedQuantity);
      $("loadCases").addEventListener("change", updateCalculatedQuantity);
    }

    // Initial Renders
    renderProducts();
    renderLoadingHistory();
    renderProblems();
    renderReports();
    updateDashboard();
  });
})();