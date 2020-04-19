
document.addEventListener ('DOMContentLoaded', () => {
    window.Utils = {
        templates: {
            card (options) {
                let template =  `<div class="card" style="background-image: url(${options.card}.png)">
                                    <div class="img" style="background-image: url(${options.image}.png)"></div>
                                    <div class="name text-shadow">${options.name}</div>
                                    <div class="text text-shadow">${options.text || ''}</div>
                                    <div id="health" class="health text-shadow">${options.hp || ''}</div>
                                    <div id="attack" class="attack text-shadow">${options.ap || ''}</div>
                                </div>`;
                let templateNode = document.createElement ('template');
                templateNode.innerHTML = template;
                return templateNode.content.firstChild;
            }
        }
    }
});