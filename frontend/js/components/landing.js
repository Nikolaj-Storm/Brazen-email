// Brazen - Landing Page Component

const LandingPage = ({ onNavigate }) => {
  return h('div', { className: "min-h-screen bg-sand-50 text-neutral-900 font-sans selection:bg-terracotta-500 selection:text-white" },
    h('nav', { className: "px-6 py-6 border-b border-sand-200 backdrop-blur-md sticky top-0 z-50 bg-white/90" },
      h('div', { className: "max-w-7xl mx-auto flex justify-between items-center" },
        h('div', { className: "flex items-center gap-3" },
          h('div', { className: "w-10 h-10 bg-gradient-to-br from-terracotta-500 to-terracotta-700 rounded-xl rotate-12 flex items-center justify-center shadow-lg shadow-terracotta-500/30" },
            h('div', { className: "w-5 h-5 bg-white -rotate-12 rounded-lg" })
          ),
          h('h1', { className: "font-display text-2xl font-bold tracking-tight" },
            'Brazen'
          )
        ),
        h('div', { className: "flex items-center gap-6" },
          h('button', {
            onClick: () => onNavigate('login'),
            className: "text-neutral-600 hover:text-neutral-900 font-medium transition-colors hidden sm:block"
          }, 'Sign In'),
          h('button', {
            onClick: () => onNavigate('signup'),
            className: "px-6 py-2.5 bg-gradient-to-r from-terracotta-500 to-terracotta-600 text-white rounded-xl hover:shadow-lg hover:shadow-terracotta-500/30 transition-all flex items-center gap-2 font-medium"
          },
            'Start Free Trial ',
            h(Icons.ArrowRight, { size: 16 })
          )
        )
      )
    ),
    h('section', { className: "pt-24 pb-32 px-6" },
      h('div', { className: "max-w-5xl mx-auto text-center space-y-8 animate-fade-in" },
        h('div', { className: "inline-flex items-center gap-2 px-4 py-2 rounded-full bg-terracotta-50 border border-terracotta-100 text-terracotta-700 text-sm font-medium mb-6" },
          h('span', { className: "w-2 h-2 rounded-full bg-terracotta-500 animate-pulse" }),
          'v2.0 • Built for closers'
        ),
        h('h1', { className: "font-display text-6xl md:text-7xl font-bold leading-[1.1] text-neutral-900" },
          'Email outreach,',
          h('br'),
          h('span', { className: "bg-gradient-to-r from-terracotta-500 to-terracotta-700 bg-clip-text text-transparent" }, 'fearlessly automated')
        ),
        h('p', { className: "text-xl text-neutral-600 max-w-2xl mx-auto font-normal leading-relaxed" },
          'Stop wasting time on manual outreach. Brazen combines powerful automation with intelligent warm-up to help you scale your revenue without compromising deliverability.'
        ),
        h('div', { className: "flex flex-col sm:flex-row items-center justify-center gap-4 pt-8" },
          h('button', {
            onClick: () => onNavigate('signup'),
            className: "w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-terracotta-500 to-terracotta-700 text-white text-lg rounded-xl hover:shadow-xl hover:shadow-terracotta-500/40 transition-all hover:-translate-y-0.5 font-medium"
          }, 'Get Started for Free'),
          h('button', { className: "w-full sm:w-auto px-8 py-4 bg-white border-2 border-sand-200 text-neutral-800 text-lg rounded-xl hover:bg-sand-50 transition-all flex items-center justify-center gap-2 group font-medium" },
            'View Demo ',
            h('div', { className: "bg-sand-100 rounded-lg p-1 group-hover:bg-sand-200 transition-colors" },
              h(Icons.ChevronRight, { size: 16 })
            )
          )
        ),
        h('div', { className: "pt-16 flex items-center justify-center gap-12 text-neutral-400 flex-wrap" },
          h('div', { className: "flex items-center gap-2" },
            h(Icons.Check, { size: 16, className: "text-terracotta-500" }),
            h('span', { className: "text-sm font-medium text-neutral-600" }, '14-day free trial')
          ),
          h('div', { className: "flex items-center gap-2" },
            h(Icons.Check, { size: 16, className: "text-terracotta-500" }),
            h('span', { className: "text-sm font-medium text-neutral-600" }, 'No credit card required')
          ),
          h('div', { className: "flex items-center gap-2" },
            h(Icons.Check, { size: 16, className: "text-terracotta-500" }),
            h('span', { className: "text-sm font-medium text-neutral-600" }, 'Cancel anytime')
          )
        )
      )
    ),
    
    // Features Section
    h('section', { className: "py-24 bg-white border-y border-sand-200" },
      h('div', { className: "max-w-7xl mx-auto px-6" },
        h('div', { className: "text-center mb-16" },
          h('h2', { className: "font-display text-4xl md:text-5xl font-bold text-neutral-900 mb-4" }, 'Everything you need to scale'),
          h('p', { className: "text-lg text-neutral-600 max-w-2xl mx-auto" }, 'Built from the ground up for modern sales teams who demand results')
        ),
        h('div', { className: "grid grid-cols-1 md:grid-cols-3 gap-8" },
          h('div', { className: "space-y-4 p-8 rounded-2xl bg-gradient-to-br from-sand-50 to-white border border-sand-200 hover:border-terracotta-200 transition-all duration-300 hover:shadow-xl hover:shadow-terracotta-100/50 group" },
            h('div', { className: "w-14 h-14 bg-gradient-to-br from-terracotta-400 to-terracotta-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-terracotta-500/30 group-hover:scale-110 transition-transform duration-300" },
              h(Icons.Shield, { size: 24 })
            ),
            h('h3', { className: "font-display text-2xl font-bold text-neutral-900" }, 'Bulletproof Infrastructure'),
            h('p', { className: "text-neutral-600 leading-relaxed" },
              'Multi-provider sending via AWS WorkMail, Zoho, Gmail, and custom SMTP relays. Your domain reputation stays pristine.'
            )
          ),
          h('div', { className: "space-y-4 p-8 rounded-2xl bg-gradient-to-br from-sand-50 to-white border border-sand-200 hover:border-terracotta-200 transition-all duration-300 hover:shadow-xl hover:shadow-terracotta-100/50 group" },
            h('div', { className: "w-14 h-14 bg-gradient-to-br from-terracotta-400 to-terracotta-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-terracotta-500/30 group-hover:scale-110 transition-transform duration-300" },
              h(Icons.Zap, { size: 24 })
            ),
            h('h3', { className: "font-display text-2xl font-bold text-neutral-900" }, 'Intelligent Automation'),
            h('p', { className: "text-neutral-600 leading-relaxed" },
              'Visual campaign builder with conditional branches, smart delays, and personalization. Build complex sequences in minutes.'
            )
          ),
          h('div', { className: "space-y-4 p-8 rounded-2xl bg-gradient-to-br from-sand-50 to-white border border-sand-200 hover:border-terracotta-200 transition-all duration-300 hover:shadow-xl hover:shadow-terracotta-100/50 group" },
            h('div', { className: "w-14 h-14 bg-gradient-to-br from-terracotta-400 to-terracotta-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-terracotta-500/30 group-hover:scale-110 transition-transform duration-300" },
              h(Icons.BarChart, { size: 24 })
            ),
            h('h3', { className: "font-display text-2xl font-bold text-neutral-900" }, 'Real-time Analytics'),
            h('p', { className: "text-neutral-600 leading-relaxed" },
              'Track opens, clicks, and replies in real-time. Visualize your funnel and optimize for maximum conversion.'
            )
          )
        )
      )
    ),

    // Social Proof
    h('section', { className: "py-20 bg-gradient-to-br from-terracotta-50 to-sand-50 border-b border-sand-200" },
      h('div', { className: "max-w-5xl mx-auto px-6 text-center" },
        h('p', { className: "text-sm font-semibold text-terracotta-600 uppercase tracking-wider mb-8" }, 'Trusted by teams at'),
        h('div', { className: "flex items-center justify-center gap-12 flex-wrap opacity-60" },
          h('div', { className: "font-display font-bold text-2xl text-neutral-700" }, 'ACME Corp'),
          h('div', { className: "font-sans font-bold text-2xl tracking-tight text-neutral-700" }, 'StarkIndustries'),
          h('div', { className: "font-display font-bold text-2xl text-neutral-700" }, 'Globex'),
          h('div', { className: "font-mono text-xl text-neutral-700" }, 'Massive Dynamic')
        )
      )
    ),

    // CTA Section
    h('section', { className: "py-24 bg-gradient-to-br from-terracotta-600 to-terracotta-800 text-white" },
      h('div', { className: "max-w-4xl mx-auto px-6 text-center space-y-8" },
        h('h2', { className: "font-display text-5xl font-bold" }, 'Ready to be brazen?'),
        h('p', { className: "text-xl text-terracotta-100 max-w-2xl mx-auto" },
          'Join hundreds of teams who have scaled their outreach with Brazen. Start your free trial today.'
        ),
        h('button', {
          onClick: () => onNavigate('signup'),
          className: "px-10 py-4 bg-white text-terracotta-700 text-lg rounded-xl hover:shadow-2xl hover:shadow-black/20 transition-all hover:-translate-y-1 font-bold"
        }, 'Start Free Trial →')
      )
    ),

    // Footer
    h('footer', { className: "bg-neutral-900 text-neutral-400 py-12 px-6" },
      h('div', { className: "max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6" },
        h('div', { className: "text-sm" },
          '© 2024 Brazen Inc. All rights reserved.'
        ),
        h('div', { className: "flex gap-8 text-sm font-medium" },
          h('a', { href: "#", className: "hover:text-terracotta-400 transition-colors" }, 'Privacy'),
          h('a', { href: "#", className: "hover:text-terracotta-400 transition-colors" }, 'Terms'),
          h('a', { href: "#", className: "hover:text-terracotta-400 transition-colors" }, 'Contact')
        )
      )
    )
  );
};
