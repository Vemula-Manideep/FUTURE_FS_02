import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Activity,
  BadgeIndianRupee,
  CheckCircle2,
  Clock3,
  Target,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { api } from "../../lib/api";
import { currency } from "../../lib/utils";
import {
  Card,
  CardContent,
  CardHeader,
} from "../../components/ui/card";
import { mockAnalytics } from "../../data/mockData";

/* =========================================================
   API
========================================================= */

const fetchAnalytics = async () => {
  try {
    const res = await api.get("/dashboard/analytics");
    return res.data.data;
  } catch {
    return mockAnalytics;
  }
};

/* =========================================================
   Metric Card
========================================================= */

function MetricCard({ title, value, helper, icon: Icon }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="dashboard-metric-wrapper"
    >
      <Card className="dashboard-metric-card">
        <CardContent className="dashboard-metric-content">
          <div className="dashboard-metric-info">
            <p className="dashboard-metric-title">
              {title}
            </p>

            <p className="dashboard-metric-value">
              {value}
            </p>

            <p className="dashboard-metric-helper">
              {helper}
            </p>
          </div>

          <div className="dashboard-metric-icon">
            <Icon />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

/* =========================================================
   Dashboard Page
========================================================= */

export function DashboardPage() {
  const {
    data = mockAnalytics,
    isLoading,
  } = useQuery({
    queryKey: ["analytics"],
    queryFn: fetchAnalytics,
  });

  const summary = data?.summary ?? mockAnalytics.summary;

  return (
    <>
      {/* =====================================================
          PAGE
      ===================================================== */}

      <div className="dashboard-page">

        {/* ===================================================
            HEADER
        =================================================== */}

        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">
              Revenue pipeline
            </h1>

            <p className="dashboard-description">
              Lead health, sales velocity, and team activity
              in one operational view.
            </p>
          </div>

          {isLoading && (
            <div className="dashboard-loading">
              Loading...
            </div>
          )}
        </div>

        {/* ===================================================
            METRICS
        =================================================== */}

        <section className="dashboard-metrics">

          <MetricCard
            title="Total Leads"
            value={summary.total}
            helper="All captured opportunities"
            icon={Target}
          />

          <MetricCard
            title="Converted"
            value={summary.converted}
            helper={`${summary.conversionRate}% conversion rate`}
            icon={CheckCircle2}
          />

          <MetricCard
            title="Pending"
            value={summary.pending}
            helper="Needs sales action"
            icon={Clock3}
          />

          <MetricCard
            title="Revenue"
            value={currency(summary.revenue)}
            helper={`${currency(summary.pipelineValue)} pipeline`}
            icon={BadgeIndianRupee}
          />

        </section>

        {/* ===================================================
            CHARTS
        =================================================== */}

        <section className="dashboard-charts">

          {/* Monthly Lead Analytics */}

          <Card className="dashboard-chart-card">

            <CardHeader className="dashboard-card-header">
              <div>
                <h2 className="dashboard-card-title">
                  Monthly lead analytics
                </h2>

                <p className="dashboard-card-subtitle">
                  Lead volume over time
                </p>
              </div>
            </CardHeader>

            <CardContent className="dashboard-chart-content">

              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <AreaChart
                  data={data?.monthly ?? []}
                  margin={{
                    top: 10,
                    right: 10,
                    left: -20,
                    bottom: 0,
                  }}
                >

                  <defs>
                    <linearGradient
                      id="leadGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="#2563eb"
                        stopOpacity={0.35}
                      />

                      <stop
                        offset="95%"
                        stopColor="#2563eb"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>

                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="var(--border)"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                  />

                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    allowDecimals={false}
                  />

                  <Tooltip />

                  <Area
                    type="monotone"
                    dataKey="leads"
                    stroke="#2563eb"
                    fill="url(#leadGradient)"
                    strokeWidth={2}
                  />

                </AreaChart>
              </ResponsiveContainer>

            </CardContent>

          </Card>

          {/* Top Sources */}

          <Card className="dashboard-chart-card">

            <CardHeader className="dashboard-card-header">
              <div>
                <h2 className="dashboard-card-title">
                  Top sources
                </h2>

                <p className="dashboard-card-subtitle">
                  Leads by acquisition source
                </p>
              </div>
            </CardHeader>

            <CardContent className="dashboard-chart-content">

              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <BarChart
                  data={data?.sourceCounts ?? []}
                  margin={{
                    top: 10,
                    right: 10,
                    left: -20,
                    bottom: 0,
                  }}
                >

                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="var(--border)"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="_id"
                    axisLine={false}
                    tickLine={false}
                  />

                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    allowDecimals={false}
                  />

                  <Tooltip />

                  <Bar
                    dataKey="count"
                    fill="#059669"
                    radius={[6, 6, 0, 0]}
                  />

                </BarChart>
              </ResponsiveContainer>

            </CardContent>

          </Card>

        </section>

        {/* ===================================================
            RECENT ACTIVITY
        =================================================== */}

        <Card className="dashboard-activity-card">

          <CardHeader className="dashboard-activity-header">

            <div className="dashboard-activity-icon">
              <Activity />
            </div>

            <div>
              <h2 className="dashboard-card-title">
                Recent activity
              </h2>

              <p className="dashboard-card-subtitle">
                Latest team activity
              </p>
            </div>

          </CardHeader>

          <CardContent className="dashboard-activity-content">

            {data?.recentActivity?.length > 0 ? (
              data.recentActivity.map((item) => (
                <div
                  key={item._id}
                  className="dashboard-activity-item"
                >

                  <div className="dashboard-activity-dot" />

                  <span className="dashboard-activity-action">
                    {item.action.replace(".", " ")}
                  </span>

                  <span className="dashboard-activity-actor">
                    {item.actor?.name || "System"}
                  </span>

                </div>
              ))
            ) : (
              <p className="dashboard-empty">
                No recent activity.
              </p>
            )}

          </CardContent>

        </Card>

      </div>

      {/* =====================================================
          CSS
      ===================================================== */}

      <style>{`

        /* ================================================
           PAGE
        ================================================ */

        .dashboard-page {
          width: 100%;
          min-height: 100%;
          padding: 24px;
          color: var(--foreground);
        }


        /* ================================================
           HEADER
        ================================================ */

        .dashboard-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 24px;
        }

        .dashboard-title {
          margin: 0;
          font-size: 28px;
          font-weight: 700;
          line-height: 1.2;
          letter-spacing: -0.025em;
        }

        .dashboard-description {
          margin: 6px 0 0;
          color: var(--muted-foreground);
          font-size: 14px;
          line-height: 1.5;
        }

        .dashboard-loading {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 110px;
          height: 36px;
          border-radius: 8px;
          background: var(--muted);
          color: var(--muted-foreground);
          font-size: 12px;
          animation: dashboard-pulse 1.5s infinite;
        }


        /* ================================================
           METRICS
        ================================================ */

        .dashboard-metrics {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 16px;
          margin-bottom: 16px;
        }

        .dashboard-metric-wrapper {
          min-width: 0;
        }

        .dashboard-metric-card {
          height: 100%;
          overflow: hidden;
          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease;
        }

        .dashboard-metric-card:hover {
          transform: translateY(-3px);
          box-shadow:
            0 10px 25px rgba(0, 0, 0, 0.08);
        }

        .dashboard-metric-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          min-height: 136px;
          padding: 20px;
        }

        .dashboard-metric-info {
          min-width: 0;
        }

        .dashboard-metric-title {
          margin: 0;
          color: var(--muted-foreground);
          font-size: 13px;
          font-weight: 500;
        }

        .dashboard-metric-value {
          margin: 8px 0 0;
          font-size: 28px;
          font-weight: 700;
          line-height: 1.2;
        }

        .dashboard-metric-helper {
          margin: 6px 0 0;
          color: var(--muted-foreground);
          font-size: 11px;
        }

        .dashboard-metric-icon {
          display: grid;
          place-items: center;
          flex-shrink: 0;
          width: 44px;
          height: 44px;
          border-radius: 10px;
          background: var(--muted);
        }

        .dashboard-metric-icon svg {
          width: 20px;
          height: 20px;
          color: var(--primary);
        }


        /* ================================================
           CHARTS
        ================================================ */

        .dashboard-charts {
          display: grid;
          grid-template-columns: 1.5fr 1fr;
          gap: 16px;
          margin-bottom: 16px;
        }

        .dashboard-chart-card {
          min-width: 0;
          overflow: hidden;
        }

        .dashboard-card-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
        }

        .dashboard-card-title {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
        }

        .dashboard-card-subtitle {
          margin: 4px 0 0;
          color: var(--muted-foreground);
          font-size: 12px;
        }

        .dashboard-chart-content {
          height: 320px;
        }


        /* ================================================
           ACTIVITY
        ================================================ */

        .dashboard-activity-card {
          overflow: hidden;
        }

        .dashboard-activity-header {
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 12px;
        }

        .dashboard-activity-icon {
          display: grid;
          place-items: center;
          width: 34px;
          height: 34px;
          flex-shrink: 0;
          border-radius: 8px;
          background: var(--muted);
        }

        .dashboard-activity-icon svg {
          width: 17px;
          height: 17px;
          color: var(--primary);
        }

        .dashboard-activity-content {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .dashboard-activity-item {
          display: flex;
          align-items: center;
          gap: 12px;
          min-height: 48px;
          padding: 10px 14px;
          border: 1px solid transparent;
          border-radius: 8px;
          background: var(--muted);
          font-size: 14px;
          transition:
            background 0.2s ease,
            border-color 0.2s ease;
        }

        .dashboard-activity-item:hover {
          border-color: var(--border);
        }

        .dashboard-activity-dot {
          width: 7px;
          height: 7px;
          flex-shrink: 0;
          border-radius: 50%;
          background: var(--primary);
        }

        .dashboard-activity-action {
          flex: 1;
          min-width: 0;
          text-transform: capitalize;
        }

        .dashboard-activity-actor {
          flex-shrink: 0;
          color: var(--muted-foreground);
          font-size: 12px;
        }

        .dashboard-empty {
          margin: 0;
          padding: 24px;
          color: var(--muted-foreground);
          text-align: center;
          font-size: 14px;
        }


        /* ================================================
           ANIMATION
        ================================================ */

        @keyframes dashboard-pulse {
          0%,
          100% {
            opacity: 0.55;
          }

          50% {
            opacity: 1;
          }
        }


        /* ================================================
           TABLET
        ================================================ */

        @media (max-width: 1100px) {

          .dashboard-metrics {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .dashboard-charts {
            grid-template-columns: 1fr;
          }

        }


        /* ================================================
           MOBILE
        ================================================ */

        @media (max-width: 640px) {

          .dashboard-page {
            padding: 16px;
          }

          .dashboard-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .dashboard-title {
            font-size: 23px;
          }

          .dashboard-description {
            font-size: 12px;
          }

          .dashboard-loading {
            width: 100%;
          }

          .dashboard-metrics {
            grid-template-columns: 1fr;
            gap: 12px;
          }

          .dashboard-metric-content {
            min-height: 110px;
          }

          .dashboard-charts {
            grid-template-columns: 1fr;
            gap: 12px;
          }

          .dashboard-chart-content {
            height: 280px;
          }

          .dashboard-activity-item {
            align-items: flex-start;
            flex-wrap: wrap;
          }

          .dashboard-activity-action {
            flex: 1;
          }

          .dashboard-activity-actor {
            width: 100%;
            padding-left: 19px;
          }

        }

      `}</style>
    </>
  );
}