// ==UserScript==
// @name        Crafting Link Generator for gw2efficiency.com
// @version     1.4
// @author      Felodin
// @description Generates a link with the desired format and opens it in a new window
// @match     https://metabattle.com/wiki/Build:*
// @match     https://snowcrows.com/builds/*
// @match     https://hardstuck.gg/gw2/builds/*
// @grant       none
// ==/UserScript==


(function() {
    'use strict';

    // Add a button to the page
    const button = document.createElement('button');
    button.innerHTML = 'Generate crafting link for gw2efficiency.com';
    button.title = 'Please be aware that crafting ascended items is part of the endgame. In most cases you can easily get and use exotic gear for the same purpose with only marginal changes in stats. Crafting could be rather expensive. Do at your own accord.'
    button.style.cssText = 'margin: 10px;';
    button.style.position = "fixed";
    button.style.top = "10%";
    button.style.left = "50%";
    button.style.transform = "translate(-50%, -50%)";
    button.style.zIndex = "9999";
    document.body.appendChild(button);

    // Add an event listener to the button that generates the link and opens it in a new window when clicked
    button.addEventListener('click', function() {
        // Get the current URL
        const url = window.location.href;

        let divs;
        let idsAttribute;

        // Check the URL to determine which website is being used
        if (url.includes('metabattle.com')) {
            // For metabattle.com, get all the divs with the data-armory-ids attribute that are inside the divs with the class "equipment-slot"
            divs = document.querySelectorAll('.equipment-slot div[data-armory-ids]');
            idsAttribute = 'data-armory-ids';
        } else if (url.includes('snowcrows.com')) {
            // For snowcrows.com, get all the divs with the data-armory-ids attribute that are inside the divs with the class "equipment-slot"
            divs = document.querySelectorAll('td div[data-armory-ids]');
            idsAttribute = 'data-armory-ids';
        } else if (url.includes('hardstuck.gg')) {
            // For hardstuck.gg, get all the divs with the objid attribute inside the divs with the class "horizontal-scroll-item"
            divs = document.querySelectorAll('.armors gw2object[objid], .weapons gw2object[objid], .trinkets gw2object[objid], .food gw2object[objid], .infusions gw2object[objid]');
            idsAttribute = 'objid';
        }
        // Create an object to store the <ammount>-<itemid> pairs and their counts
        const pairs = {};

        // Loop through the divs and extract the <ammount>-<itemid> pairs
        divs.forEach(function(div) {
            const ids = div.getAttribute(idsAttribute).split(',');
            ids.forEach(function(id) {
                // Skip the divs with data-armory-ids="-1" or objid="-1"
                if (id.trim() === "-1") {
                    return;
                }
                let pair;
                if (idsAttribute === 'data-armory-ids') {
                    // For metabattle.com and snowcrows.com, use the div.textContent as the ammount and the id as the itemid
                    pair = `${div.textContent.trim()}-${id.trim()}`;
                } else {
                    // For hardstuck.gg, use the id as the itemid
                    pair = `${id.trim()}`;
                }
                // If the pair is already in the object, increment its count by 1
                if (pair in pairs) {
                    pairs[pair]++;
                } else {
                    // Otherwise, add the pair to the object with a count of 1
                    pairs[pair] = 1;
                }
            });
        });

        // Convert the pairs object into an array of strings in the format "<ammount>x<itemid>"
        const pairsArray = [];
        for (const pair in pairs) {
            pairsArray.push(`${pairs[pair]}x${pair}`);
        }

        // Join the pairs array into a string and add it to the end of the link
        const link = `https://gw2efficiency.com/crafting/calculator/a~0!b~0!c~0!d~${pairsArray.join(';')}`;

        // Open the link in a new window
        window.open(link, '_blank');
    });
})();
