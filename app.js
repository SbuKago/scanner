/**
 * Dispatch Loading & Barcode Verification Application Engine (app.js)
 * Synchronized with Express Backend API & MySQL Database Schema
 */

const API_BASE = '/api';

// Application State
const state = {
  currentSession: null,
  activeProduct: null,
  scannedBarcodesInSession: new Set(),
  html5Qrcode: null,
  isCameraRunning: false,
  activeTab: 'scanner'
};

// DOM Elements Initialization
document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initSessionHandlers();
  initScannerControls();
  initManualLookup();
  initProblemModal();
  initBulkImport();
  initFiltersAndSearch();

  // Load Initial Dashboard & Product Data
  loadDashboardStats();
  loadProductsTable();
});

/* ==========================================================================
   1. NAVIGATION & UI TABS
   ========================================================================== */
function initNavigation() {
  const navButtons = document.querySelectorAll('.nav-button');
  const sections = document.querySelectorAll('.page-section');

  navButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetPage = btn.dataset.target || btn.dataset.page;
      if (!targetPage) return;

      navButtons.forEach((b) => b.classList.remove('active'));
      sections.forEach((s) => s.classList.remove('active'));

      btn.classList.add('active');
      const targetSection = document.getElementById(`${targetPage}-section`) || document.getElementById(targetPage);
      if (targetSection) {
        targetSection.classList.add('active');
      }

      state.activeTab = targetPage;
      onTabSwitch(targetPage);
    });
  });
}

function onTabSwitch(tabName) {
  switch (tabName) {
    case 'dashboard':
      loadDashboardStats();
      break;
    case 'history':
      loadLoadingHistory();
      break;
    case 'products':
      loadProductsTable();
      break;
    case 'problems':
      loadProblemsTable();
      break;
    case 'scanner':
      // Resume or check camera status if needed
      break;
  }
}

/* ==========================================================================
   2. SESSION MANAGEMENT
   ========================================================================== */
function initSessionHandlers() {
  const startSessionBtn = document.getElementById('btn-start-session');
  const endSessionBtn = document.getElementById('btn-end-session');
  const sessionForm = document.getElementById('session-form');

  if (startSessionBtn) {
    startSessionBtn.addEventListener('click', (e) => {
      e.preventDefault();
      startNewSession();
    });
  }

  if (endSessionBtn) {
    endSessionBtn.addEventListener('click', () => {
      endSession();
    });
  }
}

function startNewSession() {
  const truckReg = document.getElementById('truck-reg')?.value.trim();
  const customer = document.getElementById('customer-name')?.value.trim();
  const deliveryNumber = document.getElementById('delivery-no')?.value.trim();
  const route = document.getElementById('route-name')?.value.trim() || '';
  const loadedBy = document.getElementById('loaded-by')?.value.trim();

  if (!truckReg || !customer || !deliveryNumber || !loadedBy) {
    showToast('Please fill in all required session fields (Truck, Customer, Delivery #, Inspector).', 'warning');
    return;
  }

  state.currentSession = {
    sessionId: `SESS-${Date.now()}`,
    startTime: new Date().toISOString(),
    truckReg,
    customer,
    deliveryNumber,
    route,
    loadedBy,
    palletsCount: 0,
    casesCount: 0
  };

  state.scannedBarcodesInSession.clear();
  updateSessionDisplayUI();
  showToast('Loading session initialized successfully!', 'success');
  enableScannerControls(true);
}

function endSession() {
  if (!state.currentSession) return;

  if (confirm(`Are you sure you want to finalize session ${state.currentSession.sessionId}?`)) {
    showToast(`Session ${state.currentSession.sessionId} closed. Total Pallets: ${state.currentSession.palletsCount}`, 'info');
    state.currentSession = null;
    state.scannedBarcodesInSession.clear();
    resetProductSummaryUI();
    updateSessionDisplayUI();
    enableScannerControls(false);
    stopCamera();
  }
}

