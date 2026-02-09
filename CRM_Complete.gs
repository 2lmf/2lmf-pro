// --- BUSINESS LOGIC: MATERIAL CONFIGURATION ---
// Ovdje podesite nabavne faktore (u odnosu na MPC) i dobavljače.
const MATERIAL_CONFIG = {
  "XPS": { buy_factor: 0.80, supplier: "RAVA" }, // Margin 25%
  "Kamena vuna": { buy_factor: 0.80, supplier: "RAVA" }, // Margin 25%
  "TPO": { buy_factor: 0.77, supplier: "RAVA" }, // Margin 30% -> 1/1.30 = 0.769
  "PVC": { buy_factor: 0.80, supplier: "RAVA" }, // Margin 25%
  "Diamond": { buy_factor: 0.74, supplier: "RAVA" }, // Margin 35% -> 1/1.35 = 0.74
  "Ruby": { buy_factor: 0.74, supplier: "RAVA" }, // Margin 35%
  "Vapor": { buy_factor: 0.74, supplier: "RAVA" }, // Margin 35%
  "2D panel": { buy_factor: 0.77, supplier: "Dobavljač Ograde" }, // Margin 30% -> 1/1.30 = 0.77
  "3D panel": { buy_factor: 0.77, supplier: "Dobavljač Ograde" },
  "Stup": { buy_factor: 0.77, supplier: "Dobavljač Ograde" },
  "Pješačka vrata": { buy_factor: 0.77, supplier: "Dobavljač Ograde" },
  "Spojnice": { buy_factor: 0.77, supplier: "Dobavljač Ograde" },
  "Sidreni vijci": { buy_factor: 0.77, supplier: "Dobavljač Ograde" },
  "Aquamat": { buy_factor: 0.77, supplier: "Isomat" }, // Margin 30%
  "Isoflex": { buy_factor: 0.77, supplier: "Isomat" },
  "AK-20": { buy_factor: 0.77, supplier: "Isomat" },
  "Montaža": { buy_factor: 0.00, supplier: "-" }, 
  "Usluga montaže": { buy_factor: 0.00, supplier: "-" }
};

// ==========================================
// 2LMF PRO - CALCULATOR BACKEND & CRM
// ==========================================

// --- CONFIGURATION ---
var SCRIPT_PROP = PropertiesService.getScriptProperties();

// --- 1. SETUP SYSTEM (Run this once!) ---
function setupCRM() {
  // CONFIG: Existing Sheet ID
  var EXISTING_ID = "1YmRZMeomWxAmfi6rsLN6qKrHrrAeHOnGVbnfsZXP3w4";
  
  // Link to existing sheet
  var ss = SpreadsheetApp.openById(EXISTING_ID);
  
  // Store ID in Script Properties so other functions can find it
  var SCRIPT_PROP = PropertiesService.getScriptProperties();
  SCRIPT_PROP.setProperty("SHEET_ID", EXISTING_ID);
  
  // Setup "Upiti" (Inquiry Log) if not exists
  var sheetLog = ss.getSheetByName("Upiti");
  if (!sheetLog) {
      sheetLog = ss.insertSheet("Upiti");
      sheetLog.appendRow(["Datum", "ID", "Ime", "Email", "Telefon", "Modul", "Iznos (€)", "Status", "JSON_Data"]);
      sheetLog.setFrozenRows(1);
      sheetLog.setColumnWidth(9, 50); 
  }
  
  // Setup "Generator" (Offer Maker) if not exists
  var sheetGen = ss.getSheetByName("Generator Ponuda");
  if (!sheetGen) {
      sheetGen = ss.insertSheet("Generator Ponuda");
      setupGeneratorLayout(sheetGen);
  } else {
      // Optional: Refresh layout
      setupGeneratorLayout(sheetGen);
  }
  
  console.log("✅ SUSTAV USPJEŠNO POVEZAN SA STAROM TABLICOM!");
  console.log("ID Tablice: " + EXISTING_ID);
  console.log("LINK NA TABLICU: " + ss.getUrl());
}

