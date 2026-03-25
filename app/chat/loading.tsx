export default function ChatLoading() {
  return (
    <div className="min-h-screen pt-20 pb-20 md:pb-8 flex items-center justify-center">
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-400 mx-auto mb-4"></div>
        <p className="text-gray-300">Loading your chats...</p>
      </div>
    </div>
  )
}
