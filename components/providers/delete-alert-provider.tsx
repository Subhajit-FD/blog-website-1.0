"use client";

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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createContext, useContext, useState, ReactNode } from "react";

interface DeleteOptions {
  title?: string;
  description?: string;
  verificationText?: string; // Text the user must type to confirm
  onConfirm: () => Promise<void> | void;
}

interface DeleteAlertContextType {
  confirmDelete: (options: DeleteOptions) => void;
}

const DeleteAlertContext = createContext<DeleteAlertContextType | null>(null);

export const useDeleteAlert = () => {
  const context = useContext(DeleteAlertContext);
  if (!context) {
    throw new Error("useDeleteAlert must be used within a DeleteAlertProvider");
  }
  return context;
};

export const DeleteAlertProvider = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState<DeleteOptions | null>(null);
  const [inputValue, setInputValue] = useState("");

  const confirmDelete = (opts: DeleteOptions) => {
    setOptions(opts);
    setInputValue("");
    setOpen(true);
  };

  const handleConfirm = async () => {
    if (!options) return;

    setLoading(true);
    try {
      await options.onConfirm();
    } catch (error) {
      console.error("Delete action failed", error);
    } finally {
      setLoading(false);
      setOpen(false);
      setOptions(null);
    }
  };

  // If verificationText is provided, input must match it.
  // Otherwise, just enable button.
  const isConfirmDisabled = options?.verificationText
    ? inputValue !== options.verificationText
    : false;

  return (
    <DeleteAlertContext.Provider value={{ confirmDelete }}>
      {children}
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {options?.title || "Are you absolutely sure?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {options?.description ||
                "This action cannot be undone. This will permanently delete the resource."}
            </AlertDialogDescription>
          </AlertDialogHeader>

          {options?.verificationText && (
            <div className="my-4 space-y-2">
              <Label htmlFor="verification-input">
                Type{" "}
                <span className="font-bold">{options.verificationText}</span> to
                confirm.
              </Label>
              <Input
                id="verification-input"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={options.verificationText}
                autoComplete="off"
              />
            </div>
          )}

          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
            <ButtonWrapper
              variant="destructive"
              onClick={(e) => {
                e.preventDefault();
                handleConfirm();
              }}
              disabled={isConfirmDisabled || loading}
            >
              {loading ? "Deleting..." : "Delete"}
            </ButtonWrapper>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DeleteAlertContext.Provider>
  );
};

// Helper component to avoid import circles or extensive prop passing if using standard Button
// adapting to shadcn AlertDialogAction which acts as a trigger but we need manual control sometimes.
// Actually AlertDialogAction closes the dialog by default. We want to control it async.
// So we use a custom button inside specific parts or prevent default.
// Changes: We use a regular button styled as destructive, behaving like AlertDialogAction but with explicit click handling.
import { Button } from "@/components/ui/button";

const ButtonWrapper = ({ onClick, disabled, children, variant }: any) => {
  return (
    <Button variant={variant} onClick={onClick} disabled={disabled}>
      {children}
    </Button>
  );
};
