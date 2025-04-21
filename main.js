
        const triggers = document.querySelectorAll(".trigger");
        let lockedTrigger = null;
        triggers.forEach(trigger => {
          const content = trigger.querySelector(".content");
          // Hover in
          trigger.addEventListener("mouseenter", () => {
            if (lockedTrigger !== trigger) {
              content.classList.add("visible");
            }
          });
          // Hover out
          trigger.addEventListener("mouseleave", () => {
            if (lockedTrigger !== trigger) {
              content.classList.remove("visible");
            }
          });
          // Click: abre este y cierra otros
          trigger.addEventListener("click", (e) => {
            e.stopPropagation();
            // Cierra otros
            triggers.forEach(t => {
              const c = t.querySelector(".content");
              if (t !== trigger) {
                c.classList.remove("visible");
              }
            });
            // Abre este
            content.classList.add("visible");
            lockedTrigger = trigger;
          });
        });
        // Click fuera: cierra todo
        document.addEventListener("click", () => {
          triggers.forEach(trigger => {
            const content = trigger.querySelector(".content");
            content.classList.remove("visible");
          });
          lockedTrigger = null;
        });
        
        const slides = document.getElementById('slides');
        const indicatorsContainer = document.getElementById('indicators');
        const totalSlides = 5;
        let currentIndex = 0;

        // Crear indicadores
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('div');
            dot.classList.add('indicator');
        if (i === 0) dot.classList.add('active');
        dot.dataset.index = i;
        dot.addEventListener('click', () => {
            currentIndex = i;
            updateSlider();
        });
        indicatorsContainer.appendChild(dot);
        }

        const updateSlider = () => {
        slides.style.transform = `translateX(-${currentIndex * 100}vw)`;
        document.querySelectorAll('.indicator').forEach(dot => {
            dot.classList.remove('active');
        });
        document.querySelector(`.indicator[data-index="${currentIndex}"]`).classList.add('active');
        }

        // Cambio automático de diapositiva
        setInterval(() => {
        currentIndex = (currentIndex + 1) % totalSlides;
        updateSlider();
        }, 20000);

        function toggleText(index) {
        const textDiv = document.getElementById(`extra-${index}`);
        if (textDiv.style.display === 'block') {
            textDiv.style.display = 'none';
        } else {
            textDiv.style.display = 'block';
        }
        }

        /*form*/
        document.getElementById("contactForm").onsubmit = async function(event) {
                event.preventDefault(); // Prevents the default form submission
                
                const formData = new FormData(this);
                const response = await fetch("https://script.google.com/macros/s/AKfycbzSAfsybCNWdAJh6-2WzOvebbNkezT_th_JOgK9tGIjEqPlWU5X0fcpp3F77uL6nxqP/exec", { // Replace with your Google Apps Script URL
                    method: "POST",
                    body: formData
                });
                
                if (response.ok) {
                    alert("Submission successful!");
                    this.reset(); 
                } else {
                    alert("Submission failed.");
                }
            };
        function mostrarMensaje(isSuccess) {
            const mensajeArea = document.getElementById("mensajeConfirmacion");
            if (isSuccess) {
                mensajeArea.innerText = "Datos recibidos correctamente. ¡Gracias!";
                mensajeArea.style.color = "green";
            } else {
                mensajeArea.innerText = "Hubo un problema, intenta nuevamente.";
                mensajeArea.style.color = "red";
            }
        }
        
        const menuButton = document.querySelector('.menu-button');
        const menuOverlay = document.querySelector('.menu-overlay');
        
        menuButton.addEventListener('click', () => {
            menuOverlay.classList.toggle('active');
        });
        
        // Close menu when clicking on an option
        const menuOptions = document.querySelectorAll('.menu-option');
        menuOptions.forEach(option => {
            option.addEventListener('click', () => {
                menuOverlay.classList.remove('active');
            });
        });
        
        // Close menu when clicking outside
        menuOverlay.addEventListener('click', (e) => {
            if (e.target === menuOverlay) {
                menuOverlay.classList.remove('active');
            }
        });
        const modelViewer1 = document.querySelector('#animation-demo');
        const lines = modelViewer1.querySelectorAll('line');
        let baseRect;
        let noseRect;
        let hoofRect;
        let tailRect;

        function onResize() {
          const arStatus = modelViewer1.getAttribute('ar-status');
          baseRect = (arStatus == "not-presenting" || arStatus == "failed") ?
            modelViewer1.getBoundingClientRect() : new DOMRect();
          noseRect = document.querySelector('#nose').getBoundingClientRect();
          hoofRect = document.querySelector('#hoof').getBoundingClientRect();
          tailRect = document.querySelector('#tail').getBoundingClientRect();
        }

        window.addEventListener("resize", onResize);

        modelViewer1.addEventListener('ar-status', (event) => {
          lines.forEach((element) => {
            if (event.detail.status !== 'session-started') {
              element.classList.remove('hide');
            } else {
              element.classList.add('hide');
            }
          });
          onResize();
        });

        modelViewer1.addEventListener('load', () => {
          onResize();
          // update svg
          function drawLine(svgLine, name, rect) {
            const hotspot = modelViewer1.queryHotspot('hotspot-' + name);
            svgLine.setAttribute('x1', hotspot.canvasPosition.x);
            svgLine.setAttribute('y1', hotspot.canvasPosition.y);
            svgLine.setAttribute('x2', (rect.left + rect.right) / 2 - baseRect.left);
            svgLine.setAttribute('y2', rect.top - baseRect.top);
          }
          // use requestAnimationFrame to update with renderer
          const startSVGRenderLoop = () => {
            drawLine(lines[0], 'nose', noseRect);
            drawLine(lines[1], 'hoof', hoofRect);
            drawLine(lines[2], 'tail', tailRect);
            requestAnimationFrame(startSVGRenderLoop);
          };
          startSVGRenderLoop();
        });