function setupGeneratorLayout(sheet) {
  sheet.clear();
  // Header Info
  sheet.getRange("A1").setValue("GENERATOR PONUDA").setFontWeight("bold").setFontSize(16);
  sheet.getRange("A3").setValue("Unesi ID Upita:");
  sheet.getRange("B3").setBackground("#FFF2CC").setBorder(true, true, true, true, null, null);
  
  sheet.getRange("D3").setValue("Status:");
  sheet.getRange("E3").setFormula('=VLOOKUP(B3; Upiti!B:H; 7; FALSE)'); // Auto-status check
  
  // Customer Info Block
  sheet.getRange("A5").setValue("Podaci o Kupcu (Učitano)");
  sheet.getRange("A6").setValue("Ime:");
  sheet.getRange("A7").setValue("Email:");
  sheet.getRange("A8").setValue("Tel:");
  
  // Item Table Header
  sheet.getRange("A10:F10").setValues([["RB", "Šifra", "Opis Stavke", "Količina", "Jed. Mj.", "Cijena (€)"]]);
  sheet.getRange("A10:F10").setBackground("#E67E22").setFontColor("black").setFontWeight("bold");
  
  // Instructions & Mobile Controls
  sheet.getRange("H3").setValue("UPRAVLJANJE (MOBITEL):").setFontWeight("bold");
  sheet.getRange("H4").setValue("👇 1. Klikni za Učitavanje");
  sheet.getRange("H5").insertCheckboxes();
  sheet.getRange("H6").setValue("(Status učitavanja)");

  sheet.getRange("H7").setValue("👇 2. Klikni za Slanje");
  sheet.getRange("H8").insertCheckboxes();
  sheet.getRange("H9").setValue("(Status slanja)");
}

// --- 2. WEB APP HANDLER ---
function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({ 
    'status': 'online', 
    'message': '2LMF Calculator API is running.' 
  })).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    var params = e.parameter;
    var name = params.name;
    var email = params.email;
    var phone = params.phone;
    var subject = params._subject;
    var itemsJson = params.items_json;
    var items = JSON.parse(itemsJson);
    
    // Generate Unique ID (Sequential)
    var inquiryId = getNextSequenceId();
    
    // 0. ENRICH ITEMS (Calculate costs/profits)
    items = enrichItemsWithCosts(items);
    
    // 1. Send Instant Notifications
    var customerHtml = generateHtml(items, name, true); // For customer
    var adminHtml = generateAdminHtml(items, name, email, phone, subject, customerHtml); // For Admin
    
    // Notify Customer (Instant Auto-Reply)
    // Only send if NOT silent (Manual "Send Email" button) or if type is silent explicitly
    if (params.type !== 'silent' && params.silent !== 'true') {
        MailApp.sendEmail({
            to: email,
            subject: subject,
            htmlBody: customerHtml,
            name: "2LMF PRO Kalkulator"
        });
    }
    
    // Queue Follow-up (24h)
    queueFollowUp(email, name);
    
    // Notify Admin
    MailApp.sendEmail({
      to: "2lmf.info@gmail.com", 
      subject: "🔔 NOVI UPIT: " + name + " (" + inquiryId + ")",
      htmlBody: adminHtml
    });

    // 2. Log to CRM Sheet
    try {
      var sheetId = SCRIPT_PROP.getProperty("SHEET_ID"); // Use stored ID
      if (sheetId) {
        var ss = SpreadsheetApp.openById(sheetId);
        var sheetLog = ss.getSheetByName("Upiti");
        if (!sheetLog) {
            ss.insertSheet("Upiti").appendRow(["Datum", "ID", "Ime", "Email", "Telefon", "Modul", "Iznos (€)", "Status", "JSON_Data"]);
            sheetLog = ss.getSheetByName("Upiti");
        }
        var total = items.reduce((sum, i) => sum + (i.qty * i.price_sell), 0);
        sheetLog.appendRow([new Date(), inquiryId, name, email, phone, subject, total, "NOVO", itemsJson]);
        
        // Ensure Generator sheet exists in opened sheet
        if(!ss.getSheetByName("Generator Ponuda")) { 
            setupGeneratorLayout(ss.insertSheet("Generator Ponuda")); 
        }
      } else {
        console.log("SHEET_ID not found in props!");
      }
    } catch (err) {
      console.log("CRM Log failed: " + err);
    }
    
    return ContentService.createTextOutput(JSON.stringify({result: 'success'})).setMimeType(ContentService.MimeType.JSON);
    
  } catch(error) {
    return ContentService.createTextOutput(JSON.stringify({result: 'error', error: error.toString()})).setMimeType(ContentService.MimeType.JSON);
  }
}

// --- 3. GOOGLE SHEETS MENU & MOBILE TRIGGERS ---

