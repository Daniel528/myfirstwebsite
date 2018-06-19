var PANEL_NORMAL_CLASS    = "panel";
var PANEL_COLLAPSED_CLASS = "panelcollapsed";
var PANEL_HEADING_TAG     = "h2";
var PANEL_CONTENT_CLASS   = "panelcontent";
var PANEL_COOKIE_NAME     = "panels";
var PANEL_ANIMATION_DELAY = 20; 
var PANEL_ANIMATION_STEPS = 10;

function setUpPanels()
{
	loadSettings();
	
	var HeadingTags = document.getElementsByTagName(PANEL_HEADING_TAG);
	
	for (var i=0; i<HeadingTags.length; i++)
	{
		var el = HeadingTags[i];
		
		if (el.parentNode.className != PANEL_NORMAL_CLASS && el.parentNode.className != PANEL_COLLAPSED_CLASS)
			continue;
		
		var name = el.firstChild.nodeValue;
	
		if (panelsStatus[name] == "false")
			el.parentNode.className = PANEL_COLLAPSED_CLASS;
		else
		if (panelsStatus[name] == "true")
			el.parentNode.className = PANEL_NORMAL_CLASS;
		else
		{
			panelsStatus[name] = (el.parentNode.className == PANEL_NORMAL_CLASS) ? "true" : "false";
		}
		
		el.onclick = function() 
		{
			var target    = this.parentNode;
			var name      = this.firstChild.nodeValue;
			var collapsed = (target.className == PANEL_COLLAPSED_CLASS);
			saveSettings(name, collapsed?"true":"false");
			animateTogglePanel(target, collapsed);
		};
	}
}


function animateTogglePanel(panel, expanding)
{
	var elements = panel.getElementsByTagName("div");
	var panelContent = null;
	for (var i=0; i<elements.length; i++)
	{
		if (elements[i].className == PANEL_CONTENT_CLASS)
		{
			panelContent = elements[i];
			break;
		}
	}
	
	panelContent.style.display = "block";
	
	var contentHeight = panelContent.offsetHeight;
	
	if (expanding)
		panelContent.style.height = "0px";
	
	var stepHeight = contentHeight / PANEL_ANIMATION_STEPS;
	var direction = (!expanding ? -1 : 1);
	
	setTimeout(function(){animateStep(panelContent,1,stepHeight,direction)}, PANEL_ANIMATION_DELAY);
}

function animateStep(panelContent, iteration, stepHeight, direction)
{
	if (iteration<PANEL_ANIMATION_STEPS)
	{
		panelContent.style.height = Math.round(((direction>0) ? iteration : 10 - iteration) * stepHeight) +"px";
		iteration++;
		setTimeout(function(){animateStep(panelContent,iteration,stepHeight,direction)}, PANEL_ANIMATION_DELAY);
	}
	else
	{
		panelContent.parentNode.className = (direction<0) ? PANEL_COLLAPSED_CLASS : PANEL_NORMAL_CLASS;
		panelContent.style.display = panelContent.style.height = "";
	}
}

function loadSettings()
{
	panelsStatus = {};
	
	var start = document.cookie.indexOf(PANEL_COOKIE_NAME + "=");
	if (start == -1) return;
	
	start += PANEL_COOKIE_NAME.length+1;
	
	var end = document.cookie.indexOf(";", start);
	if (end == -1) end = document.cookie.length;
	
	var cookieValue = unescape(document.cookie.substring(start, end));
	var PanelsData = cookieValue.split("|");
	
	for (var i=0; i< PanelsData.length; i++)
	{
		var pair = PanelsData[i].split(":");
		panelsStatus[pair[0]] = pair[1];
	}
}

function expandAll()
{
	for (var key in panelsStatus)
		saveSettings(key, "true");
		
	setUpPanels();
}

function collapseAll()
{
	for (var key in panelsStatus)
		saveSettings(key, "false");
		
	setUpPanels();
}

function saveSettings(key, value)
{
	panelsStatus[key] = value;
	
	var PanelsData = [];
	for (var key in panelsStatus)
		PanelsData.push(key+":"+panelsStatus[key]);
		
	var today = new Date();
	var expirationDate = new Date(today.getTime() + 365 * 1000 * 60 * 60 * 24);
	document.cookie = PANEL_COOKIE_NAME + "=" + escape(PanelsData.join("|")) + ";expires=" + expirationDate.toGMTString();
}
if (window.addEventListener)
{
	window.addEventListener("load", setUpPanels, false);
}
else 
if (window.attachEvent)
{
	window.attachEvent("onload", setUpPanels);
}