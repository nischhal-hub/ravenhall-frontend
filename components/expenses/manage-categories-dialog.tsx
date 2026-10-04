"use client"

import { useState } from "react"
import {
  FolderPlus,
  Tag,
  Trash2,
  Edit2,
  Check,
  X,
  Loader2,
  AlertCircle,
  Sparkles,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/modal/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  useExpenseCategoriesQuery,
} from "@/services/queries/expense.query"
import {
  useCreateExpenseCategoryMutation,
  useDeleteExpenseCategoryMutation,
  useUpdateExpenseCategoryMutation,
} from "@/services/mutations/expense.mutations"
import type { ExpenseCategory } from "@/types/expense-response.types"
import { toast } from "sonner"

interface ManageCategoriesDialogProps {
  open: boolean
  onClose: () => void
}

export function ManageCategoriesDialog({ open, onClose }: ManageCategoriesDialogProps) {
  const { data: categoriesData, isLoading } = useExpenseCategoriesQuery()
  const categories = categoriesData?.data || []

  // Create state
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")

  // Edit state
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState("")
  const [editDescription, setEditDescription] = useState("")

  const { mutate: createCategory, isPending: isCreating } = useCreateExpenseCategoryMutation()
  const { mutate: updateCategory, isPending: isUpdating } = useUpdateExpenseCategoryMutation()
  const { mutate: deleteCategory, isPending: isDeleting } = useDeleteExpenseCategoryMutation()

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    createCategory(
      {
        name: name.trim(),
        description: description.trim() || undefined,
      },
      {
        onSuccess: () => {
          setName("")
          setDescription("")
        },
      }
    )
  }

  const startEdit = (cat: ExpenseCategory) => {
    setEditingId(cat.id)
    setEditName(cat.name)
    setEditDescription(cat.description || "")
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditName("")
    setEditDescription("")
  }

  const handleSaveEdit = (id: string) => {
    if (!editName.trim()) return

    updateCategory(
      {
        id,
        payload: {
          name: editName.trim(),
          description: editDescription.trim() || undefined,
        },
      },
      {
        onSuccess: () => {
          cancelEdit()
        },
      }
    )
  }

  const handleDelete = (cat: ExpenseCategory) => {
    if (cat.expenseCount > 0) {
      toast.error(
        `Cannot delete "${cat.name}" because it contains ${cat.expenseCount} expense(s). Please reassign them first.`
      )
      return
    }

    if (confirm(`Are you sure you want to delete category "${cat.name}"?`)) {
      deleteCategory(cat.id)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-xl p-0 max-h-[88vh] overflow-y-auto">
        <DialogHeader className="p-6 pb-2 border-b">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <Tag className="size-4" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold">Expense Categories</DialogTitle>
              <DialogDescription className="text-xs">
                Manage custom and default business expense classifications
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="p-6 space-y-6">
          {/* Add New Category Card */}
          <form
            onSubmit={handleCreate}
            className="rounded-lg border border-border/80 bg-muted/20 p-4 space-y-3"
          >
            <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
              <FolderPlus className="size-3.5 text-primary" />
              <span>Create New Category</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="cat-name" className="text-[11px]">
                  Category Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="cat-name"
                  required
                  placeholder="e.g. Lawn Mowing, Insurance"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-8 text-xs"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="cat-desc" className="text-[11px]">Description (optional)</Label>
                <Input
                  id="cat-desc"
                  placeholder="e.g. Ground upkeep & turf fees"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="h-8 text-xs"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                size="sm"
                disabled={!name.trim() || isCreating}
                className="h-8 text-xs gap-1.5"
              >
                {isCreating ? (
                  <>
                    <Loader2 className="size-3 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <FolderPlus className="size-3.5" />
                    Add Category
                  </>
                )}
              </Button>
            </div>
          </form>

          {/* Categories List */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
              <span>Existing Categories ({categories.length})</span>
              <span>Total Spent</span>
            </div>

            {isLoading ? (
              <div className="p-8 text-center text-xs text-muted-foreground space-y-2">
                <Loader2 className="size-5 animate-spin mx-auto text-primary" />
                <p>Loading categories...</p>
              </div>
            ) : categories.length === 0 ? (
              <div className="p-6 text-center text-xs text-muted-foreground rounded-lg border border-dashed">
                No categories found.
              </div>
            ) : (
              <div className="divide-y divide-border border rounded-lg bg-card overflow-hidden max-h-72 overflow-y-auto">
                {categories.map((cat) => {
                  const isEditing = editingId === cat.id

                  return (
                    <div
                      key={cat.id}
                      className="p-3 flex items-center justify-between gap-3 text-xs hover:bg-muted/30 transition-colors"
                    >
                      {isEditing ? (
                        <div className="flex-1 flex flex-col sm:flex-row gap-2">
                          <Input
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            placeholder="Name"
                            className="h-7 text-xs flex-1"
                          />
                          <Input
                            value={editDescription}
                            onChange={(e) => setEditDescription(e.target.value)}
                            placeholder="Description"
                            className="h-7 text-xs flex-1"
                          />
                          <div className="flex items-center gap-1">
                            <Button
                              type="button"
                              size="icon"
                              variant="default"
                              onClick={() => handleSaveEdit(cat.id)}
                              disabled={isUpdating}
                              className="size-7"
                            >
                              <Check className="size-3.5" />
                            </Button>
                            <Button
                              type="button"
                              size="icon"
                              variant="ghost"
                              onClick={cancelEdit}
                              className="size-7"
                            >
                              <X className="size-3.5" />
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-foreground truncate">
                                {cat.name}
                              </span>
                              {cat.isDefault && (
                                <Badge variant="secondary" className="text-[9px] py-0 px-1 font-normal">
                                  Default
                                </Badge>
                              )}
                              <span className="text-[11px] text-muted-foreground">
                                • {cat.expenseCount} {cat.expenseCount === 1 ? "expense" : "expenses"}
                              </span>
                            </div>
                            {cat.description && (
                              <p className="text-[11px] text-muted-foreground truncate mt-0.5">
                                {cat.description}
                              </p>
                            )}
                          </div>

                          <div className="flex items-center gap-3 shrink-0">
                            <span className="font-mono font-semibold text-foreground">
                              ${cat.totalSpent.toFixed(2)}
                            </span>

                            <div className="flex items-center gap-0.5">
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => startEdit(cat)}
                                className="size-7 text-muted-foreground hover:text-foreground"
                                title="Edit category"
                              >
                                <Edit2 className="size-3" />
                              </Button>

                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDelete(cat)}
                                disabled={isDeleting}
                                className="size-7 text-muted-foreground hover:text-destructive"
                                title={
                                  cat.expenseCount > 0
                                    ? "Cannot delete category linked to expenses"
                                    : "Delete category"
                                }
                              >
                                <Trash2 className="size-3" />
                              </Button>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          <div className="flex justify-end pt-2 border-t">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
