
"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { User, Lock, Book, FileEdit, Trash2 } from "lucide-react";
import { translations } from "@/lib/translations";
import { journalAPI } from "@/lib/api";
import type { JournalEntry } from "@/lib/types";
import { ProfilePictureUpload } from "@/components/profile-picture-upload";

interface ProfileDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  userHabits: string;
  onUserHabitsChange: (habits: string) => void;
  user?: {id: string; name: string; email: string; habits?: string; profilePicture?: string} | null;
}

// Remove the local type definition since we're importing it from types

export function ProfileDialog({ isOpen, onOpenChange, userHabits, onUserHabitsChange, user }: ProfileDialogProps) {
    const { toast } = useToast();
    const [language, setLanguage] = React.useState('en');
    const t = translations[language as keyof typeof translations].profileDialog;

    React.useEffect(() => {
        const storedLang = localStorage.getItem('lang') || 'en';
        setLanguage(storedLang);
        const handleStorageChange = () => {
            const newLang = localStorage.getItem('lang') || 'en';
            setLanguage(newLang);
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);
    
    // State for Profile Tab
    const [displayName, setDisplayName] = React.useState(user?.name || "کاربر سیستم");
    const [email, setEmail] = React.useState(user?.email || "");
    const [profilePicture, setProfilePicture] = React.useState<string | null>(user?.profilePicture || null);

    // Update state when user prop changes
    React.useEffect(() => {
        if (user) {
            setDisplayName(user.name || "کاربر سیستم");
            setEmail(user.email || "");
            setProfilePicture(user.profilePicture || null);
        }
    }, [user]);
    
    // State for Account Tab
    const [currentPassword, setCurrentPassword] = React.useState("");
    const [newPassword, setNewPassword] = React.useState("");
    const [confirmPassword, setConfirmPassword] = React.useState("");

    // State for Journal Tab
    const [journalEntries, setJournalEntries] = React.useState<JournalEntry[]>([]);
    const [newEntry, setNewEntry] = React.useState("");
    const [editingEntry, setEditingEntry] = React.useState<JournalEntry | null>(null);
    const [isJournalLoading, setIsJournalLoading] = React.useState(false);

    // Load journal entries from API
    const loadJournalEntries = async () => {
        try {
            setIsJournalLoading(true);
            const response = await journalAPI.getAll();
            if (response.success) {
                const entries = (response.data || []).map((entry: any) => ({
                    ...entry,
                    createdAt: new Date(entry.createdAt),
                    updatedAt: new Date(entry.updatedAt),
                }));
                setJournalEntries(entries);
            }
        } catch (error: any) {
            console.error('Failed to load journal entries:', error);
            toast({ 
                title: "خطا", 
                description: "خطا در بارگذاری دفترچه خاطرات", 
                variant: "destructive" 
            });
        } finally {
            setIsJournalLoading(false);
        }
    };

    // Load journal entries when dialog opens
    React.useEffect(() => {
        if (isOpen) {
            loadJournalEntries();
        }
    }, [isOpen]);

    const handleSaveProfile = async () => {
        try {
            // Save habits and profile info
            const nameChanged = user && displayName !== user.name;
            const pictureChanged = user && profilePicture !== user.profilePicture;
            
            if (nameChanged || pictureChanged) {
                const { authAPI } = await import('@/lib/api');
                const response = await authAPI.updateProfile({
                    name: displayName,
                    email: email,
                    habits: userHabits,
                    profilePicture: profilePicture
                });
                
                if (response.success) {
                    onUserHabitsChange(userHabits);
                    onOpenChange(false);
                    toast({ 
                        title: "✅ پروفایل بروزرسانی شد", 
                        description: "اطلاعات شما با موفقیت ذخیره شد" 
                    });
                } else {
                    toast({ 
                        title: "❌ خطا", 
                        description: "خطا در بروزرسانی پروفایل", 
                        variant: "destructive" 
                    });
                }
            } else {
                // Only habits changed
                onUserHabitsChange(userHabits);
                onOpenChange(false);
                toast({ 
                    title: "✅ ذخیره شد", 
                    description: "تنظیمات شما بروزرسانی شد" 
                });
            }
        } catch (error: any) {
            console.error('Error saving profile:', error);
            toast({ 
                title: "❌ خطا", 
                description: error.message || "خطا در ذخیره کردن اطلاعات", 
                variant: "destructive" 
            });
        }
    }

    const handleChangePassword = async () => {
        if (!currentPassword.trim()) {
            toast({ variant: "destructive", title: "خطا", description: "رمز عبور فعلی الزامی است" });
            return;
        }
        if (!newPassword.trim()) {
            toast({ variant: "destructive", title: "خطا", description: "رمز عبور جدید الزامی است" });
            return;
        }
        if (newPassword !== confirmPassword) {
            toast({ variant: "destructive", title: "خطا", description: "رمزهای عبور جدید مطابقت ندارند" });
            return;
        }
        if (newPassword.length < 6) {
            toast({ variant: "destructive", title: "خطا", description: "رمز عبور جدید باید حداقل ۶ کاراکتر باشد" });
            return;
        }

        try {
            const { userAPI } = await import('@/lib/api');
            const response = await userAPI.changePassword({
                currentPassword: currentPassword,
                newPassword: newPassword
            });

            if (response.success) {
                toast({ 
                    title: "✅ موفق", 
                    description: "رمز عبور با موفقیت تغییر کرد" 
                });
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
            }
        } catch (error: any) {
            toast({ 
                variant: "destructive", 
                title: "❌ خطا", 
                description: error.message || "خطا در تغییر رمز عبور" 
            });
        }
    }
    
    const handleJournalSave = async () => {
        if (!newEntry.trim()) return;

        try {
            if (editingEntry) {
                // Update existing entry
                const response = await journalAPI.update(editingEntry.id, { content: newEntry.trim() });
                if (response.success) {
                    const updatedEntry = {
                        ...response.data,
                        createdAt: new Date(response.data.createdAt),
                        updatedAt: new Date(response.data.updatedAt),
                    };
                    setJournalEntries(journalEntries.map(entry => 
                        entry.id === editingEntry.id ? updatedEntry : entry
                    ));
                    toast({ title: t.journal.toast.journalUpdated, description: t.journal.toast.entrySaved });
                }
            } else {
                // Create new entry
                const response = await journalAPI.create({ content: newEntry.trim() });
                if (response.success) {
                    const newJournalEntry = {
                        ...response.data,
                        createdAt: new Date(response.data.createdAt),
                        updatedAt: new Date(response.data.updatedAt),
                    };
                    setJournalEntries([newJournalEntry, ...journalEntries]);
                    toast({ title: t.journal.toast.entryAdded, description: t.journal.toast.newEntrySaved });
                }
            }
            setNewEntry("");
            setEditingEntry(null);
        } catch (error: any) {
            toast({ 
                title: "خطا", 
                description: error.message || "خطا در ذخیره دفترچه خاطرات", 
                variant: "destructive" 
            });
        }
    };

    const handleJournalEdit = (entry: JournalEntry) => {
        setEditingEntry(entry);
        setNewEntry(entry.content);
    };
    
    const handleJournalDelete = async (entryId: string) => {
        try {
            const response = await journalAPI.delete(entryId);
            if (response.success) {
                setJournalEntries(journalEntries.filter(entry => entry.id !== entryId));
                toast({ title: t.journal.toast.entryDeleted, variant: "destructive" });
            }
        } catch (error: any) {
            toast({ 
                title: "خطا", 
                description: error.message || "خطا در حذف نوشته", 
                variant: "destructive" 
            });
        }
    };


  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px]">
        <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="profile"><User className="mr-2 h-4 w-4" />{t.tabs.profile}</TabsTrigger>
                <TabsTrigger value="account"><Lock className="mr-2 h-4 w-4" />{t.tabs.account}</TabsTrigger>
                <TabsTrigger value="journal"><Book className="mr-2 h-4 w-4" />{t.tabs.journal}</TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile" className="mt-6">
                <DialogHeader>
                  <DialogTitle>{t.profile.title}</DialogTitle>
                  <DialogDescription>
                    {t.profile.description}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-6 py-4">
                    <ProfilePictureUpload
                        currentPicture={profilePicture}
                        userName={displayName}
                        onPictureChange={setProfilePicture}
                    />
                    <div className="space-y-2">
                        <Label htmlFor="display-name">{t.profile.displayName}</Label>
                        <Input 
                            id="display-name" 
                            value={displayName} 
                            onChange={(e) => setDisplayName(e.target.value)}
                            placeholder="نام خود را وارد کنید"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">ایمیل</Label>
                        <Input 
                            id="email" 
                            type="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="your@email.com"
                            disabled
                            className="bg-muted"
                        />
                        <p className="text-xs text-muted-foreground">ایمیل قابل تغییر نیست</p>
                    </div>
                </div>
                 <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>{t.close}</Button>
                    <Button onClick={handleSaveProfile}>{t.profile.saveProfile}</Button>
                </DialogFooter>
            </TabsContent>
            
            <TabsContent value="account" className="mt-6">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Lock className="h-5 w-5" />
                    تنظیمات حساب
                  </DialogTitle>
                  <DialogDescription>
                    جزئیات حساب و رمز عبور خود را مدیریت کنید.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-6 py-4">
                    <div className="space-y-2">
                        <Label>ایمیل</Label>
                        <Input 
                            value={email || "user@example.com"} 
                            disabled 
                            className="bg-muted"
                        />
                        <p className="text-xs text-muted-foreground">ایمیل قابل تغییر نیست</p>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="current-password">رمز عبور فعلی</Label>
                        <Input 
                            id="current-password" 
                            type="password" 
                            value={currentPassword} 
                            onChange={e => setCurrentPassword(e.target.value)}
                            placeholder="رمز عبور فعلی خود را وارد کنید"
                        />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="new-password">رمز عبور جدید</Label>
                        <Input 
                            id="new-password" 
                            type="password" 
                            value={newPassword} 
                            onChange={e => setNewPassword(e.target.value)}
                            placeholder="رمز عبور جدید خود را وارد کنید"
                        />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="confirm-password">تأیید رمز عبور</Label>
                        <Input 
                            id="confirm-password" 
                            type="password" 
                            value={confirmPassword} 
                            onChange={e => setConfirmPassword(e.target.value)}
                            placeholder="رمز عبور جدید را دوباره وارد کنید"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>بستن</Button>
                    <Button onClick={handleChangePassword}>تغییر رمز عبور</Button>
                </DialogFooter>
            </TabsContent>
            
            <TabsContent value="journal" className="mt-6">
                <DialogHeader>
                  <DialogTitle>{t.journal.title}</DialogTitle>
                  <DialogDescription>
                    {t.journal.description}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="journal-entry">{editingEntry ? t.journal.editEntry : t.journal.newEntry}</Label>
                        <Textarea 
                            id="journal-entry" 
                            placeholder={t.journal.placeholder}
                            className="min-h-[120px]"
                            value={newEntry}
                            onChange={(e) => setNewEntry(e.target.value)}
                        />
                    </div>
                    <div className="flex justify-end gap-2">
                        {editingEntry && <Button variant="outline" size="sm" onClick={() => { setEditingEntry(null); setNewEntry(""); }}>{t.cancel}</Button>}
                        <Button size="sm" onClick={handleJournalSave} disabled={!newEntry.trim()}>
                            {editingEntry ? t.journal.saveChanges : t.journal.addEntry}
                        </Button>
                    </div>
                    
                    <div className="max-h-[200px] overflow-y-auto space-y-4 pr-2 -mr-2">
                        {isJournalLoading ? (
                            <div className="flex items-center justify-center py-8">
                                <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                                <span className="ml-2 text-sm text-muted-foreground">در حال بارگذاری...</span>
                            </div>
                        ) : journalEntries.length > 0 ? journalEntries.map(entry => (
                            <div key={entry.id} className="p-3 border rounded-lg bg-muted/50">
                                <p className="text-sm text-foreground mb-2">{entry.content}</p>
                                <div className="flex items-center justify-between">
                                    <p className="text-xs text-muted-foreground">{entry.createdAt.toLocaleDateString()}</p>
                                    <div className="flex items-center gap-1">
                                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleJournalEdit(entry)}><FileEdit className="h-4 w-4" /></Button>
                                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => handleJournalDelete(entry.id)}><Trash2 className="h-4 w-4" /></Button>
                                    </div>
                                </div>
                            </div>
                        )) : (
                             <p className="text-sm text-muted-foreground text-center py-4">{t.journal.noEntries}</p>
                        )}
                    </div>
                </div>
                 <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>{t.close}</Button>
                </DialogFooter>
            </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
