'use client';
import RequireAuth from '../../../components/RequireAuth';
import { useAuth } from '../../../components/AuthProvider';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface Block {
  id: string;
  title: string;
}

export default function ProjectPage() {
  return (
    <RequireAuth>
      <ProjectInner />
    </RequireAuth>
  );
}

function ProjectInner() {
  useAuth();
  const { id } = useParams<{ id: string }>();
  const [title, setTitle] = useState('');
  const [blocks, setBlocks] = useState<Block[]>([]);

  useEffect(() => {
    async function fetchData() {
      const snap = await getDoc(doc(db(), 'projects', id));
      const data = snap.data();
      if (data) {
        setTitle(data.title);
      }
      const blockSnap = await getDocs(collection(db(), 'projects', id, 'blocks'));
      const arr: Block[] = [];
      blockSnap.forEach((d) => {
        const data = d.data() as { title: string } | undefined;
        if (data) arr.push({ id: d.id, title: data.title });
      });
      setBlocks(arr);
    }
    fetchData();
  }, [id]);

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">{title}</h1>
      <a href={`/api/export/${id}`} className="underline text-green-600">Exportar DOCX</a>
      <ul className="space-y-2 mt-4">
        {blocks.map((b) => (
          <li key={b.id}>
            <Link href={`/project/${id}/${b.id}`} className="text-blue-600 underline">
              {b.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
