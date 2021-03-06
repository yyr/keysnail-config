// ========================== KeySnail Init File =========================== //

// You can preserve your code in this area when generating the init file using GUI.
// Put all your code except special key, set*key, hook, blacklist.
// ========================================================================= //
//{{%PRESERVE%
// Put your codes here
// Exts {{ ================================================================== //

plugins.options["tanything_opt.keymap"] = {
    "C-z"   : "prompt-toggle-edit-mode",
    "SPC"   : "prompt-next-page",
    "b"     : "prompt-previous-page",
    "j"     : "prompt-next-completion",
    "k"     : "prompt-previous-completion",
    "g"     : "prompt-beginning-of-candidates",
    "G"     : "prompt-end-of-candidates",
    "D"     : "prompt-cancel",
    // Tanything specific actions
    "o"      : "localOpen",
    "d"     : "localClose",
    "2"     : "localOpenbelow",
    "3"     : "localOpenright",
    "q"     : "localDomainclose",
    "c"     : "localClipUT",
    "C"     : "localClipU",
    "e"     : "localMovetoend",
    "p"     : "localTogglePin"
};

prompt.rows = 12;
prompt.useMigemo = false;
prompt.migemoMinWordLength = 2;
prompt.displayDelayTime = 50;
command.kill.killRingMax = 100;
command.kill.textLengthMax = 8192;


// stop searching by hit Enter on search box
function emacslike_search(ev){
    if(ev.ctrlKey && ev.charCode == 115){ // C-s
        gFindBar.onFindAgainCommand(false);
    }
    if(ev.keyCode == 13){ // Enter
        gFindBar.onFindAgainCommand(true);
        gFindBar.close();
    }
    //TODO: save searching start point and back to it when searching is finished with C-g
}

if ('gFindBar' in window) {
    gFindBar.getElement("findbar-textbox")
        .addEventListener("keypress", emacslike_search, false);
}


ext.add("list-closed-tabs", function () {
    const fav = "chrome://mozapps/skin/places/defaultFavicon.png";
    var ss   = Cc["@mozilla.org/browser/sessionstore;1"].getService(Ci.nsISessionStore);
    var json = Cc["@mozilla.org/dom/json;1"].createInstance(Ci.nsIJSON);
    var closedTabs = [[tab.image || fav, tab.title] for each (tab in json.decode(ss.getClosedTabData(window)))];

    if (!closedTabs.length)
        return void display.echoStatusBar("No closed tabs", 2000);

    prompt.selector(
        {
            message    : "select tab to undo:",
            collection : closedTabs,
            flags      : [ICON | IGNORE, 0],
            callback   : function (i) { if (i >= 0) window.undoCloseTab(i); }
        });
}, "List closed tabs");

plugins.options["hok.hint_base_style"] = {
  position : 'absolute',
  zIndex : '2147483647',
  color : '#000',
  fontSize : '14px',
  fontFamily : 'monaco',
  fontWeight : 'normal',
  lineHeight : '14px',
  padding : '2px',
  margin : '0px',
  textTransform : 'lowercase'
};

plugins.options["hok.hint_color_link"] = 'rgba(255, 230, 0, 1)';
plugins.options["hok.hint_color_form"] = 'rgba(255, 105, 180, 1)';
plugins.options["hok.hint_color_focused"] = 'rgba(255, 0, 255, 1)';
plugins.options["hok.hint_color_candidates"] = 'rgba(255, 100, 255, 1)';

plugins.options['hok.selector'] = 'a, input:not([type="hidden"]), textarea, iframe, area, select, button, embed, *[onclick], *[onmouseover], *[onmousedown], *[onmouseup], *[oncommand], *[role="link"], *[role="button"]';

plugins.options["bmany.default_open_type"] = "tab";


// }} ======================================================================= //
plugins.options["hok.hint_keys"] = "huiopjklmn";
//}}%PRESERVE%
// ========================================================================= //

// ========================= Special key settings ========================== //

