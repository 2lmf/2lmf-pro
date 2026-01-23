
// DOM Elements
const navBtns = document.querySelectorAll('.nav-btn');
const contentArea = document.getElementById('calculator-content');
const resultsSection = document.getElementById('results-section');
const resultsContainer = document.getElementById('results-container');

// State
let currentModule = 'hydro';

// Module HTML Layouts (later we can move these to separate files if needed)
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
                    <option value="etics">ETICS (kontaktna - kamena vuna)</option>
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
                    <label>Vrsta izolacije</label>
                    <input type="text" value="Kamena vuna" readonly>
                    <input type="hidden" id="insulation-type" name="material" value="wool">
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
                        <option value="alu">Aluminijski kompozit</option>
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
                    <label for="user-email">Email</label>
                    <input type="email" id="user-email" name="userEmail" placeholder="Vaš email">
                </div>
                <div class="form-group">
                    <label for="user-phone">Kontakt broj</label>
                    <input type="tel" id="user-phone" name="userPhone" placeholder="Br. telefona">
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
                    <option value="xps">XPS (podovi, temelji)</option>
                    <option value="roof">Kosi krov (kamena vuna)</option>
                </select>
            </div>
            <div class="form-group">
                <label for="area">Površina (m²)</label>
                <input type="text" inputmode="decimal" id="area" name="area" placeholder="npr. 50,5" required>
            </div>
            <div class="form-group">
                <label for="thickness">Debljina (cm) (min. 2cm)</label>
                <input type="number" id="thickness" name="thickness" value="2" min="2">
            </div>
            </div>

            <!-- Contact Form -->
            <div class="user-details-grid">
                <div class="form-group">
                    <label for="user-name">Ime</label>
                    <input type="text" id="user-name" name="userName" placeholder="Vaše ime">
                </div>
                <div class="form-group">
                    <label for="user-email">Email</label>
                    <input type="email" id="user-email" name="userEmail" placeholder="Vaš email">
                </div>
                <div class="form-group">
                    <label for="user-phone">Kontakt broj</label>
                    <input type="tel" id="user-phone" name="userPhone" placeholder="Br. telefona">
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
        <form id="calc-form" onsubmit="handleCalculation(event)">
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
                    <label for="user-email">Email</label>
                    <input type="email" id="user-email" name="userEmail" placeholder="Vaš email">
                </div>
                <div class="form-group">
                    <label for="user-phone">Kontakt broj</label>
                    <input type="tel" id="user-phone" name="userPhone" placeholder="Br. telefona">
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

            <!-- Installation Option -->
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
                    <label for="user-email">Email</label>
                    <input type="email" id="user-email" name="userEmail" placeholder="Vaš email">
                </div>
                <div class="form-group">
                    <label for="user-phone">Kontakt broj</label>
                    <input type="tel" id="user-phone" name="userPhone" placeholder="Br. telefona">
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
function handleCalculation(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    console.log("Calculating for module:", currentModule, data);

    let results = [];

    // --- LOGIC ROUTER ---
    if (currentModule === 'facade') {
        results = calculateFacade(data);
    } else if (currentModule === 'thermal') {
        results = calculateThermal(data);
    } else if (currentModule === 'hydro') {
        results = calculateHydro(data);
    } else if (currentModule === 'fence') {
        results = calculateFence(data);
    }

    displayResults(results);
}

// --- CALCULATION ENGINES ---

