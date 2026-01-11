interface UserMetaCardProps {
  profile: any;
  loading: boolean;
  onRefresh?: () => void;
}

export default function UserMetaCard({ profile, loading, onRefresh }: UserMetaCardProps) {
  console.log("UserMetaCard - Profile:", profile);
  console.log("UserMetaCard - fname:", profile?.fname, "lname:", profile?.lname);
  console.log("UserMetaCard - profilePicture:", profile?.profilePicture);

  const getImageUrl = (path: string) => {
    if (!path) return null;
    if (path?.startsWith("http")) return path;
    // Remove /api from the URL for uploads (uploads are served at root level)
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
    const baseUrl = apiUrl.replace(/\/api$/, '');
    const fullUrl = `${baseUrl}${path}`;
    console.log("Image URL constructed:", fullUrl);
    return fullUrl;
  };
  
  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
            <div className="w-20 h-20 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              {loading ? (
                <div className="animate-pulse text-gray-400">...</div>
              ) : profile?.profilePicture && getImageUrl(profile.profilePicture) ? (
                <>
                  <img
                    src={getImageUrl(profile.profilePicture)}
                    alt={`${profile?.fname} ${profile?.lname}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.error("Image failed to load:", getImageUrl(profile.profilePicture));
                      e.currentTarget.style.display = 'none';
                      const parent = e.currentTarget.parentElement;
                      if (parent) {
                        const initials = document.createElement('span');
                        initials.className = 'text-2xl font-bold text-gray-600 dark:text-gray-300';
                        initials.textContent = `${profile?.fname?.[0] || ''}${profile?.lname?.[0] || ''}`;
                        parent.appendChild(initials);
                      }
                    }}
                  />
                </>
              ) : (
                <span className="text-2xl font-bold text-gray-600 dark:text-gray-300">
                  {profile?.fname?.[0]}{profile?.lname?.[0]}
                </span>
              )}
            </div>
            <div className="order-3 xl:order-2">
              <h4 className="mb-2 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left">
                {loading ? 'Loading...' : `${profile?.fname || ''} ${profile?.lname || ''}`}
              </h4>
              <div className="flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {profile?.role || 'Admin'}
                </p>
                {profile?.address && (
                  <>
                    <div className="hidden h-3.5 w-px bg-gray-300 dark:bg-gray-700 xl:block"></div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {profile.address}
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}
