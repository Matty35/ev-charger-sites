/* ============================================
   EV CHARGER SITES — SHARED JAVASCRIPT
   Features:
   1. Mobile nav toggle
   2. Vehicle selector tool
   3. Cost calculator
   4. Charging time calculator
   5. Multi-step lead gen form
   6. FAQ accordion
============================================ */

'use strict';

// ============================================
// 1. MOBILE NAV
// ============================================
(function initMobileNav() {
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');

  if (!hamburger || !mobileNav) return;

  hamburger.addEventListener('click', function () {
    const isOpen = mobileNav.classList.toggle('active');
    hamburger.setAttribute('aria-expanded', isOpen);
    // Animate hamburger
    const spans = hamburger.querySelectorAll('span');
    if (isOpen) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 6px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -6px)';
    } else {
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
      spans[2].style.transform = '';
    }
  });

  // Close nav on outside click
  document.addEventListener('click', function (e) {
    if (!hamburger.contains(e.target) && !mobileNav.contains(e.target)) {
      mobileNav.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
      const spans = hamburger.querySelectorAll('span');
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
      spans[2].style.transform = '';
    }
  });
})();

// ============================================
// 2. VEHICLE SELECTOR TOOL
// ============================================
const evData = {
  'Tesla':       { charger: 'Tesla Wall Connector',            speed: '44 mph of range/hr',  price: '$850–$1,200' },
  'Ford':        { charger: 'Ford Connected Charge Station',   speed: '30 mph of range/hr',  price: '$799–$1,100' },
  'Chevrolet':   { charger: 'Emporia Level 2 Smart Charger',   speed: '25 mph of range/hr',  price: '$749–$999'   },
  'Hyundai':     { charger: 'JuiceBox 40A',                    speed: '32 mph of range/hr',  price: '$799–$1,050' },
  'Kia':         { charger: 'JuiceBox 40A',                    speed: '28 mph of range/hr',  price: '$799–$1,050' },
  'BMW':         { charger: 'ChargePoint Home Flex',           speed: '37 mph of range/hr',  price: '$899–$1,200' },
  'Audi':        { charger: 'Autel MaxiCharger',               speed: '35 mph of range/hr',  price: '$899–$1,200' },
  'Rivian':      { charger: 'Rivian Home Charger',             speed: '25 mph of range/hr',  price: '$899–$1,300' },
  'Volkswagen':  { charger: 'Wallbox Pulsar Plus',             speed: '30 mph of range/hr',  price: '$799–$1,100' },
  'Nissan':      { charger: 'Leviton EVB40',                   speed: '22 mph of range/hr',  price: '$699–$949'   },
  'Polestar':    { charger: 'Wallbox Pulsar Plus',             speed: '30 mph of range/hr',  price: '$799–$1,100' },
  'Volvo':       { charger: 'ChargePoint Home Flex',           speed: '30 mph of range/hr',  price: '$849–$1,150' },
  'Mercedes':    { charger: 'Autel MaxiCharger',               speed: '35 mph of range/hr',  price: '$899–$1,250' },
  'Porsche':     { charger: 'Porsche Mobile Charger Connect',  speed: '37 mph of range/hr',  price: '$999–$1,400' },
  'Lucid':       { charger: 'Emporia Level 2 Smart Charger',   speed: '50 mph of range/hr',  price: '$999–$1,400' },
  'GMC':         { charger: 'Emporia Level 2 Smart Charger',   speed: '25 mph of range/hr',  price: '$799–$1,100' }
};

(function initVehicleSelector() {
  const select = document.getElementById('vehicleMake');
  const result = document.getElementById('chargerRecommendation');

  if (!select || !result) return;

  select.addEventListener('change', function () {
    const make = this.value;
    if (!make || !evData[make]) {
      result.classList.remove('visible');
      return;
    }

    const data = evData[make];
    const chargerName  = result.querySelector('#recChargerName');
    const chargerSpeed = result.querySelector('#recChargerSpeed');
    const chargerPrice = result.querySelector('#recChargerPrice');

    if (chargerName)  chargerName.textContent  = data.charger;
    if (chargerSpeed) chargerSpeed.textContent = data.speed;
    if (chargerPrice) chargerPrice.textContent = data.price;

    result.classList.add('visible');
  });
})();

