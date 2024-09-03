import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

//To do: Add more reasons and some mechanism or button redirect to other services
const Custom404: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <Card className="max-w-lg text-center shadow-lg">
        <CardHeader>
          <CardTitle className="text-6xl font-bold text-red-600">404</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xl font-semibold mb-4">
            Oops! We couldn't find the page you're looking for.
          </p>
          <p className="mb-6">
            It seems the page you were trying to reach doesn't exist or has been moved. Don't worry, you can find plenty of other things on our homepage.
          </p>
          <Link href="/">
            <Button className="mb-6">
              Take Me Home
            </Button>
          </Link>
          <Accordion type="single" collapsible>
            <AccordionItem value="faq1">
              <AccordionTrigger>Why did I see this page?</AccordionTrigger>
              <AccordionContent>
                This might have happened because the page was removed, the URL was mistyped, or the page never existed.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="faq2">
              <AccordionTrigger>How can I find what I'm looking for?</AccordionTrigger>
              <AccordionContent>
                You can go back to our homepage and use the navigation menu to find what you need, or contact our support team for assistance.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="faq3">
              <AccordionTrigger>Can I report this issue?</AccordionTrigger>
              <AccordionContent>
                Absolutely! If you believe this is an error, please let us know through our support page.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
};

export default Custom404;