function updateSessionDisplayUI() {
  const activeBanner = document.getElementById('session-active-info');
  const inactiveBanner = document.getElementById('session-inactive-info');
  const displayId = document.getElementById('disp-session-id');
  const displayTruck = document.getElementById('disp-truck');
  const displayCustomer = document.getElementById('disp-customer');
  const displayDelivery = document.getElementById('disp-delivery');
  const displayPallets = document.getElementById('disp-pallets-count');

  if (state.currentSession) {
    if (activeBanner) activeBanner.classList.remove('hidden');
    if (inactiveBanner) inactiveBanner.classList.add('hidden');

    if (displayId) displayId.textContent = state.currentSession.sessionId;
    if (displayTruck) displayTruck.textContent = state.currentSession.truckReg;
    if (displayCustomer) displayCustomer.textContent = state.currentSession.customer;
    if (displayDelivery) displayDelivery.textContent = state.currentSession.deliveryNumber;
    if (displayPallets) displayPallets.textContent = state.currentSession.palletsCount;
  } else {
    if (activeBanner) activeBanner.classList.add('hidden');
    if (inactiveBanner) inactiveBanner.classList.remove('hidden');
  }
}

function enableScannerControls(enabled) {
  const barcodeInput = document.getElementById('barcode-input');
  const btnLookup = document.getElementById('btn-lookup-barcode');
  const btnStartCam = document.getElementById('btn-start-cam');

  if (barcodeInput) barcodeInput.disabled = !enabled;
  if (btnLookup) btnLookup.disabled = !enabled;
  if (btnStartCam) btnStartCam.disabled = !enabled;
}

/* ==========================================================================
   3. BARCODE SCANNING & LOOKUP ENGINE
   ========================================================================== */
function initScannerControls() {
  const btnStartCam = document.getElementById('btn-start-cam');
  const btnStopCam = document.getElementById('btn-stop-cam');

  if (btnStartCam) btnStartCam.addEventListener('click', startCamera);
  if (btnStopCam) btnStopCam.addEventListener('click', stopCamera);
}

function startCamera() {
  if (state.isCameraRunning) return;

  if (typeof Html5Qrcode === 'undefined') {
    showToast('Camera scanner library not loaded.', 'error');
    return;
  }

  const readerElement = document.getElementById('reader');
  if (!readerElement) return;

  state.html5Qrcode = new Html5Qrcode('reader');
  const config = { fps: 10, qrbox: { width: 280, height: 180 } };

  state.html5Qrcode
    .start(
      { facingMode: 'environment' },
      config,
      (decodedText) => {
        handleCodeDetected(decodedText);
      },
      (errorMessage) => {
        // Continuous scanning search frames; non-critical
      }
    )
    .then(() => {
      state.isCameraRunning = true;
      toggleCameraButtons(true);
      showToast('Camera barcode scanner active.', 'info');
    })
    .catch((err) => {
      showToast('Failed to access camera: ' + err, 'error');
      state.isCameraRunning = false;
      toggleCameraButtons(false);
    });
}

function stopCamera() {
  if (state.html5Qrcode && state.isCameraRunning) {
    state.html5Qrcode
      .stop()
      .then(() => {
        state.isCameraRunning = false;
        toggleCameraButtons(false);
        showToast('Camera scanner stopped.', 'info');
      })
      .catch((err) => console.error('Error stopping camera:', err));
  }
}

function toggleCameraButtons(isRunning) {
  const btnStart = document.getElementById('btn-start-cam');
  const btnStop = document.getElementById('btn-stop-cam');
  if (btnStart) btnStart.classList.toggle('hidden', isRunning);
  if (btnStop) btnStop.classList.toggle('hidden', !isRunning);
}

function initManualLookup() {
  const barcodeInput = document.getElementById('barcode-input');
  const btnLookup = document.getElementById('btn-lookup-barcode');

  const executeSearch = () => {
    const code = barcodeInput?.value.trim();
    if (!code) {
      showToast('Please enter a barcode, SKU, or outer code.', 'warning');
      return;
    }
    handleCodeDetected(code);
  };

  if (btnLookup) {
    btnLookup.addEventListener('click', executeSearch);
  }

  if (barcodeInput) {
    barcodeInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        executeSearch();
      }
    });
  }
}

