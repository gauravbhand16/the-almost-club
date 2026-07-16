/**
 * The Almost Club - Minimal Landing Page Logic
 * Configurable, production-ready script with Web3Forms integration and clean modal behavior.
 */

// ==========================================
// 1. CONFIGURATION
// ==========================================
const CONFIG = {
  // Replace with your actual WhatsApp Community Invite URL
  whatsappUrl: "https://chat.whatsapp.com/J6BvMgwmS2CGhd8hZ8JA0P",

  // Replace with your Web3Forms Access Key
  web3FormsKey: "YOUR_WEB3FORMS_ACCESS_KEY_HERE",

  // Configurable Success Screen Typography
  successHeading: "Almost received.",
  successBody: "We'll get back to you soon."
};

// ==========================================
// 2. INITIALIZATION
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
  // Trigger page fade-in
  const body = document.getElementById("page-body");
  if (body) {
    setTimeout(() => {
      body.classList.remove("opacity-0");
      body.classList.add("animate-fade-in");
    }, 50);
  }

  // Populate CTA links from configuration
  const navJoinBtn = document.getElementById("nav-join-btn");
  const heroJoinBtn = document.getElementById("hero-join-btn");
  
  if (navJoinBtn) navJoinBtn.href = CONFIG.whatsappUrl;
  if (heroJoinBtn) heroJoinBtn.href = CONFIG.whatsappUrl;

  // Initialize Web3Forms configuration key
  const accessKeyInput = document.getElementById("web3forms-access-key");
  if (accessKeyInput) {
    accessKeyInput.value = CONFIG.web3FormsKey;
  }

  // Initialize Lucide icons
  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  }

  // Initialize Modal events
  initModal();

  // Initialize Form Submission handler
  initFormSubmit();

  // Initialize Custom Interactions (About/Products toast, scroll indicators)
  initCustomInteractions();
});

// ==========================================
// 3. MODAL CONTROLLER
// ==========================================
function initModal() {
  const modal = document.getElementById("contact-modal");
  const openBtn = document.getElementById("open-modal-btn");
  const navContactBtn = document.getElementById("nav-contact-btn");
  const closeBtn = document.getElementById("close-modal-btn");
  const backdrop = document.getElementById("modal-backdrop");
  const contentWrapper = document.getElementById("modal-content-wrapper");

  if (!modal || !closeBtn || !backdrop || !contentWrapper) return;

  // Keep a copy of initial form HTML to restore on closure
  const initialModalHtml = contentWrapper.innerHTML;

  function openModal() {
    modal.classList.add("modal-active");
    document.body.style.overflow = "hidden"; // Prevent background body scroll
    
    // Auto-focus on Name input
    const nameInput = document.getElementById("form-name");
    if (nameInput) {
      setTimeout(() => nameInput.focus(), 150);
    }
  }

  function closeModal() {
    modal.classList.remove("modal-active");
    document.body.style.overflow = ""; // Re-enable background body scroll
    
    // Restore form inputs when modal finishes fade-out animation
    setTimeout(() => {
      contentWrapper.innerHTML = initialModalHtml;
      
      const accessKeyInput = document.getElementById("web3forms-access-key");
      if (accessKeyInput) {
        accessKeyInput.value = CONFIG.web3FormsKey;
      }
      
      // Re-setup submit and close button listeners on the restored DOM elements
      initFormSubmit();
      const newCloseBtn = document.getElementById("close-modal-btn");
      if (newCloseBtn) {
        newCloseBtn.addEventListener("click", closeModal);
      }
    }, 300);
  }

  // Set event triggers
  if (openBtn) openBtn.addEventListener("click", openModal);
  if (navContactBtn) navContactBtn.addEventListener("click", (e) => {
    e.preventDefault();
    openModal();
  });
  
  closeBtn.addEventListener("click", closeModal);
  backdrop.addEventListener("click", closeModal);

  // Close modal when pressing Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("modal-active")) {
      closeModal();
    }
  });
}

// ==========================================
// 4. FORM ACTIONS & SUBMISSION
// ==========================================
function initFormSubmit() {
  const form = document.getElementById("contact-form");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const submitBtn = document.getElementById("submit-btn");
    const btnText = document.getElementById("submit-btn-text");
    const btnSpinner = document.getElementById("submit-btn-spinner");
    const errorDisplay = document.getElementById("form-error-display");

    if (!submitBtn || !btnText || !btnSpinner) return;

    // Set loading state
    submitBtn.disabled = true;
    btnText.textContent = "Sending...";
    btnSpinner.classList.remove("hidden");
    if (errorDisplay) {
      errorDisplay.classList.add("hidden");
      errorDisplay.textContent = "";
    }

    // Capture form values
    const formData = new FormData(form);
    const object = Object.fromEntries(formData);
    const json = JSON.stringify(object);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: json
      });

      const result = await response.json();

      if (response.status === 200 && result.success) {
        // Success callback
        renderSuccessState();
      } else {
        throw new Error(result.message || "Failed to submit. Please check your Web3Forms key.");
      }

    } catch (error) {
      console.error("Submission error:", error);
      
      // Reset button states
      submitBtn.disabled = false;
      btnText.textContent = "Complete My Almost";
      btnSpinner.classList.add("hidden");
      
      // Show form error message
      if (errorDisplay) {
        errorDisplay.textContent = error.message || "An unexpected error occurred. Please try again.";
        errorDisplay.classList.remove("hidden");
      }
    }
  });
}

