/**
 * Vanilla Fix for SharePoint
 * Class Definition Release 190514
 * Documentation: http://vanillafix.com
 * Repository: https://github.com/kimmaker/vanillafix
 */



//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// Check for required libraries.
if (typeof jQuery==='undefined') {
  console.log("Vanilla Fix requires jQuery.");
  alert("Oops! A required JavaScript library is not loaded.");
  window.open("","_self").close();
} else console.log("Found jQuery "+jQuery.fn.jquery+".");



//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// Define the VanillaFix class.
class VanillaFix {
  constructor(
    objectPlatform, // "Online", "2016", "2013", or "2010"
    objectSiteName,
    objectListName,
    objectLocale, // for example: "en-GB"
    objectRevision,
    objectIsCustomLayoutUsed, // true or false
    objectPulseCheck // true or false
  ) {
    this._objectDate=new Date();
    if (objectPulseCheck===undefined) this._pulseCheck=false;
    else this._pulseCheck=Boolean(objectPulseCheck);
    if (objectIsCustomLayoutUsed===undefined) this._isCustomLayoutUsed=false;
    else this._isCustomLayoutUsed=Boolean(objectIsCustomLayoutUsed);
    if (objectRevision===undefined) this._revision="1";
    else this._revision=this.getText(objectRevision);
    if (objectLocale===undefined) this._locale=this.determineLocale();
    else this._locale=this.determineLocale(objectLocale);
    if (objectListName===undefined) this._listName=this.determineListName();
    else this._listName=this.determineListName(objectListName);
    if (objectSiteName===undefined) this._siteName=this.determineSiteName();
    else this._siteName=this.determineSiteName(objectSiteName);
    if (objectPlatform===undefined) this._platform=this.determinePlatform();
    else this._platform=this.determinePlatform(objectPlatform);
  } // end of constructor

  //=======================================================================
  // [BASIC PROPERTIES]
  get objectDate() { return this._objectDate; }
  get platform() { return this._platform; }
  set platform(v) { this._platform=this.determinePlatform(v) }
  get siteName() { return this._siteName; }
  set siteName(v) { this._siteName=this.determineSiteName(v); }
  get listName() { return this._listName; }
  set listName(v) { this._listName=this.determineListName(v); }
  get locale() { return this._locale; }
  set locale(v) { this._locale=this.determineLocale(v); }
  get revision() { return this._revision }
  set revision(v) { this._revision=this.getText(v); }
  get isCustomLayoutUsed() { return this._isCustomLayoutUsed; }
  set isCustomLayoutUsed(v) { this._isCustomLayoutUsed=Boolean(v); }
  get pulseCheck() { return this._pulseCheck; }
  set pulseCheck(v) { this._pulseCheck=Boolean(v); }
  get formUrl() { return window.location.href; }
  get queryString() { return window.location.search; }
  get formMode() {
    if (this.formUrl.indexOf("DispForm.aspx")>=0) return 0;
    else if (this.formUrl.indexOf("NewForm.aspx")>=0) return 1;
    else if (this.formUrl.indexOf("EditForm.aspx")>=0) return 2;
    else return -1;
  }
  get formModeLiteral() {
    if (this.formMode==0) return "DispForm.aspx";
    else if (this.formMode==1) return "NewForm.aspx";
    else if (this.formMode==2) return "EditForm.aspx";
    else return "Unknown";
  }
  get currentTimeZone() {
    return (
      (this.objectDate.toString()).match(/\((.*?)\)/g).toString()
    ).replace(/[()]/g,"");
  }
  get regExEmail() {
    return /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
  } // usage: if (vf.regExEmail.test(theTestString)==false) alert("Invalid");

  //=======================================================================
  // [PLATFORM- OR LOCALE-BASED PROPERTIES]
  get daysOfWeek() {
    switch(this.locale) {
      default: return [
        "Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"
      ];
    }
  }
  get field() {
    switch(this.platform) {
      default: return ".ms-standardheader:contains";
    }
  }
  get fieldValue() {
    switch(this.platform) {
      default: return ".ms-formbody";
    }
  }
  get gotPulse() {
    switch(this.locale) {
      default: return "Vanilla Fix is in place."
      +" When you see this alert on all three .aspx forms of the list/library,"
      +" set vf.pulseCheck to false and get on with customisation.";
    }
  }
  get listForm() {
    switch(this.platform) {
      default: return "#onetIDListForm";
    }
  }
  get popUpIndicator() {
    switch(this.platform) {
      default: return "IsDlg=1";
    }
  }
  get renderingCompleted() {
    switch(this.locale) {
      default: return "Vanilla Fix finished rendering the form.";
    }
  }
  get renderingStarted() {
    switch(this.locale) {
      default: return "Vanilla Fix started rendering the form.";
    }
  }
  get reqIndicator() {
    switch(this.locale) {
      default: return " *";
    }
  }
  get reqSpan() {
    var spanClass="editMode";
    switch(this.platform) {
      case "2010": spanClass+=" red"; break;
      default: spanClass+=" ms-accentText";
    } // Ensure that .editMode and .red are defined in the stylesheet.
    return "<span class='"+spanClass+"'>"+this.reqIndicator+"</span>";
  }

