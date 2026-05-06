const storageKey = "campaign-command-center:drafts";
const workspace = {
  name: "Aster & Co.",
  type: "Client workspace",
  currentRole: "Owner"
};

const teamMembers = [
  { id: "maya", name: "Maya Chen", role: "Owner", focus: "Growth lead" },
  { id: "jonah", name: "Jonah Patel", role: "Editor", focus: "Media buyer" },
  { id: "sofia", name: "Sofia Rivera", role: "Reviewer", focus: "Creative director" },
  { id: "liam", name: "Liam Brooks", role: "Reviewer", focus: "Brand manager" },
  { id: "nora", name: "Nora West", role: "Viewer", focus: "Executive approver" }
];

const approvalSteps = ["Draft", "Review", "Approved", "Launched"];

const channels = {
  google: {
    name: "Google",
    color: "#315f9f",
    share: 38,
    status: "Ready",
    note: "Search, Performance Max, and YouTube bumper structure prepared.",
    creative: "High-intent search copy with product benefit clustering.",
    exportLine: "Search headlines, Performance Max asset groups, and YouTube bumper scripts.",
    visual: "linear-gradient(135deg, #315f9f, #9fc4ff)"
  },
  tiktok: {
    name: "TikTok",
    color: "#151515",
    share: 26,
    status: "Review",
    note: "Creator-style hooks queued for policy and brand voice review.",
    creative: "First-three-second hooks with problem, demo, proof sequencing.",
    exportLine: "Creator-style short-form concepts, Spark Ads copy, and hook testing matrix.",
    visual: "linear-gradient(135deg, #111111, #ea4c89)"
  },
  snap: {
    name: "Snap",
    color: "#d7a500",
    share: 16,
    status: "Ready",
    note: "AR lens concept and vertical story ads mapped to launch audience.",
    creative: "Fast vertical story frames with offer-forward overlays.",
    exportLine: "Vertical story frames, AR lens prompt, and quick offer overlays.",
    visual: "linear-gradient(135deg, #ffd83b, #ff9f1c)"
  },
  meta: {
    name: "Meta",
    color: "#0f8a9d",
    share: 20,
    status: "Draft",
    note: "Advantage+ audience and retargeting pools need final exclusions.",
    creative: "Feed and reels variants tuned for social proof and bundles.",
    exportLine: "Reels concepts, feed copy variants, retargeting exclusions, and social proof angles.",
    visual: "linear-gradient(135deg, #0f8a9d, #7edfd6)"
  }
};

const objectiveProfiles = {
  revenue: {
    label: "Revenue Growth",
    fit: 94,
    kpi: "ROAS 3.8x",
    rec: "Prioritize high-intent demand capture, then use TikTok and Meta to scale warm audiences with creative proof points.",
    reach: "8.4M",
    cpa: "$31",
    lift: "18%"
  },
  awareness: {
    label: "Brand Awareness",
    fit: 89,
    kpi: "Reach 11.2M",
    rec: "Shift spend into video-first inventory and optimize for completed views before moving engaged users into retargeting.",
    reach: "11.2M",
    cpa: "$44",
    lift: "24%"
  },
  retention: {
    label: "Customer Retention",
    fit: 87,
    kpi: "LTV +14%",
    rec: "Focus on existing customer segments, refreshed bundles, and channel sequencing that avoids over-frequency.",
    reach: "4.1M",
    cpa: "$26",
    lift: "14%"
  },
  launch: {
    label: "New Product Launch",
    fit: 92,
    kpi: "Trial 42k",
    rec: "Open with broad launch storytelling, then split the second wave by use case and purchase intent.",
    reach: "9.6M",
    cpa: "$36",
    lift: "21%"
  }
};

const fields = {
  campaignName: document.querySelector("#campaignName"),
  brand: document.querySelector("#brand"),
  product: document.querySelector("#product"),
  objective: document.querySelector("#objective"),
  audience: document.querySelector("#audience"),
  campaignOwner: document.querySelector("#campaignOwner"),
  campaignStatus: document.querySelector("#campaignStatus"),
  budget: document.querySelector("#budget"),
  startDate: document.querySelector("#startDate"),
  endDate: document.querySelector("#endDate"),
  landingPage: document.querySelector("#landingPage"),
  region: document.querySelector("#region"),
  tone: document.querySelector("#tone"),
  constraints: document.querySelector("#constraints"),
  reviewNotes: document.querySelector("#reviewNotes")
};