function calculateFacade(data) {
    const area = parseFloat(data.area.replace(',', '.'));
    const waste = 1.05; // 5% waste
    let items = [];

    if (data.type === 'etics') {
        // ETICS Logic
        // Mat is always 'wool' now, but let's be clean
        let matName = 'Kamena vuna';
        if (data.material === 'eps') matName = 'EPS (Stiropor)'; // Fallback if ever needed

        const thickness = parseInt(data.thickness);
        // Assuming the user's stone wool prices apply to ETICS
        const matPrice = getWoolPrice(thickness);

        items.push({ name: `${matName} (${data.thickness}cm)`, value: (area * waste).toFixed(2), unit: 'm²', price: matPrice });
        items.push({ name: 'Ljepilo za ljepljenje (cca 5kg/m²)', value: (area * 5).toFixed(1), unit: 'kg', price: 0 });
        items.push({ name: 'Ljepilo za armiranje (cca 4kg/m²)', value: (area * 4).toFixed(1), unit: 'kg', price: 0 });
        items.push({ name: 'Fasadna mrežica (1.1m/m²)', value: (area * 1.1).toFixed(2), unit: 'm²', price: 0 });
        items.push({ name: 'Tiple (6 kom/m²)', value: Math.ceil(area * 6), unit: 'kom', price: 0 });
        items.push({ name: 'Primer (0.2L/m²)', value: (area * 0.2).toFixed(1), unit: 'L', price: 0 });
        items.push({ name: 'Završna žbuka (2.5kg/m²)', value: (area * 2.5).toFixed(1), unit: 'kg', price: 0 });

    } else {
        // Ventilated Logic
        items.push({ name: 'Kamena vuna s voalom', value: (area * waste).toFixed(2), unit: 'm²' });
        items.push({ name: `Fasadna obloga (${data.cladding === 'alu' ? 'Alu-kompozit' : data.cladding.toUpperCase()})`, value: (area * waste).toFixed(2), unit: 'm²' });

        // Generic substructure estimation
        items.push({ name: 'Alu nosači (fiksni + klizni ~2.5/m²)', value: Math.ceil(area * 2.5), unit: 'kom' });
        items.push({ name: 'Vertikalni profili (L/T ~2.2m/m²)', value: (area * 2.2).toFixed(1), unit: 'm' });
        items.push({ name: 'Vijci/Zakovice (cca 15/m²)', value: Math.ceil(area * 15), unit: 'kom' });
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

        items.push({ name: `XPS ploče (${data.thickness}cm)`, value: (area * waste).toFixed(2), unit: 'm²', price: xpsPrice });
        items.push({ name: 'Ljepilo/Pjena (opcionalno)', value: Math.ceil(area / 10), unit: 'pak', price: 0 });
        // Čepasta folija za zaštitu temelja
        items.push({ name: 'Čepasta folija (zaštita)', value: (area * 1.1).toFixed(2), unit: 'm²', price: prices.membranes.cepasta });
    } else {
        const thickness = parseInt(data.thickness);
        const woolPrice = getWoolPrice(thickness);

        // Changed from 'Mineralna vuna' to 'Kamena vuna' per request to exclude glass wool
        items.push({ name: `Kamena vuna (${data.thickness}cm)`, value: (area * waste).toFixed(2), unit: 'm²', price: woolPrice });
        items.push({ name: 'Parna brana (Vapor Al-35)', value: (area * 1.1).toFixed(2), unit: 'm²', price: prices.bitumen.vapor_al });
    }
    return items;
}

