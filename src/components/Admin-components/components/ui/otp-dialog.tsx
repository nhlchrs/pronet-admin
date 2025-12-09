// src/components/OtpVerificationModal.tsx
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import { useNavigate } from "react-router";
interface OtpVerificationModalProps {
  open: boolean;
  onClose: () => void;
  email: string;
  onSuccess: () => void;
}

const OtpVerificationModal: React.FC<OtpVerificationModalProps> = ({
  open,
  onClose,
  email,
  onSuccess,
}) => {
  const { toast } = useToast();
  const [otp, setOtp] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);

  console.log(email,"DSsd")
  const navigate = useNavigate()
  const handleVerify = async () => {
    if (otp.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter a valid 6-digit OTP.",
        variant: "destructive",
      });
      return;
    }

    setVerifying(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/verify`, { email, otp });
       const { token, user } = res.data.data;
      if (res.data?.status === 1) {
        toast({
          title: "Account Verified",
          description: "Your account has been successfully verified.",
        });
        localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
       if (user.role === "Admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }

        onClose();
      } else {
        toast({
          title: "Invalid OTP",
          description: res.data.message || "Please try again.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Verification Failed",
        description: error.response?.data?.message || "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setVerifying(false);
    }
  };

  const handleResendOtp = async () => {
    setResending(true);
    try {
      await axios.post(`${import.meta.env.VITE_BASE_URL}/api/resendOtp`, { email });
      toast({
        title: "OTP Resent",
        description: "A new OTP has been sent to your email/phone.",
      });
    } catch {
      toast({
        title: "Failed to Resend OTP",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setResending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Verify Your Account</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Enter the 6-digit OTP sent to <span className="font-medium">{email}</span>
          </p>

          <Input
            maxLength={6}
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />

          <div className="flex justify-between items-center gap-2">
            <Button onClick={handleVerify} disabled={verifying}>
              {verifying ? "Verifying..." : "Verify OTP"}
            </Button>
            <Button
              variant="outline"
              onClick={handleResendOtp}
              disabled={resending}
            >
              {resending ? "Resending..." : "Resend OTP"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OtpVerificationModal;
