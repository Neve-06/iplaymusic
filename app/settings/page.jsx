import DarkMode from "../darkmode"

export default function SettingsPage() {

    return (
        <>
            <div className="w-full max-w-2xl">
                <h1 className="text-4xl font-bold mb-8 bg-linear-to-r from-orange-500 to-pink-600 bg-clip-text text-transparent p-1">Settings</h1>
                
                <div className="space-y-4">
                    {/* Dark Mode Setting */}
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 flex items-center justify-between border border-gray-200 dark:border-gray-700">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                                Dark Mode
                            </h2>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Toggle between light and dark theme
                            </p>
                        </div>
                        <div className="text-3xl cursor-pointer">
                            <DarkMode />
                        </div>
                    </div>

                    {/* Future Settings Placeholder */}
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-700 opacity-50">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                                More Settings Coming Soon
                            </h2>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Additional features will be added here
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}