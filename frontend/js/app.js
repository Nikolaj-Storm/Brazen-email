// Brazen - Main Application

const App = () => {
  const [authState, setAuthState] = React.useState('checking');
  const [publicView, setPublicView] = React.useState('landing');
  const [privateView, setPrivateView] = React.useState('dashboard');
  const [user, setUser] = React.useState(null);

  // 1. Verify Session on Load
  React.useEffect(() => {
    verifySession();
  }, []);

  const verifySession = async () => {
    console.log('🔄 [App] Verifying session...');
    const token = localStorage.getItem(APP_CONFIG.STORAGE_KEYS.TOKEN);
    const storedUser = localStorage.getItem(APP_CONFIG.STORAGE_KEYS.USER);
    console.log('🔍 [App] Session check:', { hasToken: !!token, hasStoredUser: !!storedUser });

    if (!token) {
      console.log('⚠️ [App] No token found. User is signed out.');
      setAuthState('unauthenticated');
      return;
    }

    if (storedUser) {
        try {
            const parsedUser = JSON.parse(storedUser);
            console.log('✅ [App] Loaded user from localStorage:', parsedUser.email);
            setUser(parsedUser);
            setAuthState('authenticated');
        } catch (e) {
            console.error("❌ [App] Error parsing stored user", e);
        }
    }

    try {
      console.log('🌐 [App] Verifying session with backend...');
      const userData = await api.get('/api/auth/me');
      if (userData && userData.user) {
          console.log('✅ [App] Backend verification successful:', userData.user.email);
          setUser(userData.user);
          setAuthState('authenticated');
      }
    } catch (error) {
      console.warn('⚠️ [App] Session verification failed:', error);
      if (error.message.includes('401') || error.message.includes('Invalid')) {
          console.error('⛔ [App] Invalid session. Clearing auth data and redirecting to landing.');
          localStorage.removeItem(APP_CONFIG.STORAGE_KEYS.TOKEN);
          localStorage.removeItem(APP_CONFIG.STORAGE_KEYS.USER);
          setAuthState('unauthenticated');
      }
    }
  };

  const handleLogin = (userData) => {
    console.log('🔄 [App] Auth State Changed: SIGNED_IN', userData);
    console.log('✅ [App] User is signed in. Current location:', window.location.hash || '(root)');

    if (userData) {
      console.log('📍 [App] Setting auth state to authenticated and navigating to dashboard');
      setUser(userData);
      setAuthState('authenticated');
      setPrivateView('dashboard');
    } else {
      console.error('❌ [App] handleLogin called with no userData!');
    }
  };

  const handleLogout = async () => {
    console.log('🔄 [App] Auth State Changed: SIGNED_OUT');
    try {
      await api.logout();
    } catch (error) {
      console.error('❌ [App] Logout error:', error);
    }
    console.log('⚠️ [App] User is signed out. Redirecting to landing page.');
    setUser(null);
    setAuthState('unauthenticated');
    setPublicView('landing');
    localStorage.removeItem(APP_CONFIG.STORAGE_KEYS.TOKEN);
    localStorage.removeItem(APP_CONFIG.STORAGE_KEYS.USER);
  };

  const handlePublicNavigate = (view) => {
    setPublicView(view);
  };

  // --- Views ---

  if (authState === 'checking') {
    return h('div', { className: "min-h-screen bg-sand-50 flex items-center justify-center" },
      h('div', { className: "text-center space-y-4" },
        h('div', { className: "w-20 h-20 bg-gradient-to-br from-terracotta-400 to-terracotta-600 rounded-2xl rotate-12 mx-auto flex items-center justify-center shadow-2xl shadow-terracotta-300/50 animate-pulse" },
          h('div', { className: "w-10 h-10 bg-white -rotate-12 rounded-xl" })
        ),
        h('p', { className: "text-neutral-600 font-medium" }, 'Loading Brazen...')
      )
    );
  }

  if (authState === 'unauthenticated') {
    console.log('📍 [Router] Rendering public view:', publicView);
    if (publicView === 'landing') {
      return h(LandingPage, { onNavigate: handlePublicNavigate });
    }
    return h(Auth, { view: publicView, onAuthenticate: handleLogin, onNavigate: handlePublicNavigate });
  }

  // --- Private Dashboard View ---
  console.log('📍 [Router] Rendering private view:', privateView, '| User:', user?.email);

  const NavItem = ({ view, icon: IconComponent, label }) =>
    h('button', {
      onClick: () => setPrivateView(view),
      className: `w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
        privateView === view
          ? 'bg-gradient-to-r from-terracotta-500 to-terracotta-600 text-white shadow-lg shadow-terracotta-500/30'
          : 'text-neutral-600 hover:text-neutral-800 hover:bg-sand-100'
      }`
    },
      h('div', { className: `${privateView === view ? 'text-white' : 'group-hover:text-terracotta-600 transition-colors'}` },
        h(IconComponent, { size: 20 })
      ),
      h('span', { className: "font-medium" }, label)
    );

  return h('div', { className: "flex h-screen bg-sand-50 font-sans text-neutral-800 overflow-hidden animate-fade-in" },
    // Sidebar
    h('aside', { className: "w-72 bg-white border-r border-sand-200 flex flex-col shadow-sm z-20" },
      h('div', { className: "p-8 pb-6" },
        h('div', { className: "flex items-center gap-3" },
          h('div', { className: "w-10 h-10 bg-gradient-to-br from-terracotta-500 to-terracotta-700 rounded-xl rotate-12 flex items-center justify-center shadow-lg shadow-terracotta-500/30" },
            h('div', { className: "w-5 h-5 bg-white -rotate-12 rounded-lg" })
          ),
          h('h1', { className: "font-display text-2xl font-bold tracking-tight text-neutral-900" },
            'Brazen'
          )
        ),
        h('p', { className: "text-sm text-neutral-500 mt-2" }, 'Email outreach, refined')
      ),
      h('nav', { className: "flex-1 px-4 space-y-1.5" },
        h('p', { className: "px-4 text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-3" }, 'Main'),
        h(NavItem, { view: "dashboard", icon: Icons.LayoutDashboard, label: "Dashboard" }),
        h(NavItem, { view: "campaigns", icon: Icons.Send, label: "Campaigns" }),
        h(NavItem, { view: "contacts", icon: Icons.Users, label: "Contacts" }),
        h(NavItem, { view: "inbox", icon: Icons.Inbox, label: "Inbox" }),
        h('div', { className: "py-4" }),
        h('p', { className: "px-4 text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-3" }, 'Settings'),
        h(NavItem, { view: "infrastructure", icon: Icons.Layers, label: "Email Accounts" }),
        h(NavItem, { view: "settings", icon: Icons.Settings, label: "Preferences" })
      ),
      h('div', { className: "p-4 border-t border-sand-200" },
        h('div', { className: "flex items-center gap-3 px-4 py-3 group" },
          h('div', { className: "w-10 h-10 rounded-xl bg-gradient-to-br from-terracotta-400 to-terracotta-600 text-white flex items-center justify-center font-display font-bold shadow-md" },
            (user?.user_metadata?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U')
          ),
          h('div', { className: "flex-1 min-w-0" },
            h('p', { className: "text-sm font-medium text-neutral-900 truncate" },
              (user?.user_metadata?.name || user?.email?.split('@')[0] || 'User')
            ),
            h('p', { className: "text-xs text-neutral-500 truncate" }, (user?.email || 'user@example.com'))
          ),
          h('button', {
            onClick: handleLogout,
            className: "text-neutral-400 hover:text-neutral-600 transition-colors p-1 rounded-lg hover:bg-sand-100",
            title: "Logout"
          }, h(Icons.LogOut, { size: 16 }))
        )
      )
    ),
    // Main Content
    h('main', { className: "flex-1 flex flex-col h-screen overflow-hidden" },
      h('header', { className: "h-20 border-b border-sand-200 bg-white/80 backdrop-blur-md flex items-center justify-between px-8 z-10 sticky top-0" },
        h('h2', { className: "text-neutral-500 font-medium text-sm uppercase tracking-widest" },
          privateView === 'dashboard' && 'Dashboard',
          privateView === 'campaigns' && 'Campaigns',
          privateView === 'infrastructure' && 'Email Accounts',
          privateView === 'contacts' && 'Contacts',
          privateView === 'inbox' && 'Inbox',
          privateView === 'settings' && 'Settings'
        ),
        h('div', { className: "flex items-center gap-4" },
          h('div', { className: "flex items-center gap-2 text-xs bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full" },
            h('span', { className: "w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" }),
            h('span', { className: "font-medium" }, 'All Systems Operational')
          )
        )
      ),
      h('div', { className: "flex-1 overflow-y-auto p-8 scroll-smooth" },
        h('div', { className: "max-w-7xl mx-auto" },
          privateView === 'dashboard' && h(Dashboard),
          privateView === 'campaigns' && h(CampaignBuilder),
          privateView === 'infrastructure' && h(EmailAccounts),
          privateView === 'contacts' && h(Contacts),
          privateView === 'inbox' && h(Inbox),
          privateView === 'settings' && h('div', { className: "flex flex-col items-center justify-center h-96 text-neutral-400 animate-fade-in" },
            h(Icons.Settings, { size: 48, className: "mb-4 opacity-20" }),
            h('p', { className: "font-display text-xl text-neutral-900 mb-2" }, 'Coming Soon'),
            h('p', { className: "text-sm" }, 'This module is under construction.')
          )
        )
      )
    )
  );
};

document.addEventListener('DOMContentLoaded', () => {
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(React.createElement(App));
});
