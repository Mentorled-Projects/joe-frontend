"use client"



export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-[#F3F2EF] flex">
      
      <aside className="hidden md:block w-1/4 bg-white p-6 shadow">
        <h2 className="text-lg font-semibold text-[#0B2C49]">Peenly</h2>
        <nav className="mt-6 space-y-4 text-[#4B5563] text-sm">
          <p>Home</p>
          <p>My Network</p>
          <p>Jobs</p>
          <p>Messaging</p>
          <p>Notifications</p>
        </nav>
      </aside>

     
      <section className="flex-1 p-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-[#0B2C49] mb-2">Welcome to Peenly! </h1>
          <p className="text-[#4B5563]">
            You have successfully signed in. Start tracking your childs achievements and connect with tutors today.
          </p>
        </div>
      </section>

      {/* Right Sidebar */}
      <aside className="hidden lg:block w-1/4 bg-white p-6 shadow">
        <h3 className="text-md font-semibold text-[#0B2C49] mb-4">Suggestions</h3>
        <p className="text-sm text-[#4B5563]">Coming soon...</p>
      </aside>
    </main>
  )
}