  //=======================================================================
  // [CLASS METHOD] Print the key properties of the instantiated VanillaFix
  // object for logging.
  produceSignature() {
    return "---\n# Vanilla Fix Object"
    +"\n+ Instantiated on: "+this.objectDate.toString()
    +"\n+ Target platform: "+this.platform
    +"\n+ Site described as: "+this.siteName
    +"\n+ List described as: "+this.listName
    +"\n+ Locale applied: "+this.locale
    +"\n+ Customisation revision: "+this.revision
    +"\n+ Custom form layout: "+this.isCustomLayoutUsed
    +"\n+ Form mode: "+this.formMode+" ("+this.formModeLiteral+")"
    +"\n+ Form URL: "+this.formUrl.replace(this.queryString,"")
    +"\n  + "+unescape(
      this.queryString.replace("?",String("")
      ).replace(/&/g,String("\n  + ")
      ).replace(/=/g,String(": "))
    );
  } // end of produceSignature()

  //=======================================================================
  // [CLASS METHOD] Decide what to call the current SharePoint list.
  determineListName(theInput) {
    var defaultName="[List not specified]";
    if (theInput===undefined) return defaultName;
    var name=this.getText(theInput);
    if (name.length<2) return defaultName;
    return name;
  } // end of determineListName(1)

  //=======================================================================
  // [CLASS METHOD] Extract a locale code (language and region) from input.
  determineLocale(theLanguageAndRegion) {
    var defaultCode="en-GB";
    if (theLanguageAndRegion===undefined) return defaultCode;
    theLanguageAndRegion=this.getText(theLanguageAndRegion);
    if (theLanguageAndRegion.length!=5) return defaultCode;
    theLanguageAndRegion=theLanguageAndRegion.replace("_","-");
    var c=theLanguageAndRegion.split("-");
    if (c.length!=2) return defaultCode;
    var code=c[0].toString().toLowerCase()+"-"+c[1].toString().toUpperCase();
    var pattern=/^[a-z]{2}-[A-Z]{2}$/g;
    if (pattern.test(code)==false) return defaultCode;
    else return code;
  } // end of determineLocale(1)

  //=======================================================================
  // [CLASS METHOD] Decide what to call the current SharePoint site.
  determineSiteName(theInput) {
    var defaultName="[Site not specified]";
    if (theInput===undefined) return defaultName;
    var name=this.getText(theInput);
    if (name.length<2) return defaultName;
    return name;
  } // end of determineSiteName(1)

  //=======================================================================
  // [CLASS METHOD] Decide which SharePoint platform to target.
  determinePlatform(theInput) {
    var defaultPlatform="Online";
    if (theInput===undefined) return defaultPlatform;
    var specifiedPlatform=this.getText(theInput);
    if (specifiedPlatform.length<2) return defaultPlatform;
    switch(specifiedPlatform) {
      case "2016": return specifiedPlatform;
      case "2013": return specifiedPlatform;
      case "2010": return specifiedPlatform;
      default: return defaultPlatform;
    }
  } // end of determinePlatform(1)

  //=======================================================================
  // [CLASS METHOD] Sanitise text input.
  getText(theInput) {
    if (theInput===undefined) return "";
    return jQuery.trim(theInput).replace(/(\r\n|\n|\r|\t)/gm,String(""));
  } // end of getText(1)

  //=======================================================================
  // [CLASS METHOD] Build a jQuery selector for the label (display name) of
  // the specified field.
  getField(theLabel) {
    if (theLabel===undefined) return this.field+"('undefined')";
    switch(this.platform) {
      default: return this.field+"('"+this.getText(theLabel)+"')";
    }
  } // end of getField(1)

  //=======================================================================
  // [CLASS METHOD] Get the specified parameter from the query string. This
  // method is based on ideas from: https://kimmaker.com/ref/505
  getUrlParameter(theName) {
    if (theName===undefined) return "";
    theName=theName.replace(/[\[]/,"\\[").replace(/[\]]/,"\\]");
    var expression=new RegExp("[\\?&]"+theName+"=([^&#]*)");
    var results=expression.exec(this.queryString);
    return results===null?"":decodeURIComponent(results[1].replace(/\+/g," "));
  } // end of getUrlParameter(1)