key.quitKey              = "C-g";
key.helpKey              = "<f1>";
key.escapeKey            = "C-q";
key.macroStartKey        = "<f9>";
key.macroEndKey          = "<f10>";
key.universalArgumentKey = "C-u";
key.negativeArgument1Key = "C--";
key.negativeArgument2Key = "C-M--";
key.negativeArgument3Key = "M--";
key.suspendKey           = "<f2>";

// ================================= Hooks ================================= //

hook.setHook('KeyBoardQuit', function (aEvent) {
    if (key.currentKeySequence.length) return;

    command.closeFindBar();

    let marked = command.marked(aEvent);

    if (util.isCaretEnabled()) {
        if (marked) {
            command.resetMark(aEvent);
        } else {
            if ("blur" in aEvent.target) aEvent.target.blur();

            gBrowser.focus();
            _content.focus();
        }
    } else {
        goDoCommand("cmd_selectNone");
    }

    if (KeySnail.windowType === "navigator:browser" && !marked) {
        key.generateKey(aEvent.originalTarget, KeyEvent.DOM_VK_ESCAPE, true);
    }
});


// ============================= Key bindings ============================== //

key.setGlobalKey(['C-x', '0'], function (ev, arg) {
  tileTabs.menuActions('untile',-1);
}, '現在のフレームを閉じる');

key.setGlobalKey(['C-x', '1'], function (ev, arg) {
  tileTabs.menuActions('view',null);
}, '現在のフレームを閉じる');

key.setGlobalKey(['C-x', '2'], function (ev, arg) {
  url = "http://google.com";
  tileTabs.menuActions('tilenew-below',null);
  tileTabs.menuActions('activate-below',null);
  if (url) window.loadURI(url);
}, '現在のフレームを閉じる');

key.setGlobalKey(['C-x', '3'], function (ev, arg) {
  tileTabs.menuActions('tilenew-right',null);
  tileTabs.menuActions('activate-right',null);
  command.focusToById("urlbar");
}, '現在のフレームを閉じる');

key.setGlobalKey(['C-x', 'g'], function (ev) {
  command.focusToById("searchbar");
}, 'Focus to the search bar', true);

key.setGlobalKey([['C-x', 't'], ['C-x', 'i']], function (ev) {
  command.focusElement(command.elementsRetrieverTextarea, 0);
}, 'Focus to the first textarea', true);

key.setGlobalKey([['C-x', 's'], ['C-c', 's']], function (ev, arg) {
    ext.exec('find-current-tab', arg, ev);
}, 'Find - find current tab', true);

key.setGlobalKey([['C-x', 'k'], ['M-.']], function (ev) {
  BrowserCloseTabOrWindow();
}, 'Close tab / window');

key.setGlobalKey(['C-x', 'K'], function (ev) {
  closeWindow(true);
}, 'Close the window');

key.setGlobalKey(['C-x', 'C-u'],  function (ev, arg) {
  let (elem = document.commandDispatcher.focusedElement) elem && elem.blur();
  gBrowser.focus();
  content.focus();
  ext.exec('list-closed-tabs', ev);
}, 'Undo closed tab');

key.setGlobalKey(['C-x', 'C-c'], function (ev) {
  goQuitApplication();
}, 'Exit Firefox', true);

// key.setGlobalKey(['C-x', 'C-f'], function (ev) {
//   BrowserOpenFileWindow();
// }, 'Open the local file', true);

key.setGlobalKey(['C-x', 'C-s'], function (ev, arg) {
  ext.exec('ril-open-text', arg, ev);
}, 'Pocket - Open Text View current tab', true);

key.setGlobalKey(['C-x', 'C-b'], function (ev, arg) {
  ext.exec("bmany-list-all-bookmarks", arg, ev);
}, 'bmany - List all bookmarks');

key.setGlobalKey(['C-x', 'r'], function (ev) {
  _content.focus();
  userscript.reload();
  display.echoStatusBar("Reloaded!", 300000000);
}, 'Reload the initialization file');

