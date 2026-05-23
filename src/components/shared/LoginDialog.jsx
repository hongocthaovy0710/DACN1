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
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const LoginDialog = ({ open, onClose, onLoginSuccess }) => {
  const handleLogin = useGoogleAuth({
    onSuccess: () => {
      onClose();
      onLoginSuccess?.();
      toast.success("Login successful");
    },
  });
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-94">
        <DialogHeader>
          <DialogTitle>Login to your account</DialogTitle>
          <DialogDescription>
            Log in to unlock AI itineraries and save your plans. Sync your
            travel schedules across all your devices.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-6">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <label htmlFor="password">Password</label>

              <a
                href="#"
                className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
              >
                Forgot your password?
              </a>
            </div>

            <Input id="password" type="password" required />
          </div>
        </div>
        <DialogFooter className="grid grid-cols-1 gap-3 mt-3">
          <Button type="submit" className="w-full rounded-md" disabled={true}>
            Login
          </Button>
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
