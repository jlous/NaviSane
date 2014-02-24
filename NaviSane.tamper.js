// ==UserScript==
// @name        NaviSane
// @version     1.6
// @namespace   https://github.com/jlous/NaviSane
// @homepage    https://github.com/jlous/NaviSane
// @downloadURL https://github.com/jlous/NaviSane/raw/master/NaviSane.tamper.js
// @copyright   2013, Joachim Lous
// @description GUI-tweaks for timeføring
// @match       https://naviwep.steria.no/*
// @require     http://code.jquery.com/jquery-1.10.2.min.js
// ==/UserScript==


if ( !String.prototype.contains ) {
    String.prototype.contains = function() {
        return String.prototype.indexOf.apply( this, arguments ) !== -1;
    };
}

String.prototype.appearsIn = function() {
    return String.prototype.indexOf.apply( arguments[0], this ) !== -1;
};

function saneColumnHeaders(){
    var monthName = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    $("a[title^='Date']" ).each(function(){
        var title = $(this).attr("title")
        var month = Number(title.substr(10, 2));
        var day = Number(title.substr(12, 2));
        var date = monthName[month] + " " + day;
        $(this).append("<br>"+date);
    });
}

function saneCellAlignment(){
    $('span.riSingle').css('width','auto');
}

function sanePeriodHeader(){
    var headerSpan = $("#ctl00_ContentPlaceHolder1_LBL_CurrentPeriod");
    var oldTitle = headerSpan.text();
    var groups = /^(\d\d\.\d\d\.\d\d\d\d - \d\d\.\d\d\.\d\d\d\d) .Week(\d\d?).\d\d\d\d ?(\d?)/.exec(oldTitle);
    var dateRange = groups[1];
    var weekNo = groups[2];
    var weekPart = groups[3];
    var weekSep = weekPart.length>0 ? "." : ""; 
    var newText = "&nbsp;<b>Week " + weekNo + weekSep + weekPart + "</b>&nbsp; <span style='color:silver;font-size:smaller'>" + dateRange + "</span>";
    headerSpan.html(newText);
}

function currentPeriod(){
    var header = $("#ctl00_ContentPlaceHolder1_LBL_CurrentPeriod").text();
    return header.replace(/^.*(\d\d\.\d\d\.\d\d\d\d - \d\d\.\d\d\.\d\d\d\d).*$/, "$1");
}

function sanePeriodNavigation(){
    $(".CurrentPeriod").prepend("<button type='button' id='prevPeriod'>◀</button>");
    $(".CurrentPeriod").append("<button type='button' id='nextPeriod'>▶</button>");
    
    $("#prevPeriod").click(function() {
        var period = currentPeriod();
        var dropdown = $("#ctl00_ContentPlaceHolder1_PeriodDropdownList_Arrow").get(0);
        dropdown.click();
        var thisItem = $("li.rcbItem:contains('"+period+"')");
        thisItem.next().click();
    } );
    
    $("#nextPeriod").click(function() {
        var period = currentPeriod();
        var dropdown = $("#ctl00_ContentPlaceHolder1_PeriodDropdownList_Arrow").get(0);
        dropdown.click();
        var thisItem = $("li.rcbItem:contains('"+period+"')");
        thisItem.prev().click();
    } );
}

function saneCellWidths(){
	$("head").append("<style>.myclass { width: 40px !important; }</style>");
}

function killThoseEffingMenuAnimations(){
    Telerik.Web.UI.AnimationSettings.prototype.get_type = function(){return 0;}
    Telerik.Web.UI.AnimationSettings.prototype.get_duration = function(){return 0;}
    Telerik.Web.UI.RadMenu.prototype.get_collapseDelay = function(){return 0;}
}    


function onPeriodChange(handler){
    $(".CurrentPeriod").on("DOMNodeInserted", function(e){
        if (e.target.id == "ctl00_ContentPlaceHolder1_LBL_Approved"){
			handler();
        }
    });
}

function initPeriod(){
    saneColumnHeaders();
    saneCellAlignment();
    sanePeriodHeader();
}

function initPeriodDirectView(){
    sanePeriodNavigation();
    saneCellWidths();
    onPeriodChange(initPeriod);
    initPeriod();
}

function initSite(){
    killThoseEffingMenuAnimations();
}

function initPage(){
    initSite();
    if ("/period_direct.aspx".appearsIn(document.location.pathname)){
        initPeriodDirectView();
    }
}

initPage();

// TODO:
// zebraStripes()
// likeYesterdayShortcut()
// saneTabbingOrder()
// saneArrowKeys()

