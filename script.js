const STORAGE_KEY = "depositPowerCheckInputs";

const defaults = {
  targetAmount: 30000000,
  targetYears: 20,
  rate1: 3,
  rate2: 5,
  rate3: 7,
  increaseScenarios: [5000, 10000, 20000],
  funds: [
    {
      id: "default-total",
      name: "合計入力",
      accountType: "NISA",
      currentValue: 3000000,
      investedAmount: 2500000,
      monthlyContribution: 50000,
      memo: ""
    }
  ]
};

function cloneData(value) {
  return JSON.parse(JSON.stringify(value));
}

const targetFields = ["targetAmount", "targetYears", "rate1", "rate2", "rate3"];
const increaseScenarioFields = ["increaseScenario1", "increaseScenario2", "increaseScenario3"];
const state = cloneData(defaults);

const targetForm = document.getElementById("targetForm");
const fundForm = document.getElementById("fundForm");
const errorMessage = document.getElementById("errorMessage");
const summaryGrid = document.getElementById("summaryGrid");
const conditionSummaryGrid = document.getElementById("conditionSummaryGrid");
const missingGuide = document.getElementById("missingGuide");
const checkResults = document.getElementById("checkResults");
const judgementCard = document.getElementById("judgementCard");
const requiredRateCard = document.getElementById("requiredRateCard");
const resultTableBody = document.getElementById("resultTableBody");
const increaseScenarioTableBody = document.getElementById("increaseScenarioTableBody");
const increaseScenarioSummary = document.getElementById("increaseScenarioSummary");
const fundTableBody = document.getElementById("fundTableBody");
const resetButton = document.getElementById("resetButton");
const fundSubmitButton = document.getElementById("fundSubmitButton");
const fundCancelButton = document.getElementById("fundCancelButton");
const tabButtons = document.querySelectorAll(".tab-button");
const tabPanels = document.querySelectorAll(".tab-panel");
const scenarioChartDetails = document.querySelector(".scenario-chart-details");
const lineChartFallback = document.getElementById("lineChartFallback");
const achievementChartFallback = document.getElementById("achievementChartFallback");
const increaseScenarioChartFallback = document.getElementById("increaseScenarioChartFallback");

let lineChart;
let achievementChart;
let increaseScenarioChart;
let hadSavedData = false;
let isBootstrapping = true;

const numberFormatter = new Intl.NumberFormat("ja-JP", {
  maximumFractionDigits: 0
});

function getElement(id) {
  return document.getElementById(id);
}

function formatYen(value) {
  return `${numberFormatter.format(Math.round(value))}円`;
}

function formatSignedYen(value) {
  const rounded = Math.round(value);
  if (rounded > 0) return `+${formatYen(rounded)}`;
  if (rounded < 0) return `-${formatYen(Math.abs(rounded))}`;
  return formatYen(0);
}

