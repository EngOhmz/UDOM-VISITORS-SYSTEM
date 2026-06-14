import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import { PhoneIcon, LockClosedIcon } from '@heroicons/react/24/outline';

export default function VisitorLogin() {
  const { data, setData, post, processing, errors } = useForm({
    phone: '',
    password: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post(route('visitor.login'));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white flex">
      <Head title="Visitor Login" />
      
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-indigo-600">
            UDOM VMS
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Visitor Login
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow-xl rounded-xl border border-gray-200 sm:px-10">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <PhoneIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </div>
                    <input
                      type="text"
                      value={data.phone}
                      onChange={e => setData('phone', e.target.value)}
                      className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="e.g. 255712345678"
                      required
                    />
                  </div>
                  {errors.phone && <p className="mt-2 text-sm text-red-600">{errors.phone}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <LockClosedIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </div>
                    <input
                      type="password"
                      value={data.password}
                      onChange={e => setData('password', e.target.value)}
                      className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      required
                    />
                  </div>
                  {errors.password && <p className="mt-2 text-sm text-red-600">{errors.password}</p>}
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={processing}
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {processing ? 'Signing in...' : 'Sign in'}
                </button>
              </div>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Don't have an account?{' '}
                  <a
                    href={route('visitor.register')}
                    className="font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    Register here
                  </a>
                </p>
              </div>

              <div className="mt-4 text-center">
                <a
                  href={route('login')}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Staff Login →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