async function handleCodeDetected(code) {
  if (!state.currentSession) {
    showToast('Please start a loading session first!', 'warning');
    renderScanResultUI('warning', 'Session Required', 'Please configure an active session before scanning barcodes.');
    return;
  }

  // Check for session duplicate scan
  if (state.scannedBarcodesInSession.has(code)) {
    renderScanResultUI('warning', 'DUPLICATE SCAN DETECTED', `Barcode ${code} has already been logged in this session.`);
    playAlertSound('warning');
    await logLoadingTransaction(code, 'DUPLICATE');
    return;
  }

  try {
    const response = await fetch(`${API_BASE}/products/lookup/${encodeURIComponent(code)}`);
    
    if (response.status === 404) {
      renderScanResultUI('error', 'UNKNOWN BARCODE', `Code "${code}" not found in Product Master database.`);
      playAlertSound('error');
      promptReportProblem(code, 'UNKNOWN_BARCODE');
      return;
    }

    if (!response.ok) {
      throw new Error(`Server returned HTTP ${response.status}`);
    }

    const product = await response.json();
    state.activeProduct = product;
    
    // Update Product Summary Card
    displayProductSummary(product);

    // Save scan as valid
    state.scannedBarcodesInSession.add(code);
    state.currentSession.palletsCount += 1;
    state.currentSession.casesCount += parseInt(product.casesPerPallet || 0, 10);
    
    updateSessionDisplayUI();
    renderScanResultUI('success', 'VALID PALLET SCANNED', `${product.description} (${product.productCode})`);
    playAlertSound('success');

    // Persist scan to Database
    await logLoadingTransaction(code, 'LOADED', product);

  } catch (error) {
    console.error('Error during code lookup:', error);
    showToast('Error communicating with server.', 'error');
    renderScanResultUI('error', 'SYSTEM ERROR', error.message);
  }
}

/* ==========================================================================
   4. PRODUCT SUMMARY & RESULT DISPLAY
   ========================================================================== */
function displayProductSummary(p) {
  const container = document.getElementById('product-summary-grid');
  if (!container) return;

  container.innerHTML = `
    <div class="summary-item">
      <span class="label">Product SKU</span>
      <span class="value">${p.productCode}</span>
    </div>
    <div class="summary-item">
      <span class="label">Barcode</span>
      <span class="value">${p.barcode}</span>
    </div>
    <div class="summary-item">
      <span class="label">Outer Barcode</span>
      <span class="value">${p.outerBarcode || 'N/A'}</span>
    </div>
    <div class="summary-item" style="grid-column: span 2;">
      <span class="label">Description</span>
      <span class="value"><strong>${p.description}</strong></span>
    </div>
    <div class="summary-item">
      <span class="label">Pack Size</span>
      <span class="value">${p.packSize || 'N/A'}</span>
    </div>
    <div class="summary-item">
      <span class="label">Cases / Pallet</span>
      <span class="value">${p.casesPerPallet || 0}</span>
    </div>
    <div class="summary-item">
      <span class="label">Units / Case</span>
      <span class="value">${p.unitsPerCase || 0}</span>
    </div>
    <div class="summary-item">
      <span class="label">Total Units / Pallet</span>
      <span class="value">${p.unitsPerPallet || ((p.casesPerPallet || 0) * (p.unitsPerCase || 0))}</span>
    </div>
  `;
}

function resetProductSummaryUI() {
  const container = document.getElementById('product-summary-grid');
  if (container) {
    container.innerHTML = `<div style="grid-column: 1 / -1; color: var(--grey-600); text-align: center;">No product currently selected. Scan or enter a barcode to view details.</div>`;
  }
  const scanResultBox = document.getElementById('scan-result-box');
  if (scanResultBox) {
    scanResultBox.className = 'scan-result';
    scanResultBox.innerHTML = `<h3>Ready to Scan</h3><p class="help-text">Point camera at a pallet barcode or enter SKU manually above.</p>`;
  }
}

function renderScanResultUI(status, title, message) {
  const box = document.getElementById('scan-result-box');
  if (!box) return;

  box.className = `scan-result ${status}`;
  
  let icon = '✔';
  if (status === 'error') icon = '✖';
  if (status === 'warning') icon = '⚠';

  box.innerHTML = `
    <div class="result-icon">${icon}</div>
    <h3>${title}</h3>
    <p>${message}</p>
  `;
}

/* ==========================================================================
   5. BACKEND LOGGING & HISTORY TRANSACTION
   ========================================================================== */
