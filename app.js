import { SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL } from "./supabase-config.js";

const storageKey = "campaign-command-center:drafts";
const workspaceStorageKey = "campaign-command-center:workspace";
const teamStorageKey = "campaign-command-center:team";
const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_PUBLISHABLE_KEY);
const supabase = await createSupabaseClient();

let session = null;
let activeCampaignId = "sample-campaign";
let workspace = {
  id: "local-workspace",
  name: "Aster & Co.",
  type: "Client workspace",
  currentRole: "Owner"
};

let teamMembers = [
  { id: "maya", name: "Maya Chen", email: "maya@example.com", role: "Owner", focus: "Growth lead" },
  { id: "jonah", name: "Jonah Patel", email: "jonah@example.com", role: "Editor", focus: "Media buyer" },
  { id: "sofia", name: "Sofia Rivera", email: "sofia@example.com", role: "Reviewer", focus: "Creative director" },
  { id: "liam", name: "Liam Brooks", email: "liam@example.com", role: "Reviewer", focus: "Brand manager" },
  { id: "nora", name: "Nora West", email: "nora@example.com", role: "Viewer", focus: "Executive approver" }
];

const approvalSteps = ["Draft", "Review", "Approved", "Launched"];

async function createSupabaseClient() {
  if (!isSupabaseConfigured) return null;
  const { createClient } = await import("https://esm.sh/@supabase/supabase-js@2");
  return createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
}

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
  authEmail: document.querySelector("#authEmail"),
  authPassword: document.querySelector("#authPassword"),
  profileName: document.querySelector("#profileName"),
  profileFocus: document.querySelector("#profileFocus"),
  profileEmail: document.querySelector("#profileEmail"),
  inviteName: document.querySelector("#inviteName"),
  inviteEmail: document.querySelector("#inviteEmail"),
  inviteRole: document.querySelector("#inviteRole"),
  inviteFocus: document.querySelector("#inviteFocus"),
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
  authState: document.querySelector("#authState"),
  authForm: document.querySelector("#authForm"),
  signOutButton: document.querySelector("#signOutButton"),
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
  inviteForm: document.querySelector("#inviteForm"),
  teamList: document.querySelector("#teamList"),
  approvalFlow: document.querySelector("#approvalFlow"),
  toast: document.querySelector("#toast")
};

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

function readLocal(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) || fallback;
  } catch {
    return fallback;
  }
}

function writeLocal(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function currentUserMember() {
  if (!session) return teamMembers[0];
  return teamMembers.find((member) => member.email === session.user.email) || teamMembers[0];
}

function canManageTeam() {
  return ["Owner"].includes(workspace.currentRole);
}

function persistLocalTeam() {
  writeLocal(teamStorageKey, teamMembers);
}

function dbCampaignToBrief(row) {
  return {
    id: row.id,
    updatedAt: row.updated_at,
    campaignName: row.campaign_name,
    brand: row.brand,
    product: row.product,
    objective: row.objective,
    audience: row.audience,
    campaignOwner: row.campaign_owner || teamMembers[0]?.id,
    campaignStatus: row.campaign_status,
    budget: Number(row.budget),
    startDate: row.start_date || "",
    endDate: row.end_date || "",
    landingPage: row.landing_page || "",
    region: row.region || "United States",
    tone: row.tone || "Confident",
    constraints: row.constraints || "",
    reviewNotes: row.review_notes || "",
    channels: row.channels || []
  };
}

function briefToDbCampaign(brief) {
  return {
    id: isUuid(brief.id) ? brief.id : undefined,
    workspace_id: workspace.id,
    campaign_name: brief.campaignName,
    brand: brief.brand,
    product: brief.product,
    objective: brief.objective,
    audience: brief.audience,
    campaign_owner: brief.campaignOwner,
    campaign_status: brief.campaignStatus,
    budget: brief.budget,
    start_date: brief.startDate || null,
    end_date: brief.endDate || null,
    landing_page: brief.landingPage,
    region: brief.region,
    tone: brief.tone,
    constraints: brief.constraints,
    review_notes: brief.reviewNotes,
    channels: brief.channels,
    created_by: session.user.id,
    updated_at: new Date().toISOString()
  };
}

function isUuid(value) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
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

function defaultBrief() {
  return {
    id: "sample-campaign",
    campaignName: "Spring Product Launch",
    brand: "Aster & Co.",
    product: "Hydra Glow Serum",
    objective: "revenue",
    audience: "Urban millennials, premium skincare buyers",
    campaignOwner: teamMembers[0].id,
    campaignStatus: "Draft",
    budget: 185000,
    startDate: "2026-05-20",
    endDate: "2026-06-30",
    landingPage: "https://aster.example/products/hydra-glow",
    region: "United States",
    tone: "Confident",
    constraints: "Avoid medical claims. Lead with hydration, texture, and visible glow.",
    reviewNotes: "Creative team should tighten TikTok claims before final media upload.",
    channels: ["google", "tiktok", "snap", "meta"]
  };
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
      { token: "3", title: "Optimization Logic", body: profile.rec }
    ]
  };
}

