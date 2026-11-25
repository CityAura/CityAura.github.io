document.addEventListener('DOMContentLoaded', () => {
  // 1. Dynamic Footer Year
  const yearEl = document.getElementById('currentYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // 2. Theme Toggle (Dark Futuristic <-> Light Minimalist Glass)
  const root = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');

  const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
  applyTheme(savedTheme);

  themeToggle.addEventListener('click', () => {
    const nextTheme = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(nextTheme);
    localStorage.setItem('portfolio-theme', nextTheme);
  });

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
  }

  // 3. Mobile Navigation Toggle
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');

  menuToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('active');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });

  // 4. Scroll Reveal Observer
  const revealObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  // 5. Local Contact Form Handler
  const contactForm = document.getElementById('contactForm');
  const formFeedback = document.getElementById('formFeedback');

  contactForm.addEventListener('submit', event => {
    event.preventDefault();
    const name = document.getElementById('senderName').value.trim();
    const email = document.getElementById('senderEmail').value.trim();
    const message = document.getElementById('senderMessage').value.trim();

    if (!name || !email || !message) {
      formFeedback.style.color = '#f87171';
      formFeedback.textContent = 'Please complete all fields before sending.';
      return;
    }

    // Store submission locally in sessionStorage & offer direct mailto trigger
    const submissions = JSON.parse(localStorage.getItem('portfolio-inquiries') || '[]');
    submissions.push({ name, email, message, date: new Date().toISOString() });
    localStorage.setItem('portfolio-inquiries', JSON.stringify(submissions));

    formFeedback.style.color = '#10b981';
    formFeedback.innerHTML = `Thank you, <strong>${escapeHtml(name)}</strong>! Your message has been logged locally. <a href="mailto:bigtownmemela@gmail.com?subject=Portfolio%20Inquiry%20from%20${encodeURIComponent(name)}&body=${encodeURIComponent(message)}" style="color:inherit;text-decoration:underline;">Click here to launch your email client</a>.`;
    contactForm.reset();
  });

  // 6. Interactive Python Project Simulators (Age & Loan/Mortgage Calculators)
  const modal = document.getElementById('demoModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalBody = document.getElementById('modalBody');
  const closeModal = document.getElementById('closeModal');
  const modalBackdrop = document.getElementById('modalBackdrop');

  document.querySelectorAll('[data-demo]').forEach(btn => {
    btn.addEventListener('click', () => {
      const type = btn.getAttribute('data-demo');
      openDemo(type);
    });
  });

  function openDemo(type) {
    if (type === 'age') {
      modalTitle.textContent = 'Python Age Calculator — Web Preview';
      modalBody.innerHTML = `
        <div class="form-group">
          <label for="dobInput">Select Date of Birth:</label>
          <input type="date" id="dobInput" />
        </div>
        <button id="calcAgeBtn" class="btn btn-primary full-width">Calculate Exact Age</button>
        <div id="ageOutput" class="sim-result" style="display:none;"></div>
      `;
      document.getElementById('calcAgeBtn').addEventListener('click', calculateExactAge);
    } else if (type === 'loan') {
      modalTitle.textContent = 'Loan & Mortgage Calculator — Web Preview';
      modalBody.innerHTML = `
        <div class="form-group">
          <label for="incomeInput">Monthly Income (₦):</label>
          <input type="number" id="incomeInput" placeholder="e.g. 500000" />
        </div>
        <div class="form-group">
          <label for="loanAmountInput">Requested Loan / Mortgage Amount (₦):</label>
          <input type="number" id="loanAmountInput" placeholder="e.g. 2000000" />
        </div>
        <div class="form-group">
          <label for="monthsInput">Repayment Duration (Months):</label>
          <input type="number" id="monthsInput" value="12" min="1" />
        </div>
        <div class="form-group">
          <label for="paidInput">Amount Already Paid (₦):</label>
          <input type="number" id="paidInput" value="0" min="0" />
        </div>
        <button id="calcLoanBtn" class="btn btn-primary full-width">Compute Loan & Balance</button>
        <div id="loanOutput" class="sim-result" style="display:none;"></div>
      `;
      document.getElementById('calcLoanBtn').addEventListener('click', calculateLoanDetails);
    }

    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
  }

  function calculateExactAge() {
    const dobVal = document.getElementById('dobInput').value;
    const output = document.getElementById('ageOutput');
    if (!dobVal) return;

    const dob = new Date(dobVal);
    const today = new Date();
    if (dob > today) {
      output.style.display = 'block';
      output.textContent = 'Date of birth cannot be in the future.';
      return;
    }

    let years = today.getFullYear() - dob.getFullYear();
    let months = today.getMonth() - dob.getMonth();
    let days = today.getDate() - dob.getDate();

    if (days < 0) {
      months -= 1;
      const prevMonthDays = new Date(today.getFullYear(), today.getMonth(), 0).getDate();
      days += prevMonthDays;
    }
    if (months < 0) {
      years -= 1;
      months += 12;
    }

    output.style.display = 'block';
    output.innerHTML = `<strong>Exact Age:</strong> ${years} Years, ${months} Months, and ${days} Days.`;
  }

  function calculateLoanDetails() {
    const income = parseFloat(document.getElementById('incomeInput').value) || 0;
    const principal = parseFloat(document.getElementById('loanAmountInput').value) || 0;
    const months = parseInt(document.getElementById('monthsInput').value, 10) || 1;
    const alreadyPaid = parseFloat(document.getElementById('paidInput').value) || 0;
    const output = document.getElementById('loanOutput');

    const maxEligibleMortgage = income * 0.4 * months;
    const annualRate = 0.12; // 12% standard annual rate
    const totalPayable = principal * (1 + annualRate * (months / 12));
    const monthlyInstallment = totalPayable / months;
    const remainingBalance = Math.max(0, totalPayable - alreadyPaid);

    output.style.display = 'block';
    output.innerHTML = `
      <div><strong>Max Eligible Mortgage Capacity:</strong> ₦${maxEligibleMortgage.toLocaleString()}</div>
      <div><strong>Total Amount to Be Paid:</strong> ₦${totalPayable.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
      <div><strong>Monthly Installment:</strong> ₦${monthlyInstallment.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
      <div><strong>Remaining Account Balance After Payment:</strong> ₦${remainingBalance.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
    `;
  }

  function hideModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
  }

  closeModal.addEventListener('click', hideModal);
  modalBackdrop.addEventListener('click', hideModal);

  function escapeHtml(str) {
    return str.replace(/[&<>"']/g, m => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[m]));
  }
});