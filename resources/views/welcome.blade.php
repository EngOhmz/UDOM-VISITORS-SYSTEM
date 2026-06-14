<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>EMASUITE API | Bank Marketing & Agent Performance</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Inter', sans-serif; }
    </style>
</head>
<body class="bg-gray-50 text-gray-900">
    <div class="min-h-screen">
        <!-- Header -->
        <header class="bg-indigo-700 text-white py-12 px-6 shadow-lg">
            <div class="max-w-5xl mx-auto">
                <h1 class="text-4xl font-bold mb-2">EMASUITE Backend</h1>
                <p class="text-indigo-100 text-lg">Bank Marketing & Agent Performance Management System API</p>
                <div class="mt-6 flex gap-4">
                    <span class="bg-indigo-600 px-3 py-1 rounded-full text-sm font-medium border border-indigo-400">v1.0.0</span>
                    <span class="bg-green-500 px-3 py-1 rounded-full text-sm font-medium">System Online</span>
                </div>
            </div>
        </header>

        <main class="max-w-5xl mx-auto py-12 px-6">
            <!-- Getting Started -->
            <section class="mb-12">
                <h2 class="text-2xl font-bold mb-6 flex items-center">
                    <span class="bg-indigo-100 text-indigo-700 p-2 rounded-lg mr-3">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                    </span>
                    Getting Started
                </h2>
                <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <p class="text-gray-600 mb-4">This API is designed for Flutter mobile integration. All responses are returned in JSON format.</p>
                    <div class="bg-gray-900 rounded-lg p-4 font-mono text-sm text-indigo-300">
                        <span class="text-gray-500"># Base URL</span><br>
                        {{ url('/api') }}
                    </div>
                </div>
            </section>

            <!-- API Endpoints -->
            <section class="mb-12">
                <h2 class="text-2xl font-bold mb-6 flex items-center">
                    <span class="bg-indigo-100 text-indigo-700 p-2 rounded-lg mr-3">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                    </span>
                    Core Endpoints
                </h2>

                <div class="space-y-4">
                    <!-- Auth -->
                    <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div class="bg-gray-50 px-6 py-3 border-b border-gray-200 font-bold text-gray-700">Authentication</div>
                        <div class="p-6 space-y-4">
                            <div class="flex items-center justify-between border-b border-gray-100 pb-2">
                                <div>
                                    <span class="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold mr-2 uppercase">POST</span>
                                    <code class="text-sm">/login</code>
                                </div>
                                <span class="text-xs text-gray-400">email, password</span>
                            </div>
                            <div class="flex items-center justify-between border-b border-gray-100 pb-2">
                                <div>
                                    <span class="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold mr-2 uppercase">POST</span>
                                    <code class="text-sm">/register</code>
                                </div>
                                <span class="text-xs text-gray-400">name, email, phone, password</span>
                            </div>
                        </div>
                    </div>

                    <!-- Dashboard -->
                    <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div class="bg-gray-50 px-6 py-3 border-b border-gray-200 font-bold text-gray-700">Dashboard & Analytics</div>
                        <div class="p-6 space-y-4">
                            <div class="flex items-center justify-between border-b border-gray-100 pb-2">
                                <div>
                                    <span class="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-bold mr-2 uppercase">GET</span>
                                    <code class="text-sm">/dashboard</code>
                                </div>
                                <span class="text-xs text-gray-400 text-indigo-500 font-medium italic">Auth Required</span>
                            </div>
                            <div class="flex items-center justify-between border-b border-gray-100 pb-2">
                                <div>
                                    <span class="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-bold mr-2 uppercase">GET</span>
                                    <code class="text-sm">/agents/performance</code>
                                </div>
                                <span class="text-xs text-gray-400 text-indigo-500 font-medium italic">Auth Required</span>
                            </div>
                            <div class="flex items-center justify-between border-b border-gray-100 pb-2">
                                <div>
                                    <span class="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-bold mr-2 uppercase">GET</span>
                                    <code class="text-sm">/branches/comparison</code>
                                </div>
                                <span class="text-xs text-gray-400 text-indigo-500 font-medium italic">Auth Required</span>
                            </div>
                        </div>
                    </div>

                    <!-- Accounts -->
                    <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div class="bg-gray-50 px-6 py-3 border-b border-gray-200 font-bold text-gray-700">Account Management</div>
                        <div class="p-6 space-y-4">
                            <div class="flex items-center justify-between border-b border-gray-100 pb-2">
                                <div>
                                    <span class="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-bold mr-2 uppercase">GET</span>
                                    <code class="text-sm">/accounts</code>
                                </div>
                                <span class="text-xs text-gray-400 italic">Supports Pagination</span>
                            </div>
                            <div class="flex items-center justify-between border-b border-gray-100 pb-2">
                                <div>
                                    <span class="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold mr-2 uppercase">POST</span>
                                    <code class="text-sm">/accounts</code>
                                </div>
                                <span class="text-xs text-gray-400 italic">Create Account</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Database State -->
            <section class="mb-12">
                <h2 class="text-2xl font-bold mb-6 flex items-center">
                    <span class="bg-indigo-100 text-indigo-700 p-2 rounded-lg mr-3">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                    </span>
                    System Health
                </h2>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
                        <div class="text-3xl font-bold text-indigo-600 mb-1">{{ \App\Models\User::count() }}</div>
                        <div class="text-gray-500 text-sm">Users Registered</div>
                    </div>
                    <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
                        <div class="text-3xl font-bold text-indigo-600 mb-1">{{ \App\Models\Account::count() }}</div>
                        <div class="text-gray-500 text-sm">Accounts Managed</div>
                    </div>
                    <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
                        <div class="text-3xl font-bold text-indigo-600 mb-1">{{ \App\Models\Branch::count() }}</div>
                        <div class="text-gray-500 text-sm">Active Branches</div>
                    </div>
                </div>
            </section>
        </main>

        <footer class="bg-white border-t border-gray-200 py-8 px-6 text-center text-gray-400 text-sm">
            &copy; {{ date('Y') }} EMASUITE. Built with Laravel & React.
        </footer>
    </div>
</body>
</html>
