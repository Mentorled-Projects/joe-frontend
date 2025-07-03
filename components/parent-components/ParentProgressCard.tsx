"use client";

const steps = ["Complete Profile", "Verify Account", "Add Childs Profile"];

interface Props {
  progressStep: number;
}

export default function ParentProgressCard({ progressStep }: Props) {
  return (
    <div className="max-w-5xl mx-auto mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-2">
          You&apos;re Almost There!
        </h2>
        <p className="text-gray-600 mb-6 text-sm">
          You&apos;ve signed up. Let&apos;s complete your profile to begin
          building your child&apos;s journey.
        </p>

        <div className="flex items-center justify-between">
          {steps.map((label, index) => {
            const active = index < progressStep;
            return (
              <div className="flex flex-col items-center flex-1" key={label}>
                <div
                  className={`w-6 h-6 rounded-full ${
                    active ? "bg-[#2F5FFF]" : "bg-gray-300"
                  }`}
                />
                <p className="text-xs mt-2 text-center">{label}</p>
                {index !== steps.length - 1 && (
                  <div
                    className={`h-1 w-full mt-2 ${
                      index < progressStep - 1 ? "bg-[#2F5FFF]" : "bg-gray-300"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow flex flex-col items-center justify-center text-center">
        <h2 className="text-lg font-semibold mb-2">Recommendation</h2>
        <span className="text-4xl">🧸</span>
        <h3 className="text-l">No Recommendation</h3>
        {/* <Link href="/parent/verify-account">
          <button className="mt-4 bg-[#2F5FFF] hover:bg-[#1d46ff] text-white px-4 py-2 text-sm rounded">
            Verify Account
          </button>
        </Link> */}
      </div>
    </div>
  );
}