function formatPercent(value) {
  return `${Number(value).toFixed(1)}%`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function createId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return `fund-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function normalizeNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

function readTargetInputs() {
  targetFields.forEach((id) => {
    state[id] = normalizeNumber(getElement(id).value);
  });
}

function writeTargetInputs() {
  targetFields.forEach((id) => {
    getElement(id).value = state[id];
  });
}

function readIncreaseScenarioInputs() {
  state.increaseScenarios = increaseScenarioFields.map((id) => normalizeNumber(getElement(id).value));
}

function writeIncreaseScenarioInputs() {
  increaseScenarioFields.forEach((id, index) => {
    getElement(id).value = state.increaseScenarios[index];
  });
}

function migrateSavedData(saved) {
  if (!saved || typeof saved !== "object") {
    return cloneData(defaults);
  }

  const migrated = {
    targetAmount: normalizeNumber(saved.targetAmount || defaults.targetAmount),
    targetYears: normalizeNumber(saved.targetYears || defaults.targetYears),
    rate1: normalizeNumber(saved.rate1 ?? defaults.rate1),
    rate2: normalizeNumber(saved.rate2 ?? defaults.rate2),
    rate3: normalizeNumber(saved.rate3 ?? defaults.rate3),
    increaseScenarios: Array.isArray(saved.increaseScenarios)
      ? saved.increaseScenarios.slice(0, 3).map((value) => normalizeNumber(value))
      : cloneData(defaults.increaseScenarios),
    funds: []
  };

  while (migrated.increaseScenarios.length < 3) {
    migrated.increaseScenarios.push(defaults.increaseScenarios[migrated.increaseScenarios.length]);
  }

  if (Array.isArray(saved.funds)) {
    migrated.funds = saved.funds.map((fund) => ({
      id: fund.id || createId(),
      name: fund.name || "名称未設定",
      accountType: fund.accountType || "その他",
      currentValue: normalizeNumber(fund.currentValue),
      investedAmount: normalizeNumber(fund.investedAmount),
      monthlyContribution: normalizeNumber(fund.monthlyContribution),
      memo: fund.memo || ""
    }));
  } else if (
    "currentValue" in saved ||
    "totalDeposits" in saved ||
    "monthlyContribution" in saved
  ) {
    migrated.funds = [
      {
        id: "migrated-total",
        name: "合計入力",
        accountType: "その他",
        currentValue: normalizeNumber(saved.currentValue),
        investedAmount: normalizeNumber(saved.totalDeposits),
        monthlyContribution: normalizeNumber(saved.monthlyContribution),
        memo: "以前の入力値から作成"
      }
    ];
  }

  return migrated;
}

function saveState() {
  if (isBootstrapping && !hadSavedData) return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  hadSavedData = true;
}

function loadState() {
  let saved = null;
  try {
    saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
  } catch {
    saved = null;
  }

  hadSavedData = Boolean(saved);
  const loaded = migrateSavedData(saved);
  Object.assign(state, loaded);
  writeTargetInputs();
  writeIncreaseScenarioInputs();
}

function validateTargets() {
  const labels = {
    targetAmount: "目標金額",
    targetYears: "目標年数",
    rate1: "利回り1",
    rate2: "利回り2",
    rate3: "利回り3"
  };

  for (const id of targetFields) {
    const rawValue = getElement(id).value.trim();
    if (rawValue === "" || !Number.isFinite(state[id])) {
      return `${labels[id]}を正しく入力してください。`;
    }
    if (state[id] < 0) {
      return `${labels[id]}は0以上で入力してください。`;
    }
  }

  if (!Number.isInteger(state.targetYears) || state.targetYears < 1) {
    return "目標年数は1年以上の整数で入力してください。";
  }

  if (state.targetAmount <= 0) {
    return "目標金額は1円以上で入力してください。";
  }

  return "";
}

function validateIncreaseScenarios() {
  for (let index = 0; index < increaseScenarioFields.length; index += 1) {
    const id = increaseScenarioFields[index];
    const rawValue = getElement(id).value.trim();
    if (rawValue === "" || !Number.isFinite(state.increaseScenarios[index])) {
      return `増額シナリオ${index + 1}を正しく入力してください。`;
    }
    if (state.increaseScenarios[index] < 0) {
      return `増額シナリオ${index + 1}は0以上で入力してください。`;
    }
  }
  return "";
}

function readFundForm() {
  return {
    id: getElement("fundId").value || createId(),
    name: getElement("fundName").value.trim(),
    accountType: getElement("accountType").value,
    currentValue: normalizeNumber(getElement("fundCurrentValue").value),
    investedAmount: normalizeNumber(getElement("fundInvestedAmount").value),
    monthlyContribution: normalizeNumber(getElement("fundMonthlyContribution").value),
    memo: getElement("fundMemo").value.trim()
  };
}

function validateFund(fund) {
  if (!fund.name) return "銘柄名を入力してください。";
  if (getElement("fundCurrentValue").value.trim() === "" || fund.currentValue < 0) {
    return "現在評価額は0以上で入力してください。";
  }
  if (getElement("fundInvestedAmount").value.trim() === "" || fund.investedAmount < 0) {
    return "これまでの入金額は0以上で入力してください。";
  }
  if (getElement("fundMonthlyContribution").value.trim() === "" || fund.monthlyContribution < 0) {
    return "毎月積立額は0以上で入力してください。";
  }
  return "";
}

function resetFundForm() {
  fundForm.reset();
  getElement("fundId").value = "";
  getElement("accountType").value = "NISA";
  fundSubmitButton.textContent = "銘柄を追加";
}

function aggregateFunds() {
  return state.funds.reduce((total, fund) => {
    total.currentValue += fund.currentValue;
    total.totalDeposits += fund.investedAmount;
    total.monthlyContribution += fund.monthlyContribution;
    return total;
  }, {
    currentValue: 0,
    totalDeposits: 0,
    monthlyContribution: 0
  });
}

function calculationValues() {
  return {
    targetAmount: state.targetAmount,
    targetYears: Math.floor(state.targetYears),
    rate1: state.rate1,
    rate2: state.rate2,
    rate3: state.rate3,
    ...aggregateFunds()
  };
}

function hasSimulationData(targetError = validateTargets()) {
  return !targetError && state.funds.length > 0;
}

function monthlyRate(annualRate) {
  return annualRate / 100 / 12;
}

function futureValue(currentValue, monthlyContribution, years, annualRate) {
  const months = years * 12;
  const rate = monthlyRate(annualRate);

  if (rate === 0) {
    return currentValue + monthlyContribution * months;
  }

  return currentValue * ((1 + rate) ** months) +
    monthlyContribution * ((((1 + rate) ** months) - 1) / rate);
}

function principalValue(totalDeposits, monthlyContribution, years) {
  return totalDeposits + monthlyContribution * years * 12;
}

function yearlySeries(values, annualRate) {
  const points = [];
  for (let year = 0; year <= values.targetYears; year += 1) {
    points.push(futureValue(values.currentValue, values.monthlyContribution, year, annualRate));
  }
  return points;
}

function principalSeries(values) {
  const points = [];
  for (let year = 0; year <= values.targetYears; year += 1) {
    points.push(principalValue(values.totalDeposits, values.monthlyContribution, year));
  }
  return points;
}

function requiredMonthlyContribution(values, annualRate) {
  const months = values.targetYears * 12;
  const rate = monthlyRate(annualRate);
  const currentValueFuture = rate === 0
    ? values.currentValue
    : values.currentValue * ((1 + rate) ** months);
  const shortfall = values.targetAmount - currentValueFuture;

  if (shortfall <= 0) return 0;
  if (rate === 0) return shortfall / months;

  return shortfall / ((((1 + rate) ** months) - 1) / rate);
}

function requiredAnnualRate(values) {
  const zeroRateValue = futureValue(
    values.currentValue,
    values.monthlyContribution,
    values.targetYears,
    0
  );

  if (zeroRateValue >= values.targetAmount) {
    return 0;
  }

  let low = 0;
  let high = 100;
  let highValue = futureValue(values.currentValue, values.monthlyContribution, values.targetYears, high);

  while (highValue < values.targetAmount && high < 1000) {
    high *= 2;
    highValue = futureValue(values.currentValue, values.monthlyContribution, values.targetYears, high);
  }

  if (highValue < values.targetAmount) {
    return null;
  }

  for (let i = 0; i < 80; i += 1) {
    const mid = (low + high) / 2;
    const midValue = futureValue(values.currentValue, values.monthlyContribution, values.targetYears, mid);
    if (midValue >= values.targetAmount) {
      high = mid;
    } else {
      low = mid;
    }
  }

  return high;
}

function getScenarioResults(values) {
  const rates = [values.rate1, values.rate2, values.rate3];

  return rates.map((rate) => {
    const future = futureValue(values.currentValue, values.monthlyContribution, values.targetYears, rate);
    const difference = future - values.targetAmount;
    const requiredMonthly = requiredMonthlyContribution(values, rate);
    const additional = Math.max(0, requiredMonthly - values.monthlyContribution);

    return {
      rate,
      future,
      difference,
      requiredMonthly,
      additional,
      series: yearlySeries(values, rate),
      achieved: difference >= 0
    };
  });
}

function getIncreaseScenarioResults(values) {
  const rates = [values.rate1, values.rate2, values.rate3];
  const increases = [0, ...state.increaseScenarios];

  return increases.map((increase, index) => {
    const monthlyContribution = values.monthlyContribution + increase;
    const label = index === 0 ? "現在のまま" : `+${formatYen(increase)}`;
    const predictions = rates.map((rate) => {
      const future = futureValue(values.currentValue, monthlyContribution, values.targetYears, rate);
      return {
        rate,
        future,
        difference: future - values.targetAmount,
        achieved: future >= values.targetAmount
      };
    });

    return {
      label,
      increase,
      monthlyContribution,
      predictions
    };
  });
}

function renderFundsTable() {
  if (state.funds.length === 0) {
    fundTableBody.innerHTML = `
      <tr>
        <td class="empty-row" colspan="9">銘柄がありません。上のフォームから追加してください。</td>
      </tr>
    `;
    return;
  }

  fundTableBody.innerHTML = state.funds.map((fund) => {
    const profit = fund.currentValue - fund.investedAmount;
    const profitRate = fund.investedAmount === 0 ? 0 : (profit / fund.investedAmount) * 100;
    const profitClass = profit >= 0 ? "profit-positive" : "profit-negative";

    return `
      <tr>
        <td>${escapeHtml(fund.name)}</td>
        <td>${escapeHtml(fund.accountType)}</td>
        <td>${formatYen(fund.currentValue)}</td>
        <td>${formatYen(fund.investedAmount)}</td>
        <td class="${profitClass}">${formatSignedYen(profit)}</td>
        <td class="${profitClass}">${formatPercent(profitRate)}</td>
        <td>${formatYen(fund.monthlyContribution)}</td>
        <td><button class="small-button" type="button" data-action="edit" data-id="${escapeHtml(fund.id)}">編集</button></td>
        <td><button class="danger-button" type="button" data-action="delete" data-id="${escapeHtml(fund.id)}">削除</button></td>
      </tr>
    `;
  }).join("");
}

function renderSummary(values) {
  const profit = values.currentValue - values.totalDeposits;
  const profitRate = values.totalDeposits === 0 ? 0 : (profit / values.totalDeposits) * 100;
  const profitClass = profit >= 0 ? "profit-positive" : "profit-negative";

  const items = [
    ["現在評価額合計", formatYen(values.currentValue)],
    ["これまでの入金額合計", formatYen(values.totalDeposits)],
    ["評価損益合計", formatSignedYen(profit), profitClass],
    ["損益率", formatPercent(profitRate), profitClass],
    ["毎月積立額合計", formatYen(values.monthlyContribution)]
  ];

  summaryGrid.innerHTML = items.map(([label, value, className = ""]) => `
    <div class="summary-item">
      <span>${label}</span>
      <strong class="${className}">${value}</strong>
    </div>
  `).join("");
}

function renderConditionSummary(values) {
  const items = [
    ["目標金額", formatYen(values.targetAmount)],
    ["目標年数", `${values.targetYears}年`],
    ["現在評価額合計", formatYen(values.currentValue)],
    ["毎月積立額合計", formatYen(values.monthlyContribution)],
    ["基準利回り", formatPercent(values.rate2)]
  ];

  conditionSummaryGrid.innerHTML = items.map(([label, value]) => `
    <div class="summary-item">
      <span>${label}</span>
      <strong>${value}</strong>
    </div>
  `).join("");
}

function setCheckResultVisibility(hasData) {
  missingGuide.classList.toggle("is-visible", !hasData);
  checkResults.classList.toggle("is-hidden", !hasData);
}

function renderJudgement(values, results) {
  const base = results[1];
  const diffText = formatSignedYen(base.difference);
  const statusText = base.achieved
    ? "現在の積立額で達成見込みです。"
    : `目標達成には毎月あと${formatYen(base.additional)}の追加積立が必要です。`;

  judgementCard.innerHTML = `
    <h2>判定カード</h2>
    <p>年利${formatPercent(base.rate)}の場合、${values.targetYears}年後は${formatYen(base.future)}。</p>
    <p>目標金額に対して${diffText}。${statusText}</p>
  `;
}

function renderRequiredRate(values) {
  const requiredRate = requiredAnnualRate(values);
  const body = requiredRate === null
    ? "現在の毎月積立額では、非常に高い利回りを想定しても目標達成が難しい条件です。目標年数や積立額の見直しを検討してください。"
    : `現在の毎月積立額で目標達成するには、年利${formatPercent(requiredRate)}が必要です。`;

  requiredRateCard.innerHTML = `
    <h2>必要利回り</h2>
    ${requiredRate === null ? "" : `<strong class="required-rate-value">年利${formatPercent(requiredRate)}</strong>`}
    <p>${body}</p>
  `;
}

function renderResultTable(results) {
  resultTableBody.innerHTML = results.map((result) => {
    const diffClass = result.difference >= 0 ? "profit-positive" : "profit-negative";
    const judgementClass = result.achieved ? "" : "short";
    const judgementText = result.achieved ? "達成見込み" : "追加積立が必要";
    const additionalText = result.additional <= 0 ? "追加不要" : formatYen(result.additional);

    return `
      <tr>
        <td>${formatPercent(result.rate)}</td>
        <td>${formatYen(result.future)}</td>
        <td class="${diffClass}">${formatSignedYen(result.difference)}</td>
        <td>${formatYen(result.requiredMonthly)}</td>
        <td>${additionalText}</td>
        <td><span class="status-pill ${judgementClass}">${judgementText}</span></td>
      </tr>
    `;
  }).join("");
}

function renderIncreaseScenarioTable(values, scenarioResults) {
  [values.rate1, values.rate2, values.rate3].forEach((rate, index) => {
    getElement(`scenarioRate${index + 1}Header`).textContent = `利回り${index + 1}(${formatPercent(rate)})の予測額`;
  });

  increaseScenarioTableBody.innerHTML = scenarioResults.map((scenario) => {
    const predictionCells = scenario.predictions.map((prediction) => {
      const diffClass = prediction.achieved ? "profit-positive" : "profit-negative";
      const statusText = prediction.achieved ? "達成" : "未達";

      return `
        <td>
          <div class="scenario-result">
            <strong>${formatYen(prediction.future)}</strong>
            <span class="${diffClass}">${statusText} ${formatSignedYen(prediction.difference)}</span>
          </div>
        </td>
      `;
    }).join("");

    return `
      <tr>
        <td>${scenario.label}</td>
        <td>${formatYen(scenario.monthlyContribution)}</td>
        ${predictionCells}
      </tr>
    `;
  }).join("");
}

function renderIncreaseScenarioSummary(values, scenarioResults) {
  const baseRate = values.rate2;
  const currentScenario = scenarioResults[0];
  const firstAchievedScenario = scenarioResults.find((scenario) => {
    return scenario.predictions[1].achieved;
  });

  let message = "";
  if (currentScenario.predictions[1].achieved) {
    message = `年利${formatPercent(baseRate)}を基準にした場合、現在の積立額で目標達成見込みです。`;
  } else if (firstAchievedScenario) {
    message = `年利${formatPercent(baseRate)}を基準にした場合、現在の積立額では目標未達です。月${formatYen(firstAchievedScenario.increase)}増額すると目標達成見込みです。`;
  } else {
    message = `年利${formatPercent(baseRate)}を基準にした場合、設定した増額シナリオでは目標未達です。さらに大きな増額、目標年数、目標金額の見直しを検討してください。`;
  }

  increaseScenarioSummary.innerHTML = `
    <h3>基準利回りでの最小増額</h3>
    <p>${message}</p>
  `;
}

function chartOptions(title) {
  return {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: "index"
    },
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          boxWidth: 12,
          usePointStyle: true
        }
      },
      title: {
        display: true,
        text: title,
        color: "#15201f",
        font: {
          size: 15,
          weight: "700"
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.dataset.label}: ${formatYen(context.parsed.y)}`
        }
      }
    },
    scales: {
      y: {
        ticks: {
          callback: (value) => formatYen(value)
        },
        grid: {
          color: "#e8efed"
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  };
}

function showChartFallback() {
  const message = "Chart.jsを読み込めなかったため、グラフは表示できません。入力結果、判定、表は利用できます。";
  lineChartFallback.textContent = message;
  achievementChartFallback.textContent = "インターネット接続後に再読み込みするとグラフが表示されます。";
  increaseScenarioChartFallback.textContent = "インターネット接続後に再読み込みするとグラフが表示されます。";
  lineChartFallback.classList.add("is-visible");
  achievementChartFallback.classList.add("is-visible");
  increaseScenarioChartFallback.classList.add("is-visible");
}

function renderCharts(values, results, increaseScenarioResults) {
  if (typeof Chart === "undefined") {
    showChartFallback();
    return;
  }

  lineChartFallback.classList.remove("is-visible");
  achievementChartFallback.classList.remove("is-visible");
  increaseScenarioChartFallback.classList.remove("is-visible");

  const labels = Array.from({ length: values.targetYears + 1 }, (_, index) => `${index}年`);
  const colors = ["#2f80ed", "#157a6e", "#d97706"];
  const targetLine = Array(values.targetYears + 1).fill(values.targetAmount);
  const principal = principalSeries(values);

  const lineData = {
    labels,
    datasets: [
      {
        label: "元本",
        data: principal,
        borderColor: "#64748b",
        backgroundColor: "#64748b",
        borderDash: [6, 5],
        tension: 0.25
      },
      ...results.map((result, index) => ({
        label: `年利${formatPercent(result.rate)}`,
        data: result.series,
        borderColor: colors[index],
        backgroundColor: colors[index],
        tension: 0.25
      })),
      {
        label: "目標金額ライン",
        data: targetLine,
        borderColor: "#b91c1c",
        backgroundColor: "#b91c1c",
        borderDash: [3, 4],
        pointRadius: 0
      }
    ]
  };

  const achievementData = {
    labels: ["元本", ...results.map((result) => `年利${formatPercent(result.rate)}`), "目標金額"],
    datasets: [{
      label: "目標年の予測額",
      data: [principal.at(-1), ...results.map((result) => result.future), values.targetAmount],
      backgroundColor: ["#64748b", ...colors, "#b91c1c"],
      borderRadius: 4
    }]
  };

  const baseRate = values.rate2;
  const increaseScenarioData = {
    labels: [
      ...increaseScenarioResults.map((scenario) => scenario.label),
      "目標金額"
    ],
    datasets: [{
      label: `年利${formatPercent(baseRate)}の目標年予測`,
      data: [
        ...increaseScenarioResults.map((scenario) => {
          return futureValue(
            values.currentValue,
            scenario.monthlyContribution,
            values.targetYears,
            baseRate
          );
        }),
        values.targetAmount
      ],
      backgroundColor: ["#64748b", "#2f80ed", "#157a6e", "#d97706", "#b91c1c"],
      borderRadius: 4
    }]
  };

  if (lineChart) lineChart.destroy();
  if (achievementChart) achievementChart.destroy();
  if (increaseScenarioChart) increaseScenarioChart.destroy();

  lineChart = new Chart(document.getElementById("lineChart"), {
    type: "line",
    data: lineData,
    options: chartOptions("今の積立額で続けた場合の資産推移")
  });

  achievementChart = new Chart(document.getElementById("achievementChart"), {
    type: "bar",
    data: achievementData,
    options: chartOptions("今の積立額での達成判定")
  });

  increaseScenarioChart = new Chart(document.getElementById("increaseScenarioChart"), {
    type: "bar",
    data: increaseScenarioData,
    options: chartOptions("入金額を増やした場合の目標年予測")
  });
}

function render() {
  readTargetInputs();
  readIncreaseScenarioInputs();

  const values = calculationValues();
  renderFundsTable();
  renderSummary(values);
  renderConditionSummary(values);

  const targetError = validateTargets();
  const hasData = hasSimulationData(targetError);
  setCheckResultVisibility(hasData);

  if (!hasData) {
    errorMessage.textContent = "";
    saveState();
    return;
  }

  const error = validateIncreaseScenarios();
  if (error) {
    errorMessage.textContent = error;
    saveState();
    return;
  }

  errorMessage.textContent = "";
  saveState();

  const results = getScenarioResults(values);
  const increaseScenarioResults = getIncreaseScenarioResults(values);
  renderJudgement(values, results);
  renderRequiredRate(values);
  renderResultTable(results);
  renderIncreaseScenarioSummary(values, increaseScenarioResults);
  renderIncreaseScenarioTable(values, increaseScenarioResults);
  renderCharts(values, results, increaseScenarioResults);
}

function activateTab(tabId) {
  tabButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.tab === tabId);
  });
  tabPanels.forEach((panel) => {
    panel.classList.toggle("is-active", panel.id === tabId);
  });

  if (lineChart) lineChart.resize();
  if (achievementChart) achievementChart.resize();
  if (increaseScenarioChart) increaseScenarioChart.resize();
}

