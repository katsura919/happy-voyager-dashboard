"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import { RichTextProvider } from "reactjs-tiptap-editor";
import { Document } from "@tiptap/extension-document";
import { Text } from "@tiptap/extension-text";
import { Paragraph } from "@tiptap/extension-paragraph";
import { HardBreak } from "@tiptap/extension-hard-break";
import { TextStyle } from "@tiptap/extension-text-style";
import { ListItem } from "@tiptap/extension-list";
import { Dropcursor, Gapcursor, Placeholder, TrailingNode } from "@tiptap/extensions";

import { Bold, RichTextBold } from "reactjs-tiptap-editor/bold";
import { Italic, RichTextItalic } from "reactjs-tiptap-editor/italic";
import { Strike, RichTextStrike } from "reactjs-tiptap-editor/strike";
import { TextUnderline, RichTextUnderline } from "reactjs-tiptap-editor/textunderline";
import { Heading, RichTextHeading } from "reactjs-tiptap-editor/heading";
import { BulletList, RichTextBulletList } from "reactjs-tiptap-editor/bulletlist";
import { OrderedList, RichTextOrderedList } from "reactjs-tiptap-editor/orderedlist";
import { Blockquote, RichTextBlockquote } from "reactjs-tiptap-editor/blockquote";
import { Link, RichTextLink } from "reactjs-tiptap-editor/link";
import { Image } from "reactjs-tiptap-editor/image";
import { TextAlign, RichTextAlign } from "reactjs-tiptap-editor/textalign";
import { History, RichTextUndo, RichTextRedo } from "reactjs-tiptap-editor/history";
import { HorizontalRule, RichTextHorizontalRule } from "reactjs-tiptap-editor/horizontalrule";
import { Highlight, RichTextHighlight } from "reactjs-tiptap-editor/highlight";
import { Clear, RichTextClear } from "reactjs-tiptap-editor/clear";

import "reactjs-tiptap-editor/style.css";

import { forwardRef, useImperativeHandle } from "react";

export interface BlogEditorHandle {
    getHTML: () => string;
    setContent: (html: string) => void;
}

interface BlogEditorProps {
    onWordCountChange?: (count: number) => void;
    initialContent?: string;
}

export const BlogEditor = forwardRef<BlogEditorHandle, BlogEditorProps>(
    function BlogEditor({ onWordCountChange, initialContent }, ref) {
        const editor = useEditor({
            immediatelyRender: false,
            content: initialContent ?? "",
            extensions: [
                Document,
                Text,
                Dropcursor,
                Gapcursor,
                HardBreak,
                Paragraph,
                TrailingNode,
                ListItem,
                TextStyle,
                Placeholder.configure({ placeholder: "Start writing your blog post..." }),
                Bold,
                Italic,
                Strike,
                TextUnderline,
                Heading.configure({ levels: [1, 2, 3] }),
                BulletList,
                OrderedList,
                Blockquote,
                Link.configure({ openOnClick: false }),
                Image.configure({ resourceImage: "link" }),
                TextAlign.configure({ types: ["heading", "paragraph"] }),
                History,
                HorizontalRule,
                Highlight,
                Clear,
            ],
            onUpdate: ({ editor }) => {
                const count = editor.getText().split(/\s+/).filter(Boolean).length;
                onWordCountChange?.(count);
            },
        });

        // Expose getHTML and setContent to parent via ref
        useImperativeHandle(ref, () => ({
            getHTML: () => editor?.getHTML() ?? "",
            setContent: (html: string) => editor?.commands.setContent(html),
        }));

        if (!editor) return null;

        return (
            <RichTextProvider editor={editor}>
                {/* Toolbar */}
                <div id="blog-editor-toolbar" className="flex items-center gap-1 flex-wrap px-4 py-3 border-b border-border shrink-0">
                    <ToolbarGroup>
                        <RichTextUndo />
                        <RichTextRedo />
                    </ToolbarGroup>
                    <Divider />
                    <ToolbarGroup>
                        <RichTextHeading />
                    </ToolbarGroup>
                    <Divider />
                    <ToolbarGroup>
                        <RichTextBold />
                        <RichTextItalic />
                        <RichTextUnderline />
                        <RichTextStrike />
                        <RichTextHighlight />
                    </ToolbarGroup>
                    <Divider />
                    <ToolbarGroup>
                        <RichTextAlign />
                    </ToolbarGroup>
                    <Divider />
                    <ToolbarGroup>
                        <RichTextBulletList />
                        <RichTextOrderedList />
                    </ToolbarGroup>
                    <Divider />
                    <ToolbarGroup>
                        <RichTextBlockquote />
                        <RichTextLink />
                        <RichTextHorizontalRule />
                    </ToolbarGroup>
                    <Divider />
                    <ToolbarGroup>
                        <RichTextClear />
                    </ToolbarGroup>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    <EditorContent
                        editor={editor}
                        className="prose dark:prose-invert max-w-none min-h-[300px] focus:outline-none [&_.tiptap]:outline-none [&_.tiptap]:min-h-[300px] [&_.tiptap]:bg-transparent [&_.tiptap]:text-foreground [&_.ProseMirror]:bg-transparent [&_.ProseMirror]:text-foreground"
                    />
                </div>
            </RichTextProvider>
        );
    }
);

function ToolbarGroup({ children }: { children: React.ReactNode }) {
    return <div className="flex items-center gap-0.5">{children}</div>;
}

function Divider() {
    return <div className="w-px h-5 bg-border mx-1" />;
}
