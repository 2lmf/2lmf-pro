// 2LMF PRO CALC SCRIPT
const VERSION = "2.2"; // Cache busting
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyIWixcWJRDQOzcBPTCTfstUzbhrFJlTa7dMq21lnE2YunRDJL-IJlpxEnjf3w76-KI/exec";

// DOM Elements
const navBtns = document.querySelectorAll('.nav-btn');
const contentArea = document.getElementById('calculator-content');
const resultsSection = document.getElementById('results-section');
const resultsContainer = document.getElementById('results-container');

function translateModule(mod) {
    const map = {
        'facade': 'FASADE',
        'thermal': 'TERMOIZOLACIJA',
        'hydro': 'HIDROIZOLACIJA',
        'fence': 'OGRADE'
    };
    return map[mod] || mod.toUpperCase();
}

// State
// State
// State
let currentModule = 'facade';

// --- PRICE SYNC LOGIC ---

async function initPriceFetch() {
    if (!GOOGLE_SCRIPT_URL) {
        console.log("⚠️ No API URL configured. Using local prices.");
        return;
    }

    try {
        console.log("⏳ Fetching live prices...");
        const response = await fetch(`${GOOGLE_SCRIPT_URL}?action=get_prices`);
        const livePrices = await response.json();

        if (livePrices.error) throw new Error(livePrices.error);
        if (Object.keys(livePrices).length === 0) throw new Error("Empty price list");

        // Sync Logic: Map SKU to our internal structure
        updatePricesRecursive(prices, livePrices);
        console.log("✅ Live prices active!", livePrices);

        // Show subtle success indicator
        const ind = document.createElement("div");
        ind.style.cssText = "position:fixed; bottom:10px; right:10px; background:#4cd964; color:white; padding:5px 10px; border-radius:20px; font-size:12px; opacity:0.8; z-index:9999;";
        ind.innerText = `⚡ Live Cijene (${Object.keys(livePrices).length})`;
        document.body.appendChild(ind);
        setTimeout(() => ind.remove(), 4000);

    } catch (e) {
        console.error("❌ Price sync failed:", e);
        // Also show alert
        const errDiv = document.createElement("div");
        errDiv.style.cssText = "position:fixed; top:50%; left:50%; transform:translate(-50%, -50%); background:red; color:white; padding:20px; z-index:10000; font-size:20px;";
        errDiv.innerText = "GREŠKA PRI UČITAVANJU: \n" + e.message;
        document.body.appendChild(errDiv);
    }
}

function updatePricesRecursive(targetObj, sourceFlat) {
    for (const key in targetObj) {
        if (typeof targetObj[key] === 'object' && targetObj[key] !== null) {
            if (targetObj[key].hasOwnProperty('sku') && targetObj[key].hasOwnProperty('price')) {
                const sku = targetObj[key].sku;
                // Try uppercase SKU match
                let livePrice = sourceFlat[sku] || sourceFlat[sku.toUpperCase()] || sourceFlat[sku.toString().toUpperCase()];

                if (livePrice !== undefined) {
                    targetObj[key].price = parseFloat(livePrice);
                }
            } else {
                updatePricesRecursive(targetObj[key], sourceFlat);
            }
        }
    }
}

