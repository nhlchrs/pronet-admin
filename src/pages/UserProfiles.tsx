import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { getApiUrl } from "../config/api";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import UserMetaCard from "../components/UserProfile/UserMetaCard";
import UserInfoCard from "../components/UserProfile/UserInfoCard";
import UserAddressCard from "../components/UserProfile/UserAddressCard";
import PageMeta from "../components/common/PageMeta";

export default function UserProfiles() {
  const { token } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await axios.get(getApiUrl('/user/profile'), {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log("Full API Response:", response.data);
      console.log("Profile Data:", response.data.data);
      setProfile(response.data.data);
    } catch (error: any) {
      console.error("Failed to fetch profile:", error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <>
      <PageMeta
        title="Profile - ProNext Admin Panel"
        description="Manage your admin profile and account settings"
      />
      <PageBreadcrumb pageTitle="Profile" />
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
          Profile
        </h3>
        <div className="space-y-6">
          <UserMetaCard profile={profile} loading={loading} onRefresh={fetchProfile} />
          <UserInfoCard profile={profile} loading={loading} onRefresh={fetchProfile} />
          <UserAddressCard profile={profile} loading={loading} />
        </div>
      </div>
    </>
  );
}
