'use client'

import React, { useEffect, useState } from 'react'
import { Loader2, ShieldCheck, User, Coins, Save } from 'lucide-react'
import { toast } from 'sonner'

type AdminUser = {
  id: string
  name: string | null
  email: string | null
  role: 'USER' | 'ADMIN'
  points: number
  createdAt: string
  orders: {
    id: string
    totalAmount: number
    status: string
  }[]
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [savingId, setSavingId] = useState<string | null>(null)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/users')
      const data = (await res.json()) as AdminUser[]
      setUsers(data)
    } catch {
      toast.error('Failed to load member registry.')
    } finally {
      setLoading(false)
    }
  }

  const updateUser = async (id: string, payload: Partial<Pick<AdminUser, 'role' | 'points'>>) => {
    setSavingId(id)
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...payload }),
      })

      if (!res.ok) {
        throw new Error('Request failed')
      }

      toast.success('Member profile updated.')
      await fetchUsers()
    } catch {
      toast.error('Unable to update this member.')
    } finally {
      setSavingId(null)
    }
  }

  return (
    <div className="pt-32 pb-40 px-6 max-w-7xl mx-auto space-y-12">
      <section className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div className="space-y-2">
          <span className="text-amber-500 font-black uppercase tracking-[0.4em] text-[10px]">Command Center</span>
          <h1 className="text-6xl font-playfair font-black text-white italic uppercase tracking-tight leading-none underline underline-offset-[24px] decoration-white/5">
            Member <span className="text-amber-500">Registry</span>
          </h1>
        </div>
      </section>

      <div className="bg-zinc-950 border border-white/5 rounded-[3rem] overflow-hidden shadow-2xl">
        {loading ? (
          <div className="py-40 flex flex-col items-center gap-6">
            <Loader2 className="w-12 h-12 text-amber-500 animate-spin" />
            <p className="text-white/20 font-black uppercase tracking-[0.4em] text-[10px]">Syncing Members...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5 text-[9px] uppercase tracking-[0.3em] font-black text-white/20">
                  <th className="p-8">Member</th>
                  <th className="p-8">Role</th>
                  <th className="p-8">Points</th>
                  <th className="p-8">Orders</th>
                  <th className="p-8">Joined</th>
                  <th className="p-8 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {users.map((user) => (
                  <tr key={user.id} className="group hover:bg-white/5 transition-colors">
                    <td className="p-8">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60">
                          {user.role === 'ADMIN' ? <ShieldCheck size={18} /> : <User size={18} />}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white uppercase tracking-widest">
                            {user.name || 'Unnamed Member'}
                          </p>
                          <p className="text-[10px] text-white/30 mt-1">{user.email || 'No email'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-8">
                      <select
                        value={user.role}
                        onChange={(e) =>
                          setUsers((current) =>
                            current.map((entry) =>
                              entry.id === user.id
                                ? { ...entry, role: e.target.value as AdminUser['role'] }
                                : entry
                            )
                          )
                        }
                        className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-[10px] font-black uppercase tracking-widest text-white outline-none"
                      >
                        <option value="USER">USER</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                    </td>
                    <td className="p-8">
                      <div className="flex items-center gap-3">
                        <Coins size={16} className="text-amber-500" />
                        <input
                          type="number"
                          min={0}
                          value={user.points}
                          onChange={(e) =>
                            setUsers((current) =>
                              current.map((entry) =>
                                entry.id === user.id
                                  ? { ...entry, points: Number(e.target.value) || 0 }
                                  : entry
                              )
                            )
                          }
                          className="w-24 bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm font-bold text-white outline-none"
                        />
                      </div>
                    </td>
                    <td className="p-8">
                      <span className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest text-white/40">
                        {user.orders.length} orders
                      </span>
                    </td>
                    <td className="p-8 text-xs text-white/40 italic">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-8 text-right">
                      <button
                        onClick={() => updateUser(user.id, { role: user.role, points: user.points })}
                        disabled={savingId === user.id}
                        className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-amber-400 transition-all disabled:opacity-60"
                      >
                        {savingId === user.id ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                        Save
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
