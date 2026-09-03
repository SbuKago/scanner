(function () {
    "use strict";

    /* =========================================================
       DISPATCH BARCODE SYSTEM
       FULL UPDATED APP.JS
       ========================================================= */

    console.log("Dispatch Barcode System loading...");

    /* =========================================================
       STORAGE
       ========================================================= */
    const STORAGE_KEYS = {
        products: "dispatch_product_master",
        productsVersion: "dispatch_product_master_version",
        loading: "dispatch_loading_records",
        problems: "dispatch_barcode_problems",
        session: "dispatch_session"
    };

    const PRODUCT_MASTER_VERSION = "2026-08-19-FINAL-01";

    const AUTHORIZED_USERS = [
        "Sibusiso Makhonjwa",
        "Afection",
        "Boitumelo",
        "Junior"
    ];

    /* =========================================================
       PRODUCT MASTER
       ========================================================= */
const PRODUCT_MASTER_TSV = `Product Code|Outer Barcode|Barcode|Product|Pack size|Sell by|BB|Cases per pallet|Units per case
413817|#N/A|6009211225657|Lentil & Quinoa Pop Chips – Creamy Cheddar|85 g|112|98|32|12
413807|#N/A|6009207314334|Lentil & Quinoa Pop Chips – Creamy Cheddar|20 g|112|98|70|20
413816|#N/A|6009211225640|Lentil & Quinoa Pop Chips – BBQ|85 g|112|98|32|12
413808|#N/A|6009207314341|Lentil & Quinoa Pop Chips – BBQ|20 g|112|98|70|20
413819|#N/A|6009223668152|Lentil & Quinoa Pop Chips – Sour Cream and Chives|85 g|112|98|32|12
410810|6005000288865|6005000288865|HCC Sea Salt 50g|50g|112|71|42|24
410808|6009184110455|6009184110455|HCC Sea Salt 125g|125g|84|71|20|26
410807|6009184110462|6009184110462|HCC Sea Salt & Black Pepper 125g|125g|84|119|20|26
410811|6005000895865|6005000895865|HCC Sea Salt & Black Pepper 50g|50g|106|119|42|24
410806|6009184110479|6009184110479|HCC Sour Cream & Chives 125g|125g|106|119|20|26
410812|6009184110486|6009184110486|HCC Rosemary & Sea Salt 125g|125g|106|119|20|26
410819|6009214098296|6009214098296|HCC Rottisserie Chicken 125g|125g|106|119|20|26
410809|6009226480089|6009226480089|HCC roast lamb & rosemary flavoured 125g|125g|106|119|20|26
410820|6009226451577|6009226451577|HCC sea salt & white balsamic vinegar flavoured 50g|50g|106|119|42|24
410802|6009226478611|6009226478611|HCC sea salt & white balsamic vinegar flavoured 125g|125g|106|119|20|26
410801|6009226462993|6009226462993|HCC sriracha flavoured 125g|125g|106|119|20|26
410827|6009245410159|6009245410159|HCC Parmesan &Truffle 125g|125g|106|119|20|26
410823|6009245410104|6009245410104|HCC Sweet & Sticky Chilli 50g|50g|106|119|42|24
410824|6009245410111|6009245410111|HCC Sweet & Sticky Chilli 125g|125g|106|119|20|26
410821|6009245410081|6009245410081|HCC Dijon Mustard 50g|50g|106|119|42|24
410822|6009245410098|6009245410098|HCC Dijon Mustard 125g|125g|106|119|20|26
410825|6009245410128|6009245410128|HCC Rotisserie chicken 50g|50g|106|119|42|24
410905|6009173755049|6009173755049|HCS Sea Salt 50g|50g|106|119|42|42
410907|6009173755087|6009173755087|HCS Sea Salt 125g|125g|106|119|42|16
410901|6009184110417|6009184110417|HCS Sea Salt & Black Pepper 125g|125g|106|119|42|16
410904|6009173755056|6009173755056|HCS Sour cream & Red onion 50g|50g|106|119|42|42
410909|6009211697836|6009211697836|HCS Sour cream & Red onion 125g|125g|106|119|42|16
410911|6009226451560|6009226451560|HCS sticky ribs with chilli flavoured 50g|50g|106|119|42|42
410913|6009226462986|6009226462986|HCS sticky ribs with chilli flavoured 125g|125g|106|119|42|16
410916|6009226652455|6009226652455|HCS sea salt & white balsamic vinegar flavoured 50g|50g|106|119|42|42
410914|6009226478628|6009226478628|HCS sea salt & white balsamic vinegar flavoured 125g|125g|106|119|42|16
410912|6009226451584|6009226451584|HCS Sour Cream & Jalapeno 125 g|125g|106|119|42|16
410612|6009223192367|6009223192367|Prawn Cocktail mix 30 g|30 g|98|112|30|48
410611|6009223192336|6009223192336|Prawn Cocktail mix 100 g|100 g|98|112|20|20
410605|6009175940368|6009175940368|Prawn Cocktail 30 g|30 g|98|112|30|48
410604|20024277|20024277|Prawn Cocktail 125 g|125 g|98|112|20|20
410607|6009175940382|6009175940382|Streaky Crackle 30 g|30 g|98|112|30|48
410602|6009178477823|6009178477823|Streaky Crackle 100 g|100 g|98|112|20|20
410606|6009175940399|6009175940399|Sweet Onion Rings 75 g|75 g|98|112|20|20
410603|6008000521604|6008000521604|Salt & Vinegar Onion Rings 75 g|75 g|98|112|20|20
410601|6009175940580|6009175940580|Potato Fries Salt & Vinegar 125 g|125 g|98|112|20|20
410613|6009223398301|6009223398301|Potato Fries Salt & Vinegar 30 g|30 g|98|112|30|48
410404|6009214098241|6009214098241|Lentil Chips Sour Cream & Chives Flavoured 40 g|40 g|98|112|30|45
410403|6009214098258|6009214098258|Lentil Chips Sour Cream & Chives Flavoured100 g|100 g|98|112|20|20
410406|6009214098197|6009214098197|Chickpea Chips Sweet Chilli Flavoured 40 g|40 g|98|112|30|45
410405|6009214098203|6009214098203|Chickpea Chips Sweet Chilli Flavoured 100 g|100 g|98|112|20|20
410407|6009223567240|6009223567240|Chickpea Chips Sea Salt & Black Pepper Flavoured 100 g|100 g|98|112|20|20
410402|6009214098265|6009214098265|Quinoa Chips BBQ Flavoured 40 g|40 g|98|112|30|45
410401|6009214098272|6009214098272|Quinoa Chips BBQ Flavoured 100 g|100 g|98|112|20|20
410408|6009223567257|6009223567257|Quinoa Chips Sea Salt Flavoured 100 g|100 g|98|112|20|20
410409|6009223567264|6009223567264|Lentil Chips Creamy Cheddar Flavoured 100 g|100 g|98|112|20|20
410614|6009214296180|6009214296180|Cocktail Mix Chip BBQ 100 g|100 g|98|112|20|20
410610|6009223187172|6009223187172|Cocktail Mix Chip BBQ 30 g|30 g|98|112|30|48
410617|6007875204742|6007875204742|Corn Crunch Cheddar Flavoured 100g|100 g|98|112|20|20
411416|6009233586477|6009233586477|Cheddar flavoured corn crunch 30 g|30g|98|112|30|48
410615|6009233586453|6009233586453|Tomato Crunch 100g|100g|98|112|20|20
411418|6009233586491|6009233586491|Tomato flavoured corn crunch 30g|30g|98|112|30|48
410616|6009233586460|6009233586460|Jalapeno Crunch 100g|100g|98|112|20|20
411417|6009233586484|6009233586484|Jalapeno Popper flavoured corn crunch 30g|30g|98|112|30|48
412005|6009195223038|6009195223038|POPCORN - Caramel Coated 150 g|150 g|114|155|48|14
412003|6009189862717|6009189862717|POPCORN - Sea Salt 90 g|90 g|127|141|32|14
412004|6009189862700|6009189862700|POPCORN - Salt & Vinegar 90 g|90 g|127|141|32|14
412002|6009189862694|6009189862694|POPCORN - Sour Cream & Chives 90 g|90 g|127|141|32|14
412007|6009195499853|6009195499853|POPCORN - Sour Cream & Chives 25 g|25 g|127|141|48|24
412001|6009189862687|6009189862687|POPCORN - White Cheddar 90 g|90 g|127|141|32|14
412006|6009195499846|6009195499846|POPCORN - White Cheddar 25 g|25 g|127|141|48|24
412009|6009223464297|6009223464297|POPCORN - Feta & Black Pepper 90 g|90 g|127|141|32|14
412010|6009223464303|6009223464303|POPCORN - Jalapeno Atchar 90 g|90 g|127|141|32|14
412011|6009223464327|6009223464327|POPCORN - Butter Flavoured 90 g|90 g|127|141|32|14
4108AA|#N/A|6005574002805|F&F Salt & Vinegar Flavoured Potato Chips 120 g (12)|120g|153|#N/A|81|12
4108AB|#N/A|6005574002812|F&F Tomato Flavoured Potato Chips 120 g (12)|120g|153|#N/A|81|12
4108AC|#N/A|6005574002829|F&F Smoked Beef Flavoured Potato Chips 120 g (12)|120g|153|#N/A|81|12
4108AD|#N/A|6005574000467|F&F Cheese Flavoured Potato Chips 120 g (12)|120g|122|#N/A|81|12
4108AE|#N/A|6005574000573|F&F Lightly Salted Potato Chips 120 g (12)|120g|153|#N/A|81|12
4108AG|#N/A|6005574002850|KC Tomato Flavoured Potato Chips 120 g (12)|120g|153|#N/A|81|12
4108AH|#N/A|6005574002874|KC Grilled Steak Flavoured Potato Chips 120 g (12)|120g|122|#N/A|81|12
4108AI|#N/A|6005574002843|KC Salt & Vinegar Flavoured Potato Chips 36 g (24)|36g|153|#N/A|81|24
4108AJ|#N/A|6005574002867|KC Tomato Flavoured Potato Chips 36 g (24)|36g|153|#N/A|81|24
4108AK|#N/A|6005574002881|KC Grilled Steak Flavoured Potato Chips 36 g (24)|36g|122|#N/A|81|24
4172AH|16009701000266|6009701000269|HP Feta & Black Pepper 90 g - FG017|90 g|210|#N/A|32|14
4172AK|16009701000242|6009701000245|HP Cream Cheese & Chives 90 g - FG015|90 g|210|#N/A|32|14
4172AL|16009701000259|6009701000252|HP Cheesy Cheese 90 g - FG016|90 g|210|#N/A|32|14
4172AR|16005574002000|6005574002003|HP Butter Flavour 90 g - FG020|90 g|210|#N/A|32|14
4172AJ|16009701000280|6009701000283|HP Caramel Popcorn 150 g - FG019|150 g|180|#N/A|48|14
4172AN|16009701000020|6009701000023|HP Caramel Popcorn 22 g x 4 - FG011|22 g x 4|180|#N/A|48|20
4172AB|16005574000914|6005574000917|HP Sweet & Salty Popcorn 90g|90g|210|#N/A|32|14
4165AJ|16005574002819|6005574002812|Field & Flavour Tomato 120g|120g|153|#N/A|20|26
4165AI|16005574002826|6005574002829|Field & Flavour Smoked Beef 120g|120g|153|#N/A|20|26
4165AK|16005574002802|6005574002805|Field & Flavour Salt & vinegar 120g|120g|153|#N/A|20|26
4165AL|16005574003359|6005574000467|Field & Flavour Cheese Flavoured 120g|120g|122|#N/A|20|26
4165AM|16005574003366|6005574000573|Field & Flavour Lightly Salted Flavoured 120g|120g|153|#N/A|20|26
4165AA|16005574002864|6005574002867|KC Tomato Flavoured Chips 36 g|36g|153|#N/A|30|48
4165AC|16005574002840|6005574002843|KC Salt & Vinegar Flavoured Chips 36 g|36g|153|#N/A|30|48
4165AG|16005574002888|6005574002881|KC Grilled Steak Flavoured Chips 36 g|36g|122|#N/A|30|48
4165AB|16005574002857|6005574002850|KC Tomato Flavoured Chips 120 g|120g|153|#N/A|20|26
4165AD|16005574002833|6005574002836|KC Salt & Vinegar Flavoured Chips 120 g|120g|153|#N/A|20|26
4165AH|16005574002871|6005574002874|KC Grilled Steak Flavoured Chips 120 g|120g|122|#N/A|20|26
4108AM|16005574003465|6005574003468|KC Blazin'hot BBQ 36g (48)|36g|122|#N/A|30|48
4108AO|26005574003462|6005574003468|KC Blazin'hot BBQ 36g (24)|36g|122|#N/A|81|24
4108AL|16005574003458|6005574003451|KC Blazin'hot BBQ 120g (26)|120g|122|#N/A|20|26
4108AN|26005574003455|6005574003451|KC Blazin'hot BBQ 120g (12)|120g|122|#N/A|81|12
4108AS|16005574003502|6005574003505|Blue Salt & Vinegar (26)|120g|183|#N/A|20|26
4108BC|26005574003509|6005574003505|Blue Salt & Vinegar (12)|120g|183|#N/A|81|12
4108AR|16005574003496|6005574003499|Salt & Vinegar (26)|120g|183|#N/A|20|26
4108BB|26005574003493|6005574003499|Salt & Vinegar (12)|120g|183|#N/A|81|12
4108AQ|16005574003489|6005574003482|Boerewors (26)|120g|183|#N/A|20|26
4108BA|26005574003486|6005574003482|Boerewors (12)|120g|183|#N/A|81|12
4108AP|16005574003472|6005574003475|Chutney (26)|120g|183|#N/A|20|26
4108AZ|26005574003479|6005574003475|Chutney (12)|120g|183|#N/A|81|12
4108AT|16009710723187|6009710723180|Lay's KC Sea Salt & Black Pepper 120 g|120g|126|#N/A|54|20
4108AU|16009710723156|6009710723159|Lay's KC Sea Salt & Black Pepper 30 g|30g|126|#N/A|56|48
4108AV|16009710723170|6009710723173|Lay's KC Cheddar & Cranberry 120 g|120g|126|#N/A|54|20
4108AY|16009710723149|6009710723142|Lay's KC Cheddar & Cranberry 30 g|30g|126|#N/A|56|48
4108AW|16009710723163|6009710723166|Lay's KC Rib-Eye & Mushroom 120 g|120g|126|#N/A|54|20
4108AX|16009710723132|6009710723135|Lay's KC Rib-Eye & Mushroom 30 g|30g|126|#N/A|56|48
4108AA|26005574002809|6005574002805|F&F Salt & Vinegar Flavoured Potato Chips 120 g (12)|120 g|153|#N/A|81|12
4108AB|26005574002816|6005574002812|F&F Tomato Flavoured Potato Chips 120 g (12)|120 g|153|#N/A|81|12
4108AC|26005574002823|6005574002829|F&F Smoked Beef Flavoured Potato Chips 120 g (12)|120 g|153|#N/A|81|12
4108AD|26005574003356|6005574003352|F&F Cheese Flavoured Potato Chips 120 g (12)|120 g|122|#N/A|81|12
4108AE|26005574003363|6005574003369|F&F Lightly Salted Potato Chips 120 g (12)|120 g|153|#N/A|81|12
4108AF|26005574002830|6005574002836|KC Salt & Vinegar Flavoured Potato Chips 120 g (12)|120 g|153|#N/A|81|12
4108AG|26005574002854|6005574002850|KC Tomato Flavoured Potato Chips 120 g (12)|120 g|153|#N/A|81|12
4108AH|26005574002878|6005574002874|KC Grilled Steak Flavoured Potato Chips 120 g (12)|120 g|153|#N/A|81|12
4108AN|26005574003455|6005574003451|KC Blazin' Hot BBQ Flavoured 120 g (12)|120 g|153|#N/A|81|12
4108AI|26005574002847|6005574002843|KC Salt & Vinegar Flavoured Potato Chips 36 g (24)|36 g|153|#N/A|81|24
4108AJ|26005574002861|6005574002867|KC Tomato Flavoured Potato Chips 36 g (24)|36 g|153|#N/A|81|24
4108AK|26005574002885|6005574002881|KC Grilled Steak Flavoured Potato Chips 36 g (24)|36 g|153|#N/A|81|24
4108AO|26005574003462|6005574003468|KC Blazin' Hot BBQ Flavoured 36 g (24)|36 g|153|#N/A|81|24`;

    function parseProductMaster() {
        const lines = PRODUCT_MASTER_TSV.trim().split(/\r?\n/).map(line => line.trim()).filter(Boolean);

        if (lines.length < 2) {
            console.error("Product master is empty.");
            return [];
        }

        const products = [];

        for (let i = 1; i < lines.length; i++) {
            const columns = lines[i].split("|");

            if (columns.length < 9) {
                console.warn("Invalid product master row:", lines[i]);
                continue;
            }

            products.push({
                productCode: columns[0].trim(),
                outerBarcode: columns[1].trim(),
                barcode: columns[2].trim(),
                product: columns[3].trim(),
                packSize: columns[4].trim(),
                sellBy: columns[5].trim(),
                bb: columns[6].trim(),
                casesPerPallet: columns[7].trim(),
                unitsPerCase: columns[8].trim()
            });
        }

        console.log(`Product master parsed: ${products.length} products`);
        return products;
    }

    const FULL_PRODUCT_MASTER = parseProductMaster();

    /* =========================================================
       STATE
       ========================================================= */
    let products = [];
    let loadingRecords = [];
    let barcodeProblems = [];
    let currentSession = null;
    let currentScannedProduct = null;
    let currentScannedBarcode = "";
    let html5QrCode = null;
    let verifyQrCode = null;

    /* =========================================================
       BASIC HELPERS
       ========================================================= */
    function $(id) {
        return document.getElementById(id);
    }

    function normalizeCode(value) {
        if (value === null || value === undefined) return "";
        return String(value).trim().replace(/[\r\n\t]/g, "").replace(/^["']+|["']+$/g, "").toLowerCase();
    }

    function isValidCode(value) {
        const normalized = normalizeCode(value);
        return (
            normalized !== "" &&
            normalized !== "#n/a" &&
            normalized !== "n/a" &&
            normalized !== "na" &&
            normalized !== "-" &&
            normalized !== "null" &&
            normalized !== "undefined"
        );
    }

    function displayValue(value) {
        if (value === null || value === undefined || String(value).trim() === "" || normalizeCode(value) === "#n/a") {
            return "-";
        }
        return String(value);
    }

    function cleanNumber(value) {
        if (value === null || value === undefined || value === "") return 0;
        const match = String(value).match(/\d+/);
        return match ? parseInt(match[0], 10) : 0;
    }

    function escapeHtml(value) {
        if (value === null || value === undefined) return "";
        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function getToday() {
        const now = new Date();
        return [
            now.getFullYear(),
            String(now.getMonth() + 1).padStart(2, "0"),
            String(now.getDate()).padStart(2, "0")
        ].join("-");
    }

    function loadStorage(key, fallback) {
        try {
            const value = localStorage.getItem(key);
            if (!value) return fallback;
            return JSON.parse(value);
        } catch (error) {
            console.error(`Could not load ${key}:`, error);
            return fallback;
        }
    }

    function saveStorage(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error(`Could not save ${key}:`, error);
        }
    }

function generateId() {
        if (typeof window !== "undefined" && window.crypto && window.crypto.randomUUID) {
            return window.crypto.randomUUID();
        }
        return String(Date.now()) + "-" + Math.floor(Math.random() * 1000);
    }

    /* =========================================================
       LOAD PRODUCT MASTER
       ========================================================= */
    function loadProductMaster() {
        const savedVersion = localStorage.getItem(STORAGE_KEYS.productsVersion);
        const savedProducts = loadStorage(STORAGE_KEYS.products, null);

        if (savedVersion !== PRODUCT_MASTER_VERSION) {
            products = [...FULL_PRODUCT_MASTER];
            saveStorage(STORAGE_KEYS.products, products);
            localStorage.setItem(STORAGE_KEYS.productsVersion, PRODUCT_MASTER_VERSION);
            console.log("New product master installed.");
            return;
        }

        if (Array.isArray(savedProducts) && savedProducts.length > 0) {
            products = savedProducts;
        } else {
            products = [...FULL_PRODUCT_MASTER];
            saveStorage(STORAGE_KEYS.products, products);
        }
    }

    /* =========================================================
       PRODUCT HELPERS
       ========================================================= */
    function getProductDescription(product) {
        if (!product) return "-";
        return product.product || product.description || "-";
    }

    function getProductBB(product) {
        if (!product) return "-";
        return product.bb || product.bbDate || product.bestBefore || "-";
    }

    function getEffectiveOuterBarcode(product) {
        if (!product) return "-";
        if (isValidCode(product.outerBarcode)) {
            return String(product.outerBarcode).trim();
        }
        return isValidCode(product.barcode) ? String(product.barcode).trim() : "-";
    }

    /* =========================================================
       PRODUCT SEARCH
       ========================================================= */
    function getProductByAnyCode(value) {
        const query = normalizeCode(value);
        if (!query) return null;

        const found = products.find(product => {
            if (!product) return false;
            const sku = normalizeCode(product.productCode);
            const barcode = normalizeCode(product.barcode);
            const outerBarcode = normalizeCode(product.outerBarcode);

            return (
                (isValidCode(sku) && sku === query) ||
                (isValidCode(barcode) && barcode === query) ||
                (isValidCode(outerBarcode) && outerBarcode === query)
            );
        });

        if (found) return found;

        return FULL_PRODUCT_MASTER.find(product => {
            const sku = normalizeCode(product.productCode);
            const barcode = normalizeCode(product.barcode);
            const outerBarcode = normalizeCode(product.outerBarcode);

            return (
                (isValidCode(sku) && sku === query) ||
                (isValidCode(barcode) && barcode === query) ||
                (isValidCode(outerBarcode) && outerBarcode === query)
            );
        }) || null;
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
       SESSION UI
       ========================================================= */
    function updateSessionUI() {
    const sessionBadge = $("sessionBadge");
    const scanSessionBadge = $("scanSessionBadge");
    const sessionText = $("dashboardSessionText");
    const sessionSummary = $("sessionSummary");
    const noSessionWarning = $("noSessionWarning");

    if (currentSession) {
        // Active Session UI State
        if (sessionBadge) {
            sessionBadge.textContent = "ACTIVE SESSION";
            sessionBadge.className = "badge badge-success";
        }
        if (scanSessionBadge) {
            scanSessionBadge.textContent = "ACTIVE SESSION";
            scanSessionBadge.className = "badge badge-success";
        }
        if (sessionText) {
            sessionText.textContent = `${currentSession.name || "Session"} (${currentSession.truck || "No Truck"})`;
        }
        if (noSessionWarning) noSessionWarning.classList.add("hidden");
    } else {
        // No Session UI State
        if (sessionBadge) {
            sessionBadge.textContent = "NO SESSION";
            sessionBadge.className = "badge badge-neutral";
        }
        if (scanSessionBadge) {
            scanSessionBadge.textContent = "NO SESSION";
            scanSessionBadge.className = "badge badge-neutral";
        }
        if (sessionText) sessionText.textContent = "No active session.";
        if (sessionSummary) sessionSummary.innerHTML = "";
        if (noSessionWarning) noSessionWarning.classList.remove("hidden");
    }
}

    /* =========================================================
       START SESSION
       ========================================================= */
    function startSession() {
        // Never overwrite an active session just because the modal is opened again.
        if (currentSession) {
            updateSessionUI();
            $("sessionModal")?.classList.add("hidden");
            showToast("A loading session is already active. End it before starting a new one.", "warning");
            return;
        }

        const sessionName = $("sessionName")?.value?.trim() || "Dispatch";
        const sessionUser = $("sessionUser")?.value?.trim() || AUTHORIZED_USERS[0];
        const truck = $("sessionTruck")?.value?.trim() || "TRK-01-GP";
        const customer = $("sessionCustomer")?.value?.trim() || "General Dispatch";
        const delivery = $("sessionDelivery")?.value?.trim() || "DEL-001";

        currentSession = {
            id: generateId(),
            name: sessionName,
            user: sessionUser,
            truck: truck,
            customer: customer,
            delivery: delivery,
            startedAt: new Date().toISOString()
        };

        saveStorage(STORAGE_KEYS.session, currentSession);
        updateSessionUI();
        $("sessionModal")?.classList.add("hidden");

        showToast("Loading session started successfully.", "success");
    }

    /* =========================================================
       END SESSION
       ========================================================= */
    function endSession(event) {
    if (event) event.preventDefault();

    // Prevent errors if no session is active
    if (!currentSession) {
        if (typeof showToast === "function") {
            showToast("No active loading session to end.", "warning");
        } else {
            alert("No active loading session to end.");
        }
        return;
    }

    // Confirm before ending
    const confirmEnd = confirm("Are you sure you want to end the current loading session?");
    if (!confirmEnd) return;

    try {
        // Clear active session
        currentSession = null;
        
        // Save state to local storage
        if (typeof saveStorage === "function" && typeof STORAGE_KEYS !== "undefined") {
            saveStorage(STORAGE_KEYS.session, null);
        } else {
            localStorage.removeItem("dispatch_current_session");
        }

        // Refresh interface components
        if (typeof updateSessionUI === "function") updateSessionUI();
        if (typeof updateDashboard === "function") updateDashboard();

        // Feedback
        if (typeof showToast === "function") {
            showToast("Loading session ended successfully.", "success");
        } else {
            alert("Session ended successfully.");
        }
    } catch (err) {
        console.error("Error ending session:", err);
        alert("Failed to end session: " + err.message);
    }
}

    /* =========================================================
   BARCODE CHECK - DUPLICATES ALLOWED
   ========================================================= */
function checkBarcode() {
    const input = $("barcodeInput");

    if (!input) {
        console.error("barcodeInput was not found.");
        return;
    }

    const rawCode = input.value.trim();

    if (!rawCode) {
        showToast(
            "Scan or enter a SKU, barcode or outer barcode.",
            "warning"
        );
        return;
    }

    // Require an active loading session
    if (!currentSession) {
        showToast(
            "Please start a loading session first.",
            "warning"
        );

        $("sessionModal")?.classList.remove("hidden");
        return;
    }

    currentScannedBarcode = rawCode;

    console.log("Scanning barcode:", rawCode);

    // Find product
    const product = getProductByAnyCode(rawCode);

    console.log("Search result:", product);

    // =====================================================
    // INVALID BARCODE
    // =====================================================
    if (!product) {
        currentScannedProduct = null;

        showInvalidResult(rawCode);

        return;
    }

    // =====================================================
    // VALID PRODUCT
    // DUPLICATES ARE ALLOWED
    // =====================================================

    currentScannedProduct = product;

    const productCode = normalizeCode(product.productCode);

    // Check if this product has already been scanned
    const previousScans = loadingRecords.filter(
        record =>
            normalizeCode(record.productCode) === productCode
    );

    // Duplicate exists, but DO NOT BLOCK the scan
    if (previousScans.length > 0) {

        console.log(
            `Duplicate allowed: ${product.productCode} has been scanned ${previousScans.length} time(s) before.`
        );

        showToast(
            `Duplicate scan allowed: ${getProductDescription(product)}`,
            "warning"
        );
    }

    // Always show the normal valid-product screen
    showValidResult(product, rawCode);
}

    /* =========================================================
       VALID RESULT
       ========================================================= */
    function showValidResult(product, scannedCode) {
        const result = $("scanResult");
        if (!result) return;

        result.className = "scan-result success";
        result.innerHTML = `
            <div class="result-icon">✓</div>
            <h3>VALID PRODUCT MATCH</h3>
            <p><strong>Scanned Code:</strong> ${escapeHtml(scannedCode)}</p>
            <p><strong>Product:</strong> ${escapeHtml(getProductDescription(product))}</p>
            <p><strong>Product Code / SKU:</strong> ${escapeHtml(product.productCode)}</p>
            <p><strong>Barcode:</strong> ${escapeHtml(displayValue(product.barcode))}</p>
            <p><strong>Outer Barcode:</strong> ${escapeHtml(getEffectiveOuterBarcode(product))}</p>
        `;

        renderProductSummary(product);
        showLoadConfirmation(product);
    }

    /* =========================================================
       INVALID RESULT
       ========================================================= */
    function showInvalidResult(scannedCode) {
        const result = $("scanResult");
        if (!result) return;

        result.className = "scan-result error";
        result.innerHTML = `
            <div class="result-icon">✕</div>
            <h3>PRODUCT NOT FOUND</h3>
            <p><strong>Scanned Code:</strong> ${escapeHtml(scannedCode)}</p>
            <p>No match was found for:</p>
            <ul>
                <li>Product Code / SKU</li>
                <li>Barcode</li>
                <li>Outer Barcode</li>
            </ul>
        `;

        $("loadConfirmationPanel")?.classList.add("hidden");
    }

    function showDuplicateResult(scannedCode, duplicates) {
    const result = $("scanResult");
    if (!result) return;

    result.className = "scan-result warning";

    result.innerHTML = `
        <div class="result-icon">⚠</div>
        <h3>DUPLICATE SCAN DETECTED</h3>
        <p><strong>Scanned Code:</strong> ${escapeHtml(scannedCode)}</p>
        <p>This product has already been recorded in the current history.</p>
        <p>Previous records: ${duplicates.length}</p>
    `;

    $("loadConfirmationPanel")?.classList.add("hidden");
}

    /* =========================================================
       PRODUCT SUMMARY
       ========================================================= */
    function renderProductSummary(product) {
        if (!product) return;

        const cases = cleanNumber(product.casesPerPallet);
        const unitsPerCase = cleanNumber(product.unitsPerCase);
        const unitsPerPallet = cases * unitsPerCase;

        if ($("summaryProductCode")) $("summaryProductCode").textContent = displayValue(product.productCode);
        if ($("summaryDescription")) $("summaryDescription").textContent = getProductDescription(product);
        if ($("summaryOuterBarcode")) $("summaryOuterBarcode").textContent = getEffectiveOuterBarcode(product);
        if ($("summaryBarcode")) $("summaryBarcode").textContent = displayValue(product.barcode);
        if ($("summaryCasesPallet")) $("summaryCasesPallet").textContent = displayValue(product.casesPerPallet);
        if ($("summaryUnitsCase")) $("summaryUnitsCase").textContent = unitsPerCase || "-";
        if ($("summaryUnitsPallet")) $("summaryUnitsPallet").textContent = unitsPerPallet || "-";
        if ($("summarySellBy")) $("summarySellBy").textContent = displayValue(product.sellBy);
        if ($("summaryBB")) $("summaryBB").textContent = displayValue(getProductBB(product));
    }

    /* =========================================================
   LOAD CONFIRMATION
   ========================================================= */
function showLoadConfirmation(product) {
    $("loadConfirmationPanel")?.classList.remove("hidden");

    if ($("loadPallets")) {
        $("loadPallets").value = 1;
    }

    calculatePalletTotals();

    // One actual Sell By / BB date for this load.
    if ($("loadSellByBbDate")) {
        $("loadSellByBbDate").value = "";
    }

    // Always take the session details from the active session.
    if (!currentSession) return;

    if ($("loadTruck")) $("loadTruck").value = currentSession.truck || "";
    if ($("loadCustomer")) $("loadCustomer").value = currentSession.customer || "";
    if ($("loadDelivery")) $("loadDelivery").value = currentSession.delivery || "";
    if ($("loadUser")) $("loadUser").value = currentSession.user || AUTHORIZED_USERS[0];
}

    /* =========================================================
   PALLET / CASE / UNIT CALCULATION
   ========================================================= */

// Calculates Cases and Units based on Pallet input
function calculatePalletTotals() {
    if (!currentScannedProduct) return;

    const pallets = parseInt($("loadPallets")?.value || "0", 10) || 0;
    const casesPerPallet = cleanNumber(currentScannedProduct.casesPerPallet);
    
    const totalCases = pallets * casesPerPallet;

    if ($("loadCases")) {
        $("loadCases").value = totalCases > 0 ? totalCases : "";
    }

    // Recalculate total units based on updated cases
    calculateUnitTotals();
}

// Calculates Units based on current Cases input (handles custom case values)
function calculateUnitTotals() {
    if (!currentScannedProduct) return;

    const cases = parseInt($("loadCases")?.value || "0", 10) || 0;
    const unitsPerCase = cleanNumber(currentScannedProduct.unitsPerCase);

    const totalUnits = cases * unitsPerCase;

    if ($("loadQuantity")) {
        $("loadQuantity").value = totalUnits > 0 ? totalUnits : "";
    }
}

    /* =========================================================
       CONFIRM LOAD
       ========================================================= */
    function confirmLoad() {
        if (!currentScannedProduct) {
            showToast("Scan a valid product first.", "warning");
            return;
        }

        if (!currentSession || !currentSession.id) {
            showToast("There is no active loading session. Start a session first.", "warning");
            return;
        }

        // Snapshot the active session BEFORE changing anything else.
        // This guarantees the pallet record uses the same session details.
        const sessionSnapshot = { ...currentSession };

        const pallets = Math.max(0, parseInt($("loadPallets")?.value || "0", 10) || 0);
        const cases = Math.max(0, parseInt($("loadCases")?.value || "0", 10) || 0);
        const units = Math.max(0, parseInt($("loadQuantity")?.value || "0", 10) || 0);
        const sellByBbDate = $("loadSellByBbDate")?.value || "";

        if (pallets === 0) {
            showToast("Enter the number of pallets before saving.", "warning");
            $("loadPallets")?.focus();
            return;
        }

        if (cases === 0) {
            showToast("Enter the actual number of cases before saving.", "warning");
            $("loadCases")?.focus();
            return;
        }

        const duplicateCount = loadingRecords.filter(record =>
            normalizeCode(record.barcode || record.scannedCode || "") === normalizeCode(currentScannedBarcode)
        ).length;

        const record = {
            id: generateId(),
            date: getToday(),
            time: new Date().toLocaleTimeString("en-ZA"),
            truck: sessionSnapshot.truck || "",
            customer: sessionSnapshot.customer || "",
            delivery: sessionSnapshot.delivery || "",
            productCode: currentScannedProduct.productCode,
            barcode: currentScannedProduct.barcode,
            outerBarcode: getEffectiveOuterBarcode(currentScannedProduct),
            product: getProductDescription(currentScannedProduct),
            packSize: currentScannedProduct.packSize,
            sellByBbDate: sellByBbDate,
            // Keep legacy fields for old exports/records, but use the single new date field.
            sellBy: sellByBbDate,
            bb: sellByBbDate,
            pallets: pallets,
            cases: cases,
            quantity: units,
            status: "LOADED",
            loadedBy: $("loadUser")?.value || sessionSnapshot.user || AUTHORIZED_USERS[0],
            sessionId: sessionSnapshot.id,
            sessionName: sessionSnapshot.name || "Dispatch",
            isDuplicate: duplicateCount > 0,
            previousScanCount: duplicateCount
        };

        loadingRecords.push(record);
        saveStorage(STORAGE_KEYS.loading, loadingRecords);

        // IMPORTANT: do NOT clear currentSession here.
        // The session remains active until the user explicitly ends it.
        currentSession = sessionSnapshot;
        saveStorage(STORAGE_KEYS.session, currentSession);
        updateSessionUI();

        currentScannedProduct = null;
        currentScannedBarcode = "";

        if ($("barcodeInput")) $("barcodeInput").value = "";
        $("loadConfirmationPanel")?.classList.add("hidden");

        showToast("Pallet successfully logged. Session remains active.", "success");
        renderLoadingHistory();
        updateDashboard();
    }

    /* =========================================================
       VERIFY
       ========================================================= */
    function performVerify() {
        const input = $("verifyInput");
        const result = $("verifyResult");

        if (!input || !result) return;

        const value = input.value.trim();

        if (!value) {
            showToast("Enter a SKU, barcode or outer barcode.", "warning");
            return;
        }

        const product = getProductByAnyCode(value);

        if (!product) {
            result.className = "scan-result error";
            result.innerHTML = `
                <div class="result-icon">✕</div>
                <h3>NO MATCH FOUND</h3>
                <p>No product found for: <strong>${escapeHtml(value)}</strong></p>
            `;
            return;
        }

        result.className = "scan-result success";
        result.innerHTML = `
            <div class="result-icon">✓</div>
            <h3>PRODUCT VERIFIED</h3>
            <p><strong>Product Code:</strong> ${escapeHtml(product.productCode)}</p>
            <p><strong>Product:</strong> ${escapeHtml(getProductDescription(product))}</p>
            <p><strong>Barcode:</strong> ${escapeHtml(product.barcode)}</p>
            <p><strong>Outer Barcode:</strong> ${escapeHtml(getEffectiveOuterBarcode(product))}</p>
            <p><strong>Pack Size:</strong> ${escapeHtml(displayValue(product.packSize))}</p>
            <p><strong>Sell By:</strong> ${escapeHtml(displayValue(product.sellBy))}</p>
            <p><strong>BB:</strong> ${escapeHtml(displayValue(product.bb))}</p>
            <p><strong>Cases/Pallet:</strong> ${escapeHtml(product.casesPerPallet)}</p>
            <p><strong>Units/Case:</strong> ${escapeHtml(product.unitsPerCase)}</p>
        `;
    }

    /* =========================================================
       PRODUCTS TABLE
       ========================================================= */
    function renderProducts() {
        if ($("productCount")) {
            $("productCount").textContent = products.length;
        }

        if ($("uniqueBarcodeCount")) {
            const unique = new Set(products.map(p => normalizeCode(p.barcode)).filter(Boolean));
            $("uniqueBarcodeCount").textContent = unique.size;
        }

        const body = $("productBody");
        if (!body) return;

        body.innerHTML = products.map(product => `
            <tr>
                <td><code>${escapeHtml(product.productCode)}</code></td>
                <td><code>${escapeHtml(displayValue(product.outerBarcode))}</code></td>
                <td><code>${escapeHtml(product.barcode)}</code></td>
                <td>${escapeHtml(getProductDescription(product))}</td>
                <td>${escapeHtml(displayValue(product.packSize))}</td>
                <td>${escapeHtml(displayValue(product.sellBy))}</td>
                <td>${escapeHtml(displayValue(product.bb))}</td>
                <td>${escapeHtml(displayValue(product.casesPerPallet))}</td>
                <td>${escapeHtml(displayValue(product.unitsPerCase))}</td>
            </tr>
        `).join("");
    }

    /* =========================================================
   HISTORY TABLE
   ========================================================= */

/* =========================================================
   FORMAT HISTORY DATE
   Converts:
   2026-09-03
   into:
   03/09/2026
   ========================================================= */
function formatHistoryDate(value) {

    if (
        value === null ||
        value === undefined ||
        String(value).trim() === ""
    ) {
        return "-";
    }

    const text = String(value).trim();

    // Already DD/MM/YYYY
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(text)) {
        return text;
    }

    // YYYY-MM-DD
    const match = text.match(
        /^(\d{4})-(\d{2})-(\d{2})$/
    );

    if (match) {
        const year = match[1];
        const month = match[2];
        const day = match[3];

        return `${day}/${month}/${year}`;
    }

    // Fallback for unexpected date formats
    return text;
}

function renderLoadingHistory() {
    const body = $("historyBody");
    if (!body) return;

    if (!Array.isArray(loadingRecords) || loadingRecords.length === 0) {
        body.innerHTML = `<tr><td colspan="15" style="text-align:center;">No loading history available.</td></tr>`;
        return;
    }

    body.innerHTML = loadingRecords.slice().reverse().map(record => {
        const dateValue = record.sellByBbDate || record.sellBy || record.bb || "";
        return `
            <tr>
                <td class="history-date">${escapeHtml(formatHistoryDate(record.date))}</td>
                <td>${escapeHtml(record.time || "-")}</td>
                <td>${escapeHtml(record.truck || "-")}</td>
                <td>${escapeHtml(record.customer || "-")}</td>
                <td>${escapeHtml(record.delivery || "-")}</td>
                <td><code>${escapeHtml(record.productCode || "-")}</code></td>
                <td><code>${escapeHtml(record.barcode || "-")}</code></td>
                <td><code>${escapeHtml(record.outerBarcode || "-")}</code></td>
                <td>${escapeHtml(record.product || "-")}</td>
                <td>${escapeHtml(record.pallets ?? "0")}</td>
                <td>${escapeHtml(record.cases ?? "0")}</td>
                <td>${escapeHtml(record.quantity ?? "0")}</td>
                <td>${escapeHtml(formatHistoryDate(dateValue))}</td>
                <td><span class="status-badge">${escapeHtml(record.status || "-")}</span></td>
                <td>${escapeHtml(record.loadedBy || "-")}</td>
            </tr>
        `;
    }).join("");
}

    /* =========================================================
       EXPORT HISTORY TO EXCEL
       ========================================================= */
    function exportHistoryToExcel() {
        if (!loadingRecords.length) {
            showToast("There is no loading history to export.", "warning");
            return;
        }

        if (typeof XLSX === "undefined") {
            showToast("Excel export library is not loaded.", "error");
            return;
        }

        const exportData = loadingRecords.map(record => ({
            Date: record.date || "",
            Time: record.time || "",
            Truck: record.truck || "",
            Customer: record.customer || "",
            Delivery: record.delivery || "",
            "Product Code / SKU": record.productCode || "",
            Barcode: record.barcode || "",
            "Outer Barcode": record.outerBarcode || "",
            Product: record.product || "",
            Pallets: record.pallets ?? "",
            Cases: record.cases ?? "",
            Units: record.quantity ?? "",
            "Sell By / BB": record.sellByBbDate || record.sellBy || record.bb || "",
            Status: record.status || "",
            "Loaded By": record.loadedBy || "",
            "Session ID": record.sessionId || "",
            "Session Name": record.sessionName || ""
        }));

        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Loading History");

        XLSX.writeFile(workbook, `Dispatch_Loading_History_${getToday()}.xlsx`);
        showToast("Loading history exported to Excel.", "success");
    }

    /* =========================================================
       PROBLEMS
       ========================================================= */
    function renderProblems() {
        const body = $("problemBody");
        if (!body) return;

        body.innerHTML = barcodeProblems.slice().reverse().map(problem => `
            <tr>
                <td>${escapeHtml(problem.date)}</td>
                <td>${escapeHtml(problem.time)}</td>
                <td><code>${escapeHtml(problem.barcode)}</code></td>
                <td>${escapeHtml(problem.product)}</td>
                <td>${escapeHtml(problem.type)}</td>
                <td>${escapeHtml(problem.comment)}</td>
                <td>${escapeHtml(problem.reportedBy)}</td>
                <td>${escapeHtml(problem.status)}</td>
            </tr>
        `).join("");
    }

    /* =========================================================
       DASHBOARD
       ========================================================= */
    function updateDashboard() {
        if ($("statPallets")) {
            const totalPallets = loadingRecords.reduce((sum, r) => sum + (parseInt(r.pallets, 10) || 0), 0);
            $("statPallets").textContent = totalPallets;
        }
        if ($("statValid")) $("statValid").textContent = loadingRecords.filter(r => r.status === "LOADED").length;
        if ($("statErrors")) $("statErrors").textContent = barcodeProblems.length;
        if ($("statDuplicates")) $("statDuplicates").textContent = loadingRecords.filter(r => r.isDuplicate).length;

        if ($("statCases")) {
            const totalCases = loadingRecords.reduce((sum, record) => sum + (parseInt(record.cases, 10) || 0), 0);
            $("statCases").textContent = totalCases;
        }

        const recentBody = $("recentLoadingBody");
        if (!recentBody) return;

        recentBody.innerHTML = loadingRecords.slice().reverse().slice(0, 5).map(record => `
            <tr>
                <td>${escapeHtml(record.time)}</td>
                <td>${escapeHtml(record.truck)}</td>
                <td>${escapeHtml(record.customer)}</td>
                <td><code>${escapeHtml(record.barcode)}</code></td>
                <td>${escapeHtml(record.product)}</td>
                <td>${escapeHtml(record.status)}</td>
            </tr>
        `).join("");
    }

    /* =========================================================
       CLEAR HISTORY
       ========================================================= */
    function clearHistory() {
        const confirmed = window.confirm("Are you sure you want to clear all loading history and barcode problems?");
        if (!confirmed) return;

        loadingRecords = [];
        barcodeProblems = [];

        saveStorage(STORAGE_KEYS.loading, loadingRecords);
        saveStorage(STORAGE_KEYS.problems, barcodeProblems);

        renderLoadingHistory();
        renderProblems();
        updateDashboard();
        showToast("History cleared successfully.", "success");
    }

    /* =========================================================
       RESET APP
       ========================================================= */
    function clearCacheAndReset() {
        const confirmed = window.confirm(
            "WARNING!\n\nThis will clear all application data, loading history, problems and active session.\n\nContinue?"
        );

        if (!confirmed) return;

        localStorage.clear();

        products = [...FULL_PRODUCT_MASTER];
        loadingRecords = [];
        barcodeProblems = [];
        currentSession = null;

        saveStorage(STORAGE_KEYS.products, products);
        localStorage.setItem(STORAGE_KEYS.productsVersion, PRODUCT_MASTER_VERSION);
        saveStorage(STORAGE_KEYS.loading, loadingRecords);
        saveStorage(STORAGE_KEYS.problems, barcodeProblems);

        updateSessionUI();
        renderProducts();
        renderLoadingHistory();
        renderProblems();
        updateDashboard();
        showToast("Application reset successfully.", "success");
    }

    /* =========================================================
       NAVIGATION
       ========================================================= */
    function showSection(sectionId) {
        document.querySelectorAll(".page-section").forEach(section => {
            section.classList.toggle("active", section.id === sectionId);
        });

        document.querySelectorAll(".nav-button").forEach(button => {
            button.classList.toggle("active", button.dataset.section === sectionId);
        });

        if (sectionId === "dashboard") updateDashboard();
        if (sectionId === "history") renderLoadingHistory();
        if (sectionId === "products") renderProducts();
        if (sectionId === "problems") renderProblems();
    }

    /* =========================================================
       CAMERA
       ========================================================= */
    async function startCamera() {
        const reader = $("reader");
        if (!reader) {
            showToast("Camera reader was not found.", "error");
            return;
        }

        if (typeof Html5Qrcode === "undefined") {
            showToast("Barcode scanner library is not loaded.", "error");
            return;
        }

        try {
            if (html5QrCode) {
                await stopCamera();
            }

            reader.classList.remove("hidden");
            reader.style.display = "block";
            $("startCameraButton")?.classList.add("hidden");
            $("stopCameraButton")?.classList.remove("hidden");

            html5QrCode = new Html5Qrcode("reader");

            const config = {
                fps: 15,
                qrbox: { width: 250, height: 180 }
            };

            const success = async decodedText => {
                if ($("barcodeInput")) $("barcodeInput").value = decodedText;
                await stopCamera();
                checkBarcode();
            };

            await html5QrCode.start({ facingMode: "environment" }, config, success);
        } catch (error) {
            console.error("Camera error:", error);
            await stopCamera();
            showToast("Unable to access the camera.", "error");
        }
    }

    async function stopCamera() {
        try {
            if (html5QrCode && html5QrCode.isScanning) {
                await html5QrCode.stop();
            }
        } catch (error) {
            console.warn("Camera stop:", error);
        } finally {
            try {
                html5QrCode?.clear();
            } catch (error) {
                console.warn("Camera clear:", error);
            }
            html5QrCode = null;
            $("reader")?.classList.add("hidden");
            if ($("reader")) $("reader").style.display = "none";
            $("startCameraButton")?.classList.remove("hidden");
            $("stopCameraButton")?.classList.add("hidden");
        }
    }

    /* =========================================================
       VERIFY CAMERA
       ========================================================= */
    async function startVerifyCamera() {
        const reader = $("verifyReader");
        if (!reader) {
            showToast("Verify camera reader was not found.", "error");
            return;
        }

        if (typeof Html5Qrcode === "undefined") {
            showToast("Barcode scanner library is not loaded.", "error");
            return;
        }

        try {
            if (verifyQrCode) await stopVerifyCamera();

            reader.classList.remove("hidden");
            reader.style.display = "block";
            $("startVerifyCameraButton")?.classList.add("hidden");
            $("stopVerifyCameraButton")?.classList.remove("hidden");

            verifyQrCode = new Html5Qrcode("verifyReader");

            const config = {
                fps: 15,
                qrbox: { width: 250, height: 180 }
            };

            const success = async decodedText => {
                if ($("verifyInput")) $("verifyInput").value = decodedText;
                await stopVerifyCamera();
                performVerify();
            };

            await verifyQrCode.start({ facingMode: "environment" }, config, success);
        } catch (error) {
            console.error("Verify camera error:", error);
            await stopVerifyCamera();
            showToast("Unable to access the verification camera.", "error");
        }
    }

    async function stopVerifyCamera() {
        try {
            if (verifyQrCode && verifyQrCode.isScanning) {
                await verifyQrCode.stop();
            }
        } catch (error) {
            console.warn("Verify camera stop:", error);
        } finally {
            try {
                verifyQrCode?.clear();
            } catch (error) {
                console.warn("Verify camera clear:", error);
            }
            verifyQrCode = null;
            $("verifyReader")?.classList.add("hidden");
            if ($("verifyReader")) $("verifyReader").style.display = "none";
            $("startVerifyCameraButton")?.classList.remove("hidden");
            $("stopVerifyCameraButton")?.classList.add("hidden");
        }
    }

    /* =========================================================
       MENU
       ========================================================= */
    /* =========================================================
   MOBILE MENU
   ========================================================= */
function setupMenu() {
    const menuButton = $("menuButton");
    const mainNav = $("mainNav");

    if (!menuButton || !mainNav) {
        console.warn("Menu button or main navigation not found.");
        return;
    }

    // Prevent duplicate event listeners
    if (menuButton.dataset.menuReady === "true") {
        return;
    }

    menuButton.dataset.menuReady = "true";

    menuButton.addEventListener("click", function (event) {
        event.preventDefault();
        event.stopPropagation();

        const isOpen = mainNav.classList.toggle("open");

        // Accessibility
        menuButton.setAttribute("aria-expanded", String(isOpen));
        menuButton.setAttribute(
            "aria-label",
            isOpen ? "Close menu" : "Open menu"
        );

        // Change hamburger icon
        menuButton.textContent = isOpen ? "✕" : "☰";
    });

    // Close menu when a navigation button is selected
    mainNav.querySelectorAll(".nav-button").forEach(button => {
        button.addEventListener("click", function () {
            mainNav.classList.remove("open");

            menuButton.setAttribute("aria-expanded", "false");
            menuButton.setAttribute("aria-label", "Open menu");
            menuButton.textContent = "☰";
        });
    });

    // Close menu when clicking outside it
    document.addEventListener("click", function (event) {
        if (
            mainNav.classList.contains("open") &&
            !mainNav.contains(event.target) &&
            !menuButton.contains(event.target)
        ) {
            mainNav.classList.remove("open");

            menuButton.setAttribute("aria-expanded", "false");
            menuButton.setAttribute("aria-label", "Open menu");
            menuButton.textContent = "☰";
        }
    });

    // Close menu with Escape
    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape" && mainNav.classList.contains("open")) {
            mainNav.classList.remove("open");

            menuButton.setAttribute("aria-expanded", "false");
            menuButton.setAttribute("aria-label", "Open menu");
            menuButton.textContent = "☰";
        }
    });

    // Initial state
    menuButton.setAttribute("aria-expanded", "false");
}

    /* =========================================================
       EVENT LISTENERS
       ========================================================= */
    function setupEventListeners() {
        /* MAIN NAVIGATION & MOBILE MENU FIX */
        document.querySelectorAll(".nav-button").forEach(button => {
            button.addEventListener("click", event => {
                event.preventDefault();
                const section = button.dataset.section;
                if (section) {
                    showSection(section);
                    
                    // Close the mobile menu automatically after selecting a page
                    const mainNav = $("mainNav");
                    if (mainNav && mainNav.classList.contains("open")) {
                        mainNav.classList.remove("open");
                    }
                }
            });
        });

/* LOAD CALCULATIONS */
        $("loadPallets")?.addEventListener("input", calculatePalletTotals);
        $("loadPallets")?.addEventListener("change", calculatePalletTotals);
        $("loadCases")?.addEventListener("input", calculateUnitTotals);
        $("loadCases")?.addEventListener("change", calculateUnitTotals);

        /* INTERNAL LINKING (DATA-GO BUTTONS) */
        document.querySelectorAll("[data-go]").forEach(button => {
            button.addEventListener("click", event => {
                event.preventDefault();
                const section = button.dataset.go;
                if (section) showSection(section);
            });
        });

        /* SCANNING */
        $("checkBarcodeButton")?.addEventListener("click", checkBarcode);
        $("barcodeInput")?.addEventListener("keydown", event => {
            if (event.key === "Enter") {
                event.preventDefault();
                checkBarcode();
            }
        });

        /* LOAD */
        $("confirmLoadButton")?.addEventListener("click", confirmLoad);
        $("cancelLoadButton")?.addEventListener("click", event => {
            event.preventDefault();
            $("loadConfirmationPanel")?.classList.add("hidden");
        });
        /* VERIFY */
        $("verifyButton")?.addEventListener("click", performVerify);
        $("verifyInput")?.addEventListener("keydown", event => {
            if (event.key === "Enter") {
                event.preventDefault();
                performVerify();
            }
        });

        /* START SESSION */
        $("startSessionButton")?.addEventListener("click", startSession);
        $("startSessionFromScan")?.addEventListener("click", () => {
            $("sessionModal")?.classList.remove("hidden");
        });

        /* CANCEL SESSION */
        $("cancelSessionButton")?.addEventListener("click", event => {
            event.preventDefault();
            $("sessionModal")?.classList.add("hidden");
        });
        $("closeSessionModal")?.addEventListener("click", event => {
            event.preventDefault();
            $("sessionModal")?.classList.add("hidden");
        });

        /* END CURRENT SESSION */
        document.querySelectorAll(".end-session-button").forEach(button => {
            button.addEventListener("click", endSession);
        });
        // Backwards compatibility if an older HTML still has the original ID.
        const legacyEndButton = document.getElementById("endCurrentSessionButton");
        if (legacyEndButton && !legacyEndButton.classList.contains("end-session-button")) {
            legacyEndButton.addEventListener("click", endSession);
        }

        /* OTHER LISTENERS */
        $("exportHistoryButton")?.addEventListener("click", exportHistoryToExcel);
        $("startCameraButton")?.addEventListener("click", startCamera);
        $("stopCameraButton")?.addEventListener("click", stopCamera);
        $("startVerifyCameraButton")?.addEventListener("click", startVerifyCamera);
        $("stopVerifyCameraButton")?.addEventListener("click", stopVerifyCamera);
        $("clearHistoryButton")?.addEventListener("click", clearHistory);
        $("clearCacheButton")?.addEventListener("click", clearCacheAndReset);
        $("clearCacheSettingsButton")?.addEventListener("click", clearCacheAndReset);
        
        $("dashboardScanButton")?.addEventListener("click", () => {
            showSection("scan");
        });

        /* MENU */
        setupMenu();
    }

    /* =========================================================
       INITIALIZE
       ========================================================= */
    function initializeApp() {
        try {
            console.log("======================================");
            console.log("Dispatch Barcode System initializing...");

            loadProductMaster();

            loadingRecords = loadStorage(STORAGE_KEYS.loading, []);
            barcodeProblems = loadStorage(STORAGE_KEYS.problems, []);
            currentSession = loadStorage(STORAGE_KEYS.session, null);

            updateSessionUI();
            
            // Attach event listeners FIRST before rendering heavy DOM elements
            setupEventListeners();
            
            renderProducts();
            renderLoadingHistory();
            renderProblems();
            updateDashboard();

            const activeSection = document.querySelector(".page-section.active");
            if (!activeSection && $("dashboard")) {
                showSection("dashboard");
            }

            console.log("Dispatch Barcode System ready.");
        } catch (error) {
            console.error("CRITICAL INIT ERROR:", error);
            alert("App failed to load: " + error.message);
        }
    }

    /* =========================================================
       START
       ========================================================= */
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initializeApp, { once: true });
    } else {
        initializeApp();
    }

})();