function initialTabId() {
  return hadSavedData && hasSimulationData() ? "checkTab" : "targetTab";
}

function editFund(id) {
  const fund = state.funds.find((item) => item.id === id);
  if (!fund) return;

  getElement("fundId").value = fund.id;
  getElement("fundName").value = fund.name;
  getElement("accountType").value = fund.accountType;
  getElement("fundCurrentValue").value = fund.currentValue;
  getElement("fundInvestedAmount").value = fund.investedAmount;
  getElement("fundMonthlyContribution").value = fund.monthlyContribution;
  getElement("fundMemo").value = fund.memo;
  fundSubmitButton.textContent = "変更を保存";
  activateTab("fundsTab");
}

function deleteFund(id) {
  const fund = state.funds.find((item) => item.id === id);
  if (!fund) return;

  const ok = confirm(`${fund.name}を削除しますか？`);
  if (!ok) return;

  state.funds = state.funds.filter((item) => item.id !== id);
  resetFundForm();
  render();
}

targetFields.forEach((id) => {
  getElement(id).addEventListener("input", render);
});

increaseScenarioFields.forEach((id) => {
  getElement(id).addEventListener("input", render);
});

tabButtons.forEach((button) => {
  button.addEventListener("click", () => activateTab(button.dataset.tab));
});

