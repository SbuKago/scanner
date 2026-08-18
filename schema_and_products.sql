-- ============================================================
-- DISPATCH BARCODE SCANNING DATABASE SCHEMA
-- ============================================================

CREATE DATABASE IF NOT EXISTS dispatch_db
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE dispatch_db;

-- Check the updated record in products table
SELECT product_code, barcode, outer_barcode, description 
FROM products 
WHERE barcode = '6009701000242' OR outer_barcode = '16009701000242';

-- Check how it appears in the scanner lookup view (vw_all_barcodes)
SELECT * FROM vw_all_barcodes 
WHERE scanned_barcode IN ('6009701000242', '16009701000242');

-- 1. PRODUCTS MASTER TABLE
CREATE TABLE IF NOT EXISTS products (
    product_code VARCHAR(100) NOT NULL,
    barcode VARCHAR(50) NOT NULL,            -- Inner / Unit Barcode
    outer_barcode VARCHAR(50) DEFAULT NULL,   -- Outer / Case Barcode
    description VARCHAR(255) NOT NULL,
    pack_size VARCHAR(50) DEFAULT NULL,
    sell_by VARCHAR(50) DEFAULT NULL,
    bb_date VARCHAR(50) DEFAULT NULL,
    cases_per_pallet INT NOT NULL DEFAULT 0,
    units_per_case INT NOT NULL DEFAULT 0,

    units_per_pallet INT
        GENERATED ALWAYS AS (cases_per_pallet * units_per_case) STORED,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (product_code),
    INDEX idx_barcode (barcode),
    INDEX idx_outer_barcode (outer_barcode),
    INDEX idx_lookup_barcodes (barcode, outer_barcode)
)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci;


-- 2. UNIFIED BARCODE LOOKUP VIEW
CREATE OR REPLACE VIEW vw_all_barcodes AS
-- Outer Barcode / Case Entries
SELECT 
    product_code,
    outer_barcode AS scanned_barcode,
    'CASE' AS scan_type,
    units_per_case AS multiplier,
    units_per_case,
    description,
    cases_per_pallet
FROM products
WHERE outer_barcode IS NOT NULL 
  AND outer_barcode != '' 
  AND outer_barcode != '#N/A'

UNION ALL

-- Inner Barcode / Unit Entries
SELECT 
    product_code,
    barcode AS scanned_barcode,
    'UNIT' AS scan_type,
    1 AS multiplier,
    units_per_case,
    description,
    cases_per_pallet
FROM products
WHERE barcode IS NOT NULL 
  AND barcode != '' 
  AND barcode != '#N/A';


