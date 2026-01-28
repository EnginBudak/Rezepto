let stepCount = 0;

function addIngredient(q = "", n = "") {
    const div = document.createElement('div');
    div.className = 'ing-row';
    div.innerHTML = `
        <input type="text" class="qty" placeholder="Menge" value="${q}">
        <input type="text" style="flex:1" placeholder="Zutat" value="${n}">
        <button class="btn-del ui-element" onclick="this.parentElement.remove()">✕</button>
    `;
    document.getElementById('list-ings').appendChild(div);
}

function addStep(t = "", i = "") {
    stepCount++;
    const fId = `f${stepCount}`, pId = `p${stepCount}`, lId = `l${stepCount}`;
    const div = document.createElement('div');
    div.className = 'step-item';
    div.innerHTML = `
        <div style="display:flex; justify-content:space-between; margin-bottom:10px;">
            <b style="color:var(--primary)">SCHRITT ${stepCount}</b>
            <button class="btn-del ui-element" onclick="this.parentElement.parentElement.remove()">✕</button>
        </div>
        <!-- Textareas wachsen automatisch mit dem Text mit -->
        <textarea placeholder="Was ist zu tun?" oninput="this.style.height='';this.style.height=this.scrollHeight+'px'">${t}</textarea>
        <div class="step-img-box" onclick="document.getElementById('${fId}').click()">
            <img id="${pId}" src="${i}" class="${i ? '' : 'hidden'}">
            <span id="${lId}" class="ui-element ${i ? 'hidden' : ''}">📷 Foto hinzufügen</span>
        </div>
        <input type="file" id="${fId}" class="hidden" accept="image/*" onchange="processImage(this, '${pId}', '${lId}')">
    `;
    document.getElementById('list-steps').appendChild(div);
}

function processImage(input, prevId, labelId) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = document.getElementById(prevId);
            img.src = e.target.result;
            img.classList.remove('hidden');
            if(labelId) document.getElementById(labelId).classList.add('hidden');
        };
        reader.readAsDataURL(input.files[0]);
    }
}

function prepareAndPrint() {
    document.querySelectorAll('textarea').forEach(ta => {
        ta.style.height = 'auto';
        ta.style.height = ta.scrollHeight + 'px';
    });

    window.print();
}

window.onload = () => {
    addIngredient();
    addStep();
};