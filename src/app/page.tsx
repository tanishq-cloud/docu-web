"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NavigationMenuAll } from "@/components/NavigationMenuAll";
export default function LandingPage() {
  return (
    <>
    <div><NavigationMenuAll /> </div>
    
    <div className="px-4 py-10 mx-auto max-w-7xl">
      <header className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-4">Welcome to TransformoDocs!</h1>
        <p className="text-lg text-gray-600">
          Revolutionizing document management with AI and automation.
        </p>
        <Link href='/register' >
        <Button className="mt-6">
          Sign-up to Explore
        </Button>
        </Link>
      </header>

      {/* About SIH Section, it will be up till internal hackathon */}
      <section className="mb-16">
        <Card>
          <CardHeader>
            <CardTitle>About Smart India Hackathon</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              The Smart India Hackathon (SIH) is a premier nationwide initiative
              designed to engage students in solving some of the most pressing
              challenges faced in everyday life. Launched to foster a culture of
              innovation and practical problem-solving, SIH provides a dynamic
              platform for students to develop and showcase their creative
              solutions to real-world problems.
              <br />
              <br />
              Since its inception, SIH has garnered significant success in
              promoting out-of-the-box thinking among young minds, particularly
              engineering students from across India. Each edition has built on
              the previous one, refining its approach and expanding its impact.
              The hackathon not only offers students an opportunity to showcase
              their skills but also encourages collaboration with industry
              experts, government agencies, and other stakeholders.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Problem statement Section */}
      <section className="mb-16">
        <Card>
          <CardHeader>
            <CardTitle>Problem Statement</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              <strong>Background:</strong> In today’s digital age, the ability
              to efficiently manage documents is crucial for organizations.
              However, a significant challenge arises when dealing with
              non-machine-readable documents such as PDFs or Word documents.
              These formats hinder automation and make it difficult to extract
              meaningful insights from the data they contain.
              <br />
              <br />
              <strong>Description:</strong> The TransformoDocs application aims
              to solve this problem by:
              <ul className="list-disc pl-6 mt-2">
                <li>
                  Restricting software applications from ingesting
                  non-machine-readable document formats.
                </li>
                <li>
                  Automatically generating machine-readable documents, whether
                  scanned, generated, or from other sources.
                </li>
              </ul>
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Expected solution Section, we will modify it later */}
      <section className="mb-16">
        <Card>
          <CardHeader>
            <CardTitle>Expected Solution</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              The TransformoDocs application will address the challenges
              associated with managing non-machine-readable documents by
              developing a comprehensive document transformation solution. It
              will provide:
              <ul className="list-disc pl-6 mt-2">
                <li>Efficient data extraction and processing.</li>
                <li>
                  Workflow automation, data quality improvement, and scalability.
                </li>
                <li>
                  Integration with external systems and advanced analytics.
                </li>
                <li>
                  Compliance with regulatory requirements for unlocking the
                  value of data.
                </li>
              </ul>
            </p>
          </CardContent>
        </Card>
      </section>

      <section className="mb-16">
        <Card>
          <CardHeader>
            <CardTitle>Organization Information</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              <strong>Organization:</strong> Ministry of Electronics and
              Information Technology
              <br />
              <strong>Department:</strong> Co-ordination Division
              <br />
              <strong>Category:</strong> Software
              <br />
              <strong>Theme:</strong> Smart Automation
            </p>
          </CardContent>
        </Card>
      </section>

      <footer className="text-center">
      <Link href='register'>
        <Button size="lg">
          Visit Smart India Hackathon
        </Button>
        </Link>
      </footer>
    </div>
    </>
  );
}
