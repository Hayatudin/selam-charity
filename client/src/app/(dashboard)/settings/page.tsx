'use client';

import React, { useState, useEffect } from 'react';
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Globe, 
  Lock,
  Save,
  CheckCircle2,
  Building2,
  Shield,
  Loader2
} from 'lucide-react';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { api } from '@/lib/api';
import { useSession, authClient } from '@/lib/auth-client';
import { useLanguage } from '@/context/LanguageContext';

// Helper component for Toggle Switch
function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
        checked ? "bg-primary" : "bg-gray-200"
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
          checked ? "translate-x-5 rtl:-translate-x-5" : "translate-x-0"
        )}
      />
    </button>
  );
}

const getDisplayRole = (role: string) => {
  if (role === 'super_admin') return 'Super Admin';
  if (role === 'admin' || role === 'charity_admin') return 'Admin';
  return 'User';
};

export default function SettingsPage() {
  const { t, language, setLanguage } = useLanguage();
  const { data: session, isPending } = useSession();
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'preferences' | 'organization'>('profile');
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form states
  const [profile, setProfile] = useState({ name: '', email: '', role: '' });
  const [passwordForm, setPasswordForm] = useState({ current: '', new: '', confirm: '' });
  
  // Charity Notifications
  const [notifications, setNotifications] = useState({
    donationAlerts: true,
    donorInquiries: true,
    programUpdates: true,
    systemUpdates: true,
  });

  // System Preferences
  const [preferences, setPreferences] = useState<{
    language: 'En' | 'Ar';
    timezone: string;
    dateFormat: string;
    currency: string;
  }>({
    language: language === 'Ar' ? 'Ar' : 'En',
    timezone: 'Africa/Addis_Ababa',
    dateFormat: 'YYYY-MM-DD',
    currency: 'USD',
  });

  // Organization Info
  const [orgInfo, setOrgInfo] = useState({
    name: 'Selam Charity and Development Association',
    email: 'info@selamcharity.org',
    phone: '0911624839 / 0944222924',
    address: 'Addis Ababa, Ethiopia',
    tagline: 'Empowering communities through education and humanitarian support.',
  });

  // Load saved local preferences
  useEffect(() => {
    try {
      const savedNotifs = localStorage.getItem('selam_notifications');
      if (savedNotifs) setNotifications(JSON.parse(savedNotifs));
      
      const savedPrefs = localStorage.getItem('selam_preferences');
      if (savedPrefs) {
        const parsed = JSON.parse(savedPrefs);
        setPreferences(prev => ({ ...prev, ...parsed, language: language || parsed.language || 'En' }));
      }

      const savedOrg = localStorage.getItem('selam_org_info');
      if (savedOrg) setOrgInfo(JSON.parse(savedOrg));
    } catch (_) {}
  }, [language]);

  // Load profile from session
  useEffect(() => {
    if (session?.user) {
      setProfile({
        name: session.user.name || '',
        email: session.user.email || '',
        role: (session.user as any).role || 'user'
      });
    }
  }, [session]);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      const res = await api('/api/account/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: profile.name }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update profile');
      showToast(t('Profile updated successfully', 'Profile updated successfully'));
    } catch (err: any) {
      showToast(err.message || 'Failed to update profile', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (!passwordForm.current || !passwordForm.new || !passwordForm.confirm) {
      showToast(t('Please fill all password fields', 'Please fill all password fields'), 'error');
      return;
    }
    if (passwordForm.new !== passwordForm.confirm) {
      showToast(t('Passwords do not match', 'Passwords do not match'), 'error');
      return;
    }
    setIsSaving(true);
    try {
      const { error } = await authClient.changePassword({
        currentPassword: passwordForm.current,
        newPassword: passwordForm.new,
        revokeOtherSessions: true,
      });

      if (error) throw new Error(error.message || 'Failed to update password');
      
      showToast(t('Password changed successfully', 'Password changed successfully'));
      setPasswordForm({ current: '', new: '', confirm: '' });
    } catch (err: any) {
      showToast(err.message || 'Failed to change password', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveNotifications = () => {
    setIsSaving(true);
    try {
      localStorage.setItem('selam_notifications', JSON.stringify(notifications));
      showToast(t('Notification preferences saved', 'Notification preferences saved'));
    } catch {
      showToast(t('Failed to save notification preferences', 'Failed to save notification preferences'), 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSavePreferences = () => {
    setIsSaving(true);
    try {
      localStorage.setItem('selam_preferences', JSON.stringify(preferences));
      if (preferences.language === 'En' || preferences.language === 'Ar') {
        setLanguage(preferences.language);
      }
      showToast(t('System preferences saved', 'System preferences saved'));
    } catch {
      showToast(t('Failed to save preferences', 'Failed to save preferences'), 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveOrganization = () => {
    setIsSaving(true);
    try {
      localStorage.setItem('selam_org_info', JSON.stringify(orgInfo));
      showToast(t('Organization information updated', 'Organization information updated'));
    } catch {
      showToast(t('Failed to save organization info', 'Failed to save organization info'), 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const getSaveHandler = () => {
    if (activeTab === 'profile') return handleSaveProfile;
    if (activeTab === 'notifications') return handleSaveNotifications;
    if (activeTab === 'preferences') return handleSavePreferences;
    if (activeTab === 'organization') return handleSaveOrganization;
    return () => showToast(t('Settings saved', 'Settings saved'));
  };

  const tabs = [
    { id: 'profile', label: t('Profile Settings'), icon: User },
    { id: 'notifications', label: t('Notifications'), icon: Bell },
    { id: 'preferences', label: t('System Preferences'), icon: Globe },
    { id: 'organization', label: t('Organization Info', 'Organization Info'), icon: Building2 },
  ];

  const roleDisplay = getDisplayRole(profile.role);

  return (
    <div className="space-y-6 animate-fade-in pb-10 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary-50">
              <SettingsIcon size={22} className="text-primary" />
            </div>
            {t('System Settings')}
          </h1>
          <p className="text-text-secondary mt-1 ml-12 rtl:ml-0 rtl:mr-12">
            {t('Manage your account, preferences, and organization settings', 'Manage your account, preferences, and organization settings')}
          </p>
        </div>

        <Button 
          onClick={getSaveHandler()} 
          disabled={isSaving || isPending}
          icon={isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
        >
          {isSaving ? t('Saving...', 'Saving...') : t('Save Changes', 'Save Changes')}
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 mt-8">
        {/* Sidebar Tabs */}
        <div className="w-full lg:w-64 shrink-0 space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200",
                  isActive 
                    ? "bg-primary text-white shadow-md shadow-primary/20" 
                    : "text-text-secondary hover:bg-surface border border-transparent hover:border-border hover:shadow-sm"
                )}
              >
                <Icon size={18} className={isActive ? "text-white" : "text-text-tertiary"} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-surface border border-border shadow-sm rounded-2xl p-6 lg:p-8 min-h-[500px]">
          
          {/* Profile Settings */}
          {activeTab === 'profile' && (
            <div className="space-y-8 animate-fade-in">
              <div>
                <h2 className="text-lg font-bold text-text-primary mb-1">{t('Profile Details')}</h2>
                <p className="text-sm text-text-secondary mb-6">{t('Update your personal account information.')}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input 
                    label={t('Full Name')} 
                    value={profile.name} 
                    onChange={(e) => setProfile({...profile, name: e.target.value})} 
                  />
                  <Input 
                    label={t('Email Address')} 
                    type="email" 
                    value={profile.email} 
                    disabled 
                  />
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-text-secondary">{t('System Role', 'System Role')}</label>
                    <div className="flex items-center gap-2 h-11 px-4 rounded-lg border border-border bg-gray-50/70 text-text-primary">
                      <Shield size={16} className="text-primary" />
                      <span className="font-semibold text-sm">{t(roleDisplay, roleDisplay)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-border">
                <h2 className="text-lg font-bold text-text-primary mb-1 flex items-center gap-2">
                  <Lock size={18} className="text-primary" /> {t('Security')}
                </h2>
                <p className="text-sm text-text-secondary mb-6">{t('Update your password to keep your account secure.')}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                  <Input 
                    label={t('Current Password')} 
                    type="password" 
                    placeholder="••••••••" 
                    value={passwordForm.current}
                    onChange={(e) => setPasswordForm({...passwordForm, current: e.target.value})}
                  />
                  <div className="hidden md:block"></div> {/* Spacer */}
                  <Input 
                    label={t('New Password')} 
                    type="password" 
                    placeholder="••••••••" 
                    value={passwordForm.new}
                    onChange={(e) => setPasswordForm({...passwordForm, new: e.target.value})}
                  />
                  <Input 
                    label={t('Confirm New Password')} 
                    type="password" 
                    placeholder="••••••••" 
                    value={passwordForm.confirm}
                    onChange={(e) => setPasswordForm({...passwordForm, confirm: e.target.value})}
                  />
                </div>
                <Button 
                  variant="outline" 
                  onClick={handleUpdatePassword} 
                  disabled={isSaving}
                >
                  {isSaving ? t('Updating...', 'Updating...') : t('Update Password')}
                </Button>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="space-y-8 animate-fade-in">
              <div>
                <h2 className="text-lg font-bold text-text-primary mb-1">{t('Alert Preferences', 'Alert Preferences')}</h2>
                <p className="text-sm text-text-secondary mb-6">{t('Choose what events you want to be notified about.', 'Choose what events you want to be notified about.')}</p>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-border rounded-xl bg-gray-50/50 hover:bg-gray-50 transition-colors">
                    <div>
                      <p className="font-semibold text-text-primary">{t('Donation Alerts', 'Donation Alerts')}</p>
                      <p className="text-sm text-text-tertiary">
                        {t('Get notified immediately when a new donation is received online or registered.', 'Get notified immediately when a new donation is received online or registered.')}
                      </p>
                    </div>
                    <Toggle 
                      checked={notifications.donationAlerts} 
                      onChange={(v) => setNotifications({...notifications, donationAlerts: v})} 
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border border-border rounded-xl bg-gray-50/50 hover:bg-gray-50 transition-colors">
                    <div>
                      <p className="font-semibold text-text-primary">{t('Contact & Donor Inquiries', 'Contact & Donor Inquiries')}</p>
                      <p className="text-sm text-text-tertiary">
                        {t('Receive alerts when donors, partners, or volunteers submit public contact forms.', 'Receive alerts when donors, partners, or volunteers submit public contact forms.')}
                      </p>
                    </div>
                    <Toggle 
                      checked={notifications.donorInquiries} 
                      onChange={(v) => setNotifications({...notifications, donorInquiries: v})} 
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border border-border rounded-xl bg-gray-50/50 hover:bg-gray-50 transition-colors">
                    <div>
                      <p className="font-semibold text-text-primary">{t('School & Program Updates', 'School & Program Updates')}</p>
                      <p className="text-sm text-text-tertiary">
                        {t('Get notified about school enrollment requests and student sponsorships.', 'Get notified about school enrollment requests and student sponsorships.')}
                      </p>
                    </div>
                    <Toggle 
                      checked={notifications.programUpdates} 
                      onChange={(v) => setNotifications({...notifications, programUpdates: v})} 
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border border-border rounded-xl bg-gray-50/50 hover:bg-gray-50 transition-colors">
                    <div>
                      <p className="font-semibold text-text-primary">{t('System Updates & Announcements', 'System Updates & Announcements')}</p>
                      <p className="text-sm text-text-secondary">{t('Important platform news, maintenance notices, and security alerts.', 'Important platform news, maintenance notices, and security alerts.')}</p>
                    </div>
                    <Toggle 
                      checked={notifications.systemUpdates} 
                      onChange={(v) => setNotifications({...notifications, systemUpdates: v})} 
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* System Preferences Tab */}
          {activeTab === 'preferences' && (
            <div className="space-y-8 animate-fade-in">
              <div>
                <h2 className="text-lg font-bold text-text-primary mb-1">{t('System Preferences')}</h2>
                <p className="text-sm text-text-secondary mb-6">{t('Customize your dashboard experience.')}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
                  <Select 
                    label={t('Language')} 
                    value={preferences.language} 
                    onChange={(val) => {
                      const lang = val === 'Ar' ? 'Ar' : 'En';
                      setPreferences({...preferences, language: lang});
                      setLanguage(lang);
                    }}
                    options={[
                      { value: 'En', label: 'English' },
                      { value: 'Ar', label: 'العربية (Arabic)' },
                    ]}
                  />
                  <Select 
                    label={t('Timezone')} 
                    value={preferences.timezone} 
                    onChange={(val) => setPreferences({...preferences, timezone: val})}
                    options={[
                      { value: 'Africa/Addis_Ababa', label: 'Africa/Addis Ababa (EAT)' },
                      { value: 'Asia/Riyadh', label: 'Asia/Riyadh (AST)' },
                      { value: 'UTC', label: 'Coordinated Universal Time (UTC)' },
                      { value: 'Europe/London', label: 'Europe/London (GMT)' },
                    ]}
                  />
                  <Select 
                    label={t('Date Format')} 
                    value={preferences.dateFormat} 
                    onChange={(val) => setPreferences({...preferences, dateFormat: val})}
                    options={[
                      { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD (e.g. 2026-09-28)' },
                      { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY (e.g. 28/09/2026)' },
                      { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY (e.g. 09/28/2026)' },
                    ]}
                  />
                  <Select 
                    label={t('Default Currency', 'Default Currency')} 
                    value={preferences.currency} 
                    onChange={(val) => setPreferences({...preferences, currency: val})}
                    options={[
                      { value: 'USD', label: 'USD ($) - US Dollar' },
                      { value: 'ETB', label: 'ETB (Br) - Ethiopian Birr' },
                      { value: 'EUR', label: 'EUR (€) - Euro' },
                      { value: 'SAR', label: 'SAR (﷼) - Saudi Riyal' },
                      { value: 'GBP', label: 'GBP (£) - British Pound' },
                    ]}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Organization Info Tab */}
          {activeTab === 'organization' && (
            <div className="space-y-8 animate-fade-in">
              <div>
                <h2 className="text-lg font-bold text-text-primary mb-1 flex items-center gap-2">
                  <Building2 size={18} className="text-primary" />
                  {t('Charity Organization Details', 'Charity Organization Details')}
                </h2>
                <p className="text-sm text-text-secondary mb-6">
                  {t('System-wide organization contact and public display information.', 'System-wide organization contact and public display information.')}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
                  <Input 
                    label={t('Organization Name', 'Organization Name')} 
                    value={orgInfo.name} 
                    onChange={(e) => setOrgInfo({...orgInfo, name: e.target.value})} 
                  />
                  <Input 
                    label={t('Official Contact Email', 'Official Contact Email')} 
                    type="email" 
                    value={orgInfo.email} 
                    onChange={(e) => setOrgInfo({...orgInfo, email: e.target.value})} 
                  />
                  <Input 
                    label={t('Official Phone Number', 'Official Phone Number')} 
                    value={orgInfo.phone} 
                    onChange={(e) => setOrgInfo({...orgInfo, phone: e.target.value})} 
                  />
                  <Input 
                    label={t('Headquarters Address', 'Headquarters Address')} 
                    value={orgInfo.address} 
                    onChange={(e) => setOrgInfo({...orgInfo, address: e.target.value})} 
                  />
                  <div className="md:col-span-2">
                    <Input 
                      label={t('Mission Statement / Tagline', 'Mission Statement / Tagline')} 
                      value={orgInfo.tagline} 
                      onChange={(e) => setOrgInfo({...orgInfo, tagline: e.target.value})} 
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Toast notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 rtl:right-auto rtl:left-6 z-50 animate-toast">
          <div className={cn(
            "flex items-center gap-3 px-5 py-3 rounded-xl shadow-2xl text-white font-medium text-sm",
            toast.type === 'success' ? "bg-gray-900" : "bg-red-600"
          )}>
            {toast.type === 'success' ? <CheckCircle2 size={18} className="text-emerald-400" /> : <Lock size={18} />}
            <span>{toast.msg}</span>
          </div>
        </div>
      )}
    </div>
  );
}