async function logLoadingTransaction(scannedCode, status, productData = null) {
  if (!state.currentSession) return;

  const payload = {
    id: `LOAD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    sessionId: state.currentSession.sessionId,
    timestamp: new Date().toISOString().slice(0, 19).replace('T', ' '),
    truckReg: state.currentSession.truckReg,
    customer: state.currentSession.customer,
    deliveryNumber: state.currentSession.deliveryNumber,
    route: state.currentSession.route,
    productCode: productData ? productData.productCode : (state.activeProduct ? state.activeProduct.productCode : 'UNKNOWN'),
    barcode: scannedCode,
    cases: productData ? productData.casesPerPallet : 0,
    quantity: productData ? (productData.unitsPerPallet || productData.casesPerPallet * productData.unitsPerCase) : 0,
    palletType: 'Standard',
    status: status,
    loadedBy: state.currentSession.loadedBy
  };

  try {
    const res = await fetch(`${API_BASE}/loading-history`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      console.error('Failed to log loading transaction to backend server.');
    }
  } catch (err) {
    console.error('Network error saving loading transaction:', err);
  }
}

/* ==========================================================================
   6. PROBLEM REPORTING & MODALS
   ========================================================================== */
function initProblemModal() {
  const modal = document.getElementById('problem-modal');
  const closeBtn = document.getElementById('btn-close-problem-modal');
  const form = document.getElementById('problem-report-form');

  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => modal.classList.add('hidden'));
  }

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const barcode = document.getElementById('modal-problem-barcode')?.value;
      const problemType = document.getElementById('modal-problem-type')?.value;
      const comment = document.getElementById('modal-problem-comment')?.value;
      const reportedBy = state.currentSession ? state.currentSession.loadedBy : 'System Operator';

      try {
        const res = await fetch(`${API_BASE}/problems`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ barcode, problemType, comment, reportedBy, status: 'OPEN' })
        });

        if (res.ok) {
          showToast('Problem logged successfully.', 'success');
          if (modal) modal.classList.add('hidden');
          if (state.activeTab === 'problems') loadProblemsTable();
        } else {
          showToast('Failed to log problem record.', 'error');
        }
      } catch (err) {
        showToast('Network error filing problem report.', 'error');
      }
    });
  }
}

function promptReportProblem(barcode, defaultType = 'UNREADABLE_BARCODE') {
  const modal = document.getElementById('problem-modal');
  const barcodeInput = document.getElementById('modal-problem-barcode');
  const typeSelect = document.getElementById('modal-problem-type');

  if (modal && barcodeInput) {
    barcodeInput.value = barcode;
    if (typeSelect) typeSelect.value = defaultType;
    modal.classList.remove('hidden');
  }
}

/* ==========================================================================
   7. BULK PRODUCT IMPORT (EXCEL / JSON)
   ========================================================================== */
function initBulkImport() {
  const importInput = document.getElementById('bulk-import-file');
  const importBtn = document.getElementById('btn-bulk-import');

  if (importBtn && importInput) {
    importBtn.addEventListener('click', () => {
      const file = importInput.files[0];
      if (!file) {
        showToast('Please select a JSON data file to import.', 'warning');
        return;
      }

      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const products = JSON.parse(e.target.result);
          if (!Array.isArray(products)) {
            throw new Error('File content must be an array of product objects.');
          }

          const res = await fetch(`${API_BASE}/products/bulk`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(products)
          });

          const data = await res.json();
          if (res.ok) {
            showToast(`Bulk Import Complete: ${data.count} items imported.`, 'success');
            loadProductsTable();
          } else {
            showToast(`Import Failed: ${data.error}`, 'error');
          }
        } catch (err) {
          showToast(`Invalid File Format: ${err.message}`, 'error');
        }
      };
      reader.readAsText(file);
    });
  }
}

/* ==========================================================================
   8. DATA FETCHING & TABLE RENDERING
   ========================================================================== */
async function loadDashboardStats() {
  try {
    const res = await fetch(`${API_BASE}/dashboard/stats`);
    if (!res.ok) return;
    const stats = await res.json();

    const statPallets = document.getElementById('stat-pallets-loaded');
    const statCases = document.getElementById('stat-cases-loaded');
    const statErrors = document.getElementById('stat-errors');
    const statDuplicates = document.getElementById('stat-duplicates');
    const statCustomers = document.getElementById('stat-customers');

    if (statPallets) statPallets.textContent = stats.palletsLoaded || 0;
    if (statCases) statCases.textContent = stats.casesLoaded || 0;
    if (statErrors) statErrors.textContent = stats.errors || 0;
    if (statDuplicates) statDuplicates.textContent = stats.duplicates || 0;
    if (statCustomers) statCustomers.textContent = stats.customers || 0;
  } catch (err) {
    console.error('Error loading dashboard stats:', err);
  }
}

async function loadLoadingHistory() {
  const tableBody = document.getElementById('history-table-body');
  if (!tableBody) return;

  tableBody.innerHTML = `<tr><td colspan="9" class="empty-table">Loading transaction records...</td></tr>`;

  try {
    const res = await fetch(`${API_BASE}/loading-history`);
    const history = await res.json();

    if (!Array.isArray(history) || history.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="9" class="empty-table">No loading history recorded yet.</td></tr>`;
      return;
    }

    tableBody.innerHTML = history
      .map(
        (item) => `
      <tr>
        <td>${formatDate(item.timestamp)}</td>
        <td><strong>${item.deliveryNumber}</strong><br><small>${item.truckReg}</small></td>
        <td>${item.customer}</td>
        <td>${item.productCode}</td>
        <td>${item.description || 'N/A'}</td>
        <td>${item.barcode}</td>
        <td>${item.cases}</td>
        <td><span class="badge ${item.status === 'LOADED' ? 'badge-success' : 'badge-warning'}">${item.status}</span></td>
        <td>${item.loadedBy}</td>
      </tr>
    `
      )
      .join('');
  } catch (err) {
    tableBody.innerHTML = `<tr><td colspan="9" class="empty-table" style="color: var(--red);">Error loading history data.</td></tr>`;
  }
}

