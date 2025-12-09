
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { FilePen, Check, Download } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface AgreementLetterProps {
  userName: string;
}

const AgreementLetter = ({ userName }: AgreementLetterProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isSigned, setIsSigned] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  const handleSignAgreement = () => {
    setIsSubmitting(true);
    
    // Simulate signing process
    setTimeout(() => {
      setIsSigned(true);
      setIsSubmitting(false);
      toast({
        title: "Agreement signed successfully",
        description: "Your digital signature has been recorded."
      });
    }, 1500);
  };
  
  const handleDownloadAgreement = () => {
    toast({
      title: "Agreement downloaded",
      description: "Your signed agreement has been downloaded."
    });
  };
  
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FilePen className="h-5 w-5" />
            User Agreement
          </CardTitle>
          <CardDescription>
            Review and sign your Pro Net Solutions affiliate agreement
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="font-medium">Status:</div>
              {isSigned ? (
                <div className="flex items-center text-green-600 gap-1">
                  <Check className="h-4 w-4" />
                  Signed
                </div>
              ) : (
                <div className="text-amber-600">Not signed</div>
              )}
            </div>
            {isSigned && (
              <div className="text-sm text-muted-foreground">
                Signed on {currentDate} by {userName}
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button 
            variant="outline" 
            onClick={handleDownloadAgreement}
            disabled={!isSigned}
          >
            <Download className="mr-2 h-4 w-4" />
            Download Agreement
          </Button>
          <Button onClick={() => setDialogOpen(true)}>
            <FilePen className="mr-2 h-4 w-4" />
            {isSigned ? 'View Agreement' : 'Review & Sign'}
          </Button>
        </CardFooter>
      </Card>
      
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Pro Net Solutions Affiliate Agreement</DialogTitle>
            <DialogDescription>
              Please review the agreement carefully before signing
            </DialogDescription>
          </DialogHeader>
          
          <div className="max-h-[60vh] overflow-y-auto p-4 border rounded-md">
            <div className="space-y-4 text-sm">
              <h3 className="text-lg font-bold text-center">PRO NET SOLUTIONS AFFILIATE AGREEMENT</h3>
              
              <p className="text-center">This Agreement is entered into on {currentDate} between:</p>
              
              <p className="font-bold">Pro Net Solutions Inc. ("Company")</p>
              <p>and</p>
              <p className="font-bold">{userName} ("Affiliate")</p>
              
              <h4 className="font-bold mt-6">1. DEFINITIONS</h4>
              <p>"Commission" means the amount payable to the Affiliate in accordance with Section 4.</p>
              <p>"Referred Customer" means a customer who purchases a Company subscription using the Affiliate's unique referral code.</p>
              
              <h4 className="font-bold mt-4">2. APPOINTMENT</h4>
              <p>Company appoints the Affiliate as a non-exclusive affiliate to promote and market the Company's services in accordance with the terms of this Agreement.</p>
              
              <h4 className="font-bold mt-4">3. OBLIGATIONS OF THE AFFILIATE</h4>
              <p>3.1 The Affiliate shall use reasonable efforts to promote the Company's services.</p>
              <p>3.2 The Affiliate shall not make any representations or warranties regarding the Company or its services other than those contained in the Company's official marketing materials.</p>
              <p>3.3 The Affiliate shall comply with all applicable laws and regulations in performing its obligations under this Agreement.</p>
              
              <h4 className="font-bold mt-4">4. COMMISSION</h4>
              <p>4.1 The Company shall pay the Affiliate a Commission of:</p>
              <ul className="list-disc list-inside ml-4">
                <li>10% on direct referrals (Level 1)</li>
                <li>5% on Level 2 referrals</li>
                <li>3% on Level 3 referrals</li>
                <li>2% on Level 4 referrals</li>
                <li>1% on Level 5 referrals</li>
              </ul>
              
              <p>4.2 Commissions shall be calculated on a monthly basis and paid within 15 days after the end of each calendar month.</p>
              <p>4.3 The Company reserves the right to withhold payment of any Commission that it reasonably believes has been generated in breach of this Agreement.</p>
              
              <h4 className="font-bold mt-4">5. TERM AND TERMINATION</h4>
              <p>5.1 This Agreement shall commence on the date first written above and shall continue until terminated by either party.</p>
              <p>5.2 Either party may terminate this Agreement at any time by giving 30 days' written notice to the other party.</p>
              <p>5.3 The Company may terminate this Agreement immediately if the Affiliate breaches any term of this Agreement.</p>
              
              <h4 className="font-bold mt-4">6. CONFIDENTIALITY</h4>
              <p>The Affiliate shall keep confidential all information and materials received from the Company that are marked confidential or that a reasonable person would consider confidential.</p>
              
              <h4 className="font-bold mt-4">7. LIMITATION OF LIABILITY</h4>
              <p>In no event shall the Company be liable to the Affiliate for any indirect, special, incidental, or consequential damages arising out of this Agreement.</p>
              
              <h4 className="font-bold mt-4">8. GOVERNING LAW</h4>
              <p>This Agreement shall be governed by and construed in accordance with the laws of the state of New York, without regard to its conflict of laws principles.</p>
              
              <h4 className="font-bold mt-4">9. ENTIRE AGREEMENT</h4>
              <p>This Agreement constitutes the entire agreement between the parties with respect to the subject matter hereof and supersedes all prior agreements and understandings, whether written or oral.</p>
              
              <div className="mt-8 pt-8 border-t">
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <p className="font-bold">PRO NET SOLUTIONS INC.</p>
                    <p className="mt-4">By: _______________________</p>
                    <p className="mt-1">Name: John Wilson</p>
                    <p className="mt-1">Title: CEO</p>
                  </div>
                  
                  <div>
                    <p className="font-bold">AFFILIATE</p>
                    <p className="mt-4">By: {isSigned ? `[Digitally Signed]` : "_______________________"}</p>
                    <p className="mt-1">Name: {userName}</p>
                    <p className="mt-1">Date: {isSigned ? currentDate : "____________"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-2">
            {!isSigned ? (
              <>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSignAgreement} disabled={isSubmitting}>
                  {isSubmitting ? "Signing..." : "Sign Agreement"}
                </Button>
              </>
            ) : (
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Close
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AgreementLetter;
