:root {
  --bg: #f4f7f8;
  --surface: #ffffff;
  --surface-soft: #eef6f4;
  --text: #15201f;
  --muted: #61706e;
  --line: #d9e4e1;
  --accent: #157a6e;
  --accent-dark: #0c554d;
  --warn: #b45309;
  --danger: #b91c1c;
  --shadow: 0 18px 45px rgba(24, 54, 49, 0.09);
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  min-height: 100vh;
  color: var(--text);
  background:
    linear-gradient(180deg, rgba(21, 122, 110, 0.08), transparent 320px),
    var(--bg);
  font-family: "Segoe UI", "Hiragino Sans", "Yu Gothic UI", Meiryo, sans-serif;
}

button,
input {
  font: inherit;
}

.app-shell {
  width: min(1180px, calc(100% - 32px));
  margin: 0 auto;
  padding: 34px 0 28px;
}

.app-header {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 24px;
}

.eyebrow {
  margin: 0 0 6px;
  color: var(--accent-dark);
  font-size: 0.86rem;
  font-weight: 700;
}

h1,
h2,
p {
  margin-top: 0;
}

h1 {
  margin-bottom: 0;
  font-size: clamp(2rem, 4vw, 3.35rem);
  line-height: 1.05;
}

h2 {
  margin-bottom: 0;
  font-size: 1.12rem;
}

.header-copy {
  max-width: 420px;
  margin-bottom: 4px;
  color: var(--muted);
  line-height: 1.7;
}

.tab-nav {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 8px;
  margin-bottom: 14px;
  padding: 6px;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.82);
  box-shadow: var(--shadow);
}

.tab-button {
  min-height: 46px;
  padding: 0 12px;
  border: 0;
  border-radius: 6px;
  color: var(--muted);
  background: transparent;
  cursor: pointer;
  font-weight: 800;
}

.tab-button:hover,
.tab-button.is-active {
  color: #fff;
  background: var(--accent);
}

.tab-panel {
  display: none;
}

.tab-panel.is-active {
  display: block;
}

.layout {
  display: grid;
  grid-template-columns: minmax(320px, 430px) 1fr;
  gap: 18px;
  align-items: start;
}

.input-panel,
.result-panel,
.chart-section,
.table-section,
.required-rate-card,
.check-overview,
.missing-guide {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 8px;
  box-shadow: var(--shadow);
}

.input-panel {
  padding: 20px;
}

.target-panel {
  max-width: 820px;
}

.result-panel {
  padding: 20px;
}

.panel-heading,
.section-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 18px;
}

.section-copy {
  margin: 8px 0 0;
  color: var(--muted);
  line-height: 1.6;
}

.quick-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.ghost-button {
  min-height: 38px;
  padding: 0 14px;
  border: 1px solid var(--line);
  border-radius: 6px;
  color: var(--accent-dark);
  background: #fff;
  cursor: pointer;
}

.ghost-button:hover {
  border-color: var(--accent);
}

.primary-button,
.danger-button,
.small-button {
  min-height: 38px;
  padding: 0 14px;
  border: 1px solid transparent;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 800;
}

.primary-button {
  color: #fff;
  background: var(--accent);
}

.primary-button:hover {
  background: var(--accent-dark);
}

.small-button {
  color: var(--accent-dark);
  background: #eef6f4;
}

.danger-button {
  color: #fff;
  background: var(--danger);
}

.form-grid,
.rate-grid {
  display: grid;
  gap: 14px;
}

.target-grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.fund-form {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}

.scenario-input-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
  margin-bottom: 18px;
}

.memo-field {
  grid-column: span 2;
}

.form-actions {
  display: flex;
  align-items: end;
  gap: 10px;
}

.field {
  display: grid;
  gap: 7px;
  color: var(--muted);
  font-size: 0.9rem;
  font-weight: 700;
}

.input-with-unit {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  min-height: 46px;
  border: 1px solid var(--line);
  border-radius: 6px;
  background: #fff;
  overflow: hidden;
}

.input-with-unit:focus-within {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(21, 122, 110, 0.14);
}

.input-with-unit input {
  min-width: 0;
  width: 100%;
  border: 0;
  outline: 0;
  padding: 12px 12px;
  color: var(--text);
  background: transparent;
  font-weight: 700;
}

.input-with-unit span {
  padding: 0 12px;
  color: var(--muted);
  white-space: nowrap;
}

.plain-input {
  min-width: 0;
  width: 100%;
  min-height: 46px;
  border: 1px solid var(--line);
  border-radius: 6px;
  outline: 0;
  padding: 11px 12px;
  color: var(--text);
  background: #fff;
  font-weight: 700;
}

.plain-input:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(21, 122, 110, 0.14);
}

textarea.plain-input {
  resize: vertical;
  line-height: 1.5;
}

.rate-fieldset {
  margin: 18px 0 0;
  padding: 16px;
  border: 1px solid var(--line);
  border-radius: 8px;
}

.rate-fieldset legend {
  padding: 0 7px;
  color: var(--muted);
  font-size: 0.9rem;
  font-weight: 800;
}

.error-message {
  min-height: 22px;
  margin: 14px 0 0;
  color: var(--danger);
  font-weight: 700;
  line-height: 1.5;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.condition-summary-grid {
  grid-template-columns: repeat(6, minmax(0, 1fr));
}

.period-summary {
  margin: 12px 0 0;
  color: var(--accent-dark);
  font-weight: 800;
  line-height: 1.6;
}

.summary-item {
  min-height: 92px;
  padding: 14px;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--surface-soft);
}