const elements = {
  campaignTitle: document.querySelector("#campaignTitle"),
  budgetReadout: document.querySelector("#budgetReadout"),
  flightReadout: document.querySelector("#flightReadout"),
  readinessReadout: document.querySelector("#readinessReadout"),
  kpiReadout: document.querySelector("#kpiReadout"),
  statusReadout: document.querySelector("#statusReadout"),
  fitScore: document.querySelector("#fitScore"),
  budgetMix: document.querySelector("#budgetMix"),
  recommendations: document.querySelector("#recommendations"),
  propertyCards: document.querySelector("#propertyCards"),
  creativeGrid: document.querySelector("#creativeGrid"),
  savedCampaigns: document.querySelector("#savedCampaigns"),
  launchPackage: document.querySelector("#launchPackage"),
  reachMetric: document.querySelector("#reachMetric"),
  cpaMetric: document.querySelector("#cpaMetric"),
  liftMetric: document.querySelector("#liftMetric"),
  workspaceName: document.querySelector("#workspaceName"),
  workspaceMeta: document.querySelector("#workspaceMeta"),
  roleBadge: document.querySelector("#roleBadge"),
  teamList: document.querySelector("#teamList"),
  approvalFlow: document.querySelector("#approvalFlow"),
  toast: document.querySelector("#toast")
};

let activeCampaignId = "sample-campaign";

function selectedChannels() {
  return [...document.querySelectorAll("[data-channel]:checked")].map((input) => input.dataset.channel);
}

function setSelectedChannels(keys) {
  document.querySelectorAll("[data-channel]").forEach((input) => {
    input.checked = keys.includes(input.dataset.channel);
  });
}

function money(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
    notation: "compact"
  }).format(value);
}

function fullMoney(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(value);
}

