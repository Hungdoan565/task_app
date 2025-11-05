import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button, type ButtonProps } from "@/components/ui/button"

export interface ConfirmDialogOptions {
  title?: ReactNode
  description?: ReactNode
  confirmText?: string
  cancelText?: string
  confirmVariant?: ButtonProps["variant"]
  cancelVariant?: ButtonProps["variant"]
  icon?: ReactNode
  hideCancel?: boolean
}

interface ConfirmDialogState {
  open: boolean
  options: Required<Omit<ConfirmDialogOptions, "description" | "title" | "icon" | "hideCancel">> & {
    title: ReactNode
    description: ReactNode
    icon: ReactNode
    hideCancel: boolean
  }
  resolver?: (value: boolean) => void
}

interface ConfirmDialogContextValue {
  confirm: (options?: ConfirmDialogOptions) => Promise<boolean>
}

const defaultOptions: ConfirmDialogState["options"] = {
  title: "Bạn có chắc chắn?",
  description: null,
  confirmText: "Xác nhận",
  cancelText: "Huỷ",
  confirmVariant: "default",
  cancelVariant: "outline",
  icon: null,
  hideCancel: false,
}

const initialState: ConfirmDialogState = {
  open: false,
  options: defaultOptions,
}

const ConfirmDialogContext = createContext<ConfirmDialogContextValue | null>(null)

export function ConfirmDialogProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ConfirmDialogState>(initialState)

  const closeDialog = useCallback((result: boolean) => {
    setState((previous) => {
      previous.resolver?.(result)
      return {
        ...initialState,
        options: defaultOptions,
      }
    })
  }, [])

  const confirm = useCallback<ConfirmDialogContextValue["confirm"]>((options) => {
    return new Promise<boolean>((resolve) => {
      setState({
        open: true,
        resolver: resolve,
        options: {
          ...defaultOptions,
          ...options,
        },
      })
    })
  }, [])

  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (!open) {
        closeDialog(false)
      }
    },
    [closeDialog]
  )

  const handleCancel = useCallback(() => {
    closeDialog(false)
  }, [closeDialog])

  const handleConfirm = useCallback(() => {
    closeDialog(true)
  }, [closeDialog])

  const value = useMemo<ConfirmDialogContextValue>(() => ({ confirm }), [confirm])

  const { options } = state

  return (
    <ConfirmDialogContext.Provider value={value}>
      {children}
      <Dialog open={state.open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="space-y-2">
            {options.icon ? (
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-600 dark:bg-slate-900 dark:text-slate-300">
                {options.icon}
              </div>
            ) : null}
            {options.title ? <DialogTitle>{options.title}</DialogTitle> : null}
            {options.description ? (
              <DialogDescription>{options.description}</DialogDescription>
            ) : null}
          </DialogHeader>
          <DialogFooter className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:space-x-0">
            {options.hideCancel ? null : (
              <Button
                variant={options.cancelVariant}
                onClick={handleCancel}
                className="sm:ml-auto"
              >
                {options.cancelText}
              </Button>
            )}
            <Button
              variant={options.confirmVariant}
              onClick={handleConfirm}
              autoFocus
            >
              {options.confirmText}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ConfirmDialogContext.Provider>
  )
}

export function useConfirmDialog() {
  const context = useContext(ConfirmDialogContext)
  if (!context) {
    throw new Error("useConfirmDialog must be used within a ConfirmDialogProvider")
  }
  return context
}