function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('2LMF CRM')
      .addItem('📥 Učitaj podatke (Desktop)', 'importInquiry')
      .addItem('✉️ Pošalji Ponudu (Desktop)', 'sendCustomOffer')
      .addSeparator()
      .addItem('🔢 Admin: Resetiraj Brojač', 'menuResetCounter')
      .addSeparator()
      .addItem('📱 Instaliraj za Mobitel', 'setupMobileTriggers')
      .addToUi();
}

function menuResetCounter() {
    var ui = SpreadsheetApp.getUi();
    var result = ui.prompt(
      'Reset Brojača',
      'Unesi broj od kojeg želiš da krene sljedeći upit (npr. 0 da krene od 1, ili 1000 da krene od 1001):',
      ui.ButtonSet.OK_CANCEL);

    if (result.getSelectedButton() == ui.Button.OK) {
        var num = parseInt(result.getResponseText());
        if (!isNaN(num)) {
             PropertiesService.getScriptProperties().setProperty('LAST_ID_SEQ', num.toString());
             ui.alert('Brojač postavljen na: ' + num + '. Sljedeći upit će biti: u' + pad(num+1, 5));
        } else {
             ui.alert('Greška: Nije unesen broj.');
        }
    }
}

function setupMobileTriggers() {
  // Delete existing triggers first
  var triggers = ScriptApp.getProjectTriggers();
  for (var i = 0; i < triggers.length; i++) {
    ScriptApp.deleteTrigger(triggers[i]);
  }
  
  // Create new Installable Trigger for Edit
  ScriptApp.newTrigger('handleMobileEdit')
      .forSpreadsheet(SpreadsheetApp.getActive())
      .onEdit()
      .create();
  
  // DRAW UI (CHECKBOXES) AUTOMATICALLY
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Generator Ponuda");
  sheet.getRange("H3").setValue("UPRAVLJANJE (MOBITEL):").setFontWeight("bold");
  sheet.getRange("H4").setValue("👇 1. Klikni za Učitavanje");
  sheet.getRange("H5").insertCheckboxes();
  sheet.getRange("H5").setValue(false); // Default unchecked
  sheet.getRange("H6").setValue("(Status učitavanja)");

  sheet.getRange("H7").setValue("👇 2. Klikni za Slanje");
  sheet.getRange("H8").insertCheckboxes();
  sheet.getRange("H8").setValue(false); // Default unchecked
  sheet.getRange("H9").setValue("(Status slanja)");
      
  Browser.msgBox("✅ SPREMNO ZA MOBITEL! Kvačice su postavljene u stupac H.");
}

function handleMobileEdit(e) {
  var range = e.range;
  var sheet = range.getSheet();
  
  // Only work on Generator sheet
  if (sheet.getName() !== "Generator Ponuda") return;
  
  var row = range.getRow();
  var col = range.getColumn();
  var val = range.getValue();
  
  // 1. LOAD DATA (H5)
  if (row === 5 && col === 8 && val === true) {
    sheet.getRange("H6").setValue("⏳ Učitavam...");
    importInquiry();
    range.setValue(false); // Uncheck
    sheet.getRange("H6").setValue("✅ Učitano!");
  }
  
  // 2. SEND OFFER (H8)
  if (row === 8 && col === 8 && val === true) {
    sheet.getRange("H9").setValue("⏳ Šaljem...");
    var success = sendCustomOffer(true); // true = mobile mode (no alerts)
    range.setValue(false); // Uncheck
    if (success) sheet.getRange("H9").setValue("✅ Poslano!");
    else sheet.getRange("H9").setValue("❌ Prekinuto");
  }
}

