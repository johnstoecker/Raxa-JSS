//////////////////////////////////////////////////////////////////////////////
// PrintToCanvas Class
//  - Keep track of items to be displayed and saved on persist of the JSON
//////////////////////////////////////////////////////////////////////////////
// TODO: Convert to ExtJS class so it builds properly
function PrintToCanvas() {
	// Constructor
}

PrintToCanvas.prototype = {
	TextGroupProperty: new Object(),
	TextArray: new Array(new TextProperty()),
}

PrintToCanvas.prototype.TextGroupProperty = {
	type: null,
	storeId: null,
	gid: null
}

PrintToCanvas.prototype.Status = {
	DiagnosisPrinted: 0,
	MedicationPrinted: 0,
}

function TextProperty(text, uuid) {
	this.text = text;
	this.uuid = uuid;
}