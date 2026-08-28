import { SignOutButton } from '@/components/sign-out-button';

export default function PendingApprovalPage({
  searchParams,
}: {
  searchParams?: Promise<{ registered?: string }>;
}) {
  return (
    <main className="p-8 max-w-lg mx-auto text-center space-y-4">
      <h1 className="text-2xl font-bold">Account Pending Approval</h1>
      <p className="text-gray-600">
        Your account registration has been received and is currently undergoing review by an agency administrator.
      </p>
      <p className="text-sm text-gray-500">
        You will receive full access to your portal dashboard once your profile status is updated to approved.
      </p>
      <div className="pt-4">
        <SignOutButton />
      </div>
    </main>
  );
}
