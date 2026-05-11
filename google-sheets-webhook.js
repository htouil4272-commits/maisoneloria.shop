/**
 * Google Apps Script — Maison Eloria Order Webhook
 * 
 * Deploy this as a Google Apps Script Web App to receive orders
 * directly from the frontend (alternative to Python backend sheets integration).
 * 
 * Setup:
 * 1. Go to script.google.com
 * 2. Create new project: "Maison Eloria Webhook"
 * 3. Paste this code
 * 4. Deploy → New Deployment → Web App
 * 5. Execute as: Me | Access: Anyone
 * 6. Copy the webhook URL
 */

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Commandes");
    
    if (!sheet) {
      sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet("Commandes");
      sheet.appendRow([
        "Date", "Heure", "N° Commande", "Nom Client", "Téléphone",
        "Pack", "Couleur(s)", "Quantité", "Total (DH)", "Statut",
        "Ville (IP)", "Source UTM", "Medium UTM", "Campaign UTM",
        "fbclid", "ttclid", "Score Fraude", "IP", "VPN"
      ]);
      sheet.getRange(1, 1, 1, 19).setFontWeight("bold");
    }
    
    var data = JSON.parse(e.postData.contents);
    
    var colors = (data.items || []).map(function(i) {
      return i.color_name || i.color_id || "";
    }).join(", ");
    
    var packs = (data.items || []).map(function(i) {
      return i.pack_id || "";
    }).join(", ");
    
    var totalQty = (data.items || []).reduce(function(sum, i) {
      return sum + ((i.quantity || 1) * (i.pieces || 1));
    }, 0);
    
    var now = new Date();
    
    sheet.appendRow([
      Utilities.formatDate(now, "Africa/Casablanca", "yyyy-MM-dd"),
      Utilities.formatDate(now, "Africa/Casablanca", "HH:mm:ss"),
      data.order_number || "",
      data.customer_name || "",
      data.customer_phone || "",
      packs,
      colors,
      totalQty,
      data.total || 0,
      "pending",
      data.city || "",
      data.utm_source || "",
      data.utm_medium || "",
      data.utm_campaign || "",
      data.fbclid || "",
      data.ttclid || "",
      data.fraud_score || 0,
      data.ip_address || "",
      String(data.is_vpn || false)
    ]);
    
    return ContentService.createTextOutput(
      JSON.stringify({ success: true, message: "Order added to sheet" })
    ).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({ success: false, error: error.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return ContentService.createTextOutput(
    JSON.stringify({ status: "active", service: "Maison Eloria Webhook" })
  ).setMimeType(ContentService.MimeType.JSON);
}