async function loadProductsTable() {
  const tableBody = document.getElementById('products-table-body');
  if (!tableBody) return;

  tableBody.innerHTML = `<tr><td colspan="8" class="empty-table">Loading Master Product Catalog...</td></tr>`;

  try {
    const res = await fetch(`${API_BASE}/products`);
    const products = await res.json();

    if (!Array.isArray(products) || products.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="8" class="empty-table">No products found in database. Use Bulk Import to add records.</td></tr>`;
      return;
    }

    tableBody.innerHTML = products
      .map(
        (p) => `
      <tr>
        <td><strong>${p.productCode}</strong></td>
        <td>${p.barcode}</td>
        <td>${p.outerBarcode || '-'}</td>
        <td>${p.description}</td>
        <td>${p.packSize || '-'}</td>
        <td>${p.casesPerPallet || 0}</td>
        <td>${p.unitsPerCase || 0}</td>
        <td><strong>${p.unitsPerPallet || (p.casesPerPallet * p.unitsPerCase) || 0}</strong></td>
      </tr>
    `
      )
      .join('');
  } catch (err) {
    tableBody.innerHTML = `<tr><td colspan="8" class="empty-table" style="color: var(--red);">Error loading products database.</td></tr>`;
  }
}

async function loadProblemsTable() {
  const tableBody = document.getElementById('problems-table-body');
  if (!tableBody) return;

  tableBody.innerHTML = `<tr><td colspan="6" class="empty-table">Fetching reported issues...</td></tr>`;

  try {
    const res = await fetch(`${API_BASE}/problems`);
    const problems = await res.json();

    if (!Array.isArray(problems) || problems.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="6" class="empty-table">No reported barcode issues.</td></tr>`;
      return;
    }

    tableBody.innerHTML = problems
      .map(
        (item) => `
      <tr>
        <td>${formatDate(item.timestamp)}</td>
        <td><code>${item.barcode}</code></td>
        <td><span class="badge badge-error">${item.problemType}</span></td>
        <td>${item.comment || '-'}</td>
        <td>${item.reportedBy}</td>
        <td><span class="badge ${item.status === 'OPEN' ? 'badge-warning' : 'badge-neutral'}">${item.status}</span></td>
      </tr>
    `
      )
      .join('');
  } catch (err) {
    tableBody.innerHTML = `<tr><td colspan="6" class="empty-table" style="color: var(--red);">Error fetching problem reports.</td></tr>`;
  }
}

/* ==========================================================================
   9. SEARCH & FILTERING UTILITIES
   ========================================================================== */
function initFiltersAndSearch() {
  const productSearch = document.getElementById('search-products-input');
  if (productSearch) {
    productSearch.addEventListener('input', (e) => {
      const term = e.target.value.toLowerCase();
      const rows = document.querySelectorAll('#products-table-body tr');
      rows.forEach((row) => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(term) ? '' : 'none';
      });
    });
  }
}

/* ==========================================================================
   10. HELPER FUNCTIONS & FEEDBACK
   ========================================================================== */
function showToast(message, type = 'info') {
  let toastContainer = document.getElementById('toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;

  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 4000);
}

function formatDate(dateString) {
  if (!dateString) return '-';
  const d = new Date(dateString);
  return isNaN(d.getTime()) ? dateString : d.toLocaleString();
}

function playAlertSound(type) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'success') {
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.1); // A5
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } else {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, ctx.currentTime); // A3
      osc.frequency.setValueAtTime(130.81, ctx.currentTime + 0.15); // C4
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    }
  } catch (e) {
    // Audio context fallback if muted or blocked
  }
}