key.setGlobalKey(['C-x', 'p'], function (ev, arg) {
  KeySnail.openPreference();
}, 'open_preference', true);

key.setGlobalKey(['C-x', ']'], function (ev, arg) {
  ext.exec('hok-follow-next-link', arg, ev);
}, 'Follow next link', true);

key.setGlobalKey(['C-x', '['], function (ev, arg) {
  ext.exec('hok-follow-prev-link', arg, ev);
}, 'Follow previous link', true);

key.setGlobalKey(['C-x', 'C-t'], function (ev, arg) {
  ext.exec('firebug-toggle', arg, ev);
}, 'Firebug - toggle', true);

key.setGlobalKey(['C-x', 'e'], function (ev, arg) {
    ext.exec('edit_text', arg, ev);
}, 'edit by external editor', true);

key.setGlobalKey(['C-x', 'f'], function (ev, arg) {
  ext.exec('history-show', arg, ev);
}, 'History - Show reading list', true);

key.setGlobalKey(['C-x', 'C-n'], function (ev, arg) {
  OpenBrowserWindow();
}, 'convert tab to window');

key.setGlobalKey(['C-x', 'y'], function (ev, arg) {
    ext.exec('show-kill-ring-and-select-text-to-paste', arg, ev);
}, 'Show kill-ring and select text to paste', true);

key.setGlobalKey(['C-x', 'n'], function (ev, arg) {
  OpenBrowserWindow();
}, 'Open new window');


key.setGlobalKey(['C-c', 'C-c', 'C-v'], function (ev) {
  toJavaScriptConsole();
}, 'Display JavaScript console', true);

key.setGlobalKey(['C-c', 'C-c', 'C-c'], function (ev) {
  command.clearConsole();
}, 'Clear Javascript console', true);

key.setGlobalKey(['C-c', 'i'], function (ev, arg) {
  //stolen from keysnail's vi-style configuration
  util.setBoolPref("accessibility.browsewithcaret", !util.getBoolPref("accessibility.browsewithcaret"));
  if (util.isCaretEnabled()) {
    display.echoStatusBar("caret on!", 6000);
  } else {
    display.echoStatusBar("caret off!", 6000);
  }
}, 'Enter caret mode');

key.setGlobalKey(['C-c', 'z'], function (ev, arg) {
    command.setClipboardText(content.location.href);
    display.echoStatusBar(content.location.href, 6000);
}, 'copy_document_url');

key.setGlobalKey(['M-k'], function (ev, arg) {
    var p = document.getElementById("keysnail-prompt");
    if (p.hidden) {
        ext.exec('tanything', arg, ev);
      } else {
        document.getElementById("keysnail-prompt-textbox").focus();
        key.generateKey(ev.originalTarget, KeyEvent.DOM_VK_ESCAPE, true);
        prompt.finish(true);
      }
}, 'Toggle Prompt');

key.setGlobalKey('C-M-r', function (ev) {
  userscript.reload();
}, 'Reload the initialization file', true);

key.setGlobalKey('M-x', function (ev, arg) {
  ext.select(arg, ev);
}, 'List exts and execute selected one', true);

key.setGlobalKey([['C-m'], ['M-j']], function (ev) {
  BrowserBack();
}, 'Back');

key.setGlobalKey('M-w', function (ev) {
  command.copyRegion(ev);
}, 'Copy selected text', true);

key.setGlobalKey('C-r', function (ev) {
  command.iSearchBackward(ev);
}, 'Emacs like incremental search backward', true);

key.setGlobalKey('C-s', function (ev) {
  command.iSearchForward(ev);
}, 'Emacs like incremental search backward', true);


key.setGlobalKey('C-9', function (ev) {  
  _content.focus();
}, 'focus on page\'s content');

key.setGlobalKey('M-o', function (ev, arg) {
  ext.exec('hok-start-foreground-mode', arg, ev);
}, 'Start Hit a Hint foreground mode', true);