function calculateHydro(data) {
    const area = parseFloat(data.area.replace(',', '.'));
    let items = [];

    // --- BITUMEN TEMELJI ---
    if (data.type === 'bitumen-foundation') {
        const thickness = parseInt(data.hydroThickness) || 5; // Default 5cm
        const xpsPrice = getXPSPrice(thickness);

        // 1. Bitumen (Premaz + Traka)
        items.push({ name: 'Bitumenski premaz', value: (area * 0.3).toFixed(1), unit: 'L', price: 0 });
        items.push({ name: 'Bitumenska traka (Ruby V-4)', value: (area * 1.15).toFixed(2), unit: 'm²', price: prices.bitumen.ruby_v4 });

        // 2. XPS
        items.push({ name: `XPS ploče (${thickness}cm)`, value: (area * 1.05).toFixed(2), unit: 'm²', price: xpsPrice });

        // 3. Čepasta folija
        items.push({ name: 'Čepasta folija (zaštita)', value: (area * 1.1).toFixed(2), unit: 'm²', price: prices.membranes.cepasta });

    }
    // --- BITUMEN RAVNI KROV ---
    else if (data.type === 'bitumen-roof') {
        // Bitumen x 2 layers usually + coating
        items.push({ name: 'Bitumenski premaz', value: (area * 0.3).toFixed(1), unit: 'L', price: 0 });
        items.push({ name: 'Bitumenska traka (sloj 1 - V3/V4)', value: (area * 1.15).toFixed(2), unit: 'm²', price: prices.bitumen.ruby_v4 });
        items.push({ name: 'Bitumenska traka (sloj 2 - završna)', value: (area * 1.15).toFixed(2), unit: 'm²', price: prices.bitumen.ruby_v4 * 1.2 }); // Approx slightly more
    }
    // --- TPO/PVC RAVNI KROV ---
    else if (data.type === 'membrane-roof') {
        const mat = data.membraneMaterial || 'tpo';
        const thickness = parseInt(data.hydroThickness) || 5;
        const xpsPrice = getXPSPrice(thickness);

        // 1. Geotekstil (ispod)
        items.push({ name: 'Geotekstil (razdjelni sloj)', value: (area * 1.1).toFixed(2), unit: 'm²', price: prices.membranes.geotextile });

        // 2. XPS (Thermal)
        items.push({ name: `XPS ploče (${thickness}cm) (termika)`, value: (area * 1.05).toFixed(2), unit: 'm²', price: xpsPrice });

        // 3. Geotekstil (iznad XPS-a, ispod folije)
        items.push({ name: 'Geotekstil (zaštitni sloj)', value: (area * 1.1).toFixed(2), unit: 'm²', price: prices.membranes.geotextile });

        // 4. Membrana (TPO or PVC)
        if (mat === 'tpo') {
            const tpoThick = data.tpoThickness || '1.5';
            const tpoKey = 'tpo_' + tpoThick.replace('.', '');
            const tpoPrice = prices.membranes[tpoKey] || 0;
            items.push({ name: `TPO Folija (${tpoThick}mm)`, value: (area * 1.08).toFixed(2), unit: 'm²', price: tpoPrice });
        } else {
            items.push({ name: 'PVC Folija (1.5mm)', value: (area * 1.08).toFixed(2), unit: 'm²', price: prices.membranes.pvc_krov });
        }

    }
    // --- PVC TEMELJI ---
    else if (data.type === 'pvc-foundation') {
        const thickness = parseInt(data.hydroThickness) || 5;
        const xpsPrice = getXPSPrice(thickness);

        items.push({ name: 'Geotekstil (zaštitni)', value: (area * 1.1).toFixed(2), unit: 'm²', price: prices.membranes.geotextile });
        items.push({ name: 'PVC Folija (za temelje)', value: (area * 1.1).toFixed(2), unit: 'm²', price: prices.membranes.pvc_temelji });
        items.push({ name: `XPS ploče (${thickness}cm)`, value: (area * 1.05).toFixed(2), unit: 'm²', price: xpsPrice });
        items.push({ name: 'Čepasta folija', value: (area * 1.1).toFixed(2), unit: 'm²', price: prices.membranes.cepasta });
    }
    // --- POLIMERCEMENT ---
    else if (data.type === 'polymer') {
        items.push({ name: 'Polimercement (A+B) (cca 3kg/m²)', value: (area * 3).toFixed(1), unit: 'kg', price: prices.polymer.cement });
        items.push({ name: 'Brtvena traka (po m² cca 1m)', value: (area).toFixed(1), unit: 'm', price: prices.polymer.tape });

        if (data.polymerFinish === 'ceramics') {
            items.push({ name: 'Ljepilo za pločice (flex)', value: (area * 4).toFixed(1), unit: 'kg', price: 0 });
        }
    }
    // --- PU ---
    else if (data.type === 'isoflex-pu500') {
        items.push({ name: 'PU Primer (cca 0.2kg/m²)', value: (area * 0.2).toFixed(1), unit: 'kg', price: 0 });
        items.push({ name: 'PU Premaz (sivi/bijeli) (1.5kg/m²)', value: (area * 1.5).toFixed(1), unit: 'kg', price: prices.polymer.pu });
        items.push({ name: 'PU završni lak (UV zaštita)', value: (area * 0.15).toFixed(1), unit: 'kg', price: 0 });
    }


    return items;
}

