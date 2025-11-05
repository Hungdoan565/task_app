import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useStore } from '@/store/useStore'
import { useWorkspaces } from '@/hooks/useWorkspaces'
import type { Workspace } from '@/types'

const workspaceSchema = z.object({
  name: z.string().min(2, 'Tên workspace phải có ít nhất 2 ký tự').max(120, 'Tên quá dài'),
  description: z
    .string()
    .max(240, 'Mô tả tối đa 240 ký tự')
    .optional()
    .or(z.literal('')),
})

type WorkspaceFormValues = z.infer<typeof workspaceSchema>

export default function WorkspaceEditorDialog() {
  const {
    workspaceEditor,
    closeWorkspaceEditor,
    currentWorkspace,
    setCurrentWorkspace,
  } = useStore()
  const { updateWorkspace } = useWorkspaces()

  const form = useForm<WorkspaceFormValues>({
    resolver: zodResolver(workspaceSchema),
    defaultValues: {
      name: workspaceEditor.workspace?.name ?? '',
      description: workspaceEditor.workspace?.description ?? '',
    },
  })

  useEffect(() => {
    form.reset({
      name: workspaceEditor.workspace?.name ?? '',
      description: workspaceEditor.workspace?.description ?? '',
    })
  }, [workspaceEditor.workspace, form])

  const handleClose = () => {
    if (updateWorkspace.isPending) return
    closeWorkspaceEditor()
  }

  const onSubmit = async (values: WorkspaceFormValues) => {
    if (!workspaceEditor.workspace) return

    const payload = {
      id: workspaceEditor.workspace.id,
      name: values.name.trim(),
      description: values.description?.trim() ? values.description.trim() : null,
    }

    try {
      const updated = await updateWorkspace.mutateAsync(payload)

      if (currentWorkspace?.id === updated.id) {
        const nextWorkspace: Workspace = {
          ...currentWorkspace,
          ...updated,
          members: currentWorkspace.members,
        }
        setCurrentWorkspace(nextWorkspace)
      }

      handleClose()
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Dialog open={workspaceEditor.open} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa workspace</DialogTitle>
          <DialogDescription>
            Cập nhật tên và mô tả để không gian làm việc rõ ràng và dễ tìm kiếm hơn.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên workspace</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Ví dụ: Đội Marketing Q4" autoFocus disabled={updateWorkspace.isPending} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mô tả</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Nhập mô tả ngắn gọn về workspace này"
                      className="resize-none"
                      rows={3}
                      disabled={updateWorkspace.isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="gap-2 sm:justify-end">
              <Button type="button" variant="outline" onClick={handleClose} disabled={updateWorkspace.isPending}>
                Huỷ
              </Button>
              <Button type="submit" disabled={updateWorkspace.isPending}>
                {updateWorkspace.isPending ? 'Đang lưu...' : 'Lưu thay đổi'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}