function importInquiry() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheetGen = ss.getSheetByName("Generator Ponuda");
  var sheetLog = ss.getSheetByName("Upiti");
  
  var idRaw = sheetGen.getRange("B3").getValue().toString().trim();
  if (!idRaw) { setStatus("Greška: Unesite ID!"); return; }
  
  // --- ROBUST ID NORMALIZATION ---
  // Goal: Convert inputs like "1", "u1", "U 1", "u00001" -> "u00001"
  // Legacy inputs like "UPIT-5377" -> start with "UPIT-", preserve them.
  
  var id = idRaw;
  var lower = idRaw.toLowerCase().replace(/\s/g, ''); // Remove spaces
  
  if (lower.startsWith("upit-")) {
      // It's a legacy ID, allow it (maybe user wants to load old one)
      id = "UPIT-" + lower.replace("upit-", ""); // Normalize casing if needed
  } else if (lower.startsWith("u")) {
      // Like "u1" or "u00001"
      var numPart = parseInt(lower.substring(1));
      if (!isNaN(numPart)) {
          id = "u" + pad(numPart, 5);
      }
  } else {
      // Just a number? "1", "55"
      var numPart = parseInt(lower);
      if (!isNaN(numPart)) {
          id = "u" + pad(numPart, 5);
      }
  }

  // Update cell with formatted ID so user sees what is being searched
  sheetGen.getRange("B3").setValue(id);
  
  // Find ID in Log
  var data = sheetLog.getDataRange().getValues();
  var rowData = null;
  
  for (var i = 1; i < data.length; i++) {
    // Exact match or Case-Insensitive match
    // data[i][1] (The ID Column)
    if (String(data[i][1]).toLowerCase() == id.toLowerCase()) {
      rowData = data[i];
      break;
    }
  }
  
  if (!rowData) { setStatus("Nije pronađeno (" + id + ")!"); return; }
  
  // Populate Customer Data
  sheetGen.getRange("B6").setValue(rowData[2]); // Name
  sheetGen.getRange("B7").setValue(rowData[3]); // Email
  sheetGen.getRange("B8").setValue(rowData[4]); // Phone
  
  // Parse JSON Items
  var items = JSON.parse(rowData[8]);
  
  // Clear old items
  sheetGen.getRange("A11:F50").clearContent();
  
  // Write new items
  var output = [];
  items.forEach((it, idx) => {
    var sku = it.sku || ""; 
    output.push([idx + 1, sku, it.name, it.qty, it.unit, it.price_sell]);
  });
  
  if (output.length > 0) {
    sheetGen.getRange(11, 1, output.length, 6).setValues(output);
  }
  
  setStatus("Podaci učitani za " + id);
}

function sendCustomOffer(isMobile) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheetGen = ss.getSheetByName("Generator Ponuda");
  var sheetLog = ss.getSheetByName("Upiti");
  
  // Skip alert on mobile
  if (!isMobile) {
    var ui = SpreadsheetApp.getUi();
    var response = ui.alert('Slanje Ponude', 'Sigurno?', ui.ButtonSet.YES_NO);
    if (response == ui.Button.NO) return false;
  }
  
  // Read Data
  var name = sheetGen.getRange("B6").getValue();
  var email = sheetGen.getRange("B7").getValue();
  
  if(!email) { setStatus("Greška: Nema emaila!"); return false; }
  
  var itemsData = sheetGen.getRange(11, 1, sheetGen.getLastRow() - 10, 6).getValues();
  
  var items = [];
  var totalAmount = 0;
  
  for (var i = 0; i < itemsData.length; i++) {
    var row = itemsData[i];
    if (!row[2]) continue; // Skip empty name
    
    items.push({
      sku: row[1],
      name: row[2],
      qty: parseFloat(row[3]),
      unit: row[4],
      price_sell: parseFloat(row[5]),
      line_total: parseFloat(row[3]) * parseFloat(row[5])
    });
  }
  
  // Generate PDF Content
  var htmlBody = generateHtml(items, name, false);
  
  // SEND EMAIL
  MailApp.sendEmail({
    to: email,
    subject: "Službena Ponuda - 2LMF PRO",
    htmlBody: htmlBody,
     name: "2LMF PRO"
  });
  
  // Update Status in Log
  var id = sheetGen.getRange("B3").getValue();
  var data = sheetLog.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (data[i][1] == id) {
      sheetLog.getRange(i + 1, 8).setValue("POSLANO");
      break;
    }
  }
  
  if (!isMobile) Browser.msgBox("Poslano na: " + email);
  return true;
}

