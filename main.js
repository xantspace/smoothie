/*
  =========================================
  FruitBlend Premium Website Controller
  =========================================
*/

document.addEventListener('DOMContentLoaded', () => {

  /* --- Navigation & Header Scroll Controller --- */
  const header = document.querySelector('header');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section');

  window.addEventListener('scroll', () => {
    // Add sticky class on scroll
    if (window.scrollY > 50) {
      header.classList.add('sticky');
    } else {
      header.classList.remove('sticky');
    }
  });

  // Track active navigation link on scroll
  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px', // Trigger when section is in middle of viewport
    threshold: 0
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}` || (id === 'home' && link.getAttribute('href') === '#')) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => sectionObserver.observe(section));


  /* --- Hero Mouse Parallax Effect --- */
  const heroSection = document.getElementById('home');
  const fruitLayers = document.querySelectorAll('.fruit-layer');

  if (heroSection) {
    heroSection.addEventListener('mousemove', (e) => {
      const { width, height } = heroSection.getBoundingClientRect();
      const mouseX = e.clientX - width / 2;
      const mouseY = e.clientY - height / 2;

      fruitLayers.forEach(layer => {
        const speed = parseFloat(layer.getAttribute('data-speed')) || 0;
        const x = (mouseX * speed) / 150;
        const y = (mouseY * speed) / 150;
        // Keep some natural floating base
        layer.style.transform = `translate(${x}px, ${y}px)`;
      });
    });

    // Reset translation on mouse leave for elegance
    heroSection.addEventListener('mouseleave', () => {
      fruitLayers.forEach(layer => {
        layer.style.transform = 'translate(0px, 0px)';
      });
    });
  }


  /* --- Flavor Nutrition Modal Dataset --- */
  const flavorData = {
    mango: {
      title: 'Tropical Mango Tango',
      desc: 'Sun-ripened organic mangoes blended with sweet gold peaches and wild passionfruit juice. Extremely rich in Vitamin C, prebiotic fibers, and enzymes to support gut health and high vitality.',
      calories: 185,
      sugar: '24g',
      fiber: '4.5g',
      ingredients: 'Organic Mango Puree, White Peach Nectar, Fresh Passionfruit Pulp, Coconut Water base.',
      colorGrad: 'url(#grad-mango)',
      accentColor: 'var(--color-mango)'
    },
    berry: {
      title: 'Wild Berry Blast',
      desc: 'An antioxidant superpower blend showcasing plump local strawberries, mountain blackberries, wild blueberries, and red raspberries. Combats oxidative stress and gives a natural skin glow.',
      calories: 142,
      sugar: '16g',
      fiber: '6.2g',
      ingredients: 'Whole Strawberries, Wild Blueberries, Red Raspberries, Organic Blackberries, Fresh Apple Juice.',
      colorGrad: 'url(#grad-berry)',
      accentColor: 'var(--color-berry)'
    },
    green: {
      title: 'Emerald Green Glow',
      desc: 'A premium low-glycemic alkalizing detox powerhouse. Packed with organic baby spinach, crisp green apple, mineral-rich celery juice, organic curly kale, and a spicy kick of ginger root.',
      calories: 120,
      sugar: '11g',
      fiber: '5.0g',
      ingredients: 'Baby Spinach, Curly Kale, Green Apple slices, Fresh Ginger root, Lime juice, Coconut Water.',
      colorGrad: 'url(#grad-green)',
      accentColor: 'var(--color-green)'
    },
    citrus: {
      title: 'Citrus Splash',
      desc: 'The ultimate morning immune booster. Freshly pressed Valencia oranges, ruby red grapefruit, and a vibrant squeeze of lemon and lime, rounded out with cold-pressed pineapple juice.',
      calories: 156,
      sugar: '19g',
      fiber: '3.8g',
      ingredients: 'Valencia Orange juice, Pressed Ruby Red Grapefruit, Pineapple juice, Lemon & Lime Zest.',
      colorGrad: 'url(#grad-citrus)',
      accentColor: 'var(--color-citrus)'
    },
    coco: {
      title: 'Creamy Coco Dream',
      desc: 'A rich, creamy, hydrating post-workout recovery elixir. Smooth raw coconut milk combined with premium bananas and sweet tropical pineapple. High in potassium and electrolytes.',
      calories: 210,
      sugar: '22g',
      fiber: '4.2g',
      ingredients: 'Raw Coconut Milk, Ripe Bananas, Sweet Pineapple chunks, Organic Chia seeds, Agave nectar.',
      colorGrad: 'url(#grad-coco)',
      accentColor: 'var(--color-coco)'
    },
    acai: {
      title: 'Superfood Açai Fusion',
      desc: 'Pure Brazilian superfood açai berry pulp blended with blackberries, pomegranate seeds, and organic almond milk. Rich in essential omega fatty acids, calcium, and intense energy.',
      calories: 168,
      sugar: '14g',
      fiber: '7.0g',
      ingredients: 'Organic Açai Berry pulp, Pressed Pomegranate juice, Blackberries, Raw Honey, Creamy Almond Milk.',
      colorGrad: 'url(#grad-acai)',
      accentColor: 'var(--color-acai)'
    }
  };

  /* --- Modal Open/Close Mechanics --- */
  const modal = document.getElementById('nutrition-modal');
  const modalCloseBtn = document.getElementById('modal-close');
  const detailsButtons = document.querySelectorAll('.btn-details');

  const modalTitle = document.getElementById('modal-title');
  const modalDesc = document.getElementById('modal-desc');
  const statCals = document.getElementById('stat-cals');
  const statSugar = document.getElementById('stat-sugar');
  const statFiber = document.getElementById('stat-fiber');
  const modalIngredients = document.getElementById('modal-ingredients');
  const modalVisualPlaceholder = document.getElementById('modal-visual-placeholder');

  const openModal = (flavorKey) => {
    const data = flavorData[flavorKey];
    if (!data) return;

    // Populate data inside modal
    modalTitle.textContent = data.title;
    modalDesc.textContent = data.desc;
    statCals.textContent = data.calories;
    statSugar.textContent = data.sugar;
    statFiber.textContent = data.fiber;
    modalIngredients.textContent = data.ingredients;

    // Inject matching dynamic colored SVG Cup
    modalVisualPlaceholder.innerHTML = `
      <svg viewBox="0 0 200 200" style="height: 100%; filter: drop-shadow(0 15px 25px ${data.accentColor}44);">
        <path d="M70 160 L130 160 L145 50 L55 50 Z" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.2)" stroke-width="2"/>
        <path d="M74 152 L126 152 L138 75 L62 75 Z" fill="${data.colorGrad}" />
        <line x1="110" y1="100" x2="135" y2="20" stroke="#fff" stroke-width="5" stroke-dasharray="6 3" stroke-linecap="round" />
        <circle cx="100" cy="110" r="25" fill="#fff" opacity="0.1"/>
      </svg>
    `;

    // Activate Modal overlay
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Lock background scrolling
  };

  const closeModal = () => {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto'; // Unlock scrolling
  };

  detailsButtons.forEach(button => {
    button.addEventListener('click', () => {
      const flavorKey = button.getAttribute('data-flavor');
      openModal(flavorKey);
    });
  });

  modalCloseBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal(); // Click backdrop closes modal
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
  });


  /* --- Interactive Smoothie Blender Game --- */
  const ingredientButtons = document.querySelectorAll('.ingredient-btn');
  const blendTriggerBtn = document.getElementById('btn-blend-trigger');
  const blenderStatus = document.getElementById('blender-status');
  const liquidLayer = document.getElementById('liquid-layer');
  const baseIndicatorLight = document.getElementById('base-indicator-light');
  const blenderVisualBox = document.getElementById('blender-visual-box');
  const glassSvg = document.getElementById('glass-svg');
  const glassLiquid = document.getElementById('glass-liquid');
  const glassFoam = document.getElementById('glass-foam');
  const pourStreamSvg = document.getElementById('pour-stream-svg');
  const pourStreamPath = document.getElementById('pour-stream-path');
  const blendResultLabel = document.getElementById('blend-result-label');
  const blendResultName = document.getElementById('blend-result-name');

  // SVG path for liquid at reset (flat line at jar bottom)
  const LIQUID_RESET_PATH = 'M131 296 L189 296 L189 296 L131 296 Z';
  // SVG path for liquid when fully blended (fills jar to near top)
  const LIQUID_FULL_PATH  = 'M106 115 L214 115 L192 302 L128 302 Z';

  let selectedIngredients = [];
  let isBlending = false;

  // Resolves after `ms` milliseconds
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  // Color blending algorithm (calculates average of hex colors)
  const calculateBlendColor = (ingredients) => {
    if (ingredients.length === 0) return '#ffffff';
    let r = 0, g = 0, b = 0;
    ingredients.forEach(ing => {
      const hex = ing.color;
      r += parseInt(hex.substring(1, 3), 16);
      g += parseInt(hex.substring(3, 5), 16);
      b += parseInt(hex.substring(5, 7), 16);
    });
    r = Math.floor(r / ingredients.length);
    g = Math.floor(g / ingredients.length);
    b = Math.floor(b / ingredients.length);
    const toHex = (c) => { const h = c.toString(16); return h.length === 1 ? '0' + h : h; };
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  };

  // Ingredient selection logic
  ingredientButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      if (isBlending) return;
      const name = btn.getAttribute('data-ingredient');
      const color = btn.getAttribute('data-color');
      const isSelected = btn.classList.contains('selected');

      if (isSelected) {
        btn.classList.remove('selected');
        selectedIngredients = selectedIngredients.filter(ing => ing.name !== name);
      } else {
        if (selectedIngredients.length >= 3) {
          blenderStatus.textContent = "Oops! Max 3 ingredients allowed at once.";
          blenderStatus.style.transform = 'scale(1.05)';
          setTimeout(() => blenderStatus.style.transform = 'scale(1)', 200);
          return;
        }
        btn.classList.add('selected');
        selectedIngredients.push({ name, color });
      }

      if (selectedIngredients.length > 0) {
        blendTriggerBtn.removeAttribute('disabled');
        const listNames = selectedIngredients.map(i => i.name.charAt(0).toUpperCase() + i.name.slice(1)).join(' + ');
        blenderStatus.textContent = `Selected: ${listNames}. Ready to blend!`;
        blenderStatus.style.color = 'var(--color-green)';
      } else {
        blendTriggerBtn.setAttribute('disabled', 'true');
        blenderStatus.textContent = "Please select at least 1 ingredient to begin.";
        blenderStatus.style.color = 'var(--accent-pink)';
      }
    });
  });

  blendTriggerBtn.addEventListener('click', () => {
    if (selectedIngredients.length === 0 || isBlending) return;
    isBlending = true;
    blendTriggerBtn.setAttribute('disabled', 'true');
    ingredientButtons.forEach(btn => btn.setAttribute('disabled', 'true'));
    runBlendSequence(selectedIngredients.slice());
  });

  async function runBlendSequence(ingredients) {
    const blendedColor = calculateBlendColor(ingredients);

    // Reset liquid to empty
    liquidLayer.setAttribute('d', LIQUID_RESET_PATH);
    liquidLayer.style.fill = blendedColor;

    await phase1DropIngredients(ingredients, blendedColor);
    await phase2Frenzy();
    await phase3Settle(blendedColor);
    await phase4Pour(blendedColor);
    await phase5Result(ingredients);
  }

  async function phase1DropIngredients(ingredients, blendedColor) {
    blenderStatus.textContent = 'Adding ingredients...';
    blenderStatus.style.color = 'var(--color-citrus)';

    for (let i = 0; i < ingredients.length; i++) {
      const ing = ingredients[i];

      const fruit = document.createElement('div');
      fruit.className = 'falling-fruit';
      fruit.style.left = `${90 + Math.random() * 140}px`;
      fruit.style.top = '80px';
      fruit.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="9" fill="${ing.color}" opacity="0.9"/>
        <circle cx="9" cy="9" r="3" fill="rgba(255,255,255,0.3)"/>
      </svg>`;
      blenderVisualBox.appendChild(fruit);
      setTimeout(() => fruit.remove(), 900);

      const blenderSvg = blenderVisualBox.querySelector('.blender-svg');
      const ring = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      ring.setAttribute('cx', '160');
      ring.setAttribute('cy', '295');
      ring.setAttribute('r', '18');
      ring.setAttribute('fill', 'none');
      ring.setAttribute('stroke', ing.color);
      ring.setAttribute('stroke-width', '3');
      ring.style.opacity = '0.8';
      ring.style.animation = 'splashRing 0.4s ease-out forwards';
      ring.style.transformOrigin = '160px 295px';
      blenderSvg.appendChild(ring);
      setTimeout(() => ring.remove(), 450);

      const fraction = (i + 1) / ingredients.length;
      liquidLayer.style.fill = blendedColor;
      liquidLayer.style.opacity = String(0.2 + 0.6 * fraction);

      await delay(420);
    }

    await delay(200);
  }

  async function phase2Frenzy() {
    blenderStatus.textContent = 'Blending... crushing organic fruit!';
    blenderStatus.style.color = 'var(--color-citrus)';

    baseIndicatorLight.setAttribute('fill', '#eab308');
    baseIndicatorLight.setAttribute('filter', '');
    blenderVisualBox.classList.add('blending');

    const blenderSvg = blenderVisualBox.querySelector('.blender-svg');

    const bubbleInterval = setInterval(() => {
      const bubble = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      const cx = 130 + Math.random() * 60;
      bubble.setAttribute('cx', String(cx));
      bubble.setAttribute('cy', '290');
      bubble.setAttribute('r', String(2 + Math.random() * 4));
      bubble.setAttribute('fill', 'rgba(255,255,255,0.4)');
      bubble.style.transition = 'transform 0.6s ease-out, opacity 0.6s ease-out';
      blenderSvg.appendChild(bubble);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          bubble.style.transform = `translateY(-${80 + Math.random() * 60}px)`;
          bubble.style.opacity = '0';
        });
      });

      setTimeout(() => bubble.remove(), 650);
    }, 180);

    await delay(2000);
    clearInterval(bubbleInterval);
    blenderVisualBox.classList.remove('blending');
  }

  async function phase3Settle(blendedColor) {
    blenderStatus.textContent = 'Settling...';
    blenderStatus.style.color = 'var(--color-citrus)';

    const blade = document.getElementById('spinner-blade');

    const durations = [0.12, 0.2, 0.35, 0.55, 0.8];
    for (const dur of durations) {
      blade.style.animationDuration = `${dur}s`;
      await delay(120);
    }
    blade.style.animation = 'none';
    blade.style.animationDuration = '';

    liquidLayer.setAttribute('d', LIQUID_FULL_PATH);
    liquidLayer.style.opacity = '1';
    liquidLayer.style.transition = 'fill 1.0s ease';
    liquidLayer.style.fill = blendedColor;

    liquidLayer.style.animation = 'liquidSettle 0.3s ease-in-out 2';
    await delay(700);
    liquidLayer.style.animation = '';

    baseIndicatorLight.setAttribute('fill', '#16a34a');
    baseIndicatorLight.setAttribute('filter', 'url(#d-glow-green)');

    await delay(600);
  }

  async function phase4Pour(blendedColor) {
    blenderStatus.textContent = 'Pouring...';
    blenderStatus.style.color = 'var(--color-green)';

    glassSvg.classList.add('visible');
    glassLiquid.setAttribute('fill', blendedColor);

    await delay(450);

    blenderVisualBox.style.transition = 'transform 0.5s ease-in-out';
    blenderVisualBox.style.transformOrigin = 'bottom center';
    blenderVisualBox.style.transform = 'rotate(-12deg)';

    await delay(550);

    const containerEl = blenderVisualBox.closest('.blender-container');
    const containerRect = containerEl.getBoundingClientRect();
    const blenderRect = blenderVisualBox.getBoundingClientRect();
    const glassRect = glassSvg.getBoundingClientRect();

    const spoutX = blenderRect.right - containerRect.left - 15;
    const spoutY = blenderRect.top - containerRect.top + blenderRect.height * 0.22;
    const glassX = glassRect.left - containerRect.left + 15;
    const glassY = glassRect.top - containerRect.top + 12;
    const cpX = (spoutX + glassX) / 2;
    const cpY = Math.max(spoutY, glassY) + 20;

    pourStreamPath.setAttribute('d', `M ${spoutX} ${spoutY} Q ${cpX} ${cpY} ${glassX} ${glassY}`);
    pourStreamPath.setAttribute('stroke', blendedColor);

    const pathLength = pourStreamPath.getTotalLength();
    pourStreamPath.style.strokeDasharray = `${pathLength}`;
    pourStreamPath.style.strokeDashoffset = `${pathLength}`;
    pourStreamPath.style.opacity = '1';
    pourStreamPath.style.transition = `stroke-dashoffset 0.8s ease-in-out`;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        pourStreamPath.style.strokeDashoffset = '0';
      });
    });

    await delay(100);
    const glassFillDuration = 1200;
    const glassHeight = 156;
    const start = performance.now();

    await new Promise(resolve => {
      function fillFrame(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / glassFillDuration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const filledH = glassHeight * eased;
        const filledY = 168 - filledH;
        glassLiquid.setAttribute('y', String(filledY));
        glassLiquid.setAttribute('height', String(filledH));
        if (progress < 1) {
          requestAnimationFrame(fillFrame);
        } else {
          resolve();
        }
      }
      requestAnimationFrame(fillFrame);
    });

    glassFoam.setAttribute('cy', '17');
    glassFoam.style.opacity = '1';
    glassFoam.style.transition = 'opacity 0.4s ease';

    await delay(300);

    liquidLayer.style.transition = 'fill 0.6s ease';
    liquidLayer.setAttribute('d', 'M131 296 L189 296 L192 296 L128 296 Z');

    pourStreamPath.style.transition = 'opacity 0.3s ease';
    pourStreamPath.style.opacity = '0';

    await delay(400);
    blenderVisualBox.style.transform = 'rotate(0deg)';

    await delay(500);
  }

  async function phase5Result(ingredients) {
    const capitalizedNames = ingredients
      .map(i => i.name.charAt(0).toUpperCase() + i.name.slice(1))
      .join(' & ');

    blendResultName.textContent = `${capitalizedNames} Blend`;
    blendResultLabel.classList.add('visible');

    blenderStatus.innerHTML = `✓ <strong>${capitalizedNames}</strong> Smoothie ready!`;
    blenderStatus.style.color = 'var(--color-green)';

    blendTriggerBtn.textContent = 'Blend Again';
    blendTriggerBtn.removeAttribute('disabled');
    blendTriggerBtn.onclick = () => resetBlender();
  }

  function resetBlender() {
    glassSvg.classList.remove('visible');
    blendResultLabel.classList.remove('visible');

    glassLiquid.setAttribute('y', '168');
    glassLiquid.setAttribute('height', '0');
    glassFoam.style.opacity = '0';

    pourStreamPath.setAttribute('d', '');
    pourStreamPath.style.opacity = '0';
    pourStreamPath.style.strokeDasharray = '';
    pourStreamPath.style.strokeDashoffset = '';

    liquidLayer.setAttribute('d', LIQUID_RESET_PATH);
    liquidLayer.style.fill = 'transparent';
    liquidLayer.style.opacity = '1';
    liquidLayer.style.transition = '';

    const blade = document.getElementById('spinner-blade');
    blade.style.animation = '';
    blade.style.animationDuration = '';

    baseIndicatorLight.setAttribute('fill', '#dc2626');
    baseIndicatorLight.setAttribute('filter', 'url(#d-glow-red)');

    blenderVisualBox.style.transform = '';
    blenderVisualBox.style.transition = '';

    blenderStatus.textContent = 'Please select at least 1 ingredient to begin.';
    blenderStatus.style.color = 'var(--accent-pink)';
    blendTriggerBtn.textContent = 'Blend It!';
    blendTriggerBtn.setAttribute('disabled', 'true');
    blendTriggerBtn.onclick = null;

    ingredientButtons.forEach(btn => {
      btn.removeAttribute('disabled');
      btn.classList.remove('selected');
    });

    selectedIngredients = [];
    isBlending = false;
  }


  /* --- High-Fidelity Contact Form Val & Post Animation --- */
  const contactForm = document.getElementById('contact-form');
  const formSuccessBox = document.getElementById('form-success-box');
  
  const inputName = document.getElementById('contact-name');
  const inputEmail = document.getElementById('contact-email');
  const inputSubject = document.getElementById('contact-subject');
  const inputMessage = document.getElementById('contact-message');

  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
  };

  const markFieldError = (inputElement, hasError) => {
    const formGroup = inputElement.closest('.form-group');
    if (hasError) {
      formGroup.classList.add('has-error');
    } else {
      formGroup.classList.remove('has-error');
    }
  };

  // Real-time input listeners to remove errors
  inputName.addEventListener('input', () => markFieldError(inputName, false));
  inputEmail.addEventListener('input', () => {
    if (inputEmail.value.trim() === '' || validateEmail(inputEmail.value.trim())) {
      markFieldError(inputEmail, false);
    }
  });
  inputSubject.addEventListener('input', () => markFieldError(inputSubject, false));
  inputMessage.addEventListener('input', () => markFieldError(inputMessage, false));

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameVal = inputName.value.trim();
    const emailVal = inputEmail.value.trim();
    const subjectVal = inputSubject.value.trim();
    const messageVal = inputMessage.value.trim();

    let isFormValid = true;

    // Validate Name
    if (nameVal === '') {
      markFieldError(inputName, true);
      isFormValid = false;
    } else {
      markFieldError(inputName, false);
    }

    // Validate Email
    if (emailVal === '' || !validateEmail(emailVal)) {
      markFieldError(inputEmail, true);
      isFormValid = false;
    } else {
      markFieldError(inputEmail, false);
    }

    // Validate Subject
    if (subjectVal === '') {
      markFieldError(inputSubject, true);
      isFormValid = false;
    } else {
      markFieldError(inputSubject, false);
    }

    // Validate Message
    if (messageVal === '') {
      markFieldError(inputMessage, true);
      isFormValid = false;
    } else {
      markFieldError(inputMessage, false);
    }

    if (!isFormValid) return; // Exit if validation fails

    // Submit state triggers loading text
    const submitBtn = document.getElementById('btn-submit-form');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending... 🚀';
    submitBtn.setAttribute('disabled', 'true');

    // Simulate network delay before showing premium custom success layout
    setTimeout(() => {
      formSuccessBox.classList.add('active');
      
      // Auto clean up/hide success container after 4 seconds
      setTimeout(() => {
        formSuccessBox.classList.remove('active');
        contactForm.reset();
        submitBtn.textContent = originalText;
        submitBtn.removeAttribute('disabled');
      }, 4000);

    }, 1500);

  });

});