function calculateFence(data) {
    const length = parseFloat(data.length.replace(',', '.'));
    const panelType = data.panelType; // '2d' or '3d'
    const height = parseInt(data.height); // cm
    const postType = data.postType; // 'plate' or 'concrete'
    const corners = parseInt(data.fenceCorners) || 0;
    const color = data.fenceColor; // '7016' or '6005'
    const installation = data.fenceInstallation === 'yes';

    let items = [];

    // 1. Panels
    const panelWidth = 2.5; // m
    const numPanels = Math.ceil(length / panelWidth);

    let panelName = '';
    if (panelType === '2d') {
        panelName = `2D Panel ${height}cm (6/5/6) - ${color === '7016' ? 'Antracit' : 'Zeleni'}`;
    } else {
        const thickness = data.panelThickness || '4';
        panelName = `3D Panel ${height}cm (${thickness}mm) - ${color === '7016' ? 'Antracit' : 'Zeleni'}`;
    }

    // Price lookup (Mockup - would depend on type/height)
    // Here we just define standard prices for example
    let panelPrice = 0;
    // Simple lookup based on height for demo
    if (height === 103) panelPrice = 25;
    if (height === 123) panelPrice = 29;
    if (height === 153) panelPrice = 35;
    if (height === 173) panelPrice = 40;
    if (height === 203) panelPrice = 48;

    items.push({
        name: panelName,
        value: numPanels,
        unit: 'kom',
        price: panelPrice
    });

    // 2. Posts
    // Number of posts = Number of Panels + 1
    const numPosts = numPanels + 1;
    const postHeight = postType === 'concrete' ? height + 50 : height; // If concrete, needs to be longer

    items.push({
        name: `Stup 60x60mm (v${postHeight}cm) ${postType === 'plate' ? 's pločicom' : 'za beton.'}`,
        value: numPosts,
        unit: 'kom',
        price: 15 // Placeholder
    });

    // 3. Mounting Sets (Spojnice)
    // Usually 2 or 3 per post based on height
    let clampsPerPost = 2;
    if (height > 123) clampsPerPost = 3;
    if (height > 173) clampsPerPost = 4;

    const totalClamps = numPosts * clampsPerPost;
    items.push({
        name: 'Spojnice (kompleti)',
        value: totalClamps,
        unit: 'kom',
        price: 1.5
    });

    // 4. Anchors (if plate)
    if (postType === 'plate') {
        items.push({
            name: 'Sidreni vijci (4 po stupu)',
            value: numPosts * 4,
            unit: 'kom',
            price: 0.5
        });
    }

    // 5. Corners (Additional posts/material logic could go here)
    if (corners > 0) {
        // Maybe added cost for corner clamps or specific solution
        items.push({
            name: 'Kutni setovi (dodatno)',
            value: corners,
            unit: 'kom',
            price: 5
        });
    }

    // 6. Installation
    if (installation) {
        let installPrice = 16; // Base price per m
        // simple logic: higher fence = more expensive?
        if (height > 153) installPrice = 18;
        if (postType === 'concrete') installPrice += 5; // Concrete work is harder

        let installName = 'Montaža ograde (ključ u ruke)';
        if (postType === 'concrete') {
            installName += '<br><small class="text-muted d-block" style="font-weight: normal; font-size: 0.85em;">(iskop i beton uključen u cijenu montaže)</small>';
        }

        items.push({
            name: installName,
            value: length.toFixed(2),
            unit: 'm',
            price: installPrice
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

    // Add Persistent Footer Note (Web & PDF)
    const footerNote = document.createElement('div');
    footerNote.className = 'calc-footer-note';
    footerNote.innerHTML = `
        <p>© 2026 2LMF PRO Kalkulator</p>
        <p class="small-note">Svi izračuni su informativnog karaktera</p>
    `;
    resultsContainer.appendChild(footerNote);

    resultsSection.scrollIntoView({ behavior: 'smooth' });
}

// Export Logic
const pdfBtn = document.getElementById('pdf-btn');
const emailBtn = document.getElementById('email-btn');

if (pdfBtn) {
    pdfBtn.addEventListener('click', () => {
        const element = document.getElementById('results-section');
        const opt = {
            margin: [10, 10], // Top/Bottom margin
            filename: `izracun_${currentModule}_${new Date().toISOString().split('T')[0]}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: {
                scale: 2,
                useCORS: true,
                scrollY: 0,
                backgroundColor: '#ffffff' // Force white background
            },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        // Temporarily hide buttons for clean PDF
        const btns = document.querySelector('.results-actions-container');
        if (btns) btns.style.display = 'none';

        // Ensure background is opaque white during render
        const originalBg = element.style.backgroundColor;
        element.style.backgroundColor = '#ffffff';

        // Clone Header for PDF
        const headerEl = document.querySelector('.main-header');
        let headerClone = null;
        if (headerEl) {
            headerClone = headerEl.cloneNode(true);
            // Adjust styles for PDF context
            headerClone.style.marginBottom = '2rem';
            headerClone.style.marginTop = '-1rem'; // Offset padding
            headerClone.style.width = 'calc(100% + 5rem)'; // Counteract parent padding (2.5rem * 2)
            headerClone.style.marginLeft = '-2.5rem';
            headerClone.style.boxShadow = 'none';

            element.insertBefore(headerClone, element.firstChild);
            element.insertBefore(headerClone, element.firstChild);
        }

        // Create Orange Footer Bar for PDF
        const pdfFooter = document.createElement('div');
        pdfFooter.style.backgroundColor = '#E67E22';
        pdfFooter.style.color = '#000';
        pdfFooter.style.padding = '1.5rem';
        pdfFooter.style.marginTop = '2rem';
        pdfFooter.style.marginBottom = '-2.5rem'; // Extend to bottom
        pdfFooter.style.marginLeft = '-2.5rem';
        pdfFooter.style.width = 'calc(100% + 5rem)';
        pdfFooter.style.textAlign = 'center';
        pdfFooter.style.fontFamily = 'sans-serif';
        pdfFooter.style.fontSize = '0.9rem';
        pdfFooter.style.fontWeight = '700';
        pdfFooter.innerHTML = `
            Email: 2lmf.info@gmail.com &nbsp;|&nbsp; Mob: +385 95 311 5007 &nbsp;|&nbsp; OIB: 29766043828 &nbsp;|&nbsp; IBAN: HR312340009111121324
        `;
        element.appendChild(pdfFooter);

        html2pdf().set(opt).from(element).save().then(() => {
            if (btns) btns.style.display = 'block'; // Restore buttons
            element.style.backgroundColor = originalBg; // Restore background

            // Remove cloned elements
            if (headerClone) headerClone.remove();
            if (pdfFooter) pdfFooter.remove();
        });
    });
}

const emailBtnSend = document.getElementById('email-btn-send');

if (emailBtnSend) {
    emailBtnSend.addEventListener('click', () => {
        const emailInput = document.getElementById('user-email');
        const emailTo = emailInput.value.trim();

        if (!emailTo) {
            alert("Molim vas upišite email adresu.");
            return;
        }

        const items = document.querySelectorAll('.result-item:not(.result-header-row)');

        // Prepare FormData
        const formData = new FormData();
        formData.append('email', emailTo);
        formData.append('A_Naslov', `Izračun materijala: ${currentModule.toUpperCase()}`);

        let index = 1;

        items.forEach(item => {
            const name = item.querySelector('.col-name').innerText;
            const qty = item.querySelector('.col-qty').innerText;
            const price = item.querySelector('.col-price').innerText;
            const total = item.querySelector('.col-total').innerText;

            // Simple formatting: Name as Key, Details as Value
            // Adding number prefix to force order
            const key = `${index < 10 ? '0' + index : index}. ${name}`;
            const value = `${qty} | ${price} | ${total}`;
            formData.append(key, value);
            index++;
        });

        // Add Grand Total logic
        const grandTotal = document.querySelector('.grand-total .col-total');
        if (grandTotal) {
            formData.append('99_SVEUKUPNO', grandTotal.innerText);
        }

        // Add Contact Info footer equivalent
        formData.append('Z_Napomena', 'Ovo je informativni izračun sa 2LMF PRO kalkulatora.');

        // Send via AJAX to Formspree
        const originalText = emailBtnSend.innerHTML;
        emailBtnSend.innerHTML = '⏳ Šaljem...';
        emailBtnSend.disabled = true;

        fetch("https://formspree.io/f/mwvlndlq", {
            method: "POST",
            headers: {
                "Accept": "application/json"
            },
            body: formData
        })
            .then(response => {
                if (response.ok) {
                    alert("Izračun je uspješno poslan na vaš email!");
                    emailInput.value = '';
                } else {
                    return response.json().then(data => {
                        if (Object.hasOwn(data, 'errors')) {
                            alert(data["errors"].map(error => error["message"]).join(", "))
                        } else {
                            alert("Došlo je do greške. Molimo pokušajte ponovno.");
                        }
                    })
                }
            })
            .catch(error => {
                console.error("Error:", error);
                alert("Došlo je do greške prilikom slanja.");
            })
            .finally(() => {
                emailBtnSend.innerHTML = originalText;
                emailBtnSend.disabled = false;
            });
    });
}

// Load default
loadModule('hydro');
