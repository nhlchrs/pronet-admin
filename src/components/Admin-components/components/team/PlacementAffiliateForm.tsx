
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const formSchema = z.object({
  affiliateId: z.string().min(1, 'Affiliate is required'),
  targetAffiliateId: z.string().min(1, 'Target affiliate is required'),
  position: z.string().min(1, 'Position is required'),
});

interface PlacementAffiliateFormProps {
  onSuccess: (data: any) => void;
}

const PlacementAffiliateForm = ({ onSuccess }: PlacementAffiliateFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      affiliateId: '',
      targetAffiliateId: '',
      position: '',
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    // Here you would typically send data to an API
    console.log('Form data submitted:', data);
    onSuccess(data);
  };

  // Mock data for affiliates
  const affiliates = [
    { id: 'AF001', name: 'John Doe' },
    { id: 'AF002', name: 'Alice Smith' },
    { id: 'AF003', name: 'Robert Johnson' },
    { id: 'AF004', name: 'Emily Davis' },
    { id: 'AF005', name: 'Michael Wilson' },
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
        <FormField
          control={form.control}
          name="affiliateId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select Affiliate to Place</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select affiliate" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {affiliates.map(affiliate => (
                    <SelectItem key={affiliate.id} value={affiliate.id}>
                      {affiliate.name} ({affiliate.id})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="targetAffiliateId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Place Under</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select target affiliate" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {affiliates.map(affiliate => (
                    <SelectItem key={affiliate.id} value={affiliate.id}>
                      {affiliate.name} ({affiliate.id})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="position"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Position</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select position" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="left">Left</SelectItem>
                  <SelectItem value="right">Right</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end pt-4">
          <Button type="submit">Update Placement</Button>
        </div>
      </form>
    </Form>
  );
};

export default PlacementAffiliateForm;
