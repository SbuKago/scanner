(function () {
  "use strict";

  /* =========================================================
     STORAGE
  ========================================================= */

  const STORAGE_KEYS = {
    products: "dispatch_product_master",
    loading: "dispatch_loading_records",
    problems: "dispatch_barcode_problems",
    session: "dispatch_session"
  };

  const AUTHORIZED_USERS = [
    "Sibusiso Makhonjwa",
    "Afection",
    "Boitumelo"
  ];

  /* =========================================================
     PRODUCT MASTER
     
     KEEP YOUR COMPLETE FULL_PRODUCT_MASTER ARRAY HERE.
     Use the exact product master from your current version.
  ========================================================= */

  const FULL_PRODUCT_MASTER = [
    // ---------------------------------------------------------
    // PASTE YOUR COMPLETE PRODUCT MASTER HERE
    // ---------------------------------------------------------
    // Example:
    /*
    {
      productCode: "413817",
      outerBarcode: "#N/A",
      barcode: "6009211225657",
      product: "Lentil & Quinoa Pop Chips – Creamy Cheddar",
      packSize: "85 g",
      sellBy: "112",
      bb: "98",
      casesPerPallet: "32",
      unitsPerCase: "12",
      unitsPerOuter: "#N/A"
    }
    */
  ];

  /* =========================================================
     APPLICATION STATE
  ========================================================= */

  let products = loadStorage(
    STORAGE_KEYS.products,
    FULL_PRODUCT_MASTER
  );

  let loadingRecords = loadStorage(
    STORAGE_KEYS.loading,
    []
  );

  let barcodeProblems = loadStorage(
    STORAGE_KEYS.problems,
    []
  );

  let currentSession = loadStorage(
    STORAGE_KEYS.session,
    null
  );

  let currentScannedProduct = null;
  let currentScannedBarcode = "";

  let html5QrCode = null;


  /* =========================================================
     BASIC HELPERS
  ========================================================= */

  function $(id) {
    return document.getElementById(id);
  }


  function loadStorage(key, fallback) {
    try {
      const value = localStorage.getItem(key);

      if (!value) {
        return fallback;
      }

      return JSON.parse(value);
    } catch (error) {
      console.error(`Storage read error for ${key}:`, error);
      return fallback;
    }
  }


  function saveStorage(key, value) {
    try {
      localStorage.setItem(
        key,
        JSON.stringify(value)
      );
    } catch (error) {
      console.error(`Storage write error for ${key}:`, error);
    }
  }


  function normalizeCode(value) {
    return String(value ?? "")
      .trim()
      .replace(/[\s\r\n\t]/g, "")
      .replace(/^["']+|["']+$/g, "")
      .toLowerCase();
  }


  function cleanNumber(value) {
    if (
      value === null ||
      value === undefined ||
      value === ""
    ) {
      return 0;
    }

    const match = String(value).match(/\d+/);

    return match
      ? parseInt(match[0], 10)
      : 0;
  }


  function displayValue(value) {
    if (
      value === undefined ||
      value === null ||
      value === "" ||
      value === "#N/A"
    ) {
      return "-";
    }

    return String(value);
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
    return new Date()
      .toISOString()
      .slice(0, 10);
  }


  /* =========================================================
     TOAST
  ========================================================= */

  function showToast(message, type = "") {
    const toast = $("toast");

    if (!toast) {
      console.log(message);
      return;
    }

    toast.textContent = message;
    toast.className = `toast ${type}`;

    toast.classList.remove("hidden");

    clearTimeout(showToast.timer);

    showToast.timer = setTimeout(() => {
      toast.classList.add("hidden");
    }, 3500);
  }


  /* =========================================================
     PRODUCT FUNCTIONS
  ========================================================= */

  function getProductDescription(product) {
    if (!product) {
      return "-";
    }

    return (
      product.product ||
      product.description ||
      product["Product Description"] ||
      "-"
    );
  }


  function getProductBB(product) {
    if (!product) {
      return "-";
    }

    return (
      product.bb ||
      product.bbDate ||
      product["Best Before (BB)"] ||
      product.bestBefore ||
      "-"
    );
  }


  function getEffectiveOuterBarcode(product) {
    if (!product) {
      return "-";
    }

    const outer = String(
      product.outerBarcode ?? ""
    ).trim();

    if (
      outer !== "" &&
      outer !== "#N/A"
    ) {
      return outer;
    }

    return product.barcode || "-";
  }


  function getProductByAnyCode(code) {
    const query = normalizeCode(code);

    if (!query) {
      return null;
    }

    return (
      products.find(product => {

        const barcode =
          normalizeCode(product.barcode);

        const outerBarcode =
          normalizeCode(product.outerBarcode);

        const productCode =
          normalizeCode(product.productCode);

        return (
          barcode === query ||
          outerBarcode === query ||
          productCode === query
        );
      }) || null
    );
  }


  /* =========================================================
     NAVIGATION
  ========================================================= */

  function showSection(sectionId) {
    document
      .querySelectorAll(".page-section")
      .forEach(section => {
        section.classList.toggle(
          "active",
          section.id === sectionId
        );
      });

    document
      .querySelectorAll(".nav-button")
      .forEach(button => {
        button.classList.toggle(
          "active",
          button.dataset.section === sectionId
        );
      });

    if (sectionId === "dashboard") {
      updateDashboard();
    }

    if (sectionId === "history") {
      renderLoadingHistory();
    }

    if (sectionId === "products") {
      renderProducts();
    }

    if (sectionId === "problems") {
      renderProblems();
    }
  }


  /* =========================================================
     SESSION UI
  ========================================================= */

  function updateSessionUI() {

    const badgeText = currentSession
      ? `SESSION: ${currentSession.truck || "ACTIVE"}`
      : "NO SESSION";

    const badgeClass = currentSession
      ? "badge badge-success"
      : "badge badge-neutral";


    if ($("sessionBadge")) {
      $("sessionBadge").textContent = badgeText;
      $("sessionBadge").className = badgeClass;
    }


    if ($("scanSessionBadge")) {
      $("scanSessionBadge").textContent = badgeText;
      $("scanSessionBadge").className = badgeClass;
    }


    if ($("noSessionWarning")) {
      $("noSessionWarning").classList.toggle(
        "hidden",
        !!currentSession
      );
    }


    if ($("dashboardSessionText")) {

      if (currentSession) {
        $("dashboardSessionText").textContent =
          `Active session for truck ${currentSession.truck} (${currentSession.customer})`;
      } else {
        $("dashboardSessionText").textContent =
          "No active session.";
      }
    }
  }


  /* =========================================================
     START SESSION
  ========================================================= */

  function startSession() {

    const sessionName =
      $("sessionName")?.value?.trim() ||
      "Dispatch";

    const sessionUser =
      $("sessionUser")?.value?.trim() ||
      AUTHORIZED_USERS[0];

    const truck =
      $("sessionTruck")?.value?.trim() ||
      "TRK-01-GP";

    const customer =
      $("sessionCustomer")?.value?.trim() ||
      "General Dispatch";

    const delivery =
      $("sessionDelivery")?.value?.trim() ||
      "DEL-001";

    const route =
      $("sessionRoute")?.value?.trim() ||
      "Main Route";


    currentSession = {
      id:
        window.crypto &&
        typeof window.crypto.randomUUID === "function"
          ? window.crypto.randomUUID()
          : String(Date.now()),

      title: sessionName,
      user: sessionUser,
      truck,
      customer,
      delivery,
      route,

      startedAt:
        new Date().toISOString()
    };


    saveStorage(
      STORAGE_KEYS.session,
      currentSession
    );


    updateSessionUI();


    if ($("sessionModal")) {
      $("sessionModal").classList.add("hidden");
    }


    showToast(
      "Loading session started successfully.",
      "success"
    );
  }


  /* =========================================================
     END SESSION
     
     IMPORTANT:
     THIS IS THE ONLY endSession FUNCTION.
  ========================================================= */

  function endSession() {

    console.log(
      "End Current Session clicked."
    );


    if (!currentSession) {

      showToast(
        "There is no active loading session.",
        "warning"
      );

      return;
    }


    const truck =
      currentSession.truck || "Unknown truck";


    const confirmed = window.confirm(
      `End the current loading session for ${truck}?\n\n` +
      `All loading records already saved will remain in history.`
    );


    if (!confirmed) {
      return;
    }


    currentSession = null;


    saveStorage(
      STORAGE_KEYS.session,
      null
    );


    updateSessionUI();


    currentScannedProduct = null;
    currentScannedBarcode = "";


    if ($("barcodeInput")) {
      $("barcodeInput").value = "";
    }


    if ($("loadConfirmationPanel")) {
      $("loadConfirmationPanel")
        .classList.add("hidden");
    }


    if ($("scanResult")) {
      $("scanResult").className =
        "scan-result";

      $("scanResult").innerHTML = "";
    }


    showToast(
      "Loading session ended successfully.",
      "success"
    );


    console.log(
      "Loading session ended successfully."
    );
  }


  /* =========================================================
     BARCODE SCANNING
  ========================================================= */

  function checkBarcode() {

    const input = $("barcodeInput");

    if (!input) {
      return;
    }


    const rawCode =
      input.value.trim();


    if (!rawCode) {

      showToast(
        "Enter or scan a barcode/code first.",
        "warning"
      );

      return;
    }


    if (!currentSession) {

      if ($("sessionModal")) {
        $("sessionModal")
          .classList.remove("hidden");
      }

      showToast(
        "Start a loading session first.",
        "warning"
      );

      return;
    }


    currentScannedBarcode =
      rawCode;


    const product =
      getProductByAnyCode(rawCode);


    currentScannedProduct =
      product;


    const query =
      normalizeCode(rawCode);


    const duplicates =
      loadingRecords.filter(record => {

        return (
          normalizeCode(record.barcode) === query ||
          normalizeCode(record.outerBarcode) === query ||
          normalizeCode(record.productCode) === query
        );

      });


    if (duplicates.length > 0) {

      showDuplicateResult(
        rawCode,
        duplicates
      );

      return;
    }


    if (!product) {

      showInvalidResult(
        rawCode
      );

      return;
    }


    showValidResult(
      product,
      rawCode
    );
  }


  /* =========================================================
     VALID PRODUCT
  ========================================================= */

  function showValidResult(
    product,
    scannedCode
  ) {

    const result =
      $("scanResult");


    if (!result) {
      return;
    }


    result.className =
      "scan-result success";


    const outerBarcode =
      getEffectiveOuterBarcode(product);


    const description =
      getProductDescription(product);


    result.innerHTML = `
      <div class="result-icon">✓</div>

      <h3>VALID PRODUCT MATCH</h3>

      <p>
        <strong>Scanned Code:</strong>
        ${escapeHtml(scannedCode)}
      </p>

      <p>
        <strong>Product:</strong>
        ${escapeHtml(description)}
      </p>

      <p>
        <strong>Product SKU:</strong>
        ${escapeHtml(product.productCode)}
      </p>

      <p>
        <strong>Barcode:</strong>
        ${escapeHtml(product.barcode)}
      </p>

      <p>
        <strong>Outer Barcode:</strong>
        ${escapeHtml(outerBarcode)}
      </p>
    `;


    renderProductSummary(
      product
    );


    showLoadConfirmation(
      product
    );
  }


  /* =========================================================
     INVALID PRODUCT
  ========================================================= */

  function showInvalidResult(
    scannedCode
  ) {

    const result =
      $("scanResult");


    if (!result) {
      return;
    }


    result.className =
      "scan-result error";


    result.innerHTML = `
      <div class="result-icon">✕</div>

      <h3>PRODUCT NOT FOUND</h3>

      <p>
        <strong>Scanned Code:</strong>
        ${escapeHtml(scannedCode)}
      </p>

      <p>
        No match for barcode,
        outer barcode, or SKU.
      </p>
    `;


    if ($("loadConfirmationPanel")) {
      $("loadConfirmationPanel")
        .classList.add("hidden");
    }
  }


  /* =========================================================
     DUPLICATE
  ========================================================= */

  function showDuplicateResult(
    scannedCode,
    duplicates
  ) {

    const result =
      $("scanResult");


    if (!result) {
      return;
    }


    result.className =
      "scan-result warning";


    result.innerHTML = `
      <div class="result-icon">⚠</div>

      <h3>DUPLICATE SCAN DETECTED</h3>

      <p>
        <strong>Scanned Code:</strong>
        ${escapeHtml(scannedCode)}
      </p>

      <p>
        This product/barcode has
        already been recorded.
      </p>
    `;


    if ($("loadConfirmationPanel")) {
      $("loadConfirmationPanel")
        .classList.add("hidden");
    }
  }


  /* =========================================================
     PRODUCT SUMMARY
  ========================================================= */

  function renderProductSummary(
    product
  ) {

    if (!product) {
      return;
    }


    const cases =
      cleanNumber(
        product.casesPerPallet
      );


    const unitsPerCase =
      cleanNumber(
        product.unitsPerCase
      );


    const unitsPerPallet =
      cases * unitsPerCase;


    if ($("summaryProductCode")) {
      $("summaryProductCode")
        .textContent =
        displayValue(
          product.productCode
        );
    }


    if ($("summaryDescription")) {
      $("summaryDescription")
        .textContent =
        getProductDescription(product);
    }


    if ($("summaryOuterBarcode")) {
      $("summaryOuterBarcode")
        .textContent =
        getEffectiveOuterBarcode(product);
    }


    if ($("summaryBarcode")) {
      $("summaryBarcode")
        .textContent =
        displayValue(
          product.barcode
        );
    }


    if ($("summaryCasesPallet")) {
      $("summaryCasesPallet")
        .textContent =
        displayValue(
          product.casesPerPallet
        );
    }


    if ($("summaryUnitsCase")) {
      $("summaryUnitsCase")
        .textContent =
        unitsPerCase || "-";
    }


    if ($("summaryUnitsPallet")) {
      $("summaryUnitsPallet")
        .textContent =
        unitsPerPallet || "-";
    }


    if ($("summarySellBy")) {
      $("summarySellBy")
        .textContent =
        displayValue(
          product.sellBy
        );
    }


    if ($("summaryBB")) {
      $("summaryBB")
        .textContent =
        displayValue(
          getProductBB(product)
        );
    }
  }


  /* =========================================================
     LOAD CONFIRMATION
  ========================================================= */

  function showLoadConfirmation(
    product
  ) {

    if ($("loadConfirmationPanel")) {
      $("loadConfirmationPanel")
        .classList.remove("hidden");
    }


    const cases =
      cleanNumber(
        product.casesPerPallet
      );


    const unitsPerCase =
      cleanNumber(
        product.unitsPerCase
      );


    const calculatedUnits =
      cases * unitsPerCase;


    if ($("loadCases")) {
      $("loadCases").value =
        cases || "";
    }


    if ($("loadQuantity")) {
      $("loadQuantity").value =
        calculatedUnits || "";
    }


    if (!currentSession) {
      return;
    }


    if ($("loadTruck")) {
      $("loadTruck").value =
        currentSession.truck || "";
    }


    if ($("loadCustomer")) {
      $("loadCustomer").value =
        currentSession.customer || "";
    }


    if ($("loadDelivery")) {
      $("loadDelivery").value =
        currentSession.delivery || "";
    }


    if ($("loadRoute")) {
      $("loadRoute").value =
        currentSession.route || "";
    }


    if ($("loadUser")) {
      $("loadUser").value =
        currentSession.user ||
        AUTHORIZED_USERS[0];
    }
  }


  /* =========================================================
     RECALCULATE UNITS
  ========================================================= */

  function recalculateUnits() {

    if (!currentScannedProduct) {
      return;
    }


    const cases =
      parseInt(
        $("loadCases")?.value || "0",
        10
      ) || 0;


    const unitsPerCase =
      cleanNumber(
        currentScannedProduct.unitsPerCase
      );


    const totalUnits =
      cases * unitsPerCase;


    if ($("loadQuantity")) {
      $("loadQuantity").value =
        totalUnits;
    }


    if ($("summaryUnitsPallet")) {
      $("summaryUnitsPallet")
        .textContent =
        totalUnits || "-";
    }
  }


  /* =========================================================
     CONFIRM LOAD
  ========================================================= */

  function confirmLoad() {

    if (!currentScannedProduct) {

      showToast(
        "Scan a valid product first.",
        "warning"
      );

      return;
    }


    if (!currentSession) {

      showToast(
        "There is no active loading session.",
        "warning"
      );

      return;
    }


    const record = {

      id:
        window.crypto &&
        typeof window.crypto.randomUUID === "function"
          ? window.crypto.randomUUID()
          : String(Date.now()),

      date:
        getToday(),

      time:
        new Date().toLocaleTimeString(
          "en-ZA"
        ),

      truck:
        $("loadTruck")?.value || "",

      customer:
        $("loadCustomer")?.value || "",

      delivery:
        $("loadDelivery")?.value || "",

      route:
        $("loadRoute")?.value || "",

      barcode:
        currentScannedProduct.barcode,

      outerBarcode:
        getEffectiveOuterBarcode(
          currentScannedProduct
        ),

      productCode:
        currentScannedProduct.productCode,

      product:
        getProductDescription(
          currentScannedProduct
        ),

      cases:
        $("loadCases")?.value || 0,

      quantity:
        $("loadQuantity")?.value || 0,

      status:
        "LOADED",

      loadedBy:
        $("loadUser")?.value ||
        currentSession.user ||
        AUTHORIZED_USERS[0]
    };


    loadingRecords.push(
      record
    );


    saveStorage(
      STORAGE_KEYS.loading,
      loadingRecords
    );


    if ($("barcodeInput")) {
      $("barcodeInput").value = "";
    }


    if ($("loadConfirmationPanel")) {
      $("loadConfirmationPanel")
        .classList.add("hidden");
    }


    currentScannedProduct = null;
    currentScannedBarcode = "";


    showToast(
      "Pallet successfully logged.",
      "success"
    );


    renderLoadingHistory();
    updateDashboard();
  }


  /* =========================================================
     VERIFY PRODUCT
  ========================================================= */

  function performVerify() {

    const input =
      $("verifyInput");

    const result =
      $("verifyResult");


    if (!input || !result) {
      return;
    }


    const value =
      input.value.trim();


    if (!value) {

      showToast(
        "Enter a barcode or SKU to verify.",
        "warning"
      );

      return;
    }


    const product =
      getProductByAnyCode(
        value
      );


    if (!product) {

      result.className =
        "scan-result error";


      result.innerHTML = `
        <div class="result-icon">✕</div>

        <h3>NO MATCH FOUND</h3>

        <p>
          No product found for
          '${escapeHtml(value)}'.
        </p>
      `;

      return;
    }


    result.className =
      "scan-result success";


    result.innerHTML = `
      <div class="result-icon">✓</div>

      <h3>PRODUCT VERIFIED</h3>

      <p>
        <strong>Code:</strong>
        ${escapeHtml(product.productCode)}
      </p>

      <p>
        <strong>Product:</strong>
        ${escapeHtml(
          getProductDescription(product)
        )}
      </p>

      <p>
        <strong>Barcode:</strong>
        ${escapeHtml(product.barcode)}
      </p>

      <p>
        <strong>Outer Barcode:</strong>
        ${escapeHtml(
          getEffectiveOuterBarcode(product)
        )}
      </p>

      <p>
        <strong>Sell By:</strong>
        ${escapeHtml(
          displayValue(product.sellBy)
        )}
      </p>

      <p>
        <strong>Best Before (BB):</strong>
        ${escapeHtml(
          displayValue(
            getProductBB(product)
          )
        )}
      </p>

      <p>
        <strong>Cases/Pallet:</strong>
        ${escapeHtml(
          displayValue(
            product.casesPerPallet
          )
        )}
      </p>

      <p>
        <strong>Units/Case:</strong>
        ${escapeHtml(
          displayValue(
            product.unitsPerCase
          )
        )}
      </p>
    `;
  }


  /* =========================================================
     PRODUCT TABLE
  ========================================================= */

  function renderProducts() {

    if ($("productCount")) {
      $("productCount")
        .textContent =
        products.length;
    }


    if ($("uniqueBarcodeCount")) {

      const uniqueBarcodes =
        new Set(
          products.map(
            product =>
              normalizeCode(
                product.barcode
              )
          )
        );

      $("uniqueBarcodeCount")
        .textContent =
        uniqueBarcodes.size;
    }


    const body =
      $("productBody");


    if (!body) {
      return;
    }


    body.innerHTML =
      products.map(product => `
        <tr>

          <td>
            <code>
              ${escapeHtml(
                product.productCode
              )}
            </code>
          </td>

          <td>
            <code>
              ${escapeHtml(
                getEffectiveOuterBarcode(
                  product
                )
              )}
            </code>
          </td>

          <td>
            <code>
              ${escapeHtml(
                product.barcode
              )}
            </code>
          </td>

          <td>
            ${escapeHtml(
              getProductDescription(
                product
              )
            )}
          </td>

          <td>
            ${escapeHtml(
              displayValue(
                product.packSize
              )
            )}
          </td>

          <td>
            ${escapeHtml(
              displayValue(
                product.sellBy
              )
            )}
          </td>

          <td>
            ${escapeHtml(
              displayValue(
                getProductBB(product)
              )
            )}
          </td>

          <td>
            ${escapeHtml(
              displayValue(
                product.casesPerPallet
              )
            )}
          </td>

          <td>
            ${escapeHtml(
              cleanNumber(
                product.unitsPerCase
              )
            )}
          </td>

          <td>
            ${escapeHtml(
              displayValue(
                product.unitsPerOuter
              )
            )}
          </td>

        </tr>
      `)
      .join("");
  }


  /* =========================================================
     LOADING HISTORY
  ========================================================= */

  function renderLoadingHistory() {

    const body =
      $("historyBody");


    if (!body) {
      return;
    }


    body.innerHTML =
      loadingRecords
        .slice()
        .reverse()
        .map(record => `

          <tr>

            <td>
              ${escapeHtml(
                record.date
              )}
            </td>

            <td>
              ${escapeHtml(
                record.time
              )}
            </td>

            <td>
              ${escapeHtml(
                displayValue(
                  record.truck
                )
              )}
            </td>

            <td>
              ${escapeHtml(
                displayValue(
                  record.customer
                )
              )}
            </td>

            <td>
              ${escapeHtml(
                displayValue(
                  record.delivery
                )
              )}
            </td>

            <td>
              <code>
                ${escapeHtml(
                  record.barcode
                )}
              </code>
            </td>

            <td>
              ${escapeHtml(
                record.product
              )}
            </td>

            <td>
              ${escapeHtml(
                record.cases
              )}
            </td>

            <td>
              ${escapeHtml(
                record.quantity
              )}
            </td>

            <td class="status-loaded">
              ${escapeHtml(
                record.status
              )}
            </td>

            <td>
              ${escapeHtml(
                record.loadedBy
              )}
            </td>

          </tr>
        `)
        .join("");
  }


  /* =========================================================
     PROBLEMS
  ========================================================= */

  function renderProblems() {

    const body =
      $("problemBody");


    if (!body) {
      return;
    }


    body.innerHTML =
      barcodeProblems
        .slice()
        .reverse()
        .map(problem => `

          <tr>

            <td>
              ${escapeHtml(
                problem.date
              )}
            </td>

            <td>
              ${escapeHtml(
                problem.time
              )}
            </td>

            <td>
              <code>
                ${escapeHtml(
                  problem.barcode
                )}
              </code>
            </td>

            <td>
              ${escapeHtml(
                problem.product
              )}
            </td>

            <td>
              ${escapeHtml(
                problem.type
              )}
            </td>

            <td>
              ${escapeHtml(
                problem.comment
              )}
            </td>

            <td>
              ${escapeHtml(
                problem.reportedBy
              )}
            </td>

            <td>
              ${escapeHtml(
                problem.status
              )}
            </td>

            <td>-</td>

          </tr>
        `)
        .join("");
  }


  /* =========================================================
     DASHBOARD
  ========================================================= */

  function updateDashboard() {

    if ($("statPallets")) {
      $("statPallets")
        .textContent =
        loadingRecords.length;
    }


    if ($("statValid")) {
      $("statValid")
        .textContent =
        loadingRecords.filter(
          record =>
            record.status === "LOADED"
        ).length;
    }


    if ($("statErrors")) {
      $("statErrors")
        .textContent =
        barcodeProblems.length;
    }


    if ($("statCases")) {

      const totalCases =
        loadingRecords.reduce(
          (sum, record) => {

            return (
              sum +
              (
                parseInt(
                  record.cases,
                  10
                ) || 0
              )
            );

          },
          0
        );


      $("statCases")
        .textContent =
        totalCases;
    }


    const recentBody =
      $("recentLoadingBody");


    if (!recentBody) {
      return;
    }


    recentBody.innerHTML =
      loadingRecords
        .slice()
        .reverse()
        .slice(0, 5)
        .map(record => `

          <tr>

            <td>
              ${escapeHtml(
                record.time
              )}
            </td>

            <td>
              ${escapeHtml(
                record.truck
              )}
            </td>

            <td>
              ${escapeHtml(
                record.customer
              )}
            </td>

            <td>
              <code>
                ${escapeHtml(
                  record.barcode
                )}
              </code>
            </td>

            <td>
              ${escapeHtml(
                record.product
              )}
            </td>

            <td class="status-loaded">
              ${escapeHtml(
                record.status
              )}
            </td>

          </tr>
        `)
        .join("");
  }


  /* =========================================================
     CLEAR HISTORY
  ========================================================= */

  function clearHistory() {

    const confirmed =
      window.confirm(
        "Are you sure you want to clear all loading records and reported barcode problems?"
      );


    if (!confirmed) {
      return;
    }


    loadingRecords = [];
    barcodeProblems = [];


    saveStorage(
      STORAGE_KEYS.loading,
      loadingRecords
    );


    saveStorage(
      STORAGE_KEYS.problems,
      barcodeProblems
    );


    renderLoadingHistory();
    renderProblems();
    updateDashboard();


    showToast(
      "Loading history and problems cleared successfully.",
      "success"
    );
  }


  /* =========================================================
     RESET APPLICATION
  ========================================================= */

  function clearCacheAndReset() {

    const confirmed =
      window.confirm(
        "WARNING!\n\n" +
        "This will clear application data, loading records, " +
        "barcode problems and the active session.\n\n" +
        "Continue?"
      );


    if (!confirmed) {
      return;
    }


    localStorage.clear();


    products =
      [...FULL_PRODUCT_MASTER];


    loadingRecords = [];
    barcodeProblems = [];
    currentSession = null;


    saveStorage(
      STORAGE_KEYS.products,
      products
    );


    saveStorage(
      STORAGE_KEYS.loading,
      loadingRecords
    );


    saveStorage(
      STORAGE_KEYS.problems,
      barcodeProblems
    );


    saveStorage(
      STORAGE_KEYS.session,
      null
    );


    updateSessionUI();
    renderProducts();
    renderLoadingHistory();
    renderProblems();
    updateDashboard();


    showToast(
      "Application reset successfully.",
      "success"
    );
  }


  /* =========================================================
     CAMERA
  ========================================================= */

  async function startCamera() {

    const reader =
      $("reader");

    const startButton =
      $("startCameraButton");

    const stopButton =
      $("stopCameraButton");


    if (!reader) {
      showToast(
        "Camera reader was not found.",
        "error"
      );

      return;
    }


    if (
      typeof Html5Qrcode ===
      "undefined"
    ) {

      showToast(
        "Barcode scanner library is not loaded.",
        "error"
      );

      return;
    }


    reader.classList.remove(
      "hidden"
    );

    reader.style.display =
      "block";


    startButton?.classList.add(
      "hidden"
    );

    stopButton?.classList.remove(
      "hidden"
    );


    if (html5QrCode) {

      try {

        if (
          html5QrCode.isScanning
        ) {
          await html5QrCode.stop();
        }

        html5QrCode.clear();

      } catch (error) {
        console.warn(
          "Previous camera cleanup:",
          error
        );
      }

      html5QrCode = null;
    }


    html5QrCode =
      new Html5Qrcode(
        "reader"
      );


    const scanConfig = {
      fps: 15,
      qrbox: {
        width: 250,
        height: 180
      }
    };


    const onScanSuccess =
      async decodedText => {

        const input =
          $("barcodeInput");


        if (input) {
          input.value =
            decodedText;
        }


        await stopCamera();


        checkBarcode();
      };


    try {

      await html5QrCode.start(
        {
          facingMode: {
            exact: "environment"
          }
        },
        scanConfig,
        onScanSuccess
      );

    } catch (error) {

      console.warn(
        "Back camera unavailable. Trying fallback.",
        error
      );


      try {

        await html5QrCode.start(
          {
            facingMode:
              "environment"
          },
          scanConfig,
          onScanSuccess
        );

      } catch (error2) {

        console.warn(
          "Environment camera failed.",
          error2
        );


        try {

          await html5QrCode.start(
            {
              facingMode: "user"
            },
            scanConfig,
            onScanSuccess
          );

        } catch (error3) {

          console.error(
            "Camera failed:",
            error3
          );


          await stopCamera();


          showToast(
            "Unable to access the camera.",
            "error"
          );
        }
      }
    }
  }


  async function stopCamera() {

    const reader =
      $("reader");

    const startButton =
      $("startCameraButton");

    const stopButton =
      $("stopCameraButton");


    try {

      if (
        html5QrCode &&
        html5QrCode.isScanning
      ) {
        await html5QrCode.stop();
      }

    } catch (error) {

      console.warn(
        "Camera stop error:",
        error
      );

    } finally {

      try {

        if (html5QrCode) {
          html5QrCode.clear();
        }

      } catch (error) {
        console.warn(
          "Camera clear error:",
          error
        );
      }


      html5QrCode = null;


      if (reader) {
        reader.classList.add(
          "hidden"
        );

        reader.style.display =
          "none";
      }


      startButton?.classList.remove(
        "hidden"
      );

      stopButton?.classList.add(
        "hidden"
      );
    }
  }


  /* =========================================================
     MENU
  ========================================================= */

  function setupMenu() {

    const menuButton =
      $("menuButton");

    const mainNav =
      $("mainNav");


    if (
      menuButton &&
      mainNav
    ) {

      menuButton.addEventListener(
        "click",
        () => {
          mainNav.classList.toggle(
            "open"
          );
        }
      );
    }
  }


  /* =========================================================
     EVENT LISTENERS
     
     ALL BUTTON EVENTS ARE REGISTERED HERE.
  ========================================================= */

  function setupEventListeners() {

    /* -------------------------
       NAVIGATION
    ------------------------- */

    document
      .querySelectorAll(".nav-button")
      .forEach(button => {

        button.addEventListener(
          "click",
          () => {

            const section =
              button.dataset.section;

            if (section) {
              showSection(
                section
              );
            }

          }
        );

      });


    /* -------------------------
       SCAN
    ------------------------- */

    $("checkBarcodeButton")
      ?.addEventListener(
        "click",
        checkBarcode
      );


    $("confirmLoadButton")
      ?.addEventListener(
        "click",
        confirmLoad
      );


    $("cancelLoadButton")
      ?.addEventListener(
        "click",
        () => {

          $("loadConfirmationPanel")
            ?.classList.add(
              "hidden"
            );

        }
      );


    $("verifyButton")
      ?.addEventListener(
        "click",
        performVerify
      );


    /* -------------------------
       BARCODE ENTER
    ------------------------- */

    $("barcodeInput")
      ?.addEventListener(
        "keydown",
        event => {

          if (
            event.key === "Enter"
          ) {

            event.preventDefault();

            checkBarcode();
          }

        }
      );


    /* -------------------------
       SESSION START
    ------------------------- */

    $("startSessionButton")
      ?.addEventListener(
        "click",
        startSession
      );


    $("startSessionFromScan")
      ?.addEventListener(
        "click",
        () => {

          $("sessionModal")
            ?.classList.remove(
              "hidden"
            );

        }
      );


    /* -------------------------
       SESSION CANCEL
    ------------------------- */

    $("cancelSessionButton")
      ?.addEventListener(
        "click",
        () => {

          $("sessionModal")
            ?.classList.add(
              "hidden"
            );

        }
      );


    $("closeSessionModal")
      ?.addEventListener(
        "click",
        () => {

          $("sessionModal")
            ?.classList.add(
              "hidden"
            );

        }
      );


    /* =====================================================
       END CURRENT SESSION
       
       THIS IS THE IMPORTANT FIX.
       
       The code deliberately supports several possible IDs
       so it works with different versions of your HTML.
    ===================================================== */

    const endSessionButtons = [

      $("endSessionButton"),

      $("endCurrentSessionButton"),

      $("endSession"),

      $("endCurrentSession"),

      $("sessionEndButton")

    ].filter(Boolean);


    endSessionButtons.forEach(
      button => {

        button.addEventListener(
          "click",
          event => {

            event.preventDefault();

            event.stopPropagation();

            endSession();

          }
        );

      }
    );


    /* -------------------------
       DASHBOARD SCAN
    ------------------------- */

    $("dashboardScanButton")
      ?.addEventListener(
        "click",
        () => {
          showSection(
            "scan"
          );
        }
      );


    /* -------------------------
       DEMO BUTTONS
    ------------------------- */

    $("demoValidButton")
      ?.addEventListener(
        "click",
        () => {

          $("barcodeInput").value =
            "6009211225657";

          checkBarcode();

        }
      );


    $("demoInvalidButton")
      ?.addEventListener(
        "click",
        () => {

          $("barcodeInput").value =
            "9999999999999";

          checkBarcode();

        }
      );


    /* -------------------------
       CASE CALCULATION
    ------------------------- */

    $("loadCases")
      ?.addEventListener(
        "input",
        recalculateUnits
      );


    $("loadCases")
      ?.addEventListener(
        "change",
        recalculateUnits
      );


    /* -------------------------
       CAMERA
    ------------------------- */

    $("startCameraButton")
      ?.addEventListener(
        "click",
        startCamera
      );


    $("stopCameraButton")
      ?.addEventListener(
        "click",
        stopCamera
      );


    /* -------------------------
       CLEAR HISTORY
    ------------------------- */

    $("clearHistoryButton")
      ?.addEventListener(
        "click",
        clearHistory
      );


    /* -------------------------
       CLEAR CACHE
    ------------------------- */

    $("clearCacheButton")
      ?.addEventListener(
        "click",
        clearCacheAndReset
      );


    $("clearCacheSettingsButton")
      ?.addEventListener(
        "click",
        clearCacheAndReset
      );


    /* -------------------------
       MENU
    ------------------------- */

    setupMenu();
  }


  /* =========================================================
     INITIALIZE APPLICATION
  ========================================================= */

  function initializeApp() {

    console.log(
      "Dispatch Barcode System starting..."
    );


    console.log(
      `Products loaded: ${products.length}`
    );


    updateSessionUI();

    renderProducts();

    renderLoadingHistory();

    renderProblems();

    updateDashboard();

    setupEventListeners();


    console.log(
      "Dispatch Barcode System ready."
    );


    if (currentSession) {

      console.log(
        "Active session:",
        currentSession
      );

    }
  }


  /* =========================================================
     START
  ========================================================= */

  if (
    document.readyState ===
    "loading"
  ) {

    document.addEventListener(
      "DOMContentLoaded",
      initializeApp
    );

  } else {

    initializeApp();

  }

})();