key.setGlobalKey('M-\'', function (ev, arg) {
  ext.exec('hok-start-background-mode', arg, ev);
}, 'Start Hit a Hint background mode', true);

key.setGlobalKey('M-"', function (ev, arg) {
  ext.exec('hok-start-continuous-mode', arg, ev);
}, 'Start Hit a Hint continuous mode', true);

key.setGlobalKey('C-,', function (ev) {
  BrowserForward();
}, 'Forward');

key.setGlobalKey('M-<left>', function (ev) {
  let browser = getBrowser();
  if (browser.mCurrentTab.previousSibling) {
    browser.moveTabTo(browser.mCurrentTab, browser.mCurrentTab._tPos - 1);
  } else {
    browser.moveTabTo(browser.mCurrentTab, browser.mTabContainer.childNodes.length - 1);
  }
}, 'Move selected tab to left');

key.setGlobalKey('M-<right>', function (ev) {
  let browser = getBrowser();
  if (browser.mCurrentTab.nextSibling) {
    browser.moveTabTo(browser.mCurrentTab, browser.mCurrentTab._tPos + 1);
  } else {
    browser.moveTabTo(browser.mCurrentTab, 0);
  }
}, 'Move selected tab to right');

key.setGlobalKey('M-d', function (ev) {
  command.deleteForwardWord(ev);
}, 'Delete forward word');

key.setGlobalKey('M-L', function (ev, arg) {
    ext.exec('find-all-tab', arg, ev);
}, 'find - find all tab', true);

key.setGlobalKey('M-u', function (ev) {
    // original code by gomita-san
    var uri = getBrowser().currentURI;
    if (uri.path == "/") return;
    var pathList = uri.path.split("/");
    if (!pathList.pop()) pathList.pop();
    loadURI(uri.prePath + pathList.join("/") + "/");
}, 'Go upper directory');

key.setGlobalKey('C-4', function (ev, arg) {
    var toolbox = document.getElementById("navigator-toolbox");
    toolbox.hidden = !toolbox.hidden;
    if (arg || !toolbox.hidden) {
        var statusbar = document.getElementById("status-bar");
        statusbar.hidden = toolbox.hidden;
    }
}, 'Switch pseudo fullscreen', true);

key.setGlobalKey('M-e', function (ev, arg) {
    ext.exec('hok-start-extended-mode', arg, ev);
}, 'Start Hit a Hint extended mode', true);

key.setViewKey([['C-n'], ['j'], [','], ['m']], function (ev) {
  key.generateKey(ev.originalTarget, KeyEvent.DOM_VK_DOWN, true);
}, 'Scroll line down');

key.setViewKey([['C-p'], ['k']], function (ev) {
  key.generateKey(ev.originalTarget, KeyEvent.DOM_VK_UP, true);
}, 'Scroll line up');

key.setViewKey([['C-f'], ['.']], function (ev) {
  key.generateKey(ev.originalTarget, KeyEvent.DOM_VK_RIGHT, true);
}, 'Scroll right');

key.setViewKey('C-b', function (ev) {
  key.generateKey(ev.originalTarget, KeyEvent.DOM_VK_LEFT, true);
}, 'Scroll left');

key.setViewKey('b', function (ev) {
  goDoCommand("cmd_scrollPageUp");
}, 'Scroll page up');

key.setViewKey('M-<', function (ev) {
  goDoCommand("cmd_scrollTop");
}, 'Scroll to the top of the page', true);

key.setViewKey('g', function (ev) {
  goDoCommand("cmd_scrollTop");
}, 'Scroll to the top of the page');

key.setViewKey('M->', function (ev) {
  goDoCommand("cmd_scrollBottom");
}, 'Scroll to the bottom of the page', true);

key.setViewKey('G', function (ev) {
  goDoCommand("cmd_scrollBottom");
}, 'Scroll to the bottom of the page');

key.setViewKey(';', function (ev) {
  getBrowser().mTabContainer.advanceSelectedTab(1, true);
}, 'Select next tab');

