'use client';

import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input'; // Assuming Input might be needed for entity ID
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';

interface ReportModalProps {
    isOpen: boolean;
    onClose: () => void;
    reportedEntityType: 'user' | 'merchant' | 'post' | 'reel';
    reportedEntityId: string;
}

const ReportModal: React.FC<ReportModalProps> = ({
    isOpen,
    onClose,
    reportedEntityType,
    reportedEntityId,
}) => {
    const [reason, setReason] = useState<string>('');
    const [additionalDetails, setAdditionalDetails] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const { toast } = useToast();

    const handleReasonChange = (value: string) => {
        setReason(value);
    };

    const handleSubmit = async () => {
        if (!reason) {
            toast({
                title: 'Error',
                description: 'Please select a reason for the report.',
                variant: 'destructive',
            });
            return;
        }

        setIsSubmitting(true);
        try {
            await axios.post('/api/reports', {
                reported_entity_type: reportedEntityType,
                reported_entity_id: reportedEntityId,
                reason: reason + (additionalDetails ? ` - ${additionalDetails}` : ''),
            });
            toast({
                title: 'Success',
                description: 'Your report has been submitted. We will review it shortly.',
            });
            onClose();
        } catch (error: any) {
            console.error('Failed to submit report:', error);
            toast({
                title: 'Error',
                description: error.response?.data?.detail || 'Failed to submit report. Please try again.',
                variant: 'destructive',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Report {reportedEntityType}</DialogTitle>
                    <DialogDescription>
                        Help us keep the platform safe by reporting inappropriate content.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="entityType" className="text-right">
                            Reporting
                        </Label>
                        <Input
                            id="entityType"
                            value={`${reportedEntityType} (ID: ${reportedEntityId})`}
                            className="col-span-3"
                            readOnly
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="reason" className="text-right">
                            Reason
                        </Label>
                        <Select onValueChange={handleReasonChange} value={reason}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select a reason" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="inappropriate_content">Inappropriate Content</SelectItem>
                                <SelectItem value="spam">Spam</SelectItem>
                                <SelectItem value="harassment">Harassment</SelectItem>
                                <SelectItem value="misinformation">Misinformation</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    {reason === 'other' && (
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="additionalDetails" className="text-right">
                                Details
                            </Label>
                            <Textarea
                                id="additionalDetails"
                                placeholder="Please provide more details"
                                className="col-span-3"
                                value={additionalDetails}
                                onChange={(e) => setAdditionalDetails(e.target.value)}
                            />
                        </div>
                    )}
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={isSubmitting}>
                        {isSubmitting ? 'Submitting...' : 'Submit Report'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ReportModal;