// ============================================
// 3. COST CALCULATOR
// ============================================
(function initCostCalculator() {
  const form = document.getElementById('costCalcForm');
  if (!form) return;

  function calcCost() {
    const propType    = form.querySelector('[name="propType"]')    ? form.querySelector('[name="propType"]').value    : '';
    const chargerKw   = form.querySelector('[name="chargerKw"]')   ? form.querySelector('[name="chargerKw"]').value   : '';
    const panelUpgrade= form.querySelector('input[name="panelUpgrade"]:checked');
    const wiringDist  = form.querySelector('[name="wiringDist"]')  ? form.querySelector('[name="wiringDist"]').value  : '';

    const upgradeNeeded = panelUpgrade ? panelUpgrade.value === 'yes' : false;

    const result = document.getElementById('calcResult');
    if (!result) return;

    if (!propType || !chargerKw || !wiringDist) return;

    let low = 799, high = 1100;

    if (propType === 'commercial') {
      low = 1500; high = 3500;
    } else {
      // Base by wiring distance
      if (wiringDist === 'medium') { low = 950;  high = 1400; }
      if (wiringDist === 'long')   { low = 1100; high = 1700; }

      // Speed add
      if (chargerKw === '11kw')   { low += 100; high += 200; }
      if (chargerKw === '19kw')   { low += 250; high += 400; }
    }

    // Panel upgrade
    if (upgradeNeeded) { low += 800; high += 2000; }

    const creditLow  = Math.round(low  * 0.30);
    const creditHigh = Math.round(high * 0.30);

    const priceEl  = result.querySelector('#resultPrice');
    const creditEl = result.querySelector('#resultCredit');
    const netEl    = result.querySelector('#resultNet');

    if (priceEl)  priceEl.textContent  = '$' + low.toLocaleString() + '–$' + high.toLocaleString();
    if (creditEl) creditEl.innerHTML   = 'Federal 30% Tax Credit saves you approximately <strong>$' + creditLow.toLocaleString() + '–$' + creditHigh.toLocaleString() + '</strong>';
    if (netEl)    netEl.textContent    = 'Estimated after-credit cost: $' + (low - creditHigh).toLocaleString() + '–$' + (high - creditLow).toLocaleString();

    result.classList.add('visible');
  }

  form.addEventListener('change', calcCost);
})();

// ============================================
// 4. CHARGING TIME CALCULATOR
// ============================================
const batteryData = {
  'Tesla Model 3 SR':        57.5,
  'Tesla Model 3 LR':        82,
  'Tesla Model Y SR':        57.5,
  'Tesla Model Y LR':        82,
  'Tesla Model S':           100,
  'Tesla Model X':           100,
  'Ford Mustang Mach-E SR':  70,
  'Ford Mustang Mach-E LR':  91,
  'Ford F-150 Lightning SR': 98,
  'Ford F-150 Lightning ER': 131,
  'Chevy Bolt EV':           65,
  'Chevy Bolt EUV':          65,
  'Hyundai IONIQ 5 SR':      58,
  'Hyundai IONIQ 5 LR':      77.4,
  'Hyundai IONIQ 6 SR':      53,
  'Hyundai IONIQ 6 LR':      77.4,
  'Kia EV6 SR':              58,
  'Kia EV6 LR':              77.4,
  'Rivian R1T SR':           135,
  'Rivian R1T LR':           149,
  'Rivian R1S SR':           135,
  'BMW i4 eDrive35':         70.2,
  'BMW i4 M50':              83.9,
  'BMW iX':                  111.5,
  'Volkswagen ID.4 SR':      62,
  'Volkswagen ID.4 LR':      82,
  'Audi e-tron GT':          93.4,
  'Audi Q8 e-tron':          114,
  'Porsche Taycan':          93.4,
  'Lucid Air':               118,
  'Nissan Leaf 40kWh':       40,
  'Nissan Leaf 62kWh':       62,
  'Volvo XC40 Recharge':     78,
  'Polestar 2':              82
};