// Start fetch
document.addEventListener('DOMContentLoaded', () => {
    initPriceFetch();
});
const templates = {
    facade: `
        <div class="module-header" style="margin-bottom: 2rem;">
            <h2>🧱 Fasada (ETICS & ventilirana)</h2>
            <p>Izračunajte materijal za kontaktnu ili ventiliranu fasadu.</p>
        </div>
        <form id="calc-form">
            <div class="form-group">
                <label for="facade-type">Tip fasade</label>
                <select id="facade-type" name="type" onchange="toggleSubOptions()">
                    <option value="etics">ETICS (kontaktna - stiropor/vuna)</option>
                    <option value="ventilated">Ventilirana</option>
                </select>
            </div>
            
            <div class="form-group">
                <label for="area">Površina zida (m²)</label>
                <input type="text" inputmode="decimal" id="area" name="area" placeholder="npr. 150,5" required>
            </div>

            <!-- ETICS Options -->
            <div id="etics-options">
                <div class="form-group">
                    <label for="insulation-type">Vrsta izolacije</label>
                    <select id="insulation-type" name="material">
                        <option value="eps">EPS (stiropor)</option>
                        <option value="wool">Kamena vuna</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="thickness">Debljina izolacije (cm)</label>
                    <input type="number" id="thickness" name="thickness" value="10" min="1">
                </div>
            </div>

            <!-- Ventilated Options -->
            <div id="ventilated-options" class="hidden">
                 <div class="form-group">
                    <label for="cladding-type">Vrsta obloge</label>
                    <select id="cladding-type" name="cladding">
                        <option value="hpl">HPL ploče</option>
                        <option value="alu">Aluminijski kompozit (alucobond)</option>
                        <option value="fiber">Vlaknocementne ploče</option>
                    </select>
                </div>
                 <div class="form-group">
                    <label for="vent-insulation">Debljina vune (cm)</label>
                    <input type="number" id="vent-insulation" name="vent-thickness" value="10" min="1">
                </div>
            </div>

            </div>

            <!-- Contact Form -->
            <div class="user-details-grid">
                <div class="form-group">
                    <label for="user-name">Ime</label>
                    <input type="text" id="user-name" name="userName" placeholder="Vaše ime">
                </div>
                <div class="form-group">
                    <label for="user-phone">Kontakt broj <span style="color:red">*</span></label>
                    <input type="tel" id="user-phone" name="userPhone" placeholder="Br. telefona" required>
                </div>
                <div class="form-group">
                    <label for="user-email">Email <span style="color:red">*</span></label>
                    <input type="email" id="user-email" name="userEmail" placeholder="Vaš email" required>
                </div>
                <div class="form-group">
                    <label for="user-location">Lokacija</label>
                    <input type="text" id="user-location" name="userLocation" placeholder="Grad/Adresa">
                </div>
            </div>

            <button type="submit" class="calculate-btn">Izračunaj</button>
        </form>
    `,
    thermal: `
        <div class="module-header" style="margin-bottom: 2rem;">
            <h2>🌡️ Termoizolacija</h2>
            <p>XPS za podove/temelje i Vuna za krovove.</p>
        </div>
        <form id="calc-form">
            <div class="form-group">
                <label for="thermal-type">Primjena</label>
                <select id="thermal-type" name="type">
                    <option value="xps">XPS (podovi, temelji, podrum)</option>
                    <option value="roof">Kosi krov (staklena/kamena vuna)</option>
                </select>
            </div>
            <div class="form-group">
                <label for="area">Površina (m²)</label>
                <input type="text" inputmode="decimal" id="area" name="area" placeholder="npr. 50,5" required>
            </div>
            <div class="form-group">
                <label for="thickness">Debljina (cm)</label>
                <input type="number" id="thickness" name="thickness" value="5">
            </div>
            </div>

            <!-- Contact Form -->
            <div class="user-details-grid">
                <div class="form-group">
                    <label for="user-name">Ime</label>
                    <input type="text" id="user-name" name="userName" placeholder="Vaše ime">
                </div>
                <div class="form-group">
                    <label for="user-phone">Kontakt broj <span style="color:red">*</span></label>
                    <input type="tel" id="user-phone" name="userPhone" placeholder="Br. telefona" required>
                </div>
                <div class="form-group">
                    <label for="user-email">Email <span style="color:red">*</span></label>
                    <input type="email" id="user-email" name="userEmail" placeholder="Vaš email" required>
                </div>
                <div class="form-group">
                    <label for="user-location">Lokacija</label>
                    <input type="text" id="user-location" name="userLocation" placeholder="Grad/Adresa">
                </div>
            </div>

            <button type="submit" class="calculate-btn">Izračunaj</button>
        </form>
    `,
    hydro: `
        <div class="module-header" style="margin-bottom: 2rem;">
            <h2>💧 Hidroizolacija</h2>
            <p>Bitumen, Polimer cement ili TPO/PVC folije.</p>
        </div>
        <form id="calc-form">
            <div class="form-group">
                <label for="hydro-type">Sustav</label>
                <select id="hydro-type" name="type" required onchange="toggleHydroOptions()">
                    <option value="" disabled>Odaberite tip...</option>
                    <option value="bitumen-foundation">Bitumen - temelji</option>
                    <option value="bitumen-roof">Bitumen - ravni krov</option>
                    <option value="membrane-roof" selected>TPO/PVC - ravni krov</option>
                    <option value="pvc-foundation">PVC - temelji</option>
                    <option value="polymer">Polimercement - terase/kupaonice</option>
                    <option value="isoflex-pu500">Poliuretan, PU - terase</option>
                </select>
            </div>
            <div class="form-group">
                <label for="area">Površina (m²)</label>
                <input type="text" inputmode="decimal" id="area" name="area" placeholder="npr. 30,5" required>
            </div>
            
            <div id="membrane-options" class="hidden">
                 <div class="form-group">
                     <label for="membrane-mat">Materijal membrane</label>
                     <select id="membrane-mat" name="membraneMaterial" onchange="toggleMembraneThickness()">
                        <option value="tpo">TPO (termoplastični)</option>
                        <option value="pvc">PVC (polivinil klorid)</option>
                     </select>
                </div>
                <!-- TPO Thickness Options -->
                <div class="form-group" id="tpo-thickness-group">
                    <label for="tpo-thickness">Debljina TPO folije</label>
                    <select id="tpo-thickness" name="tpoThickness">
                        <option value="1.5">1.5 mm</option>
                        <option value="1.8">1.8 mm</option>
                        <option value="2.0">2.0 mm</option>
                    </select>
                </div>
            </div>

            <div id="hydro-xps-options" class="hidden">
                <div class="form-group">
                    <label for="hydro-thickness">Debljina XPS-a (cm) (min. 5cm)</label>
                    <input type="number" id="hydro-thickness" name="hydroThickness" value="5" min="5">
                </div>
            </div>

            <div id="polymer-options" class="hidden">
                 <div class="form-group">
                    <label for="polymer-finish">Završna obloga</label>
                    <select id="polymer-finish" name="polymerFinish">
                        <option value="none">Bez završne obloge</option>
                        <option value="ceramics">Keramika (Pločice)</option>
                    </select>
                </div>
            </div>

            </div>

            <!-- Contact Form -->
            <div class="user-details-grid">
                <div class="form-group">
                    <label for="user-name">Ime</label>
                    <input type="text" id="user-name" name="userName" placeholder="Vaše ime">
                </div>
                <div class="form-group">
                    <label for="user-phone">Kontakt broj <span style="color:red">*</span></label>
                    <input type="tel" id="user-phone" name="userPhone" placeholder="Br. telefona" required>
                </div>
                <div class="form-group">
                    <label for="user-email">Email <span style="color:red">*</span></label>
                    <input type="email" id="user-email" name="userEmail" placeholder="Vaš email" required>
                </div>
                <div class="form-group">
                    <label for="user-location">Lokacija</label>
                    <input type="text" id="user-location" name="userLocation" placeholder="Grad/Adresa">
                </div>
            </div>

            <button type="submit" class="calculate-btn">Izračunaj</button>
        </form>
    `,
    fence: `
        <div class="module-header" style="margin-bottom: 2rem;">
            <h2>🏡 Panel ograde</h2>
            <p>Izračun panelne ograde (2D ili 3D), stupova i pribora.</p>
        </div>
        <form id="calc-form">
            <!-- 0. Color Selection -->
            <div class="form-group">
                <label>Odaberite Boju</label>
                <div class="color-selection-row">
                    <div class="color-btn btn-ral-7016 active" onclick="selectColor('7016', this)">
                        ANTRACIT - RAL 7016
                    </div>
                    <div class="color-btn btn-ral-6005" onclick="selectColor('6005', this)">
                        ZELENO - RAL 6005
                    </div>
                </div>
                <!-- Hidden input to store selection -->
                <input type="hidden" id="fence-color" name="fenceColor" value="7016">
            </div>

            <!-- 1. Panel Type Selection -->
            <div class="form-group">
                <label for="panel-type">Tip panela</label>
                <select id="panel-type" name="panelType" onchange="toggleFenceOptions()">
                    <option value="2d">2D panel (6/5/6 mm)</option>
                    <option value="3d">3D panel</option>
                </select>
            </div>

            <!-- 2. Thickness (Only for 3D) -->
            <div id="fence-3d-options" class="hidden">
                <div class="form-group">
                    <label for="panel-thickness">Debljina žice (3D)</label>
                    <select id="panel-thickness" name="panelThickness">
                        <option value="4">4 mm</option>
                        <option value="5">5 mm</option>
                    </select>
                </div>
            </div>

            <div class="form-group">
                <label for="length">Ukupna dužina ograde (m)</label>
                <input type="text" inputmode="decimal" id="length" name="length" placeholder="npr. 25,5" required>
            </div>
            
            <div class="form-group">
                <label for="height">Visina panela</label>
                <select id="height" name="height">
                    <option value="103">103 cm</option>
                    <option value="123">123 cm</option>
                    <option value="153">153 cm</option>
                    <option value="173">173 cm</option>
                    <option value="203">203 cm</option>
                </select>
            </div>

            <div class="form-group">
                <label for="post-type">Tip stupova (60x60mm, sa kapom)</label>
                <select id="post-type" name="postType">
                     <option value="plate">S pločicom (za beton)</option>
                     <option value="concrete">Za betoniranje (stup duži min. 50cm od visine panela)</option>
                </select>
            </div>

            <!-- Layout Options -->
             <div class="form-group">
                <label>Izgled ograde</label>
                <div style="display: flex; gap: 1rem;">
                    <div class="layout-btn active" id="layout-straight" onclick="selectLayout('straight')">
                        <div class="layout-btn-text">Ravna</div>
                    </div>
                    <div class="layout-btn" id="layout-corners" onclick="selectLayout('corners')">
                        <input type="number" id="fence-corners" name="fenceCorners" placeholder="Broj kuteva ograde" min="0" onfocus="selectLayout('corners')">
                    </div>
                </div>
            </div>

            <!-- GATE OPTION (Moved Here) -->
            <hr style="margin: 1.5rem 0; border: 0; border-top: 1px solid #ccc;">
            <div class="form-group">
                <label>Trebate li pješačka vrata?</label>
                <div style="display: flex; gap: 1rem;">
                    <div class="layout-btn" id="gate-yes" onclick="selectGate('yes')">
                        <div class="layout-btn-text">DA</div>
                    </div>
                    <div class="layout-btn active" id="gate-no" onclick="selectGate('no')">
                        <div class="layout-btn-text">NE</div>
                    </div>
                </div>
                <input type="hidden" id="gate-needed" name="gateNeeded" value="no">
            </div>

            <!-- GATE SUB-OPTIONS -->
            <div id="gate-options" class="hidden" style="background: #f8f9fa; padding: 1rem; border-radius: 8px; margin-top: 1.5rem;">
                <div class="form-group">
                    <label>Dimenzija vrata (Š x V)</label>
                    <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; justify-content: flex-start;">
                        <!-- 1000x1000 -->
                        <div class="layout-btn small-btn active" id="gate-1000" onclick="selectGateSize('1000')" style="flex: 1 1 auto; min-width: 80px;">
                            <div class="layout-btn-text">1000x1000</div>
                        </div>
                        <!-- 1000x1200 -->
                        <div class="layout-btn small-btn" id="gate-1200" onclick="selectGateSize('1200')" style="flex: 1 1 auto; min-width: 80px;">
                            <div class="layout-btn-text">1000x1200</div>
                        </div>
                        <!-- 1000x1500 -->
                        <div class="layout-btn small-btn" id="gate-1500" onclick="selectGateSize('1500')" style="flex: 1 1 auto; min-width: 80px;">
                            <div class="layout-btn-text">1000x1500</div>
                        </div>
                        <!-- 1000x1700 -->
                        <div class="layout-btn small-btn" id="gate-1700" onclick="selectGateSize('1700')" style="flex: 1 1 auto; min-width: 80px;">
                            <div class="layout-btn-text">1000x1700</div>
                        </div>
                        <!-- 1000x2000 -->
                        <div class="layout-btn small-btn" id="gate-2000" onclick="selectGateSize('2000')" style="flex: 1 1 auto; min-width: 80px;">
                            <div class="layout-btn-text">1000x2000</div>
                        </div>
                    </div>
                    <input type="hidden" id="gate-size" name="gateSize" value="1000">
                </div>

                <div class="form-group">
                    <label>Vrsta stupova za vrata</label>
                    <select id="gate-post-type" name="gatePostType">
                        <option value="plate">Stupovi s pločicom</option>
                        <option value="concrete">Stupovi za betoniranje</option>
                    </select>
                </div>
            </div>

            <!-- Installation Option -->
            <hr style="margin: 1.5rem 0; border: 0; border-top: 1px solid #ccc;">
            <div class="form-group">
                <label>Trebate montažu?</label>
                <div style="display: flex; gap: 1rem;">
                    <div class="layout-btn" id="install-yes" onclick="selectInstallation('yes')">
                        <div class="layout-btn-text">DA</div>
                    </div>
                    <div class="layout-btn active" id="install-no" onclick="selectInstallation('no')">
                        <div class="layout-btn-text">NE</div>
                    </div>
                </div>
                <input type="hidden" id="fence-installation" name="fenceInstallation" value="no">
                <p style="font-size: 0.9rem; color: black; font-weight: 700; margin-top: 0.5rem; margin-bottom: 0;">
                    * Iznos montaže je informativnog karaktera i vrijedi za Zagreb i okolicu do 20km.
                </p>
            </div>
            
            </div>
            
            <!-- Contact Form -->
            <div class="user-details-grid">
                <div class="form-group">
                    <label for="user-name">Ime</label>
                    <input type="text" id="user-name" name="userName" placeholder="Vaše ime">
                </div>
                <div class="form-group">
                    <label for="user-phone">Kontakt broj <span style="color:red">*</span></label>
                    <input type="tel" id="user-phone" name="userPhone" placeholder="Br. telefona" required>
                </div>
                <div class="form-group">
                    <label for="user-email">Email <span style="color:red">*</span></label>
                    <input type="email" id="user-email" name="userEmail" placeholder="Vaš email" required>
                </div>
                <div class="form-group">
                    <label for="user-location">Lokacija</label>
                    <input type="text" id="user-location" name="userLocation" placeholder="Grad/Adresa">
                </div>
            </div>

            <button type="submit" class="calculate-btn">Izračunaj</button>
        </form>
    `
};