function renderWorkspaceShell() {
  elements.workspaceName.textContent = workspace.name;
  elements.workspaceMeta.textContent = `${workspace.type} · ${teamMembers.length} members`;
  elements.roleBadge.textContent = workspace.currentRole;
  elements.inviteForm.classList.toggle("hidden", !canManageTeam());
  fields.campaignOwner.innerHTML = teamMembers
    .map((member) => `<option value="${member.id}">${escapeHtml(member.name)}</option>`)
    .join("");
  renderProfileSettings();
}

function renderProfileSettings() {
  const member = currentUserMember();
  fields.profileName.value = member?.name || "";
  fields.profileFocus.value = member?.focus || "";
  fields.profileEmail.value = session?.user.email || member?.email || "local@prototype";
}

function renderAuthState() {
  if (!isSupabaseConfigured) {
    elements.authState.textContent = "Local mode: add Supabase keys to enable real sign-in.";
    elements.authForm.classList.remove("hidden");
    elements.signOutButton.classList.add("hidden");
    return;
  }

  if (session) {
    elements.authState.textContent = `Signed in as ${session.user.email}`;
    elements.authForm.classList.add("hidden");
    elements.signOutButton.classList.remove("hidden");
  } else {
    elements.authState.textContent = "Supabase connected. Sign in to sync campaigns.";
    elements.authForm.classList.remove("hidden");
    elements.signOutButton.classList.add("hidden");
  }
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

function renderSavedCampaigns(drafts = readLocal(storageKey, [])) {
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
      const isSignedInUser = Boolean(session?.user.email && member.email === session.user.email);
      const initials = member.name
        .split(" ")
        .map((part) => part[0])
        .join("");
      return `
        <article class="team-card">
          <div class="avatar">${escapeHtml(initials)}</div>
          <div>
            <strong>${escapeHtml(member.name)}</strong>
            <span>${escapeHtml(member.focus)} · ${escapeHtml(member.email)}</span>
          </div>
          <div class="team-card-actions">
            <select data-member-role="${escapeHtml(member.email)}" ${canManageTeam() ? "" : "disabled"}>
              ${["Owner", "Editor", "Reviewer", "Viewer"]
                .map((role) => `<option ${role === member.role ? "selected" : ""}>${role}</option>`)
                .join("")}
            </select>
            <button class="danger-button" data-remove-member="${escapeHtml(member.email)}" ${canManageTeam() && !isSignedInUser ? "" : "disabled"}>
              Remove
            </button>
          </div>
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
  const owner = teamMembers.find((member) => member.id === brief.campaignOwner)?.name || "Unassigned";
  return [
    `# ${brief.campaignName}`,
    "",
    `Workspace: ${workspace.name}`,
    `Brand: ${brief.brand}`,
    `Product: ${brief.product}`,
    `Objective: ${plan.profile.label}`,
    `Audience: ${brief.audience}`,
    `Owner: ${owner}`,
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
  ].join("\n");
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
}

