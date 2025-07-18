'use client';
import RequireAuth from '../../components/RequireAuth';
import { useAuth } from '../../components/AuthProvider';
import { collection, addDoc, doc, setDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewProject() {
  return (
    <RequireAuth>
      <NewProjectInner />
    </RequireAuth>
  );
}

function NewProjectInner() {
  const { user } = useAuth();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [theme, setTheme] = useState('');
  const [problem, setProblem] = useState('');
  const [goal, setGoal] = useState('');
  const [specific, setSpecific] = useState('');
  const [justification, setJustification] = useState('');
  const [methodology, setMethodology] = useState('');

  const handleCreate = async () => {
    if (!user) return;
    const projectRef = await addDoc(collection(db(), 'projects'), {
      uid: user.uid,
      title,
      theme,
      problem,
      goal,
      specific,
      justification,
      methodology,
    });

    const res = await fetch('/api/generate-structure', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, theme, problem, goal, specific, justification, methodology }),
    });
    const data = await res.json();
    if (data.chapters) {
      for (const ch of data.chapters) {
        const blockDoc = doc(collection(db(), 'projects', projectRef.id, 'blocks'));
        await setDoc(blockDoc, { title: ch.title });
        if (ch.subchapters) {
          for (const sub of ch.subchapters) {
            const subDoc = doc(collection(db(), 'projects', projectRef.id, 'blocks'));
            await setDoc(subDoc, { title: sub });
          }
        }
      }
    }

    router.push(`/project/${projectRef.id}`);
  };

  return (
    <div className="p-4 max-w-xl mx-auto space-y-2">
      <h1 className="text-2xl font-bold mb-2">Novo TCC</h1>
      <input className="border p-2 w-full" placeholder="Título" value={title} onChange={(e) => setTitle(e.target.value)} />
      <input className="border p-2 w-full" placeholder="Tema" value={theme} onChange={(e) => setTheme(e.target.value)} />
      <input className="border p-2 w-full" placeholder="Problema" value={problem} onChange={(e) => setProblem(e.target.value)} />
      <input className="border p-2 w-full" placeholder="Objetivo geral" value={goal} onChange={(e) => setGoal(e.target.value)} />
      <textarea className="border p-2 w-full" placeholder="Objetivos específicos" value={specific} onChange={(e) => setSpecific(e.target.value)} />
      <textarea className="border p-2 w-full" placeholder="Justificativa" value={justification} onChange={(e) => setJustification(e.target.value)} />
      <textarea className="border p-2 w-full" placeholder="Metodologia" value={methodology} onChange={(e) => setMethodology(e.target.value)} />
      <button onClick={handleCreate} className="bg-green-500 text-white p-2 w-full">Gerar estrutura com IA</button>
    </div>
  );
}
