"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NavigationMenuAll } from "@/components/navigationBar/NavigationMenuAll";
import { FeaturesSection } from "@/components/landingpage/featureSelection";
import ProjectVideo from "@/components/landingpage/projectVideo";
import { CompareText } from "@/components/landingpage/compare";
import { TeamLandingPage } from "@/components/landingpage/team";
import { ChatWithFile } from "@/components/landingpage/chatWithFile";
import { IconAssetFilled } from "@tabler/icons-react";
export default function LandingPage() {
  return (
    <>
      {/* Navigation Menu */}
      <div>
        <NavigationMenuAll />
      </div>

      {/* Main content container */}
      <div className="px-4 py-10 mx-auto max-w-7xl">
        {/* Header */}
        <header className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Welcome to DocuSpace!
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600">
            Revolutionizing document management with AI and automation.
          </p>
          <Link href='/auth/register'>
            <Button className="mt-6">
              Sign-up to Explore
            </Button>
          </Link>
        </header>
{/* Compare Section */}
        <section className="mt-16">
          <CompareText />
        </section>
        <section className="mt-16">
          <ChatWithFile />
        </section>
        {/* Features Section */}
        <section className="mt-16">
          <FeaturesSection />
        </section>

        {/* Project Video Section */}
        <section className="mt-16">
          <ProjectVideo />
        </section>

        
      </div>

      <footer className="flex items-center justify-between p-4 bg-gray-100 text-black">
      <div className="text-lg font-semibold"><IconAssetFilled /><p>DocuSpace</p></div>
      <div className="flex items-center">
        <span className="mr-4">Developed by:</span>
        <TeamLandingPage />
      </div>
    </footer>
    </>
  );
}
