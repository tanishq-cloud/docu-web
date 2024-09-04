import React from "react";
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const CheckEmailPage :React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <Card className="max-w-lg text-center shadow-lg">
      <CardHeader>
        <CardTitle>Verify Your Email</CardTitle>
      </CardHeader>
      <CardContent>
        <p>
          A verification link has been sent to your email. Please check your inbox and follow the
          instructions to verify your account.
        </p>
        <Link href="auth/login">
            <Button className="mb-6">
              Login
            </Button>
            </Link>
      </CardContent>
    </Card>
    </div>
  );
};

export default CheckEmailPage;