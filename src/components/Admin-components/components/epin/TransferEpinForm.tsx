
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
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
  epinId: z.string().min(1, 'E-Pin is required'),
  recipient: z.string().min(1, 'Recipient is required'),
  note: z.string().optional(),
});

interface TransferEpinFormProps {
  onSubmit: (data: any) => void;
}

const TransferEpinForm = ({ onSubmit }: TransferEpinFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      epinId: '',
      recipient: '',
      note: '',
    },
  });

  const handleSubmit = (data: z.infer<typeof formSchema>) => {
    onSubmit(data);
  };

  // Mock data 
  const availableEpins = [
    { id: 'EP12345', amount: '$100' },
    { id: 'EP12347', amount: '$200' },
    { id: 'EP12349', amount: '$500' },
  ];

  const recipients = [
    { id: 'AF001', name: 'John Doe' },
    { id: 'AF002', name: 'Alice Smith' },
    { id: 'AF003', name: 'Robert Johnson' },
    { id: 'AF004', name: 'Emily Davis' },
    { id: 'AF005', name: 'Michael Wilson' },
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 py-2">
        <FormField
          control={form.control}
          name="epinId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select E-Pin</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select E-Pin" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {availableEpins.map(epin => (
                    <SelectItem key={epin.id} value={epin.id}>
                      {epin.id} - {epin.amount}
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
          name="recipient"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Transfer To</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select recipient" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {recipients.map(recipient => (
                    <SelectItem key={recipient.id} value={recipient.id}>
                      {recipient.name} ({recipient.id})
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
          name="note"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Note (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="Add a note about this transfer" {...field} />
              </FormControl>
              <FormDescription>
                This note will be visible to the recipient
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end pt-4">
          <Button type="submit">Transfer E-Pin</Button>
        </div>
      </form>
    </Form>
  );
};

export default TransferEpinForm;
