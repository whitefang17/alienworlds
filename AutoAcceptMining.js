// ==UserScript==
// @name         WAX Auto Accept Mining
// @namespace    wax.io
// @version      1.0.0
// @description  Auto Accept Signing for WAX.io
// @author       Likecyber
// @match        https://all-access.wax.io/cloud-wallet/signing/
// @grant        none
// ==/UserScript==

(function () {
    var WaitForReady = setInterval(function () {
        var tags_i = document.getElementsByTagName("button");
        var contractName = document.getElementsByClassName("simple-action-details")[0];
        if(!!contractName && contractName.outerText.includes("Call smart contract function m.federation > mine"))
        {
            for (var i = 0; i < tags_i.length; i++) {
            if (tags_i[i].textContent == "Approve") {
                var tags_j = document.getElementsByTagName("input");
                for (var j = 0; j < tags_j.length; j++) {
                    if (tags_j[j].value == "remember") {
                        break;
                    }
                }
                tags_i[i].click();
                clearInterval(WaitForReady);
                break;
            }
        }
        }
    }, 100);
})();
