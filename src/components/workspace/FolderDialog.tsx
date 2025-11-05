import { useEffect, useState } from 'react'

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

interface FolderDialogProps {
  open: boolean
  mode: 'create' | 'rename'
  parentName?: string
  defaultValues?: {
    name?: string
    description?: string | null
  }
  onOpenChange: (open: boolean) => void
  onSubmit: (values: { name: string; description?: string | null }) => Promise<void> | void
}

export default function FolderDialog({
  open,
  mode,
  parentName,
  defaultValues,
  onOpenChange,
  onSubmit,
}: FolderDialogProps) {
  const [name, setName] = useState(defaultValues?.name ?? '')
  const [description, setDescription] = useState(defaultValues?.description ?? '')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!open) return
    setName(defaultValues?.name ?? '')
    setDescription(defaultValues?.description ?? '')
  }, [open, defaultValues?.name, defaultValues?.description])

  const title = mode === 'create' ? 'Thêm thư mục mới' : 'Đổi tên thư mục'
  const buttonLabel = mode === 'create' ? 'Tạo thư mục' : 'Lưu thay đổi'

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!name.trim()) return

    setIsSubmitting(true)
    try {
      await onSubmit({
        name: name.trim(),
        description: description.trim() ? description.trim() : undefined,
      })
      onOpenChange(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {mode === 'create' ? (
            <DialogDescription>
              {parentName
                ? `Thư mục mới sẽ nằm trong “${parentName}”.`
                : 'Thư mục mới sẽ nằm ở cấp cao nhất.'}
            </DialogDescription>
          ) : (
            <DialogDescription>Đặt lại tên và mô tả cho thư mục đã chọn.</DialogDescription>
          )}
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="folder-name">Tên thư mục</Label>
            <Input
              id="folder-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Ví dụ: Sprint hiện tại"
              autoFocus
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="folder-description">Mô tả (không bắt buộc)</Label>
            <Textarea
              id="folder-description"
              value={description ?? ''}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Ghi chú ngắn gọn về mục đích của thư mục này"
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Huỷ
            </Button>
            <Button type="submit" disabled={isSubmitting || !name.trim()}>
              {isSubmitting ? 'Đang lưu...' : buttonLabel}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

