import { useEffect, useMemo, useState } from "react";
import { loadAllData, deriveFromTransactions, formatCurrency } from "./utils/data";
import { useTheme } from "./hooks/useTheme";
import KpiRow from "./components/KpiRow";
import FilterBar from "./components/FilterBar";
import Section from "./components/Section";
import RevenueTrendChart from "./components/RevenueTrendChart";
import CategoryChart from "./components/CategoryChart";
import TopBranchesTable from "./components/TopBranchesTable";
import PaymentChart from "./components/PaymentChart";
import Insights from "./components/Insights";
import ThemeToggle from "./components/ThemeToggle";
import ControlPanel from "./components/ControlPanel";
import "./App.css";

const DEFAULT_FILTERS = { startDate: "", endDate: "", category: "All" };

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  useEffect(() => {
    loadAllData()
      .then(setData)
      .catch((e) => setError(e.message));
  }, []);

  const isFiltered =
    filters.startDate !== "" || filters.endDate !== "" || filters.category !== "All";

  const view = useMemo(() => {
    if (!data) return null;
    if (!isFiltered) {
      return {
        kpi: data.kpi,
        revenueTrend: data.revenueTrend,
        categoryBreakdown: data.categoryBreakdown,
        topBranches: data.topBranches,
        paymentMethods: data.paymentMethods,
      };
    }
    return deriveFromTransactions(data.transactions, filters);
  }, [data, filters, isFiltered]);

  if (error) {
    return <div className="state-screen">Failed to load dataset: {error}</div>;
  }

  if (!data || !view) {
    return <div className="state-screen">Loading ledger…</div>;
  }

  return (
    <div className="app-shell">
      <ControlPanel />
      <header className="app-header">
        <div className="app-header-top">
          <span className="eyebrow">Retail Analytics · Field Ledger</span>
          <ThemeToggle theme={theme} onToggle={toggleTheme} />
        </div>
        <h1>Walmart Sales, 2019–2023</h1>
        <p className="header-sub">
          {formatCurrency(data.kpi.total_revenue)} across {data.kpi.total_orders.toLocaleString()}{" "}
          transactions, {data.kpi.branch_count} branches, {data.kpi.city_count} cities.
        </p>
      </header>

      <Section index="01" title="Overview" subtitle="Headline figures for the current filter">
        <KpiRow kpi={view.kpi} />
      </Section>

      <Section index="02" title="Filters" subtitle="Narrow the ledger by date range or category">
        <FilterBar
          filters={filters}
          onChange={setFilters}
          onReset={() => setFilters(DEFAULT_FILTERS)}
        />
      </Section>

      <Section index="03" title="Revenue Trend" subtitle="Monthly revenue over the filtered range">
        <RevenueTrendChart data={view.revenueTrend} theme={theme} />
      </Section>

      <div className="dash-grid-two">
        <Section index="04" title="Revenue by Category" subtitle="Where the money comes from">
          <CategoryChart data={view.categoryBreakdown} theme={theme} />
        </Section>
        <Section index="05" title="Payment Methods" subtitle="Share of revenue by channel">
          <PaymentChart data={view.paymentMethods} theme={theme} />
        </Section>
      </div>

      <Section index="06" title="Top Branches" subtitle="Ranked by revenue, current filter">
        <TopBranchesTable data={view.topBranches} />
      </Section>

      <Section index="07" title="Key Insights" subtitle="Findings from the full unfiltered dataset">
        <Insights />
      </Section>

      <footer className="app-footer">
        <span>Data: Walmart retail transactions, 2019–2023 (Kaggle-sourced, public dataset)</span>
        <span>Built with SQL analysis, React, and Chart.js. Static, no backend.</span>
      </footer>
    </div>
  );
}
