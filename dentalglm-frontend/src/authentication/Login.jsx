import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ExclamationCircleIcon } from '@heroicons/react/24/solid'
import { loginSuccess } from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';
import OAuth from './OAuth';
import Alert from './Alert';

function Login() {

  const navigate = useNavigate();
  const disptach = useDispatch();

  const [values, setValues] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({
    status: false,
    success: null,
    message: null,
  });

  const validateInput = (name, value) => {
    switch (name) {
      case 'email':
        if (!value) return 'Email is required.';
        if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) return 'Invalid email address.';
        return '';
      case 'password':
        if (!value) return 'Password is required.';
        if (value.length < 6) return 'Password must be at least 6 characters long.';
        if (value.length > 127) return 'Password must not exceed 127 characters.';
        return '';
      default:
        return '';
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    const error = validateInput(name, value);
    setErrors({ ...errors, [name]: error });
    setValues({ ...values, [name]: value });
  };

  const isFormValid = () => {
    const newErrors = Object.keys(values).reduce((acc, key) => {
      const error = validateInput(key, values[key]);
      if (error) acc[key] = error;
      return acc;
    }, {});
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isFormValid()) {
      setLoading(true);
      setAlert({
        status: false,
        success: null,
        message: null,
      });
      try {
        const res = await fetch(`/api/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        });
        const data = await res.json();
        setLoading(false);
        if (data.success == false) {
          setAlert({
            status: true,
            success: data.success,
            message: data.message,
          });
          return;
        }
        disptach(loginSuccess(data.body.user));
        if (data.body.role === 'student') navigate("/user/home");
        if (data.body.role === 'admin') navigate("/admin/home");
      } catch (error) {
        setLoading(false);
        setAlert({
          status: true,
          success: false,
          message: "Internal Server Error",
        });
        return;
      }
    }
  }
  
  return (
    <>
      <div className="flex min-h-screen flex-1">
        <div className="flex flex-1 flex-col bg-gray justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
          <div className="mx-auto w-full max-w-sm lg:w-96">
            <div>
              <img
                className="h-12 w-auto"
                src="/Dental_GLM_Logo.png"
                alt="DentalGLM"
              />
              <h2 className="mt-4 text-2xl font-bold leading-9 tracking-tight text-white">
                Sign in to your account
              </h2>
              <p className="mt-2 text-sm leading-6 text-gray-400">
                Dont have an account yet?{' '}
                <Link to="/register" className="font-semibold text-indigo-600 hover:text-indigo-700">
                  Sign up now
                </Link>
              </p>
            </div>
            <div className="mt-5">
              <div>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-200">
                      Email
                    </label>
                    <div className="relative mt-1 rounded-md shadow-sm">
                      <input
                        type="email"
                        name="email"
                        id="email"
                        className={`border text-sm rounded-lg block w-full py-1.5 px-3 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-indigo-600 focus:border-indigo-600 sm:leading-6`}
                        onChange={handleChange}
                      />
                      {errors.email &&
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                          <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
                        </div>
                      }
                    </div>
                    {errors.email && <p id="email-error" className="mt-1 text-sm text-red-500">{errors.email}</p>}
                  </div>
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-200">
                      Password
                    </label>
                    <div className="relative mt-1 rounded-md shadow-sm">
                      <input
                        id="password"
                        name="password"
                        type="password"
                        className={`border text-sm rounded-lg block w-full py-1.5 px-3 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-indigo-600 focus:border-indigo-600 sm:leading-6`}
                        onChange={handleChange}
                      />
                      {errors.password &&
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                          <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
                        </div>
                      }
                    </div>
                    {errors.password && <p id="password-error" className="mt-1 text-sm text-red-500">{errors.password}</p>}
                  </div>
                  <div>
                    <button
                      type="submit"
                      disabled={loading}
                      className={`flex w-full justify-center rounded-md bg-indigo-600 hover:bg-indigo-700 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600`}
                    >
                      {loading ?
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        : "Sign in"
                      }
                    </button>
                  </div>
                  <OAuth setAlert={setAlert} />
                  {alert.status &&
                    <Alert className={''} alert={alert} />
                  }
                </form>
              </div>
            </div>
          </div>
        </div>
        <div className="relative hidden w-0 flex-1 lg:block">
          <img
            className="absolute inset-0 h-full w-full object-cover"
            src="/background_image_1.jpeg"
          />
        </div>
      </div>
    </>
  )
}

export default Login