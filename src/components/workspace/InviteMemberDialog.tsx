import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AtSign,
  Check,
  Loader2,
  Mail,
  Shield,
  Users,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import type {
  WorkspacePermissionInfo,
  WorkspaceRole,
  WorkspaceInvitation,
} from "@/types";
import { RADIUS, SHADOW } from "@/constants/design";
import { toast } from "@/hooks/use-toast";

const inviteSchema = z.object({
  email: z.string().min(1, "Nhập email").email("Email không hợp lệ"),
  roleKey: z.string().min(1, "Chọn vai trò"),
  permissions: z.array(z.string()).default([]),
  message: z
    .string()
    .max(500, "Tối đa 500 ký tự")
    .optional()
    .transform((value) => (value && value.trim().length > 0 ? value.trim() : undefined)),
});

type InviteFormValues = z.infer<typeof inviteSchema>;

interface InviteMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workspaceId: string;
  workspaceName?: string;
  onInvited?: (invitation: WorkspaceInvitation) => void;
}

type RolePermissionMap = Record<string, string[]>;

export default function InviteMemberDialog({
  open,
  onOpenChange,
  workspaceId,
  workspaceName,
  onInvited,
}: InviteMemberDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [permissionsTouched, setPermissionsTouched] = useState(false);

  const form = useForm<InviteFormValues>({
    resolver: zodResolver(inviteSchema) as any,
    defaultValues: {
      email: "",
      roleKey: "",
      permissions: [],
      message: undefined,
    },
  });

  const roleKey = form.watch("roleKey");
  const currentPermissions = form.watch("permissions");

  const { data: roles, isLoading: isLoadingRoles } = useQuery<WorkspaceRole[]>({
    queryKey: ["workspace-roles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("workspace_roles")
        .select("key, name, description, priority, is_default, created_at")
        .order("priority", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
    staleTime: 1000 * 60 * 10,
  });

  const { data: permissions, isLoading: isLoadingPermissions } = useQuery<WorkspacePermissionInfo[]>({
    queryKey: ["workspace-permissions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("workspace_permissions")
        .select("key, category, description, created_at")
        .order("category", { ascending: true })
        .order("key", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
    staleTime: 1000 * 60 * 10,
  });

  const { data: roleDefaults } = useQuery<RolePermissionMap>({
    queryKey: ["workspace-role-permissions-defaults"],
    enabled: Boolean(roles && roles.length > 0),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("workspace_role_permissions_global")
        .select("role_key, permission_key");
      if (error) throw error;

      const map: RolePermissionMap = {};
      (data ?? []).forEach((entry) => {
        const { role_key, permission_key } = entry as { role_key: string; permission_key: string };
        if (!map[role_key]) {
          map[role_key] = [];
        }
        map[role_key].push(permission_key);
      });
      return map;
    },
  });

  const permissionsByCategory = useMemo(() => {
    if (!permissions) return {} as Record<string, WorkspacePermissionInfo[]>;
    return permissions.reduce<Record<string, WorkspacePermissionInfo[]>>((acc, permission) => {
      const key = permission.category ?? "Khác";
      acc[key] = acc[key] ? [...acc[key], permission] : [permission];
      return acc;
    }, {});
  }, [permissions]);

  useEffect(() => {
    if (!open) {
      setPermissionsTouched(false);
      form.reset();
    }
  }, [open, form]);

  useEffect(() => {
    if (!open || !roles || roles.length === 0) return;
    const defaultRole = roles.find((role) => role.is_default) ?? roles[0];
    const currentRoleValue = form.getValues("roleKey");
    if (!currentRoleValue) {
      form.setValue("roleKey", defaultRole.key, { shouldDirty: false });
    }
  }, [open, roles, form]);

  useEffect(() => {
    if (!open || !roleKey || !roleDefaults || permissionsTouched) return;
    const defaults = roleDefaults[roleKey] ?? [];
    form.setValue("permissions", defaults, { shouldDirty: false });
  }, [open, roleKey, roleDefaults, form, permissionsTouched]);

  const handlePermissionToggle = useCallback(
    (permissionKey: string, checked: boolean) => {
      setPermissionsTouched(true);
      const next = new Set(currentPermissions ?? []);
      if (checked) {
        next.add(permissionKey);
      } else {
        next.delete(permissionKey);
      }
      form.setValue("permissions", Array.from(next), { shouldDirty: true });
    },
    [form, currentPermissions]
  );

  const handleRestoreDefaults = useCallback(() => {
    if (!roleKey || !roleDefaults) return;
    const defaults = roleDefaults[roleKey] ?? [];
    form.setValue("permissions", defaults, { shouldDirty: false });
    setPermissionsTouched(false);
  }, [form, roleDefaults, roleKey]);

  const isLoading = isLoadingRoles || isLoadingPermissions;

  const onSubmit = form.handleSubmit(async (values) => {
    if (!workspaceId) return;
    setIsSubmitting(true);

    try {
      const payload = {
        workspace_id: workspaceId,
        email: values.email.trim().toLowerCase(),
        role_key: values.roleKey,
        permissions: values.permissions,
        message: values.message ?? null,
      };

      const { data, error } = await supabase
        .from("workspace_invitations")
        .insert(payload)
        .select("*")
        .single();

      if (error) {
        if (error.code === "23505") {
          toast({
            title: "Lời mời đã tồn tại",
            description: "Email này đã được mời và đang chờ phản hồi.",
            variant: "destructive",
          });
        } else {
          throw error;
        }
        return;
      }

      toast({
        title: "Đã gửi lời mời",
        description: "Thành viên sẽ nhận được email hướng dẫn tham gia workspace.",
      });

      const invitation = data as WorkspaceInvitation;
      onInvited?.(invitation);
      form.reset();
      setPermissionsTouched(false);
      onOpenChange(false);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Đã xảy ra lỗi";
      toast({
        title: "Không thể gửi lời mời",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  });

  const dialogClassName = cn("max-w-3xl p-0", RADIUS.lg);
  const sectionClassName = cn(
    "border border-slate-200 bg-white/90 dark:border-slate-800 dark:bg-slate-900/70 px-5 py-4",
    RADIUS.lg,
    SHADOW.card.default
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={dialogClassName} aria-describedby={undefined}>
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle className="text-left text-2xl font-semibold">
            Mời thành viên mới
          </DialogTitle>
          <DialogDescription className="text-left text-sm text-muted-foreground">
            Gửi lời mời tới email của thành viên để tham gia workspace
            {workspaceName ? ` “${workspaceName}”` : ""}.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={onSubmit} className="flex flex-col gap-6 px-6 pb-6">
            <div className="grid gap-6 lg:grid-cols-[1.2fr,1fr]">
              <div className="flex flex-col gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className={sectionClassName}>
                      <FormLabel className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                        <Mail className="h-4 w-4 text-indigo-500" />
                        Email thành viên
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="ten.thanhvien@company.com"
                          autoComplete="email"
                          disabled={isSubmitting}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className={sectionClassName}>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <FormLabel className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                      <Shield className="h-4 w-4 text-indigo-500" />
                      Vai trò & quyền hạn
                    </FormLabel>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-xs"
                      onClick={handleRestoreDefaults}
                      disabled={!roleKey || !roleDefaults || isSubmitting}
                    >
                      Khôi phục mặc định
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="roleKey"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs uppercase tracking-wide text-muted-foreground">
                            Chọn vai trò
                          </FormLabel>
                          <Select
                            value={field.value}
                            onValueChange={(value) => {
                              field.onChange(value);
                              setPermissionsTouched(false);
                            }}
                            disabled={isLoading || isSubmitting}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Chọn vai trò" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {roles?.map((role) => (
                                <SelectItem key={role.key} value={role.key}>
                                  <div className="flex items-center gap-2">
                                    <Users className="h-4 w-4 opacity-60" />
                                    <div className="flex flex-col">
                                      <span className="font-medium text-sm">{role.name}</span>
                                      {role.description && (
                                        <span className="text-xs text-muted-foreground">{role.description}</span>
                                      )}
                                    </div>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="space-y-3">
                      <FormLabel className="text-xs uppercase tracking-wide text-muted-foreground">
                        Quyền tuỳ chỉnh
                      </FormLabel>
                      {isLoading ? (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Đang tải danh sách quyền...
                        </div>
                      ) : (
                        <FormField
                          control={form.control}
                          name="permissions"
                          render={() => (
                            <div className="space-y-4 max-h-[260px] overflow-y-auto pr-1">
                              {Object.entries(permissionsByCategory).map(([category, list]) => (
                                <div key={category} className="space-y-2">
                                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                                    <AtSign className="h-4 w-4 text-indigo-500" />
                                    <span>{category}</span>
                                    <Badge variant="outline" className="text-[11px]">
                                      {list.length}
                                    </Badge>
                                  </div>
                                  <div className="space-y-2">
                                    {list.map((permission) => {
                                      const checked = currentPermissions?.includes(permission.key) ?? false;
                                      return (
                                        <label
                                          key={permission.key}
                                          className="flex items-start gap-3 rounded-lg border border-slate-200 dark:border-slate-800 px-3 py-2 text-sm"
                                        >
                                          <Checkbox
                                            checked={checked}
                                            onCheckedChange={(state) =>
                                              handlePermissionToggle(permission.key, Boolean(state))
                                            }
                                            disabled={isSubmitting}
                                          />
                                          <div className="space-y-1">
                                            <span className="font-medium text-slate-700 dark:text-slate-200">
                                              {permission.key}
                                            </span>
                                            {permission.description && (
                                              <p className="text-xs text-muted-foreground">
                                                {permission.description}
                                              </p>
                                            )}
                                          </div>
                                        </label>
                                      );
                                    })}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className={sectionClassName}>
                  <FormLabel className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                    <Mail className="h-4 w-4 text-indigo-500" />
                    Thư giới thiệu (tuỳ chọn)
                  </FormLabel>
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea
                            rows={7}
                            placeholder="Thêm lời nhắn cá nhân để thành viên biết lý do tham gia"
                            disabled={isSubmitting}
                            {...field}
                          />
                        </FormControl>
                        <FormDescription className="text-xs">
                          Thông điệp này sẽ xuất hiện trong email mời tham gia workspace.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className={cn(sectionClassName, "space-y-2 text-sm text-muted-foreground")}
                  aria-live="polite"
                >
                  <p>
                    Thành viên mới cần tạo hoặc đăng nhập tài khoản bằng email được mời để truy cập workspace.
                  </p>
                  <p>
                    Sau khi chấp nhận, họ kế thừa quyền từ vai trò đã chọn và các quyền tuỳ chỉnh bổ sung (nếu có).
                  </p>
                </div>
              </div>
            </div>

            <DialogFooter className="border-t border-slate-200 pt-4 dark:border-slate-800">
              <Button
                type="button"
                variant="ghost"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Huỷ
              </Button>
              <Button type="submit" disabled={isSubmitting || isLoading}>
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Check className="mr-2 h-4 w-4" />}
                {isSubmitting ? "Đang gửi..." : "Gửi lời mời"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

