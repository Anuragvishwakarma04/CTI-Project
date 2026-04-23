import PublicLayout from '@/components/layout/PublicLayout';

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return <PublicLayout>{children}</PublicLayout>;
}
