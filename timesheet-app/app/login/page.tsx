import LoginForm from "../components/LoginForm";

const LoginPage = () => {
  return (
    <main className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* Left Container - Form Section */}
      <div className="flex flex-col justify-center items-center px-6 py-12 lg:px-16 bg-white">
        <div className="w-full max-w-md space-y-6">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Welcome back
          </h1>
          <LoginForm />
        </div>
      </div>

      <div className="hidden md:flex flex-col justify-center px-12 lg:px-20 bg-[#2563eb] text-white">
        <div className="max-w-xl space-y-4">
          <h2 className="text-4xl lg:text-5xl font-bold tracking-tight">
            ticktock
          </h2>
          <p className="text-blue-100 text-sm lg:text-base leading-relaxed font-normal">
            Introducing ticktock, our cutting-edge timesheet web application designed
            to revolutionize how you manage employee work hours. With ticktock, you
            can effortlessly track and monitor employee attendance and productivity
            from anywhere, anytime, using any internet-connected device.
          </p>
        </div>
      </div>
    </main>
  );
};

export default LoginPage;