.summary-item span {
  display: block;
  margin-bottom: 9px;
  color: var(--muted);
  font-size: 0.84rem;
  font-weight: 800;
}

.summary-item strong {
  display: block;
  overflow-wrap: anywhere;
  font-size: clamp(1.05rem, 2.2vw, 1.35rem);
}

.profit-positive {
  color: #047857;
}

.profit-negative {
  color: var(--danger);
}

.judgement-card {
  padding: 18px;
  border-radius: 8px;
  color: #ffffff;
  background: linear-gradient(135deg, var(--accent-dark), var(--accent));
  box-shadow: var(--shadow);
}

.judgement-card h2 {
  margin-bottom: 10px;
  color: #ffffff;
}

.judgement-card p {
  margin-bottom: 0;
  line-height: 1.8;
}

.required-rate-card {
  padding: 18px;
}

.required-rate-card h2 {
  margin-bottom: 10px;
}

.required-rate-card p {
  margin-bottom: 0;
  color: var(--muted);
  line-height: 1.8;
}

.required-rate-value {
  display: block;
  margin: 12px 0 8px;
  color: var(--accent-dark);
  font-size: clamp(1.65rem, 4vw, 2.35rem);
  font-weight: 900;
}

.check-overview,
.missing-guide {
  padding: 20px;
  margin-bottom: 18px;
}

.missing-guide {
  display: none;
}

.missing-guide.is-visible {
  display: block;
}

.missing-guide p {
  margin-bottom: 16px;
  color: var(--muted);
  line-height: 1.8;
}

.is-hidden {
  display: none;
}

.chart-section,
.table-section {
  margin-top: 18px;
  padding: 20px;
}

.total-panel {
  margin-top: 18px;
}

.chart-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.45fr) minmax(280px, 0.9fr);
  gap: 18px;
}

.check-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(280px, 0.9fr);
  gap: 18px;
}

.chart-box {
  position: relative;
  min-height: 360px;
  border: 1px solid var(--line);
  border-radius: 8px;
  padding: 14px;
}

.chart-box-wide {
  min-height: 390px;
}

.chart-fallback {
  display: none;
  margin: 10px 0 0;
  color: var(--muted);
  font-size: 0.86rem;
  line-height: 1.6;
}

.chart-fallback.is-visible {
  display: block;
}

.table-wrap {
  overflow-x: auto;
  border: 1px solid var(--line);
  border-radius: 8px;
}

.scenario-table-wrap {
  margin-top: 18px;
}

table {
  width: 100%;
  min-width: 920px;
  border-collapse: collapse;
  background: #fff;
}

.fund-table {
  min-width: 1120px;
}

th,
td {
  padding: 14px 12px;
  border-bottom: 1px solid var(--line);
  text-align: right;
  white-space: nowrap;
}

th:first-child,
td:first-child {
  text-align: left;
}

th {
  color: var(--muted);
  background: #f8fbfa;
  font-size: 0.84rem;
}

tr:last-child td {
  border-bottom: 0;
}

.status-pill {
  display: inline-flex;
  align-items: center;
  min-height: 30px;
  padding: 0 10px;
  border-radius: 999px;
  font-weight: 800;
  background: #e8f6ef;
  color: #047857;
}

.status-pill.need {
  background: #fff3df;
  color: var(--warn);
}

.status-pill.short {
  background: #fee2e2;
  color: var(--danger);
}

.empty-row {
  color: var(--muted);
  text-align: center;
}

.scenario-result {
  display: grid;
  gap: 4px;
}

.scenario-result strong,
.scenario-result span {
  display: block;
}

.scenario-result span {
  font-size: 0.84rem;
  font-weight: 800;
}

.scenario-summary-card {
  padding: 16px;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--surface-soft);
}

.scenario-summary-card h3 {
  margin: 0 0 8px;
  color: var(--accent-dark);
  font-size: 1rem;
}

.scenario-summary-card p {
  margin-bottom: 0;
  line-height: 1.8;
}

.scenario-chart-details {
  margin-top: 18px;
}

.scenario-chart-details summary {
  width: fit-content;
  min-height: 38px;
  padding: 9px 14px;
  border: 1px solid var(--line);
  border-radius: 6px;
  color: var(--accent-dark);
  background: #fff;
  cursor: pointer;
  font-weight: 800;
}

.scenario-chart-box {
  margin-top: 12px;
}

.app-footer {
  margin-top: 18px;
  color: var(--muted);
  font-size: 0.88rem;
  line-height: 1.7;
  text-align: center;
}

@media (max-width: 900px) {
  .app-header,
  .layout,
  .chart-grid,
  .check-grid,
  .condition-summary-grid {
    grid-template-columns: 1fr;
  }

  .app-header {
    display: grid;
    align-items: start;
  }

  .chart-box {
    min-height: 320px;
  }
}

@media (max-width: 560px) {
  .app-shell {
    width: min(100% - 20px, 1180px);
    padding-top: 22px;
  }

  .input-panel,
  .result-panel,
  .chart-section,
  .table-section {
    padding: 14px;
  }

  .summary-grid {
    grid-template-columns: 1fr;
  }

  .panel-heading {
    align-items: start;
    flex-direction: column;
  }

  .ghost-button {
    width: 100%;
  }

  .tab-nav {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .tab-button {
    min-height: 42px;
  }
}

@media (max-width: 760px) {
  .target-grid,
  .fund-form,
  .scenario-input-grid {
    grid-template-columns: 1fr;
  }

  .memo-field {
    grid-column: auto;
  }

  .form-actions {
    align-items: stretch;
    flex-direction: column;
  }
}

@media (max-width: 420px) {
  .tab-nav {
    grid-template-columns: 1fr;
  }
}
