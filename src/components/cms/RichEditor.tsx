import { useState } from 'react';
import { EditorContent, useEditor, type Editor } from '@tiptap/react';
import Document from '@tiptap/extension-document';
import StarterKit from '@tiptap/starter-kit';
import { useTranslation } from 'react-i18next';
import { cn } from '@/src/lib/utils.ts';
import { RICH_STYLES } from './RichHtml.tsx';

export type RichMode = 'inline' | 'block';

interface RichEditorProps {
  initialHtml: string;
  mode: RichMode;
  onChange: (html: string) => void;
}

const link = { openOnClick: false, autolink: false, HTMLAttributes: { target: '_blank' } };

// Inline: um único parágrafo (o site já o envolve num <p>). Bloco: títulos, listas e parágrafos.
const extensionsFor = (mode: RichMode) =>
  mode === 'inline'
    ? [
        StarterKit.configure({
          document: false, heading: false, bulletList: false, orderedList: false, listItem: false,
          listKeymap: false, blockquote: false, codeBlock: false, code: false, horizontalRule: false,
          strike: false, link,
        }),
        Document.extend({ content: 'paragraph' }),
      ]
    : [
        StarterKit.configure({
          heading: { levels: [2, 3] }, blockquote: false, codeBlock: false, code: false,
          horizontalRule: false, strike: false, link,
        }),
      ];

const toStored = (html: string, mode: RichMode) =>
  mode === 'inline' ? html.replace(/^<p>([\s\S]*)<\/p>$/, '$1') : html;

interface ToolButtonProps {
  label: string;
  active?: boolean;
  onClick: () => void;
  children: string;
}

const ToolButton = ({ label, active = false, onClick, children }: ToolButtonProps) => (
  <button
    type="button"
    aria-label={label}
    title={label}
    aria-pressed={active}
    onMouseDown={(event) => event.preventDefault()}
    onClick={onClick}
    className={cn(
      'min-w-9 h-9 px-2 rounded-control border text-sm',
      active ? 'bg-primary-dark text-on-primary border-primary-dark' : 'bg-surface text-foreground border-line',
    )}
  >
    {children}
  </button>
);

function LinkField({ editor, onClose }: { editor: Editor; onClose: () => void }) {
  const { t } = useTranslation();
  const [url, setUrl] = useState<string>((editor.getAttributes('link').href as string | undefined) ?? '');
  const apply = () => {
    if (url.trim()) editor.chain().focus().extendMarkRange('link').setLink({ href: url.trim() }).run();
    else editor.chain().focus().extendMarkRange('link').unsetLink().run();
    onClose();
  };
  return (
    <div className="flex gap-2 w-full">
      <input
        type="url"
        value={url}
        autoFocus
        aria-label={t('admin.editor.linkUrl')}
        placeholder="https://"
        onChange={(event) => setUrl(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            event.preventDefault();
            apply();
          }
        }}
        className="flex-1 px-3 py-2 input bg-surface"
      />
      <button type="button" onClick={apply} className="px-4 rounded-control bg-primary-dark text-on-primary">
        {t('admin.editor.linkApply')}
      </button>
    </div>
  );
}

export default function RichEditor({ initialHtml, mode, onChange }: RichEditorProps) {
  const { t } = useTranslation();
  const [linkOpen, setLinkOpen] = useState(false);
  const editor = useEditor({
    extensions: extensionsFor(mode),
    content: mode === 'inline' ? `<p>${initialHtml}</p>` : initialHtml,
    onUpdate: ({ editor: current }) => onChange(toStored(current.getHTML(), mode)),
    editorProps: { attributes: { 'aria-label': t('admin.editor.content'), role: 'textbox', 'aria-multiline': 'true' } },
  });
  if (!editor) return null;

  return (
    <div className="border border-line rounded-control">
      <div className="flex flex-wrap gap-2 p-2 border-b border-line bg-muted" role="toolbar" aria-label={t('admin.editor.toolbar')}>
        <ToolButton label={t('admin.editor.bold')} active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()}>B</ToolButton>
        <ToolButton label={t('admin.editor.italic')} active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()}>I</ToolButton>
        <ToolButton label={t('admin.editor.underline')} active={editor.isActive('underline')} onClick={() => editor.chain().focus().toggleUnderline().run()}>U</ToolButton>
        {mode === 'block' && (
          <>
            <ToolButton label={t('admin.editor.h2')} active={editor.isActive('heading', { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>H2</ToolButton>
            <ToolButton label={t('admin.editor.h3')} active={editor.isActive('heading', { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>H3</ToolButton>
            <ToolButton label={t('admin.editor.bulletList')} active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()}>•</ToolButton>
            <ToolButton label={t('admin.editor.orderedList')} active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()}>1.</ToolButton>
          </>
        )}
        <ToolButton label={t('admin.editor.link')} active={editor.isActive('link')} onClick={() => setLinkOpen((open) => !open)}>🔗</ToolButton>
        {linkOpen && <LinkField editor={editor} onClose={() => setLinkOpen(false)} />}
      </div>
      <EditorContent
        editor={editor}
        className={cn('p-3 text-text-light leading-relaxed [&_.ProseMirror]:min-h-32 [&_.ProseMirror]:outline-none', RICH_STYLES)}
      />
    </div>
  );
}
