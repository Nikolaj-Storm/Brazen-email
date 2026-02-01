// Brazen - Dashboard Component

const Card = ({ children, className = '', title, subtitle, action }) => {
  return h('div', { className: `bg-white border border-sand-200 shadow-sm rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-md ${className}` },
    (title || action) && h('div', { className: "px-6 py-5 border-b border-sand-100 flex justify-between items-center bg-sand-50" },
      h('div', null,
        title && h('h3', { className: "font-display text-xl font-semibold text-neutral-900" }, title),
        subtitle && h('p', { className: "text-sm text-neutral-500 mt-1" }, subtitle)
      ),
      action && h('div', null, action)
    ),
    h('div', { className: "p-6" }, children)
  );
};

const Dashboard = () => {
  const { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip: RechartsTooltip, ResponsiveContainer } = window.Recharts;

  const [dashboardData, setDashboardData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const data = await api.getDashboardStats();
      setDashboardData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return h('div', { className: "flex items-center justify-center h-96 animate-fade-in" },
      h(Icons.Loader2, { size: 48, className: "text-terracotta-600 animate-spin" })
    );
  }

  if (error) {
    return h('div', { className: "flex flex-col items-center justify-center h-96 text-center animate-fade-in" },
      h(Icons.AlertCircle, { size: 64, className: "text-red-300 mb-4" }),
      h('h3', { className: "font-display text-2xl text-neutral-900 mb-2" }, 'Failed to Load Dashboard'),
      h('p', { className: "text-neutral-500 mb-6" }, error),
      h('button', {
        onClick: loadDashboardData,
        className: "px-6 py-3 bg-gradient-to-r from-terracotta-500 to-terracotta-600 text-white rounded-xl hover:shadow-lg hover:shadow-terracotta-500/30 transition-all"
      }, 'Retry')
    );
  }

  const data = dashboardData?.activity || [];
  const metrics = dashboardData?.metrics || [
    { label: 'Total Sent', value: '0', change: '+0%', icon: Icons.Mail, color: 'text-blue-600' },
    { label: 'Open Rate', value: '0%', change: '+0%', icon: Icons.ArrowUpRight, color: 'text-emerald-600' },
    { label: 'Click Rate', value: '0%', change: '+0%', icon: Icons.MousePointer2, color: 'text-amber-600' },
    { label: 'Reply Rate', value: '0%', change: '+0%', icon: Icons.MessageSquare, color: 'text-terracotta-600' },
  ];

  return h('div', { className: "space-y-8 animate-fade-in" },
    h('div', { className: "flex justify-between items-end" },
      h('div', null,
        h('h2', { className: "font-display text-4xl font-bold text-neutral-900" }, 'Dashboard'),
        h('p', { className: "text-neutral-600 mt-2" }, 'Your campaign performance at a glance.')
      )
    ),
    h('div', { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" },
      ...metrics.map((metric, index) =>
        h('div', { key: index, className: "bg-white p-6 rounded-2xl border border-sand-200 shadow-sm hover:shadow-md hover:border-terracotta-200 transition-all" },
          h('div', { className: "flex justify-between items-start" },
            h('div', null,
              h('p', { className: "text-sm font-semibold text-neutral-500 uppercase tracking-wide" }, metric.label),
              h('h3', { className: "text-3xl font-display font-bold text-neutral-900 mt-2" }, metric.value)
            ),
            h('div', { className: `p-3 bg-sand-50 rounded-xl ${metric.color}` },
              h(metric.icon, { size: 20 })
            )
          ),
          h('div', { className: "mt-4 flex items-center text-sm" },
            h('span', { className: metric.change.startsWith('+') ? 'text-emerald-600' : 'text-red-500' },
              metric.change
            ),
            h('span', { className: "text-neutral-400 ml-2" }, 'vs last week')
          )
        )
      )
    ),
    h('div', { className: "grid grid-cols-1 gap-8" },
      h(Card, { title: "Activity Volume", className: "w-full" },
        h('div', { className: "h-[300px] w-full" },
          h(ResponsiveContainer, { width: "100%", height: "100%" },
            h(AreaChart, { data: data, margin: { top: 10, right: 30, left: 0, bottom: 0 } },
              h('defs', null,
                h('linearGradient', { id: "colorSent", x1: "0", y1: "0", x2: "0", y2: "1" },
                  h('stop', { offset: "5%", stopColor: "#C97656", stopOpacity: 0.3 }),
                  h('stop', { offset: "95%", stopColor: "#C97656", stopOpacity: 0 })
                ),
                h('linearGradient', { id: "colorOpened", x1: "0", y1: "0", x2: "0", y2: "1" },
                  h('stop', { offset: "5%", stopColor: "#DE6B48", stopOpacity: 0.3 }),
                  h('stop', { offset: "95%", stopColor: "#DE6B48", stopOpacity: 0 })
                )
              ),
              h(XAxis, { dataKey: "name", axisLine: false, tickLine: false, tick: { fill: '#A3A3A3' } }),
              h(YAxis, { axisLine: false, tickLine: false, tick: { fill: '#A3A3A3' } }),
              h(CartesianGrid, { vertical: false, stroke: "#E5E5E5", strokeDasharray: "3 3" }),
              h(RechartsTooltip, {
                contentStyle: { backgroundColor: '#FFF', border: '1px solid #EDE7DD', borderRadius: '12px', fontFamily: 'Inter' }
              }),
              h(Area, { type: "monotone", dataKey: "sent", stroke: "#C97656", strokeWidth: 2, fillOpacity: 1, fill: "url(#colorSent)" }),
              h(Area, { type: "monotone", dataKey: "opened", stroke: "#DE6B48", strokeWidth: 2, fillOpacity: 1, fill: "url(#colorOpened)" })
            )
          )
        )
      )
    )
  );
};