-- 3. LOADING HISTORY TABLE
CREATE TABLE IF NOT EXISTS loading_history (
    id VARCHAR(50) NOT NULL,
    session_id VARCHAR(50) DEFAULT NULL,
    timestamp DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    truck_reg VARCHAR(50) NOT NULL,
    customer VARCHAR(100) NOT NULL,
    delivery_number VARCHAR(50) NOT NULL,
    route VARCHAR(100) DEFAULT NULL,

    product_code VARCHAR(100) NOT NULL,
    barcode VARCHAR(50) NOT NULL,

    cases INT NOT NULL DEFAULT 0,
    quantity INT NOT NULL DEFAULT 0,

    pallet_type VARCHAR(50) NOT NULL DEFAULT 'Standard',
    status VARCHAR(20) NOT NULL DEFAULT 'LOADED',
    loaded_by VARCHAR(100) NOT NULL,

    PRIMARY KEY (id),

    INDEX idx_session_id (session_id),
    INDEX idx_timestamp (timestamp),
    INDEX idx_truck_reg (truck_reg),
    INDEX idx_customer (customer),
    INDEX idx_delivery_number (delivery_number),
    INDEX idx_loading_product_code (product_code),
    INDEX idx_loading_barcode (barcode),
    INDEX idx_status (status),

    CONSTRAINT fk_loading_product
        FOREIGN KEY (product_code)
        REFERENCES products(product_code)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci;


-- 4. BARCODE PROBLEMS TABLE
CREATE TABLE IF NOT EXISTS barcode_problems (
    id VARCHAR(50) NOT NULL,
    timestamp DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    barcode VARCHAR(50) NOT NULL,
    problem_type VARCHAR(100) NOT NULL,
    comment TEXT DEFAULT NULL,
    reported_by VARCHAR(100) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'OPEN',

    PRIMARY KEY (id),

    INDEX idx_problem_barcode (barcode),
    INDEX idx_problem_status (status),
    INDEX idx_problem_timestamp (timestamp),
    INDEX idx_problem_reported_by (reported_by)
)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci;


-- 5. SAMPLE SEED DATA
-- Replace or upsert all product master entries
INSERT INTO products
(
    product_code, barcode, outer_barcode, description, 
    pack_size, sell_by, bb_date, cases_per_pallet, units_per_case
)
VALUES
('413817', '6009211225657', NULL, 'Lentil & Quinoa Pop Chips – Creamy Cheddar', '85 g', '112', '98', 32, 12),
('413807', '6009207314334', NULL, 'Lentil & Quinoa Pop Chips – Creamy Cheddar', '20 g', '112', '98', 70, 20),
('413816', '6009211225640', NULL, 'Lentil & Quinoa Pop Chips – BBQ', '85 g', '112', '98', 32, 12),
('413808', '6009207314341', NULL, 'Lentil & Quinoa Pop Chips – BBQ', '20 g', '112', '98', 70, 20),
('413819', '6009223668152', NULL, 'Lentil & Quinoa Pop Chips – Sour Cream and Chives', '85 g', '112', '98', 32, 12),
('410810', '6005000288865', '16005000288862', 'HCC Sea Salt 50g', '50g', '112', '71', 42, 24),
('410808', '6009184110455', '16009184110452', 'HCC Sea Salt 125g', '125g', '84', '71', 20, 26),
('410807', '6009184110462', '16009184110469', 'HCC Sea Salt & Black Pepper 125g', '125g', '84', '119', 20, 26),
('410811', '6005000895865', '16005000895862', 'HCC Sea Salt & Black Pepper 50g', '50g', '106', '119', 42, 24),
('410806', '6009184110479', '16009184110476', 'HCC Sour Cream & Chives 125g', '125g', '106', '119', 20, 26),
('410812', '6009184110486', '16009184110483', 'HCC Rosemary & Sea Salt 125g', '125g', '106', '119', 20, 26),
('410819', '6009214098296', '16009214098293', 'HCC Rotisserie Chicken 125g', '125g', '106', '119', 20, 26),
('410809', '6009226480089', '16009226480086', 'HCC roast lamb & rosemary flavoured 125g', '125g', '106', '119', 20, 26),
('410820', '6009226451577', '16009226451574', 'HCC sea salt & white balsamic vinegar flavoured 50g', '50g', '106', '119', 42, 24),
('410802', '6009226478611', '16009226478618', 'HCC sea salt & white balsamic vinegar flavoured 125g', '125g', '106', '119', 20, 26),
('410801', '6009226462993', '16009226462990', 'HCC sriracha flavoured 125g', '125g', '106', '119', 20, 26),
('410827', '6009245410159', '16009245410156', 'HCC Parmesan & Truffle 125g', '125g', '106', '119', 20, 26),
('410823', '6009245410104', '16009245410101', 'HCC Sweet & Sticky Chilli 50g', '50g', '106', '119', 42, 24),
('410824', '6009245410111', '16009245410118', 'HCC Sweet & Sticky Chilli 125g', '125g', '106', '119', 20, 26),
('410821', '6009245410081', '16009245410088', 'HCC Dijon Mustard 50g', '50g', '106', '119', 42, 24),
('410822', '6009245410098', '16009245410095', 'HCC Dijon Mustard 125g', '125g', '106', '119', 20, 26),
('410825', '6009245410128', '16009245410125', 'HCC Rotisserie chicken 50g', '50g', '106', '119', 42, 24),
('410905', '6009173755049', '16009173755046', 'HCS Sea Salt 50g', '50g', '106', '119', 42, 42),
('410907', '6009173755087', '16009173755084', 'HCS Sea Salt 125g', '125g', '106', '119', 42, 16),
('410901', '6009184110417', '16009184110414', 'HCS Sea Salt & Black Pepper 125g', '125g', '106', '119', 42, 16),
('410904', '6009173755056', '16009173755053', 'HCS Sour cream & Red onion 50g', '50g', '106', '119', 42, 42),
('410909', '6009211697836', '16009211697833', 'HCS Sour cream & Red onion 125g', '125g', '106', '119', 42, 16),
('410911', '6009226451560', '16009226451567', 'HCS sticky ribs with chilli flavoured 50g', '50g', '106', '119', 42, 42),
('410913', '6009226462986', '16009226462983', 'HCS sticky ribs with chilli flavoured 125g', '125g', '106', '119', 42, 16),
('410916', '6009226652455', '16009226652452', 'HCS sea salt & white balsamic vinegar flavoured 50g', '50g', '106', '119', 42, 42),
('410914', '6009226478628', '16009226478625', 'HCS sea salt & white balsamic vinegar flavoured 125g', '125g', '106', '119', 42, 16),
('410912', '6009226451584', '16009226451581', 'HCS Sour Cream & Jalapeno 125 g', '125g', '106', '119', 42, 16),
('410612', '6009223192367', '16009223192364', 'Prawn Cocktail mix 30 g', '30 g', '98', '112', 30, 48),
('410611', '6009223192336', '16009223192333', 'Prawn Cocktail mix 100 g', '100 g', '98', '112', 20, 20),
('410605', '6009175940368', '16009175940365', 'Prawn Cocktail 30 g', '30 g', '98', '112', 30, 48),
('410604', '20024277', '10200242774', 'Prawn Cocktail 125 g', '125 g', '98', '112', 20, 20),
('410607', '6009175940382', '16009175940389', 'Streaky Crackle 30 g', '30 g', '98', '112', 30, 48),
('410602', '6009178477823', '16009178477820', 'Streaky Crackle 100 g', '100 g', '98', '112', 20, 20),
('410606', '6009175940399', '16009175940396', 'Sweet Onion Rings 75 g', '75 g', '98', '112', 20, 20),
('410603', '6008000521604', '16008000521601', 'Salt & Vinegar Onion Rings 75 g', '75 g', '98', '112', 20, 20),
('410601', '6009175940580', '16009175940587', 'Potato Fries Salt & Vinegar 125 g', '125 g', '98', '112', 20, 20),
('410613', '6009223398301', '16009223398308', 'Potato Fries Salt & Vinegar 30 g', '30 g', '98', '112', 30, 48),
('410404', '6009214098241', '16009214098248', 'Lentil Chips Sour Cream & Chives Flavoured 40 g', '40 g', '98', '112', 30, 45),
('410403', '6009214098258', '16009214098255', 'Lentil Chips Sour Cream & Chives Flavoured 100 g', '100 g', '98', '112', 20, 20),
('410406', '6009214098197', '16009214098194', 'Chickpea Chips Sweet Chilli Flavoured 40 g', '40 g', '98', '112', 30, 45),
('410405', '6009214098203', '16009214098200', 'Chickpea Chips Sweet Chilli Flavoured 100 g', '100 g', '98', '112', 20, 20),
('410407', '6009223567240', '16009223567247', 'Chickpea Chips Sea Salt & Black Pepper Flavoured 100 g', '100 g', '98', '112', 20, 20),
('410402', '6009214098265', '16009214098262', 'Quinoa Chips BBQ Flavoured 40 g', '40 g', '98', '112', 30, 45),
('410401', '6009214098272', '16009214098279', 'Quinoa Chips BBQ Flavoured 100 g', '100 g', '98', '112', 20, 20),
('410408', '6009223567257', '16009223567254', 'Quinoa Chips Sea Salt Flavoured 100 g', '100 g', '98', '112', 20, 20),
('410409', '6009223567264', '16009223567261', 'Lentil Chips Creamy Cheddar Flavoured 100 g', '100 g', '98', '112', 20, 20),
('410614', '6009214296180', '16009214296187', 'Cocktail Mix Chip BBQ 100 g', '100 g', '98', '112', 20, 20),
('410610', '6009223187172', '16009223187179', 'Cocktail Mix Chip BBQ 30 g', '30 g', '98', '112', 35, 48),
('410617', '6007875204742', '16007875204749', 'Corn Crunch Cheddar Flavoured 100g', '100 g', '98', '112', 20, 20),
('411416', '6009233586477', '16009233586474', 'Cheddar flavoured corn crunch 30 g', '30g', '98', '112', 30, 48),
('410615', '6009233586453', '16009233586450', 'Tomato Crunch 100g', '100g', '98', '112', 20, 20),
('411418', '6009233586491', '16009233586498', 'Tomato flavoured corn crunch 30g', '30g', '98', '112', 30, 48),
('410616', '6009233586460', '16009233586467', 'Jalapeno Crunch 100g', '100g', '98', '112', 20, 20),
('411417', '6009233586484', '16009233586481', 'Jalapeno Popper flavoured corn crunch 30g', '30g', '98', '112', 30, 48),
('412005', '6009195223038', '16009195223035', 'POPCORN - Caramel Coated 150 g', '150 g', '114', '155', 48', 14),
('412003', '6009189862717', '16009189862714', 'POPCORN - Sea Salt 90 g', '90 g', '127', '141', 32', 14),
('412004', '6009189862700', '16009189862707', 'POPCORN - Salt & Vinegar 90 g', '90 g', '127', '141', 32', 14),
('412002', '6009189862694', '16009189862691', 'POPCORN - Sour Cream & Chives 90 g', '90 g', '127', '141', 32', 14),
('412007', '6009195499853', '16009195499850', 'POPCORN - Sour Cream & Chives 25 g', '25 g', '127', '141', 48', 24),
('412001', '6009189862687', '16009189862684', 'POPCORN - White Cheddar 90 g', '90 g', '127', '141', 32', 14),
('412006', '6009195499846', '16009195499843', 'POPCORN - White Cheddar 25 g', '25 g', '127', '141', 48', 24),
('412009', '6009223464297', '16009223464294', 'POPCORN - Feta & Black Pepper 90 g', '90 g', '127', '141', 32', 14),
('412010', '6009223464303', '16009223464300', 'POPCORN - Jalapeno Atchar 90 g', '90 g', '127', '141', 32', 14),
('412011', '6009223464327', '16009223464324', 'POPCORN - Butter Flavoured 90 g', '90 g', '127', '141', 32', 14),
('4172AH', '6009701000269', '16009701000266', 'HP Feta & Black Pepper 90 g - FG017', '90 g', '210', '32', 14, 14),
('4172AK', '6009701000245', '16009701000242', 'HP Cream Cheese & Chives 90 g - FG015', '90 g', '210', '32', 14, 14),
('4172AL', '6009701000252', '16009701000259', 'HP Cheesy Cheese 90 g - FG016', '90 g', '210', '32', 14, 14),
('4172AR', '6005574002003', '16005574002000', 'HP Butter Flavour 90 g - FG020', '90 g', '210', '32', 14, 14),
('4172AJ', '6009701000283', '16009701000280', 'HP Caramel Popcorn 150 g - FG019', '150 g', '180', '48', 14, 14),
('4172AN', '6009701000023', '16009701000020', 'HP Caramel Popcorn 22 g x 4 - FG011', '22 g x 4', '180', '48', 20, 20),
('4172AB', '6005574000917', '16005574000914', 'HP Sweet & Salty Popcorn 90g', '90g', '210', '32', 14, 14),
('4165AJ', '6005574002812', '16005574002819', 'Field & Flavour Tomato 120g', '120g', '153', '20', 26, 26),
('4165AI', '6005574002829', '16005574002826', 'Field & Flavour Smoked Beef 120g', '120g', '153', '20', 26, 26),
('4165AK', '6005574002805', '16005574002802', 'Field & Flavour Salt & vinegar 120g', '120g', '153', '20', 26, 26),
('4165AL', '6005574000467', '16005574003359', 'Field & Flavour Cheese Flavoured 120g', '120g', '122', '20', 26, 26),
('4165AM', '6005574000573', '16005574003366', 'Field & Flavour Lightly Salted Flavoured 120g', '120g', '153', '20', 26, 26),
('4165AA', '6005574002867', '16005574002864', 'KC Tomato Flavoured Chips 36 g', '36g', '153', '30', 48, 48),
('4165AC', '6005574002843', '16005574002840', 'KC Salt & Vinegar Flavoured Chips 36 g', '36g', '153', '30', 48, 48),
('4165AG', '6005574002881', '16005574002888', 'KC Grilled Steak Flavoured Chips 36 g', '36g', '122', '30', 48, 48),
('4165AB', '6005574002850', '16005574002857', 'KC Tomato Flavoured Chips 120 g', '120g', '153', '20', 26, 26),
('4165AD', '6005574002836', '16005574002833', 'KC Salt & Vinegar Flavoured Chips 120 g', '120g', '153', '20', 26, 26),
('4165AH', '6005574002874', '16005574002871', 'KC Grilled Steak Flavoured Chips 120 g', '120g', '122', '20', 26, 26),
('4108AM', '6005574003468', '16005574003465', 'KC Blazin''hot BBQ 36g (48)', '36g', '122', '30', 48, 48),
('4108AO', '6005574003468', '26005574003462', 'KC Blazin''hot BBQ 36g (24)', '36g', '122', '81', 24, 24),
('4108AL', '6005574003451', '16005574003458', 'KC Blazin''hot BBQ 120g (26)', '120g', '122', '20', 26, 26),
('4108AN', '6005574003451', '26005574003455', 'KC Blazin''hot BBQ 120g (12)', '120g', '122', '81', 12, 12),
('4108AS', '6005574003505', '16005574003502', 'Blue Salt & Vinegar (26)', '120g', '183', '20', 26, 26),
('4108BC', '6005574003505', '26005574003509', 'Blue Salt & Vinegar (12)', '120g', '183', '81', 12, 12),
('4108AR', '6005574003499', '16005574003496', 'Salt & Vinegar (26)', '120g', '183', '20', 26, 26),
('4108BB', '6005574003499', '26005574003493', 'Salt & Vinegar (12)', '120g', '183', '81', 12, 12),
('4108AQ', '6005574003482', '16005574003489', 'Boerewors (26)', '120g', '183', '20', 26, 26),
('4108BA', '6005574003482', '26005574003486', 'Boerewors (12)', '120g', '183', '81', 12, 12),
('4108AP', '6005574003475', '16005574003472', 'Chutney (26)', '120g', '183', '20', 26, 26),
('4108AZ', '6005574003475', '26005574003479', 'Chutney (12)', '120g', '183', '81', 12, 12),
('4108AT', '6009710723180', '16009710723187', 'Lay''s KC Sea Salt & Black Pepper 120 g', '120g', '126', '54', 20, 26),
('4108AU', '6009710723159', '16009710723156', 'Lay''s KC Sea Salt & Black Pepper 30 g', '30g', '126', '56', 48, 48),
('4108AV', '6009710723173', '16009710723170', 'Lay''s KC Cheddar & Cranberry 120 g', '120g', '126', '54', 20, 20),
('4108AY', '6009710723142', '16009710723149', 'Lay''s KC Cheddar & Cranberry 30 g', '30g', '126', '56', 48, 48),
('4108AW', '6009710723166', '16009710723163', 'Lay''s KC Rib-Eye & Mushroom 120 g', '120g', '126', '54', 20, 20),
('4108AX', '6009710723135', '16009710723132', 'Lay\'s KC Rib-Eye & Mushroom 30 g', '30g', '126', '56', 48, 48)
ON DUPLICATE KEY UPDATE
    barcode = VALUES(barcode),
    outer_barcode = VALUES(outer_barcode),
    description = VALUES(description),
    pack_size = VALUES(pack_size),
    sell_by = VALUES(sell_by),
    bb_date = VALUES(bb_date),
    cases_per_pallet = VALUES(cases_per_pallet),
    units_per_case = VALUES(units_per_case);