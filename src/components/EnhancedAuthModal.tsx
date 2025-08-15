import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { Phone, Mail, User, Lock, Eye, EyeOff, ArrowLeft, CheckCircle, Shield } from 'lucide-react';

interface EnhancedAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void;
}

export const EnhancedAuthModal = ({ isOpen, onClose, onLogin }: EnhancedAuthModalProps) => {
  const [activeTab, setActiveTab] = useState('login');
  const [loginData, setLoginData] = useState({ identifier: '', password: '' });
  const [registerData, setRegisterData] = useState({ 
    fullName: '',
    username: '', 
    email: '', 
    mobileNumber: '',
    password: '', 
    confirmPassword: '' 
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // OTP verification states
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpTimer, setOtpTimer] = useState(0);
  const [resendOtpDisabled, setResendOtpDisabled] = useState(false);
  
  const { login, register } = useAuth();

  // Start OTP countdown timer
  const startOtpTimer = () => {
    setOtpTimer(60);
    setResendOtpDisabled(true);
    const interval = setInterval(() => {
      setOtpTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setResendOtpDisabled(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Send OTP
  const handleSendOtp = async () => {
    if (!registerData.email && !registerData.mobileNumber) {
      toast({
        title: 'Error',
        description: 'Please provide either email or mobile number to receive OTP',
        variant: 'destructive'
      });
      return;
    }

    try {
      // Simulate OTP sending
      await new Promise(resolve => setTimeout(resolve, 1000));
      setOtpSent(true);
      startOtpTimer();
      toast({
        title: 'OTP Sent!',
        description: `OTP has been sent to ${registerData.email || registerData.mobileNumber}`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send OTP. Please try again.',
        variant: 'destructive'
      });
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (resendOtpDisabled) return;
    await handleSendOtp();
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginData.identifier || !loginData.password) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);
    try {
      const success = await login(loginData.identifier, loginData.password);
      if (success) {
        toast({
          title: 'Success!',
          description: 'Welcome back to Treesh!',
        });
        onLogin();
      } else {
        toast({
          title: 'Login Failed',
          description: 'Invalid credentials. Please try again.',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!registerData.fullName || !registerData.username || !registerData.email || 
        !registerData.password || !registerData.confirmPassword) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      });
      return;
    }

    // Validate password match
    if (registerData.password !== registerData.confirmPassword) {
      toast({
        title: 'Error',
        description: 'Passwords do not match',
        variant: 'destructive'
      });
      return;
    }

    // Validate password length
    if (registerData.password.length < 6) {
      toast({
        title: 'Error',
        description: 'Password must be at least 6 characters long',
        variant: 'destructive'
      });
      return;
    }

    // Validate OTP
    if (!otpSent || !otpCode) {
      toast({
        title: 'Error',
        description: 'Please verify your OTP',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);
    try {
      const success = await register(
        registerData.username, 
        registerData.email, 
        registerData.password, 
        registerData.confirmPassword
      );
      if (success) {
        toast({
          title: 'Success!',
          description: 'Welcome to Treesh! Your account has been created.',
        });
        onLogin();
      } else {
        toast({
          title: 'Registration Failed',
          description: 'Something went wrong. Please try again.',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Reset form when switching tabs
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setOtpSent(false);
    setOtpCode('');
    setOtpTimer(0);
    setResendOtpDisabled(false);
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg lg:max-w-xl xl:max-w-2xl bg-offwhite max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl lg:text-3xl font-bold text-gray-900 font-treesh">
            Welcome to Treesh
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-gray-100 p-1">
            <TabsTrigger 
              value="login" 
              className="data-[state=active]:bg-offwhite data-[state=active]:text-primary data-[state=active]:shadow-sm"
            >
              Login
            </TabsTrigger>
            <TabsTrigger 
              value="register" 
              className="data-[state=active]:bg-offwhite data-[state=active]:text-primary data-[state=active]:shadow-sm"
            >
              Sign Up
            </TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="space-y-4 mt-6">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-identifier" className="text-sm font-medium text-gray-700">
                  Email or Username
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="login-identifier"
                    type="text"
                    placeholder="Enter your email or username"
                    value={loginData.identifier}
                    onChange={(e) => setLoginData(prev => ({ ...prev, identifier: e.target.value }))}
                    className="pl-10 bg-white border-gray-200 focus:border-primary focus:ring-primary"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="login-password" className="text-sm font-medium text-gray-700">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={loginData.password}
                    onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                    className="pl-10 bg-white border-gray-200 focus:border-primary focus:ring-primary"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-2 h-6 w-6 p-0 hover:bg-gray-100"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary-dark text-white font-medium py-3 text-base" 
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="register" className="space-y-4 mt-6">
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="register-fullname" className="text-sm font-medium text-gray-700">
                  Full Name <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="register-fullname"
                    type="text"
                    placeholder="Enter your full name"
                    value={registerData.fullName}
                    onChange={(e) => setRegisterData(prev => ({ ...prev, fullName: e.target.value }))}
                    className="pl-10 bg-white border-gray-200 focus:border-primary focus:ring-primary"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="register-username" className="text-sm font-medium text-gray-700">
                  Username <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="register-username"
                    type="text"
                    placeholder="Choose a username"
                    value={registerData.username}
                    onChange={(e) => setRegisterData(prev => ({ ...prev, username: e.target.value }))}
                    className="pl-10 bg-white border-gray-200 focus:border-primary focus:ring-primary"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="register-email" className="text-sm font-medium text-gray-700">
                  Email <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="register-email"
                    type="email"
                    placeholder="Enter your email"
                    value={registerData.email}
                    onChange={(e) => setRegisterData(prev => ({ ...prev, email: e.target.value }))}
                    className="pl-10 bg-white border-gray-200 focus:border-primary focus:ring-primary"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="register-mobile" className="text-sm font-medium text-gray-700">
                  Mobile Number <span className="text-gray-400 text-xs">(Optional)</span>
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="register-mobile"
                    type="tel"
                    placeholder="Enter mobile number"
                    value={registerData.mobileNumber}
                    onChange={(e) => setRegisterData(prev => ({ ...prev, mobileNumber: e.target.value }))}
                    className="pl-10 bg-white border-gray-200 focus:border-primary focus:ring-primary"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="register-password" className="text-sm font-medium text-gray-700">
                  Password <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="register-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    value={registerData.password}
                    onChange={(e) => setRegisterData(prev => ({ ...prev, password: e.target.value }))}
                    className="pl-10 bg-white border-gray-200 focus:border-primary focus:ring-primary"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-2 h-6 w-6 p-0 hover:bg-gray-100"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="register-confirm-password" className="text-sm font-medium text-gray-700">
                  Confirm Password <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="register-confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={registerData.confirmPassword}
                    onChange={(e) => setRegisterData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className="pl-10 bg-white border-gray-200 focus:border-primary focus:ring-primary"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-2 h-6 w-6 p-0 hover:bg-gray-100"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>

              {/* OTP Verification Section */}
              {!otpSent ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleSendOtp}
                  className="w-full bg-primary hover:bg-primary-dark text-white font-medium py-3 border-primary"
                  disabled={!registerData.email && !registerData.mobileNumber}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Send OTP for Verification
                </Button>
              ) : (
                <div className="space-y-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium text-blue-900">OTP Verification <span className="text-red-500">*</span></Label>
                    <div className="flex items-center space-x-2">
                      {otpTimer > 0 && (
                        <span className="text-xs text-blue-600">
                          Resend in {otpTimer}s
                        </span>
                      )}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleResendOtp}
                        disabled={resendOtpDisabled}
                        className="text-xs h-7 px-2 text-blue-600 hover:text-blue-700 hover:bg-blue-100"
                      >
                        Resend OTP
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Input
                      type="text"
                      placeholder="Enter 6-digit OTP"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      maxLength={6}
                      className="h-10 text-center text-lg font-mono tracking-widest bg-white border-blue-300 focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                    {otpCode.length === 6 && (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    )}
                  </div>
                  
                  <p className="text-xs text-blue-600">
                    OTP sent to: {registerData.email || registerData.mobileNumber}
                  </p>
                </div>
              )}
              
              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary-dark text-white font-medium py-3 text-base" 
                disabled={isLoading || !otpSent || otpCode.length !== 6}
              >
                {isLoading ? 'Creating account...' : 'Create Account'}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
        
        <div className="text-center text-xs sm:text-sm text-muted-foreground pt-4 border-t border-gray-200">
          <p>By continuing, you agree to our <span className="text-primary hover:underline cursor-pointer">Terms of Service</span> and <span className="text-primary hover:underline cursor-pointer">Privacy Policy</span></p>
        </div>
      </DialogContent>
    </Dialog>
  );
};