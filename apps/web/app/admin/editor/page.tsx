'use client';

import dynamic from 'next/dynamic';
import { config } from '../../../config/dnd-editor.config';

// We import the editor dynamically to avoid bloating the main app bundle
// ssr: false because the editor depends on window/document for Drag and Drop
const PageEditor = dynamic(
  () => import('@dnd-editor/core/src').then(mod => mod.PageEditor),
  { ssr: false }
);

export default function EditorPage() {
  return (
    <PageEditor
      config={config}
      onSave={(data) => console.log('Save to DB:', data)}
    />
  );
}