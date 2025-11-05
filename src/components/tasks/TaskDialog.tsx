import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { JSONContent, EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold,
  CalendarDays,
  FileText,
  FolderPlus,
  Hash,
  Italic,
  Link,
  List,
  ListOrdered,
  Loader2,
  Paperclip,
  Plus,
  Redo,
  RemoveFormatting,
  Sparkles,
  Trash2,
  Undo,
  UserRound,
} from "lucide-react";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useWorkspaceStatuses } from "@/hooks/useWorkspaceStatuses";
import { useFolders } from "@/hooks/useFolders";
import { useTasks } from "@/hooks/useTasks";
import { useWorkspaces } from "@/hooks/useWorkspaces";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import type { Task, TaskPriority, WorkspaceFolder, WorkspaceMember, WorkspaceStatus } from "@/types";
import { RADIUS, SHADOW } from "@/constants/design";
import { toast } from "@/hooks/use-toast";

const PRIORITY_OPTIONS = ["low", "medium", "high", "urgent"] as const;

const taskFormSchema = z.object({
  title: z.string().min(1, "Vui lòng nhập tiêu đề"),
  statusId: z.string().optional().nullable(),
  priority: z.enum(PRIORITY_OPTIONS),
  assigneeId: z.string().optional().nullable(),
  folderId: z.string().optional().nullable(),
  dueDate: z.date().optional().nullable(),
  tags: z.array(z.string()).default([]),
  description: z.any().optional().nullable(),
});

export type TaskFormValues = z.infer<typeof taskFormSchema>;

interface TaskDialogDefaults {
  title?: string;
  description?: JSONContent | string | null;
  statusId?: string | null;
  priority?: TaskPriority;
  assigneeId?: string | null;
  folderId?: string | null;
  dueDate?: string | Date | null;
  tags?: string[];
}

interface TaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workspaceId: string;
  defaultValues?: TaskDialogDefaults;
  presetStatusId?: string;
  presetFolderId?: string;
  onSuccess?: (task: Task) => void;
  workspaceMembersOverride?: WorkspaceMember[];
}

const EMPTY_DOC: JSONContent = {
  type: "doc",
  content: [{ type: "paragraph", content: [] }],
};

const PRIORITY_LABELS: Record<TaskPriority, string> = {
  low: "Thấp",
  medium: "Trung bình",
  high: "Cao",
  urgent: "Khẩn cấp",
};

const PRIORITY_ACCENTS: Record<TaskPriority, string> = {
  low: "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-300",
  medium: "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-300",
  high: "bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-300",
  urgent: "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-300",
};

function parseDescriptionInput(input?: JSONContent | string | null): JSONContent | null {
  if (!input) return null;

  if (typeof input === "string") {
    try {
      const parsed = JSON.parse(input) as JSONContent;
      return parsed;
    } catch (error) {
      console.warn("Không thể parse nội dung mô tả, fallback rỗng", error);
      return null;
    }
  }

  return input;
}

