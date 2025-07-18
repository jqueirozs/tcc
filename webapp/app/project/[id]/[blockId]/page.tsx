'use client';
import RequireAuth from '../../../../components/RequireAuth';
import { useAuth } from '../../../../components/AuthProvider';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../../../lib/firebase';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import dynamic from 'next/dynamic';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

export default function BlockPage() {
  return (
    <RequireAuth>
      <BlockInner />
    </RequireAuth>
  );
}

function BlockInner() {
  useAuth();
  const { id, blockId } = useParams<{ id: string; blockId: string }>();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    async function fetchData() {
      const snap = await getDoc(doc(db(), 'projects', id, 'blocks', blockId));
      const data = snap.data();
      if (data) {
        setTitle(data.title);
        setContent(data.content || '');
      }
    }
    fetchData();
  }, [id, blockId]);

  const handleSave = async () => {
    await updateDoc(doc(db(), 'projects', id, 'blocks', blockId), {
      content,
    });
    alert('Salvo');
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-xl font-bold mb-2">{title}</h1>
      <ReactQuill value={content} onChange={setContent} className="mb-4" />
      <button onClick={handleSave} className="bg-blue-500 text-white px-4 py-2">Salvar</button>
    </div>
  );
}
