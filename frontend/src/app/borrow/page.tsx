import { BorrowForm } from '@/components/borrow-form';

export default function BorrowPage() {
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold">Borrow against reputation</h2>
      <p className="text-slate-300">Your max borrow amount is calculated from your StarkCredit score.</p>
      <BorrowForm />
    </section>
  );
}
