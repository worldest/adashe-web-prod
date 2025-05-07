 "use client";
import Checkbox from "@/components/form/input/Checkbox";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { BASEURL } from "@/Constant/Link";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "@/icons";
import { HTTPPostNoToken } from "@/Services";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react"; 
import { FiCheckCircle, FiXCircle } from "react-icons/fi";

// ✅ Modal Component
const Modal = ({ open, onClose, message, type }: any) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full text-center">
        <div className="flex justify-center mb-4">
          {type === "success" ? (
            <FiCheckCircle className="w-10 h-10 text-green-500" />
          ) : (
            <FiXCircle className="w-10 h-10 text-red-500" />
          )}
        </div>
        <p className="text-gray-700">{message}</p>
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          OK
        </button>
      </div>
    </div>
  );
};

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [values, setValues] = useState({ phone: "", password: "", showPassword: false });
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState({ open: false, message: "", type: "" });
  const router = useRouter();

  const handleModalClose = () => setModal({ open: false, message: "", type: "" });

  const Login = async () => {
    setLoading(true);
    const { phone, password } = values;

    if (!phone || !password) {
      setLoading(false);
      setModal({ open: true, message: "Please fill in all the required fields.", type: "error" });
      return;
    }

    const body = { userid: phone, password };

    try {
      const data = await HTTPPostNoToken(`${BASEURL}/auth/login`, body);
      setLoading(false);

      if (data) {
        if (data.code === 200) {
          localStorage.setItem("user", JSON.stringify(data));
          setModal({ open: true, message: "Login successful!", type: "success" });
          setTimeout(() => router.push("/"), 1000);
        } else {
          setModal({ open: true, message: data.message || "Incorrect password.", type: "error" });
        }
      } else {
        setModal({ open: true, message: "No response from server.", type: "error" });
      }
    } catch (error) {
      console.error("Login error:", error);
      setLoading(false);
      setModal({ open: true, message: "An error occurred. Please try again.", type: "error" });
    }
  };

  const handleChange = (prop: keyof typeof values) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [prop]: e.target.value });
  };

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  return (
    <>
      {/* ✅ Modal */}
      <Modal open={modal.open} onClose={handleModalClose} message={modal.message} type={modal.type} />

      <div className="flex flex-col flex-1 lg:w-1/2 w-full">
        <div className="w-full max-w-md sm:pt-10 mx-auto mb-5">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <ChevronLeftIcon />
            Back to dashboard
          </Link>
        </div>
              <div className="flex justify-center">
              <Image
                width={154}
                height={32}
                className="dark:hidden" 
            src="/images/Logo2.jpg"
                alt="Logo"
              />
              </div>
        <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
          <div>
            <div className="mb-5 sm:mb-8">
              <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
                Sign In
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Enter your phone number and password to sign in!
              </p>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); Login(); }}>
              <div className="space-y-6">
                <div>
                  <Label>
                    Phone number <span className="text-error-500">*</span>
                  </Label>
                  <Input
                    placeholder="12345678"
                    type="numeric"
                    value={values.phone}
                    onChange={handleChange("phone")}
                  />
                </div>
                <div>
                  <Label>
                    Password <span className="text-error-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      type={values.showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={values.password}
                      onChange={handleChange("password")}
                    />
                    <span
                      onClick={handleClickShowPassword}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {values.showPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                      )}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Checkbox checked={isChecked} onChange={setIsChecked} />
                    <span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">
                      Keep me logged in
                    </span>
                  </div>
                  <Link
                    href="/reset-password"
                    className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div>
                  <Button className="w-full" size="sm" type="submit" disabled={loading}>
                    {loading ? "Signing in..." : "Sign in"}
                  </Button>
                </div>
              </div>
            </form>
            <div className="mt-5">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                Don&apos;t have an account?{" "}
                <Link
                  href="/signup"
                  className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  Sign Up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
