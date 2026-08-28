interface ApplicationItem {
  id: string;
  status: string;
  applied_at: string;
  casting_calls: {
    title: string;
    category?: string;
    location?: string;
    budget?: number;
  } | null;
}

interface AppliedCastingsProps {
  applications: ApplicationItem[];
}

export function AppliedCastingsList({ applications = [] }: AppliedCastingsProps) {
  return (
    <div className="border p-4 rounded space-y-4">
      <h2 className="text-xl font-bold">Applied Casting Calls</h2>

      {applications.length === 0 ? (
        <p className="text-sm text-gray-500">You haven't applied to any casting calls yet.</p>
      ) : (
        <div className="space-y-3">
          {applications.map((app) => (
            <div key={app.id} className="border p-3 rounded flex justify-between items-center text-sm">
              <div>
                <p className="font-semibold">{app.casting_calls?.title || 'Casting Call'}</p>
                <p className="text-xs text-gray-600">
                  Category: {app.casting_calls?.category || 'General'} | Location: {app.casting_calls?.location || 'Remote'}
                </p>
                <p className="text-[11px] text-gray-400">
                  Applied on: {new Date(app.applied_at).toLocaleDateString()}
                </p>
              </div>

              <span className="px-2 py-1 text-xs font-bold uppercase border rounded capitalize">
                {app.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
