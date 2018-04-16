"use strict";

/**
 *
 * @type {{textTypes: {searchHtml: {runningMessage: string, runningCountSelectorMessage: string, completeMessage: string}, replaceHtml: {runningMessage: string, runningCountSelectorMessage: string, completeMessage: string}, actualFile: string}, getRunningMode: logMessage.getRunningMode, displayRunningMessage: logMessage.displayRunningMessage, displayRunningCountSelectorMessage: logMessage.displayRunningCountSelectorMessage, displayCompleteMessage: logMessage.displayCompleteMessage, displayActualFile: logMessage.displayActualFile}}
 */
let logMessage = {
  textTypes: {
    'searchHtml': {
      'runningMessage': "found selector: {selector}",
      "runningCountSelectorMessage": "\nfound: {count} selector!",
      'completeMessage': "\n------------------------\nfound {countSelector} selectors in {countFiles} files!\n\n{runningMode} successful finished!",
    },
    'replaceHtml': {
      'runningMessage': "replaced: {selector}",
      "runningCountSelectorMessage": "\nreplaced: {count} selectors!",
      'completeMessage': "\n------------------------\nreplaced {countSelector} selectors in {countFiles} files!\n\n{runningMode} successful finished!",
    },
    'actualFile': "\n\n------------------------\nfile: {actualFile}\n"
  },
  getRunningMode: function (runningMode) {
    return (runningMode === 'searchCss' || runningMode === 'searchJs') ? 'searchHtml' : runningMode;
  },
  displayRunningMessage: function (selector, runningMode) {
    console.log(logMessage.textTypes[logMessage.getRunningMode(runningMode)].runningMessage.replace("{selector}", selector));
  },
  displayRunningCountSelectorMessage: function (count, runningMode) {
    console.log(logMessage.textTypes[logMessage.getRunningMode(runningMode)].runningCountSelectorMessage.replace("{count}", count));
  },
  displayCompleteMessage: function (countSelector, countFiles, runningMode) {
    console.log(logMessage.textTypes[logMessage.getRunningMode(runningMode)].completeMessage.replace("{countSelector}", countSelector).replace("{countFiles}", countFiles).replace('{runningMode}', runningMode));
  },
  displayActualFile: function (actualFile) {
    console.log(logMessage.textTypes.actualFile.replace("{actualFile}", actualFile));
  }
};

module.exports = logMessage;