async function loadWorkspaceFromSupabase() {
  const { data: existing, error } = await supabase.from("workspaces").select("*").limit(1).maybeSingle();
  if (error) throw error;

  if (existing) {
    workspace = {
      id: existing.id,
      name: existing.name,
      type: existing.workspace_type,
      currentRole: "Owner"
    };
  } else {
    const { data: created, error: createError } = await supabase
      .from("workspaces")
      .insert({
        name: workspace.name,
        workspace_type: workspace.type,
        created_by: session.user.id
      })
      .select()
      .single();
    if (createError) throw createError;
    workspace = { id: created.id, name: created.name, type: created.workspace_type, currentRole: "Owner" };
  }

  await ensureProfileAndMembership();
  await loadTeamFromSupabase();
}

async function ensureProfileAndMembership() {
  const selfName = session.user.email?.split("@")[0] || "User";
  await supabase.from("profiles").upsert({
    id: session.user.id,
    email: session.user.email,
    full_name: selfName,
    focus: "Workspace owner"
  });

  const { data: existingMember } = await supabase
    .from("workspace_members")
    .select("*")
    .eq("workspace_id", workspace.id)
    .eq("email", session.user.email)
    .maybeSingle();

  if (existingMember) {
    await supabase
      .from("workspace_members")
      .update({ user_id: session.user.id })
      .eq("workspace_id", workspace.id)
      .eq("email", session.user.email);
  } else {
    await supabase.from("workspace_members").insert({
      workspace_id: workspace.id,
      user_id: session.user.id,
      email: session.user.email,
      full_name: selfName,
      role: "Owner",
      focus: "Workspace owner"
    });
  }
}

async function loadTeamFromSupabase() {
  const { data, error } = await supabase
    .from("workspace_members")
    .select("*")
    .eq("workspace_id", workspace.id)
    .order("created_at", { ascending: true });
  if (error) throw error;
  if (!data.length) return;
  teamMembers = data.map((member) => ({
    id: member.email,
    name: member.full_name,
    email: member.email,
    role: member.role,
    focus: member.focus
  }));
  workspace.currentRole = teamMembers.find((member) => member.email === session.user.email)?.role || "Viewer";
}

async function loadCampaigns() {
  if (!session || !supabase || !isUuid(workspace.id)) {
    const drafts = readLocal(storageKey, []);
    renderSavedCampaigns(drafts);
    return drafts;
  }

  const { data, error } = await supabase
    .from("campaigns")
    .select("*")
    .eq("workspace_id", workspace.id)
    .order("updated_at", { ascending: false });
  if (error) throw error;

  const drafts = data.map(dbCampaignToBrief);
  renderSavedCampaigns(drafts);
  return drafts;
}

async function saveDraft() {
  const brief = currentBrief();

  if (session && supabase && isUuid(workspace.id)) {
    const payload = briefToDbCampaign(brief);
    const { data, error } = await supabase.from("campaigns").upsert(payload).select().single();
    if (error) {
      showToast(error.message);
      return;
    }
    const saved = dbCampaignToBrief(data);
    activeCampaignId = saved.id;
    applyBrief(saved);
    await loadCampaigns();
    showToast("Campaign saved to Supabase.");
    return;
  }

  const drafts = readLocal(storageKey, []);
  const nextDrafts = [brief, ...drafts.filter((draft) => draft.id !== brief.id)].slice(0, 8);
  writeLocal(storageKey, nextDrafts);
  renderSavedCampaigns(nextDrafts);
  showToast("Campaign draft saved in this browser.");
}

