// --- BUSINESS LOGIC: MATERIAL CONFIGURATION ---
// Ovdje podesite nabavne faktore (u odnosu na MPC) i dobavljače.
const MATERIAL_CONFIG = {
  "XPS": { buy_factor: 0.85, supplier: "RAVA" },
  "Kamena vuna": { buy_factor: 0.82, supplier: "RAVA" },
  "TPO": { buy_factor: 0.75, supplier: "RAVA" },
  "PVC": { buy_factor: 0.75, supplier: "RAVA" },
  "Diamond": { buy_factor: 0.80, supplier: "RAVA" },
  "Ruby": { buy_factor: 0.80, supplier: "RAVA" },
  "Vapor": { buy_factor: 0.80, supplier: "RAVA" },
  "2D panel": { buy_factor: 0.70, supplier: "Dobavljač Ograde" },
  "3D panel": { buy_factor: 0.70, supplier: "Dobavljač Ograde" },
  "Stup": { buy_factor: 0.70, supplier: "Dobavljač Ograde" },
  "Pješačka vrata": { buy_factor: 0.70, supplier: "Dobavljač Ograde" },
  "Spojnice": { buy_factor: 0.70, supplier: "Dobavljač Ograde" },
  "Sidreni vijci": { buy_factor: 0.70, supplier: "Dobavljač Ograde" },
  "Aquamat": { buy_factor: 0.80, supplier: "Isomat" },
  "Isoflex": { buy_factor: 0.80, supplier: "Isomat" },
  "AK-20": { buy_factor: 0.80, supplier: "Isomat" },
  "Montaža": { buy_factor: 0.00, supplier: "-" }, // Nabavna cijena montaže je 0
  "Usluga montaže": { buy_factor: 0.00, supplier: "-" }
};

function doPost(e) {
  try {
    var params = e.parameter;
    var emailUser = params.email;
    var nameUser = params.name || "Kupac";
    var phoneUser = params.phone || "";
    var subject = params._subject || "2LMF Kalkulator Izračun";
    var items = JSON.parse(params.items_json || "[]");

    var isSilent = params.type === 'silent';

    var enrichedItems = enrichItemsWithBusinessLogic(items);

    // ALWAYS save to Sheet (this was missing before!)
    saveToSheet(nameUser, emailUser, phoneUser, subject, enrichedItems, isSilent);

    if (isSilent) {
        // Silent mode: Stop here, don't send emails
        return ContentService.createTextOutput(JSON.stringify({ 'result': 'success', 'message': 'Saved silently' })).setMimeType(ContentService.MimeType.JSON);
    }

    // Normal mode: Send Emails
    var customerHtml = generateCustomerHtml(enrichedItems, nameUser, subject);
    var adminHtml = generateAdminHtml(enrichedItems, nameUser, emailUser, phoneUser, subject);

    MailApp.sendEmail({
      to: emailUser,
      subject: subject,
      htmlBody: customerHtml,
      replyTo: "2lmf.info@gmail.com",
      name: "2LMF PRO Kalkulator"
    });

    MailApp.sendEmail({
      to: "2lmf.info@gmail.com",
      subject: "[NOVI UPIT] " + nameUser + " - " + subject,
      htmlBody: adminHtml
    });

    queueFollowUp(emailUser, nameUser);
    return ContentService.createTextOutput(JSON.stringify({ 'result': 'success' })).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ 'result': 'error', 'error': error.toString() })).setMimeType(ContentService.MimeType.JSON);
  }
}

function saveToSheet(name, email, phone, subject, items, isSilent) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("Upiti") || ss.insertSheet("Upiti");
    
    // Ensure header
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["Datum", "Tip", "Ime", "Email", "Telefon", "Naslov", "Stavke (JSON)", "Vrijednost"]);
    }
    
    var total = 0;
    items.forEach(function(i){ total += i.qty * i.price_sell; });
    var typeLabel = isSilent ? "IZRAČUN (Tiho)" : "UPIT (Mail)";
    
    sheet.appendRow([
      new Date(),
      typeLabel,
      name,
      email,
      phone,
      subject,
      JSON.stringify(items),
      total
    ]);
  } catch (e) {
    console.warn("Could not save to sheet: " + e.toString());
  }
}

function enrichItemsWithBusinessLogic(items) {
  return items.map(function(item) {
    var config = { buy_factor: 0.80, supplier: "Ostalo" };
    for (var key in MATERIAL_CONFIG) {
      if (item.name.toLowerCase().indexOf(key.toLowerCase()) !== -1) {
        config = MATERIAL_CONFIG[key];
        break;
      }
    }
    item.price_buy_mpc = item.price_sell * config.buy_factor;
    item.price_buy_vpc = item.price_buy_mpc / 1.25; // Nabavna po komadu bez PDV-a
    item.supplier = config.supplier;
    item.profit = item.price_sell - item.price_buy_mpc;
    return item;
  });
}

