 "use client";
import Checkbox from "@/components/form/input/Checkbox";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "@/icons";
import Link from "next/link";
import React, { useState } from "react"; 
import { HTTPPostNoToken } from "@/Services"; // Ensure this function is correctly imported
import { BASEURL } from "@/Constant/Link"; // Make sure BASEURL is correctly imported 
import { useRouter } from "next/navigation";
import { FiCheckCircle, FiXCircle } from "react-icons/fi";
import Image from "next/image";

export default function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [values, setValues] = useState({
    firstname: '',
    lastName: '',
    phone: '',
    email: '',
    password: '',
    showPassword: false,
  });
  const [modal, setModal] = useState({
    show: false,
    type: 'success' as 'success' | 'error',
    message: ''
  });
  
  const closeModal = () => {
    setModal({ show: false, type: 'success', message: '' });
  };
  

  const [loading, setLoading] = useState(false);
  const router = useRouter(); // Use useRouter hook for navigation
 

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

 
  const handleChange = (prop: keyof typeof values) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(event.target.checked);
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleAcc = () => {
    const { email, password, firstname, lastName, phone } = values;
    if (!isChecked) {
      setModal({ show: true, type: 'error', message: "Please accept the terms and privacy policy." });
      return;
    }
    
    if (!email || !password || !firstname || !lastName || !phone) {
      setModal({ show: true, type: 'error', message: "Please fill in all required fields." });
      return;
    }
    
    if (!validateEmail(email)) {
      setModal({ show: true, type: 'error', message: "Please enter a valid email address." });
      return;
    }
    
    // On success or failure
  
    // Prepare the request body
    const body = {
      phone,
      password,
      email,
      first_name: firstname,
      last_name: lastName
    };

    setLoading(true);

    // Perform the HTTP POST request
    HTTPPostNoToken(`${BASEURL}/auth/register`, body)
      .then(data => {
        setLoading(false);
        console.log(data);
        if (data.code === 200) {
          setModal({ show: true, type: 'success', message: data.message });
          setTimeout(() => {
            router.push('/signin');
          }, 2000);
        } else {
          setModal({ show: true, type: 'error', message: data.message });
        }
      })
      .catch(error => {
        setLoading(false);
        setModal({ show: true, type: 'error', message: "An error occurred. Please try again" });
        console.error('Error during registration:', error); 
      });
  };

  // Helper function to validate email
  const validateEmail = (email: string) => {
    // Simple regex for email validation
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email);
  };

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full overflow-y-auto no-scrollbar">
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
              Sign Up
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your email and password to sign up!
            </p>
          </div>
          <div>
            <form>
              <div className="space-y-5">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  {/* First Name */}
                  <div className="sm:col-span-1">
                    <Label>
                      First Name<span className="text-error-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      id="fname"
                      name="fname"
                      placeholder="Enter your first name"
                      value={values.firstname}
                      onChange={handleChange('firstname')}
                    />
                  </div>
                  {/* Last Name */}
                  <div className="sm:col-span-1">
                    <Label>
                      Last Name<span className="text-error-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      id="lname"
                      name="lname"
                      placeholder="Enter your last name"
                      value={values.lastName}
                      onChange={handleChange('lastName')}
                    />
                  </div>
                </div>
                {/* Phone */}
                <div>
                  <Label>
                    Phone number<span className="text-error-500">*</span>
                  </Label>
                  <Input
                    type="tel"
                    id="phone"
                    name="phone"
                    placeholder="Enter your phone"
                    value={values.phone}
                    onChange={handleChange('phone')}
                  />
                </div>
                {/* Email */}
                <div>
                  <Label>
                    Email<span className="text-error-500">*</span>
                  </Label>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Enter your email"
                    value={values.email}
                    onChange={handleChange('email')}
                  />
                </div>
                {/* Password */}
                <div>
                  <Label>
                    Password<span className="text-error-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      placeholder="Enter your password"
                      type={showPassword ? "text" : "password"}
                      value={values.password}
                      onChange={handleChange('password')}
                    />
                    <span
                      onClick={handleClickShowPassword}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                      )}
                    </span>
                  </div>
                </div>
                {/* Checkbox */}
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    className="w-5 h-5"
                    checked={isChecked}
                    onChange={handleCheckboxChange}
                  />

                  <p className="inline-block font-normal text-gray-500 dark:text-gray-400">
                    By creating an account means you agree to the{" "}
                    <span className="text-gray-800 dark:text-white/90">
                      Terms and Conditions,
                    </span>{" "}
                    and our{" "}
                    <span className="text-gray-800 dark:text-white">
                      Privacy Policy
                    </span>
                  </p>
                </div>
                {/* Button */}
                <div>
                  <button
                    type="button"
                    onClick={handleAcc}
                    disabled={loading}
                    className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600"
                  >
                    {loading ? "Processing..." : "Sign Up"}
                  </button>
                </div>
              </div>
            </form>

            <div className="mt-5">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                Already have an account?
                <Link
                  href="/signin"
                  className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div> 
      {modal.show && (
  <div className="fixed inset-0 z-50 flex items-center justify-center   bg-black/40">
    <div className="bg-white p-6 rounded-lg shadow-md w-80 text-center space-y-4">
      {modal.type === 'success' ? (
        <FiCheckCircle className="mx-auto text-green-500" size={48} />
      ) : (
        <FiXCircle className="mx-auto text-red-500" size={48} />
      )}
      <p className="text-gray-700 text-sm">{modal.message}</p>
      <button
        onClick={closeModal}
        className="mt-2 px-4 py-2 bg-brand-500 text-white rounded hover:bg-brand-600"
      >
        Close
      </button>
    </div>
  </div>
)}


    </div>
  );
}