(function initChargingCalc() {
  const vehicleSelect  = document.getElementById('chargeVehicle');
  const currentSlider  = document.getElementById('currentCharge');
  const targetSlider   = document.getElementById('targetCharge');
  const currentDisplay = document.getElementById('currentDisplay');
  const targetDisplay  = document.getElementById('targetDisplay');
  const result         = document.getElementById('chargeResult');

  if (!vehicleSelect || !result) return;

  function updateSlider(slider, display) {
    if (slider && display) {
      display.textContent = slider.value + '%';
    }
  }

  function calcTime() {
    const vehicle = vehicleSelect.value;
    const current = parseInt((currentSlider ? currentSlider.value : 20), 10);
    const target  = parseInt((targetSlider  ? targetSlider.value  : 80), 10);

    if (!vehicle || !batteryData[vehicle]) {
      result.classList.remove('visible');
      return;
    }

    if (target <= current) {
      result.classList.remove('visible');
      return;
    }

    const batteryKwh = batteryData[vehicle];
    const netKw = 6.5; // 7.2kW charger at ~90% efficiency
    const energyNeeded = ((target - current) / 100) * batteryKwh;
    const hours = energyNeeded / netKw;

    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);

    let timeStr = '';
    if (wholeHours > 0) timeStr += wholeHours + 'h ';
    timeStr += minutes + 'm';

    const timeEl   = result.querySelector('#chargeTime');
    const energyEl = result.querySelector('#chargeEnergy');
    const rangeEl  = result.querySelector('#chargeRange');

    if (timeEl)   timeEl.textContent   = timeStr;
    if (energyEl) energyEl.textContent = energyNeeded.toFixed(1) + ' kWh';
    if (rangeEl)  rangeEl.textContent  = Math.round(energyNeeded * 3.5) + ' miles approx.';

    result.classList.add('visible');
  }

  if (currentSlider) {
    currentSlider.addEventListener('input', function () {
      updateSlider(this, currentDisplay);
      calcTime();
    });
  }

  if (targetSlider) {
    targetSlider.addEventListener('input', function () {
      updateSlider(this, targetDisplay);
      calcTime();
    });
  }

  vehicleSelect.addEventListener('change', calcTime);

  // Init displays
  updateSlider(currentSlider, currentDisplay);
  updateSlider(targetSlider,  targetDisplay);
})();

// ============================================
// 5. MULTI-STEP LEAD GEN FORM
// ============================================
(function initMultiStepForm() {
  const form      = document.getElementById('leadForm');
  if (!form) return;

  const steps       = form.querySelectorAll('.form-step');
  const dots        = form.querySelectorAll('.step-dot');
  const successMsg  = form.querySelector('.form-success');
  let currentStep   = 0;

  function showStep(n) {
    steps.forEach(function (s, i) {
      s.classList.toggle('active', i === n);
    });
    dots.forEach(function (d, i) {
      d.classList.remove('active', 'completed');
      if (i === n)  d.classList.add('active');
      if (i < n)    d.classList.add('completed');
    });
    currentStep = n;
  }

  // Next buttons
  form.querySelectorAll('.btn-next').forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (!validateStep(currentStep)) return;
      if (currentStep < steps.length - 1) showStep(currentStep + 1);
    });
  });

  // Back buttons
  form.querySelectorAll('.btn-back').forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (currentStep > 0) showStep(currentStep - 1);
    });
  });

  // Submit
  const submitBtn = form.querySelector('.btn-submit');
  if (submitBtn) {
    submitBtn.addEventListener('click', function (e) {
      e.preventDefault();
      if (!validateStep(currentStep)) return;

      const nameInput = form.querySelector('[name="fullName"]');
      const firstName = nameInput ? nameInput.value.split(' ')[0] : 'there';

      if (successMsg) {
        const successName = successMsg.querySelector('.success-name');
        if (successName) successName.textContent = firstName;
        steps.forEach(function (s) { s.classList.remove('active'); });
        dots.forEach(function (d) { d.classList.remove('active'); d.classList.add('completed'); });
        successMsg.classList.add('visible');
      }

      // In production: submit to your CRM / backend here
      // e.g., fetch('/api/leads', { method: 'POST', body: new FormData(form) })
    });
  }

  function validateStep(n) {
    const step = steps[n];
    if (!step) return true;
    let valid = true;
    step.querySelectorAll('input[required], select[required]').forEach(function (field) {
      if (!field.value.trim()) {
        field.style.borderColor = '#EF4444';
        valid = false;
      } else {
        field.style.borderColor = '';
      }
    });
    return valid;
  }

  // Init
  showStep(0);
})();

// ============================================
// 6. FAQ ACCORDION
// ============================================
(function initFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(function (item) {
    const btn = item.querySelector('.faq-question');
    if (!btn) return;

    btn.addEventListener('click', function () {
      const isOpen = item.classList.contains('open');
      // Close all
      faqItems.forEach(function (fi) {
        fi.classList.remove('open');
        const a = fi.querySelector('.faq-question');
        if (a) a.setAttribute('aria-expanded', 'false');
      });
      // Toggle current
      if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
})();

// ============================================
// 7. SMOOTH SCROLL FOR ANCHOR LINKS
// ============================================
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
})();

// ============================================
// 8. STICKY HEADER SHADOW ON SCROLL
// ============================================
(function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  window.addEventListener('scroll', function () {
    if (window.scrollY > 40) {
      header.style.boxShadow = '0 4px 30px rgba(0,0,0,0.4)';
    } else {
      header.style.boxShadow = '0 2px 20px rgba(0,0,0,0.3)';
    }
  }, { passive: true });
})();
