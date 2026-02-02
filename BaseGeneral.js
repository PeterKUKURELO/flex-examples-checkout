(() => {
  // ====== Ambientes ======
  const SDK_BY_ENV = {
    test: "https://integracion.alignetsac.com/VPOS2/js/modalcomercio.js",
    prod: "https://vpayment.verifika.com/VPOS2/js/modalcomercio.js"
  };

  const CONFIG_BY_ENV = {
    test: {
      baseUrl: "https://integracion.alignetsac.com/",
      acquirerId: "144",
      idCommerce: "20655",
      purchaseAmount: "100",
      purchaseCurrencyCode: "604",
      secret: "GZneGTTYafrsXWNDP@4729582994"
      /*
      20655
      INT PRUEBA S
      admintprus
      Alignet20255
      */
    },
    prod: {
      baseUrl: "https://vpayment.verifika.com/", // <-- pon tu base prod real si es otra
      acquirerId: "29",                          // <-- el que indicaste
      idCommerce: "20500",
      purchaseAmount: "100",
      purchaseCurrencyCode: "840",
      secret: "AaRLqRjNCqjXCumd$527543857"
    }
  };

  // Default SIEMPRE TEST al entrar (pero al cambiar mantiene env en la URL)
  const params = new URLSearchParams(location.search);
  let currentEnv = params.get("env") || "test";
  let CONFIG = CONFIG_BY_ENV[currentEnv];

  // Carga el SDK del ambiente actual
  (function loadVposSdk(){
    const s = document.createElement("script");
    s.src = SDK_BY_ENV[currentEnv];
    s.defer = true;
    document.head.appendChild(s);
  })();

  // ====== UI refs ======
  const modal = document.getElementById("modal");
  const openVpos2 = document.getElementById("openModalVpos2");
  const closeBtn = document.getElementById("closeModalBtn");
  const cancelBtn = document.getElementById("cancelBtn");
  const form = document.getElementById("f1");

  const envSelect = document.getElementById("envSelect");
  const envHint = document.getElementById("envHint");
  const openModalCode = document.getElementById("openModalCode");

  if (!modal || !openVpos2 || !closeBtn || !cancelBtn || !form || !envSelect || !envHint || !openModalCode) {
    return;
  }

  let lastFocusEl = null;
  let prevOverflow = "";

  function refreshEnvUI(){
    envSelect.value = currentEnv;
    envHint.textContent = currentEnv === "test" ? "(Integraciones)" : "(Produccion)";
    openModalCode.textContent = `AlignetVPOS2.openModal("${CONFIG.baseUrl}", "2")`;
  }

  // Cambio de ambiente: recarga con ?env=test|prod
  envSelect.addEventListener("change", () => {
    currentEnv = envSelect.value;
    params.set("env", currentEnv);
    location.search = params.toString();
  });

  function last7FromMillis() {
    const t = String(Date.now());
    return t.slice(-7);
  }

  async function sha512Hex(str) {
    // Nota: si crypto.subtle no existe en tu navegador con file://, usa un server local.
    const enc = new TextEncoder();
    const data = enc.encode(str);
    const hash = await crypto.subtle.digest("SHA-512", data);
    return [...new Uint8Array(hash)].map(b => b.toString(16).padStart(2, "0")).join("");
  }

  async function buildVposPayload() {
    const purchaseOperationNumber = last7FromMillis();

    document.querySelector('[name="acquirerId"]').value = CONFIG.acquirerId;
    document.querySelector('[name="idCommerce"]').value = CONFIG.idCommerce;
    document.querySelector('[name="purchaseOperationNumber"]').value = purchaseOperationNumber;
    document.querySelector('[name="purchaseAmount"]').value = CONFIG.purchaseAmount;
    document.querySelector('[name="purchaseCurrencyCode"]').value = CONFIG.purchaseCurrencyCode;

    document.getElementById("amountText").value = CONFIG.purchaseAmount;
    document.getElementById("currencyText").value = CONFIG.purchaseCurrencyCode;

    const input = CONFIG.acquirerId + CONFIG.idCommerce + purchaseOperationNumber +
                  CONFIG.purchaseAmount + CONFIG.purchaseCurrencyCode + CONFIG.secret;

    const purchaseVerification = await sha512Hex(input);
    document.querySelector('[name="purchaseVerification"]').value = purchaseVerification;

    const opEl = document.getElementById("opNumberText");
    if (opEl) opEl.textContent = purchaseOperationNumber;
  }

  function openModal(fromBtn){
    lastFocusEl = fromBtn;
    prevOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.classList.add("modal-open");

    // Refresca UI + payload cada vez que abres
    CONFIG = CONFIG_BY_ENV[currentEnv];
    refreshEnvUI();
    buildVposPayload();

    modal.setAttribute("aria-hidden", "false");
    closeBtn.focus();
  }

  function closeModal(){
    modal.setAttribute("aria-hidden", "true");
    document.documentElement.style.overflow = prevOverflow || "";
    document.body.classList.remove("modal-open");
    if (lastFocusEl) lastFocusEl.focus();
  }

  openVpos2.addEventListener("click", () => openModal(openVpos2));
  closeBtn.addEventListener("click", closeModal);
  cancelBtn.addEventListener("click", closeModal);

  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.getAttribute("aria-hidden") === "false") closeModal();
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    document.getElementById("shippingFirstName").value =
      document.getElementById("shippingFirstName_visible").value || "Juan";
    document.getElementById("shippingLastName").value =
      document.getElementById("shippingLastName_visible").value || "Perez";
    document.getElementById("shippingEmail").value =
      document.getElementById("shippingEmail_visible").value || "perez.juan@test.com";

    closeModal();

    if (!window.AlignetVPOS2 || typeof AlignetVPOS2.openModal !== "function") {
      alert("El SDK de VPOS2 aun no cargo. Intenta de nuevo en 1 segundo.");
      return;
    }

    setTimeout(() => {
      AlignetVPOS2.openModal(CONFIG.baseUrl, "2");
    }, 80);
  });

  // Inicial
  window.addEventListener("DOMContentLoaded", () => {
    CONFIG = CONFIG_BY_ENV[currentEnv];
    refreshEnvUI();
    buildVposPayload();
  });
})();
