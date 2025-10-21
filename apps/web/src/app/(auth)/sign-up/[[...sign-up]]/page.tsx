import { SignUp } from '@clerk/nextjs'

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-2">
            Atlas<span className="text-[#00ADE8]">REG</span>
          </h1>
          <p className="text-gray-400">
            Criar Conta
          </p>
        </div>
        
        <SignUp 
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "bg-gray-800 border border-gray-700",
            }
          }}
        />
        
        <div className="mt-6 text-center text-sm text-gray-400">
          Powered by <span className="text-[#00ADE8] font-semibold">ness.</span>
        </div>
      </div>
    </div>
  )
}

