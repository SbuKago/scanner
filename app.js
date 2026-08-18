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
    { productCode: "413817", outerBarcode: "#N/A", barcode: "6009211225657", product: "Lentil & Quinoa Pop Chips – Creamy Cheddar", packSize: "85 g", sellBy: "112", bb: "98", casesPerPallet: "32", unitsPerCase: "12", unitsPerOuter: "#N/A" },
    { productCode: "413807", outerBarcode: "#N/A", barcode: "6009207314334", product: "Lentil & Quinoa Pop Chips – Creamy Cheddar", packSize: "20 g", sellBy: "112", bb: "98", casesPerPallet: "70", unitsPerCase: "20", unitsPerOuter: "#N/A" },
    { productCode: "413816", outerBarcode: "#N/A", barcode: "6009211225640", product: "Lentil & Quinoa Pop Chips – BBQ", packSize: "85 g", sellBy: "112", bb: "98", casesPerPallet: "32", unitsPerCase: "12", unitsPerOuter: "#N/A" },
    { productCode: "413808", outerBarcode: "#N/A", barcode: "6009207314341", product: "Lentil & Quinoa Pop Chips – BBQ", packSize: "20 g", sellBy: "112", bb: "98", casesPerPallet: "70", unitsPerCase: "20", unitsPerOuter: "#N/A" },
    { productCode: "413819", outerBarcode: "#N/A", barcode: "6009223668152", product: "Lentil & Quinoa Pop Chips – Sour Cream and Chives", packSize: "85 g", sellBy: "112", bb: "98", casesPerPallet: "32", unitsPerCase: "12", unitsPerOuter: "#N/A" },
    { productCode: "410810", outerBarcode: "16005000288862", barcode: "6005000288865", product: "HCC Sea Salt 50g", packSize: "50g", sellBy: "112", bb: "71", casesPerPallet: "42", unitsPerCase: "24", unitsPerOuter: "24 / Outer Case" },
    { productCode: "410808", outerBarcode: "16009184110452", barcode: "6009184110455", product: "HCC Sea Salt 125g", packSize: "125g", sellBy: "84", bb: "71", casesPerPallet: "20", unitsPerCase: "26", unitsPerOuter: "26 / Outer Case" },
    { productCode: "410807", outerBarcode: "16009184110469", barcode: "6009184110462", product: "HCC Sea Salt & Black Pepper 125g", packSize: "125g", sellBy: "84", bb: "119", casesPerPallet: "20", unitsPerCase: "26", unitsPerOuter: "26 / Outer Case" },
    { productCode: "410811", outerBarcode: "16005000895862", barcode: "6005000895865", product: "HCC Sea Salt & Black Pepper 50g", packSize: "50g", sellBy: "106", bb: "119", casesPerPallet: "42", unitsPerCase: "24", unitsPerOuter: "24 / Outer Case" },
    { productCode: "410806", outerBarcode: "16009184110476", barcode: "6009184110479", product: "HCC Sour Cream & Chives 125g", packSize: "125g", sellBy: "106", bb: "119", casesPerPallet: "20", unitsPerCase: "26", unitsPerOuter: "26 / Outer Case" },
    { productCode: "410812", outerBarcode: "16009184110483", barcode: "6009184110486", product: "HCC Rosemary & Sea Salt 125g", packSize: "125g", sellBy: "106", bb: "119", casesPerPallet: "20", unitsPerCase: "26", unitsPerOuter: "26 / Outer Case" },
    { productCode: "410819", outerBarcode: "16009214098293", barcode: "6009214098296", product: "HCC Rotisserie Chicken 125g", packSize: "125g", sellBy: "106", bb: "119", casesPerPallet: "20", unitsPerCase: "26", unitsPerOuter: "26 / Outer Case" },
    { productCode: "410809", outerBarcode: "16009226480086", barcode: "6009226480089", product: "HCC roast lamb & rosemary flavoured 125g", packSize: "125g", sellBy: "106", bb: "119", casesPerPallet: "20", unitsPerCase: "26", unitsPerOuter: "26 / Outer Case" },
    { productCode: "410820", outerBarcode: "16009226451574", barcode: "6009226451577", product: "HCC sea salt & white balsamic vinegar flavoured 50g", packSize: "50g", sellBy: "106", bb: "119", casesPerPallet: "42", unitsPerCase: "24", unitsPerOuter: "24 / Outer Case" },
    { productCode: "410802", outerBarcode: "16009226478618", barcode: "6009226478611", product: "HCC sea salt & white balsamic vinegar flavoured 125g", packSize: "125g", sellBy: "106", bb: "119", casesPerPallet: "20", unitsPerCase: "26", unitsPerOuter: "26 / Outer Case" },
    { productCode: "410801", outerBarcode: "16009226462990", barcode: "6009226462993", product: "HCC sriracha flavoured 125g", packSize: "125g", sellBy: "106", bb: "119", casesPerPallet: "20", unitsPerCase: "26", unitsPerOuter: "26 / Outer Case" },
    { productCode: "410827", outerBarcode: "16009245410156", barcode: "6009245410159", product: "HCC Parmesan & Truffle 125g", packSize: "125g", sellBy: "106", bb: "119", casesPerPallet: "20", unitsPerCase: "26", unitsPerOuter: "26 / Outer Case" },
    { productCode: "410823", outerBarcode: "16009245410101", barcode: "6009245410104", product: "HCC Sweet & Sticky Chilli 50g", packSize: "50g", sellBy: "106", bb: "119", casesPerPallet: "42", unitsPerCase: "24", unitsPerOuter: "24 / Outer Case" },
    { productCode: "410824", outerBarcode: "16009245410118", barcode: "6009245410111", product: "HCC Sweet & Sticky Chilli 125g", packSize: "125g", sellBy: "106", bb: "119", casesPerPallet: "20", unitsPerCase: "26", unitsPerOuter: "26 / Outer Case" },
    { productCode: "410821", outerBarcode: "16009245410088", barcode: "6009245410081", product: "HCC Dijon Mustard 50g", packSize: "50g", sellBy: "106", bb: "119", casesPerPallet: "42", unitsPerCase: "24", unitsPerOuter: "24 / Outer Case" },
    { productCode: "410822", outerBarcode: "16009245410095", barcode: "6009245410098", product: "HCC Dijon Mustard 125g", packSize: "125g", sellBy: "106", bb: "119", casesPerPallet: "20", unitsPerCase: "26", unitsPerOuter: "26 / Outer Case" },
    { productCode: "410825", outerBarcode: "16009245410125", barcode: "6009245410128", product: "HCC Rotisserie chicken 50g", packSize: "50g", sellBy: "106", bb: "119", casesPerPallet: "42", unitsPerCase: "24", unitsPerOuter: "24 / Outer Case" },
    { productCode: "410905", outerBarcode: "16009173755046", barcode: "6009173755049", product: "HCS Sea Salt 50g", packSize: "50g", sellBy: "106", bb: "119", casesPerPallet: "42", unitsPerCase: "42", unitsPerOuter: "42 / Outer Case" },
    { productCode: "410907", outerBarcode: "16009173755084", barcode: "6009173755087", product: "HCS Sea Salt 125g", packSize: "125g", sellBy: "106", bb: "119", casesPerPallet: "42", unitsPerCase: "16", unitsPerOuter: "16 / Outer Case" },
    { productCode: "410901", outerBarcode: "16009184110414", barcode: "6009184110417", product: "HCS Sea Salt & Black Pepper 125g", packSize: "125g", sellBy: "106", bb: "119", casesPerPallet: "42", unitsPerCase: "16", unitsPerOuter: "16 / Outer Case" },
    { productCode: "410904", outerBarcode: "16009173755053", barcode: "6009173755056", product: "HCS Sour cream & Red onion 50g", packSize: "50g", sellBy: "106", bb: "119", casesPerPallet: "42", unitsPerCase: "42", unitsPerOuter: "42 / Outer Case" },
    { productCode: "410909", outerBarcode: "16009211697833", barcode: "6009211697836", product: "HCS Sour cream & Red onion 125g", packSize: "125g", sellBy: "106", bb: "119", casesPerPallet: "42", unitsPerCase: "16", unitsPerOuter: "16 / Outer Case" },
    { productCode: "410911", outerBarcode: "16009226451567", barcode: "6009226451560", product: "HCS sticky ribs with chilli flavoured 50g", packSize: "50g", sellBy: "106", bb: "119", casesPerPallet: "42", unitsPerCase: "42", unitsPerOuter: "42 / Outer Case" },
    { productCode: "410913", outerBarcode: "16009226462983", barcode: "6009226462986", product: "HCS sticky ribs with chilli flavoured 125g", packSize: "125g", sellBy: "106", bb: "119", casesPerPallet: "42", unitsPerCase: "16", unitsPerOuter: "16 / Outer Case" },
    { productCode: "410916", outerBarcode: "16009226652452", barcode: "6009226652455", product: "HCS sea salt & white balsamic vinegar flavoured 50g", packSize: "50g", sellBy: "106", bb: "119", casesPerPallet: "42", unitsPerCase: "42", unitsPerOuter: "42 / Outer Case" },
    { productCode: "410914", outerBarcode: "16009226478625", barcode: "6009226478628", product: "HCS sea salt & white balsamic vinegar flavoured 125g", packSize: "125g", sellBy: "106", bb: "119", casesPerPallet: "42", unitsPerCase: "16", unitsPerOuter: "16 / Outer Case" },
    { productCode: "410912", outerBarcode: "16009226451581", barcode: "6009226451584", product: "HCS Sour Cream & Jalapeno 125 g", packSize: "125g", sellBy: "106", bb: "119", casesPerPallet: "42", unitsPerCase: "16", unitsPerOuter: "16 / Outer Case" },
    { productCode: "410612", outerBarcode: "16009223192364", barcode: "6009223192367", product: "Prawn Cocktail mix 30 g", packSize: "30 g", sellBy: "98", bb: "112", casesPerPallet: "30", unitsPerCase: "48", unitsPerOuter: "48 / Outer Case" },
    { productCode: "410611", outerBarcode: "16009223192333", barcode: "6009223192336", product: "Prawn Cocktail mix 100 g", packSize: "100 g", sellBy: "98", bb: "112", casesPerPallet: "20", unitsPerCase: "20", unitsPerOuter: "20 / Outer Case" },
    { productCode: "410605", outerBarcode: "16009175940365", barcode: "6009175940368", product: "Prawn Cocktail 30 g", packSize: "30 g", sellBy: "98", bb: "112", casesPerPallet: "30", unitsPerCase: "48", unitsPerOuter: "48 / Outer Case" },
    { productCode: "410604", outerBarcode: "10200242774", barcode: "20024277", product: "Prawn Cocktail 125 g", packSize: "125 g", sellBy: "98", bb: "112", casesPerPallet: "20", unitsPerCase: "20", unitsPerOuter: "20 / Outer Case" },
    { productCode: "410607", outerBarcode: "16009175940389", barcode: "6009175940382", product: "Streaky Crackle 30 g", packSize: "30 g", sellBy: "98", bb: "112", casesPerPallet: "30", unitsPerCase: "48", unitsPerOuter: "48 / Outer Case" },
    { productCode: "410602", outerBarcode: "16009178477820", barcode: "6009178477823", product: "Streaky Crackle 100 g", packSize: "100 g", sellBy: "98", bb: "112", casesPerPallet: "20", unitsPerCase: "20", unitsPerOuter: "20 / Outer Case" },
    { productCode: "410606", outerBarcode: "16009175940396", barcode: "6009175940399", product: "Sweet Onion Rings 75 g", packSize: "75 g", sellBy: "98", bb: "112", casesPerPallet: "20", unitsPerCase: "20", unitsPerOuter: "20 / Outer Case" },
    { productCode: "410603", outerBarcode: "16008000521601", barcode: "6008000521604", product: "Salt & Vinegar Onion Rings 75 g", packSize: "75 g", sellBy: "98", bb: "112", casesPerPallet: "20", unitsPerCase: "20", unitsPerOuter: "20 / Outer Case" },
    { productCode: "410601", outerBarcode: "16009175940587", barcode: "6009175940580", product: "Potato Fries Salt & Vinegar 125 g", packSize: "125 g", sellBy: "98", bb: "112", casesPerPallet: "20", unitsPerCase: "20", unitsPerOuter: "20 / Outer Case" },
    { productCode: "410613", outerBarcode: "16009223398308", barcode: "6009223398301", product: "Potato Fries Salt & Vinegar 30 g", packSize: "30 g", sellBy: "98", bb: "112", casesPerPallet: "30", unitsPerCase: "48", unitsPerOuter: "48 / Outer Case" },
    { productCode: "410404", outerBarcode: "16009214098248", barcode: "6009214098241", product: "Lentil Chips Sour Cream & Chives Flavoured 40 g", packSize: "40 g", sellBy: "98", bb: "112", casesPerPallet: "30", unitsPerCase: "45", unitsPerOuter: "45 / Outer Case" },
    { productCode: "410403", outerBarcode: "16009214098255", barcode: "6009214098258", product: "Lentil Chips Sour Cream & Chives Flavoured 100 g", packSize: "100 g", sellBy: "98", bb: "112", casesPerPallet: "20", unitsPerCase: "20", unitsPerOuter: "20 / Outer Case" },
    { productCode: "410406", outerBarcode: "16009214098194", barcode: "6009214098197", product: "Chickpea Chips Sweet Chilli Flavoured 40 g", packSize: "40 g", sellBy: "98", bb: "112", casesPerPallet: "30", unitsPerCase: "45", unitsPerOuter: "45 / Outer Case" },
    { productCode: "410405", outerBarcode: "16009214098200", barcode: "6009214098203", product: "Chickpea Chips Sweet Chilli Flavoured 100 g", packSize: "100 g", sellBy: "98", bb: "112", casesPerPallet: "20", unitsPerCase: "20", unitsPerOuter: "20 / Outer Case" },
    { productCode: "410407", outerBarcode: "16009223567247", barcode: "6009223567240", product: "Chickpea Chips Sea Salt & Black Pepper Flavoured 100 g", packSize: "100 g", sellBy: "98", bb: "112", casesPerPallet: "20", unitsPerCase: "20", unitsPerOuter: "20 / Outer Case" },
    { productCode: "410402", outerBarcode: "16009214098262", barcode: "6009214098265", product: "Quinoa Chips BBQ Flavoured 40 g", packSize: "40 g", sellBy: "98", bb: "112", casesPerPallet: "30", unitsPerCase: "45", unitsPerOuter: "45 / Outer Case" },
    { productCode: "410401", outerBarcode: "16009214098279", barcode: "6009214098272", product: "Quinoa Chips BBQ Flavoured 100 g", packSize: "100 g", sellBy: "98", bb: "112", casesPerPallet: "20", unitsPerCase: "20", unitsPerOuter: "20 / Outer Case" },
    { productCode: "410408", outerBarcode: "16009223567254", barcode: "6009223567257", product: "Quinoa Chips Sea Salt Flavoured 100 g", packSize: "100 g", sellBy: "98", bb: "112", casesPerPallet: "20", unitsPerCase: "20", unitsPerOuter: "20 / Outer Case" },
    { productCode: "410409", outerBarcode: "16009223567261", barcode: "6009223567264", product: "Lentil Chips Creamy Cheddar Flavoured 100 g", packSize: "100 g", sellBy: "98", bb: "112", casesPerPallet: "20", unitsPerCase: "20", unitsPerOuter: "20 / Outer Case" },
    { productCode: "410614", outerBarcode: "16009214296187", barcode: "6009214296180", product: "Cocktail Mix Chip BBQ 100 g", packSize: "100 g", sellBy: "98", bb: "112", casesPerPallet: "20", unitsPerCase: "20", unitsPerOuter: "20 / Outer Case" },
    { productCode: "410610", outerBarcode: "16009223187179", barcode: "6009223187172", product: "Cocktail Mix Chip BBQ 30 g", packSize: "30 g", sellBy: "98", bb: "112", casesPerPallet: "35", unitsPerCase: "48", unitsPerOuter: "48 / Outer Case" },
    { productCode: "410617", outerBarcode: "16007875204749", barcode: "6007875204742", product: "Corn Crunch Cheddar Flavoured 100g", packSize: "100 g", sellBy: "98", bb: "112", casesPerPallet: "20", unitsPerCase: "20", unitsPerOuter: "20 / Outer Case" },
    { productCode: "411416", outerBarcode: "16009233586474", barcode: "6009233586477", product: "Cheddar flavoured corn crunch 30 g", packSize: "30g", sellBy: "98", bb: "112", casesPerPallet: "30", unitsPerCase: "48", unitsPerOuter: "48 / Outer Case" },
    { productCode: "410615", outerBarcode: "16009233586450", barcode: "6009233586453", product: "Tomato Crunch 100g", packSize: "100g", sellBy: "98", bb: "112", casesPerPallet: "20", unitsPerCase: "20", unitsPerOuter: "20 / Outer Case" },
    { productCode: "411418", outerBarcode: "16009233586498", barcode: "6009233586491", product: "Tomato flavoured corn crunch 30g", packSize: "30g", sellBy: "98", bb: "112", casesPerPallet: "30", unitsPerCase: "48", unitsPerOuter: "48 / Outer Case" },
    { productCode: "410616", outerBarcode: "16009233586467", barcode: "6009233586460", product: "Jalapeno Crunch 100g", packSize: "100g", sellBy: "98", bb: "112", casesPerPallet: "20", unitsPerCase: "20", unitsPerOuter: "20 / Outer Case" },
    { productCode: "411417", outerBarcode: "16009233586481", barcode: "6009233586484", product: "Jalapeno Popper flavoured corn crunch 30g", packSize: "30g", sellBy: "98", bb: "112", casesPerPallet: "30", unitsPerCase: "48", unitsPerOuter: "48 / Outer Case" },
    { productCode: "412005", outerBarcode: "16009195223035", barcode: "6009195223038", product: "POPCORN - Caramel Coated 150 g", packSize: "150 g", sellBy: "114", bb: "155", casesPerPallet: "48", unitsPerCase: "14", unitsPerOuter: "14 / Outer Case" },
    { productCode: "412003", outerBarcode: "16009189862714", barcode: "6009189862717", product: "POPCORN - Sea Salt 90 g", packSize: "90 g", sellBy: "127", bb: "141", casesPerPallet: "32", unitsPerCase: "14", unitsPerOuter: "14 / Outer Case" },
    { productCode: "412004", outerBarcode: "16009189862707", barcode: "6009189862700", product: "POPCORN - Salt & Vinegar 90 g", packSize: "90 g", sellBy: "127", bb: "141", casesPerPallet: "32", unitsPerCase: "14", unitsPerOuter: "14 / Outer Case" },
    { productCode: "412002", outerBarcode: "16009189862691", barcode: "6009189862694", product: "POPCORN - Sour Cream & Chives 90 g", packSize: "90 g", sellBy: "127", bb: "141", casesPerPallet: "32", unitsPerCase: "14", unitsPerOuter: "14 / Outer Case" },
    { productCode: "412007", outerBarcode: "16009195499850", barcode: "6009195499853", product: "POPCORN - Sour Cream & Chives 25 g", packSize: "25 g", sellBy: "127", bb: "141", casesPerPallet: "48", unitsPerCase: "24", unitsPerOuter: "24 / Outer Case" },
    { productCode: "412001", outerBarcode: "16009189862684", barcode: "6009189862687", product: "POPCORN - White Cheddar 90 g", packSize: "90 g", sellBy: "127", bb: "141", casesPerPallet: "32", unitsPerCase: "14", unitsPerOuter: "14 / Outer Case" },
    { productCode: "412006", outerBarcode: "16009195499843", barcode: "6009195499846", product: "POPCORN - White Cheddar 25 g", packSize: "25 g", sellBy: "127", bb: "141", casesPerPallet: "48", unitsPerCase: "24", unitsPerOuter: "24 / Outer Case" },
    { productCode: "412009", outerBarcode: "16009223464294", barcode: "6009223464297", product: "POPCORN - Feta & Black Pepper 90 g", packSize: "90 g", sellBy: "127", bb: "141", casesPerPallet: "32", unitsPerCase: "14", unitsPerOuter: "14 / Outer Case" },
    { productCode: "412010", outerBarcode: "16009223464300", barcode: "6009223464303", product: "POPCORN - Jalapeno Atchar 90 g", packSize: "90 g", sellBy: "127", bb: "141", casesPerPallet: "32", unitsPerCase: "14", unitsPerOuter: "14 / Outer Case" },
    { productCode: "412011", outerBarcode: "16009223464324", barcode: "6009223464327", product: "POPCORN - Butter Flavoured 90 g", packSize: "90 g", sellBy: "127", bb: "141", casesPerPallet: "32", unitsPerCase: "14", unitsPerOuter: "14 / Outer Case" },
    { productCode: "4172AH", outerBarcode: "16009701000266", barcode: "6009701000269", product: "HP Feta & Black Pepper 90 g - FG017", packSize: "90 g", sellBy: "210", bb: "32", casesPerPallet: "14", unitsPerCase: "14", unitsPerOuter: "14 / Outer Case" },
    { productCode: "4172AK", outerBarcode: "16009701000242", barcode: "6009701000245", product: "HP Cream Cheese & Chives 90 g - FG015", packSize: "90 g", sellBy: "210", bb: "32", casesPerPallet: "14", unitsPerCase: "14", unitsPerOuter: "14 / Outer Case" },
    { productCode: "4172AL", outerBarcode: "16009701000259", barcode: "6009701000252", product: "HP Cheesy Cheese 90 g - FG016", packSize: "90 g", sellBy: "210", bb: "32", casesPerPallet: "14", unitsPerCase: "14", unitsPerOuter: "14 / Outer Case" },
    { productCode: "4172AR", outerBarcode: "16005574002000", barcode: "6005574002003", product: "HP Butter Flavour 90 g - FG020", packSize: "90 g", sellBy: "210", bb: "32", casesPerPallet: "14", unitsPerCase: "14", unitsPerOuter: "14 / Outer Case" },
    { productCode: "4172AJ", outerBarcode: "16009701000280", barcode: "6009701000283", product: "HP Caramel Popcorn 150 g - FG019", packSize: "150 g", sellBy: "180", bb: "48", casesPerPallet: "14", unitsPerCase: "14", unitsPerOuter: "14 / Outer Case" },
    { productCode: "4172AN", outerBarcode: "16009701000020", barcode: "6009701000023", product: "HP Caramel Popcorn 22 g x 4 - FG011", packSize: "22 g x 4", sellBy: "180", bb: "48", casesPerPallet: "20", unitsPerCase: "20", unitsPerOuter: "20 / Outer Case" },
    { productCode: "4172AB", outerBarcode: "16005574000914", barcode: "6005574000917", product: "HP Sweet & Salty Popcorn 90g", packSize: "90g", sellBy: "210", bb: "32", casesPerPallet: "14", unitsPerCase: "14", unitsPerOuter: "14 / Outer Case" },
    { productCode: "4165AJ", outerBarcode: "16005574002819", barcode: "6005574002812", product: "Field & Flavour Tomato 120g", packSize: "120g", sellBy: "153", bb: "20", casesPerPallet: "26", unitsPerCase: "26", unitsPerOuter: "26 / Outer Case" },
    { productCode: "4165AI", outerBarcode: "16005574002826", barcode: "6005574002829", product: "Field & Flavour Smoked Beef 120g", packSize: "120g", sellBy: "153", bb: "20", casesPerPallet: "26", unitsPerCase: "26", unitsPerOuter: "26 / Outer Case" },
    { productCode: "4165AK", outerBarcode: "16005574002802", barcode: "6005574002805", product: "Field & Flavour Salt & vinegar 120g", packSize: "120g", sellBy: "153", bb: "20", casesPerPallet: "26", unitsPerCase: "26", unitsPerOuter: "26 / Outer Case" },
    { productCode: "4165AL", outerBarcode: "16005574003359", barcode: "6005574000467", product: "Field & Flavour Cheese Flavoured 120g", packSize: "120g", sellBy: "122", bb: "20", casesPerPallet: "26", unitsPerCase: "26", unitsPerOuter: "26 / Outer Case" },
    { productCode: "4165AM", outerBarcode: "16005574003366", barcode: "6005574000573", product: "Field & Flavour Lightly Salted Flavoured 120g", packSize: "120g", sellBy: "153", bb: "20", casesPerPallet: "26", unitsPerCase: "26", unitsPerOuter: "26 / Outer Case" },
    { productCode: "4165AA", outerBarcode: "16005574002864", barcode: "6005574002867", product: "KC Tomato Flavoured Chips 36 g", packSize: "36g", sellBy: "153", bb: "30", casesPerPallet: "48", unitsPerCase: "48", unitsPerOuter: "48 / Outer Case" },
    { productCode: "4165AC", outerBarcode: "16005574002840", barcode: "6005574002843", product: "KC Salt & Vinegar Flavoured Chips 36 g", packSize: "36g", sellBy: "153", bb: "30", casesPerPallet: "48", unitsPerCase: "48", unitsPerOuter: "48 / Outer Case" },
    { productCode: "4165AG", outerBarcode: "16005574002888", barcode: "6005574002881", product: "KC Grilled Steak Flavoured Chips 36 g", packSize: "36g", sellBy: "122", bb: "30", casesPerPallet: "48", unitsPerCase: "48", unitsPerOuter: "48 / Outer Case" },
    { productCode: "4165AB", outerBarcode: "16005574002857", barcode: "6005574002850", product: "KC Tomato Flavoured Chips 120 g", packSize: "120g", sellBy: "153", bb: "20", casesPerPallet: "26", unitsPerCase: "26", unitsPerOuter: "26 / Outer Case" },
    { productCode: "4165AD", outerBarcode: "16005574002833", barcode: "6005574002836", product: "KC Salt & Vinegar Flavoured Chips 120 g", packSize: "120g", sellBy: "153", bb: "20", casesPerPallet: "26", unitsPerCase: "26", unitsPerOuter: "26 / Outer Case" },
    { productCode: "4165AH", outerBarcode: "16005574002871", barcode: "6005574002874", product: "KC Grilled Steak Flavoured Chips 120 g", packSize: "120g", sellBy: "122", bb: "20", casesPerPallet: "26", unitsPerCase: "26", unitsPerOuter: "26 / Outer Case" },
    { productCode: "4108AM", outerBarcode: "16005574003465", barcode: "6005574003468", product: "KC Blazin'hot BBQ 36g (48)", packSize: "36g", sellBy: "122", bb: "30", casesPerPallet: "48", unitsPerCase: "48", unitsPerOuter: "48 / Outer Case" },
    { productCode: "4108AO", outerBarcode: "26005574003462", barcode: "6005574003468", product: "KC Blazin'hot BBQ 36g (24)", packSize: "36g", sellBy: "122", bb: "81", casesPerPallet: "24", unitsPerCase: "24", unitsPerOuter: "24 / Outer Case" },
    { productCode: "4108AL", outerBarcode: "16005574003458", barcode: "6005574003451", product: "KC Blazin'hot BBQ 120g (26)", packSize: "120g", sellBy: "122", bb: "20", casesPerPallet: "26", unitsPerCase: "26", unitsPerOuter: "26 / Outer Case" },
    { productCode: "4108AN", outerBarcode: "26005574003455", barcode: "6005574003451", product: "KC Blazin'hot BBQ 120g (12)", packSize: "120g", sellBy: "122", bb: "81", casesPerPallet: "12", unitsPerCase: "12", unitsPerOuter: "12 / Outer Case" },
    { productCode: "4108AS", outerBarcode: "16005574003502", barcode: "6005574003505", product: "Blue Salt & Vinegar (26)", packSize: "120g", sellBy: "183", bb: "20", casesPerPallet: "26", unitsPerCase: "26", unitsPerOuter: "26 / Outer Case" },
    { productCode: "4108BC", outerBarcode: "26005574003509", barcode: "6005574003505", product: "Blue Salt & Vinegar (12)", packSize: "120g", sellBy: "183", bb: "81", casesPerPallet: "12", unitsPerCase: "12", unitsPerOuter: "12 / Outer Case" },
    { productCode: "4108AR", outerBarcode: "16005574003496", barcode: "6005574003499", product: "Salt & Vinegar (26)", packSize: "120g", sellBy: "183", bb: "20", casesPerPallet: "26", unitsPerCase: "26", unitsPerOuter: "26 / Outer Case" },
    { productCode: "4108BB", outerBarcode: "26005574003493", barcode: "6005574003499", product: "Salt & Vinegar (12)", packSize: "120g", sellBy: "183", bb: "81", casesPerPallet: "12", unitsPerCase: "12", unitsPerOuter: "12 / Outer Case" },
    { productCode: "4108AQ", outerBarcode: "16005574003489", barcode: "6005574003482", product: "Boerewors (26)", packSize: "120g", sellBy: "183", bb: "20", casesPerPallet: "26", unitsPerCase: "26", unitsPerOuter: "26 / Outer Case" },
    { productCode: "4108BA", outerBarcode: "26005574003486", barcode: "6005574003482", product: "Boerewors (12)", packSize: "120g", sellBy: "183", bb: "81", casesPerPallet: "12", unitsPerCase: "12", unitsPerOuter: "12 / Outer Case" },
    { productCode: "4108AP", outerBarcode: "16005574003472", barcode: "6005574003475", product: "Chutney (26)", packSize: "120g", sellBy: "183", bb: "20", casesPerPallet: "26", unitsPerCase: "26", unitsPerOuter: "26 / Outer Case" },
    { productCode: "4108AZ", outerBarcode: "26005574003479", barcode: "6005574003475", product: "Chutney (12)", packSize: "120g", sellBy: "183", bb: "81", casesPerPallet: "12", unitsPerCase: "12", unitsPerOuter: "12 / Outer Case" },
    { productCode: "4108AT", outerBarcode: "16009710723187", barcode: "6009710723180", product: "Lay's KC Sea Salt & Black Pepper 120 g", packSize: "120g", sellBy: "126", bb: "54", casesPerPallet: "20", unitsPerCase: "26", unitsPerOuter: "26 / Outer Case" },
    { productCode: "4108AU", outerBarcode: "16009710723156", barcode: "6009710723159", product: "Lay's KC Sea Salt & Black Pepper 30 g", packSize: "30g", sellBy: "126", bb: "56", casesPerPallet: "48", unitsPerCase: "48", unitsPerOuter: "48 / Outer Case" },
    { productCode: "4108AV", outerBarcode: "16009710723170", barcode: "6009710723173", product: "Lay's KC Cheddar & Cranberry 120 g", packSize: "120g", sellBy: "126", bb: "54", casesPerPallet: "20", unitsPerCase: "20", unitsPerOuter: "20 / Outer Case" },
    { productCode: "4108AY", outerBarcode: "16009710723149", barcode: "6009710723142", product: "Lay's KC Cheddar & Cranberry 30 g", packSize: "30g", sellBy: "126", bb: "56", casesPerPallet: "48", unitsPerCase: "48", unitsPerOuter: "48 / Outer Case" },
    { productCode: "4108AW", outerBarcode: "16009710723163", barcode: "6009710723166", product: "Lay's KC Rib-Eye & Mushroom 120 g", packSize: "120g", sellBy: "126", bb: "54", casesPerPallet: "20", unitsPerCase: "20", unitsPerOuter: "20 / Outer Case" },
    { productCode: "4108AX", outerBarcode: "16009710723132", barcode: "6009710723135", product: "Lay's KC Rib-Eye & Mushroom 30 g", packSize: "30g", sellBy: "126", bb: "56", casesPerPallet: "48", unitsPerCase: "48", unitsPerOuter: "48 / Outer Case" }
  ];

  let products = loadStorage(STORAGE_KEYS.products, FULL_PRODUCT_MASTER);
  let loadingRecords = loadStorage(STORAGE_KEYS.loading, []);
  let barcodeProblems = loadStorage(STORAGE_KEYS.problems, []);
  let currentSession = loadStorage(STORAGE_KEYS.session, null);

  let currentScannedProduct = null;
  let currentScannedBarcode = "";
  
  // Camera State Variable moved to main scope
  let html5QrCode = null; 

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
  return String(value ?? "")
    .trim()
    .replace(/[\s\r\n\t]/g, "")
    .replace(/^["']+|["']+$/g, "")
    .toLowerCase();
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

  function getProductDescription(product) {
    if (!product) return "-";
    return product.product || product.description || product["Product Description"] || "-";
  }

  function getProductBB(product) {
    if (!product) return "-";
    return product.bb || product.bbDate || product["Best Before (BB)"] || product.bestBefore || "-";
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
    if (sectionId === "problems") renderProblems();
  }

  function updateSessionUI() {
    const badgeText = currentSession ? `SESSION: ${currentSession.truck || "ACTIVE"}` : "NO SESSION";
    const badgeClass = currentSession ? "badge badge-success" : "badge badge-neutral";

    if ($("sessionBadge")) {
      $("sessionBadge").textContent = badgeText;
      $("sessionBadge").className = badgeClass;
    }
    if ($("scanSessionBadge")) {
      $("scanSessionBadge").textContent = badgeText;
      $("scanSessionBadge").className = badgeClass;
    }
    if ($("noSessionWarning")) {
      $("noSessionWarning").classList.toggle("hidden", !!currentSession);
    }
    if ($("dashboardSessionText")) {
      $("dashboardSessionText").textContent = currentSession 
        ? `Active session for truck ${currentSession.truck} (${currentSession.customer})` 
        : "No active session.";
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

    if (!currentSession) {
      if ($("sessionModal")) $("sessionModal").classList.remove("hidden");
      return;
    }

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
    if (!res) return;
    res.className = "scan-result success";
    const outerBarcode = getEffectiveOuterBarcode(product);
    const desc = getProductDescription(product);

    res.innerHTML = `
      <div class="result-icon">✓</div>
      <h3>VALID PRODUCT MATCH</h3>
      <p><strong>Scanned Code:</strong> ${escapeHtml(scannedCode)}</p>
      <p><strong>Product:</strong> ${escapeHtml(desc)}</p>
      <p><strong>Product SKU:</strong> ${escapeHtml(product.productCode)}</p>
      <p><strong>Barcode:</strong> ${escapeHtml(product.barcode)}</p>
      <p><strong>Outer Barcode:</strong> ${escapeHtml(outerBarcode)}</p>
    `;
    renderProductSummary(product);
    showLoadConfirmation(product);
  }

  function showInvalidResult(scannedCode) {
    const res = $("scanResult");
    if (!res) return;
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
    if (!res) return;
    res.className = "scan-result warning";
    res.innerHTML = `
      <div class="result-icon">⚠</div>
      <h3>DUPLICATE SCAN DETECTED</h3>
      <p><strong>Scanned Code:</strong> ${escapeHtml(scannedCode)}</p>
      <p>This product/barcode has already been recorded in history.</p>
    `;
    if ($("loadConfirmationPanel")) $("loadConfirmationPanel").classList.add("hidden");
  }

  function renderProductSummary(product) {
    if (!product) return;

    const desc = getProductDescription(product);
    const outerBarcode = getEffectiveOuterBarcode(product);
    const casesPallet = displayValue(product.casesPerPallet);
    const unitsCase = cleanNumber(product.unitsPerCase);
    const casesNum = cleanNumber(product.casesPerPallet);
    const unitsPallet = casesNum * unitsCase || "-";
    const sellByVal = displayValue(product.sellBy);
    const bbVal = displayValue(getProductBB(product));

    if ($("summaryProductCode")) $("summaryProductCode").textContent = displayValue(product.productCode);
    if ($("summaryDescription")) $("summaryDescription").textContent = desc;
    if ($("summaryOuterBarcode")) $("summaryOuterBarcode").textContent = outerBarcode;
    if ($("summaryBarcode")) $("summaryBarcode").textContent = displayValue(product.barcode);
    if ($("summaryCasesPallet")) $("summaryCasesPallet").textContent = casesPallet;
    if ($("summaryUnitsCase")) $("summaryUnitsCase").textContent = unitsCase || "-";
    if ($("summaryUnitsPallet")) $("summaryUnitsPallet").textContent = unitsPallet;
    if ($("summarySellBy")) $("summarySellBy").textContent = sellByVal;
    if ($("summaryBB")) $("summaryBB").textContent = bbVal;
  }

  function showLoadConfirmation(product) {
    if ($("loadConfirmationPanel")) $("loadConfirmationPanel").classList.remove("hidden");
    
    const cases = cleanNumber(product.casesPerPallet);
    const unitsPerCase = cleanNumber(product.unitsPerCase);
    const calculatedUnits = cases * unitsPerCase;

    if ($("loadCases")) $("loadCases").value = cases || "";
    if ($("loadQuantity")) $("loadQuantity").value = calculatedUnits || "";

    if (currentSession) {
      if ($("loadTruck")) $("loadTruck").value = currentSession.truck || "";
      if ($("loadCustomer")) $("loadCustomer").value = currentSession.customer || "";
      if ($("loadDelivery")) $("loadDelivery").value = currentSession.delivery || "";
      if ($("loadRoute")) $("loadRoute").value = currentSession.route || "";
    }
  }

  function recalculateUnits() {
    if (!currentScannedProduct) return;
    const casesVal = parseInt($("loadCases") ? $("loadCases").value : 0, 10) || 0;
    const unitsPerCase = cleanNumber(currentScannedProduct.unitsPerCase);
    const totalUnits = casesVal * unitsPerCase;

    if ($("loadQuantity")) $("loadQuantity").value = totalUnits;
    if ($("summaryUnitsPallet")) $("summaryUnitsPallet").textContent = totalUnits;
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
      product: getProductDescription(currentScannedProduct),
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

  function performVerify() {
    const input = $("verifyInput");
    const res = $("verifyResult");
    if (!input || !res) return;

    const val = input.value.trim();
    if (!val) {
      showToast("Enter a barcode or SKU to verify.", "warning");
      return;
    }

    const product = getProductByAnyCode(val);
    if (!product) {
      res.className = "scan-result error";
      res.innerHTML = `
        <div class="result-icon">✕</div>
        <h3>NO MATCH FOUND</h3>
        <p>No product found for '${escapeHtml(val)}'.</p>
      `;
      return;
    }

    res.className = "scan-result success";
    res.innerHTML = `
      <div class="result-icon">✓</div>
      <h3>PRODUCT VERIFIED</h3>
      <p><strong>Code:</strong> ${escapeHtml(product.productCode)}</p>
      <p><strong>Product:</strong> ${escapeHtml(getProductDescription(product))}</p>
      <p><strong>Barcode:</strong> ${escapeHtml(product.barcode)}</p>
      <p><strong>Outer Barcode:</strong> ${escapeHtml(getEffectiveOuterBarcode(product))}</p>
      <p><strong>Sell By:</strong> ${escapeHtml(displayValue(product.sellBy))}</p>
      <p><strong>Best Before (BB):</strong> ${escapeHtml(displayValue(getProductBB(product)))}</p>
      <p><strong>Cases/Pallet:</strong> ${escapeHtml(displayValue(product.casesPerPallet))}</p>
      <p><strong>Units/Case:</strong> ${escapeHtml(displayValue(product.unitsPerCase))}</p>
    `;
  }

  function startSession() {
    currentSession = {
      id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
      title: $("sessionName") ? $("sessionName").value : "Dispatch",
      user: $("sessionUser") ? $("sessionUser").value : AUTHORIZED_USERS[0],
      truck: $("sessionTruck") ? $("sessionTruck").value : "TRK-01-GP",
      customer: $("sessionCustomer") ? $("sessionCustomer").value : "General Dispatch",
      delivery: $("sessionDelivery") ? $("sessionDelivery").value : "DEL-001",
      route: $("sessionRoute") ? $("sessionRoute").value : "Main Route",
      startedAt: new Date().toISOString()
    };
    saveStorage(STORAGE_KEYS.session, currentSession);
    updateSessionUI();
    if ($("sessionModal")) $("sessionModal").classList.add("hidden");
    showToast("Session started successfully.", "success");
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
        <td>${escapeHtml(getProductDescription(p))}</td>
        <td>${escapeHtml(displayValue(p.packSize))}</td>
        <td>${escapeHtml(displayValue(p.sellBy))}</td>
        <td>${escapeHtml(displayValue(getProductBB(p)))}</td>
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

  function renderProblems() {
    const body = $("problemBody");
    if (!body) return;
    body.innerHTML = barcodeProblems.slice().reverse().map(p => `
      <tr>
        <td>${escapeHtml(p.date)}</td>
        <td>${escapeHtml(p.time)}</td>
        <td><code>${escapeHtml(p.barcode)}</code></td>
        <td>${escapeHtml(p.product)}</td>
        <td>${escapeHtml(p.type)}</td>
        <td>${escapeHtml(p.comment)}</td>
        <td>${escapeHtml(p.reportedBy)}</td>
        <td>${escapeHtml(p.status)}</td>
        <td>-</td>
      </tr>
    `).join("");
  }

  function updateDashboard() {
    if ($("statPallets")) $("statPallets").textContent = loadingRecords.length;
    if ($("statValid")) $("statValid").textContent = loadingRecords.filter(r => r.status === "LOADED").length;
    if ($("statErrors")) $("statErrors").textContent = barcodeProblems.length;
    if ($("statCases")) $("statCases").textContent = loadingRecords.reduce((sum, r) => sum + (parseInt(r.cases, 10) || 0), 0);
    
    const recentBody = $("recentLoadingBody");
    if (recentBody) {
      recentBody.innerHTML = loadingRecords.slice().reverse().slice(0, 5).map(r => `
        <tr>
          <td>${escapeHtml(r.time)}</td>
          <td>${escapeHtml(r.truck)}</td>
          <td>${escapeHtml(r.customer)}</td>
          <td><code>${escapeHtml(r.barcode)}</code></td>
          <td>${escapeHtml(r.product)}</td>
          <td class="status-loaded">${escapeHtml(r.status)}</td>
        </tr>
      `).join("");
    }
  }

  function clearHistory() {
    if (confirm("Are you sure you want to clear all loading records and reported barcode problems?")) {
      loadingRecords = [];
      barcodeProblems = [];
      saveStorage(STORAGE_KEYS.loading, loadingRecords);
      saveStorage(STORAGE_KEYS.problems, barcodeProblems);
      renderLoadingHistory();
      renderProblems();
      updateDashboard();
      showToast("Loading history and problems cleared successfully.", "success");
    }
  }

  function clearCacheAndReset() {
    if (confirm("Are you sure you want to reset all app cache and data to factory defaults?")) {
      localStorage.clear();
      products = [...FULL_PRODUCT_MASTER];
      saveStorage(STORAGE_KEYS.products, products);
      loadingRecords = [];
      barcodeProblems = [];
      currentSession = null;
      
      updateSessionUI();
      renderProducts();
      renderLoadingHistory();
      renderProblems();
      updateDashboard();
      
      showToast("App cache cleared and system restored to default.", "success");
    }
  }

  // Camera Functions moved to main IIFE scope
  async function startCamera() {
    const readerElement = document.getElementById("reader");
    const startBtn = document.getElementById("startCameraButton");
    const stopBtn = document.getElementById("stopCameraButton");

    if (!readerElement) return;

    // 1. Unhide container FIRST so browser can calculate dimensions
    readerElement.classList.remove("hidden");
    readerElement.style.display = "block";

    if (startBtn) startBtn.classList.add("hidden");
    if (stopBtn) stopBtn.classList.remove("hidden");

    // 2. Clear out any ghost scanner instances
    if (html5QrCode) {
      try {
        if (html5QrCode.isScanning) {
          await html5QrCode.stop();
        }
        html5QrCode.clear();
      } catch (e) {
        console.log("Cleanup previous instance:", e);
      }
    }

    html5QrCode = new Html5Qrcode("reader");

    // 3. Scan configuration without strict aspect ratios to avoid black bars
    const scanConfig = {
      fps: 15,
      qrbox: { width: 250, height: 180 }
    };

    const onScanSuccess = (decodedText) => {
      const input = document.getElementById("barcodeInput");
      if (input) input.value = decodedText;

      stopCamera();

      if (typeof checkBarcode === "function") {
        checkBarcode();
      }
    };

    try {
      // Try environment (back) camera
      await html5QrCode.start(
        { facingMode: { exact: "environment" } },
        scanConfig,
        onScanSuccess
      );
    } catch (err) {
      console.log("Exact environment camera failed, falling back to loose constraints...", err);
      try {
        // Fallback 1: Loose facingMode
        await html5QrCode.start(
          { facingMode: "environment" },
          scanConfig,
          onScanSuccess
        );
      } catch (err2) {
        console.log("Loose environment failed, falling back to any default camera...", err2);
        // Fallback 2: Default user webcam / selfie camera
        await html5QrCode.start(
          { facingMode: "user" },
          scanConfig,
          onScanSuccess
        );
      }
    }
  }

  function stopCamera() {
    const readerElement = document.getElementById("reader");
    const startBtn = document.getElementById("startCameraButton");
    const stopBtn = document.getElementById("stopCameraButton");

    const hideUI = () => {
      if (readerElement) {
        readerElement.classList.add("hidden");
        readerElement.style.display = "none";
      }
      if (startBtn) startBtn.classList.remove("hidden");
      if (stopBtn) stopBtn.classList.add("hidden");
    };

    if (html5QrCode && html5QrCode.isScanning) {
      html5QrCode.stop().then(() => {
        html5QrCode.clear();
        hideUI();
      }).catch(() => hideUI());
    } else {
      hideUI();
    }
  }

  // Consolidated Single DOMContentLoaded Block
  document.addEventListener("DOMContentLoaded", () => {
    
    // Navigation listeners
    document.querySelectorAll(".nav-button").forEach(btn => {
      btn.addEventListener("click", () => showSection(btn.dataset.section));
    });

    document.querySelectorAll("[data-go]").forEach(btn => {
      btn.addEventListener("click", () => showSection(btn.dataset.go));
    });

    if ($("menuButton")) {
      $("menuButton").addEventListener("click", () => {
        const nav = $("mainNav");
        if (nav) nav.classList.toggle("open");
      });
    }

    // Scan & Verification listeners
    if ($("checkBarcodeButton")) $("checkBarcodeButton").addEventListener("click", checkBarcode);
    if ($("confirmLoadButton")) $("confirmLoadButton").addEventListener("click", confirmLoad);
    if ($("cancelLoadButton")) $("cancelLoadButton").addEventListener("click", () => {
      if ($("loadConfirmationPanel")) $("loadConfirmationPanel").classList.add("hidden");
    });
    if ($("verifyButton")) $("verifyButton").addEventListener("click", performVerify);

    // Quick Test Demo Buttons
    if ($("demoValidButton")) {
      $("demoValidButton").addEventListener("click", () => {
        if ($("barcodeInput")) $("barcodeInput").value = "6009211225657";
        checkBarcode();
      });
    }

    if ($("demoInvalidButton")) {
      $("demoInvalidButton").addEventListener("click", () => {
        if ($("barcodeInput")) $("barcodeInput").value = "9999999999999";
        checkBarcode();
      });
    }

    if ($("dashboardScanButton")) {
      $("dashboardScanButton").addEventListener("click", () => showSection("scan"));
    }

    if ($("startSessionFromScan")) {
      $("startSessionFromScan").addEventListener("click", () => {
        if ($("sessionModal")) $("sessionModal").classList.remove("hidden");
      });
    }

    // Modal listeners
    if ($("startSessionButton")) $("startSessionButton").addEventListener("click", startSession);
    if ($("cancelSessionButton")) $("cancelSessionButton").addEventListener("click", () => {
      if ($("sessionModal")) $("sessionModal").classList.add("hidden");
    });
    if ($("closeSessionModal")) $("closeSessionModal").addEventListener("click", () => {
      if ($("sessionModal")) $("sessionModal").classList.add("hidden");
    });

    // Settings Action Buttons (Clear History & Cache)
    if ($("clearHistoryButton")) {
      $("clearHistoryButton").addEventListener("click", clearHistory);
    }
    if ($("clearCacheButton")) {
      $("clearCacheButton").addEventListener("click", clearCacheAndReset);
    }
    if ($("resetDataButton")) {
      $("resetDataButton").addEventListener("click", clearCacheAndReset);
    }

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

    // Camera Button Binding
    const startBtn = $("startCameraButton");
    const stopBtn = $("stopCameraButton");
    if (startBtn) startBtn.addEventListener("click", startCamera);
    if (stopBtn) stopBtn.addEventListener("click", stopCamera);

// Function triggered when barcode scanner sends input
async function processScan(barcodeInput) {
  try {
    const response = await fetch('/api/scan', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ scannedBarcode: barcodeInput })
    });

    const result = await response.json();

    if (!response.ok) {
      console.warn('Scan Error:', result.error);
      return;
    }

    // Access payload fields:
    // result.product_code
    // result.description
    // result.scan_type ('CASE' or 'UNIT')
    // result.multiplier
    console.log('Barcode Matched:', result);
  } catch (error) {
    console.error('Request failed:', error);
  }
}

    // Initial Rendering
    updateSessionUI();
    renderProducts();
    renderLoadingHistory();
    renderProblems();
    updateDashboard();
  });
})();