// ==========================================
// 5. SUCCESS RENDER FUNCTION
// ==========================================
function renderSuccessState() {
  const contentWrapper = document.getElementById("modal-content-wrapper");
  if (!contentWrapper) return;

  // Swap form layout with success indicator screen
  contentWrapper.innerHTML = `
    <div class="flex flex-col items-center justify-center text-center py-6 space-y-6 animate-fade-in">
      <!-- Minimal checkmark badge -->
      <div class="flex items-center justify-center w-12 h-12 rounded-lg bg-[#09090B] border border-white/10 shadow-[0_0_20px_rgba(124,58,237,0.1)]">
        <svg class="w-6 h-6 text-purple-400" viewBox="0 0 52 52" fill="none" stroke="currentColor" stroke-width="3.5">
          <circle class="success-icon-ring" cx="26" cy="26" r="25" stroke="currentColor" stroke-linecap="round" />
          <path class="success-icon-check" d="M14 27l7 7 16-16" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </div>

      <!-- Copy -->
      <div class="space-y-1.5">
        <h3 class="text-lg font-bold tracking-tight text-white">${CONFIG.successHeading}</h3>
        <p class="text-zinc-500 text-xs max-w-xs mx-auto">${CONFIG.successBody}</p>
      </div>

      <!-- Action Button -->
      <div class="pt-2 w-full">
        <button onclick="document.getElementById('close-modal-btn').click();" 
          class="w-full inline-flex items-center justify-center px-4 py-2.5 text-xs font-semibold border border-white/10 bg-[#09090B] hover:bg-zinc-900 text-white rounded-lg transition-colors duration-150 cursor-pointer">
          Dismiss
        </button>
      </div>
    </div>
  `;
}

// ==========================================
// 6. CUSTOM INTERACTIONS (Toast, Scroll)
// ==========================================
function initCustomInteractions() {
  // Center Nav Links (Desktop)
  const aboutBtn = document.getElementById("nav-about-btn");
  const productsBtn = document.getElementById("nav-products-btn");

  if (aboutBtn) {
    aboutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      showToast("About section is almost ready.");
    });
  }
  if (productsBtn) {
    productsBtn.addEventListener("click", (e) => {
      e.preventDefault();
      showToast("Products are almost launched.");
    });
  }

  // Scroll indicator trigger
  const scrollTrigger = document.getElementById("hero-scroll-trigger");
  const secondSection = document.getElementById("second-section");
  if (scrollTrigger && secondSection) {
    scrollTrigger.addEventListener("click", () => {
      secondSection.scrollIntoView({ behavior: "smooth" });
    });
  }

  // Scroll listener for sticky header background state
  window.addEventListener("scroll", () => {
    const header = document.querySelector("header");
    if (header) {
      if (window.scrollY > 15) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    }
  });

  // Mobile Menu Toggle handler
  const mobileMenuBtn = document.getElementById("mobile-menu-btn");
  const mobileMenuOverlay = document.getElementById("mobile-menu-overlay");

  function toggleMobileMenu() {
    const isActive = mobileMenuBtn.classList.toggle("active");
    mobileMenuOverlay.classList.toggle("active", isActive);
    document.body.style.overflow = isActive ? "hidden" : "";
  }

  function closeMobileMenu() {
    if (mobileMenuBtn && mobileMenuOverlay) {
      mobileMenuBtn.classList.remove("active");
      mobileMenuOverlay.classList.remove("active");
      document.body.style.overflow = "";
    }
  }

  if (mobileMenuBtn && mobileMenuOverlay) {
    mobileMenuBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleMobileMenu();
    });
  }

  // Handle Mobile Nav Overlay Link Clicks
  const mobileLinks = document.querySelectorAll(".mobile-nav-link");
  mobileLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const targetId = link.getAttribute("id");
      closeMobileMenu();

      if (targetId === "mobile-nav-about") {
        e.preventDefault();
        showToast("About section is almost ready.");
      } else if (targetId === "mobile-nav-products") {
        e.preventDefault();
        showToast("Products are almost launched.");
      } else if (targetId === "mobile-nav-contact") {
        e.preventDefault();
        // Programmatically trigger the contact modal click
        const openModalBtn = document.getElementById("open-modal-btn");
        if (openModalBtn) {
          openModalBtn.click();
        }
      }
    });
  });

  // Close mobile menu when clicking outside of it
  document.addEventListener("click", (e) => {
    if (
      mobileMenuOverlay &&
      mobileMenuOverlay.classList.contains("active") &&
      !mobileMenuOverlay.contains(e.target) &&
      !mobileMenuBtn.contains(e.target)
    ) {
      closeMobileMenu();
    }
  });
}

// ==========================================
// 7. TOAST NOTIFICATION ENGINE
// ==========================================
function showToast(message) {
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    container.className = "fixed bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-none flex flex-col items-center gap-2";
    document.body.appendChild(container);
  }
  
  const toast = document.createElement("div");
  toast.className = "px-4 py-2 text-xs font-mono text-zinc-300 bg-[#0E0E11] border border-white/10 rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.5)] opacity-0 translate-y-2 transition-all duration-300 ease-out pointer-events-auto select-none";
  toast.textContent = message;
  
  container.appendChild(toast);
  
  // Trigger animation
  setTimeout(() => {
    toast.classList.remove("opacity-0", "translate-y-2");
  }, 10);
  
  // Dismiss after 2.5s
  setTimeout(() => {
    toast.classList.add("opacity-0", "translate-y-2");
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 2500);
}