function generateCustomerHtml(items, name, subject) {
  var totalAmount = 0;
  items.forEach(function(it){ totalAmount += it.qty * it.price_sell; });

  var html = "<div style='font-family: Arial, sans-serif; color: #333; max-width: 600px;'>" +
             "<h2 style='color: #FB8C00;'>2LMF PRO - Informativni Izračun</h2>" +
             "<p>Poštovani <b>" + name + "</b>, hvala na interesu.</p>" +
             "<table style='width: 100%; border-collapse: collapse;'>" +
             "<tr style='background-color: #FB8C00; color: white;'><th style='padding:10px;text-align:left;'>Stavka</th><th style='padding:10px;'>Kol.</th><th style='padding:10px;text-align:right;'>Cijena</th><th style='padding:10px;text-align:right;'>Ukupno</th></tr>";

  items.forEach(function(item) {
    var lineTotal = item.qty * item.price_sell;
    html += "<tr><td style='padding:10px;border-bottom:1px solid #ddd;'>" + item.name + "</td><td style='padding:10px;border-bottom:1px solid #ddd;text-align:center;'>" + item.qty + " " + item.unit + "</td><td style='padding:10px;border-bottom:1px solid #ddd;text-align:right;'>" + item.price_sell.toLocaleString('hr-HR', {minimumFractionDigits: 2}) + " €</td><td style='padding:10px;border-bottom:1px solid #ddd;text-align:right;'>" + lineTotal.toLocaleString('hr-HR', {minimumFractionDigits: 2}) + " €</td></tr>";
  });

  html += "<tr style='font-weight:bold;'><td colspan='3' style='padding:10px;text-align:right;'>SVEUKUPNO (sa PDV-om):</td><td style='padding:10px;text-align:right;color:#FB8C00;font-size:18px;'>" + totalAmount.toLocaleString('hr-HR', {minimumFractionDigits: 2}) + " €</td></tr></table>" +
          "<p style='background:#fff3e0;padding:15px;border-left:5px solid #FB8C00;'>Napomena: Izračun vrijedi 48 sati.</p><p>Lijep pozdrav,<br><b>Vaš 2LMF PRO Tim</b></p></div>";
  return html;
}

function generateAdminHtml(items, name, email, phone, subject) {
  var totalProfit = 0;
  items.forEach(function(it){ totalProfit += it.qty * it.profit; });

  var html = "<div style='font-family: Arial, sans-serif; color: #333;'>" +
             "<h2 style='color: #2c3e50;'>📊 Novi upit (Interni pregled)</h2>" +
             "<p><b>Kupac:</b> " + name + " (" + email + ") | <b>Tel:</b> " + phone + "</p>" +
             
             "<h3>💰 Analiza Zarade</h3>" +
             "<table style='width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 30px;'>" +
             "<tr style='background-color: #34495e; color: white;'><th style='padding:8px;text-align:left;'>Artikl</th><th style='padding:8px;'>Kol.</th><th style='padding:8px;text-align:right;'>MPC Prodajna</th><th style='padding:8px;text-align:right;background:#2ecc71;'>Nabavna (SA PDV)</th><th style='padding:8px;text-align:right;background:#e67e22;'>ZARADA</th></tr>";

  items.forEach(function(it) {
    html += "<tr><td style='padding:8px;border:1px solid #ddd;'>" + it.name + "</td><td style='padding:8px;border:1px solid #ddd;text-align:center;'>" + it.qty + " " + it.unit + "</td><td style='padding:8px;border:1px solid #ddd;text-align:right;'>" + (it.qty * it.price_sell).toLocaleString('hr-HR',{minimumFractionDigits:2}) + " €</td><td style='padding:8px;border:1px solid #ddd;text-align:right;'>" + (it.qty * it.price_buy_mpc).toLocaleString('hr-HR',{minimumFractionDigits:2}) + " €</td><td style='padding:8px;border:1px solid #ddd;text-align:right;font-weight:bold;'>" + (it.qty * it.profit).toLocaleString('hr-HR',{minimumFractionDigits:2}) + " €</td></tr>";
  });

  html += "<tr style='font-weight:bold;background:#eee;'><td colspan='4' style='padding:8px;text-align:right;'>UKUPNO ZARADA:</td><td style='padding:8px;text-align:right;color:#d35400;font-size:16px;'>" + totalProfit.toLocaleString('hr-HR',{minimumFractionDigits:2}) + " €</td></tr></table>" +

             "<h3>📦 Lista za Dobavljača</h3>" +
             "<table style='width: 100%; border-collapse: collapse; font-size: 13px;'>" +
             "<tr style='background-color: #2c3e50; color: white;'><th style='padding:8px;text-align:left;'>Artikl</th><th style='padding:8px;'>Količina</th><th style='padding:8px;text-align:right;'>Nabavna / kom (bez PDV)</th><th style='padding:8px;text-align:center;'>Provjera</th></tr>";

  items.forEach(function(it) {
    var vpcFmt = it.price_buy_vpc > 0 ? it.price_buy_vpc.toLocaleString('hr-HR',{minimumFractionDigits:2}) + " €" : "-";
    html += "<tr><td style='padding:8px;border:1px solid #ddd;'>" + it.name + "</td><td style='padding:8px;border:1px solid #ddd;text-align:center;'>" + it.qty + " " + it.unit + "</td><td style='padding:8px;border:1px solid #ddd;text-align:right;'>" + vpcFmt + "</td><td style='padding:8px;border:1px solid #ddd;text-align:center;'>[ ]</td></tr>";
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
  MailApp.sendEmail({
    to: email, 
    subject: "Jeste li uspjeli pogledati ponudu? - 2LMF PRO",
    body: "Poštovani " + name + ",\n\nJavljamo se samo da provjerimo imate li kakvih pitanja oko jučerašnjeg izračuna?\n\nLijepi pozdrav,\n2LMF Tim"
  });
}

function ensureTrigger() {
  if (ScriptApp.getProjectTriggers().length === 0) {
    ScriptApp.newTrigger('processFollowUpQueue').timeBased().everyHours(1).create();
  }
}
