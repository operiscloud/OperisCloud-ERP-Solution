import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col items-center justify-center p-4">
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-2xl">O</span>
          </div>
          <span className="text-2xl font-bold text-gray-900">OperisCloud</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Créez votre compte</h1>
        <p className="text-gray-600">Démarrez gratuitement en quelques minutes</p>
      </div>
      <SignUp />
    </div>
  );
}
