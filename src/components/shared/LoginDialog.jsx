import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useGoogleAuth } from "@/services/authApi";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { FaGoogle } from "react-icons/fa6";

const LoginDialog = ({ open, onclose, onLoginSuccess }) => {
  const handleLogin = useGoogleAuth({
    onSuccess: () => {
      onclose();
      onLoginSuccess?.();
      toast.success("Login successful");
    },
  });
  return (
    <Dialog open={open} onOpenChange={onclose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            onClick={handleLogin}
            type="submit"
            className={"w-full rounded-md"}
          >
            <FaGoogle /> Login with Google
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LoginDialog;
