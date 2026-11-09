import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
const loginLogoSrc = new URL('../assets/dt-logo-login.svg', import.meta.url).href;
const uaePassLogoSrc = new URL('../assets/uaepass-logo.svg', import.meta.url).href;
import loginBgSrc from '../assets/login-bg.jpg';
import { setAuthenticated } from '../auth';

const REQUIRED_PASSWORD = 'Tasreeh';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== REQUIRED_PASSWORD) {
      setError('Incorrect password — please try again.');
      setAuthenticated(false);
      return;
    }
    setError('');
    setAuthenticated(true);
    navigate('/customer-type');
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-start px-4 sm:px-8 md:px-16 py-8 bg-cover bg-center relative"
      style={{
        backgroundImage: `url(${loginBgSrc})`,
      }}
    >
      <div className="bg-white rounded-2xl p-8 shadow-xl w-full max-w-[544px]">
        <div className="flex flex-col gap-7 items-center w-full max-w-[480px] mx-auto">
          <img src={loginLogoSrc} alt="Dubai Trade" style={{ height: 72, width: 'auto' }} />

          <h1 className="text-[#181d27] text-[24px] font-semibold text-center">Login to Your Account</h1>

          <form onSubmit={onSubmit} className="flex flex-col gap-4 w-full">
            <div className="flex flex-col gap-2">
              <label className="text-black text-[16px]">
                Username<span className="text-[#ea2428]">*</span>
              </label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="h-[56px] border border-[#e4e2e6] rounded-lg px-4 text-[16px] outline-none focus:border-[#0e1b3d] placeholder-[#5e5e62]"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-black text-[16px]">
                Password<span className="text-[#ea2428]">*</span>
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); if (error) setError(''); }}
                placeholder="Enter your password"
                className="h-[56px] border rounded-lg px-4 text-[16px] outline-none placeholder-[#5e5e62]"
                style={{ borderColor: error ? '#dc3545' : '#e4e2e6' }}
                aria-invalid={!!error}
              />
              {error && <span className="text-[16px] text-[#dc3545]">{error}</span>}
            </div>

            <button
              type="submit"
              className="bg-[#0e1b3d] text-white h-[56px] rounded-full text-[20px] font-medium hover:bg-[#1a2750] transition-colors"
            >
              Login
            </button>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer text-[#585e71] text-[16px]">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="size-[20px] rounded border-2 border-[#c0c6cf] cursor-pointer"
                />
                Remember me
              </label>
              <button type="button" className="text-[#3081e0] font-medium text-[16px]">
                Forgot password?
              </button>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex-1 h-px bg-[#e4e2e6]" />
              <span className="text-[#40484f] text-[16px]">or</span>
              <div className="flex-1 h-px bg-[#e4e2e6]" />
            </div>

            <button
              type="button"
              onClick={() => navigate('/uaepass')}
              className="bg-white border border-black rounded-full h-[56px] flex items-center justify-center gap-2 font-semibold text-[18px] shadow-[0_2px_1px_rgba(0,0,0,0.12)] hover:bg-gray-50"
            >
              <img src={uaePassLogoSrc} alt="UAE PASS" style={{ height: 24, width: 24 }} />
              Sign in with UAE PASS
            </button>

            <p className="text-[#40484f] text-[16px] text-center leading-6">
              By logging in, you confirm that you understand & agree to the Dubai Trade Platform's{' '}
              <a className="text-[#1360d2] underline cursor-pointer">Terms and Conditions</a> and{' '}
              <a className="text-[#1360d2] underline cursor-pointer">Privacy Policy.</a>
            </p>

            <p className="text-center text-[15px] text-[#40484f] mt-2">
              Don't have an account? <a className="text-[#1360d2] font-medium cursor-pointer">Register with Us</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
