import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Users, Search, Shield, UserCheck, UserX, 
  MoreVertical, Mail, Calendar, ChevronDown
} from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface UserProfile {
  id: string;
  user_id: string;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  created_at: string;
  email?: string;
  role?: string;
}

const UsersManager = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      // Fetch profiles
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (profilesError) throw profilesError;

      // Fetch roles
      const { data: roles, error: rolesError } = await supabase
        .from("user_roles")
        .select("user_id, role");

      if (rolesError) throw rolesError;

      // Merge data
      const usersWithRoles = (profiles || []).map(profile => ({
        ...profile,
        role: roles?.find(r => r.user_id === profile.user_id)?.role || "user"
      }));

      setUsers(usersWithRoles);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("خطا در دریافت کاربران");
    } finally {
      setLoading(false);
    }
  };

  const updateRole = async (userId: string, newRole: "admin" | "moderator" | "user") => {
    try {
      // First delete existing role
      await supabase
        .from("user_roles")
        .delete()
        .eq("user_id", userId);

      // Insert new role if not 'user' (user is default)
      if (newRole !== "user") {
        const { error } = await supabase
          .from("user_roles")
          .insert({ user_id: userId, role: newRole });

        if (error) throw error;
      }

      toast.success(`نقش کاربر به ${newRole === "admin" ? "ادمین" : newRole === "moderator" ? "مدیر" : "کاربر"} تغییر کرد`);
      fetchUsers();
    } catch (error) {
      console.error("Error updating role:", error);
      toast.error("خطا در تغییر نقش");
    }
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat("fa-IR", {
      year: "numeric",
      month: "short",
      day: "numeric"
    }).format(new Date(dateString));
  };

  const filteredUsers = users.filter(user =>
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phone?.includes(searchTerm)
  );

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return <span className="px-2 py-1 rounded-full text-xs bg-red-500/20 text-red-400 flex items-center gap-1"><Shield className="w-3 h-3" />ادمین</span>;
      case "moderator":
        return <span className="px-2 py-1 rounded-full text-xs bg-blue-500/20 text-blue-400 flex items-center gap-1"><UserCheck className="w-3 h-3" />مدیر</span>;
      default:
        return <span className="px-2 py-1 rounded-full text-xs bg-secondary text-muted-foreground">کاربر</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Users className="w-6 h-6 text-primary" />
            مدیریت کاربران
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            {users.length} کاربر ثبت شده
          </p>
        </div>
        <div className="relative w-full md:w-64">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="جستجوی نام یا شماره..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pr-10"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass rounded-xl p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center">
            <Shield className="w-6 h-6 text-red-400" />
          </div>
          <div>
            <p className="text-2xl font-bold">{users.filter(u => u.role === "admin").length}</p>
            <p className="text-sm text-muted-foreground">ادمین</p>
          </div>
        </div>
        <div className="glass rounded-xl p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
            <UserCheck className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <p className="text-2xl font-bold">{users.filter(u => u.role === "moderator").length}</p>
            <p className="text-sm text-muted-foreground">مدیر</p>
          </div>
        </div>
        <div className="glass rounded-xl p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
            <Users className="w-6 h-6 text-green-400" />
          </div>
          <div>
            <p className="text-2xl font-bold">{users.filter(u => u.role === "user" || !u.role).length}</p>
            <p className="text-sm text-muted-foreground">کاربر عادی</p>
          </div>
        </div>
      </div>

      {/* Users List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="glass rounded-xl p-4 animate-pulse">
              <div className="flex gap-4 items-center">
                <div className="w-12 h-12 bg-secondary/50 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-secondary/50 rounded w-1/3" />
                  <div className="h-3 bg-secondary/50 rounded w-1/4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="text-center py-12">
          <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">کاربری یافت نشد</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredUsers.map((user, index) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="glass rounded-xl p-4 flex flex-col md:flex-row gap-4 items-start md:items-center"
            >
              {/* Avatar */}
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-lg font-bold text-primary-foreground">
                {user.full_name?.charAt(0) || user.user_id.charAt(0).toUpperCase()}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-foreground">
                  {user.full_name || "کاربر بدون نام"}
                </h4>
                <div className="flex flex-wrap gap-3 mt-1 text-xs text-muted-foreground">
                  {user.phone && (
                    <span className="flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      {user.phone}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatDate(user.created_at)}
                  </span>
                </div>
              </div>

              {/* Role Badge */}
              {getRoleBadge(user.role || "user")}

              {/* Actions */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => updateRole(user.user_id, "admin")}>
                    <Shield className="w-4 h-4 ml-2 text-red-400" />
                    تبدیل به ادمین
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => updateRole(user.user_id, "moderator")}>
                    <UserCheck className="w-4 h-4 ml-2 text-blue-400" />
                    تبدیل به مدیر
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => updateRole(user.user_id, "user")}>
                    <UserX className="w-4 h-4 ml-2" />
                    تبدیل به کاربر عادی
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UsersManager;
