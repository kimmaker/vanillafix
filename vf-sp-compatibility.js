//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// [VARIABLES AND FUNCTIONS PROVIDED FOR BACKWARD COMPATIBILITY]
// Please note: Below is necessary only if your vf-list-{name}.html was
// initially written for legacy Vanilla Fix, that is, vf-sp.js Release 181210
// or earlier. If you are currently transitioning from legacy Vanilla Fix to
// object-oriented Vanilla Fix, be sure to remove dependencies on these
// variables and functions by referencing the respective object properties
// and methods directly.
var __currentDate=vf.objectDate;
var __currentTimeZone=vf.currentTimeZone;
var __currentURL=vf.formUrl;
var __daysOfWeek=vf.daysOfWeek;
var __field=vf.field;
var __fieldValue=vf.fieldValue;
var __formMode=vf.formMode;
var __indicatorPopUp=vf.popUpIndicator;
var __listForm=vf.listForm;
var __markAsterisk=vf.reqIndicator;
var __queryString=vf.queryString;
var __regExEmail=vf.regExEmail;
var __respondToPulseCheck=vf.gotPulse;
var __spanAsterisk=vf.reqSpan;
function vfS(theText) { return vf.getText(theText); }
function vfSanitiseText(theText) { return vf.getText(theText); }
function vfGetUrlParameter(theName) { return vf.getUrlParameter(theName); }
function vfApplyCustomLayout() { vf.applyCustomLayout(); }
function vfAppendCharacters(theString,theChars) {
  return vf.appendCharacters(theString,theChars);
}
function vfRemoveAppendedCharacters(theString,theChars) {
  return vf.removeAppendedCharacters(theString,theChars);
}
function vfConvertToSortableTime(theTime,theSeparatorIn,theSeparatorOut) {
  return vf.convertToSortableTime(theTime,theSeparatorIn,theSeparatorOut);
}
function vfConvertToSortableDate(theDate,theSeparator,theLocale) {
  return vf.convertToSortableDate(theDate,theSeparator,theLocale);
}
function vfAssembleTimeOfDayString(theFieldLabel,theSeparator) {
  return vf.assembleTimeOfDayString(theFieldLabel,theSeparator);
}


