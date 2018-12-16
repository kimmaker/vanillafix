/**
 * Vanilla Fix for SharePoint: Class Definition
 * http://vanillafix.com
 *
 * Base Release: 181215
 */

// Check for required libraries.
if (typeof jQuery==='undefined') {
  alert("Oops! A required JavaScript library is not loaded.");
  window.open("","_self").close();
} else console.log("Found jQuery "+jQuery.fn.jquery);

// Define the VanillaFix class.
class VanillaFix {
  constructor(
    objectPlatformVersion, // "Online", "2016", "2013", or "2010"
    objectSiteName,
    objectListName,
    objectLocale, // for example: "en-AU"
    objectIsCustomLayoutUsed, // true or false
    objectPulseCheck // true or false
  ) {
    this._objectDate=new Date();
    if (objectPulseCheck===undefined) this._pulseCheck=false;
    else this._pulseCheck=Boolean(objectPulseCheck);
    if (objectIsCustomLayoutUsed===undefined) this._isCustomLayoutUsed=false;
    else this._isCustomLayoutUsed=Boolean(objectIsCustomLayoutUsed);
    if (objectLocale===undefined) this._Locale="en-AU";
    else this._locale=this.getText(objectLocale);
    if (objectListName===undefined) this._listName="SharePoint List";
    else this._listName=this.getText(objectListName);
    if (objectSiteName===undefined) this._siteName="SharePoint Site";
    else this._siteName=this.getText(objectSiteName);
    if (objectPlatformVersion===undefined) this._platformVersion="Online";
    else this._platformVersion=this.getText(objectPlatformVersion);
  } // end of constructor

