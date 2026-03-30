import { Bot, Plus, Settings, MessageSquare, LayoutDashboard, Database, FileText, Search, ArrowRight, Activity, LogOut } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { logout } from "@/app/actions/auth";

export default async function Dashboard() {
  // Fetch dynamic stats
  const { count: botsCount } = await supabase.from('bots').select('*', { count: 'exact', head: true });
  const { count: sourcesCount } = await supabase.from('sources').select('*', { count: 'exact', head: true });
  const { count: messagesCount } = await supabase.from('messages').select('*', { count: 'exact', head: true });

  // Fetch list of bots
  const { data: bots } = await supabase.from('bots').select('*').order('created_at', { ascending: false });

  // Fetch recent activity (latest sources)
  const { data: recentSources } = await supabase
    .from('sources')
    .select('*, bots(name)')
    .order('created_at', { ascending: false })
    .limit(5);
  return (
    <div className="flex h-screen bg-[#F9FAFB] text-slate-900 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between">
        <div className="p-4">
          <div className="flex items-center gap-2 mb-8 px-2">
            <div className="w-8 h-8 rounded bg-[#0070D7] flex items-center justify-center text-white font-bold">
              GB
            </div>
            <span className="font-semibold text-xl tracking-tight">GaceBot</span>
          </div>

          <nav className="space-y-1">
            <Link href="/" className="flex items-center gap-3 px-3 py-2 bg-[#0070D7]/10 text-[#0070D7] rounded-md font-medium text-sm">
              <LayoutDashboard size={18} />
              Panel General
            </Link>
            <div className="pt-4 pb-2 px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Mis Bots
            </div>
            {bots?.map(bot => (
              <Link key={bot.id} href={`/bot/${bot.id}`} className="flex items-center gap-3 px-3 py-2 hover:bg-slate-50 text-slate-600 rounded-md font-medium text-sm transition-colors">
                <Bot size={18} />
                {bot.name}
              </Link>
            ))}

            <div className="pt-6 pb-2 px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Recursos
            </div>
            <Link href="#" className="flex items-center gap-3 px-3 py-2 hover:bg-slate-50 text-slate-600 rounded-md font-medium text-sm transition-colors">
              <Database size={18} />
              Base de Conocimiento
            </Link>
            <Link href="#" className="flex items-center gap-3 px-3 py-2 hover:bg-slate-50 text-slate-600 rounded-md font-medium text-sm transition-colors">
              <MessageSquare size={18} />
              Chats e Interacciones
            </Link>
          </nav>
        </div>

        <div className="p-4 border-t border-slate-200 space-y-1">
          <Link href="#" className="flex items-center gap-3 px-3 py-2 hover:bg-slate-50 text-slate-600 rounded-md font-medium text-sm transition-colors">
            <Settings size={18} />
            Configuración
          </Link>
          <form action={logout}>
            <button type="submit" className="w-full flex items-center gap-3 px-3 py-2 hover:bg-red-50 text-red-600 rounded-md font-medium text-sm transition-colors">
              <LogOut size={18} />
              Cerrar Sesión
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Buscar bots, fuentes o chats..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0070D7]/20 focus:border-[#0070D7] transition-all"
            />
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300"></div>
              <span className="text-sm font-medium text-slate-700">Periodista</span>
            </div>
          </div>
        </header>

        {/* Dashboard Body */}
        <div className="flex-1 overflow-auto p-8">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Panel General</h1>
                <p className="text-slate-500 text-sm mt-1">Gestiona tus asistentes virtuales y fuentes de investigación.</p>
              </div>
              <Link href="/bot/new" className="flex items-center gap-2 bg-[#0070D7] hover:bg-[#005bb5] text-white px-4 py-2.5 rounded-lg font-medium text-sm transition-colors shadow-sm">
                <Plus size={18} />
                Crear Nuevo Bot
              </Link>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
                <div className="flex items-center gap-4 text-slate-500 mb-4">
                  <div className="p-2 bg-blue-50 rounded-lg text-[#0070D7]">
                    <Bot size={24} />
                  </div>
                  <span className="font-medium">Bots Activos</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-slate-900">{botsCount || 0}</span>
                  <span className="text-sm font-medium text-emerald-600">activos</span>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
                <div className="flex items-center gap-4 text-slate-500 mb-4">
                  <div className="p-2 bg-blue-50 rounded-lg text-[#0070D7]">
                    <Database size={24} />
                  </div>
                  <span className="font-medium">Fuentes Ingestadas</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-slate-900">{sourcesCount || 0}</span>
                  <span className="text-sm font-medium text-slate-500">archivos y URLs</span>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
                <div className="flex items-center gap-4 text-slate-500 mb-4">
                  <div className="p-2 bg-blue-50 rounded-lg text-[#0070D7]">
                    <MessageSquare size={24} />
                  </div>
                  <span className="font-medium">Consultas Realizadas</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-slate-900">{messagesCount || 0}</span>
                  <span className="text-sm font-medium text-emerald-600">mensajes</span>
                </div>
              </div>
            </div>

            {/* Manage Bots Grid */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-900">Mis Asistentes</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {bots?.map(bot => (
                  <Link key={bot.id} href={`/bot/${bot.id}`} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-[#0070D7]/50 hover:shadow-md transition-all group">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex gap-3 items-center">
                        <div className="w-10 h-10 rounded-lg bg-[#0070D7]/10 text-[#0070D7] flex items-center justify-center">
                          <Bot size={20} />
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-900 group-hover:text-[#0070D7] transition-colors">{bot.name}</h4>
                          <p className="text-xs text-slate-500">{bot.description || 'Sin descripción'}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center text-sm font-medium text-[#0070D7]">
                      Gestionar Bot y Fuentes <ArrowRight size={16} className="ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </div>
                  </Link>
                ))}
                {bots?.length === 0 && (
                  <div className="col-span-2 py-12 text-center bg-slate-50 rounded-xl border border-dashed border-slate-300">
                    <p className="text-slate-500 italic">No hay bots creados todavía.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
                <h3 className="font-semibold text-slate-900">Actividad Reciente</h3>
                <Link href="#" className="text-sm text-[#0070D7] font-medium hover:underline">Ver todo</Link>
              </div>
              <div className="divide-y divide-slate-100">
                {recentSources?.map((source: any) => (
                  <div key={source.id} className="px-6 py-4 flex items-center gap-4 hover:bg-slate-50 transition-colors">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${source.status === 'completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
                      {source.type === 'rss' ? <Activity size={18} /> : <FileText size={18} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">{source.title}</p>
                      <p className="text-xs text-slate-500 mt-0.5">Bot: {source.bots?.name || 'Sistema'}</p>
                    </div>
                    <div className="text-xs text-slate-400 whitespace-nowrap">
                      {new Date(source.created_at).toLocaleDateString()}
                    </div>
                  </div>
                ))}
                {(!recentSources || recentSources.length === 0) && (
                  <div className="px-6 py-8 text-center text-slate-500 text-sm">
                    No hay actividad reciente.
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
