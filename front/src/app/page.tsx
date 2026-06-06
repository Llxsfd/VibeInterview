export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-slate-50">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold text-center text-slate-800 mb-8">
          智能面试平台
        </h1>
        <p className="text-center text-slate-600 mb-12 text-lg">
          上传个人资料，生成专属面试题库与知识复习助手
        </p>
        <div className="flex justify-center space-x-4">
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition">
            上传资料
          </button>
          <button className="px-6 py-3 bg-white text-blue-600 border border-blue-600 rounded-lg shadow hover:bg-slate-50 transition">
            开始模拟面试
          </button>
        </div>
      </div>
    </main>
  );
}