  //=======================================================================
  // [CLASS METHOD] Apply a custom layout to a SharePoint list form.
  // This method is based on ideas from: https://kimmaker.com/ref/501
  // and is further documented at: https://kimmaker.com/doc/211
  applyCustomLayout() {
    jQuery(".ms-formtable").hide();
    if (this.platform=="Online") jQuery(".ms-WPBody").show();
    jQuery("span.customLayout").each(function() {
      var displayName=jQuery(this).attr("data-displayName");
      var elem=jQuery(this);
      jQuery("table.ms-formtable td").each(function() {
        if ((this.innerHTML.indexOf('FieldName="'+displayName+'"')!=-1)
          ||(this.innerHTML.indexOf('FieldInternalName="'+displayName+'"')!=-1)
        ) jQuery(this).contents().appendTo(elem);
      });
    });
  } // end of applyCustomLayout()

  //=======================================================================
  // [CLASS METHOD] Append a specified series of characters, such as a space
  // followed by an asterisk, to a string if those characters are not already
  // present.
  appendCharacters(theString,theChars) {
    if (theString===undefined) return "";
    if (theChars===undefined) return theString;
    if (theString.lastIndexOf(theChars)!=theString.length-theChars.length) {
      theString+=theChars;
    }
    return theString;
  } // end of appendCharacters(2)

  //=======================================================================
  // [CLASS METHOD] Remove the last occurrence of a specified series of
  // characters, such as a space followed by an asterisk, from a string.
  removeAppendedCharacters(theString,theChars) {
    if (theString===undefined) return "";
    if (theChars===undefined) return theString;
    if (theString.lastIndexOf(theChars)==theString.length-theChars.length) {
      theString=theString.substring(0,theString.length-theChars.length);
    }
    return theString;
  } // end of removeAppendedCharacters(2)

  //=======================================================================
  // [CLASS METHOD] Convert a SharePoint time string to a sortable 24-hour
  // equivalent; for example, "11:00 PM" returns "23:00". The method also
  // works for strings that contain variations of English-language AM/PM
  // indications such as "a.m." and "p.m.". The default hour-minute
  // separator is the ":" symbol; however, a different separator, including
  // a blank string, can be specified in an optional second argument. An
  // optional third argument specifies the hour-minute separator in the
  // output. All invalid input strings return "00:00" (or its equivalent if
  // a custom hour-minute separator is used).
  //
  // Further examples:
  // ("9:00 AM") returns "09:00"
  // ("9:00 PM") returns "21:00"
  // ("9:00") returns "09:00"
  // ("9:00",":","") returns "0900"
  // ("9:00 PM",":") returns "21:00"
  // ("9.00 PM",".") returns "21.00"
  // ("9:00 PM",".") returns "00.00" (invalid input)
  // ("9.00 PM",".","") returns "2100"
  // ("9:00 PM",":","") returns "2100"
  // ("9:00 PM",":",".") returns "21.00"
  // ("9.00 PM",".",":") returns "21:00"
  // ("9.00 PM",":",":") returns "00:00" (invalid input)
  // ("9:30pm") returns "21:30"
  // ("9.30pm",".") returns "21.30"
  // ("9.30pm",".","") returns "2130"
  // ("9.30pm",".",":") returns "21:30"
  // ("9pm") returns "00:00" (invalid input)
  // ("9pm","") returns "2100"
  // ("9pm","",":") returns "21:00"
  // ("0900p","") returns "2100"
  // ("930p","",":") returns "21:30"
  convertToSortableTime(theTime,theSeparatorIn,theSeparatorOut) {
    if (theSeparatorIn===undefined) theSeparatorIn=":";
    var defaultTime="00"+theSeparatorIn+"00";
    if (theTime===undefined) return defaultTime;
    theTime=this.getText(theTime);
    var theTimeDigits=theTime.match(/[0-9]/g).toString().replace(/[,]/g,"");
    var timeH,timeM;
    var indicatorAmPm="";
    if (theSeparatorIn=="") {
      if (theTimeDigits.length<=2) {
        timeH=theTimeDigits;
        timeM="00";
      } else if (theTimeDigits.length==3) {
        timeH=theTimeDigits[0];
        timeM=theTimeDigits.substring(1,3);
      } else {
        timeH=theTime.substring(0,2);
        timeM=theTime.substring(2).replace(/[^\d]/g,"");
      }
    } else {
      var arrTime=theTime.split(theSeparatorIn);
      if (arrTime.length<2) return defaultTime;
      timeH=arrTime[0].toString();
      timeM=arrTime[1].replace(/[^\d]/g,"").toString();
    }
    if ((Number(timeH)<0)||(Number(timeH)>24)) return defaultTime;
    if ((Number(timeM)<0)||(Number(timeM)>59)) return defaultTime;
    if (timeH.length==1) timeH="0"+timeH;
    if (timeM.length==1) timeM="0"+timeM;
    if (theTime!=theTimeDigits) {
      indicatorAmPm=theTime.match(/[^\d]/g).toString().replace(/[,.: ]/g,"");
    }
    if (indicatorAmPm!="") {
      if (indicatorAmPm.toUpperCase().indexOf("P")>=0) {
        if ((Number(timeH)>0)&&(Number(timeH)<12)) {
          timeH=(Number(timeH)+12).toString(); // Change 1-11 PM to 13-23 hours.
        }
      } else if (timeH=="12") timeH="00"; // Change "12:xx AM" to "00:xx".
    }
    if (timeH=="24") timeH="00"; // Change "24:xx" to "00:xx".
    if (theSeparatorOut===undefined) theSeparatorOut=theSeparatorIn;
    return timeH+theSeparatorOut+timeM;
  } // end of convertToSortableTime(3)

