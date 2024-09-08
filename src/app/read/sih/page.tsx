'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const SIHPage: React.FC = () => {
  return (
    <>
      <div className="flex flex-col items-center mb-16 px-4 md:px-16 lg:px-32">
        {/* About SIH Section */}
        <section className="mb-16 w-full max-w-4xl">
          <Card>
            <CardHeader>
              <CardTitle>About Smart India Hackathon</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                The Smart India Hackathon (SIH) is a premier nationwide initiative designed to engage students in solving some of the most pressing challenges faced in everyday life. Launched to foster a culture of innovation and practical problem-solving, SIH provides a dynamic platform for students to develop and showcase their creative solutions to real-world problems.
                <br />
                <br />
                Since its inception, SIH has garnered significant success in promoting out-of-the-box thinking among young minds, particularly engineering students from across India. Each edition has built on the previous one, refining its approach and expanding its impact. The hackathon not only offers students an opportunity to showcase their skills but also encourages collaboration with industry experts, government agencies, and other stakeholders.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Problem Statement Section */}
        <section className="mb-16 w-full max-w-4xl">
          <Card>
            <CardHeader>
              <CardTitle>Problem Statement</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                <strong>Background:</strong> In today’s digital age, the ability to efficiently manage documents is crucial for organizations. However, a significant challenge arises when dealing with non-machine-readable documents such as PDFs or Word documents. These formats hinder automation and make it difficult to extract meaningful insights from the data they contain.
                <br />
                <br />
                <strong>Description:</strong> The TransformoDocs application aims to solve this problem by:
              </p>
              <ul className="list-disc pl-6 mt-2 text-gray-600">
                <li>Restricting software applications from ingesting non-machine-readable document formats.</li>
                <li>Automatically generating machine-readable documents, whether scanned, generated, or from other sources.</li>
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* Expected Solution Section */}
        <section className="mb-16 w-full max-w-4xl">
          <Card>
            <CardHeader>
              <CardTitle>Expected Solution</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                The TransformoDocs application will address the challenges associated with managing non-machine-readable documents by developing a comprehensive document transformation solution. It will provide:
              </p>
              <ul className="list-disc pl-6 mt-2 text-gray-600">
                <li>Efficient data extraction and processing.</li>
                <li>Workflow automation, data quality improvement, and scalability.</li>
                <li>Integration with external systems and advanced analytics.</li>
                <li>Compliance with regulatory requirements for unlocking the value of data.</li>
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* Organization Information Section */}
        <section className="mb-16 w-full max-w-4xl">
          <Card>
            <CardHeader>
              <CardTitle>Organization Information</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                <strong>Organization:</strong> Ministry of Electronics and Information Technology
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

        {/* Footer Section */}
        <footer className="text-center w-full max-w-4xl">
          <Link href="https://sih.gov.in/" passHref>
            <Button size="lg">Visit Smart India Hackathon</Button>
          </Link>
        </footer>
      </div>
    </>
  );
};

export default SIHPage;
