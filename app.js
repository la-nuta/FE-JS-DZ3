(function () {
    'use strict';

    let allTagsZone1 = new Set(),
        allTagsForAutoComplete = new Set(),
        allTagsZone2 = new Set();

    createElements(1, 2);
    addContainers();

    function createElements(...args) {
        let fragmentWithZones = document.createDocumentFragment();

        fragmentWithZones.append(...args.map(num => {
            let zone = document.createElement('div'),
                textInput = document.createElement('input'),
                textLabel = document.createElement('label'),
                container = document.createElement('div');

            zone.appendChild(textInput);
            zone.appendChild(textLabel);
            zone.appendChild(container);
            zone.id = `zone${num}`;
            container.id = `container${num}`;
            textInput.type = 'text';
            textInput.id = `textInput${num}`;
            textLabel.id = `textLabel${num}`;
            textLabel.for = `textInput${num}`;
            textLabel.textContent = 'Add';

            return zone;
        }));
        document.body.appendChild(fragmentWithZones);
    }


    function addContainers() {
        let zone2 = document.getElementById('zone2'),
            autoCompleteContainer = document.createElement('select');
        zone2.appendChild(autoCompleteContainer);
        autoCompleteContainer.id = 'autoCompleteContainer';
        autoCompleteContainer.multiple = 'multiple';
    }

    function sortTags() {
        let sorted = [...allTagsZone1.keys()].sort(alphabetOrder),
            container1 = document.getElementById('container1');

        for (let i = 0; i < sorted.length; i++) {
            let tag = document.createElement('span');
            container1.appendChild(tag);
            tag.classList.add('tags');
            tag.textContent = sorted[i];
        }
    }

    function alphabetOrder(a, b) {
        let aCode = a.toLowerCase().replace('ё', 'е' + String.fromCharCode(1110)),
            bCode = b.toLowerCase().replace('ё', 'е' + String.fromCharCode(1110));
        if (aCode < bCode) return -1;
        else if (aCode > bCode) return 1;
    }

    document.body.addEventListener('change', function (event) {
        let target = event.target,
            container1 = document.getElementById('container1'),
            textInput1 = document.getElementById('textInput1');

        if (target === textInput1 && !allTagsZone1.has(target.value)) {
            let tagName = target.value;
            container1.textContent = '';
            allTagsZone1.add(tagName);
            sortTags();
            target.value = '';
        }

        else if (target && allTagsZone1.has(target.value)) {
            target.value = '';
        }
    });

    document.body.addEventListener('click', function (event) {
        let target = event.target,
            targetTag = target.classList.contains('tags'),
            container1 = document.getElementById('container1'),
            container2 = document.getElementById('container2'),
            textInput2 = document.getElementById('textInput2'),
            autoCompleteContainer = document.getElementById('autoCompleteContainer');

        if (targetTag) {
            target.remove();
            allTagsZone1.delete(target.textContent);
            allTagsZone2.delete(target.textContent);
        }

        else if (target.classList.contains('auto-complete') && !allTagsZone2.has(target.value)) {

            let tagName = target.value,
                tag = document.createElement('span');

            autoCompleteContainer.textContent = '';
            allTagsZone1.delete(tagName);
            container2.appendChild(tag);
            tag.classList.add('tags');
            tag.textContent = tagName;
            target.value = '';
            textInput2.value = '';
            container1.textContent = '';
            sortTags();
            allTagsZone2.add(tagName);
        }

        else if (target.classList.contains('auto-complete') && !allTagsZone2.has(target.value)) {
            autoCompleteContainer.textContent = '';
            textInput2.value = '';
        }
    });

    document.body.addEventListener('input', function (event) {
        let target = event.target,
            textInput2 = document.getElementById('textInput2'),
            autoCompleteContainer = document.getElementById('autoCompleteContainer');

        if (target === textInput2 && target.value) {
            autoCompleteContainer.textContent = '';

            for (let key of allTagsZone1.keys()) {
                if (key.indexOf(textInput2.value.toLowerCase()) + 1 || key.indexOf(textInput2.value.toUpperCase()) + 1) {
                    let autoCompleteTag = document.createElement('option');
                    autoCompleteTag.textContent = key;
                    autoCompleteContainer.appendChild(autoCompleteTag);
                    autoCompleteTag.classList.add('auto-complete');
                    allTagsForAutoComplete.add(key);
                }
            }
            autoCompleteContainer.size = allTagsForAutoComplete.size;
            allTagsForAutoComplete.clear();
        }
        else if (target === textInput2 && !target.value) {
            autoCompleteContainer.textContent = '';
        }
    });

    document.body.addEventListener('keydown', function (event) {
        let target = event.target,
            tagName = target.value,
            container1 = document.getElementById('container1'),
            container2 = document.getElementById('container2'),
            textInput2 = document.getElementById('textInput2'),
            autoCompleteContainer = document.getElementById('autoCompleteContainer'),
            tag = document.createElement('span');

        if (target === textInput2 && event.keyCode === 13 && !allTagsZone2.has(target.value)) {
            autoCompleteContainer.textContent = '';
            allTagsZone1.delete(tagName);
            container2.appendChild(tag);
            tag.classList.add('tags');
            tag.textContent = tagName;
            target.value = '';
            container1.textContent = '';
            sortTags();
            allTagsZone2.add(tagName);
        }
        else if (target === textInput2 && event.keyCode === 13 && allTagsZone2.has(target.value)) {
            autoCompleteContainer.textContent = '';
            target.value = '';
        }
    });
}());