  //=======================================================================
  // [CLASS METHOD] Convert a conventional date string to YYYY-MM-DD; for
  // example, "13/07/2019" returns "2019-07-13". An optional second argument
  // can specify what the day-month-year separator in the input string is. If
  // the second argument is not given, the method uses "/". An optional third
  // argument may be set to "en-US" to indicate U.S. date format in the input,
  // in which case the given date is treated as month-day-year instead of day-
  // month-year. When this third argument is not given, the locale applied to
  // the instantiated Vanilla Fix object is used.
  //
  // All invalid inputs return "YYYY-01-01" where YYYY is the current year.
  // Below examples assume that the locale applied to the Vanilla Fix object
  // is not "en-US":
  // ("29/2/2020") returns "2020-02-29"
  // ("29/2/2021") returns "2019-01-01" (invalid input)
  // ("11/12/2020","/") returns "2020-12-11"
  // ("11.12.2020") returns "2019-01-01" (invalid input)
  // ("11.12.2020",".") returns "2020-12-11"
  // ("11-12-2020","-") returns "2020-12-11"
  // ("11.12.2020",".","en-US") returns "2020-11-12"
  // ("11-12-2020","-","en-US") returns "2020-11-12"
  // ("11/12/2020","/","en-US") returns "2020-11-12"
  convertToSortableDate(theDate,theSeparator,theLocale) {
    var currentYYYY=this.objectDate.getFullYear();
    var defaultYMD=currentYYYY+"-01-01";
    if (theLocale===undefined) theLocale=this.locale;
    if (theSeparator===undefined) theSeparator="/";
    if (theSeparator.length>1) return defaultYMD;
    if (theDate===undefined) return defaultYMD;
    theDate=this.getText(theDate);
    var arrDate=theDate.split(theSeparator);
    if (arrDate.length!=3) return defaultYMD;
    if (arrDate[0].length==1) arrDate[0]="0"+arrDate[0];
    if (arrDate[1].length==1) arrDate[1]="0"+arrDate[1];
    var strYMD=arrDate[2];
    if ((theLocale.toUpperCase()=="US")||(theLocale.toUpperCase()=="EN-US")) {
      strYMD+=("-"+arrDate[0]+"-"+arrDate[1]);
    } else strYMD+=(String("-"+arrDate[1]+"-"+arrDate[0]));
    if (isNaN(Date.parse(strYMD))) return defaultYMD;
    else return strYMD;
  } // end of convertToSortableDate(3)

  //=======================================================================
  // [CLASS METHOD] Extract HH:mm from a SharePoint time field. If the input
  // time is in 12-hour format, also add an AM-or-PM indicator.
  assembleTimeOfDayString(theFieldLabel,theSeparator) {
    if (theSeparator===undefined) theSeparator=":";
    if (theFieldLabel===undefined) return "";
    var assembledString="";
    var indicatorAmPm="";
    var hPortion=jQuery(this.f+"('"+theFieldLabel+"')").closest("tr").find(
      "select[id$='Hours'] option:selected"
    ).text();
    var mPortion=jQuery(this.f+"('"+theFieldLabel+"')").closest("tr").find(
      "select[id$='Minutes'] option:selected"
    ).text();
    if (hPortion!=hPortion.replace(/[^\d]/g,"")) {
      indicatorAmPm=((hPortion.match(/[^\d]/g)).toString()).replace(/[,]/g,"");
      hPortion=hPortion.replace(/[^\d]/g,"");
    }
    assembledString=hPortion+theSeparator+mPortion+indicatorAmPm;
    return this.getText(assembledString);
  } // end of assembleTimeOfDayString(2)
} // end of class VanillaFix



//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// Instantiate a default VanillaFix object. Individual editable properties
// are set in vf-list-{name}.html.
var vf=new VanillaFix();



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