function sanitizeFileName(name: string) {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9.-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function TaskDialog({
  open,
  onOpenChange,
  workspaceId,
  defaultValues,
  presetStatusId,
  presetFolderId,
  onSuccess,
  workspaceMembersOverride,
}: TaskDialogProps) {
  const { statuses, isLoading: isLoadingStatuses } = useWorkspaceStatuses(workspaceId);
  const { folderTree, isLoading: isLoadingFolders } = useFolders({ workspaceId });
  const { createTask } = useTasks({ workspaceId });
  const { workspaces } = useWorkspaces();

  const [isSaving, setIsSaving] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [tagDraft, setTagDraft] = useState("");

  const workspaceMembers = useMemo(() => {
    if (workspaceMembersOverride) return workspaceMembersOverride;
    const matched = workspaces?.find((workspace) => workspace.id === workspaceId);
    return matched?.members ?? [];
  }, [workspaces, workspaceId, workspaceMembersOverride]);

  const availableStatuses = useMemo(() => statuses.filter((status) => status.is_active), [statuses]);

  const defaultStatus = useMemo<WorkspaceStatus | undefined>(() => {
    if (defaultValues?.statusId) {
      return statuses.find((status) => status.id === defaultValues.statusId);
    }
    if (presetStatusId) {
      return statuses.find((status) => status.id === presetStatusId);
    }
    return statuses.find((status) => status.is_default) ?? statuses[0];
  }, [defaultValues?.statusId, presetStatusId, statuses]);

  const initialDescriptionContent = useMemo(() => {
    return parseDescriptionInput(defaultValues?.description) ?? EMPTY_DOC;
  }, [defaultValues?.description]);

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema) as any,
    defaultValues: {
      title: "",
      statusId: defaultStatus?.id ?? null,
      priority: defaultValues?.priority ?? "medium",
      assigneeId: defaultValues?.assigneeId ?? null,
      folderId: defaultValues?.folderId ?? presetFolderId ?? null,
      dueDate: defaultValues?.dueDate ? new Date(defaultValues.dueDate) : null,
      tags: defaultValues?.tags ?? [],
      description: initialDescriptionContent,
    },
  });

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3, 4] },
      }),
      Placeholder.configure({
        placeholder: "Mô tả chi tiết công việc, checklist, brief...",
      }),
    ],
    editorProps: {
      attributes: {
        class:
          "prose prose-sm max-w-none dark:prose-invert focus:outline-none min-h-[160px]",
      },
    },
    content: initialDescriptionContent,
    onUpdate({ editor: instance }) {
      form.setValue("description", instance.getJSON(), { shouldDirty: true });
    },
  });

  useEffect(() => {
    if (!open) {
      setAttachments([]);
      setTagDraft("");
      form.reset();
      return;
    }

    if (isLoadingStatuses) return;

    const resolvedStatus = defaultStatus?.id ?? null;
    const resolvedFolder = defaultValues?.folderId ?? presetFolderId ?? null;
    const resolvedDueDate = defaultValues?.dueDate
      ? new Date(defaultValues.dueDate)
      : null;

    form.reset({
      title: defaultValues?.title ?? "",
      statusId: resolvedStatus,
      priority: defaultValues?.priority ?? "medium",
      assigneeId: defaultValues?.assigneeId ?? null,
      folderId: resolvedFolder,
      dueDate: resolvedDueDate,
      tags: defaultValues?.tags ?? [],
      description: initialDescriptionContent,
    });

    if (editor) {
      editor.commands.setContent(initialDescriptionContent, false);
    }
  }, [
    open,
    defaultValues?.title,
    defaultValues?.priority,
    defaultValues?.assigneeId,
    defaultValues?.folderId,
    defaultValues?.dueDate,
    defaultValues?.tags,
    defaultStatus?.id,
    initialDescriptionContent,
    presetFolderId,
    editor,
    form,
    isLoadingStatuses,
  ]);

  type FolderNode = WorkspaceFolder & { children?: FolderNode[] };

  const folderOptions = useMemo(() => {
    const items: { id: string; name: string; depth: number }[] = [];

    const traverse = (nodes?: FolderNode[], depth = 0) => {
      if (!nodes) return;
      nodes.forEach((node) => {
        items.push({ id: node.id, name: node.name, depth });
        if (node.children && node.children.length > 0) {
          traverse(node.children, depth + 1);
        }
      });
    };

    traverse(folderTree as FolderNode[] | undefined);
    return items;
  }, [folderTree]);

  const handleAddTag = useCallback(() => {
    const value = tagDraft.trim();
    if (!value) return;
    const current = form.getValues("tags") ?? [];
    if (!current.includes(value)) {
      form.setValue("tags", [...current, value]);
    }
    setTagDraft("");
  }, [form, tagDraft]);

  const handleRemoveTag = useCallback(
    (tag: string) => {
      const current = form.getValues("tags") ?? [];
      form.setValue(
        "tags",
        current.filter((item) => item !== tag)
      );
    },
    [form]
  );

  const handleAttachmentsChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files ? Array.from(event.target.files) : [];
      setAttachments(files);
    },
    []
  );

  const uploadAttachments = useCallback(
    async (taskId: string) => {
      if (!attachments.length) return;

      const bucket = supabase.storage.from("task-attachments");

      await Promise.all(
        attachments.map(async (file) => {
          const safeName = sanitizeFileName(file.name) || `tep-${Date.now()}`;
          const path = `${workspaceId}/${taskId}/${Date.now()}-${safeName}`;

          const { error: uploadError } = await bucket.upload(path, file, {
            cacheControl: "3600",
            upsert: true,
          });

          if (uploadError) throw uploadError;

          const { error: insertError } = await supabase.from("attachments").insert({
            task_id: taskId,
            file_name: file.name,
            file_path: path,
            file_size: file.size,
            file_type: file.type,
          });

          if (insertError) throw insertError;
        })
      );
    },
    [attachments, workspaceId]
  );

  const onSubmit = form.handleSubmit(async (values) => {
    if (!workspaceId) return;

    const status = availableStatuses.find((item) => item.id === values.statusId) ?? defaultStatus;

    setIsSaving(true);

    try {
      const createdTask = await createTask.mutateAsync({
        workspace_id: workspaceId,
        title: values.title.trim(),
        status: status?.key ?? "todo",
        status_id: status?.id ?? null,
        priority: values.priority,
        description: values.description ? JSON.stringify(values.description) : null,
        folder_id: values.folderId ?? null,
        due_date: values.dueDate ? values.dueDate.toISOString() : null,
        assigned_to: values.assigneeId ?? null,
        tags: values.tags ?? [],
      });

      if (attachments.length) {
        try {
          await uploadAttachments(createdTask.id);
        } catch (error) {
          console.error("Upload attachments failed", error);
          toast({
            title: "Không thể tải một số tập tin",
            description: "Task đã được tạo nhưng file đính kèm cần thử lại sau.",
            variant: "destructive",
          });
        }
      }

      setAttachments([]);
      setTagDraft("");
      onSuccess?.(createdTask);
      onOpenChange(false);
    } finally {
      setIsSaving(false);
    }
  });

  const dialogClassName = cn("max-w-4xl p-0", RADIUS.lg);
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
            Tạo công việc mới
          </DialogTitle>
          <DialogDescription className="text-left text-sm text-muted-foreground">
            Điền thông tin quan trọng để thêm công việc vào workspace của bạn.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={onSubmit} className="flex flex-col gap-6 px-6 pb-6">
            <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
              <div className="flex flex-col gap-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem className={sectionClassName}>
                      <div className="flex items-center justify-between gap-2">
                        <FormLabel className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                          <Sparkles className="h-4 w-4 text-indigo-500 dark:text-indigo-300" />
                          Tiêu đề công việc
                        </FormLabel>
                        <Badge variant="outline" className="text-[11px] uppercase tracking-wide">
                          Bắt buộc
                        </Badge>
                      </div>
                      <FormControl>
                        <Input {...field} placeholder="Ví dụ: Chuẩn bị kế hoạch marketing Q4" autoFocus disabled={isSaving} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className={sectionClassName}>
                  <FormLabel className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                    <FileText className="h-4 w-4 text-indigo-500 dark:text-indigo-300" />
                    Mô tả
                  </FormLabel>
                  <div className="rounded-2xl border border-dashed border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
                    <RichTextToolbar editor={editor} disabled={isSaving} />
                    <div className="max-h-[280px] overflow-y-auto px-4 pb-4">
                      <EditorContent editor={editor} />
                    </div>
                  </div>
                  <FormDescription className="mt-2 text-xs">
                    Sử dụng định dạng để mô tả kết quả mong đợi, checklist hoặc mô tả chi tiết.
                  </FormDescription>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className={sectionClassName}>
                  <h3 className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-200">
                    Thông tin chung
                  </h3>
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="statusId"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel className="text-xs uppercase tracking-wide text-muted-foreground">
                            Trạng thái
                          </FormLabel>
                          <Select
                            value={field.value ?? ""}
                            onValueChange={(value) => field.onChange(value || null)}
                            disabled={isLoadingStatuses || isSaving}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Chọn trạng thái" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {availableStatuses.map((status) => (
                                <SelectItem key={status.id} value={status.id}>
                                  <StatusOption status={status} />
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="priority"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel className="text-xs uppercase tracking-wide text-muted-foreground">
                            Mức độ ưu tiên
                          </FormLabel>
                          <Select value={field.value} onValueChange={field.onChange} disabled={isSaving}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Chọn mức ưu tiên" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {PRIORITY_OPTIONS.map((priority) => (
                                <SelectItem key={priority} value={priority}>
                                  <div className={cn("flex items-center gap-2", PRIORITY_ACCENTS[priority])}>
                                    <span className="h-2 w-2 rounded-full bg-current" />
                                    <span className="capitalize">{PRIORITY_LABELS[priority]}</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="assigneeId"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel className="text-xs uppercase tracking-wide text-muted-foreground">
                            Giao cho
                          </FormLabel>
                          <Select
                            value={field.value ?? ""}
                            onValueChange={(value) => field.onChange(value || null)}
                            disabled={isSaving || workspaceMembers.length === 0}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Không giao cho ai" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="">Không giao</SelectItem>
                              {workspaceMembers.map((member) => (
                                <SelectItem key={member.user_id} value={member.user_id}>
                                  <div className="flex items-center gap-2">
                                    <UserRound className="h-4 w-4" />
                                    <span>{member.user?.full_name || member.user?.email || "Thành viên"}</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className={sectionClassName}>
                  <h3 className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-200">
                    Lịch & cấu trúc
                  </h3>
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="dueDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col gap-2">
                          <FormLabel className="text-xs uppercase tracking-wide text-muted-foreground">
                            Hạn hoàn thành
                          </FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  disabled={isSaving}
                                  className={cn(
                                    "justify-between text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? format(field.value, "PPP", { locale: vi }) : "Chọn thời hạn"}
                                  <CalendarDays className="ml-2 h-4 w-4 opacity-70" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value ?? undefined}
                                onSelect={(date) => field.onChange(date ?? null)}
                                initialFocus
                              />
                              {field.value && (
                                <div className="flex items-center justify-between gap-2 border-t border-slate-200 px-3 py-2 text-xs text-muted-foreground dark:border-slate-700">
                                  <span>{format(field.value, "EEEE", { locale: vi })}</span>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 px-2"
                                    onClick={() => field.onChange(null)}
                                  >
                                    Xóa
                                  </Button>
                                </div>
                              )}
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="folderId"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel className="text-xs uppercase tracking-wide text-muted-foreground">
                            Thư mục
                          </FormLabel>
                          <Select
                            value={field.value ?? ""}
                            onValueChange={(value) => field.onChange(value || null)}
                            disabled={isLoadingFolders || isSaving}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Không thuộc thư mục" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="">Không thuộc thư mục</SelectItem>
                              {folderOptions.map((folder) => (
                                <SelectItem key={folder.id} value={folder.id}>
                                  <div className="flex items-center gap-2">
                                    <FolderPlus className="h-4 w-4 opacity-70" />
                                    <span>
                                      {"".padStart(folder.depth * 2, "·")}
                                      {folder.depth > 0 ? " " : ""}
                                      {folder.name}
                                    </span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="tags"
                      render={() => (
                        <FormItem className="space-y-2">
                          <FormLabel className="text-xs uppercase tracking-wide text-muted-foreground">
                            Thẻ
                          </FormLabel>
                          <div className="flex flex-wrap items-center gap-2">
                            <Input
                              value={tagDraft}
                              onChange={(event) => setTagDraft(event.target.value)}
                              onKeyDown={(event) => {
                                if (event.key === "Enter" || event.key === ",") {
                                  event.preventDefault();
                                  handleAddTag();
                                }
                              }}
                              placeholder="Nhập thẻ và nhấn Enter"
                              className="max-w-[220px]"
                              disabled={isSaving}
                            />
                            <Button type="button" variant="secondary" size="sm" onClick={handleAddTag} disabled={!tagDraft.trim() || isSaving}>
                              <Plus className="mr-1 h-4 w-4" />
                              Thêm
                            </Button>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {(form.watch("tags") ?? []).map((tag) => (
                              <Badge key={tag} variant="outline" className="flex items-center gap-1 text-xs">
                                <Hash className="h-3 w-3" />
                                {tag}
                                <button
                                  type="button"
                                  className="ml-1 text-muted-foreground hover:text-destructive"
                                  onClick={() => handleRemoveTag(tag)}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </button>
                              </Badge>
                            ))}
                          </div>
                          <FormDescription className="text-xs">
                            Sử dụng thẻ để phân loại và tìm kiếm công việc nhanh hơn.
                          </FormDescription>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className={sectionClassName}>
                  <h3 className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-200">
                    Đính kèm
                  </h3>
                  <div className="space-y-3">
                    <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-4 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-300">
                      <label className="flex cursor-pointer items-center gap-3" htmlFor="task-attachments">
                        <Paperclip className="h-4 w-4 text-indigo-500" />
                        <span>Nhấn để chọn tệp (PDF, hình ảnh, tài liệu...)</span>
                      </label>
                      <Input id="task-attachments" type="file" multiple className="hidden" onChange={handleAttachmentsChange} disabled={isSaving} />
                    </div>

                    {attachments.length > 0 && (
                      <ul className="space-y-2 text-sm">
                        {attachments.map((file) => (
                          <li key={file.name} className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 px-3 py-2 text-slate-600 dark:border-slate-700 dark:text-slate-300">
                            <div className="flex items-center gap-2">
                              <Paperclip className="h-4 w-4" />
                              <span className="line-clamp-1">{file.name}</span>
                            </div>
                            <span className="text-xs text-muted-foreground">{Math.round(file.size / 1024)} KB</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter className="border-t border-slate-200 pt-4 dark:border-slate-800">
              <Button
                type="button"
                variant="ghost"
                onClick={() => onOpenChange(false)}
                disabled={isSaving}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                {isSaving ? "Đang tạo..." : "Tạo công việc"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

interface RichTextToolbarProps {
  editor: ReturnType<typeof useEditor>;
  disabled?: boolean;
}

function RichTextToolbar({ editor, disabled }: RichTextToolbarProps) {
  if (!editor) return null;

  const ToolbarButton = ({
    icon: Icon,
    active,
    onClick,
    label,
  }: {
    icon: typeof Bold;
    active?: boolean;
    onClick: () => void;
    label: string;
  }) => (
    <Button
      type="button"
      variant={active ? "secondary" : "ghost"}
      size="sm"
      className="h-8 w-8 p-0"
      onClick={onClick}
      disabled={disabled}
      title={label}
    >
      <Icon className="h-4 w-4" />
    </Button>
  );

  return (
    <div className="flex items-center gap-1 border-b border-slate-200 px-2 py-1 dark:border-slate-800">
      <ToolbarButton
        icon={Bold}
        label="Đậm"
        active={editor.isActive("bold")}
        onClick={() => editor.chain().focus().toggleBold().run()}
      />
      <ToolbarButton
        icon={Italic}
        label="Nghiêng"
        active={editor.isActive("italic")}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      />
      <ToolbarButton
        icon={List}
        label="Danh sách chấm"
        active={editor.isActive("bulletList")}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      />
      <ToolbarButton
        icon={ListOrdered}
        label="Danh sách số"
        active={editor.isActive("orderedList")}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      />
      <ToolbarButton
        icon={Link}
        label="Link"
        active={editor.isActive("link")}
        onClick={() => {
          const url = window.prompt("Nhập URL");
          if (!url) return;
          // Link extension removed - basic text only
          editor.chain().focus().run();
        }}
      />
      <ToolbarButton
        icon={RemoveFormatting}
        label="Xóa định dạng"
        onClick={() => editor.chain().focus().unsetAllMarks().run()}
      />
      <div className="ml-auto flex items-center gap-1">
        <ToolbarButton icon={Undo} label="Hoàn tác" onClick={() => editor.chain().focus().undo().run()} />
        <ToolbarButton icon={Redo} label="Làm lại" onClick={() => editor.chain().focus().redo().run()} />
      </div>
    </div>
  );
}

function StatusOption({ status }: { status: WorkspaceStatus }) {
  return (
    <div className="flex items-center gap-2">
      <span
        className="inline-flex h-2.5 w-2.5 rounded-full"
        style={{ backgroundColor: status.color ?? "var(--primary-500)" }}
      />
      <span>{status.name}</span>
      {status.wip_limit && (
        <Badge variant="outline" className="ml-2 text-[10px] uppercase tracking-wider">
          WIP {status.wip_limit}
        </Badge>
      )}
    </div>
  );
}