// Event Listeners
navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class
        navBtns.forEach(b => b.classList.remove('active'));
        // Add active class
        btn.classList.add('active');

        currentModule = btn.dataset.module;
        loadModule(currentModule);
    });
});

// Functions
function loadModule(moduleName) {
    contentArea.innerHTML = templates[moduleName];
    // Re-attach listeners for the new form
    const form = document.getElementById('calc-form');
    if (form) {
        form.addEventListener('submit', handleCalculation);

        // Auto-format main input field (area or length)
        const mainInput = form.querySelector('input[name="area"], input[name="length"]');
        if (mainInput) {
            mainInput.addEventListener('blur', function () {
                let val = this.value.replace(',', '.');
                if (val && !isNaN(val)) {
                    this.value = parseFloat(val).toFixed(2).replace('.', ',');
                }
            });
        }
    }

    // Initial toggle check for Facade (and now Fence)
    if (moduleName === 'facade') toggleSubOptions();
    if (moduleName === 'hydro') toggleHydroOptions();
    if (moduleName === 'fence') {
        toggleFenceOptions();
        updateFenceHeights();
    }
}

// UI Toggles
window.selectLayout = function (type) {
    const btnStraight = document.getElementById('layout-straight');
    const btnCorners = document.getElementById('layout-corners');
    const inputCorners = document.getElementById('fence-corners');

    if (type === 'straight') {
        btnStraight.classList.add('active');
        btnCorners.classList.remove('active');
        // Clear input logic
        if (inputCorners) inputCorners.value = '';
    } else {
        btnCorners.classList.add('active');
        btnStraight.classList.remove('active');
        // If simply clicked container, focus input
        if (inputCorners && document.activeElement !== inputCorners) {
            inputCorners.focus();
        }
    }
}

window.selectInstallation = function (val) {
    const btnYes = document.getElementById('install-yes');
    const btnNo = document.getElementById('install-no');
    const input = document.getElementById('fence-installation');

    input.value = val;

    if (val === 'yes') {
        btnYes.classList.add('active');
        btnNo.classList.remove('active');
    } else {
        btnNo.classList.add('active');
        btnYes.classList.remove('active');
    }
}

window.selectGate = function (val) {
    const btnYes = document.getElementById('gate-yes');
    const btnNo = document.getElementById('gate-no');
    const input = document.getElementById('gate-needed');
    const options = document.getElementById('gate-options');

    input.value = val;

    if (val === 'yes') {
        btnYes.classList.add('active');
        btnNo.classList.remove('active');
        options.classList.remove('hidden');
    } else {
        btnNo.classList.add('active');
        btnYes.classList.remove('active');
        options.classList.add('hidden');
    }
}

window.selectGateSize = function (size) {
    // 1. Update hidden input
    document.getElementById('gate-size').value = size;

    // 2. Update visual buttons
    // Reset all
    ['1000', '1200', '1500', '1700', '2000'].forEach(s => {
        document.getElementById(`gate-${s}`).classList.remove('active');
    });

    // Set active
    document.getElementById(`gate-${size}`).classList.add('active');
}

window.toggleFenceOptions = function () {
    const type = document.getElementById('panel-type').value;
    const opt3d = document.getElementById('fence-3d-options');

    if (type === '3d') {
        opt3d.classList.remove('hidden');
    } else {
        opt3d.classList.add('hidden');
    }
    // Refresh height list
    updateFenceHeights();
}

// Data for heights
const fenceHeights = {
    '2d': [83, 103, 123, 143, 163, 183, 203],
    '3d': [83, 103, 123, 153, 173, 203]
};

window.updateFenceHeights = function () {
    const type = document.getElementById('panel-type').value;
    const heightSelect = document.getElementById('height');
    const validHeights = fenceHeights[type] || [];
    const currentVal = parseInt(heightSelect.value) || 0;

    heightSelect.innerHTML = '';

    validHeights.forEach(h => {
        const option = document.createElement('option');
        option.value = h;
        option.text = `${h} cm`;
        if (h === currentVal) option.selected = true;
        heightSelect.appendChild(option);
    });
}

window.toggleSubOptions = function () {
    const type = document.getElementById('facade-type').value;
    const eticsOpts = document.getElementById('etics-options');
    const ventOpts = document.getElementById('ventilated-options');

    if (type === 'etics') {
        eticsOpts.classList.remove('hidden');
        ventOpts.classList.add('hidden');
    } else {
        eticsOpts.classList.add('hidden');
        ventOpts.classList.remove('hidden');
    }
}

window.toggleHydroOptions = function () {
    const type = document.getElementById('hydro-type').value;
    const membraneOpts = document.getElementById('membrane-options');
    const xpsOpts = document.getElementById('hydro-xps-options');

    // Show Membrane options only for TPO/PVC Roof
    if (type === 'membrane-roof') {
        membraneOpts.classList.remove('hidden');
        toggleMembraneThickness(); // Check sub-options
    } else {
        membraneOpts.classList.add('hidden');
    }

    // Show XPS options for Foundations (Bitumen/PVC) AND now Roof (TPO/PVC)
    if (type === 'bitumen-foundation' || type === 'pvc-foundation' || type === 'membrane-roof') {
        xpsOpts.classList.remove('hidden');
    } else {
        xpsOpts.classList.add('hidden');
    }

    // Show Polymer Options
    const polymerOpts = document.getElementById('polymer-options');
    if (polymerOpts) {
        if (type === 'polymer') {
            polymerOpts.classList.remove('hidden');
        } else {
            polymerOpts.classList.add('hidden');
        }
    }
}

window.toggleMembraneThickness = function () {
    const matSelect = document.getElementById('membrane-mat');
    const tpoGroup = document.getElementById('tpo-thickness-group');

    if (matSelect && matSelect.value === 'tpo') {
        tpoGroup.classList.remove('hidden');
    } else {
        tpoGroup.classList.add('hidden');
    }
}

// Main Calculator Logic
// Main Calculator Logic
let isSubmitting = false;

function handleCalculation(e) {
    if (e) e.preventDefault();
    if (isSubmitting) return;

    // Find the button and disable it temporarily
    const btn = document.querySelector('#calc-form .calculate-btn');
    if (btn) {
        btn.disabled = true;
        btn.innerHTML = "⏳ Računam...";
    }
    isSubmitting = true;

    // Re-enable after delay (prevents double clicks)
    setTimeout(() => {
        isSubmitting = false;
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = "Izračunaj";
        }
    }, 2000);

    // VALIDATION: Strict check for Email and Phone
    if (!data.userEmail || !data.userPhone) {
        alert("Molimo unesite Email i Kontakt broj za izračun.");
        // Re-enable immediately on validation error
        isSubmitting = false;
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = "Izračunaj";
        }
        return; // Stop calculation
    }

    console.log("Calculating for module:", currentModule, data);

    let results = [];

    // --- LOGIC ROUTER ---
    try {
        if (currentModule === 'facade') {
            results = calculateFacade(data);
        } else if (currentModule === 'thermal') {
            results = calculateThermal(data);
        } else if (currentModule === 'hydro') {
            results = calculateHydro(data);
        } else if (currentModule === 'fence') {
            results = calculateFence(data);
        }
    } catch (err) {
        console.error("Calculation Error:", err);
        alert("Greška u izračunu: " + err.message);
        return;
    }

    displayResults(results);

    // UI Feedback for User
    // Use a small toast/snackbar instead of blocking alert if possible, but alert is requested
    // "Hvala na upitu! (čidto kao obavjest za kupca ,da je upit poslan)"
    // We only show this if it's a manual trigger, but handleCalculation is the main entry.
    // Let's us a non-blocking notification or simple alert.
    // User asked for: "sustav izbaci poruku: Hvala na upitu!"
    // We will use a standard alert for ensuring visibility as requested.

    // DELAY ALERT slightly to allow UI to update
    setTimeout(() => {
        alert("Hvala na upitu! Vaš izračun je spreman ispod.\n(Kopija upita je poslana našem timu.)");
    }, 100);

    sendInstantData(results, data); // Instant capture RESTORED
}

