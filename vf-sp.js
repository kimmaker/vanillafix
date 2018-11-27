/**
 * Vanilla Fix for SharePoint: List-Independent Functions and Variables
 * http://vanillafix.com
 *
 * Base Release: 181129
 */

// Check for required libraries.
if (typeof jQuery==='undefined') {
  alert("Oops! A required JavaScript library is not loaded.");
  window.open("","_self").close();
} else {
  //alert(jQuery.fn.jquery);
}

// Initialise list-agnostic global variables.
var __currentDate=new Date(); __currentDate.setHours(0,0,0,0);
var __currentTimeZone=((__currentDate.toString()).match(/\((.*?)\)/g).toString()
).replace(/[()]/g,"");
var __currentURL=window.location.href;
var __daysOfWeek=[
  "Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"
];
var __field=".ms-standardheader:contains";
var __formMode=-1; // 0: DispForm | 1: NewForm | 2: EditForm | -1: Unknown
if (__currentURL.indexOf("DispForm.aspx")>=0) __formMode=0;
else if (__currentURL.indexOf("NewForm.aspx")>=0) __formMode=1;
else if (__currentURL.indexOf("EditForm.aspx")>=0) __formMode=2;
var __indicatorPopUp="IsDlg=1";
var __listForm="#onetIDListForm";
var __markAsterisk=" *";
var __queryString=window.location.search;
var __regExEmail=/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
// usage: if (__regExEmail.test(theTestString)==false) alert("Invalid");
var __respondToPulseCheck="Vanilla Fix is in place."
+" When you see this message on all three .aspx forms of this list/library,"
+" set _checkingForPulse to false and get on with customisation.";
var __spanAsterisk="<span class='editMode bold red'>"+__markAsterisk+"</span>";

//--
// [Common Function] Sanitise a string by removing all whitespaces, tab
// stops, and new-line characters.
//--
function vfSanitiseText(theText) {
  return jQuery.trim(theText).replace(/(\r\n|\n|\r|\t)/gm,"");
} // end of function vfSanitiseText(1)

//--
// [Commmon Function] Append a specified series of characters, such as a
// space followed by an asterisk, to a string if those characters are not
// already present.
//--
function vfAppendCharacters(theString,theChars) {
  if (theString===undefined) return "";
  if (theChars===undefined) return theString;
  if (theString.lastIndexOf(theChars)!=theString.length-theChars.length) {
    theString+=theChars;
  }
  return theString;
} // end of function vfAppendCharacters(2)

//--
// [Commmon Function] Remove the last occurrence of a specified series of
// characters, such as a space followed by an asterisk, from a string.
//--
function vfRemoveAppendedCharacters(theString,theChars) {
  if (theString===undefined) return "";
  if (theChars===undefined) return theString;
  if (theString.lastIndexOf(theChars)==theString.length-theChars.length) {
    theString=theString.substring(0,theString.length-theChars.length);
  }
  return theString;
} // end of function vfRemoveAppendedCharacters(2)

//--
// [Commmon Function] Apply a custom layout to a SharePoint list form. This
// function first hides the native form and then moves its contents over to
// designated placeholders inside a custom form structure (layout).
//
// While the use of this function is strictly optional, it can overcome the
// linear one-field-per-row layout built into every out-of-the-box SharePoint
// list form, that is, without relying on tools such as InfoPath, Nintex Forms,
// or SharePoint Designer.
//
// This function is based on ideas from: https://kimmaker.com/ref/501
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
//--
function vfApplyCustomLayout() {
  jQuery(".ms-formtable").hide();
  jQuery("span.customLayout").each(function () {
    displayName=jQuery(this).attr("data-displayName");
    elem=jQuery(this);
    jQuery("table.ms-formtable td").each(function () {
      if ((this.innerHTML.indexOf('FieldName="'+displayName+'"')!=-1)
        ||(this.innerHTML.indexOf('FieldInternalName="'+displayName+'"')!=-1)
      ) jQuery(this).contents().appendTo(elem);
    });
  });
} // end of function vfApplyCustomLayout()

//--
// [Commmon Function] Convert a SharePoint time string to a sortable 24-hour
// equivalent; for example, "11:00 PM" returns "23:00". The function also
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
//--
function vfConvertToSortableTime(
  theTime,theSeparatorInInput,theSeparatorInOutput
) {
  if (theSeparatorInInput===undefined) theSeparatorInInput=":";
  var defaultTime="00"+theSeparatorInInput+"00";
  if (theTime===undefined) return defaultTime;
  theTime=vfSanitiseText(theTime);
  var theTimeDigits=theTime.match(/[0-9]/g).toString().replace(/[,]/g,"");
  var timeH,timeM;
  var indicatorAmPm="";
  if (theSeparatorInInput=="") {
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
    var arrTime=theTime.split(theSeparatorInInput);
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
  if (theSeparatorInOutput===undefined) {
    theSeparatorInOutput=theSeparatorInInput;
  }
  return timeH+theSeparatorInOutput+timeM;
} // end of function vfConvertToSortableTime(3)

//--
// [Commmon Function] Convert a conventional date string to YYYY-MM-DD;
// for example, "13/07/2019" returns "2019-07-13". An optional second
// argument can specify what the day-month-year separator in the input
// string is. If the second argument is not given, the function uses "/".
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
//--
function vfConvertToSortableDate(theDate,theSeparator,theLocale) {
  var currentYYYY=__currentDate.getFullYear();
  var defaultYMD=currentYYYY+"-01-01";
  if (theLocale===undefined) theLocale="";
  if (theSeparator===undefined) theSeparator="/";
  if (theSeparator.length>1) return defaultYMD;
  if (theDate===undefined) return defaultYMD;
  theDate=vfSanitiseText(theDate);
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
} // end of function vfConvertToSortableDate(3)

//--
// [Commmon Function] Extract HH:mm from a SharePoint time field. If the input
// time is in 12-hour format, also indicate AM or PM.
//--
function vfAssembleTimeOfDayString(theFieldLabel,theSeparator) {
  if (theSeparator===undefined) theSeparator=":";
  var assembledString="";
  var indicatorAmPm="";
  var hPortion=jQuery(__field+"('"+theFieldLabel+"')").closest("tr").find(
    "select[id$='Hours'] option:selected"
  ).text();
  var mPortion=jQuery(__field+"('"+theFieldLabel+"')").closest("tr").find(
    "select[id$='Minutes'] option:selected"
  ).text();
  if (hPortion!=hPortion.replace(/[^\d]/g,"")) {
    indicatorAmPm=((hPortion.match(/[^\d]/g)).toString()).replace(/[,]/g,"");
    hPortion=hPortion.replace(/[^\d]/g,"");
  }
  assembledString=hPortion+theSeparator+mPortion+indicatorAmPm;
  return vfSanitiseText(assembledString);
} // end of function vfAssembleTimeOfDayString(2)

//--
// [Commmon Function] Get the specified parameter from the query string. This
// function is based on ideas from: https://kimmaker.com/ref/505
//--
function vfGetUrlParameter(theParameter) {
  theParameter=theParameter.replace(/[\[]/,'\\[').replace(/[\]]/,'\\]');
  var regex=new RegExp('[\\?&]'+theParameter+'=([^&#]*)');
  var results=regex.exec(__queryString);
  return results===null?'':decodeURIComponent(results[1].replace(/\+/g,' '));
} // end of function vfGetUrlParameter(1)


