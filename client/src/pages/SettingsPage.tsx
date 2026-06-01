import { useEffect, useState, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { getErrorMessage } from '../shared/api/client';
import { updateProfile } from '../features/users/api';
import { useAuth } from '../context/AuthContext';
import { PageHeader } from '../components/layout/AppLayout';
import { Avatar } from '../components/ui/Avatar';

export function SettingsPage() {
  const { user, refreshUser } = useAuth();
  const [displayName, setDisplayName] = useState(user?.displayName ?? '');
  const [bio, setBio] = useState(user?.bio ?? '');
  const [profilePhoto, setProfilePhoto] = useState(user?.profilePhoto ?? '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName);
      setBio(user.bio ?? '');
      setProfilePhoto(user.profilePhoto ?? '');
    }
  }, [user]);

  if (!user) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);
    try {
      await updateProfile({
        displayName,
        bio: bio || undefined,
        profilePhoto: profilePhoto || undefined,
      });
      await refreshUser();
      setSuccess(true);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageHeader title="Modifier le profil" />
      <form onSubmit={handleSubmit} className="space-y-6 px-4 py-6">
        <div className="flex justify-center py-4">
          <Avatar
            user={{ displayName, profilePhoto: profilePhoto || null }}
            size="xl"
            ring
          />
        </div>

        <div className="space-y-1">
          <label className="text-[13px] text-x-gray">Nom affiché</label>
          <input
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            maxLength={50}
            required
            className="x-input-auth"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[13px] text-x-gray">Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value.slice(0, 160))}
            rows={3}
            className="x-input-auth resize-none"
            placeholder="Parlez de vous..."
          />
          <p className="text-right text-[13px] text-x-gray">{bio.length}/160</p>
        </div>

        <div className="space-y-1">
          <label className="text-[13px] text-x-gray">URL photo de profil</label>
          <input
            type="url"
            value={profilePhoto}
            onChange={(e) => setProfilePhoto(e.target.value)}
            placeholder="https://..."
            className="x-input-auth"
          />
        </div>

        {error && <p className="text-[13px] text-x-pink">{error}</p>}
        {success && <p className="text-[13px] text-x-green">Profil mis à jour !</p>}

        <button
          type="submit"
          disabled={loading}
          className="x-btn-post w-full py-3 disabled:opacity-50"
        >
          {loading ? 'Enregistrement...' : 'Enregistrer'}
        </button>

        <Link
          to={`/user/${user.id}`}
          className="block text-center text-[15px] text-x-blue hover:underline"
        >
          Voir mon profil
        </Link>
      </form>
    </>
  );
}