// --- CALCULATION ENGINES ---

function calculateFacade(data) {
    const area = parseFloat(data.area.replace(',', '.'));
    const waste = 1.05; // 5% waste
    let items = [];

    // console.log("Calculating Facade...", data); // Debug

    if (data.type === 'etics') {
        const h = parseInt(data.thickness) || 10;

        let insulationName = `EPS F izolacijske ploče (${h}cm)`;
        let insulationSku = '4001';
        let insulationPrice = h * prices.facade_etics.eps_base_cm.price;
        let insulationCost = 0;

        let glueStickName = 'Ljepilo za EPS (Ljepljenje)';
        let glueStickPrice = prices.facade_etics.glue_eps.price;
        let glueStickCost = 0;

        if (data.material === 'wool') {
            const allowed = [5, 6, 8, 10, 12, 14, 15];
            let snapH = h;
            const found = allowed.find(x => x >= h);
            if (found) snapH = found; else snapH = 15;

            insulationName = `Fasadna Kamena Vuna (${snapH}cm)`;
            insulationSku = '4010';
            insulationPrice = getWoolPrice(snapH);
            insulationCost = getWoolCost(snapH);

            glueStickName = 'Ljepilo za Vunu (Ljepljenje)';
            glueStickPrice = prices.facade_etics.glue_wool;
            glueStickCost = costs.facade_etics.glue_wool;
        }

        // 1. Izolacija
        items.push({ sku: insulationSku, name: insulationName, value: (area * waste).toFixed(2), unit: 'm²', price: insulationPrice, cost_price: insulationCost });

        // 2. Ljepilo za Ljepljenje
        items.push({ sku: '4002', name: glueStickName, value: (area * 3.5).toFixed(1), unit: 'kg', price: glueStickPrice, cost_price: glueStickCost });

        // 3. Ljepilo za Armiranje (Uniterm)
        items.push({ sku: '4003', name: 'Uniterm (Ljepilo za armiranje/gletanje)', value: (area * 4.5).toFixed(1), unit: 'kg', price: prices.facade_etics.glue_armor.price, cost_price: 0 });

        // 4. Mrežica
        items.push({ sku: '4004', name: 'Staklena mrežica Primafas', value: (area * 1.1).toFixed(2), unit: 'm²', price: prices.facade_etics.mesh.price, cost_price: 0 });

        // 5. Profili
        items.push({ sku: '4008', name: 'Profil PVC s mrežicom (kutni)', value: (area * 0.4).toFixed(1), unit: 'm', price: prices.facade_etics.profile_pvc.price, cost_price: 0 });
        items.push({ sku: '4009', name: 'Alu Cokl Profil (15cm)', value: (area * 0.2).toFixed(1), unit: 'm', price: prices.facade_etics.profile_alu.price, cost_price: 0 });

        // 6. Pričvrsnice
        items.push({ sku: '4005', name: 'Pričvrsnica PSV (Tiple)', value: Math.ceil(area * 6), unit: 'kom', price: prices.facade_etics.dowel.price, cost_price: 0 });

        // 7. Grund
        items.push({ sku: '4006', name: 'Mineralkvarc Grund (Primer)', value: (area * 0.3).toFixed(1), unit: 'L', price: prices.facade_etics.grund.price, cost_price: 0 });

        // 8. Završna žbuka
        items.push({ sku: '4007', name: 'Silikatna žbuka Z 4000 (1.5mm)', value: (area * 2.5).toFixed(1), unit: 'kg', price: prices.facade_etics.plaster_silicat.price, cost_price: 0 });

    } else {
        // Ventilated
        items.push({ sku: '4050', name: 'Kamena vuna s voalom', value: (area * waste).toFixed(2), unit: 'm²' });
        items.push({ sku: '4051', name: `Fasadna obloga (${data.cladding})`, value: (area * waste).toFixed(2), unit: 'm²' });
        items.push({ sku: '4052', name: 'Alu nosači', value: Math.ceil(area * 2.5), unit: 'kom' });
        items.push({ sku: '4053', name: 'Vertikalni profili', value: (area * 2.2).toFixed(1), unit: 'm' });
        items.push({ sku: '4054', name: 'Vijci', value: Math.ceil(area * 15), unit: 'kom' });
    }

    return items;
}

function calculateThermal(data) {
    const area = parseFloat(data.area.replace(',', '.'));
    const waste = 1.05;
    let items = [];

    if (data.type === 'xps') {
        const thickness = parseInt(data.thickness);
        const xpsPrice = getXPSPrice(thickness);

        items.push({ sku: '3001', name: `XPS ploče (${data.thickness}cm)`, value: (area * waste).toFixed(2), unit: 'm²', price: xpsPrice });
        items.push({ sku: '3002', name: 'Ljepilo/Pjena (Insta Stik)', value: Math.ceil(area / 10), unit: 'pak', price: prices.chemicals.insta_stik.price, cost_price: 0 });
        items.push({ sku: '3003', name: 'Čepasta folija (zaštita)', value: (area * 1.1).toFixed(2), unit: 'm²', price: prices.membranes.cepasta.price, cost_price: 0 });
    } else {
        const thickness = parseInt(data.thickness);
        const woolPrice = getWoolPrice(thickness);

        items.push({ sku: '3050', name: `Mineralna vuna (${data.thickness}cm)`, value: (area * waste).toFixed(2), unit: 'm²', price: woolPrice });
        items.push({ sku: '3050', name: `Mineralna vuna (${data.thickness}cm)`, value: (area * waste).toFixed(2), unit: 'm²', price: woolPrice });
        items.push({ sku: '3051', name: 'Parna brana (Vapor Al-35)', value: (area * 1.1).toFixed(2), unit: 'm²', price: prices.bitumen.vapor_al.price, cost_price: 0 });
    }
    return items;
}

