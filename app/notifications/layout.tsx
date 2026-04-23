import Header from '@/components/layout/Header';

export default function NotificationsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">{children}</main>
    </>
  );
}