function dateLabel(value) {
  if (!value) return "TBD";
  const date = new Date(`${value}T12:00:00`);
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(date);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function readDrafts() {
  try {
    return JSON.parse(localStorage.getItem(storageKey)) || [];
  } catch {
    return [];
  }
}

function writeDrafts(drafts) {
  localStorage.setItem(storageKey, JSON.stringify(drafts));
}

function renderWorkspaceShell() {
  elements.workspaceName.textContent = workspace.name;
  elements.workspaceMeta.textContent = `${workspace.type} · ${teamMembers.length} members`;
  elements.roleBadge.textContent = workspace.currentRole;
  fields.campaignOwner.innerHTML = teamMembers
    .map((member) => `<option value="${member.id}">${member.name}</option>`)
    .join("");
}

function currentBrief() {
  return {
    id: activeCampaignId,
    updatedAt: new Date().toISOString(),
    campaignName: fields.campaignName.value.trim() || "Untitled Campaign",
    brand: fields.brand.value.trim() || "Brand",
    product: fields.product.value.trim() || "Product",
    objective: fields.objective.value,
    audience: fields.audience.value.trim() || "the selected audience",
    campaignOwner: fields.campaignOwner.value || teamMembers[0].id,
    campaignStatus: fields.campaignStatus.value,
    budget: Number(fields.budget.value),
    startDate: fields.startDate.value,
    endDate: fields.endDate.value,
    landingPage: fields.landingPage.value.trim() || "TBD",
    region: fields.region.value,
    tone: fields.tone.value,
    constraints: fields.constraints.value.trim() || "No constraints provided.",
    reviewNotes: fields.reviewNotes.value.trim() || "No reviewer notes yet.",
    channels: selectedChannels()
  };
}

function applyBrief(brief) {
  activeCampaignId = brief.id;
  fields.campaignName.value = brief.campaignName;
  fields.brand.value = brief.brand;
  fields.product.value = brief.product;
  fields.objective.value = brief.objective;
  fields.audience.value = brief.audience;
  fields.campaignOwner.value = brief.campaignOwner || teamMembers[0].id;
  fields.campaignStatus.value = brief.campaignStatus || "Draft";
  fields.budget.value = brief.budget;
  fields.startDate.value = brief.startDate;
  fields.endDate.value = brief.endDate;
  fields.landingPage.value = brief.landingPage;
  fields.region.value = brief.region;
  fields.tone.value = brief.tone;
  fields.constraints.value = brief.constraints;
  fields.reviewNotes.value = brief.reviewNotes || "";
  setSelectedChannels(brief.channels.length ? brief.channels : ["google"]);
  render();
}

function normalizeShares(activeKeys) {
  const safeKeys = activeKeys.length ? activeKeys : ["google"];
  const total = safeKeys.reduce((sum, key) => sum + channels[key].share, 0);
  return safeKeys.map((key) => ({
    ...channels[key],
    key,
    normalized: Math.round((channels[key].share / total) * 100)
  }));
}

function generatePlan(brief) {
  const active = brief.channels.length ? brief.channels : ["google"];
  const profile = objectiveProfiles[brief.objective];
  const rows = normalizeShares(active);
  const readiness = Math.min(96, 58 + active.length * 6 + Math.round(brief.budget / 20000));

  return {
    profile,
    rows,
    readiness,
    allocation: rows.map((item) => ({
      name: item.name,
      percent: item.normalized,
      spend: Math.round((brief.budget * item.normalized) / 100)
    })),
    recommendations: [
      {
        token: "1",
        title: "Recommended Allocation",
        body: `${rows.map((item) => `${item.name} ${money((brief.budget * item.normalized) / 100)}`).join(" · ")}.`
      },
      {
        token: "2",
        title: "Audience Strategy",
        body: `Build a prospecting layer for ${brief.audience}, then retarget visitors, engagers, and cart abandoners with tighter offers.`
      },
      {
        token: "3",
        title: "Optimization Logic",
        body: profile.rec
      }
    ]
  };
}

function renderBudgetMix(rows) {
  elements.budgetMix.innerHTML = rows
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

function renderRecommendations(items) {
  elements.recommendations.innerHTML = items
    .map(
      (item) => `
        <article class="recommendation">
          <div class="token">${item.token}</div>
          <div>
            <strong>${escapeHtml(item.title)}</strong>
            <p>${escapeHtml(item.body)}</p>
          </div>
        </article>
      `
    )
    .join("");
}

function renderPropertyCards(active) {
  elements.propertyCards.innerHTML = active
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

function renderCreative(active, brief) {
  elements.creativeGrid.innerHTML = active
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
            <p>${escapeHtml(brief.tone)} concept for ${escapeHtml(brief.product)}: ${channel.creative}</p>
          </div>
        </article>
      `;
    })
    .join("");
}

function renderSavedCampaigns() {
  const drafts = readDrafts();
  elements.savedCampaigns.innerHTML = drafts.length
    ? drafts
        .map(
          (draft) => `
            <button class="saved-item ${draft.id === activeCampaignId ? "active" : ""}" data-load-campaign="${draft.id}">
              <strong>${escapeHtml(draft.campaignName)}</strong>
              <span>${escapeHtml(draft.brand)} · ${money(draft.budget)}</span>
            </button>
          `
        )
        .join("")
    : `<button class="saved-item active" data-load-campaign="sample-campaign">
        <strong>Spring Product Launch</strong>
        <span>Aster & Co. · ${money(185000)}</span>
      </button>`;
}

function renderTeamList() {
  const brief = currentBrief();
  elements.teamList.innerHTML = teamMembers
    .map((member) => {
      const isOwner = member.id === brief.campaignOwner;
      const initials = member.name
        .split(" ")
        .map((part) => part[0])
        .join("");
      return `
        <article class="team-card">
          <div class="avatar">${escapeHtml(initials)}</div>
          <div>
            <strong>${escapeHtml(member.name)}</strong>
            <span>${escapeHtml(member.focus)}</span>
          </div>
          <span class="badge">${isOwner ? "Owner" : member.role}</span>
        </article>
      `;
    })
    .join("");
}

function renderApprovalFlow(status) {
  const currentIndex = approvalSteps.indexOf(status);
  elements.approvalFlow.innerHTML = approvalSteps
    .map((step, index) => {
      const className = index < currentIndex ? "done" : index === currentIndex ? "current" : "";
      const helper =
        step === "Draft"
          ? "Brief and plan are being prepared"
          : step === "Review"
            ? "Creative, media, and brand checks"
            : step === "Approved"
              ? "Ready for platform upload"
              : "Live campaign monitoring";
      return `
        <article class="approval-step ${className}">
          <div>
            <strong>${step}</strong>
            <span>${helper}</span>
          </div>
        </article>
      `;
    })
    .join("");
}

function buildLaunchPackage(brief, plan) {
  const active = brief.channels.length ? brief.channels : ["google"];
  const lines = [
    `# ${brief.campaignName}`,
    "",
    `Workspace: ${workspace.name}`,
    `Brand: ${brief.brand}`,
    `Product: ${brief.product}`,
    `Objective: ${plan.profile.label}`,
    `Audience: ${brief.audience}`,
    `Owner: ${teamMembers.find((member) => member.id === brief.campaignOwner)?.name || "Unassigned"}`,
    `Status: ${brief.campaignStatus}`,
    `Region: ${brief.region}`,
    `Flight: ${dateLabel(brief.startDate)} - ${dateLabel(brief.endDate)}`,
    `Budget: ${fullMoney(brief.budget)}`,
    `Landing Page: ${brief.landingPage}`,
    `Tone: ${brief.tone}`,
    "",
    "## Channel Allocation",
    ...plan.allocation.map((item) => `- ${item.name}: ${item.percent}% (${fullMoney(item.spend)})`),
    "",
    "## Strategy",
    `- ${plan.profile.rec}`,
    `- Primary KPI: ${plan.profile.kpi}`,
    `- Launch readiness: ${plan.readiness}%`,
    "",
    "## Creative Work Orders",
    ...active.map((key) => `- ${channels[key].name}: ${channels[key].exportLine}`),
    "",
    "## Brand Constraints",
    `- ${brief.constraints}`,
    "",
    "## Reviewer Notes",
    `- ${brief.reviewNotes}`,
    "",
    "## Launch Checklist",
    "- Confirm audience exclusions and retargeting pools",
    "- Send creative variants through brand and policy review",
    "- Upload approved assets to each platform",
    "- QA landing page, UTMs, and conversion events",
    "- Monitor pacing and CPA/ROAS during first 24 hours"
  ];

  return lines.join("\n");
}

function render() {
  const brief = currentBrief();
  const active = brief.channels.length ? brief.channels : ["google"];
  const plan = generatePlan(brief);

  elements.campaignTitle.textContent = brief.campaignName;
  elements.budgetReadout.textContent = money(brief.budget);
  elements.flightReadout.textContent = `${dateLabel(brief.startDate)} - ${dateLabel(brief.endDate)}`;
  elements.readinessReadout.textContent = `${plan.readiness}%`;
  elements.kpiReadout.textContent = plan.profile.kpi;
  elements.statusReadout.textContent = brief.campaignStatus;
  elements.fitScore.textContent = plan.profile.fit;
  elements.reachMetric.textContent = plan.profile.reach;
  elements.cpaMetric.textContent = plan.profile.cpa;
  elements.liftMetric.textContent = plan.profile.lift;

  renderBudgetMix(plan.rows);
  renderRecommendations(plan.recommendations);
  renderPropertyCards(active);
  renderCreative(active, brief);
  renderTeamList();
  renderApprovalFlow(brief.campaignStatus);
  elements.launchPackage.value = buildLaunchPackage(brief, plan);
  renderSavedCampaigns();
}

function saveDraft() {
  const brief = currentBrief();
  const drafts = readDrafts();
  const nextDrafts = [brief, ...drafts.filter((draft) => draft.id !== brief.id)].slice(0, 8);
  writeDrafts(nextDrafts);
  renderSavedCampaigns();
  showToast("Campaign draft saved in this browser.");
}

function startNewCampaign() {
  activeCampaignId = `campaign-${Date.now()}`;
  applyBrief({
    id: activeCampaignId,
    campaignName: "Untitled Campaign",
    brand: "",
    product: "",
    objective: "launch",
    audience: "",
    campaignOwner: teamMembers[0].id,
    campaignStatus: "Draft",
    budget: 100000,
    startDate: "2026-06-01",
    endDate: "2026-07-15",
    landingPage: "",
    region: "United States",
    tone: "Confident",
    constraints: "",
    reviewNotes: "",
    channels: ["google", "tiktok", "meta"]
  });
  showToast("New campaign brief ready.");
}

async function copyPackage() {
  try {
    await navigator.clipboard.writeText(elements.launchPackage.value);
    showToast("Launch package copied to clipboard.");
  } catch {
    elements.launchPackage.select();
    document.execCommand("copy");
    showToast("Launch package selected and copied.");
  }
}

function exportPackage() {
  const brief = currentBrief();
  const slug = brief.campaignName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const blob = new Blob([elements.launchPackage.value], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${slug || "campaign"}-launch-package.md`;
  link.click();
  URL.revokeObjectURL(url);
  showToast("Markdown launch package exported.");
}

function showToast(message) {
  elements.toast.textContent = message;
  elements.toast.classList.add("show");
  window.setTimeout(() => elements.toast.classList.remove("show"), 2600);
}

document.querySelector("#generateButton").addEventListener("click", () => {
  render();
  showToast("Campaign plan regenerated from the latest brief inputs.");
});

document.querySelector("#saveDraftButton").addEventListener("click", saveDraft);
document.querySelector("#newCampaignButton").addEventListener("click", startNewCampaign);
document.querySelector("#copyPackageButton").addEventListener("click", copyPackage);
document.querySelector("#exportButton").addEventListener("click", exportPackage);
document.querySelector("#approveButton").addEventListener("click", () => {
  const currentIndex = approvalSteps.indexOf(fields.campaignStatus.value);
  fields.campaignStatus.value = approvalSteps[Math.min(currentIndex + 1, approvalSteps.length - 1)];
  saveDraft();
  render();
  showToast(`Campaign moved to ${fields.campaignStatus.value}.`);
});

document.querySelector("#launchButton").addEventListener("click", () => {
  saveDraft();
  showToast("Launch review package created and saved.");
});

elements.savedCampaigns.addEventListener("click", (event) => {
  const button = event.target.closest("[data-load-campaign]");
  if (!button) return;
  const draft = readDrafts().find((item) => item.id === button.dataset.loadCampaign);
  if (draft) {
    applyBrief(draft);
    showToast("Saved campaign loaded.");
  }
});

document.querySelectorAll("input, select, textarea").forEach((control) => {
  control.addEventListener("input", render);
  control.addEventListener("change", render);
});

renderWorkspaceShell();
render();
