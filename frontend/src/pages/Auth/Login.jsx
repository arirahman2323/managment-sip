import React, { useContext, useState } from "react";
import AuthLayout from "../../components/layouts/AuthLayout";
import { Link, useNavigate } from "react-router-dom";
import LogoAuth from "../../components/logo/BlueLogo";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";
import toast from "react-hot-toast";
import { NotificationContext } from "../../context/NotificationContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { setNotifications } = useContext(NotificationContext);
  const [isError, setIsError] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password,
      });

      const { token, lowStockProducts, expiringSoon } = response.data;
      localStorage.setItem("token", token);

      setNotifications({
        lowStockCount: lowStockProducts?.length || 0,
        expiringSoonCount: expiringSoon?.length || 0,
        expiringSoonList: expiringSoon || [],
      });

      toast.success("Login berhasil!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
      setIsError(true);
      toast.error("Email atau password salah!",{duration: 5000});
      // navigate("/");
    }
  };
  return (
    <AuthLayout imageSide="right">
      <div className="w-full max-w-md space-y-8">
        <div>
          <LogoAuth className="justify-left" />
          <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900">Masuk Aplikasi</h2>
          <p className="mt-2 text-center text-sm text-gray-600">Masukkan Email dan Password untuk masuk.</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          {isError && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded text-sm text-center">
              Email atau password yang Anda masukkan salah.
            </div>
          )}
          <div className="flex flex-col gap-4">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => {setEmail(e.target.value);setIsError(false);}}
                className={`relative block w-full appearance-none rounded-md border px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:outline-none sm:text-sm shadow-sm
                  ${isError 
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500" 
                    : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                  }`}
                placeholder="Email"
              />
            </div>
            <div className="">
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => {setPassword(e.target.value);setIsError(false);}}
                className={`relative block w-full appearance-none rounded-md border px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:outline-none sm:text-sm shadow-sm
                  ${isError 
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500" 
                    : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                  }`}
                placeholder="Password"
              />
              {isError && (
                 <p className="text-xs text-red-500 mt-1 ml-1">
                   *Salah input email/password
                 </p>
               )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                Ingatkan saya
              </label>
            </div>
            <div className="text-sm">
              <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                Lupa Password
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Masuk
            </button>
          </div>
        </form>

        <p className="mt-2 text-center text-sm text-gray-600">
          Tidak Punya Akun?
          <Link to="/register" className="ml-1 font-medium text-indigo-600 hover:text-indigo-500">
            Klik disini untuk mendaftar.
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default Login;
