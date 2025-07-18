/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse, NextRequest } from 'next/server';
import { db, initFirebase } from '../../../../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Document, Packer, Paragraph } from 'docx';

export async function GET(req: NextRequest, context: any) {
  const { params } = context;
  initFirebase();
  const blocksSnap = await getDocs(collection(db(), 'projects', params.id, 'blocks'));
  const paragraphs: Paragraph[] = [];
  blocksSnap.forEach((d) => {
    const data = d.data();
    paragraphs.push(new Paragraph(data.title));
    paragraphs.push(new Paragraph(data.content || ''));
  });

  const doc = new Document({ sections: [{ properties: {}, children: paragraphs }] });
  const buffer = await Packer.toBuffer(doc);
  return new NextResponse(buffer, {
    status: 200,
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'Content-Disposition': 'attachment; filename="tcc.docx"',
    },
  });
}
