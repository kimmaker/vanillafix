/**
 * Vanilla Fix for SharePoint (ES5)
 * Object Instantiation Release 190614
 * Documentation: http://vanillafix.com
 * Repository: https://github.com/kimmaker/vanillafix
 */



//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// Instantiate a VanillaFix object in ES5-compatible syntax.
var vf={
  scriptCompatibility:"ES5",
  platform:"Online",
  siteName:"[Site not specified]",
  listName:"[List not specified]",
  locale:"en-GB",
  revision:"0",
  isCustomLayoutUsed:false,
  pulseCheck:false,
  objectDate:new Date(),
  siteUrl:_spPageContextInfo.webAbsoluteUrl,
  formUrl:window.location.href,
  queryString:window.location.search,
  regExEmail:/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,

  //=======================================================================
  // [DERIVED OBJECT PROPERTIES]
  setDerivedObjectProperties:function() {
    this.formMode=this.getFormMode(this.formUrl);
    this.formModeLiteral=this.getFormModeLiteral(this.formMode);
    this.currentTimeZone=this.getCurrentTimeZone(this.objectDate);
    this.daysOfWeek=this.getDaysOfWeek(this.locale);
    this.field=this.getFieldSelector(this.platform);
    this.fieldValue=this.getFieldValueSelector(this.platform);
    this.listForm=this.getListForm(this.platform);
    this.pageRibbon=this.getPageRibbon(this.platform);
    this.popUpIndicator=this.getPopUpIndicator(this.locale);
    this.renderingCompleted=this.getRenderingCompleted(this.locale);
    this.renderingStarted=this.getRenderingStarted(this.locale);
    this.reqIndicator=this.getReqIndicator(this.locale);
  },
  getFieldSelector:function(thePlatform) {
    switch(thePlatform) {
      default: return ".ms-standardheader:contains";
    }
  },
  getFieldSelector:function(thePlatform) {
    switch(thePlatform) {
      default: return ".ms-standardheader:contains";
    }
  },
  getFieldValueSelector:function(thePlatform) {
    switch(thePlatform) {
      default: return ".ms-formbody";
    }
  },
  getFormMode:function(theUrl) {
    if (theUrl.indexOf("DispForm.aspx")>=0) return 0;
    else if (theUrl.indexOf("NewForm.aspx")>=0) return 1;
    else if (theUrl.indexOf("EditForm.aspx")>=0) return 2;
    else return -1;
  },
  getFormModeLiteral:function(theFormMode) {
    if (theFormMode==0) return "DispForm.aspx";
    else if (theFormMode==1) return "NewForm.aspx";
    else if (theFormMode==2) return "EditForm.aspx";
    else return "Unknown";
  },
  getCurrentTimeZone:function(theDate) {
    return String((String(theDate)).match(/\((.*?)\)/g)).replace(/[()]/g,"");
  },
  getDaysOfWeek:function(theLocale) {
    switch(theLocale) {
      default: return [
        "Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"
      ];
    }
  },
  getMonths:function(theLocale) {
    switch(theLocale) {
      default: return [
        "January","February","March","April","May","June",
        "July","August","September","October","November","December"
      ];
    }
  },
  getPulse:function(theLocale) {
    switch(theLocale) {
      default: return "Vanilla Fix is in place."
      +" When you see this alert on all three .aspx forms of the list/library,"
      +" set vf.pulseCheck to false and get on with customisation.";
    }
  },
  getListForm:function(theLocale) {
    switch(theLocale) {
      default: return "#onetIDListForm";
    }
  },
  getPageRibbon:function(theLocale) {
    switch(theLocale) {
      default: return "#ribbonBox";
    }
  },
  getPopUpIndicator:function(theLocale) {
    switch(theLocale) {
      default: return "IsDlg=1";
    }
  },
  getRenderingCompleted:function(theLocale) {
    switch(theLocale) {
      default: return "Vanilla Fix finished rendering the form.";
    }
  },
  getRenderingStarted:function(theLocale) {
    switch(theLocale) {
      default: return "Vanilla Fix started rendering the form.";
    }
  },
  getReqIndicator:function(theLocale) {
    switch(theLocale) {
      default: return " *";
    }
  },
  getReqSpan:function(thePlatform) {
    var spanClass="editMode";
    switch(thePlatform) {
      case "2010": spanClass+=" red"; break;
      default: spanClass+=" ms-accentText";
    } // Ensure that .editMode and .red are defined in the stylesheet.
    return String("<span class='"+spanClass+"'>"+this.reqIndicator+"</span>");
  },

  //=======================================================================
  // [OBJECT METHOD] Append a specified series of characters, such as a space
  // followed by an asterisk, to a string if those characters are not already
  // present.
  appendCharacters:function(theString,theChars) {
    if (theString===undefined) return "";
    if (theChars===undefined) return theString;
    if (theString.lastIndexOf(theChars)!=theString.length-theChars.length) {
      theString+=theChars;
    }
    return theString;
  }, // end of appendCharacters(2)

  //=======================================================================
  // [OBJECT METHOD] Apply a custom layout to a SharePoint list form.
  // This method is based on ideas from: https://kimmaker.com/ref/501
  // and is further documented at: https://kimmaker.com/doc/211
  applyCustomLayout:function() {
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

    // For attachments, supply the correct selector in the custom layout.
    jQuery("#idAttachmentsRow").contents().appendTo(jQuery("#formAttachments"));
  }, // end of applyCustomLayout()

  //=======================================================================
  // [OBJECT METHOD] Extract HH:mm from a SharePoint time field. If the input
  // time is in 12-hour format, also add an AM-or-PM indicator.
  assembleTimeOfDayString:function(theFieldLabel,theSeparator) {
    if (theSeparator===undefined) theSeparator=":";
    if (theFieldLabel===undefined) return "";
    var assembledString="";
    var indicatorAmPm="";
    var hPortion=jQuery(this.field+"('"+theFieldLabel+"')").closest("tr").find(
      "select[id$='Hours'] option:selected"
    ).text();
    var mPortion=jQuery(this.field+"('"+theFieldLabel+"')").closest("tr").find(
      "select[id$='Minutes'] option:selected"
    ).text();
    if (hPortion!=hPortion.replace(/[^\d]/g,"")) {
      indicatorAmPm=((hPortion.match(/[^\d]/g)).toString()).replace(/[,]/g,"");
      hPortion=hPortion.replace(/[^\d]/g,"");
    }
    assembledString=hPortion+theSeparator+mPortion+indicatorAmPm;
    return this.getText(assembledString);
  }, // end of assembleTimeOfDayString(2)

  //=======================================================================
  // [OBJECT METHOD] Convert a conventional date string to YYYY-MM-DD; for
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
  convertToSortableDate:function(theDate,theSeparator,theLocale) {
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
  }, // end of convertToSortableDate(3)

  //=======================================================================
  // [OBJECT METHOD] Convert a SharePoint time string to a sortable 24-hour
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
  convertToSortableTime:function(theTime,theSeparatorIn,theSeparatorOut) {
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
  }, // end of convertToSortableTime(3)

  //=======================================================================
  // [OBJECT METHOD] Decide what to call the current SharePoint list.
  determineListName:function(theInput) {
    var defaultName="[List not specified]";
    if (theInput===undefined) return defaultName;
    var name=this.getText(theInput);
    if (name.length<2) return defaultName;
    return name;
  }, // end of determineListName(1)

  //=======================================================================
  // [OBJECT METHOD] Extract a locale code (language and region) from input.
  determineLocale:function(theLanguageAndRegion) {
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
  }, // end of determineLocale(1)

  //=======================================================================
  // [OBJECT METHOD] Decide which SharePoint platform to target.
  determinePlatform:function(theInput) {
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
  }, // end of determinePlatform(1)

  //=======================================================================
  // [OBJECT METHOD] Decide what to call the current SharePoint site.
  determineSiteName:function(theInput) {
    var defaultName="[Site not specified]";
    if (theInput===undefined) return defaultName;
    var name=this.getText(theInput);
    if (name.length<2) return defaultName;
    return name;
  }, // end of determineSiteName(1)

  //=======================================================================
  // [OBJECT METHOD] Build a jQuery selector for the label (display name) of
  // the specified field.
  getField:function(theLabel) {
    if (theLabel===undefined) return this.field+"('undefined')";
    switch(this.platform) {
      default: return this.field+"('"+this.getText(theLabel)+"')";
    }
  }, // end of getField(1)

  //=======================================================================
  // [OBJECT METHOD] Sanitise text input.
  getText:function(theInput) {
    if ((theInput===null)||(theInput===undefined)) return "";
    return jQuery.trim(theInput).replace(/(\r\n|\n|\r|\t)/gm,String(""));
  }, // end of getText(1)

  //=======================================================================
  // [OBJECT METHOD] Get the specified parameter from the query string. This
  // method is based on ideas from: https://kimmaker.com/ref/505
  getUrlParameter:function(theName) {
    if (theName===undefined) return "";
    theName=theName.replace(/[\[]/,"\\[").replace(/[\]]/,"\\]");
    var expression=new RegExp("[\\?&]"+theName+"=([^&#]*)");
    var results=expression.exec(this.queryString);
    return results===null?"":decodeURIComponent(results[1].replace(/\+/g," "));
  }, // end of getUrlParameter(1)

  //=======================================================================
  // [OBJECT METHOD] Print the key properties of the instantiated VanillaFix
  // object for logging.
  produceSignature:function() {
    return "---\n# Vanilla Fix Object"
    +" ("+this.scriptCompatibility+")"
    +"\n+ Instantiated on: "+this.objectDate.toString()
    +"\n+ jQuery version: "+jQuery.fn.jquery
    +"\n+ Target platform: "+this.platform
    +"\n+ Site described as: "+this.siteName
    +"\n+ List described as: "+this.listName
    +"\n+ Locale applied: "+this.locale
    +"\n+ Form customisation revision: "+this.revision
    +"\n+ Custom form layout used: "+this.isCustomLayoutUsed
    +"\n+ Form mode: "+this.formMode+" ("+this.formModeLiteral+")"
    +"\n+ Site URL: "+this.siteUrl
    +"\n+ Form URL: "+this.formUrl.replace(this.queryString,"")
    +"\n  + "+decodeURI(
      this.queryString.replace("?",String("")
      ).replace(/&/g,String("\n  + ")
      ).replace(/=/g,String(": "))
    );
  }, // end of produceSignature()

  //=======================================================================
  // [OBJECT METHOD] Remove the last occurrence of a specified series of
  // characters, such as a space followed by an asterisk, from a string.
  removeAppendedCharacters:function(theString,theChars) {
    if (theString===undefined) return "";
    if (theChars===undefined) return theString;
    if (theString.lastIndexOf(theChars)==theString.length-theChars.length) {
      theString=theString.substring(0,theString.length-theChars.length);
    }
    return theString;
  } // end of removeAppendedCharacters(2)
};

//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// Set derived object properties.
vf.setDerivedObjectProperties();