function calculateHydro(data) {
    const area = parseFloat(data.area.replace(',', '.'));
    let items = [];

    // --- BITUMEN TEMELJI ---
    if (data.type === 'bitumen-foundation') {
        const thickness = parseInt(data.hydroThickness) || 5;
        const xpsPrice = getXPSPrice(thickness);
        const xpsCost = getXPSCost(thickness);

        // 1. Bitumen
        items.push({ sku: '1001', name: 'Bitumenski premaz (Fimizol/9L)', value: (area * 0.3).toFixed(1), unit: 'L', price: prices.chemicals.fimizol.price, cost_price: 0 });
        items.push({ sku: '1002', name: 'Bitumenska traka (Ruby V-4)', value: (area * 1.15).toFixed(2), unit: 'm²', price: prices.bitumen.ruby_v4.price, cost_price: 0 });

        // 2. XPS
        items.push({ sku: '1003', name: `XPS ploče (${thickness}cm)`, value: (area * 1.05).toFixed(2), unit: 'm²', price: xpsPrice, cost_price: 0 });
        items.push({ sku: '1004', name: 'Ljepilo/Pjena za XPS (Insta Stik)', value: Math.ceil(area / 10), unit: 'pak', price: prices.chemicals.insta_stik.price, cost_price: 0 });

        // 3. Čepasta
        // 3. Čepasta
        items.push({ sku: '1005', name: 'Čepasta folija (zaštita)', value: (area * 1.1).toFixed(2), unit: 'm²', price: prices.membranes.cepasta.price, cost_price: 0 });

    } else if (data.type === 'bitumen-roof') {
        items.push({ sku: '1001', name: 'Bitumenski premaz (Fimizol/9L)', value: (area * 0.3).toFixed(1), unit: 'L', price: prices.chemicals.fimizol.price, cost_price: 0 });
        items.push({ sku: '1006', name: 'Bitumenska traka (Diamond P4)', value: (area * 1.15).toFixed(2), unit: 'm²', price: prices.bitumen.diamond_p4.price, cost_price: 0 });
        items.push({ sku: '1007', name: 'Geotekstil', value: (area * 1.1).toFixed(2), unit: 'm²', price: prices.membranes.geotextile.price, cost_price: 0 });
        items.push({ sku: '1020', name: 'Parna brana (Vapor Al-35)', value: (area * 1.1).toFixed(2), unit: 'm²', price: prices.bitumen.vapor_al.price, cost_price: 0 });

        // --- TPO / PVC ---
        // --- TPO / PVC (ravni krov) ---
    } else if (data.type === 'membrane-roof' || data.type === 'tpo' || data.type === 'pvc-roof') {
        const thickness = parseInt(data.hydroThickness) || 5;
        const xpsPrice = getXPSPrice(thickness);
        const xpsCost = getXPSCost(thickness);

        // Determine sub-type from membraneMaterial
        const isTPO = (data.membraneMaterial === 'tpo') || (data.type === 'tpo');
        const tpoThickness = data.tpoThickness || '1.5';

        let folijaPrice = 0;
        let folijaCost = 0;
        let naziv = "";
        let skuCode = "";

        if (isTPO) {
            if (tpoThickness === '1.5') {
                folijaPrice = prices.membranes.tpo_15; folijaCost = costs.membranes.tpo_15; naziv = "TPO folija 1.5mm"; skuCode = "1008";
            } else if (tpoThickness === '1.8') {
                folijaPrice = prices.membranes.tpo_18; folijaCost = costs.membranes.tpo_18; naziv = "TPO folija 1.8mm"; skuCode = "1008";
            } else if (tpoThickness === '2.0') {
                folijaPrice = prices.membranes.tpo_20; folijaCost = costs.membranes.tpo_20; naziv = "TPO folija 2.0mm"; skuCode = "1009";
            } else {
                folijaPrice = prices.membranes.tpo_15; folijaCost = costs.membranes.tpo_15; naziv = "TPO folija 1.5mm"; skuCode = "1010";
            }
        } else {
            folijaPrice = prices.membranes.pvc_krov;
            folijaCost = costs.membranes.pvc_krov;
            naziv = "PVC folija (krov)";
            skuCode = "1011";
        }

        // 1. XPS
        items.push({ sku: '1003', name: `XPS ploče (${thickness}cm)`, value: (area * 1.05).toFixed(2), unit: 'm²', price: xpsPrice, cost_price: 0 });

        // 2. Foil
        items.push({ sku: skuCode, name: `${naziv} (10% preklop)`, value: (area * 1.15).toFixed(2), unit: 'm²', price: folijaPrice && folijaPrice.price !== undefined ? folijaPrice.price : folijaPrice, cost_price: 0 });
        items.push({ sku: '1007', name: 'Geotekstil (razdjelni sloj)', value: (area * 1.1).toFixed(2), unit: 'm²', price: prices.membranes.geotextile.price, cost_price: 0 });

        const limPrice = isTPO ? prices.others.tpo_lim.price : prices.others.pvc_lim.price;
        const limSku = isTPO ? '1012' : '1013';
        items.push({ sku: limSku, name: 'Limovi (2x1m) - Procjena', value: 4, unit: 'kom', price: limPrice, cost_price: 0 });

        // --- PVC FOUNDATION ---
    } else if (data.type === 'pvc-foundation') {
        const thickness = parseInt(data.hydroThickness) || 5;
        const xpsPrice = getXPSPrice(thickness);
        const xpsCost = getXPSCost(thickness);

        items.push({ sku: '1014', name: 'PVC folija za temelje (BSL 1.5mm)', value: (area * 1.10).toFixed(2), unit: 'm²', price: prices.membranes.pvc_temelji.price, cost_price: 0 });
        items.push({ sku: '1007', name: 'Geotekstil (zaštita)', value: (area * 1.1).toFixed(2), unit: 'm²', price: prices.membranes.geotextile.price, cost_price: 0 });
        items.push({ sku: '1003', name: `XPS ploče (${thickness}cm)`, value: (area * 1.05).toFixed(2), unit: 'm²', price: xpsPrice, cost_price: 0 });
        items.push({ sku: '1004', name: 'Ljepilo/Pjena za XPS (Insta Stik)', value: Math.ceil(area / 10), unit: 'pak', price: prices.chemicals.insta_stik.price, cost_price: 0 });
        items.push({ sku: '1005', name: 'Čepasta folija (zaštita)', value: (area * 1.1).toFixed(2), unit: 'm²', price: prices.membranes.cepasta.price, cost_price: 0 });

    } else if (data.type === 'polymer') {
        items.push({ sku: '1015', name: 'Polimercement (Aquamat Elastic) 2 sloja', value: (area * 3).toFixed(1), unit: 'kg', price: prices.chemicals.aquamat_elastic.price, cost_price: 0 });
        items.push({ sku: '1016', name: 'Brtveća traka', value: Math.ceil(Math.sqrt(area) * 4), unit: 'm', price: 0 });

        if (data.polymerFinish === 'ceramics') {
            items.push({ sku: '1017', name: 'Isomat AK-20', value: (area * 3.5).toFixed(1), unit: 'kg', price: prices.chemicals.ak20.price, cost_price: 0 });
        }
    } else if (data.type === 'isoflex-pu500') {
        items.push({ sku: '1018', name: 'Primer (Isomat Primer-PU 100)', value: (area * 0.2).toFixed(1), unit: 'kg', price: 0, cost_price: 0 });
        items.push({ sku: '1019', name: 'Isomat Isoflex PU500 (2 sloja)', value: (area * 1.5).toFixed(1), unit: 'kg', price: prices.chemicals.isoflex_pu500.price, cost_price: 0 });
        items.push({ sku: '1016', name: 'Brtveća traka', value: Math.ceil(Math.sqrt(area) * 4), unit: 'm', price: 0 });
    }

    return items;
}

// Color Selection Logic
window.selectColor = function (ral, btn) {
    // Update hidden input
    document.getElementById('fence-color').value = ral;

    // Update UI
    const btns = document.querySelectorAll('.color-btn');
    btns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
}