function setStatus(msg) {
   // Helper to show errors without blocking mobile
   try { SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Generator Ponuda").getRange("H9").setValue(msg); } catch(e){}
   console.log(msg);
}

// --- HELPER: HTML GENERATOR (Shared) ---
function generateHtml(items, name, isAutoReply) {
    var rawTotal = 0;
    items.forEach(i => {
         if(i.line_total) rawTotal += i.line_total;
         else rawTotal += (i.qty * i.price_sell);
    });

  var primaryColor = "#E67E22"; var darkColor = "#000000"; var fontMain = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"; var fontHeader = "'Chakra Petch', 'Arial Black', sans-serif"; 

  // EPC QR V002 Format
  // BCD\n002\n1\nSCT\n\n[Name]\n[IBAN]\nEUR[Amount]\n\n\n[Desc]
  var qrData = "BCD\n002\n1\nSCT\n\n2LMF PRO j.d.o.o.\nHR312340009111121324\nEUR" + rawTotal.toFixed(2) + "\n\n\nUplata po ponudi";

  var title = isAutoReply ? "INFORMATIVNA PONUDA" : "PONUDA ZA PLAĆANJE";

  var html = "<!DOCTYPE html><html><head><style>@import url('https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@600;700&family=Barlow:wght@400;600&family=Stardos+Stencil:wght@400;700&display=swap');body { margin:0; padding:0; background-color: #F4F4F4; font-family: " + fontMain + "; }.container { max-width: 600px; margin: 0 auto; background: #ffffff; }.header { background: " + primaryColor + "; color: #000000; padding: 15px; text-align: center; border-bottom: 4px solid " + darkColor + "; }.logo-text { font-family: 'Chakra Petch', sans-serif; font-size: 32px; font-weight: bold; letter-spacing: 2px; text-transform: uppercase; margin:0; }.sub-header { color: #333333; font-size: 14px; margin-top: 5px; opacity: 0.9; font-weight: 600; }.content { padding: 30px 20px; }.title { color: " + primaryColor + "; font-family: " + fontHeader + "; font-size: 20px; margin-bottom: 10px; border-bottom: 2px solid #eee; padding-bottom: 10px; }.intro { font-size: 14px; color: #555; line-height: 1.6; margin-bottom: 20px; }.table-wrapper { width: 100%; border-collapse: collapse; margin-bottom: 25px; }.th { background: " + primaryColor + "; color: #000; padding: 10px; font-weight: bold; font-size: 12px; text-transform: uppercase; text-align: left; }.td { padding: 12px 10px; border-bottom: 1px solid #eee; font-size: 13px; color: #333; }.td-num { text-align: right; font-family: 'Courier New', monospace; font-weight: bold; }.total-block { background: " + primaryColor + "; color: #000; padding: 15px; text-align: right; border-radius: 4px; border: 2px solid " + darkColor + "; }.total-label { font-size: 12px; text-transform: uppercase; display:block; margin-bottom:5px; }.total-value { font-size: 22px; font-weight: bold; font-family: " + fontHeader + "; }.footer { background: " + primaryColor + "; color: " + darkColor + "; padding: 30px 20px; font-size: 12px; text-align: center; line-height: 1.8; border-top: 4px solid " + darkColor + "; }.footer strong { color: #000000; }.note { background: #fff3e0; padding: 15px; font-size: 13px; color: #444; border-left: 4px solid " + primaryColor + "; margin-top: 20px; line-height: 1.6; }</style></head><body><div class='container'><div class='header'><h1 class='logo-text'>2LMF PRO</h1><div class='sub-header'>HIDRO & TERMO IZOLACIJA • FASADE • OGRADE</div></div><div class='content'><h2 class='title'>" + title + "</h2><p class='intro'>Poštovani <b>" + name + "</b>,<br>Hvala na vašem upitu. Na temelju odabranih parametara, pripremili smo sljedeći izračun:</p><table class='table-wrapper'><thead><tr><th class='th' style='width:50%'>STAVKA</th><th class='th' style='text-align:center;'>KOL.</th><th class='th' style='text-align:right;'>CIJENA</th><th class='th' style='text-align:right;'>UKUPNO</th></tr></thead><tbody>";

    items.forEach(function(item) {
        var lineTotal = 0; if (item.line_total) lineTotal = item.line_total; else lineTotal = item.qty * item.price_sell;
        html += "<tr><td class='td'>" + item.name + "</td><td class='td' style='text-align:center;'>" + item.qty + " " + item.unit + "</td><td class='td td-num'>" + item.price_sell.toLocaleString('hr-HR', {minimumFractionDigits: 2, maximumFractionDigits: 2}) + " €</td><td class='td td-num'>" + lineTotal.toLocaleString('hr-HR', {minimumFractionDigits: 2, maximumFractionDigits: 2}) + " €</td>" + "</tr>";
    });

    html += "</tbody></table><div class='total-block'><span class='total-label'>SVEUKUPNI IZNOS</span><span class='total-value'>" + rawTotal.toLocaleString('hr-HR', {minimumFractionDigits: 2, maximumFractionDigits: 2}) + " €</span><div style='font-size:10px; margin-top:5px; opacity:0.8;'>(informativni izračun)</div></div><div class='note'><b>Uvjeti kupnje:</b><br><ul style='margin-top:5px; padding-left:20px; margin-bottom:10px;'><li>Plaćanje: avans - uplatom na žiro račun</li><li>Minimalni iznos kupovine: 200,00 eur</li><li>Sve cijene su sa PDV-om, koji ne smije biti iskazan na računu*</li></ul><div style='font-size:11px; opacity:0.8;'>* Porezni obveznik nije u sustavu PDV-a, temeljem članka 90. Zakona o porezu na dodanu vrijednost</div><br><b>Za sva dodatna pitanja stojimo na raspolaganju.</b></div><div style='margin-top:20px; text-align:center; padding:15px; background:#fff; border:1px solid #eee; border-radius:8px;'><img src='https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=" + encodeURIComponent(qrData) + "' alt='Skeniraj i plati' style='width:120px; height:120px;'><div style='margin-top:5px; font-size:11px; color:#555;'>Skeniraj i plati (KeksPay / mBanking)</div></div></div><div class='footer'><div><b>2LMF PRO j.d.o.o.</b></div><div>Orešje 7, 10090 Zagreb</div><div>Telefon: +385 95 311 5007 | Email: 2lmf.info@gmail.com</div><div style='margin-top:15px; border-top:1px solid rgba(0,0,0,0.2); padding-top:15px;'>OIB: 29766043828 | MBS: 081477933<br>IBAN: <b>HR312340009111121324</b></div><div style='margin-top:10px; opacity:0.7;'>© 2026 2LMF PRO</div></div></div></body></html>";
    return html;
}

// --- HELPER: ENRICH ITEMS WITH COSTS (Backend Logic) ---
// This version reads directly from "CJENIK" sheet for accurate costs.
function enrichItemsWithCosts(items) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("CJENIK");
  
  // 1. Build Price list (Array for search + Map for direct lookup)
  var sheetItems = [];
  var priceMap = {};
  
  if (sheet) {
      // COL A = SKU (Šifra)
      // COL B = Name (Naziv)
      // COL C = Nabavna BEZ PDV (Cost VPC) -> For Supplier
      // COL D = Nabavna SA PDV (Cost MPC) -> For Profit calc
      
      var lastRow = sheet.getLastRow();
      if (lastRow > 1) {
          var data = sheet.getRange(2, 1, lastRow - 1, 4).getValues(); // Get cols A,B,C,D
          
          for (var i = 0; i < data.length; i++) {
              var rowSku = String(data[i][0] || "").trim().toLowerCase();
              var rowName = String(data[i][1] || "");
              
              var rowCostVPC = parseFloat(data[i][2]); // Col C
              if (isNaN(rowCostVPC)) rowCostVPC = 0;

              var rowCostMPC = parseFloat(data[i][3]); // Col D
              if (isNaN(rowCostMPC)) rowCostMPC = 0;
              
              var priceObj = {
                  sku: rowSku,
                  name: rowName, 
                  cost_vpc: rowCostVPC,
                  cost_mpc: rowCostMPC,
                  supplier: "Skladište" 
              };
              
              sheetItems.push(priceObj);
              if (rowSku) priceMap[rowSku] = priceObj;
          }
      }
  }

  // 2. Map Items
  return items.map(function(item) {
    var itemSku = String(item.sku || "").trim().toLowerCase(); 
    var matchedData = null;
    
    // A. Try Exact SKU Match
    if (itemSku && priceMap[itemSku]) {
        matchedData = priceMap[itemSku];
    } else {
        // Fallback: Try match by name if exact SKU failed (optional, keeping minimal for now to align with "Standardization")
    }
    
    // Apply Data
    if (matchedData) {
        item.price_buy_vpc = matchedData.cost_vpc;
        item.price_buy_mpc = matchedData.cost_mpc; 
        item.supplier = matchedData.supplier;
        
        // Ensure SKU is consistent
        if (!item.sku && matchedData.sku) item.sku = matchedData.sku.toUpperCase(); 
    } else {
        item.price_buy_vpc = 0;
        item.price_buy_mpc = 0;
        item.supplier = "Nepoznato";
    }

    // Profit = Sell Price (MPC) - Buy Price (MPC)
    // Assuming Frontend price_sell is MPC. 
    item.profit = item.price_sell - item.price_buy_mpc;
    return item;
  });
}