key.setViewKey('h', function (ev) {
  getBrowser().mTabContainer.advanceSelectedTab(-1, true);
}, 'Select previous tab');

key.setViewKey(':', function (ev, arg) {
  shell.input(null, arg);
}, 'List and execute commands', true);

key.setViewKey('r', function (ev) {
  BrowserReload();
}, 'Reload the page', true);

key.setViewKey(['C-x', 'h'], function (ev) {
  goDoCommand("cmd_selectAll");
}, 'Select all', true);

key.setViewKey('i', function (ev) {
  command.focusElement(command.elementsRetrieverTextarea, 0);
}, 'Focus to the first textarea', true);

key.setViewKey('M-p', function (ev) {
  command.walkInputElement(command.elementsRetrieverButton, true, true);
}, 'Focus to the next button');

key.setViewKey('M-n', function (ev) {
  command.walkInputElement(command.elementsRetrieverButton, false, true);
}, 'Focus to the previous button');

key.setEditKey(['C-x', 'h'], function (ev) {
  command.selectAll(ev);
}, 'Select whole text', true);

key.setEditKey(['C-x', 'r', 'd'], function (ev, arg) {
  command.replaceRectangle(ev.originalTarget, "", false, !arg);
}, 'Delete text in the region-rectangle', true);

key.setEditKey(['C-x', 'r', 't'], function (ev) {
  prompt.read("String rectangle: ", function (aStr, aInput) {
    command.replaceRectangle(aInput, aStr);
  },
              ev.originalTarget);
}, 'Replace text in the region-rectangle with user inputted string', true);

key.setEditKey(['C-x', 'r', 'o'], function (ev) {
  command.openRectangle(ev.originalTarget);
}, 'Blank out the region-rectangle, shifting text right', true);

key.setEditKey(['C-x', 'r', 'k'], function (ev, arg) {
  command.kill.buffer = command.killRectangle(ev.originalTarget, !arg);
}, 'Delete the region-rectangle and save it as the last killed one', true);

key.setEditKey(['C-x', 'r', 'y'], function (ev) {
  command.yankRectangle(ev.originalTarget, command.kill.buffer);
}, 'Yank the last killed rectangle with upper left corner at point', true);

key.setEditKey(['C-x', 'v'], function (ev) {
  if (!command.kill.ring.length)
    return;

  let (ct = command.getClipboardText())
    (!command.kill.ring.length || ct != command.kill.ring[0]) && command.pushKillRing(ct);

  prompt.selector(
    {
      message: "Paste:",
      collection: command.kill.ring,
      callback: function (i) { if (i >= 0) key.insertText(command.kill.ring[i]); }
    }
  );
}, 'Show kill-ring and select text to paste', true);

key.setEditKey(['C-x', 'C-k'], function (ev) {
    goDoCommand("cmd_copy");
    goDoCommand("cmd_delete");
    command.resetMark(ev);
}, 'Cut current region');

key.setEditKey([['C-SPC'], ['C-@']], function (ev) {
  command.setMark(ev);
}, 'Set the mark', true);

key.setEditKey('C-o', function (ev) {
  command.openLine(ev);
}, 'Open line');

key.setEditKey('C-a', function (ev) {
  command.beginLine(ev);
}, 'Beginning of the line');

key.setEditKey('C-e', function (ev) {
  command.endLine(ev);
}, 'End of the line');

key.setEditKey('C-f', function (ev) {
  command.nextChar(ev);
}, 'Forward char');

key.setEditKey('C-b', function (ev) {
  command.previousChar(ev);
}, 'Backward char');

key.setEditKey('M-f', function (ev) {
  command.forwardWord(ev);
}, 'Next word');

key.setEditKey('M-b', function (ev) {
  command.backwardWord(ev);
}, 'Previous word');

key.setEditKey('C-n', function (ev) {
  command.nextLine(ev);
}, 'Next line');

key.setEditKey('C-p', function (ev) {
  command.previousLine(ev);
}, 'Previous line');

