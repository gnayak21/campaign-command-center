const channels = {
  google: {
    name: "Google",
    color: "#315f9f",
    token: "G",
    share: 38,
    status: "Ready",
    note: "Search, Performance Max, and YouTube bumper structure prepared.",
    creative: "High-intent search copy with product benefit clustering.",
    visual: "linear-gradient(135deg, #315f9f, #9fc4ff)"
  },
  tiktok: {
    name: "TikTok",
    color: "#151515",
    token: "T",
    share: 26,
    status: "Review",
    note: "Creator-style hooks queued for policy and brand voice review.",
    creative: "First-three-second hooks with problem, demo, proof sequencing.",
    visual: "linear-gradient(135deg, #111111, #ea4c89)"
  },
  snap: {
    name: "Snap",
    color: "#d7a500",
    token: "S",
    share: 16,
    status: "Ready",
    note: "AR lens concept and vertical story ads mapped to launch audience.",
    creative: "Fast vertical story frames with offer-forward overlays.",
    visual: "linear-gradient(135deg, #ffd83b, #ff9f1c)"
  },
  meta: {
    name: "Meta",
    color: "#0f8a9d",
    token: "M",
    share: 20,
    status: "Draft",
    note: "Advantage+ audience and retargeting pools need final exclusions.",
    creative: "Feed and reels variants tuned for social proof and bundles.",
    visual: "linear-gradient(135deg, #0f8a9d, #7edfd6)"
  }
};

const objectiveProfiles = {
  revenue: {
    fit: 94,
    kpi: "ROAS 3.8x",
    rec: "Prioritize high-intent demand capture, then use TikTok and Meta to scale warm audiences with creative proof points.",
    reach: "8.4M",
    cpa: "$31",
    lift: "18%"
  },
  awareness: {
    fit: 89,
    kpi: "Reach 11.2M",
    rec: "Shift spend into video-first inventory and optimize for completed views before moving engaged users into retargeting.",
    reach: "11.2M",
    cpa: "$44",
    lift: "24%"
  },
  retention: {
    fit: 87,
    kpi: "LTV +14%",
    rec: "Focus on existing customer segments, refreshed bundles, and channel sequencing that avoids over-frequency.",
    reach: "4.1M",
    cpa: "$26",
    lift: "14%"
  },
  launch: {
    fit: 92,
    kpi: "Trial 42k",
    rec: "Open with broad launch storytelling, then split the second wave by use case and purchase intent.",
    reach: "9.6M",
    cpa: "$36",
    lift: "21%"
  }
};

const budgetInput = document.querySelector("#budget");
const budgetReadout = document.querySelector("#budgetReadout");
const readinessReadout = document.querySelector("#readinessReadout");
const kpiReadout = document.querySelector("#kpiReadout");
const objectiveInput = document.querySelector("#objective");
const audienceInput = document.querySelector("#audience");
const fitScore = document.querySelector("#fitScore");
const budgetMix = document.querySelector("#budgetMix");
const recommendations = document.querySelector("#recommendations");
const propertyCards = document.querySelector("#propertyCards");
const creativeGrid = document.querySelector("#creativeGrid");
const toast = document.querySelector("#toast");

function selectedChannels() {
  return [...document.querySelectorAll("[data-channel]:checked")].map((input) => input.dataset.channel);
}

function money(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
    notation: "compact"
  }).format(value);
}

function normalizeShares(activeKeys) {
  const total = activeKeys.reduce((sum, key) => sum + channels[key].share, 0);
  return activeKeys.map((key) => ({
    ...channels[key],
    key,
    normalized: Math.round((channels[key].share / total) * 100)
  }));
}

function renderBudgetMix(active) {
  const rows = normalizeShares(active);
  budgetMix.innerHTML = rows
    .map(
      (channel) => `
        <div class="mix-row">
          <strong>${channel.name}</strong>
          <div class="mix-track">
            <div class="mix-fill" style="--value:${channel.normalized}%;--color:${channel.color}"></div>
          </div>
          <span>${channel.normalized}%</span>
        </div>
      `
    )
    .join("");
}

function renderRecommendations(active, profile) {
  const audience = audienceInput.value.trim() || "the selected audience";
  const rows = normalizeShares(active);
  const spend = Number(budgetInput.value);
  recommendations.innerHTML = [
    {
      token: "1",
      title: "Recommended Allocation",
      body: `${rows.map((item) => `${item.name} ${money((spend * item.normalized) / 100)}`).join(" · ")}.`
    },
    {
      token: "2",
      title: "Audience Strategy",
      body: `Build a prospecting layer for ${audience}, then retarget visitors, engagers, and cart abandoners with tighter offers.`
    },
    {
      token: "3",
      title: "Optimization Logic",
      body: profile.rec
    }
  ]
    .map(
      (item) => `
        <article class="recommendation">
          <div class="token">${item.token}</div>
          <div>
            <strong>${item.title}</strong>
            <p>${item.body}</p>
          </div>
        </article>
      `
    )
    .join("");
}

function renderPropertyCards(active) {
  propertyCards.innerHTML = active
    .map((key) => {
      const channel = channels[key];
      return `
        <article class="property-card">
          <div class="property-title">
            <strong><span class="dot ${key}"></span> ${channel.name} Ads</strong>
            <span class="badge">${channel.status}</span>
          </div>
          <p>${channel.note}</p>
        </article>
      `;
    })
    .join("");
}

function renderCreative(active) {
  creativeGrid.innerHTML = active
    .map((key) => {
      const channel = channels[key];
      return `
        <article class="creative-card">
          <div class="creative-visual" style="--visual:${channel.visual}">
            <div></div>
            <div><span></span><span></span><span></span></div>
          </div>
          <div class="creative-card-body">
            <strong>${channel.name} Variant</strong>
            <p>${channel.creative}</p>
          </div>
        </article>
      `;
    })
    .join("");
}

function render() {
  const active = selectedChannels();
  const profile = objectiveProfiles[objectiveInput.value];
  const readiness = Math.min(96, 58 + active.length * 6 + Math.round(Number(budgetInput.value) / 20000));

  budgetReadout.textContent = money(Number(budgetInput.value));
  readinessReadout.textContent = `${readiness}%`;
  kpiReadout.textContent = profile.kpi;
  fitScore.textContent = profile.fit;
  document.querySelector("#reachMetric").textContent = profile.reach;
  document.querySelector("#cpaMetric").textContent = profile.cpa;
  document.querySelector("#liftMetric").textContent = profile.lift;

  renderBudgetMix(active);
  renderRecommendations(active, profile);
  renderPropertyCards(active);
  renderCreative(active);
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 2600);
}

document.querySelector("#generateButton").addEventListener("click", () => {
  render();
  showToast("Campaign plan regenerated from the latest brief inputs.");
});

document.querySelector("#launchButton").addEventListener("click", () => {
  showToast("Launch review package created for media, creative, and brand approval.");
});

document.querySelectorAll("input, select").forEach((control) => {
  control.addEventListener("input", render);
  control.addEventListener("change", render);
});

render();