document.querySelectorAll("[data-go-tab]").forEach((button) => {
  button.addEventListener("click", () => activateTab(button.dataset.goTab));
});

fundForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const fund = readFundForm();
  const error = validateFund(fund);

  if (error) {
    errorMessage.textContent = error;
    return;
  }

  const existingIndex = state.funds.findIndex((item) => item.id === fund.id);
  if (existingIndex >= 0) {
    state.funds[existingIndex] = fund;
  } else {
    state.funds.push(fund);
  }

  errorMessage.textContent = "";
  resetFundForm();
  render();
});

fundTableBody.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;

  if (button.dataset.action === "edit") {
    editFund(button.dataset.id);
  }

  if (button.dataset.action === "delete") {
    deleteFund(button.dataset.id);
  }
});

fundCancelButton.addEventListener("click", resetFundForm);

scenarioChartDetails.addEventListener("toggle", () => {
  if (increaseScenarioChart) increaseScenarioChart.resize();
});

resetButton.addEventListener("click", () => {
  localStorage.removeItem(STORAGE_KEY);
  Object.assign(state, cloneData(defaults));
  writeTargetInputs();
  writeIncreaseScenarioInputs();
  resetFundForm();
  render();
});

targetForm.addEventListener("submit", (event) => event.preventDefault());

loadState();
resetFundForm();
render();
activateTab(initialTabId());
isBootstrapping = false;