function generateAdminHtml(items, name, email, phone, subject, customerHtml) {
  var totalProfit = 0;
  items.forEach(function(it){ totalProfit += it.qty * it.profit; });

  var html = "<style>" +
             "@import url('https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@600;700&family=Barlow:wght@400;600&display=swap');" +
             "h2 { font-family: 'Chakra Petch', sans-serif; }" +
             "</style>" +
             "<div style='font-family: Arial, sans-serif; color: #333;'>" +
             "<h2 style='color: #000000;'>📊 Novi upit (Interni pregled)</h2>" +
             "<p><b>Kupac:</b> " + name + " (" + email + ") | <b>Tel:</b> " + phone + "</p>" +
             
             "<hr style='border: 0; border-top: 2px solid #eee; margin: 20px 0;'>" +
             "<h3>👀 Prikaz za Kupca</h3>" + 
             (customerHtml || "<i>Nema prikaza (greška?)</i>") + 
             "<hr style='border: 0; border-top: 2px solid #eee; margin: 20px 0;'>" +

             "<h3>💰 Analiza Zarade (Sve cijene su s PDV-om)</h3>" +
             "<table style='width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 30px;'>" +
             "<tr style='background-color: #E67E22; color: #000000;'><th style='padding:8px;text-align:left;'>Artikl</th><th style='padding:8px;'>KOL.</th><th style='padding:8px;text-align:right;'>MPC / kom</th><th style='padding:8px;text-align:right;'>MPC Ukupno</th><th style='padding:8px;text-align:right;background:#2ecc71;color:black;'>Nabavna / kom</th><th style='padding:8px;text-align:right;background:#2ecc71;color:black;'>Nabavna Ukupno</th><th style='padding:8px;text-align:right;background:#d35400;color:white;'>ZARADA</th></tr>";

  items.forEach(function(it) {
    var u = it.unit || "";
    html += "<tr>" +
            "<td style='padding:8px;border:1px solid #ddd;'>" + it.name + "</td>" +
            "<td style='padding:8px;border:1px solid #ddd;text-align:center;'>" + it.qty + " " + u + "</td>" +
            "<td style='padding:8px;border:1px solid #ddd;text-align:right;'>" + it.price_sell.toLocaleString('hr-HR',{minimumFractionDigits:2, maximumFractionDigits:2}) + " €</td>" +
            "<td style='padding:8px;border:1px solid #ddd;text-align:right;'>" + (it.qty * it.price_sell).toLocaleString('hr-HR',{minimumFractionDigits:2, maximumFractionDigits:2}) + " €</td>" +
            "<td style='padding:8px;border:1px solid #ddd;text-align:right;'>" + it.price_buy_mpc.toLocaleString('hr-HR',{minimumFractionDigits:2, maximumFractionDigits:2}) + " €</td>" +
            "<td style='padding:8px;border:1px solid #ddd;text-align:right;'>" + (it.qty * it.price_buy_mpc).toLocaleString('hr-HR',{minimumFractionDigits:2, maximumFractionDigits:2}) + " €</td>" +
            "<td style='padding:8px;border:1px solid #ddd;text-align:right;font-weight:bold;'>" + (it.qty * it.profit).toLocaleString('hr-HR',{minimumFractionDigits:2, maximumFractionDigits:2}) + " €</td>" +
            "</tr>";
  });

  html += "<tr style='font-weight:bold;background:#eee;'><td colspan='6' style='padding:8px;text-align:right;'>UKUPNO ZARADA:</td><td style='padding:8px;text-align:right;color:#d35400;font-size:16px;'>" + totalProfit.toLocaleString('hr-HR',{minimumFractionDigits:2, maximumFractionDigits:2}) + " €</td></tr></table>" +

             "<h3>📦 Lista za Dobavljača (Nabavne cijene BEZ PDV-a)</h3>" +
             "<table style='width: 100%; border-collapse: collapse; font-size: 13px;'>" +
             "<tr style='background-color: #000000; color: #E67E22;'><th style='padding:8px;text-align:left;'>Artikl</th><th style='padding:8px;'>Količina</th><th style='padding:8px;text-align:right;'>Nabavna VPC / kom (bez PDV)</th><th style='padding:8px;text-align:center;'>Provjera</th></tr>";

  items.forEach(function(it) {
    var u = it.unit || "";
    var vpcFmt = it.price_buy_vpc > 0 ? it.price_buy_vpc.toLocaleString('hr-HR',{minimumFractionDigits:2, maximumFractionDigits:2}) + " €" : "-";
    html += "<tr><td style='padding:8px;border:1px solid #ddd;'>" + it.name + "</td><td style='padding:8px;border:1px solid #ddd;text-align:center;'>" + it.qty + " " + u + "</td><td style='padding:8px;border:1px solid #ddd;text-align:right;'>" + vpcFmt + "</td><td style='padding:8px;border:1px solid #ddd;text-align:center;'>[ ]</td></tr>";
  });

  html += "</table></div>";
  return html;
}