function calculateFence(data) {
    const length = parseFloat(data.length.replace(',', '.'));
    const height = parseInt(data.height); // "103", "123" (cm)
    const type = data.panelType; // "2d" or "3d"
    const color = data.fenceColor === '6005' ? 'Zelena (RAL 6005)' : 'Antracit (RAL 7016)';

    // KEY FIX: Data is matchign inputs (CM)
    const heightKey = height;

    let items = [];

    // Construct Price Lookup
    let panelPrice = 0;
    let panelName = "";

    if (type === '2d') {
        // MATCHING: prices.fence.panel_2d[heightKey]
        try {
            if (prices.fence.panel_2d[heightKey]) {
                panelPrice = prices.fence.panel_2d[heightKey].price || 0;
            }
        } catch (e) { console.error("Missing price for 2D", heightKey); }

        panelName = `2D panel 6/5/6 mm (${height}cm) - ${color}`;
    } else {
        const thickness = data.panelThickness || '4'; // Default to 4
        // MATCHING: prices.fence.panel_3d_5[heightKey] or panel_3d_4[heightKey]
        const key3d = `panel_3d_${thickness}`;
        try {
            if (prices.fence[key3d] && prices.fence[key3d][heightKey]) {
                panelPrice = prices.fence[key3d][heightKey].price || 0;
            }
        } catch (e) { console.error("Missing price for 3D", thickness, heightKey); }

        panelName = `3D panel ${thickness}mm (${height}cm) - ${color}`;
    }

    // 1. Paneli (Dužina / 2.5m)
    const numPanels = Math.ceil(length / 2.5);

    items.push({
        sku: '2001',
        name: panelName,
        value: numPanels,
        unit: 'kom',
        price: panelPrice
    });

    // 2. Stupovi (Broj panela + 1 za početak/kraj)
    const corners = parseInt(data.fenceCorners) || 0;
    const numPosts = numPanels + 1 + corners;

    let postHeight = parseInt(height) + 2; // This is logic for post length? No, usually + 50cm for embedding?
    // User logic:
    if (data.postType === 'concrete') {
        // Standard mapping based on existing code logic
        if (height <= 103) postHeight = 155;
        else if (height <= 123) postHeight = 175;
        else if (height <= 153) postHeight = 205;
        else if (height <= 173) postHeight = 225; // 225 cm not in list? 230
        else postHeight = 255;
    }

    // MATCHING: prices.fence.posts[postHeight]
    let postPrice = 0;

    // Standard Heights available in config/prices
    const standardPostHeights = [155, 175, 205, 225, 230, 255];

    // Fallback Logic: Find first available height >= requested postHeight
    let lookupHeight = postHeight;
    let priceSource = prices.fence.posts;

    // Use Concrete Price Source if applicable
    if (data.postType === 'concrete' && prices.fence.posts_concrete) {
        priceSource = prices.fence.posts_concrete;
    }

    // Try finding exact or next larger
    if (!priceSource[lookupHeight]) {
        // Try to find next larger standard size
        const nextSize = standardPostHeights.find(h => h >= postHeight);
        if (nextSize) {
            // console.log(`Fallback post height: ${postHeight} -> ${nextSize}`);
            lookupHeight = nextSize;
        }
    }

    try {
        if (priceSource[lookupHeight]) {
            postPrice = priceSource[lookupHeight].price || 0;
        }
    } catch (e) { console.error("Missing price for post", lookupHeight); }

    const postTypeLabel = data.postType === 'plate' ? 's pločicom' : 'za betoniranje';

    items.push({
        sku: '2002',
        name: `Stup ${postHeight}cm (${postTypeLabel}) - ${color}`,
        value: numPosts,
        unit: 'kom',
        price: postPrice
    });

    // 3. Pribor
    // Spojnice:
    // ... rest of fence logic ...

    // 83-103 -> 2 kom
    // 123, 143, 153, 163 -> 3 kom
    // 173, 183, 203 -> 4 kom
    let clampsPerPost = 3;
    const h = parseInt(postHeight) || 0;

    if (h <= 103) {
        clampsPerPost = 2;
    } else if (h <= 163) {
        clampsPerPost = 3;
    } else {
        clampsPerPost = 4;
    }

    const totalClamps = numPosts * clampsPerPost;

    items.push({
        sku: '2003',
        name: 'Spojnice (Komplet s vijkom)',
        value: totalClamps,
        unit: 'kom',
        price: prices.fence.set_spojnica, cost_price: costs.fence.set_spojnica
    });

    if (data.postType === 'plate') {
        // Anker vijci (4 po stupu)
        items.push({
            sku: '2004',
            name: 'Anker vijci, M10 (za montažu na beton)',
            value: numPosts * 4,
            unit: 'kom',
            price: prices.fence.anker_vijci, cost_price: costs.fence.anker_vijci
        });
    }

    // 4. Montaža (Optional)
    if (data.fenceInstallation === 'yes') {
        let installPrice = prices.fence.montaza_plate;
        let installName = 'Usluga montaže ograde';

        if (data.postType === 'concrete') {
            installPrice = prices.fence.montaza_concrete;
            installName += '<br><small class="text-muted d-block" style="font-weight: normal; font-size: 0.85em;">(iskop i beton uključen u cijenu montaže)</small>';
        }

        items.push({
            sku: '2005',
            name: installName,
            value: length.toFixed(2),
            unit: 'm',
            price: installPrice
        });
    }

    // 5. Pješačka vrata (NEW)
    if (data.gateNeeded === 'yes') {
        const gSize = data.gateSize || '1000'; // 1000, 1200...
        const gPostType = data.gatePostType || 'plate';
        const gPostLabel = gPostType === 'plate' ? 's pločicom' : 'za betoniranje';
        const fullSizeKey = `1000x${gSize}`;

        // Price lookup
        let gatePrice = 0;
        try {
            // Priority 1: Dynamic Data (prices.fence.gates) - Simple Key (Size -> Price)
            if (prices.fence.gates && prices.fence.gates[gSize]) {
                gatePrice = prices.fence.gates[gSize];
            }
            // Priority 2: Static Data (prices.fence.gate_prices) - Complex Structure
            else if (prices.fence.gate_prices && prices.fence.gate_prices[fullSizeKey]) {
                const typeKey = gPostType === 'plate' ? 'plate' : 'concrete';
                if (prices.fence.gate_prices[fullSizeKey][typeKey]) {
                    gatePrice = prices.fence.gate_prices[fullSizeKey][typeKey].p || 0;
                }
            }
            else {
                console.warn("Pricing not found for gate:", gSize);
            }
        } catch (e) { console.error("Missing gate price logic", gSize, e); }

        items.push({
            sku: '2006',
            name: `Pješačka vrata 1000x${gSize}mm (Stupovi ${gPostLabel})`,
            value: 1,
            unit: 'kom',
            price: gatePrice
        });
    }

    return items;
}

