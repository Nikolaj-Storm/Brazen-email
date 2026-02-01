// Brazen - Authentication Component

const Auth = ({ view, onAuthenticate, onNavigate }) => {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [name, setName] = React.useState('');
  const [cooldownRemaining, setCooldownRemaining] = React.useState(0);
  const [cooldownEndTime, setCooldownEndTime] = React.useState(null);
  const [waitingForVerification, setWaitingForVerification] = React.useState(false);
  const [verificationEmail, setVerificationEmail] = React.useState('');
  const [verificationPassword, setVerificationPassword] = React.useState('');

  React.useEffect(() => {
    if (!cooldownEndTime) {
      setCooldownRemaining(0);
      return;
    }

    const interval = setInterval(() => {
      const remaining = Math.max(0, Math.ceil((cooldownEndTime - Date.now()) / 1000));
      setCooldownRemaining(remaining);

      if (remaining === 0) {
        setCooldownEndTime(null);
        setError('');
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [cooldownEndTime]);

  React.useEffect(() => {
    if (!waitingForVerification || !verificationEmail || !verificationPassword) {
      return;
    }

    console.log('📧 [Auth] Polling for email verification...');

    let attempts = 0;
    const maxAttempts = 120;

    const pollInterval = setInterval(async () => {
      attempts++;
      console.log(`🔄 [Auth] Verification poll attempt ${attempts}/${maxAttempts}`);

      try {
        const response = await api.login(verificationEmail, verificationPassword);

        if (response && response.session) {
          console.log('✅ [Auth] Email verified! Logging in...');
          clearInterval(pollInterval);
          setWaitingForVerification(false);
          onAuthenticate(response.user);
        }
      } catch (err) {
        console.log('⏳ [Auth] Email not verified yet, will retry...');

        if (attempts >= maxAttempts) {
          console.warn('⚠️ [Auth] Max verification attempts reached');
          clearInterval(pollInterval);
          setWaitingForVerification(false);
          setError('Verification timeout. Please log in manually after confirming your email.');
        }
      }
    }, 5000);

    return () => clearInterval(pollInterval);
  }, [waitingForVerification, verificationEmail, verificationPassword, onAuthenticate]);

  const handleSubmit = async (e) => {
    console.log('🎯 [Auth] Form submitted!', { view, email, hasPassword: !!password, hasName: !!name });
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let response;

      if (view === 'signup') {
        console.log('🔐 [Auth] Starting signup process...');
        response = await api.signup(email, password, name);
        console.log('✅ [Auth] Signup successful. User created:', response?.user);

        if (response.user && !response.session) {
          console.log('📧 [Auth] Email confirmation required. Showing verification screen...');
          setVerificationEmail(email);
          setVerificationPassword(password);
          setWaitingForVerification(true);
          return;
        }
      } else {
        console.log('🔐 [Auth] Starting login process...');
        response = await api.login(email, password);
        console.log('✅ [Auth] Login successful. User authenticated:', response?.user);
      }

      if (response && response.user && response.session) {
        console.log('⏳ [Auth] Redirecting to dashboard...', {
          view,
          userId: response.user.id,
          email: response.user.email
        });
        onAuthenticate(response.user);
      } else if (response && response.user && !response.session) {
        throw new Error('Email not confirmed. Please check your email and confirm your account.');
      } else {
        throw new Error('No user data received');
      }

    } catch (err) {
      console.error('❌ [Auth] Authentication error caught:', err);

      const rateLimitMatch = err.message?.match(/after (\d+) seconds/);
      if (rateLimitMatch) {
        const requiredSeconds = parseInt(rateLimitMatch[1], 10);
        console.warn(`⏰ [Auth] Rate limit detected. Need to wait ${requiredSeconds} seconds.`);
        setCooldownEndTime(Date.now() + (requiredSeconds + 2) * 1000);
        setError(`Anti-bot security: Please wait ${requiredSeconds} seconds before trying again.`);
      } else {
        setError(err.message || 'Authentication failed. Please check your credentials.');
      }
    } finally {
      setLoading(false);
      console.log('🏁 [Auth] Authentication attempt completed. Loading:', false);
    }
  };

  return h('div', { className: "min-h-screen flex bg-sand-50" },
    // Left Side - Brand
    h('div', { className: "hidden lg:flex w-1/2 bg-gradient-to-br from-terracotta-600 to-terracotta-800 relative overflow-hidden flex-col justify-between p-12 text-white" },
      h('div', {
        className: "absolute inset-0 opacity-10",
        style: {
          backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.3) 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }
      }),
      h('div', {
        onClick: () => onNavigate('landing'),
        className: "relative z-10 flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
      },
        h('div', { className: "w-10 h-10 bg-white rounded-xl rotate-12 flex items-center justify-center shadow-lg" },
          h('div', { className: "w-5 h-5 bg-terracotta-600 -rotate-12 rounded-lg" })
        ),
        h('h1', { className: "font-display text-3xl font-bold tracking-tight" }, 'Brazen')
      ),
      h('div', { className: "relative z-10 max-w-lg" },
        h('h2', { className: "font-display text-4xl font-bold leading-tight mb-6" }, '"Don\'t be afraid to be bold."'),
        h('p', { className: "text-terracotta-100 font-normal text-lg" }, '— Every successful founder, ever'),
        h('div', { className: "mt-12 flex gap-2" },
          h('div', { className: "w-12 h-1 bg-white rounded-full" }),
          h('div', { className: "w-2 h-1 bg-terracotta-400 rounded-full" }),
          h('div', { className: "w-2 h-1 bg-terracotta-400 rounded-full" })
        )
      ),
      h('div', { className: "text-xs text-terracotta-200 flex items-center gap-4" },
        h('div', { className: "flex items-center gap-1.5" },
          h(Icons.Shield, { size: 14 }),
          h('span', null, 'Secure Encryption')
        ),
        h('div', { className: "flex items-center gap-1.5" },
          h(Icons.Check, { size: 14 }),
          h('span', null, 'SOC2 Compliant')
        ),
        h('div', { className: "flex items-center gap-1.5" },
          h(Icons.Zap, { size: 14 }),
          h('span', null, '99.9% Uptime')
        )
      )
    ),
    
    // Right Side - Form
    h('div', { className: "w-full lg:w-1/2 flex flex-col justify-center items-center p-8 sm:p-16 relative" },
      h('button', {
        onClick: () => {
          if (waitingForVerification) {
            setWaitingForVerification(false);
            setVerificationEmail('');
            setVerificationPassword('');
          }
          onNavigate('landing');
        },
        className: "absolute top-8 left-8 flex items-center gap-2 text-neutral-500 hover:text-neutral-900 transition-colors lg:hidden"
      },
        h(Icons.ArrowLeft, { size: 18 }),
        ' Back'
      ),

      // Email Verification Waiting Screen
      waitingForVerification ? h('div', { className: "w-full max-w-md space-y-8 animate-fade-in text-center" },
        h('div', { className: "flex justify-center mb-8" },
          h('div', { className: "w-20 h-20 rounded-2xl bg-blue-100 flex items-center justify-center" },
            h(Icons.Mail, { size: 48, className: "text-blue-600" })
          )
        ),
        h('div', null,
          h('h2', { className: "font-display text-3xl font-bold text-neutral-900 mb-3" }, 'Check your email'),
          h('p', { className: "text-neutral-600 text-lg mb-6" },
            'We sent a confirmation link to ',
            h('strong', null, verificationEmail)
          ),
          h('p', { className: "text-neutral-500 mb-8" },
            'Click the link in the email to verify your account. This page will automatically redirect you to the dashboard once verified.'
          )
        ),
        h('div', { className: "flex flex-col items-center gap-4" },
          h('div', { className: "flex items-center gap-3 text-neutral-500" },
            h(Icons.Loader2, { size: 20, className: "animate-spin text-blue-600" }),
            h('span', null, 'Waiting for email confirmation...')
          ),
          h('div', { className: "mt-8 p-6 bg-blue-50 border border-blue-100 rounded-xl text-left" },
            h('p', { className: "text-sm text-blue-800 font-medium mb-2" }, '📧 Didn\'t receive the email?'),
            h('ul', { className: "text-sm text-blue-700 space-y-1 ml-4 list-disc" },
              h('li', null, 'Check your spam/junk folder'),
              h('li', null, 'Make sure you entered the correct email address'),
              h('li', null, 'Wait a few minutes - emails can be delayed')
            )
          ),
          h('button', {
            onClick: () => {
              setWaitingForVerification(false);
              setVerificationEmail('');
              setVerificationPassword('');
              onNavigate('login');
            },
            className: "mt-6 text-neutral-500 hover:text-neutral-900 underline text-sm"
          }, 'I\'ll verify later and log in manually →')
        )
      ) :

      // Regular Form
      h('div', { className: "w-full max-w-md space-y-8 animate-fade-in" },
        h('div', { className: "text-center lg:text-left" },
          h('h2', { className: "font-display text-3xl font-bold text-neutral-900" },
            view === 'login' ? 'Welcome back' : 'Get started'
          ),
          h('p', { className: "text-neutral-600 mt-2" },
            view === 'login'
              ? 'Enter your credentials to access your account.'
              : 'Create your account and start your free trial.'
          )
        ),
        error && h('div', { className: "p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center gap-2" },
          h(Icons.AlertCircle, { size: 16 }),
          error
        ),
        h('form', { onSubmit: handleSubmit, className: "space-y-6" },
          view === 'signup' && h('div', { className: "space-y-2" },
            h('label', { className: "text-sm font-medium text-neutral-900" }, 'Full Name'),
            h('input', {
              type: "text",
              required: true,
              value: name,
              onChange: (e) => setName(e.target.value),
              className: "w-full px-4 py-3 bg-white border-2 border-sand-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-transparent transition-all placeholder:text-neutral-400",
              placeholder: "John Doe"
            })
          ),
          h('div', { className: "space-y-2" },
            h('label', { className: "text-sm font-medium text-neutral-900" }, 'Email Address'),
            h('input', {
              type: "email",
              required: true,
              value: email,
              onChange: (e) => setEmail(e.target.value),
              className: "w-full px-4 py-3 bg-white border-2 border-sand-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-transparent transition-all placeholder:text-neutral-400",
              placeholder: "john@company.com"
            })
          ),
          h('div', { className: "space-y-2" },
            h('div', { className: "flex justify-between" },
              h('label', { className: "text-sm font-medium text-neutral-900" }, 'Password'),
              view === 'login' && h('a', { href: "#", className: "text-xs text-terracotta-600 hover:text-terracotta-700" }, 'Forgot password?')
            ),
            h('input', {
              type: "password",
              required: true,
              value: password,
              onChange: (e) => setPassword(e.target.value),
              className: "w-full px-4 py-3 bg-white border-2 border-sand-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-transparent transition-all placeholder:text-neutral-400",
              placeholder: "••••••••"
            })
          ),
          h('button', {
            type: "submit",
            disabled: loading || cooldownRemaining > 0,
            className: "w-full py-3 bg-gradient-to-r from-terracotta-500 to-terracotta-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-terracotta-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          },
            loading
              ? h(Icons.Loader2, { size: 20, className: "animate-spin" })
              : cooldownRemaining > 0
                ? `Please wait ${cooldownRemaining}s (anti-bot security)`
                : (view === 'login' ? 'Sign In' : 'Create Account')
          )
        ),
        h('div', { className: "text-center text-sm text-neutral-500" },
          view === 'login' ? "Don't have an account? " : "Already have an account? ",
          h('button', {
            onClick: () => {
                setError('');
                onNavigate(view === 'login' ? 'signup' : 'login');
            },
            className: "font-medium text-terracotta-600 hover:text-terracotta-700 underline underline-offset-2"
          },
            view === 'login' ? 'Sign up' : 'Log in'
          )
        )
      )
    )
  );
};