function startNewCampaign() {
  activeCampaignId = `campaign-${Date.now()}`;
  applyBrief({
    ...defaultBrief(),
    id: activeCampaignId,
    campaignName: "Untitled Campaign",
    brand: workspace.name,
    product: "",
    objective: "launch",
    audience: "",
    campaignStatus: "Draft",
    budget: 100000,
    startDate: "2026-06-01",
    endDate: "2026-07-15",
    landingPage: "",
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

async function handleSignIn() {
  if (!supabase) {
    showToast("Add Supabase credentials first.");
    return;
  }
  const { error } = await supabase.auth.signInWithPassword({
    email: fields.authEmail.value,
    password: fields.authPassword.value
  });
  if (error) showToast(error.message);
}

async function handleSignUp() {
  if (!supabase) {
    showToast("Add Supabase credentials first.");
    return;
  }
  const { error } = await supabase.auth.signUp({
    email: fields.authEmail.value,
    password: fields.authPassword.value
  });
  showToast(error ? error.message : "Account created. Check email confirmation settings if sign-in is delayed.");
}

async function handleSignOut() {
  await supabase.auth.signOut();
}

async function saveProfile() {
  const name = fields.profileName.value.trim() || "User";
  const focus = fields.profileFocus.value.trim() || "Team member";
  const email = session?.user.email || fields.profileEmail.value || teamMembers[0].email;

  if (session && supabase && isUuid(workspace.id)) {
    const { error: profileError } = await supabase
      .from("profiles")
      .update({ full_name: name, focus })
      .eq("id", session.user.id);
    if (profileError) {
      showToast(profileError.message);
      return;
    }

    const { error: memberError } = await supabase
      .from("workspace_members")
      .update({ full_name: name, focus })
      .eq("workspace_id", workspace.id)
      .eq("email", email);
    if (memberError) {
      showToast(memberError.message);
      return;
    }

    await loadTeamFromSupabase();
  } else {
    teamMembers = teamMembers.map((member, index) =>
      index === 0 ? { ...member, name, focus, email: email || member.email } : member
    );
    persistLocalTeam();
  }

  renderWorkspaceShell();
  render();
  showToast("Profile updated.");
}

async function inviteTeamMember() {
  if (!canManageTeam()) {
    showToast("Only workspace owners can add teammates.");
    return;
  }

  const email = fields.inviteEmail.value.trim().toLowerCase();
  const name = fields.inviteName.value.trim() || email.split("@")[0];
  const role = fields.inviteRole.value;
  const focus = fields.inviteFocus.value.trim() || "Team member";

  if (!email || !email.includes("@")) {
    showToast("Enter a valid teammate email.");
    return;
  }

  if (session && supabase && isUuid(workspace.id)) {
    const { error } = await supabase.from("workspace_members").upsert(
      {
        workspace_id: workspace.id,
        email,
        full_name: name,
        role,
        focus
      },
      { onConflict: "workspace_id,email" }
    );
    if (error) {
      showToast(error.message);
      return;
    }
    await loadTeamFromSupabase();
  } else {
    teamMembers = [
      ...teamMembers.filter((member) => member.email !== email),
      { id: email, email, name, role, focus }
    ];
    persistLocalTeam();
  }

  fields.inviteName.value = "";
  fields.inviteEmail.value = "";
  fields.inviteFocus.value = "";
  renderWorkspaceShell();
  render();
  showToast("Teammate added.");
}

async function updateMemberRole(email, role) {
  if (!canManageTeam()) {
    showToast("Only workspace owners can change roles.");
    return;
  }

  if (session && supabase && isUuid(workspace.id)) {
    const { error } = await supabase
      .from("workspace_members")
      .update({ role })
      .eq("workspace_id", workspace.id)
      .eq("email", email);
    if (error) {
      showToast(error.message);
      return;
    }
    await loadTeamFromSupabase();
  } else {
    teamMembers = teamMembers.map((member) => (member.email === email ? { ...member, role } : member));
    persistLocalTeam();
  }

  renderWorkspaceShell();
  render();
  showToast("Role updated.");
}

async function removeTeamMember(email) {
  if (!canManageTeam()) {
    showToast("Only workspace owners can remove teammates.");
    return;
  }
  if (email === session?.user.email) {
    showToast("You cannot remove yourself.");
    return;
  }

  const removedMember = teamMembers.find((member) => member.email === email);

  if (session && supabase && isUuid(workspace.id)) {
    const { error } = await supabase
      .from("workspace_members")
      .delete()
      .eq("workspace_id", workspace.id)
      .eq("email", email);
    if (error) {
      showToast(error.message);
      return;
    }
    await loadTeamFromSupabase();
  } else {
    teamMembers = teamMembers.filter((member) => member.email !== email);
    persistLocalTeam();
  }

  if (removedMember?.id === fields.campaignOwner.value || !teamMembers.some((member) => member.id === fields.campaignOwner.value)) {
    fields.campaignOwner.value = teamMembers[0]?.id || "";
  }
  renderWorkspaceShell();
  render();
  showToast("Teammate removed.");
}

function showToast(message) {
  elements.toast.textContent = message;
  elements.toast.classList.add("show");
  window.setTimeout(() => elements.toast.classList.remove("show"), 3000);
}

async function loadInitialState() {
  renderAuthState();

  if (!session || !supabase) {
    const localWorkspace = readLocal(workspaceStorageKey, null);
    if (localWorkspace) workspace = localWorkspace;
    teamMembers = readLocal(teamStorageKey, teamMembers);
    renderWorkspaceShell();
    const drafts = await loadCampaigns();
    applyBrief(drafts[0] || defaultBrief());
    return;
  }

  try {
    await loadWorkspaceFromSupabase();
    renderWorkspaceShell();
    const campaigns = await loadCampaigns();
    applyBrief(campaigns[0] || defaultBrief());
  } catch (error) {
    showToast(error.message);
    renderWorkspaceShell();
    applyBrief(defaultBrief());
  }
}

document.querySelector("#generateButton").addEventListener("click", () => {
  render();
  showToast("Campaign plan regenerated from the latest brief inputs.");
});

document.querySelector("#saveDraftButton").addEventListener("click", saveDraft);
document.querySelector("#newCampaignButton").addEventListener("click", startNewCampaign);
document.querySelector("#copyPackageButton").addEventListener("click", copyPackage);
document.querySelector("#exportButton").addEventListener("click", exportPackage);
document.querySelector("#signInButton").addEventListener("click", handleSignIn);
document.querySelector("#signUpButton").addEventListener("click", handleSignUp);
document.querySelector("#signOutButton").addEventListener("click", handleSignOut);
document.querySelector("#saveProfileButton").addEventListener("click", saveProfile);
document.querySelector("#inviteMemberButton").addEventListener("click", inviteTeamMember);

document.querySelector("#approveButton").addEventListener("click", async () => {
  const currentIndex = approvalSteps.indexOf(fields.campaignStatus.value);
  fields.campaignStatus.value = approvalSteps[Math.min(currentIndex + 1, approvalSteps.length - 1)];
  await saveDraft();
  render();
  showToast(`Campaign moved to ${fields.campaignStatus.value}.`);
});

document.querySelector("#launchButton").addEventListener("click", async () => {
  await saveDraft();
  showToast("Launch review package created and saved.");
});

elements.savedCampaigns.addEventListener("click", async (event) => {
  const button = event.target.closest("[data-load-campaign]");
  if (!button) return;
  const drafts = await loadCampaigns();
  const draft = drafts.find((item) => item.id === button.dataset.loadCampaign);
  if (draft) {
    applyBrief(draft);
    showToast("Saved campaign loaded.");
  }
});

elements.teamList.addEventListener("change", async (event) => {
  const select = event.target.closest("[data-member-role]");
  if (!select) return;
  await updateMemberRole(select.dataset.memberRole, select.value);
});

elements.teamList.addEventListener("click", async (event) => {
  const button = event.target.closest("[data-remove-member]");
  if (!button) return;
  await removeTeamMember(button.dataset.removeMember);
});

document.querySelectorAll("[data-target-section]").forEach((button) => {
  button.addEventListener("click", () => {
    const target = document.querySelector(`#${button.dataset.targetSection}`);
    if (!target) return;
    document.querySelectorAll(".nav-item").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

document.querySelectorAll("input, select, textarea").forEach((control) => {
  control.addEventListener("input", render);
  control.addEventListener("change", render);
});

if (supabase) {
  const { data } = await supabase.auth.getSession();
  session = data.session;
  supabase.auth.onAuthStateChange(async (_event, nextSession) => {
    session = nextSession;
    await loadInitialState();
  });
}

await loadInitialState();