function displayResults(items) {
    resultsSection.classList.remove('hidden');
    resultsContainer.innerHTML = '';

    // Header Row
    const header = document.createElement('div');
    header.className = 'result-item result-header-row';
    header.innerHTML = `
        <span class="col-name">Materijal</span>
        <span class="col-qty">Količina</span>
        <span class="col-price">Cijena/jed</span>
        <span class="col-total">Ukupno</span>
    `;
    resultsContainer.appendChild(header);

    let grandTotal = 0;

    // Store items for email sending
    window.lastItems = items;

    items.forEach(item => {
        const div = document.createElement('div');
        div.className = 'result-item';

        const qty = parseFloat(item.value);
        const unitPrice = item.price || 0;
        const totalCost = qty * unitPrice;

        if (unitPrice > 0) grandTotal += totalCost;

        // Formatiranje brojeva (hr-HR lokacija: točka za tisućice, zarez za decimale)
        const fmtPrice = unitPrice > 0 ? unitPrice.toLocaleString('hr-HR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €' : '-';
        const fmtTotal = unitPrice > 0 ? totalCost.toLocaleString('hr-HR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €' : '-';

        div.innerHTML = `
            <span class="result-label col-name">${item.name}</span>
            <span class="result-value col-qty">${item.value} <small>${item.unit}</small></span>
            <span class="result-price col-price">${fmtPrice}</span>
            <span class="result-total col-total">${fmtTotal}</span>
        `;
        resultsContainer.appendChild(div);
    });

    // Grand Total Row
    const totalDiv = document.createElement('div');
    totalDiv.className = 'result-item grand-total';
    const fmtGrandTotal = grandTotal.toLocaleString('hr-HR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    // Conditional Styling for Fence Module
    if (currentModule === 'fence') {
        const fenceColor = document.getElementById('fence-color').value;
        const colorCode = fenceColor === '6005' ? '#0B3D2E' : '#383E42'; // Green or Anthracite
        totalDiv.style.backgroundColor = colorCode;
        totalDiv.style.color = 'white'; // White text on dark bg

        // Add specific class to handle hover overrides if needed, 
        // but inline style might persist. We can handle hover via 'onmouseenter' / 'onmouseleave' 
        // or effectively by toggling classes. 
        // Simplest: Event listeners here to swap styles.
        totalDiv.addEventListener('mouseenter', () => {
            totalDiv.style.backgroundColor = 'rgba(230, 126, 34, 0.15)'; // Light Orange
            totalDiv.style.color = 'black';
            // Target inner strong tags if necessary, but inheritance usually works for color
            const strongs = totalDiv.querySelectorAll('strong');
            strongs.forEach(s => s.style.color = 'black');
        });
        totalDiv.addEventListener('mouseleave', () => {
            totalDiv.style.backgroundColor = colorCode;
            totalDiv.style.color = 'white';
            const strongs = totalDiv.querySelectorAll('strong');
            strongs.forEach(s => s.style.color = 'white');
        });

        // Initial White Text for child elements
        // We'll handle this in the innerHTML construction or verify after
    }

    totalDiv.innerHTML = `
        <span class="col-name"><strong>SVEUKUPNO:</strong></span>
        <span class="col-qty"></span>
        <span class="col-price"></span>
        <span class="col-total"><strong>${fmtGrandTotal} €</strong></span>
    `;

    if (currentModule === 'fence') {
        // Ensure initial inner text is white
        const strongs = totalDiv.querySelectorAll('strong');
        strongs.forEach(s => s.style.color = 'white');
    }

    resultsContainer.appendChild(totalDiv);

    // Add Payment Note to Frontend Result
    const noteDiv = document.createElement('div');
    noteDiv.className = 'result-note';
    noteDiv.style.marginTop = '20px';
    noteDiv.style.padding = '15px';
    noteDiv.style.backgroundColor = '#fff3e0';
    noteDiv.style.borderLeft = '4px solid #E67E22';
    noteDiv.style.fontSize = '0.9rem';
    noteDiv.style.color = '#444';

    noteDiv.innerHTML = `
        <strong>Uvjeti kupnje:</strong>
        <ul style="margin: 5px 0 10px 20px; padding: 0;">
            <li>Plaćanje: avans - uplatom na žiro račun</li>
            <li>Minimalni iznos kupovine: 200,00 eur</li>
            <li>Sve cijene su sa PDV-om, koji ne smije biti iskazan na računu*</li>
        </ul>
        <div style="font-size: 0.8rem; opacity: 0.8;">
            * Porezni obveznik nije u sustavu PDV-a, temeljem članka 90. Zakona o porezu na dodanu vrijednost
        </div>
    `;
    resultsContainer.appendChild(noteDiv);

    resultsSection.scrollIntoView({ behavior: 'smooth' });
}

// Export Logic
const pdfBtn = document.getElementById('pdf-btn');
const emailBtn = document.getElementById('email-btn');

/* if (pdfBtn) {
    pdfBtn.addEventListener('click', () => {
        const element = document.getElementById('results-section');
        const opt = {
            margin: 10,
            filename: `izracun_${currentModule}_${new Date().toISOString().split('T')[0]}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };
        // Temporarily hide buttons for clean PDF
        const btns = document.querySelector('.action-buttons');
        btns.style.display = 'none';
 
        html2pdf().set(opt).from(element).save().then(() => {
            btns.style.display = 'flex'; // Restore buttons
        });
    });
} */

const emailBtnSend = document.getElementById('email-btn-send');

if (emailBtnSend) {
    emailBtnSend.addEventListener('click', () => {
        // Collect User Data from the current form
        // Note: IDs are unique because we completely overwrite HTML, so document.getElementById is safe
        const emailInput = document.getElementById('user-email');
        const nameInput = document.getElementById('user-name');
        const phoneInput = document.getElementById('user-phone');

        const email = emailInput ? emailInput.value.trim() : "";
        const name = nameInput ? nameInput.value.trim() : "Kupac";
        const phone = phoneInput ? phoneInput.value.trim() : "";

        if (!email) {
            alert("Molim vas upišite email adresu u formu prije slanja.");
            // Scroll to form if needed/possible, or just let user find it
            const form = document.querySelector('#calc-form');
            if (form) form.scrollIntoView({ behavior: 'smooth' });
            return;
        }

        if (!window.lastItems || window.lastItems.length === 0) {
            alert("Nema stavki za slanje. Molimo napravite izračun prvo.");
            return;
        }

        // Prepare Payload
        // Map JS items to GAS expected structure: {name, qty, unit, price_sell}
        const itemsPayload = window.lastItems.filter(i => i.price > 0).map(i => ({
            sku: i.sku || "", // Pass SKU!
            name: i.name,
            qty: i.value,     // JS uses 'value' for quantity
            unit: i.unit,
            price_sell: i.price,
            // We pass price_sell, GAS calculates buy/profit
        }));

        const payload = {
            email: email,
            name: name,
            phone: phone,
            _subject: `Upit za ponudu - ${translateModule(currentModule)}`,
            items_json: JSON.stringify(itemsPayload)
        };

        // UI Feedback
        const originalText = emailBtnSend.innerHTML;
        emailBtnSend.innerHTML = "⏳ Šaljem...";
        emailBtnSend.disabled = true;

        // Send to GAS
        // Send to GAS
        const GAS_URL = GOOGLE_SCRIPT_URL;

        fetch(GAS_URL, {
            method: 'POST',
            body: new URLSearchParams(payload)
        })
            .then(response => response.json())
            .then(data => {
                if (data.result === 'success') {
                    alert("Ponuda je uspješno poslana na vaš email!");
                } else {
                    alert("Došlo je do greške: " + data.error);
                }
            })
            .catch(err => {
                console.error(err);
                alert("Greška u komunikaciji sa serverom.");
            })
            .finally(() => {
                emailBtnSend.innerHTML = originalText;
                emailBtnSend.disabled = false;
            });
    });
}

// Load default
currentModule = 'hydro'; // Fix: Ensure state matches UI
loadModule('hydro');
setTimeout(() => {
    // Ensure options are visible for the default selection
    if (typeof toggleHydroOptions === 'function') toggleHydroOptions();
}, 100);

// PDF Generation Handler (Robust: Creates clean temporary HTML)
setTimeout(() => {
    const pdfBtn = document.getElementById('pdf-btn');
    if (pdfBtn) {
        pdfBtn.addEventListener('click', function () {
            // Check if results exist
            if (!window.lastItems || window.lastItems.length === 0) {
                alert("Prvo napravite izračun!");
                return;
            }

            // Create a clean, temporary print container
            const printContainer = document.createElement('div');
            printContainer.id = 'pdf-print-container';

            // Inline Styles (VISIBLE for debugging/rendering stability)
            printContainer.style.position = 'fixed'; // Changed from absolute
            printContainer.style.left = '0';         // Changed from -9999px
            printContainer.style.top = '0';
            printContainer.style.width = '100%';     // Full width
            printContainer.style.height = '100%';    // Full height
            printContainer.style.overflow = 'auto';  // Scrollable if needed
            printContainer.style.background = 'white';
            printContainer.style.color = 'black';
            printContainer.style.fontFamily = "'Segoe UI', sans-serif";
            printContainer.style.padding = '20mm';
            printContainer.style.zIndex = '99999';   // On top of everything

            // Build HTML Content (Similar to Email Template)
            let rowsHtml = '';
            let total = 0;

            window.lastItems.forEach(item => {
                const lineTotal = item.value * item.price;
                total += lineTotal;
                rowsHtml += `
                    <tr style="border-bottom: 1px solid #eee;">
                        <td style="padding: 10px; text-align: left;">${item.name}</td>
                        <td style="padding: 10px; text-align: center;">${item.value} ${item.unit}</td>
                        <td style="padding: 10px; text-align: right; white-space: nowrap;">${item.price > 0 ? item.price.toLocaleString('hr-HR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €' : '-'}</td>
                        <td style="padding: 10px; text-align: right; white-space: nowrap; font-weight: bold;">${item.price > 0 ? lineTotal.toLocaleString('hr-HR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €' : '-'}</td>
                    </tr>
                `;
            });

            printContainer.innerHTML = `
                <div style="text-align: center; border-bottom: 4px solid #2C2C54; padding-bottom: 20px; margin-bottom: 30px;">
                    <h1 style="color: #E67E22; font-family: 'Chakra Petch', sans-serif; margin: 0; font-size: 28px; text-transform: uppercase;">2LMF PRO</h1>
                    <p style="margin: 5px 0 0 0; color: #333; font-size: 14px; font-weight: bold;">HIDRO & TERMO IZOLACIJA • FASADE • OGRADE</p>
                </div>

                <div style="margin-bottom: 30px;">
                    <h2 style="color: #E67E22; margin-bottom: 10px; font-size: 18px; border-bottom: 2px solid #ddd; padding-bottom: 5px;">INFORMATIVNA PONUDA</h2>
                    <p style="font-size: 12px; color: #555;">Hvala na vašem interesu. Ovdje je informativni izračun prema vašim parametrima.</p>
                </div>

                <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
                    <thead>
                        <tr style="background-color: #E67E22; color: black;">
                            <th style="padding: 10px; text-align: left;">STAVKA</th>
                            <th style="padding: 10px; text-align: center;">KOL.</th>
                            <th style="padding: 10px; text-align: right;">CIJENA</th>
                            <th style="padding: 10px; text-align: right;">UKUPNO</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${rowsHtml}
                    </tbody>
                </table>

                <div style="margin-top: 30px; text-align: right;">
                    <div style="display: inline-block; background: #E67E22; color: black; padding: 15px; border: 2px solid #2C2C54; border-radius: 4px;">
                        <span style="display: block; font-size: 10px; text-transform: uppercase; margin-bottom: 5px;">SVEUKUPNI IZNOS</span>
                        <span style="font-size: 20px; font-weight: bold; font-family: 'Chakra Petch', sans-serif;">${total.toLocaleString('hr-HR', { minimumFractionDigits: 2 })} €</span>
                    </div>
                </div>

                <div style="margin-top: 40px; background: #fff3e0; padding: 15px; font-size: 11px; color: #444; border-left: 4px solid #E67E22;">
                    <b>Uvjeti kupnje:</b><br>
                    <ul style="margin-top:5px; padding-left: 20px;">
                        <li>Plaćanje: avans - uplatom na žiro račun</li>
                        <li>Minimalni iznos kupovine: 200,00 eur</li>
                        <li>Sve cijene su sa PDV-om, koji ne smije biti iskazan na računu*</li>
                    </ul>
                    <div style="margin-top: 5px; opacity: 0.8;">* Porezni obveznik nije u sustavu PDV-a, temeljem članka 90. Zakona o porezu na dodanu vrijednost</div>
                </div>

                <div style="margin-top: 50px; text-align: center; font-size: 10px; color: #666; border-top: 1px solid #ddd; padding-top: 20px;">
                    <b>2LMF PRO j.d.o.o.</b> • Orešje 7, 10090 Zagreb • Tel: +385 95 311 5007 • Email: 2lmf.info@gmail.com
                </div>
            `;

            // NATIVE PRINT STRATEGY (Most Robust)
            // 1. Create a new window
            const printWindow = window.open('', '_blank', 'width=1000,height=800');

            if (!printWindow) {
                alert("Molim vas omogućite skočne prozore (popups) za preuzimanje ponude.");
                return;
            }

            // 2. Build the full HTML document for the new window
            const htmlContent = `
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Informativna Ponuda - 2LMF PRO</title>
                    <link href="https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@600;700&family=Segoe+UI&display=swap" rel="stylesheet">
                    <style>
                        body { font-family: 'Segoe UI', sans-serif; padding: 40px; color: #000; background: #f9f9f9; }
                        .paper { background: white; padding: 40px; max-width: 210mm; margin: 0 auto; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
                        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                        th { background-color: #E67E22; color: #000; padding: 10px; text-align: left; }
                        td { padding: 10px; border-bottom: 1px solid #eee; }
                        .text-right { text-align: right; }
                        .text-center { text-align: center; }
                        h1 { font-family: 'Chakra Petch', sans-serif; color: #E67E22; margin: 0; }
                        
                        /* Action Bar for User */
                        .action-bar { text-align: center; margin-bottom: 30px; padding: 20px; background: #333; color: white; border-radius: 8px; }
                        .btn-print { background: #E67E22; border: none; padding: 12px 30px; color: black; font-weight: bold; font-size: 16px; cursor: pointer; border-radius: 4px; font-family: 'Chakra Petch', sans-serif; }
                        .btn-print:hover { background: #d35400; }

                        @media print {
                            body { background: white; padding: 0; }
                            .paper { box-shadow: none; padding: 0; margin: 0; max-width: none; }
                            .action-bar { display: none !important; } /* Hide button in PDF */
                            @page { margin: 10mm; }
                            body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                        }
                    </style>
                </head>
                <body>
                    
                    <div class="action-bar">
                        <p style="margin: 0 0 10px 0; font-size: 1.2rem; font-weight: bold;">Vaša ponuda je spremna!</p>
                        <button class="btn-print" onclick="window.print()">🖨️ SPREMI KAO PDF / ISPIŠI</button>
                        <p style="margin: 15px 0 0 0; font-size: 0.9rem; color: #ccc;">
                            ℹ️ U prozorčiću koji se otvori, pod <b>"Odredište" (Destination)</b><br>
                            odaberite <b>"Spremi kao PDF"</b> (Save as PDF).
                        </p>
                    </div>

                    <div class="paper">
                        <div style="text-align: center; border-bottom: 4px solid #2C2C54; padding-bottom: 20px; margin-bottom: 30px;">
                            <h1>2LMF PRO</h1>
                            <p style="margin: 5px 0 0 0; color: #333; font-weight: bold;">HIDRO & TERMO IZOLACIJA • FASADE • OGRADE</p>
                        </div>

                        <div style="margin-bottom: 30px;">
                            <h2 style="color: #E67E22; margin-bottom: 10px; border-bottom: 2px solid #ddd; padding-bottom: 5px;">INFORMATIVNA PONUDA</h2>
                            <p style="font-size: 14px; color: #555;">Hvala na vašem interesu. Ovdje je informativni izračun prema vašim parametrima.</p>
                        </div>

                        <table>
                            <thead>
                                <tr>
                                    <th>STAVKA</th>
                                    <th class="text-center">KOL.</th>
                                    <th class="text-right">CIJENA</th>
                                    <th class="text-right">UKUPNO</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${rowsHtml}
                            </tbody>
                        </table>

                        <div style="margin-top: 30px; text-align: right;">
                            <div style="display: inline-block; background: #E67E22; color: black; padding: 15px; border: 2px solid #2C2C54; border-radius: 4px;">
                                <span style="display: block; font-size: 12px; text-transform: uppercase;">SVEUKUPNI IZNOS</span>
                                <span style="font-size: 24px; font-weight: bold; font-family: 'Chakra Petch', sans-serif;">${total.toLocaleString('hr-HR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €</span>
                            </div>
                        </div>

                        <div style="margin-top: 40px; background: #fff3e0; padding: 15px; font-size: 12px; color: #444; border-left: 4px solid #E67E22;">
                            <b>Uvjeti kupnje:</b><br>
                            <ul style="margin-top:5px; padding-left: 20px;">
                                <li>Plaćanje: avans - uplatom na žiro račun</li>
                                <li>Minimalni iznos kupovine: 200,00 eur</li>
                                <li>Sve cijene su sa PDV-om, koji ne smije biti iskazan na računu*</li>
                            </ul>
                            <div style="margin-top: 5px; opacity: 0.8;">* Porezni obveznik nije u sustavu PDV-a, temeljem članka 90. Zakona o porezu na dodanu vrijednost</div>
                        </div>

                        <div style="margin-top: 50px; text-align: center; font-size: 11px; color: #000; background: #E67E22; padding: 20px; border-top: 4px solid #000;">
                            <b>2LMF PRO j.d.o.o.</b> • Orešje 7, 10090 Zagreb • Tel: +385 95 311 5007 • Email: 2lmf.info@gmail.com<br>
                            OIB: 29766043828 • IBAN: <b>HR312340009111121324</b>
                            <div style="margin-top:5px; opacity: 0.8;">© 2026 2LMF PRO</div>
                        </div>
                    </div>
                    
                </body>
                </html>
            `;

            printWindow.document.write(htmlContent);
            printWindow.document.close();
        });
    }
}, 1000);

// Helper function for Instant Data Capture
// Helper function for Instant Data Capture
function sendInstantData(items, userData) {
    // CORRECT URL (Same as Manual Button)
    const GAS_URL = GOOGLE_SCRIPT_URL;

    // Safety check - we need at least email
    if (!userData.userEmail) return;

    const itemsPayload = items.filter(i => i.price > 0 || i.price === 0).map(i => ({
        sku: i.sku || "",
        name: i.name,
        qty: i.value,
        unit: i.unit,
        price_sell: i.price || 0, price_buy_mpc: i.cost_price || 0,
    }));

    const payload = {
        email: userData.userEmail,
        name: userData.userName || "Kupac",
        phone: userData.userPhone,
        _subject: `Upit za ponudu - ${translateModule(currentModule)}`,
        items_json: JSON.stringify(itemsPayload),
        silent: 'true' // Trigger for backend to skip immediate customer email
    };

    console.log("Sending instant data...", payload);

    fetch(GAS_URL, {
        method: 'POST',
        body: new URLSearchParams(payload)
    }).then(() => console.log("Instant data sent successfully."))
        .catch(e => console.error("Instant send failed", e));
}





// --- GOOGLE SHEETS LIVE PRICING ---
// const GOOGLE_SCRIPT_URL is defined at the top of the file

async function initPriceFetch() {
    try {
        console.log("Fetching live prices...");
        const response = await fetch(`${GOOGLE_SCRIPT_URL}?action=get_prices`);
        if (!response.ok) throw new Error("Network response was not ok");

        const livePrices = await response.json();
        console.log("Live prices loaded:", Object.keys(livePrices).length);

        // Update global 'prices' object
        updatePricesRecursive(prices, livePrices);

        const btn = document.querySelector('#calc-form .calculate-btn');
        if (btn) btn.innerHTML = "Izračunaj (Cijene ažurirane)";

    } catch (error) {
        console.error("Failed to fetch live prices:", error);
    }
}

function updatePricesRecursive(targetObj, sourceFlat) {
    for (const key in targetObj) {
        if (typeof targetObj[key] === 'object' && targetObj[key] !== null) {
            if (targetObj[key].hasOwnProperty('sku') && targetObj[key].hasOwnProperty('price')) {
                const sku = targetObj[key].sku;
                let livePrice = sourceFlat[sku] || sourceFlat[sku.toUpperCase()] || sourceFlat[sku.toLowerCase()];
                if (livePrice !== undefined) {
                    targetObj[key].price = parseFloat(livePrice);
                }
            } else {
                updatePricesRecursive(targetObj[key], sourceFlat);
            }
        }
    }
}

// Start Price Fetch
document.addEventListener('DOMContentLoaded', () => {
    initPriceFetch();
});