key.setEditKey('M-<', function (ev) {
  command.moveTop(ev);
}, 'Beginning of the text area');

key.setEditKey('M->', function (ev) {
  command.moveBottom(ev);
}, 'End of the text area');

key.setEditKey('C-d', function (ev) {
  goDoCommand("cmd_deleteCharForward");
}, 'Delete forward char');

key.setEditKey('C-h', function (ev) {
  goDoCommand("cmd_deleteCharBackward");
}, 'Delete backward char');

key.setEditKey('M-u', function (ev, arg) {
  command.wordCommand(ev, arg, command.upcaseForwardWord, command.upcaseBackwardWord);
}, 'Convert following word to upper case');

key.setEditKey('M-l', function (ev, arg) {
  command.wordCommand(ev, arg, command.downcaseForwardWord, command.downcaseBackwardWord);
}, 'Convert following word to lower case');

key.setEditKey('C-k', function (ev) {
  command.killLine(ev);
}, 'Kill the rest of the line');

key.setEditKey('C-v', command.yank, 'Paste (Yank)');

key.setEditKey('M-v', command.yankPop, 'Paste pop (Yank pop)', true);

key.setCaretKey([['C-a'], ['^']], function (ev) {
  ev.target.ksMarked ? goDoCommand("cmd_selectBeginLine") : goDoCommand("cmd_beginLine");
}, 'Move caret to the beginning of the line');

key.setCaretKey([['C-e'], ['$'], ['M->'], ['G']], function (ev) {
  ev.target.ksMarked ? goDoCommand("cmd_selectEndLine") : goDoCommand("cmd_endLine");
}, 'Move caret to the end of the line');

key.setCaretKey([['C-n'], ['j']], function (ev) {
  ev.target.ksMarked ? goDoCommand("cmd_selectLineNext") : goDoCommand("cmd_scrollLineDown");
}, 'Move caret to the next line');

key.setCaretKey([['C-p'], ['k']], function (ev) {
  ev.target.ksMarked ? goDoCommand("cmd_selectLinePrevious") : goDoCommand("cmd_scrollLineUp");
}, 'Move caret to the previous line');

key.setCaretKey([['C-f'], ['l']], function (ev) {
  ev.target.ksMarked ? goDoCommand("cmd_selectCharNext") : goDoCommand("cmd_scrollRight");
}, 'Move caret to the right');

key.setCaretKey([['C-b'], ['h'], ['C-h']], function (ev) {
  ev.target.ksMarked ? goDoCommand("cmd_selectCharPrevious") : goDoCommand("cmd_scrollLeft");
}, 'Move caret to the left');

key.setCaretKey([['M-f'], ['w']], function (ev) {
  ev.target.ksMarked ? goDoCommand("cmd_selectWordNext") : goDoCommand("cmd_wordNext");
}, 'Move caret to the right by word');

key.setCaretKey([['M-b'], ['W']], function (ev) {
  ev.target.ksMarked ? goDoCommand("cmd_selectWordPrevious") : goDoCommand("cmd_wordPrevious");
}, 'Move caret to the left by word');

key.setCaretKey([['C-v'], ['SPC']], function (ev) {
  ev.target.ksMarked ? goDoCommand("cmd_selectPageNext") : goDoCommand("cmd_movePageDown");
}, 'Move caret down by page');

key.setCaretKey([['M-v'], ['b']], function (ev) {
  ev.target.ksMarked ? goDoCommand("cmd_selectPagePrevious") : goDoCommand("cmd_movePageUp");
}, 'Move caret up by page');

key.setCaretKey([['M-<'], ['g']], function (ev) {
  ev.target.ksMarked ? goDoCommand("cmd_selectTop") : goDoCommand("cmd_scrollTop");
}, 'Move caret to the top of the page');

key.setCaretKey('J', function (ev) {
  util.getSelectionController().scrollLine(true);
}, 'Scroll line down');

key.setCaretKey('K', function (ev) {
  util.getSelectionController().scrollLine(false);
}, 'Scroll line up');

