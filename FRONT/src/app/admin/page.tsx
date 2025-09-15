"use client";

import * as React from "react";
import Link from "next/link";
import { adminAPI, isAuthenticated } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Users, 
  CheckSquare, 
  StickyNote, 
  BookOpen, 
  Shield, 
  Trash2, 
  UserCog,
  ArrowLeft,
  Activity,
  BarChart3
} from "lucide-react";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import Logo from "@/components/logo";

interface User {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
  createdAt: string;
  profilePicture?: string;
  _count: {
    tasks: number;
    noteTopics: number;
    journalEntries: number;
  };
}

interface Stats {
  totalUsers: number;
  totalTasks: number;
  totalNotes: number;
  totalJournalEntries: number;
  completedTasks: number;
  adminUsers: number;
  taskCompletionRate: number;
}

export default function AdminPage() {
  const [users, setUsers] = React.useState<User[]>([]);
  const [stats, setStats] = React.useState<Stats | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [userToDelete, setUserToDelete] = React.useState<User | null>(null);
  const { toast } = useToast();

  React.useEffect(() => {
    const checkAccess = async () => {
      if (!isAuthenticated()) {
        window.location.href = '/login';
        return;
      }

      try {
        setIsLoading(true);
        const [usersResponse, statsResponse] = await Promise.all([
          adminAPI.getUsers(),
          adminAPI.getStats()
        ]);

        if (usersResponse.success) {
          setUsers(usersResponse.data);
        }

        if (statsResponse.success) {
          setStats(statsResponse.data);
        }
      } catch (error: any) {
        console.error('Admin access error:', error);
        if (error.message?.includes('403') || error.message?.includes('دسترسی مجاز نیست')) {
          toast({
            title: "❌ دسترسی غیر مجاز",
            description: "شما ادمین نیستید",
            variant: "destructive"
          });
          window.location.href = '/dashboard';
        } else {
          toast({
            title: "❌ خطا",
            description: "خطا در بارگذاری اطلاعات ادمین",
            variant: "destructive"
          });
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkAccess();
  }, [toast]);

  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    try {
      const response = await adminAPI.deleteUser(userToDelete.id);
      if (response.success) {
        setUsers(users.filter(u => u.id !== userToDelete.id));
        toast({
          title: "✅ موفق",
          description: `کاربر ${userToDelete.name} حذف شد`,
          variant: "destructive"
        });
        // Update stats
        if (stats) {
          setStats({
            ...stats,
            totalUsers: stats.totalUsers - 1
          });
        }
      }
    } catch (error: any) {
      toast({
        title: "❌ خطا",
        description: error.message || "خطا در حذف کاربر",
        variant: "destructive"
      });
    } finally {
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  };

  const handleToggleRole = async (user: User) => {
    const newRole = user.role === 'ADMIN' ? 'USER' : 'ADMIN';
    
    try {
      const response = await adminAPI.updateUserRole(user.id, newRole);
      if (response.success) {
        setUsers(users.map(u => 
          u.id === user.id ? { ...u, role: newRole } : u
        ));
        toast({
          title: "✅ موفق",
          description: `نقش ${user.name} به ${newRole === 'ADMIN' ? 'ادمین' : 'کاربر عادی'} تغییر کرد`
        });
      }
    } catch (error: any) {
      toast({
        title: "❌ خطا",
        description: error.message || "خطا در تغییر نقش کاربر",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <span className="text-lg">در حال بارگذاری پنل ادمین...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                <ArrowLeft className="h-5 w-5" />
                بازگشت به داشبورد
              </Link>
              <div className="flex items-center gap-2">
                <Logo className="h-8 w-8 text-primary" />
                <h1 className="text-2xl font-bold">پنل ادمین</h1>
                <Shield className="h-6 w-6 text-primary" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">کل کاربران</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalUsers}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.adminUsers} ادمین
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">کل وظایف</CardTitle>
                <CheckSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalTasks}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.taskCompletionRate}% تکمیل شده
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">یادداشت‌ها</CardTitle>
                <StickyNote className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalNotes}</div>
                <p className="text-xs text-muted-foreground">موضوعات یادداشت</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">دفترچه خاطرات</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalJournalEntries}</div>
                <p className="text-xs text-muted-foreground">نوشته‌های شخصی</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              مدیریت کاربران
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {users.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage 
                        src={user.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=3b82f6&color=ffffff&size=48`}
                        alt={user.name} 
                      />
                      <AvatarFallback>
                        {user.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{user.name}</h3>
                        <Badge variant={user.role === 'ADMIN' ? 'default' : 'secondary'}>
                          {user.role === 'ADMIN' ? 'ادمین' : 'کاربر'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                      <p className="text-xs text-muted-foreground">
                        {user._count.tasks} وظیفه | {user._count.noteTopics} یادداشت | {user._count.journalEntries} دفترچه
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleRole(user)}
                      className="flex items-center gap-2"
                    >
                      <UserCog className="h-4 w-4" />
                      {user.role === 'ADMIN' ? 'حذف ادمین' : 'تبدیل به ادمین'}
                    </Button>
                    
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        setUserToDelete(user);
                        setDeleteDialogOpen(true);
                      }}
                      className="flex items-center gap-2"
                    >
                      <Trash2 className="h-4 w-4" />
                      حذف
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>حذف کاربر</AlertDialogTitle>
            <AlertDialogDescription>
              آیا مطمئن هستید که می‌خواهید کاربر <strong>{userToDelete?.name}</strong> را حذف کنید؟
              این عمل غیرقابل بازگشت است و تمام داده‌های کاربر (وظایف، یادداشت‌ها و دفترچه خاطرات) حذف خواهد شد.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>لغو</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteUser} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              حذف کاربر
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
