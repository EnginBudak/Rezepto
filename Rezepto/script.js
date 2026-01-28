let stepCount = 0;

    function addIng(q="", n="") {
        const div = document.createElement('div');
        div.className = 'ing-row';
        div.innerHTML = `
            <input type="text" class="qty" placeholder="Menge" value="${q}">
            <input type="text" style="flex:1" placeholder="Zutat" value="${n}">
            <button class="btn-del" onclick="this.parentElement.remove()">✕</button>
        `;
        document.getElementById('list-ings').appendChild(div);
    }

    function addStep(t="", i="") {
        stepCount++;
        const fId = `f${stepCount}`, pId = `p${stepCount}`, lId = `l${stepCount}`;
        const div = document.createElement('div');
        div.className = 'step-item';
        div.innerHTML = `
            <div class="step-head">
                <span class="step-nr">SCHRITT ${stepCount}</span>
                <button class="btn-del" onclick="this.parentElement.parentElement.remove()">✕</button>
            </div>
            <textarea placeholder="Was ist zu tun?" style="width:100%">${t}</textarea>
            <div class="step-img-box" onclick="document.getElementById('${fId}').click()">
                <img id="${pId}" src="${i}" class="${i ? '' : 'hidden'}">
                <span id="${lId}" class="${i ? 'hidden' : ''}">📷 Foto</span>
            </div>
            <input type="file" id="${fId}" class="hidden" accept="image/*" onchange="process(this, '${pId}', '${lId}')">
        `;
        document.getElementById('list-steps').appendChild(div);
    }

    function process(input, pId, lId) {
        if (input.files && input.files[0]) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const img = new Image();
                img.src = e.target.result;
                img.onload = function() {
                    const canvas = document.createElement('canvas');
                    const max = 800;
                    let w = img.width, h = img.height;
                    if (w > max) { h *= max/w; w = max; }
                    canvas.width = w; canvas.height = h;
                    canvas.getContext('2d').drawImage(img, 0, 0, w, h);
                    const data = canvas.toDataURL('image/jpeg', 0.8);
                    document.getElementById(pId).src = data;
                    document.getElementById(pId).classList.remove('hidden');
                    document.getElementById(lId).classList.add('hidden');
                }
            };
            reader.readAsDataURL(input.files[0]);
        }
    }

    async function exportPDF() {
        const element = document.getElementById('recipe-card');
        const overlay = document.getElementById('loading-overlay');
        const title = document.getElementById('inp-title').value || 'Mein-Rezept';
        
        overlay.style.display = 'flex';

        // UI Elemente für PDF ausblenden
        const buttons = document.querySelectorAll('.btn-del, .btn-add');
        buttons.forEach(b => b.style.opacity = '0');

        const opt = {
            margin: [15, 15],
            filename: `${title}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            // 'avoid-all' sorgt dafür, dass Elemente nicht zerhackt werden
            html2canvas: { scale: 2, useCORS: true, letterRendering: true },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
            pagebreak: { mode: 'avoid-all' } 
        };

        try {
            await html2pdf().set(opt).from(element).save();
        } catch (e) {
            alert("Fehler: " + e);
        } finally {
            buttons.forEach(b => b.style.opacity = '1');
            overlay.style.display = 'none';
        }
    }

    window.onload = () => { addIng(); addStep(); };