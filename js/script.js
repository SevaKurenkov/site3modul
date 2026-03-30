document.addEventListener("DOMContentLoaded", () => {
    let score = 0;
    {
        let flowers = document.querySelectorAll('.flower');
        let modal1 = document.querySelectorAll('[data-js="modal1"]');
        let first = null;
        let second = null;
        let lock = false;
        let matchedPairs = 0;
        flowers.forEach(flower => {
            flower.style.opacity = '0.3';
        });

        flowers.forEach(flower => {
            flower.addEventListener('click', () => {
                if (lock) return;
                if (flower == first) return;

                flower.style.opacity = '1';

                if (!first) {
                    first = flower;
                    return;
                }

                second = flower;
                lock = true;

                setTimeout(() => {
                    let firstId = first.dataset.js;
                    let secondId = second.dataset.js;

                    if (firstId == secondId) {
                        first = null;
                        second = null;
                        lock = false;
                        matchedPairs += 1;
                    } else {
                        first.style.opacity = '0.3';
                        second.style.opacity = '0.3';

                        first = null;
                        second = null;
                        lock = false;
                    }
                }, 1200);
            });
        });

        if (matchedPairs == 6) {
            modal1.style.visibility = 'block'
            console.log("отработало")
        }
    } // цветочки

    {
        let cursor = document.querySelector('[data-js="cursorcreon"]');
        let paintField = document.querySelector('[data-js="paintfield"]');
        paintField.addEventListener('mousemove', (e) => {
            cursor.style.display = 'block';
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });
        paintField.addEventListener('mouseleave', (e) => {
            cursor.style.display = 'none';
        });

    } //курсор

    {
        let paintfield = document.querySelector('[data-js="paintfield"]');
        let instrument1 = document.querySelector('[data-js="instrument1"]'); // карандаш квадрат
        let instrument2 = document.querySelector('[data-js="instrument2"]'); // карандаш круг
        let instrument3 = document.querySelector('[data-js="instrument3"]'); // ластик
        let instrument4 = document.querySelector('[data-js="instrument4"]'); // рефреш
        let colors = document.querySelectorAll('.color');
        let pxels = document.querySelector('[data-js="pxels"]');
        let pxelsout = document.querySelector('[data-js="outfieldpx"]');
        let drawing = false;
        let color = '#000000';
        instrument1.addEventListener('click', () => currentTool = 'square');
        instrument2.addEventListener('click', () => currentTool = 'circle');
        instrument3.addEventListener('click', () => currentTool = 'eraser');
        let currentTool = 'square';
        let size = 20;
        pxels.min = 5;
        pxels.max = 100;
        pxels.value = size;
        pxelsout.textContent = size + 'px';
        pxels.addEventListener('input', () => {
            size = pxels.value;
            pxelsout.textContent = size + 'px';
        });

        colors.forEach(color => {
            color.addEventListener('click', () => {
                color = color.style.backgroundColor;
            });
        });

        instrument4.addEventListener('click', () => {
            paintfield.innerHTML = '';
        });

        paintfield.addEventListener('mousedown', () => {
            drawing = true
        });
        paintfield.addEventListener('mouseleave', () => {
            drawing = false

        });
        document.addEventListener('mouseup', () => {
            drawing = false
        });

        paintfield.addEventListener('mousemove', (e) => {
            if (!drawing) return;
            let rect = paintfield.getBoundingClientRect();
            let x = e.clientX - rect.left;
            let y = e.clientY - rect.top;
            draw(x, y);
        });

        function draw(x, y) {
            let el = document.createElement('div');
            el.style.position = 'absolute';
            el.style.left = x - size / 2 + 'px';
            el.style.top = y - size / 2 + 'px';
            el.style.width = size + 'px';
            el.style.height = size + 'px';
            if (currentTool === 'square') {
                el.style.backgroundColor = color;
            }
            if (currentTool === 'circle') {
                el.style.backgroundColor = color;
                el.style.borderRadius = '1000px';
            }
            if (currentTool === 'eraser') {
                el.style.backgroundColor = '#FFE9DC';
                el.style.borderRadius = '1000px';
            }
            paintfield.appendChild(el);
        }
    } //рисовалка

    {
        let rounds = document.querySelectorAll('.round');

        rounds.forEach(round => {
            let canvas = round.querySelector('canvas');
            let ctx = canvas.getContext('2d');

            let size = 130;

            canvas.width = size;
            canvas.height = size;
            ctx.fillStyle = '#FFF367';
            ctx.fillRect(0, 0, size, size);

            ctx.globalCompositeOperation = 'destination-out';

            let isDrawing = false;

            canvas.addEventListener('mousedown', () => isDrawing = true);
            document.addEventListener('mouseup', () => isDrawing = false);

            canvas.addEventListener('mousemove', (e) => {
                if (!isDrawing) return;

                let rect = canvas.getBoundingClientRect();
                let x = e.clientX - rect.left;
                let y = e.clientY - rect.top;

                ctx.beginPath();
                ctx.arc(x, y, 15, 0, Math.PI * 2);
                ctx.fill();
            });
        });
    } //стирание додепа

    {
        let scratch = document.querySelector('[data-js="scratch"]');
        let canvas = scratch.querySelector('.scratch-canvas');
        let ctx = canvas.getContext('2d');
        let rect = scratch.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
        ctx.fillStyle = '#FD5A47';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.globalCompositeOperation = 'destination-out';
        let isDrawing = false;

        canvas.addEventListener('mousedown', () => isDrawing = true);
        document.addEventListener('mouseup', () => isDrawing = false);

        canvas.addEventListener('mousemove', (e) => {
            if (!isDrawing) return;
            let r = canvas.getBoundingClientRect();
            let x = e.clientX - r.left;
            let y = e.clientY - r.top;
            ctx.beginPath();
            ctx.arc(x, y, 30, 0, Math.PI * 2);
            ctx.fill();
        });
    } //стирание надписи

    {
        let container = document.querySelector('#puzzle');
        let sortable = new Sortable.default(container, {
            draggable: 'img',
        });
    } //перетаскивалка

    {
        let container = document.querySelector('.thirdsection1');
        let items = document.querySelectorAll('.xlopok');
        items.forEach(item => {
            let dragging = false;
            let offsetX, offsetY;

            item.addEventListener('mousedown', (e) => {
                dragging = true;
                offsetX = e.clientX - item.getBoundingClientRect().left;
                offsetY = e.clientY - item.getBoundingClientRect().top;
                item.style.cursor = 'grabbing';
            });

            document.addEventListener('mousemove', (e) => {
                if (!dragging) return;

                let containerRect = container.getBoundingClientRect();
                let x = e.clientX - containerRect.left - offsetX;
                let y = e.clientY - containerRect.top - offsetY;
                let maxX = container.clientWidth - item.offsetWidth;
                let maxY = container.clientHeight - item.offsetHeight;
                x = Math.max(0, Math.min(x, maxX));
                y = Math.max(0, Math.min(y, maxY));
                item.style.left = x + 'px';
                item.style.top = y + 'px';
            });

            document.addEventListener('mouseup', () => {
                dragging = false;
            });
        });
    } //хлопушек


})