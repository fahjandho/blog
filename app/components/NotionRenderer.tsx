"use client";

import { Fragment } from "react";

type RichTextItem = {
  plain_text: string;
  href?: string | null;
  annotations?: {
    bold?: boolean;
    italic?: boolean;
    strikethrough?: boolean;
    underline?: boolean;
    code?: boolean;
  };
};

type Block = {
  type: string;
  id: string;
  [key: string]: unknown;
};

function renderRichText(richText: RichTextItem[]) {
  return richText.map((item, index) => {
    let content: React.ReactNode = item.plain_text;

    if (item.annotations?.code) {
      content = (
        <code
          key={index}
          className="px-1.5 py-0.5 bg-muted/20 text-fg rounded text-sm font-mono"
        >
          {content}
        </code>
      );
    } else {
      if (item.annotations?.bold) {
        content = <strong key={index}>{content}</strong>;
      }
      if (item.annotations?.italic) {
        content = <em key={index}>{content}</em>;
      }
      if (item.annotations?.strikethrough) {
        content = <s key={index}>{content}</s>;
      }
      if (item.annotations?.underline) {
        content = <u key={index}>{content}</u>;
      }
    }

    if (item.href) {
      content = (
        <a
          key={index}
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:opacity-70"
        >
          {content}
        </a>
      );
    }

    return <Fragment key={index}>{content}</Fragment>;
  });
}

function renderBlock(block: Block): React.ReactNode {
  const type = block.type;
  const id = block.id;
  const data = block[type] as { rich_text?: RichTextItem[]; caption?: RichTextItem[] };

  switch (type) {
    case "paragraph":
      if (!data.rich_text?.length) return <br key={id} />;
      return (
        <p key={id} className="mb-4 leading-relaxed">{renderRichText(data.rich_text)}</p>
      );

    case "heading_1":
      return (
        <h1 key={id} className="text-2xl font-bold mt-8 mb-4">
          {renderRichText(data.rich_text || [])}
        </h1>
      );

    case "heading_2":
      return (
        <h2 key={id} className="text-xl font-bold mt-6 mb-3">
          {renderRichText(data.rich_text || [])}
        </h2>
      );

    case "heading_3":
      return (
        <h3 key={id} className="text-lg font-semibold mt-4 mb-2">
          {renderRichText(data.rich_text || [])}
        </h3>
      );

    case "bulleted_list_item":
      return (
        <li key={id} className="ml-4 mb-1">{renderRichText(data.rich_text || [])}</li>
      );

    case "numbered_list_item":
      return (
        <li key={id} className="ml-4 mb-1 list-decimal">
          {renderRichText(data.rich_text || [])}
        </li>
      );

    case "to_do":
      const todoData = data as { rich_text?: RichTextItem[]; checked?: boolean };
      return (
        <div key={id} className="flex items-start gap-2 mb-1">
          <input
            type="checkbox"
            checked={todoData.checked || false}
            readOnly
            className="mt-1 accent-fg"
          />
          <span className={todoData.checked ? "line-through opacity-60" : ""}>
            {renderRichText(todoData.rich_text || [])}
          </span>
        </div>
      );

    case "toggle":
      const toggleData = data as { rich_text?: RichTextItem[] };
      return (
        <details key={id} className="mb-2 border border-border rounded p-2">
          <summary className="cursor-pointer font-medium">
            {renderRichText(toggleData.rich_text || [])}
          </summary>
        </details>
      );

    case "code":
      const codeData = data as { rich_text?: RichTextItem[]; language?: string };
      const code = codeData.rich_text?.map((t) => t.plain_text).join("") || "";
      return (
        <pre key={id} className="bg-muted/10 border border-border rounded p-4 overflow-x-auto mb-4 font-mono text-sm">
          <code>{code}</code>
        </pre>
      );

    case "quote":
      return (
        <blockquote key={id} className="border-l-2 border-muted pl-4 italic text-muted mb-4">
          {renderRichText(data.rich_text || [])}
        </blockquote>
      );

    case "callout":
      const calloutData = data as {
        rich_text?: RichTextItem[];
        icon?: { type: string; emoji?: string };
      };
      return (
        <div key={id} className="flex items-start gap-3 bg-muted/10 border border-border rounded p-4 mb-4">
          {calloutData.icon?.emoji && (
            <span className="text-lg">{calloutData.icon.emoji}</span>
          )}
          <div>{renderRichText(calloutData.rich_text || [])}</div>
        </div>
      );

    case "divider":
      return <hr key={id} className="border-border my-8" />;

    case "image":
      const imageData = data as {
        type: string;
        file?: { url: string };
        external?: { url: string };
        caption?: RichTextItem[];
      };
      const imageUrl = imageData.file?.url || imageData.external?.url;
      if (!imageUrl) return null;
      return (
        <figure key={id} className="my-6">
          <img
            src={imageUrl}
            alt={imageData.caption?.map((c) => c.plain_text).join("") || ""}
            className="w-full rounded border border-border"
          />
          {imageData.caption && imageData.caption.length > 0 && (
            <figcaption className="text-center text-xs text-muted mt-2">
              {renderRichText(imageData.caption)}
            </figcaption>
          )}
        </figure>
      );

    case "video":
      const videoData = data as {
        type: string;
        external?: { url: string };
        file?: { url: string };
      };
      const videoUrl = videoData.external?.url || videoData.file?.url;
      if (!videoUrl) return null;
      return (
        <div key={id} className="my-6 aspect-video">
          <iframe
            src={videoUrl}
            className="w-full h-full rounded border border-border"
            allowFullScreen
          />
        </div>
      );

    case "bookmark": {
      const bookmarkData = data as { url: string; caption?: RichTextItem[] };
      const caption = bookmarkData.caption || [];
      return (
        <a
          key={id}
          href={bookmarkData.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block border border-border rounded p-3 mb-4 hover:bg-muted/5 transition-colors"
        >
          <p className="text-sm font-medium truncate">{bookmarkData.url}</p>
          {caption.length > 0 && (
            <p className="text-xs text-muted mt-1">
              {renderRichText(caption)}
            </p>
          )}
        </a>
      );
    }

    case "table_of_contents":
      return null;

    case "column_list":
    case "column":
      return null;

    default:
      return null;
  }
}

function groupListItems(blocks: Block[]): React.ReactNode[] {
  const result: React.ReactNode[] = [];
  let bulletList: React.ReactNode[] = [];
  let numberedList: React.ReactNode[] = [];

  const flushBulletList = () => {
    if (bulletList.length > 0) {
      result.push(<ul key={`ul-${result.length}`} className="mb-4">{bulletList}</ul>);
      bulletList = [];
    }
  };

  const flushNumberedList = () => {
    if (numberedList.length > 0) {
      result.push(<ol key={`ol-${result.length}`} className="mb-4">{numberedList}</ol>);
      numberedList = [];
    }
  };

  for (const block of blocks) {
    if (block.type === "bulleted_list_item") {
      flushNumberedList();
      bulletList.push(renderBlock(block));
    } else if (block.type === "numbered_list_item") {
      flushBulletList();
      numberedList.push(renderBlock(block));
    } else {
      flushBulletList();
      flushNumberedList();
      const rendered = renderBlock(block);
      if (rendered) {
        result.push(rendered);
      }
    }
  }

  flushBulletList();
  flushNumberedList();

  return result;
}

interface NotionRendererProps {
  blocks: Block[];
}

export function NotionRenderer({ blocks }: NotionRendererProps) {
  return <>{groupListItems(blocks)}</>;
}
