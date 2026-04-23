import DealerShowroomClient from './DealerShowroomClient';

export default function DealerShowroomPage({ params }: { params: { id: string } }) {
  return <DealerShowroomClient dealerId={params.id} />;
}
