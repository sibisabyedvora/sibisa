import { EmbedChatView } from '@/components/widget/embed-chat-view';

interface EmbedPageProps {
  params: Promise<{ publicKey: string }>;
}

export default async function EmbedPage({ params }: EmbedPageProps) {
  const { publicKey } = await params;

  return (
    <div className="h-screen w-screen overflow-hidden bg-transparent font-sans">
      <EmbedChatView publicKey={publicKey} />
    </div>
  );
}