function calculateTotal(items, field) {
  var t = 0; items.forEach(function(it){ t += it.qty * it[field]; }); return t;
}

// --- FOLLOW UP & TRIGGER LOGIC (KEEP AS IS) ---
function processFollowUpQueue() {
  var props = PropertiesService.getScriptProperties();
  var queueJSON = props.getProperty("FOLLOW_UP_QUEUE");
  var queue = queueJSON ? JSON.parse(queueJSON) : [];
  var now = new Date().getTime();
  var newQueue = [];
  for (var i = 0; i < queue.length; i++) {
    var item = queue[i];
    if (now - item.timestamp > 86400000) { sendFeedbackEmail(item.email, item.name); } 
    else { newQueue.push(item); }
  }
  props.setProperty("FOLLOW_UP_QUEUE", JSON.stringify(newQueue));
  ensureTrigger();
}

function queueFollowUp(email, name) {
  var props = PropertiesService.getScriptProperties();
  var queueJSON = props.getProperty("FOLLOW_UP_QUEUE");
  var queue = queueJSON ? JSON.parse(queueJSON) : [];
  queue.push({ email: email, name: name, timestamp: new Date().getTime() });
  props.setProperty("FOLLOW_UP_QUEUE", JSON.stringify(queue));
  ensureTrigger();
}