key.setCaretKey([['C-SPC'], ['C-@']], function (ev) {
  command.setMark(ev);
}, 'Set the mark', true);

key.setCaretKey(['C-x', 'h'], function (ev) {
  goDoCommand("cmd_selectAll");
}, 'Select all', true);

key.setCaretKey('i', function (ev) {
  command.focusElement(command.elementsRetrieverTextarea, 0);
}, 'Focus to the first textarea', true);

key.setCaretKey('n', function (ev) {
  command.walkInputElement(command.elementsRetrieverButton, true, true);
}, 'Focus to the next button');

key.setCaretKey('p', function (ev) {
  command.walkInputElement(command.elementsRetrieverButton, false, true);
}, 'Focus to the previous button');

key.setGlobalKey(['C-x', 'd'], function (ev, arg) {
    // ext.exec('downloadbar-tgglky', arg, ev);
    DownloadBar.tgglbr();
}, 'Toggle Download Statusbar Mode', true);

key.setGlobalKey('M-p', function (ev, arg) {
  ext.exec("hok-start-extended-mode", aArg);
}, 'Start Hit a Hint foreground mode', true);

key.setGlobalKey('M-h', function (ev) {
    getBrowser().mTabContainer.advanceSelectedTab(-1, true);    
  // selectedTabIndex = _.indexOf(gBrowser.tabs, gBrowser.selectedTab)
  // if (selectedTabIndex === 0) {
  //   previousTabIndex = gBrowser.tabs.length
  // } else {
  //   previousTabIndex = selectedTabIndex - 1
  // }
  // display.echoStatusBar(!gBrowser.tabs[nextTabIndex].hasAttribute("tiletabs-assigned"), 60000);
    _content.focus();  
  // }, 'Select next tab');
});

key.setGlobalKey('M-;', function (ev) {
    getBrowser().mTabContainer.advanceSelectedTab(1, true);    
  //   if (_.indexOf(gBrowser.tabs, gBrowser.selectedTab) < 1 ) {
  //     selectedTabIndex = 0;
  //   } else {
  //     selectedTabIndex = _.indexOf(gBrowser.tabs, gBrowser.selectedTab)
  //   }
  //   if (selectedTabIndex === 0) {
  //     previousTabIndex = gBrowser.tabs.length
  //   } else {
  //     previousTabIndex = selectedTabIndex - 1
  //   }
  //   nextTabIndex = selectedTabIndex + 1
  //   display.echoStatusBar(gBrowser.tabs[previousTabIndex].hasAttribute("tiletabs-assigned"), 60000);
  
  // // if (gBrowser.selectedTab.hasAttribute("tiletabs-assigned") && tileTabs.viewTiled) {
  //   tileTabs.menuActions('activate-left',null);
  // }  else  {
  // }
  _content.focus();  
}, 'Select next tab');


key.setGlobalKey(['C-x', 'C-z'], function (ev, arg) {
    var p = document.getElementById("keysnail-prompt");
    if (p.hidden)
        return;
    document.getElementById("keysnail-prompt-textbox").focus();
}, 'Focus to the prompt');

// And if you want C-g to force close the opened prompt, paste the code below to the bottom of your .keysnail.js file.
hook.setHook('KeyBoardQuit', function (ev) {
    util.rangeInterrupted = true;
    if (key.currentKeySequence.length)
        return;
    command.closeFindBar();

    var marked = command.marked(ev);

    if (util.isCaretEnabled())
    {
        if (marked)
            command.resetMark(ev);
        else
        {
            if ("blur" in ev.target)
                ev.target.blur();
            gBrowser.focus();
            _content.focus();
        }
    }
    else
    {
        goDoCommand("cmd_selectNone");
    }

    if (KeySnail.windowType === "navigator:browser" && !marked)
    {
        key.generateKey(ev.originalTarget, KeyEvent.DOM_VK_ESCAPE, true);
        prompt.finish(true);
    }
});
