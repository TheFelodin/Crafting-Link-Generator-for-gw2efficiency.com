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
            divs = document.querySelectorAll('gw2object[type=item]');
            idsAttribute = 'objid';
        }
        // Create an object to store the <ammount>-<itemid> pairs and their counts
        const pairs = {};

        // Loop through the divs and extract the <ammount>-<itemid> pairs
        divs.forEach(function(div) {
            div.getAttribute(idsAttribute).split(',').forEach(function(id) {
                // Skip the divs with data-armory-ids="-1" or objid="-1"
                if (id.trim() === "-1") {
                    return;
                }

                let item, count;
                if (idsAttribute === 'data-armory-ids') {
                    // For metabattle.com and snowcrows.com, use the div.textContent as the ammount and the id as the itemid
                    item = id.trim();
                    count = div.textContent.trim();
                } else {
                    // For hardstuck.gg, use the id as the itemid
                    item = translate_hs_item_id(parseInt(id), parseInt(div.getAttribute('stats')));
                    count = 1;
                }
                // `count` numbers of the item to the list of all items
                pairs[pair] = (pairs[pair] || 0) + count;
            });
        });

        // Convert the pairs object into an array of strings in the format "<ammount>x<itemid>"
        //TODO(Rennorb) @correctness: are we sure this shouldn't be `<ammount>-<itemid>` (dash in the middle instead of an `x`) ?
        const pairsArray = [];
        for (const [itemId, count] of Object.entries(pairs)) {
            pairsArray.push(`${count}x${itemId}`);
        }

        // Join the pairs array into a string and add it to the end of the link
        const link = `https://gw2efficiency.com/crafting/calculator/a~0!b~0!c~0!d~${pairsArray.join(';')}`;

        // Open the link in a new window
        window.open(link, '_blank');
    });

    /**
     * hs items use a basic dummy item and a corresponding stat id to render items, specifics can be found in the `ResolveDummyItemForWeaponType` function here:
     * https://github.com/HardstuckGuild/HsBuildCodes/blob/d5c84e3d66194b3518b3fbee00423ad37e71e203/include/php/8.0/Database/Static.php#L177
     * 
     * this function translates those into an itemid that can be crafted
     */
    function translate_hs_item_id(baseItemId, statId) {
        if(!statId) return baseItemId; // items like infusions don't have a stat id, so no need to translate

        switch(baseItemId)
        {
            //armor [l, m, h]
            // helmet
            case 85128: switch(statId) {
                case 1012: return @itemId; //Apostates
                case 605 : case 659 : case 664 : case 1043: return @itemId; //Apothecarys
                case 753 : case 1040: case 1128: return @itemId; //Assassins
                case 591 : case 600 : return @itemId; //Berserkers_and_Valkyrie
                case 161 : case 584 : case 599 : case 1046: case 1077: return @itemId; //Berserkers
                case 1032: case 1436: return @itemId; //Bringers
                case 660 : case 665 : case 1041: return @itemId; //Captains
                case 160 : case 1038: case 1075: return @itemId; //Carrion
                case 583 : case 602 : case 616 : case 1050: return @itemId; //Cavaliers
                case 559 : case 588 : case 593 : case 1052: return @itemId; //Celestial
                case 656 : case 661 : case 1044: case 1076: case 155 : return @itemId; //Clerics
                case 1125: case 1131: case 1227: case 1267: return @itemId; //Commanders
                case 1098: case 1109: case 1232: case 1271: return @itemId; //Crusader
                case 1014: return @itemId; //Deserters
                case 581 : case 596 : return @itemId; //Dire_and_Rabid
                case 754 : case 756 : case 1073: case 1114: return @itemId; //Dire
                case 1538: case 1539: case 1556: case 1566: return @itemId; //Diviners
                case 1681: case 1687: case 1691: case 1697: return @itemId; //Dragons
                case 1011: return @itemId; //Forsaken
                case 627 : case 628 : case 629 : case 630 : case 631: case 1030: case 1031: case 1070: case 1430: return @itemId; //Givers
                case 1329: case 1344: case 1366: case 1379: return @itemId; //Grieving
                case 1345: case 1363: case 1367: case 1377: return @itemId; //Harriers
                case 175 : return @itemId; //Healing
                case 149 : return @itemId; //Hearty
                case 152 : return @itemId; //Honed
                case 755 : return @itemId; //Hunters
                case 158 : case 657 : case 662 : case 1051: return @itemId; //Knights
                case 141 : return @itemId; //Lingering
                case 156 : case 1037: return @itemId; //Magis
                case 176 : return @itemId; //Malign
                case 1111: case 1145: case 1231: case 1263: return @itemId; //Marauder
                case 1337: case 1364: case 1374: case 1378: return @itemId; //Marshals
                case 147 : return @itemId; //Mending
                case 137 : return @itemId; //Mighty
                case 1123: case 1134: case 1226: case 1265: return @itemId; //Minstrels
                case 1026: case 1063: case 1066: return @itemId; //Nomads
                case 151 : return @itemId; //Penetrating
                case 1484: case 1486: case 1549: case 1559: return @itemId; //Plaguedoctors
                case 150 : return @itemId; //Potent
                case 138 : return @itemId; //Precise
                case 592 : case 595 : return @itemId; //Rabid_and_Apothecarys
                case 154 : case 585 : case 594 : case 1042: return @itemId; //Rabid
                case 159 : case 658 : case 663 : case 1047: case 1078: return @itemId; //Rampagers
                case 144 : return @itemId; //Ravaging
                case 145 : return @itemId; //Rejuvenating
                case 140 : return @itemId; //Resilient
                case 1686: case 1694: case 1706: case 1717: return @itemId; //Ritualists
                case 686 : case 1035: return @itemId; //Sentinels
                case 1220: case 1222: case 1230: case 1269: return @itemId; //Seraph
                case 690 : case 693 : case 700 : return @itemId; //Settlers
                case 153 : case 1071: case 1097: return @itemId; //Shamans
                case 1064: case 1065: case 1067: return @itemId; //Sinister
                case 162 : case 586 : case 601 : case 1048: return @itemId; //Soldiers
                case 148 : return @itemId; //Stout
                case 142 : return @itemId; //Strong
                case 1013: return @itemId; //Survivors
                case 1085: case 1115: case 1229: case 1262: return @itemId; //Trailblazers
                case 1015: return @itemId; //Vagabonds
                case 157 : case 1119: return @itemId; //Valkyrie
                case 1118: case 1139: case 1228: case 1264: return @itemId; //Vigilant
                case 146 : return @itemId; //Vigorous
                case 1130: case 1153: case 1224: case 1268: return @itemId; //Vipers
                case 139 : return @itemId; //Vital
                case 1140: case 1162: case 1225: case 1270: return @itemId; //Wanderers
                case 799 : case 1163: return @itemId; //Zealots2
            }
            case 84862: switch(statId) {
                case 1012: return @itemId; //Apostates
                case 605 : case 659 : case 664 : case 1043: return @itemId; //Apothecarys
                case 753 : case 1040: case 1128: return @itemId; //Assassins
                case 591 : case 600 : return @itemId; //Berserkers_and_Valkyrie
                case 161 : case 584 : case 599 : case 1046: case 1077: return @itemId; //Berserkers
                case 1032: case 1436: return @itemId; //Bringers
                case 660 : case 665 : case 1041: return @itemId; //Captains
                case 160 : case 1038: case 1075: return @itemId; //Carrion
                case 583 : case 602 : case 616 : case 1050: return @itemId; //Cavaliers
                case 559 : case 588 : case 593 : case 1052: return @itemId; //Celestial
                case 656 : case 661 : case 1044: case 1076: case 155 : return @itemId; //Clerics
                case 1125: case 1131: case 1227: case 1267: return @itemId; //Commanders
                case 1098: case 1109: case 1232: case 1271: return @itemId; //Crusader
                case 1014: return @itemId; //Deserters
                case 581 : case 596 : return @itemId; //Dire_and_Rabid
                case 754 : case 756 : case 1073: case 1114: return @itemId; //Dire
                case 1538: case 1539: case 1556: case 1566: return @itemId; //Diviners
                case 1681: case 1687: case 1691: case 1697: return @itemId; //Dragons
                case 1011: return @itemId; //Forsaken
                case 627 : case 628 : case 629 : case 630 : case 631: case 1030: case 1031: case 1070: case 1430: return @itemId; //Givers
                case 1329: case 1344: case 1366: case 1379: return @itemId; //Grieving
                case 1345: case 1363: case 1367: case 1377: return @itemId; //Harriers
                case 175 : return @itemId; //Healing
                case 149 : return @itemId; //Hearty
                case 152 : return @itemId; //Honed
                case 755 : return @itemId; //Hunters
                case 158 : case 657 : case 662 : case 1051: return @itemId; //Knights
                case 141 : return @itemId; //Lingering
                case 156 : case 1037: return @itemId; //Magis
                case 176 : return @itemId; //Malign
                case 1111: case 1145: case 1231: case 1263: return @itemId; //Marauder
                case 1337: case 1364: case 1374: case 1378: return @itemId; //Marshals
                case 147 : return @itemId; //Mending
                case 137 : return @itemId; //Mighty
                case 1123: case 1134: case 1226: case 1265: return @itemId; //Minstrels
                case 1026: case 1063: case 1066: return @itemId; //Nomads
                case 151 : return @itemId; //Penetrating
                case 1484: case 1486: case 1549: case 1559: return @itemId; //Plaguedoctors
                case 150 : return @itemId; //Potent
                case 138 : return @itemId; //Precise
                case 592 : case 595 : return @itemId; //Rabid_and_Apothecarys
                case 154 : case 585 : case 594 : case 1042: return @itemId; //Rabid
                case 159 : case 658 : case 663 : case 1047: case 1078: return @itemId; //Rampagers
                case 144 : return @itemId; //Ravaging
                case 145 : return @itemId; //Rejuvenating
                case 140 : return @itemId; //Resilient
                case 1686: case 1694: case 1706: case 1717: return @itemId; //Ritualists
                case 686 : case 1035: return @itemId; //Sentinels
                case 1220: case 1222: case 1230: case 1269: return @itemId; //Seraph
                case 690 : case 693 : case 700 : return @itemId; //Settlers
                case 153 : case 1071: case 1097: return @itemId; //Shamans
                case 1064: case 1065: case 1067: return @itemId; //Sinister
                case 162 : case 586 : case 601 : case 1048: return @itemId; //Soldiers
                case 148 : return @itemId; //Stout
                case 142 : return @itemId; //Strong
                case 1013: return @itemId; //Survivors
                case 1085: case 1115: case 1229: case 1262: return @itemId; //Trailblazers
                case 1015: return @itemId; //Vagabonds
                case 157 : case 1119: return @itemId; //Valkyrie
                case 1118: case 1139: case 1228: case 1264: return @itemId; //Vigilant
                case 146 : return @itemId; //Vigorous
                case 1130: case 1153: case 1224: case 1268: return @itemId; //Vipers
                case 139 : return @itemId; //Vital
                case 1140: case 1162: case 1225: case 1270: return @itemId; //Wanderers
                case 799 : case 1163: return @itemId; //Zealots2
            }
            case 85193: switch(statId) {
                case 1012: return @itemId; //Apostates
                case 605 : case 659 : case 664 : case 1043: return @itemId; //Apothecarys
                case 753 : case 1040: case 1128: return @itemId; //Assassins
                case 591 : case 600 : return @itemId; //Berserkers_and_Valkyrie
                case 161 : case 584 : case 599 : case 1046: case 1077: return @itemId; //Berserkers
                case 1032: case 1436: return @itemId; //Bringers
                case 660 : case 665 : case 1041: return @itemId; //Captains
                case 160 : case 1038: case 1075: return @itemId; //Carrion
                case 583 : case 602 : case 616 : case 1050: return @itemId; //Cavaliers
                case 559 : case 588 : case 593 : case 1052: return @itemId; //Celestial
                case 656 : case 661 : case 1044: case 1076: case 155 : return @itemId; //Clerics
                case 1125: case 1131: case 1227: case 1267: return @itemId; //Commanders
                case 1098: case 1109: case 1232: case 1271: return @itemId; //Crusader
                case 1014: return @itemId; //Deserters
                case 581 : case 596 : return @itemId; //Dire_and_Rabid
                case 754 : case 756 : case 1073: case 1114: return @itemId; //Dire
                case 1538: case 1539: case 1556: case 1566: return @itemId; //Diviners
                case 1681: case 1687: case 1691: case 1697: return @itemId; //Dragons
                case 1011: return @itemId; //Forsaken
                case 627 : case 628 : case 629 : case 630 : case 631: case 1030: case 1031: case 1070: case 1430: return @itemId; //Givers
                case 1329: case 1344: case 1366: case 1379: return @itemId; //Grieving
                case 1345: case 1363: case 1367: case 1377: return @itemId; //Harriers
                case 175 : return @itemId; //Healing
                case 149 : return @itemId; //Hearty
                case 152 : return @itemId; //Honed
                case 755 : return @itemId; //Hunters
                case 158 : case 657 : case 662 : case 1051: return @itemId; //Knights
                case 141 : return @itemId; //Lingering
                case 156 : case 1037: return @itemId; //Magis
                case 176 : return @itemId; //Malign
                case 1111: case 1145: case 1231: case 1263: return @itemId; //Marauder
                case 1337: case 1364: case 1374: case 1378: return @itemId; //Marshals
                case 147 : return @itemId; //Mending
                case 137 : return @itemId; //Mighty
                case 1123: case 1134: case 1226: case 1265: return @itemId; //Minstrels
                case 1026: case 1063: case 1066: return @itemId; //Nomads
                case 151 : return @itemId; //Penetrating
                case 1484: case 1486: case 1549: case 1559: return @itemId; //Plaguedoctors
                case 150 : return @itemId; //Potent
                case 138 : return @itemId; //Precise
                case 592 : case 595 : return @itemId; //Rabid_and_Apothecarys
                case 154 : case 585 : case 594 : case 1042: return @itemId; //Rabid
                case 159 : case 658 : case 663 : case 1047: case 1078: return @itemId; //Rampagers
                case 144 : return @itemId; //Ravaging
                case 145 : return @itemId; //Rejuvenating
                case 140 : return @itemId; //Resilient
                case 1686: case 1694: case 1706: case 1717: return @itemId; //Ritualists
                case 686 : case 1035: return @itemId; //Sentinels
                case 1220: case 1222: case 1230: case 1269: return @itemId; //Seraph
                case 690 : case 693 : case 700 : return @itemId; //Settlers
                case 153 : case 1071: case 1097: return @itemId; //Shamans
                case 1064: case 1065: case 1067: return @itemId; //Sinister
                case 162 : case 586 : case 601 : case 1048: return @itemId; //Soldiers
                case 148 : return @itemId; //Stout
                case 142 : return @itemId; //Strong
                case 1013: return @itemId; //Survivors
                case 1085: case 1115: case 1229: case 1262: return @itemId; //Trailblazers
                case 1015: return @itemId; //Vagabonds
                case 157 : case 1119: return @itemId; //Valkyrie
                case 1118: case 1139: case 1228: case 1264: return @itemId; //Vigilant
                case 146 : return @itemId; //Vigorous
                case 1130: case 1153: case 1224: case 1268: return @itemId; //Vipers
                case 139 : return @itemId; //Vital
                case 1140: case 1162: case 1225: case 1270: return @itemId; //Wanderers
                case 799 : case 1163: return @itemId; //Zealots2
            }
            // shoulders
            case 84918: switch(statId) {
                case 1012: return @itemId; //Apostates
                case 605 : case 659 : case 664 : case 1043: return @itemId; //Apothecarys
                case 753 : case 1040: case 1128: return @itemId; //Assassins
                case 591 : case 600 : return @itemId; //Berserkers_and_Valkyrie
                case 161 : case 584 : case 599 : case 1046: case 1077: return @itemId; //Berserkers
                case 1032: case 1436: return @itemId; //Bringers
                case 660 : case 665 : case 1041: return @itemId; //Captains
                case 160 : case 1038: case 1075: return @itemId; //Carrion
                case 583 : case 602 : case 616 : case 1050: return @itemId; //Cavaliers
                case 559 : case 588 : case 593 : case 1052: return @itemId; //Celestial
                case 656 : case 661 : case 1044: case 1076: case 155 : return @itemId; //Clerics
                case 1125: case 1131: case 1227: case 1267: return @itemId; //Commanders
                case 1098: case 1109: case 1232: case 1271: return @itemId; //Crusader
                case 1014: return @itemId; //Deserters
                case 581 : case 596 : return @itemId; //Dire_and_Rabid
                case 754 : case 756 : case 1073: case 1114: return @itemId; //Dire
                case 1538: case 1539: case 1556: case 1566: return @itemId; //Diviners
                case 1681: case 1687: case 1691: case 1697: return @itemId; //Dragons
                case 1011: return @itemId; //Forsaken
                case 627 : case 628 : case 629 : case 630 : case 631: case 1030: case 1031: case 1070: case 1430: return @itemId; //Givers
                case 1329: case 1344: case 1366: case 1379: return @itemId; //Grieving
                case 1345: case 1363: case 1367: case 1377: return @itemId; //Harriers
                case 175 : return @itemId; //Healing
                case 149 : return @itemId; //Hearty
                case 152 : return @itemId; //Honed
                case 755 : return @itemId; //Hunters
                case 158 : case 657 : case 662 : case 1051: return @itemId; //Knights
                case 141 : return @itemId; //Lingering
                case 156 : case 1037: return @itemId; //Magis
                case 176 : return @itemId; //Malign
                case 1111: case 1145: case 1231: case 1263: return @itemId; //Marauder
                case 1337: case 1364: case 1374: case 1378: return @itemId; //Marshals
                case 147 : return @itemId; //Mending
                case 137 : return @itemId; //Mighty
                case 1123: case 1134: case 1226: case 1265: return @itemId; //Minstrels
                case 1026: case 1063: case 1066: return @itemId; //Nomads
                case 151 : return @itemId; //Penetrating
                case 1484: case 1486: case 1549: case 1559: return @itemId; //Plaguedoctors
                case 150 : return @itemId; //Potent
                case 138 : return @itemId; //Precise
                case 592 : case 595 : return @itemId; //Rabid_and_Apothecarys
                case 154 : case 585 : case 594 : case 1042: return @itemId; //Rabid
                case 159 : case 658 : case 663 : case 1047: case 1078: return @itemId; //Rampagers
                case 144 : return @itemId; //Ravaging
                case 145 : return @itemId; //Rejuvenating
                case 140 : return @itemId; //Resilient
                case 1686: case 1694: case 1706: case 1717: return @itemId; //Ritualists
                case 686 : case 1035: return @itemId; //Sentinels
                case 1220: case 1222: case 1230: case 1269: return @itemId; //Seraph
                case 690 : case 693 : case 700 : return @itemId; //Settlers
                case 153 : case 1071: case 1097: return @itemId; //Shamans
                case 1064: case 1065: case 1067: return @itemId; //Sinister
                case 162 : case 586 : case 601 : case 1048: return @itemId; //Soldiers
                case 148 : return @itemId; //Stout
                case 142 : return @itemId; //Strong
                case 1013: return @itemId; //Survivors
                case 1085: case 1115: case 1229: case 1262: return @itemId; //Trailblazers
                case 1015: return @itemId; //Vagabonds
                case 157 : case 1119: return @itemId; //Valkyrie
                case 1118: case 1139: case 1228: case 1264: return @itemId; //Vigilant
                case 146 : return @itemId; //Vigorous
                case 1130: case 1153: case 1224: case 1268: return @itemId; //Vipers
                case 139 : return @itemId; //Vital
                case 1140: case 1162: case 1225: case 1270: return @itemId; //Wanderers
                case 799 : case 1163: return @itemId; //Zealots2
            }
            case 85182: switch(statId) {
                case 1012: return @itemId; //Apostates
                case 605 : case 659 : case 664 : case 1043: return @itemId; //Apothecarys
                case 753 : case 1040: case 1128: return @itemId; //Assassins
                case 591 : case 600 : return @itemId; //Berserkers_and_Valkyrie
                case 161 : case 584 : case 599 : case 1046: case 1077: return @itemId; //Berserkers
                case 1032: case 1436: return @itemId; //Bringers
                case 660 : case 665 : case 1041: return @itemId; //Captains
                case 160 : case 1038: case 1075: return @itemId; //Carrion
                case 583 : case 602 : case 616 : case 1050: return @itemId; //Cavaliers
                case 559 : case 588 : case 593 : case 1052: return @itemId; //Celestial
                case 656 : case 661 : case 1044: case 1076: case 155 : return @itemId; //Clerics
                case 1125: case 1131: case 1227: case 1267: return @itemId; //Commanders
                case 1098: case 1109: case 1232: case 1271: return @itemId; //Crusader
                case 1014: return @itemId; //Deserters
                case 581 : case 596 : return @itemId; //Dire_and_Rabid
                case 754 : case 756 : case 1073: case 1114: return @itemId; //Dire
                case 1538: case 1539: case 1556: case 1566: return @itemId; //Diviners
                case 1681: case 1687: case 1691: case 1697: return @itemId; //Dragons
                case 1011: return @itemId; //Forsaken
                case 627 : case 628 : case 629 : case 630 : case 631: case 1030: case 1031: case 1070: case 1430: return @itemId; //Givers
                case 1329: case 1344: case 1366: case 1379: return @itemId; //Grieving
                case 1345: case 1363: case 1367: case 1377: return @itemId; //Harriers
                case 175 : return @itemId; //Healing
                case 149 : return @itemId; //Hearty
                case 152 : return @itemId; //Honed
                case 755 : return @itemId; //Hunters
                case 158 : case 657 : case 662 : case 1051: return @itemId; //Knights
                case 141 : return @itemId; //Lingering
                case 156 : case 1037: return @itemId; //Magis
                case 176 : return @itemId; //Malign
                case 1111: case 1145: case 1231: case 1263: return @itemId; //Marauder
                case 1337: case 1364: case 1374: case 1378: return @itemId; //Marshals
                case 147 : return @itemId; //Mending
                case 137 : return @itemId; //Mighty
                case 1123: case 1134: case 1226: case 1265: return @itemId; //Minstrels
                case 1026: case 1063: case 1066: return @itemId; //Nomads
                case 151 : return @itemId; //Penetrating
                case 1484: case 1486: case 1549: case 1559: return @itemId; //Plaguedoctors
                case 150 : return @itemId; //Potent
                case 138 : return @itemId; //Precise
                case 592 : case 595 : return @itemId; //Rabid_and_Apothecarys
                case 154 : case 585 : case 594 : case 1042: return @itemId; //Rabid
                case 159 : case 658 : case 663 : case 1047: case 1078: return @itemId; //Rampagers
                case 144 : return @itemId; //Ravaging
                case 145 : return @itemId; //Rejuvenating
                case 140 : return @itemId; //Resilient
                case 1686: case 1694: case 1706: case 1717: return @itemId; //Ritualists
                case 686 : case 1035: return @itemId; //Sentinels
                case 1220: case 1222: case 1230: case 1269: return @itemId; //Seraph
                case 690 : case 693 : case 700 : return @itemId; //Settlers
                case 153 : case 1071: case 1097: return @itemId; //Shamans
                case 1064: case 1065: case 1067: return @itemId; //Sinister
                case 162 : case 586 : case 601 : case 1048: return @itemId; //Soldiers
                case 148 : return @itemId; //Stout
                case 142 : return @itemId; //Strong
                case 1013: return @itemId; //Survivors
                case 1085: case 1115: case 1229: case 1262: return @itemId; //Trailblazers
                case 1015: return @itemId; //Vagabonds
                case 157 : case 1119: return @itemId; //Valkyrie
                case 1118: case 1139: case 1228: case 1264: return @itemId; //Vigilant
                case 146 : return @itemId; //Vigorous
                case 1130: case 1153: case 1224: case 1268: return @itemId; //Vipers
                case 139 : return @itemId; //Vital
                case 1140: case 1162: case 1225: case 1270: return @itemId; //Wanderers
                case 799 : case 1163: return @itemId; //Zealots2
            }
            case 84875: switch(statId) {
                case 1012: return @itemId; //Apostates
                case 605 : case 659 : case 664 : case 1043: return @itemId; //Apothecarys
                case 753 : case 1040: case 1128: return @itemId; //Assassins
                case 591 : case 600 : return @itemId; //Berserkers_and_Valkyrie
                case 161 : case 584 : case 599 : case 1046: case 1077: return @itemId; //Berserkers
                case 1032: case 1436: return @itemId; //Bringers
                case 660 : case 665 : case 1041: return @itemId; //Captains
                case 160 : case 1038: case 1075: return @itemId; //Carrion
                case 583 : case 602 : case 616 : case 1050: return @itemId; //Cavaliers
                case 559 : case 588 : case 593 : case 1052: return @itemId; //Celestial
                case 656 : case 661 : case 1044: case 1076: case 155 : return @itemId; //Clerics
                case 1125: case 1131: case 1227: case 1267: return @itemId; //Commanders
                case 1098: case 1109: case 1232: case 1271: return @itemId; //Crusader
                case 1014: return @itemId; //Deserters
                case 581 : case 596 : return @itemId; //Dire_and_Rabid
                case 754 : case 756 : case 1073: case 1114: return @itemId; //Dire
                case 1538: case 1539: case 1556: case 1566: return @itemId; //Diviners
                case 1681: case 1687: case 1691: case 1697: return @itemId; //Dragons
                case 1011: return @itemId; //Forsaken
                case 627 : case 628 : case 629 : case 630 : case 631: case 1030: case 1031: case 1070: case 1430: return @itemId; //Givers
                case 1329: case 1344: case 1366: case 1379: return @itemId; //Grieving
                case 1345: case 1363: case 1367: case 1377: return @itemId; //Harriers
                case 175 : return @itemId; //Healing
                case 149 : return @itemId; //Hearty
                case 152 : return @itemId; //Honed
                case 755 : return @itemId; //Hunters
                case 158 : case 657 : case 662 : case 1051: return @itemId; //Knights
                case 141 : return @itemId; //Lingering
                case 156 : case 1037: return @itemId; //Magis
                case 176 : return @itemId; //Malign
                case 1111: case 1145: case 1231: case 1263: return @itemId; //Marauder
                case 1337: case 1364: case 1374: case 1378: return @itemId; //Marshals
                case 147 : return @itemId; //Mending
                case 137 : return @itemId; //Mighty
                case 1123: case 1134: case 1226: case 1265: return @itemId; //Minstrels
                case 1026: case 1063: case 1066: return @itemId; //Nomads
                case 151 : return @itemId; //Penetrating
                case 1484: case 1486: case 1549: case 1559: return @itemId; //Plaguedoctors
                case 150 : return @itemId; //Potent
                case 138 : return @itemId; //Precise
                case 592 : case 595 : return @itemId; //Rabid_and_Apothecarys
                case 154 : case 585 : case 594 : case 1042: return @itemId; //Rabid
                case 159 : case 658 : case 663 : case 1047: case 1078: return @itemId; //Rampagers
                case 144 : return @itemId; //Ravaging
                case 145 : return @itemId; //Rejuvenating
                case 140 : return @itemId; //Resilient
                case 1686: case 1694: case 1706: case 1717: return @itemId; //Ritualists
                case 686 : case 1035: return @itemId; //Sentinels
                case 1220: case 1222: case 1230: case 1269: return @itemId; //Seraph
                case 690 : case 693 : case 700 : return @itemId; //Settlers
                case 153 : case 1071: case 1097: return @itemId; //Shamans
                case 1064: case 1065: case 1067: return @itemId; //Sinister
                case 162 : case 586 : case 601 : case 1048: return @itemId; //Soldiers
                case 148 : return @itemId; //Stout
                case 142 : return @itemId; //Strong
                case 1013: return @itemId; //Survivors
                case 1085: case 1115: case 1229: case 1262: return @itemId; //Trailblazers
                case 1015: return @itemId; //Vagabonds
                case 157 : case 1119: return @itemId; //Valkyrie
                case 1118: case 1139: case 1228: case 1264: return @itemId; //Vigilant
                case 146 : return @itemId; //Vigorous
                case 1130: case 1153: case 1224: case 1268: return @itemId; //Vipers
                case 139 : return @itemId; //Vital
                case 1140: case 1162: case 1225: case 1270: return @itemId; //Wanderers
                case 799 : case 1163: return @itemId; //Zealots2
            }
            // chest
            case 85333: switch(statId) {
                case 1012: return @itemId; //Apostates
                case 605 : case 659 : case 664 : case 1043: return @itemId; //Apothecarys
                case 753 : case 1040: case 1128: return @itemId; //Assassins
                case 591 : case 600 : return @itemId; //Berserkers_and_Valkyrie
                case 161 : case 584 : case 599 : case 1046: case 1077: return @itemId; //Berserkers
                case 1032: case 1436: return @itemId; //Bringers
                case 660 : case 665 : case 1041: return @itemId; //Captains
                case 160 : case 1038: case 1075: return @itemId; //Carrion
                case 583 : case 602 : case 616 : case 1050: return @itemId; //Cavaliers
                case 559 : case 588 : case 593 : case 1052: return @itemId; //Celestial
                case 656 : case 661 : case 1044: case 1076: case 155 : return @itemId; //Clerics
                case 1125: case 1131: case 1227: case 1267: return @itemId; //Commanders
                case 1098: case 1109: case 1232: case 1271: return @itemId; //Crusader
                case 1014: return @itemId; //Deserters
                case 581 : case 596 : return @itemId; //Dire_and_Rabid
                case 754 : case 756 : case 1073: case 1114: return @itemId; //Dire
                case 1538: case 1539: case 1556: case 1566: return @itemId; //Diviners
                case 1681: case 1687: case 1691: case 1697: return @itemId; //Dragons
                case 1011: return @itemId; //Forsaken
                case 627 : case 628 : case 629 : case 630 : case 631: case 1030: case 1031: case 1070: case 1430: return @itemId; //Givers
                case 1329: case 1344: case 1366: case 1379: return @itemId; //Grieving
                case 1345: case 1363: case 1367: case 1377: return @itemId; //Harriers
                case 175 : return @itemId; //Healing
                case 149 : return @itemId; //Hearty
                case 152 : return @itemId; //Honed
                case 755 : return @itemId; //Hunters
                case 158 : case 657 : case 662 : case 1051: return @itemId; //Knights
                case 141 : return @itemId; //Lingering
                case 156 : case 1037: return @itemId; //Magis
                case 176 : return @itemId; //Malign
                case 1111: case 1145: case 1231: case 1263: return @itemId; //Marauder
                case 1337: case 1364: case 1374: case 1378: return @itemId; //Marshals
                case 147 : return @itemId; //Mending
                case 137 : return @itemId; //Mighty
                case 1123: case 1134: case 1226: case 1265: return @itemId; //Minstrels
                case 1026: case 1063: case 1066: return @itemId; //Nomads
                case 151 : return @itemId; //Penetrating
                case 1484: case 1486: case 1549: case 1559: return @itemId; //Plaguedoctors
                case 150 : return @itemId; //Potent
                case 138 : return @itemId; //Precise
                case 592 : case 595 : return @itemId; //Rabid_and_Apothecarys
                case 154 : case 585 : case 594 : case 1042: return @itemId; //Rabid
                case 159 : case 658 : case 663 : case 1047: case 1078: return @itemId; //Rampagers
                case 144 : return @itemId; //Ravaging
                case 145 : return @itemId; //Rejuvenating
                case 140 : return @itemId; //Resilient
                case 1686: case 1694: case 1706: case 1717: return @itemId; //Ritualists
                case 686 : case 1035: return @itemId; //Sentinels
                case 1220: case 1222: case 1230: case 1269: return @itemId; //Seraph
                case 690 : case 693 : case 700 : return @itemId; //Settlers
                case 153 : case 1071: case 1097: return @itemId; //Shamans
                case 1064: case 1065: case 1067: return @itemId; //Sinister
                case 162 : case 586 : case 601 : case 1048: return @itemId; //Soldiers
                case 148 : return @itemId; //Stout
                case 142 : return @itemId; //Strong
                case 1013: return @itemId; //Survivors
                case 1085: case 1115: case 1229: case 1262: return @itemId; //Trailblazers
                case 1015: return @itemId; //Vagabonds
                case 157 : case 1119: return @itemId; //Valkyrie
                case 1118: case 1139: case 1228: case 1264: return @itemId; //Vigilant
                case 146 : return @itemId; //Vigorous
                case 1130: case 1153: case 1224: case 1268: return @itemId; //Vipers
                case 139 : return @itemId; //Vital
                case 1140: case 1162: case 1225: case 1270: return @itemId; //Wanderers
                case 799 : case 1163: return @itemId; //Zealots2
            }
            case 84977: switch(statId) {
                case 1012: return @itemId; //Apostates
                case 605 : case 659 : case 664 : case 1043: return @itemId; //Apothecarys
                case 753 : case 1040: case 1128: return @itemId; //Assassins
                case 591 : case 600 : return @itemId; //Berserkers_and_Valkyrie
                case 161 : case 584 : case 599 : case 1046: case 1077: return @itemId; //Berserkers
                case 1032: case 1436: return @itemId; //Bringers
                case 660 : case 665 : case 1041: return @itemId; //Captains
                case 160 : case 1038: case 1075: return @itemId; //Carrion
                case 583 : case 602 : case 616 : case 1050: return @itemId; //Cavaliers
                case 559 : case 588 : case 593 : case 1052: return @itemId; //Celestial
                case 656 : case 661 : case 1044: case 1076: case 155 : return @itemId; //Clerics
                case 1125: case 1131: case 1227: case 1267: return @itemId; //Commanders
                case 1098: case 1109: case 1232: case 1271: return @itemId; //Crusader
                case 1014: return @itemId; //Deserters
                case 581 : case 596 : return @itemId; //Dire_and_Rabid
                case 754 : case 756 : case 1073: case 1114: return @itemId; //Dire
                case 1538: case 1539: case 1556: case 1566: return @itemId; //Diviners
                case 1681: case 1687: case 1691: case 1697: return @itemId; //Dragons
                case 1011: return @itemId; //Forsaken
                case 627 : case 628 : case 629 : case 630 : case 631: case 1030: case 1031: case 1070: case 1430: return @itemId; //Givers
                case 1329: case 1344: case 1366: case 1379: return @itemId; //Grieving
                case 1345: case 1363: case 1367: case 1377: return @itemId; //Harriers
                case 175 : return @itemId; //Healing
                case 149 : return @itemId; //Hearty
                case 152 : return @itemId; //Honed
                case 755 : return @itemId; //Hunters
                case 158 : case 657 : case 662 : case 1051: return @itemId; //Knights
                case 141 : return @itemId; //Lingering
                case 156 : case 1037: return @itemId; //Magis
                case 176 : return @itemId; //Malign
                case 1111: case 1145: case 1231: case 1263: return @itemId; //Marauder
                case 1337: case 1364: case 1374: case 1378: return @itemId; //Marshals
                case 147 : return @itemId; //Mending
                case 137 : return @itemId; //Mighty
                case 1123: case 1134: case 1226: case 1265: return @itemId; //Minstrels
                case 1026: case 1063: case 1066: return @itemId; //Nomads
                case 151 : return @itemId; //Penetrating
                case 1484: case 1486: case 1549: case 1559: return @itemId; //Plaguedoctors
                case 150 : return @itemId; //Potent
                case 138 : return @itemId; //Precise
                case 592 : case 595 : return @itemId; //Rabid_and_Apothecarys
                case 154 : case 585 : case 594 : case 1042: return @itemId; //Rabid
                case 159 : case 658 : case 663 : case 1047: case 1078: return @itemId; //Rampagers
                case 144 : return @itemId; //Ravaging
                case 145 : return @itemId; //Rejuvenating
                case 140 : return @itemId; //Resilient
                case 1686: case 1694: case 1706: case 1717: return @itemId; //Ritualists
                case 686 : case 1035: return @itemId; //Sentinels
                case 1220: case 1222: case 1230: case 1269: return @itemId; //Seraph
                case 690 : case 693 : case 700 : return @itemId; //Settlers
                case 153 : case 1071: case 1097: return @itemId; //Shamans
                case 1064: case 1065: case 1067: return @itemId; //Sinister
                case 162 : case 586 : case 601 : case 1048: return @itemId; //Soldiers
                case 148 : return @itemId; //Stout
                case 142 : return @itemId; //Strong
                case 1013: return @itemId; //Survivors
                case 1085: case 1115: case 1229: case 1262: return @itemId; //Trailblazers
                case 1015: return @itemId; //Vagabonds
                case 157 : case 1119: return @itemId; //Valkyrie
                case 1118: case 1139: case 1228: case 1264: return @itemId; //Vigilant
                case 146 : return @itemId; //Vigorous
                case 1130: case 1153: case 1224: case 1268: return @itemId; //Vipers
                case 139 : return @itemId; //Vital
                case 1140: case 1162: case 1225: case 1270: return @itemId; //Wanderers
                case 799 : case 1163: return @itemId; //Zealots2
            }
            case 85084: switch(statId) {
                case 1012: return @itemId; //Apostates
                case 605 : case 659 : case 664 : case 1043: return @itemId; //Apothecarys
                case 753 : case 1040: case 1128: return @itemId; //Assassins
                case 591 : case 600 : return @itemId; //Berserkers_and_Valkyrie
                case 161 : case 584 : case 599 : case 1046: case 1077: return @itemId; //Berserkers
                case 1032: case 1436: return @itemId; //Bringers
                case 660 : case 665 : case 1041: return @itemId; //Captains
                case 160 : case 1038: case 1075: return @itemId; //Carrion
                case 583 : case 602 : case 616 : case 1050: return @itemId; //Cavaliers
                case 559 : case 588 : case 593 : case 1052: return @itemId; //Celestial
                case 656 : case 661 : case 1044: case 1076: case 155 : return @itemId; //Clerics
                case 1125: case 1131: case 1227: case 1267: return @itemId; //Commanders
                case 1098: case 1109: case 1232: case 1271: return @itemId; //Crusader
                case 1014: return @itemId; //Deserters
                case 581 : case 596 : return @itemId; //Dire_and_Rabid
                case 754 : case 756 : case 1073: case 1114: return @itemId; //Dire
                case 1538: case 1539: case 1556: case 1566: return @itemId; //Diviners
                case 1681: case 1687: case 1691: case 1697: return @itemId; //Dragons
                case 1011: return @itemId; //Forsaken
                case 627 : case 628 : case 629 : case 630 : case 631: case 1030: case 1031: case 1070: case 1430: return @itemId; //Givers
                case 1329: case 1344: case 1366: case 1379: return @itemId; //Grieving
                case 1345: case 1363: case 1367: case 1377: return @itemId; //Harriers
                case 175 : return @itemId; //Healing
                case 149 : return @itemId; //Hearty
                case 152 : return @itemId; //Honed
                case 755 : return @itemId; //Hunters
                case 158 : case 657 : case 662 : case 1051: return @itemId; //Knights
                case 141 : return @itemId; //Lingering
                case 156 : case 1037: return @itemId; //Magis
                case 176 : return @itemId; //Malign
                case 1111: case 1145: case 1231: case 1263: return @itemId; //Marauder
                case 1337: case 1364: case 1374: case 1378: return @itemId; //Marshals
                case 147 : return @itemId; //Mending
                case 137 : return @itemId; //Mighty
                case 1123: case 1134: case 1226: case 1265: return @itemId; //Minstrels
                case 1026: case 1063: case 1066: return @itemId; //Nomads
                case 151 : return @itemId; //Penetrating
                case 1484: case 1486: case 1549: case 1559: return @itemId; //Plaguedoctors
                case 150 : return @itemId; //Potent
                case 138 : return @itemId; //Precise
                case 592 : case 595 : return @itemId; //Rabid_and_Apothecarys
                case 154 : case 585 : case 594 : case 1042: return @itemId; //Rabid
                case 159 : case 658 : case 663 : case 1047: case 1078: return @itemId; //Rampagers
                case 144 : return @itemId; //Ravaging
                case 145 : return @itemId; //Rejuvenating
                case 140 : return @itemId; //Resilient
                case 1686: case 1694: case 1706: case 1717: return @itemId; //Ritualists
                case 686 : case 1035: return @itemId; //Sentinels
                case 1220: case 1222: case 1230: case 1269: return @itemId; //Seraph
                case 690 : case 693 : case 700 : return @itemId; //Settlers
                case 153 : case 1071: case 1097: return @itemId; //Shamans
                case 1064: case 1065: case 1067: return @itemId; //Sinister
                case 162 : case 586 : case 601 : case 1048: return @itemId; //Soldiers
                case 148 : return @itemId; //Stout
                case 142 : return @itemId; //Strong
                case 1013: return @itemId; //Survivors
                case 1085: case 1115: case 1229: case 1262: return @itemId; //Trailblazers
                case 1015: return @itemId; //Vagabonds
                case 157 : case 1119: return @itemId; //Valkyrie
                case 1118: case 1139: case 1228: case 1264: return @itemId; //Vigilant
                case 146 : return @itemId; //Vigorous
                case 1130: case 1153: case 1224: case 1268: return @itemId; //Vipers
                case 139 : return @itemId; //Vital
                case 1140: case 1162: case 1225: case 1270: return @itemId; //Wanderers
                case 799 : case 1163: return @itemId; //Zealots2
            }
            // gloves
            case 85070: switch(statId) {
                case 1012: return @itemId; //Apostates
                case 605 : case 659 : case 664 : case 1043: return @itemId; //Apothecarys
                case 753 : case 1040: case 1128: return @itemId; //Assassins
                case 591 : case 600 : return @itemId; //Berserkers_and_Valkyrie
                case 161 : case 584 : case 599 : case 1046: case 1077: return @itemId; //Berserkers
                case 1032: case 1436: return @itemId; //Bringers
                case 660 : case 665 : case 1041: return @itemId; //Captains
                case 160 : case 1038: case 1075: return @itemId; //Carrion
                case 583 : case 602 : case 616 : case 1050: return @itemId; //Cavaliers
                case 559 : case 588 : case 593 : case 1052: return @itemId; //Celestial
                case 656 : case 661 : case 1044: case 1076: case 155 : return @itemId; //Clerics
                case 1125: case 1131: case 1227: case 1267: return @itemId; //Commanders
                case 1098: case 1109: case 1232: case 1271: return @itemId; //Crusader
                case 1014: return @itemId; //Deserters
                case 581 : case 596 : return @itemId; //Dire_and_Rabid
                case 754 : case 756 : case 1073: case 1114: return @itemId; //Dire
                case 1538: case 1539: case 1556: case 1566: return @itemId; //Diviners
                case 1681: case 1687: case 1691: case 1697: return @itemId; //Dragons
                case 1011: return @itemId; //Forsaken
                case 627 : case 628 : case 629 : case 630 : case 631: case 1030: case 1031: case 1070: case 1430: return @itemId; //Givers
                case 1329: case 1344: case 1366: case 1379: return @itemId; //Grieving
                case 1345: case 1363: case 1367: case 1377: return @itemId; //Harriers
                case 175 : return @itemId; //Healing
                case 149 : return @itemId; //Hearty
                case 152 : return @itemId; //Honed
                case 755 : return @itemId; //Hunters
                case 158 : case 657 : case 662 : case 1051: return @itemId; //Knights
                case 141 : return @itemId; //Lingering
                case 156 : case 1037: return @itemId; //Magis
                case 176 : return @itemId; //Malign
                case 1111: case 1145: case 1231: case 1263: return @itemId; //Marauder
                case 1337: case 1364: case 1374: case 1378: return @itemId; //Marshals
                case 147 : return @itemId; //Mending
                case 137 : return @itemId; //Mighty
                case 1123: case 1134: case 1226: case 1265: return @itemId; //Minstrels
                case 1026: case 1063: case 1066: return @itemId; //Nomads
                case 151 : return @itemId; //Penetrating
                case 1484: case 1486: case 1549: case 1559: return @itemId; //Plaguedoctors
                case 150 : return @itemId; //Potent
                case 138 : return @itemId; //Precise
                case 592 : case 595 : return @itemId; //Rabid_and_Apothecarys
                case 154 : case 585 : case 594 : case 1042: return @itemId; //Rabid
                case 159 : case 658 : case 663 : case 1047: case 1078: return @itemId; //Rampagers
                case 144 : return @itemId; //Ravaging
                case 145 : return @itemId; //Rejuvenating
                case 140 : return @itemId; //Resilient
                case 1686: case 1694: case 1706: case 1717: return @itemId; //Ritualists
                case 686 : case 1035: return @itemId; //Sentinels
                case 1220: case 1222: case 1230: case 1269: return @itemId; //Seraph
                case 690 : case 693 : case 700 : return @itemId; //Settlers
                case 153 : case 1071: case 1097: return @itemId; //Shamans
                case 1064: case 1065: case 1067: return @itemId; //Sinister
                case 162 : case 586 : case 601 : case 1048: return @itemId; //Soldiers
                case 148 : return @itemId; //Stout
                case 142 : return @itemId; //Strong
                case 1013: return @itemId; //Survivors
                case 1085: case 1115: case 1229: case 1262: return @itemId; //Trailblazers
                case 1015: return @itemId; //Vagabonds
                case 157 : case 1119: return @itemId; //Valkyrie
                case 1118: case 1139: case 1228: case 1264: return @itemId; //Vigilant
                case 146 : return @itemId; //Vigorous
                case 1130: case 1153: case 1224: case 1268: return @itemId; //Vipers
                case 139 : return @itemId; //Vital
                case 1140: case 1162: case 1225: case 1270: return @itemId; //Wanderers
                case 799 : case 1163: return @itemId; //Zealots2
            }
            case 85169: switch(statId) {
                case 1012: return @itemId; //Apostates
                case 605 : case 659 : case 664 : case 1043: return @itemId; //Apothecarys
                case 753 : case 1040: case 1128: return @itemId; //Assassins
                case 591 : case 600 : return @itemId; //Berserkers_and_Valkyrie
                case 161 : case 584 : case 599 : case 1046: case 1077: return @itemId; //Berserkers
                case 1032: case 1436: return @itemId; //Bringers
                case 660 : case 665 : case 1041: return @itemId; //Captains
                case 160 : case 1038: case 1075: return @itemId; //Carrion
                case 583 : case 602 : case 616 : case 1050: return @itemId; //Cavaliers
                case 559 : case 588 : case 593 : case 1052: return @itemId; //Celestial
                case 656 : case 661 : case 1044: case 1076: case 155 : return @itemId; //Clerics
                case 1125: case 1131: case 1227: case 1267: return @itemId; //Commanders
                case 1098: case 1109: case 1232: case 1271: return @itemId; //Crusader
                case 1014: return @itemId; //Deserters
                case 581 : case 596 : return @itemId; //Dire_and_Rabid
                case 754 : case 756 : case 1073: case 1114: return @itemId; //Dire
                case 1538: case 1539: case 1556: case 1566: return @itemId; //Diviners
                case 1681: case 1687: case 1691: case 1697: return @itemId; //Dragons
                case 1011: return @itemId; //Forsaken
                case 627 : case 628 : case 629 : case 630 : case 631: case 1030: case 1031: case 1070: case 1430: return @itemId; //Givers
                case 1329: case 1344: case 1366: case 1379: return @itemId; //Grieving
                case 1345: case 1363: case 1367: case 1377: return @itemId; //Harriers
                case 175 : return @itemId; //Healing
                case 149 : return @itemId; //Hearty
                case 152 : return @itemId; //Honed
                case 755 : return @itemId; //Hunters
                case 158 : case 657 : case 662 : case 1051: return @itemId; //Knights
                case 141 : return @itemId; //Lingering
                case 156 : case 1037: return @itemId; //Magis
                case 176 : return @itemId; //Malign
                case 1111: case 1145: case 1231: case 1263: return @itemId; //Marauder
                case 1337: case 1364: case 1374: case 1378: return @itemId; //Marshals
                case 147 : return @itemId; //Mending
                case 137 : return @itemId; //Mighty
                case 1123: case 1134: case 1226: case 1265: return @itemId; //Minstrels
                case 1026: case 1063: case 1066: return @itemId; //Nomads
                case 151 : return @itemId; //Penetrating
                case 1484: case 1486: case 1549: case 1559: return @itemId; //Plaguedoctors
                case 150 : return @itemId; //Potent
                case 138 : return @itemId; //Precise
                case 592 : case 595 : return @itemId; //Rabid_and_Apothecarys
                case 154 : case 585 : case 594 : case 1042: return @itemId; //Rabid
                case 159 : case 658 : case 663 : case 1047: case 1078: return @itemId; //Rampagers
                case 144 : return @itemId; //Ravaging
                case 145 : return @itemId; //Rejuvenating
                case 140 : return @itemId; //Resilient
                case 1686: case 1694: case 1706: case 1717: return @itemId; //Ritualists
                case 686 : case 1035: return @itemId; //Sentinels
                case 1220: case 1222: case 1230: case 1269: return @itemId; //Seraph
                case 690 : case 693 : case 700 : return @itemId; //Settlers
                case 153 : case 1071: case 1097: return @itemId; //Shamans
                case 1064: case 1065: case 1067: return @itemId; //Sinister
                case 162 : case 586 : case 601 : case 1048: return @itemId; //Soldiers
                case 148 : return @itemId; //Stout
                case 142 : return @itemId; //Strong
                case 1013: return @itemId; //Survivors
                case 1085: case 1115: case 1229: case 1262: return @itemId; //Trailblazers
                case 1015: return @itemId; //Vagabonds
                case 157 : case 1119: return @itemId; //Valkyrie
                case 1118: case 1139: case 1228: case 1264: return @itemId; //Vigilant
                case 146 : return @itemId; //Vigorous
                case 1130: case 1153: case 1224: case 1268: return @itemId; //Vipers
                case 139 : return @itemId; //Vital
                case 1140: case 1162: case 1225: case 1270: return @itemId; //Wanderers
                case 799 : case 1163: return @itemId; //Zealots2
            }
            case 85140: switch(statId) {
                case 1012: return @itemId; //Apostates
                case 605 : case 659 : case 664 : case 1043: return @itemId; //Apothecarys
                case 753 : case 1040: case 1128: return @itemId; //Assassins
                case 591 : case 600 : return @itemId; //Berserkers_and_Valkyrie
                case 161 : case 584 : case 599 : case 1046: case 1077: return @itemId; //Berserkers
                case 1032: case 1436: return @itemId; //Bringers
                case 660 : case 665 : case 1041: return @itemId; //Captains
                case 160 : case 1038: case 1075: return @itemId; //Carrion
                case 583 : case 602 : case 616 : case 1050: return @itemId; //Cavaliers
                case 559 : case 588 : case 593 : case 1052: return @itemId; //Celestial
                case 656 : case 661 : case 1044: case 1076: case 155 : return @itemId; //Clerics
                case 1125: case 1131: case 1227: case 1267: return @itemId; //Commanders
                case 1098: case 1109: case 1232: case 1271: return @itemId; //Crusader
                case 1014: return @itemId; //Deserters
                case 581 : case 596 : return @itemId; //Dire_and_Rabid
                case 754 : case 756 : case 1073: case 1114: return @itemId; //Dire
                case 1538: case 1539: case 1556: case 1566: return @itemId; //Diviners
                case 1681: case 1687: case 1691: case 1697: return @itemId; //Dragons
                case 1011: return @itemId; //Forsaken
                case 627 : case 628 : case 629 : case 630 : case 631: case 1030: case 1031: case 1070: case 1430: return @itemId; //Givers
                case 1329: case 1344: case 1366: case 1379: return @itemId; //Grieving
                case 1345: case 1363: case 1367: case 1377: return @itemId; //Harriers
                case 175 : return @itemId; //Healing
                case 149 : return @itemId; //Hearty
                case 152 : return @itemId; //Honed
                case 755 : return @itemId; //Hunters
                case 158 : case 657 : case 662 : case 1051: return @itemId; //Knights
                case 141 : return @itemId; //Lingering
                case 156 : case 1037: return @itemId; //Magis
                case 176 : return @itemId; //Malign
                case 1111: case 1145: case 1231: case 1263: return @itemId; //Marauder
                case 1337: case 1364: case 1374: case 1378: return @itemId; //Marshals
                case 147 : return @itemId; //Mending
                case 137 : return @itemId; //Mighty
                case 1123: case 1134: case 1226: case 1265: return @itemId; //Minstrels
                case 1026: case 1063: case 1066: return @itemId; //Nomads
                case 151 : return @itemId; //Penetrating
                case 1484: case 1486: case 1549: case 1559: return @itemId; //Plaguedoctors
                case 150 : return @itemId; //Potent
                case 138 : return @itemId; //Precise
                case 592 : case 595 : return @itemId; //Rabid_and_Apothecarys
                case 154 : case 585 : case 594 : case 1042: return @itemId; //Rabid
                case 159 : case 658 : case 663 : case 1047: case 1078: return @itemId; //Rampagers
                case 144 : return @itemId; //Ravaging
                case 145 : return @itemId; //Rejuvenating
                case 140 : return @itemId; //Resilient
                case 1686: case 1694: case 1706: case 1717: return @itemId; //Ritualists
                case 686 : case 1035: return @itemId; //Sentinels
                case 1220: case 1222: case 1230: case 1269: return @itemId; //Seraph
                case 690 : case 693 : case 700 : return @itemId; //Settlers
                case 153 : case 1071: case 1097: return @itemId; //Shamans
                case 1064: case 1065: case 1067: return @itemId; //Sinister
                case 162 : case 586 : case 601 : case 1048: return @itemId; //Soldiers
                case 148 : return @itemId; //Stout
                case 142 : return @itemId; //Strong
                case 1013: return @itemId; //Survivors
                case 1085: case 1115: case 1229: case 1262: return @itemId; //Trailblazers
                case 1015: return @itemId; //Vagabonds
                case 157 : case 1119: return @itemId; //Valkyrie
                case 1118: case 1139: case 1228: case 1264: return @itemId; //Vigilant
                case 146 : return @itemId; //Vigorous
                case 1130: case 1153: case 1224: case 1268: return @itemId; //Vipers
                case 139 : return @itemId; //Vital
                case 1140: case 1162: case 1225: case 1270: return @itemId; //Wanderers
                case 799 : case 1163: return @itemId; //Zealots2
            }
            // legs
            case 85362: switch(statId) {
                case 1012: return @itemId; //Apostates
                case 605 : case 659 : case 664 : case 1043: return @itemId; //Apothecarys
                case 753 : case 1040: case 1128: return @itemId; //Assassins
                case 591 : case 600 : return @itemId; //Berserkers_and_Valkyrie
                case 161 : case 584 : case 599 : case 1046: case 1077: return @itemId; //Berserkers
                case 1032: case 1436: return @itemId; //Bringers
                case 660 : case 665 : case 1041: return @itemId; //Captains
                case 160 : case 1038: case 1075: return @itemId; //Carrion
                case 583 : case 602 : case 616 : case 1050: return @itemId; //Cavaliers
                case 559 : case 588 : case 593 : case 1052: return @itemId; //Celestial
                case 656 : case 661 : case 1044: case 1076: case 155 : return @itemId; //Clerics
                case 1125: case 1131: case 1227: case 1267: return @itemId; //Commanders
                case 1098: case 1109: case 1232: case 1271: return @itemId; //Crusader
                case 1014: return @itemId; //Deserters
                case 581 : case 596 : return @itemId; //Dire_and_Rabid
                case 754 : case 756 : case 1073: case 1114: return @itemId; //Dire
                case 1538: case 1539: case 1556: case 1566: return @itemId; //Diviners
                case 1681: case 1687: case 1691: case 1697: return @itemId; //Dragons
                case 1011: return @itemId; //Forsaken
                case 627 : case 628 : case 629 : case 630 : case 631: case 1030: case 1031: case 1070: case 1430: return @itemId; //Givers
                case 1329: case 1344: case 1366: case 1379: return @itemId; //Grieving
                case 1345: case 1363: case 1367: case 1377: return @itemId; //Harriers
                case 175 : return @itemId; //Healing
                case 149 : return @itemId; //Hearty
                case 152 : return @itemId; //Honed
                case 755 : return @itemId; //Hunters
                case 158 : case 657 : case 662 : case 1051: return @itemId; //Knights
                case 141 : return @itemId; //Lingering
                case 156 : case 1037: return @itemId; //Magis
                case 176 : return @itemId; //Malign
                case 1111: case 1145: case 1231: case 1263: return @itemId; //Marauder
                case 1337: case 1364: case 1374: case 1378: return @itemId; //Marshals
                case 147 : return @itemId; //Mending
                case 137 : return @itemId; //Mighty
                case 1123: case 1134: case 1226: case 1265: return @itemId; //Minstrels
                case 1026: case 1063: case 1066: return @itemId; //Nomads
                case 151 : return @itemId; //Penetrating
                case 1484: case 1486: case 1549: case 1559: return @itemId; //Plaguedoctors
                case 150 : return @itemId; //Potent
                case 138 : return @itemId; //Precise
                case 592 : case 595 : return @itemId; //Rabid_and_Apothecarys
                case 154 : case 585 : case 594 : case 1042: return @itemId; //Rabid
                case 159 : case 658 : case 663 : case 1047: case 1078: return @itemId; //Rampagers
                case 144 : return @itemId; //Ravaging
                case 145 : return @itemId; //Rejuvenating
                case 140 : return @itemId; //Resilient
                case 1686: case 1694: case 1706: case 1717: return @itemId; //Ritualists
                case 686 : case 1035: return @itemId; //Sentinels
                case 1220: case 1222: case 1230: case 1269: return @itemId; //Seraph
                case 690 : case 693 : case 700 : return @itemId; //Settlers
                case 153 : case 1071: case 1097: return @itemId; //Shamans
                case 1064: case 1065: case 1067: return @itemId; //Sinister
                case 162 : case 586 : case 601 : case 1048: return @itemId; //Soldiers
                case 148 : return @itemId; //Stout
                case 142 : return @itemId; //Strong
                case 1013: return @itemId; //Survivors
                case 1085: case 1115: case 1229: case 1262: return @itemId; //Trailblazers
                case 1015: return @itemId; //Vagabonds
                case 157 : case 1119: return @itemId; //Valkyrie
                case 1118: case 1139: case 1228: case 1264: return @itemId; //Vigilant
                case 146 : return @itemId; //Vigorous
                case 1130: case 1153: case 1224: case 1268: return @itemId; //Vipers
                case 139 : return @itemId; //Vital
                case 1140: case 1162: case 1225: case 1270: return @itemId; //Wanderers
                case 799 : case 1163: return @itemId; //Zealots2
            }
            case 85264: switch(statId) {
                case 1012: return @itemId; //Apostates
                case 605 : case 659 : case 664 : case 1043: return @itemId; //Apothecarys
                case 753 : case 1040: case 1128: return @itemId; //Assassins
                case 591 : case 600 : return @itemId; //Berserkers_and_Valkyrie
                case 161 : case 584 : case 599 : case 1046: case 1077: return @itemId; //Berserkers
                case 1032: case 1436: return @itemId; //Bringers
                case 660 : case 665 : case 1041: return @itemId; //Captains
                case 160 : case 1038: case 1075: return @itemId; //Carrion
                case 583 : case 602 : case 616 : case 1050: return @itemId; //Cavaliers
                case 559 : case 588 : case 593 : case 1052: return @itemId; //Celestial
                case 656 : case 661 : case 1044: case 1076: case 155 : return @itemId; //Clerics
                case 1125: case 1131: case 1227: case 1267: return @itemId; //Commanders
                case 1098: case 1109: case 1232: case 1271: return @itemId; //Crusader
                case 1014: return @itemId; //Deserters
                case 581 : case 596 : return @itemId; //Dire_and_Rabid
                case 754 : case 756 : case 1073: case 1114: return @itemId; //Dire
                case 1538: case 1539: case 1556: case 1566: return @itemId; //Diviners
                case 1681: case 1687: case 1691: case 1697: return @itemId; //Dragons
                case 1011: return @itemId; //Forsaken
                case 627 : case 628 : case 629 : case 630 : case 631: case 1030: case 1031: case 1070: case 1430: return @itemId; //Givers
                case 1329: case 1344: case 1366: case 1379: return @itemId; //Grieving
                case 1345: case 1363: case 1367: case 1377: return @itemId; //Harriers
                case 175 : return @itemId; //Healing
                case 149 : return @itemId; //Hearty
                case 152 : return @itemId; //Honed
                case 755 : return @itemId; //Hunters
                case 158 : case 657 : case 662 : case 1051: return @itemId; //Knights
                case 141 : return @itemId; //Lingering
                case 156 : case 1037: return @itemId; //Magis
                case 176 : return @itemId; //Malign
                case 1111: case 1145: case 1231: case 1263: return @itemId; //Marauder
                case 1337: case 1364: case 1374: case 1378: return @itemId; //Marshals
                case 147 : return @itemId; //Mending
                case 137 : return @itemId; //Mighty
                case 1123: case 1134: case 1226: case 1265: return @itemId; //Minstrels
                case 1026: case 1063: case 1066: return @itemId; //Nomads
                case 151 : return @itemId; //Penetrating
                case 1484: case 1486: case 1549: case 1559: return @itemId; //Plaguedoctors
                case 150 : return @itemId; //Potent
                case 138 : return @itemId; //Precise
                case 592 : case 595 : return @itemId; //Rabid_and_Apothecarys
                case 154 : case 585 : case 594 : case 1042: return @itemId; //Rabid
                case 159 : case 658 : case 663 : case 1047: case 1078: return @itemId; //Rampagers
                case 144 : return @itemId; //Ravaging
                case 145 : return @itemId; //Rejuvenating
                case 140 : return @itemId; //Resilient
                case 1686: case 1694: case 1706: case 1717: return @itemId; //Ritualists
                case 686 : case 1035: return @itemId; //Sentinels
                case 1220: case 1222: case 1230: case 1269: return @itemId; //Seraph
                case 690 : case 693 : case 700 : return @itemId; //Settlers
                case 153 : case 1071: case 1097: return @itemId; //Shamans
                case 1064: case 1065: case 1067: return @itemId; //Sinister
                case 162 : case 586 : case 601 : case 1048: return @itemId; //Soldiers
                case 148 : return @itemId; //Stout
                case 142 : return @itemId; //Strong
                case 1013: return @itemId; //Survivors
                case 1085: case 1115: case 1229: case 1262: return @itemId; //Trailblazers
                case 1015: return @itemId; //Vagabonds
                case 157 : case 1119: return @itemId; //Valkyrie
                case 1118: case 1139: case 1228: case 1264: return @itemId; //Vigilant
                case 146 : return @itemId; //Vigorous
                case 1130: case 1153: case 1224: case 1268: return @itemId; //Vipers
                case 139 : return @itemId; //Vital
                case 1140: case 1162: case 1225: case 1270: return @itemId; //Wanderers
                case 799 : case 1163: return @itemId; //Zealots2
            }
            case 84887: switch(statId) {
                case 1012: return @itemId; //Apostates
                case 605 : case 659 : case 664 : case 1043: return @itemId; //Apothecarys
                case 753 : case 1040: case 1128: return @itemId; //Assassins
                case 591 : case 600 : return @itemId; //Berserkers_and_Valkyrie
                case 161 : case 584 : case 599 : case 1046: case 1077: return @itemId; //Berserkers
                case 1032: case 1436: return @itemId; //Bringers
                case 660 : case 665 : case 1041: return @itemId; //Captains
                case 160 : case 1038: case 1075: return @itemId; //Carrion
                case 583 : case 602 : case 616 : case 1050: return @itemId; //Cavaliers
                case 559 : case 588 : case 593 : case 1052: return @itemId; //Celestial
                case 656 : case 661 : case 1044: case 1076: case 155 : return @itemId; //Clerics
                case 1125: case 1131: case 1227: case 1267: return @itemId; //Commanders
                case 1098: case 1109: case 1232: case 1271: return @itemId; //Crusader
                case 1014: return @itemId; //Deserters
                case 581 : case 596 : return @itemId; //Dire_and_Rabid
                case 754 : case 756 : case 1073: case 1114: return @itemId; //Dire
                case 1538: case 1539: case 1556: case 1566: return @itemId; //Diviners
                case 1681: case 1687: case 1691: case 1697: return @itemId; //Dragons
                case 1011: return @itemId; //Forsaken
                case 627 : case 628 : case 629 : case 630 : case 631: case 1030: case 1031: case 1070: case 1430: return @itemId; //Givers
                case 1329: case 1344: case 1366: case 1379: return @itemId; //Grieving
                case 1345: case 1363: case 1367: case 1377: return @itemId; //Harriers
                case 175 : return @itemId; //Healing
                case 149 : return @itemId; //Hearty
                case 152 : return @itemId; //Honed
                case 755 : return @itemId; //Hunters
                case 158 : case 657 : case 662 : case 1051: return @itemId; //Knights
                case 141 : return @itemId; //Lingering
                case 156 : case 1037: return @itemId; //Magis
                case 176 : return @itemId; //Malign
                case 1111: case 1145: case 1231: case 1263: return @itemId; //Marauder
                case 1337: case 1364: case 1374: case 1378: return @itemId; //Marshals
                case 147 : return @itemId; //Mending
                case 137 : return @itemId; //Mighty
                case 1123: case 1134: case 1226: case 1265: return @itemId; //Minstrels
                case 1026: case 1063: case 1066: return @itemId; //Nomads
                case 151 : return @itemId; //Penetrating
                case 1484: case 1486: case 1549: case 1559: return @itemId; //Plaguedoctors
                case 150 : return @itemId; //Potent
                case 138 : return @itemId; //Precise
                case 592 : case 595 : return @itemId; //Rabid_and_Apothecarys
                case 154 : case 585 : case 594 : case 1042: return @itemId; //Rabid
                case 159 : case 658 : case 663 : case 1047: case 1078: return @itemId; //Rampagers
                case 144 : return @itemId; //Ravaging
                case 145 : return @itemId; //Rejuvenating
                case 140 : return @itemId; //Resilient
                case 1686: case 1694: case 1706: case 1717: return @itemId; //Ritualists
                case 686 : case 1035: return @itemId; //Sentinels
                case 1220: case 1222: case 1230: case 1269: return @itemId; //Seraph
                case 690 : case 693 : case 700 : return @itemId; //Settlers
                case 153 : case 1071: case 1097: return @itemId; //Shamans
                case 1064: case 1065: case 1067: return @itemId; //Sinister
                case 162 : case 586 : case 601 : case 1048: return @itemId; //Soldiers
                case 148 : return @itemId; //Stout
                case 142 : return @itemId; //Strong
                case 1013: return @itemId; //Survivors
                case 1085: case 1115: case 1229: case 1262: return @itemId; //Trailblazers
                case 1015: return @itemId; //Vagabonds
                case 157 : case 1119: return @itemId; //Valkyrie
                case 1118: case 1139: case 1228: case 1264: return @itemId; //Vigilant
                case 146 : return @itemId; //Vigorous
                case 1130: case 1153: case 1224: case 1268: return @itemId; //Vipers
                case 139 : return @itemId; //Vital
                case 1140: case 1162: case 1225: case 1270: return @itemId; //Wanderers
                case 799 : case 1163: return @itemId; //Zealots2
            }
            // boots
            case 80815: switch(statId) {
                case 1012: return @itemId; //Apostates
                case 605 : case 659 : case 664 : case 1043: return @itemId; //Apothecarys
                case 753 : case 1040: case 1128: return @itemId; //Assassins
                case 591 : case 600 : return @itemId; //Berserkers_and_Valkyrie
                case 161 : case 584 : case 599 : case 1046: case 1077: return @itemId; //Berserkers
                case 1032: case 1436: return @itemId; //Bringers
                case 660 : case 665 : case 1041: return @itemId; //Captains
                case 160 : case 1038: case 1075: return @itemId; //Carrion
                case 583 : case 602 : case 616 : case 1050: return @itemId; //Cavaliers
                case 559 : case 588 : case 593 : case 1052: return @itemId; //Celestial
                case 656 : case 661 : case 1044: case 1076: case 155 : return @itemId; //Clerics
                case 1125: case 1131: case 1227: case 1267: return @itemId; //Commanders
                case 1098: case 1109: case 1232: case 1271: return @itemId; //Crusader
                case 1014: return @itemId; //Deserters
                case 581 : case 596 : return @itemId; //Dire_and_Rabid
                case 754 : case 756 : case 1073: case 1114: return @itemId; //Dire
                case 1538: case 1539: case 1556: case 1566: return @itemId; //Diviners
                case 1681: case 1687: case 1691: case 1697: return @itemId; //Dragons
                case 1011: return @itemId; //Forsaken
                case 627 : case 628 : case 629 : case 630 : case 631: case 1030: case 1031: case 1070: case 1430: return @itemId; //Givers
                case 1329: case 1344: case 1366: case 1379: return @itemId; //Grieving
                case 1345: case 1363: case 1367: case 1377: return @itemId; //Harriers
                case 175 : return @itemId; //Healing
                case 149 : return @itemId; //Hearty
                case 152 : return @itemId; //Honed
                case 755 : return @itemId; //Hunters
                case 158 : case 657 : case 662 : case 1051: return @itemId; //Knights
                case 141 : return @itemId; //Lingering
                case 156 : case 1037: return @itemId; //Magis
                case 176 : return @itemId; //Malign
                case 1111: case 1145: case 1231: case 1263: return @itemId; //Marauder
                case 1337: case 1364: case 1374: case 1378: return @itemId; //Marshals
                case 147 : return @itemId; //Mending
                case 137 : return @itemId; //Mighty
                case 1123: case 1134: case 1226: case 1265: return @itemId; //Minstrels
                case 1026: case 1063: case 1066: return @itemId; //Nomads
                case 151 : return @itemId; //Penetrating
                case 1484: case 1486: case 1549: case 1559: return @itemId; //Plaguedoctors
                case 150 : return @itemId; //Potent
                case 138 : return @itemId; //Precise
                case 592 : case 595 : return @itemId; //Rabid_and_Apothecarys
                case 154 : case 585 : case 594 : case 1042: return @itemId; //Rabid
                case 159 : case 658 : case 663 : case 1047: case 1078: return @itemId; //Rampagers
                case 144 : return @itemId; //Ravaging
                case 145 : return @itemId; //Rejuvenating
                case 140 : return @itemId; //Resilient
                case 1686: case 1694: case 1706: case 1717: return @itemId; //Ritualists
                case 686 : case 1035: return @itemId; //Sentinels
                case 1220: case 1222: case 1230: case 1269: return @itemId; //Seraph
                case 690 : case 693 : case 700 : return @itemId; //Settlers
                case 153 : case 1071: case 1097: return @itemId; //Shamans
                case 1064: case 1065: case 1067: return @itemId; //Sinister
                case 162 : case 586 : case 601 : case 1048: return @itemId; //Soldiers
                case 148 : return @itemId; //Stout
                case 142 : return @itemId; //Strong
                case 1013: return @itemId; //Survivors
                case 1085: case 1115: case 1229: case 1262: return @itemId; //Trailblazers
                case 1015: return @itemId; //Vagabonds
                case 157 : case 1119: return @itemId; //Valkyrie
                case 1118: case 1139: case 1228: case 1264: return @itemId; //Vigilant
                case 146 : return @itemId; //Vigorous
                case 1130: case 1153: case 1224: case 1268: return @itemId; //Vipers
                case 139 : return @itemId; //Vital
                case 1140: case 1162: case 1225: case 1270: return @itemId; //Wanderers
                case 799 : case 1163: return @itemId; //Zealots2
            }
            case 80836: switch(statId) {
                case 1012: return @itemId; //Apostates
                case 605 : case 659 : case 664 : case 1043: return @itemId; //Apothecarys
                case 753 : case 1040: case 1128: return @itemId; //Assassins
                case 591 : case 600 : return @itemId; //Berserkers_and_Valkyrie
                case 161 : case 584 : case 599 : case 1046: case 1077: return @itemId; //Berserkers
                case 1032: case 1436: return @itemId; //Bringers
                case 660 : case 665 : case 1041: return @itemId; //Captains
                case 160 : case 1038: case 1075: return @itemId; //Carrion
                case 583 : case 602 : case 616 : case 1050: return @itemId; //Cavaliers
                case 559 : case 588 : case 593 : case 1052: return @itemId; //Celestial
                case 656 : case 661 : case 1044: case 1076: case 155 : return @itemId; //Clerics
                case 1125: case 1131: case 1227: case 1267: return @itemId; //Commanders
                case 1098: case 1109: case 1232: case 1271: return @itemId; //Crusader
                case 1014: return @itemId; //Deserters
                case 581 : case 596 : return @itemId; //Dire_and_Rabid
                case 754 : case 756 : case 1073: case 1114: return @itemId; //Dire
                case 1538: case 1539: case 1556: case 1566: return @itemId; //Diviners
                case 1681: case 1687: case 1691: case 1697: return @itemId; //Dragons
                case 1011: return @itemId; //Forsaken
                case 627 : case 628 : case 629 : case 630 : case 631: case 1030: case 1031: case 1070: case 1430: return @itemId; //Givers
                case 1329: case 1344: case 1366: case 1379: return @itemId; //Grieving
                case 1345: case 1363: case 1367: case 1377: return @itemId; //Harriers
                case 175 : return @itemId; //Healing
                case 149 : return @itemId; //Hearty
                case 152 : return @itemId; //Honed
                case 755 : return @itemId; //Hunters
                case 158 : case 657 : case 662 : case 1051: return @itemId; //Knights
                case 141 : return @itemId; //Lingering
                case 156 : case 1037: return @itemId; //Magis
                case 176 : return @itemId; //Malign
                case 1111: case 1145: case 1231: case 1263: return @itemId; //Marauder
                case 1337: case 1364: case 1374: case 1378: return @itemId; //Marshals
                case 147 : return @itemId; //Mending
                case 137 : return @itemId; //Mighty
                case 1123: case 1134: case 1226: case 1265: return @itemId; //Minstrels
                case 1026: case 1063: case 1066: return @itemId; //Nomads
                case 151 : return @itemId; //Penetrating
                case 1484: case 1486: case 1549: case 1559: return @itemId; //Plaguedoctors
                case 150 : return @itemId; //Potent
                case 138 : return @itemId; //Precise
                case 592 : case 595 : return @itemId; //Rabid_and_Apothecarys
                case 154 : case 585 : case 594 : case 1042: return @itemId; //Rabid
                case 159 : case 658 : case 663 : case 1047: case 1078: return @itemId; //Rampagers
                case 144 : return @itemId; //Ravaging
                case 145 : return @itemId; //Rejuvenating
                case 140 : return @itemId; //Resilient
                case 1686: case 1694: case 1706: case 1717: return @itemId; //Ritualists
                case 686 : case 1035: return @itemId; //Sentinels
                case 1220: case 1222: case 1230: case 1269: return @itemId; //Seraph
                case 690 : case 693 : case 700 : return @itemId; //Settlers
                case 153 : case 1071: case 1097: return @itemId; //Shamans
                case 1064: case 1065: case 1067: return @itemId; //Sinister
                case 162 : case 586 : case 601 : case 1048: return @itemId; //Soldiers
                case 148 : return @itemId; //Stout
                case 142 : return @itemId; //Strong
                case 1013: return @itemId; //Survivors
                case 1085: case 1115: case 1229: case 1262: return @itemId; //Trailblazers
                case 1015: return @itemId; //Vagabonds
                case 157 : case 1119: return @itemId; //Valkyrie
                case 1118: case 1139: case 1228: case 1264: return @itemId; //Vigilant
                case 146 : return @itemId; //Vigorous
                case 1130: case 1153: case 1224: case 1268: return @itemId; //Vipers
                case 139 : return @itemId; //Vital
                case 1140: case 1162: case 1225: case 1270: return @itemId; //Wanderers
                case 799 : case 1163: return @itemId; //Zealots2
            }
            case 85055: switch(statId) {
                case 1012: return @itemId; //Apostates
                case 605 : case 659 : case 664 : case 1043: return @itemId; //Apothecarys
                case 753 : case 1040: case 1128: return @itemId; //Assassins
                case 591 : case 600 : return @itemId; //Berserkers_and_Valkyrie
                case 161 : case 584 : case 599 : case 1046: case 1077: return @itemId; //Berserkers
                case 1032: case 1436: return @itemId; //Bringers
                case 660 : case 665 : case 1041: return @itemId; //Captains
                case 160 : case 1038: case 1075: return @itemId; //Carrion
                case 583 : case 602 : case 616 : case 1050: return @itemId; //Cavaliers
                case 559 : case 588 : case 593 : case 1052: return @itemId; //Celestial
                case 656 : case 661 : case 1044: case 1076: case 155 : return @itemId; //Clerics
                case 1125: case 1131: case 1227: case 1267: return @itemId; //Commanders
                case 1098: case 1109: case 1232: case 1271: return @itemId; //Crusader
                case 1014: return @itemId; //Deserters
                case 581 : case 596 : return @itemId; //Dire_and_Rabid
                case 754 : case 756 : case 1073: case 1114: return @itemId; //Dire
                case 1538: case 1539: case 1556: case 1566: return @itemId; //Diviners
                case 1681: case 1687: case 1691: case 1697: return @itemId; //Dragons
                case 1011: return @itemId; //Forsaken
                case 627 : case 628 : case 629 : case 630 : case 631: case 1030: case 1031: case 1070: case 1430: return @itemId; //Givers
                case 1329: case 1344: case 1366: case 1379: return @itemId; //Grieving
                case 1345: case 1363: case 1367: case 1377: return @itemId; //Harriers
                case 175 : return @itemId; //Healing
                case 149 : return @itemId; //Hearty
                case 152 : return @itemId; //Honed
                case 755 : return @itemId; //Hunters
                case 158 : case 657 : case 662 : case 1051: return @itemId; //Knights
                case 141 : return @itemId; //Lingering
                case 156 : case 1037: return @itemId; //Magis
                case 176 : return @itemId; //Malign
                case 1111: case 1145: case 1231: case 1263: return @itemId; //Marauder
                case 1337: case 1364: case 1374: case 1378: return @itemId; //Marshals
                case 147 : return @itemId; //Mending
                case 137 : return @itemId; //Mighty
                case 1123: case 1134: case 1226: case 1265: return @itemId; //Minstrels
                case 1026: case 1063: case 1066: return @itemId; //Nomads
                case 151 : return @itemId; //Penetrating
                case 1484: case 1486: case 1549: case 1559: return @itemId; //Plaguedoctors
                case 150 : return @itemId; //Potent
                case 138 : return @itemId; //Precise
                case 592 : case 595 : return @itemId; //Rabid_and_Apothecarys
                case 154 : case 585 : case 594 : case 1042: return @itemId; //Rabid
                case 159 : case 658 : case 663 : case 1047: case 1078: return @itemId; //Rampagers
                case 144 : return @itemId; //Ravaging
                case 145 : return @itemId; //Rejuvenating
                case 140 : return @itemId; //Resilient
                case 1686: case 1694: case 1706: case 1717: return @itemId; //Ritualists
                case 686 : case 1035: return @itemId; //Sentinels
                case 1220: case 1222: case 1230: case 1269: return @itemId; //Seraph
                case 690 : case 693 : case 700 : return @itemId; //Settlers
                case 153 : case 1071: case 1097: return @itemId; //Shamans
                case 1064: case 1065: case 1067: return @itemId; //Sinister
                case 162 : case 586 : case 601 : case 1048: return @itemId; //Soldiers
                case 148 : return @itemId; //Stout
                case 142 : return @itemId; //Strong
                case 1013: return @itemId; //Survivors
                case 1085: case 1115: case 1229: case 1262: return @itemId; //Trailblazers
                case 1015: return @itemId; //Vagabonds
                case 157 : case 1119: return @itemId; //Valkyrie
                case 1118: case 1139: case 1228: case 1264: return @itemId; //Vigilant
                case 146 : return @itemId; //Vigorous
                case 1130: case 1153: case 1224: case 1268: return @itemId; //Vipers
                case 139 : return @itemId; //Vital
                case 1140: case 1162: case 1225: case 1270: return @itemId; //Wanderers
                case 799 : case 1163: return @itemId; //Zealots2
            }
        }

        console.info(`Did not find a matching pattern to resolve hs item (baseItem: ${baseItemId}, stat: ${statId}). Will assume the base id is stat selectable.`);
        return baseItemId;
    }
})();