function sendFeedbackEmail(email, name) {
  // NEW TEXT FROM USER
  var body = "Poštovani,\n\n" +
             "nedavno ste napravili informativni izračun za ogradu na našem kalkulatoru.\n\n" +
             "Vjerujem da ste primili ponudu " + (name ? ("(" + name + ") ") : "") + "na mail, pa me zanima odgovara li vam okvirna cijena?\n\n" +
             "⚠️ Budući da se stanje lagera i dostupnost robe brzo mijenja, ovaj izračun (i trenutne cijene) možemo garantirati narednih 24 sata.\n\n" +
             "✔️ Ako imate bilo kakvih pitanja u vezi materijala, montaže ili želite da Vam napravimo službenu ponudu s podacima za uplatu, samo odgovorite na ovaj mail s: 'MOŽE PONUDA'.\n\n" +
             "Lijep pozdrav,\n" +
             "2LMF Tim";

  MailApp.sendEmail({
    to: email, 
    subject: "Jeste li uspjeli pogledati ponudu? ⏳ - 2LMF PRO",
    body: body
  });
}

function ensureTrigger() {
  if (ScriptApp.getProjectTriggers().length === 0) {
    ScriptApp.newTrigger('processFollowUpQueue').timeBased().everyHours(1).create();
  }
}

// --- LEGACY TRIGGER SUPPORT ---
// Fixes "Script function not found: autoReplyFollowUp" error
function autoReplyFollowUp() {
  processFollowUpQueue();
}

// --- HELPER: SEQUENTIAL ID GENERATOR ---
function getNextSequenceId() {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000); // Wait for other processes
  } catch (e) {
    console.log('Could not get lock');
    // Fallback if lock fails
    return "u" + Math.floor(Math.random() * 100000);
  }
  
  var userProp = PropertiesService.getScriptProperties();
  var lastId = Number(userProp.getProperty('LAST_ID_SEQ')) || 0;
  var nextId = lastId + 1;
  
  userProp.setProperty('LAST_ID_SEQ', nextId.toString());
  lock.releaseLock();
  
  // Format: u00001
  return "u" + pad(nextId, 5);
}

function pad(num, size) {
    var s = "000000000" + num;
    return s.substr(s.length - size);
}
