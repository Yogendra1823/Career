import React, { useState, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import Card from '../components/Card';
import { AcademicLevel, LearningStyles, User } from '../types';

const ProfilePage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  
  const [formData, setFormData] = useState<Partial<User>>({
    name: user?.name || '',
    email: user?.email || '',
    avatar: user?.avatar || '',
    academicLevel: user?.academicLevel || AcademicLevel.HIGH_SCHOOL,
    interests: user?.interests || [],
    academicGoals: user?.academicGoals || '',
    learningStyle: user?.learningStyle || 'Visual',
    notificationSettings: user?.notificationSettings || { emailOnNewRecommendation: true, emailOnApplicationDeadline: true },
  });
  const [interestsInput, setInterestsInput] = useState(user?.interests?.join(', ') || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  const handleNotificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, notificationSettings: { ...prev.notificationSettings!, [name]: checked } }));
  }

  const handleInterestsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInterestsInput(e.target.value);
    setFormData({ ...formData, interests: e.target.value.split(',').map(i => i.trim()).filter(Boolean) });
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, avatar: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    updateUser(formData);
    setIsEditing(false);
  };

  if (!user) return <p>Loading profile...</p>;
  
  const renderAvatar = (targetUser: Partial<User>) => (
    targetUser.avatar ? 
        <img src={targetUser.avatar} alt={targetUser.name} className="h-32 w-32 rounded-full object-cover" /> :
        <div className="h-32 w-32 rounded-full bg-gray-200 dark:bg-neutral-600 flex items-center justify-center">
            <span className="text-4xl font-medium text-gray-600 dark:text-gray-300">{targetUser.name?.charAt(0).toUpperCase()}</span>
        </div>
  );

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Your Profile</h1>
          {!isEditing && (
            <button onClick={() => setIsEditing(true)} className="bg-primary text-white font-bold py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors">Edit Profile</button>
          )}
        </div>

        {isEditing ? (
          // EDITING VIEW
          <div>
            <div className="flex items-center space-x-4 mb-6">
              {renderAvatar(formData)}
              <div>
                <button onClick={() => fileInputRef.current?.click()} className="text-sm bg-gray-200 dark:bg-neutral-600 text-gray-800 dark:text-gray-200 font-semibold py-1 px-3 rounded-md hover:bg-gray-300 dark:hover:bg-neutral-500">
                  Change Photo
                </button>
                <input type="file" ref={fileInputRef} onChange={handleAvatarChange} className="hidden" accept="image/*" />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
                <input type="text" name="name" id="name" value={formData.name} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-neutral-500 rounded-md shadow-sm bg-white dark:bg-neutral-800 dark:text-white focus:outline-none focus:ring-primary focus:border-primary"/>
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
                <input type="email" name="email" id="email" value={formData.email} onChange={handleInputChange} disabled className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-neutral-500 rounded-md shadow-sm bg-gray-100 dark:bg-neutral-700 dark:text-gray-400 cursor-not-allowed"/>
              </div>
              <div>
                <label htmlFor="academicLevel" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Academic Level</label>
                <select name="academicLevel" id="academicLevel" value={formData.academicLevel} onChange={handleInputChange} className="mt-1 block w-full pl-3 pr-10 py-2 border border-gray-300 dark:border-neutral-500 bg-white dark:bg-neutral-800 rounded-md focus:outline-none focus:ring-primary focus:border-primary sm:text-sm">
                  {Object.values(AcademicLevel).map(level => <option key={level} value={level}>{level}</option>)}
                </select>
              </div>
               <div>
                <label htmlFor="learningStyle" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Preferred Learning Style</label>
                <select name="learningStyle" id="learningStyle" value={formData.learningStyle} onChange={handleInputChange} className="mt-1 block w-full pl-3 pr-10 py-2 border border-gray-300 dark:border-neutral-500 bg-white dark:bg-neutral-800 rounded-md focus:outline-none focus:ring-primary focus:border-primary sm:text-sm">
                  {LearningStyles.map(style => <option key={style} value={style}>{style}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="academicGoals" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Academic Goals</label>
                <textarea name="academicGoals" id="academicGoals" value={formData.academicGoals} onChange={handleInputChange} rows={3} placeholder="e.g., Achieve a high GPA, get into a top university..." className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-neutral-500 rounded-md shadow-sm bg-white dark:bg-neutral-800 dark:text-white focus:outline-none focus:ring-primary focus:border-primary"/>
              </div>
              <div>
                <label htmlFor="interests" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Interests (comma-separated)</label>
                <input type="text" name="interests" id="interests" value={interestsInput} onChange={handleInterestsChange} placeholder="e.g., Coding, Music, Sports" className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-neutral-500 rounded-md shadow-sm bg-white dark:bg-neutral-800 dark:text-white focus:outline-none focus:ring-primary focus:border-primary"/>
              </div>
              <fieldset>
                <legend className="block text-sm font-medium text-gray-700 dark:text-gray-300">Notification Settings</legend>
                 <div className="mt-2 space-y-2">
                    <div className="flex items-start">
                        <div className="flex items-center h-5">
                            <input id="emailOnNewRecommendation" name="emailOnNewRecommendation" type="checkbox" checked={formData.notificationSettings?.emailOnNewRecommendation} onChange={handleNotificationChange} className="focus:ring-primary h-4 w-4 text-primary border-gray-300 rounded"/>
                        </div>
                        <div className="ml-3 text-sm">
                            <label htmlFor="emailOnNewRecommendation" className="font-medium text-gray-700 dark:text-gray-300">New Recommendations</label>
                            <p className="text-gray-500 dark:text-gray-400">Get emails when new career or college recommendations are available.</p>
                        </div>
                    </div>
                     <div className="flex items-start">
                        <div className="flex items-center h-5">
                            <input id="emailOnApplicationDeadline" name="emailOnApplicationDeadline" type="checkbox" checked={formData.notificationSettings?.emailOnApplicationDeadline} onChange={handleNotificationChange} className="focus:ring-primary h-4 w-4 text-primary border-gray-300 rounded"/>
                        </div>
                        <div className="ml-3 text-sm">
                            <label htmlFor="emailOnApplicationDeadline" className="font-medium text-gray-700 dark:text-gray-300">Application Deadlines</label>
                            <p className="text-gray-500 dark:text-gray-400">Get reminders for upcoming college application deadlines.</p>
                        </div>
                    </div>
                 </div>
              </fieldset>
              <div className="flex justify-end space-x-2 pt-4">
                <button onClick={() => setIsEditing(false)} className="bg-gray-200 dark:bg-neutral-600 text-gray-800 dark:text-gray-200 font-bold py-2 px-4 rounded-md hover:bg-gray-300 dark:hover:bg-neutral-500 transition-colors">Cancel</button>
                <button onClick={handleSave} className="bg-secondary text-white font-bold py-2 px-4 rounded-md hover:bg-emerald-600 transition-colors">Save Changes</button>
              </div>
            </div>
          </div>
        ) : (
           // DISPLAY VIEW
           <div>
             <div className="flex items-center space-x-6 mb-6">
                {renderAvatar(user)}
                <div>
                    <h2 className="text-2xl font-bold">{user.name}</h2>
                    <p className="text-gray-500 dark:text-gray-400">{user.email}</p>
                    <p className="text-sm capitalize mt-1 px-2 py-0.5 inline-block rounded-full bg-primary/20 text-primary">{user.role}</p>
                </div>
             </div>
             <div className="space-y-4">
                <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Academic Level</h3>
                    <p className="text-lg">{user.academicLevel || 'Not set'}</p>
                </div>
                <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Preferred Learning Style</h3>
                    <p className="text-lg">{user.learningStyle || 'Not set'}</p>
                </div>
                <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Academic Goals</h3>
                    <p className="text-lg whitespace-pre-wrap">{user.academicGoals || 'Not set'}</p>
                </div>
                <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Interests</h3>
                    <p className="text-lg">{user.interests && user.interests.length > 0 ? user.interests.join(', ') : 'Not set'}</p>
                </div>
                 <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Notification Settings</h3>
                    <ul className="list-disc list-inside mt-1 text-gray-700 dark:text-gray-300">
                        <li>Email for New Recommendations: <span className="font-semibold">{user.notificationSettings?.emailOnNewRecommendation ? 'On' : 'Off'}</span></li>
                        <li>Email for Application Deadlines: <span className="font-semibold">{user.notificationSettings?.emailOnApplicationDeadline ? 'On' : 'Off'}</span></li>
                    </ul>
                </div>
             </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ProfilePage;