  // [Properties]
  get objectDate() { return this._objectDate; }
  get objectDateAt0000() { return this._objectDate.setHours(0,0,0,0); }
  get platformVersion() { return this._platformVersion; }
  set platformVersion(v) { this._platformVersion=this.getText(v); }
  get siteName() { return this._siteName; }
  set siteName(v) { this._siteName=this.getText(v); }
  get listName() { return this._listName; }
  set listName(v) { this._listName=this.getText(v); }
  get locale() { return this._locale; }
  set locale(v) { this._locale=this.getText(v); }
  get isCustomLayoutUsed() { return this._isCustomLayoutUsed; }
  set isCustomLayoutUsed(v) { this._isCustomLayoutUsed=Boolean(v); }
  get pulseCheck() { return this._pulseCheck; }
  set pulseCheck(v) { this._pulseCheck=Boolean(v); }
  get formUrl() { return window.location.href; }
  get queryString() { return window.location.search; }
  get currentTimeZone() {
    return (
      (this.objectDate.toString()).match(/\((.*?)\)/g).toString()
    ).replace(/[()]/g,"");
  }
  get daysOfWeek() {
    switch(this.locale) {
      default: return [
        "Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"
      ];
    }
  }
  get field() {
    switch(this.platformVersion) {
      default: return ".ms-standardheader:contains";
    }
  }
  get fieldValue() {
    switch(this.platformVersion) {
      default: return "td.ms-formbody";
    }
  }
  get formMode() {
    if (this.formUrl.indexOf("DispForm.aspx")>=0) return 0;
    else if (this.formUrl.indexOf("NewForm.aspx")>=0) return 1;
    else if (this.formUrl.indexOf("EditForm.aspx")>=0) return 2;
    else return -1;
  }
  get gotPulse() {
    switch(this.locale) {
      default: return "Vanilla Fix is in place."
      +" When you see this alert on all three .aspx forms of the list/library,"
      +" set vf.pulseCheck to false and get on with customisation.";
    }
  }
  get listForm() {
    switch(this.platformVersion) {
      default: return "#onetIDListForm";
    }
  }
  get popUpIndicator() {
    switch(this.platformVersion) {
      default: return "IsDlg=1";
    }
  }
  get regExEmail() {
    return /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
  } // usage: if (vf.regExEmail.test(theTestString)==false) alert("Invalid");
  get renderingCompleted() {
    switch(this.locale) {
      default: return "Vanilla Fix completed rendering the form.";
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
    switch(this.platformVersion) {
      default: return "<span class='editMode ms-accentText'>"
      +this.reqIndicator+"</span>";
    }
  }

  // [VF Method] Sanitise text input.
  getText(v) { return jQuery.trim(v).replace(/(\r\n|\n|\r|\t)/gm,""); }

  // [VF Method] Build a jQuery selector for the specified field.
  getField(theFieldLabel) {
    switch(this.platformVersion) {
      default: return this.field+"('"+theFieldLabel+"')";
    }
  } // end of getField(1)

  // [VF Method] Get the specified parameter from the query string. This
  // method is based on ideas from: https://kimmaker.com/ref/505
  getUrlParameter(theName) {
    theName=theName.replace(/[\[]/,'\\[').replace(/[\]]/,'\\]');
    var expression=new RegExp('[\\?&]'+theName+'=([^&#]*)');
    var results=expression.exec(this.queryString);
    return results===null?'':decodeURIComponent(results[1].replace(/\+/g,' '));
  } // end of getUrlParameter(1)

  // [VF Method] Apply a custom layout to a SharePoint list form. This
  // method first hides the native form and then moves its contents over to
  // designated placeholders inside a custom form structure (layout).
  //
  // While the use of this method is strictly optional, it can overcome the
  // linear one-field-per-row layout built into every out-of-the-box SharePoint
  // list form, that is, without relying on tools such as InfoPath, Nintex
  // Forms, or SharePoint Designer.
  //
  // This method is based on ideas from: https://kimmaker.com/ref/501
  // and is further documented at: https://kimmaker.com/doc/211
  //
  // Below is an example HTML form structure that contains a custom layout.
  // Important: All 'span' tags that represent a field must contain
  // 'class="customLayout"' and 'data-displayName' attributes. All other
  // attributes are optional.
  /*
  <div id="formWithCustomLayout" class="formWrapper">
    <div class="formDivRow borderTop">
      <div id="formSection1Row1Col1" class="formDiv1Col">
        <span id="formHeading1" class="customLayoutSectionTitle">
          Form Section 1 Heading
        </span>
      </div>
    </div>
    <div class="formDivRow">
      <div id="formSection1Row2Col1" class="formDiv2Col">
        <p><span id="formTitleLabel">
          <strong>Title</strong>
          <span class="editMode bold red">*</span>
        </span></p>
        <span id="formTitle" class="customLayout"
          data-displayName="Title"
        ></span>
      </div>
      <div id="formSection1Row2Col2" class="formDiv2Col">
        <p><span id="formItemIDLabel">
          <strong>ID</strong>
        </span></p>
        <span id="formItemID"></span>
      </div>
    </div>
    <div class="formDivRow">
      <div id="formSection1Row3Col1" class="formDiv2Col">
        <p><span id="formListField2Label">
          <strong>List Field 2</strong>
          <span class="editMode bold red">*</span>
        </span></p>
        <span id="formListField2" class="customLayout"
          data-displayName="Second Field in List"
        ></span>
      </div>
      <div id="formSection1Row3Col2" class="formDiv2Col">
        <p><span id="formListField3Label">
          <strong>List Field 3</strong>
        </span></p>
        <span id="formListField3" class="customLayout"
          data-displayName="Third Field in List"
        ></span>
      </div>
    </div>
  </div>
  */
  applyCustomLayout() {
    jQuery(".ms-formtable").hide();
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

  // [VF Method] Append a specified series of characters, such as a space
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

  // [VF Mdehod] Remove the last occurrence of a specified series of
  // characters, such as a space followed by an asterisk, from a string.
  removeAppendedCharacters(theString,theChars) {
    if (theString===undefined) return "";
    if (theChars===undefined) return theString;
    if (theString.lastIndexOf(theChars)==theString.length-theChars.length) {
      theString=theString.substring(0,theString.length-theChars.length);
    }
    return theString;
  } // end of removeAppendedCharacters(2)

  // [VF Method] Convert a SharePoint time string to a sortable 24-hour
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

  // [VF Method] Convert a conventional date string to YYYY-MM-DD;
  // for example, "13/07/2019" returns "2019-07-13". An optional second
  // argument can specify what the day-month-year separator in the input
  // string is. If the second argument is not given, the method uses "/".
  // An optional third argument may be set to "US" in which case the input
  // string is recognised as month-day-year instead of day-month-year. All
  // invalid inputs return "YYYY-01-01" where YYYY is the current year.
  //
  // Further examples:
  // ("29/2/2020") returns "2020-02-29"
  // ("29/2/2021") returns "2018-01-01" (invalid input)
  // ("11/12/2020","/") returns "2020-12-11"
  // ("11.12.2020") returns "2018-01-01" (invalid input)
  // ("11.12.2020",".") returns "2020-12-11"
  // ("11-12-2020","-") returns "2020-12-11"
  // ("11.12.2020",".","US") returns "2020-11-12"
  // ("11-12-2020","-","US") returns "2020-11-12"
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
    } else strYMD+=("-"+arrDate[1]+"-"+arrDate[0]);
    if (isNaN(Date.parse(strYMD))) return defaultYMD;
    else return strYMD;
  } // end of convertToSortableDate(3)

  // [VF Method] Extract HH:mm from a SharePoint time field. If the input time
  // is in 12-hour format, also indicate AM or PM.
  assembleTimeOfDayString(theFieldLabel,theSeparator) {
    if (theSeparator===undefined) theSeparator=":";
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

// Instantiate a default VanillaFix object. Individual editable properties can
// be set in vf-list-{name}.html.
var vf=new VanillaFix();



//-------------------------------------------------------------------------
// [VARIABLES AND FUNCTIONS FOR BACKWARD COMPATIBILITY]
// Note. Below is necessary only for vf-list-{name}.html that uses vf-sp.js
// Release 181210 or older. If you are currently transitioning from legacy
// Vanilla Fix to object-oriented Vanilla Fix, be sure to remove dependencies
// on these variables and functions.
var __currentDate=vf.objectDateAt0000;
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
function vfSanitiseText(theText) { return vfS(theText); }
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


