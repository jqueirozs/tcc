'use client';
import RequireAuth from '../../components/RequireAuth';
import { useAuth } from '../../components/AuthProvider';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Project {
  id: string;
  title: string;
}

export default function Dashboard() {
  return (
    <RequireAuth>
      <DashboardInner />
    </RequireAuth>
  );
}

function DashboardInner() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    if (!user) return;
    async function fetchProjects() {
      const q = query(collection(db(), 'projects'), where('uid', '==', user!.uid));
      const snap = await getDocs(q);
      const data: Project[] = [];
      snap.forEach((docu) => {
        const d = docu.data() as { title: string } | undefined;
        if (d) data.push({ id: docu.id, title: d.title });
      });
      setProjects(data);
    }
    fetchProjects();
  }, [user]);

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Seus TCCs</h1>
      <Link href="/new" className="bg-green-500 text-white px-4 py-2 rounded">Novo TCC</Link>
      <ul className="mt-4 space-y-2">
        {projects.map((p) => (
          <li key={p.id}>
            <Link href={`/project/${p.id}`} className="text-blue-600 underline">
              {p.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
